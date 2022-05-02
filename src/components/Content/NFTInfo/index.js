import React from 'react'
import TransactionTable from "../../../music-components/TransactionTable"
import eth from '../../../img/eth.png';
import CollectionContext from '../../../store/collection-context';
import MarketplaceContext from '../../../store/marketplace-context';
import Web3Context from '../../../store/web3-context';
import { formatPrice ,getOwner,request} from '../../../helpers/utils';
import web3 from '../../../connection/web3'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const NFTInfo = (props) => {

    const collectionCtx = React.useContext(CollectionContext);
    const marketplaceCtx = React.useContext(MarketplaceContext);
    const web3Ctx = React.useContext(Web3Context);
    const [nftInfo, setNFTInfo] = React.useState()
    const [price, setPrice] = React.useState()
    const { id } = useParams();
    const index = marketplaceCtx.offers ? marketplaceCtx.offers.findIndex(offer => offer.id == id) : -1;

  
    const getNFTPrice = () => {
        const price = index !== -1 ? formatPrice(marketplaceCtx.offers[index].price).toFixed(2) : null;
        setPrice(price)
    }

    // React.useEffect(async ()=>{
    //     const response = await request(`/api/transactionlog/get-tokenid/${id}`,{},{},"GET")
    //     setTransactionLogs(response)
    // },[])
    React.useEffect(async () => {
        if (collectionCtx.collection.length > 0) {
            const owner = await collectionCtx.contract.methods.ownerOf(id).call()
            setNFTInfo({...collectionCtx.collection.filter(NFT => NFT.id == id)[0],["owner"]:getOwner(web3Ctx.account,owner,marketplaceCtx,id)})
        }
    }, [collectionCtx.collection.length])

    React.useEffect(() => {
        getNFTPrice()
    }, [nftInfo,index])

    const buyHandler = (event) => {
        const buyIndex = parseInt(event.target.value);
        marketplaceCtx.contract.methods.fillOffer(marketplaceCtx.offers[buyIndex].offerId).send({ from: web3Ctx.account, value: marketplaceCtx.offers[buyIndex].price })
            .on('transactionHash',async (hash) => {
                if(hash){
                    const receipt = await web3.eth.getTransactionReceipt(hash)
                    const tokenId = web3.utils.hexToNumber(receipt.logs[0].topics[3])
                    request('/api/transactionlog/create',{
                        action:"Buy",
                        from:receipt.from,
                        to:receipt.to,
                        ethPrice:+formatPrice(marketplaceCtx.offers[index].price).toFixed(2),
                        tokenId:tokenId
                      },{},'POST')
            
                    marketplaceCtx.setMktIsLoading(true);
                    toast.success("Buy action is success ")
                    return
                }
                toast.error("Buy action is failed ")
  
            })
            .on('error', (error) => {
                toast.error('Something went wrong when pushing to the blockchain');
                marketplaceCtx.setMktIsLoading(false);
            });
    };

    // console.log("@@web3Ctx.account",web3Ctx.account,nftInfo.owner)

    return (<>
        {nftInfo ?
            <section className="text-gray-700 body-font overflow-hidden">
                <div className="border-5 shadow-2xl mt-5 container px-7 py-24 mx-auto">
                    <div className="lg:w-3/5 m-auto flex flex-wrap">

                        <div key={""} className="bg-white-900 shadow-2xl rounded p-3">
                            <div className="group relative">
                                <img className="m-auto w-72 block rounded" src={nftInfo.coverPhoto ? `${process.env.REACT_APP_IPFS_URL}/ipfs/${nftInfo.coverPhoto}` : "https://upload.wikimedia.org/wikipedia/en/f/f1/Tycho_-_Epoch.jpg"} alt="" />
                                <div className="absolute bg-white rounded bg-opacity-0 group-hover:bg-opacity-60 w-full h-full top-0 flex items-center group-hover:opacity-100 transition justify-evenly">
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
                                <audio className='mt-5 w-64 m-auto' controls>
                                    <source src={`${process.env.REACT_APP_IPFS_URL}/ipfs/${nftInfo.metadata}`} />
                                </audio>
                            </div>

                            {/* <div className="p-5 flex">
                                <div >
                                    <h3 className="text-white text-lg">{""}</h3>
                                    <p className="text-gray-400">{`${""}`}</p>

                                </div>
                                <div className='flex ml-20'>
                                    <span className="my-auto text-white"><b>{`${null || "unset"}`}</b></span>
                                    <img src={eth} width="42" className="bg-midnight" alt="price icon"></img>
                                </div>
                            </div> */}

                        </div>


                        <div className="lg:w-1/2 w-full lg:pl-32 lg:py-6 mt-6 lg:mt-0">
                            <h1 className="font-extrabold text-gray-900 text-4xl title-font font-lg mb-1">{nftInfo.title}</h1>
                            <span className="italic text-gray-900 title-font text-base">{getOwner(web3Ctx.account,nftInfo.owner,marketplaceCtx,id) !== web3Ctx.account  ? `Owned by ${getOwner(web3Ctx.account,nftInfo.owner,marketplaceCtx,id).substring(0, 4)}...${getOwner(web3Ctx.account,nftInfo.owner,marketplaceCtx,id).substring(getOwner(web3Ctx.account,nftInfo.owner,marketplaceCtx,id).length - 4)}`:"Owned by me"}</span>
                            <div className="flex mb-46 mt-10">
                                <span className="flex items-center">
                                    <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-red-500" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-red-500" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-red-500" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-red-500" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-red-500" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                </span>
                                <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200">
                                    4 Reviews
                                    {/* <a className="text-gray-500">
                                        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                        </svg>
                                    </a>
                                    <a className="ml-2 text-gray-500">
                                        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                        </svg>
                                    </a>
                                    <a className="ml-2 text-gray-500">
                                        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                        </svg>
                                    </a> */}
                                </span>
                            </div>
                            <p className="leading-relaxed">{nftInfo.description}</p>
                            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">


                            </div>
                            <div className="flex mt-20">
                                <div className='flex'>
                                    <span className="my-auto text-black"><b>{`${price || "Not listed"}`}</b></span>
                                    <img src={eth} width={38} height={28} className="bg-midnight" alt="price icon"></img>
                                </div>
                               {price && getOwner(web3Ctx.account,nftInfo.owner,marketplaceCtx,id) !== web3Ctx.account ? <button onClick={buyHandler} value={index} className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Buy</button>:null}
                                {/* <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                                    <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                                    </svg>
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
                <TransactionTable type="nftinfo" data={nftInfo}/>
            </section>
            : null}
    </>)
}
export default NFTInfo