import {
    exchangeAPIListAddOrUpdateDao,
    exchangeAPIListAddDao,
    exchangeAPIListDao,
    configDao,
    exchangeDao,
    exchangeAddDao,
    configAddOrUpdateDao,
    tradeConfigListAddOrUpdateDao,
    tradeConfigClearDao,
    tradeConfigListDao,
    orderListAddOrUpdateDao,
    orderListDao,
    lastIdOrderNewDao,
    logAddDao,
    logDao
} from "../model/common"
import xlsx from 'node-xlsx';
import { dateTimeFilter } from "@/utils/util"
import { uploadTradeOrder } from "@/service/api";
import { mainLink } from "./exchange_base";
import { sleep, min, floatAdd, floatDiv, floatSub, floatMul, paramMd5 } from "@/utils/common";
import path from 'path';
import os from 'os';
import fs from 'fs';
const ipcRenderer = require('electron').ipcRenderer;
/**
 * 下订单
 */
async function createOrderBuy(data) {
    // return //////localStorage('测试下单啦>>>>>',data)
    return new Promise(async function (resolve, reject) {
        await sleep();
        let order1 = ''
        let order2 = ''
        let orderData1 = new Object()
        orderData1.symbol = data.sellOrder.symbol
        orderData1.type = 'limit' // or 'market', other types aren't unified yet
        orderData1.side = 'sell'
        orderData1.amount = data.sellOrder.orderCount// your amount
        orderData1.price = data.sellOrder.sell_price // your price
        // overrides
        orderData1.params = {
            'stopPrice': 100000000, // no stop when sell
            'type': 'stopLimit',
        }
        let orderData2 = new Object();
        orderData2.symbol = data.buyOrder.symbol
        orderData2.type = 'limit' // or 'market', other types aren't unified yet
        orderData2.side = 'buy'
        orderData2.amount = data.buyOrder.orderCount// your amount
        orderData2.price = data.buyOrder.buy_price // your price
        // overrides
        orderData2.params = {
            'stopPrice': data.buyOrder.buy_price + 10, // +10 when buy
            'type': 'stopLimit',
        }

        try {

            if (data.buyOrder.buy_exchange.has['createOrder']) {
                order2 = await data.buyOrder.buy_exchange.createOrder(orderData2.symbol, orderData2.type, orderData2.side, orderData2.amount, orderData2.price, orderData2.params)
            }
            let allOrder = {
                buyOrder: order2
            }
            //localStorage('buyOrder----成功',order2)
            localStorage[`${new Date().getTime()}+buyOrder成功`] = JSON.stringify(order2)
            resolve(allOrder)

        } catch (e) {
            localStorage[`${new Date().getTime()}+buyOrder成功`] = JSON.stringify(e)
            //localStorage('buyOrder----失败',e)
            //////localStorage('createOrder err--------', e)
            resolve(0);
        }
    })
}
/**
 * 下订单
 */
async function createOrderSell(data) {
    // return //////localStorage('测试下单啦>>>>>',data)
    return new Promise(async function (resolve, reject) {
        await sleep();
        let order1 = '';
        let order2 = '';
        let orderData1 = new Object();
        orderData1.symbol = data.sellOrder.symbol
        orderData1.type = 'limit' // or 'market', other types aren't unified yet
        orderData1.side = 'sell'
        orderData1.amount = data.sellOrder.orderCount// your amount
        orderData1.price = data.sellOrder.sell_price // your price
        // overrides
        orderData1.params = {
            'stopPrice': 100000000, // no stop when sell
            'type': 'stopLimit',
        }
        let orderData2 = new Object();
        orderData2.symbol = data.buyOrder.symbol
        orderData2.type = 'limit' // or 'market', other types aren't unified yet
        orderData2.side = 'buy'
        orderData2.amount = data.buyOrder.orderCount// your amount
        orderData2.price = data.buyOrder.buy_price // your price
        // overrides
        orderData2.params = {
            'stopPrice': data.buyOrder.buy_price + 10, // +10 when buy
            'type': 'stopLimit',
        }

        try {
            if (data.sellOrder.sell_exchange.has['createOrder']) {
                order1 = await data.sellOrder.sell_exchange.createOrder(orderData1.symbol, orderData1.type, orderData1.side, orderData1.amount, orderData1.price, orderData1.params)
            }

            let allOrder = {
                sellOrder: order1
            }
            //localStorage('sellOrder----成功',order1)
            localStorage[`${new Date().getTime()}+sellOrder成功`] = JSON.stringify(order1)
            resolve(allOrder)

        } catch (e) {
            //////localStorage('createOrderSell err--------', e)
            //localStorage('sellOrder----失败',e)
            localStorage[`${new Date().getTime()}+sellOrder失败`] = JSON.stringify(e)
            resolve(0);
        }
    })
}

