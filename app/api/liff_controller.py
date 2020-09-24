from flask import render_template
from flask_restful import Resource
import os
NOTIFY_BIND_URL = f"https://liff.line.me/{os.getenv('LIFF_BIND_ID')}"
class LiffController(Resource):
    def get(self):
        return render_template('index.html')
    def post(self):
        return 200