from collections import defaultdict, deque

# Store last N messages per user
MAX_HISTORY = 6

user_histories = defaultdict(lambda: deque(maxlen=MAX_HISTORY))


def add_message(user_id: str, role: str, message: str):
    user_histories[user_id].append({
        "role": role,
        "message": message
    })


def get_history(user_id: str):
    return list(user_histories[user_id])