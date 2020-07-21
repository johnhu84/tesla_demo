function labelPositionOptimizerUsingArea2(labelW, labelH, count, x1, y1) {
    getLabelPositions2HelperObj = {};
    var minW = 30;
    var minH = 30;
    var labelR = labelW/labelH;
    var widthGreaterThanHeight = labelW > labelH;
    var labelH3, labelW3, labelH2 = labelH, labelW2 = labelW;
    while (labelW2 > minW && labelH2 > minH) {
        if (widthGreaterThanHeight) {
            labelH3 = labelH2 - 1;
            labelW3 = Math.floor(labelH3 * labelR);
        } else {
            labelW3 = labelW2 - 1;
            labelH3 = Math.floor(labelW3 / labelR);
        }
        labelW2 = labelW3;
        labelH2 = labelH3;
        //call helper function here to see this labelW2 and this labelH2 can fit count number of labels
        if (labelPositionOptimizerUsingAreaHelper(labelW2, labelH2, count, x1, y1)) {
            return {width: labelW2, height: labelH2, originalWidth: labelW, originalHeight: labelH};
        } else if (labelPositionOptimizerUsingAreaHelper2(labelW2, labelH2, count, x1, y1)) {
            return {width: labelW2, height: labelH2, originalWidth: labelW, originalHeight: labelH};
        }
    }
    return {width: minW, height: minH, originalWidth: labelW, originalHeight: labelH};
}

function labelPositionOptimizerUsingAreaHelper2(labelW, labelH, count, x1, y1) {
    var pageScreenWidth = document.getElementById('pageScreen').offsetWidth;
    var pageScreenHeight = document.getElementById('pageScreen').offsetHeight;
    var containerWidth = document.getElementById('container').offsetWidth;
    var containerHeight = document.getElementById('container').offsetHeight;
    var containerLeft = document.getElementById('container').offsetLeft;
    var leftSideWidth = containerLeft - globalObj.spacing.pageSpacingLeftRight;
    var rightSideWidth = pageScreenWidth - containerLeft - containerWidth - globalObj.spacing.pageSpacingLeftRight;
    var containerTop = document.getElementById('container').offsetTop;
    var downSideHeight = pageScreenHeight - containerTop - containerHeight - globalObj.spacing.pageSpacingUpDown;
    var upSideHeight = containerTop - globalObj.spacing.pageSpacingUpDown;
    var useTheseSides = {
        up: upSideHeight >= labelH?true:false,
        left: leftSideWidth >= labelW?true:false,
        right: rightSideWidth >= labelW?true:false,
        down: downSideHeight >= labelH?true:false
    };
    var startPositions = {
        up: {
            startX: useTheseSides.up?(useTheseSides.left?containerLeft:globalObj.spacing.pageSpacingLeftRight):0,
            startY: useTheseSides.up?globalObj.spacing.pageSpacingUpDown:0,
            endX: useTheseSides.up?(useTheseSides.right?containerLeft + containerWidth:pageScreenWidth):0,
            endY: useTheseSides.up?containerTop:0,
            currentX: 0
        },
        left: {
            startX: useTheseSides.left?globalObj.spacing.pageSpacingLeftRight:0,
            startY: useTheseSides.left?globalObj.spacing.pageSpacingUpDown:0,
            endX: useTheseSides.left?containerLeft:0,
            endY: useTheseSides.left?pageScreenHeight:0,
            currentY: 0
        },
        right: {
            startX: useTheseSides.right?containerLeft+containerWidth:0,
            startY: useTheseSides.right?globalObj.spacing.pageSpacingUpDown:0,
            endX: useTheseSides.right?pageScreenWidth:0,
            endY: useTheseSides.right?pageScreenHeight:0,
            currentY: 0
        },
        down: {
            startX: useTheseSides.down?(useTheseSides.left?containerLeft:globalObj.spacing.pageSpacingLeftRight):0,
            startY: useTheseSides.down?containerTop+containerHeight:0,
            endX: useTheseSides.down?(useTheseSides.right?containerLeft+containerWidth:pageScreenWidth):0,
            endY: useTheseSides.down?pageScreenHeight-globalObj.spacing.pageSpacingUpDown:0,
            currentX: 0
        }
    };
    var roundRobinULRD = 1;
    var countHelper = 0;
    startPositions.up.currentX = startPositions.up.startX;
    startPositions.left.currentY = startPositions.left.startY;
    startPositions.right.currentY = startPositions.right.startY;
    startPositions.down.currentX = startPositions.down.startX;
    var x1Up = [];
    var y1Up = [];
    var x1Left = [];
    var y1Left = [];
    var x1Right = [];
    var y1Right = [];
    var x1Down = [];
    var y1Down = [];
    var overRidden = {up: 0, left: 0, right: 0, down: 0};
    while (countHelper < count - 1) {
        var lastCountHelper = countHelper;
        var overRideLastCountHelper = false;
        switch(roundRobinULRD) {
            case 1: //up
                if (useTheseSides.up && (startPositions.up.currentX + ((3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4)))
                    <= startPositions.up.endX) {
                    x1Up.push(startPositions.up.currentX);
                    y1Up.push(startPositions.up.startY);
                    startPositions.up.currentX += (3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4);
                    countHelper++;
                } else {
                    overRidden.up++;
                    overRideLastCountHelper = true;
                }
                break;
            case 2: //left
                if (useTheseSides.left && (startPositions.left.currentY + ((3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4)))
                    <= startPositions.left.endY) {
                    x1Left.push(startPositions.left.startX);
                    y1Left.push(startPositions.left.currentY);
                    startPositions.left.currentY += (3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4);
                    countHelper++;
                } else {
                    overRidden.left++;
                    overRideLastCountHelper = true;
                }
                break;
            case 3: //right
                if (useTheseSides.right && (startPositions.right.currentY + ((3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4)))
                    <= startPositions.right.endY) {
                    x1Right.push(startPositions.right.startX);
                    y1Right.push(startPositions.right.currentY);
                    startPositions.right.currentY += (3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4);
                    countHelper++;
                } else {
                    overRidden.right++;
                    overRideLastCountHelper = true;
                }
                break;
            case 4: //down
                if (useTheseSides.down && (startPositions.down.currentX + ((3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4)))
                    <= startPositions.down.endX) {
                    x1Down.push(startPositions.down.currentX);
                    y1Down.push(startPositions.down.startY);
                    startPositions.down.currentX += (3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4);
                    countHelper++;
                } else {
                    overRidden.down++;
                    overRideLastCountHelper = true;
                }
                break;
            default:
                break;
        }
        if (lastCountHelper == countHelper &&
            (overRidden.up > 10 || overRidden.left > 10 ||
                overRidden.right > 10 || overRidden.down > 10)) {
            //looped around too many times
            return false;
        }
        if (++roundRobinULRD > 4) {
            roundRobinULRD = 1;
        }
    }

    if (x1Up.length > 0) {
        var upUsedWidth = (x1Up[x1Up.length - 1] + (labelW * 3)) - x1Up[0];
        var upMarginX = (pageScreenWidth - upUsedWidth) / 2;
        var upMarginY = (containerTop - labelH) / 2;
        upMarginX = isNaN(upMarginX)?0:upMarginX;
        upMarginY = isNaN(upMarginY)?0:upMarginY;
        for (var i = 0; i < x1Up.length; i++) {
            x1Up[i] = Math.floor(x1Up[i] + upMarginX);
            y1Up[i] = Math.floor(y1Up[i] + upMarginY);
            getLabelPositions2HelperObj[x1Up[i] + ',' + y1Up[i]] = 'up';
        }
    }

    if (x1Left.length > 0) {
        var leftWidth = containerLeft - globalObj.spacing.pageSpacingLeftRight;
        var leftHeight = startPositions.left.endY - startPositions.left.startY;
        /*if (!useTheseSides.up) {
            leftHeight += containerTop;
        }
        if (!useTheseSides.down) {
            leftHeight += (pageScreenHeight - containerHeight - containerTop);
        }*/
        var leftUsedHeight = (y1Left[y1Left.length - 1] + (labelH * 3)) - y1Left[0];
        var leftMarginX = (leftWidth - labelW) / 2;
        var leftMarginY = (leftHeight - leftUsedHeight) / 2;
        leftMarginX = isNaN(leftMarginX)?0:leftMarginX;
        leftMarginY = isNaN(leftMarginY)?0:leftMarginY;
        for (var i = 0; i < x1Left.length; i++) {
            y1Left[i] = Math.floor(y1Left[i] + leftMarginY);
            getLabelPositions2HelperObj[x1Left[i] + ',' + y1Left[i]] = 'left';
        }
    }

    if (x1Right.length > 0) {
        var rightUsedHeight = (y1Right[y1Right.length - 1] + (labelH * 3)) - y1Right[0];
        var rightHeight = startPositions.right.endY - startPositions.right.startY;
        /*if (!useTheseSides.up) {
            rightHeight += containerTop;
        }
        if (!useTheseSides.down) {
            rightHeight += (pageScreenHeight - containerHeight - containerTop);
        }*/
        var rightMarginX = pageScreenWidth - (containerLeft + containerWidth) -
            (labelW + globalObj.spacing.pageSpacingLeftRight);
        var rightMarginY = (rightHeight - rightUsedHeight) / 2;
        rightMarginX = isNaN(rightMarginX)?0:rightMarginX;
        rightMarginY = isNaN(rightMarginY)?0:rightMarginY;
        for (var i = 0; i < x1Right.length; i++) {
            x1Right[i] = Math.floor(x1Right[i] + rightMarginX);
            y1Right[i] = Math.floor(y1Right[i] + rightMarginY);
            getLabelPositions2HelperObj[x1Right[i] + ',' + y1Right[i]] = 'right';
        }
    }

    if (x1Down.length > 0) {
        var bottomWidth = pageScreenWidth;
        var bottomHeight = pageScreenHeight - containerHeight - containerTop;
        var downUsedWidth = (x1Down[x1Down.length - 1] + (labelW * 3)) - x1Down[0];
        var downMarginX = (bottomWidth - downUsedWidth) / 2;
        var downMarginY = (bottomHeight - labelH) / 2;
        downMarginY = downMarginY < 0?0:downMarginY;
        downMarginX = isNaN(downMarginX)?0:downMarginX;
        downMarginY = isNaN(downMarginY)?0:downMarginY;
        for (var i = 0; i < x1Down.length; i++) {
            x1Down[i] = Math.floor(x1Down[i] + downMarginX);
            y1Down[i] = Math.floor(y1Down[i] + downMarginY);
            getLabelPositions2HelperObj[x1Down[i] + ',' + y1Down[i]] = 'down';
        }
    }

    rotateHelper = 0;
    while (x1Up.length > 0 || x1Left.length > 0 || x1Right.length > 0 || x1Down.length > 0) {
        switch (rotateHelper++) {
            case 0:
                if (x1Up.length > 0) {
                    x1.push(x1Up.shift());
                    y1.push(y1Up.shift());
                }
                break;
            case 1:
                if (x1Left.length > 0) {
                    x1.push(x1Left.shift());
                    y1.push(y1Left.shift());
                }
                break;
            case 2:
                if (x1Right.length > 0) {
                    x1.push(x1Right.shift());
                    y1.push(y1Right.shift());
                }
                break;
            case 3:
                if (x1Down.length > 0) {
                    x1.push(x1Down.shift());
                    y1.push(y1Down.shift());
                }
                rotateHelper = 0;
                break;
            default:
                break;
        }
    }
    return true;
}

