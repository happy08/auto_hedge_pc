import db from '../utils/db';
import { getUserInfo } from '../utils/common';
/**
 * 交易所本地数据库操作，需要提供翻页的功能
 */


/**
 * 获取配置
 */

let configDao = (params) => {
    return new Promise(async (resolve, reject) => {
        let _sql = ` SELECT * 
             from CONFIG_NEW `;
        if (params) {
            _sql = _sql + `where name = '${params.name}'`
        }
        try {
            db.all(_sql, async (err, row) => {
                if (err) {
                    reject(err);
                } else {

                    resolve(row);
                }
            })
        } catch (e) {
            ////allNOrder('----CONFIG_NEW>', e)
            resolve([]);
        }

    })
};

/**
 * 新增或更新配置
 */

let configAddOrUpdateDao = (params) => {
    return new Promise(async (resolve, reject) => {
        let _sql = `INSERT INTO CONFIG_NEW
             (name,value) VALUES ('${params.name}','${params.value}')`;
        db.run(_sql, async (err) => {
            if (err) {
                _sql = `update CONFIG_NEW set
             name='${params.name}',
             value='${params.value}'
             where name='${params.name}'
            `;
                db.run(_sql, async (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(1);
                    }
                })
            } else {
                resolve(1);
            }
        })
    })
};

/**
 * 获取交易所
 */

let exchangeDao = (id) => {
    return new Promise(async (resolve, reject) => {
        let _sql = `SELECT * 
             from EXCHANGE `;
             if(id){
                 _sql = _sql +`where id=${id}`
             }
        db.all(_sql, async (err, row) => {
            if (err) {
                //console.log('错误-',err)
                reject(err);
            } else {
                resolve(row);
            }
        })
    })
};

/**
 * 新增或更新交易所
 */

let exchangeAddDao = (params) => {
    return new Promise(async (resolve, reject) => {
        let _sql = `INSERT INTO EXCHANGE 
        (name,rest_host,rest_trade_host,websocket_host) 
        VALUES 
        ('${params.name}','${params.rest_host}','${params.rest_trade_host}','${params.websocket_host}')`
        db.run(_sql, async (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(1);
            }
        });
    })
};

/**
 * 获取交易所API
 */

let exchangeAPIListDao = (params) => {
    return new Promise(async (resolve, reject) => {
        let _sql = `SELECT * 
             from EXCHANGE_API `;
        if (params && params.user_id  && params.exchange_id) {
            _sql = _sql + ` where user_id = ${params.user_id} and exchange_id = ${params.exchange_id}`
        }else if (params && params.user_id ) {
            _sql = _sql + ` where user_id = ${params.user_id}`
        }
        // if (params && params.exchange_id) {
        //     _sql = _sql + ` where `
        // }
    //    console.log(_sql)
        db.all(_sql, async (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        })
    })
};

/**
 * 新增或更新交易所API
 */

let exchangeAPIListAddDao = (params) => {
    return new Promise(async (resolve, reject) => {
        //直接更新
        let _sql = `INSERT INTO EXCHANGE_API 
        (user_id,exchange_id,exchange_name,key,secret,sync)
        VALUES
        (${params.user_id},${params.exchange_id},'${params.exchange_name}','${params.key}','${params.secret}',${params.sync})`;
        db.run(_sql, async (err) => {
            if (err) {
                // _sql = `UPDATE EXCHANGE_API SET
                // exchange_id=${params.exchange_id},
                // exchange_name='${params.exchange_name}',`
                // if (params && params.key != undefined) {
                //     _sql = _sql + `, key=${params.key}`
                // }
                // if (params && params.secret != undefined) {
                //     _sql = _sql + `, secret=${params.secret}`
                // }
                // if (params && params.sync != undefined) {
                //     _sql = _sql + `, sync=${params.sync}`
                // }
                
                // _sql = _sql +`WHERE user_id=${params.user_id} and exchange_id =${params.exchange_id}`
                // db.run(_sql, async (err) => {
                //     if (err) {
                //         reject(err);
                //     } else {
                //         resolve(1);
                //     }
                // });
                resolve(0);
            } else {
                resolve(1);
            }
        });


    })
};


/**
 * 新增或更新交易所API
 */

