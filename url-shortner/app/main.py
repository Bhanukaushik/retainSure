from flask import Flask, jsonify, request, redirect
from app.utils import generate_short_code, is_valid_url
from app.storage import save_url_mapping, get_url_data, increment_click

def create_app():
    app = Flask(__name__)

    @app.route('/')
    def health_check():
        return jsonify({"status": "ok"}), 200

    @app.route('/api/shorten', methods=['POST'])
    def shorten_url():
        data = request.get_json()
        original_url = data.get("url")

        if not original_url or not is_valid_url(original_url):
            return {"error": "Invalid URL"}, 400

        # Generate unique short code
        while True:
            short_code = generate_short_code()
            if not get_url_data(short_code):
                break

        save_url_mapping(short_code, original_url)

        return {
            "short_code": short_code,
            "short_url": f"http://localhost:5000/{short_code}"
        }, 201
    
    @app.route('/<short_code>', methods=['GET'])
    def redirect_to_original(short_code):
        data = get_url_data(short_code)
        if not data:
            return {"error": "Short code not found"}, 404

        increment_click(short_code)
        return redirect(data["url"])
    
    @app.route('/api/stats/<short_code>', methods=['GET'])
    def get_stats(short_code):
        data = get_url_data(short_code)
        if not data:
            return {"error": "Short code not found"}, 404

        return {
            "url": data["url"],
            "clicks": data["clicks"],
            "created_at": data["created_at"]
        }, 200
    return app
