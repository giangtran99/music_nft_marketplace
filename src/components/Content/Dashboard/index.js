import React from 'react'
import Profile from '../../../music-components/Profile'
import { Segmented, Card, Statistic ,Row,Col} from 'antd'
import { UserOutlined } from '@ant-design/icons'

const Dashboard = ({ color = "red" }) => {
    const [openTab, setOpenTab] = React.useState(1);
    const [value, setValue] = React.useState('Daily');

    return (
        <>
            <Card className="shadow-lg b-4 p-5 m-5" border={true} title={<Segmented options={['Daily', 'Weekly', 'Monthly']} value={value} onChange={setValue} />}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Card>
                        <Row>
                            <Col span={12}>
                                <Statistic title="User" value={1128} prefix={<UserOutlined
                                    className="m-auto text-red-700"
                                />} />    
                            </Col>
                        </Row>



                    </Card>
                </div>
            </Card>
            {/* <Segmented options={['Daily', 'Weekly', 'Monthly']} value={value} onChange={setValue} /> */}

        </>
    );
};

export default Dashboard;