
import { sleep, min, floatAdd, floatDiv, floatSub, floatMul, paramMd5, getVip } from "@/utils/common"
import { record } from "@/utils/hedgeLog"
import { dateTimeFilter,subStringNum } from "@/utils/util"
import { uploadTradeOrder } from "@/service/api"
import { orderListAddOrUpdate, cancelOrder, lastIdOrderNew, closeMain, swithStatus, tradeConfigList, allNOrder, createOrderSell, createOrderBuy, cancelAllNOrder, logAdd, getBalance } from "./common"
import { mainLink } from "./exchange_base"
const ipcRenderer = require('electron').ipcRenderer
let timeX, timeSignal = ''
let time1 = ''
let time2 = ''
let time1x = ''
let time1xx = ''
let time2x = ''
let time2xx = ''
let fee_rate = 0
let count_rate = 0.002
 
//错误字典 如果字典中记录有异常 就不再发送消息 哪里发生的异常哪里解决
let dictionary = {}

//取消全部订单
async function cancelPendingOrders(exchange) {
    return new Promise(async function (resolve, reject) {
        try {
            let all1 = {
                exchange: exchange.exchangeLink1,
                symbol: exchange.currency_pair
            }
            all1[exchange.exchange1] = exchange.exchangeLink1
            let all2 = {
                exchange: exchange.exchangeLink2,
                symbol: exchange.currency_pair
            }
            all1[exchange.exchange2] = exchange.exchangeLink2
            let all1Trades = await cancelAllNOrder()

            // 撤单成功或者不成功，都不处理
            if (all1Trades && all1Trades.data && all1Trades.data.length > 0) {
                all1Trades.data.forEach(async e => {
                    let exchange_e = all1.exchange
                    if (e.sell_status == 1 && e.sell_order_id) {
                        if (e.sell_exchange == '比特儿') {
                            exchange_e = exchange[e.sell_exchange]
                        }
                        if (exchange_e.has['cancelOrder']) {
                            await sleep(100)
                            await cancelOrder(exchange_e, e.sell_order_id, e.uniform) // replace with your order id here (a string)
                        }
                    }
                    if (e.buy_status == 1 && e.buy_order_id) {
                        if (e.buy_exchange == '比特儿') {
                            exchange_e = exchange[e.buy_exchange]
                        }
                        if (exchange_e.has['cancelOrder']) {
                            await sleep(100)
                            await cancelOrder(exchange_e, e.buy_order_id, e.uniform) // replace with your order id here (a string)
                        }
                    }
                })
            }
            let mins0 = 0 * 60 * 1000
            await allNOrder(all1, all2, mins0)
            resolve(1)
        } catch (e) {
            resolve(0)
        }
    })
}
function getOrderBook1(exchange) {

    return new Promise(async function (resolve, reject) {
        await sleep()
        time1xx = dateTimeFilter()
        let exchangePrice = await exchange.exchangeLink1.fetchOrderBook(exchange.currency_pair)
        time1 = new Date().getTime()
        time1x = dateTimeFilter()
        resolve(exchangePrice)
    })
}
function getOrderBook2(exchange) {

    return new Promise(async function (resolve, reject) {
        await sleep()
        time2xx = dateTimeFilter()
        let exchangePrice = await exchange.exchangeLink2.fetchOrderBook(exchange.currency_pair)
        time2 = new Date().getTime()
        time2x = dateTimeFilter()
        resolve(exchangePrice)
    })
}

// buy Bids
// sell Ask

