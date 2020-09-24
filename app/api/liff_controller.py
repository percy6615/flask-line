import random

from flask import render_template, request

from flask.views import MethodView


class LiffController(MethodView):
    def get(self):
        return render_template('index.html', param1=str(random.random()))

    def post(self):
        return 200


class LiffControllerIndex(MethodView):
    def get(self):
        return render_template('liff.html')

    def post(self):
        return 200

class LiffControllerToolsBot(MethodView):
    def get(self):
        return render_template('toolsbot.html')

    def post(self):
        return 200