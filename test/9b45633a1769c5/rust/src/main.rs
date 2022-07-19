fn collatz(mut i: usize) -> usize {
    let mut cnt = 0;
    while i != 1 {
        cnt += 1;
        if i % 2 == 0 {
            i /= 2;
        } else {
            i *= 3;
            i += 1;
        }
    }
    cnt
}
fn main() {
    for i in 0..1000000000000000000 {
        println!("{}", collatz(i));
    }
}
