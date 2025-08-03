from datetime import datetime, UTC

url_map = {} 

def save_url_mapping(short_code, long_url):
    url_map[short_code] = {
        "url": long_url,
        "clicks": 0,
        "created_at": datetime.now(UTC).isoformat()
    }

def get_url_data(short_code):
    return url_map.get(short_code)

def increment_click(short_code):
    if short_code in url_map:
        url_map[short_code]["clicks"] += 1

def get_all_data():
    return url_map