/**
 * 获取行情
 */
async function fetchOrderLocal(exchange, id, symbol) {

    return new Promise(async function (resolve, reject) {
        await sleep();
        //cancelOrder
        try {

            let res = await exchange.fetchOrder(id, symbol)

            resolve(res);

        } catch (e) {
            //////localStorage('tradeTrick--------', e)
            resolve(0);
        }
    })
}
/**
 * 撤销订单
 */
async function cancelOrder(exchange, id, symbol) {

    return new Promise(async function (resolve, reject) {
        await sleep();
        try {
            if (exchange.has['cancelOrder'] && id) {
                let res = await exchange.cancelOrder(id, symbol); // replace with your order id here (a string)
                resolve(res);
            } else {
                resolve(0);
            }
        } catch (e) {
            //console.log('cancelOrder--------', e);
            resolve(0);
        }
    })
}
/**
 * 撤销订单
 */
async function getBalance(exchange) {

    return new Promise(async function (resolve, reject) {
        await sleep();
        let account = ''
        try {
            account = await exchange.fetchBalance()
        } catch (e) {
            resolve(0)
            return
        }
        resolve(account)
    })
}

/**
 * 撤销时间范围内订单
 */
async function cancelAllNOrder(ago) {
    return new Promise(async function (resolve, reject) {
        //获取所有交易所订单
        try {
            let params = {
                type: 'undone',
                ago: ago
            }
            //获取所有未完成订单
            let allTrades = await orderList(params);
            //////localStorage(`查询到${ago}之前交易 cancelAllNOrder`, allTrades)
            resolve(allTrades);
        } catch (e) {
            //////localStorage('cancelAllNOrder--------', e);
            resolve(0);
        }

    })

}
/**
 * 撤销时间范围内订单
 */
async function queryAllOrder(exchange, data) {
    return new Promise(async function (resolve, reject) {
        //获取所有交易所订单
        try {
            let params = {
                type: 'query',
                coin: data.coin,
                status: data.status,
                ago: data.ago,
                later: data.later
            }
            //获取所有未完成订单
            let allTrades = await orderList(params);

            resolve(allTrades);
        } catch (e) {
            ////localStorage('queryAllOrder--------', e);
            resolve(0);
        }

    })

}
/**
 * 获取所有订单，并同步到服务器和本地数据库
 */
