
import { Action } from 'history';
import eth from '../../img/eth.png';
import React from 'react'
import { request, formatPrice, getTokenInfowithTokenIds } from '../../helpers/utils'
import Web3Context from '../../store/web3-context';
import { CollectionIcon, ShoppingCartIcon } from '@heroicons/react/outline';
import CollectionContext from '../../store/collection-context';
import MarketplaceContext from '../../store/marketplace-context';
import { useParams } from 'react-router-dom';
import moment from 'moment'
import { Table, Avatar } from "antd"
import _ from 'lodash'

const TransactionTable = ({ type, data }) => {
    const [transactionLogs, setTransactionLogs] = React.useState([])
    const web3Ctx = React.useContext(Web3Context);
    const collectionCtx = React.useContext(CollectionContext);
    const marketplaceCtx = React.useContext(MarketplaceContext);
    const [nftInfoForTransaction, setNftInfoForTransaction] = React.useState({})
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

    const getTransactionLogsbyType = async (skip = 0, limit = 10) => {
        let payload = {}
        let option = {}
        switch (type) {
            case "userinfo":
                payload = {
                    query: `query MyQuery{transactionLogs(where:{from:"${web3Ctx.account}"},orderBy: created_at, orderDirection: desc) {
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
                    query: `query MyQuery{transactionLogs(where:{to:"${web3Ctx.account}"},orderBy: created_at, orderDirection: desc) {
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

                let mergeTransactionlogs = [...result2.data.transactionLogs, ...result1.data.transactionLogs]
                const tokenIds2 = _.uniq(mergeTransactionlogs.map(item => +item.tokenId))
                const nftInfobyTransaction2 = await getTokenInfowithTokenIds(tokenIds2, collectionCtx)
                setNftInfoForTransaction(nftInfobyTransaction2)
                return mergeTransactionlogs
            // return await request(`/api/transactionlog/get-address/${web3Ctx.account}`, {}, {}, "GET")
            case "nftinfo":
                payload = {
                    query: `query MyQuery{transactionLogs(where:{tokenId:${id}},orderBy: created_at, orderDirection: desc) {
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
                const tokenIds = _.uniq(result.data.transactionLogs.map(item => +item.tokenId))
                const nftInfobyTransaction = await getTokenInfowithTokenIds(tokenIds, collectionCtx)
                setNftInfoForTransaction(nftInfobyTransaction)
                return result.data.transactionLogs
            case "creator":
                payload = {
                    query: `query MyQuery{transactionLogs(where:{from:"${id}"},orderBy: created_at, orderDirection: desc) {
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
                    query: `query MyQuery{transactionLogs(where:{to:"${id}"},orderBy: created_at, orderDirection: desc) {
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
                let mergeTransactionlogs4 = [...result3.data.transactionLogs, ...result4.data.transactionLogs]
                const tokenIds4 = _.uniq(mergeTransactionlogs4.map(item => +item.tokenId))
                const nftInfobyTransaction4 = await getTokenInfowithTokenIds(tokenIds4, collectionCtx)
                setNftInfoForTransaction(nftInfobyTransaction4)
                console.log("@@mergeTransactionlogs4", mergeTransactionlogs4)
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
            width: 200,
            render: (value, record) => {
                return <>
                    <Avatar size={96} shape={"square"} src={`${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${nftInfoForTransaction?.[record.tokenId]?.coverPhoto}`} />
                    <span className="font-bold ml-2">{nftInfoForTransaction?.[record.tokenId]?.title}</span>

                </>
            }
        },
        {
            title: 'ETH Price',
            dataIndex: 'ethPrice',
            width: 20,
            render: (value) => {
                return <>
                    <div className="px-6 py-6 flex">
                        <p className="text-gray-500 text-sm font-semibold tracking-wide my-auto"> {formatPrice(+value)}
                        </p>
                        <img width="25" height="21" src={eth} />
                    </div>

                </>
            }
        },
        {
            title: 'From',
            dataIndex: 'from',
            align: "center",
            width: 20,
            render: (from) => {
                return <>
                    {web3Ctx.account.toUpperCase() == from.toUpperCase() ?
                        <div
                            class="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-orange-200 text-orange-700 rounded-full"
                        >
                            Me
                        </div>
                        : <div className='inline-flex'>
                            {getAddressIcon(from)}
                            {from.substr(0, 7)}...{from.substr(from.length - 7)}
                        </div>}
                </>
            }
        },
        {
            title: 'To',
            dataIndex: 'to',
            align: "center",
            width: 20,
            render: (to) => {
                return <>
                    {web3Ctx.account.toUpperCase() == to.toUpperCase() ?
                        <div
                            class="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-orange-200 text-indigo-700 rounded-full"
                        >
                            Me
                        </div>

                        : <div className='inline-flex'>
                            {getAddressIcon(to)}
                            {to.substr(0, 7)}...{to.substr(to.length - 7)}
                        </div>}
                </>
            }
        },
        {
            title: 'Time',
            dataIndex: 'created_at',
            align: "center",
            width: 20,
            render: (time) => {
                return <>
                    <div
                        class="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-orange-200 text-orange-700 rounded-full"
                    >
                        {moment(time * 1000).format("DD/MM/YYYY hh:mm")}
                    </div>
                </>
            }
        },
        {
            title: 'Event',
            dataIndex: 'eventName',
            align: "center",
            width: 20,
            filters: [
                {
                  text: 'Safe Mint',
                  value: 'safe mint',
                },
                {
                  text: 'Make Offer',
                  value: 'make offer',
                },
                {
                    text: 'Buy',
                    value: 'buy',
                  },
            ],
            render: (eventName) => {
                return <>
                    <div
                        class="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-indigo-200 text-indigo-700 rounded-full"
                    >
                        {eventName}
                    </div>
                </>
            }
        },

    ];
    return (<>
        <Table dataSource={transactionLogs} columns={columns} size="small" pagination={{ pageSize: 5 }}/>
    </>)
}
export default TransactionTable