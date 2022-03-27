
import React from 'react'
import MusicNFT from '../MusicNFT';
import TransactionTable from '../TransactionTable';
const Profile = ({ color = "indigo", NFTs = [], Transactions = [] }) => {
    const [openTab, setOpenTab] = React.useState(1);

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
                                    <i className="fas fa-camera mr-2"></i>Edit Cover Photo
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-5xl h-full mx-auto">
                        <div className="flex flex-col space-y-2 mt-3 items-center justify-center pb-3 border-b-2">
                            <p className="text-4xl font-bold">Giang Tran</p>
                            <p className="text-sm text-gray-500">I am Software Engineer</p>
                        </div>

                        {/*start */}

                        <div className="flex flex-wrap">
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
                                            <i className="fas fa-cog text-base mr-1"></i>  Transactions
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
                                            <i className="fas fa-briefcase text-base mr-1"></i>  ...
                                        </a>
                                    </li>
                                </ul>
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                                    <div className="px-4 py-5 flex-auto">
                                        <div className="tab-content tab-space">
                                            <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                                                <MusicNFT  NFTCollection={NFTs}/>
                                            </div>
                                            <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                                                <TransactionTable />
                                            </div>
                                            <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                                                <p>
                                                    Efficiently unleash cross-media information without
                                                    cross-media value. Quickly maximize timely deliverables for
                                                    real-time schemas.
                                                    <br />
                                                    <br /> Dramatically maintain clicks-and-mortar solutions
                                                    without functional solutions.
                                                </p>
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