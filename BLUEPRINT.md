# InsightIQ: AI Business Intelligence Platform - Technical Blueprint

## 1. Functional Requirements

### Core Functionality
- **Data Ingestion**: 
  - Upload CSV, Excel (.xlsx, .xls), and support for Google Sheets via API
  - Validate data schema, data types, and handle missing values
  - Support for large files (up to 1GB) with chunked processing
  - Metadata extraction (column names, data types, row counts, sample data)

- **Natural Language Interface**:
  - Conversational AI for data exploration (ask questions like "Show sales trends by region")
  - Context-aware query understanding with disambiguation
  - Support for follow-up questions and iterative analysis
  - Multi-language support (initially English, extensible)

- **Automated Analytics**:
  - Automatic exploratory data analysis (EDA) on upload
  - Statistical summaries, distributions, correlations
  - Outlier detection and data quality scoring
  - Suggested visualizations based on data types

- **Dashboard Generation**:
  - AI-powered dashboard creation from natural language descriptions
  - Drag-and-drop dashboard builder with pre-built components
  - Responsive layouts that adapt to screen size
  - Save, share, and schedule dashboard exports

- **Insight Generation**:
  - Automated insight detection (trends, anomalies, correlations, segments)
  - Business-focused explanations (e.g., "Sales increased 15% in Q3 due to...")
  - Confidence scores and supporting evidence for insights
  - Root cause analysis suggestions

