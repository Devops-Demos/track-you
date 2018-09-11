module.exports = () => ({
  oldData: {
    evidence: [],
    participants: [],
    owner: null,
    activityCount: null,
    description: null,
    details: null,
    dept: 'Select none',
    artifactsUpdatedAt: null,
    status: null,
    type: 'activity',
    createdAt: '2016-06-10T12:10:13.000Z',
    updatedAt: '2016-07-06T07:31:44.000Z',
    initiativeId: 27,
    parentId: 67,
    initiative: 'Identify the most popularly requested species based on permit applications',
    avgAchievmentLevel: null,
    plannedStartDate: '04/18/2016',
    plannedEndDate: '05/13/2016',
    actualStartDate: '04/18/2016',
    actualEndDate: '05/13/2016',
    levelOfAchievment: null,
    priorityAchievementTargetRatio: null
  },

  newData: {
    same: {
      type: 'activity',
      initiative: 'Identify the most popularly requested species based on permit applications',
      parentId: 67,
      dept: 'Select none',
      owner: null,
      plannedStartDate: '04/18/2016',
      plannedEndDate: '05/13/2016',
      actualStartDate: '04/18/2016',
      actualEndDate: '05/13/2016'
    },
    oneChange: {
      type: 'activity',
      initiative: 'Identify the most popularly requested species based on permit applications',
      parentId: 67,
      dept: 'Select none',
      owner: null,
      plannedStartDate: '04/18/2016',
      plannedEndDate: '04/18/2016',
      actualStartDate: '04/18/2016',
      actualEndDate: '05/13/2016'
    },
    different: {
      type: 'activity',
      initiative: 'Identify the most popularly requested species based on permit applications',
      parentId: 67,
      dept: 'Select none',
      owner: null,
      plannedStartDate: '05/18/2016',
      plannedEndDate: '05/12/2016',
      actualStartDate: '04/11/2016',
      actualEndDate: '02/13/2016'
    }
  },

  user: {
    email: 'demo_admin@test.com',
    name: 'Admin',
    department: 'Test',
    role: null,
    password: '$2a$10$n8WWsTR7fw/WHo4v1Hgjm.c0xBVVXmyyshER/QuPH8DigjK8Ta4s6',
    id: 15,
    createdAt: '2016-06-10T15:59:30.000Z',
    updatedAt: '2016-06-14T04:59:13.000Z',
    isPasswordReset: true,
    tempPassword: '$2a$10$HSpzp8b/I38Ybr1j0CqKpewD16lLZWbivJbTCid/lU1F8XJ19QveW',
    viewAll: true,
    updateAllOutComeKpis: true,
    updateAllOutputKpis: true,
    updateAllIssueLogs: true,
    updateAllActivities: true,
    updateAllExecutiveSummaries: true,
    crudArtifacts: true,
    crudUsers: true,
    viewParentage: true
  },

  results: {
    adminInitiativeChange1: `Hello iTrack administrator,
Please find below the changes made by Mr/Ms Admin for 3-feet action: "Identify the most popularly requested species based on permit applications"

Heirarchy
Sector : Priority 2 (Beodu Boulevard)
Initiative : Initiative 8 (Wiow Pass)
Initiative : Initiative 10 (Nudut Court)
3-ft action : Identify the most popularly requested species based on permit applications

Change
Name of the parameter : Planned Start Date
Old value: 04/18/2016, New value: 05/18/2016

Name of the parameter : Planned End Date
Old value: 05/13/2016, New value: 05/12/2016
`,

    adminInitiativeChange2: `Hello iTrack administrator,
Please find below the changes made by Mr/Ms Admin for 3-feet action: "Identify the most popularly requested species based on permit applications"

Heirarchy
Sector : Priority 2 (Beodu Boulevard)
Initiative : Initiative 8 (Wiow Pass)
Initiative : Initiative 10 (Nudut Court)
3-ft action : Identify the most popularly requested species based on permit applications

Change
Name of the parameter : Planned End Date
Old value: 05/13/2016, New value: 04/18/2016
`

  },

  kpi: {
    oldData: {
      kpi: {
        'KPI Milestone': [
          {
            sno: 26,
            timePoint: '2016-06-20T18:30:00.000Z',
            targetValue: '18.6',
            actualValue: '55.7',
            initiativeId: 4,
            parentId: 3
          },
          {
            sno: 32,
            timePoint: '2016-06-20T18:30:00.000Z',
            targetValue: '52.2',
            actualValue: '60.2',
            initiativeId: 4,
            parentId: 3
          },
          {
            sno: 40,
            timePoint: '2016-06-20T18:30:00.000Z',
            targetValue: '28.1',
            actualValue: '60.9',
            initiativeId: 4,
            parentId: 3
          }],
        initiativeId: {
          description: 'Dokapis ipwo vicok vehrik guv ih oniriz podeab fu jibite muaf dekoc fodu nofloke luh vuj jug.',
          details: 'Hidwi aha uviv kuzdi juhfulik obikukbur bu cahbi cosju de fifujdab wa ib komlon ka uzah.',
          dept: 'C',
          artifactsUpdatedAt: '2016-06-21T14:47:07.000Z',
          status: null,
          type: 'initiative',
          createdAt: '2016-06-21T14:47:07.000Z',
          updatedAt: '2016-06-21T14:47:20.000Z',
          owner: 11,
          initiativeId: 4,
          parentId: 2,
          initiative: 'Initiative 4 (Refuh River)',
          avgAchievmentLevel: null,
          plannedStartDate: null,
          plannedEndDate: null,
          actualStartDate: null,
          actualEndDate: null,
          levelOfAchievment: null,
          priorityAchievementTargetRatio: '0.7079062623007955',
          activityCount: 3
        },
        sno: 3,
        kpi: 'KPI sno (3) gimjeak',
        target: '37.7',
        statusSeparator1: 6.3,
        statusSeparator2: 48.45
      },
      children: [{
        sno: 9,
        target: '29.9',
        kpi: 'KPI sno (9) va'
      }]
    },

    newData: {
      kpiType: 'output',
      kpiMilestones: [{
        sno: 40,
        timePoint: '06/20/2016',
        targetValue: 28.1,
        actualValue: 60.9,
        deleted: false
      }],
      kpiData: {
        kpi: 'KPI sno (3) gimjeak',
        baseline: 39.55,
        target: 18.6,
        sno: 3,
        kpiType: 'output',
        parentKpi: null,
        hasDrillDown: true,
        isCalculated: false,
        statusSeparator1: 6.3,
        statusSeparator2: 48.45,
        initiativeId: 4,
        achievementTargetRatio: -0.7708830548926019,
        percentileActual: 0
      },
      childKpis: [{
        initiativeId: '1',
        kpi: 'abc',
        uom: 'jow',
        baseline: 10,
        target: 20,
        widget: null,
        status: null,
        sno: 9
      }]
    },

    newDataUnchanged: {
      kpiType: 'output',
      kpiMilestones: [
        {
          sno: 26,
          timePoint: '06/21/2016',
          targetValue: '18.6',
          actualValue: '55.7',
          initiativeId: 4,
          parentId: 3
        },
        {
          sno: 32,
          timePoint: '06/21/2016',
          targetValue: '52.2',
          actualValue: '60.2',
          initiativeId: 4,
          parentId: 3
        },
        {
          sno: 40,
          timePoint: '06/21/2016',
          targetValue: '28.1',
          actualValue: '60.9',
          initiativeId: 4,
          parentId: 3
        }
      ],
      kpiData: {
        kpi: 'KPI sno (3) gimjeak',
        baseline: 39.55,
        target: 37.7,
        sno: 3,
        kpiType: 'output',
        parentKpi: null,
        hasDrillDown: true,
        isCalculated: false,
        statusSeparator1: 6.3,
        statusSeparator2: 48.45,
        initiativeId: 4,
        achievementTargetRatio: -0.7708830548926019,
        percentileActual: 0
      },
      childKpis: []
    },

    user: {
      email: 'admin@test.com',
      name: 'Admin',
      department: 'Test',
      role: 'A',
      password: '$2a$10$Z0qv2EnPI.qgNzhPSGH8y.gVTas7qzS1CG7cPlZmIfjkyYlmVa5pu',
      id: 1,
      createdAt: '2016-06-21T14:47:10.000Z',
      updatedAt: '2016-06-21T14:47:11.000Z',
      isPasswordReset: false,
      tempPassword: null,
      viewAll: true,
      updateAllOutComeKpis: true,
      updateAllOutputKpis: true,
      updateAllIssueLogs: true,
      updateAllActivities: true,
      updateAllExecutiveSummaries: true,
      crudArtifacts: true,
      crudUsers: true,
      viewParentage: false
    },

    result: `Please find below the changes made by Mr/Ms. Admin for output KPI: "KPI sno (3) gimjeak"

Heirarchy:
Sector : Priority 2 (Beodu Boulevard)
Initiative: Initiative 4 (Refuh River)
KPI : KPI sno (3) gimjeak

Parameter name :Final Target
Old Value : 37.7, New Value : 18.6


Milestone timepoint : 06/21/2016
Old milestone timepoint : 06/21/2016, New milestone timepoint : 06/20/2016


Child KPI : "KPI sno (9) va"
Parameter name :Final Target
Old Value : 29.9, New Value : 20

`
  }
});
