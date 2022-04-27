import React, { useContext, useRef, createRef } from 'react'
import eth from '../../img/eth.png';
import { formatPrice, getOwner, request } from '../../helpers/utils';
import web3 from '../../connection/web3';
import Web3Context from '../../store/web3-context';
import CollectionContext from '../../store/collection-context';
import MarketplaceContext from '../../store/marketplace-context';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom'


const MusicNFT = ({ type }) => {
    const web3Ctx = useContext(Web3Context);
    const collectionCtx = useContext(CollectionContext);
    const marketplaceCtx = useContext(MarketplaceContext);
    const { id } = useParams()

    const priceRefs = useRef([]);
    if (priceRefs.current.length !== collectionCtx.collection.length) {
        priceRefs.current = Array(collectionCtx.collection.length).fill().map((_, i) => priceRefs.current[i] || createRef());
    }

    const getAddressbyType = (_type) => {
        switch (_type) {
            case "userinfo":
                return web3Ctx.account
            case "creator":
                return id
            default:
                return true
        }
    }

    const isShowNFT = (_type, owner) => {
        switch (_type) {
            case "userinfo":
                return owner === web3Ctx.account ? true : false
            case "creator":
                return owner === id ? true : false
            default:
                return true
        }
    }


    const getAlbumbyAccount = (_type) => {
        switch (_type) {
            case "userinfo":
                return collectionCtx.albums.filter(album => album.metamask_address === web3Ctx.account)
            case "creator":
                return collectionCtx.albums
            default:
                return collectionCtx.albums
        }
    }

    const makeOfferHandler = (event, id, key) => {
        event.preventDefault();
        try {
            const enteredPrice = web3.utils.toWei(priceRefs.current[key].current.value, 'ether');
            collectionCtx.contract.methods.approve(marketplaceCtx.contract.options.address, id).send({ from: web3Ctx.account })
                .on('transactionHash', async (hash) => {

                })
                .on('receipt', (receipt) => {
                    marketplaceCtx.contract.methods.makeOffer(id, enteredPrice).send({ from: web3Ctx.account })
                        .on('transactionHash', async (hash) => {
                            if (hash) {
                                const receipt = await web3.eth.getTransactionReceipt(hash)
                                // console.log("@@vui buon0",web3.utils.hexToNumber(receipt.logs[0].topics[0]))
                                const tokenId = web3.utils.hexToNumber(receipt.logs[0].topics[3])
                                request('/api/transactionlog/create', {
                                    action: "Make Offer",
                                    from: receipt.from,
                                    to: receipt.to,
                                    ethPrice: +priceRefs.current[key].current.value,
                                    tokenId: tokenId
                                }, {}, 'POST')
                                marketplaceCtx.setMktIsLoading(true);
                                toast.success("Make offer is succeed")
                                return
                            }
                            toast.error("Make offer failed")

                        })
                        .on('error', (error) => {
                            toast.error('Something went wrong when pushing to the blockchain');
                            marketplaceCtx.setMktIsLoading(false);
                        });
                });
        }
        catch (e) {
            toast.error("Price can not empty !")
        }

    };

    return (
        <>
            {collectionCtx.collection.length > 0 ?
                <div className={`min-h-screen bg-white p-5`}>
                    <div>
                        {/* <h1 className="text-2xl sm:text-2xl md:text-5xl font-bold text-black-200 mb-5">NFTs</h1> */}
                        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {collectionCtx.collection.map((NFT, key) => {
                                const index = marketplaceCtx.offers ? marketplaceCtx.offers.findIndex(offer => offer.id === NFT.id) : -1;
                                const owner = index === -1 ? NFT.owner : marketplaceCtx.offers[index].user;
                                const price = index !== -1 ? formatPrice(marketplaceCtx.offers[index].price).toFixed(2) : null;
                                const realOwner = getOwner(getAddressbyType(type), NFT.owner, marketplaceCtx, NFT.id)
                                const isShow = isShowNFT(type, realOwner)
                                return isShow ? (<div key={key} className="bg-gray-900 shadow-lg rounded p-3">
                                    <div className="group relative">
                                        <img className="m-auto w-68 block rounded" src={NFT.coverPhoto ? `https://ipfs.infura.io/ipfs/${NFT.coverPhoto}` : 'https://upload.wikimedia.org/wikipedia/en/f/f1/Tycho_-_Epoch.jpg'} alt="" />
                                        <div className="absolute bg-black rounded bg-opacity-0 group-hover:bg-opacity-60 w-full h-full top-0 flex items-center group-hover:opacity-100 transition justify-evenly">
                                            <button className="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                                                    <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                                </svg>
                                            </button>

                                            <button className="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                                                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                                </svg>
                                            </button>
                                        </div>
                                        <audio className='w-64 m-auto mt-5' controls>
                                            <source src={`https://ipfs.infura.io/ipfs/${NFT.metadata}`} />
                                        </audio>
                                    </div>

                                    <div className="p-4 flex">
                                        <div >
                                            <a href={`/nft/${NFT.id}`}>
                                                <h3 className="text-white text-lg">{NFT.title.length > 7 ? `${NFT.title.split(' ')[0]}...` : NFT.title}</h3>
                                            </a>
                                            <p className="text-gray-400 text-xs">{realOwner !== web3Ctx.account ? `Owned by ${realOwner.substr(0, 2)}...${realOwner.substr(realOwner.length - 4)}` : "Owned by me"}</p>

                                        </div>
                                        <div className='flex ml-auto'>
                                            <span className="my-auto text-white text-xs"><b>{`${price || "Not listed"}`}</b></span>
                                            <img src={eth} className="bg-midnight m-auto h-[36px] w-[36px]" alt="price icon"></img>
                                        </div>
                                    </div>
                                    {!price && type === "userinfo" && realOwner === web3Ctx.account ?
                                        <div class="flex items-center border-b border-teal-500 py-2">
                                            <input ref={priceRefs.current[key]} class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none" type="number" placeholder="Set price your NFT" aria-label="Full name" />
                                            <button onClick={(e) => makeOfferHandler(e, NFT.id, key)} class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
                                                Offer
                                            </button>
                                        </div>
                                        : null}
                                </div>
                                ) : null
                            })}
                        </section>
                    </div>
                </div>
                : null}
        </>)
}

export default MusicNFT