- **Forecasting & Predictive Analytics**:
  - Time series forecasting (2, Prophet, LSTM options)
  - Regression and prescriptive analytics (What-ifics (ARIMA, exponential smoothing, ML models)
  - Scenario planning and what-if analysis
  - Forecast accuracy metrics and confidence intervals
  - Custom model training and deployment

- **Anomaly Detection**:
  - Unsupervised anomaly detection (Isolation Forest, Autoencoders)
  - Rule-based anomaly detection for known patterns
  - Real-time anomaly alerts for streaming data
  - Anomaly explanation and severity scoring

- **Reporting & Export**:
  - Professional report generation (PDF, PowerPoint)
  - Scheduled report delivery via email
  - Customizable report templates
  - Export visualizations as PNG, SVG, or interactive HTML

### User Management & Collaboration
- **Authentication & Authorization**:
  - Secure user authentication (email/password, SSO via SAML/OIDC)
  - Role-based access control (Admin, Analyst, Viewer)
  - Team and organization management
  - Audit trails for data access and changes

- **Collaboration Features**:
  - Real-time co-editing of dashboards and reports
  - Commenting and annotation on visualizations
  - Version history for datasets and analyses
  - Sharing via secure links with expiration

### Data Management
- **Dataset Catalog**:
  - Searchable dataset library with tags and descriptions
  - Data lineage tracking (source, transformations, usage)
  - Dataset certification and quality ratings
  - Data dictionary and glossary management

- **Data Preparation**:
  - Visual data wrangling interface (filter, pivot, merge, clean)
  - Custom SQL queries for advanced users
  - Calculated fields and derived metrics
  - Data sampling for large datasets

## 2. Non-Functional Requirements

### Performance
- **Response Times**:
  - Data upload and initial analysis: < 5 seconds for files < 100MB
  - Natural language query response: < 3 seconds for cached results
  - Dashboard rendering: < 2 seconds for initial load
  - Report generation: < 10 seconds for standard reports

- **Scalability**:
  - Horizontal scaling for concurrent users (target: 1000+ simultaneous users)
  - Auto-scaling based on workload (CPU, memory, queue depth)
  - Efficient resource utilization for ML model inference
  - Database connection pooling and query optimization

### Reliability & Availability
- **Uptime**: 99.9% monthly SLA
- **Fault Tolerance**:
  - Multi-region deployment for disaster recovery
  - Automated failover for critical services
  - Data backup and point-in-time recovery
  - Circuit breaker pattern for external dependencies

### Security
- **Data Protection**:
  - Encryption at rest (AES-256) and in transit (TLS 1.3)
  - Field-level encryption for sensitive data (PII, financial)
  - Data masking and tokenization capabilities
  - Secure key management (HashiCorp Vault or cloud KMS)

- **Access Control**:
  - Principle of least privilege enforced
  - Session management with timeout and renewal
  - OAuth 2.0 and OpenID Connect compliance
  - Regular security scanning and penetration testing

### Maintainability & Extensibility
- **Code Quality**:
  - Modular architecture with clear separation of concerns
  - Comprehensive unit, integration, and end-to-end tests (>80% coverage)
  - Documentation for APIs and internal modules
  - CI/CD pipeline with automated testing and deployment

- **Extensibility**:
  - Plugin architecture for custom visualizations and connectors
  - API-first design for third-party integrations
  - Configurable ML model registry
  - Support for custom data sources via JDBC/ODBC

### Usability
- **Accessibility**:
  - WCAG 2.1 AA compliance
  - Keyboard navigation and screen reader support
  - High contrast mode and adjustable font sizes
  - Color-blind friendly palettes

- **User Experience**:
  - Intuitive onboarding with guided tours
  - Contextual help and tooltips
  - Consistent design system across all interfaces
  - Mobile-responsive design for tablet access

## 3. User Personas

### Primary Personas

#### 1. Business Analyst (Sarah)
- **Role**: Mid-level analyst in marketing or operations
- **Goals**: 
  - Quickly understand dataset characteristics
  - Generate insights for stakeholder presentations
  - Create recurring reports without IT dependency
  - Collaborate with team on data-driven decisions
- **Pain Points**:
  - Time-consuming manual data preparation
  - Difficulty explaining findings to non-technical stakeholders
  - Limited access to advanced analytics tools
- **Tech Savviness**: Comfortable with Excel and basic SQL, intimidated by code

#### 2. Data Scientist (Alex)
- **Role**: Senior data scientist in analytics team
- **Goals**:
  - Explore complex relationships in data
  - Build and validate predictive models
  - Share methodologies with less technical teammates
  - Automate repetitive analytical tasks
- **Pain Points**:
  - Spending too much time on data cleaning and setup
  - Difficulty communicating findings to business users
  - Lack of version control for analytical work
- **Tech Savviness**: Proficient in Python/R, experienced with ML frameworks

#### 3. Executive (Michael)
- **Role**: VP of Sales or Chief Operating Officer
- **Goals**:
  - Monitor key business metrics in real-time
  - Get proactive alerts about significant changes
  - Make data-driven decisions quickly
  - Understand root causes of performance shifts
- **Pain Points**:
  - Overwhelmed by raw data and complex reports
  - Needs actionable insights, not just charts
  - Limited time for deep data exploration
- **Tech Savviness**: Prefers visual dashboards and simple interactions

#### 4. Data Engineer (Taylor)
- **Role**: Responsible for data infrastructure and pipelines
- **Goals**:
  - Ensure data quality and reliability
  - Integrate new data sources efficiently
  - Monitor pipeline performance and health
  - Support self-service analytics for business users
- **Pain Points**:
  - Managing numerous ad-hoc data requests
  - Inconsistent data definitions across teams
  - Difficulty tracking data lineage and usage
- **Tech Savviness**: Expert in SQL, ETL tools, and cloud data platforms

### Secondary Personas
- **IT Administrator**: Manages deployment, security, and system health
- **Consultant**: Uses platform for client engagements with white-labeling needs
- **Student/Academic**: Learns data analysis concepts through guided exploration

## 4. User Stories

### Epic: Data Ingestion & Preparation
- As a Business Analyst, I want to upload CSV and Excel files so that I can analyze my department's data without IT help.
- As a Data Engineer, I want to connect to databases and cloud storage so that I can analyze live data sources.
- As a Business Analyst, I want the platform to automatically profile my data so that I can understand its quality and structure quickly.
- As a Data Scientist, I want to clean and transform data visually so that I can prepare it for analysis without writing code.

### Epic: Natural Language Analytics
- As a Business Analyst, I want to ask questions in plain English so that I can explore data without learning complex query languages.
- As an Executive, I want to get instant answers to ad-hoc questions so that I can make quick decisions in meetings.
- As a Data Scientist, I want to refine my natural language queries with follow-ups so that I can dive deeper into specific aspects.
- As a Business Analyst, I want the AI to suggest relevant questions based on my data so that I can discover insights I might have missed.

### Epic: Automated Insights & Dashboards
- As a Business Analyst, I want the platform to generate automatic insights so that I can quickly identify important patterns in my data.
- As an Executive, I want AI-generated dashboards so that I can get a business overview without manual setup.
- As a Data Analyst, I want to customize AI-generated dashboards so that I can tailor them to specific audiences.
- As a Business Analyst, I want to save and schedule dashboard exports so that I can share regular updates with my team.

### Epic: Advanced Analytics
- As a Data Scientist, I want to build forecasting models so that I can predict future trends and plan accordingly.
- As an Operations Manager, I want anomaly detection alerts so that I can respond quickly to unusual events.
- As a Marketing Analyst, I want to perform cohort analysis so that I can understand customer behavior over time.
- As a Financial Analyst, I want to run what-if scenarios so that I can evaluate the impact of different decisions.

### Epic: Collaboration & Sharing
- As a Team Lead, I want to comment on dashboards so that I can discuss findings with my team asynchronously.
- As a Business Analyst, I want to share analysis via secure links so that I can get feedback from stakeholders.
- As a Data Scientist, I want to version my analyses so that I can track changes and reproduce results.
- As an Executive, I want to receive automated reports via email so that I stay informed without logging in.

### Epic: Administration & Security
- As an IT Administrator, I want to manage user roles and permissions so that I can ensure data security and compliance.
- As an IT Administrator, I want to monitor system performance and usage so that I can optimize resource allocation.
- As a Compliance Officer, I want audit logs of data access so that I can demonstrate regulatory compliance.
- As an IT Administrator, I want to configure data retention policies so that we manage storage costs effectively.

## 5. Feature List

### Core Features
1. **Multi-format Data Upload** (CSV, Excel, Google Sheets, Parquet)
2. **Automated Data Profiling** (schema, stats, quality scores)
3. **Natural Language Query Interface** (context-aware, conversational)
4. **AI-Powered Insight Generation** (trends, anomalies, correlations)
5. **Automatic Dashboard Creation** (from NL descriptions)
6. **Interactive Dashboard Builder** (drag-and-drop components)
7. **Time Series Forecasting** (multiple algorithms, confidence intervals)
8. **Anomaly Detection** (statistical and ML-based)
9. **Professional Report Export** (PDF, PPTX, scheduled delivery)
10. **Real-time Collaboration** (co-editing, commenting, versioning)
11. **Role-Based Access Control** (admin, analyst, viewer roles)
12. **Data Catalog & Lineage** (searchable dataset library)
13. **Visual Data Preparation** (filter, join, clean, calculate)
14. **Custom SQL Query Interface** (for advanced users)
15. **API Access** (RESTful API for programmatic interactions)
16. **White-labeling & Custom Branding** (for enterprise clients)
17. **Multi-tenancy** (secure isolation between customers/organizations)
18. **Mobile Responsive Design** (tablet and desktop support)
19. **Accessibility Compliance** (WCAG 2.1 AA)
20. **Comprehensive Audit Logging** (user actions, data access)

### Advanced Features (Phase 2+)
21. **Streaming Data Support** (Kafka, Kinesis integrations)
22. **Custom ML Model Training & Deployment** (bring your own models)
23. **Explainable AI (XAI)** for insights and predictions
24. **Natural Language Report Generation** (narrative summaries)
25. **Embedded Analytics** (iframe/web component for external apps)
26. **Data Marketplace** (internal sharing of certified datasets)
27. **Predictive Analytics Templates** (churn, forecasting, segmentation)
28. **Geospatial Analytics** (maps, location-based insights)
29. **Natural Language to SQL** (for database querying)
30. **A/B Test Analysis Framework**

## 6. Complete Folder Structure

```
insightiq/
├── .github/                     # GitHub workflows and templates
│   ├── workflows/               # CI/CD pipelines
│   └── ISSUE_TEMPLATE/          # Issue templates
├── .claude/                     # Claude Code configuration
│   ├── settings.json            # Permissions, hooks, etc.
│   ├── keybindings.json         # Custom keyboard shortcuts
│   └── agents/                  # Custom agent definitions
├── docs/                        # Documentation
│   ├── api/                     # API reference
│   ├── architecture/            # Architecture diagrams and docs
│   ├── user-guides/             # End-user documentation
│   └── contrib/                 # Contributor guidelines
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
│   │   │   │   ├── store/             # State management (Redux/Zustand)
│   │   │   ├── styles/          # CSS/Tailwind styles
│   │   │   ├── utils/           # Utility functions
│   │   │   └── App.js           # Root component
│   │   └── tests/               # Frontend tests (Jest, React Testing Library)
│   ├── ml-models/               # Pre-trained and custom ML models
│   │   ├── forecasting/         # Time series forecasting models
│   │   ├── anomaly-detection/   # Anomaly detection models
│   │   ├── nlp/                 # NLP models for query understanding
│   │   └── utils/               # ML utilities and preprocessing
│   ├── infra/                   # Infrastructure as code
│   │   ├── terraform/           # Terraform configurations
│   │   ├── kubernetes/          # Kubernetes manifests
│   │   └── docker/              # Dockerfiles and compose files
│   └── shared/                  # Shared code between frontend/backend
│       ├── types/               # TypeScript type definitions
│       └── constants/           # Application constants
├── tests/                       # Test suite
│   ├── unit/                    # Unit tests
│   │   ├── backend/             # Backend unit tests
│   │   └── frontend/            # Frontend unit tests
│   ├── integration/             # Integration tests
│   │   ├── api/                 # API integration tests
│   │   └── frontend/            # Frontend integration tests
│   └── e2e/                     # End-to-end tests (Cypress/Playwright)
├── scripts/                     # Utility scripts
│   ├── deployment/              # Deployment scripts
│   ├── data-processing/         # Data migration scripts
│   └── dev/                     # Development helper scripts
├── configs/                     # Configuration files
│   ├── environments/            # Environment-specific configs
│   │   ├── dev.yaml
│   │   ├── staging.yaml
│   │   └── prod.yaml
│   ├── logging/                 # Logging configurations
│   └── ml/                      # ML model configurations
├── data/                        # Data directory (sample datasets, temp files)
│   ├── samples/                 # Sample datasets for demo
│   ├── uploads/               # User uploaded files (managed by cleanup)│ └── # Cached processed data
│   └── exports/                 │ # Exported reports and visualizations
├── requirements.txt             # Python dependencies
├── package.json                 # Node.js dependencies
├── Dockerfile                   # Containerization
├── docker-compose.yml           # Local development environment
├── README.md                    # Project overview
├── CONTRIBUTING.md              # Contribution guidelines
├── LICENSE                      # Software license
└── SECURITY.md                  # Security policy
```

## 7. Technology Stack

### Backend
- **Language**: Python 3.11+
- **Framework**: FastAPI (for high-performance async APIs)
- **Database**:
  - Primary: PostgreSQL 15+ (for relational data, user management, metadata)
  - Cache: Redis 7+ (for session storage, query caching, temporary results)
  - Object Storage: Amazon S3 / MinIO (for file uploads, exports, model artifacts)
- **Message Queue**: RabbitMQ or Apache Kafka (for background tasks, event streaming)
- **ML/AI**:
  - NLP: spaCy, Hugging Face Transformers (for query understanding)
  - ML Libraries: scikit-learn, XGBoost, LightGBM (for traditional ML)
  - Deep Learning: PyTorch / TensorFlow (for deep learning models)
  - Time Series: statsmodels, Prophet, NeuralProphet (for forecasting)
  - Anomaly Detection: PyOD, scikit-learn
  - Model Serving: MLflow, BentoML, or TorchServe
- **Authentication**: OAuth2, OpenID Connect (via Auth0 or custom implementation)
- **API Documentation**: Swagger/OpenAPI (via FastAPI auto-generation)
- **Testing**: pytest, pytest-asyncio, factory-boy, faker
- **Code Quality**: Black, Ruff, mypy, pre-commit hooks

### Frontend
- **Language**: TypeScript 5.0+
- **Framework**: React 18+ with React Router v6
- **State Management**: Zustand or Redux Toolkit
- **UI Library**: Ant Design or Material-UI (MUI) for enterprise-grade components
- **Data Visualization**: 
  - Primary: Recharts (built on D3) for standard charts
  - Advanced: D3.js for custom visualizations
  - Geospatial: Leaflet or Mapbox GL JS
- **Build Tool**: Vite 4+ (for fast development and building)
- **Testing**: Jest, React Testing Library, Cypress for E2E
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Styling**: Tailwind CSS or CSS-in-JS (Emotion) for utility-first styling
- **Internationalization**: i18next for multi-language support

### DevOps & Infrastructure
- **Containerization**: Docker 24+
- **Orchestration**: Kubernetes (for production) or Docker Compose (for dev/staging)
- **CI/CD**: GitHub Actions (build, test, deploy pipelines)
- **Infrastructure as Code**: Terraform (for cloud provisioning)
- **Monitoring**: 
  - Metrics: Prometheus + Grafana
  - Logging: ELK Stack (Elasticsearch, Logstash, Kibana) or Loki
  - Tracing: Jaeger or OpenTelemetry
- **Cloud Providers**: AWS (preferred), Azure, or GCP (multi-cloud capable)
- **Service Mesh**: Istio or Linkerd (for advanced traffic management in K8s)
- **Secrets Management**: HashiCorp Vault or cloud-native secrets manager
- **Load Balancing**: NGINX or cloud load balancer (AWS ALB, etc.)
- **CDN**: CloudFront or Cloudflare (for static assets)

### Third-Party Integrations
- **Data Sources**: 
  - Databases: PostgreSQL, MySQL, SQL Server, Oracle, Snowflake, BigQuery
  - Cloud Storage: S3, Google Cloud Storage, Azure Blob
  - APIs: REST, GraphQL, SOAP (via connectors)
  - Streaming: Kafka, Kinesis, Pub/Sub
- **Authentication**: SAML, LDAP, Active Directory, Google Workspace, Azure AD
- **Communication**: Email (SendGrid, SES), Slack, Microsoft Teams
- **File Formats**: Apache Arrow (for efficient data transfer), Avro, Parquet

## 8. High-Level System Architecture

### Architectural Style
- **Microservices Architecture** with domain-driven design boundaries
- **Event-Driven** for asynchronous processing and loose coupling
- **API-First** approach for all internal and external interactions
- **Cloud-Native** design leveraging managed services where appropriate

### Core Components

#### 1. API Gateway
- **Technology**: NGINX Plus or AWS API Gateway
- **Responsibilities**:
  - Request routing and load balancing
  - SSL termination
  - Rate limiting and throttling
  - Request/response transformation
  - Authentication delegation

#### 2. Authentication Service
- **Technology**: Custom service using OAuth2/OIDC libraries
- **Responsibilities**:
  - User registration, login, logout
  - Token issuance and validation (JWT)
  - Role and permission management
  - Social login integrations (Google, Azure AD)
  - Session management

#### 3. Data Ingestion Service
- **Technology**: Python/FastAPI service
- **Responsibilities**:
  - File upload handling and validation
  - Metadata extraction and storage
  - Initial data profiling and quality scoring
  - Routing raw data to object storage
  - Publishing data available events

#### 4. Data Processing Service
- **Technology**: Python service with Pandas, Dask, or Polars
- **Responsibilities**:
  - Data cleaning and transformation
  - Feature engineering
  - Data aggregation and summarization
  - Preparing data for analysis services
  - Handling large datasets via chunking/streaming

#### 5. Natural Language Processing (NLP) Service
- **Technology**: Python service using spaCy/Hugging Face
- **Responsibilities**:
  - Query understanding and intent classification
  - Entity recognition (columns, filters, time periods)
  - Query disambiguation and clarification
  - Translation of NL to internal query representation
  - Follow-up context management

#### 6. Analytics Engine
- **Technology**: Python service with scientific libraries
- **Responsibilities**:
  - Statistical analysis and hypothesis testing
  - Correlation and regression analysis
  - Clustering and segmentation
  - Insight generation algorithms
  - Anomaly detection models

#### 7. Forecasting Service
- **Technology**: Python service with time series libraries
- **Responsibilities**:
  - Model selection and training (ARIMA, Prophet, LSTM)
  - Forecast generation with confidence intervals
  - Model evaluation and backtesting
  - Scenario planning and what-if analysis
  - Model versioning and A/B testing

#### 8. Dashboard Service
- **Technology**: Node.js or Python service
- **Responsibilities**:
  - Dashboard layout and component management
  - Widget rendering and data binding
  - Dashboard persistence and versioning
  - Real-time updates (via WebSocket)
  - Export to image/PDF formats

#### 9. Reporting Service
- **Technology**: Python service (WeasyPrint, ReportLab, or similar)
- **Responsibilities**:
  - PDF and PowerPoint report generation
  - Template management and customization
  - Scheduled report generation and delivery
  - Email integration for report distribution
  - Report versioning and archival

#### 10. Collaboration Service
- **Technology**: Node.js service with WebSocket support
- **Responsibilities**:
  - Real-time co-editing of dashboards
  - Commenting and annotation system
  - Notification service (in-app, email)
  - Version history and diff visualization
  - Access control for shared resources

#### 11. Catalog & Metadata Service
- **Technology**: Python/FastAPI service with PostgreSQL
- **Responsibilities**:
  - Dataset discovery and search
  - Data lineage tracking
  - Data quality metrics and certifications
  - Data dictionary and glossary
  - Usage analytics and popularity metrics

#### 12. ML Model Service
- **Technology**: Python service with MLflow/BentoML
- **Responsibilities**:
  - Model training and experiment tracking
  - Model registry and versioning
  - Model serving and inference APIs
  - A/B testing for model performance
  - Resource allocation for model training

#### 13. Notification Service
- **Technology**: Python service (using Celery/RabbitMQ)
- **Responsibilities**:
  - Email notifications (reports, alerts)
  - In-app notifications
  - Webhook integrations (Slack, Teams)
  - Alert routing and deduplication
  - Notification preferences management

### Data Flow
1. **Upload**: User uploads file → API Gateway → Data Ingestion Service → Object Storage + Metadata stored in PostgreSQL → Event published
2. **Processing**: Event triggers Data Processing Service → Processes data → Stores processed data (Parquet/Arrow) in object storage → Updates metadata
3. **Analysis**: User asks question via NL interface → API Gateway → NLP Service interprets → Routes to appropriate analytics service → Retrieves processed data → Performs analysis → Returns results
4. **Visualization**: Results sent to Frontend → Rendered via charting components → User can save as dashboard widget
5. **Insights**: Analytics Engine runs in background → Generates insights → Stores in database → Available via API for dashboard display
6. **Export**: User requests report → API Gateway → Reporting Service → Generates PDF/PPTX → Returns to user or sends via email

### Communication Patterns
- **Synchronous**: REST/GraphQL APIs for user interactions (query, upload, config)
- **Asynchronous**: Message queues (RabbitMQ/Kafka) for background tasks (processing, ML training, report generation)
- **Real-time**: WebSockets for collaboration features and live updates
- **Event-driven**: Internal services publish/subscribe to events (data uploaded, analysis complete, insight generated)

### Security Architecture
- **Defense in Depth**: Network security (VPC, security groups), application security (auth, input validation), data security (encryption, masking)
- **Zero Trust**: Verify every request regardless of origin
- **Data Isolation**: Tenant-level encryption keys and separate schemas/storage prefixes
- **Secure SDLC**: Regular dependency scanning, SAST/DAST, penetration testing

## 9. Development Roadmap (Phase-wise)

### Phase 0: Foundation (Weeks 1-4)
- **Goals**: Set up development environment, core infrastructure, basic authentication
- **Deliverables**:
  - Project repository with CI/CD pipeline
  - Docker Compose development environment
  - User authentication service (email/password)
  - Basic file upload and storage (CSV/Excel)
  - Initial data profiling service
  - REST API documentation
- **Tech Focus**: Backend setup, basic frontend project, infrastructure as code

### Phase 1: Core BI Functionality (Weeks 5-12)
- **Goals**: Enable basic data exploration and visualization
- **Deliverables**:
  - Natural language query interface (basic intent recognition)
  - Automatic chart generation based on data types
  - Interactive dashboard builder (drag-and-drop)
  - Data preparation wizard (filter, sort, aggregate)
  - User roles and permissions (Admin/Viewer)
  - Basic reporting (PDF export)
- **Tech Focus**: NLP integration, frontend charting library, state management

### Phase 2: Intelligent Analytics (Weeks 13-20)
- **Goals**: Add AI-powered insights and advanced analytics
- **Deliverables**:
  - Automated insight generation (trends, anomalies)
  - Time series forecasting (basic models)
  - Anomaly detection algorithms
  - Advanced data transformations (join, pivot)
  - Scheduled report generation and email delivery
  - Data catalog with search and tagging
- **Tech Focus**: ML model integration, background task processing, advanced visualizations

### Phase 3: Collaboration & Enterprise (Weeks 21-28)
- **Goals**: Enable team collaboration and enterprise features
- **Deliverables**:
  - Real-time co-editing of dashboards
  - Commenting and annotation system
  - SSO integration (SAML/OIDC)
  - Audit logging and compliance reporting
  - White-labeling capabilities
  - Performance optimization and caching
  - Mobile-responsive design
- **Tech Focus**: WebSocket implementation, enterprise auth protocols, performance tuning

### Phase 4: Advanced AI & Extensibility (Weeks 29-36)
- **Goals**: Enable custom ML models and extensibility
- **Deliverables**:
  - Custom ML model training and deployment interface
  - Explainable AI for insights and predictions
  - Plugin architecture for custom visualizations
  - API rate limiting and developer portal
  - Streaming data support (Kafka/Kinesis)
  - Geospatial analytics capabilities
  - A/B testing framework for models and UI
- **Tech Focus**: MLflow/BentoML integration, plugin system, streaming processors

### Phase 5: Scale & Optimize (Weeks 37-48)
- **Goals**: Prepare for enterprise-scale deployment
- **Deliverables**:
  - Multi-region deployment capability
  - Advanced monitoring and alerting
  - Cost optimization and resource governance
  - Comprehensive test suite (>90% coverage)
  - Performance benchmarking and tuning
  - Documentation and knowledge base
  - Security audit and penetration testing
- **Tech Focus**: Kubernetes optimization, chaos testing, observability

### Ongoing Activities
- **Every Sprint**: Bug fixes, technical debt reduction, user feedback incorporation
- **Quarterly**: Platform updates, new feature prioritization, architecture review
- **Continuous**: Security patches, dependency updates, performance monitoring

## 10. API Overview

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login (returns JWT)
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user profile
- `POST /api/v1/auth/sso/login` - SSO initiation (SAML/OIDC)

### User Management
- `GET /api/v1/users` - List users (admin only)
- `GET /api/v1/users/{id}` - Get user details
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Deactivate user
- `GET /api/v1/users/{id}/permissions` - Get user permissions
- `POST /api/v1/roles` - Create role (admin only)
- `GET /api/v1/roles` - List roles

### Data Management
- `POST /api/v1/datasets/upload` - Upload CSV/Excel file
- `GET /api/v1/datasets` - List user's datasets
- `GET /api/v1/datasets/{id}` - Get dataset details
- `DELETE /api/v1/datasets/{id}` - Delete dataset
- `GET /api/v1/datasets/{id}/profile` - Get data profile
- `GET /api/v1/datasets/{id}/sample` - Get data sample
- `POST /api/v1/datasets/{id}/query` - Execute SQL query on dataset query** (SQL or DSL)

### Natural Language Query
- `POST /api/v1/nlp/query` - Process natural language question
- `GET /api/v1/nlp/suggestions` - Get suggested questions for dataset
- `POST /api/v1/nlp/clarify` - Request clarification for ambiguous query

### Insights & Analytics
- `GET /api/v1/insights/{dataset_id}` - Get generated insights for dataset
- `POST /api/v1/insights/{dataset_id}/generate` - Trigger insight generation
- `GET /api/v1/analytics/statistics/{dataset_id}` - Get descriptive statistics
- `POST /api/v1/analytics/correlation/{dataset_id}` - Calculate correlation matrix
- `GET /api/v1/analytics/trends/{dataset_id}` - Detect trends in time series

### Forecasting
- `POST /api/v1/forecast/{dataset_id}` - Create forecasting model
- `GET /api/v1/forecast/{model_id}` - Get model details
- `POST /api/v1/forecast/{model_id}/predict` - Generate forecast
- `GET /api/v1/forecast/{model_id}/evaluate` - Get model performance metrics
- `DELETE /api/v1/forecast/{model_id}` - Delete forecasting model

### Anomaly Detection
- `POST /api/v1/anomaly-detect/{dataset_id}` - Run anomaly detection
- `GET /api/v1/anomaly-detect/{job_id}` - Get detection results
- `GET /api/v1/anomaly-detect/{dataset_id}/history` - Get past detections

### Dashboards
- `GET /api/v1/dashboards` - List user's dashboards
- `POST /api/v1/dashboards` - Create new dashboard
- `GET /api/v1/dashboards/{id}` - Get dashboard details
- `PUT /api/v1/dashboards/{id}` - Update dashboard
- `DELETE /api/v1/dashboards/{id}` - Delete dashboard
- `POST /api/v1/dashboards/{id}/widgets` - Add widget to dashboard
- `DELETE /api/v1/dashboards/{id}/widgets/{widget_id}` - Remove widget

### Reporting
- `POST /api/v1/reports/generate` - Generate report from dashboard/dataset
- `GET /api/v1/reports/{id}` - Get report status and download
- `POST /api/v1/reports/schedule` - Schedule recurring report
- `GET /api/v1/reports/scheduled` - List scheduled reports
- `DELETE /api/v1/reports/scheduled/{id}` - Delete scheduled report

### Collaboration
- `POST /api/v1/dashboards/{id}/share` - Share dashboard with user/link
- `GET /api/v1/dashboards/{id}/comments` - Get comments on dashboard
- `POST /api/v1/dashboards/{id}/comments` - Add comment to dashboard
- `PUT /api/v1/dashboards/{id}/comments/{comment_id}` - Update comment
- `DELETE /api/v1/dashboards/{id}/comments/{comment_id}` - Delete comment
- `POST /api/v1/dashboards/{id}/lock` - Lock dashboard for editing
- `DELETE /api/v1/dashboards/{id}/unlock` - Unlock dashboard

### Administration
- `GET /api/v1/admin/metrics` - Get system usage metrics
- `GET /api/v1/admin/logs` - Get audit logs (filtered)
- `POST /api/v1/admin/backup` - Trigger system backup
- `GET /api/v1/admin/health` - System health check
- `POST /api/v1/admin/maintenance` - Toggle maintenance mode

### WebSocket Endpoints
- `ws:///ws/dashboard/{id}` - Real-time dashboard collaboration
- `ws:///ws/notifications` - Real-time user notifications
- `ws:///ws/analysis/{dataset_id}` - Real-time analysis progress

### Common Response Formats
- **Success**: `{ "status": "success", "data": {...}, "message": "Optional message" }`
- **Error**: `{ "status": "error", "message": "Error description", "code": "ERROR_CODE" }`
- **Paginated**: `{ "status": "success", "data": {...}, "pagination": { "page": 1, "limit": 20, "total": 100, "pages": 5 } }`

## 11. Database Schema

### Core Tables

#### Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE
);
```

#### Organizations / Teams
```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settings JSONB DEFAULT '{}'
);

CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);
```

#### Datasets
```sql
CREATE TABLE datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255),
    file_size BIGINT,
    file_type VARCHAR(50), -- csv, excel, etc.
    storage_path VARCHAR(500), -- S3/object storage path
    status VARCHAR(50) DEFAULT 'uploaded', -- uploaded, processing, processed, failed
    row_count INTEGER,
    column_count INTEGER,
    quality_score DECIMAL(3,2), -- 0.00 to 1.00
    profile_data JSONB, -- automated profiling results
    tags TEXT[], -- array of tags
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_datasets_org ON datasets(organization_id);
CREATE INDEX idx_datasets_owner ON datasets(owner_id);
CREATE INDEX idx_datasets_status ON datasets(status);
```

#### Data Columns (Metadata)
```sql
CREATE TABLE dataset_columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    data_type VARCHAR(50), -- numeric, categorical, datetime, text, boolean
    semantic_type VARCHAR(100), -- e.g., email, url, phone, currency, etc.
    is_nullable BOOLEAN,
    unique_count INTEGER,
    null_count INTEGER,
    min_value TEXT,
    max_value TEXT,
    mean_value DECIMAL,
    std_dev DECIMAL,
    histogram JSONB, -- for numeric distributions
    top_values JSONB, -- for categorical data
    sample_values TEXT[], -- sample of actual values
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_dataset_columns_dataset ON dataset_columns(dataset_id);
```

#### Dashboards
```sql
CREATE TABLE dashboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    layout JSONB, -- dashboard layout configuration
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_dashboards_org ON dashboards(organization_id);
CREATE INDEX idx_dashboards_owner ON dashboards(owner_id);
```

#### Dashboard Widgets
```sql
CREATE TABLE dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dashboard_id UUID REFERENCES dashboards(id) ON DELETE CASCADE,
    widget_type VARCHAR(50), -- chart, table, text, image, etc.
    config JSONB, -- widget-specific configuration
    position_x INTEGER,
    position_y INTEGER,
    width INTEGER,
    height INTEGER,
    dataset_id UUID REFERENCES datasets(id) ON DELETE SET NULL,
    query_config JSONB, -- how data is fetched for this widget
    refresh_interval INTEGER, -- seconds, 0 for manual
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_dashboard_widgets_dashboard ON dashboard_widgets(dashboard_id);
```

#### Insights
```sql
CREATE TABLE insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
    insight_type VARCHAR(50), -- trend, anomaly, correlation, segment, etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(20), -- low, medium, high, critical
    confidence DECIMAL(3,2), -- 0.00 to 1.00
    supporting_data JSONB, -- evidence for the insight
    suggested_actions JSONB, -- recommended next steps
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_insights_dataset ON insights(dataset_id);
CREATE INDEX idx_insights_type ON insights(insight_type);
CREATE INDEX idx_insights_severity ON insights(severity);
```

#### Forecasting Models
```sql
CREATE TABLE forecasting_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    model_type VARCHAR(50), -- arima, prophet, lstm, etc.
    parameters JSONB, -- model hyperparameters
    training_data_config JSONB, -- what data was used for training
    performance_metrics JSONB, -- MAE, RMSE, MAPE, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_forecasting_models_dataset ON forecasting_models(dataset_id);
