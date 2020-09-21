from ..tools.sync_tool import singleton
from app.database.mysql_engine import MySQLs


@singleton
class UserList:
    # getInstance

    def __init__(self):
        self.usersDic = None

    def handleUserList(self):
        users = MySQLs().get_dict_data_sql('select * from disaster_userlist where sourcetype="user"')
        usersDic = dict()
        for u in users:
            usersDic[u['senderid']] = u
        self.usersDic = usersDic
        return self

    def getUserList(self):
        return self.usersDic

    def updateUser(self, senderid, groupname):
        return MySQLs().run(
            "update disaster_userlist set webflag = 1, groupname='%(groupname)s' where senderid='%(senderid)s' and sourcetype = 'user'" % (
                {"senderid": senderid, "groupname": groupname}))
