import sys


def sum(a, b):
    return a + b


pi = 3.14

print("Result of sum(3, 4) =", sum(3, 4))
print("Pi is equal to", pi)

sys.stderr.write("Stderr recognition is working as expected")