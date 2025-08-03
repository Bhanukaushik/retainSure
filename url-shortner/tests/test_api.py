import pytest
from app.main import create_app
from app.storage import get_url_data

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    return app.test_client()

def test_health_check(client):
    res = client.get('/')
    assert res.status_code == 200
    assert res.json['status'] == 'ok'

def test_shorten_url(client):
    res = client.post('/api/shorten', json={"url": "https://www.example.com"})
    assert res.status_code == 201
    assert 'short_code' in res.json
    assert 'short_url' in res.json

def test_invalid_url(client):
    res = client.post('/api/shorten', json={"url": "not-a-url"})
    assert res.status_code == 400
    assert res.json['error'] == 'Invalid URL'

def test_redirect_and_stats(client):
    # 1. Create short URL
    res = client.post('/api/shorten', json={"url": "https://www.example.com"})
    short_code = res.json['short_code']

    # 2. Follow redirect
    res2 = client.get(f'/{short_code}', follow_redirects=False)
    assert res2.status_code == 302
    assert 'Location' in res2.headers
    assert res2.headers['Location'] == "https://www.example.com"

    # 3. Check stats
    res3 = client.get(f'/api/stats/{short_code}')
    assert res3.status_code == 200
    assert res3.json['url'] == "https://www.example.com"
    assert res3.json['clicks'] == 1

def test_stats_404(client):
    res = client.get('/api/stats/invalid123')
    assert res.status_code == 404
