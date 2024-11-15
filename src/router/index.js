import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/layout/app-index.vue'
import Attack from '@/views/attack/attack-index.vue'
import Attack_index from '@/views/attack/attack_index/attack_index.vue'
import Danger from '@/views/danger/danger-inedx.vue'
import Danger_index from '@/views/danger/danger_index/danger_index.vue'
import Danger_detail from '@/views/danger/danger_detail/danger_detail.vue'
import Attack_detail from '@/views/attack/attack_detail/attack_detail.vue'
import Dashboard from '@/views/dashboard/dashboard-index.vue'
import Dashboard_index from '@/views/dashboard/dashboard_index/dashboard_index.vue'
import Home from '@/views/home/Home-index.vue'
import Alert from '@/views/alert/alert-index.vue'
import Alert_index from '@/views/alert/alert_index/alert_index.vue'
import Alert_detail from '@/views/alert/alert_detail/alert_detail.vue'
import Log_detail from '@/views/alert/alert_detail/log_detail/log_detail.vue'
import Case from '@/views/cases/cases-index.vue'
import Case_index from '@/views/cases/cases_index/cases_index.vue'
import Case_detail from '@/views/cases/cases_detail/cases_detail.vue'
import Root_clue from '@/views/cases/cases_detail/root_clue/root_clue.vue'
import Traceability_diagram from '@/views/cases/cases_detail/traceability_diagram/traceability_diagram.vue'
import Rules from '@/views/rules/rule-index.vue'
import Rule_index from '@/views/rules/rule_index/rule_index.vue'
import Disposal_record from '@/views/cases/cases_detail/disposal_record/disposal_record.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',   //根路由，组件为layout下的app-index.vue
    component: Layout,
    children: [    //子路由
      {
        path: '/',  //一级子路由'/'，默认显示，内容为home下的Home-index.vue，即首页内容
        name: 'home',
        component: Home,
      },
      {
        path: '/matrix',
        name: 'matrix',
        component: Attack,
        children: [
          {
            path: 'index',
            name: Attack_index,
            component: Attack_index
          },
          {
            path: 'detail',
            name: Attack_detail,
            component: Attack_detail
          }
        ]
      },
      {
        path: '/danger',
        name: 'danger',
        component: Danger,
        children: [
          {
            path: 'index',
            name: Danger_index,
            component: Danger_index
          },
          {
            path: 'detail',
            name: Danger_detail,
            component: Danger_detail
          }
        ]
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        children: [
          {
            path: 'index',
            name: Dashboard_index,
            component: Dashboard_index
          }
        ]
      },
      {
        path: '/alert',
        name: 'alert',
        component: Alert,
        children: [
          {
            path: 'index',
            name: Alert_index,
            component: Alert_index
          },
          {
            path: 'alertdetail',
            name: Alert_detail,
            component: Alert_detail
          },
          {
            path: 'logdetail',
            name: Log_detail,
            component: Log_detail
          }
        ]
      },
      {
        path: '/case',
        name: 'case',
        component: Case,
        children: [
          {
            path: 'index',
            name: Case_index,
            component: Case_index
          },
          {
            path: 'casedetail',
            name: Case_detail,
            component: Case_detail,
            children:[
              {
                path: 'root_clue',
                name: Root_clue,
                component: Root_clue
              },
              {
                path: 'traceability_diagram',
                name: Traceability_diagram,
                component: Traceability_diagram
              },
              {
                path: 'disposal_record',
                name: Disposal_record,
                component: Disposal_record
              },

            ]
          },

        ]
      },
      {
        path: '/rules',
        name: 'rules',
        component: Rules,
        children: [
          {
            path: 'index',
            name: Rule_index,
            component: Rule_index
          }
        ]
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  historyApiFallback: true,   //使用history模式，historyApiFallback使路由在刷新时从根节点进行刷新
  //base: process.env.BASE_URL,
  routes   //包含上面定义的路由
})

export default router