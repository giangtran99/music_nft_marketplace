

#!/bin/bash
#Build frontend

script () {
    echo "start running nft marketplace .......";
    # cd $0;
    cd  /Users/giangtran/Desktop/workspace/nft-marketplace;
    truffle migrate
    cd  /Users/giangtran/Desktop/workspace/graph-node/docker;
    docker-compose down 
    sleep 1
    rm -rf /Users/giangtran/Desktop/workspace/graph-node/docker/data
    sleep 1
    docker-compose up
    echo "Done !!!!!!!!!!!!!!!!!!!!";
    cd 
}


script
