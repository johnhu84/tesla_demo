//07/17/2020
//added by: Chunlin Hu
//helper object for in point x, y and out point x, y that precalculates edge router in mxGraph
//to avoid overlapping of edges and shapes
var edgeRouterHelperArr = {}

function rewriteConvertValueToString(samples, points, arguments, pageFeatureIndex, width1, mHeight) {
    // Returns canvas with dynamic chart for vertex labels
    var graphConvertValueToString = graph.convertValueToString;
    graph.convertValueToString = function (cell) {
        if (this.model.isVertex(cell)) {

            if (cell.value != 'Hello') {
                return cell.value;
            }

            var featureDiv = document.createElement("div");

            if (pageFeatureIndex == 3 || pageFeatureIndex == 4) {
                //横着排放
                featureDiv.style.width = width1 * 3 + "px";
                featureDiv.style.height = mHeight + "px";
                featureDiv.style.margin = " 0 auto ";
            } else {
                featureDiv.style.height = (mHeight * 3) + "px";
            }

            for (var p = 0; p < points.length; p++) {

                var newDiv = document.createElement("div");

                if (pageFeatureIndex == 3 || pageFeatureIndex == 4) {
                    //横着排放
                    newDiv.style.width = width1 - 3 + "px";
                    newDiv.style.height = mHeight + "px";
                    newDiv.style.cssFloat = "right";
                    newDiv.style.borderRight = "1px solid black";

                } else {
                    newDiv.style.width = width1 + "px";
                    newDiv.style.height = mHeight + "px";
                    newDiv.style.borderBottom = "1px solid black";

                }

                //title
                var title = document.createElement("div");
                title.style.height = (mHeight * 0.1) + 'px';
                title.style.lineHeight = (mHeight * 0.1) + 'px';

                var fx = points[p].fx;

                if (fx == "2") {
                    fx = "X";
                } else if (fx == "3") {
                    fx = "Y";
                } else if (fx == "4") {
                    fx = "Z";
                }


                //测点
                var tspan1 = document.createElement("span");
                var newText = document.createTextNode(cell.id);
                tspan1.appendChild(newText);
                tspan1.style.color = "blue";
                tspan1.style.cssFloat = "left";
                tspan1.style.width = "50%";
                tspan1.style.padding = (mHeight * 0.1) / 2 + "px 0";
                tspan1.style.verticalAlign = "middle";
                tspan1.style.textAlign = "left";


                var fvc_value = (points[p].fvc_value);
                fvc_value = fvc_value == null ? 'NaN' : fvc_value.toFixed(2);

                //理论值
                var tspan2 = document.createElement("span");
                tspan2.innerHTML = "Nominal<br/>" + fx + ":" + fvc_value
                tspan2.style.cssFloat = "left";
                tspan2.style.width = "25%";
                tspan2.style.textAlign = "left";
                tspan2.style.borderLeft = "1px solid black";

                //最后一个偏差

                var pcs = points[p].pcs;

                var pc1 = 'NaN';

                if (pcs != null && pcs.length > 0) {
                    pc1 = pcs[0];

                    if (pc1 == null) {
                        pc1 = 'NaN';
                    } else {
                        pc1 = pc1.toFixed(2);
                    }
                }

                var tspan3 = document.createElement("span");
                var newText = document.createTextNode(pc1);
                tspan3.appendChild(newText);
                tspan3.style.backgroundColor = "green";
                tspan3.style.color = "black";
                tspan3.style.cssFloat = "right";
                tspan3.style.width = "20%";
                tspan3.style.padding = (mHeight * 0.1) / 2 + "px 0";
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
                table.style.height = (mHeight * 0.3) + "px";
                table.style.marginBottom = 0 + "px";
                table.className = 'chartTabel';


                // var arrColor = ["#f00","#ff0","lightgreen" ];



                var tol1 = points[p].tol1;
                var tol2 = points[p].tol2;

                var newPcs = [];
                for (var i = 0; i < pcs.length; i++) {

                    var val = pcs[i];
                    if (val == null) {
                        val = 0;
                    } else {
                        val = parseFloat(val.toFixed(2));
                    }
                    newPcs.push(val);
                }

                var sfArr = [];
                var arr = [['Mean', 'Range', 'CP', 'CPK', 'Sigma', 'TOL-', 'TOL+', 'Sample']];

                var range = (max(newPcs) - min(newPcs)).toFixed(2);

                var sum = function (x, y) { return x + y; };//求和函数
                var square = function (x) { return x * x; };//数组中每个元素求它的平方
                var mean = newPcs.reduce(sum) / newPcs.length;
                var deviations = newPcs.map(function (x) { return x - mean; });
                var stddev = Math.sqrt(deviations.map(square).reduce(sum) / (newPcs.length - 1));

                stddev = (Math.round(stddev * 100) / 100)

                // https://www.codetd.com/article/1895661

                var cp = (tol1 - tol2) / 6 * stddev;
                //console.log("cp  "+cp);

                var cpk = 0.0;

                var threeSigma = 3 * stddev;

                var num1 = (tol1 - mean) / threeSigma;
                var num2 = (mean - tol2) / threeSigma;

                if (num1 > num2) {
                    cpk = num2;
                } else {
                    cpk = num1;
                }

                sfArr[0] = mean.toFixed(2);
                sfArr[1] = range;
                sfArr[2] = cp.toFixed(2);
                sfArr[3] = cpk.toFixed(2);
                sfArr[4] = stddev.toFixed(2);
                sfArr[5] = tol2 == null ? 'NAN' : tol2;
                sfArr[6] = tol1 == null ? 'NAN' : tol1;
                sfArr[7] = 10;

                //console.log(sfArr);
                arr.push(sfArr);

                for (var i = 0; i < arr.length; i++) {
                    var tr = document.createElement("tr");
                    tr.style.height = (mHeight * 0.3) / 3 + "px";

                    var itemArr = arr[i];
                    for (var j = 0; j < itemArr.length; j++) {
                        td = document.createElement("td");

                        if (i == 1 && (j == 2 || j == 3)) {

                            var number = parseFloat(itemArr[j]);

                            var color = '';
                            if (number < 1) {
                                color = "#f00";

                            } else if (number > 1 && number < 1.33) {
                                color = "#ff0";
                            } else if (number > 1.33) {
                                color = "lightgreen";
                            }

                            // var index = Math.floor((Math.random()*arrColor.length));
                            td.style.backgroundColor = '' + color + '';
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

                var chart = new Chart(ctx, chartConfig(newPcs, newPcs, pointBackgroundColor1, tol1, tol2));

                chart.canvas.parentNode.style.height = (mHeight * 0.6) + 'px';
                chart.canvas.parentNode.style.width = width1 + 'px';

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

// 还原图表
function handleCustomCharts(handsonTable, handsonTableOptions, x1, y1, points, flabel, pointObj={}) {
    var parent = graph.getDefaultParent();
    var f_label = flabel;
    var x = pointObj.pointX;
    var y = pointObj.pointY;
    var _x1 = pointObj.posX;
    var _y1 = pointObj.posY;
    var handsonTableBorderStyle = '';

    var postData = {}
    var sampleIds = $("#iframe-" + rId)[0].contentWindow.getCheckSampleIds()//getCheckSampleIds()
    postData.fId = flabel
    postData.sampleIds = sampleIds

    var hTableHtml = [];

    $.ajax({
        url: "/dataset/getChartData",
        type: "POST",
        data: postData,
        datatype: "JSON",
        async: false,
        success: function (res) {

            var flabel = res.flabel.substring(res.flabel.lastIndexOf(',')+1)

            var idHelper = 0;
            for (var i in handsonTableHelperObjParetos) {
                console.log('paretos');

                var ids = handsonTableHelperObjParetos[i] + x1 + y1 + (idHelper++);
                console.log("handleCustomCharts -> ids", ids)
                if (document.getElementById(ids)) {
                    console.log("already has an id element: " + ids);
                    console.log(document.getElementById(ids));
                }
                var rowAndColArr = i.split(',');
                //拖拉拽缩放
                var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
                var heightHelper = heightAndWidthObj.height;//handsonTable.getRowHeight(rowAndColArr[0]);
                var widthHelper = heightAndWidthObj.width;//handsonTable.getColWidth(rowAndColArr[1]);
                var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
                heightHelper = heightHelper > 20 ? heightHelper - 15 : heightHelper;
                widthHelper = widthHelper > 20 ? widthHelper - 15 : widthHelper;
                var tempHandsonTableOptions = handsonTable.getSettings();
                //var paretoChartHtml = '<div class="" id="' + ids +
                //'altholder" style="width:' + widthHelper + 'px;height:' + heightHelper + 'px;margin:auto;pointer-events:all"></div>';
                var paretoSetting = handsonTableHelperObjParetoSettings[i];
                if (paretoSetting && typeof paretoSetting !== 'undefined') {
                    widthHelperFromSetting = Number(paretoSetting.miscWidth)
                    heightHelperFromSetting = Number(paretoSetting.miscHeight)
                    if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                        widthHelper = widthHelperFromSetting
                    }
                    if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                        heightHelper = heightHelperFromSetting
                    }
                }
                var paretoHtmlOb = createHandsonCellDivWithProps(ids + 'altholder', widthHelper, heightHelper, paretoSetting);
                tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = paretoHtmlOb.outerHTML;
                handsonTable.updateSettings(tempHandsonTableOptions);

                var obj = document.createElement('div');
                obj.id = ids + "alt";
                obj.style.cssText = 'width:' + widthHelper + 'px;height:' + heightHelper + 'px;margin:auto;';
                document.getElementById("ParetoDiagramHelper").appendChild(obj);

                var pareToSetting = handsonTableHelperObjParetoSettings[rowAndColObj.row + ',' + rowAndColObj.col];

                setPareToDiagram(ids + 'alt', res, rowAndColObj.row, rowAndColObj.col, widthHelper, heightHelper, pareToSetting)
            }

            idHelper = 0;
            for (var i in handsonTableHelperObjTrendMaps) {
                var rowAndColArr = i.split(',');
                var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
                var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
                var heightHelper = heightAndWidthObj.height;//handsonTable.getRowHeight(rowAndColArr[0]);
                var widthHelper = heightAndWidthObj.width;//handsonTable.getColWidth(rowAndColArr[1]);
                var trendMapSetting = handsonTableHelperObjTrendMapSettings[i];
                if (trendMapSetting && typeof trendMapSetting !== 'undefined') {
                    widthHelperFromSetting = Number(trendMapSetting.miscWidth)
                    heightHelperFromSetting = Number(trendMapSetting.miscHeight)
                    if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                        widthHelper = widthHelperFromSetting
                    }
                    if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                        heightHelper = heightHelperFromSetting
                    }
                }
                var trendMapHtmlOb = ''
                var fragment = document.createDocumentFragment();
                var tempHandsonTableOptions = handsonTable.getSettings();

                res.points.forEach(function (item, idx) {
                    console.log('trendMaps');
                    // 替换~mean~等指令值
                    checkReportTable2(handsonTable, {
                        '~range~': item.command.range.toFixed(2),
                        '~cp~': item.command.cp && typeof item.command.cp !== 'undefined' ?
                            item.command.cp.toFixed(2) : 0,
                        '~cpk~': item.command.cpk.toFixed(2),
                        '~mean~': item.command.mean.toFixed(2),
                        '~lt~': item.command.lowerDeviation.toFixed(2),
                        '~ut~': item.command.upperDeviation.toFixed(2),
                        '~distribution~': item.command.distribution,
                        '~CHR~': item.fx,
                        '~label~': flabel,
                        '~min~': item.command.min.toFixed(2),
                        '~max~': item.command.max.toFixed(2)
                    });

                    // 替换颜色
                    replaceTableCellBgColor(handsonTable, handsonTableOptions, item);

                    var ids = handsonTableHelperObjTrendMaps[i] + x1 + y1 + (idHelper++)+item.fx;
                    var idsAlt = ids + "alt";

                    if (typeof handsonTableHelperObjTrendMapsCache[ids] !== 'undefined') {
                        tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = handsonTableHelperObjTrendMapsCache[ids];
                    } else {
                        // 创建图表容器
                        var helperElm = document.getElementById("TrendMapDiagramHelper");
                        var obj = document.createElement('div');
                        obj.id = idsAlt;
                        obj.style.cssText = 'width:' + widthHelper + 'px;height:' + heightHelper + 'px;margin:auto;';
                        helperElm.appendChild(obj);

                        var trendMapSetting = handsonTableHelperObjTrendMapSettings[i];
                        var BigobjHelper = typeof trendMapSetting !== 'undefined' ? trendMapSetting : null;

                        globalObj.chartData[idsAlt] = res.points[idx]
                        globalObj.chartSetting = BigobjHelper

                        // 创建图表
                        setTrendMapAlt(idsAlt, res.points[idx], BigobjHelper, widthHelper, heightHelper)
                        var trendMapElm = document.getElementById(idsAlt);
                        // 删除helper中的节点
                        helperElm.removeChild(trendMapElm);

                        trendMapHtmlOb = createHandsonCellDivWithProps(ids + 'altholder', widthHelper, heightHelper, trendMapSetting);
                        trendMapHtmlOb.appendChild(trendMapElm);
                        // var tempHandsonTableOptions = handsonTable.getSettings();
                        // 更新表格
                        tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = trendMapHtmlOb.outerHTML;
                        handsonTable.updateSettings(tempHandsonTableOptions);
                        hTableHtml.push(handsonTable.table.outerHTML)

                    }
                })
            }

            idHelper = 0;
            for (var i in handsonTableHelperObjHistograms) {
                console.log('histograms');

                var ids = handsonTableHelperObjHistograms[i] + x1 + y1 + (idHelper++);
                var rowAndColArr = i.split(',');
                var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
                var heightHelper = heightAndWidthObj.height;
                var widthHelper = heightAndWidthObj.width;
                var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
                //var HistogramHtml = '<div class="" id="' + ids +
                //'altholder" style="height:' + heightHelper + 'px;width:' + widthHelper + 'px;overflow:hidden;"></div>'
                var tempHandsonTableOptions = handsonTable.getSettings();
                var histogramSetting = handsonTableHelperObjHistogramSettings[i];
                if (histogramSetting && typeof histogramSetting !== 'undefined') {
                    widthHelperFromSetting = Number(histogramSetting.miscWidth)
                    heightHelperFromSetting = Number(histogramSetting.miscHeight)
                    if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                        widthHelper = widthHelperFromSetting
                    }
                    if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                        heightHelper = heightHelperFromSetting
                    }
                }
                var histogramHtmlOb = createHandsonCellDivWithProps(ids + 'altholder', widthHelper, heightHelper, histogramSetting);
                tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = histogramHtmlOb.outerHTML;
                handsonTable.updateSettings(tempHandsonTableOptions);

                var obj = document.createElement('div');
                obj.id = ids + "alt";
                obj.style.cssText = 'width:' + widthHelper + 'px;height:' + heightHelper + 'px;margin:auto;';
                document.getElementById("HistogramDiagramHelper").appendChild(obj);
                var idsAlt = ids + "alt";

                var histogramSetting = handsonTableHelperObjHistogramSettings[rowAndColObj.row + ',' + rowAndColObj.col];
                var BigobjHelper = typeof histogramSetting !== 'undefined' ? histogramSetting : {};

                setHistogram(idsAlt, widthHelper, heightHelper, BigobjHelper, flabel, res)
            }

            idHelper = 0;
            for (var i in handsonTableHelperObjControlCharts) {
                console.log('controlCharts');

                var ids = handsonTableHelperObjControlCharts[i] + x1 + y1 + (idHelper++);
                var rowAndColArr = i.split(',');
                var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
                var heightHelper = heightAndWidthObj.height;
                var widthHelper = heightAndWidthObj.width;
                var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
                var ControlChartHtml = '<div class="" id="' + ids +
                    'altholder" style="height:' + heightHelper + 'px;width:' + widthHelper + 'px;overflow:hidden;"></div>'
                var tempHandsonTableOptions = handsonTable.getSettings();
                var controlChartSetting = handsonTableHelperObjControlChartSettings[i];
                if (controlChartSetting && typeof controlChartSetting !== 'undefined') {
                    widthHelperFromSetting = Number(controlChartSetting.miscWidth)
                    heightHelperFromSetting = Number(controlChartSetting.miscHeight)
                    if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                        widthHelper = widthHelperFromSetting
                    }
                    if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                        heightHelper = heightHelperFromSetting
                    }
                }

                var controlChartHtmlOb = createHandsonCellDivWithProps(ids + 'altholder', widthHelper, heightHelper, controlChartSetting);
                tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = controlChartHtmlOb.outerHTML;
                handsonTable.updateSettings(tempHandsonTableOptions);

                var obj = document.createElement('div');
                obj.id = ids + "alt";
                obj.style.cssText = 'width:' + widthHelper + 'px;height:' + heightHelper + 'px;margin:auto;';
                document.getElementById("ControlChartDiagramHelper").appendChild(obj);
                var idsAlt = ids + "alt";

                setControlChart(ids + 'alt', rowAndColArr[0], rowAndColArr[1], widthHelper, heightHelper, controlChartSetting, flabel, res)
            }

            idHelper = 0;
            for (var i in handsonTableHelperObjBoxLineCharts) {
                console.log('boxLineCharts');

                var ids = handsonTableHelperObjBoxLineCharts[i] + x1 + y1 + (idHelper++);
                var rowAndColArr = i.split(',');
                var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
                var heightHelper = heightAndWidthObj.height;
                var widthHelper = heightAndWidthObj.width;
                var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
                //var BoxLineChartHtml = '<div class="" id="' + ids +
                //'altholder" style="height:' + heightHelper + 'px;width:' + widthHelper + 'px;overflow:hidden;"></div>'
                var boxLineSetting = handsonTableHelperObjBoxLineChartSettings[i];
                if (boxLineSetting && typeof boxLineSetting !== 'undefined') {
                    widthHelperFromSetting = Number(boxLineSetting.miscWidth)
                    heightHelperFromSetting = Number(boxLineSetting.miscHeight)
                    if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                        widthHelper = widthHelperFromSetting
                    }
                    if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                        heightHelper = heightHelperFromSetting
                    }
                }
                var boxLineHtmlOb = createHandsonCellDivWithProps(ids + 'altholder', widthHelper, heightHelper, boxLineSetting);
                var tempHandsonTableOptions = handsonTable.getSettings();
                tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = boxLineHtmlOb.outerHTML;
                handsonTable.updateSettings(tempHandsonTableOptions);

                var obj = document.createElement('div');
                obj.id = ids + "alt";
                obj.style.cssText = 'width:' + widthHelper + 'px;height:' + heightHelper + 'px;margin:auto;';
                document.getElementById("BoxLineChartDiagramHelper").appendChild(obj);
                var idsAlt = ids + "alt";

                setBoxDiagram(idsAlt, res, rowAndColObj.row, rowAndColObj.col, widthHelper, heightHelper, boxLineSetting)
            }

            idHelper = 0;
            for (var i in handsonTableHelperObjSigmaMaps) {
                var ids = handsonTableHelperObjSigmaMaps[i] + x1 + y1 + (idHelper++);
                var rowAndColArr = i.split(',');
                var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
                var heightHelper = heightAndWidthObj.height;
                var widthHelper = heightAndWidthObj.width;
                var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
                //var SigmaMapHtml = '<div class="" id="' + ids +
                //'altholder" style="height:' + heightHelper + 'px;width:' + widthHelper + 'px;overflow:hidden;"></div>'
                var tempHandsonTableOptions = handsonTable.getSettings();
                var sigmaSetting = handsonTableHelperObjSigmaMapSettings[i];
                if (sigmaSetting && typeof sigmaSetting !== 'undefined') {
                    widthHelperFromSetting = Number(sigmaSetting.miscWidth)
                    heightHelperFromSetting = Number(sigmaSetting.miscHeight)
                    if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                        widthHelper = widthHelperFromSetting
                    }
                    if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                        heightHelper = heightHelperFromSetting
                    }
                }
                var sigmaHtmlOb = createHandsonCellDivWithProps(ids + 'altholder', widthHelper, heightHelper, sigmaSetting);
                tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = sigmaHtmlOb.outerHTML;
                handsonTable.updateSettings(tempHandsonTableOptions);

                var obj = document.createElement('div');
                obj.id = ids + "alt";
                obj.style.cssText = 'width:' + widthHelper + 'px;height:' + heightHelper + 'px;margin:auto;';
                document.getElementById("SigmaMapDiagramHelper").appendChild(obj);
                var idsAlt = ids + "alt";

                setSigmaChart(idsAlt, res, rowAndColObj.row, rowAndColObj.col, widthHelper, heightHelper, sigmaSetting)
            }

            idHelper = 0;
            for (var i in handsonTableHelperObjPieCharts) {
                console.log('pieCharts');

                var ids = handsonTableHelperObjPieCharts[i] + x1 + y1 + (idHelper++);
                var rowAndColArr = i.split(',');
                var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
                var heightHelper = heightAndWidthObj.height;
                var widthHelper = heightAndWidthObj.width;
                var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
                //var PieChartHtml = '<div class="" id="' + ids +
                //'altholder" style="height:' + heightHelper + 'px;width:' + widthHelper + 'px;overflow:hidden;"></div>'
                var pieChartSetting = handsonTableHelperObjPieChartSettings[i];
                if (pieChartSetting && typeof pieChartSetting !== 'undefined') {
                    widthHelperFromSetting = Number(pieChartSetting.miscWidth)
                    heightHelperFromSetting = Number(pieChartSetting.miscHeight)
                    if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                        widthHelper = widthHelperFromSetting
                    }
                    if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                        heightHelper = heightHelperFromSetting
                    }
                }
                var pieChartHtmlOb = createHandsonCellDivWithProps(ids + 'altholder', widthHelper, heightHelper, pieChartSetting);
                var tempHandsonTableOptions = handsonTable.getSettings();
                tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = pieChartHtmlOb.outerHTML;
                handsonTable.updateSettings(tempHandsonTableOptions);

                var obj = document.createElement('div');
                obj.id = ids + "alt";
                obj.style.cssText = 'width:' + widthHelper + 'px;height:' + heightHelper + 'px;margin:auto;';
                document.getElementById("PieChartDiagramHelper").appendChild(obj);
                var idsAlt = ids + "alt";

                setPieChart(idsAlt, res, rowAndColObj.row, rowAndColObj.col, widthHelper, heightHelper, pieChartSetting)
            }

            idHelper = 0;
            for (var i in handsonTableHelperObjStackingMapCharts) {
                console.log('stackingMapCharts');

                var ids = handsonTableHelperObjStackingMapCharts[i] + x1 + y1 + (idHelper++);
                var rowAndColArr = i.split(',');
                var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
                var heightHelper = heightAndWidthObj.height;
                var widthHelper = heightAndWidthObj.width;
                var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
                //var StackingMapChartHtml = '<div class="" id="' + ids +
                //'altholder" style="height:' + heightHelper + 'px;width:' + widthHelper + 'px;overflow:hidden;"></div>'
                var stackingSetting = handsonTableHelperObjStackingMapChartSettings[i];
                if (stackingSetting && typeof stackingSetting !== 'undefined') {
                    widthHelperFromSetting = Number(stackingSetting.miscWidth)
                    heightHelperFromSetting = Number(stackingSetting.miscHeight)
                    if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                        widthHelper = widthHelperFromSetting
                    }
                    if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                        heightHelper = heightHelperFromSetting
                    }
                }
                var stackingHtmlOb = createHandsonCellDivWithProps(ids + 'altholder', widthHelper, heightHelper, stackingSetting);
                var tempHandsonTableOptions = handsonTable.getSettings();
                tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = stackingHtmlOb.outerHTML;
                handsonTable.updateSettings(tempHandsonTableOptions);

                var obj = document.createElement('div');
                obj.id = ids + "alt";
                obj.style.cssText = 'width:' + widthHelper + 'px;height:' + heightHelper + 'px;margin:auto;';
                document.getElementById("StackingMapDiagramHelper").appendChild(obj);
                var idsAlt = ids + "alt";

                setStackingMapChart(idsAlt, res, rowAndColObj.row, rowAndColObj.col, widthHelper, heightHelper, stackingSetting)
            }

            for (var i in handsonTableHelperObjImgs) {
                var rowAndColArr = i.split(',');

                var heightWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
                var heightHelper = heightWidthObj.height;
                var widthHelper = heightWidthObj.width;
                var tempHandsonTableSettings = handsonTable.getSettings();
                var imgCell = $(handsonTable.table).find('.' + handsonTableHelperObjImgs[i]);
                //tempHandsonTableSettings.data[rowAndColArr[0]][rowAndColArr[1]]).find('img');
                if (imgCell && imgCell.length > 0) {
                    $(imgCell[0]).css('width', widthHelper + 'px');
                    $(imgCell[0]).css('height', heightHelper + 'px');
                    $(imgCell[0]).attr('width', widthHelper);
                    $(imgCell[0]).attr('height', heightHelper);
                    tempHandsonTableSettings.data[rowAndColArr[0]][rowAndColArr[1]] = $(imgCell[0])[0].outerHTML;
                    handsonTable.updateSettings(tempHandsonTableSettings);
                }
            }


            // 添加到svg
            try {
                graph.getModel().beginUpdate();

                var v1ValueTest = '_x1 (rect): ' + _x1 + ', _y1 (rect): ' + _y1 +
                ', x: ' + x + ', y: ' + y;
                var v1Value = ''
                var len = res.points.length;
                var tableMargin = '';

                //for testing
                //var _temp = 'margin-right: '+globalObj.spacing.chartSpacingLeftRight+'px;';
                /*v1Value += "<div class='svg-table' " +
                    "style='margin-top:20px;display:inline-block;border: " + handsonTableBorderStyle +
                    ";background-color: #fff;" + _temp +"'>" + v1ValueTest + "</div>"*/

                res.points.forEach(function (item, i) {
                    // 最后一个table不需要间隔
                    // var _temp = i < len - 1 ? tableMargin : '';
                    var _temp = 'margin-right: '+globalObj.spacing.chartSpacingLeftRight+'px;';
                    v1Value += "<div class='svg-table' data-dir='" + item.fx + "' " +
                        "style='display:inline-block;border: " + handsonTableBorderStyle +
                        ";background-color: #fff;" + _temp +"'>" + hTableHtml[i] + "</div>"
                });

                var v1 = graph.insertVertex(parent, f_label, v1Value, _x1, _y1, globalObj.tableLocation.width, globalObj.tableLocation.height, 'text;html=1;overflow=fill;fillColor=none;');
                //existingVertices is for the functionality "应用到“
                globalObj.existingVertices.push(v1);

                // canvas测点坐标
                var v2 = graph.insertVertex(parent, f_label + "point2", '', x, y, 0, 0, 'overflow=fill;fillColor=none;fontColor=#000000;');
                // 连线
                var e1 = graph.insertEdge(parent, f_label + "point3", '', v1, v2,
                    "shape=link;")

                globalObj.cache[globalObjIndex].edge = e1;
                globalObj.cache[globalObjIndex].v1 = v1;
                globalObj.cache[globalObjIndex].v2 = v2;
            } finally {
                graph.getModel().endUpdate();
            }


        },
        error: function (msg) {
            alert("msg");
        }
    });

}

