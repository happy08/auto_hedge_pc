const dateFilter = value => {
  if (value) {
    const d = new Date(parseInt(value));
    const date = {
      Y: d.getFullYear(),
      M: d.getMonth() > 8 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1),
      D: d.getDate() > 9 ? d.getDate() : '0' + d.getDate(),
      h: d.getHours() > 9 ? d.getHours() : '0' + d.getHours(),
      m: d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes(),
      s: d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds(),
    };
    const t = date.h + ':' + date.m + ':' + date.s;
    // const t = date.Y + '-' + date.M + '-' + date.D + ' ' + date.h + ':' + date.m + ':' + date.s;
    return t;
  }
  return '';
};
const dateTimeFilter = value => {
  const d = new Date();
  if (d) {

    const date = {
      Y: d.getFullYear(),
      M: d.getMonth() > 8 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1),
      D: d.getDate() > 9 ? d.getDate() : '0' + d.getDate(),
      h: d.getHours() > 9 ? d.getHours() : '0' + d.getHours(),
      m: d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes(),
      s: d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds(),
    };
    // const t = date.h + ':' + date.m + ':' + date.s;
    const t = date.Y + '-' + date.M + '-' + date.D + ' ' + date.h + ':' + date.m + ':' + date.s;
    return t;
  }
  return '';
};
const filterPhone = value => {
  // var tel = 18810399133;
  let tel = "" + value;
  var tel1 = tel.substr(0,3) + "****" + tel.substr(7)
  // console.log(tel1);
  return tel1
}

const subStringNum = (a, num) => {
  var a_type = typeof (a);
  if (a_type == "number") {
    var aStr = a.toString();
    var aArr = aStr.split('.');
  } else if (a_type == "string") {
    var aArr = a.split('.');
  }

  if (aArr.length > 1) {
    a = aArr[0] + "." + aArr[1].substr(0, num);
  }
  return a
}
const getRegexp = type => {
  switch (type) {
    case 'money':
      return /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    default:
      return null;
  }
};
//计算版本号大小,转化大小
const toNum = a => {
  var a = a.toString();
  var c = a.split('.');
  var num_place = ["", "0", "00", "000", "0000"], r = num_place.reverse();
  for (var i = 0; i < c.length; i++) {
    var len = c[i].length;
    c[i] = r[len] + c[i];
  }
  var res = c.join('');
  return res;
}
//检测插件版本号是否需要更新
const checkPlugin = (a, b) => {
  if(!a && b){
    return true
  }
  if(!a && !b){
    return false
  }
  if(a && !b){
    return false
  }
  var a = toNum(a);
  var b = toNum(b);
  if (a == b) {
    return false
  } else if (a > b) {
    return false
  } else {
    return true
  }
}
//  const getDatePickerOpt = () => {
//   return {
//     disabledDate: date => {
//       return date.valueOf() > Date.now();
//     },
//   };
// };

//截取n位小数 val值  num位数
const myToFixed = (val,num=2) =>{
   if(!val){
    return 0
   }
   return parseFloat(val).toFixed(num)
}

//保留前后N位 中间星号
const toStart = (str,prenum=3,endnum=-3) => {
  return str.length>prenum ? str.substr(0, prenum) + "******" + str.substr(endnum) : str
}


export {
  dateFilter,
  getRegexp,
  filterPhone,
  dateTimeFilter,
  subStringNum,
  toNum,
  checkPlugin,
  // getDatePickerOpt,
  myToFixed,
  toStart
}