
const menu = [
  {
    title: '行情',
    path: '/trade',
    component: resolve => require(['@/pages/menu/Trade'], resolve)
  },
  {
    title: '自动对冲',
    path: '/auto-hedge',
    component: resolve => require(['@/pages/menu/AutoHedge'], resolve)
  },
  {
    title: '市场配置',
    path: '/market-config',
    component: resolve => require(['@/pages/menu/MarketConfig'], resolve)
  },
  {
    title: '邀请好友',
    path: '/invite',
    component: resolve => require(['@/pages/menu/Invite'], resolve)
  },
  {
    title: '我的佣金',
    path: '/mycommission',
    component: resolve => require(['@/pages/menu/MyCommission'], resolve)
  },
  {
    title: '个人中心',
    path: '/center',
    component: resolve => require(['@/pages/menu/Center'], resolve)
  },
  {
    title: '充值购买',
    path: '/topup',
    component: resolve => require(['@/pages/menu/Topup'], resolve)
  },
  {
    title: '我的MBB',
    path: '/myMBB',
    component: resolve => require(['@/pages/menu/MyMBB'], resolve)
  },
  {
    title: 'MBB充提',
    path: '/MBBRecharge',
    component: resolve => require(['@/pages/menu/MBBRecharge'], resolve)
  },
];
export default menu;
