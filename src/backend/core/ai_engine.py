import os
import pandas as pd
import logging

logger = logging.getLogger(__name__)

# Try the new SDK first, fall back to the legacy one
try:
    from google import genai as new_genai
    _USE_NEW_SDK = True
except ImportError:
    _USE_NEW_SDK = False

try:
    import google.generativeai as genai_legacy
    _USE_LEGACY_SDK = True
except ImportError:
    _USE_LEGACY_SDK = False


class AIEngine:
    """
    Handles interactions with the Google Gemini API to analyze datasets.
    Supports both google-genai (new) and google-generativeai (legacy) SDKs.
    """

    @staticmethod
    def _get_api_key() -> str | None:
        return os.getenv('GEMINI_API_KEY')

    @staticmethod
    def _get_dataset_context(df: pd.DataFrame) -> str:
        """
        Extracts schema and sample data to provide context to the LLM.
        Uses to_string() to avoid requiring the 'tabulate' package.
        """
        schema_lines = []
        for col in df.columns:
            missing = int(df[col].isna().sum())
            schema_lines.append(f"  - {col} (dtype: {df[col].dtype}, missing: {missing})")
        schema_str = "\n".join(schema_lines)

        # Use to_string() – never requires tabulate
        sample_str = df.head(5).to_string(index=False)

        # Summary stats for numeric columns only
        numeric_df = df.select_dtypes(include='number')
        if not numeric_df.empty:
            stats_str = numeric_df.describe().round(2).to_string()
        else:
            stats_str = "No numeric columns."

        return f"""
Dataset Columns ({len(df.columns)} total, {len(df)} rows):
{schema_str}

Sample Data (first 5 rows):
{sample_str}

Summary Statistics (numeric columns):
{stats_str}
"""

    @staticmethod
    def generate_insight(df: pd.DataFrame, query: str) -> str:
        """
        Sends dataset context + user query to Gemini and returns the answer.
        """
        api_key = AIEngine._get_api_key()
        if not api_key:
            return "Error: GEMINI_API_KEY is not configured on the server. Please set it in your .env file."

        context = AIEngine._get_dataset_context(df)

        system_instruction = (
            "You are InsightIQ, an expert AI Business Analyst. "
            "Answer the user's question based ONLY on the provided dataset context. "
            "Format your response with Markdown (bold key numbers, use bullet lists and tables where helpful). "
            "Be concise, insightful, and actionable."
        )

        prompt = f"""{system_instruction}

---
DATASET CONTEXT:
{context}
---

USER QUESTION:
{query}
"""

        # ── Try new google-genai SDK ──────────────────────────────
        if _USE_NEW_SDK:
            try:
                client = new_genai.Client(api_key=api_key)
                response = client.models.generate_content(
                    model='gemini-2.0-flash',
                    contents=prompt,
                )
                return response.text
            except Exception as e:
                logger.warning(f"New SDK failed: {e}. Trying legacy…")

        # ── Fall back to legacy google-generativeai SDK ───────────
        if _USE_LEGACY_SDK:
            try:
                genai_legacy.configure(api_key=api_key)
                # Try models in order of preference (confirmed available)
                for model_name in ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite']:
                    try:
                        model = genai_legacy.GenerativeModel(model_name)
                        response = model.generate_content(prompt)
                        return response.text
                    except Exception as model_err:
                        if '404' in str(model_err) or 'not found' in str(model_err).lower():
                            continue  # try next model
                        raise model_err
                return "Error: No supported Gemini model found. Please check your API key and region access."
            except Exception as e:
                logger.error(f"Legacy SDK also failed: {e}")
                return f"Sorry, I encountered an error while calling the Gemini API: {str(e)}"

        return "Error: No compatible Gemini SDK is installed. Run `pip install google-genai`."
