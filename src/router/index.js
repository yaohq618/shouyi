// router.js
import { createRouter, createWebHistory } from 'vue-router';


import HomeVc from '../pages/HomeVc';
import PeopleCenterVc from '../pages/PeopleCenterVc';

import TeamIntroductionVc from '../pages/TeamIntroductionVc';
import TextVc from '../pages/TextVc';


import DataVisualizationVc from '../pages/DataVisualizationVc';
import DataSubmitVc from '../pages/DataSubmitVc';
import ResultVc from '../textPages/ResultVc.vue';

import BlastVc from '../pages/BlastVc';
import MafftVc from '../pages/MafftVc';


import ContactVc from '../pages/ContactVc';
import AwardVc from '../textPages/AwardVc';




const routes = [
  {
    path: '/',
    meta: { requireAuth: true, title: "系统" },
    children: [
      { path: 'home', component: HomeVc, meta: { title: '首页' } },
      { path: 'peoplecenter', component: PeopleCenterVc, meta: { title: '个人中心' } },


      { path: 'teamintroduction', component: TeamIntroductionVc, meta: { title: '团队介绍' } },
      {
        path: 'text', component: TextVc, meta: { title: '文章发表' },
        children: [
          {
            path: 'award',
            component: AwardVc,
            meta: { title: '获奖' }
          }

        ]
      },


      { path: 'datavisualization', component: DataVisualizationVc, meta: { title: '数据可视化' } },
      {
        path: 'datasubmit', component: DataSubmitVc, meta: { title: '数据提交' },
        children: [
          {
            path: 'resultSSU',
            component: ResultVc,
            meta: { title: '结果显示' }
          }
        ]
      },


      { path: 'blast', component: BlastVc, meta: { title: 'Blast' } },
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

export default router;
