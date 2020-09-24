from flask import render_template

from .. import routerApp

app = routerApp.getApp()
routerCache = routerApp.getCache()
from .line_controller import LineController, RepostMessageToLineBot, RegisterController, \
    WebhooksStaticPathController
from .liff_controller import LiffController, LiffControllerIndex, LiffControllerToolsBot

app.add_url_rule('/webhooks/line',view_func=LineController.as_view('LineController') )
app.add_url_rule('/webhooks/registerdata', view_func=RegisterController.as_view('RegisterController') )
app.add_url_rule('/webhooks/repostmessage', view_func=RepostMessageToLineBot.as_view('RepostMessageToLineBot') )
app.add_url_rule('/webhooks/liff', view_func=LiffController.as_view('LiffController') )
app.add_url_rule('/webhooks/liffindex', view_func=LiffControllerIndex.as_view('LiffControllerIndex') )
app.add_url_rule('/webhooks/lifftoolsbot', view_func=LiffControllerToolsBot.as_view('LiffControllerToolsBot') )
app.add_url_rule('/webhooks/static/<path:path>', view_func=WebhooksStaticPathController.as_view('WebhooksStaticPathController') )



