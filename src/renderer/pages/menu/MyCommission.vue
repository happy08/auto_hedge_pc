<template>
  <div class="content_box">
    <div class="left">
      <commission></commission>
      <moneyrecord></moneyrecord>
    </div>
    <div class="right">
      <commissionMoney></commissionMoney>
      <coinAddress></coinAddress>
    </div>
  </div>
</template>
<script>
import util from "../../utils/util";

import Commission from "../component/MyCommission/commission";
import Moneyrecord from "../component/MyCommission/moneyrecord";
import CommissionMoney from "../component/MyCommission/commissionMoney";
import CoinAddress from "../component/MyCommission/coinAddress";

export default {
  components: {
     Commission,
     Moneyrecord,
     CommissionMoney,
     CoinAddress
  },
  // components: {
  //   [Commission.name]: Commission,
  //   [Moneyrecord.name]: Moneyrecord,
  //   [CommissionMoney.name]: CommissionMoney,
  //   [CoinAddress.name]: CoinAddress,
  // },
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {}
};
</script>
<style lang="less" scoped>

.content_box {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}
.left > h2,
.right > h2 {
  margin-top: 20px;
  margin-left: 20px;
  height: 18px;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: #1E47A6;
  line-height: 18px;
}
.commission {
  background: rgba(255, 255, 255, 1);
  padding-top: 20px;
}
 
 
.left {
  flex: 1;
  height: 100%;
  // background: rgba(255, 255, 255, 1);
  // box-shadow: 4px 4px 5px 0px rgba(6, 0, 1, 0.05);
  // border-radius: 10px;
}
.right {
  flex: 1;
  height: 100%;
  // overflow-y: scroll;
  margin-left: 20px;
  width: 100%;
  // background: rgba(255, 255, 255, 1);
  // box-shadow: 4px 4px 5px 0px rgba(6, 0, 1, 0.05);
  // border-radius: 10px;
}


</style>