async function allNOrder(exchange1st, exchange2nd, ago) {

    return new Promise(async function (resolve, reject) {
        await sleep(200);
        //获取所有交易所订单
        try {

            let params = {
                type: 'undone',//进行中的
                ago: ago
            }

            //获取所有未完成订单
            let allTrades = await orderList(params);
            // console.log(`开始计算收益 allNOrder`, allTrades)

            if (allTrades && allTrades.data.length > 0) {
                allTrades.data.forEach(async e => {

                    let order_params = e
                    order_params.exchange_heade_pair_id = 0
                    // ////localStorage(e)
                    // let buy_params = order


                    // id:0,
                    // exchange_heade_pair_id:0,
                    // buy_order_api_id:exchange.exchange1_API_id,
                    // sell_order_api_id:exchange.exchange2_API_id,
                    // uniform: exchange.currency_pair,
                    // coin: exchange.coin,
                    // unit: exchange.unit,
                    // time_create: new Date().getTime(),
                    // amount: '0',
                    // buy_exchange: '0',
                    // buy_order_id: 0,
                    // buy_coin_balance: '0',
                    // buy_unit_balance: '0',
                    // buy_price: '0',
                    // buy_trade_money: '0',
                    // buy_amount: '0',
                    // buy_turnover: '0',
                    // buy_status: 1,
                    // buy_price_scale: 8,
                    // buy_amount_scale: 8,
                    // sell_price_scale: 8,
                    // sell_amount_scale: 8,
                    // sell_exchange: '0',
                    // sell_order_id: 0,
                    // sell_coin_balance: '0',
                    // sell_unit_balance: '0',
                    // sell_price: '0',
                    // sell_trade_money: '0',
                    // sell_amount: '0',
                    // sell_turnover: '0',
                    // sell_status: 1,
                    // income: '0',
                    // income_rate: '0',
                    // trigger_rate: '0',
                    // time_balance_buy: '0',
                    // time_balance_sell: '0',
                    // time_depth_buy: '0',
                    // time_depth_sell: '0',
                    // time_order_buy: '0',
                    // time_order_sell: '0',
                    // time_order_finish_buy: '0',
                    // time_order_finish_sell: '0',
                    // time_sync: '0',
                    // sync: 0,
                    // status:1

                    // 查询所有订单还要查收益率
                    // 买入下单价格=Q； 卖出下单价格=T； 下单数量=L； 买入成功量=S；
                    // 卖出成功量=Y； 买入成功支付的USDT量=Z； 卖出入成功收到的USDT量=X
                    // 1.单笔搬砖收益（H）：
                    // a、计算时间：本轮对冲数量全部成交，或在15分钟完成撤单后统计本次收益 b、计算公式：H=（S-Y）*（Q+T）/2+(X-Z)
                    // 2、单笔收益率(P)
                    // a、计算时间：本轮对冲数量全部成交，或在15分钟完成撤单后统计本次收益 b、计算公式：
                    // if(S＞Y），则P=H/（S*Q） if（Y＞S），则P=H/（Y*T） if（S=Y），则P=H/（L*T）
                    // 3.搬砖总收益
                    // 用户对冲的所有单笔收益累加值

                    //目标就是更新成交数量和状态和是否同步到服务器
                    //检查是否要处理，查询数据库中是否已经记录,如果没有记录就进行更新
                    // 1、计算收益率



                    // let request=
                    // {
                    //     'id': '12312321312312'
                    // }
                    // let response =
                    // {
                    //     'id':                '12345-67890:09876/54321', // 订单id
                    //     'datetime':          '2017-08-17 12:42:48.000', // ISO8601 datetime of 'timestamp' with milliseconds
                    //     'timestamp':          1502962946216, // order placing/opening Unix timestamp in milliseconds
                    //     'lastTradeTimestamp': 1502962956216, // Unix timestamp of the most recent trade on this order
                    //     'status':     'open',         // 'open', 'closed', 'canceled'
                    //     'symbol':     'ETH/BTC',      // symbol
                    //     'type':       'limit',        // 'market', 'limit'
                    //     'side':       'buy',          // 'buy', 'sell'
                    //     'price':       0.06917684,    // 下单价格
                    //     'amount':      1.5,           // 下单数量
                    //     'filled':      1.1,           // 已成交数量
                    //     'remaining':   0.4,           // 未成交数量
                    //     'cost':        0.076094524,   // 'filled' * 'price' (成交金额)
                    // }


                    // 更新到服务器  所有的删除都不会更新到服务器，只有查询时才更新到服务器
                    // let request=
                    // {
                    //     'id': '12312321312312'
                    // }
                    // let response =
                    // {
                    //     'id':                '12345-67890:09876/54321', // string
                    //     'datetime':          '2017-08-17 12:42:48.000', // ISO8601 datetime of 'timestamp' with milliseconds
                    //     'timestamp':          1502962946216, // order placing/opening Unix timestamp in milliseconds
                    //     'lastTradeTimestamp': 1502962956216, // Unix timestamp of the most recent trade on this order
                    //     'status':     'open',         // 'open', 'closed', 'canceled'
                    //     'symbol':     'ETH/BTC',      // symbol
                    //     'type':       'limit',        // 'market', 'limit'
                    //     'side':       'buy',          // 'buy', 'sell'
                    //     'price':       0.06917684,    // float price in quote currency
                    //     'amount':      1.5,           // ordered amount of base currency
                    //     'filled':      1.1,           // filled amount of base currency
                    //     'remaining':   0.4,           // remaining amount to fill
                    //     'cost':        0.076094524,   // 'filled' * 'price' (filling price used where available)
                    //     'trades':      [],         // a list of order trades/executions
                    //     'fee': {                      // fee info, if available
                    //         'currency': 'BTC',        // which currency the fee is (usually quote)
                    //         'cost': 0.0009,           // the fee amount in that currency
                    //         'rate': 0.002,            // the fee rate (if available)
                    //     },
                    //     'info':        {},              // the original unparsed order structure as is
                    // }

                    //只有一种情况不用处理，sync=1 && status !=1 
                    ////localStorage(`查询到 范围内的交易  order_params1`)


                    if (e.status != undefined && e.status != 1 && e.sync == 1) {
                        // 已经结束的订单就跳过
                    } else {
                        console.log('同步---', e)
                        //设置为已同步
                        order_params.sync = 1;
                        order_params.time_sync = new Date().getTime();
                        let e_sell = ''
                        let e_buy = ''

                        ////localStorage(`查询到 范围内的交易  order_params2`)
                        if (e.sell_order_id && e.sell_order_id != 0) {
                            await sleep();

                            let ex1 = exchange1st[e.sell_exchange] ? exchange1st[e.sell_exchange] : exchange2nd[e.sell_exchange]
                            // let ex1 =e.sell_exchange&& e.sell_exchange=='中币网'?exchange1:exchange2

                            e_sell = await fetchOrderLocal(ex1, e.sell_order_id, e.uniform)
                            console.log(e_sell)

                        }
                        if (e.buy_order_id && e.buy_order_id != 0) {
                            await sleep();

                            let ex2 = exchange1st[e.buy_exchange] ? exchange1st[e.buy_exchange] : exchange2nd[e.buy_exchange]
                            // let ex2 =e.buy_exchange&& e.buy_exchange=='中币网'?exchange1:exchange2
                            ////localStorage(`查询到 范围内的交易  ex2`, ex2)
                            e_buy = await fetchOrderLocal(ex2, e.buy_order_id, e.uniform)
                            // if (e_buy) {
                            //     e_buy.cost = e_buy && e_buy.cost ? e_buy.cost : floatMul(e_buy.filled, e_buy.price)
                            // }
                            console.log(e_buy)

                            //localStorage(`查询 e_buy,buy_order_id`, e_buy,e.buy_order_id)

                        }

                        //查到订单，更新数据
                        if (e_sell) {
                            // e_sell.cost =
                            order_params.sell_trade_money = floatMul(e_sell.filled, e_sell.price) ? String(floatMul(e_sell.filled, e_sell.price)) : 0//成交金额
                            order_params.sell_turnover = e_sell.filled//成交量

                            if (e_sell.status == 'canceled' || e_sell.status == 'closed' || e_sell.status == 'failed') {
                                order_params.sell_status = 2//失败
                            }
                            if (e_sell.amount == e_sell.filled) {
                                order_params.sell_status = 0//已完成
                                order_params.time_order_finish_sell = new Date().getTime()
                            }
                        } else {
                            // order_params.sell_status = 2//失败
                        }

                        if (e_buy) {
                            order_params.buy_trade_money = floatMul(e_buy.filled, e_buy.price) ? String(floatMul(e_buy.filled, e_buy.price)) : 0//成交金额
                            order_params.buy_turnover = e_buy.filled//成交量

                            if (e_buy.status == 'canceled' || e_buy.status == 'closed' || e_buy.status == 'failed') {
                                order_params.buy_status = 2//失败
                            }
                            if (e_buy.amount == e_buy.filled) {
                                order_params.buy_status = 0//已完成
                                order_params.time_order_finish_buy = new Date().getTime()
                            }
                        } else {
                            // order_params.buy_status = 2//失败
                        }
                        // //只要有一个失败，另一个立马撤单

                        // if(e.sell_status ==2 && e.buy_status ==1){
                        //     let b_exchange = e.buy_exchange =='中币网'?exchange1:exchange2;
                        //     let b_1 =await cancelOrder(b_exchange, e.buy_order_id, e.uniform)
                        //     // order_params.buy_status = 2
                        //     //console.log(b_1)
                        // }
                        // if(e.sell_status ==1 && e.buy_status ==2){
                        //     let s_exchange = e.sell_exchange =='中币网'?exchange1:exchange2;
                        //     await cancelOrder(s_exchange, e.sell_order_id, e.uniform)
                        // }

                        //更新完数据，更新订单的状态 0 完成 1进行中 2 失败 
                        order_params.status = 1
                        //一个完成另一个完成或者失败都是是完成
                        if ((order_params.sell_status == 0 && order_params.buy_status == 0) ||
                            (order_params.sell_status == 2 && order_params.buy_status == 0) ||
                            (order_params.sell_status == 0 && order_params.buy_status == 2)) {
                            order_params.status = 0
                        }
                        //有一个进行中就是进行中
                        if (order_params.sell_status == 1 || order_params.buy_status == 1) {
                            order_params.status = 1
                        }
                        //两个都失败了，才是失败
                        if (order_params.sell_status == 2 && order_params.buy_status == 2) {
                            order_params.status = 2
                        }

                        //更新完数据，开始计算收益和收益率

                        //计算收益和收益率
                        // 买入下单价格=Q； 卖出下单价格=T； 下单数量=L； 买入成功量=S；
                        // 卖出成功量=Y； 买入成功支付的USDT量=Z； 卖出入成功收到的USDT量=X
                        // 1.单笔搬砖收益（H）：
                        // a、计算时间：本轮对冲数量全部成交，或在15分钟完成撤单后统计本次收益 b、计算公式：H=（S-Y）*（Q+T）/2+(X-Z)
                        // 2、单笔收益率(P)
                        // a、计算时间：本轮对冲数量全部成交，或在15分钟完成撤单后统计本次收益 b、计算公式：
                        // if(S＞Y），则P=H/（S*Q） if（Y＞S），则P=H/（Y*T） if（S=Y），则P=H/（L*T）
                        // 3.搬砖总收益
                        // 用户对冲的所有单笔收益累加值
                        // floatAdd, floatDiv, floatSub, floatMul

                        let Q = order_params.buy_price
                        let T = order_params.sell_price
                        let L = order_params.amount
                        let S = order_params.buy_turnover
                        let Y = order_params.sell_turnover
                        let Z = order_params.buy_trade_money
                        let X = order_params.sell_trade_money
                        let H1 = floatSub(S, Y);
                        let H2 = floatDiv(floatAdd(Q, T), 2);
                        let H3 = floatSub(X, Z);
                        let H = floatAdd(floatMul(H1, H2), H3);
                        let P = 0
                        if (S > Y) {
                            let P1 = floatMul(S, Q)
                            P = floatDiv(H, P1)
                        }
                        if (Y > S) {
                            let P2 = floatMul(Y, T)
                            P = floatDiv(H, P2)
                        }
                        if (S = Y) {
                            let P3 = floatMul(L, T)
                            P = floatDiv(H, P3)
                        }

                        order_params.income = H;
                        order_params.income_rate = floatMul(P, 100);

                        //全部成交 0 或者15分钟撤单后 2 才开始计算
                        if (order_params.sell_status == 1 || order_params.buy_status == 1) {
                            order_params.income = 0;
                            order_params.income_rate = 0;
                        }

                        //先更新到数据库，必须要用订单号作为条件
                        await orderListAddOrUpdate(order_params)
                        let new_data = await orderList({ id: order_params.id })
                        if (new_data && new_data.data[0] && new_data.data[0].buy_order_id != 0 && new_data.data[0].sell_order_id != 0)
                            console.log('更新数据结果：new_data-------', new_data)

                        let MD5Arr = []
                        for (let i in order_params) {
                            let item = `${i}=${order_params[i]}`
                            MD5Arr.push(item)
                        }
                        ipcRenderer.send('message');
                        if(order_params.status != 1){
                            await uploadTradeOrder(paramMd5(MD5Arr));
                        }
                    }
                });
            }


            resolve(allTrades);//这里的返回，没有实际作用
        } catch (e) {
            ////localStorage('allNOrder--------', e)
            resolve([]);
        }

    })

}
/**
 * 获取所有订单
 */
