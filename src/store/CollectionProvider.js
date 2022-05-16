import { useReducer } from 'react';
import { toast } from 'react-toastify';
import { request } from '../helpers/utils';

import CollectionContext from './collection-context';

const defaultCollectionState = {
  contract: null,
  totalSupply: null,
  collection: [],
  albums: [],
  nftIsLoading: true
};

const collectionReducer = (state, action) => {
  if (action.type === 'CONTRACT') {
    return {
      contract: action.contract,
      totalSupply: state.totalSupply,
      collection: state.collection,
      albums: state.albums,
      nftIsLoading: state.nftIsLoading
    };
  }

  if (action.type === 'LOADSUPPLY') {
    return {
      contract: state.contract,
      totalSupply: action.totalSupply,
      collection: state.collection,
      albums: state.albums,
      nftIsLoading: state.nftIsLoading
    };
  }

  if (action.type === 'LOADCOLLECTION') {
    console.log("@@action", action)
    return {
      contract: state.contract,
      totalSupply: state.totalSupply,
      collection: action.collection,
      albums: action.albums,
      nftIsLoading: state.nftIsLoading
    };
  }

  if (action.type === 'UPDATECOLLECTION') {
    const index = state.collection.findIndex(NFT => NFT.id === parseInt(action.NFT.id));
    let collection = [];

    if (index === -1) {
      collection = [action.NFT, ...state.collection];
    } else {
      collection = [...state.collection];
    }

    return {
      contract: state.contract,
      totalSupply: state.totalSupply,
      collection: collection,
      albums: state.albums,
      nftIsLoading: state.nftIsLoading
    };
  }

  if (action.type === 'UPDATEOWNER') {
    const index = state.collection.findIndex(NFT => NFT.id === parseInt(action.id));
    let collection = [...state.collection];
    collection[index].owner = action.newOwner;

    return {
      contract: state.contract,
      totalSupply: state.totalSupply,
      collection: collection,
      albums: state.albums,
      nftIsLoading: state.nftIsLoading
    };
  }

  if (action.type === 'LOADING') {
    return {
      contract: state.contract,
      totalSupply: state.totalSupply,
      collection: state.collection,
      albums: state.albums,
      nftIsLoading: action.loading
    };
  }

  return defaultCollectionState;
};

