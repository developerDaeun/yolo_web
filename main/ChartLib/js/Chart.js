

/**
 * @date 2019.01.11
 * @author 
 * @desc 테스트 함수 구현
 * @param
 * @return
 *
 */
function fnSetViewer()
{
	alert("fnSetViewer() 함수 호출");
}



/**
 * @date 2019.01.11
 * @author 
 * @desc 바 그래프를 보여준다.
 그래프를 보여준다.
 * @param
 *  - obj_id : 객체 id
 *  - chart_info : 입력값
 *   ex. chart_info = {"chart":{"caption":"Bar Chart"}, "data":[{"label": "A", "value": "1"},{"label": "B", "value": "2"},{"label": "C", "value": "3"}]}
 * @return
 *
 */
function fnShowBarChart(obj, chart_info)
{
  var color = Chart.helpers.color;
  var barChartData ={
    labels: [chart_info.data[0].label],
    datasets: [{
      label: "User",
      backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),//alpha is visibility
      borderColor: window.chartColors.red,
      borderWidth: 1,
      data: [
        chart_info.data[0].value
      ]
    }]
  };

  var ctx = document.getElementById('bar').getContext('2d');
  window.myBar = new Chart(ctx, {
    type: 'bar',
    data: barChartData,
    options: {
      responsive: false,
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: chart_info.chart.caption
      },
      scales:{
        yAxes: [{
          ticks: {
            beginAtZero: true,
            max: 500
          }
        }]
      }
    }
  });

  for(var i = 1; i < chart_info.data.length; i++){
  	 barChartData.labels.push(chart_info.data[i].label);
	   barChartData.datasets[0].data.push(chart_info.data[i].value);
  }
  window.myBar.update();
}


/**
 * @date 2019.01.11
 * @author 
 * @desc 파이 그래프를 보여준다.
 * @param
 *  - obj_id : 객체 id
 *  - chart_info : 입력값
 *   ex. chart_info = {"chart":{"caption":"Pie Chart"}, "data":[{"label": "Apache", "value": "32647479"}]}
 *
 * @return
 *
 */
function fnShowPieChart(obj, chart_info)
{
  Chart.defaults.doughnutLabels = Chart.helpers.clone(Chart.defaults.doughnut);

var helpers = Chart.helpers;
var defaults = Chart.defaults;

Chart.controllers.doughnutLabels = Chart.controllers.doughnut.extend({
  updateElement: function(arc, index, reset) {
    var _this = this;
    var chart = _this.chart,
        chartArea = chart.chartArea,
        opts = chart.options,
        animationOpts = opts.animation,
        arcOpts = opts.elements.arc,
        centerX = (chartArea.left + chartArea.right) / 2,
        centerY = (chartArea.top + chartArea.bottom) / 2,
        startAngle = opts.rotation, // non reset case handled later
        endAngle = opts.rotation, // non reset case handled later
        dataset = _this.getDataset(),
        circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : _this.calculateCircumference(dataset.data[index]) * (opts.circumference / (1.0 * Math.PI)),
        innerRadius = reset && animationOpts.animateScale ? 0 : _this.innerRadius,
        outerRadius = reset && animationOpts.animateScale ? 0 : _this.outerRadius,

        custom = arc.custom || {},
        valueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;

    helpers.extend(arc, {
      // Utility
      _datasetIndex: _this.index,
      _index: index,

      // Desired view properties
      _model: {
        x: centerX + chart.offsetX,
        y: centerY + chart.offsetY + 30,//차트 위치 +- responsive엔 안통함
        startAngle: startAngle,
        endAngle: endAngle,
        circumference: circumference,
        outerRadius: outerRadius / 2,
        innerRadius: innerRadius / 2,
        label: valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])
      },

      draw: function () {
        var ctx = this._chart.ctx,
            vm = this._view,
            sA = vm.startAngle,
            eA = vm.endAngle,
            opts = this._chart.config.options;
        
          var labelPos = this.tooltipPosition();
          var segmentLabel = vm.circumference / opts.circumference * 50;// 퍼센트 값
          
          ctx.beginPath();
          
          ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
          ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);
          
          ctx.closePath();
          ctx.strokeStyle = "rgba(255,255,255,0.5)";//호 사이 선 색
          ctx.lineWidth = 2;//호 사이에 선 넓이
          
          ctx.fillStyle = vm.backgroundColor;
          
          ctx.fill();
          ctx.lineJoin = 'bevel';
          
          if (vm.borderWidth) {
            ctx.stroke();
          }

          if (vm.circumference > 0.0015) { // Trying to hide label when it doesn't fit in segment
            ctx.beginPath();
            ctx.font = helpers.fontString(opts.defaultFontSize, opts.defaultFontStyle, opts.defaultFontFamily);
            ctx.fillStyle = "#190707";
            ctx.textBaseline = "top";
            ctx.textAlign = "center";
            
            ctx.fillText(chart.data.labels[index]+ " " + segmentLabel.toFixed(2) + "%", labelPos.x, labelPos.y);//label띄우기
          
          var total = dataset.data.reduce((sum, val) => sum*1 + val*1, 0);//Total띄우기
          ctx.fillText('Total = ' + total, vm.x, vm.y-5, 200);
          }
          
      }
    });
    var model = arc._model;
    model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueAtIndexOrDefault(dataset.backgroundColor, index, arcOpts.backgroundColor);
    model.hoverBackgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : valueAtIndexOrDefault(dataset.hoverBackgroundColor, index, arcOpts.hoverBackgroundColor);
    model.borderWidth = custom.borderWidth ? custom.borderWidth : valueAtIndexOrDefault(dataset.borderWidth, index, arcOpts.borderWidth);
    model.borderColor = custom.borderColor ? custom.borderColor : valueAtIndexOrDefault(dataset.borderColor, index, arcOpts.borderColor);

    // Set correct angles if not resetting
    if (!reset || !animationOpts.animateRotate) {
      if (index === 0) {
        model.startAngle = opts.rotation;
      } else {
        model.startAngle = _this.getMeta().data[index - 1]._model.endAngle;
      }

      model.endAngle = model.startAngle + model.circumference;
    }

    arc.pivot();
  }
});

