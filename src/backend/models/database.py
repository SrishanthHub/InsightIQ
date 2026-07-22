import json
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default='analyst') # admin, analyst, viewer
    created_at = Column(DateTime, default=datetime.utcnow)

class Dataset(Base):
    __tablename__ = 'datasets'
    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True) # Nullable so legacy datasets aren't broken
    status = Column(String, default="uploaded")  # uploaded, processed, error
    
    metadata_info = relationship("DatasetMetadata", back_populates="dataset", uselist=False, cascade="all, delete-orphan")

class DatasetMetadata(Base):
    """
    Model representing extracted metadata from an uploaded dataset.
    """
    __tablename__ = 'dataset_metadata'

    id = Column(Integer, primary_key=True, autoincrement=True)
    dataset_id = Column(Integer, ForeignKey('datasets.id'), nullable=False)
    row_count = Column(Integer, nullable=False)
    column_count = Column(Integer, nullable=False)
    columns_json = Column(Text, nullable=False)  # Store list of columns and types
    summary_stats_json = Column(Text, nullable=True)  # Store basic statistics
    
    dataset = relationship("Dataset", back_populates="metadata_info")

# SQLite connection setup
DATABASE_URL = "sqlite:///insightiq.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Initialize the database tables."""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Generator for database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
