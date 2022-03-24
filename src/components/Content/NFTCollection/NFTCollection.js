import { useContext, useRef, createRef } from 'react';

import web3 from '../../../connection/web3';
import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import MarketplaceContext from '../../../store/marketplace-context';
import { formatPrice } from '../../../helpers/utils';
import eth from '../../../img/eth.png';

const NFTCollection = () => {
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);
  const marketplaceCtx = useContext(MarketplaceContext);

  const priceRefs = useRef([]);
  if (priceRefs.current.length !== collectionCtx.collection.length) {
    priceRefs.current = Array(collectionCtx.collection.length).fill().map((_, i) => priceRefs.current[i] || createRef());
  }

  const makeOfferHandler = (event, id, key) => {
    event.preventDefault();

    const enteredPrice = web3.utils.toWei(priceRefs.current[key].current.value, 'ether');

    collectionCtx.contract.methods.approve(marketplaceCtx.contract.options.address, id).send({ from: web3Ctx.account })
      .on('transactionHash', (hash) => {
        marketplaceCtx.setMktIsLoading(true);
      })
      .on('receipt', (receipt) => {
        marketplaceCtx.contract.methods.makeOffer(id, enteredPrice).send({ from: web3Ctx.account })
          .on('error', (error) => {
            window.alert('Something went wrong when pushing to the blockchain');
            marketplaceCtx.setMktIsLoading(false);
          });
      });
  };

  const buyHandler = (event) => {
    const buyIndex = parseInt(event.target.value);
    marketplaceCtx.contract.methods.fillOffer(marketplaceCtx.offers[buyIndex].offerId).send({ from: web3Ctx.account, value: marketplaceCtx.offers[buyIndex].price })
      .on('transactionHash', (hash) => {
        marketplaceCtx.setMktIsLoading(true);
      })
      .on('error', (error) => {
        window.alert('Something went wrong when pushing to the blockchain');
        marketplaceCtx.setMktIsLoading(false);
      });
  };

  const cancelHandler = (event) => {
    const cancelIndex = parseInt(event.target.value);
    marketplaceCtx.contract.methods.cancelOffer(marketplaceCtx.offers[cancelIndex].offerId).send({ from: web3Ctx.account })
      .on('transactionHash', (hash) => {
        marketplaceCtx.setMktIsLoading(true);
      })
      .on('error', (error) => {
        window.alert('Something went wrong when pushing to the blockchain');
        marketplaceCtx.setMktIsLoading(false);
      });
  };

  const products = [
    {
      id: 1,
      name: 'Basic Tee',
      href: '#',
      imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
      imageAlt: "Front of men's Basic Tee in black.",
      price: '$35',
      color: 'Black',
    },
    {
      id: 2,
      name: 'Basic Tee',
      href: '#',
      imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
      imageAlt: "Front of men's Basic Tee in black.",
      price: '$35',
      color: 'Black',
    },
  ]

  return (
    <>
  <div className="h-screen w-screen bg-blue-darkest flex items-center justify-center text-hard-white font-outfit">
      <div className="card bg-blue-darker w-80 flex items-center justify-between flex-col rounded-xl p-6 shadow-2xl ">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <img
              src="/images/image-equilibrium.jpg"
              alt="Equilibrium"
              className="rounded-xl"
            />
            <div className="opacity-0 hover:opacity-100 transition duration-150 absolute top-0 left-0 w-full h-full bg-hard-cyan/50 z-10 rounded-xl flex items-center justify-center cursor-pointer">
              <img src="/images/icon-view.svg" alt="" />
            </div>
          </div>
          <div>
            <p className="text-xl mb-3 font-bold hover:text-hard-cyan transition duration-150 cursor-pointer">
              Equilibrium #3429
            </p>
            <p className="text-soft-blue font-light">
              Our Equilibrium collection promotes balance and calm.
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center justify-center gap-1.5 font-bold text-hard-cyan/90">
              <img src="/images/icon-ethereum.svg" alt="" />
              <p>0.041 ETH</p>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-soft-blue">
              <img src="/images/icon-clock.svg" alt="" />
              <p>3 days left</p>
            </div>
          </div>
        </div>
        <hr className="text-blue-dark w-full mt-5 mb-4" />
        <div className="flex items-center justify-start w-full gap-3">
          <div>
            <img
              src="/images/image-avatar.png"
              className="w-7 outline rounded-full outline-1 outline-white"
              alt=""
            />
          </div>
          <div>
            <p className="text-soft-blue font-light">
              Creation of{' '}
              <span className="text-hard-white hover:text-hard-cyan transition duration-150 cursor-pointer">
                Jules Wyvern
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
    // <div className="row text-center">
    //   {collectionCtx.collection.map((NFT, key) => {
    //     const index = marketplaceCtx.offers ? marketplaceCtx.offers.findIndex(offer => offer.id === NFT.id) : -1;
    //     const owner = index === -1 ? NFT.owner : marketplaceCtx.offers[index].user;
    //     const price = index !== -1 ? formatPrice(marketplaceCtx.offers[index].price).toFixed(2) : null;

    //     return(
    //       <div key={key} className="col-md-3 m-3 pb-3 card border-info">
    //         <div className={"card-body"}>       
    //           <h5 className="card-title">{NFT.title}</h5>
    //         </div>
    //         <audio controls>
    //         <source src={`https://ipfs.infura.io/ipfs/${NFT.img}`} type="audio/ogg"/>
    //         </audio>
    //         {/* <img src={`https://ipfs.infura.io/ipfs/${NFT.img}`} className="card-img-bottom" alt={`NFT ${key}`} />                          */}
    //         <p className="fw-light fs-6">{`${owner.substr(0,7)}...${owner.substr(owner.length - 7)}`}</p>
    //         {index !== -1 ?
    //           owner !== web3Ctx.account ?
    //             <div className="row">
    //               <div className="d-grid gap-2 col-5 mx-auto">
    //                 <button onClick={buyHandler} value={index} className="btn btn-success">BUY</button>
    //               </div>
    //               <div className="col-7 d-flex justify-content-end">
    //                 <img src={eth} width="25" height="25" className="align-center float-start" alt="price icon"></img>                
    //                 <p className="text-start"><b>{`${price}`}</b></p>
    //               </div>
    //             </div> :
    //             <div className="row">
    //               <div className="d-grid gap-2 col-5 mx-auto">
    //                 <button onClick={cancelHandler} value={index} className="btn btn-danger">CANCEL</button>
    //               </div>
    //               <div className="col-7 d-flex justify-content-end">
    //                 <img src={eth} width="25" height="25" className="align-center float-start" alt="price icon"></img>                
    //                 <p className="text-start"><b>{`${price}`}</b></p>
    //               </div>
    //             </div> :
    //           owner === web3Ctx.account ?              
    //             <form className="row g-2" onSubmit={(e) => makeOfferHandler(e, NFT.id, key)}>                
    //               <div className="col-5 d-grid gap-2">
    //                 <button type="submit" className="btn btn-secondary">OFFER</button>
    //               </div>
    //               <div className="col-7">
    //                 <input
    //                   type="number"
    //                   step="0.01"
    //                   placeholder="ETH..."
    //                   className="form-control"
    //                   ref={priceRefs.current[key]}
    //                 />
    //               </div>                                  
    //             </form> :
    //             <p><br/></p>}
    //       </div>
    //     );
    //   })}
    // </div>
  );
};

export default NFTCollection;