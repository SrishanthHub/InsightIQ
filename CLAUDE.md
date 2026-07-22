# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Vision
This project is InsightIQ, an AI-powered Business Intelligence platform that enables users to upload data, ask questions in natural language, generate automated insights, create dashboards, and build predictive models. The platform prioritizes scalability, security, and usability while leveraging modern AI/ML techniques for data analysis.

## Coding Standards
- **Languages**: 
  - Backend: Python 3.11+ (use type hints, follow PEP 8)
  - Frontend: TypeScript 5.0+ (strict mode, no `any` without justification)
- **Formatting**: 
  - Backend: Use Black (line length 88) and Ruff for linting
  - Frontend: Use Prettier with 2-space indentation, single quotes, trailing commas
  - Use pre-commit hooks to enforce formatting
- **Linting**: 
  - Backend: Ruff with PEP 8 and security plugins
  - Frontend: ESLint with Airbnb base configuration, plus plugins for React and complexity
- **Type Safety**: 
  - Python: Use type hints for all public functions, enable mypy in CI
  - TypeScript: Strict TypeScript enforcement (no `any` without explicit justification)
- **Comments**: 
  - Python: Use docstrings for all public APIs (PEP 257)
  - TypeScript: JSDoc for all public APIs, meaningful comments for complex logic
- **File Size**: Keep files under 300 lines; split concerns into modules
- **Function Size**: Functions should not exceed 50 lines; prefer small, pure functions
- **Naming**: 
  - Python: snake_case for variables and functions, PascalCase for classes, UPPER_SNAKE_CASE for constants
  - TypeScript: camelCase for variables and functions, PascalCase for classes and interfaces, UPPER_SNAKE_CASE for constants
  - Files: kebab-case (e.g., `user-service.ts`, `data_processor.py`)
- **Imports**: 
  - Python: Group imports (standard library, third-party, local); alphabetize within groups
  - TypeScript: Group imports (external, internal, relative); alphabetize within groups
- **Constants**: UPPER_SNAKE_CASE for true constants; otherwise follow language conventions
- **Error Handling**: Never ignore errors; always handle or propagate appropriately
- **Security**: No hardcoded secrets; use environment variables; validate all inputs
- **Testing**: Write tests alongside features; aim for 80%+ coverage on critical paths

