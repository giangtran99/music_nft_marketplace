import { toast } from "react-toastify";
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js/core';
export const DECIMALS = (10 ** 18);


export const ether = wei => wei / DECIMALS;

export const formatPrice = (price) => {
  const precision = 100; // Use 2 decimal places

  price = ether(price);
  price = Math.round(price * precision) / precision;

  return price;
};

export const getOwner = (currentAddress, OwnerAddress, marketplaceCtx, tokenId) => {
  if (marketplaceCtx.contract._address === OwnerAddress) {
    const index = marketplaceCtx.offers ? marketplaceCtx.offers.findIndex(offer => offer.id == tokenId) : -1;
    const ownerOnOffer = index === -1 ? "anonymous" : marketplaceCtx.offers[index].user;
    return ownerOnOffer
  }
  else {
    return currentAddress === OwnerAddress ? currentAddress : OwnerAddress
  }
}
export const request = async (url, data, headers, method = 'POST') => {
  url = `${process.env.REACT_APP_URL}${url}`;
  let option = {
    method, // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${localStorage.getItem("token")}`
    }
  };
  option.headers = Object.assign({}, option.headers, headers);
  if (method === 'GET') delete option.body;

  if (window.debug) console.log(`[${method}]`, url, option);

  // helper.showLoading();
  let res = await fetch(url, option);

  // helper.hideLoading();
  try {
    let rs = await res.json();
    switch (res.status) {
      case 401:
        toast.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại');
        break;
      case 500:
        toast.error('Please connect metamask wallet!');
        break;
      case 200:
        return rs;
      default:
        throw rs;
    }
    if (window.debug) console.log(`[RESPONSE]`, url, rs);
  } catch (err) {
    toast.error('System is busy !');
    console.log('res', res, err);
    throw err;
  }
};

export const getTokenInfowithTokenIds= async (tokenIds,collectionCtx)=>{
  console.log("@@tokenIds",tokenIds)
  const hashes =await Promise.all(tokenIds.map(async (tokenId)=>{
      let hash = await collectionCtx.contract.methods.tokenURIs(tokenId-1).call()
      return {
          "tokenId":tokenId,
          "hash":hash
      };
  }))
  const responses = await Promise.all(hashes.map(async item=>{
      const response = await fetch(`${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${item.hash}?clear`);
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      const metadata = await response.json();
      const owner = await collectionCtx.contract.methods.ownerOf(item.tokenId).call();

      console.log("@@ky vay",metadata)
      return {
          "id":item.tokenId,
          "title":metadata.properties.name.description,
          "coverPhoto":metadata.properties.coverPhoto.description,
          "metadata":metadata.properties.metadata.description,
          "demoMetadata":metadata.properties.demoMetadata.description,
          "owner":owner
      }
  }))
  let result = {}
  responses.map(async item=>{
      result[`${item.id}`] = {
          "title":item.title,
          "coverPhoto":item.coverPhoto,
          "metadata":item.metadata,
          "demoMetadata":item.demoMetadata,
          "owner":item.owner,

      }
  })
  return result
} 

export const getMetdataforOwner = (NFT,currentAccount,realOwner)=>{
  
  try{
   if(currentAccount === realOwner && NFT.metadata){
       let bytes = AES.decrypt(NFT.metadata, process.env.REACT_APP_AES_KEY) 
       let decryptedData = bytes.toString(enc.Utf8);
       console.log("@@rea",decryptedData)
       return decryptedData
   }
   return NFT.demoMetadata
  }
  catch(err){
      toast.error(err)
      return null
  }
 
}