```

#### Forecasts
```sql
CREATE TABLE forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES forecasting_models(id) ON DELETE CASCADE,
    forecast_date DATE NOT NULL,
    predicted_value DECIMAL,
    lower_bound DECIMAL,
    upper_bound DECIMAL,
    actual_value DECIMAL, -- filled in when actual data arrives
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_forecasts_model_date ON forecasts(model_id, forecast_date);
```

#### Reports
```sql
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    report_type VARCHAR(50), -- pdf, pptx, email
    source_type VARCHAR(50), -- dashboard, dataset, insight
    source_id UUID, -- references dashboard, dataset, or insight
    parameters JSONB, -- report generation parameters
    file_path VARCHAR(500), -- path to generated file in storage
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE -- for email reports
);

CREATE INDEX idx_reports_owner ON reports(owner_id);
CREATE INDEX idx_reports_status ON reports(status);
```

#### Scheduled Reports
```sql
CREATE TABLE scheduled_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    cron_expression VARCHAR(100), -- e.g., "0 9 * * MON" for Monday 9 AM
    timezone VARCHAR(50) DEFAULT 'UTC',
    next_run_at TIMESTAMP WITH TIME ZONE,
    last_run_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scheduled_reports_next_run ON scheduled_reports(next_run_at);
```

#### Comments & Collaboration
```sql
CREATE TABLE dashboard_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dashboard_id UUID REFERENCES dashboards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    parent_comment_id UUID REFERENCES dashboard_comments(id) ON DELETE SET NULL, -- for replies
    content TEXT NOT NULL,
    position_x INTEGER, -- where on the dashboard the comment is anchored
    position_y INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_dashboard_comments_dashboard ON dashboard_comments(dashboard_id);
