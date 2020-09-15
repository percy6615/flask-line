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

basedirs = os.path.abspath(os.path.dirname(__file__))
basedir = basedirs + '/cache'
register_man = UserList().getUserList()

class FlaskApp:
    __single = None

    def __new__(cls):
        if not FlaskApp.__single:
            FlaskApp.__single = object.__new__(cls)
        return FlaskApp.__single

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
        from . import api
        from . import auth

    def getApi(self):
        api = Api(self.getApp())
        return api

    def getApp(self):
        return self.app

    def getCache(self):
        return self.cache
