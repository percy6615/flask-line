from app import FlaskApp
routerApp = FlaskApp()
api = routerApp.getApi()
routerCache = routerApp.getCache()
from .line_controller import LineControllerPro, StaticPathController, FuckController

api.add_resource(LineControllerPro, '/webhooks/line')
api.add_resource(StaticPathController, '/static/<path:path>')
api.add_resource(FuckController, '/fuck')
