import fse from 'fs-extra';
import path from 'path';
import sq3 from 'sqlite3';
// import logger from './logger';
import { docDir } from './settings';
// 将数据存至系统用户目录，防止用户误删程序
export const dbPath = path.join(docDir, 'data.sqlite3');
fse.ensureFileSync(dbPath);

const sqlite3 = sq3.verbose();
const db = new sqlite3.Database(dbPath);
db.serialize(() => {
  /**
   * 配置 CONFIG
   * id ID
   * name 配置名称
   * value 配置的值
   */
  db.run(`CREATE TABLE IF NOT EXISTS CONFIG_NEW(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    value VARCHAR(255) NOT NULL
    )`, err => {
    //console.log(err);
  });
 
   /**
   * 交易所 EXCHANGE
   * id 交易所ID
   * name 交易所名称
   * rest_host REST host
   * websocket_host Websocket host
   * create_time 创建时间
   * update_time 修改时间
   */
  db.run(`CREATE TABLE IF NOT EXISTS EXCHANGE(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    rest_host VARCHAR(255) NOT NULL,
    rest_trade_host VARCHAR(255) NOT NULL,
    websocket_host VARCHAR(255) NOT NULL,
    unique (name,rest_host)
    )`, err => {
    console.log(err);
  });

  /**
   * 交易所——交易对 EXCHANGE_PAIR
   * id 交易对ID
   * exhcange_id 外键，交易所ID
   * currency_pair 交易对名称
   * uniform 标准名称
   * fee_sell 卖出交易手续费
   * fee_buy 买入交易手续费
   * create_time 创建时间
   * update_time 修改时间
   */
  db.run(`CREATE TABLE IF NOT EXISTS EXCHANGE_PAIR(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    exchange_id INTEGER NOT NULL,
    exchange_name VARCHAR(255) NOT NULL,
    currency_pair VARCHAR(255) NOT NULL,
    coin_name VARCHAR(255) NOT NULL,
    unit_name VARCHAR(255) NOT NULL,
    uniform VARCHAR(255) NOT NULL,
    fee_sell VARCHAR(255) NOT NULL,
    fee_buy VARCHAR(255) NOT NULL,
    price VARCHAR(255) NOT NULL,
    price_cny VARCHAR(255) NOT NULL,
    turnover VARCHAR(255) NOT NULL,
    price_change_rate VARCHAR(255) NOT NULL,
    unique (exchange_name,currency_pair),
    FOREIGN KEY (exchange_id) REFERENCES EXCHANGE(id)
    )`, err => {
    //console.log(err);
  });

  /**
   * 对冲日志 LOG
   * id 
   * exhcange_id 外键，交易所ID
   * currency_pair 交易对名称
   * uniform 标准名称
   * fee_sell 卖出交易手续费
   * fee_buy 买入交易手续费
   * create_time 创建时间
   * update_time 修改时间
   */
  db.run(`CREATE TABLE IF NOT EXISTS LOG(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    deal_pair_name VARCHAR(255) NOT NULL,
    sell_exchange VARCHAR(255) NOT NULL,
    sell_price VARCHAR(255) NOT NULL,
    sell_number VARCHAR(255) NOT NULL,
    sell_query_time VARCHAR(255) NOT NULL,
    sell_response_time VARCHAR(255) NOT NULL,
    buy_exchange VARCHAR(255) NOT NULL,
    buy_price VARCHAR(255) NOT NULL,
    buy_number VARCHAR(255) NOT NULL,
    buy_query_time VARCHAR(255) NOT NULL,
    buy_response_time VARCHAR(255) NOT NULL,
    spreads VARCHAR(255) NOT NULL,
    create_time VARCHAR(255) NOT NULL,
    mean_value VARCHAR(255) NOT NULL
    )`, err => {
    console.log(err);
  });

  /**
   * 交易所API EXCHANGE_API
   * id api id
   * user_id 用户id
   * exchange_id 外键，交易所ID
   * key 密钥
   * secret 私钥
   * sign 签名
   * sync 是否同步到服务器后端
   * create_time 创建时间
   * update_time 修改时间
   */

  db.run(`CREATE TABLE IF NOT EXISTS EXCHANGE_API(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    user_id INTEGER NOT NULL , 
    exchange_id INTEGER NOT NULL ,
    exchange_name VARCHAR(255) NOT NULL ,
    key VARCHAR(255) DEFAULT NULL,
    secret VARCHAR(255) DEFAULT NULL,
    pwd VARCHAR(255) DEFAULT NULL,
    sync tinyint(1) NOT NULL,
    unique (user_id,exchange_name),
    FOREIGN KEY (exchange_id) REFERENCES EXCHANGE(id)
    )`, err => {
    //console.log(err);
  });
 

/**
   * 对冲策略组 TRADE_CONFIG
   * id 配置对ID
   * user_id 用户id
   * currency_pair 交易对名称
   * uniform 标准名称
   * exchange1 交易所1名称
   * exchange2 交易所2名称
   * status 0停止 1开启
   * sync 0未同步到服务器 1已同步到服务器
   * create_time 创建时间
   * update_time 修改时间
   */
  db.run(`CREATE TABLE IF NOT EXISTS TRADE_CONFIG(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    user_id INTEGER NOT NULL, 
    coin VARCHAR(255) NOT NULL,
    unit VARCHAR(255) NOT NULL,
    currency_pair VARCHAR(255) NOT NULL,
    uniform VARCHAR(255) NOT NULL,
    exchange1 VARCHAR(255) NOT NULL,
    exchange2 VARCHAR(255) NOT NULL,
    spread VARCHAR(255) NOT NULL,
    exchange1_id INTEGER NOT NULL, 
    exchange2_id INTEGER NOT NULL, 
    exchange1_API_id INTEGER NOT NULL,
    exchange2_API_id INTEGER NOT NULL,
    status tinyint(1) NOT NULL,
    isShow tinyint(1) NOT NULL,
    sync tinyint(1) NOT NULL,
    unique (user_id,currency_pair,uniform)
    )`, err => {
    //console.log(err);
  });

  /**
   * 订单 ORDER
   * id 订单ID
   * user_id 用户ID
   * uniform 标准名称
   * coin 币种
   * unit 单位，基础币
   * priceScale 价格小数位数
   * amountScale 数量小数位数
   * amount 对冲下单数量
   * buy_exchange 买入交易所
   * buy_coin_balance 买入市场账户对冲币种余额
   * buy_unit_balance 买入市场账户基础币种余额
   * buy_order_id 买入市场买单id
   * buy_price 买入市场卖一价
   * buy_amount 买入市场卖一数量
   * buy_turnover 买入方挂单成交量
   * buy_status 0完成，1开始，2正在交易
   * sell_exchange 卖出交易所
   * sell_coin_balance 卖出市场账户对冲币种余额
   * sell_order_id 卖出市场卖单id
   * sell_unit_balance 卖出市场账户基础币种余额
   * sell_price 卖出市场买一价
   * sell_amount 卖出市场买一数量
   * sell_turnover 卖出方挂单成交量
   * sell_status 0完成，1开始，2正在交易
   * income 收益
   * income_rate 收益率
   * trigger_rate 参考差价成交条件
   * time_balance 余额查询时间戳
   * time_depth_buy 买入深度查询时间戳
   * time_depth_sell 卖出深度查询时间戳
   * time_order_buy 买入下单时间戳
   * time_order_sell 卖出下单时间戳
   * time_order_finish_buy 买入挂单结束时间戳
   * time_order_finish_sell 卖出挂单结束时间戳
   * time_sync 同步时间戳
   * sync 0未同步到服务器 1已同步到服务器
   */
  db.run(`CREATE TABLE IF NOT EXISTS ORDER_NEW(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    uid INTEGER NOT NULL, 
    uniform VARCHAR(255)  ,
    coin VARCHAR(255)  ,
    unit VARCHAR(255)  ,
    priceScale1 INTEGER  ,
    amountScale1 INTEGER  ,
    priceScale2 INTEGER ,
    amountScale2 INTEGER ,
    amount VARCHAR(255) ,
    buy_exchange VARCHAR(255) ,
    buy_order_id VARCHAR(255) ,
    buy_coin_balance VARCHAR(255) ,
    buy_unit_balance VARCHAR(255) ,
    buy_coin_exchange VARCHAR(255) ,
    buy_unit_exchange VARCHAR(255) ,
    sell_coin_exchange VARCHAR(255) ,
    sell_unit_exchange VARCHAR(255) ,
    buy_price VARCHAR(255) ,
    buy_trade_money VARCHAR(255) ,
    buy_amount VARCHAR(255) ,
    buy_turnover VARCHAR(255) ,
    buy_status tinyint(4) ,
    sell_exchange VARCHAR(255) ,
    sell_order_id VARCHAR(255) ,
    sell_coin_balance VARCHAR(255) ,
    sell_unit_balance VARCHAR(255) ,
    sell_price VARCHAR(255) ,
    sell_trade_money VARCHAR(255) ,
    sell_amount VARCHAR(255) ,
    sell_turnover VARCHAR(255) ,
    sell_order_api_id INTEGER ,
    buy_order_api_id INTEGER ,
    sell_status tinyint(4) ,
    buy_price_scale INTEGER,
    exchange_heade_pair_id INTEGER,
    buy_amount_scale INTEGER,
    sell_price_scale INTEGER,
    sell_amount_scale INTEGER,
    time_create INTEGER ,
    income VARCHAR(255) ,
    income_rate VARCHAR(255) ,
    trigger_rate VARCHAR(255) ,
    time_balance_buy INTEGER NOT NULL, 
    time_balance_sell INTEGER NOT NULL,
    time_depth_buy INTEGER ,
    time_depth_sell INTEGER ,
    time_order_buy INTEGER ,
    time_order_sell INTEGER ,
    time_order_finish_buy INTEGER ,
    time_order_finish_sell INTEGER ,
    time_sync INTEGER ,
    sync tinyint(1) ,
    status tinyint(1) ,
    insertOrUpdate INTEGER,
    unique (uid,time_balance_buy,time_balance_sell,time_create)
    )`, err => {
    console.log(err);
  });

});

export default db;