async function allOrder(exchange) {
    return new Promise(async function (resolve, reject) {
        await sleep();
        //获取所有交易所订单
        try {


            //获取所有未完成订单
            let allTrades = await orderList();
            //////localStorage(`查询到全部交易 allOrder`, allTrades)
            resolve(allTrades);


        } catch (e) {
            ////////localStorage('allOrder--------',e)
            resolve([]);
        }

    })

}
/**
 * 开启主程序
 */
async function swithStatus() {
    let switchs = {
        name: 'switch'
    }
    let res = await configDao(switchs)
    // ////////localStorage('db res',res,res.length,res[0].value);
    if (res && res.length > 0) {
        return res[0].value;
    } else {
        return 'close'
    }

}

/**
 * 开启主程序
 */
async function openMain() {
    let open = {
        name: 'switch',
        value: 'open'
    }
    let res = await configAddOrUpdate(open);
    return res;
}
//初始化
async function insertExchange() {
    return new Promise(async function (resolve, reject) {
        try {
            //初始化交易所
            let data1 = {
                name: "中币网",
                rest_host: "http://api.zb.live/data",
                rest_trade_host: "https://trade.zb.live/api",
                websocket_host: "wss://api.zb.live/websocket"
            };
            let data2 = {
                name: "比特儿",
                rest_host: "https://data.gateio.life/api",
                rest_trade_host: "https://api.gateio.life/api",
                websocket_host: "wss://fx-ws.gateio.ws/v4/ws"
            };
            let exchanges = await exchange();
            if (exchanges && exchanges.length == 0) {
                await exchangeAddOrUpdate(data1);
                await exchangeAddOrUpdate(data2);
                exchanges = await exchange();
                resolve(1)
            } else {
                resolve(1)
            }
        } catch (e) {
            resolve(0)
        }
    })
}

