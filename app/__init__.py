import random

from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_cache import Cache
from flask_restful import Api
from flask_bootstrap import Bootstrap
import os
from flask_mail import Mail
from flask_moment import Moment
from flask_pagedown import PageDown
from app.model.disaster_userlist import UserList
# from .database.redis_engine import redis_handle
from .tools.sync_tool import singleton

basedirs = os.path.abspath(os.path.dirname(__file__))
basedir = basedirs + '/cache'
userListHandle = UserList().handleUserList()
register_man = userListHandle.getUserList()
# for key, val in register_man.items():
#     redis_handle.hmset(key, val)

@singleton
class FlaskApp:
    def __init__(self):
        self.app = Flask(__name__)
        self.app.wsgi_app = ProxyFix(self.app.wsgi_app, x_for=1, x_host=1, x_proto=1)
        Bootstrap(self.app)
        JWTManager(self.app)
        CORS(self.app)
        Mail(self.app)
        Moment(self.app)
        PageDown(self.app)
        self.app.config['JWT_SECRET_KEY'] = 'this-should-be-change'
        self.cache = Cache(self.app, config={'CACHE_TYPE': 'filesystem', 'CACHE_DIR': basedir})

    def getApi(self):
        api = Api(self.getApp())
        return api

    def getApp(self):
        return self.app

    def getCache(self):
        return self.cache


routerApp = FlaskApp()
from . import api
from . import auth
