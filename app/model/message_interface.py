import random
from abc import ABCMeta, abstractmethod

from app.database import Mysqls, mysql_engine
import pandas as pd
import time

engine = mysql_engine.create_ng_mysql()


class MessageInterface(metaclass=ABCMeta):
    @abstractmethod
    def to_json(self):
        pass

    @abstractmethod
    def setCheckEventExistSql(self):
        pass

    @abstractmethod
    def setDeleteEventSql(self):
        pass

    def isCheckEventExist(self):
        checkSql = self.setCheckEventExistSql()
        try:
            tf = len(Mysqls().get(checkSql)) >= 1
        except None:
            print('check error to db event')
        return tf

    def deleteEvent(self):
        delSql = self.setDeleteEventSql()
        try:
            Mysqls().run(delSql)
        except None:
            print('delete error to db event')

    def saveUserEvent(self, tableName, jsonData):
        count = 10
        isCheckExist = self.isCheckEventExist()
        while count > 0 and not isCheckExist:
            data = pd.DataFrame(jsonData)
            try:
                data.to_sql(name=tableName, con=engine, if_exists='append', index=False)
            except None:
                print('save error to db event')
            time.sleep(0.5)
            isCheckExist = self.isCheckEventExist()
            count = count - 1



