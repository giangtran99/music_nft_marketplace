import React, { useContext, useState, useEffect } from 'react'
import eth from '../../img/eth.png';
import { request } from '../../helpers/utils';
import web3 from '../../connection/web3';
import Web3Context from '../../store/web3-context';
import CollectionContext from '../../store/collection-context';
import MarketplaceContext from '../../store/marketplace-context';


const AlbumNFT = ({ AlbumList = [] }) => {
    const web3Ctx = useContext(Web3Context);
    const collectionCtx = useContext(CollectionContext);
    const marketplaceCtx = useContext(MarketplaceContext);
    const [listAlbum, setListAlbum] = useState([])
    useEffect(() => {
        request("/api/album/index", {}, {}, "GET")
            .then(response => {
                console.log("@@thuoc", response)
                setListAlbum(response)
            })
    }, [])

    return (<>
        <div className="min-h-screen bg-white p-5">
            <div>
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {listAlbum.map((album, key) => {
                        return <div key={key} className="bg-sky-100 shadow-lg rounded-2xl p-3">
                            <div className="group relative">
                                <img className="w-full block rounded" src={`https://ipfs.infura.io/ipfs/${album.album_picture}`} alt="" />
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
                            </div>

                            <div className="p-5 flex">
                                <div className="m-auto">
                                    <a href={`/album/${album.id}`}>
                                        <h3 className="italic text-black text-4xl">{album.name}</h3>
                                    </a>
                                </div>
                                
                            </div>
                            <p className="text-gray-400 text-lg text-center">{`Created by ${album.metamask_address.substr(0, 4)}...${album.metamask_address.substr(album.metamask_address.length - 5)}`}</p>

                        </div>
                    })}
                </section>
            </div>
        </div>

    </>)
}

export default AlbumNFT