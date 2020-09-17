from flask_restful import Resource
import os
NOTIFY_BIND_URL = f"https://liff.line.me/{os.getenv('LIFF_BIND_ID')}"
class LiffController(Resource):
    def get(self):
        return 200
    def post(self):
        return 200