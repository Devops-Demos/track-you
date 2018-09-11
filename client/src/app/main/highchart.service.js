class HighChartService {
  constructor(pushAppConstants) {
    'ngInject';
    this.constants = pushAppConstants;
    this.initialChartObject = {
      title: {
        text: null
      },
      subtitle: {
        text: null
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      legend: {
        enabled: false
      }
    };
  }

  getBarChart() {
    let barObject = angular.copy(this.initialChartObject);
    barObject.chart = {
      type: 'bar'
    };
    barObject.xAxis = {
      tickLength: 0,
      tickInterval: 1
    };
    barObject.yAxis = {
      lineWidth: 1,
      gridLineWidth: 0,
      title: {
        text: null
      }
    };
    return barObject;
  }

  getLineChart() {
    let lineObject = angular.copy(this.initialChartObject);
    lineObject.chart = {
      style: {
        fontFamily: this.constants.font.primary
      }
    };
    lineObject.xAxis = {
      tickLength: 0,
      tickInterval: 1
    };
    lineObject.yAxis = {
      lineWidth: 1,
      gridLineWidth: 0,
      title: {
        text: null
      }
    };
    lineObject.legend = {
      enabled: true,
      align: 'center'
    };
    return lineObject;
  }

  getAreaChart() {
    let areaObject = angular.copy(this.initialChartObject);
    areaObject.chart = {
      type: 'area',
      spacingRight: 10
    };
    areaObject.xAxis = {
      type: 'datetime',
      dateTimeLabelFormats: {
        second: '%Y-%m-%d<br/>%H:%M:%S',
        minute: '%Y-%m-%d<br/>%H:%M',
        hour: '%Y-%m-%d<br/>%H:%M',
        day: '%Y<br/>%m-%d',
        week: '%Y<br/>%m-%d',
        month: '%Y-%m',
        year: '%Y'
      }
    };
    areaObject.xAxis = {
      tickLength: 0,
      tickInterval: 1
    };
    areaObject.yAxis = {
      lineWidth: 1,
      gridLineWidth: 0,
      title: {
        text: null
      }
    };
    areaObject.tooltip = {
      shared: true
    };
    areaObject.plotOptions = {
      area: {
        stacking: 'normal',
        lineWidth: 1,
        marker: {
          enabled: false
        },
        shadow: false,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      }
    };
    areaObject.legend = {
      enabled: true,
      align: 'center'
    };

    return areaObject;
  }

  getPieChart() {
    let chartClass = $(".activity__chart"),
      height = chartClass.height(),
      pieChart = _.clone(this.initialChartObject);
    pieChart.chart = {
      type: 'pie',
      renderTo: chartClass,
      height: height
    };
    pieChart.title = {
      style: {
        'fontSize': '12px'
      },
      text: null
    };
    pieChart.tooltip = {
      enabled: false
    };
    pieChart.plotOptions = {
      pie: {
        size: '100%',
        allowPointSelect: false,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          connectorWidth: 0,
          distance: -20,
          format: '{point.percentage:.1f} %'
        }
      },
      series: {
        states: {
          connectNulls: true,
          hover: {
            enabled: false
          }
        },
        dataLabels: {
          color: 'white',
          style: {
            textShadow: false,
            fontWeight: 100
          }
        }
      }
    };
    pieChart.series = [{
      name: 'Activity Implementation Level',
      data: [{
        name: 'completed',
        color: this.constants.statusColor.completed
      }, {
        name: 'onTrack',
        color: this.constants.statusColor.ontrack
      }, {
        name: 'delayed',
        color: this.constants.statusColor.delayed
      }]
    }];
    return pieChart;
  }

  getGaugeChart() {
    let chartClass = $('.kpi__chart'),
      height = chartClass.height() || 400,
      gaugeChart = _.clone(this.initialChartObject);
    gaugeChart.chart = {
      type: 'gauge',
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false,
      renderTo: chartClass,
      height: height
    };
    gaugeChart.pane = {
      startAngle: -180,
      endAngle: 90,
      background: null
    };
    gaugeChart.plotOptions = {
      gauge: {
        size: '100%',
        cursor: 'pointer',
        dial: {
          baseWidth: 10,
          backgroundColor: 'black',
          rearLength: 0,
          baseLength: 0,
          radius: 70
        },
        pivot: {
          radius: 5,
          borderWidth: 0,
          backgroundColor: 'black'
        },
        dataLabels: {
          borderWidth: 0,
          y: 10,
          x: 20
        }
      }
    };
    return gaugeChart;
  }

  getDialChart() {
    let progressCircle = _.clone(this.initialChartObject);
    progressCircle.chart = {
      type: 'solidgauge'
    };
    progressCircle.pane = {
      center: ['50%', '50%'],
      size: '75%',
      startAngle: 0,
      endAngle: 360,
      background: {
        backgroundColor: '#EEE',
        innerRadius: '90%',
        outerRadius: '100%',
        shape: 'arc'
      }
    };
    progressCircle.yAxis = {
      lineWidth: 0,
      minorTickInterval: null,
      tickWidth: 0,
      labels: {
        enabled: false
      }
    };
    progressCircle.plotOptions = {
      solidgauge: {
        innerRadius: '90%',
        dataLabels: {
          y: -20,
          borderWidth: 0,
          useHTML: true
        }
      }
    };
    return progressCircle;
  }

}
export default HighChartService;
