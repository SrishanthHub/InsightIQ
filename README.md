# InsightIQ - AI-Powered Business Intelligence Platform

An AI-powered Business Intelligence platform that enables users to upload data, ask questions in natural language, generate automated insights, create dashboards, and build predictive models.

## 🚀 Features

- **Data Ingestion**: Upload CSV, Excel, and connect to databases
- **Natural Language Interface**: Ask questions about your data in plain English
- **Automated Analytics**: Automatic EDA, statistical summaries, and insight generation
- **Dashboard Generation**: AI-powered dashboard creation from NL descriptions
- **Forecasting & Predictive Analytics**: Time series forecasting with multiple algorithms
- **Anomaly Detection**: Statistical and ML-based anomaly detection
- **Collaboration**: Real-time co-editing, commenting, and version history
- **Report Generation**: Professional PDF and PowerPoint reports

## 🏗️ Architecture

- **Backend**: Python 3.11+ with FastAPI
- **Frontend**: React 18+ with TypeScript 5.0+
- **Database**: PostgreSQL with Redis caching
- **ML/AI**: scikit-learn, TensorFlow/PyTorch, Hugging Face Transformers
- **DevOps**: Docker, GitHub Actions, Kubernetes ready

## 🛠️ Technology Stack

### Backend
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **ML/AI**: 
  - NLP: spaCy, Hugging Face Transformers
  - ML: scikit-learn, XGBoost, LightGBM
  - Deep Learning: PyTorch/TensorFlow
  - Time Series: statsmodels, Prophet
  - Model Serving: MLflow/BentoML

### Frontend
- **Language**: TypeScript 5.0+
- **Framework**: React 18+ with React Router v6
- **State Management**: Zustand or Redux Toolkit
- **UI Library**: Ant Design or Material-UI
- **Data Visualization**: Recharts (D3-based), D3.js for custom viz
- **Build Tool**: Vite 4+
- **Styling**: Tailwind CSS or CSS-in-JS

## 📁 Project Structure

```
insightiq/
├── .github/                     # GitHub workflows and templates
├── .claude/                     # Claude Code configuration
├── docs/                        # Documentation
├── src/                         # Source code
│   ├── backend/                 # Backend services (Python/FastAPI)
│   │   ├── api/                 # REST API endpoints
│   │   ├── core/                # Core business logic
│   │   │   ├── auth/            # Authentication and authorization
│   │   │   ├── data/            # Data processing and management
│   │   │   ├── ml/              # Machine learning services
│   │   │   ├── nlp/             # Natural language processing
│   │   │   ├── reporting/       # Report generation
│   │   │   └── utils/           # Utility functions
│   │   ├── models/              # Database models (SQLAlchemy)
│   │   ├── schemas/             # Pydantic schemas for validation
│   │   ├── tasks/               # Celery tasks for background processing
│   │   └── main.py              # Application entry point
│   ├── frontend/                # Frontend application (React/TypeScript)
│   │   ├── public/              # Static assets
│   │   ├── src/                 # React source code
│   │   │   ├── components/      # Reusable UI components
│   │   │   │   ├── charts/      # Charting components (Recharts/D3)
│   │   │   │   ├── layout/      # Layout components (header, sidebar)
│   │   │   │   ├── forms/       # Form components
│   │   │   │   ├── widgets/     # Dashboard widgets
│   │   │   │   └── modals/      # Modal dialogs
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── pages/           # Page components (routes)
│   │   │   ├── services/        # API service clients
│   │   │   │   └── store/       # State management (Zustand/Redux Toolkit)
│   │   │   ├── styles/          # CSS/Tailwind styles
│   │   │   ├── utils/           # Utility functions
│   │   │   └── App.tsx          # Root component
│   │   └── tests/               # Frontend tests (Jest, React Testing Library)
│   ├── ml-models/               # Pre-trained and custom ML models
│   ├── infra/                   # Infrastructure as code
│   └── shared/                  # Shared code between frontend/backend
│       ├── types/               # TypeScript type definitions
│       └── constants/           # Application constants
├── tests/                       # Test suite
├── scripts/                     # Utility scripts
├── configs/                     # Configuration files
├── data/                        # Data directory (sample datasets, temp files)
├── requirements.txt             # Python dependencies
├── package.json                 # Node.js dependencies
├── Dockerfile                   # Containerization
├── docker-compose.yml           # Local development environment
└── SECURITY.md                  # Security policy
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- Python >= 3.11
- Docker & Docker Compose
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd insightiq
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Start the development environment:
```bash
docker-compose up
```

## 📚 Documentation

- [API Documentation](./docs/api/)
- [Architecture Overview](./docs/architecture/)
- [User Guides](./docs/user-guides/)
- [Contributing Guidelines](./docs/contrib/)

## 🧪 Testing

Run backend tests:
```bash
pytest
```

Run frontend tests:
```bash
npm test
```

Run all tests:
```bash
npm run test:all
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.