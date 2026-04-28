import requests
from app.core.cache import get_cache, set_cache

def fetch_wikipedia(query: str):
    cached = get_cache(query)
    if cached:
        return cached

    try:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{query}"
        res = requests.get(url, timeout=3)

        if res.status_code == 200:
            data = res.json().get("extract", "")
            set_cache(query, data)
            return data

    except:
        return ""

    return ""