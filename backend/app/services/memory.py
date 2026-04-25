import chromadb
from app.services.embedding import get_embedding

client = None
collection = None

def get_collection():
    global client, collection
    if client is None:
        client = chromadb.Client()
        collection = client.get_or_create_collection(name="chat_memory")
    return collection

def store_message(user_id: str, message: str, role: str):
    col = get_collection()
    embedding = get_embedding(message)

    col.add(
        embeddings=[embedding],
        documents=[message],
        metadatas=[{"user_id": user_id, "role": role}],
        ids=[f"{user_id}-{role}-{hash(message)}"]
    )

def retrieve_memory(user_id: str, query: str, n_results: int = 4):
    col = get_collection()
    embedding = get_embedding(query)

    results = col.query(
        query_embeddings=[embedding],
        n_results=n_results,
        where={"user_id": user_id}
    )

    return results.get("documents", [[]])[0]