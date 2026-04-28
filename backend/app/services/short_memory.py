from collections import defaultdict, deque

# Store last N messages per user
MAX_HISTORY = 6

user_histories = defaultdict(lambda: deque(maxlen=MAX_HISTORY))


def add_message(chat_id: str, role: str, message: str):
    user_histories[chat_id].append({
        "role": role,
        "message": message
    })


def get_history(chat_id: str):
    return list(user_histories[chat_id])