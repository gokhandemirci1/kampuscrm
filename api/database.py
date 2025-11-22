from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

# SQLite database
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./admin_dashboard.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    can_manage_customers = Column(Boolean, default=False)
    can_view_financials = Column(Boolean, default=False)
    can_manage_partnership_codes = Column(Boolean, default=False)
    can_view_partnership_stats = Column(Boolean, default=False)
    can_manage_access = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class PartnershipCode(Base):
    __tablename__ = "partnership_codes"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    customers = relationship("Customer", back_populates="partnership_code_obj")


class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    class_level = Column(String)
    camps = Column(Text)  # JSON string of camps
    prices = Column(Text)  # JSON string of prices
    partnership_code = Column(String, ForeignKey("partnership_codes.code"), nullable=True)
    previous_yks_rank = Column(Integer, nullable=True)
    city = Column(String)
    is_paid = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)
    
    partnership_code_obj = relationship("PartnershipCode", back_populates="customers")


class FinancialTransaction(Base):
    __tablename__ = "financial_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    amount = Column(Float, nullable=False)
    transaction_date = Column(DateTime, default=datetime.utcnow)
    is_deleted = Column(Boolean, default=False)


def init_db():
    Base.metadata.create_all(bind=engine)
    
    # Create initial users
    db = SessionLocal()
    try:
        from api.auth import get_password_hash
        
        initial_users = [
            {
                "email": "gokhan@kampus.com",
                "password": "QWQD$(u~p3",
                "can_manage_customers": True,
                "can_view_financials": True,
                "can_manage_partnership_codes": True,
                "can_view_partnership_stats": True,
                "can_manage_access": True
            },
            {
                "email": "emre@kampus.com",
                "password": "Fco6hgVch2",
                "can_manage_customers": True,
                "can_view_financials": True,
                "can_manage_partnership_codes": True,
                "can_view_partnership_stats": True,
                "can_manage_access": True
            },
            {
                "email": "irem-kanbay@kampus.com",
                "password": "E6sD47(X[%",
                "can_manage_customers": True,
                "can_view_financials": False,
                "can_manage_partnership_codes": False,
                "can_view_partnership_stats": False,
                "can_manage_access": False
            },
            {
                "email": "emre-unal@kampus.com",
                "password": "TGFFqCaY]K",
                "can_manage_customers": False,
                "can_view_financials": True,
                "can_manage_partnership_codes": True,
                "can_view_partnership_stats": False,
                "can_manage_access": False
            },
            {
                "email": "gokce-demirci@kampus.com",
                "password": "gK5iU|KZBw",
                "can_manage_customers": False,
                "can_view_financials": False,
                "can_manage_partnership_codes": False,
                "can_view_partnership_stats": False,
                "can_manage_access": True
            },
            {
                "email": "burcu-akbas@kampus.com",
                "password": "2!1q@<y$nf",
                "can_manage_customers": False,
                "can_view_financials": False,
                "can_manage_partnership_codes": False,
                "can_view_partnership_stats": False,
                "can_manage_access": False
            },
            {
                "email": "bilal-acar@kampus.com",
                "password": "&!wtByzkHG",
                "can_manage_customers": False,
                "can_view_financials": False,
                "can_manage_partnership_codes": False,
                "can_view_partnership_stats": True,
                "can_manage_access": False
            }
        ]
        
        for user_data in initial_users:
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()
            if not existing_user:
                user = User(
                    email=user_data["email"],
                    hashed_password=get_password_hash(user_data["password"]),
                    can_manage_customers=user_data["can_manage_customers"],
                    can_view_financials=user_data["can_view_financials"],
                    can_manage_partnership_codes=user_data["can_manage_partnership_codes"],
                    can_view_partnership_stats=user_data["can_view_partnership_stats"],
                    can_manage_access=user_data["can_manage_access"]
                )
                db.add(user)
        
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error initializing database: {e}")
    finally:
        db.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

