import random
import time

from numba import jit

from app import singleton


def foo1(x, y):
    tt = time.time()
    s = 0
    for i in range(x, y):
        s += i
    print('Time used: {} sec'.format(time.time() - tt))
    return s


# print(foo1(1, 100000))


@jit(forceobj=True)
def foo(x, y):
    tt1 = time.time()
    s = 0
    for i in range(x, y):
        s += i
    tt2 = time.time()
    print('Time used: {} sec'.format(tt2 - tt1))
    return s


# print(foo(1, 100000))


@singleton
class NumberProvider2:

    def __init__(self):
        self.arr = []

    def setnum(self,val):
        self.arr.append(val)


    def getnum(self):
        return self.arr

@singleton
class NumberProvider:

    def __init__(self):
        self.arr = []

    def setnum(self,val):
        self.arr.append(val)


    def getnum(self):
        return self.arr

a1 = NumberProvider()
a1.setnum(1)
b1 = NumberProvider2()
b1.setnum(2)
print(a1.getnum())
print(b1.getnum())
b2 = NumberProvider()
b2.setnum(3)
print(b2.getnum())
print(b1.getnum())

