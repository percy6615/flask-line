import random
from abc import ABCMeta, abstractmethod

from app import globalRegisterUser
from app.database.mysql_engine import MySQLs, create_ng_mysql
import pandas as pd
import time
# from sqlalchemy.orm import sessionmaker
engine = create_ng_mysql()

# db_session = sessionmaker(engine)

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
            tf = len(MySQLs().get(checkSql)) >= 1
        except None:
            print('check error to db event')
        return tf

    def deleteEvent(self):
        delSql = self.setDeleteEventSql()
        try:
            MySQLs().run(delSql)
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
            if isCheckExist:
                senderid = jsonData[0]['senderid']
                globalRegisterUser[senderid] = jsonData[0]
            count = count - 1



