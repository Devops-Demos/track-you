class InitiativeAdapter {
  constructor(DataService) {
    'ngInject';
    this.DataService = DataService;
  }

  getInitiatives(initiativeId) {
    let data = this.DataService.getInitiatives();
    if (data) {
      let initiatives = _.filter(data, function(initiative) {
        if (parseInt(initiativeId) === 0) {
          return !!!initiative.parentId && initiative.type.toLowerCase() === 'priority';
        } else {
          return parseInt(initiative.parentId) === parseInt(initiativeId);
        }
      });
      return initiatives;
    }
  }

  getInitiative(initiativeId) {
    let data = this.DataService.getInitiatives();
    if (data) {
      return _.find(data, function(initiative) {
        if (initiative.initiativeId === parseInt(initiativeId)) {
          return initiative;
        }
      });
    }
  }

  isLastInitiative(initiativeId) {
    let data = this.DataService.getInitiatives();

    if (data) {
      let child = _.find(data, function(initiative) {
        return initiative.parentId === parseInt(initiativeId);
      });
      return !!child;
    }
  }

  getParentChain(initiativeId, fullChain) {
    let data = this.DataService.getInitiatives(),
      parentDatum = [],
      flag = false,
      parentdata = initiativeId;
    if (data) {
      do {
        let parent = this.getInitiative(parentdata),
          chainCheck = fullChain ? (parent && parent.parentId !== -1) : (parent && parent.parentId && parent.parentId !== -1);
        if (chainCheck) {
          let dataObj = {};
          dataObj.type = parent.type;
          dataObj.sno = parent.initiativeId;
          dataObj.name = parent.initiative;
          dataObj.owner = parent.owner;
          parentdata = parent.parentId;
          parentDatum.push(dataObj);
          flag = true;
        } else {
          flag = false;
        }
      } while (flag);
    }

    _(parentDatum).reverse().value();

    return (parentDatum.length > 0) ? parentDatum : 0;
  }
}

export default InitiativeAdapter;