//计算将要下单的价格
async function getPriceAndAmount(exchange) {
    count_rate = exchange.spread
    console.log('----exchange.spread',exchange.spread)
    return new Promise(async function (resolve, reject) {
        Promise.all([getOrderBook1(exchange), getOrderBook2(exchange)]).then(async function ([exchange1Price, exchange2Price]) {
            //这里写等这两个ajax都成功返回数据才执行的业务逻辑
            let orderCount = 0
            let exchange1_buy_price = exchange1Price && exchange1Price.bids && exchange1Price.bids.length > 0 ? exchange1Price.bids[0][0] : 0
            let exchange1_buy_amount = exchange1Price && exchange1Price.bids && exchange1Price.bids.length > 0 ? exchange1Price.bids[0][1] : 0
            let exchange1_buycount = exchange1_buy_amount
            let exchange1_sell_price = exchange1Price && exchange1Price.asks && exchange1Price.asks.length > 0 ? exchange1Price.asks[0][0] : 0
            let exchange1_sell_amount = exchange1Price && exchange1Price.asks && exchange1Price.asks.length > 0 ? exchange1Price.asks[0][1] : 0
            let exchange1_sellcount = exchange1_sell_amount
            let exchange2_buy_price = exchange2Price && exchange2Price.bids && exchange2Price.bids.length > 0 ? exchange2Price.bids[0][0] : 0
            let exchange2_buy_amount = exchange2Price && exchange2Price.bids && exchange2Price.bids.length > 0 ? exchange2Price.bids[0][1] : 0
            let exchange2_buycount = exchange2_buy_amount
            let exchange2_sell_price = exchange2Price && exchange2Price.asks && exchange2Price.asks.length > 0 ? exchange2Price.asks[0][0] : 0
            let exchange2_sell_amount = exchange2Price && exchange2Price.asks && exchange2Price.asks.length > 0 ? exchange2Price.asks[0][1] : 0
            let exchange2_sellcount = exchange2_sell_amount
            let judge1 = floatSub(exchange2_buy_price, exchange1_sell_price)
            let judge2 = floatMul(floatAdd(exchange2_buy_price, exchange1_sell_price), count_rate)
            let judge3 = floatSub(exchange1_buy_price, exchange2_sell_price)
            let judge4 = floatMul(floatAdd(exchange1_buy_price, exchange2_sell_price), count_rate)
            let buy_exchange = ''
            let buy_price = ''
            let buy_count = ''
            let sell_exchange = ''
            let sell_price = ''
            let sell_count = ''
            let buy_exchange_id = ''
            let sell_exchange_id = ''
            let sell_coin_balance = ''
            let sell_unit_balance = ''
            let buy_coin_balance = ''
            let buy_unit_balance = ''
            let buy_exchange_name = ''
            let sell_exchange_name = ''
            let time_depth_buy = ''
            let time_depth_sell = ''
            let allRs = {
                account2_coin : exchange.account2_coin,
                account2_unit : exchange.account2_unit,
                account1_coin : exchange.account1_coin,
                account1_unit : exchange.account1_unit,
                exchange1_buy_price: exchange1_buy_price,
                exchange1_buy_amount: exchange1_buy_amount,
                exchange1_buycount: exchange1_buycount,
                exchange1_sell_price: exchange1_sell_price,
                exchange1_sell_amount: exchange1_sell_amount,
                exchange1_sellcount: exchange1_sellcount,
                exchange2_buy_price: exchange2_buy_price,
                exchange2_buy_amount: exchange2_buy_amount,
                exchange2_buycount: exchange2_buycount,
                exchange2_sell_price: exchange2_sell_price,
                exchange2_sell_amount: exchange2_sell_amount,
                exchange2_sellcount: exchange2_sellcount,
                judge1: judge1,
                judge2: judge2,
                judge3: judge3,
                judge4: judge4
            }
            timeSignal = new Date().getTime()
            console.log(`计算价格 币种${exchange.coin} 对冲条件结果-----`, allRs, '---耗时---', (timeSignal - timeX) / 1000, '秒', '---时间---', dateTimeFilter(), '---查到时间1---', time1x, '---查到时间2---', time2x)
            let rd1 = {
                deal_pair_name: exchange.currency_pair,
                sell_exchange: exchange.exchange1,
                sell_price: exchange1_sell_price,
                sell_number: exchange1_sell_amount,
                sell_query_time: time1xx,
                sell_response_time: time1x,
                buy_exchange: exchange.exchange2,
                buy_price: exchange2_buy_price,
                buy_number: exchange2_buy_amount,
                buy_query_time: time2xx,
                buy_response_time: time2x,
                spreads: judge1,
                create_time: dateTimeFilter(),
                mean_value: judge2
            }
            let rd2 = {
                deal_pair_name: exchange.currency_pair,
                sell_exchange: exchange.exchange2,
                sell_price: exchange2_sell_price,
                sell_number: exchange2_sell_amount,
                sell_query_time: time2xx,
                sell_response_time: time2x,
                buy_exchange: exchange.exchange1,
                buy_price: exchange1_buy_price,
                buy_number: exchange1_buy_amount,
                buy_query_time: time1xx,
                buy_response_time: time1x,
                spreads: judge3,
                create_time: dateTimeFilter(),
                mean_value: judge4
            }
          
            //计算价格
            if (judge1 > judge2) {
                sell_coin_balance = exchange.account2_coin
                sell_unit_balance = exchange.account2_unit
                buy_coin_balance = exchange.account1_coin
                buy_unit_balance = exchange.account1_unit
                buy_exchange_name = exchange.exchange1
                sell_exchange_name = exchange.exchange2
                time_depth_buy = time1
                time_depth_sell = time2
                sell_count = exchange2_sellcount
                buy_count = exchange1_buycount
                sell_exchange = exchange.exchangeLink2
                buy_exchange = exchange.exchangeLink1
                buy_exchange_id = exchange.exchange1_API_id
                sell_exchange_id = exchange.exchange2_API_id
                buy_price = exchange1_buy_price
                sell_price = exchange2_sell_price

                if (!exchange.account1_unit) {
                    let msg = {
                        msg: '未读取到资产，请到交易所补充',
                        exchange: {
                            exchange: exchange.exchange1,
                            pair: exchange.currency_pair
                        }
                    }
                    dictionary[`${exchange.exchange1}${exchange.currency_pair}`] = 1
                    ipcRenderer.send('message', msg)
                    // window.warn("价格不成立 退出");
                    resolve(0)
                    return
                } else {
                    dictionary[`${exchange.exchange1}${exchange.currency_pair}`] = 0
                }

                if (!exchange.account2_coin) {
                    let msg = {
                        msg: '未读取到资产，请到交易所补充',
                        exchange: {
                            exchange: exchange.exchange2,
                            pair: exchange.currency_pair
                        }
                    }
                    dictionary[`${exchange.exchange2}${exchange.currency_pair}`] = 1
                    ipcRenderer.send('message', msg)
                    // window.warn("价格不成立 退出");
                    resolve(0)
                    return
                } else {
                    dictionary[`${exchange.exchange2}${exchange.currency_pair}`] = 0
                }

            } else if (judge3 > judge4) {
                sell_coin_balance = exchange.account1_coin
                sell_unit_balance = exchange.account1_unit
                buy_coin_balance = exchange.account2_coin
                buy_unit_balance = exchange.account2_unit
                time_depth_buy = time2
                time_depth_sell = time1
                sell_count = exchange1_sellcount
                buy_count = exchange2_buycount
                sell_exchange = exchange.exchangeLink1
                buy_exchange = exchange.exchangeLink2
                buy_price = exchange2_sell_price
                sell_price = exchange1_buy_price
                buy_exchange_id = exchange.exchange2_API_id
                sell_exchange_id = exchange.exchange1_API_id
                buy_exchange_name = exchange.exchange2
                sell_exchange_name = exchange.exchange1

                if (!exchange.account1_coin) {
                    let msg = {
                        msg: '未读取到资产，请到交易所补充',
                        exchange: {
                            exchange: exchange.exchange1,
                            pair: exchange.currency_pair
                        }
                    }
                    dictionary[`${exchange.exchange1}${exchange.currency_pair}`] = 1
                    ipcRenderer.send('message', msg)
                    // window.warn("价格不成立 退出");
                    resolve(0)
                    return
                } else {
                    dictionary[`${exchange.exchange1}${exchange.currency_pair}`] = 0
                }
                if (!exchange.account2_unit) {
                    let msg = {
                        msg: '未读取到资产，请到交易所补充',
                        exchange: {
                            exchange: exchange.exchange2,
                            pair: exchange.currency_pair
                        }
                    }
                    dictionary[`${exchange.exchange2}${exchange.currency_pair}`] = 1
                    ipcRenderer.send('message', msg)
                    // window.warn("价格不成立 退出");
                    resolve(0)
                    return
                } else {
                    dictionary[`${exchange.exchange2}${exchange.currency_pair}`] = 0
                }

            } else {
                // rd1.create_time = dateTimeFilter()
                // rd2.create_time = dateTimeFilter()
                // await logAdd(rd1)
                // await logAdd(rd2)
    
                // 价格不成立 退出
                // window.warn("价格不成立 退出");
                resolve(0)
                return
            }

            // rd1.create_time = dateTimeFilter()
            // rd2.create_time = dateTimeFilter()
            // await logAdd(rd1)
            // await logAdd(rd2)
            //计算下单数量 
            let canSellCount = sell_exchange_id && sell_exchange_id == exchange.exchange1_API_id ? exchange.account1_coin : exchange.account2_coin
            let account1_unit = exchange.account1_unit
            let c11 = floatDiv(account1_unit, sell_price)
            let c12 = fee_rate ? floatSub(1, fee_rate) : 1
            let canBuyCount1 = floatMul(c11, c12)
            let account2_unit = exchange.account2_unit
            let c21 = floatDiv(account2_unit, sell_price)
            let c22 = fee_rate ? floatSub(1, fee_rate) : 1
            let canBuyCount2 = floatMul(c21, c22)
            let buy_act_count = buy_unit_balance > 0 && sell_price > 0 ? floatDiv(buy_unit_balance, buy_price) : 0
            let orderCount_origin = min([buy_count, sell_count, buy_act_count, sell_coin_balance])//单向对冲

            let amount_decimal1 = exchange.exchangeLink1.markets && exchange.exchangeLink1.markets[`${exchange.currency_pair}`] && exchange.exchangeLink1.markets[`${exchange.currency_pair}`]['limits'] ? exchange.exchangeLink1.markets[`${exchange.currency_pair}`]['limits']['amount']['min'] : 0.0001
            let amount_decimal2 = exchange.exchangeLink2.markets && exchange.exchangeLink2.markets[`${exchange.currency_pair}`] && exchange.exchangeLink2.markets[`${exchange.currency_pair}`]['limits'] ? exchange.exchangeLink2.markets[`${exchange.currency_pair}`]['limits']['amount']['min'] : 0.0001
            amount_decimal1 = amount_decimal1 ? amount_decimal1.toString().split(".")[1].length : 4
            amount_decimal2 = amount_decimal2 ? amount_decimal2.toString().split(".")[1].length : 4
            let real_amount_decimal = min([amount_decimal1, amount_decimal2])
            orderCount_origin = orderCount_origin ? subStringNum(orderCount_origin,real_amount_decimal) : 0

            let min_buy_amount = buy_exchange && buy_exchange.markets && buy_exchange.markets[`${exchange.currency_pair}`] ? buy_exchange.markets[`${exchange.currency_pair}`].limits['amount']["min"] : 0
            let min_buy_cost = buy_exchange && buy_exchange.markets && buy_exchange.markets[`${exchange.currency_pair}`] ? buy_exchange.markets[`${exchange.currency_pair}`].limits['cost']["min"] : 0
            let min_buy_price = buy_exchange && buy_exchange.markets && buy_exchange.markets[`${exchange.currency_pair}`] ? buy_exchange.markets[`${exchange.currency_pair}`].limits['price']["min"] : 0
            let min_sell_amount = sell_exchange && sell_exchange.markets && sell_exchange.markets[`${exchange.currency_pair}`] ? sell_exchange.markets[`${exchange.currency_pair}`].limits['amount']["min"] : 0
            let min_sell_cost = sell_exchange && sell_exchange.markets && sell_exchange.markets[`${exchange.currency_pair}`] ? sell_exchange.markets[`${exchange.currency_pair}`].limits['cost']["min"] : 0
            let min_sell_price = sell_exchange && sell_exchange.markets && sell_exchange.markets[`${exchange.currency_pair}`] ? sell_exchange.markets[`${exchange.currency_pair}`].limits['price']["min"] : 0
            orderCount = orderCount_origin > min_buy_amount ? (orderCount_origin > min_sell_amount ? orderCount_origin : min_sell_amount) : min_buy_amount
            buy_price = buy_price > min_buy_price ? buy_price : min_buy_price
            sell_price = sell_price > min_sell_price ? sell_price : min_sell_price
            let buy_cost = floatMul(orderCount, buy_price)
            let sell_cost = floatMul(orderCount, sell_price)
            min_buy_cost = min_buy_cost > 1 ? min_buy_cost : 1
            min_sell_cost = min_sell_cost > 1 ? min_sell_cost : 1

            if (min_buy_cost > buy_cost || min_sell_cost > sell_cost) {
                let orderCount1 = orderCount
                let orderCount2 = orderCount
                if (min_buy_cost > buy_cost) {
                    orderCount1 = floatDiv(min_buy_cost, buy_price)
                }
                if (min_sell_cost > sell_cost) {
                    orderCount2 = floatDiv(min_sell_cost, sell_price)
                }
                orderCount = min([orderCount1, orderCount2, orderCount])
            }

            if (orderCount > orderCount_origin) {
                // 价格不成立 退出
                // window.warn("orderCount 价格不成立 退出");
                resolve(0)
                return
            }

            let order = {
                buyOrder: {
                    buy_count: Number(buy_count),
                    buy_exchange: buy_exchange,
                    buy_price: Number(buy_price),
                    buy_exchange_id: buy_exchange_id,
                    orderCount: orderCount,
                    symbol: exchange.currency_pair,
                    time_depth_buy: time_depth_buy,
                    time_depth_sell: time_depth_sell,
                    buy_exchange_name: buy_exchange_name,
                    buy_coin_balance: buy_coin_balance,
                    buy_unit_balance: buy_unit_balance,
                    buy_order_api_id: buy_exchange_id && buy_exchange_id == exchange.exchange1_API_id ? exchange.exchange1_API_id : exchange.exchange2_API_id,
                    sell_order_api_id: sell_exchange_id && sell_exchange_id == exchange.exchange1_API_id ? exchange.exchange1_API_id : exchange.exchange2_API_id
                },
                sellOrder: {
                    sell_coin_balance: sell_coin_balance,
                    sell_unit_balance: sell_unit_balance,
                    sell_count: Number(sell_count),
                    sell_exchange: sell_exchange,
                    sell_price: Number(sell_price),
                    sell_exchange_id: sell_exchange_id,
                    orderCount: orderCount,
                    symbol: exchange.currency_pair,
                    time_depth_buy: time_depth_buy,
                    time_depth_sell: time_depth_sell,
                    sell_exchange_name: sell_exchange_name,
                    buy_order_api_id: buy_exchange_id && buy_exchange_id == exchange.exchange1_API_id ? exchange.exchange1_API_id : exchange.exchange2_API_id,
                    sell_order_api_id: sell_exchange_id && sell_exchange_id == exchange.exchange1_API_id ? exchange.exchange1_API_id : exchange.exchange2_API_id
                }
            }
          
            // 检测买卖金额是否超出余额
            let buy_active_count = floatMul(orderCount,buy_price)
          
            if(orderCount>sell_coin_balance){
                window.warn("卖单 金额大于账户余额 退出");
                console.log("卖单 金额大于账户余额 退出");
                resolve(0)
                return
            }
            if(buy_active_count>buy_unit_balance){
                window.warn("买单 金额大于账户余额 退出");
                console.log("买单 金额大于账户余额 退出");
                resolve(0)
                return
            }

            resolve(order)
        }).catch((error) => {
            console.log(error)  // 打开的是 'failed'
            resolve(0)
        })
    })

}

