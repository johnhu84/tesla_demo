function applyTrendMapSettings(trendMapSettings, row, col, height, width, id, points) {
    var TrendMapHtml = '<div class="" id="' + id +
        '" style="height:' + height + 'px;width:' + width + 'px;overflow:hidden;"></div>'
    var tempHandsonTableOptions = handsonTableOptions;
    tempHandsonTableOptions.data[row][col] = TrendMapHtml;
    handsonTable.updateSettings(tempHandsonTableOptions);
    var el = document.getElementById(id);
    //趋势图setTrendMap
    var lineChart = new D3LineChart1(el, {});
    var firstDataStyle = trendMapSettings.dataStyles[0];
    var firstInstructionLine = {};
    if (typeof trendMapSettings.instructionLines !== 'undefined') {
        firstInstructionLine = trendMapSettings.instructionLines[0];
    }
    var settings = {
        dataLineStyle: [{ //数据线样式
            color: typeof firstDataStyle.dsBgColorInput1 !== 'undefined' ?
                firstDataStyle.dsBgColorInput1:firstInstructionLine.iLColor1,//dSBgColorInput1,//"blue",
            lineStyle: firstDataStyle.publicSelectInput,//"empty", //real实线
            lineWidth: "2",
            pointStyle:"1",
        }],
        data: [],/*{ //数据格式
            name: 'S001',
            value: 1.8,
            color:"red",
            symbol:5,
            //square 3正方形 diamond 2菱形 circle 6圆形 cross 1加号 ，Wye Y型  triangle 4倒 5正三角形 star五角星 8❌号  9多边形
        }, {
            name: 'S002',
            value: 1.4,
            color:"blue",
            symbol:3,

        }, {
            name: 'S003',
            value: 1.1,
            color:"green",
            symbol:8,
        }, {
            name: 'S004',
            value: -1.4,
            color:"red",
            symbol:9,
        }],*/
        width: width,
        height: height,
        Identification: [],/*{ //标识线数据格式
            color: '#ffc000',
            value: 1.3,
            lineWidth: "5,5",
            lineStyle: "real" //实线
        },{ //标识线数据格式
            color: '#ffc000',
            value: -1.3,
            lineWidth: "5,5",
            lineStyle: "real" //实线
        }, {
            color: '#ffc000',
            value: -1.4,
            lineWidth: "10,10",
            lineStyle: "empty" //虚线
        }, {
            color: '#ffc000',
            value: 1.4,
            lineWidth: "10,10",
            lineStyle: "empty" //虚线
        }],*/
        dataIdentificationLine:[],/* //折线数据
            [{
                x: 'S001',
                y: 1.7
            }, {
                x: 'S002',
                y: 1.7
            }, {
                x: 'S003',
                y: 1
            }, {
                x: 'S004',
                y: 1
            }]
        ]*/
    }
    for (var i = 0; i < points.pcs.length; i++) {
        //color:"green",
        //             symbol:8,
        settings.data.push({name: i, value: points.pcs[i], color: firstDataStyle.dSBgColorInput1, symbol: firstDataStyle.DataTypeShowElement});
    }
    if (typeof trendMapSettings.instructionLines !== 'undefined') {
        for (var i = 0; i < trendMapSettings.instructionLines.length; i++) {
            var instructionLine = trendMapSettings.instructionLines[i];
            if (typeof instructionLine.iLInputFrom !== 'undefined' && typeof instructionLine.iLInputTo !== 'undefined') {
                settings.Identification.push({
                    color: instructionLine.iLColor1,
                    value: instructionLine.iLInputFrom,
                    lineWidth: instructionLine.iLWidthInput1 + "," + instructionLine.iLWidthInput1,
                    lineStyle: typeof instructionLine.publicSelectInput !== 'undefined' ? instructionLine.publicSelectInput : "real"
                });
                settings.Identification.push({
                    color: instructionLine.iLColor1,
                    value: instructionLine.iLInputTo,
                    lineWidth: instructionLine.iLWidthInput1 + "," + instructionLine.iLWidthInput1,
                    lineStyle: typeof instructionLine.publicSelectInput !== 'undefined' ? instructionLine.publicSelectInput : "real"
                });
            } else {
                settings.Identification.push({
                    color: instructionLine.iLColor1,
                    value: instructionLine.RangeNumber,
                    lineWidth: instructionLine.WidthNumber + "," + instructionLine.WidthNumber,
                    lineStyle: typeof instructionLine.publicSelectInput !== 'undefined' ? instructionLine.publicSelectInput : "real"
                });
            }
            //settings.Identification.push({});
        }
    }
    /*settings.data.push({
        name: 'S005',
        value: 1.1,
        color:"red",
        symbol:3,
    })*/
    lineChart.setData(settings);
    if (document.getElementById(id)) {
        tempHandsonTableOptions.data[row][col] = document.getElementById(id).outerHTML;
        handsonTable.updateSettings(tempHandsonTableOptions);
        handsonTableHelperObjTrendMapsCache[id] = document.getElementById(id).outerHTML;
    } else {
        console.log("id, " + id + " is empty or null around line 515 of file my3.js");
    }
}

