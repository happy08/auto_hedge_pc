var ccxt = require('ccxt');
import {
    exchange,
    exchangeAPIList
} from "./common";
import { sleep } from '../utils/common';
 
async function mainLink(data) {
    let exchanges = await exchange(data.id);
    if (exchanges && exchanges.length > 0) {
        data.public = exchanges[0].rest_host;
        data.private = exchanges[0].rest_trade_host;
    }
    let exchangeId = 'zb'
        , exchangeClass = ''
        , exchangeNow = '',
        urls = {
            'logo': 'https://user-images.githubusercontent.com/1294454/32859187-cd5214f0-ca5e-11e7-967d-96568e2e2bd1.jpg',
            'api': {
                'public': data.public, // no https for public API
                'private': data.private,
            },
            'www': 'https://www.zb.live',
            'doc': 'https://www.zb.live/i/developer',
            'fees': 'https://www.zb.live/i/rate',
        };

    if (data && data.id == 2) {
        exchangeId = 'gateio';
        urls = {
            'logo': 'https://user-images.githubusercontent.com/1294454/31784029-0313c702-b509-11e7-9ccc-bc0da6a0e435.jpg',
            'api': {
                'public': data.public, // no https for public API
                'private': data.private,
            },
            'www': 'https://gateio.life/',
            'doc': 'https://gateio.life/api2',
            'fees': [
                'https://gateio.life/fee',
                'https://support.gateio.life/hc/en-us/articles/115003577673',
            ],
            'referral': 'https://www.gateio.life/signup/2436035',
        }
    };
    if (data && data.id == 3) {
        exchangeId = 'okex3'
        urls = {
            'api': data.public
        }
    }

    return new Promise(async (resolve, reject) => {
        let APIarr = await exchangeAPIList({ user_id: data.user_id, exchange_id: data.id });
        if (data.user_id && APIarr.length > 0 && !data.test && data.main) {
            //检查api
            let checkApi = 1;
            if (!APIarr[0].key || !APIarr[0].secret) {
                checkApi = 0;
            }
            if(data.id==3){
                data.pwd = '';
            }
            if(data.id==3 && !APIarr[0].pwd){
                checkApi = 0;
            }
            if(data.id==3 && APIarr[0].pwd){
                data.pwd = APIarr[0].pwd;
            }
            data.key = APIarr[0].key;
            data.secret = APIarr[0].secret;
            
            if (!checkApi) {
                resolve(2);
                return;
            }
        }

        await sleep(200);//这里请求了两个接口要等待0.2秒

        try {
                exchangeClass = ccxt[exchangeId]
                let linkData = {
                    'timeout': 60000,
                    'enableRateLimit': true,
                    'rateLimit': 10000,
                    'options': {
                        'createMarketBuyOrderRequiresPrice': false, // switch off
                        'adjustForTimeDifference': true
                    },
                    // 'verbose': true,
                    'urlsNew': urls
                }
                if (data && data.key && data.secret) {
                    linkData.apiKey = data.key
                    linkData.secret = data.secret
                }
                if(data.pwd){
                    linkData.password = data.pwd
                }
                exchangeNow = new exchangeClass(linkData)
                // console.log(data && (data.test || !data.main))
                if (data && (data.test || !data.main)) {
                    await sleep(100)
                    await exchangeNow.fetchBalance()
                }
           
            resolve(exchangeNow);
        } catch (e) {
            if (e.message.indexOf('timed out') > 0) {
                resolve(33);
            }
            resolve(0);
        }
    });
}

export {
    mainLink
}