function ParetoDiagram2(id,ParetoDiagramSet,totalNum,row,col){
    Highcharts.SVGRenderer.prototype.symbols.cross = function (x, y, w, h) {//ä¸‰è§’å½¢
        return ['M', x, y, 'L', x + w, y + h, 'M', x + w, y, 'L', x, y + h, 'z'];
    };
    Highcharts.SVGRenderer.prototype.symbols.ling = function(x, y, w, h) {//è�±å½¢
        points =[x-2,y+3, x+w/2-2 ,y+w/2+3,x+w+w/3-2 ,y+w/2+3,x+w+w/3*2-2,y+3,x+(w+w/3*2)/2-2,y-w/2+3,x-2 ,y+3]
        return polygon2path(points);
    };
    if (Highcharts.VMLRenderer) {
        Highcharts.VMLRenderer.prototype.symbols.cross = Highcharts.SVGRenderer.prototype.symbols.cross;
        Highcharts.VMLRenderer.prototype.symbols.ling = Highcharts.SVGRenderer.prototype.symbols.ling;
    }
    Highcharts.chart(id, {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text:null
        },
        subtitle: {
            text: null
        },
        exporting: {
            enabled: false //ç”¨æ�¥è®¾ç½®æ˜¯å�¦æ˜¾ç¤ºâ€˜æ‰“å�°â€™,'å¯¼å‡º'ç­‰åŠŸèƒ½æŒ‰é’®ï¼Œä¸�è®¾ç½®æ—¶é»˜è®¤ä¸ºtrue
        },
        credits: {
            enabled: false
        },
        xAxis: [{
            categories:ParetoDiagramSet.categories,
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}%',
                // style: {
                //     color: Highcharts.getOptions().colors[2]
                // }
            },
            max:100,
            title: {
                text: null,
                // style: {
                //     color: Highcharts.getOptions().colors[2]
                // }
            },
            opposite: true
        }, { // Secondary yAxis
            gridLineWidth: 0,
            title: {
                text: null,
                // style: {
                //     color: Highcharts.getOptions().colors[0]
                // }
            },
            labels: {
                format: '{value}',
                // style: {
                //     color: Highcharts.getOptions().colors[0]
                // }
            }
        }],
        tooltip: {
            shared: true,
            formatter:function(){
                console.log(this)
                var totle=totalNum;
                var s = '<b style="font-size: 12px;font-weight: bold">'+this.x+'</b>';
                $.each(this.points ,function(num){
                    if(num==0){
                        s += '<br /><span style="color:'+this.color+'">â—�</span><span>  ' + this.series.name + ':' + this.y+' </span>';
                        s += '<br /><span style="color:'+this.color+'">â—�</span><span>  ' + "è‡ªèº«å� æ¯”" + ':' + (this.y/totalNum).toFixed(2)* 100+'% </span>';
                    }else{
                        s += '<br /><span style="color:'+this.color+'">â—�</span><span>  ' + this.series.name + ':' + this.y+'% </span>';
                    }

                });

                return s;
            },

        },
        legend: {
            enabled:false
        },
        series: [{
            type: 'column',
            yAxis: 1,
            name:"å®žé™…æ•°å€¼",
            data: ParetoDiagramSet.columnData,
            tooltip: {
                valueSuffix: ' '
            }
        }, {
            name:"æ€»ä½“å� æ¯”",
            type: 'spline',
            data: ParetoDiagramSet.splineDataLabel,
            tooltip: {
                valueSuffix: '%'
            }
        }]
    });
}

//move ids that end with alt to ids that end with altholder
function moveParetoChartsFromAltToAltHolder() {
    $('.spinner, #overlay').show();
    //setTimeout(function() {
    $('#ParetoDiagramHelper > div').each(function () {
        var id = $(this).attr('id');
        $(this).appendTo('#'+id+'holder');
    });
    $('#ParetoDiagramHelper').html('');
    $('#TrendMapDiagramHelper > div').each(function () {
        var id = $(this).attr('id');
        $(this).appendTo('#'+id+'holder');
        //$('#' + id + 'holder').html($(this)[0].outerHTML);
    });
    $('#TrendMapDiagramHelper > div').html('');
    $('#ControlChartDiagramHelper div').each(function () {
        var id = $(this).attr('id');
        $(this).appendTo('#'+id+'holder');
    });
    $('#SigmaMapDiagramHelper > div').each(function () {
        var id = $(this).attr('id');
        $(this).appendTo('#'+id+'holder');
    });
    $('#BoxLineChartDiagramHelper > div').each(function () {
        var id = $(this).attr('id');
        $(this).appendTo('#'+id+'holder');
    });
    $('#StackingMapDiagramHelper > div').each(function () {
        var id = $(this).attr('id');
        $(this).appendTo('#'+id+'holder');
    });
    $('#PieChartDiagramHelper > div').each(function () {
        var id = $(this).attr('id');
        $(this).appendTo('#'+id+'holder');
    });
    $('#HistogramDiagramHelper > div').each(function () {
        var id = $(this).attr('id');
        $(this).appendTo('#'+id+'holder');
    });
    $('#ParetoDiagramHelper, #TrendMapDiagramHelper, #ControlChartDiagramHelper, ' +
        '#SigmaMapDiagramHelper, #BoxLineChartDiagramHelper, #StackingMapDiagramHelper, ' +
        '#PieChartDiagramHelper, #HistogramDiagramHelper').hide();
    $('.spinner, #overlay').hide();
    //}, 4000);
}

//handsonTableOptionsOriginal
function extractDataCellStyleFromOriginalHandsonTable(row, col) {
    try {
        var htmlHelper = $(handsonTableOptionsOriginal.data[row][col]);
        var outerDiv = htmlHelper.find('div');
        if (outerDiv && outerDiv.length > 0) {
            return $(outerDiv).attr('style');
        }
        return '';
    } catch (e) {
        return '';
    }
}

//Create a BoxDiagram chart for handson cell specified at row and col
//with dimensions width and height
function BoxLineChartForHandsonCell(id, row, col, width, height) {
    var BoxDiagramData={
        data:[
            [100, 200, 248, 295, 509],
        ],
        abnormal:{
            abnormalData:[ // x, y positions where 0 is the first category  异常数据
                [0, 644],
                [0, 64]
            ],
            abnormalName:"异常值",
            abnormalColor:"red"
        },
        plotLines:[{
            value: 602,
            color: 'red',
            width: 1,
            dashStyle:"Dot",//虚线
            label: {
                text: '上公差',
                align: 'right',
                style: {
                    color: 'blue'
                }
            }
        },{
            value: 100,
            color: 'red',
            width: 1,
            dashStyle:"Solid",//实线
            label: {
                text: '下公差',
                align: 'right',
                style: {
                    color: 'blue'
                }
            }
        }]
    }
    BoxDiagram(id,BoxDiagramData)
}

//Create SigmapMap using d3/3/SigmaMap.js and put it in handson cell specified by row and col
//with dimensions width and height
function SigmaMapForHandsonCell(id, row, col, width, height) {
    var plotLines=[-4,5]
    var data=[-1.3,1.8]
    SigmaMap('#'+id, data, plotLines, width, height)
    /*var tempHandsonTableOptions = handsonTable.getSettings();
    tempHandsonTableOptions.data[row][col] = document.getElementById(id).outerHTML;
    handsonTable.updateSettings(tempHandsonTableOptions);*/
}

//堆积图
//do StackingMapChart for handson cell specified at row and col
//width dimensions width and height
function StackingMapChartForHandsonCell(id, row, col, width, height) {
    var PileUpChartset = {
        categories: ['苹果', ' 橙', 'x梨', '香蕉', '李子'],
        colors: ["red", "yellow", "blue", "#999"],
        series: [{
            type: 'column',
            name: '小张',
            data: [3, 2, 1, 3, 4],
            // color:["blue"]
        }, {
            type: 'column',
            name: '小潘',
            data: [2, 3, 5, 7, 6],
            // color:["green"]
        }, {
            type: 'column',
            name: '小王',
            data: [4, 3, 3, 9, 0],
            // color:["red"]
        }, {
            type: 'spline',
            name: '平均值',
            data: [3, 2.67, 3, 6.33, 3.33],
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: 'white'
            }
        }]
    }
    PileUpChart(id, PileUpChartset)
}

// 饼图
// Create PieChart for handson cell specified at row and col
// with dimensions width and height
function PieChartForHandsonCell(id, row, col, width, height) {
    var PieChartSet={
        Data:[{
            name: 'Chrome',
            y: 61.41,
            sliced: true,
            selected: true
        }, {
            name: 'Internet Explorer',
            y: 11.84
        }, {
            name: 'Firefox',
            y: 10.85
        }, {
            name: 'Edge',
            y: 4.67
        }, {
            name: 'Safari',
            y: 4.18
        }],
        colors:["red","yellow","green","#000","blue"]
    }
    PieChart(id,PieChartSet)
}

function histogramNoMargin(options) {

    // A formatter for counts.
    var defaults = {
        data: null, //6sigmaçº¿
        id: ".container",
        min: -6,
        max: 6,
        SvgWidth: 500,
        SvgHeight: 400,
        Identification: {},
        tickNum: 12,
        values: [0.1, 0.1, 0.22, 0.3, 3.1, 3.12, 0.34, 0.4, 1, 3, 5] //æŸ±å­�æ•°æ�®
    }
    var settings = $.extend({}, defaults, options);
    d3.select(settings.id).select("svg").remove()
    var margin = {
            top: 1,
            right: 1,
            bottom: 1,
            left: 1
        },
        width = settings.SvgWidth - margin.left - margin.right,
        height = settings.SvgHeight - margin.top - margin.bottom;
    var svg = d3.select(settings.id).append("svg").attr("class","histogramAll")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.linear()
        .domain([settings.min, settings.max])
        .range([0, width]);
    var xAxis = d3.svg.axis()
        .scale(x).ticks(settings.tickNum)
        .orient("bottom");
    // d3.select(".domain").attr("stroke-width", 1)


    // yè½´

    var his = d3.layout.histogram()
        .bins(x.ticks(settings.tickNum))
        (settings.values);
    var y = d3.scale.linear()
        .domain([0, d3.max(his, function(d) {
            return d.y + 5;
        })])
        .range([height, 0]);
    // include the horizontal axis on the basis of the scale
    const yAxis = d3
        .svg.axis()
        .scale(y) //æŒ‡å®šæ¯”ä¾‹å°º
        .orient("left")
        .tickSize(5);
    svg.append('g')
        .call(yAxis).attr("class", "yAxis")
        .attr("transform", "translate(0,0)");
    // d3.select(".domain").attr("stroke-width", 1).attr("d", "M-1,0H0V360H-1")


    // æ ‡è¯†çº¿
    var createVerticalLine = function(yPos, c, lineStyle, lineWidth) {
        let line = svg.append("g")
            .attr("transform", "translate(" + x(yPos) + ", " + margin.top + ")")
            .append("line");
        line.attr("y2", height - margin.top)
            .style("stroke", c)
            .style("stroke-width", function() {
                if (lineWidth) { //ç²—ç»†
                    return lineWidth + "px"
                } else {
                    return "1px"
                }
            });
        if (lineStyle) {
            if (lineStyle == 'real') { //å®žçº¿
                line.style("stroke", "5,5")
            } else { //è™šçº¿
                line.style("stroke-dasharray", "5,5")
            }
        } else {
            line.style("stroke", "5,5")
        }
    };
    // å¾ªçŽ¯ç”»å‡ºæ ‡è¯†çº¿
    if (settings.Identification) {
        for (var i = 0; i < settings.Identification.length; i++) {
            if (settings.Identification[i].color) {
                createVerticalLine(settings.Identification[i].value, settings.Identification[i].color, settings.Identification[
                    i].lineStyle, settings.Identification[i].lineWidth);
            } else {
                createVerticalLine(settings.Identification[i].value, "#666");
            }
        }
    }
    createVerticalLine(0.00, 'black'); //é›¶ç‚¹
    var bar = svg.selectAll(".bar")
        .data(his)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform",
            function(d) {
                return "translate(" + x(d.x) + "," + y(d.y) + ")";
            });

    // æž„é€ æŸ±

    bar.append("rect")
        .attr("x", 0.5)
        .attr("width", width / settings.tickNum - 1)
        .attr("height",
            function(d) {
                return height - y(d.y);
            }).attr("fill","green");
    var formatCount = d3.format(",.0f");
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", (width / settings.tickNum - 1) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) {
            if(d.y!=0){
                return formatCount(d.y);
            }

        }).style("color","#333");


    svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);



    var line_generator = d3.svg.line() //d3ä¸­ç»˜åˆ¶æ›²çº¿çš„å‡½æ•°
        .x(function(d, i) {
            return x(d.x);
        }) //æ›²çº¿ä¸­xçš„å€¼
        .y(function(d) {
            return y(d.y);
        }) //æ›²çº¿ä¸­yçš„å€¼
        .interpolate("cardinal") //æŠŠæ›²çº¿è®¾ç½®å…‰æ»‘

    svg.append("path")
        .attr("d", line_generator(settings.data))

}

