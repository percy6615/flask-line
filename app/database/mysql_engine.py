from sqlalchemy import create_engine
import os
from app.tools import log_tool


logger = log_tool.logger


def create_ng_mysql():
    logger.info('configure database settings for pandas')
    mysql_host = os.getenv('mysql_host')
    mysql_pwd = os.getenv('mysql_pwd')
    mysql_username = os.getenv('mysql_username')
    mysql_port = os.getenv('mysql_port')
    mysql_database = os.getenv('mysql_database')
    uri = 'mysql+pymysql://' + mysql_username + ':' + mysql_pwd + '@' + mysql_host + ':' + mysql_port + '/' + mysql_database + '?charset=utf8mb4'
    engine = create_engine(uri)
    return engine