/**
 * 关闭主程序
 */
async function closeMain() {
    let close = {
        name: 'switch',
        value: 'close'
    }
    let res = await configAddOrUpdate(close);
    return res;
}

/**
 * 获取基础配置
 */

async function config() {
    return new Promise(function (resolve, reject) {
        configDao().then((res) => {
            resolve(res);
        }).catch(e => {
            ////////localStorage('config-->>:' + e.message);
            resolve(0);
        })
    })
}

/**
 * 新增基础配置
 */

async function configAddOrUpdate(data) {
    return new Promise(function (resolve, reject) {
        configAddOrUpdateDao(data).then((res) => {
            resolve(res);
        }).catch(e => {
            ////////localStorage('configAddOrUpdate-->>:' + e.message);
            resolve(0);
        })
    })
}


/**
 * 获取本地交易所
 */

async function exchange(id) {
    return new Promise(function (resolve, reject) {
        exchangeDao(id).then((res) => {
            //查到本地交易所
            resolve(res);
        }).catch(e => {

            ////////localStorage('exchangeList-->>:' + e.message);
            resolve(0);
        })
    })
}
/**
 * 新增或更新本地交易所
 */

async function exchangeAdd(data) {
    return new Promise(function (resolve, reject) {
        exchangeAddDao(data).then((res) => {
            //查到本地交易所
            resolve(res);
        }).catch(e => {

            ////////localStorage('exchangeList-->>:' + e.message);
            resolve(0);
        })
    })
}