function debugPrintHelperObjs() {
    console.log(JSON.stringify(handsonTableHelperObj));
    console.log('Imgs...');
    console.log(JSON.stringify(handsonTableHelperObjImgs));
    console.log('Paretos...');
    console.log(JSON.stringify(handsonTableHelperObjParetos));
    console.log('TrendMaps...');
    console.log(JSON.stringify(handsonTableHelperObjTrendMaps));
    console.log('TrendMapSettings...');
    console.log(JSON.stringify(handsonTableHelperObjTrendMapSettings));
    console.log('Histograms...');
    console.log(JSON.stringify(handsonTableHelperObjHistograms));
    console.log('ControlCharts...');
    console.log(JSON.stringify(handsonTableHelperObjControlCharts));
    console.log('BoxLineCharts...');
    console.log(JSON.stringify(handsonTableHelperObjBoxLineCharts));
    console.log('SigmaMaps...');
    console.log(JSON.stringify(handsonTableHelperObjSigmaMaps));
    console.log('PieCharts...');
    console.log(JSON.stringify(handsonTableHelperObjPieCharts));
    console.log('StackingMapCharts...');
    console.log(JSON.stringify(handsonTableHelperObjStackingMapCharts));
}

var compare = function (obj1, obj2) {//对象排序
    var val1 = obj1.fvlBeginTime;
    var val2 = obj2.fvlBeginTime;
    if (val1 < val2) {
        return -1;
    } else if (val1 > val2) {
        return 1;
    } else {
        return 0;
    }
}
function sortId(a,b){//绝对值排序
    return Math.abs(a.pc) -Math.abs(b.pc)
}
function sortIdNormal(a,b){//排序
    return a.pc -b.pc
}
function  sortdata(a,b) {//绝对值排序
    return Math.abs(a.value) -Math.abs(b.value)
}
// result.sort(sortId);
function UpToleranceLine(UpTolerance,DownTolerance,X){
    return Number(UpTolerance)-(Number(UpTolerance)-Number(DownTolerance))*(1-X)*0.5
}
function DownToleranceLine(UpTolerance,DownTolerance,X){
    return Number(DownTolerance)+(Number(UpTolerance)-Number(DownTolerance))*(1-X)*0.5
}

//temporary fix because trendmap settings is not currently properly being applied
//胡春麟，4/21/2020
function resizeChartsTrendMapAjaxHelper(ids, widthHelper2, heightHelper2,BigobjHelper) {
    handsonTableActiveAjaxCalls++
    //moveParetoChartsFromAltToAltHolder, my4.js
    $.ajax({
        url: "/static/js/projectJs/data2.json",
        type: "get",
        datatype: "JSON",
        success: function(msg) {
            handsonTableActiveAjaxCalls--
            var data = msg.points[0];
            setTrendMapAlt(ids,data,BigobjHelper,widthHelper2,heightHelper2)

            /*if (document.getElementById(ids)) {
                var tempHandsonTableOptions = handsonTable.getSettings();
                tempHandsonTableOptions.data[row][col] = document.getElementById(ids).outerHTML;
                handsonTable.updateSettings(tempHandsonTableOptions);
            }*/
            var wtHolder = $(handsonTable.table).parents('.wtHolder');
            var wtHider = $(handsonTable.table).parents('.wtHider');
            if (wtHolder.length > 0 && wtHider.length > 0) {
                $(wtHolder[0]).width(handsonTable.table.clientWidth);
                $(wtHider[0]).width(handsonTable.table.clientWidth);
                $(wtHolder[0]).height(handsonTable.table.clientHeight);
                $(wtHider[0]).height(handsonTable.table.clientHeight);
            }
            $("#handsonContainer").width(handsonTable.table.clientWidth);
            $("#handsonContainer").height(handsonTable.table.clientHeight);
        },
        error: function() {
            alert("æ��äº¤å¤±è´¥ï¼�");
        }
    });
}

function resizeChartsControlChartAjaxHelper(row, col, ids, widthHelper, heightHelper,
                                            BigobjHelper) {
    handsonTableActiveAjaxCalls++
    //moveParetoChartsFromAltToAltHolder, my4.js
    $.ajax({
        url: "/static/js/projectJs/data2.json",
        type: "get",
        datatype: "JSON",
        success: function(msg) {
            handsonTableActiveAjaxCalls--
            var Result=msg
            setControlChart(ids, row, col, widthHelper, heightHelper, BigobjHelper, Result)
            /*if (document.getElementById(ids)) {
                var tempHandsonTableOptions = handsonTable.getSettings();
                tempHandsonTableOptions.data[row][col] = document.getElementById(ids).outerHTML;
                handsonTable.updateSettings(tempHandsonTableOptions);
            }*/
        },
        error: function(msg) {
            alert("msg");
        }
    });
}