async function onTick(exchange) {
    try {
        let msg = {
            msg: '',
            exchange: exchange
        }
        //订单模型
        let order = {
            id: 0,
            exchange_heade_pair_id: 0,
            buy_order_api_id: exchange.exchange1_API_id,
            sell_order_api_id: exchange.exchange2_API_id,
            uniform: exchange.currency_pair,
            coin: exchange.coin,
            unit: exchange.unit,
            time_create: new Date().getTime(),
            amount: '0',
            buy_exchange: '0',
            buy_order_id: 0,
            buy_coin_balance: '0',
            buy_unit_balance: '0',
            buy_price: '0',
            buy_trade_money: '0',
            buy_amount: '0',
            buy_turnover: '0',
            buy_status: 1,
            buy_price_scale: 8,
            buy_amount_scale: 8,
            sell_price_scale: 8,
            sell_amount_scale: 8,
            sell_exchange: '0',
            sell_order_id: 0,
            sell_coin_balance: '0',
            sell_unit_balance: '0',
            sell_price: '0',
            sell_trade_money: '0',
            sell_amount: '0',
            sell_turnover: '0',
            sell_status: 1,
            income: '0',
            income_rate: '0',
            trigger_rate: '0',
            time_balance_buy: '0',
            time_balance_sell: '0',
            time_depth_buy: '0',
            time_depth_sell: '0',
            time_order_buy: '0',
            time_order_sell: '0',
            time_order_finish_buy: '0',
            time_order_finish_sell: '0',
            time_sync: '0',
            sync: 0,
            status: 1
        }
        //撤销超过15分钟的未成交订单，撤单后要检查订单状态，无论是否成功撤单（可能成交了），更新到服务器
        let mins15 = 15 * 60 * 1000
        let all1 = {
            exchange: exchange.exchangeLink1,
            symbol: exchange.currency_pair
        }
        all1[exchange.exchange1] = exchange.exchangeLink1

        let all2 = {
            exchange: exchange.exchangeLink2,
            symbol: exchange.currency_pair
        }
        all2[exchange.exchange2] = exchange.exchangeLink2

        let all1Trades = await cancelAllNOrder(mins15)
       
        // 撤单成功或者不成功，都不处理
        if (all1Trades && all1Trades.data && all1Trades.data.length > 0) {
            all1Trades.data.forEach(async e => {
                let exchange_e = all1.exchange
                if (e.sell_status == 1 && e.sell_order_id) {
                    if (e.sell_exchange == '比特儿') {
                        exchange_e = exchange[e.sell_exchange]
                    }
                    if (exchange_e.has['cancelOrder']) {
                        await sleep(100)
                        await cancelOrder(exchange_e, e.sell_order_id, e.uniform) // replace with your order id here (a string)
                    }
                }
                if (e.buy_status == 1 && e.buy_order_id) {
                    if (e.buy_exchange == '比特儿') {
                        exchange_e = exchange[e.buy_exchange]
                        // exchange_e = all2.exchange
                    }
                    if (exchange_e.has['cancelOrder']) {
                        await sleep(100)
                        await cancelOrder(exchange_e, e.buy_order_id, e.uniform) // replace with your order id here (a string)
                    }
                }
            })
        }

        //撤单后就计算收益,将查询结果更新到服务器     
        // mins15 = 15 * 60 * 1000
        let mins0 = 0 * 60 * 1000
        await allNOrder(all1, all2, mins0)
        //查询账户余额
        let account1 = await getBalance(exchange.exchangeLink1)
        let account2 = await getBalance(exchange.exchangeLink2)

        if (!account1) {
            let msgs1 = {
                msg: `无法连接`,
                exchange: {
                    pair: exchange.currency_pair,
                    exchange: `${exchange.exchange1}`,
                }
            }

            dictionary[`${exchange.exchange1}${exchange.currency_pair}`] = 1
            ipcRenderer.send('message', msgs1)
        } else {
            dictionary[`${exchange.exchange1}${exchange.currency_pair}`] = 0
        }

        if (!account2) {
            let msgs2 = {
                msg: `无法连接`,
                exchange: {
                    pair: exchange.currency_pair,
                    exchange: `${exchange.exchange2}`,
                }
            }
            dictionary[`${exchange.exchange2}${exchange.currency_pair}`] = 1

            ipcRenderer.send('message', msgs2)
        } else {
            dictionary[`${exchange.exchange2}${exchange.currency_pair}`] = 0
        }

        if (!account1 || !account2) {
            return;
        }


        order.time_balance_buy = new Date().getTime()
        order.time_balance_sell = new Date().getTime()
        exchange.account1_coin = 0
        exchange.account1_unit = 0
        exchange.account2_coin = 0
        exchange.account2_unit = 0

        exchange.account1_coin = account1 && account1.free && account1.free[exchange.coin] ? account1.free[exchange.coin] : 0
        exchange.account1_unit = account1 && account1.free && account1.free[exchange.unit] ? account1.free[exchange.unit] : 0
        exchange.account2_coin = account2 && account2.free && account2.free[exchange.coin] ? account2.free[exchange.coin] : 0
        exchange.account2_unit = account2 && account2.free && account2.free[exchange.unit] ? account2.free[exchange.unit] : 0


        if (!exchange.account1_coin || !exchange.account1_unit || !exchange.account1_coin || !exchange.account1_unit) {
            return
        }


        // 获取买一价和卖一价
        // 判断价格是否ok
        // 计算下单数量
        let buySellPrice = await getPriceAndAmount(exchange)

        if (!buySellPrice) {
            return
        }
        if (buySellPrice && buySellPrice.buyOrder.orderCount == 0 || buySellPrice && buySellPrice.sellOrder.orderCount == 0) {
            return
        }
        // 创建买单和卖单（同一笔数据）
        order.time_depth_buy = buySellPrice.buyOrder.time_depth_buy
        order.time_depth_sell = buySellPrice.sellOrder.time_depth_sell
        order.amount = buySellPrice.buyOrder.orderCount
        order.buy_exchange = buySellPrice.buyOrder.buy_exchange_name
        order.buy_coin_balance = buySellPrice.buyOrder.buy_coin_balance
        order.buy_unit_balance = buySellPrice.buyOrder.buy_unit_balance
        order.sell_unit_balance = buySellPrice.sellOrder.sell_unit_balance
        order.sell_coin_balance = buySellPrice.sellOrder.sell_coin_balance
        order.buy_price = buySellPrice.buyOrder.buy_price
        order.sell_exchange = buySellPrice.sellOrder.sell_exchange_name
        order.buy_amount = buySellPrice.buyOrder.buy_count
        order.sell_amount = buySellPrice.sellOrder.sell_count
        order.sell_price = buySellPrice.sellOrder.sell_price
        order.time_create = new Date().getTime()
        order.buy_order_api_id = buySellPrice.buyOrder.buy_order_api_id ? buySellPrice.sellOrder.buy_order_api_id : 0,
        order.sell_order_api_id = buySellPrice.sellOrder.sell_order_api_id ? buySellPrice.sellOrder.sell_order_api_id : 0


        msg.msg = '成功下单'

        if (order.buy_exchange == '比特儿' && (floatMul(order.buy_price, order.amount) < 1 || floatMul(order.sell_price, order.amount) < 1)) {
            msg.msg = '下单失败'
            order.buy_status = 2
            order.sell_status = 2
            order.status = 2
            ipcRenderer.send('message', msg)
            return
        }
        let tradeSell = await createOrderSell(buySellPrice)
        let tradeBuy = await createOrderBuy(buySellPrice)
        order.buy_order_id = tradeBuy && tradeBuy.buyOrder ? tradeBuy.buyOrder.id : 0
        order.sell_order_id = tradeSell && tradeSell.sellOrder ? tradeSell.sellOrder.id : 0
        order.time_order_buy = new Date().getTime()
        order.time_order_sell = new Date().getTime()
        msg = {
            msg: '成功下单',
            exchange: exchange
        }

        if (!order.buy_order_id) {
            //下单失败
            msg.msg = '下买单失败'
            order.buy_status = 2
            ipcRenderer.send('message', msg)
        }
        if (!order.sell_order_id) {
            //下单失败
            msg.msg = '下卖单失败'
            order.sell_status = 2
            ipcRenderer.send('message', msg)
        }
        if (order.sell_order_id && order.buy_order_id) {
            //下单成功
            ipcRenderer.send('message', msg)
        }
        await orderListAddOrUpdate(order)
        let new_id = await lastIdOrderNew()
        let true_id = 0
        if (new_id && new_id.length > 0) {
            true_id = new_id[0]['last_id']
        }
        order.id = true_id

        let MD5Arr = []
        for (let i in order) {
            let item = `${i}=${order[i]}`
            MD5Arr.push(item)
        }
        await uploadTradeOrder(paramMd5(MD5Arr))
        window.success("成功下单");
    } catch (e) {
        console.log('onTick ------->', e)
    }
}
function stopDictionary() {
    dictionary = {}
}
async function main(id) {
    try {
        ipcRenderer.send('mainCheck', 'msg')
        //获取交易对
        let showErr = false
        let i = -1
        while (true) {

            timeX = new Date().getTime()
        
            let canTry = localStorage['canTry']
            canTry = JSON.parse(canTry)
            let vip =''
            if (!canTry) {
                await sleep(3000)
            }
            vip = await getVip()
            vip = false;
            if (!vip) {
               
                let canTry = localStorage['canTry']
                canTry = JSON.parse(canTry)
                if (canTry) {
                    window.warn(`权限不足`)
                }else{
                    await sleep(3000)
                }
                // localStorage['canTry'] = '0'
                localStorage['mainCheck'] = '0'
                ipcRenderer.send('mainCheck', 'msg')
                await closeMain()
                stopDictionary()
                return;
            }
            let exchanges = await tradeConfigList({ user_id: id })

            if (localStorage['mainCheck'] != 'undefined' && localStorage['mainCheck'] == '1') {
                showErr = true
            }
            console.log('请先配置对冲策略 exchanges',exchanges)
            if (exchanges && exchanges.length == 0 || !id) {
                window.warn(`请先配置对冲策略`)
                localStorage['mainCheck'] = '0'
                ipcRenderer.send('mainCheck', 'msg')
                await closeMain()
                stopDictionary()
                await sleep(3000)//如果都没有就等3秒
                return
            }
            i++

            if (i > exchanges.length - 1) {
                i = -1
                continue
            }

            let data1 = {
                user_id: exchanges[i].user_id,
                id: exchanges[i].exchange1_id,
                main: 1
            }

            let data2 = {
                user_id: exchanges[i].user_id,
                id: exchanges[i].exchange2_id,
                main: 1
            }

            //连接交易所
            let link1 = await mainLink(data1)
            let link2 = await mainLink(data2)

            if (link1 && Object.keys(link1).length > 0) {
                let msg = {
                    msg: `连接中`,
                    exchange: {
                        pair: exchanges[i].currency_pair,
                        exchange: `${exchanges[i].exchange1}`,
                    }
                }
                if (!dictionary[`${exchanges[i].exchange1}${exchanges[i].currency_pair}`]) {
                    ipcRenderer.send('message', msg)
                }

            }
            if (link2 && Object.keys(link2).length > 0) {
                let msg = {
                    msg: `连接中`,
                    exchange: {
                        pair: exchanges[i].currency_pair,
                        exchange: `${exchanges[i].exchange2}`,
                    }
                }

                if (!dictionary[`${exchanges[i].exchange2}${exchanges[i].currency_pair}`]) {
                    ipcRenderer.send('message', msg)
                }
            }

            if (!link1) {

                localStorage['mainCheck'] = '0'
                let msg = {
                    msg: `API无法连接`,
                    exchange: {
                        pair: exchanges[i].currency_pair,
                        exchange: `${exchanges[i].exchange1}`,
                    }
                }
                ipcRenderer.send('message', msg)
                ipcRenderer.send('mainCheck', 'msg')

            }
            if (!link2) {

                localStorage['mainCheck'] = '0'
                let msg = {
                    msg: `API无法连接`,
                    exchange: {
                        pair: exchanges[i].currency_pair,
                        exchange: `${exchanges[i].exchange2}`,
                    }
                }
                ipcRenderer.send('message', msg)
                ipcRenderer.send('mainCheck', 'msg')
            }
            if (link1 && link1 == 2) {

                localStorage['mainCheck'] = '0'
                let msg = {
                    msg: `未设置API`,
                    exchange: {
                        pair: exchanges[i].currency_pair,
                        exchange: `${exchanges[i].exchange1}`,
                    }
                }
                ipcRenderer.send('message', msg)
                ipcRenderer.send('mainCheck', 'msg')
            }
            if (link2 && link2 == 2) {

                localStorage['mainCheck'] = '0'
                let msg = {
                    msg: `未设置API`,
                    exchange: {
                        pair: exchanges[i].currency_pair,
                        exchange: `${exchanges[i].exchange2}`,
                    }
                }
                ipcRenderer.send('message', msg)
                ipcRenderer.send('mainCheck', 'msg')
            }

            if (!link2 || !link1 || link2 && link2 == 2 || link1 && link1 == 2 || link1 && link1 == 33 || link2 && link2 == 33) {
                // await closeMain()
                showErr = false
                localStorage['mainCheck'] = '0'
                ipcRenderer.send('mainCheck', 'msg')
                await closeMain()
                stopDictionary()
                return
            }
            exchanges[i].exchangeLink1 = link1
            exchanges[i].exchangeLink2 = link2
            exchanges[i][exchanges[i].exchange1] = link1
            exchanges[i][exchanges[i].exchange2] = link2
            ipcRenderer.send('mainCheck', 'msg')

            //检查开关，如果关闭，则撤销所有未成交订单，撤单后每个都检查结果，更新到服务器
            let status = await swithStatus()

            if (status && status.length == 0 || status && status == 'close') {
                stopDictionary()
                await cancelPendingOrders(exchanges[i])
                if (localStorage['doneExit'] == "1") {
                    ipcRenderer.send('exitNow', 'msg')
                }

                return
            } else {
           
                onTick(exchanges[i])//主程序 传入需要对冲的交易所交易对
            }
        }
    } catch (e) {
        // 如果发生异常，就通知关闭开关
        console.log('main error---', e)
        // localStorage['mainCheck'] = '0'
        // ipcRenderer.send('mainCheck', 'msg')
        // closeMain()
        stopDictionary()

    }

}

export {
    main
}