var config = {
  type: 'doughnutLabels',
  data: {
    datasets: [{
      data: [
        chart_info.data[0].value
      ],
      backgroundColor: [
        window.chartColors.red
      ],
      label: 'Dataset 1'
    }],
    labels: [
      chart_info.data[0].label
    ]
  },
  options: {
      circumference: Math.PI,
      rotation: 2.0 * Math.PI,
      responsive: false,
      legend: { position: 'top',},
      title: { display: true, text: chart_info.chart.caption },
      animation: { animateScale: true, animateRotate: true }
    }
};

var ctx = document.getElementById("pie").getContext("2d");
window.myPie = new Chart(ctx, config);

var colorName, dsColor;
var colorNames = Object.keys(window.chartColors);
for(var i = 1; i < chart_info.data.length; i++){
  config.data.datasets[0].data.push(chart_info.data[i].value);
  config.data.labels.push(chart_info.data[i].label);

  colorName = colorNames[config.data.datasets[0].data.length % colorNames.length];
  dsColor = window.chartColors[colorName];
  config.data.datasets[0].backgroundColor.push(dsColor);
}
window.myPie.update();
}
/**
 * @date 2019.01.11
 * @author 
 * @desc 꺽은선 그래프를 보여준다.
 * @param
 *  - obj_id : 객체 id
 *  - chart_info : 입력값
     time 포멧 : YYYYMMDDHH24Miss / ex. 2018년 10월 20일 10시 10분 20초 = 20181020101020
 *   ex. chart_info = {"chart":{"caption":"Line Chart"}, "data":[{"label": "Apache", "value": "32647479", "time":"20180120132010"}]}
 *
 * @return
 *
 */
function fnShowLineChart(obj, chart_info)
{
  var randomScalingFactor = function(){ return Math.round(Math.random() * 100)};
    var camAmount = 1;
    var config = {
      type: 'line',
      data: {
        labels: ['0H','1H','2H','3H','4H','5H','6H','7H','8H','9H','10H','11H',
                 '12H','13H','14H','15H','16H','17H','18H','19H','20H','21H','22H','23H'],
        datasets: [{
          label: "User",
          backgroundColor: "rgba(0,0,0,0)",
          borderColor: window.chartColors.red,
          data: ['0','0','0','0','0',
                  '0','0','0','0','0',
                  '0','0','0','0','0',
                  '0','0','0','0','0',
                  '0','0','0','0']
          }]
      },
      options: {
        responsive: false,
        title: {
          display: true,
          text: 'People Density each Time'
        },
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              max: 100
            }
          }]
        }
      }
    };

    var ctx = document.getElementById('line').getContext('2d');
    window.myLine = new Chart(ctx, config);
    
    var colorNames = Object.keys(window.chartColors);
    for(var i = 0; i < camAmount; i++) {
      var colorName = colorNames[config.data.datasets.length % colorNames.length];
      var newColor = window.chartColors[colorName];
      var newDataset = {
        label: 'Cam ' + config.data.datasets.length,
        backgroundColor: newColor,
        borderColor: newColor,
        data: [],
        fill: false
      };

      var hour, minute;
      for (var i = 0; i < chart_info.data.length; i++) {
        hour = (chart_info.data[i].time[8] + chart_info.data[i].time[9])*1;
        minute = (chart_info.data[i].time[10] + chart_info.data[i].time[11])*1;
        if(minute < 30){
          config.data.datasets[0].data[hour] = (config.data.datasets[0].data[hour]*1 + chart_info.data[i].value*1)+"";
        }
        else{
          if(hour==23) hour = -1;
          config.data.datasets[0].data[hour+1] = (config.data.datasets[0].data[hour+1]*1 + chart_info.data[i].value*1)+"";
        }
      }
    }
    window.myLine.update(); 
}


