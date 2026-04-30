from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import fitz # PyMuPDF
import io
from app.core.deps import get_current_user

router = APIRouter(prefix="/upload", tags=["uploads"])

@router.post("")
async def upload_file(file: UploadFile = File(...), user_id: int = Depends(get_current_user)):
    filename = file.filename
    content_type = file.content_type
    
    extracted_text = ""
    
    try:
        if content_type == "text/plain" or filename.endswith(".txt"):
            content = await file.read()
            extracted_text = content.decode("utf-8")
            
        elif content_type == "application/pdf" or filename.endswith(".pdf"):
            content = await file.read()
            pdf_stream = io.BytesIO(content)
            doc = fitz.open(stream=pdf_stream, filetype="pdf")
            for page in doc:
                extracted_text += page.get_text()
            doc.close()
            
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Only .txt and .pdf are allowed.")
            
        return {
            "filename": filename,
            "extracted_text": extracted_text
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
