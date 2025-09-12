from pydantic import BaseModel

class ExtractTextResponse(BaseModel):
    text: str 
    language: str
    filename: str