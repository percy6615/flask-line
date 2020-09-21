# import random
# import time
#
# from numba import jit
#
# from app import singleton
#
#
# def foo1(x, y):
#     tt = time.time()
#     s = 0
#     for i in range(x, y):
#         s += i
#     print('Time used: {} sec'.format(time.time() - tt))
#     return s
#
#
# # print(foo1(1, 100000))
#
#
# @jit(forceobj=True)
# def foo(x, y):
#     tt1 = time.time()
#     s = 0
#     for i in range(x, y):
#         s += i
#     tt2 = time.time()
#     print('Time used: {} sec'.format(tt2 - tt1))
#     return s
#
#
# # print(foo(1, 100000))
#
#
# @singleton
# class NumberProvider2:
#
#     def __init__(self):
#         self.arr = []
#
#     def setnum(self,val):
#         self.arr.append(val)
#
#
#     def getnum(self):
#         return self.arr
#
# @singleton
# class NumberProvider:
#
#     def __init__(self):
#         self.arr = []
#
#     def setnum(self,val):
#         self.arr.append(val)
#
#
#     def getnum(self):
#         return self.arr
#
# a1 = NumberProvider()
# a1.setnum(1)
# b1 = NumberProvider2()
# b1.setnum(2)
# print(a1.getnum())
# print(b1.getnum())
# b2 = NumberProvider()
# b2.setnum(3)
# print(b2.getnum())
# print(b1.getnum())
#
import redis
from geopy import Nominatim

pool = redis.ConnectionPool(host='127.0.0.1', port=6379, decode_responses=True)
redis_handle = redis.Redis(connection_pool=pool)

attr_dict = {
    "name": "常成功",
    "alias": "常城",
    "sex": "male",
    "height": 175,
    "postal code": 100086,
    "Tel": None,
}
# redis_handle.hset("a1" , "a", 1)
#
# redis_handle.hset("a1" , "b", 2)
# redis_handle.hset("a1" , "c", attr_dict)
#
# redis_handle.hset("a2" , "a", 3)
# redis_handle.hset("a2" , "b", {"sucess":200})
#
# # print(redis_handle.hget("a","b"))
# # print(redis_handle.hget("a","a"))
# # print(redis_handle.hget("a2","b"))
#
# keys = redis_handle.keys('*')
# for k in keys:
# #     redis_handle.delete(k)
#     print(k)


import geocoder
g = geocoder.arcgis("大肚火車站")
# g = geocoder.arcgis(u"北京市海淀區上地十街10號")
print(g)