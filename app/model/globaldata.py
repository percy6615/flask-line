from ..tools.sync_tool import singleton
from app.database.mysql_engine import MySQLs
from app.database.redis_engine import redis_handle


@singleton
class GlobalInMem:
    # getInstance

    def __init__(self):
        self.usersDic = None
        self.groupsDic = None

    def handleUserList(self):
        all = MySQLs().get_dict_data_sql('select * from disaster_userlist ')
        self.usersDic = dict()
        self.groupsDic = dict()
        for a in all:
            if a['sourcetype'] == 'user':
                self.usersDic[a['senderid']] = a
            elif a['sourcetype'] == 'group':
                self.groupsDic[a['senderid']] = a
        return self

    def setRedis(self):
        print()

    def getUserList(self):
        return self.usersDic

    def getGroupList(self):
        return self.groupsDic

    def updateDataBaseUser(self, senderid, groupname):
        return MySQLs().run(
            "update disaster_userlist set webflag = 1, groupname='%(groupname)s' where senderid='%(senderid)s' and sourcetype = 'user'" % (
                {"senderid": senderid, "groupname": groupname}))