/**
 * 获取本地交易所API配置
 */
async function exchangeAPIList(data) {
    return new Promise(function (resolve, reject) {

        exchangeAPIListDao(data).then((res) => {
            resolve(res);
        }).catch(e => {
            ////////localStorage('exchangeAPIList-->>:' + e.message);
            resolve(0);
        })
    })
}


/**
 * 新增本地交易所API
 */
async function exchangeAPIListAddOrUpdate(data) {
    //检测为空参数
    return new Promise(function (resolve, reject) {
        exchangeAPIListAddOrUpdateDao(data).then((res) => {
            //查到本地交易所
            resolve(res);
        }).catch(e => {
            ////////localStorage('exchangeAPIListAdd-->>:' + e);
            resolve(0);
        })
    })
}
/**
 * 新增本地交易所API
 */
async function exchangeAPIListAdd(data) {
    //检测为空参数
    return new Promise(function (resolve, reject) {
        exchangeAPIListAddDao(data).then((res) => {
            //查到本地交易所
            resolve(res);
        }).catch(e => {
            ////////localStorage('exchangeAPIListAdd-->>:' + e);
            resolve(0);
        })
    })
}

/**
 * 获取对冲交易对
 */
async function tradeConfigListClear() {
    return new Promise(function (resolve, reject) {
        tradeConfigClearDao().then((res) => {
            resolve(res);
        }).catch(e => {

            ////////localStorage('tradeConfigList-->>:' + e.message);
            resolve(0);
        })
    })
}
/**
 * 获取对冲交易对
 */