function getMergedCellRowAndCol(row, col) {
    var retObj = {row: row, col: col};
    if (typeof handsonTable === 'undefined') {
        return retObj;
    }
    var tempHandsonTableSettings = handsonTable.getSettings();
    for (var i = 0; i < tempHandsonTableSettings.mergeCells.length; i++) {
        if (isPartOfMergeCell(row, col, tempHandsonTableSettings.mergeCells[i])) {
            //is part of this merge cell
            retObj.row = tempHandsonTableSettings.mergeCells[i].row;
            retObj.col = tempHandsonTableSettings.mergeCells[i].col;
            return retObj;
        }
    }
    return retObj;
}

$(document).ready(function(){
    $('.reportRhideCont .element').each(function() {
        $(this).click(function() {
            /*var tempHandsonTableOptions = handsonTable.getSettings();
            var currSelection = handsonTable.getSelected();
            if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
                || currSelection[0].length < 4)
                return false;
            var mergedCellRowAndCol = getMergedCellRowAndCol(currSelection[0][0], currSelection[0][1]);
            var rowHeightHelper = handsonTable.getRowHeight(currSelection[0][0]);
            var colWidthHelper = handsonTable.getColWidth(currSelection[0][1]);*/
            if ($(this).hasClass('elpingjunfenbu')) {

            } else if ($(this).hasClass('elchuizhifenbu')) {

            } else if ($(this).hasClass('elfengexian')) {

            } else if ($(this).hasClass('elzuoduiqi-bukexuan')) {//TableLeftAlignment
                //use these
                $('#handsonContainer').css('left', '0px');
            } else if ($(this).hasClass('eljuzhong-bukexuan')) {//TableCenterAlignment
                var leftAmount = handsonTableHelperObjHelper.maxWidth - $('#handsonContainer').width();
                $('#handsonContainer').css('left', (leftAmount/2) + 'px');
            } else if ($(this).hasClass('elyouduiqi-bukexuan-copy')) {//TableRightAlignment
                var leftAmount = handsonTableHelperObjHelper.maxWidth - $('#handsonContainer').width();
                $('#handsonContainer').css('left', leftAmount + 'px');
            } else if ($(this).hasClass('elyouduiqi-bukexuan')) {//Top alignment
                $('#handsonContainer').css('top', '0px');
            } else if ($(this).hasClass('eljuzhong-copy')) {//Middle alignment
                var topAmount = handsonTableHelperObjHelper.maxHeight - $('#handsonContainer').height();
                $('#handsonContainer').css('top', (topAmount/2) + 'px');
            } else if ($(this).hasClass('elyouduiqi-bukexuan-copy-copy')) {//Bottom alignment
                var topAmount = handsonTableHelperObjHelper.maxHeight - $('#handsonContainer').height();
                $('#handsonContainer').css('top', topAmount + 'px');
            }
        });
    });
});

