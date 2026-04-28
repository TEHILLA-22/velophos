import time

cache = {}

def get_cache(key):
    if key in cache:
        data, expiry = cache[key]
        if time.time() < expiry:
            return data
    return None

def set_cache(key, value, ttl=300):  # 5 mins
    cache[key] = (value, time.time() + ttl)