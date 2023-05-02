const axios = require("axios");
const config = {
  method: "get",
  url: `https://api.coingecko.com/api/v3/coins/ethereum`,
};
exports.usdCurrentPriceGet = () => {
  return axios(config)
    .then((res) => {
      return res.data.market_data.current_price.usd;
    })
    .catch((err) => {
      return err.response.data;
    });
};