//整理趋势图数据参数
function setTrendMapAlt(id,data,BigobjHelper,widthHelper2,heightHelper2){
    var el = document.getElementById(id);
    var lineChart = new D3LineChart1(el, {});
    var setData = []; //拼成图表所需的数据格式
    var totalNum=0;//数据和  用来求平均数
    var result=data.sample;//数据
    var tolerance = data.featvarLimits;//公差

    var toleranceRule=[];//判断公差条件
    var dataStyleRule=[];//数据样式条件
    var firstDataStyle = BigobjHelper && typeof BigobjHelper !== 'undefined' &&
    typeof BigobjHelper.dataStyles !== 'undefined'
        ?BigobjHelper.dataStyles[0]:{};

    var settings={
        dataLineStyle: [{ //数据线样式
            color: "blue",
            lineStyle: "empty", //real实线
            lineWidth: "2",
            pointStyle:"1",
        }],
        width: widthHelper2,
        height: heightHelper2,
        Identification: [],
        BigToleranceStyle:[],
        dataIdentificationLine:[]//折线数据

    }
    tolerance.sort(compare)//公差排序
    for(var i=0;i<tolerance.length-1;i++){//  循环生成 公差判断条件
        var item={}
        if(i==tolerance.length-1){
            item.Rule="startTime>="+new Date(Date.parse(tolerance[i-1].fvlBeginTime)).getTime()
            item.fvlBeginTime=tolerance[i].fvlBeginTime
            item.fvlHivalue=tolerance[i].fvlHivalue
            item.fvlLovalue=tolerance[i].fvlLovalue
        }else{
            if(new Date(Date.parse(tolerance[i+1].fvlBeginTime)).getTime()){
                item.Rule=new Date(Date.parse(tolerance[i].fvlBeginTime)).getTime()+"<=startTime<"+new Date(Date.parse(tolerance[i+1].fvlBeginTime)).getTime()

            }else{
                item.Rule=new Date(Date.parse(tolerance[i].fvlBeginTime)).getTime()+"<=startTime"
            }
            item.fvlBeginTime=tolerance[i].fvlBeginTime
            item.fvlHivalue=tolerance[i].fvlHivalue
            item.fvlLovalue=tolerance[i].fvlLovalue

        }
        toleranceRule.push(item)
    }


    for (var i = 0; i < result.length; i++) {//数据格式生成
        item = {};
        item.name = result[i].s_label
        item.value = result[i].pc
        item.color=firstDataStyle.dSBgColorInput1||"green"
        // item.symbol=firstDataStyle.DataTypeShowElement//||BigobjHelper.dataStyles.symbol
        item.symbol= typeof firstDataStyle.DataTypeShowElement !== 'undefined'?firstDataStyle.DataTypeShowElement:6;
        setData.push(item)//数据生成

        var startTime= new Date(Date.parse(result[i].s_createdatetime)).getTime();
        if(startTime < Number(toleranceRule[0].Rule.split("<")[0].replace("=",""))){
            setData[i].fvlLovalue = Number(tolerance[tolerance.length-1].fvlLovalue)//数据下公差
            setData[i].fvlHivalue = Number(tolerance[tolerance.length-1].fvlHivalue)//数据上公差
        }else if(startTime >= Number(toleranceRule[toleranceRule.length-1].Rule.split("<")[0].replace("=",""))){
            setData[i].fvlLovalue = Number(toleranceRule[toleranceRule.length-1].fvlLovalue)//数据下公差
            setData[i].fvlHivalue = Number(toleranceRule[toleranceRule.length-1].fvlHivalue)//数据上公差
        }else{
            for (var m = 0; m < toleranceRule.length; m++) {
                var stringResult = toleranceRule[m].Rule.split("<");
                if(stringResult.length!=2){
                    if (Number(stringResult[0].replace("=",""))<=startTime&&startTime<Number(stringResult[2])) {
                        setData[i].fvlLovalue = Number(toleranceRule[m].fvlLovalue)//数据下公差
                        setData[i].fvlHivalue = Number(toleranceRule[m].fvlHivalue)//数据上公差
                    }
                }
            }
        }

    }

    if(BigobjHelper&& typeof BigobjHelper != 'string'){
        //绝对值排序
        if(BigobjHelper&& typeof BigobjHelper != 'string'){
            if(BigobjHelper.miscMove1=="on"){//开启排序
                if(BigobjHelper.miscRadio1){
                    result.sort(sortId).reverse();
                    setData.sort(sortdata).reverse();
                }else if(BigobjHelper.miscRadio2){
                    result.sort(sortId)
                    setData.sort(sortdata)
                }
                for (var i = 0; i < result.length; i++) {
                    result[i].pc=Math.abs(result[i].pc)
                    setData[i].value=Math.abs(setData[i].value)
                }
            }
        }
        //标识线
        if(BigobjHelper.instructionLines.length>0){
            for(var j=0;j<BigobjHelper.instructionLines.length;j++){//标识线数据
                var item ={},itemTwo={};
                if(BigobjHelper.instructionLines[j].IndicatorLineStyleChange==1){
                    item.color=BigobjHelper.instructionLines[j].BackgroundColor
                    item.value=BigobjHelper.instructionLines[j].iLInputFrom
                    item.lineWidth=BigobjHelper.instructionLines[j].WidthNumber
                    item.lineStyle=BigobjHelper.instructionLines[j].publicSelectInput

                    itemTwo.color=BigobjHelper.instructionLines[j].BackgroundColor
                    itemTwo.value=BigobjHelper.instructionLines[j].iLInputTo
                    itemTwo.lineWidth=BigobjHelper.instructionLines[j].WidthNumber
                    itemTwo.lineStyle=BigobjHelper.instructionLines[j].publicSelectInput
                    settings.Identification.push(item)
                    settings.Identification.push(itemTwo)
                }else{
                    //循环生成公差数据
                    var dataIdentificationLine=[],dataIdentificationLineLow=[]//上下公差数据
                    var tolerance1 = data.featvarLimits;//公差
                    for(var z=0;z<tolerance1.length;z++){
                        tolerance1[z].fvlHivalue=UpToleranceLine(tolerance1[z].fvlHivalue,tolerance1[z].fvlLovalue,Number(BigobjHelper.instructionLines[j].RangeNumber))
                        tolerance1[z].fvlLovalue=DownToleranceLine(tolerance1[z].fvlHivalue,tolerance1[z].fvlLovalue,Number(BigobjHelper.instructionLines[j].RangeNumber))
                    }
                    for(var i=0;i<result.length;i++){
                        var startTime= new Date(Date.parse(result[i].s_createdatetime)).getTime();
                        if(startTime < Number(toleranceRule[0].Rule.split("<")[0].replace("=",""))){
                            var timeItem={};
                            var timeItemLow={};
                            timeItem.x= result[i].s_label
                            timeItem.y= tolerance1[tolerance1.length-1].fvlHivalue
                            timeItemLow.x=result[i].s_label
                            timeItemLow.y = Number(tolerance1[tolerance1.length-1].fvlLovalue)
                            dataIdentificationLine.push(timeItem)
                            dataIdentificationLineLow.push(timeItemLow)
                        }else if(startTime >= Number(toleranceRule[toleranceRule.length-1].Rule.split("<")[0].replace("=",""))){
                            var timeItem={};
                            var timeItemLow={};
                            timeItem.x= result[i].s_label
                            timeItem.y= toleranceRule[toleranceRule.length-1].fvlHivalue
                            timeItemLow.x=result[i].s_label
                            timeItemLow.y = Number(toleranceRule[toleranceRule.length-1].fvlLovalue)
                            dataIdentificationLine.push(timeItem)
                            dataIdentificationLineLow.push(timeItemLow)
                        }else{
                            for (var m = 0; m < toleranceRule.length; m++) {
                                var timeItem={};
                                var timeItemLow={};
                                var stringResult = toleranceRule[m].Rule.split("<");
                                if(stringResult.length!=2){
                                    if (Number(stringResult[0].replace("=",""))<=startTime&&startTime<Number(stringResult[2])) {
                                        timeItem.x= result[i].s_label
                                        timeItem.y= toleranceRule[m].fvlHivalue
                                        timeItemLow.x=result[i].s_label
                                        timeItemLow.y = Number(toleranceRule[m].fvlLovalue)
                                        dataIdentificationLine.push(timeItem)
                                        dataIdentificationLineLow.push(timeItemLow)
                                    }
                                }
                            }
                        }
                    }
                    if(true){
                        for(var n=0;n<dataIdentificationLine.length;n++){
                            var toleranceStyle={},toleranceStyleOne={};
                            toleranceStyle.color=BigobjHelper.instructionLines[j].BackgroundColor
                            // item.color=BigobjHelper.instructionLines[j].BackgroundColor
                            toleranceStyle.lineWidth=BigobjHelper.instructionLines[j].WidthNumber
                            toleranceStyle.lineStyle=BigobjHelper.instructionLines[j].publicSelectInput
                            dataIdentificationLine[n].y=Number(dataIdentificationLine[n].y) *Number(BigobjHelper.instructionLines[j].RangeNumber)


                            toleranceStyleOne.color=BigobjHelper.instructionLines[j].BackgroundColor
                            toleranceStyleOne.lineWidth=BigobjHelper.instructionLines[j].WidthNumber
                            toleranceStyleOne.lineStyle=BigobjHelper.instructionLines[j].publicSelectInput
                            dataIdentificationLineLow[n].y=Number(dataIdentificationLineLow[n].y) *Number(BigobjHelper.instructionLines[j].RangeNumber)

                            settings.BigToleranceStyle.push(toleranceStyle)
                            settings.BigToleranceStyle.push(toleranceStyleOne)
                        }
                        settings.dataIdentificationLine.push(dataIdentificationLine)
                        //= settings.dataIdentificationLine.concat(dataIdentificationLine)
                        settings.dataIdentificationLine.push(dataIdentificationLineLow)
                        //= settings.dataIdentificationLine.concat(dataIdentificationLineLow)
                    }
                }
            }
        }
        //数据样式 判断条件
        if(BigobjHelper.dataStyles.length>0){
            for(var j=0;j<BigobjHelper.dataStyles.length;j++){
                var item = {};
                if(BigobjHelper.dataStyles[j].dSStyleSel1!=0 && BigobjHelper.dataStyles[j].dSYValueSel1!=0){//符号和变量 都不==0
                    if(BigobjHelper.dataStyles[j].dSStyleSel1 == 1){//常量
                        if(BigobjHelper.dataStyles[j].dSRangeNumber1){//常量值不为空
                            if(BigobjHelper.dataStyles[j].dSYValueSel1==1){//1符号为>   2符号为<
                                item.rule= ">"+BigobjHelper.dataStyles[j].dSRangeNumber1
                                item.ruleName1= BigobjHelper.dataStyles[j].dSStyleSel1
                                item.ruleColor= BigobjHelper.dataStyles[j].DSBgColor
                                item.ruleTransparency= BigobjHelper.dataStyles[j].dSTransparency1
                                item.DataTypeShow=BigobjHelper.dataStyles[j].DataTypeShow
                            }else{
                                item.rule= "<"+BigobjHelper.dataStyles[j].dSRangeNumber1
                                item.ruleName1= BigobjHelper.dataStyles[j].dSStyleSel1
                                item.ruleColor= BigobjHelper.dataStyles[j].DSBgColor
                                item.ruleTransparency= BigobjHelper.dataStyles[j].dSTransparency1
                                item.DataTypeShow=BigobjHelper.dataStyles[j].DataTypeShow
                            }
                        }
                    }else{// 上下公差 均值
                        if(BigobjHelper.dataStyles[j].dSRangeNumber1){//倍数值不为空
                            if(BigobjHelper.dataStyles[j].dSYValueSel1==1){//1符号为>   2符号为<
                                item.rule= ">"+"=="+BigobjHelper.dataStyles[j].SymbolicOperation1+BigobjHelper.dataStyles[j].dSRangeNumber1
                                item.ruleName1= BigobjHelper.dataStyles[j].dSStyleSel1
                                item.ruleColor= BigobjHelper.dataStyles[j].DSBgColor
                                item.ruleTransparency= BigobjHelper.dataStyles[j].dSTransparency1
                                item.DataTypeShow=BigobjHelper.dataStyles[j].DataTypeShow
                            }else{
                                item.rule= "<"+"=="+BigobjHelper.dataStyles[j].SymbolicOperation1+BigobjHelper.dataStyles[j].dSRangeNumber1
                                item.ruleName1= BigobjHelper.dataStyles[j].dSStyleSel1
                                item.ruleColor= BigobjHelper.dataStyles[j].DSBgColor
                                item.ruleTransparency= BigobjHelper.dataStyles[j].dSTransparency1
                                item.DataTypeShow=BigobjHelper.dataStyles[j].DataTypeShow
                            }
                        }else{
                            if(BigobjHelper.dataStyles[j].dSYValueSel1==1){//1符号为>   2符号为<
                                item.rule= ">"
                                item.ruleName1= BigobjHelper.dataStyles[j].dSStyleSel1
                                item.ruleColor= BigobjHelper.dataStyles[j].DSBgColor
                                item.ruleTransparency= BigobjHelper.dataStyles[j].dSTransparency1
                                item.DataTypeShow=BigobjHelper.dataStyles[j].DataTypeShow
                            }else{
                                item.rule= "<"
                                item.ruleName1= BigobjHelper.dataStyles[j].dSStyleSel1
                                item.ruleColor= BigobjHelper.dataStyles[j].DSBgColor
                                item.ruleTransparency= BigobjHelper.dataStyles[j].dSTransparency1
                                item.DataTypeShow=BigobjHelper.dataStyles[j].DataTypeShow
                            }
                        }
                    }
                }
                if(BigobjHelper.dataStyles[j].dSStyleSel2!=0 && BigobjHelper.dataStyles[j].dSYValueSel2!=0){//符号和变量 都不==0
                    if(BigobjHelper.dataStyles[j].dSStyleSel2 == 1){//常量
                        if(BigobjHelper.dataStyles[j].dSRangeNumber2){//常量值不为空
                            if(BigobjHelper.dataStyles[j].dSYValueSel2==1){//1符号为>   2符号为<
                                item.ruleOne= ">"+BigobjHelper.dataStyles[j].dSRangeNumber2
                                item.ruleName1= BigobjHelper.dataStyles[j].dSStyleSel2
                                item.ruleColor= BigobjHelper.dataStyles[j].DSBgColor
                                item.ruleTransparency= BigobjHelper.dataStyles[j].dSTransparency1
                                item.DataTypeShow=BigobjHelper.dataStyles[j].DataTypeShow
                            }else{
                                item.ruleOne= "<"+BigobjHelper.dataStyles[j].dSRangeNumber2
                                item.ruleName1= BigobjHelper.dataStyles[j].dSStyleSel2
                                item.ruleColor= BigobjHelper.dataStyles[j].DSBgColor
                                item.ruleTransparency= BigobjHelper.dataStyles[j].dSTransparency1
                                item.DataTypeShow=BigobjHelper.dataStyles[j].DataTypeShow
                            }
                        }
                    }else{// 上下公差 均值
                        if(BigobjHelper.dataStyles[j].dSRangeNumber2){//倍数值不为空
                            if(BigobjHelper.dataStyles[j].dSYValueSel2==1){//1符号为>   2符号为<
                                item.ruleOne= ">"+"=="+BigobjHelper.dataStyles[j].SymbolicOperation2+BigobjHelper.dataStyles[j].dSRangeNumber2
                                item.ruleName2= BigobjHelper.dataStyles[j].dSStyleSel2
                                item.ruleColor= BigobjHelper.dataStyles[j].DSBgColor
                                item.ruleTransparency= BigobjHelper.dataStyles[j].dSTransparency1
                                item.DataTypeShow=BigobjHelper.dataStyles[j].DataTypeShow
                            }else{
                                item.ruleOne= "<"+"=="+BigobjHelper.dataStyles[j].SymbolicOperation2+BigobjHelper.dataStyles[j].dSRangeNumber2
                                item.ruleName2= BigobjHelper.dataStyles[j].dSStyleSel2
                                item.ruleColor= BigobjHelper.dataStyles[j].DSBgColor
                                item.ruleTransparency= BigobjHelper.dataStyles[j].dSTransparency1
                                item.DataTypeShow=BigobjHelper.dataStyles[j].DataTypeShow
                            }
                        }else{
                            if(BigobjHelper.dataStyles[j].dSYValueSel2==1){//1符号为>   2符号为<
                                item.ruleOne= ">"
                                item.ruleName2= BigobjHelper.dataStyles[j].dSStyleSel2
                                item.ruleColor= BigobjHelper.dataStyles[j].DSBgColor
                                item.ruleTransparency= BigobjHelper.dataStyles[j].dSTransparency1
                                item.DataTypeShow=BigobjHelper.dataStyles[j].DataTypeShow
                            }else{
                                item.ruleOne= "<"
                                item.ruleName2= BigobjHelper.dataStyles[j].dSStyleSel2
                                item.ruleColor= BigobjHelper.dataStyles[j].DSBgColor
                                item.ruleTransparency= BigobjHelper.dataStyles[j].dSTransparency1
                                item.DataTypeShow=BigobjHelper.dataStyles[j].DataTypeShow

                            }
                        }
                    }
                }
                dataStyleRule.push(item)
            }
        }


    }
    // 数据样式
    for(var i=0;i<setData.length;i++){
        for(var j=0;j<dataStyleRule.length;j++){
            if(dataStyleRule[j].ruleName1==1){
                if(eval(setData[i].value + dataStyleRule[j].rule) || eval(setData[i].value + dataStyleRule[j].ruleOne)){
                    setData[i].color=dataStyleRule[j].ruleColor
                    setData[i].symbol=dataStyleRule[j].DataTypeShow
                }
            }else if(dataStyleRule[j].ruleName1==2 && typeof dataStyleRule[j].ruleOne !== 'undefined'){
                var num1=dataStyleRule[j].rule.split("==")[1].replace("*", '')
                var num2=dataStyleRule[j].ruleOne.split("==")[1].replace("*", '')
                var shang = UpToleranceLine(setData[i].fvlHivalue,setData[i].fvlLovalue,num1)
                var xia = DownToleranceLine(setData[i].fvlHivalue,setData[i].fvlLovalue,num2)
                if(eval(eval(setData[i].value)+dataStyleRule[j].rule.split("==")[0]+shang)||eval(eval(setData[i].value)+dataStyleRule[j].ruleOne.split("==")[0]+ xia )){
                    setData[i].color=dataStyleRule[j].ruleColor
                    setData[i].symbol=dataStyleRule[j].DataTypeShow
                }
            }else if(dataStyleRule[j].ruleName1==3 && typeof dataStyleRule[j].ruleOne !== 'undefined'){
                var num1=dataStyleRule[j].rule.split("==")[1].replace("*", '')
                var num2=dataStyleRule[j].ruleOne.split("==")[1].replace("*", '')
                var shang = UpToleranceLine(setData[i].fvlHivalue,setData[i].fvlLovalue,num2)
                var xia = DownToleranceLine(setData[i].fvlHivalue,setData[i].fvlLovalue,num1)
                if(eval(eval(setData[i].value)+dataStyleRule[j].rule.split("==")[0]+xia)||eval(eval(setData[i].value)+dataStyleRule[j].ruleOne.split("==")[0]+ shang )){
                    setData[i].color=dataStyleRule[j].ruleColor
                    setData[i].symbol=dataStyleRule[j].DataTypeShow
                }
            }
        }
    }
    //特殊点
    if(BigobjHelper&& typeof BigobjHelper != 'string'){
        if(BigobjHelper.miscMove2=="on"){//特殊点 on开 off关
            if(BigobjHelper.miscSel1 && BigobjHelper.miscSel2 && BigobjHelper.miscSel3){
                var NewArray=[]

                if(result.length<Number(BigobjHelper.miscSel2)){
                    for(var i=0;i<result.length;i++){
                        totalNum+=result[i].pc
                    }
                    if(BigobjHelper.miscBgColorCb1){
                        setData.push({
                            name: '平均值',
                            value: (totalNum/result.length).toFixed(2),
                            color:BigobjHelper.miscBgColorInput1,
                            symbol:Number(BigobjHelper.SpecialPoint)
                        })
                    }
                }else{
                    if(BigobjHelper.miscSel1==1){
                        NewArray=result.slice(0,BigobjHelper.miscSel2)
                    }else if(BigobjHelper.miscSel1==2){
                        NewArray=result.slice(BigobjHelper.miscSel2*(-1))
                    }
                    for(var i=0;i<NewArray.length;i++){
                        totalNum+=NewArray[i].pc
                    }
                    if(BigobjHelper.miscBgColorCb1){
                        setData.push({
                            name: '平均值',
                            value: (totalNum/NewArray.length).toFixed(2),
                            color:BigobjHelper.miscBgColorInput1,
                            symbol:Number(BigobjHelper.SpecialPoint)
                        })
                    }
                }
            }
        }
    }

    settings.data=setData
    lineChart.setData(settings);
}

