import settings from './settings';
import { checkPlugin } from '@/utils/util';
import packageJson from '../../../package.json';
// 程序当前版本
const appCurrentVersion = packageJson.version;


import db from './db';


export const update = () => {

  // // 罗列增量升级脚本
  // const incrementalUpgrade = {
  //   '1.0':()=>{
  //     db.run();
  //   },
  //   '1.0':()=>{
  //     db.run();
  //   },
  // }
  console.log('检查更新')
  // 升级前版本
  const beforeUpgradeVersion = settings.get('version');

  //版本需要升级
  if (checkPlugin(beforeUpgradeVersion, '1.0.5') && (!beforeUpgradeVersion || checkPlugin(beforeUpgradeVersion, appCurrentVersion))) {
    // 寻找执行的脚本 增量执行
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

    db.run(`DROP TABLE  EXCHANGE_API`, err1 => {
      console.log(err1);
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
        )`, err2 => {
          console.log(err2, '----升级完成');
          // 升级完成
          settings.set('version', appCurrentVersion);
        });
    });
  }


  if (checkPlugin(beforeUpgradeVersion, '1.0.12') && (!beforeUpgradeVersion || checkPlugin(beforeUpgradeVersion, appCurrentVersion))) {
   
    
    db.run(`DROP TABLE  LOG`, err1 => {
      console.log(err1);
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
    });
    db.run(`DROP TABLE  EXCHANGE_API`, err1 => {
      console.log(err1);
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
    });
  
    db.run(`DROP TABLE  EXCHANGE`, err1 => {
      console.log(err1);
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
    });
  


    db.run(`DROP TABLE  TRADE_CONFIG`, err1 => {
      console.log(err1);
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
          console.log(err, '----升级完成');
          // 升级完成
          settings.set('version', appCurrentVersion);
        });
    });
  }
}
export default update


