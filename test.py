import time

from numba import jit


def foo1(x, y):
    tt = time.time()
    s = 0
    for i in range(x, y):
        s += i
    print('Time used: {} sec'.format(time.time() - tt))
    return s


print(foo1(1, 100000))


@jit(forceobj=True)
def foo(x, y):
    tt1 = time.time()
    s = 0
    for i in range(x, y):
        s += i
    tt2 = time.time()
    print('Time used: {} sec'.format(tt2 - tt1))
    return s


print(foo(1, 100000))
