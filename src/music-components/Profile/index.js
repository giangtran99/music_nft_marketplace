
import React from 'react'
import MusicNFT from '../MusicNFT';
import AlbumNFT from '../AlbumNFT';
import CollectionContext from '../../store/collection-context';
import MarketplaceContext from '../../store/marketplace-context';
import Web3Context from '../../store/web3-context';
import TransactionTable from '../TransactionTable';
import { PlusIcon, CollectionIcon } from '@heroicons/react/outline'
import Filter from '../../components/General/Filter';
import { request } from '../../helpers/utils';
import { useParams } from 'react-router-dom';
const Profile = ({ color = "indigo", NFTs = [], Transactions = [] ,type}) => {
    // const userInfo = JSON.parse(localStorage.getItem("user"))
    const [openTab, setOpenTab] = React.useState(1);
    const collectionCtx = React.useContext(CollectionContext);
    const web3Ctx = React.useContext(Web3Context);
    const marketplaceCtx = React.useContext(MarketplaceContext);
    const [userInfo,setUserInfo] = React.useState([])
    const {id} = useParams()

    const getUsetInfobyType = async ()=>{
        switch(type){
            case "userinfo":
            const userInfo = JSON.parse(localStorage.getItem("user"))
            return userInfo
            case "creator":
            const result = await request(`/api/users/get-user-by-metamask/${id}`,{},{},"GET")
            return result
            default:
            return {}
        }
    }

    React.useEffect(async ()=>{
        const userInfo = await getUsetInfobyType()
        setUserInfo(userInfo)
    },[])

    return (<>
        <div className="w-full h-full">
            <div className="w-full h-auto shadow bg-white rounded-md">
                <div className="h-full mx-auto bg-white">
                    <div
                        className="h-96 max-h-96 w-full relative"
                        style={{
                            backgroundImage: `url('https://picsum.photos/720')`,
                        }}
                    >
                        <div
                            className="absolute w-full flex items-center justify-center"
                            style={{ bottom: '-15px' }}
                        >
                            <div className="w-44 h-44 rounded-full bg-gray-300 border-4 border-white">
                                <img
                                    className="w-full h-full rounded-full"
                                    src="https://picsum.photos/200"
                                    alt="dp"
                                />
                            </div>
                            <div className="absolute" style={{ bottom: 30, right: 30 }}>
                                <button className="focus:outline-none px-3 py-2 hover:bg-gray-50 font-semibold bg-white rounded-md">
                                    <i className="fas fa-camera mr-1"></i>Edit Cover Photo
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-7xl h-full mx-auto">
                        <div className="flex flex-col space-y-2 mt-3 items-center justify-center pb-3 border-b-2">
                        <p className="text-4xl font-bold mt-4">{userInfo?.name || "New User"}</p>
                            <p className="text-2xl mt-2 font-mono">{userInfo?.metamask_address?.substr(0,7)}...{userInfo?.metamask_address?.substr(userInfo?.metamask_address?.length - 7)}</p>
                            <p className="text-xl text-gray-500">{userInfo?.description || "Write your description"}</p>
                            {/* <p className="text-sm text-gray-600 font-bold">Address Wallet : {web3Ctx.account}</p> */}
                        </div>

                        {/*start */}
                        <div>
                            <div className='text-right mt-10'>
                                <a className='m-auto' href='/mint'>
                                    <button class="w-[160px] bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                                        <PlusIcon className="h-5 w-5 text-blue-500" />
                                        <span className='m-auto'>Mint NFT</span>
                                    </button>
                                </a>
                                <a className='m-auto' href='/create-album'>
                                    <button class="ml-[20px] w-[160px] bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                                        <CollectionIcon className="h-5 w-5 text-blue-500" />
                                        <span className='m-auto'>New Album</span>
                                    </button>
                                </a>
                            </div>
                            <div className="mt-10 flex flex-wrap">
                                <div className="w-full">
                                    <ul
                                        className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                                        role="tablist"
                                    >
                                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                                            <a
                                                className={
                                                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                                    (openTab === 1
                                                        ? "text-white bg-" + color + "-600"
                                                        : "text-" + color + "-600 bg-white")
                                                }
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setOpenTab(1);
                                                }}
                                                data-toggle="tab"
                                                href="#link1"
                                                role="tablist"
                                            >
                                                <i className="fas fa-space-shuttle text-base mr-1"></i> NFTs
                                            </a>
                                        </li>
                                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                                            <a
                                                className={
                                                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                                    (openTab === 2
                                                        ? "text-white bg-" + color + "-600"
                                                        : "text-" + color + "-600 bg-white")
                                                }
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setOpenTab(2);
                                                }}
                                                data-toggle="tab"
                                                href="#link2"
                                                role="tablist"
                                            >
                                                <i className="fas fa-cog text-base mr-1"></i>  Albums
                                            </a>
                                        </li>
                                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                                            <a
                                                className={
                                                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                                    (openTab === 3
                                                        ? "text-white bg-" + color + "-600"
                                                        : "text-" + color + "-600 bg-white")
                                                }
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setOpenTab(3);
                                                }}
                                                data-toggle="tab"
                                                href="#link3"
                                                role="tablist"
                                            >
                                                <i className="fas fa-briefcase text-base mr-1"></i>  Transactions
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                                    <div className="px-4 py-5 flex-auto">
                                        <div className="tab-content tab-space">
                                            <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                                                <Filter type={type} />
                                            </div>
                                            <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                                                <AlbumNFT type={type}/>
                                            </div>
                                            <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                                                <TransactionTable type={type}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end  */}
                    </div>
                </div>
            </div>
            {/* After bio content */}

        </div>
    </>)
}

export default Profile