async function tradeConfigList(data) {
    return new Promise(function (resolve, reject) {
        tradeConfigListDao(data).then((res) => {
            resolve(res);
        }).catch(e => {
            ////////localStorage('tradeConfigList-->>:' + e.message);
            resolve(0);
        })
    })
}
/**
 * 获取对冲交易对
 */
async function orderList(data) {
    return new Promise(function (resolve, reject) {
        orderListDao(data).then((res) => {
            resolve(res);
        }).catch(e => {
            ////localStorage('orderList-->>:' + e.message);
            resolve(0);
        })
    })
}
/**
 * 获取对冲交易对
 */
async function lastIdOrderNew(data) {
    return new Promise(function (resolve, reject) {
        lastIdOrderNewDao(data).then((res) => {
            resolve(res);
        }).catch(e => {
            ////localStorage('orderList-->>:' + e.message);
            resolve(0);
        })
    })
}


/**
 * 新增对冲交易对
 */
async function tradeConfigListAddOrUpdate(data) {
    //检测为空参数
    return new Promise(function (resolve, reject) {
        tradeConfigListAddOrUpdateDao(data).then((res) => {
            //查到本地交易所
            resolve(res);
        }).catch(e => {
            //localStorage('tradeConfigListAddOrUpdateDao-->>:' + e.message);
            resolve(0);
        })
    })
}

/**
 * 新增对冲交易对
 */
async function orderListAddOrUpdate(data) {
    //检测为空参数
    return new Promise(function (resolve, reject) {
        orderListAddOrUpdateDao(data).then((res) => {

            resolve(res);
        }).catch(e => {

            //////localStorage('orderListAddOrUpdate-->>:' + e.message);
            resolve(0);
        })
    })
}
/**
 * 新增日志
 */
