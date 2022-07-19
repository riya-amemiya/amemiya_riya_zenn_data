def collatz(i: int):
    cnt = 0
    while i != 1:
        cnt += 1
        if i % 2 == 0:
            i /= 2
        else:
            i *= 3
            i += 1
    return cnt


for i in range(1, 1000000000000000000):
    print(collatz(i))
