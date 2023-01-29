.PHONY: build

build:
	cd cpp && g++ --std=c++20 collatz.cpp -o collatz
	cd rust && cargo build --release
	cd go && go build collatz.go
	cd java && javac Main.java
	cd js && qjsc index.ts
	cd swift && swiftc -emit-executable collatz.swift
.PHONY: time

time:
	time ./swift/collatz
	time ./rust/target/release/collatz
	time ./cpp/collatz
	time ./go/collatz
	time cd java && java Main
	time node js/index.ts
	time python python/collatz.py