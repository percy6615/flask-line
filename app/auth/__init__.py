from .. import routerApp

api = routerApp.getApp()
# routerCache = routerApp.getCache()
from .auth_controller import Fuck1Controller

api.add_url_rule('/fuck1', view_func=Fuck1Controller.as_view('Fuck1Controller'))