## Architecture Rules
- **Separation of Concerns**: Strict separation between API, business logic, data access, and infrastructure layers
- **Dependency Injection**: Use dependency injection containers (e.g., FastAPI's Depends) for managing dependencies; avoid singleton anti-patterns
- **Immutability**: Prefer immutable data structures; use libraries like Immer (frontend) or frozen dataclasses (backend) when needed
- **Async/Aware**: All I/O operations must be asynchronous; avoid blocking the event loop (use async/await in Python, async/await in TypeScript)
- **Modularity**: Features should be self-contained modules with clear interfaces (domain-driven design)
- **Scalability**: Design for horizontal scaling; avoid in-memory state that doesn't distribute (use Redis for shared state)
- **Observability**: Built-in logging, metrics, and tracing for all critical paths (use OpenTelemetry, Prometheus, Grafana)
- **API Contracts**: Define clear contracts between services; use OpenAPI/Swagger for REST APIs
- **Configuration**: Externalize all configuration; use structured config objects with validation (Pydantic for backend, Zod for frontend)
- **Error Boundaries**: Implement error boundaries at layer boundaries to prevent cascade failures (React error boundaries for frontend, middleware for backend)

## Folder Structure
Based on the blueprint, the repository follows this structure:
```
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
│   │   │   │   ├── store/             # State management (Zustand/Redux Toolkit)
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
├── README.md                    # Project overview
└── SECURITY.md                  # Security policy
```

## Naming Conventions
- **Files**: kebab-case (e.g., `user-service.ts`, `data_processor.py`)
- **Classes**: 
  - Python: PascalCase (e.g., `UserService`)
  - TypeScript: PascalCase (e.g., `UserService`)
- **Functions/Methods**: 
  - Python: snake_case (e.g., `get_user_by_id`)
  - TypeScript: camelCase (e.g., `getUserById`)
- **Variables**: 
  - Python: snake_case (e.g., `user_count`)
  - TypeScript: camelCase (e.g., `userCount`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)
- **Types/Interfaces**: 
  - Python: PascalCase (e.g., `UserProfile`) - using TypedDict or dataclasses
  - TypeScript: PascalCase (e.g., `UserProfile`)
- **Enum Members**: UPPER_SNAKE_CASE (e.g., `USER_STATUS.ACTIVE`)
- **Environment Variables**: UPPER_SNAKE_CASE prefixed with service name (e.g., `BACKEND_API_KEY`)
- **CSS Classes**: kebab-case (e.g., `.button-primary`)
- **Events**: camelCase with descriptive names (e.g., `userCreated`)
- **API Endpoints**: kebab-case, plural nouns (e.g., `/api/users`)
- **Database Tables**: snake_case, plural nouns (e.g., `user_profiles`)
- **Database Columns**: snake_case (e.g., `created_at`)

## State Management Rules (Frontend)
- **Global State**: Use centralized store (Zustand or Redux Toolkit) only for truly global state (auth, theme, notifications)
- **Local State**: Prefer React Context or component state for UI-local state
- **Immutability**: Treat state as immutable; use immer or immutable.js patterns
- **Selectors**: Create memoized selectors for derived data (reselect for Redux, built-in for Zustand)
- **Updates**: Normalize state shape; avoid deep nesting
- **Persistence**: Only persist state when explicitly required (use middleware)
- **Async Actions**: Handle loading/error states explicitly in state
- **Testing**: Unit test reducers and action creators; mock API calls
- **Debugging**: Enable Redux DevTools in development only (if using Redux)
- **Server State**: Use React Query/SWR for server state management; separate from UI state

## API Design Rules (Backend)
- **RESTful Principles**: Use HTTP verbs correctly (GET for read, POST for create, etc.)
- **Resource Naming**: Use plural nouns for resources (e.g., `/users`, not `/user`)
- **Versioning**: Include version in URL (e.g., `/api/v1/users`)
- **Response Format**: Consistent JSON structure: `{ status, data?, message? }`
- **Status Codes**: Use appropriate HTTP status codes (200, 201, 400, 401, 403, 404, 422, 500)
- **Pagination**: Implement cursor-based pagination for large datasets
- **Filtering/Sorting**: Support query parameters for filtering and sorting
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Validation**: Validate all inputs at the API boundary; return 422 for validation errors
- **Authentication**: Use JWT tokens in Authorization header; refresh token rotation
- **Documentation**: Auto-generate OpenAPI specs; keep documentation updated
- **Error Responses**: Standardized error format: `{ status: "error", message: "Error description", code: "ERROR_CODE" }`
- **CORS**: Configure appropriately for frontend domains
- **Security Headers**: Implement Helmet.js equivalent or FastAPI middleware for security headers

## Error Handling Standards
- **Types**: Distinguish between operational errors (predictable) and programmer errors (bugs)
- **Logging**: 
  - Always log errors with stack traces in development
  - In production, log error metadata without sensitive data
  - Use structured logging (JSON) for easier parsing
  - Different levels: debug, info, warn, error, fatal
- **User-Facing**: Never expose stack traces or internal details to users
- **Recovery**: Implement retry mechanisms with exponential backoff for transient failures
- **Circuit Breaker**: Use circuit breaker pattern for external service calls
- **Fallbacks**: Provide graceful degradation when non-critical services fail
- **Error Boundaries**: In React, use error boundaries to catch UI errors
- **Async Errors**: Always catch promise rejections; use try/catch for async/await
- **Validation Errors**: Return detailed field-level validation errors
- **Monitoring**: Integrate with error tracking service (Sentry, etc.)
- **Alerting**: Set up alerts for critical error rates
- **Handling**: 
  - At boundaries: log and convert to appropriate HTTP response
  - In services: throw typed errors that can be caught upstream
  - Never use empty catch blocks

## Gemini Integration Guidelines
- **Model Selection**: 
  - Use Gemini Pro for text generation, reasoning (where applicable in NLP pipeline)
  - Use Gemini Pro Vision for multimodal inputs (if implemented)
  - Use Gemini Embedding for semantic search (if implemented)
- **API Calls**: 
  - Always use official Google AI SDK
  - Implement proper error handling for API quotas and rate limits
  - Cache responses when appropriate (with TTL)
  - Use streaming for long responses to improve UX
- **Prompt Engineering**:
  - Keep prompts concise and focused
  - Use few-shot examples for complex tasks
  - Validate and sanitize user inputs before including in prompts
  - Implement prompt templating to avoid injection attacks
  - Test prompts extensively with edge cases
- **Security**:
  - Never expose API keys in client-side code
  - Use environment variables for API keys with strict rotation policies
  - Implement request signing if required by Google
  - Validate and sanitize all outputs from Gemini to prevent XSS
- **Performance**:
  - Batch requests when possible
  - Implement response caching for repetitive queries
  - Use appropriate temperature settings (lower for factual, higher for creative)
  - Set reasonable timeout values (10-30s)
- **Quality Assurance**:
  - Implement output validation schemas (Zod/Pydantic)
  - Add human-in-the-loop review for critical outputs
  - Monitor for hallucinations and factual inconsistencies
  - Implement feedback mechanisms to improve prompts over time
- **Cost Management**:
  - Track token usage per request
  - Implement usage alerts and limits
  - Optimize prompts to reduce token count
  - Consider model distillation for high-volume simple tasks

## Security Rules
- **Authentication**: 
  - Implement OAuth 2.0/OpenID Connect where applicable
  - Use strong password hashing (bcrypt/scrypt with appropriate rounds)
  - Implement multi-factor authentication for sensitive operations
  - Use short-lived access tokens with refresh token rotation
- **Authorization**: 
  - Implement role-based access control (RBAC)
  - Principle of least privilege for all endpoints
  - Regularly audit permissions and roles
- **Data Protection**:
  - Encrypt sensitive data at rest (AES-256)
  - Use TLS 1.3 for all data in transit
  - Implement field-level encryption for PII
  - Regularly rotate encryption keys
- **Input Validation**:
  - Validate all inputs on server-side (never trust client)
  - Use allowlists over blocklists for validation
  - Implement CSRF tokens for state-changing operations
  - Sanitize inputs to prevent injection (SQL, NoSQL, XSS)
- **Dependency Security**:
  - Use npm audit or pip-audit for vulnerability scanning
  - Lock dependency versions with package-lock.json and requirements.txt
  - Implement automated dependency updates with testing
  - Monitor for known vulnerabilities in transitive dependencies
- **Logging & Monitoring**:
  - Never log sensitive data (passwords, tokens, PII)
  - Implement audit trails for critical operations
  - Set up intrusion detection and prevention systems
  - Regularly review logs for suspicious activity
- **Secrets Management**:
  - Use environment variables or secret managers (AWS Secrets Manager, HashiCorp Vault)
  - Never commit secrets to version control
  - Implement secret rotation procedures
- **Testing**:
  - Conduct regular penetration testing
  - Implement security unit tests for authentication/authorization
  - Use dependency checking in CI/CD pipeline
  - Perform regular security audits

## Performance Guidelines
- **Frontend**:
  - Implement code splitting and lazy loading
  - Optimize bundle size (target <2MB gzipped for initial load)
  - Use React.memo, useCallback, useMemo appropriately
  - Virtualize long lists (react-window, etc.)
  - Optimize images (modern formats, proper sizing, lazy loading)
  - Minimize DOM manipulations and reflows
  - Use requestAnimationFrame for animations
  - Implement caching strategies (service workers, HTTP caching)
- **Backend**:
  - Implement efficient database indexing
  - Use connection pooling for databases
  - Implement query caching where appropriate
  - Use pagination for large dataset queries
  - Optimize serialization/deserialization (avoid JSON.stringify/parse in hot paths)
  - Implement gzip compression for responses
  - Use CDN for static assets
  - Monitor and optimize N+1 query problems
- **Database**:
  - Use appropriate indexing strategies
  - Implement read replicas for read-heavy workloads
  - Consider caching layers (Redis) for frequent queries
  - Optimize queries with EXPLAIN/ANALYZE
  - Implement connection timeouts and pool sizing
- **Network**:
  - Minimize HTTP requests (bundle assets, use HTTP/2)
  - Implement efficient API pagination
  - Use WebSockets for real-time updates where appropriate
  - Implement request deduplication
  - Use edge computing for geographically distributed users
- **Monitoring**:
  - Implement performance monitoring (Lighthouse, Web Vitals)
  - Set up APM (Application Performance Monitoring)
  - Monitor key metrics: latency, throughput, error rates
  - Implement budget alerts for performance degradation
  - Regularly profile and benchmark critical paths

## Testing Strategy
- **Unit Testing**:
  - Test individual functions and components in isolation
  - Aim for 80%+ coverage on critical paths
  - Use pytest for Python backend, Vitest/Jest for TypeScript frontend
  - Use React Testing Library for frontend components
  - Mock external dependencies (APIs, databases, file system)
  - Test edge cases and error conditions
  - Use snapshot testing cautiously (only for stable UI)
- **Integration Testing**:
  - Test interactions between modules/services
  - Use test doubles for external services
  - Test database interactions with testcontainers or in-memory databases
  - Validate API contracts and data flow
  - Test authentication and authorization flows
- **End-to-End Testing**:
  - Test critical user journeys from UI to database
  - Use Cypress or Playwright for browser automation
  - Test in environments that closely resemble production
  - Test responsive design across device sizes
  - Implement visual regression testing where appropriate
- **Performance Testing**:
  - Load test APIs with k6 or similar tools
  - Test frontend performance with Lighthouse CI
  - Identify and fix performance bottlenecks
  - Test under various network conditions
- **Security Testing**:
  - Conduct regular dependency scanning
  - Perform static application security testing (SAST)
  - Implement dynamic application security testing (DAST) in staging
  - Test for common vulnerabilities (OWASP Top 10)
- **AI-Specific Testing**:
  - Test prompt robustness with adversarial examples
  - Validate model outputs against expected schemas
  - Test for bias and fairness in model responses
  - Validate safety filters and content moderation
  - Test cost and latency under various loads
- **Testing Practices**:
  - Write tests before or alongside implementation (TDD/BDD)
  - Run tests on every pull request
  - Maintain fast test suite (<5 minutes for unit tests)
  - Use test coverage as a guide, not a goal
  - Test in CI/CD pipeline with parallel execution
  - Regularly review and update tests as requirements change

## Development Workflow
- **Branching Model**:
  - Main branch: `main` (production-ready)
  - Development branch: `develop` (integration branch)
  - Feature branches: `feature/short-description`
  - Bug fix branches: `bugfix/issue-number-description`
  - Release branches: `release/vX.Y.Z`
  - Hotfix branches: `hotfix/issue-number-description`
- **Commit Messages**:
  - Use conventional commits: `type(scope): description`
  - Types: feat, fix, docs, style, refactor, perf, test, chore, ci
  - Scope: optional, indicates affected area
  - Description: imperative mood, max 50 chars
  - Body: optional, explains why and what
- **Pull Requests**:
  - Require PRs for all changes to main/develop
  - Minimum 1 approving review
  - Pass all CI checks before merging
  - Delete branch after merge
  - Squash commits for feature branches
  - Use PR template for consistency
- **Code Review**:
  - Check for adherence to coding standards
  - Verify functionality matches requirements
  - Look for potential bugs and edge cases
  - Review for performance implications
  - Check for security vulnerabilities
  - Ensure tests are adequate and pass
  - Verify documentation is updated if needed
- **Continuous Integration**:
  - Run on every push to any branch
  - Steps: lint, type check, unit tests, build
  - For PRs to main/develop: add integration tests
  - Use caching to speed up builds
  - Fail fast on critical issues
- **Continuous Deployment**:
  - Auto-deploy to staging on merge to develop
  - Manual approval required for production deployment
  - Use blue/green or canary deployments
  - Implement rollback procedures
  - Monitor key metrics post-deployment
- **Release Process**:
  - Use semantic versioning (MAJOR.MINOR.PATCH)
  - Create release branch from develop
  - Bump version and update changelog
  - QA on release branch
  - Merge to main and tag
  - Deploy to production
  - Merge back to develop
- **Issue Tracking**:
  - Use descriptive titles and detailed descriptions
  - Label by type (bug, feature, enhancement) and priority
  - Reference issue numbers in commits and PRs
  - Close issues via PRs when resolved
- **Documentation**:
  - Keep README updated with setup instructions
  - Document API changes in release notes
  - Maintain architecture decision records (ADRs)
  - Update CLAUDE.md as practices evolve
  - Document complex business logic
- **Local Development**:
  - Provide setup scripts for quick onboarding
  - Use environment-specific configuration files
  - Implement hot reload where possible
  - Use consistent development tooling (ESLint, Prettier, Black, Ruff)
  - Provide debugging guidelines