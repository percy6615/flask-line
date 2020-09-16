from .. import routerApp

api = routerApp.getApi()
# routerCache = routerApp.getCache()
from .auth_controller import Fuck1Controller

api.add_resource(Fuck1Controller, '/fuck1')