function getMergedCellHeightAndWidth(row, col) {
    var retObj = { height: 20, width: 20 };
    if (typeof handsonTable === 'undefined') {
        return retObj;
    }
    retObj.height = handsonTable.getRowHeight(row);
    retObj.width = handsonTable.getColWidth(col);
    var tempHandsonTableSettings = handsonTable.getSettings();
    for (var i = 0; i < tempHandsonTableSettings.mergeCells.length; i++) {
        if (isPartOfMergeCell(row, col, tempHandsonTableSettings.mergeCells[i])) {
            //is part of this merge cell
            var mergeCellDimensions = getMergeCellWidthAndHeight(tempHandsonTableSettings.mergeCells[i]);
            return mergeCellDimensions;
        }
    }
    return retObj;
}

function getMergeCellWidthAndHeight(mergeCell) {
    var retObj = { height: 20, width: 20 };
    if (typeof handsonTable === 'undefined') {
        return retObj;
    }

    var heightSoFar = 0;
    var widthSoFar = 0;
    for (var i = mergeCell.row; i < (mergeCell.row + mergeCell.rowspan); i++) {
        heightSoFar += handsonTable.getRowHeight(i);
    }

    for (var i = mergeCell.col; i < (mergeCell.col + mergeCell.colspan); i++) {
        widthSoFar += handsonTable.getColWidth(i);
    }

    retObj.height = heightSoFar;
    retObj.width = widthSoFar;
    return retObj;
}

