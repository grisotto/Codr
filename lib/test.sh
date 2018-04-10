#!/bin/bash

for i in *.in; do
    if [[ $1 == "cpp" ]]; then
        #if cpp from make
        ./Solution < $i > ${i:0:1}.outt 
    elif [[ $1 == "java" ]]; then
        #if java from make
        java Solution < $i > ${i:0:1}.outt 
    elif [[ $1 == "python3" ]]; then
        #if python3 from make
        python3 Solution3.py < $i > ${i:0:1}.outt 
    else
        ./Solution < $i > ${i:0:1}.outt 
    fi
    result=$(diff -y -W 12 ${i:0:1}.out ${i:0:1}.outt)
    if [ $? -eq 0 ] 
    then 
        echo "Instance ""$i"" is correct" 
    else  
        echo "Instance ""$i"" is not correct" 
    fi
done