function setHistogram(ids, widthHelper, heightHelper,BigobjHelper){
    handsonTableActiveAjaxCalls++;
//moveParetoChartsFromAltToAltHolder, my4.js
    var result;
    $.ajax({
        url: "/static/js/projectJs/data2.json",
        type: "get",
        datatype: "JSON",
        success: function(msg) {
            result = msg.points[0];
            var options = {
                data: [{
                    x: -1.5,
                    y: 1
                }, {
                    x: -1,
                    y: 1.7
                }, {
                    x: 0,
                    y: 5
                }, {
                    x: 1,
                    y: 1.7
                }, {
                    x: 1.5,
                    y: 1
                }], //6sigma线数据
                id: "#"+ids,
                BarColor:"yellow",//柱子颜色
                publicSelectInput:"real",//主子边框样式
                dSWidth:1,//边框宽度
                BorderColor:"green",//边框颜色
                sigamaColor: "#000000",//6sigma线颜色
                sigamaWidth:1,//6sigma线宽度
                SigmaBorderStyle:"real",//6sigma线  实现
                min: -6, //X轴最小值
                max: 6, //X轴最大值
                SvgWidth: widthHelper, //图表宽度
                SvgHeight: heightHelper, //图表高度
                tickNum: 12, //X轴分12份
                Identification: [],//标识线
                values: [], //柱子数据
                xAxisData:[]
            }
            result.sample.sort(sortIdNormal)
            console.log(result.sample)
            //最大值  最小值计算
            if(result.sample[0].pc<(result.command.standardDeviation-result.command.sigma*3)){
                options.min=result.sample[0].pc-0.5
            }else if(result.sample[0].pc>(result.command.standardDeviation-result.command.sigma*3)){
                options.min=result.command.standardDeviation-result.command.sigma*3-0.5
            }else{
                options.min=result.sample[0].pc-0.5
            }
            if(result.sample[result.sample.length-1].pc<(result.command.standardDeviation+result.command.sigma*3)){
                options.max=result.command.standardDeviation+result.command.sigma*3+0.5
            }else if(result.sample[result.sample.length-1].pc>(result.command.standardDeviation+result.command.sigma*3)){
                options.max=result.sample[result.sample.length-1].pc +0.5
            }else{
                options.max=result.sample[result.sample.length-1].pc +0.5
            }
            // 循环取出数据
            for(var i=0;i<result.sample.length;i++){
                options.values.push(result.sample[i].pc)
            }
            //设置属性
            if(BigobjHelper && typeof BigobjHelper != 'string' && typeof BigobjHelper.instructionLines !== 'undefined'){
                for(var i=0;i<BigobjHelper.instructionLines.length;i++){
                    if(Number(BigobjHelper.instructionLines[i].iLSelParam1)!=0){
                        var name="",item={};
                        if(Number(BigobjHelper.instructionLines[i].iLSelParam1)==1){
                            name="上偏差"
                            if(result.command.UpperDeviation){
                                item={ //标识线数据格式
                                    name:name,
                                    color: BigobjHelper.instructionLines[i].ColorNum !=undefined?BigobjHelper.instructionLines[i].ColorNum:"blue" ,
                                    value: result.command.UpperDeviation,
                                    lineWidth:BigobjHelper.instructionLines[i].iLWidthInput1 !=undefined?BigobjHelper.instructionLines[i].iLWidthInput1:1,
                                    lineStyle: BigobjHelper.instructionLines[i].publicSelectInput !=undefined?BigobjHelper.instructionLines[i].publicSelectInput:"real" //实线
                                }
                                options.Identification.push(item)
                            }
                        }else if(Number(BigobjHelper.instructionLines[i].iLSelParam1)==2){
                            name="下偏差"
                            if(result.command.LowerDeviation){
                                item={ //标识线数据格式
                                    name:name,
                                    color: BigobjHelper.instructionLines[i].ColorNum !=undefined?BigobjHelper.instructionLines[i].ColorNum:"blue" ,
                                    value: result.command.LowerDeviation,
                                    lineWidth:BigobjHelper.instructionLines[i].iLWidthInput1 !=undefined?BigobjHelper.instructionLines[i].iLWidthInput1:1,
                                    lineStyle: BigobjHelper.instructionLines[i].publicSelectInput !=undefined?BigobjHelper.instructionLines[i].publicSelectInput:"real" //实线
                                }
                                options.Identification.push(item)
                            }
                        }else if(Number(BigobjHelper.instructionLines[i].iLSelParam1)==3){
                            name="均值"
                            if(result.command.standardDeviation){
                                item={ //标识线数据格式
                                    name:name,
                                    color: BigobjHelper.instructionLines[i].ColorNum !=undefined?BigobjHelper.instructionLines[i].ColorNum:"blue" ,
                                    value: result.command.standardDeviation,
                                    lineWidth:BigobjHelper.instructionLines[i].iLWidthInput1 !=undefined?BigobjHelper.instructionLines[i].iLWidthInput1:1,
                                    lineStyle: BigobjHelper.instructionLines[i].publicSelectInput !=undefined?BigobjHelper.instructionLines[i].publicSelectInput:"real" //实线
                                }
                                options.Identification.push(item)
                            }
                        }else if(Number(BigobjHelper.instructionLines[i].iLSelParam1)==4){
                            name="零线"
                            if(result.command.ZeroLine==0){
                                item={ //标识线数据格式
                                    name:name,
                                    color: BigobjHelper.instructionLines[i].ColorNum !=undefined?BigobjHelper.instructionLines[i].ColorNum:"blue" ,
                                    value: result.command.ZeroLine,
                                    lineWidth:BigobjHelper.instructionLines[i].iLWidthInput1 !=undefined?BigobjHelper.instructionLines[i].iLWidthInput1:1,
                                    lineStyle: BigobjHelper.instructionLines[i].publicSelectInput !=undefined?BigobjHelper.instructionLines[i].publicSelectInput:"real" //实线
                                }
                                options.Identification.push(item)
                            }
                        }else if(Number(BigobjHelper.instructionLines[i].iLSelParam1==5)){
                            console.log("sigma线")
                        }
                    }

                }
                if(BigobjHelper.dataStyles[0].dSCb1){//柱子颜色设置
                    options.BarColor= BigobjHelper.dataStyles[0].DSBgColor
                }
                if(BigobjHelper.dataStyles[0].dSCb2){//柱子边框设置
                    options.BorderColor= BigobjHelper.dataStyles[0].BorderColor
                    options.dSWidth= BigobjHelper.dataStyles[0].dSWidth
                }
                options.publicSelectInput= BigobjHelper.dataStyles[0].publicSelectInput
                if(BigobjHelper.sigama=="on"){
                    if(BigobjHelper.sigamaChecked){
                        options.sigamaColor= BigobjHelper.sigamaColor
                        options.sigamaWidth= Number(BigobjHelper.sigamaWidth)
                        options.SigmaBorderStyle = BigobjHelper.SigmaBorderStyle
                    }
                }
            }
            histogram(options)
            /*for (var i in handsonTableHelperObjHistograms) {
                if (handsonTableHelperObjHistograms[i] === ids) {
                    var rowAndColArr = i.split(',');
                    if (document.getElementById(ids) != null) {
                        var tempHandsonTableOptions = handsonTable.getSettings();
                        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = document.getElementById(ids).outerHTML;
                        handsonTable.updateSettings(tempHandsonTableOptions);
                        break;
                    }
                }
            }*/
            --handsonTableActiveAjaxCalls
            /*if (--handsonTableActiveAjaxCalls === 0) {
                setTimeout(function() {
                    moveChartsFromAltToAltHolder();
                }, 300)
            }*/
        },
        error: function() {
            --handsonTableActiveAjaxCalls;
            alert("æ��äº¤å¤±è´¥ï¼�");
        },
        complete: function() {

        }
    });

}