function isPartOfMergeCell(row, col, mergeCell) {
    //check if row is outside row to (row + (rowspan - 1))
    if (row < mergeCell.row || row > (mergeCell.row + (mergeCell.rowspan - 1))) {
        return false;
    }

    //check if col is outside col to (col + (colspan - 1))
    if (col < mergeCell.col || col > (mergeCell.col + (mergeCell.colspan - 1))) {
        return false;
    }

    //must be parge of merge cell, return true
    return true;
}

function getMergedCellRowAndCol(row, col) {
    var retObj = { row: row, col: col };
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

/**
 * 替换指令值
 * @author nikoohp
 * @param {Object} handsonTable 表格对象
 * @param {Object} points 指令值
 * @returns
 */
function checkReportTable2(handsonTable, points) {
    var numOfRows = handsonTable.countRows();
    var numOfCols = handsonTable.countCols();
    var tempHandsonTableOptions = handsonTable.getSettings();
    for (var i = 0; i < numOfRows; i++) {
        for (var j = 0; j < numOfCols; j++) {
            // 表格对象单元格数据
            var cellOptionData = handsonTableOptionsData[i][j];

            if (!cellOptionData) continue;

            // 匹配指令
            var reg = /(~mean~)|(~range~)|(~cpk~)|(~cp~)|(~lt~)|(~ut~)|(~label~)|(~CHR~)|(~distribution~)|(~min~)|(~max~)/g
            var result = cellOptionData.match(reg) || [];
            var tmpstr = cellOptionData;
            result.forEach(function(item) {
                tmpstr = tmpstr.replace(item, points[item]);
            })
            tempHandsonTableOptions.data[i][j] = tmpstr
            // handsonTable.updateSettings(tempHandsonTableOptions);

        }
    }
}

/**
 * 指令单元格背景色
 * @author nikoohp
 * @param {Object} handsonTable 表格对象
 * @param {Object} point 测点数据
 * @returns
 */
function replaceTableCellBgColor(handsonTable, handsonTableOptions, point) {
    if (!handsonTableHelperObj) return;

    var commandsMap = {
        "mean": 'mean',
        "range": 'range',
        "cpk": 'cpk',
        "cp": 'cp',
        "lt": 'lowerDeviation',
        "ut": 'upperDeviation',
        "distribution": 'distribution'
    };


    for (var key in handsonTableHelperObj) {
        if (key.indexOf(',') === -1) continue;

        var tableSetting = handsonTableHelperObj[key];

        if (!tableSetting || typeof tableSetting !==  'object') continue;

        var bgColor = tableSetting.bgColor;
        var rules = tableSetting.rules;

        if (!rules.length) continue;

        var cellProperties = rules[0].cellProperties;
        var prevProterty = '';

        var row = key.split(',')[0];
        var col = key.split(',')[1];
        var cellBgColor = '#fff';
        var handsonTdVal = handsonTable.getSettings().data[row][col];
        var rowHeight = handsonTable.getRowHeight(row);

        cellProperties.forEach(function(item) {
            // 接口返回的值
            var _cellVal = point.command[commandsMap[item.cellProperties]];

            cellBgColor = '#fff';

            switch (item.RangeSymbol) {
                case "greaterThan":
                    if (_cellVal > item.RangeNumber) {
                        cellBgColor = item.bgColor;
                    }
                    break;
                case "lessThan":
                    if (_cellVal < item.RangeNumber) {
                        cellBgColor = item.bgColor;
                    }
                    break;
                case "beEqualTo":
                    if (_cellVal === item.RangeNumber) {
                        cellBgColor = item.bgColor;
                    }
                    break;
                default:
                    break;
            }
        });
        handsonTableOptions.data[row][col] = "<div style='background-color:" + cellBgColor + ";line-height:" + rowHeight + "px;'>" + handsonTdVal + "</div>";


        // satisfiesCondition2(rules, handsonTdVal, points, row, col, bgColor, handsonTable, _tempHandsonTableOptions);
    }
}

function satisfiesCondition2(conditionalObjs, handsonTdVal, points, row, col, bgColor,handsonTable, handsonTableOptions) {
    console.log("col", col)
    console.log("row", row)
    //var command = $('#command').val();
    var satisfied = {
        result: true,
        bgColor: '#FFF'
    };
    if (!handsonTdVal || typeof handsonTdVal === 'undefined') return satisfied;

    for (var i = 0; i < conditionalObjs[0].cellProperties.length; i++) {
        var property = conditionalObjs[0].cellProperties[i]

        var rowHeightHelper = handsonTable.getRowHeight(row);
        var colWidthHelper = handsonTable.getColWidth(col);
        bgColor = property.bgColor;
        satisfied.bgColor = bgColor;


        switch (property.cellProperties) {
            case "all":
                if (!satisfiesConditionHelper(property, handsonTdVal)) {
                    return false;
                } else {
                    var rowHeightHelper = handsonTable.getRowHeight(row);
                    var colWidthHelper = handsonTable.getColWidth(col);
                    bgColor = property.bgColor;
                    satisfied.bgColor = bgColor;
                    handsonTableOptions.data[row][col] = "<div style='background-color:" + bgColor + ";'>" + cpkValueToChangeTo + "</div>";
                }
                break;
            case "cpk":
                console.log('============');
                // handsonTable.setCellMeta(row, col, 'className', 'testClsName')
                var _cell = handsonTable.getCell(row, col);
                console.log("_cell", _cell.outerHTML)
                $(_cell).css('background-color', 'red')

                var cpkValueToChangeTo = handsonTdVal.replace(/~cpk~/g, points['~cpk~']);
                if (handsonTdVal.indexOf('~cpk~') >= 0 && !satisfiesConditionHelper(
                    property, points['~cpk~'])) {
                    handsonTableOptions.data[row][col] = "<div style='width:" + colWidthHelper + "px;'>" + cpkValueToChangeTo + "</div>";
                    // handsonTable.updateSettings(handsonTableOptions);
                    return false;
                } else {
                    bgColor = property.bgColor;
                    var rowHeightHelper = handsonTable.getRowHeight(row);
                    var colWidthHelper = handsonTable.getColWidth(col);
                    // handsonTableOptions.data[row][col] = "<div style='background-color:" + bgColor + ";'>" + cpkValueToChangeTo + "</div>";
                    handsonTable.setCellMeta(row, col, 'className', 'testClsName')
                    // handsonTable.updateSettings(handsonTableOptions);
                    satisfied.bgColor = bgColor;
                }
                break;
            case "mean":
                /*if (command !== 'mean' && command !== 'all') {
                    return false;
                }*/
                var meanValueToChangeTo = handsonTdVal.replace(/~mean~/g, points['~mean~']);
                console.log("debug helper, line 1300 of my2.js, handsonTdVal = " + handsonTdVal +
                    ", meanValueToChangeTo: " + meanValueToChangeTo);
                if (handsonTdVal.indexOf('~mean~') >= 0 && !satisfiesConditionHelper(
                    property, points['~mean~'])) {
                    handsonTableOptions.data[row][col] = "<div style='width:" + colWidthHelper + "px;'>" + meanValueToChangeTo + "</div>";
                    // handsonTable.updateSettings(handsonTableOptions);
                    satisfied.bgColor = bgColor;
                    return satisfied;
                } else {
                    var rowHeightHelper = handsonTable.getRowHeight(row);
                    var colWidthHelper = handsonTable.getColWidth(col);
                    bgColor = property.bgColor;
                    handsonTableOptions.data[row][col] = "<div style='background-color:" + bgColor + ";'>" + meanValueToChangeTo + "</div>";
                    // handsonTable.updateSettings(handsonTableOptions);
                    satisfied.bgColor = bgColor;
                    return satisfied;
                }
                break;
            case "cp":
                var cpValueToChangeTo = handsonTdVal.replace(/~cp~/g, points['~cp~']);
                if (handsonTdVal.indexOf('~cp~') >= 0 && !satisfiesConditionHelper(property, points['~cp~'])) {
                    handsonTableOptions.data[row][col] = "<div style='width:" + colWidthHelper + "px;'>" + cpValueToChangeTo + "</div>";
                    // handsonTable.updateSettings(handsonTableOptions);
                    return satisfied;
                } else {
                    var rowHeightHelper = handsonTable.getRowHeight(row);
                    var colWidthHelper = handsonTable.getColWidth(col);
                    bgColor = property.bgColor;
                    // handsonTableOptions.data[row][col] = "<div style='background-color:" + bgColor + ";'>" + cpValueToChangeTo + "</div>";
                    handsonTable.setCellMetaObject(row, col, {
                        'style': '"background-color":'+bgColor
                    })
                    // handsonTable.updateSettings(handsonTableOptions);
                    satisfied.bgColor = bgColor;
                }
                break;
            case "range":
                var RangeValueToChangeTo = handsonTdVal.replace(/~Range~/g, points['~Range~']);
                if (handsonTdVal.indexOf('~Range~') >= 0 && !satisfiesConditionHelper(property, points['~Range~'])) {
                    handsonTableOptions.data[row][col] = "<div style='width:" + colWidthHelper + "px;'>" + RangeValueToChangeTo + "</div>";
                    // handsonTable.updateSettings(handsonTableOptions);
                    return satisfied;
                } else {
                    var rowHeightHelper = handsonTable.getRowHeight(row);
                    var colWidthHelper = handsonTable.getColWidth(col);
                    bgColor = property.bgColor;
                    handsonTableOptions.data[row][col] = "<div style='background-color:" + bgColor + ";'>" + RangeValueToChangeTo + "</div>";
                    // handsonTable.updateSettings(handsonTableOptions);
                    satisfied.bgColor = bgColor;
                }
                break;
            default:
                break;
        }
    }


    // handsonTable.updateSettings({
    //     cells: function (_row, _col) {
    //         if (_row !== row && _col !== col) return;
    //         var cell = handsonTable.getCell(row, col);   // get the cell for the row and column
    //         console.log('================');
    //         console.log("cell", cell)
    //         console.log('================');
    //         if (cell) {
    //             cell.style.backgroundColor = satisfied.bgColor;  // set the background color
    //         }
    //     }
    // });
    handsonTable.updateSettings(handsonTableOptions)

    return satisfied;
}

function satisfiesConditionHelper(conditionalObj, handsonTdVal) {
    var satisfied = false;
    switch (conditionalObj.RangeSymbol) {
        case "greaterThan":
            if (handsonTdVal > conditionalObj.RangeNumber)
                return true;
            break;
        case "lessThan":
            if (handsonTdVal < conditionalObj.RangeNumber)
                return true;
            break;
        case "beEqualTo":
            if (handsonTdVal == conditionalObj.RangeNumber)
                return true;
            break;
        default:
            break;
    }
    return satisfied;
}

function modifyHandsonTable(handsonTable, handsonTableOptions, id) {
    var rowHelper = 0;
    $(handsonTable.table).find('tr').each(function () {
        var colHelper = 0;
        $(this).find('td').each(function () {
            for (var i = 0; i < handsonTableOptions.mergeCells.length; i++) {
                if (rowHelper == handsonTableOptions.mergeCells[i].row &&
                    colHelper == handsonTableOptions.mergeCells[i].col) {
                    $(this).attr('rowspan', handsonTableOptions.mergeCells[i].rowspan);
                    $(this).attr('colspan', handsonTableOptions.mergeCells[i].colspan);
                }

            }
            colHelper++;
        });
        rowHelper++;
    });
    rowHelper = 0;
    $('#' + id + ' .htCore tr').each(function () {
        var colHelper = 0;
        $(this).find('td').each(function () {
            for (var i = 0; i < handsonTableOptions.mergeCells.length; i++) {
                if (rowHelper == handsonTableOptions.mergeCells[i].row &&
                    colHelper == handsonTableOptions.mergeCells[i].col) {
                    $(this).attr('rowspan', handsonTableOptions.mergeCells[i].rowspan);
                    $(this).attr('colspan', handsonTableOptions.mergeCells[i].colspan);
                }

            }
            colHelper++;
        });
        rowHelper++;
    });
    rowHelper = 0;
    $(handsonTable.table).find('tr').each(function () {
        var colHelper = 0;
        var colToDel = [];
        for (var i = 0; i < handsonTable.countCols(); i++) {
            //check if this row and col is a part of one of the 8 charts, if it is, continue
            if (typeof handsonTableHelperObjTrendMapSettings[rowHelper + ',' + colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjParetoSettings[rowHelper + ',' + colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjControlChartSettings[rowHelper + ',' + colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjSigmaMapSettings[rowHelper + ',' + colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjBoxLineChartSettings[rowHelper + ',' + colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjHistogramSettings[rowHelper + ',' + colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjPieChartSettings[rowHelper + ',' + colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjStackingMapChartSettings[rowHelper + ',' + colHelper] !== 'undefined'
            ) {
                continue;
            }
            var isPartOfMergeCell = false;
            var isRowSpanColSpanDefiner = false;
            for (var j = 0; j < handsonTableOptions.mergeCells.length; j++) {
                if (rowHelper >= handsonTableOptions.mergeCells[j].row &&
                    rowHelper < handsonTableOptions.mergeCells[j].row + handsonTableOptions.mergeCells[j].rowspan
                    && colHelper >= handsonTableOptions.mergeCells[j].col
                    && colHelper < handsonTableOptions.mergeCells[j].col + handsonTableOptions.mergeCells[j].colspan) {
                    isPartOfMergeCell = true;
                }
                isRowSpanColSpanDefiner = rowHelper == handsonTableOptions.mergeCells[j].row &&
                    colHelper == handsonTableOptions.mergeCells[j].col;
            }
            var childHelper = $(this).find('td:nth-child(' + (colHelper + 1) + ')');
            var h = $(childHelper).html();
            var extractedStyle = extractDataCellStyleFromOriginalHandsonTable(rowHelper, colHelper);
            if (!isPartOfMergeCell) {
                colWidth = handsonTable.getColWidth(colHelper);
                if ($(childHelper).width() !== colWidth) {
                    var h2 = "<div style='width:" + colWidth + "px;" + extractedStyle + "'>" + $(childHelper).html() + "</div>";
                    $(childHelper).html(h2);
                }
                colHelper++;
            } else if (isRowSpanColSpanDefiner) {
                var mergedCellDimensionHelper = getMergedCellHeightAndWidth(rowHelper, colHelper);
                colWidth = mergedCellDimensionHelper.width;
                if ($(childHelper).width() !== colWidth) {
                    var h2 = "<div style='width:1px;" + extractedStyle + "'>" + $(childHelper).html() + "</div>";
                    $(childHelper).html(h2);
                }
                colHelper++;
            } else if (h !== '') {
                colWidth = handsonTable.getColWidth(colHelper);
                var h2 = "<div style='width:" + colWidth + "px;" + extractedStyle + "'>" + h + "</div>";
                $(childHelper).html(h2);
                colHelper++;
            } else {
                colToDel.push(colHelper);
                colHelper++;
            }
        }
        var removed = 0;
        for (var i = 0; i < colToDel.length; i++) {
            var childHelper = $(this).find('td:nth-child(' + (colToDel[i] - (removed++) + 1) + ')');
            $(childHelper).remove();
        }
        rowHelper++;
    });
}

function modifyHandsonTableForShowReport(handsonTable, handsonTableOptions, id) {
    var rowHelper = 0;
    $(handsonTable.table).find('tr').each(function () {
        var colHelper = 0;
        $(this).find('td').each(function () {
            for (var i = 0; i < handsonTableOptions.mergeCells.length; i++) {
                if (rowHelper == handsonTableOptions.mergeCells[i].row &&
                    colHelper == handsonTableOptions.mergeCells[i].col) {
                    $(this).attr('rowspan', handsonTableOptions.mergeCells[i].rowspan);
                    $(this).attr('colspan', handsonTableOptions.mergeCells[i].colspan);
                }

            }
            colHelper++;
        });
        rowHelper++;
    });
    rowHelper = 0;
    $('#' + id + ' .htCore tr').each(function () {
        var colHelper = 0;
        $(this).find('td').each(function () {
            for (var i = 0; i < handsonTableOptions.mergeCells.length; i++) {
                if (rowHelper == handsonTableOptions.mergeCells[i].row &&
                    colHelper == handsonTableOptions.mergeCells[i].col) {
                    $(this).attr('rowspan', handsonTableOptions.mergeCells[i].rowspan);
                    $(this).attr('colspan', handsonTableOptions.mergeCells[i].colspan);
                }

            }
            colHelper++;
        });
        rowHelper++;
    });
    rowHelper = 0;
    $(handsonTable.table).find('tr').each(function () {
        var colHelper = 0;
        var colToDel = [];
        for (var i = 0; i < handsonTable.countCols(); i++) {
            //check if this row and col is a part of one of the 8 charts, if it is, continue
            if (typeof handsonTableHelperObjTrendMapSettings[rowHelper + ',' + colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjParetoSettings[rowHelper + ',' + colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjControlChartSettings[rowHelper + ',' + colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjSigmaMapSettings[rowHelper + ',' + colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjBoxLineChartSettings[rowHelper + ',' + colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjHistogramSettings[rowHelper + ',' + colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjPieChartSettings[rowHelper + ',' + colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjStackingMapChartSettings[rowHelper + ',' + colHelper] !== 'undefined'
            ) {
                continue;
            }
            var isPartOfMergeCell = false;
            var isRowSpanColSpanDefiner = false;
            for (var j = 0; j < handsonTableOptions.mergeCells.length; j++) {
                if (rowHelper >= handsonTableOptions.mergeCells[j].row &&
                    rowHelper < handsonTableOptions.mergeCells[j].row + handsonTableOptions.mergeCells[j].rowspan
                    && colHelper >= handsonTableOptions.mergeCells[j].col
                    && colHelper < handsonTableOptions.mergeCells[j].col + handsonTableOptions.mergeCells[j].colspan) {
                    isPartOfMergeCell = true;
                }
                isRowSpanColSpanDefiner = rowHelper == handsonTableOptions.mergeCells[j].row &&
                    colHelper == handsonTableOptions.mergeCells[j].col;
            }
            var extractedStyle = extractDataCellStyleFromOriginalHandsonTable(rowHelper, colHelper);
            var childHelper = $(this).find('td:nth-child(' + (colHelper + 1) + ')');
            var h = $(childHelper).html();
            if (!isPartOfMergeCell) {
                colWidth = handsonTable.getColWidth(colHelper);
                if ($(childHelper).width() !== colWidth) {
                    var h2 = "<div style='width:" + colWidth + "px;" +
                        extractedStyle + "'>" + $(childHelper).html() + "</div>";
                    $(childHelper).html(h2);
                }
                colHelper++;
            } else if (isRowSpanColSpanDefiner) {
                var mergedCellDimensionHelper = getMergedCellHeightAndWidth(rowHelper, colHelper);
                colWidth = mergedCellDimensionHelper.width;
                if ($(childHelper).width() !== colWidth) {
                    var h2 = "<div style='width:1px;" + extractedStyle + "'>" + $(childHelper).html() + "</div>";
                    $(childHelper).html(h2);
                }
                colHelper++;
            } else if (h !== '') {
                colWidth = handsonTable.getColWidth(colHelper);
                var h2 = "<div style='width:" + colWidth + "px;" + extractedStyle + "'>" + h + "</div>";
                $(childHelper).html(h2);
                colHelper++;
            } else {
                colToDel.push(colHelper);
                colHelper++;
            }
        }
        var removed = 0;
        for (var i = 0; i < colToDel.length; i++) {
            var childHelper = $(this).find('td:nth-child(' + (colToDel[i] - (removed++) + 1) + ')');
            $(childHelper).remove();
        }
        rowHelper++;
    });
}

function preShowReport() {
    getSpecialPointsLocation(function (arr) {
        specialPointsArr = arr
    })
}

$(document).ready(function () {
    preShowReport()
})

function showReport() {
    getSpecialPointsLocation(function (arr) {
        specialPointsArr = arr
        // showReport2()
        showReport3()
    })
}

function showReport2() {
    $('.spinner, #overlay').show();
    $('#ParetoDiagramHelper, #TrendMapDiagramHelper, #ControlChartDiagramHelper, ' +
        '#SigmaMapDiagramHelper, #BoxLineChartDiagramHelper, #StackingMapDiagramHelper, ' +
        '#PieChartDiagramHelper, #HistogramDiagramHelper').show();//css('display', 'block');
    $('#testContainer').show();
    // $('#chartHelperContainer').show()
    //use currentReportPage
    currentReportPage = $('#boxs').prop('selectedIndex')//val()
    handsonTableHelperObjTrendMapsCache = {};
    globalObj.existingVertices = [];
    if (typeof globalObj.twoPoints !== 'undefined') {

        globalObj.twoPoints.vertex1 = null;
        globalObj.twoPoints.vertex2 = null;
        globalObj.twoPoints.vertex3 = null;
        globalObj.twoPoints.vertex4 = null;
        globalObj.twoPoints.line = null;
    }
    var vv1 = parseInt($("#boxs").find("option:selected").val()) + 1
    if (typeof globalObj.twoPoints !== 'undefined') {
        if (globalObj.twoPoints.point1 && typeof globalObj.twoPoints.point1 !== 'undefined') {
            globalObj.twoPoints.point1.material.color.setHex(0xff0000);
            globalObj.twoPoints.point1.material.needsUpdate = true;
            globalObj.twoPoints.point1 = null;
        }
        if (globalObj.twoPoints.point2 && typeof globalObj.twoPoints.point2 !== 'undefined') {
            globalObj.twoPoints.point2.material.color.setHex(0xff0000);
            globalObj.twoPoints.point2.material.needsUpdate = true;
            globalObj.twoPoints.point2 = null;
        }
        scene.remove(globalObj.twoPoints.line);
        globalObj.twoPoints.enabled = false;

        document.getElementById('toggleTwoPointsBtn').style.backgroundColor = '#dddddd';
    }

    //删除所有
    graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
    if (typeof globalObj.cache !== 'undefined') {
        for (var i in globalObj.cache) {
            graph.removeCells([globalObj.cache[i].edge, globalObj.cache[i].v1, globalObj.cache[i].v2]);
        }
    }

    var value = $("#boxs").find("option:selected").attr("zdy")
    if (typeof value === 'undefined') {
        $('.spinner, #overlay').hide();
        return false;
    }

    // 获取当前页的视口与设置
    $.ajax({
        url: '/report/loadModelView',
        type: 'get',
        dataType: 'json',
        data: {
            routineId: rId,
            reportId: reportId,
            page: $("#boxs").find("option:selected").index()
        },
        success:function (res) {
            if (!res || !res.data) return;
            var _target = [+res.data.targetX, +res.data.targetY, +res.data.targetZ];
            var _eyePos = [+res.data.eyePosX, +res.data.eyePosY, +res.data.eyePosZ];
            var _up = [+res.data.upX, +res.data.upY, +res.data.upZ];
            globalObj.navigatorView = {
                _target: _target,
                _eyePos: _eyePos,
                _up: _up
            }
            // 设置视图
            navigatorViewReverse(_target, _eyePos, _up);
            //
        }
    });

    // 要显示的点的数据
    var list = JSON.parse(value);
    console.log("list", list)

    var tmpPoint = []
    var tmpPoint2 = []
    var tmpPoint3 = []

    var x2 = [0];
    var y2 = [0];

    var width1 = $('#graphContainer').width();
    var height1 = $('#graphContainer').height();

    //@TODO 默认 -2 为了对应点位置
    //var autoWith= parseInt( $('#container').css('marginLeft'))-2;
    var containerElm = document.getElementById('container');
    var graphContainerElm = document.getElementById('graphContainer');

    var topDiff3 = containerElm.offsetTop - graphContainerElm.offsetTop;
    var leftDiff3 = containerElm.offsetLeft - graphContainerElm.offsetLeft;

    for (var i = 0; i < list.length; i++) {

        var onePoints = list[i];
        var coordinate = onePoints.coordinate
        var flabel = onePoints.flabel
        var xyz = typeof coordinate === 'undefined' ? [0, 0, 0] : coordinate.split(",");
        // 计算该点的二维坐标
        var tmp;
        if (globalObj.multiplyScalar && typeof globalObj.multiplyScalar !== 'undefined') {
            tmp = new THREE.Vector3(parseInt(xyz[0]) + globalObj.multiplyScalar.z * 1000, parseInt(xyz[1]) + globalObj.multiplyScalar.x * 1000,
                parseInt(xyz[2]) + globalObj.multiplyScalar.y * 1000);
        } else {
            tmp = new THREE.Vector3(parseInt(xyz[0]), parseInt(xyz[1]), parseInt(xyz[2]));
        }
        var applyMatrix4 = new THREE.Vector3(tmp.y / 1000, tmp.z / 1000, tmp.x / 1000);
        tmpPoint.push(applyMatrix4.clone());
        tmpPoint2.push(flabel)
        tmpPoint3.push(onePoints)
    }
    var retArr = loadPoint(2, tmpPoint, tmpPoint2, tmpPoint3)
    console.log("around line 1433, retArr is ", retArr);

    setTimeout(function () {
        var x2 = [0];
        var y2 = [0];
        var z2 = [{}]; //holds that onePoints information
        var duplicateCacheChecker = {};

        var _cameraManager = new THREE._CameraManager();

        retArr.forEach(function (vertex) {
            // 显示标签对应的测点
            vertex.visible = true;
            vertex.scale.set(3, 3, 3);
            var vertexPosition = [vertex.position.x, vertex.position.y, vertex.position.z]
            var accuratePos2 = _cameraManager._convertWorldPositionToScreenCoord(window._camera, vertexPosition, window._canvasWidth, window._canvasHeight);
            var accuratePos = getAccurateScreenPosition2(vertex);
            var msgPos = { x: accuratePos2[0] + leftDiff3, y: accuratePos2[1] + topDiff3 };
            if (typeof duplicateCacheChecker[msgPos.x + ',' + msgPos.y] === 'undefined') {
                duplicateCacheChecker[msgPos.x + ',' + msgPos.y] = true;
                x2.push(msgPos.x);
                y2.push(msgPos.y);
                z2.push(vertex.onePoints);
            }
        });

        globalObj.pointsHelper = retArr;
        var containerRect = containerElm.getBoundingClientRect();
        var graphContainerRect = graphContainerElm.getBoundingClientRect();
        var marginWidth = containerRect.left - graphContainerRect.left;
        //parseInt( $('#container').offset().left - $('#graphContainer').offset().left );

        globalObj.pointsHelper = retArr;

        var x1 = [0];
        var y1 = [0];
        var labelWidth = typeof handsonTableOptionsOriginal !== 'undefined' ? handsonTableOptionsOriginal.width : 100;
        var labelHeight = typeof handsonTableOptionsOriginal !== 'undefined' ? handsonTableOptionsOriginal.height : 70;

        var positions = labelPositionOptimizerUsingArea2(labelWidth, labelHeight, x2.length, x1, y1);

        //以为I need this, but can probably refactor delete it later (胡春麟， 7月4号2020年)
        if (x1.length > x2.length) {
            while (x1.length > x2.length) {
                x1.pop();
                y1.pop();
            }
        } else if (x1.length !== x2.length) {
            $('.spinner, #overlay').hide();
            return false;
        }
        //change here
        //求内点外点不交叉的线
        jQuery.ajax({
            url: ctx + '/report/line',
            type: 'post',
            data: {
                'x1': x1,
                'y1': y1,
                'x2': x2,
                'y2': y2
            },
            error: function (msg) {
                alert("error");
            },
            success: function (msg) {

                //msg  = JSON.parse(msg);
                //clear object that caches four lines
                globalObj.cache = [];
                graph.removeCells(graph.getChildVertices(graph.getDefaultParent()))
                if (typeof globalObj.cache !== 'undefined') {
                    for (var i in globalObj.cache) {
                        graph.removeCells([globalObj.cache[i].edge, globalObj.cache[i].v1, globalObj.cache[i].v2]);
                    }
                }
                var checker = [];
                // 缩放table大小
                scaleWidthAndHeight(handsonTableOptions, positions.width, positions.height, positions.originalWidth, positions.originalHeight, x1, y1);
                //handsonTable.updateSettings(handsonTableOptions);
                for (var i = 1; i < x2.length; i++) {

                    var tx = x2[i];
                    var ty = y2[i];
                    var tz = z2[i];//that onePoints information

                    //设置三维坐标转换二维坐标的map
                    var twozb = tx + "," + ty  //这个点的2d坐标
                    console.log("twozb is: " + twozb);
                    if (typeof checker[twozb] !== 'undefined') {
                        console.log("twozb " + twozb + " already in checker cache");
                    } else {
                        checker[twozb] = true;
                    }
                    var points = list[i - 1].points
                    var coordinates = list[i - 1].coordinate.split(',');
                    var coordinates = coordinates.length > 2 ?
                        {
                            x: coordinates[0],
                            y: coordinates[1],
                            z: coordinates[2]
                        }
                        :
                        { x: 0, y: 0, z: 0 };

                    var index;

                    var split1 = typeof msg[twozb] === 'undefined' ? [0, 0, 0] : msg[twozb].split(",")
                    var x = parseFloat(split1[0])
                    var y = parseFloat(split1[1])

                    if (x == 0) {
                        index = 1;
                    } else if (y == 0) {
                        index = 3;
                    } else if (typeof wx2 !== 'undefined' && wx2 == x) {
                        index = 2;
                    } else if (typeof wy4 !== 'undefined' && wy4 == y) {
                        index = 4
                    }
                    var msgPos = { x: tx, y: ty };
                    addLine2(list[i - 1].flabel, twozb, msg[twozb], points, samples1, index, coordinates, i, positions, tz, true);

                }
                var len = parseInt($("#boxs").find("option:selected").val()) + 1;
                var str = '<div class="line' + len + '"></div>';
                $('body').append(str);
                $('#testContainer').hide();
                $('.spinner, #overlay').hide();
                // if (handsonTableActiveAjaxCalls <= 0) {
                //     handsonTableActiveAjaxCalls = 0;
                //     moveParetoChartsFromAltToAltHolder();
                // } else {
                //     //do a setInterval here
                //     //might be better
                //     setTimeout(function () {
                //         //if (handsonTableActiveAjaxCalls > 0) {
                //         handsonTableActiveAjaxCalls = 0;
                //         moveParetoChartsFromAltToAltHolder();
                //         $('.spinner, #overlay').hide();
                //         //}, 4000)
                //         //}
                //     }, 100 * handsonTableActiveAjaxCalls);
                // }
            }
        });
    }, 16);

}

function showReport3() {
    $('#ParetoDiagramHelper, #TrendMapDiagramHelper, #ControlChartDiagramHelper, ' +
        '#SigmaMapDiagramHelper, #BoxLineChartDiagramHelper, #StackingMapDiagramHelper, ' +
        '#PieChartDiagramHelper, #HistogramDiagramHelper').show();

    // loading
    $('.spinner, #overlay').show();

    $('#testContainer').show();
    //use currentReportPage
    currentReportPage = $('#boxs').prop('selectedIndex')//val()
    handsonTableHelperObjTrendMapsCache = {};
    globalObj.existingVertices = [];
    if (typeof globalObj.twoPoints !== 'undefined') {

        globalObj.twoPoints.vertex1 = null;
        globalObj.twoPoints.vertex2 = null;
        globalObj.twoPoints.vertex3 = null;
        globalObj.twoPoints.vertex4 = null;
        globalObj.twoPoints.line = null;
    }
    var vv1 = parseInt($("#boxs").find("option:selected").val()) + 1
    if (typeof globalObj.twoPoints !== 'undefined') {
        if (globalObj.twoPoints.point1 && typeof globalObj.twoPoints.point1 !== 'undefined') {
            globalObj.twoPoints.point1.material.color.setHex(0xff0000);
            globalObj.twoPoints.point1.material.needsUpdate = true;
            globalObj.twoPoints.point1 = null;
        }
        if (globalObj.twoPoints.point2 && typeof globalObj.twoPoints.point2 !== 'undefined') {
            globalObj.twoPoints.point2.material.color.setHex(0xff0000);
            globalObj.twoPoints.point2.material.needsUpdate = true;
            globalObj.twoPoints.point2 = null;
        }
        scene.remove(globalObj.twoPoints.line);
        globalObj.twoPoints.enabled = false;

        document.getElementById('toggleTwoPointsBtn').style.backgroundColor = '#dddddd';
    }

    //删除所有
    graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
    if (typeof globalObj.cache !== 'undefined') {
        for (var i in globalObj.cache) {
            graph.removeCells([globalObj.cache[i].edge, globalObj.cache[i].v1, globalObj.cache[i].v2]);
        }
    }

    var value = $("#boxs").find("option:selected").attr("zdy")
    if (typeof value === 'undefined') {
        $('.spinner, #overlay').hide();
        return false;
    }
    // 要显示的点的数据
    var list = JSON.parse(value);

    console.log("list", list);

    // 只显示当前页的测点
    _showCurrentPoint(list);


    // 获取当前页的视口与设置
    $.ajax({
        url: '/report/loadModelView',
        type: 'get',
        dataType: 'json',
        async: false,
        data: {
            routineId: rId,
            reportId: reportId,
            page: $("#boxs").find("option:selected").index()
        },
        success: function (res) {
            if (!res || !res.data) return;
            var _target = [+res.data.targetX, +res.data.targetY, +res.data.targetZ];
            var _eyePos = [+res.data.eyePosX, +res.data.eyePosY, +res.data.eyePosZ];
            var _up = [+res.data.upX, +res.data.upY, +res.data.upZ];
            // 记录视口位置
            globalObj.navigatorView = {
                _target: _target,
                _eyePos: _eyePos,
                _up: _up
            }
            // 设置视图
            navigatorViewReverse(_target, _eyePos, _up);
            // 更新测点位置
            refreshPointLocation();

            Object.assign(globalObj.spacing, {
                chartSpacingLeftRight: res.data.chartMarginLeft,
                chartSpacingUpDown: res.data.chartMarginTop,
                pageSpacingLeftRight: res.data.pageMarginLeft,
                pageSpacingUpDown: res.data.pageMarginTop,
                numOfPages: res.data.pointCount,
                apply: res.data.apply
            })
        }
    });

    var screenElm = document.getElementById('pageScreen');
    var containerElm = document.getElementById('container');
    var graphContainerElm = document.getElementById('graphContainer');
    var canvasElm = document.getElementById('canvas');

    var topDiff3 = containerElm.offsetTop - graphContainerElm.offsetTop;
    var leftDiff3 = containerElm.offsetLeft - graphContainerElm.offsetLeft;
    // 画布宽高
    var pageScreenWidth = screenElm.offsetWidth;
    var pageScreenHeight = screenElm.offsetHeight;
    // 画布 左上角坐标
    var pageScreenFixed = _getElementFixed(screenElm);
    // 模型canvas宽高
    var canvasWidth = canvasElm.offsetWidth;
    var canvasHeight = canvasElm.offsetHeight;
    // 模型canvas 左上角坐标
    var canvasFixed = _getElementFixed(canvasElm);

    setTimeout(function() {
        getSpecialPointsLocation(function(data) {
            var _list = data;

            var pointLocationJson = _list.map(function (item) {
                return {
                    id: item.id,
                    x: item.screen_x,
                    y: item.screen_y,
                }
            });
            if (!globalObj.tableOriginOptions) {
                globalObj.tableOriginOptions ={
                    width: handsonTableOptions?handsonTableOptions.width:5,
                    height: handsonTableOptions?handsonTableOptions.height:5
                }
            }
            var tableOriginWidth = globalObj.tableOriginOptions.width;
            var tableOriginHeight = globalObj.tableOriginOptions.height;
            var _data = {
                'bgLeftTop.x': 0,
                'bgLeftTop.y': 0,
                'bgRightBottom.x': pageScreenWidth,
                'bgRightBottom.y': pageScreenHeight,
                'canvasLeftTop.x': containerElm.offsetTop,
                'canvasLeftTop.y': containerElm.offsetTop,
                'canvasRightBottom.x': containerElm.offsetTop + canvasWidth,
                'canvasRightBottom.y': containerElm.offsetTop + canvasHeight,
                'bgMarginY': globalObj.spacing.pageSpacingUpDown,
                'bgMarginX': globalObj.spacing.pageSpacingLeftRight,
                'tableOriginHeight': tableOriginHeight,
                'tableOriginWidth': tableOriginWidth,
                'chartMarginX': globalObj.spacing.chartSpacingLeftRight,
                'pointLocationJson': JSON.stringify(pointLocationJson),
            };

            //计算表格位置
            $.ajax({
                url: ctx + '/report/getTableLocation',
                type: 'post',
                dataType: 'json',
                data: _data,
                error: function (msg) {
                    $('.spinner, #overlay').hide();
                    console.log("msg", msg)
                },
                success: function (res) {
                    //clear object that caches four lines
                    globalObj.cache = [];
                    graph.removeCells(graph.getChildVertices(graph.getDefaultParent()))
                    if (typeof globalObj.cache !== 'undefined') {
                        for (var i in globalObj.cache) {
                            graph.removeCells([globalObj.cache[i].edge, globalObj.cache[i].v1, globalObj.cache[i].v2]);
                        }
                    }
                    var checker = [];

                    var singleTableWidth = (res.data.tableWidth - globalObj.spacing.chartSpacingLeftRight * 2) / 3;
                    globalObj.tableLocation = {
                        width: Math.floor(res.data.tableWidth),
                        height: Math.ceil(res.data.tableHeight),
                    }

                    var positions = {
                        width: singleTableWidth,
                        height: res.data.tableHeight,
                        originalWidth: tableOriginWidth,
                        originalHeight: tableOriginHeight,
                    };
                    var tableList = res.data.tableList.reduce(function (acc, cur) {
                        acc[cur.point.id] = {
                            inPoint: [cur.point.x, cur.point.y],
                            outPoint: [cur.x, cur.y],
                        }
                        return acc;
                    }, {});

                    // 缩放表格大小
                    _zoomTable(positions);

                    globalObj.chartData = {};
                    globalObj.chartSetting = {};

                    _list.forEach(function (item) {
                        if (tableList[item.id] && typeof tableList[item.id] !== 'undefined') {
                            edgeRouterHelperArr[item.screen_x + ',' + item.screen_y] =
                                tableList[item.id].outPoint.join(',')
                        }
                    })

                    _list.forEach(function (item) {
                        var points = item.point;
                        var coordinates = [item.x, item.y, item.z];
                        var coordinates = coordinates.length > 2 ?
                            {
                                x: coordinates[0],
                                y: coordinates[1],
                                z: coordinates[2]
                            }
                            :
                            { x: 0, y: 0, z: 0 };

                        addLine2(
                            item.id,
                            item.screen_x+','+item.screen_y,
                            tableList[item.id].outPoint.join(','),
                            points,
                            samples1,
                            1,
                            coordinates,
                            1,
                            positions,
                            item,
                            true
                        );
                    })

                    var len = parseInt($("#boxs").find("option:selected").val()) + 1;
                    var str = '<div class="line' + len + '"></div>';
                    $('body').append(str);

                    $('#testContainer').hide();
                    $('.spinner, #overlay').hide();
                }
            });
        })


    }, 16);

}

/**
 * 显示指定的测点
 * @author nikoohp
 * @param {Array} list 要显示的点的数组
 */
function _showCurrentPoint(list) {

    var modelNameArray = rid_2_model_name[rId];
    var modelName = modelNameArray[modelNameArray.length - 1];
    // 删除所有测点
    deleteSpecialPoint(modelName);

    var currentSpecialPointData = list.map(function (item) {
        return {
            _cpcPos: item.coordinate.split(','),
            _name: item.flabel,
            _nearest: undefined,
            _normal: [],
            _scanSize: 0,
            _twins: [],
        }
    })

    // 加载测点
    loadSpecialPoint(modelName, currentSpecialPointData, new THREE.Color(0, 1, 0), 1, undefined);

    // 当前显示的点
    window._currentPointList = list.map(function (item) {
        return item.flabel;
    })
    // 是否显示/隐藏异常/正常点
    _toggleAbnormal();
    _toggleNormal();



}

/**
   * 获取元素相对于屏幕顶部的相对位置
   * @param  {Object} element dom元素
   * @return {Object}         绝对位置{currentX, currentY}
   */
function _getElementFixed(element) {
    var actualLeft = element.offsetLeft;
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
        var translate = _getTranslate();
        actualLeft += (current.offsetLeft + translate[0]);
        actualTop += (current.offsetTop + translate[1]);
        current = current.offsetParent;
    }
    return {
        x: actualLeft,
        y: actualTop
    };
}

/**
 * 获取元素的css3 Translate偏移量
 * 只做了对标准和webkit内核兼容
 * 获取css属性摘自Zepto.js，做修改后只获得transform属性
 * 只处理 translate，如果有旋转或者缩放等，结果会不准确
 *
 * @param  {Object} element dom元素
 * @return {Array}          偏移量[x,y]
 */
function _getTranslate() {
    var element = document.getElementById('pageScreen')
    var transformMatrix = element.style["transform"];

    var matrix = transformMatrix.match(/\-?[0-9]+\.?[0-9]*/g) || [0,0];
    var ratio = 1;
    if (matrix && matrix.length >= 3) {
        ratio = matrix[2];
    }
    var x = matrix[0] * ratio
    var y = matrix[1] * ratio //translate y
    return [0, 0]
}

/**
 * 缩放表格大小
 * @author nikoohp
 * @param  {Object} positions 需要缩放的宽高
 */
function _zoomTable(positions) {
    if (!globalObj.tableRadio && handsonTableOptions) {
        globalObj.tableRadio = positions.width / handsonTableOptions.width;
        handsonTableOptions.width = positions.width;
        handsonTableOptions.height = positions.height;
        handsonTableOptions.colWidths = handsonTableOptions.colWidths.map(function (col) {
            return col * globalObj.tableRadio;
        })
        // handsonTableOptions.rowHeights = handsonTableOptions.rowHeights.map(function (row) {
        //     return row * globalObj.tableRadio;
        // })
        handsonTable.updateSettings(handsonTableOptions)
        $(handsonTable.table).css({
            'transform': 'scaleY('+globalObj.tableRadio+')',
            'transform-origin': 'top'
        })
    }
}

function loadPoint(code, data, flabels, onePoints) {

    //判断是否有3d模型,从cookie取,没有模型自行计算

    var normalPoint = $("#normalPoint").children(".move").attr("data-state");//正常点
    var outlier = $("#abnormalPoint").children(".move").attr("data-state");//异常点

    var normalPointVal = 0;
    var outlierVal = 0;
    if (normalPoint == "on") {
        normalPointVal = 1;
    } else {
        normalPointVal = 0;
    }

    if (outlier == "on") {
        outlierVal = 1;
    } else {
        outlierVal = 0;
    }

    if (code == 1) {
        //从ajax 获取
        //change here
        jQuery.ajax({
            //url: 'getVertices.json',
            //url: ctx + '/report/getVertices',
            //"static/js/projectJs/data1.json";
            url: "static/js/projectJs/getvertices.json",
            type: 'post',
            data: {
                'rId': rId
                , 'normalPointVal': normalPointVal
                , 'outlierVal': outlierVal
            },
            error: function (msg) {
                alert("error");
                globalObj.points = []
            },
            success: function (msg) {

                var pm1 = new Map(); // 空Map
                var pm2 = new Map();
                var array = [];
                var array2 = [];
                var hm = {};

                for (var i = 0; i < msg.length; i++) {
                    var xyz = typeof msg[i].zb === 'undefined' ? [0, 0, 0] : msg[i].zb.split(",");
                    array.push(new THREE.Vector3(xyz[0], xyz[1], xyz[2]))
                }

                var box = new THREE.Box3().setFromPoints(array);
                //globalObj.centralObj);//window._scene);

                var multiplyScalar = new THREE.Vector3().addVectors(box.min, box.max).multiplyScalar(0.5).negate();
                //globalObj.multiplyScalar = multiplyScalar;
                var vectorHelper = new THREE.Vector3(box.max.x - box.min.x, box.max.y - box.min.y,
                    box.max.z - box.min.z);
                array = [];
                for (var i = 0; i < msg.length; i++) {
                    var xyz = typeof msg[i].zb === 'undefined' ? [0, 0, 0] : msg[i].zb.split(",");
                    if (typeof hm[msg[i].zb] !== 'undefined') {
                        continue;
                    }
                    hm[msg[i].zb] = true;
                    //var applyMatrix4 = new THREE.Vector3(xyz[0], xyz[1], xyz[2]).applyMatrix4(matrix4);
                    /*var applyMatrix4_1 = new THREE.Vector3(parseInt(xyz[0])
                        + globalObj.multiplyScalar.z * 1000,
                        parseInt(xyz[1])
                        + globalObj.multiplyScalar.x * 1000,
                        parseInt(xyz[2]) + globalObj.multiplyScalar.y * 1000);*/

                    var applyMatrix4_1 = new THREE.Vector3(parseInt(xyz[0])
                        - box.min.x,//vectorHelper.x,
                        parseInt(xyz[1])
                        - box.min.y,//vectorHelper.y,
                        parseInt(xyz[2])
                        - box.min.z);//vectorHelper.z);

                    /*var applyMatrix4_1 = new THREE.Vector3(parseInt(xyz[0])
                        + 1000,
                        parseInt(xyz[1])
                        + 1000,
                        parseInt(xyz[2]) + 1000);*/
                    var newVertex = new THREE.Vector3(applyMatrix4_1.y / 1000, applyMatrix4_1.z / 1000, applyMatrix4_1.x / 1000);
                    newVertex.original = { x: parseInt(xyz[0]), y: parseInt(xyz[1]), z: parseInt(xyz[2]) };
                    array.push(newVertex);
                    pm1.set(newVertex.x + "," + newVertex.y + "," + newVertex.z, msg[i].red);
                    pm2.set(newVertex.x + "," + newVertex.y + "," + newVertex.z, msg[i].f_id);
                }
                addSencePoint(array, pm1, pm2);

            }
        });
    } else if (code == 2) {
        var retArr = [];
        //ToDo: 06/09/2020 need to bring back the following at some point?
        /*globalObj.points.forEach(function(vertex) {*/
        //Use ModelGroup
        //first get ModelGroup
        var pointsGroup;
        for (var i = 0; i < window._scene.children.length; i++) {
            if (window._scene.children[i].name === 'ModelGroup') {
                pointsGroup = window._scene.children[i].children[0]
            }
        }
        //now find SpecialPointsGroup
        var specialPointsGroup
        for (var j = 0; j < pointsGroup.children.length; j++) {
            if (pointsGroup.children[j].name === 'SpecialPointGroup') {
                specialPointsGroup = pointsGroup.children[j]
            }
        }
        var counter = 0;
        //ToDo - pageSize is always going to be 4 right now, 06/12/2020
        var pageSize = 4
        var startIndex = (currentReportPage - 1) * pageSize
        var endIndex = ((currentReportPage - 1) * pageSize) + pageSize
        var specialPointsArrFiltered = []
        specialPointsGroup.children.forEach(function (vertex) {

            //first try
            /*if (counter >= startIndex && counter < endIndex) {
                vertex.visible = true;
                vertex.onePoints = onePoints[counter%pageSize]//data.lengthi];
                retArr.push(vertex);
            } else {
                vertex.visible = false;
            }*/

            //second try
            /*var found = false
            for(var z = startIndex; z < endIndex; z++) { //specialPointsArr.length; z++) {
                if ((specialPointsArr[z].x1 == vertex.position.x &&
                    specialPointsArr[z].y1 == vertex.position.y &&
                    specialPointsArr[z].z1 == vertex.position.z) ||
                    (specialPointsArr[z].id == vertex.uuid)
                ) {
                    //specialPointsArrFiltered.push(vertex)
                    vertex.visible = true;
                    vertex.onePoints = onePoints[counter%pageSize]//data.lengthi];
                    retArr.push(vertex);
                    found = true
                }
            }
            if (!found) {
                vertex.visible = false
            }
            counter++*/

            //if (typeof vertex.sphere !== 'undefined') {
            for (var i = 0; i < data.length; i++) {
                var j = data[i];
                var m = flabels[i];
                var j2 = onePoints[i].coordinate
                var j2Arr = j2.split(',')
                var k;
                var kName = vertex.name.substring(vertex.name.lastIndexOf('_')+1)
                /*if (globalObj.multiplyScalar && typeof globalObj.multiplyScalar !== 'undefined') {
                    k = new THREE.Vector3(j.x + globalObj.multiplyScalar.z * 1000,
                        j.y + globalObj.multiplyScalar.x * 1000, j.z + globalObj.multiplyScalar.y * 1000);
                } else {*/
                k = new THREE.Vector3(j.x,
                    j.y, j.z);
                //}
                var l = new THREE.Vector3(k.y / 1000, k.z / 1000, k.x / 1000);
                var m_arr = m.split(',');
                if ((Math.floor(vertex.position.x) === Math.floor(Number(j2Arr[0])) &&
                    Math.floor(vertex.position.y) === Math.floor(Number(j2Arr[1])) &&
                    Math.floor(vertex.position.z) === Math.floor(Number(j2Arr[2])))
                    || (vertex.uuid === flabels[i]) || (kName === flabels[i])) {
                    /*|| (vertex.position.x === k.x &&
                    vertex.position.y === k.y && vertex.position.z === k.z) ||
                    (vertex.position.x === l.x && vertex.position.y === l.y &&
                        vertex.position.z === l.z) || (m_arr.length > 1 && vertex.f_id === m_arr[0])) {*/
                    console.log("this is getting set visible to true: " + vertex.f_id);
                    vertex.visible = true;
                    vertex.onePoints = onePoints[i];
                    retArr.push(vertex);
                } else {
                    vertex.visible = false;
                }
            }
            //}
        });
        return retArr;
    }
}

function addSencePoint(array, m, m2) {
    globalObj.points = array;
    starsGeometry = new THREE.BufferGeometry();

    if (typeof m !== 'undefined') {
        globalObj.points.forEach(function (vertex, index) {

            var red = m.get(vertex.x + "," + vertex.y + "," + vertex.z);
            var f_id = m2.get(vertex.x + "," + vertex.y + "," + vertex.z);
            var geometry = new THREE.SphereGeometry(.01, 10, 10);

            var material;
            if (red == 0) {
                material = new THREE.MeshBasicMaterial({ color: 0x008000 });
            } else if (red == 1) {
                material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            } else {
                material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            }

            var sphere = new THREE.Mesh(geometry, material);
            //sphere.position.set(vertex.x, vertex.y, vertex.z);
            sphere.position.set(vertex.x
                - globalObj.centralObj.position.x,
                vertex.y
                - globalObj.centralObj.position.y,
                vertex.z - globalObj.centralObj.position.z);
            sphere.original = vertex.original;
            vertex.sphere = sphere;
            vertex.f_id = f_id;
            //scene.add( sphere );
            globalObj.centralObj.add(sphere);
        });
    }
    render()
}

function render() {
    //光源相机转动
    // lights[0].position.z = camera.position.z - 10
    if (globalObj.explodeMode.carModelMode === 2) { //expanding
        var l = globalObj.explodeMode.carModel.length;
        var counter = 0;
        for (var i = 0; i < l; i++) {
            var dp = globalObj.explodeMode.carModelDestPos[i];
            var op = globalObj.explodeMode.carModelOrigPos[i];
            var cm = globalObj.explodeMode.carModel[i];
            var diffX = (dp.x - op.x) / 70;
            var diffY = (dp.y - op.y) / 70;
            var diffZ = (dp.z - op.z) / 70;
            if (cm.position.x === dp.x && cm.position.y === dp.y && cm.position.z === dp.z) {
                counter++;
            } else if (Math.abs(cm.position.x - dp.x) < .004
                && Math.abs(cm.position.y - dp.y) < .004
                && Math.abs(cm.position.z - dp.z) < .004
            ) {
                cm.position.copy(dp);
                counter++;
            } else {
                cm.position.set(cm.position.x + diffX, cm.position.y + diffY, cm.position.z + diffZ);
                //cm.position.translateX(diffX);
                //cm.position.translateY(diffY);
                //cm.position.translateZ(diffZ);
            }
        }
        if (counter === l) {
            globalObj.explodeMode.carModelMode = 4;
            document.getElementById('explodeModeToggle').innerHTML = '扩小';
        }
    } else if (globalObj.explodeMode.carModelMode === 3) { //shrinking
        var l = globalObj.explodeMode.carModel.length;
        var counter = 0;
        for (var i = 0; i < l; i++) {
            var dp = globalObj.explodeMode.carModelDestPos[i];
            var op = globalObj.explodeMode.carModelOrigPos[i];
            var cm = globalObj.explodeMode.carModel[i];
            var diffX = (op.x - dp.x) / 70;
            var diffY = (op.y - dp.y) / 70;
            var diffZ = (op.z - dp.z) / 70;
            if (cm.position.x === op.x && cm.position.y === op.y && cm.position.z === op.z) {
                counter++;
            } else if (Math.abs(cm.position.x - op.x) < .004
                && Math.abs(cm.position.y - op.y) < .004
                && Math.abs(cm.position.z - op.z) < .004
            ) {
                cm.position.copy(op);
                counter++;
            } else {
                cm.position.set(cm.position.x + diffX, cm.position.y + diffY, cm.position.z + diffZ);
                //cm.position.translateY(diffY);
                //cm.position.translateZ(diffZ);
            }
        }
        if (counter === l) {
            globalObj.explodeMode.carModelMode = 1;
            document.getElementById('explodeModeToggle').innerHTML = '扩大';
        }
    }
    renderer.render(scene, camera);
}

function labelPositionOptimizerUsingAreaHelper(labelW, labelH, count, x1, y1) {
    var pageScreenWidth = document.getElementById('pageScreen').offsetWidth;
    var pageScreenHeight = document.getElementById('pageScreen').offsetHeight;
    /*var containerWidth = document.getElementById('container').offsetWidth;
    var containerHeight = document.getElementById('container').offsetHeight;
    var containerLeft = document.getElementById('container').offsetLeft;*/
    var containerWidth = document.getElementById('canvas').offsetWidth;
    var containerHeight = document.getElementById('canvas').offsetHeight;
    var containerLeft = document.getElementById('canvas').offsetLeft;
    var leftSideWidth = containerLeft - globalObj.spacing.pageSpacingLeftRight;
    var rightSideWidth = pageScreenWidth - containerLeft - containerWidth - globalObj.spacing.pageSpacingLeftRight;
    //var containerTop = document.getElementById('container').offsetTop;
    var containerTop = document.getElementById('canvas').offsetTop;
    var downSideHeight = pageScreenHeight - containerTop - containerHeight - globalObj.spacing.pageSpacingUpDown;
    var upSideHeight = containerTop - globalObj.spacing.pageSpacingUpDown;
    var useTheseSides = {
        up: upSideHeight >= labelH ? true : false,
        left: leftSideWidth >= labelW ? true : false,
        right: rightSideWidth >= labelW ? true : false,
        down: downSideHeight >= labelH ? true : false
    };
    var startPositions = {
        up: {
            startX: useTheseSides.up ? globalObj.spacing.pageSpacingLeftRight : 0,
            startY: useTheseSides.up ? globalObj.spacing.pageSpacingUpDown : 0,
            endX: useTheseSides.up ? pageScreenWidth : 0,
            endY: useTheseSides.up ? containerTop : 0,
            currentX: 0
        },
        left: {
            startX: useTheseSides.left ? globalObj.spacing.pageSpacingLeftRight : 0,
            startY: useTheseSides.left ? (useTheseSides.up ? containerTop : globalObj.spacing.pageSpacingUpDown) : 0,
            endX: useTheseSides.left ? containerLeft : 0,
            endY: useTheseSides.left ? (useTheseSides.down ? pageScreenHeight : containerTop + containerHeight) : 0,
            currentY: 0
        },
        right: {
            startX: useTheseSides.right ? containerLeft + containerWidth : 0,
            startY: useTheseSides.right ? (useTheseSides.up ? containerTop : globalObj.spacing.pageSpacingUpDown) : 0,
            endX: useTheseSides.right ? pageScreenWidth : 0,
            endY: useTheseSides.right ? (useTheseSides.down ? containerTop + containerHeight : pageScreenHeight) : 0,
            currentY: 0
        },
        down: {
            startX: useTheseSides.down ? globalObj.spacing.pageSpacingLeftRight : 0,
            startY: useTheseSides.down ? containerTop + containerHeight : 0,
            endX: useTheseSides.down ? pageScreenWidth : 0,
            endY: useTheseSides.down ? pageScreenHeight - globalObj.spacing.pageSpacingUpDown : 0,
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
    while (countHelper < count - 1) {
        var lastCountHelper = countHelper;
        switch (roundRobinULRD) {
            case 1: //up
                if ((startPositions.up.currentX + ((3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4)))
                    <= startPositions.up.endX) {
                    x1Up.push(startPositions.up.currentX);
                    y1Up.push(startPositions.up.startY);
                    startPositions.up.currentX += (3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4);
                    countHelper++;
                }
                break;
            case 2: //left
                if ((startPositions.left.currentY + ((3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4)))
                    <= startPositions.left.endY) {
                    x1Left.push(startPositions.left.startX);
                    y1Left.push(startPositions.left.currentY);
                    startPositions.left.currentY += (3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4);
                    countHelper++;
                }
                break;
            case 3: //right
                if ((startPositions.right.currentY + ((3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4)))
                    <= startPositions.right.endY) {
                    x1Right.push(startPositions.right.startX);
                    y1Right.push(startPositions.right.currentY);
                    startPositions.right.currentY += (3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4);
                    countHelper++;
                }
                break;
            case 4: //down
                if ((startPositions.down.currentX + ((3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4)))
                    <= startPositions.down.endX) {
                    x1Down.push(startPositions.down.currentX);
                    y1Down.push(startPositions.down.startY);
                    startPositions.down.currentX += (3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4);
                    countHelper++;
                }
                break;
            default:
                break;
        }
        if (lastCountHelper == countHelper)
            return false;
        if (++roundRobinULRD > 4) {
            roundRobinULRD = 1;
        }
    }

    if (x1Up.length > 0) {
        var upUsedWidth = (x1Up[x1Up.length - 1] + (labelW * 3)) - x1Up[0];
        var upMarginX = (pageScreenWidth - upUsedWidth) / 2;
        var upMarginY = (containerTop - labelH) / 2;
        upMarginX = isNaN(upMarginX) ? 0 : upMarginX;
        upMarginY = isNaN(upMarginY) ? 0 : upMarginY;
        for (var i = 0; i < x1Up.length; i++) {
            x1Up[i] = Math.floor(x1Up[i] + upMarginX);
            y1Up[i] = Math.floor(y1Up[i] + upMarginY);
            getLabelPositions2HelperObj[x1Up[i] + ',' + y1Up[i]] = 'up';
        }
    }

    if (x1Left.length > 0) {
        var leftWidth = containerLeft - globalObj.spacing.pageSpacingLeftRight;
        var leftHeight = containerHeight;
        if (!useTheseSides.up) {
            leftHeight += containerTop;
        }
        if (!useTheseSides.down) {
            leftHeight += (pageScreenHeight - containerHeight - containerTop);
        }
        var leftUsedHeight = (y1Left[y1Left.length - 1] + (labelH * 3)) - y1Left[0];
        var leftMarginX = (leftWidth - labelW) / 2;
        var leftMarginY = (leftHeight - leftUsedHeight) / 2;
        leftMarginX = isNaN(leftMarginX) ? 0 : leftMarginX;
        leftMarginY = isNaN(leftMarginY) ? 0 : leftMarginY;
        for (var i = 0; i < x1Left.length; i++) {
            y1Left[i] = Math.floor(y1Left[i] + leftMarginY);
            getLabelPositions2HelperObj[x1Left[i] + ',' + y1Left[i]] = 'left';
        }
    }

    if (x1Right.length > 0) {
        var rightUsedHeight = (y1Right[y1Right.length - 1] + (labelH * 3)) - y1Right[0];
        var rightHeight = containerHeight;
        if (!useTheseSides.up) {
            rightHeight += containerTop;
        }
        if (!useTheseSides.down) {
            rightHeight += (pageScreenHeight - containerHeight - containerTop);
        }
        var rightMarginX = pageScreenWidth - (containerLeft + containerWidth) -
            (labelW + globalObj.spacing.pageSpacingLeftRight);
        var rightMarginY = (rightHeight - rightUsedHeight) / 2;
        rightMarginX = isNaN(rightMarginX) ? 0 : rightMarginX;
        rightMarginY = isNaN(rightMarginY) ? 0 : rightMarginY;
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
        downMarginX = isNaN(downMarginX) ? 0 : downMarginX;
        downMarginY = isNaN(downMarginY) ? 0 : downMarginY;
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

function pageSpacingMubanChange(e) {
    var pageSpacingUpMuban = document.getElementById('pageSpacingUpMuban').value
    var pageSpacingDownMuban = document.getElementById('pageSpacingDownMuban').value
    var pageSpacingLeftMuban = document.getElementById('pageSpacingLeftMuban').value
    var pageSpacingRightMuban = document.getElementById('pageSpacingRightMuban').value
    pageSpacingUpMuban = isNaN(pageSpacingUpMuban) ? 0 : pageSpacingUpMuban
    pageSpacingDownMuban = isNaN(pageSpacingDownMuban) ? 0 : pageSpacingDownMuban
    pageSpacingLeftMuban = isNaN(pageSpacingLeftMuban) ? 0 : pageSpacingLeftMuban
    pageSpacingRightMuban = isNaN(pageSpacingRightMuban) ? 0 : pageSpacingRightMuban
    for (var i = 0; i < muban_handsonTable_arr.length; i++) {
        var pos = $('#handsonContainer' + i).position()
        var w = $('#handsonContainer' + i).width()
        var h = $('#handsonContainer' + i).height()
        var pageScreenH = $('#pageScreen').height()
        var pageScreenW = $('#pageScreen').width()
        //check if position top is out of border
        if (pos.top < pageSpacingUpMuban) {
            $('#handsonContainer' + i).css('top', pageSpacingUpMuban)
        }
        if (pos.left < pageSpacingLeftMuban) {
            $('#handsonContainer' + i).css('left', pageSpacingLeftMuban)
        }
        if (pageScreenH - (pos.top + h) > pageSpacingDownMuban) {
            $('#handsonContainer' + i).css('top',
                pageScreenH - h - pageSpacingDownMuban)
        }
        if (pageScreenW - (pos.left + w) > pageSpacingRightMuban) {
            $('#handsonContainer' + i).css('left',
                pageScreenW - w - pageSpacingRightMuban)
        }
    }
}
