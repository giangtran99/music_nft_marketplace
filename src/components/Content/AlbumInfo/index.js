import React from 'react'
import TransactionTable from "../../../music-components/TransactionTable"
import eth from '../../../img/eth.png';
import CollectionContext from '../../../store/collection-context';
import MarketplaceContext from '../../../store/marketplace-context';
import Web3Context from '../../../store/web3-context';
import { request, getTokenInfowithTokenIds, getMetdataforOwner, getOwner } from '../../../helpers/utils';
import { useParams } from 'react-router-dom';
import Modal from '../../General/Modal'
import { Avatar, Table, Popconfirm } from 'antd'
import { toast } from 'react-toastify';

const AlbumInfo = (props) => {
    const collectionCtx = React.useContext(CollectionContext);
    const marketplaceCtx = React.useContext(MarketplaceContext);
    const web3Ctx = React.useContext(Web3Context);
    const [albumInfo, setAlbumInfo] = React.useState({})
    const [nftsByAlbum, setNftsByAlbum] = React.useState([])
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [listNFTNullAlbum, setListNFTNullAlbum] = React.useState([])
    const [listNFTInfoNullAlbum, setListNFTInfoNullAlbum] = React.useState({})
    const [listNFTInfo, setListNFTInfo] = React.useState()

    const { id } = useParams();

    const getNullNFTbyAlbum = async () => {
        const payload = {
            query: `query MyQuery{nfts(where:{owner:"${web3Ctx.account}"}) {
                id,
            }}`
        }
        const option = {
            method: "POST", // or 'PUT'
            body: JSON.stringify(payload), // data can be `string` or {object}!
        };
        const response = await fetch(`${process.env.REACT_APP_THE_GRAPH_URL}`, option)
        const result = await response.json()
        const tokenIds = result.data.nfts.map(item => +item.id)
        console.log("@@result", result)
        setListNFTInfoNullAlbum(await getTokenInfowithTokenIds(tokenIds, collectionCtx))

        const nfts = await request(`/api/nft/get-nft-by-tokenid-ablum-null`, {
            "token_ids": tokenIds
        }, {}, "PUT")
        return nfts

    }
    const fetchNFTByAlbum = async () => {
        const nftByAlbum = await request(`/api/nft/album-id/${id}`, {}, {}, "GET")
        return nftByAlbum
    }

    React.useEffect(async () => {
        const album = await request(`/api/album/get/${id}`, {}, {}, "GET")
        setAlbumInfo(album)
        const NFTnullAlbum = await getNullNFTbyAlbum()
        setListNFTNullAlbum(NFTnullAlbum)
        //list nft in album

        const nftByAlbum = await fetchNFTByAlbum()
        setNftsByAlbum(nftByAlbum)
        console.log("@@nftByAlbum1", nftByAlbum)

        const tokenIds = nftByAlbum.map(item => +item.tokenId)
        setListNFTInfo(await getTokenInfowithTokenIds(tokenIds, collectionCtx))
    }, [])

    const [selectedRowKeys, setSelectedRowKeys] = React.useState([])
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
        }
    };
    const columns = [
        {
            title: 'Id',
            dataIndex: 'tokenId',
            align: "center",
            width: 20
        },
        // {
        //     title: 'Title',
        //     dataIndex: 'name',
        //     align: "center",
        // },
        {
            title: 'Item',
            dataIndex: 'cover_photo',
            align: "center",
            render: (value, record) => {
                return <>
                    <Avatar size={96} shape={"square"} src={`${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${value}`} />
                    <span className="font-bold ml-2">{record.name}</span>

                </>
            }
        },
        {
            title: 'Audio',
            dataIndex: 'Game',
            align: "center",
            render: (value, record) => {
                const realOwner = getOwner(web3Ctx.account, listNFTInfoNullAlbum[`${record.tokenId}`]?.owner, marketplaceCtx, record.tokenId)
                console.log("@!@", realOwner)
                return <>
                    <audio className='w-[600px] m-auto mt-5' controls>
                        <source src={listNFTInfoNullAlbum?.[`${record.tokenId}`]?.metadata ?
                            `${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${getMetdataforOwner(listNFTInfoNullAlbum[`${record.tokenId}`], web3Ctx.account, realOwner)}` : null} />
                    </audio>
                </>
            }
        },
    ];

    const renderAudio = (item) => {
        const ipfsHash = getMetdataforOwner(listNFTInfo[`${item.tokenId}`], web3Ctx.account, getOwner(web3Ctx.account, listNFTInfo[`${item.tokenId}`]?.owner, marketplaceCtx, item.tokenId))
        console.log("@@!", ipfsHash)

        return <>
            {ipfsHash ?
                <audio className='w-[900px] m-auto bg-gray-200' controls>
                    <source src={ipfsHash ? `${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${ipfsHash}` : null} />
                </audio>
                : null}
        </>
    }
    React.useEffect(() => { setListNFTInfo(listNFTInfo) }, [listNFTInfo])
    return (<>
        {albumInfo ?
            <>
                <Modal
                    isShowModal={modalIsOpen}
                    onClose={() => setIsOpen(false)}
                    onSubmit={async () => {
                        const result = await request(`/api/nft/update-album`, {
                            token_ids: selectedRowKeys,
                            ablum_id: +id
                        }, {}, "POST")
                        if (result) {
                            const result1 = await fetchNFTByAlbum()
                            setNftsByAlbum(result1)
                            const tokenIds = result1.map(item => +item.tokenId)
                            setListNFTInfo(await getTokenInfowithTokenIds(tokenIds, collectionCtx))
                            toast.success("Add NFT successfully")
                        }
                        else {
                            toast.error("Add NFT failed")
                        }
                    }}
                    title="Add NFT to your album"
                >
                    <Table rowKey={"tokenId"} bordered columns={columns} rowSelection={rowSelection} dataSource={listNFTNullAlbum}
                    />
                </Modal>

                <div className="bg-black-200 text-black-300 min-h-screen p-10">
                    <div className="flex border-5 p-4 shadow-lg ">
                        <img className="mr-6 h-48 w-48" src={albumInfo.album_picture ? `${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${albumInfo.album_picture}` : null} />
                        <div className="flex flex-col justify-center">
                            <h4 className="mt-0 mb-2 uppercase text-black-500 tracking-widest text-xs">Album</h4>
                            <h1 className="mt-0 mb-2 text-black text-4xl">{albumInfo.name}</h1>
                            <p className="text-black-300 mb-2 text-1xl">{albumInfo.description}</p>
                            {/* <p className="text-black-600 text-sm">Created by <a>Spotify</a> - 50 songs, 3 hr 2 min</p> */}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <div className="flex">
                            {localStorage.getItem("token") && albumInfo.metamask_address === web3Ctx.account ?
                                <button onClick={async () => {
                                    const NFTnullAlbum = await getNullNFTbyAlbum()
                                    setListNFTNullAlbum(NFTnullAlbum)
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

                    {nftsByAlbum && listNFTInfo ?
                        <div className="px-8 py-20 mt-5 border-5 shadow-2xl">
                            {/* <h1 className="text-white-900 text-3xl title-font font-medium">Item Activity</h1> */}
                            <table className='mt-7 max-w-7xl w-full whitespace-nowrap rounded-lg bg-gray divide-y divide-gray-300 overflow-hidden'>
                                {/* <thead className="bg-gray-200">
                             <tr className="text-black text-left">
                                 <th className="font-semibold text-sm uppercase px-6 py-4"> Item </th>
                                 <th className="font-semibold text-sm uppercase px-6 py-4"> Audio </th>

                                 <th className="font-semibold text-sm uppercase px-6 py-4 text-center">Action</th>
                             </tr>
                         </thead> */}

                                <tbody className="divide-y divide-gray-200 bg-gray-200">
                                    {nftsByAlbum.map(item => {
                                        return <>
                                            <tr key={item.id}>
                                                <td className="px-4 ">
                                                    <div className="flex items-center space-x-6">
                                                        <div className="inline-flex w-10 h-10"> <img className='w-10 h-10 object-cover' alt='User avatar' src={listNFTInfo?.[item.tokenId]?.coverPhoto ? `${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${listNFTInfo?.[item.tokenId]?.coverPhoto}` : null} /> </div>
                                                        <div>
                                                            <a href={`/nft/${item.tokenId}`}>
                                                                <p className="font-bold	"> {listNFTInfo?.[item.tokenId]?.title} </p>
                                                            </a>
                                                            <p className="text-gray-500 text-sm font-semibold tracking-wide"></p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 flex">
                                                    <div
                                                        class="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full"
                                                    >
                                                        {renderAudio(item)}
                                                        {/* {listNFTInfo?.[item.tokenId]?.metadata ?
                                                            <audio className='w-[900px] m-auto bg-gray-200' controls>
                                                                <source src={listNFTInfo?.[item.tokenId]?.metadata ? `${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/
                                                                ${getMetdataforOwner(listNFTInfo[`${item.tokenId}`], web3Ctx.account , getOwner(web3Ctx.account, listNFTInfo[`${item.tokenId}`]?.owner, marketplaceCtx, item.tokenId))}` : null} />
                                                            </audio>
                                                            : null} */}
                                                    </div>
                                                </td>
                                                {localStorage.getItem("token") && albumInfo.metamask_address === web3Ctx.account ?
                                                    <td className="px-6 py-4 text-center">
                                                        <div
                                                            class="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-red-400 text-red-700 rounded-full"
                                                        >
                                                            <Popconfirm className="text-black" title="Sure to remove?" onConfirm={async () => {
                                                                const result = await request(`/api/nft/update-album`, {
                                                                    token_ids: [item.tokenId],
                                                                    ablum_id: 0
                                                                }, {}, "POST")
                                                                if (result) {
                                                                    const result1 = await fetchNFTByAlbum()
                                                                    setNftsByAlbum(result1)
                                                                    const tokenIds = result1.map(item => +item.tokenId)
                                                                    setListNFTInfo(await getTokenInfowithTokenIds(tokenIds, collectionCtx))
                                                                    toast.success("Remove NFT successfully")
                                                                }
                                                                else {
                                                                    toast.error("Remove NFT failed")
                                                                }
                                                            }}>
                                                                <a>Remove</a>
                                                            </Popconfirm>
                                                        </div>
                                                    </td>
                                                    : null}
                                            </tr>
                                        </>
                                    })}
                                </tbody>
                            </table>
                        </div>
                        : null}
                </div>
            </>

            : null}
    </>)
}
export default AlbumInfo    