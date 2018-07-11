import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/malfunction-analysis',
      name: 'MalfunctionAnalysis',
      component: require('@/components/malfunction-analysis').default
    },
    {
      path: '/production-analysis',
      name: 'ProductionAnalysis',
      component: require('@/components/production-analysis').default
    },
    {
      path: '*',
      redirect: '/malfunction-analysis'
    }
  ]
})
