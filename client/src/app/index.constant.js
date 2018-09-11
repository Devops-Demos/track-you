function constant() {
  'ngInject';

  return {
    statusColor: {
      completed: '#00C8B9',
      ontrack: '#ECB74C',
      delayed: '#FD6E6B',
      unknown: '#666666'
    },
    statusMap: {
      'onTrack': 'ontrack',
      'ontrack': 'ontrack',
      'delayed': 'delayed',
      'completed': 'completed',
      'unknown': 'unknown'
    },
    chart: {
      line: {
        targetColor: '#808080',
        actualColor: '#33ACE0'
      }
    },
    font: {
      primary: 'roboto-regular'
    },
    server: {
      url: 'http://localhost:4010/'
    },
    periodMap: {
      'current': 7,
      'month': 30,
      'year': 365,
      'quarter': 90
    },
    mobileWidth: 736,
    csrf: false
  };
}

export default constant;
