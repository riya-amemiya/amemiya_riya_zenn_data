class Main {
    public static long collatz(long j) {
        long i = j;
        long cnt = 0;
        while (i != 1) {
            cnt++;
            if (i % 2 == 0) {
                i /= 2;
            } else {
                i *= 3;
                i += 1;
            }
        }
        return cnt;
    }

    public static void main(String[] args) {
        for (int i = 0; i < 1000000000000000000L; i++) {
            System.out.println(collatz(i));
        }
    }
}
