/**
 * 中币网和比特儿签名计算
 */
import {sha1,hmacMD5} from './crypto';
import {sort_ASCII} from './common';
 let access_key = '1231f987-d1d3-44de-8d8f-cb094a5ad58a';
 let secret_key = 'e9d7d65f-05e6-4e85-89f1-8758d284ac32';

const http_build_query = params => {
    //输入是对象，转换成a=1&b=2&c=3 
    let res = '';
    if(Object.keys(params).length>0){
        for (var key of Object.keys(params)) {
            if(res==''){
                res += key+'='+params[key];
            }else{
                res += '&' + key+'='+params[key];
            }
            
        }
    }
    return res;
}
 //params 必须是数组
const signTool = params => {
    
    //中币网
    if (type == 1) {

        /**
         * 签名方式：先用sha加密secretkey，
         * 然后根据加密过的secretkey把请求的参数签名，
         * 请求参数按照ascii值排序加密，
         * 通过md5填充16位加密
         */

        let newParams = sort_ASCII(params);
        params.accesskey = access_key;
        let tPreSign = http_build_query(newParams); 
        let secretkey = sha1(secret_key);
        let tSign = hmacMD5(tPreSign,secretkey);
        newParams.sign = tSign;
        newParams.reqTime = new Date().getTime();
        let tResult=http_build_query(newParams);
        return tResult;
    }
     //中币网
     if (type == 2) {
        //console.log(msg);
      }
  };

//   function createSign($pParams = array()){    
//     $tPreSign = http_build_query($pParams, '', '&');
//     $SecretKey = sha1($this->secret_key);
//     $tSign=hash_hmac('md5',$tPreSign,$SecretKey);
//     $pParams['sign'] = $tSign;
//     $pParams['reqTime'] = time()*1000;
//     $tResult=http_build_query($pParams, '', '&');
//     return $tResult;
// }

  export {
    http_build_query
  };
  