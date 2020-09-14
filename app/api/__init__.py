from app import FlaskApp


routerApp = FlaskApp()
api = routerApp.getApi()
routerCache = routerApp.getCache()
from .line_controller import LineControllerPro, StaticPathController, FuckController
from .liff_controller import LiffController

api.add_resource(LineControllerPro, '/webhooks/line')
api.add_resource(StaticPathController, '/static/<path:path>')
api.add_resource(FuckController, '/fuck')
api.add_resource(LiffController, '/liff')