let exchangeAPIListAddOrUpdateDao = (params) => {
    return new Promise(async (resolve, reject) => {
        //直接更新
        let _sql = `INSERT INTO EXCHANGE_API 
        (user_id,exchange_id,exchange_name,key,secret,sync,pwd)
        VALUES
        (${params.user_id},${params.exchange_id},'${params.exchange_name}','${params.key}','${params.secret}',${params.sync},'${params.pwd}')`;
        db.run(_sql, async (err) => {
            if (err) {
                //console.log('错误1-',err)
                _sql = `UPDATE EXCHANGE_API SET
                exchange_id=${params.exchange_id},
                exchange_name='${params.exchange_name}'`
                if (params && params.key != undefined) {
                    _sql = _sql + `, key='${params.key}'`
                }
                if (params && params.secret != undefined) {
                    _sql = _sql + `, secret='${params.secret}'`
                }
                if (params && params.pwd != undefined) {
                    _sql = _sql + `, pwd='${params.pwd}'`
                }
                if (params && params.sync != undefined) {
                    _sql = _sql + `, sync=${params.sync}`
                }
                
                _sql = _sql +` WHERE user_id=${params.user_id} and exchange_id =${params.exchange_id}`
                db.run(_sql, async (err) => {
                    if (err) {
                        //console.log('错误-2',err)
                        reject(err);
                    } else {
                        resolve(1);
                    }
                });
            } else {
                resolve(1);
            }
        });


    })
};

/**
 * 新增日志
 */

let logAddDao = (params) => {
    return new Promise(async (resolve, reject) => {
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
        let _sql = `INSERT INTO LOG 
        (deal_pair_name,sell_exchange,sell_price,sell_number,sell_query_time,sell_response_time,buy_exchange,
            buy_price,buy_number,buy_query_time,buy_response_time,spreads,create_time,mean_value)
        VALUES
        ('${params.deal_pair_name}','${params.sell_exchange}',
            '${params.sell_price}','${params.sell_number}','${params.sell_query_time}','${params.sell_response_time}',
            '${params.buy_exchange}','${params.buy_price}','${params.buy_number}',
            '${params.buy_query_time}','${params.buy_response_time}','${params.spreads}','${params.create_time}',
            '${params.mean_value}')`;
        db.run(_sql, async (err) => {
            if (err) {
                console.log('LOG err',err)
            } else {
                console.log('LOG success',1)
                resolve(1);
            }
        });


    })
};

/**
 * 获取交易所交易对，交易所支持的交易对配置表
 */

let logDao = () => {
    return new Promise(async (resolve, reject) => {
        let _sql = `SELECT * from LOG `;
        db.all(_sql, async (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        })
    })
};

/**
 * 获取交易所交易对，交易所支持的交易对配置表
 */

let exchangePairListDao = () => {
    return new Promise(async (resolve, reject) => {
        let _sql = `SELECT * from EXCHANGE_PAIR `;
        db.all(_sql, async (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        })
    })
};
/**
 * 获取订单表最新id
 */

let lastIdOrderNewDao = () => {
    return new Promise(async (resolve, reject) => {
        let _sql = `select last_insert_rowid() as last_id from ORDER_NEW `;
        db.all(_sql, async (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        })
    })
};

/**
 * 新增或更新交易所交易对，交易所支持的交易对配置表
 */

let exchangePairListAddOrUpdateDao = (params) => {
    return new Promise(async (resolve, reject) => {
        let _sql = `INSERT OR REPLACE INTO EXCHANGE_PAIR 
        (exchange_id,currency_pair,uniform,fee_sell,fee_buy)
        VALUES
        (${params.exchange_id},'${params.currency_pair}','${params.uniform}','${params.fee_sell}','${params.fee_buy}')`;
        db.run(_sql, async (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(1);
            }
        })
    })
};




/**
 * 获取交易对（执行搬砖的交易对）
 */

let tradeConfigListDao = (params) => {
    return new Promise(async (resolve, reject) => {
        let _sql = `SELECT *
             from TRADE_CONFIG where user_id = ${params.user_id} `;
        db.all(_sql, async (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        })
    })
};
/**
 * 获取交易对（执行搬砖的交易对）
 */

let tradeConfigClearDao = () => {
    return new Promise(async (resolve, reject) => {

        let _sql = ` delete from TRADE_CONFIG;
             update sqlite_sequence set seq=0 where name = 'TRADE_CONFIG';`;


        db.run(_sql, async (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(1);
            }
        })
    })
};

/**
 * 新增或更新交易所交易对（执行搬砖的交易对）
 */

