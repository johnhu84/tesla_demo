
function addLine(f_label,inPoint,outPoint,points,samples,pageFeatureIndex) {

  if (inPoint != undefined){

    //内点
    var split = inPoint.split(",")
    var x = parseFloat(split[0])
    var y = parseFloat(split[1])


    var split1 = outPoint.split(",")
    var x1 = parseFloat(split1[0])
    var y1 = parseFloat(split1[1])

    //默认第0个

    var mHeight = $("#pageScreen").height()/5.5;
    var marginWidth = parseInt( $('#container').css('marginLeft') );

    var width1= marginWidth * 0.6;//图表占marginLeft0.8
    var height1 = mHeight*3;

    rewriteConvertValueToString(samples, points, arguments,pageFeatureIndex,width1,mHeight);//生成xyz 一张图表作为一个 cell

    // Enables rubberband selection
    new mxRubberband(graph);

    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    var parent = graph.getDefaultParent();


    if (pageFeatureIndex  == 1){
      width1= marginWidth * 0.6;//图表占marginLeft0.8
      height1 = mHeight*3;
    }else if (pageFeatureIndex  == 2){

      width1= width1;
      height1 = mHeight*3;
    }else if (pageFeatureIndex  == 3){
      width1= width1*3;
      height1 = mHeight;
    }else if (pageFeatureIndex  == 4){

      width1= width1*3;
      height1 = mHeight;
    }

    if (x != "" && y !=""){
      try {

        // Adds cells to the model in a single step
        graph.getModel().beginUpdate();
        var autoWith= document.getElementById("graphContainer").offsetTop;
        y=y-autoWith

        var v1 = graph.insertVertex(parent, f_label, 'Hello', x1, y1, width1, height1,'overflow=fill;fillColor=none;fontColor=#000000;');
        var v2 = graph.insertVertex(parent, f_label+"point2", '', x, y, 0, 0,'overflow=fill;fillColor=none;fontColor=#000000;');
        var e1 = graph.insertEdge(parent, f_label+"point3", '', v1, v2);
      } finally {
        graph.getModel().endUpdate();
      }
    }
  }
}

function chartConfig(samples,data,pointBackgroundColor1,tol1,tol2) {

  var config = {
    type: 'line',
    data: {
      labels: samples,
      datasets: [ {
        // label: "偏差",
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgb(54, 162, 235)',

        //线
        borderWidth: 0.5,
        //点大小
        pointRadius: 5,
        pointHoverRadius: 2,

        data: data,
        pointBackgroundColor:pointBackgroundColor1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      //不显示标题 begin
      legend: {
        display: false
      },
      tooltips: {
        mode: 'index',
        intersect: true
      },
      annotation: {
        annotations: [{
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: tol1,
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
          borderDash: [5, 5],
          label: {
            enabled: true,
            xPadding: 0,
            yPadding: 0,
            backgroundColor: "white",
            fontColor: "blue",
            content: 'AFT'
          }
        },{
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: tol2,
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
          borderDash: [5, 5],
          label: {
            enabled: true,
            xPadding: 0,
            yPadding: 0,
            backgroundColor: "white",
            fontColor: "blue",
            content: 'FORE'
          }
        }]
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          ticks: {
            autoSkip: false,
            maxRotation: 45,//@TODO 设置了图表会缩在一起
            minRotation: 45,
            fontSize: 7
          },
          scaleLabel: {
            // display: true,
            // labelString: 'samples'
          }
        }],
        yAxes: [{
          display: true,
          ticks: {
            min: -2,
            max: 2,
            stepSize: 1,
            fontSize: 7
          }
          // scaleLabel: {
          //   display: true,
          //   labelString: '偏差'
          // }
        }]
      }
    }
  };

  return config;
}

