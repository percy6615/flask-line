from flask import render_template

from .. import routerApp

app = routerApp.getApp()
routerCache = routerApp.getCache()
from .line_controller import LineController, LineRepostMessageToLineBotController, LineRegisterController, \
    LineWebhooksStaticPathController
from .liff_controller import LiffController, LiffControllerIndex, LiffControllerUserReport, LiffControllerToolsBot, \
    LiffPublicPathController, LiffGetQueryPostSaveMissionController, LiffUploadImageController

app.add_url_rule('/webhooks/line',view_func=LineController.as_view('LineController') )
app.add_url_rule('/webhooks/static/<path:path>', view_func=LineWebhooksStaticPathController.as_view('LineWebhooksStaticPathController') )
app.add_url_rule('/webhooks/registerdata', view_func=LineRegisterController.as_view('LineRegisterController') )
app.add_url_rule('/webhooks/repostmessage', view_func=LineRepostMessageToLineBotController.as_view('LineRepostMessageToLineBotController') )
app.add_url_rule('/webhooks/liff', view_func=LiffController.as_view('LiffController') )
app.add_url_rule('/webhooks/liffindex', view_func=LiffControllerIndex.as_view('LiffControllerIndex') )
app.add_url_rule('/webhooks/lifftoolsbot', view_func=LiffControllerToolsBot.as_view('LiffControllerToolsBot'))
app.add_url_rule('/webhooks/reportpage', view_func=LiffControllerUserReport.as_view('LiffControllerUserReport'))
app.add_url_rule('/webhooks/querymission', view_func=LiffGetQueryPostSaveMissionController.as_view('LiffGetQueryPostSaveFileMissionController') )

app.add_url_rule('/webhooks/public/<path:path>', view_func=LiffPublicPathController.as_view('LiffPublicPathController') )
app.add_url_rule('/webhooks/uploadimage', view_func=LiffUploadImageController.as_view('LiffUploadImageController') )



