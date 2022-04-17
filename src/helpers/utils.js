export const DECIMALS = (10**18);

export const ether = wei => wei / DECIMALS;

export const formatPrice = (price) => {
  const precision = 100; // Use 2 decimal places

  price = ether(price);
  price = Math.round(price * precision) / precision;
   
  return price;
};

export const request = async (url, data, headers, method = 'POST') => {
  url = `${process.env.REACT_APP_URL}${url}`;
  let option = {
    method, // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: ``
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
        window.alert('Phiên làm việc hết hạn. Vui lòng đăng nhập lại');
        window.location.href = '/';
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
