import { useContext, useRef, createRef } from 'react';

import web3 from '../../../connection/web3';
import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import MarketplaceContext from '../../../store/marketplace-context';
import { formatPrice } from '../../../helpers/utils';
import eth from '../../../img/eth.png';
// import MusicNFT from '../../../music-components/MusicNFT'
import Filter from '../../../components/General/Filter'
const NFTCollection = () => {
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);
  const marketplaceCtx = useContext(MarketplaceContext);

  console.log("@@marketplaceCtx",marketplaceCtx)
  const priceRefs = useRef([]);
  if (priceRefs.current.length !== collectionCtx.collection.length) {
    priceRefs.current = Array(collectionCtx.collection.length).fill().map((_, i) => priceRefs.current[i] || createRef());
  }

  return (
    <>
    <Filter type="all"/>
    {/* <MusicNFT NFTCollection={collectionCtx.collection} marketplaceCtx={marketplaceCtx}/> */}
    </>
  );
};

export default NFTCollection;