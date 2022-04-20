
import eth from '../../img/eth.png';

const TransactionTable = () => {
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
                            <th className="font-semibold text-sm uppercase px-6 py-4"></th>
                        </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-gray-200 bg-gray-200">
                        <tr>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-6">
                                    <div className="inline-flex w-10 h-10"> <img className='w-10 h-10 object-cover' alt='User avatar' src='https://i.picsum.photos/id/737/200/200.jpg?hmac=YPktyFzukhcmeW3VgULbam5iZTWOMXfwf6WIBPpJD50' /> </div>
                                    <div>
                                        <p> Maps </p>
                                        <p className="text-gray-500 text-sm font-semibold tracking-wide">Maroon 5</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-6 flex">
                                <p className="text-gray-500 text-sm font-semibold tracking-wide my-auto"> 3
                                </p>
                                <img width="25" height="21" src={eth} />
                            </td>
                            <td className="px-6 py-4 text-center"> xxx </td>
                            <td className="px-6 py-4 text-center"> xxx </td>
                            <td className="px-6 py-4 text-center">Sale</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    </>)
}
export default TransactionTable