import React from 'react'
import TransactionTable from "../../../music-components/TransactionTable"
import eth from '../../../img/eth.png';
import CollectionContext from '../../../store/collection-context';
import MarketplaceContext from '../../../store/marketplace-context';
import Web3Context from '../../../store/web3-context';
import { request } from '../../../helpers/utils';
import { useParams } from 'react-router-dom';
import Modal from '../../General/Modal'

const AlbumInfo = (props) => {
    const collectionCtx = React.useContext(CollectionContext);
    const marketplaceCtx = React.useContext(MarketplaceContext);
    const web3Ctx = React.useContext(Web3Context);
    const [albumInfo, setAlbumInfo] = React.useState()
    const [nftsByAlbum, setNftsByAlbum] = React.useState([])
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const { id } = useParams();

    const getNFTbyAlbum = async ()=>{
        const nfts = await request(`/api/nft/album-id/${id}`, {}, {}, "GET")
        const cids = nfts.map(item=>item.cid)
        const nftInfoIPFS = await Promise.all(cids.map(async (hash)=> {
          const result = await request(`${process.env.REACT_APP_IPFS_URL}/ipfs/${hash}?clear`)
          console.log("@@result",result)
          return {
              [`${hash}`]:{
                  metadata:result.metadata.description
              }
          }
        }))
        const nftMerge = cids.map(item=>{
            return {...item,["metadata"]:nftInfoIPFS[`${item.cid}`].metadata}
        })
       console.log("@@nftMerge",nftInfoIPFS)

    }
    React.useEffect(async () => {
        // console.log("@@new contract",await marketplaceCtx.contract.methods.tokensByOwner(web3Ctx.account).call())
        const album = await request(`/api/album/get/${id}`, {}, {}, "GET")
        setAlbumInfo(album)
        getNFTbyAlbum()
    }, [])

    return (<>
        {albumInfo ?
            <>
                <Modal
                    isShowModal={modalIsOpen}
                    onClose={() => setIsOpen(false)}
                    title="Add NFT to your album"
                >

                </Modal>

                <div className="bg-black-200 text-black-300 min-h-screen p-10">
                    <div className="flex border p-2 shadow-lg	bg-gray-100">
                        <img className="mr-6 h-48 w-48" src={`${process.env.REACT_APP_IPFS_URL}/ipfs/${albumInfo.album_picture}`} />
                        <div className="flex flex-col justify-center">
                            <h4 className="mt-0 mb-2 uppercase text-black-500 tracking-widest text-xs">Album</h4>
                            <h1 className="mt-0 mb-2 text-black text-4xl">{albumInfo.name}</h1>
                            <p className="text-black-300 mb-2 text-1xl">{albumInfo.description}</p>
                            {/* <p className="text-black-600 text-sm">Created by <a>Spotify</a> - 50 songs, 3 hr 2 min</p> */}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <div className="flex">
                            {localStorage.getItem("token") ?
                                <button onClick={() => {
                                    setIsOpen(true)
                                }} className="mr-2 bg-indigo-500 text-green-100 block py-2 px-8 rounded-full">Add NFTs
                                </button> : null}
                            {/* <button className="mr-2 border border-black block p-2 rounded-full">...</button> */}
                        </div>
                        <div className="text-black-600 text-sm tracking-widest text-right">
                            <h5 className="mb-1">Likes</h5>
                            <p>5,055</p>
                        </div>
                    </div>

                    <div className="mt-10 border p-2 shadow-lg bg-gray-100">

                        <div className="flex text-black-600">
                            <div className="p-2 w-8 flex-shrink-0"></div>
                            <div className="p-2 w-8 flex-shrink-0"></div>
                            <div className="p-2 w-full">Title</div>
                            <div className="p-2 w-full">Artist</div>
                            <div className="p-2 w-full">Album</div>
                            <div className="p-2 w-12 flex-shrink-0 text-right">⏱</div>
                        </div>

                        <div className="flex border-b border-black-800 hover:bg-gray-200">
                            <div className="p-3 w-8 flex-shrink-0">▶️</div>
                            <div className="p-3 w-8 flex-shrink-0">❤️</div>
                            <div className="p-3 w-full">My Song Here</div>
                            <div className="p-3 w-full">Eminem</div>
                            <div className="p-3 w-full">Spotify</div>
                            <div className="p-3 w-12 flex-shrink-0 text-right">5:35</div>
                        </div>

                    </div>
                </div>
            </>

            : null}
    </>)
}
export default AlbumInfo    