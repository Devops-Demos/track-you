'use strict';
import async from 'async';
import debug from 'debug';
import InitiativeClass from '../api/classes/InitiativeClass';
const log = debug('cron:initiative-atr');

let getInitiativeTasks = trimmedInitiative => cb => {
  let initiativeId = trimmedInitiative.initiativeId;
  Initiative.findAndPopulateOne(initiativeId)
    .then(initiative => {
      initiative.isPartOfJob = true;
      initiative = (new InitiativeClass(initiative))
        .aggregate();
      log(`KPI atr for initiative : ${initiative.initiativeId} = ${initiative.KpiAchievementToTarget}`);
      return Initiative.update({
        initiativeId
      }, {
        priorityAchievementTargetRatio: initiative.KpiAchievementToTarget
      });
    })
    .then(initiative => {
      initiative = initiative[0];
      log('initiative', initiative.initiativeId, ' updated with ratio', initiative.priorityAchievementTargetRatio);
      cb();
    });
};

module.exports = () => {
  Initiative.find({
    type: 'initiative',
    select: ['initiativeId']
  }, (err, initiatives) => {
    if (err) {
      console.log('Error : ', err);
    }
    let tasks = initiatives.map(getInitiativeTasks);
    async.series(tasks, () => {
      console.log('finished on ', new Date());
    });
  });
};