```

#### Audit Log
```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g., 'DATASET_UPLOAD', 'DASHBOARD_CREATE'
    resource_type VARCHAR(50), -- dataset, dashboard, user, etc.
    resource_id UUID, -- reference to the resource
    details JSONB, -- additional context about the action
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_org ON audit_log(organization_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);
```

#### Notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    type VARCHAR(50), -- insight, report, mention, system
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    related_resource_type VARCHAR(50),
    related_resource_id UUID,
    action_url VARCHAR(500), -- URL to click for action
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_expires ON notifications(expires_at);
```

### Relationships Summary
- Organizations contain Users (via organization_members) and own Dashboards, Datasets, Reports
- Users own Datasets, Dashboards, Reports, and can be shared with others
- Datasets have many Columns, Insights, Forecasting Models, and can source Reports/Dashboards
- Forecasting Models generate Forecasts over time
- Dashboards contain many Widgets, which reference Datasets and have Config
- Insights are generated from Datasets and can be acknowledged by Users
- Reports are generated from various sources and can be scheduled
- Comments belong to Dashboards and can be threaded (replies)
- Audit Log tracks all significant actions by Users
- Notifications are sent to Users about various events

## 12. UI Page List

### Authentication Pages
1. **Login Page** - Email/password login, SSO options, forgot password
2. **Register Page** - User registration with organization creation/joining
3. **Forgot Password** - Password reset flow
4. **Verify Email** - Email verification after registration
5. **SSO Callback** - Handles SAML/OIDC responses from identity providers

