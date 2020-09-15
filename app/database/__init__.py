import os
import pymysql
from dotenv import load_dotenv

from app.tools import log_tool
# from pymysqlpool.pool import Pool
from app.tools.sync_tool import synchronized

logger = log_tool.logger
load_dotenv()


class MySQLs:
    # getInstance
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        self.conn = None
        self.cur = None
        self._conn()

    def _conn(self):
        logger.info('configure mysql database settings')
        mysql_host = os.getenv('mysql_host')
        mysql_pwd = os.getenv('mysql_pwd')
        mysql_username = os.getenv('mysql_username')
        mysql_port = os.getenv('mysql_port')
        mysql_database = os.getenv('mysql_database')
        self.conn = pymysql.connect(host=mysql_host, user=mysql_username, passwd=mysql_pwd, db=mysql_database,
                                    port=int(mysql_port))
        self.cur = self.conn.cursor()

    @synchronized
    def run(self, sql):
        # logger.debug('execute mysql SQL {}'.format(sql))

        if self.conn is None:
            self._conn()
        try:
            self.cur.execute(sql)
            self.conn.commit()
            self._logout()
        except pymysql.Error as e:
            print('mysql conn get error '+str(e))

    @synchronized
    def get(self, sql):
        # logger.info('retrieve data from mysql table')
        if self.conn is None:
            self._conn()
        try:
            self.cur.execute(sql)
            data = self.cur.fetchall()
            self.conn.commit()
            self._logout()
            return data  # return tuple
        except pymysql.Error as e:
            print('mysql conn get error '+str(e))

    def _logout(self):
        try:
            if self.conn is not None:
                self.conn.close()
            logger.info('log out from mysql database')
        except pymysql.Error as e:
            logger.warning('already logged out from Postgres database'+str(e))

    @staticmethod
    def get_index_dict(cur):
        index_dict = dict()
        index = 0
        for desc in cur.description:
            index_dict[desc[0]] = index
            index = index + 1
        return index_dict

    @synchronized
    def get_dict_data_sql(self, sql):

        if self.conn is None:
            self._conn()
        self.cur.execute(sql)
        data = self.cur.fetchall()
        index_dict = self.get_index_dict(self.cur)
        res = []
        for datai in data:
            resi = dict()
            for indexi in index_dict:
                resi[indexi] = datai[index_dict[indexi]]
            res.append(resi)
        return res

# class MysqlPool:
#     def __new__(cls, *args, **kwargs):
#         if cls._instance is None:
#             cls._instance = super().__new__(cls)
#         return cls._instance
#
#     def __init__(self):
#         self.conn = None
#         self.pool = None
#         self.cur = None
#     def _pool(self):
#         logger.info('configure mysql database settings')
#         mysql_host = os.getenv('mysql_host')
#         mysql_pwd = os.getenv('mysql_pwd')
#         mysql_username = os.getenv('mysql_username')
#         mysql_port = os.getenv('mysql_port')
#         mysql_database = os.getenv('mysql_database')
#         self.pool = Pool.connect(host=mysql_host, user=mysql_username, passwd=mysql_pwd, db=mysql_database,
#                                  port=mysql_port, autocommit=True)
#         self.pool.init()
#
#     def _conn(self):
#         self.conn = self.pool.get_conn()
#         self.cur = self.conn.cursor()