let tradeConfigListAddOrUpdateDao = (params) => {
    return new Promise(async (resolve, reject) => {
        let _sql = `INSERT INTO TRADE_CONFIG 
        (user_id,coin,spread,unit,currency_pair,uniform,exchange1,exchange2,exchange1_id,exchange2_id,exchange1_API_id,exchange2_API_id,isShow,status,sync)
         VALUES 
        (${params.user_id},'${params.coin}','${params.spread}','${params.unit}','${params.currency_pair}','${params.uniform}','${params.exchange1}','${params.exchange2}',${params.exchange1_id},${params.exchange2_id},${params.exchange1_API_id},${params.exchange2_API_id},${params.isShow},${params.status},${params.sync})`;
        db.run(_sql, async (err) => {
            if (err) {
                _sql = `UPDATE TRADE_CONFIG set
                user_id=${params.user_id},
                coin='${params.coin}',
                spread='${params.spread}',
                unit='${params.unit}',
                currency_pair='${params.currency_pair}',
                uniform='${params.uniform}',
                exchange1='${params.exchange1}',
                exchange2='${params.exchange2}',
                exchange1_id='${params.exchange1_id}',
                exchange2_id='${params.exchange2_id}',
                exchange1_API_id='${params.exchange1_API_id}',
                exchange2_API_id='${params.exchange2_API_id}',
                isShow='${params.isShow}',
                status=${params.status},
                sync=${params.sync}
                where user_id=${params.user_id} and currency_pair='${params.currency_pair}' and  uniform='${params.uniform}'`;

                db.run(_sql, async (err) => {
                    if (err) {
                        console.log('TRADE_CONFIG----',err)
                        reject(err);
                    } else {
                        resolve(1);
                    }
                })
            } else {
                resolve(1);
            }
        })
    })
};


/**
 * 
 */

let orderListDao = (params) => {
    return new Promise(async (resolve, reject) => {

        // let params = {
        //     type:'undone',// 进行中
        //     ago:ago
        // }
        //allNOrder('orderListDao',params);
        let since = 0;

        if (params && !params.uid) {
            params.uid = getUserInfo() ? getUserInfo().id : 0
        }

        let _sql = `SELECT *
             from ORDER_NEW `;
        let total_sql = `SELECT  count(*) as count
        from ORDER_NEW `;
        //  let params = {
        //     type: 'query',

        //     coin:data.coin,
        //     status:data.status,
        //     ago: data.ago,
        //     later:data.later

        // }     
        if (params && params.coin && params.coin == 3) {
            params.coin = ''
        }
        if (params && params.status && params.status == 3) {
            params.status = -1
        }

        if (params && params.type == 'query') {

            let query_sql = ''
            if (!params.coin && params.status == -1 && !params.ago && !params.later) {
                query_sql = query_sql + ` where uid=${params.uid} and  amount !=0  `
            }
            if (params.coin && params.status != -1 && params.ago && params.later) {
                query_sql = query_sql + ` where uid=${params.uid} and amount !=0 and status =${params.status} and coin='${params.coin}' and time_create<'${params.ago}' and time_create>'${params.later}' `
            }

            if (params.coin && params.ago && params.later) {
                query_sql = query_sql + ` where uid=${params.uid} and amount !=0 and  coin='${params.coin}' and time_create<'${params.ago}' and time_create>'${params.later}'`
            }

            if (params.status != -1 && params.ago && params.later) {
                query_sql = query_sql + ` where uid=${params.uid} and status =${params.status} and amount !=0 and coin='${params.coin}' and time_create<'${params.ago}' and time_create>'${params.later}' `
            }

            if (params.coin && params.status != -1) {
                query_sql = query_sql + ` where uid=${params.uid} and amount !=0 and status =${params.status} and coin='${params.coin}'`
            }

            if (params.ago && params.later) {
                query_sql = query_sql + ` where uid=${params.uid} and amount !=0 and (
                    (time_create<'${params.ago}' and time_create>'${params.later}') 
                    or
                     (time_create<'${params.ago}' and time_create>'${params.later}')
                     ) `
            }

            if (params.status != -1) {
                query_sql = query_sql + ` where uid=${params.uid} and amount !=0 and status =${params.status}`
            }
            if (params.coin) {
                query_sql = query_sql + ` where uid=${params.uid} and amount !=0 and coin='${params.coin}'
                     `
            }
            total_sql = total_sql + query_sql
            ////console.log('====',params)
            if (params.page && params.size) {
                query_sql = query_sql + ` ORDER BY time_create DESC  LIMIT ${(params.page - 1) * params.size},${params.size}`;
            }
            _sql = _sql + query_sql

            //allNOrder('page1 ----',_sql)
            //allNOrder('page2 ----',total_sql)

        }
        let undone_sql = ''
        if (params && params.type == 'undone' && params.ago) {
            since = new Date().getTime() - params.ago;
            undone_sql = undone_sql + ` where uid=${params.uid} and status =1 and time_order_buy<${since} `
            _sql = _sql + undone_sql
            // undone_sql = undone_sql + ` where uid=${params.uid} and (
            //     (buy_status =1 and time_order_buy<${since}) or (sell_status =1 and time_order_sell<${since})) `
            // _sql = _sql + undone_sql
            total_sql = total_sql + undone_sql
        }

        if (params && params.type == 'undone' && !params.ago) {
            undone_sql = undone_sql + ` where uid=${params.uid}`
      
            _sql = _sql + undone_sql
            total_sql = total_sql + undone_sql
        }
        if (params && params.type != 'undone' && params.type != 'query') {
            if (params && params.id) {
                _sql = _sql + ` where uid = ${params.uid} and id = ${params.id}`
            }
            if (params && params.buy_order_id) {
                _sql = _sql + ` where uid = ${params.uid} and buy_order_id = ${params.buy_order_id}`
            } else if (params && params.sell_order_id) {
                _sql = _sql + ` where uid = ${params.uid} and sell_order_id = ${params.sell_order_id}`
            } else if (params && params.time_depth_buy) {
                _sql = _sql + ` where uid = ${params.uid} and time_depth_buy = ${params.time_depth_buy}`
            }
        }
        console.log('sql-----',_sql)
        db.all(_sql, async (err, row1) => {
            if (err) {
                reject(err);
            } else {
 
                db.all(total_sql, async (err, row2) => {
                    if (err) {
                        reject(err);
                    } else {
 
                        let obj = {
                            data: row1,
                            total: row2[0]
                        }
                        resolve(obj);
                    }
                })

            }
        })
    })
};

