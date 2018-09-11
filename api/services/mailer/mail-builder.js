'use strict';
import { startCase, findIndex } from 'lodash';
import moment from 'moment';

const compareStrings = (s1, s2) => {
  if (typeof s1 !== 'string' && typeof s2 !== 'string') {
    return false;
  }
  return s1.toLowerCase() === s2.toLowerCase();
};

const getHeirarchyString = initiativeId => Custom.treeUtils.getInitiativeIdsUp([initiativeId], {
  raw: true
})
  .then(heirarchy => {
    let heirarchyString = '';
    heirarchy.forEach(parentInitiative => {
      if (compareStrings(parentInitiative.type, 'master')) {
        return;
      }
      if (compareStrings(parentInitiative.type, 'priority')) {
        heirarchyString += 'Sector : ' + parentInitiative.initiative + '\n';
      }
      if (compareStrings(parentInitiative.type, 'initiative')) {
        heirarchyString += 'Initiative : ' + parentInitiative.initiative + '\n';
      }
    });
    return heirarchyString;
  });


module.exports = {

  newUser: function(user, password) {
    var newUserConfig = require('./mail-config.json')
        .newUser,
      userNameMessage = newUserConfig.usernameMessage,
      passwordMessage = newUserConfig.passwordMessage,
      link = sails.config.appLink || 'itrack';

    var formattedUsernameMessage = userNameMessage.replace('{name}', user.name || '')
      .replace('{email}', user.email)
      .replace('{link}', link);

    var formattedPasswordMessage = passwordMessage.split('{name}')
      .join(user.name)
      .split('{password}')
      .join(password);

    return {
      userEmail: {
        receiver: user.email,
        subject: newUserConfig.userSubject,
        message: formattedUsernameMessage
      },
      passwordEmail: {
        receiver: user.email,
        subject: newUserConfig.passwordSubject,
        message: formattedPasswordMessage
      }
    };
  },

  activitiesThisWeek: function(activities, owner) {
    var message = 'Hi ' + owner.name + ', the following activities have their planned end dates this week:\n';

    activities.forEach(function(activity) {
      message += activity.initiative + ' , planned end date:' + activity.plannedEndDate + '\n';
    });

    return {
      receiver: owner.email,
      subject: 'Activities Alert',
      message: message
    };
  },

  weeklyStatusUpdate: function(emailData, user) {
    var message = 'Mr./Ms. ' + user.name + ',\nPlease find below for activities and output KPIs to be updated this week:\n\nDelayed Activities:\n',
      appendActivity = function(activity) {
        message += '•' + activity.initiative + '\n';
      },
      appendKpi = function(kpi) {
        message += '•' + kpi.kpi + '\n';
      },
      appendIfNone = function(data, name) {
        if (data.length === 0) {
          message += 'No ' + name + ' for this week\n';
        }
      };
    emailData.activities.delayed.forEach(appendActivity);
    appendIfNone(emailData.activities.delayed, 'delayed activities');
    message += '\nActivities to start this week:\n';
    emailData.activities.upcoming.forEach(appendActivity);
    appendIfNone(emailData.activities.upcoming, 'upcoming activities');
    message += '\nKPIs for which the last milestone is not updated:\n';
    emailData.kpis.delayed.forEach(appendKpi);
    appendIfNone(emailData.kpis.delayed, 'delayed KPIs');
    message += '\nKPIs to update this week:\n';
    emailData.kpis.upcoming.forEach(appendKpi);
    appendIfNone(emailData.kpis.upcoming, 'upcoming KPIs');

    return {
      receiver: user.email,
      subject: 'Weekly Update',
      message: message
    };
  },

  adminChangeEmail: {
    initiative: ({oldData, newData, user}) => {
      const relevantKeys = ['plannedStartDate', 'plannedEndDate'];
      let changes = '';
      relevantKeys.forEach(key => {
        if (oldData[key] === newData[key]) {
          return;
        }
        changes += `
Name of the parameter : ${startCase(key)}
Old value: ${oldData[key]}, New value: ${newData[key]}
`;
      });
      if (!compareStrings(oldData.type, 'activity') || changes === '') {
        return Promise.resolve(null);
      }
      return getHeirarchyString(oldData.initiativeId)
        .then(heirarchyString => {
          heirarchyString += '3-ft action : ' + oldData.initiative;
          return `Hello iTrack administrator,
Please find below the changes made by Mr/Ms ${user.name} for 3-feet action: "${oldData.initiative}"

Heirarchy
${heirarchyString}

Change${changes}`;
        });
    },

    kpi: ({oldData, newData, user}) => getHeirarchyString(oldData.kpi.initiativeId.initiativeId).then(heirarchyString => {
      //Defining a function to return stirng for change in milestones
      const milestoneChange = (oldMilestone, newMilestone) => {
        const newTimePoint = newMilestone.timePoint;
        const oldTimePoint = moment(oldMilestone.timePoint).format('MM/DD/YYYY');
        const oldTarget = Number(oldMilestone.targetValue);
        const newTarget = Number(newMilestone.targetValue);
        if (oldTimePoint === newTimePoint && oldTarget === newTarget) {
          return '';
        }
        let returnString = `
Milestone timepoint : ${oldTimePoint}
`;
        returnString += oldTimePoint === newTimePoint ? '' : `Old milestone timepoint : ${oldTimePoint}, New milestone timepoint : ${newTimePoint}
`;
        returnString += oldTarget === newTarget ? '' : `Old target : ${oldTarget}, New target : ${newTarget}
`;
        return returnString;
      };

      //Defining a funtion to return string for change in parameter
      const paramChange = (oldParam, newParam, name) => {
        if (oldParam === newParam) {
          return '';
        }
        return `Parameter name :${name}
Old Value : ${oldParam}, New Value : ${newParam}

`;
      };

      //Forming initial string
      let returnString = `Please find below the changes made by Mr/Ms. ${user.name} for ${newData.kpiType || oldData.kpi.kpiType || ''} KPI: "${oldData.kpi.kpi}"

Heirarchy:
${heirarchyString}${oldData.kpi.initiativeId.type.toLowerCase() === 'priority' ? 'Sector:' : 'Initiative:'} ${oldData.kpi.initiativeId.initiative}
KPI : ${oldData.kpi.kpi}

`;
      //Forming stirng for params
      let paramChangeString = '';
      paramChangeString += paramChange(Number(oldData.kpi.target), Number(newData.kpiData.target), 'Final Target');
      paramChangeString += paramChange(Number(oldData.kpi.statusSeparator2), Number(newData.kpiData.statusSeparator2), 'Green Yellow Differentiator (%)');
      paramChangeString += paramChange(Number(oldData.kpi.statusSeparator1), Number(newData.kpiData.statusSeparator1), 'Yellow Red Differentiator (%)');
      returnString += paramChangeString;

      //Forming string for milestones
      let milestoneChangeString = '';
      newData.kpiMilestones.forEach(milestone => {
        if (milestone.deleted === true) {
          milestoneChangeString += `
Milestone deleted :
timepoint: ${milestone.timePoint}, target: ${milestone.targetValue || 'N/A'}, actual: ${milestone.actualValue || 'N/A'}
`;
          return;
        }
        const newMilestoneIndex = findIndex(oldData.kpi['KPI Milestone'], {
          sno: milestone.sno
        });
        if (newMilestoneIndex < 0) {
          milestoneChangeString += `
New milestone added :
timepoint: ${milestone.timePoint}, target: ${milestone.targetValue || 'N/A'}, actual: ${milestone.actualValue || 'N/A'}
`;
          return;
        }
        milestoneChangeString += milestoneChange(oldData.kpi['KPI Milestone'][newMilestoneIndex], milestone);
      });
      returnString += milestoneChangeString;

      //Form string for child KPIs
      returnString += '\n';
      let childrenChangeString = '';
      const newDataChildKpis = newData.childKpis;
      oldData.children.forEach(childKpi => {
        const newChildKpiIndex = findIndex(newDataChildKpis, {
          sno: childKpi.sno
        });
        if (newChildKpiIndex < 0) {
          return;
        }
        const oldTarget = Number(childKpi.target);
        const newTarget = Number(newDataChildKpis[newChildKpiIndex].target);
        if (oldTarget === newTarget) {
          return;
        }
        childrenChangeString += `
Child KPI : "${childKpi.kpi}"
`;
        childrenChangeString += paramChange(oldTarget, newTarget, 'Final Target');
      });
      returnString += childrenChangeString;

      if (childrenChangeString === '' && milestoneChangeString === '' && paramChangeString === '') {
        return null;
      }

      return returnString;
    })
  }

};