### Dashboard & Navigation
6. **Home/Dashboard** - Overview of recent activity, favorite datasets, quick insights
7. **Data Hub** - Searchable library of datasets with filters and tags
8. **Dataset Upload** - File upload wizard with validation and preview
9. **Dataset Details** - View dataset profile, sample data, column information
10. **Data Preparation** - Visual interface for cleaning, transforming, and enriching data
11. **Natural Language Query** - Conversational interface for asking questions about data
12. **Query Results** - Display of query results with visualizations and export options
13. **Insights Panel** - Auto-generated insights with explanations and confidence scores
14. **Forecasting Workspace** - Build, evaluate, and deploy forecasting models
15. **Anomaly Detection** - Configure and view anomaly detection results
16. **Dashboard Builder** - Drag-and-drop interface for creating custom dashboards
17. **Dashboard View** - Interactive dashboard with filtering and drill-down capabilities
18. **Report Generator** - Configure and generate reports from datasets/dashboards
19. **Report Viewer** - View generated reports (PDF/PPTX preview) and download options
20. **Scheduled Reports** - Manage recurring report schedules and delivery
21. **Collaboration Hub** - View shared dashboards, comments, and notifications
22. **User Profile** - Account settings, preferences, and security options
23. **Team Management** - Invite members, manage roles and permissions (admin only)
24. **Organization Settings** - Configure organization-wide settings (admin only)
25. **Admin Dashboard** - System metrics, usage analytics, and monitoring (admin only)
26. **Audit Log** - View system activity and user actions (admin only)
27. **Help & Documentation** - Searchable knowledge base and guided tours
28. **Feedback/Support** - Submit feedback or contact support

