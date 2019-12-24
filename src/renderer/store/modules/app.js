/**
 * 处理业务数据
 */
import { getToken, setToken, removeToken } from "@/utils/common";
 

const app = {
  state: {
    // token: getToken(),
    // bucketList: [],
    // list: [],
    // currentBucket: "",
    // url: []
  },
  mutations: {
    // SET_TOKEN: (state, data) => {
    //   state.token = data;
    // },
    // REMOVE_TOKEN: (state, data) => {
    //   state.token = data;
    // }
   
  },
  actions: {
    // SetToken: ({ commit }, data) => {
    //   return new Promise((resolve) => {
    //     setToken(data);
    //     commit("SET_TOKEN", data);
    //     resolve();
    //   });
    // },
    // RemoveToken: ({ commit }) => {
    //   removeToken();
    //   commit("REMOVE_TOKEN", "");
    // }
  }
};

export default app;
