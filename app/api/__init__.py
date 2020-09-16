from .. import routerApp

api = routerApp.getApi()
routerCache = routerApp.getCache()
from .line_controller import LineControllerPro, StaticPathController, RegisterController
from .liff_controller import LiffController


api.add_resource(LineControllerPro, '/webhooks/line')
api.add_resource(RegisterController, '/webhooks/registerdata')
api.add_resource(StaticPathController, '/static/<path:path>')

# api.add_resource(LiffController, '/liff')