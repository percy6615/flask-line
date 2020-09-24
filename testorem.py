from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Table, Date, Text, Numeric, Float, \
    DateTime, REAL, or_, and_, func
from sqlalchemy.orm import scoped_session, sessionmaker, relationship, backref
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.schema import Sequence

from app.database.mysql_engine import create_ng_mysql

engine = create_ng_mysql()

db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()


class User(Base):
    __tablename__ = 'stop'
    id = Column(Integer, Sequence('user_id'), primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    password = Column(String(120), unique=True, nullable=False)
    name = Column(String(20), unique=False, nullable=False)

    def to_dict(self):  # 將數據轉為字典
        dictionary = self.__dict__
        if "_sa_instance_state" in dictionary:
            del dictionary["_sa_instance_state"]
        return dictionary

    def __repr__(self):  # 讓print這個物件的時候，看起來好看
        return '<User %r>' % self.username


class UserDetail(Base):
    __tablename__ = 'user_detail'
    id = Column(Integer, Sequence('user_detail_id'), primary_key=True)
    email = Column(String(80), unique=True, nullable=False)


if __name__ == '__main__':
    Base.metadata.create_all(bind=engine)
    print('Initialize database.')