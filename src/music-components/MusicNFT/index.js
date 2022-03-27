import React from 'react'
import eth from '../../img/eth.png';
import { formatPrice } from '../../helpers/utils';
const MusicNFT = ({ NFTCollection = [], marketplaceCtx }) => {

    return (<>
        <div className="grid place-items-center min-h-screen bg-gradient-to-t from-blue-200 to-indigo-900 p-5">
            <div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-200 mb-5">Explore NFT</h1>
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {NFTCollection.map((NFT, key) => {
                        const index = marketplaceCtx.offers ? marketplaceCtx.offers.findIndex(offer => offer.id === NFT.id) : -1;
                        const owner = index === -1 ? NFT.owner : marketplaceCtx.offers[index].user;
                        const price = index !== -1 ? formatPrice(marketplaceCtx.offers[index].price).toFixed(2) : null;
                        return <div key={key} className="bg-gray-900 shadow-lg rounded p-3">
                            <div className="group relative">
                                <img className="w-full block rounded" src="https://upload.wikimedia.org/wikipedia/en/f/f1/Tycho_-_Epoch.jpg" alt="" />
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
                                <audio className='w-64 m-auto' controls>
                                    <source src={`https://ipfs.infura.io/ipfs/${NFT.img}`} />
                                </audio>
                            </div>

                            <div className="p-5 flex">
                                <div >
                                    <h3 className="text-white text-lg">{NFT.title}</h3>
                                    <p className="text-gray-400">{`${NFT.owner.substr(0, 7)}...${NFT.owner.substr(NFT.owner.length - 7)}`}</p>

                                </div>
                                <div className='flex ml-20'>
                                    <span className="my-auto text-white"><b>{`${price || "unset"}`}</b></span>
                                    <img src={eth} width="42" className="bg-midnight" alt="price icon"></img>
                                </div>
                            </div>
                            {/* <div className="p-5">
                                <img src={eth} width="25" height="25" className="align-center float-start" alt="price icon"></img>
                                <p className="text-start"><b>{`${price}`}</b></p>
                            </div> */}

                        </div>
                    })}
                </section>
            </div>
        </div>

    </>)
}

export default MusicNFT