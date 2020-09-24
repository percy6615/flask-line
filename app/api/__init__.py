from flask import render_template

from .. import routerApp

api = routerApp.getApi()
start = routerApp.getApp()
routerCache = routerApp.getCache()
from .line_controller import LineController, StaticPathController, RepostMessageToLineBot, RegisterController
from .liff_controller import LiffController

api.add_resource(LineController, '/webhooks/line')
api.add_resource(RegisterController, '/webhooks/registerdata')
api.add_resource(RepostMessageToLineBot, '/webhooks/repostmessage')
# api.add_resource(LiffController, '/webhooks/liff')
api.add_resource(StaticPathController, '/static/<path:path>')

@start.route('/webhooks/liff')
def liff():
    return render_template('index.html')

