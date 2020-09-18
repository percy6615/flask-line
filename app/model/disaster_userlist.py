from ..tools.sync_tool import singleton
from app.database import MySQLs


@singleton
class UserList:
    # getInstance

    def __init__(self):
        self.mysql = MySQLs()
        self.usersDic = None

    def handleUserList(self):
        users = self.mysql.get_dict_data_sql('select * from disaster_userlist where sourcetype="user"')
        usersDic = dict()
        for u in users:
            usersDic[u['senderid']] = u
        self.usersDic = usersDic
        return self

    def getUserList(self):
        return self.usersDic

    def updateUser(self, senderid, groupname):
        return self.mysql.run(
            "update disaster_userlist set webflag = 1, groupname='%(groupname)s' where senderid='%(senderid)s' and sourcetype = 'user'" % (
                {"senderid": senderid, "groupname": groupname}))
