
#!/bin/bash
#Build frontend
script () {
    # cd $0;
    docker exec -it docker_ipfs_1 ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
    docker exec -it docker_ipfs_1 ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
    docker exec -it docker_ipfs_1 ipfs config --json API.HTTPHeaders.Access-Control-Allow-Headers '["Authorization"]'
    docker exec -it docker_ipfs_1 ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["GET","POST"]'
    docker exec -it docker_ipfs_1 ipfs config --json API.HTTPHeaders.Access-Control-Expose-Headers '["Location"]'
    sleep 1
    echo "start running subgraph .......";
    cd  /Users/giangtran/Desktop/workspace/nft-marketplace/subgraph/musicNFT;
    yarn create-local && yarn deploy-local
    echo "Done !!!!!!!!!!!!!!!!!!!!";
    sleep 3
}

script
