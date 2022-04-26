import { toast } from "react-toastify";
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
    if (window.debug) console.log(`[RESPONSE]`, url, rs);
    switch (res.status) {
      case 401:
        toast.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại');
        break;
      case 500:
        toast.error('Có lỗi xảy ra !');
        break;
      case 200:
        return rs;
      default:
        throw rs;
    }
  } catch (err) {
    console.log('res', res, err);
    throw err;
  }
};
