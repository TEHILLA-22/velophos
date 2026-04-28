import chromadb
from app.services.embedding import get_embedding
from app.db.database import SessionLocal
from app.db.models import Message

client = None
collection = None

def get_collection():
    global client, collection
    if client is None:
        client = chromadb.Client()
        collection = client.get_or_create_collection(name="chat_memory")
    return collection

def store_message(chat_id: str, role: str, content: str):
    db = SessionLocal()
    try:
        # Note: If your chat_id is a UUID string, but models.Message expects an Integer,
        # this might throw an error. See my explanation!
        new_msg = Message(chat_id=chat_id, role=role, content=content)
        db.add(new_msg)
        db.commit()
    finally:
        db.close()

def retrieve_memory(chat_id: str, query: str, n_results: int = 4):
    col = get_collection()
    embedding = get_embedding(query)

    results = col.query(
        query_embeddings=[embedding],
        n_results=n_results,
        where={"chat_id": chat_id}
    )

    return results.get("documents", [[]])[0]