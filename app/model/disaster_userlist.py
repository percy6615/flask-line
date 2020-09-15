from app.database import MySQLs


class UserList:
    # getInstance
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
       self.mysql = MySQLs()

    def getUserList(self):
        users = self.mysql.get_dict_data_sql('select * from disaster_userlist where sourcetype="user"')
        usersDic = dict()
        for u in users:
            usersDic[u['senderid']] = u
        return usersDic


