from pydantic import BaseModel

class RegisterRequest(BaseModel):
    phone: str
    password: str

class ConfirmRequest(BaseModel):
    phone: str
    password: str
    code: str
    
class LoginRequest(BaseModel):
    phone: str
    password: str