//move ids that end with alt to ids that end with altholder
/**
 * ControlCharts should have id named ControlChart + random number + altholder within the handsontable
 * cell initially, outside at the bottom of the page body, there's a div with an id of ControlChartHelper
 * This div contains divs of drawn ControlCharts, they have ids of ControlChart + (same random number as above)
 * + alt, this is because D3 requires time to draw each chart, which may complete after the handsontable updates
 * itself.
 * ToDo: Add on complete handlers for each D3 chart
 * The same is for TrendMaps, ParetoCharts, SigmaMaps, StackingMaps, PieCharts, and BoxLineCharts
 */
function moveChartsFromAltToAltHolder() {
    $('.spinner, #overlay').show();
    //setTimeout(function() {
        $('#ControlChartHelper div').each(function () {
            var id = $(this).attr('id');
            $(this).appendTo('#'+id+'holder');
            for (var i in handsonTableHelperObjControlCharts) {
                if (handsonTableHelperObjControlCharts[i] + 'alt' === id) {
                    var rowAndColArr = i.split(',');
                    if (document.getElementById(id+'holder') != null) {
                        var tempHandsonTableOptions = handsonTable.getSettings();
                        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = document.getElementById(id+'holder').outerHTML;
                        handsonTable.updateSettings(tempHandsonTableOptions);
                        break;
                    }
                }
            }
        });
        $('#BoxLineChartHelper div').each(function () {
            var id = $(this).attr('id');
            $(this).appendTo('#'+id+'holder');
            for (var i in handsonTableHelperObjBoxLineCharts) {
                if (handsonTableHelperObjBoxLineCharts[i] + 'alt' === id) {
                    var rowAndColArr = i.split(',');
                    if (document.getElementById(id+'holder') != null) {
                        var tempHandsonTableOptions = handsonTable.getSettings();
                        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = document.getElementById(id+'holder').outerHTML;
                        handsonTable.updateSettings(tempHandsonTableOptions);
                        break;
                    }
                }
            }
        });
        $('#ParetoChartHelper div').each(function () {
            var id = $(this).attr('id');
            $(this).appendTo('#'+id+'holder');
            for (var i in handsonTableHelperObjParetos) {
                if (handsonTableHelperObjParetos[i] + 'alt' === id) {
                    var rowAndColArr = i.split(',');
                    if (document.getElementById(id+'holder') != null) {
                        var tempHandsonTableOptions = handsonTable.getSettings();
                        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] =
                            document.getElementById(id+'holder').outerHTML;
                        handsonTable.updateSettings(tempHandsonTableOptions);
                        break;
                    }
                }
            }
        });
        $('#SigmaMapChartHelper div').each(function () {
            var id = $(this).attr('id');
            $(this).appendTo('#'+id+'holder');
            for (var i in handsonTableHelperObjSigmaMaps) {
                if (handsonTableHelperObjSigmaMaps[i] + 'alt' === id) {
                    var rowAndColArr = i.split(',');
                    if (document.getElementById(id+'holder') != null) {
                        var tempHandsonTableOptions = handsonTable.getSettings();
                        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = document.getElementById(id+'holder').outerHTML;
                        handsonTable.updateSettings(tempHandsonTableOptions);
                        break;
                    }
                }
            }
        });
        $('#PieChartHelper div').each(function () {
            var id = $(this).attr('id');
            $(this).appendTo('#'+id+'holder');
            for (var i in handsonTableHelperObjPieCharts) {
                if (handsonTableHelperObjPieCharts[i] + 'alt' === id) {
                    var rowAndColArr = i.split(',');
                    if (document.getElementById(id+'holder') != null) {
                        var tempHandsonTableOptions = handsonTable.getSettings();
                        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = document.getElementById(id+'holder').outerHTML;
                        handsonTable.updateSettings(tempHandsonTableOptions);
                        break;
                    }
                }
            }
        });
        $('#StackingMapChartHelper div').each(function () {
            var id = $(this).attr('id');
            $(this).appendTo('#'+id+'holder');
            for (var i in handsonTableHelperObjStackingMapCharts) {
                if (handsonTableHelperObjStackingMapCharts[i] + 'alt' === id) {
                    var rowAndColArr = i.split(',');
                    if (document.getElementById(id+'holder') != null) {
                        var tempHandsonTableOptions = handsonTable.getSettings();
                        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = document.getElementById(id+'holder').outerHTML;
                        handsonTable.updateSettings(tempHandsonTableOptions);
                        break;
                    }
                }
            }
        });
        $('#HistogramDiagramHelper div').each(function () {
            var id = $(this).attr('id');
            $(this).appendTo('#'+id+'holder');
            for (var i in handsonTableHelperObjHistograms) {
                if (handsonTableHelperObjHistograms[i] + 'alt' === id) {
                    var rowAndColArr = i.split(',');
                    if (document.getElementById(id+'holder') != null) {
                        var tempHandsonTableOptions = handsonTable.getSettings();
                        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = document.getElementById(id+'holder').outerHTML;
                        handsonTable.updateSettings(tempHandsonTableOptions);
                        break;
                    }
                }
            }
        });
        $('#TrendMapHelper div').each(function () {
            var id = $(this).attr('id');
            //$(this).appendTo('#'+id+'holder');
            $('#' + id + 'holder').html($(this).html());
            for (var i in handsonTableHelperObjTrendMaps) {
                if (handsonTableHelperObjTrendMaps[i] + 'alt' === id) {
                    var rowAndColArr = i.split(',');
                    if (document.getElementById(id+'holder') != null) {
                        var tempHandsonTableOptions = handsonTable.getSettings();
                        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = document.getElementById(id+'holder').outerHTML;
                        handsonTable.updateSettings(tempHandsonTableOptions);
                        break;
                    }
                }
            }
        });
        $('#TrendMapHelper').html('')
        setTimeout(function()
        {
            /*var wtHolder = $(handsonTable.table).parents('.wtHolder');
            var wtHider = $(handsonTable.table).parents('.wtHider');
            if (wtHolder.length > 0 && wtHider.length > 0) {
                $(wtHolder[0]).width(handsonTable.table.clientWidth);
                $(wtHolder[0]).height(handsonTable.table.clientHeight);
                $(wtHider[0]).width(handsonTable.table.clientWidth);
                $(wtHider[0]).height(handsonTable.table.clientHeight);
            }
            $("#handsonContainer").width(handsonTable.table.clientWidth);
            $("#handsonContainer").height(handsonTable.table.clientHeight);*/
            newStabilizer()
            $('.spinner, #overlay').hide();
            $('#TrendMapHelper, #ControlChartHelper, #BoxLineChartHelper, #SigmaMapChartHelper, '+
                '#PieChartHelper, #StackingMapChartHelper, #HistogramDiagramHelper, #ParetoChartHelper').hide();
        }, 300);
    //}, 1200);
}

//experimental, can get rid of this
/*function ControlChartTimeoutHelper(id, row, col) {
    setTimeout(function() {
        var tempHandsonTableOptions = handsonTable.getSettings();
        tempHandsonTableOptions.data[row][col] = document.getElementById(id).outerHTML;
        handsonTable.updateSettings(tempHandsonTableOptions);
    }, 1000);
}*/

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

function savePieChartSettings() {

}

function saveBoxLineChartSettings() {

}

function save6SigmaChartSettings() {

}

function saveStackingMapChartSettings() {

}

function saveColumnChartSettings() {

}