async function logAdd(data) {
    //检测为空参数
    return new Promise(function (resolve, reject) {
        logAddDao(data).then((res) => {

            resolve(res);
        }).catch(e => {

            //////localStorage('orderListAddOrUpdate-->>:' + e.message);
            resolve(0);
        })
    })
}
/**
 * 读取日志
 */
async function log() {
    //检测为空参数
    return new Promise(function (resolve, reject) {
        logDao().then((res) => {

            resolve(res);
        }).catch(e => {


            resolve(0);
        })
    })
}


/**
 * 测试本地交易所API配置
 */
async function testExchangeAPI(data) {
    return new Promise(function (resolve, reject) {
        mainLink(data).then((res) => {
            resolve(res);
        }).catch(e => {
            ////////localStorage('testExchangeAPI-->>:' + e.message);
            resolve(0);
        })
    })
}
async function exportExcel() {
    return new Promise(async function (resolve, reject) {
        const docDir = path.join(os.homedir(), 'auto_hedge_pc');
        let dataArr = []
        let data = await log()
        let arr = [['deal_pair_name', 'sell_exchange', 'sell_price', 'sell_number', 'sell_query_time','sell_response_time', 'buy_exchange',
            'buy_price', 'buy_number', 'buy_query_time','buy_response_time', 'spreads', 'mean_value', 'create_time']]

        data.forEach((item, index) => {
            // deal_pair_name VARCHAR(255) NOT NULL,
            // sell_exchange VARCHAR(255) NOT NULL,
            // sell_price VARCHAR(255) NOT NULL,
            // sell_number VARCHAR(255) NOT NULL,
            // sell_query_time VARCHAR(255) NOT NULL,
            // buy_exchange VARCHAR(255) NOT NULL,
            // buy_price VARCHAR(255) NOT NULL,
            // buy_number VARCHAR(255) NOT NULL,
            // buy_query_time VARCHAR(255) NOT NULL,
            // spreads VARCHAR(255) NOT NULL,
            // create_time VARCHAR(255) NOT NULL,
            // mean_value VARCHAR(255) NOT NULL
            arr.push([item.deal_pair_name, item.sell_exchange, item.sell_price, item.sell_number,
            item.sell_query_time, item.sell_response_time,item.buy_exchange, item.buy_price, item.buy_number, item.buy_query_time, item.buy_response_time,item.spreads, item.mean_value, item.create_time])
        })
        dataArr = {
            data: arr,
            name: dateTimeFilter() // 名字不能包含 \ / ? * [ ]
        }
        console.log('xlsx----dataArr')
        if (dataArr && dataArr.length == 0) {
            return;
        }
        // 写xlsx
        var buffer = xlsx.build([dataArr])
        fs.writeFile(`${docDir}/result${dateTimeFilter()}.xlsx`, buffer, function (err) {
            if (err) {
                resolve('暂无对冲数据');
                return
            }

            console.log('Write to xls has finished');
            resolve(`${docDir}/result${dateTimeFilter()}.xlsx`);
            // 读xlsx
            //     var obj = xlsx.parse("./" + "resut.xls");
            //     console.log(JSON.stringify(obj));
        }
        );
    })
}
export {
    exportExcel,
    exchange,
    exchangeAdd,
    exchangeAPIList,
    exchangeAPIListAddOrUpdate,
    testExchangeAPI,
    configAddOrUpdate,
    config,
    swithStatus,
    openMain,
    closeMain,
    tradeConfigList,
    tradeConfigListAddOrUpdate,
    tradeConfigListClear,
    cancelOrder,
    allOrder,
    allNOrder,
    orderList,
    cancelAllNOrder,
    insertExchange,
    tradeTricks,
    orderListAddOrUpdate,
    createOrderBuy,
    createOrderSell,
    queryAllOrder,
    fetchOrderLocal,
    lastIdOrderNew,
    exchangeAPIListAdd,
    logAdd,
    getBalance
}