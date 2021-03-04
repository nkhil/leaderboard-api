#!/bin/bash

RED='\033[0;31m'
END='\033[0m'

function checkError() {
    if [ $? -eq "1" ]; then
        echo " ";
        echo -e "${RED} Tests exited with exit code 1${END}";
        exit 1;
    fi
}

docker-compose up --build test
checkError $?