
import { Action } from 'history';
import eth from '../../img/eth.png';
import React from 'react'
import { request ,formatPrice,getTokenInfowithTokenIds} from '../../helpers/utils'
import Web3Context from '../../store/web3-context';
import { CollectionIcon, ShoppingCartIcon } from '@heroicons/react/outline';
import CollectionContext from '../../store/collection-context';
import MarketplaceContext from '../../store/marketplace-context';
import { useParams } from 'react-router-dom';
import moment from 'moment'
import _ from 'lodash'

const TransactionTable = ({ type, data }) => {
    const [transactionLogs, setTransactionLogs] = React.useState([])
    const web3Ctx = React.useContext(Web3Context);
    const collectionCtx = React.useContext(CollectionContext);
    const marketplaceCtx = React.useContext(MarketplaceContext);
    const [nftInfoForTransaction,setNftInfoForTransaction] = React.useState({})
    const { id } = useParams()


    // const getTokenInfobyTransaction = async (tokenIds,collectionCtx)=>{
    //     console.log("@@tokenIds",tokenIds)
    //     const hashes =await Promise.all(tokenIds.map(async (tokenId)=>{
    //         let hash = await collectionCtx.contract.methods.tokenURIs(tokenId-1).call()
    //         return {
    //             "tokenId":tokenId,
    //             "hash":hash
    //         };
    //     }))
    //     console.log("@@alo11",hashes)
    //     const responses = await Promise.all(hashes.map(async item=>{
    //         const response = await fetch(`${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${item.hash}?clear`);
    //         if (!response.ok) {
    //           throw new Error('Something went wrong');
    //         }
    //         const metadata = await response.json();
    //         console.log("@@response",metadata)
    //         return {
    //             "id":item.tokenId,
    //             "title":metadata.properties.name.description,
    //             "coverPhoto":metadata.properties.coverPhoto.description
    //         }
    //     }))
    //     console.log("@@ao the1",responses)
    //     let result = {}
    //     responses.map(async item=>{
    //         result[`${item.id}`] = {
    //             "title":item.title,
    //             "coverPhoto":item.coverPhoto
    //         }
    //     })
    //     return result
    // } 

    const getTransactionLogsbyType = async (skip=0,limit=10) => {
        let  payload = {}
        let option  = {}
        switch (type) {
            case "userinfo":
                payload = {
                    query : `query MyQuery{transactionLogs(first:${limit},skip:${skip},where:{from:"${web3Ctx.account}"},orderBy: created_at, orderDirection: desc) {
                        id
                        eventName
                        from
                        to
                        tokenId
                        created_at
                        ethPrice
                    }}`
                }
                option = {
                    method: "POST", // or 'PUT'
                    body: JSON.stringify(payload), // data can be `string` or {object}!
                };
                const response1 = await fetch(`${process.env.REACT_APP_THE_GRAPH_URL}`, option)
                const result1 = await response1.json()

                payload = {
                    query : `query MyQuery{transactionLogs(first:${limit},skip:${skip},where:{to:"${web3Ctx.account}"},orderBy: created_at, orderDirection: desc) {
                        id
                        eventName
                        from
                        to
                        tokenId
                        created_at
                        ethPrice
                    }}`
                }
                option = {
                    method: "POST", // or 'PUT'
                    body: JSON.stringify(payload), // data can be `string` or {object}!
                };
                const response2 = await fetch(`${process.env.REACT_APP_THE_GRAPH_URL}`, option)
                const result2 = await response2.json()
    
                let mergeTransactionlogs = [...result2.data.transactionLogs,...result1.data.transactionLogs]
                const tokenIds2 = _.uniq(mergeTransactionlogs.map(item=>+item.tokenId))
                const nftInfobyTransaction2 = await getTokenInfowithTokenIds(tokenIds2,collectionCtx)
                setNftInfoForTransaction(nftInfobyTransaction2)
                return mergeTransactionlogs
            // return await request(`/api/transactionlog/get-address/${web3Ctx.account}`, {}, {}, "GET")
            case "nftinfo":
                 payload = {
                    query : `query MyQuery{transactionLogs(first:${limit},skip:${skip},where:{tokenId:${id}},orderBy: created_at, orderDirection: desc) {
                        id
                        eventName
                        from
                        to
                        tokenId
                        created_at
                        ethPrice
                    }}`
                }
                option = {
                    method: "POST", // or 'PUT'
                    body: JSON.stringify(payload), // data can be `string` or {object}!
                };
                const response = await fetch(`${process.env.REACT_APP_THE_GRAPH_URL}`, option)
                const result = await response.json()
                const tokenIds = _.uniq(result.data.transactionLogs.map(item=>+item.tokenId))
                const nftInfobyTransaction = await getTokenInfowithTokenIds(tokenIds,collectionCtx)
                setNftInfoForTransaction(nftInfobyTransaction)
                return result.data.transactionLogs
            case "creator":
                payload = {
                    query : `query MyQuery{transactionLogs(first:${limit},skip:${skip},where:{from:"${id}"},orderBy: created_at, orderDirection: desc) {
                        id
                        eventName
                        from
                        to
                        tokenId
                        created_at
                        ethPrice
                    }}`
                }
                option = {
                    method: "POST", // or 'PUT'
                    body: JSON.stringify(payload), // data can be `string` or {object}!
                };
                const response3 = await fetch(`${process.env.REACT_APP_THE_GRAPH_URL}`, option)
                const result3 = await response3.json()

                payload = {
                    query : `query MyQuery{transactionLogs(first:${limit},skip:${skip},where:{to:"${id}"},orderBy: created_at, orderDirection: desc) {
                        id
                        eventName
                        from
                        to
                        tokenId
                        created_at
                        ethPrice
                    }}`
                }
                option = {
                    method: "POST", // or 'PUT'
                    body: JSON.stringify(payload), // data can be `string` or {object}!
                };
                const response4 = await fetch(`${process.env.REACT_APP_THE_GRAPH_URL}`, option)
                const result4 = await response4.json()
                let mergeTransactionlogs4 = [...result3.data.transactionLogs,...result4.data.transactionLogs]
                const tokenIds4 = _.uniq(mergeTransactionlogs4.map(item=>+item.tokenId))
                const nftInfobyTransaction4 = await getTokenInfowithTokenIds(tokenIds4,collectionCtx)
                setNftInfoForTransaction(nftInfobyTransaction4)
                console.log("@@mergeTransactionlogs4",mergeTransactionlogs4)
                return mergeTransactionlogs4
            // return await request(`/api/transactionlog/get-address/${id}`, {}, {}, "GET")
        }
    
    }
    React.useEffect(async () => {
        const data = await getTransactionLogsbyType()
        setTransactionLogs(data)
    }, [web3Ctx.account])
 
    const getAddressIcon = (account) => {
        if (account.toUpperCase() === collectionCtx.contract._address.toUpperCase()) {
            return <CollectionIcon className='w-5 h-5 mr-2 my-auto' />
        }
        else if (account.toUpperCase() === marketplaceCtx.contract._address.toUpperCase()) {
            return <ShoppingCartIcon className='w-5 h-5 mr-2 my-auto' />
        }
        return null
    }
    console.log("@@transactionLogs",transactionLogs)
    return (<>
        {/* <div className="grid place-items-center p-2"> */}
        <div className="container px-6 py-20 mx-auto border-5 shadow-2xl">
            <h1 className="text-white-900 text-3xl title-font font-medium">Item Activity</h1>
            <table className='mt-5 max-w-7xl w-full whitespace-nowrap rounded-lg bg-gray divide-y divide-gray-300 overflow-hidden'>
                <thead className="bg-gray-200">
                    <tr className="text-black text-left">
                        <th className="font-semibold text-sm uppercase px-6 py-4"> Item </th>
                        <th className="font-semibold text-sm uppercase px-6 py-4"> Price </th>
                        <th className="font-semibold text-sm uppercase px-6 py-4 text-center"> From </th>
                        <th className="font-semibold text-sm uppercase px-6 py-4 text-center"> To </th>
                        <th className="font-semibold text-sm uppercase px-6 py-4 text-center">Time</th>
                        <th className="font-semibold text-sm uppercase px-6 py-4 text-center">Action</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-gray-200">
                    {transactionLogs.map(item => {
                        return <>
                            <tr key={item.id}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-6">
                                        <div className="inline-flex w-10 h-10"> <img className='w-10 h-10 object-cover' alt='User avatar' src={`${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${nftInfoForTransaction?.[item.tokenId]?.coverPhoto}`} /> </div>
                                        <div>
                                            <p> {nftInfoForTransaction?.[item.tokenId]?.title} </p>
                                            <p className="text-gray-500 text-sm font-semibold tracking-wide"></p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 flex">
                                    <p className="text-gray-500 text-sm font-semibold tracking-wide my-auto"> {formatPrice(+item.ethPrice)}
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
                                        class="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-orange-200 text-orange-700 rounded-full"
                                    >
                                        {moment(item.created_at*1000).format("DD/MM/YYYY hh:mm")}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div
                                        class="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-indigo-200 text-indigo-700 rounded-full"
                                    >
                                        {item.eventName}
                                    </div>
                                </td>
                            </tr>
                        </>
                    })}


                </tbody>
            </table>
        </div>
        {/* </div> */}


    </>)
}
export default TransactionTable