function rewriteConvertValueToString(samples, points, arguments,pageFeatureIndex,width1,mHeight) {
// Returns canvas with dynamic chart for vertex labels
  var graphConvertValueToString = graph.convertValueToString;
  graph.convertValueToString = function (cell) {
    if (this.model.isVertex(cell)) {

      if (cell.value != 'Hello'){
        return '';
      }

      var featureDiv = document.createElement("div");

      if (pageFeatureIndex == 3 || pageFeatureIndex == 4){
        //横着排放
        featureDiv.style.width = width1*3+"px";
        featureDiv.style.height = mHeight+"px";
        featureDiv.style.margin = " 0 auto ";
      }else{
        featureDiv.style.height = (mHeight*3)+"px";
      }

      for (var p = 0; p < points.length; p++) {

        var newDiv = document.createElement("div");

        if (pageFeatureIndex == 3 || pageFeatureIndex == 4){
          //横着排放
          newDiv.style.width = width1-3+"px";
          newDiv.style.height = mHeight+"px";
          newDiv.style.cssFloat = "right";
          newDiv.style.borderRight = "1px solid black";

        }else{
          newDiv.style.width = width1+"px";
          newDiv.style.height = mHeight+"px";
          newDiv.style.borderBottom = "1px solid black";

        }

        //title
        var title = document.createElement("div");
        title.style.height = (mHeight*0.1)+'px';
        title.style.lineHeight = (mHeight*0.1)+'px';

        var fx = points[p].fx;

        if (fx == "2"){
          fx = "X";
        }else if (fx == "3"){
          fx = "Y";
        }else if (fx == "4"){
          fx = "Z";
        }


        //测点
        var tspan1= document.createElement("span");
        var newText = document.createTextNode(cell.id);
        tspan1.appendChild(newText);
        tspan1.style.color = "blue";
        tspan1.style.cssFloat = "left";
        tspan1.style.width = "50%";
        tspan1.style.padding = (mHeight*0.1)/2+"px 0";
        tspan1.style.verticalAlign = "middle";
        tspan1.style.textAlign = "left";


        var fvc_value = (points[p].fvc_value);
        fvc_value =  fvc_value == null ? 'NaN' : fvc_value.toFixed(2);

        //理论值
        var tspan2= document.createElement("span");
        tspan2.innerHTML="Nominal<br/>"+fx+":"+fvc_value
        tspan2.style.cssFloat = "left";
        tspan2.style.width = "25%";
        tspan2.style.textAlign = "left";
        tspan2.style.borderLeft = "1px solid black";

        //最后一个偏差

        var pcs = points[p].pcs;

        var pc1 = 'NaN';

        if (pcs != null && pcs.length > 0 ){
          pc1 = pcs[0];

          if (pc1 == null){
            pc1 = 'NaN';
          }else{
            pc1 = pc1.toFixed(2);
          }
        }

        var tspan3= document.createElement("span");
        var newText = document.createTextNode(pc1);
        tspan3.appendChild(newText);
        tspan3.style.backgroundColor = "green";
        tspan3.style.color = "black";
        tspan3.style.cssFloat = "right";
        tspan3.style.width = "20%";
        tspan3.style.padding = (mHeight*0.1)/2+"px 0";
        tspan3.style.verticalAlign = "middle";
        tspan3.style.textAlign = "right";
        tspan3.style.borderLeft = "1px solid black";
        tspan3.style.marginRight = "5px";

        title.append(tspan1);
        title.append(tspan2);
        title.append(tspan3);
        newDiv.appendChild(title);

        //table
        var table = document.createElement("table");
        table.style.height = (mHeight*0.3)+"px";
        table.style.marginBottom = 0+"px";
        table.className = 'chartTabel';


        // var arrColor = ["#f00","#ff0","lightgreen" ];



        var tol1 = points[p].tol1;
        var tol2 = points[p].tol2;

        var newPcs = [];
        for (var i = 0; i <pcs.length; i++) {

          var val = pcs[i];
          if (val == null){
            val = 0;
          }else{
            val =  parseFloat(val.toFixed(2));
          }
          newPcs.push(val);
        }

        var sfArr = [];
        var arr = [['Mean','Range','CP','CPK','Sigma','TOL-','TOL+','Sample']];

        var range = (max(newPcs)-min(newPcs)).toFixed(2);

        var sum = function(x,y){ return x+y;};//求和函数
        var square = function(x){ return x*x;};//数组中每个元素求它的平方
        var mean = newPcs.reduce(sum)/newPcs.length;
        var deviations = newPcs.map(function(x){return x-mean;});
        var stddev = Math.sqrt(deviations.map(square).reduce(sum)/(newPcs.length-1));

        stddev =  (Math.round(stddev * 100) / 100)

        // https://www.codetd.com/article/1895661

        var cp = (tol1-tol2)/6*stddev;
        //console.log("cp  "+cp);

        var cpk = 0.0;

        var threeSigma = 3 * stddev;

        var num1 = (tol1-mean)/threeSigma;
        var num2 = (mean-tol2)/threeSigma;

        if (num1 > num2){
          cpk = num2;
        } else{
          cpk = num1;
        }

        sfArr[0] = mean.toFixed(2);
        sfArr[1] = range;
        sfArr[2] = cp.toFixed(2);
        sfArr[3] = cpk.toFixed(2);
        sfArr[4] = stddev.toFixed(2);
        sfArr[5] = tol2 == null ? 'NAN':tol2;
        sfArr[6] = tol1 == null ? 'NAN':tol1;
        sfArr[7] = 10;

        //console.log(sfArr);
        arr.push(sfArr);

        for (var i = 0; i < arr.length; i++) {
          var tr = document.createElement("tr");
          tr.style.height = (mHeight*0.3)/3 +"px";

          var itemArr =  arr[i];
          for (var j = 0; j < itemArr.length; j++) {
            td = document.createElement("td");

            if (i ==1 && (j == 2 ||j == 3)){

              var number = parseFloat(itemArr[j]);

              var color = '';
              if (number < 1){
                color = "#f00";

              }else if (number > 1 && number < 1.33){
                color = "#ff0";
              }else if (number > 1.33){
                color = "lightgreen";
              }

              // var index = Math.floor((Math.random()*arrColor.length));
              td.style.backgroundColor = ''+color+'';
            }

            td.innerHTML = itemArr[j];
            tr.appendChild(td);
          }
          table.appendChild(tr);
        }
        newDiv.appendChild(table);

        //包在chart外面的div
        var chartParentDiv = document.createElement("div");

        //node
        var node = document.createElement('canvas');
        node.style.display = "block"

        chartParentDiv.appendChild(node)

        newDiv.appendChild(chartParentDiv)

        // Document for empty output if not in DOM
        document.body.appendChild(newDiv);

        var ctx = node.getContext("2d");

        var pointBackgroundColor1 = [];

        // "#f00","#ff0","lightgreen"

        for (i = 0; i < newPcs.length; i++) {

          if (newPcs[i] <= tol1 && tol2 <= newPcs[i]) {
            pointBackgroundColor1.push("lightgreen");
          } else {
            pointBackgroundColor1.push("#f00");
          }
        }

        var chart = new Chart(ctx, chartConfig(newPcs, newPcs,pointBackgroundColor1,tol1,tol2));

        chart.canvas.parentNode.style.height = (mHeight*0.6)+'px';
        chart.canvas.parentNode.style.width = width1+'px';

        featureDiv.appendChild(newDiv);
      }

      return featureDiv;
    }

    return graphConvertValueToString.apply(this, arguments);
  };

  // function avg(array) {//封装求平均值函数
  //   var len = array.length;
  //   var sum = 0;
  //   for(var i = 0;i<len;i++){
  //     sum +=parseFloat(array[i]);
  //   }
  //   return (sum/len).toFixed(2);
  // }
  //
  function max(array) {//封装求平均值函数
    var max = Math.max.apply(null, array);
    console.log(max) // 55,6
    return max;
  }

  function min(array) {//封装求平均值函数
    var min = Math.min.apply(null, array);
    console.log(min) // 55,6
    return min;
  }





}
