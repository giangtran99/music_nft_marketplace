import React from 'react'
import Profile from '../../../music-components/Profile'
import { Segmented, Card, Statistic, Row, Col } from 'antd'
import { UserOutlined, CommentOutlined, BookOutlined ,PlaySquareOutlined} from '@ant-design/icons'
import { request } from '../../../helpers/utils';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Brush,
    AreaChart,
    Area,
    ResponsiveContainer,
} from 'recharts';
import moment from 'moment'
import _ from 'lodash'
import { getMonth, getYear, getQuarter } from '../../../helpers/date';


const Dashboard = ({ color = "red" }) => {
    const [openTab, setOpenTab] = React.useState(1);
    const [value, setValue] = React.useState('Monthly');
    const [dashboardInfo, setDashboardInfo] = React.useState(0)
    const [quanityOfNFT,setQuantityfNft] = React.useState(0)
    const [chartNftMint,setChartNftMint] = React.useState([])
    const [chartNftBought,setChartNftBought] = React.useState([])


    console.log("@@chartNftMint",chartNftMint)
    const getMetric = (metric) => {
        switch (metric) {
            case "Yearly":
                return getYear()
            case "Quarterly":
                return getQuarter()
            case "Monthly":
                return getMonth()
        }
    }
    React.useEffect(async () => {
        let metric = getMetric(value)
        const result = await request(`/api/reports/dashboard?from=${moment(metric.start).format("YYYY-MM-DD")}&&to=${moment(metric.end).format("YYYY-MM-DD")}`, {
        }, {}, "GET")
        setDashboardInfo(result)

        let payload = {
            query: `query MyQuery{transactionLogs(orderBy:created_at,orderDirection:asc,where: {created_at_gte: ${metric.start.getTime() / 1000},created_at_lte: ${metric.end.getTime() / 1000},eventName_contains:"Mint"}) {
                id
                eventName
                from
                to
                tokenId
                created_at
                ethPrice
            }}`
        }
        let option = {
            method: "POST", // or 'PUT'
            body: JSON.stringify(payload), // data can be `string` or {object}!
        };
        const response4 = await fetch(`${process.env.REACT_APP_THE_GRAPH_URL}`, option)
        const result4 = await response4.json()
        setQuantityfNft(result4.data.transactionLogs.length)
        const dataMint = handleData(result4.data.transactionLogs,value)
        setChartNftMint(dataMint)
        ///
        payload = {
            query: `query MyQuery{transactionLogs(orderBy:created_at,orderDirection:asc,where: {created_at_gte: ${metric.start.getTime() / 1000},created_at_lte: ${metric.end.getTime() / 1000},eventName_contains:"Buy"}) {
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
        setQuantityfNft(result4.data.transactionLogs.length)
        const dataBought = handleData(result1.data.transactionLogs,value)
        setChartNftBought(dataBought)
    }, [value])


    const handleData = (data,metric)=>{
        // console.log("@@dung",data)

        const convertDate = data.map(item=>{
            let timestamp =item.created_at*1000
            return {
                month: moment(timestamp).format("MMMM"),
                day : moment(timestamp).format("DD-MM-YYYY"),
                quarter : `Quarter ${moment(new Date(timestamp)).quarter()}`,
                tokenId:item.tokenId
            }
        })
        let result = []
        switch (metric) {
            case "Yearly":
                const groupByMonth = _.groupBy(convertDate,(item)=>item.month)
                result = Object.keys(groupByMonth).map(item=>{
                    return {
                        created_at:item,
                        quantity:groupByMonth[item].length,
                    }
                })
                return result
            case "Quarterly":
                const groupByQuarter = _.groupBy(convertDate,(item)=>item.quarter)
                result = Object.keys(groupByQuarter).map(item=>{
                    return {
                        created_at:item,
                        quantity:groupByQuarter[item].length,
                    }
                })
                return result
            case "Monthly":
                const groupByDay = _.groupBy(convertDate,(item)=>item.day)
                result = Object.keys(groupByDay).map(item=>{
                    return {
                        created_at:item,
                        quantity:groupByDay[item].length,
                    }
                })
                console.log("@@groupByDay",result)
                return result
        }
    }

    return (
        <>
            <h1 className="text-white-900 text-3xl title-font font-medium mt-5 ml-10">Dashboard</h1>

            <Card className="shadow-lg b-4 p-5 m-5" border={true} title={<Segmented options={['Quarterly', 'Yearly', 'Monthly']} value={value} onChange={setValue} />}>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">

                    <Card>
                        <Statistic title="User" value={dashboardInfo?.user_count} prefix={<UserOutlined
                            className="m-auto text-red-700"
                        />} />
                    </Card>


                    <Card>
                        <Statistic title="Comments" value={dashboardInfo?.comment_count} prefix={<CommentOutlined
                            className="m-auto text-indigo-700"
                        />} />
                    </Card>

                    <Card>
                        <Statistic title="Albums" value={dashboardInfo?.album_count} prefix={<BookOutlined
                            className="m-auto text-yellow-700"
                        />} />
                    </Card>
                    <Card>
                        <Statistic title="NFTs" value={quanityOfNFT} prefix={<PlaySquareOutlined
                            className="m-auto text-orange-700"
                        />} />
                    </Card>






                </div>
              

                <Card className="mt-5" title="Quanity of NFT is minted">
                    <ResponsiveContainer className="mt-10" width="100%" height={200}>
                        <LineChart
                            width={500}
                            height={200}
                            data={chartNftMint}
                            // syncId="id"
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="created_at"/>
                            <YAxis dataKey="quantity" />
                            <Tooltip />
                            <Line type="monotone" dataKey="quantity" stroke="#8884d8" fill="#8884d8" />
                            <Line dataKey="created_at" stroke="#8884d8" fill="#8884d8" />

                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="mt-5" title="Quantiy of NFT is bought">

<ResponsiveContainer className="mt-10" width="100%" height={200}>
    <LineChart
        width={500}
        height={200}
        data={chartNftBought}
        // syncId="id"
        margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
        }}
    >
         <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="created_at"/>
        <YAxis dataKey="quantity" />
        <Tooltip />
        <Line type="monotone" dataKey="quantity" stroke="#8884d8" fill="#8884d8" />
        <Line dataKey="created_at" stroke="#8884d8" fill="#8884d8" />

    </LineChart>
</ResponsiveContainer>
</Card>
            </Card>
            
            
            {/* <Segmented options={['Daily', 'Weekly', 'Monthly']} value={value} onChange={setValue} /> */}

        </>
    );
};

export default Dashboard;