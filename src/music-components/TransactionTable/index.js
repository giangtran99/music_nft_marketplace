
import { Action } from 'history';
import eth from '../../img/eth.png';
import React from 'react'
import { request } from '../../helpers/utils'
import Web3Context from '../../store/web3-context';
import { CollectionIcon, ShoppingCartIcon } from '@heroicons/react/outline';
import CollectionContext from '../../store/collection-context';
import MarketplaceContext from '../../store/marketplace-context';

const TransactionTable = ({ type, data }) => {
    const [transactionLogs, setTransactionLogs] = React.useState([])
    const web3Ctx = React.useContext(Web3Context);
    const collectionCtx = React.useContext(CollectionContext);
    const marketplaceCtx = React.useContext(MarketplaceContext);


    console.log("@@transactionLogs", transactionLogs)
    const getTransactionLogsbyType = async () => {
        switch (type) {
            case "userInfo":
                return await request(`/api/transactionlog/get-address/${web3Ctx.account}`, {}, {}, "GET")
            case "nftInfo":
                return await request(`/api/transactionlog/get-tokenid/${data.id}`, {}, {}, "GET")
            default:
                return []
        }
    }
    React.useEffect(async () => {
        const data = await getTransactionLogsbyType()
        setTransactionLogs(data)
    }, [web3Ctx.account])
    // const joinTransctionLogWithToken = () => {
    //     console.log("@@nftInfo", nftInfo)
    //     if(nftInfo){
    //         return transactionLogs.map(item => {

    //             return {
    //                 ...item,
    //                 imageToken: nftInfo.coverPhoto,
    //                 nameToken: nftInfo.title
    //             }
    //         })
    //     }
    //     else{

    //     }

    // }

    const getAddressIcon = (account) => {
        console.log("@@transactionLogs11", account)
        if (account.toUpperCase() === collectionCtx.contract._address.toUpperCase()) {
            return <CollectionIcon className='w-5 h-5 mr-2 my-auto' />
        }
        else if (account.toUpperCase() === marketplaceCtx.contract._address.toUpperCase()) {
            return <ShoppingCartIcon className='w-5 h-5 mr-2 my-auto' />
        }
        return null
    }
    return (<>
        <div className="grid place-items-center p-5">
            <div className="border shadow-lg mt-2 container px-7 py-24 mx-auto">
                <h1 className="text-gray-900 text-3xl title-font font-medium">Item Activity</h1>
                <table className='mt-5 max-w-7xl w-full whitespace-nowrap rounded-lg bg-gray divide-y divide-gray-300 overflow-hidden'>
                    <thead className="bg-gray-900">
                        <tr className="text-white text-left">
                            <th className="font-semibold text-sm uppercase px-6 py-4"> Item </th>
                            <th className="font-semibold text-sm uppercase px-6 py-4"> Price </th>
                            <th className="font-semibold text-sm uppercase px-6 py-4 text-center"> From </th>
                            <th className="font-semibold text-sm uppercase px-6 py-4 text-center"> To </th>
                            <th className="font-semibold text-sm uppercase px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-gray-200">
                        {transactionLogs.map(item => {
                            return <>
                                <tr key={item.id}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-6">
                                            <div className="inline-flex w-10 h-10"> <img className='w-10 h-10 object-cover' alt='User avatar' src={`https://ipfs.infura.io/ipfs/${item.cover_photo}`} /> </div>
                                            <div>
                                                <p> {item.name} </p>
                                                <p className="text-gray-500 text-sm font-semibold tracking-wide"></p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 flex">
                                        <p className="text-gray-500 text-sm font-semibold tracking-wide my-auto"> {item.ethPrice}
                                        </p>
                                        <img width="25" height="21" src={eth} />
                                    </td>
                                    <td className="px-6 py-4 text-center"> {web3Ctx.account.toUpperCase() == item.from.toUpperCase() ?
                                        <div
                                            class="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-orange-200 text-orange-700 rounded-full"
                                        >
                                            Me
                                        </div>
                                        : <div className='inline-flex'>
                                            {getAddressIcon(item.from)}
                                            {item.from.substr(0, 7)}...{item.from.substr(item.from.length - 7)}
                                        </div>}

                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {web3Ctx.account.toUpperCase() == item.to.toUpperCase() ?
                                            <div
                                                class="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-orange-200 text-indigo-700 rounded-full"
                                            >
                                                Me
                                            </div>

                                            : <div className='inline-flex'>
                                                {getAddressIcon(item.to)}
                                                {item.to.substr(0, 7)}...{item.to.substr(item.to.length - 7)}
                                            </div>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div
                                            class="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-indigo-200 text-indigo-700 rounded-full"
                                        >
                                            {item.action}
                                        </div>
                                    </td>
                                </tr>
                            </>
                        })}


                    </tbody>
                </table>
            </div>
        </div>


    </>)
}
export default TransactionTable