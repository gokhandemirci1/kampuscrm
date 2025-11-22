from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    can_manage_customers: bool
    can_view_financials: bool
    can_manage_partnership_codes: bool
    can_view_partnership_stats: bool
    can_manage_access: bool
    
    class Config:
        from_attributes = True
        


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class CustomerCreate(BaseModel):
    full_name: str
    phone: str
    email: EmailStr
    class_level: Optional[str] = None
    camps: List[str] = []
    prices: List[float] = []
    partnership_code: Optional[str] = None
    previous_yks_rank: Optional[int] = None
    city: Optional[str] = None


class CustomerResponse(BaseModel):
    id: int
    full_name: str
    phone: str
    email: str
    class_level: Optional[str]
    camps: List[str]
    prices: List[float]
    partnership_code: Optional[str]
    previous_yks_rank: Optional[int]
    city: Optional[str]
    is_paid: bool
    is_deleted: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
        


class PartnershipCodeCreate(BaseModel):
    code: str


class PartnershipCodeResponse(BaseModel):
    id: int
    code: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
        


class PartnershipStats(BaseModel):
    code: str
    customer_count: int
    total_amount: float


class FinancialPeriod(BaseModel):
    daily: float
    weekly: float
    monthly: float
    yearly: float


class FinancialDetail(BaseModel):
    customer_id: int
    customer_name: str
    amount: float
    transaction_date: datetime


class FinancialResponse(BaseModel):
    period: FinancialPeriod
    details: List[FinancialDetail]
    total: float


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    can_manage_customers: bool = False
    can_view_financials: bool = False
    can_manage_partnership_codes: bool = False
    can_view_partnership_stats: bool = False
    can_manage_access: bool = False


class UserUpdate(BaseModel):
    can_manage_customers: Optional[bool] = None
    can_view_financials: Optional[bool] = None
    can_manage_partnership_codes: Optional[bool] = None
    can_view_partnership_stats: Optional[bool] = None
    can_manage_access: Optional[bool] = None
    is_active: Optional[bool] = None

