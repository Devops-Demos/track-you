class MainAdapter {
  constructor(DataService, $q) {
    'ngInject';
    this.DataService = DataService;
    this.$q = $q;
  }

  isStorageSupported() {
    try {
      localStorage.setItem('test', 'testData');
      localStorage.removeItem('test');
      sessionStorage.setItem('test', 'testData');
      sessionStorage.removeItem('test');
      return true;
    } catch (exception) {
      return false;
    }
  }

  convertDate(dateString) {
    let dateObj = new Date(dateString);
    let month = ((dateObj.getMonth() + 1) < 10) ? '0' + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
    let date = (dateObj.getDate() < 10) ? '0' + dateObj.getDate() : dateObj.getDate();
    return dateObj.getFullYear() + '-' + month + '-' + date;
  }

  convertDateMmDdYyyy(dateString) {
    let dateObj = new Date(dateString);
    let month = ((dateObj.getMonth() + 1) < 10) ? '0' + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
    let date = (dateObj.getDate() < 10) ? '0' + dateObj.getDate() : dateObj.getDate();
    return month + '/' + date + '/' + dateObj.getFullYear();
  }

  formatNumberString(number) {
    var parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  isIE() {
    if (window.navigator.userAgent.indexOf('MSIE ') > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      return true;
    } else {
      return false;
    }
  }

  isiPhoneSafari() {
    return navigator.userAgent && !navigator.userAgent.match('CriOS') && navigator.userAgent.match(/iPhone/i);
  }

  isModeFullscreen() {
    return ('standalone' in window.navigator) && window.navigator.standalone !== true;
  }

  compareDate(date1, date2) {
    return (new Date(date1).setHours(0, 0, 0, 0) - new Date(date2).setHours(0, 0, 0, 0) >= 0);
  }

  resetDateHours(date) {
    return (new Date(date).setHours(0, 0, 0, 0));
  }

  calculatePastDateFromCurrent(difference) {
    return new Date().setDate(new Date().getDate() - difference);
  }

  roundOffToNDecimals(number, n) {
    return Math.round(number * Math.pow(10, n)) / Math.pow(10, n);
  }

  isMobile() {
    return navigator.userAgent && navigator.userAgent.match(/iPhone|android/i) ? true : false;
  }
}

export default MainAdapter;