//整理控制图数据
function setControlChart(id, row, col, width, height,BigobjHelper,Result){

    var AMap=[],BMap=[],ADataMap=[],BDataMap=[],categories=[];
    var activity = {
        "id":id,
        "Letter":['a', 'b', 'c', 'd',"f",'g', 'h', 'i', 'j',"k",'l', 'm', 'n', 'o',"p",'q', 'r', 's', 't',"u", 'v', 'w', 'q',"y","z"],
        "xMarks": ['a', 'b', 'c', 'd',"f",'g', 'h', 'i', 'j',"k",'l', 'm', 'n', 'o',"p",'q', 'r', 's', 't',"u"],
        "xData": ['a', 'b', 'c', 'd',"f",'g', 'h', 'i', 'j',"k",'l', 'm', 'n', 'o',"p",'q', 'r', 's', 't',"u", 'v', 'w', 'q',"y","z"],
        "height":height,
        "symbol":[{symbol:2,color:"red"},{symbol:5,color:"blue"}],
        "categories": ['a', 'b', 'c', 'd','e',"f",'g', 'h', 'i', 'j',"k",'l', 'm', 'n', 'o',"p",'q', 'r', 's', 't'],
        "width":width,
        "dataset": [],
        "datasets": [{
            "name": "Aå›¾",
            "data": [12, 123, 153, 180,12,13,15,16,17,18,19,120,123,124,23,24,252,62,25,78],
            "unit": "",
            "type": "line",
            "valueDecimals": 1,
            "color": "red",
            "lineWidth": 1,
            "lineColor": "red",
            "symbol": "square"
        }, {
            "name": "Bå›¾",
            "data": [12, 123, 153, 180,12,13,15,16,17,18,19,120,123,124,23,24,252,62,25,78],
            "unit": "",
            "type": "line",
            "valueDecimals": 0,
            "color": "blue",
            "lineWidth": 1,
            "lineColor": "blue",
            "symbol": "triangle"
        }],
        "yAxis":[
            {
                lineWidth:1,
                gridLineWidth:0,
                lineColor:"#ccd6eb",
                tickWidth:1,
                title: {
                    text: null
                },
                // plotLines:activity.Identification[i]
            },
            {
                lineWidth:1,
                gridLineWidth:0,
                lineColor:"#ccd6eb",
                tickWidth:1,
                title: {
                    text: null
                },
                // plotLines:activity.Identification[i]
            }
        ],
        "Identification": [],
    }
    for(var i=0;i<3;i++){
        var Letter=activity.Letter[i]
        for(var j=0;j<activity.Letter.length;j++){
            activity.xData.push(Letter+activity.Letter[j])
        }
    }
    if(true||Number($(".ControlChart").find(".ControlChartType").val())==1 ||BigobjHelper.ControlChartType==1){//æ•°æ�®è®¡ç®—  X-MR
        // objHelper.controlXaxisStyle = $(".ControlChart select[name='controlXaxisStyle']").val();//Xè½´æ ·å¼�
        // objHelper.controlXaxis = $(".ControlChart select[name='controlXaxis']").val();//æ ‡ç­¾è®¾ç½®
        for(var i=0;i<Result.points[0].sample.length;i++) {
            ADataMap.push(Result.points[0].sample[i].pc)//Aå›¾æ•°æ�®
            if (i == 0) {//Bå›¾æ•°æ�®
                var number = 0;
                BDataMap.push(number)
                BDataMap.push(Number(Math.abs(Result.points[0].sample[i + 1].pc - Result.points[0].sample[i].pc).toFixed(2)))
            } else {
                if (i != Result.points[0].sample.length - 1) {
                    BDataMap.push(Number(Math.abs(Result.points[0].sample[i + 1].pc - Result.points[0].sample[i].pc).toFixed(2)))
                }
            }
            if (true||Number($(".ControlChart").find(".controlXaxisStyle").val()) == 1||BigobjHelper.controlXaxisStyle) {//Xè½´æ ·å¼�   è‡ªå®šä¹‰
                if (false&&(Number($(".ControlChart").find(".controlXaxis").val()) == 4||BigobjHelper.controlXaxis==4)) {//æ ‡ç­¾è®¾ç½®  æ•°å­—åº�åˆ—
                    categories.push(i + 1)
                } else if (true||Number($(".ControlChart").find(".controlXaxis").val()) == 5||BigobjHelper.controlXaxis==5) {//å­—æ¯�åº�åˆ—
                    categories.push(activity.xData[i])
                }
            }
        }
    }else if(Number($(".ControlChart").find(".ControlChartType").val())==2||BigobjHelper.ControlChartType==2){//æ•°æ�®è®¡ç®—  MA-MR
        for(var i=0;i<Result.points[0].sample.length;i++){
            if (i == 0) {//A Bå›¾æ•°æ�®
                ADataMap.push(Number((Result.points[0].sample[i + 1].pc - Result.points[0].sample[i].pc).toFixed(2))/2)
                BDataMap.push(Number(Math.abs(Result.points[0].sample[i + 1].pc - Result.points[0].sample[i].pc).toFixed(2)))
            } else {
                if (i != Result.points[0].sample.length - 1) {
                    ADataMap.push(Number((Result.points[0].sample[i + 1].pc - Result.points[0].sample[i].pc).toFixed(2))/2)
                    BDataMap.push(Number(Math.abs(Result.points[0].sample[i + 1].pc - Result.points[0].sample[i].pc).toFixed(2)))
                }
            }
        }
        for(var i=0;i<ADataMap.length;i++){
            if (Number($(".ControlChart").find(".controlXaxisStyle").val()) == 1||BigobjHelper.controlXaxisStyle==1) {//Xè½´æ ·å¼�   è‡ªå®šä¹‰
                if (Number($(".ControlChart").find(".controlXaxis").val()) == 4||BigobjHelper.controlXaxisStyle==4) {//æ ‡ç­¾è®¾ç½®  æ•°å­—åº�åˆ—
                    categories.push(i + 1)
                } else if (Number($(".ControlChart").find(".controlXaxis").val()) == 5||BigobjHelper.controlXaxisStyle==5) {//å­—æ¯�åº�åˆ—
                    categories.push(activity.xData[i])
                }
            }
        }
    }else if(Number($(".ControlChart").find(".ControlChartType").val())==3||BigobjHelper.ControlChartType==3){//æ•°æ�®è®¡ç®—  Xbar-R
        var Num;
        if(BigobjHelper.ControlGroupingCules){
            Num=BigobjHelper.ControlGroupingCules
        }else{
            Num=Number($(".ControlChart").find(".ControlGroupingCules").val())
        }
        for(var i=0;i<Result.points[0].sample.length;i++){
            activity.dataset.push(Result.points[0].sample[i])
        }
        var Group=group(activity.dataset,Num)
        for(var i=0;i<Group.length;i++){
            var totalNum=0;//æ¯�ç»„æ€»å’Œ
            for(var j=0;j<Group[i].length;j++){
                totalNum+=Group[i][j].pc
            }
            ADataMap.push(Number((totalNum/Num).toFixed(2)))
            Group[i].sort(sortIdNormal)
            if(Group[i].length<Num){
                BDataMap.push(Math.abs(Number((Group[i][Group[i].length-1].pc-Group[i][0].pc).toFixed(2))))
            }else{
                BDataMap.push(Math.abs(Number((Group[i][Num-1].pc-Group[i][0].pc).toFixed(2))))
            }




        }
        for(var i=0;i<ADataMap.length;i++){
            if (Number($(".ControlChart").find(".controlXaxisStyle").val()) == 1||BigobjHelper.controlXaxisStyle==1) {//Xè½´æ ·å¼�   è‡ªå®šä¹‰
                if (Number($(".ControlChart").find(".controlXaxis").val()) == 4||BigobjHelper.controlXaxisStyle==4) {//æ ‡ç­¾è®¾ç½®  æ•°å­—åº�åˆ—
                    categories.push(i + 1)
                } else if (Number($(".ControlChart").find(".controlXaxis").val()) == 5||BigobjHelper.controlXaxisStyle==5) {//å­—æ¯�åº�åˆ—
                    categories.push(activity.xData[i])
                }
            }
        }

    }else if(Number($(".ControlChart").find(".ControlChartType").val())==4||BigobjHelper.ControlChartType==4){//æ•°æ�®è®¡ç®—  Xbar-S
        var Num;
        if(BigobjHelper.ControlGroupingCules){
            Num=BigobjHelper.ControlGroupingCules
        }else{
            Num=Number($(".ControlChart").find(".ControlGroupingCules").val())
        }
        for(var i=0;i<Result.points[0].sample.length;i++){
            activity.dataset.push(Result.points[0].sample[i])
        }
        var Group=group(activity.dataset,Num)
        for(var i=0;i<Group.length;i++){
            var totalNum=0;//æ¯�ç»„æ€»å’Œ
            for(var j=0;j<Group[i].length;j++){
                totalNum+=Group[i][j].pc
            }
            ADataMap.push(Number((totalNum/Num).toFixed(2)))
            // Group[i].sort(sortIdNormal)
            // if(Group[i].length<Num){
            //     BDataMap.push(Math.abs(Number((Group[i][Group[i].length-1].pc-Group[i][0].pc).toFixed(2))))
            // }else{
            //     BDataMap.push(Math.abs(Number((Group[i][Num-1].pc-Group[i][0].pc).toFixed(2))))
            // }
        }
        for(var i=0;i<ADataMap.length;i++){
            if (Number($(".ControlChart").find(".controlXaxisStyle").val()) == 1||BigobjHelper.controlXaxisStyle==1) {//Xè½´æ ·å¼�   è‡ªå®šä¹‰
                if (Number($(".ControlChart").find(".controlXaxis").val()) == 4||BigobjHelper.controlXaxisStyle==4) {//æ ‡ç­¾è®¾ç½®  æ•°å­—åº�åˆ—
                    categories.push(i + 1)
                } else if (Number($(".ControlChart").find(".controlXaxis").val()) == 5||BigobjHelper.controlXaxisStyle==5) {//å­—æ¯�åº�åˆ—
                    categories.push(activity.xData[i])
                }
            }
        }
    }
    activity.datasets[0].data=ADataMap
    activity.datasets[1].data=BDataMap
    activity.categories=categories


    if(BigobjHelper&& typeof BigobjHelper != 'string'){
        //æŒ‡ç¤ºçº¿
        for(var i=0;i<BigobjHelper.instructionLines.length;i++){
            if(Number(BigobjHelper.instructionLines[i].MapStyle)==1){//Aå›¾ åˆ¤æ–­æ˜¯Aå›¾è¿˜æ˜¯Bå›¾
                if(Number(BigobjHelper.instructionLines[i].IndicatorLineStyleChange)==1){//åˆ¤æ–­æ˜¯åŒºé—´è¿˜æ˜¯å�‚æ•°
                    for(var j=0;j<2;j++){//åŒºé—´æœ‰ä¸¤æ�¡æ•°æ�®çº¿
                        var Aitem={};
                        Aitem.color=BigobjHelper.instructionLines[i].BackgroundColor
                        if(BigobjHelper.instructionLines[i].BackgroundColor=="empty"){
                            Aitem.dashStyle="Dash"
                        }else{
                            Aitem.dashStyle="solid"
                        }
                        if(j==0){
                            Aitem.value =Number(BigobjHelper.instructionLines[i].iLInputFrom)
                        }else if(j==1){
                            Aitem.value =Number(BigobjHelper.instructionLines[i].iLInputTo)
                        }
                        Aitem.width=Number(BigobjHelper.instructionLines[i].WidthNumber)
                        AMap.push(Aitem)
                    }
                }else{
                    var Aitem={};
                    Aitem.color=BigobjHelper.instructionLines[i].BackgroundColor
                    if(BigobjHelper.instructionLines[i].BackgroundColor=="empty"){
                        Aitem.dashStyle="Dash"
                    }else{
                        Aitem.dashStyle="solid"
                    }
                    Aitem.width=Number(BigobjHelper.instructionLines[i].WidthNumber)
                    if(Number(BigobjHelper.instructionLines[i].iLSelParam3)==1){//å�‡å€¼
                        Aitem.value =300
                        // Aitem.value =Number(BigobjHelper.instructionLines[i].ParameterNum)
                    }else{
                        Aitem.value =0
                        // Aitem.value =Number(BigobjHelper.instructionLines[i].ParameterNum)
                    }

                    AMap.push(Aitem)
                }
            }else if(Number(BigobjHelper.instructionLines[i].MapStyle)==2){//Bå›¾
                var Aitem={};
                Aitem.color=BigobjHelper.instructionLines[i].BackgroundColor
                if(BigobjHelper.instructionLines[i].BackgroundColor=="empty"){
                    Aitem.dashStyle="Dash"
                }else{
                    Aitem.dashStyle="solid"
                }
                Aitem.width=Number(BigobjHelper.instructionLines[i].WidthNumber)
                Aitem.value =Number(BigobjHelper.instructionLines[i].ParameterNum)
                BMap.push(Aitem)
            }

        }
        activity.Identification.push(AMap)//æŒ‡ç¤ºçº¿
        activity.Identification.push(BMap)//æŒ‡ç¤ºçº¿
        //æ•°æ�®æ ·å¼�
        for(var i=0;i<BigobjHelper.dataStyles.length;i++){
            if(Number(BigobjHelper.dataStyles[i].DataMapStyle)==1){
                if(BigobjHelper.dataStyles[i].dSCb1){
                    activity.datasets[0].color=BigobjHelper.dataStyles[i].DSBgColor
                }
                if(BigobjHelper.dataStyles[i].dSCb2){
                    activity.datasets[0].lineColor=BigobjHelper.dataStyles[i].BorderColor
                    activity.datasets[0].lineWidth=Number(BigobjHelper.dataStyles[i].dSWidth)
                }
                activity.datasets[0].symbol=BigobjHelper.dataStyles[i].DataTypeShow
            }else{
                if(BigobjHelper.dataStyles[i].dSCb1){
                    activity.datasets[1].color=BigobjHelper.dataStyles[i].DSBgColor
                }
                if(BigobjHelper.dataStyles[i].dSCb2){
                    activity.datasets[1].lineColor=BigobjHelper.dataStyles[i].BorderColor
                    activity.datasets[1].lineWidth=Number(BigobjHelper.dataStyles[i].dSWidth)
                }
                activity.datasets[1].symbol=BigobjHelper.dataStyles[i].DataTypeShow
            }
        }



    }
    if(activity.Identification.length>0){
        for(var i=0;i<activity.Identification.length;i++){
            if(activity.Identification[i].length>0){
                activity.yAxis[i].plotLines=activity.Identification[i]
            }

        }
    }
    ControlChart(activity)
}

function resizeChartsParetoChartAjaxHelper(row, col, ids, widthHelper, heightHelper, BigobjHelper) {
    handsonTableActiveAjaxCalls++
    $.ajax({
        url: "/static/js/projectJs/data2.json",
        type: "get",
        datatype: "JSON",
        success: function(msg) {
            var data = msg;
            setPareToDiagram(ids, data,widthHelper, heightHelper,BigobjHelper,function() {
                /*if (document.getElementById(ids)) {
                     var tempHandsonTableOptions = handsonTable.getSettings();
                     tempHandsonTableOptions.data[row][col] = document.getElementById(ids).outerHTML;
                     handsonTable.updateSettings(tempHandsonTableOptions);
                }*/
                handsonTableActiveAjaxCalls--;
                if (handsonTableActiveAjaxCalls <= 0) {
                    handsonTableActiveAjaxCalls = 0;
                    setTimeout(function() {
                        moveParetoChartsFromAltToAltHolder()
                    }, 300)
                }
            });
        },
        error: function() {
            alert("æ��äº¤å¤±è´¥ï¼�");
        }
    });
}

function resizeChartsBoxDiagramAjaxHelper(row, col, ids, widthHelper, heightHelper, BigobjHelper) {
    handsonTableActiveAjaxCalls++
    $.ajax({
        url: "/static/js/projectJs/data2.json",
        type: "get",
        datatype: "JSON",
        success: function(msg) {
            var data=msg
            setBoxDiagram(ids,data, row, col, widthHelper, heightHelper,BigobjHelper)
            //refactor this back in later, needs to be more exact than setTimeout
            /*handsonTableActiveAjaxCalls--;
            if (handsonTableActiveAjaxCalls <= 0) {
                handsonTableActiveAjaxCalls = 0;
            }*/
        },
        error: function(msg) {
            alert("msg");
        }
    });
}

