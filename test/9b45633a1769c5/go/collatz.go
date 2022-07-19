package main

import "fmt"

func main() {
	for i := 0; i < 1000000000000000000; i++ {
		fmt.Println(collatz(i))
	}
}
func collatz(j int) int {
	i := j
	cnt := 0
	for i != 1 {
		cnt++
		if i%2 == 0 {
			i /= 2
		} else {
			i *= 3
			i += 1
		}
	}
	return cnt
}
