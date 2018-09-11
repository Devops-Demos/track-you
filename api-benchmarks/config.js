'use strict';
module.exports = {
  // address : 'https://pa-itrack.herokuapp.com/'
  address: 'http://localhost:4010/',

  apis: [
    'initiative?initiativeId=0&removeKpi=false&skeleton=true&trimTail=true',
    'initiative?initiativeId=2&removeKpi=false&skeleton=true&trimTail=true',
    'appviewkpis?initiativeId=41&viewName=plantOverview',
    'current-kpis?sno=3',
    'initiative?initiativeId=9&removeKpi=false&skeleton=true&trimTail=false',
    'initiative?initiativeId=9&removeKpi=true&skeleton=true&trimTail=false',
    'initiative?initiativeId=2&removeKpi=false&skeleton=true&trimTail=false',
    'initiative?initiativeId=2&removeKpi=true&skeleton=true&trimTail=true',
    // '/current-user-info',
    // '/current-version'
  ],

  adminApis : [
    // {
    //   apiPath : '/upsert-kpi',
    //   dataBody : require('./mock-data/mock-upsert-kpis.json'),
    //   method : 'post',
    //   info : 'updating kpis'
    // },
    // {
    //   apiPath : '/initiative/2',
    //   dataBody : {'type':'Priority','initiative':'Generation','owner':6,'dept':'Test','parentId':0},
    //   method : 'put',
    //   info : 'updating priorities'
    // },
    // {
    //   apiPath : '/artifact3',
    //   dataBody : {'issue':'test issue','nextSteps':'test next step','keyMilestones':'test key milestone','initiativeId':11},
    //   method : 'post',
    //   info : 'updating issue log'
    // },
    // {
    //   apiPath : '/kpi/43',
    //   method : 'del',
    //   info : 'deleting kpis'
    // }
  ]
};