### Component-Level Pages (modals/drawers)
29. **Chart Configuration** - Customize chart type, axes, colors, and interactions
30. **Filter Panel** - Apply and manage data filters
31. **Column Settings** - Modify column data types, formatting, and semantics
32. **Share Dashboard** - Generate shareable links or invite specific users
33. **Comment Thread** - View and reply to comments on a dashboard item
34. **Notification Settings** - Configure email and in-app notification preferences
35. **Model Training** - Configure and monitor ML model training progress
36. **Export Options** - Choose format, layout, and delivery method for exports
37. **Data Lineage** - Visualize data transformations and sources
38. **Scenario Planner** - Adjust forecasting assumptions and see outcomes
39. **Alert Configuration** - Set up alerts for metrics or anomalies
40. **Plugin Manager** - Install and configure custom visualizations or connectors

### Mobile/Tablet Views (responsive adaptations)
- All core pages adapt to smaller screens with touch-friendly controls
- Dashboard Builder shifts to vertical layout on tablets
- Natural Language Query prioritizes voice input on mobile
- Report viewing optimized for portrait/landscape orientations

### Specialized Views
- **Executive Summary** - Pre-built dashboard for C-level metrics
- **Data Storyteller** - Guided flow to create narrative reports from insights
- **Model Comparison** - Side-by-side evaluation of different forecasting models
- **Root Cause Analyzer** - Interactive drill-down for investigating anomalies
- **What-If Simulator** - Adjust variables and see impact on forecasts