function resizeChartsPieChartAjaxHelper(row, col, ids, widthHelper, heightHelper, BigobjHelper) {
    handsonTableActiveAjaxCalls++
    $.ajax({
        url: "/static/js/projectJs/data2.json",
        type: "get",
        datatype: "JSON",
        success: function(msg) {
            var data=msg
            setPieChart(ids, data, row, col,
                widthHelper, heightHelper,BigobjHelper)
            //refactor this back in later, needs to be more exact than setTimeout
            /*handsonTableActiveAjaxCalls--;
            if (handsonTableActiveAjaxCalls <= 0) {
            handsonTableActiveAjaxCalls = 0;
            }*/
        },
        error: function(msg) {
            alert("msg");
        }
    });
}

function resizeSigmaChartAjaxHelper(row, col, ids, widthHelper, heightHelper, BigobjHelper) {
    handsonTableActiveAjaxCalls++
    $.ajax({
        url: "/static/js/projectJs/data2.json",
        type: "get",
        datatype: "JSON",
        success: function(msg) {
            var data=msg
            setSigmaChart(ids, data, row, col,
                widthHelper, heightHelper,BigobjHelper)
        },
        error: function(msg) {
            alert("msg");
        }
    });
}

function resizeStackingMapAjaxHelper(row, col, ids, widthHelper, heightHelper, BigobjHelper) {
    handsonTableActiveAjaxCalls++
    $.ajax({
        url: "/static/js/projectJs/data2.json",
        type: "get",
        datatype: "JSON",
        success: function(msg) {
            var data=msg
            setStackingMapChart(ids, data, row, col,
                widthHelper, heightHelper,BigobjHelper)
        },
        error: function(msg) {
            alert("msg");
        }
    });
}

//整理帕雷图数据
function setPareToDiagram(ids, data, widthHelper, heightHelper, BigobjHelper, loadEventHandler){
    var id = ids,splineData= [],AMap=[],tolerance=data.points[0].featvarLimits;;
    var ParetoDiagramSet={
        Letter:['a', 'b', 'c', 'd',"f",'g', 'h', 'i', 'j',"k",'l', 'm', 'n', 'o',"p",'q', 'r', 's', 't',"u", 'v', 'w', 'q',"y","z"],
        xData: ['a', 'b', 'c', 'd',"f",'g', 'h', 'i', 'j',"k",'l', 'm', 'n', 'o',"p",'q', 'r', 's', 't',"u", 'v', 'w', 'q',"y","z"],
        LineStyle:"",
        LineWidth:Number,
        LineDataTypeShow:"",
        LineColor:"",
        LineTransparency:"",
        BarBorderWidth:"",
        BarBorderColor:"",
        BarBgColor:"",
        BarBgTransparency:"",
        BarBorderDashStyle:"",
        categories:[],
        Xcategories:[],
        columnData:[],
        splineDataLabel:[],
        plotLines:[],
    }
    for(var i=0;i<3;i++){
        var Letter=ParetoDiagramSet.Letter[i]
        for(var j=0;j<ParetoDiagramSet.Letter.length;j++){
            ParetoDiagramSet.xData.push(Letter+ParetoDiagramSet.Letter[j])
        }
    }
    for(var i=0;i<data.points[0].sample.length;i++){//数据
        var item={};
        item.name=data.points[0].sample[i].s_label;
        item.num=Math.abs(data.points[0].sample[i].pc);

        if(BigobjHelper&&typeof  BigobjHelper!=String){

            if(BigobjHelper.ProportionLine=="on"){
                // 线条样式
                ParetoDiagramSet.LineStyle =BigobjHelper.publicSelectInput;
                ParetoDiagramSet.LineWidth=BigobjHelper.ProportionLineWidth;
                ParetoDiagramSet.LineDataTypeShow=BigobjHelper.DataTypeShow;
                ParetoDiagramSet.LineColor=BigobjHelper.LineColor;
                ParetoDiagramSet.LineTransparency=BigobjHelper.LineTransparency;
            }else{
                // 线条样式
                ParetoDiagramSet.LineStyle ="Solid";
                ParetoDiagramSet.LineWidth=0;
                ParetoDiagramSet.LineDataTypeShow="circle";
                ParetoDiagramSet.LineColor="transparent";
                ParetoDiagramSet.LineTransparency=100
            }

// 柱子样式
            if (BigobjHelper.dataStyles.length > 0) {
                ParetoDiagramSet.BarBorderWidth = BigobjHelper.dataStyles[0].dSWidth;
                ParetoDiagramSet.BarBorderColor = BigobjHelper.dataStyles[0].BorderColor;
                ParetoDiagramSet.BarBgColor = BigobjHelper.dataStyles[0].DSBgColor;
                ParetoDiagramSet.BarBgTransparency = BigobjHelper.dataStyles[0].dSBgColorTransparency1;
                ParetoDiagramSet.BarBorderDashStyle = BigobjHelper.dataStyles[0].publicSelectInput;
            }

            item.symbol=BigobjHelper.DataTypeShow;
            item.color=BigobjHelper.LineColor;
        }else{
            item.symbol="circle";
            item.color="green";


// 柱子样式
            ParetoDiagramSet.BarBorderWidth=1;
            ParetoDiagramSet.BarBorderColor="blue";
            ParetoDiagramSet.BarBgColor="blue";
            ParetoDiagramSet.BarBgTransparency=100;
            ParetoDiagramSet.BarBorderDashStyle="Solid";
// 线条样式
            ParetoDiagramSet.LineStyle ="Solid";
            ParetoDiagramSet.LineWidth=0;
            ParetoDiagramSet.LineDataTypeShow="circle";
            ParetoDiagramSet.LineColor="transparent";
            ParetoDiagramSet.LineTransparency=100
        }
        splineData.push(item)
    }

    splineData.sort(sortId1);
    var totalNum=0;
    for(var i=0;i<splineData.length;i++){
        totalNum+=splineData[i].num
    }
    var PercentageNum=0;
    for(var i=0;i<splineData.length;i++){
// splineData[i-1].num/totalNum
        var y=0;
        if(i==0){
            PercentageNum=splineData[i].num
            y=(PercentageNum/totalNum).toFixed(2)
        }else{
            PercentageNum+=splineData[i].num
            y=(PercentageNum/totalNum).toFixed(2)
// (this.y/totalNum * 100).toFixed(2)
        }
        var item={
            name: splineData[i].name,
            color: ParetoDiagramSet.LineColor,
            marker: {
                symbol: ParetoDiagramSet.LineDataTypeShow,
                lineColor: ParetoDiagramSet.LineColor,
                lineWidth: 1,
                states:{
                    hover:{
                        enabled:false
                    },
                    select: {
                        nabled:false
                    }
                }
            },
            y: y*100
        }
// if(BigobjHelper&&typeof  BigobjHelper!=String){
//     if(BigobjHelper.ProportionLine){
//
//     }
// }
        ParetoDiagramSet.categories.push(splineData[i].name)//Xaxis
        ParetoDiagramSet.columnData.push(splineData[i].num)//Bar 数据
        ParetoDiagramSet.splineDataLabel.push(item)//tyLine  数据
    }
    if(BigobjHelper&& typeof BigobjHelper != 'string'){
        for(var i=0;i<BigobjHelper.instructionLines.length;i++){
//指示线
            if(Number(BigobjHelper.instructionLines[i].IndicatorLineStyleChange)==1){//判断是区间还是参数
                for(var j=0;j<2;j++){//区间有两条数据线
                    var Aitem={};
                    Aitem.color=BigobjHelper.instructionLines[i].BackgroundColor
                    Aitem.dashStyle=BigobjHelper.instructionLines[i].publicSelectInput
                    if(j==0){
                        Aitem.value =Number(BigobjHelper.instructionLines[i].iLInputFrom)
                    }else if(j==1){
                        Aitem.value =Number(BigobjHelper.instructionLines[i].iLInputTo)
                    }
                    Aitem.width=Number(BigobjHelper.instructionLines[i].WidthNumber)
                    ParetoDiagramSet.plotLines.push(Aitem)
                }
            }else{
                tolerance.sort(compare)
                if(Number(BigobjHelper.instructionLines[i].iLSelParam1)==1){//公差
                    for(var m=0;m<2;m++){
                        var Aitem={};
                        Aitem.color=BigobjHelper.instructionLines[i].BackgroundColor
                        Aitem.dashStyle=BigobjHelper.instructionLines[i].publicSelectInput
                        Aitem.width=Number(BigobjHelper.instructionLines[i].WidthNumber)
                        // fvlHivalue: "1"
                        // fvlLovalue: "-1"
                        if(m==0){
                            Aitem.value = Number(tolerance[tolerance.length-2].fvlHivalue)*BigobjHelper.instructionLines[i].RangeNumber
                        }else if(m==1){
                            Aitem.value = Number(tolerance[tolerance.length-2].fvlLovalue)*BigobjHelper.instructionLines[i].RangeNumber
                        }

                        ParetoDiagramSet.plotLines.push(Aitem)
                    }

                }else{//均值
                    Aitem.value =0
                    // Aitem.value =Numb
                    //
                    // er(BigobjHelper.instructionLines[i].ParameterNum)
                }

            }
        }
    }
// if()
    for(var i=0;i<ParetoDiagramSet.columnData.length;i++){
        if (true||Number($(".ParetoChart").find(".controlXaxisStyle").val()) == 1||BigobjHelper.controlXaxisStyle==1) {//X轴样式   自定义
            if (false&&(Number($(".ParetoChart").find(".controlXaxis").val()) == 4||BigobjHelper.controlXaxisStyle==4)) {//标签设置  数字序列
                ParetoDiagramSet.Xcategories.push(i + 1)
            } else if (true||Number($(".ParetoChart").find(".controlXaxis").val()) == 5||BigobjHelper.controlXaxisStyle==5) {//字母序列
                ParetoDiagramSet.Xcategories.push(ParetoDiagramSet.xData[i])
            }
        }
    }
    ParetoDiagramSet.categories=ParetoDiagramSet.Xcategories
    console.log(ParetoDiagramSet.Xcategories)
    ParetoDiagram(id, ParetoDiagramSet, totalNum, loadEventHandler)
}

