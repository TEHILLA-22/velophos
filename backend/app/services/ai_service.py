from app.core.config import OLLAMA_URL, MODEL
from app.services.memory import retrieve_memory
from app.services.short_memory import get_history
import requests

def generate_response(user_id: str, prompt: str):
    # 🔹 Long-term memory
    memories = retrieve_memory(user_id, prompt, n_results=2)

    # 🔹 Short-term memory
    history = get_history(user_id)

    # Format short-term history
    history_text = "\n".join(
        [f"{msg['role']}: {msg['message']}" for msg in history]
    )

    # Format long-term memory
    memory_text = "\n".join(memories)

    full_prompt = f"""
You are Velophos.

Recent conversation:
{history_text}

Relevant memory:
{memory_text}

User: {prompt}
Answer briefly:
"""

    response = requests.post(
        f"{OLLAMA_URL}/api/generate",
        json={
            "model": MODEL,
            "prompt": full_prompt,
            "stream": False,
            "options": {
                "num_predict": 150,
                "temperature": 0.7
            }
        }
    )

    data = response.json()
    return data.get("response", "")