const CollectionProvider = props => {
  const [CollectionState, dispatchCollectionAction] = useReducer(collectionReducer, defaultCollectionState);

  const loadContractHandler = (web3, NFTCollection, deployedNetwork) => {
    const contract = deployedNetwork ? new web3.eth.Contract(NFTCollection.abi, deployedNetwork.address) : '';
    dispatchCollectionAction({ type: 'CONTRACT', contract: contract });
    return contract;
  };

  const loadTotalSupplyHandler = async (contract) => {
    const totalSupply = await contract.methods.totalSupply().call();
    dispatchCollectionAction({ type: 'LOADSUPPLY', totalSupply: totalSupply });
    return totalSupply;
  };

  const loadCollectionHandler = async (contract, totalSupply) => {
    let collection = [];
    console.log("1111@!@",totalSupply)
    for (let i = 0; i < totalSupply; i++) {

      const hash = await contract.methods.tokenURIs(i).call();

      try {
        const response = await fetch(`${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${hash}?clear`);
        if (!response.ok) {
          throw new Error('Something went wrong');
        }

        const metadata = await response.json();
        console.log("!@!@2",metadata)
        const owner = await contract.methods.ownerOf(i + 1).call();
        collection.push({
          id: i + 1,
          title: metadata.properties.name.description,
          metadata: metadata.properties.metadata.description,
          demoMetadata: metadata.properties?.demoMetadata?.description,
          description: metadata.properties.description.description,
          coverPhoto: metadata.properties.coverPhoto.description,
          minter: metadata.properties.minter.description,
          owner: owner
        });

      } catch (e){
        toast.error(e.toString())
      }
    }
    dispatchCollectionAction({ type: 'LOADCOLLECTION', collection: collection, albums: [] });
  };

  const loadCollectionFromServerHandler = async (contract, nfts, account, marketplaceCtx) => {
    let collection = [];
    for (let i = 0; i < nfts.length; i++) {
      try {
        const hash = await contract.methods.tokenURIs(nfts[i].tokenId-1).call();
        console.log("@!khac1",hash)
        const response = await fetch(`${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${hash}?clear`);
        if (!response.ok) {
          throw new Error('Something went wrong');
        }

        const metadata = await response.json();
        const owner = await contract.methods.ownerOf(nfts[i].tokenId).call();
        collection = [{
          id: nfts[i].tokenId,
          title: metadata.properties.name.description,
          metadata: metadata.properties.metadata.description,
          demoMetadata: metadata.properties.demoMetadata.description,
          description: metadata.properties.description.description,
          coverPhoto: metadata.properties.coverPhoto.description,
          minter: metadata.properties.description.minter,
          owner: owner
        }, ...collection];

      } catch {
        toast.error("Something went wrong")
        console.error('Something went wrong');
      }
    }
    console.log("@@!",collection)
    dispatchCollectionAction({ type: 'LOADCOLLECTION', collection: collection, albums: [] });
  };
  const loadCollectionFromSearchHander = async (contract, textSearch) => {
    let collection = []
    if(!textSearch){
      loadCollectionHandler(contract,await contract.methods.totalSupply().call())
      return
    }
    const result = await request(`/api/nft/search/${textSearch}`, {}, {}, 'GET')
    for (let i = 0; i < result.nfts.length; i++) {
      try {
        const hash = await contract.methods.tokenURIs(result.nfts[i].tokenId-1).call();

        const response = await fetch(`${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${hash}?clear`);
        if (!response.ok) {
          throw new Error('Something went wrong');
        }

        const metadata = await response.json();
        const owner = await contract.methods.ownerOf(result.nfts[i].tokenId).call();

        collection = [{
          id: result.nfts[i].tokenId,
          title: metadata.properties.name.description,
          metadata: metadata.properties.metadata.description,
          demoMetadata: metadata.properties.demoMetadata.description,
          description: metadata.properties.description.description,
          coverPhoto: metadata.properties.coverPhoto.description,
          minter: metadata.properties.description.minter,
          owner: owner
        }, ...collection];

      } catch {
        toast.error("Something went wrong")
        console.error('Something went wrong');
      }
    }
    dispatchCollectionAction({ type: 'LOADCOLLECTION', collection: collection, albums: result.albums });
  };

  const updateCollectionHandler = async (contract, id, owner) => {
    let NFT;
    const hash = await contract.methods.tokenURI(id).call();
    try {
      const response = await fetch(`${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${hash}?clear`);
      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const metadata = await response.json();

      NFT = {
        id: parseInt(id),
        title: metadata.properties.name.description,
        metadata: metadata.properties.metadata.description,
        demoMetadata: metadata.properties.demoMetadata.description,
        description: metadata.properties.description.description,
        coverPhoto: metadata.properties.coverPhoto.description,
        minter: metadata.properties.description.minter,
        owner: owner
      };

    } catch {
      toast.error("Something went wrong")
      console.error('Something went wrong');
    }
    dispatchCollectionAction({ type: 'UPDATECOLLECTION', NFT: NFT });
  };

  const updateOwnerHandler = (id, newOwner) => {
    dispatchCollectionAction({ type: 'UPDATEOWNER', id: id, newOwner: newOwner });
  };

  const setNftIsLoadingHandler = (loading) => {
    dispatchCollectionAction({ type: 'LOADING', loading: loading });
  };

  const collectionContext = {
    contract: CollectionState.contract,
    totalSupply: CollectionState.totalSupply,
    collection: CollectionState.collection,
    albums: CollectionState.albums,
    nftIsLoading: CollectionState.nftIsLoading,
    loadContract: loadContractHandler,
    loadTotalSupply: loadTotalSupplyHandler,
    loadCollection: loadCollectionHandler,
    loadCollectionFromServer: loadCollectionFromServerHandler,
    loadCollectionFromSearch: loadCollectionFromSearchHander,
    updateCollection: updateCollectionHandler,
    updateOwner: updateOwnerHandler,
    setNftIsLoading: setNftIsLoadingHandler
  };

  return (
    <CollectionContext.Provider value={collectionContext}>
      {props.children}
    </CollectionContext.Provider>
  );
};

export default CollectionProvider;