var compare = function (obj1, obj2) {//对象排序
    var val1 = obj1.fvlBeginTime;
    var val2 = obj2.fvlBeginTime;
    if (val1 < val2) {
        return -1;
    } else if (val1 > val2) {
        return 1;
    } else {
        return 0;
    }
}
//将数组array分成长度为subGroupLength的小数组并返回新数组
function group(array, subGroupLength) {
    let index = 0;
    let newArray = [];
    while(index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
}
function sortId(a,b){//绝对值排序
    return Math.abs(a.pc) -Math.abs(b.pc)
}
function sortIdNormal(a,b){//排序
    return a.pc -b.pc
}
function sortId1(a,b){//排序
    return b.num - a.num
}
function  sortdata(a,b) {//绝对值排序
    return Math.abs(a.value) -Math.abs(b.value)
}
function  sortdataOne(a,b) {//时间排序
    return Math.abs(a.value) -Math.abs(b.value)
}
// result.sort(sortId);
function UpToleranceLine(UpTolerance,DownTolerance,X){
    return Number(UpTolerance)-(Number(UpTolerance)-Number(DownTolerance))*(1-X)*0.5
}
function DownToleranceLine(UpTolerance,DownTolerance,X){
    return Number(DownTolerance)+(Number(UpTolerance)-Number(DownTolerance))*(1-X)*0.5
}

function createHandsonCellDivWithProps(id, width, height, setting) {
    var retOb = document.createElement('div')
    retOb.id = id
    if (typeof setting !== 'undefined' && setting) {
//坐标区域
        if (!isNaN(setting.miscHeight) && Number(setting.miscHeight) > 0) {
            height = Number(setting.miscHeight)
        }
        if (!isNaN(setting.miscWidth) && Number(setting.miscWidth) > 0) {
            width = Number(setting.miscWidth)
        }
        if (setting.miscBGColor) {
            retOb.style.backgroundColor = setting.miscBGColor
        }
        if (setting.miscTableBorderStyle) {
            retOb.style.borderStyle = setting.miscTableBorderStyle == 'empty'?'dotted':'solid'
            retOb.style.borderWidth = Number(setting.miscFrameThickness) > 0?Number(setting.miscFrameThickness)
                +'px':'1px'
            retOb.style.borderColor = setting.miscTableBorderColor
        }
    }
//retOb.style.width = width
//retOb.style.height = height
    retOb.style.cssText += 'width:' + width + 'px;height:' + height + 'px;';
    return retOb;
}

//整理箱线图数据
function setBoxDiagram(ids,data, rowAndColArr, rowAndColArr, widthHelper, heightHelper,BigobjHelper){
    var id=ids,tolerance=data.points[0].featvarLimits,DataList=[],result=data.points[0].sample;
    var BoxDiagramData={
        Letter:['a', 'b', 'c', 'd',"f",'g', 'h', 'i', 'j',"k",'l', 'm', 'n', 'o',"p",'q', 'r', 's', 't',"u", 'v', 'w', 'q',"y","z"],
        data:[
            // [100, 200, 248, 295, 509],
        ],
        color:"blue",
        fillColor:"#fff",
        categories:[],
        lineWidth:1,
        plotBackgroundColor:"#fff",
        stemDashStyle:"empty",
        abnormal:{
            abnormalData:[ // x, y positions where 0 is the first category  异常数据

            ],
            abnormalName:"异常值",
            abnormalColor:"red"
        },
        plotLines:[]
    }
    if(BigobjHelper&& typeof BigobjHelper != 'string'){
        for(var i=0;i<BigobjHelper.instructionLines.length;i++){
            //指示线
            if(Number(BigobjHelper.instructionLines[i].IndicatorLineStyleChange)==1){//判断是区间还是参数
                for(var j=0;j<2;j++){//区间有两条数据线
                    var Aitem={
                        value: 0,
                        color: 'red',
                        width: 1,
                        dashStyle:"Solid",//实线
                        label: {
                            text: '下公差',
                            align: 'right',
                            style: {
                                color: 'blue'
                            }
                        }
                    }
                    Aitem.color=BigobjHelper.instructionLines[i].BackgroundColor
                    Aitem.dashStyle=BigobjHelper.instructionLines[i].publicSelectInput
                    if(j==0){
                        Aitem.value =Number(BigobjHelper.instructionLines[i].iLInputFrom)
                    }else if(j==1){
                        Aitem.value =Number(BigobjHelper.instructionLines[i].iLInputTo)
                    }
                    Aitem.width=Number(BigobjHelper.instructionLines[i].WidthNumber)
                    BoxDiagramData.plotLines.push(Aitem)
                }
            }else{
                tolerance.sort(compare)
                if(Number(BigobjHelper.instructionLines[i].iLSelParam1)==1){//公差
                    for(var j=0;j<2;j++){
                        var Aitem={
                            value: 1,
                            color: 'red',
                            width: 1,
                            dashStyle:"Solid",//实线
                            label: {
                                text: '下公差',
                                align: 'right',
                                style: {
                                    color: 'blue'
                                }
                            }
                        }
                        Aitem.color=BigobjHelper.instructionLines[i].BackgroundColor
                        Aitem.dashStyle=BigobjHelper.instructionLines[i].publicSelectInput
                        if(j==0){
                            Aitem.value = Number(tolerance[tolerance.length-1].fvlHivalue)*BigobjHelper.instructionLines[i].RangeNumber
                        }else if(j==1){
                            Aitem.value = Number(tolerance[tolerance.length-1].fvlLovalue)*BigobjHelper.instructionLines[i].RangeNumber
                        }
                        Aitem.width=Number(BigobjHelper.instructionLines[i].WidthNumber)


                        BoxDiagramData.plotLines.push(Aitem)
                    }

                }else{//均值
                    Aitem.value =0
                    // Aitem.value =Numb
                    //
                    // er(BigobjHelper.instructionLines[i].ParameterNum)
                }

            }
        }
        //数据样式
        for(var i=0;i<BigobjHelper.dataStyles.length;i++){
            if(BigobjHelper.dataStyles[i].dSCb1){
                BoxDiagramData.fillColor=BigobjHelper.dataStyles[i].DSBgColor
            }
            if(BigobjHelper.dataStyles[i].dSCb2){
                BoxDiagramData.color=BigobjHelper.dataStyles[i].BorderColor
                BoxDiagramData.lineWidth=Number(BigobjHelper.dataStyles[i].dSWidth)
                if(BigobjHelper.dataStyles[i].publicSelectInput=="empty"){
                    BoxDiagramData.stemDashStyle = "dot"
                }else{
                    BoxDiagramData.stemDashStyle = "Solid"
                }

            }
        }

    }

    //数据计算
    result.sort(sortIdNormal)
    var Qi = (result.length+1)/4
    var Q1 = result[Math.floor(Qi)-1].pc*0.25+result[Math.ceil(Qi)-1].pc*0.75
    var median = result[Math.floor(Qi*2)-1].pc*0.5+result[Math.ceil(Qi*2)-1].pc*0.5
    var Q3 = result[Math.floor(Qi*3)-1].pc*0.75+result[Math.ceil(Qi*3)-1].pc*0.25
    var IQR = Q3-Q1
    var max = Q3 + 1.5*IQR
    var min = Q1 - 1.5*IQR
    DataList.push(min)
    DataList.push(Q1)
    DataList.push(median)
    DataList.push(Q3)
    DataList.push(max)
    console.log(DataList)
    BoxDiagramData.data.push(DataList)
    for(var i=0;i<result.length;i++){
        var abnormalData=[];
        if(result[i].pc<min||result[i].pc>max){
            abnormalData.push(0,result[i].pc)
            BoxDiagramData.abnormal.abnormalData.push(abnormalData)
        }

    }
    //设置X轴
    // for(var i=0;i<BoxDiagramData.data.length;i++){//X轴样式
    //     if (typeof BigobjHelper !== 'undefined' && BigobjHelper && (Number($(".BoxLineChart").find(".BoxLineXaxisStyle").val()) == 1||BigobjHelper.BoxLineXaxisStyle==1)) {//X轴样式   自定义
    //         if (Number($(".BoxLineChart").find(".BoxLineXaxis").val()) == 4||BigobjHelper.BoxLineXaxis==4) {//标签设置  数字序列
    //             BoxDiagramData.categories.push(i + 1)
    //         } else if (Number($(".BoxLineChart").find(".BoxLineXaxis").val()) == 5||BigobjHelper.BoxLineXaxis==5) {//字母序列
    //             BoxDiagramData.categories.push(BoxDiagramData.Letter[i])
    //         }
    //     } else {
    //         BoxDiagramData.categories.push(i + 1)
    //     }
    // }
    // try {
    BoxDiagram(id, BoxDiagramData)
    // } catch (err) {
    //
    // }
}

//整理饼图数据
function setPieChart(ids,data, rowAndColArr, rowAndColArr, widthHelper, heightHelper,BigobjHelper){
    var id=ids,PieChartSet={
        Data:[{
            name: 'Chrome',
            y: 61.41,
            sliced: true,
            selected: true
        }, {
            name: 'Internet Explorer',
            y: 11.84
        }, {
            name: 'Firefox',
            y: 10.85
        }, {
            name: 'Edge',
            y: 4.67
        }, {
            name: 'Safari',
            y: 4.18
        }],
        colors:["red","yellow","green","#000","blue"]
    }
    PieChart(id,PieChartSet)
}

//整理6Sigma图数据
function setSigmaChart(ids,data, rowAndColArr, rowAndColArr, widthHelper, heightHelper,BigobjHelper){
    var id="#"+ids,plotLines=[],dataArray=[],SetPlotLines=[],SetDataArray=[],width=widthHelper,height=heightHelper;
    var tolerance=data.points[0].featvarLimits,result=data.points[0].sample;
    // var
    var BoxStyle={
        BackgroundColor:"#8080FF",
        BorderWidth:1,
        borderColor:"#443785",
        dashStyle:"real",
    }
    PlotLinesStyle={
        BackgroundColor:"#8080FF",
        BorderWidth:1,
        borderColor:"#443785",
        dashStyle:"real",
    }
    //指示线
    plotLines.push(data.points[0].command.UpperDeviation)
    plotLines.push(data.points[0].command.LowerDeviation)
    //数据
    dataArray.push(3*data.points[0].command.sigma,-3*data.points[0].command.sigma)
    if(BigobjHelper&& typeof BigobjHelper != 'string'){
        //指示线
        for(var i=0;i<BigobjHelper.instructionLines.length;i++){
            //指示线
            if(Number(BigobjHelper.instructionLines[i].IndicatorLineStyleChange)==1){//判断是区间还是参数
                for(var j=0;j<2;j++){//区间有两条数据线
                    PlotLinesStyle.BackgroundColor=BigobjHelper.instructionLines[i].BackgroundColor
                    PlotLinesStyle.dashStyle=BigobjHelper.instructionLines[i].publicSelectInput
                    if(j==0){
                        SetPlotLines.push(Number(BigobjHelper.instructionLines[i].iLInputFrom))
                    }else if(j==1){
                        SetPlotLines.push(Number(BigobjHelper.instructionLines[i].iLInputTo))
                    }
                    PlotLinesStyle.BorderWidth=Number(BigobjHelper.instructionLines[i].WidthNumber)
                }
                plotLines=SetPlotLines
            }else{
                tolerance.sort(compare)
                if(Number(BigobjHelper.instructionLines[i].iLSelParam1)==1){//公差
                    for(var j=0;j<2;j++){
                        PlotLinesStyle.BackgroundColor=BigobjHelper.instructionLines[i].BackgroundColor
                        PlotLinesStyle.dashStyle=BigobjHelper.instructionLines[i].publicSelectInput
                        if(j==0){
                            SetPlotLines.push(Number(tolerance[tolerance.length-1].fvlHivalue)*BigobjHelper.instructionLines[i].RangeNumber)
                        }else if(j==1){
                            SetPlotLines.push(Number(tolerance[tolerance.length-1].fvlLovalue)*BigobjHelper.instructionLines[i].RangeNumber)
                        }
                        PlotLinesStyle.BorderWidth=Number(BigobjHelper.instructionLines[i].WidthNumber)
                    }
                    plotLines=SetPlotLines
                }else{//均值
                    Aitem.value =0
                    // Aitem.value =Numb
                    //
                    // er(BigobjHelper.instructionLines[i].ParameterNum)
                }

            }
        }
        //数据样式
        for(var i=0;i<BigobjHelper.dataStyles.length;i++){
            if(BigobjHelper.dataStyles[i].dSCb1){
                BoxStyle.BackgroundColor=BigobjHelper.dataStyles[i].DSBgColor
            }
            if(BigobjHelper.dataStyles[i].dSCb2){
                BoxStyle.borderColor=BigobjHelper.dataStyles[i].BorderColor
                BoxStyle.BorderWidth=Number(BigobjHelper.dataStyles[i].dSWidth)
                BoxStyle.dashStyle=BigobjHelper.dataStyles[i].publicSelectInput

            }
        }

    }
    SigmaMap(id, dataArray, plotLines, width, height,BoxStyle,PlotLinesStyle)
}

//整理堆积图数据
function setStackingMapChart(id,data, row, col, width, height){
    var id="#"+id,Bigheight=height,Bigwidth=width,data1=[{
        color: "red",
        num: 60
    },
        {
            color: "blue",
            num: 10
        },
        {
            color: "red",
            num: 60
        },
        {
            color: "gray",
            num: 10
        },
        {
            color: "green",
            num: 10
        },
        {
            color: "#eee",
            num: 0
        },
        {
            color: "#000",
            num: 40
        }
    ];
    StackingMap(id,data1,Bigwidth,Bigheight)
}

function createHandsonTableBackgroundColorCSSThenReturnBorderStyle() {
    var borderStyleArr = []
    if (handsonTableHelperObj.handsonTableFrameWidth && handsonTableHelperObj.handsonTableFrameWidth.length > 0) {
        borderStyleArr.push(handsonTableHelperObj.handsonTableFrameWidth + 'px')
    }
    if (handsonTableHelperObj.handsonTableFrameStyle && handsonTableHelperObj.handsonTableFrameStyle.length > 0) {
        borderStyleArr.push(handsonTableHelperObj.handsonTableFrameStyle)
    }
    if (handsonTableHelperObj.handsonTableFrameColor && handsonTableHelperObj.handsonTableFrameColor.length > 0) {
        borderStyleArr.push(handsonTableHelperObj.handsonTableFrameColor)
    }
    var borderStyle = borderStyleArr.join(' ')
    var color = handsonTableHelperObj.handsonTableBackgroundColor || "#000"

    var sheetToBeRemoved = document.getElementById('handsonTableBackgroundColorStyle');
    if (sheetToBeRemoved) {
        var sheetParent = sheetToBeRemoved.parentNode;
        sheetParent.removeChild(sheetToBeRemoved);
    }

    var sheet = document.createElement('style')
    sheet.id = 'handsonTableBackgroundColorStyle'
    sheet.innerHTML = "#handsonContainer td {background-color: " + color + ";}";
    document.body.appendChild(sheet);

    return borderStyle
}