/**
 * @date 2019.01.11
 * @author 
 * @desc 히트맵 그래프를 보여준다.
 * @param
 *  - obj_id : 객체 id
 *  - chart_info : 입력값
     time 포멧 : YYYYMMDDHH24Miss / ex. 2018년 10월 20일 10시 10분 20초 = 20181020101020
 *   ex. chart_info = {"chart":{"caption":"HeapMap Chart"}, "data":[{"label":"man", "x": "10", "y": "20", "width" : "30", "height" : "40", "time":"20180120132010"}]}
 *
 * @return
 *
 */
function fnShowHeatMapChart(obj, chart_info)
{
	//$("#content").load("ChartLib/resource/heatMapRSC.html");

  var result = document.getElementById("myResult");
  var slider = document.getElementById("myRange");
  
  function structPoint(){//점을 표시하기 위한 구조체(?)
    var x = 0;
    var y = 0;
  }

  var xSize = 384;//배경 이미지 x 크기
  var ySize = 256;//배경 이미지 y크기
  var timeAmount = 6;

  var map = new Array(timeAmount);
  for(var time = 0; time < timeAmount; time++){
    map[time] = new Array(ySize);//배경 이미지 크기의 2차원 배열 생성(0초기화)
    for(var i = 0; i < ySize; i++){
      map[time][i] = new Array(xSize).fill(0);
    }
  }

  var time;
  for(var i = 0; i < chart_info.data.length; i++){//점 좌표를 이용해서 점 주변(2차원배열)에 가중치 부여
    time = Math.floor((chart_info.data[i].time[8] + chart_info.data[i].time[9]) / 4);
    
    for(var x = -10; x < 11; x++){
        for(var y = -10; y < 11; y++){
          console.log(time);
            if(x*x + y*y < 102){
              if(x == 0 && y == 0){
                map[time][chart_info.data[i].y*1 + y][chart_info.data[i].x*1 + x] += 1000001;//점 자신일 경우 따로 파란색으로하기 위한 분리
              }
              else if(chart_info.data[i].y*1 + y < ySize && chart_info.data[i].y*1 + y > -1 && chart_info.data[i].x*1 + x < xSize && chart_info.data[i].x*1 + x > -1){//배경이미지 바깥부분 참조 방지를 위한 조건문
                  map[time][chart_info.data[i].y*1 + y][chart_info.data[i].x*1 + x] += 50/(Math.sqrt(x*x + y*y) + 1);
              }
            }
      }
    }
  }

  slider.oninput = function() {
    result.value = slider.value * 4 + 2 + ":00 h";

    var canvas = document.getElementById("heatMap");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);//캔버스 정리
    for(var y = 0; y < ySize; y++){//2차원 배열 일일히 스캔하면서 가중치값으로 점찍기
      for(var x = 0; x < xSize; x++){
        if(map[slider.value][y][x] > 1000000){
          ctx.fillStyle = "rgba(0,0,250,0.5)";
          ctx.fillRect (x,y,1,1);
        }
        else if(map[slider.value][y][x] > 40){
          ctx.fillStyle = "rgba(200,0,0," + (map[slider.value][y][x] - 30)/40 + ")";
          ctx.fillRect (x,y,1,1);
        }
        else if(map[slider.value][y][x] > 30){
          ctx.fillStyle = "rgba(250,230,0," + (map[slider.value][y][x] - 20)/25 + ")";
          ctx.fillRect (x,y,1,1);
        }
        else if(map[slider.value][y][x] > 8){
          ctx.fillStyle = "rgba(50,200,50," + (map[slider.value][y][x] - 7)/50 + ")";
          ctx.fillRect (x,y,1,1);
        }
      }
    }
  }
slider.oninput(0);
}