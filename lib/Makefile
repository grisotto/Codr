# Compiler binary:
	PLATFORM = linux64
	CPP      = g++
	JC		 = javac
	PC		 = python3	
	CFLAGS= -std=c++14 -O2 -lm

# Targets:
all: cpp java cpp14 haskell python


cpp: Solution.cpp
	$(CPP) $(CFLAGS) $< -o Solution
	bash test.sh cpp

cpp14: Solution-14.cpp
	$(CPP) $(CFLAGS) $< -o Solution
	bash test.sh cpp

java: Solution.java
	$(JC) $< 
	bash test.sh java

python: Solution3.py
	bash test.sh python3

haskell: Solution.hs
	ghc Solution $<
	bash test.sh cpp

clean:
	rm -f Solution.class Solution