/**
 * 添加交易所交易对
 */

let orderListAddOrUpdateDao = (params) => {
    if (params && !params.uid) {
        params.uid = getUserInfo() ? getUserInfo().id : 0
    }
    return new Promise(async (resolve, reject) => {
        let _sql = `INSERT INTO ORDER_NEW 
        (
            time_create,
            buy_coin_balance,
            buy_unit_balance,
            sell_coin_balance,
            sell_unit_balance,
            buy_price_scale,
            buy_amount_scale,
            sell_price_scale,
            sell_amount_scale,
            uid,
            uniform,
            coin,
            unit,
            amount,
            buy_exchange,
            buy_coin_exchange,
            buy_unit_exchange,
            buy_price,
            buy_amount,
            buy_turnover,
            buy_status,
            buy_order_id,
            sell_order_id,
            sell_exchange,
            sell_coin_exchange,
            sell_unit_exchange,
            sell_price,
            sell_amount,
            sell_turnover,
            sell_status,
            income,
            income_rate,
            trigger_rate,
            time_depth_buy,
            time_depth_sell,
            time_order_buy,
            time_order_sell,
            time_order_finish_buy,
            time_order_finish_sell,
            time_sync,
            sync,
            insertOrUpdate,
            sell_trade_money,
            buy_trade_money,
            time_balance_buy,
            time_balance_sell,
            status
         )
         VALUES
         (
          
            ${params.time_create},
            ${params.buy_coin_balance},
            ${params.buy_unit_balance},
            ${params.sell_coin_balance},
            ${params.sell_unit_balance},
            ${params.buy_price_scale},
            ${params.buy_amount_scale},
            ${params.sell_price_scale},
            ${params.sell_amount_scale},
             ${params.uid},
            '${params.uniform}',
            '${params.coin}',
            '${params.unit}',
            '${params.amount}',
            '${params.buy_exchange}',
            '${params.buy_coin_exchange}',
            '${params.buy_unit_exchange}',
            '${params.buy_price}',
            '${params.buy_amount}',
            '${params.buy_turnover}',
            ${params.buy_status},
            ${params.buy_order_id},
            ${params.sell_order_id},
            '${params.sell_exchange}',
            '${params.sell_coin_exchange}',
            '${params.sell_unit_exchange}',
            '${params.sell_price}',
            '${params.sell_amount}',
            '${params.sell_turnover}',
             ${params.sell_status},
            '${params.income}',
            '${params.income_rate}',
            '${params.trigger_rate}',
            '${params.time_depth_buy}',
            '${params.time_depth_sell}',
            '${params.time_order_buy}',
            '${params.time_order_sell}',
            '${params.time_order_finish_buy}',
            '${params.time_order_finish_sell}',
            '${params.time_sync}',
            ${params.sync},
            ${new Date().getTime()},
            '${params.sell_trade_money}',
            '${params.buy_trade_money}' ,
            ${params.time_balance_buy},
            ${params.time_balance_sell},
            ${params.status}
            )`;
            
        // //localStorage('插入成功订单',_sql)
        db.run(_sql, async (err) => {
            if (err) {
                //localStorage('orderListAddOrUpdate err',err)
                //localStorage[`${new Date().getTime()}+"orderListAddOrUpdate insert err"`] = JSON.stringify(_sql)
                _sql = `UPDATE ORDER_NEW set insertOrUpdate=${new Date().getTime()}`;
                if (params && params.time_create != undefined) {
                    _sql = _sql + `, time_create='${params.time_create}'`
                }
                if (params && params.buy_coin_balance != undefined) {
                    _sql = _sql + `, buy_coin_balance='${params.buy_coin_balance}'`
                }
                if (params && params.buy_unit_balance != undefined) {
                    _sql = _sql + `, buy_unit_balance='${params.buy_unit_balance}'`
                }
                if (params && params.sell_coin_balance != undefined) {
                    _sql = _sql + `, sell_coin_balance='${params.sell_coin_balance}'`
                }
                if (params && params.sell_unit_balance != undefined) {
                    _sql = _sql + `, sell_unit_balance='${params.sell_unit_balance}'`
                }
                if (params && params.buy_price_scale != undefined) {
                    _sql = _sql + `, buy_price_scale=${params.buy_price_scale}`
                }
                if (params && params.buy_amount_scale != undefined) {
                    _sql = _sql + `, buy_amount_scale=${params.buy_amount_scale}`
                }
                if (params && params.sell_price_scale != undefined) {
                    _sql = _sql + `, sell_price_scale=${params.sell_price_scale}`
                }
                if (params && params.sell_amount_scale != undefined) {
                    _sql = _sql + `, sell_amount_scale=${params.sell_amount_scale}`
                }
                if (params && params.time_balance_buy != undefined) {
                    _sql = _sql + `, time_balance_buy=${params.time_balance_buy}`
                }
                if (params && params.time_balance_sell != undefined) {
                    _sql = _sql + `, time_balance_sell=${params.time_balance_sell}`
                }
                if (params && params.sell_trade_money != undefined) {
                    _sql = _sql + `, sell_trade_money='${params.sell_trade_money}'`
                }
                if (params && params.buy_trade_money != undefined) {
                    _sql = _sql + `, buy_trade_money='${params.buy_trade_money}'`
                }
                if (params && params.uid != undefined) {
                    _sql = _sql + `, uid=${params.uid}`
                }
                if (params && params.uniform != undefined) {
                    _sql = _sql + `, uniform='${params.uniform}'`
                }
                if (params && params.coin != undefined) {
                    _sql = _sql + `, coin='${params.coin}'`
                }
                if (params && params.unit != undefined) {
                    _sql = _sql + `, unit='${params.unit}'`
                }
                if (params && params.amount != undefined) {
                    _sql = _sql + `, amount='${params.amount}'`
                }
                if (params && params.buy_exchange != undefined) {
                    _sql = _sql + `, buy_exchange='${params.buy_exchange}'`
                }
                if (params && params.buy_coin_exchange != undefined) {
                    _sql = _sql + `, buy_coin_exchange='${params.buy_coin_exchange}'`
                }
                if (params && params.buy_unit_exchange != undefined) {
                    _sql = _sql + `, buy_unit_exchange='${params.buy_unit_exchange}'`
                }
                if (params && params.buy_price != undefined) {
                    _sql = _sql + `, buy_price='${params.buy_price}'`
                }
                if (params && params.buy_amount != undefined) {
                    _sql = _sql + `, buy_amount='${params.buy_amount}'`
                }
                if (params && params.buy_order_id != undefined) {
                    _sql = _sql + `, buy_order_id=${params.buy_order_id}`
                }
                if (params && params.buy_turnover != undefined) {
                    _sql = _sql + `, buy_turnover='${params.buy_turnover}'`
                }
                if (params && params.buy_status != undefined) {
                    _sql = _sql + `, buy_status=${params.buy_status}`
                }
                if (params && params.sell_exchange != undefined) {
                    _sql = _sql + `, sell_exchange='${params.sell_exchange}'`
                }
                if (params && params.sell_coin_exchange != undefined) {
                    _sql = _sql + `, sell_coin_exchange='${params.sell_coin_exchange}'`
                }
                if (params && params.sell_unit_exchange != undefined) {
                    _sql = _sql + `, sell_unit_exchange='${params.sell_unit_exchange}'`
                }
                if (params && params.sell_price != undefined) {
                    _sql = _sql + `, sell_price='${params.sell_price}'`
                }
                if (params && params.sell_amount != undefined) {
                    _sql = _sql + `, sell_amount='${params.sell_amount}'`
                }
                if (params && params.sell_order_id != undefined) {
                    _sql = _sql + `, sell_order_id=${params.sell_order_id}`
                }
                if (params && params.sell_turnover != undefined) {
                    _sql = _sql + `, sell_turnover='${params.sell_turnover}'`
                }
                if (params && params.sell_status != undefined) {
                    _sql = _sql + `, sell_status=${params.sell_status}`
                }
                if (params && params.income != undefined) {
                    _sql = _sql + `, income='${params.income}'`
                }
                if (params && params.income_rate != undefined) {
                    _sql = _sql + `, income_rate='${params.income_rate}'`
                }
                if (params && params.status != undefined) {
                    _sql = _sql + `, status='${params.status}'`
                }
                if (params && params.time_depth_buy != undefined) {
                    _sql = _sql + `, time_depth_buy='${params.time_depth_buy}'`
                }
                if (params && params.time_depth_sell != undefined) {
                    _sql = _sql + `, time_depth_sell='${params.time_depth_sell}'`
                }
                if (params && params.time_order_buy != undefined) {
                    _sql = _sql + `, time_order_buy='${params.time_order_buy}'`
                }
                if (params && params.time_order_sell != undefined) {
                    _sql = _sql + `, time_order_sell='${params.time_order_sell}'`
                }
                if (params && params.time_order_finish_buy != undefined) {
                    _sql = _sql + `, time_order_finish_buy='${params.time_order_finish_buy}'`
                }
                if (params && params.time_order_finish_sell != undefined) {
                    _sql = _sql + `, time_order_finish_sell='${params.time_order_finish_sell}'`
                }
                if (params && params.time_sync != undefined) {
                    _sql = _sql + `, time_sync='${params.time_sync}'`
                }
                if (params && params.sync != undefined) {
                    _sql = _sql + `, sync='${params.sync}'`
                }
                // 还未下单，使用买单深度（查询买一价格时间）查询时间，
                if (params && params.time_create != undefined) {
                    _sql = _sql + ` where uid=${params.uid} and time_create=${params.time_create}`;
                } else if (params && params.buy_order_id != undefined) {
                    // 查询并更新订单，使用买单或者卖单id
                    _sql = _sql + ` where uid=${params.uid} and buy_order_id=${params.buy_order_id}`;
                } else if (params && params.sell_order_id != undefined) {
                    _sql = _sql + ` where uid=${params.uid} and sell_order_id=${params.sell_order_id}`;
                }
                ////allNOrder(_sql)
                db.run(_sql, async (err) => {
                    if (err) {
                        //localStorage('orderListAddOrUpdate udpate err',err)
                        reject(err);
                        ////allNOrder(err)

                    } else {
                        //localStorage('orderListAddOrUpdate udpate success')
                        resolve(1);
                    }
                })
            } else {
                //localStorage('orderListAddOrUpdate insert success')
                ////allNOrder('哈哈哈')
                resolve(1);
            }
        })

    })
};

export {
    configDao,
    configAddOrUpdateDao,
    exchangeDao,
    exchangeAddDao,
    exchangeAPIListDao,
    exchangeAPIListAddOrUpdateDao,
    exchangeAPIListAddDao,
    exchangePairListDao,
    exchangePairListAddOrUpdateDao,
    tradeConfigListDao,
    tradeConfigListAddOrUpdateDao,
    tradeConfigClearDao,
    orderListDao,
    orderListAddOrUpdateDao,
    lastIdOrderNewDao,
    logAddDao,
    logDao
}