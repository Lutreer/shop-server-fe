import Vue from "vue";
import Router from "vue-router";

Vue.use(Router)

export default new Router({
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: require('@/components/DashboardPage'),
      children: [
        {
          path: '/',
          name: 'welcome',
          component: require('@/components/WelcomePage')
        },
        {
          path: 'goods',
          name: 'goods',
          component: require('@/components/Goods/GoodsPage')
        },
        {
          path: 'goods/add',
          name: 'goods_add',
          component: require('@/components/Goods/GoodsAddPage')
        },
        {
          path: 'goods/edit/:id',
          name: 'goods_edit',
          component: require('@/components/Goods/GoodsAddPage'),
          props: true
        },
        {
          path: 'category',
          name: 'category',
          component: require('@/components/Category/CategoryPage')
        },
        {
          path: 'category/add',
          name: 'category_add',
          component: require('@/components/Category/CategoryAddPage')
        },
        {
          path: 'category/edit/:id',
          name: 'category_edit',
          component: require('@/components/Category/CategoryAddPage'),
          props: true
        },
        {
          path: 'brand',
          name: 'brand',
          component: require('@/components/Brand/BrandPage')
        },
        {
          path: 'brand/add',
          name: 'brand_add',
          component: require('@/components/Brand/BrandAddPage')
        },
        {
          path: 'brand/edit/:id',
          name: 'brand_edit',
          component: require('@/components/Brand/BrandAddPage'),
          props: true
        },
        {
          path: 'order/list',
          name: 'orderList',
          component: require('@/components/Order/OrderPage')
        },
        {
          path: 'order/allGoods',
          name: 'allOrderGoods',
          component: require('@/components/Order/AllOrderGoods')
        },
        // {
        //   path: 'order/detail',
        //   name: 'order_detail',
        //   component: require('@/components/Order/OrderDetailPage')
        // },
        {
          path: 'operate/topic',
          name: 'topic',
          component: require('@/components/Topic/TopicPage')
        },
        {
          path: 'operate/topic/add',
          name: 'topic_add',
          component: require('@/components/Topic/TopicAddPage')
        },
        {
          path: 'operate/topic/edit',
          name: 'topic_edit',
          component: require('@/components/Topic/TopicAddPage'),
          props: true
        },
        {
          path: 'user',
          name: 'user',
          component: require('@/components/User/UserPage')
        },
        {
          path: 'user/add',
          name: 'user_add',
          component: require('@/components/User/UserAddPage')
        },
        {
          path: 'setting/wechat',
          name: 'setting_wechat',
          component: require('@/components/Setting/WechatSetting')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/components/LoginPage')
    },
    {
      path: '*',
      redirect: '/dashboard'
    }
  ]
})
