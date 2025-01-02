// router.js
import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/components/AppLayout'
import AdminAppLayout from '@/adminPages/AdminAppLayout.vue'
import LoginVc from '@/components/LoginVc'

import HomeVc from '../pages/HomeVc';
import PeopleCenterVc from '../pages/PeopleCenterVc';

import TeamIntroductionVc from '../pages/TeamIntroductionVc';
import TextVc from '@/pages/TextVc';


import DataVisualizationVc from '../pages/DataVisualizationVc';
import DataSubmitVc from '../pages/DataSubmitVc';
import ResultVc from '../textPages/ResultVc.vue';

import BlastVc from '../pages/BlastVc';
import MafftVc from '../pages/MafftVc';


import ContactVc from '../pages/ContactVc';
import AwardVc from '../textPages/AwardVc';

import AdminHome from "@/adminPages/AdminHome";
import UserAdminVc from "@/adminPages/UserAdminVc";
import ArticleAdminVc from "@/adminPages/ArticleAdminVc";
import { useTokenStore } from '@/store/mytoken';
import path from 'path-browserify';
import ThesisVc from '@/textPages/ThesisVc';
import { componentSizeMap } from 'element-plus';
import AdminStatColumn from '@/adminPages/AdminStatColumn.vue';
import InformationVc from '@/textPages/InformationVc';
import InformationDetailVc from "@/textPages/InformationDetailVc.vue"
import AdminImageManager from '@/adminPages/AdminImageManager.vue';



const routes = [
  {
    path: '/login',
    component: LoginVc,
    name: "login",
  },
  {
    path: '/admin',
    component: AdminAppLayout,
    meta: { title: '后台管理' },
    children: [
      { path: 'homeadmin', component: AdminHome, meta: { title: '通知管理' }},
      { path:'imagemanager',component:AdminImageManager,meta:{title:'图片管理'} },
      { path: 'useradmin', component: UserAdminVc, meta: { title: '用户管理' } },
      { path: 'articlestat', component: AdminStatColumn, meta: { title: '统计表' } },
      { path: 'article', component: ArticleAdminVc, meta: { title: '文章' } },
    ]
  },
  {
    path: '/',
    component: AppLayout,
    meta: { title: "系统" },
    children: [
      {
        path: 'home', component: HomeVc, meta: { title: '首页' },
        children:[
          {
            path:'information',
            component:InformationVc,
            meta:{title:'通知'},
            children:[
              {
                path:'informationdetail',
                component:InformationDetailVc,
                meta:{title:"通知详情"}
              }
            ]
          }
        ]
      },
      { path: 'peoplecenter', component: PeopleCenterVc, meta: { title: '个人中心' } },
      { path: 'teamintroduction', component: TeamIntroductionVc, meta: { title: '团队介绍' } },
      {
        path: 'text', component: TextVc, meta: { title: '文章发表' },
        children: [
          {
            path: 'textstatistics',
            component: ThesisVc,
            meta: { title: '文章' },
          }
        ]
      },
      { path: 'datavisualization', component: DataVisualizationVc, meta: { title: '数据可视化' } },
      {
        path: 'datasubmit', component: DataSubmitVc, meta: { title: '数据提交' },

      },
      {
        path: 'blast', component: BlastVc, meta: { title: 'Blast' },
        children: [
          {
            path: 'resultSSU',
            component: ResultVc,
            meta: { title: '结果显示' }
          }
        ]

      },
      { path: 'mafft', component: MafftVc, meta: { title: 'Mafft' } },
      {
        path: 'contact',
        component: ContactVc,
        meta: { title: '联系我们' }
      },
    ]
  }
];




const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requiresAuth)) {
    console.log("守卫")
    const store = useTokenStore()
    console.log("store.token", store.token.access_token)
    if (!store.token.access_token) {
      next({ name: "login", query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }

})

export default router;
