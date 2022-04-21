import { useContext, useState } from 'react';
import { Fragment } from 'react'
import Web3Context from '../../store/web3-context';
import MarketplaceContext from '../../store/marketplace-context';
import CollectionContext from '../../store/collection-context';
import NFTCollection from '../../abis/NFTCollection.json';

import web3 from '../../connection/web3';
import { formatPrice } from '../../helpers/utils';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon, SwitchHorizontalIcon } from '@heroicons/react/outline'


const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
  { name: 'Marketplace', href: '/marketplace', current: true },
  { name: 'Creator', href: '/creator', current: false },
  // { name: 'Mint', href: '/mint', current: false },
]
const userNavigation = [
  { name: 'Your Profile', href: '/userinfo' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const SearchBar = ({ collectionCtx, web3Ctx }) => {
  const [textSearch, setTextSearch] = useState()

  return (<>
    <div class="container flex mx-auto ml-20">
      <div class="flex border-2 rounded">
        <button class="flex items-center justify-center px-4 border-r">
          <svg class="w-6 h-6 text-gray-600" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z">
            </path>
          </svg>
        </button>
        <input onChange={(e) => setTextSearch(e.target.value)} onKeyDown={async event => {
          if (event.key === 'Enter') {
            const networkId = await web3Ctx.loadNetworkId(web3);
            // Load Contracts      
            const nftDeployedNetwork = NFTCollection.networks[networkId];
            const nftContract = collectionCtx.loadContract(web3, NFTCollection, nftDeployedNetwork);
            if (nftContract) {
              collectionCtx.loadCollectionFromSearch(nftContract, textSearch)
            }
          }
        }} type="text" class="px-4 py-2 w-[400px]" placeholder="Search music NFTs, Album,..." />
      </div>
    </div>
  </>)
}

const Navbar = () => {
  const [fundsLoading, setFundsLoading] = useState(false);
  console.log(fundsLoading)
  const web3Ctx = useContext(Web3Context);
  const marketplaceCtx = useContext(MarketplaceContext);
  const collectionCtx = useContext(CollectionContext);


  const connectWalletHandler = async () => {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
    }

    // Load accounts
    web3Ctx.loadAccount(web3);
  };

  const claimFundsHandler = () => {
    marketplaceCtx.contract.methods.claimFunds().send({ from: web3Ctx.account })
      .on('transactionHash', (hash) => {
        setFundsLoading(true);
      })
      .on('error', (error) => {
        window.alert('Something went wrong when pushing to the blockchain');
        setFundsLoading(false);
      });
  };

  // Event ClaimFunds subscription 
  marketplaceCtx.contract.events.ClaimFunds()
    .on('data', (event) => {
      marketplaceCtx.loadUserFunds(marketplaceCtx.contract, web3Ctx.account);
      setFundsLoading(false);
    })
    .on('error', (error) => {
      console.log(error);
    });

  let etherscanUrl;

  if (web3Ctx.networkId === 3) {
    etherscanUrl = 'https://ropsten.etherscan.io'
  } else if (web3Ctx.networkId === 4) {
    etherscanUrl = 'https://rinkeby.etherscan.io'
  } else if (web3Ctx.networkId === 5) {
    etherscanUrl = 'https://goerli.etherscan.io'
  } else {
    etherscanUrl = 'https://etherscan.io'
  }

  return (

    <div className="min-h-full border-b">
      <Disclosure as="nav" className="bg-white-600">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8"
                      src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                      alt="Workflow"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'px-3 py-2 rounded-md text-sm font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  <SearchBar collectionCtx={collectionCtx} web3Ctx={web3Ctx} />
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">

                    <button onClick={connectWalletHandler} className="mr-4 text-center p-auto text-center w-[170px] bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-3 py-2 rounded inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" viewBox="0 0 212 189"><g fill="none" fill-rule="evenodd"><polygon fill="#CDBDB2" points="60.75 173.25 88.313 180.563 88.313 171 90.563 168.75 106.313 168.75 106.313 180 106.313 187.875 89.438 187.875 68.625 178.875" /><polygon fill="#CDBDB2" points="105.75 173.25 132.75 180.563 132.75 171 135 168.75 150.75 168.75 150.75 180 150.75 187.875 133.875 187.875 113.063 178.875" transform="matrix(-1 0 0 1 256.5 0)" /><polygon fill="#393939" points="90.563 152.438 88.313 171 91.125 168.75 120.375 168.75 123.75 171 121.5 152.438 117 149.625 94.5 150.188" /><polygon fill="#F89C35" points="75.375 27 88.875 58.5 95.063 150.188 117 150.188 123.75 58.5 136.125 27" /><polygon fill="#F89D35" points="16.313 96.188 .563 141.75 39.938 139.5 65.25 139.5 65.25 119.813 64.125 79.313 58.5 83.813" /><polygon fill="#D87C30" points="46.125 101.25 92.25 102.375 87.188 126 65.25 120.375" /><polygon fill="#EA8D3A" points="46.125 101.813 65.25 119.813 65.25 137.813" /><polygon fill="#F89D35" points="65.25 120.375 87.75 126 95.063 150.188 90 153 65.25 138.375" /><polygon fill="#EB8F35" points="65.25 138.375 60.75 173.25 90.563 152.438" /><polygon fill="#EA8E3A" points="92.25 102.375 95.063 150.188 86.625 125.719" /><polygon fill="#D87C30" points="39.375 138.938 65.25 138.375 60.75 173.25" /><polygon fill="#EB8F35" points="12.938 188.438 60.75 173.25 39.375 138.938 .563 141.75" /><polygon fill="#E8821E" points="88.875 58.5 64.688 78.75 46.125 101.25 92.25 102.938" /><polygon fill="#DFCEC3" points="60.75 173.25 90.563 152.438 88.313 170.438 88.313 180.563 68.063 176.625" /><polygon fill="#DFCEC3" points="121.5 173.25 150.75 152.438 148.5 170.438 148.5 180.563 128.25 176.625" transform="matrix(-1 0 0 1 272.25 0)" /><polygon fill="#393939" points="70.313 112.5 64.125 125.438 86.063 119.813" transform="matrix(-1 0 0 1 150.188 0)" /><polygon fill="#E88F35" points="12.375 .563 88.875 58.5 75.938 27" /><path fill="#8E5A30" d="M12.3750002,0.562500008 L2.25000003,31.5000005 L7.87500012,65.250001 L3.93750006,67.500001 L9.56250014,72.5625 L5.06250008,76.5000011 L11.25,82.1250012 L7.31250011,85.5000013 L16.3125002,96.7500014 L58.5000009,83.8125012 C79.1250012,67.3125004 89.2500013,58.8750003 88.8750013,58.5000009 C88.5000013,58.1250009 63.0000009,38.8125006 12.3750002,0.562500008 Z" /><g transform="matrix(-1 0 0 1 211.5 0)"><polygon fill="#F89D35" points="16.313 96.188 .563 141.75 39.938 139.5 65.25 139.5 65.25 119.813 64.125 79.313 58.5 83.813" /><polygon fill="#D87C30" points="46.125 101.25 92.25 102.375 87.188 126 65.25 120.375" /><polygon fill="#EA8D3A" points="46.125 101.813 65.25 119.813 65.25 137.813" /><polygon fill="#F89D35" points="65.25 120.375 87.75 126 95.063 150.188 90 153 65.25 138.375" /><polygon fill="#EB8F35" points="65.25 138.375 60.75 173.25 90 153" /><polygon fill="#EA8E3A" points="92.25 102.375 95.063 150.188 86.625 125.719" /><polygon fill="#D87C30" points="39.375 138.938 65.25 138.375 60.75 173.25" /><polygon fill="#EB8F35" points="12.938 188.438 60.75 173.25 39.375 138.938 .563 141.75" /><polygon fill="#E8821E" points="88.875 58.5 64.688 78.75 46.125 101.25 92.25 102.938" /><polygon fill="#393939" points="70.313 112.5 64.125 125.438 86.063 119.813" transform="matrix(-1 0 0 1 150.188 0)" /><polygon fill="#E88F35" points="12.375 .563 88.875 58.5 75.938 27" /><path fill="#8E5A30" d="M12.3750002,0.562500008 L2.25000003,31.5000005 L7.87500012,65.250001 L3.93750006,67.500001 L9.56250014,72.5625 L5.06250008,76.5000011 L11.25,82.1250012 L7.31250011,85.5000013 L16.3125002,96.7500014 L58.5000009,83.8125012 C79.1250012,67.3125004 89.2500013,58.8750003 88.8750013,58.5000009 C88.5000013,58.1250009 63.0000009,38.8125006 12.3750002,0.562500008 Z" /></g></g></svg>
                      <span className='m-auto font-medium'>Connect Wallet</span>
                    </button>

                    <button onClick={claimFundsHandler} class="w-[100px] bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-3 py-2 rounded inline-flex items-center">
                      <SwitchHorizontalIcon className="h-4 w-4 text-blue-500" />
                      <span className='m-auto font-medium'>Claim</span>
                    </button>

                    {/* <button
                    type="button"
                    className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button> */}

                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                          <span className="sr-only">Open user menu</span>
                          <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="z-10	origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block px-3 py-2 rounded-md text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">{user.name}</div>
                    <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default Navbar;