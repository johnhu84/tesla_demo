function toggleOperationContControls(name) {
    $(".operationCont ." + name).show().siblings().hide();
    if (name === 'fuwenben') {
        loadFuwenben();
    } else if(name==="TrendMap") {
        loadTrendMapSettings();
    } else if(name==="columnChart") {
        loadColumnChartSettings();
    } else if(name==="ControlChart") {
        loadControlChartSettings();
    }
}

function triggerHandsonCellClick() {
    var ids = $(this).attr("id")
    var selectedHandsonTableCellType = '';
    if (typeof handsonTable !== 'undefined') {
        var currSelection = handsonTable.getSelected();
        if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
            || currSelection[0].length < 4) {
            //return false;
        } else {
            if (typeof handsonTableHelperObj[currSelection[0][0]+','+currSelection[0][1]]
                !== 'undefined') {
                selectedHandsonTableCellType = 'fuwenben';
            } else if (typeof handsonTableHelperObjTrendMaps[currSelection[0][0]+','+currSelection[0][1]]
                !== 'undefined') {
                selectedHandsonTableCellType = 'TrendMap';
            } else if (typeof handsonTableHelperObjParetos[currSelection[0][0]+','+currSelection[0][1]]
                !== 'undefined') {
                selectedHandsonTableCellType = 'ParetoChart';
            } else if (typeof handsonTableHelperObjHistograms[currSelection[0][0]+','+currSelection[0][1]]
                !== 'undefined') {
                selectedHandsonTableCellType = 'Histogram';
            } else if (typeof handsonTableHelperObjControlCharts[currSelection[0][0]+','+currSelection[0][1]]
                !== 'undefined') {
                selectedHandsonTableCellType = 'ControlChart';
            } else if (typeof handsonTableHelperObjBoxLineCharts[currSelection[0][0]+','+currSelection[0][1]]
                !== 'undefined') {
                selectedHandsonTableCellType = 'BoxLineChart';
            } else if (typeof handsonTableHelperObjSigmaMaps[currSelection[0][0]+','+currSelection[0][1]]
                !== 'undefined') {
                selectedHandsonTableCellType = 'SigmaMap';
            } else if (typeof handsonTableHelperObjPieCharts[currSelection[0][0]+','+currSelection[0][1]]
                !== 'undefined') {
                selectedHandsonTableCellType = 'PieChart';
            } else if (typeof handsonTableHelperObjStackingMapCharts[currSelection[0][0]+','+currSelection[0][1]]
                !== 'undefined') {
                selectedHandsonTableCellType = 'StackingMapChart';
            } else if (typeof handsonTableHelperObjImgs[currSelection[0][0]+','+currSelection[0][1]]
                !== 'undefined') {
                selectedHandsonTableCellType = 'picture';
            }
        }
    }
    if (selectedHandsonTableCellType === 'fuwenben') {
        toggleOperationContControls('fuwenben');
    } else if ($(this).find("div[id^='ParetoChart']").length > 0 || selectedHandsonTableCellType === 'ParetoChart') {
        toggleOperationContControls('ParetoChart');
    } else if ($(this).find("div[id^='barChart']").length > 0) { //直方图
        columnChart(ids, width, height)
    } else if ($(this).find("div[id^='TrendMap']").length > 0 || selectedHandsonTableCellType === 'TrendMap') { //趋势图
        toggleOperationContControls('TrendMap');
    } else if (selectedHandsonTableCellType === 'Histogram') {
        toggleOperationContControls('columnChart');
    } else if (selectedHandsonTableCellType === 'ControlChart') {
        toggleOperationContControls('ControlChart');
    } else if (selectedHandsonTableCellType === 'BoxLineChart') {
        toggleOperationContControls('BoxLineChart');
    } else if (selectedHandsonTableCellType === 'SigmaMap') {
        toggleOperationContControls('6sigma');
    } else if (selectedHandsonTableCellType === 'PieChart') {
        toggleOperationContControls('pieChart');
    } else if (selectedHandsonTableCellType === 'StackingMapChart') {
        toggleOperationContControls('StackingMapChart');
    } else if (selectedHandsonTableCellType === 'picture') {
        toggleOperationContControls('picture');
    }
}

function clearHandsonCell() {
    if (typeof handsonTable !== 'undefined') {
        var currSelection = handsonTable.getSelected();
        if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
            || currSelection[0].length < 4) {
            //return false;
        } else {
            //if (typeof handsonTableHelperObjTrendMaps[currSelection[0][0]+','+currSelection[0][1]]
            handsonTableOptions = handsonTable.getSettings();
            handsonTableOptions.data[currSelection[0][0]][currSelection[0][1]] = '';
            handsonTable.updateSettings(handsonTableOptions);
            var newHandsonTableHelperObjTrendMaps = {};
            for (var i in handsonTableHelperObjTrendMaps) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjTrendMaps[helper[0] + ',' + helper[1]] = handsonTableHelperObjTrendMaps[i];
                }
            }
            var newHandsonTableHelperObjTrendMapSettings = {};
            for (var i in handsonTableHelperObjTrendMapSettings) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjTrendMapSettings[helper[0] + ',' + helper[1]] =
                        handsonTableHelperObjTrendMapSettings[i];
                }
            }
            var newHandsonTableHelperObjControlChartSettings = {};
            for (var i in handsonTableHelperObjControlChartSettings) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjControlChartSettings[helper[0] + ',' + helper[1]] =
                        handsonTableHelperObjControlChartSettings[i];
                }
            }
            var newHandsonTableHelperObjHistogramSettings = {};
            for (var i in handsonTableHelperObjHistogramSettings) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjHistogramSettings[helper[0] + ',' + helper[1]] =
                        handsonTableHelperObjHistogramSettings[i];
                }
            }
            var newHandsonTableHelperObjParetoSettings = {};
            for (var i in handsonTableHelperObjParetoSettings) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjParetoSettings[helper[0] + ',' + helper[1]] =
                        handsonTableHelperObjParetoSettings[i];
                }
            }
            var newHandsonTableHelperObjStackingMapChartSettings = {};
            for (var i in handsonTableHelperObjStackingMapChartSettings) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjStackingMapChartSettings[helper[0] + ',' + helper[1]] =
                        handsonTableHelperObjStackingMapChartSettings[i];
                }
            }
            var newHandsonTableHelperObjBoxLineChartSettings = {};
            for (var i in handsonTableHelperObjBoxLineChartSettings) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjBoxLineChartSettings[helper[0] + ',' + helper[1]] =
                        handsonTableHelperObjBoxLineChartSettings[i];
                }
            }
            var newHandsonTableHelperObjPieChartSettings = {};
            for (var i in handsonTableHelperObjPieChartSettings) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjPieChartSettings[helper[0] + ',' + helper[1]] =
                        handsonTableHelperObjPieChartSettings[i];
                }
            }
            var newHandsonTableHelperObjSigmaMapSettings = {};
            for (var i in handsonTableHelperObjSigmaMapSettings) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjSigmaMapSettings[helper[0] + ',' + helper[1]] =
                        handsonTableHelperObjSigmaMapSettings[i];
                }
            }
            var newHandsonTableHelperObjParetos = {};
            for (var i in handsonTableHelperObjParetos) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjParetos[helper[0] + ',' + helper[1]] = handsonTableHelperObjParetos[i];
                }
            }
            var newHandsonTableHelperObjHistograms = {};
            for (var i in handsonTableHelperObjHistograms) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjHistograms[helper[0] + ',' + helper[1]] = handsonTableHelperObjHistograms[i];
                }
            }
            var newHandsonTableHelperObj = {};
            for (var i in handsonTableHelperObj) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObj[helper[0] + ',' + helper[1]] = handsonTableHelperObj[i];
                }
            }
            var newHandsonTableHelperObjImgs = {};
            for (var i in handsonTableHelperObjImgs) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjImgs[helper[0] + ',' + helper[1]] = handsonTableHelperObjImgs[i];
                }
            }
            var newHandsonTableHelperObjControlCharts = {};
            for (var i in handsonTableHelperObjControlCharts) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjControlCharts[helper[0] + ',' + helper[1]] = handsonTableHelperObjControlCharts[i];
                }
            }
            var newHandsonTableHelperObjBoxLineCharts = {};
            for (var i in handsonTableHelperObjBoxLineCharts) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjBoxLineCharts[helper[0] + ',' + helper[1]] = handsonTableHelperObjBoxLineCharts[i];
                }
            }
            var newHandsonTableHelperObjSigmaMaps = {};
            for (var i in handsonTableHelperObjSigmaMaps) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjSigmaMaps[helper[0] + ',' + helper[1]] = handsonTableHelperObjSigmaMaps[i];
                }
            }
            var newHandsonTableHelperObjPieCharts = {};
            for (var i in handsonTableHelperObjPieCharts) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjPieCharts[helper[0] + ',' + helper[1]] = handsonTableHelperObjPieCharts[i];
                }
            }
            var newHandsonTableHelperObjStackingMapCharts = {};
            for (var i in handsonTableHelperObjStackingMapCharts) {
                var helper = i.split(',');
                if (helper[0] == currSelection[0][0] && helper[1] == currSelection[0][1]) {

                } else {
                    newHandsonTableHelperObjStackingMapCharts[helper[0] + ',' + helper[1]] = handsonTableHelperObjStackingMapCharts[i];
                }
            }
            handsonTableHelperObjControlCharts = newHandsonTableHelperObjControlCharts;
            handsonTableHelperObjBoxLineCharts = newHandsonTableHelperObjBoxLineCharts;
            handsonTableHelperObjSigmaMaps = newHandsonTableHelperObjSigmaMaps;
            handsonTableHelperObjPieCharts = newHandsonTableHelperObjPieCharts;
            handsonTableHelperObjStackingMapCharts = newHandsonTableHelperObjStackingMapCharts;
            handsonTableHelperObjSigmaMapSettings = newHandsonTableHelperObjSigmaMapSettings
            handsonTableHelperObjBoxLineChartSettings = newHandsonTableHelperObjBoxLineChartSettings
            handsonTableHelperObjPieChartSettings = newHandsonTableHelperObjPieChartSettings
            handsonTableHelperObjStackingMapChartSettings = newHandsonTableHelperObjStackingMapChartSettings
            handsonTableHelperObjParetoSettings = newHandsonTableHelperObjParetoSettings
            handsonTableHelperObjParetos = newHandsonTableHelperObjParetos;
            handsonTableHelperObjHistograms = newHandsonTableHelperObjHistograms;
            handsonTableHelperObjTrendMaps = newHandsonTableHelperObjTrendMaps;
            handsonTableHelperObjTrendMapSettings = newHandsonTableHelperObjTrendMapSettings;
            handsonTableHelperObjControlChartSettings = newHandsonTableHelperObjControlChartSettings;
            handsonTableHelperObjHistogramSettings = newHandsonTableHelperObjHistogramSettings;
            handsonTableHelperObj = newHandsonTableHelperObj;
            handsonTableHelperObjImgs = newHandsonTableHelperObjImgs;
        }
    }
}

function stabilizeHandsonTable() {
    //can I refactor this out...?
    setTimeout(function() {
        var wtHolder = $(handsonTable.table).parents('.wtHolder');
        var wtHider = $(handsonTable.table).parents('.wtHider');
        if (wtHolder.length > 0 && wtHider.length > 0) {
            $(wtHolder[0]).width(handsonTable.table.clientWidth);
            $(wtHolder[0]).height(handsonTable.table.clientHeight);
            $(wtHider[0]).width(handsonTable.table.clientWidth);
            $(wtHider[0]).height(handsonTable.table.clientHeight);
        }
        $("#handsonContainer").width(handsonTable.table.clientWidth);
        $("#handsonContainer").height(handsonTable.table.clientHeight);

        //ToDo- Make sure htCore left has the same height as the main htCore table

        //checkConditions();
        //resizeCharts();
    }, 100);
}

function stabilizeHandsonTableSides() {
    //timeouts like these need to eventually be replaced with complete event handlers for instance
    //event that gets fired when all the images and charts are completely loaded and rendered
    setTimeout(function() {
        //ht_master
        var htMasterWidth = $('#handsonContainer .ht_master').width();
        var htMasterHeight = $('#handsonContainer .ht_master').height();
        //ht_clone_top
        $('#handsonContainer .ht_clone_top').width(htMasterWidth);
        $('#handsonContainer .ht_clone_top .wtHider').width(htMasterWidth);
        $('#handsonContainer .ht_clone_top .wtHolder').width(htMasterWidth);

        //ht_clone_left
        $('#handsonContainer .ht_clone_left').height(htMasterHeight);
        $('#handsonContainer .ht_clone_left .wtHider').height(htMasterHeight);
        $('#handsonContainer .ht_clone_left .wtHolder').height(htMasterHeight);
    }, 100);
}

function closeFormBombBox() {
    layer.closeAll();
}

function getMergedCellHeightAndWidth(row, col) {
    var retObj = {height: 20, width: 20};
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

/*
 * Merge Cell looks like this
 * row: 1
 * col: 1
 * rowspan: 2
 * colspan: 2
*/
function isPartOfMergeCell(row, col, mergeCell) {
    //check if row is outside row to (row + (rowspan - 1))
    if (!isNaN(row) && typeof row !== 'undefined' && (row < mergeCell.row || row > (mergeCell.row + (mergeCell.rowspan - 1)))) {
        return false;
    }

    //check if col is outside col to (col + (colspan - 1))
    if (!isNaN(col) && typeof col !== 'undefined' && (col < mergeCell.col || col > (mergeCell.col + (mergeCell.colspan - 1)))) {
        return false;
    }

    //must be part of merge cell, return true
    return true;
}

function isPartOfMergeCellAlt(row, col, mergeCell) {
    //check if row is outside row to (row + (rowspan - 1))
    if (row && typeof row !== 'undefined' && (row < mergeCell.row || row > (mergeCell.row + (mergeCell.rowspan - 1)))) {
        return false;
    }

    //check if col is outside col to (col + (colspan - 1))
    if (col && typeof col !== 'undefined' && (col < mergeCell.col || col > (mergeCell.col + (mergeCell.colspan - 1)))) {
        return false;
    }

    //must be part of merge cell, return true
    return true;
}

function getMergeCellWidthAndHeight(mergeCell) {
    var retObj = {height: 20, width: 20};
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

function getRealHandsonTableRowHeightsAndColWidths() {
    var retObj = {rowHeights: [], colWidths: []};
    var rowIndex = 0;
    $('#handsonContainer .ht_master.handsontable .htCore tr').each(function() {
        if (rowIndex > 0) {
            var rowHeight = $(this).height();
            retObj.rowHeights.push(rowHeight);
        }
        if (rowIndex == 1) {
            var colIndex = 0;
            $(this).find('td').each(function() {
                if (colIndex > 0) {
                    var colWidth = $(this).width();
                    retObj.colWidths.push(colWidth);
                }
                colIndex++;
            });
        }
        rowIndex++;
    });
    return retObj;
}

function populateCellWithCommand(value) {
    var currSelection = handsonTable.getSelected();
    var tempHandsonTableOptions = handsonTable.getSettings();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    tempHandsonTableOptions.data[currSelection[0][0]][currSelection[0][1]] = value;

    handsonTable.updateSettings(tempHandsonTableOptions);
}

function IndicatorLineAddAlt(instructionLine){//指示线添加
    var html = ""
    html += '<div class="cellAttribute"  style="position: relative">'
    html += '<span onclick="IndicatorLineDelete(this)" style="display: none;position: absolute;top: 15px" class="IndicatorLineDelete bigDeleteAttributeCommand element elshanchu11 fl MrginL10"></span>'
    html += '<div class="bigAttribute">'
    html += '<div class="AddingConditions">'
    html += '<ul>'
    html += '<li>'
    html += '<label>方式</label>'
    html += '<select id="" class="IndicatorLineStyleChange iLSel1">'
    html += '<option value="1">定义区间</option>'
    html += '<option value="2">选择参数</option>'
    // html += '<option value="3">椭圆</option>'
    html += '</select>'
    html += '</li>'
    if (instructionLine.IndicatorLineStyleChange === '1') {
        html += '<li>'
        html += '<label>数值区间</label><input class="iLInputFrom" style="width: 40px;margin-right: 10px" type="text">-'
        html += '<input class="MrginL10 iLInputTo" style="width: 40px;margin-right: 10px" type="text">'
        html += '</li>'
    } else if (instructionLine.IndicatorLineStyleChange === '2') {
        html += '<li>';
        html += '<label>参数</label>'
        html += '<select style="max-width: 50px;margin-left: 2px !important;" class="iLSelParam1">'
        html += '<option value="">均值</option>'
        html += '</select>'
        html += '<select style="max-width: 50px;margin-left: 5px !important;" class="iLSelParam2">'
        html += '<option value="">*</option>'
        html += '</select>'
        html += '<input type="number" class="RangeNumber" value="1"  style="max-width: 60px;margin-left: 2px !important;" />'
        html += '</li>'
    } //ToDo if === 3
    /*else {
        html+='<li>'
		html+='<label>长轴</label>'
		html+='<input type="number" class="" value="1"  style="max-width: 160px;" />'
		html+='</li>'
		html+='<li>'
		html+='<label>短轴</label>'
		html+='<input type="number" class="" value="1"  style="max-width: 160px;" />'
		html+='</li>'
    }*/
    html+='<li>'
    html+='<label>宽度</label>'
    html+='<input type="number" class="iLWidthInput1" value="1"  style="max-width: 160px;" />'
    html+='</li>'
    html += '<li>'
    html += '<label>类型</label>'
    html += '<div class="publicSelect fl" style="">'
    html += '<p class="publicSelectInput" style=""></p>'
    html += '<div class="publicSelectBody" style="">'
    html += '<p class="publicSelectBodyP"><span class="element elxuxian"></span></p>'
    html += '<p class="publicSelectBodyP"><span class="element elshixianhei"></p>'
    html += '</div>'
    html += '</div>'
    html += '</li>'
    html += '<li>'
    html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
    html += '<li>'
    html += '<label>'
    html += '<span style="vertical-align: top;">颜色</span></label>'
    html += '<div style="" class="fl BGCDiv">'
    html += '<input id="BackgroundColor" style="" onchange="BackgroundColor(this)" style="max-width: 20px;" class="iLColor1 BackgroundColor" value="" />'
    html += '</div>'
    html += '<input type="number" placeholder="请输入值" value="100" min="0" max="100" class="iLInput2 fl" style="max-width: 100px;" />'
    html += '</li>'
    html += '</ul>'
    html += '</li>'
    html += '<li><label><input class="iLCb1" type="checkbox"><span style="vertical-align: top;">显示数值</span></label></li>'
    html += '</ul>'
    html += '</div>'
    html += '</div>'

    html += '</div>'
    $(".publicStyle").find(".IndicatorLineAdd").append(html)
    $(".publicStyle").find(".IndicatorLineAdd").find(".cellAttribute:last-child").find("#BackgroundColor").colorpicker() //底色调用
    var newIndicatorLineAdd = $(".publicStyle").find(".IndicatorLineAdd").find(".cellAttribute:last-child");
    $(newIndicatorLineAdd).find('.cellProperties').val(getNullableValue(instructionLine.cellProperties));
    $(newIndicatorLineAdd).find('.iLParameter').val(getNullableValue(instructionLine.iLParameter));
    $(newIndicatorLineAdd).find('.iLSel1').val(getNullableValue(instructionLine.iLSel1));
    $(newIndicatorLineAdd).find('.iLInput1').val(getNullableValue(instructionLine.iLInput1));
    $(newIndicatorLineAdd).find('.iLInputFrom').val(getNullableValue(instructionLine.iLInputFrom));
    $(newIndicatorLineAdd).find('.iLInputTo').val(getNullableValue(instructionLine.iLInputTo));
    $(newIndicatorLineAdd).find('.iLWidthInput1').val(getNullableValue(instructionLine.iLWidthInput1));
    $(newIndicatorLineAdd).find('.iLTypesSel1').val(getNullableValue(instructionLine.iLTypesSel1));
    $(newIndicatorLineAdd).find('.iLSelParam1').val(getNullableValue(instructionLine.iLSelParam1));
    $(newIndicatorLineAdd).find('.iLSelParam2').val(getNullableValue(instructionLine.iLSelParam2));
    $(newIndicatorLineAdd).find('.RangeNumber').val(getNullableValue(instructionLine.RangeNumber));
    $(newIndicatorLineAdd).find('.WidthNumber').val(getNullableValue(instructionLine.WidthNumber));
    $(newIndicatorLineAdd).find('.iLColor1.BackgroundColor').val(getNullableValue(instructionLine.BackgroundColor));
    $(newIndicatorLineAdd).find('.iLColor1.BackgroundColor').next('div')
        .css('background-color', getNullableValue(instructionLine.BackgroundColor));
    $(newIndicatorLineAdd).find('.iLColor1.BackgroundColor')
        .css('background-color', getNullableValue(instructionLine.BackgroundColor));
    console.log(".iLColor1.BackgroundColor color is: " + $(newIndicatorLineAdd).find('.iLColor1.BackgroundColor').val());
    //$(newIndicatorLineAdd).find('.BackgroundColor').val(getNullableValue(instructionLine.BackgroundColor));
    $(newIndicatorLineAdd).find('.iLInput2').val(getNullableValue(instructionLine.iLInput2));
    $(newIndicatorLineAdd).find('.iLSelParam1').val(getNullableValue(instructionLine.iLSelParam1));
    $(newIndicatorLineAdd).find('.iLCb1').prop('checked', getNullableValue(instructionLine.iLCb1));
    $(newIndicatorLineAdd).find('.iLCb2').prop('checked', getNullableValue(instructionLine.iLCb2));
    $(newIndicatorLineAdd).find('.IndicatorLineStyleChange').val(getNullableValue(instructionLine.IndicatorLineStyleChange));
    $(newIndicatorLineAdd).find('.iLMapNumIntFrom1').val(getNullableValue(instructionLine.iLMapNumIntFrom1));
    $(newIndicatorLineAdd).find('.iLMapNumIntFrom2').val(getNullableValue(instructionLine.iLMapNumIntFrom2));
    if (instructionLine.publicSelectInput === 'empty') {
        $(newIndicatorLineAdd).find('.publicSelectInput').html('<span class="element elxuxian"></span>');
    } else if (instructionLine.publicSelectInput === 'real') {
        $(newIndicatorLineAdd).find('.publicSelectInput').html('<span class="element elshixianhei"></span>');
    }
    //$(newIndicatorLineAdd).find('.publicSelectInput').attr('value', getNullableValue(instructionLine.publicSelectInput));
}

function DataStyleAddAlt(dataStyle){//数据样式添加
    var html = ""
    html += '<div class="cellAttribute"  style="position: relative">'
    html += '<span onclick="DataStyleDelete(this)" style="display: none;position: absolute;top: 15px" class="IndicatorLineDelete bigDeleteAttributeCommand element elshanchu11 fl MrginL10"></span>'
    html += '<div class="bigAttribute">'
    html += '<div class="AddingConditions">'
    html += '<ul>'
    html += '<li>'
    html += '<select style="max-width: 40px;margin-left: 45px !important;" class="dSYValueSel1">'
    html += '<option value="greaterThan"> > </option>'
    html += '<option value="lessThan"> < </option>'
    html += '<option value="equalTo"> = </option>'
    html += '</select>'
    html += '<select style="max-width: 70px;margin-left: 10px !important;" class="dSStyleSel1">'
    html += '<option value="1">常量</option>'
    html += '<option value="2">上公差</option>'
    html += '<option value="3">下公差</option>'
    html += '<option value="4">均值</option>'
    html += '</select>'
    html += '<input type="number" class="dSRangeNumber1" value="1" style="max-width: 40px;margin-left: 5px !important;">'
    html += '</li>'
    html += '<li>'
    html += '<select style="max-width: 40px;margin-left: 45px !important;" class="dSYValueSel2">'
    html += '<option value=""> > </option>'
    html += '<option value=""> < </option>'
    html += '<option value=""> = </option>'
    html += '</select>'
    html += '<select style="max-width: 70px;margin-left: 10px !important;" class="dSStyleSel2">'
    html += '<option value="">常量</option>'
    html += '<option value="">上公差</option>'
    html += '<option value="">下公差</option>'
    html += '<option value="">均值</option>'
    html += '</select>'
    html += '<input type="number" class="dSRangeNumber2" value="1" style="max-width: 40px;margin-left: 5px !important;">'
    html += '</li>'
    html += '<li>'
    html += '<label>数据样式</label>'
    html += '<div style="position: relative;float: left" class="DataType">'
    html += '<p class="Mrgin0 DataTypeShow">'
    html += '<span class=""></span>'
    html += '</p>'
    html += '<div class="DataTypeBody" style="padding:7px 0px">'
    html += '<span class="element elzhengfangxing" value="3" style="margin-left: 10px !important;"></span>'
    html += '<span class="element elduobianxing" value="9" style="margin-left: 10px !important;"></span>'
    html += '<span class="element elsanjiaoxing" value="5" style="margin-left: 10px !important;"></span>'
    html += '<span class="element elyuanxing2" value="6" style="margin-left: 10px !important;"></span>'
    html += '<span class="element ellingxing2" value="2" style="margin-left: 10px !important;"></span>'
    html += '</div>'
    html += '</div>'
    html += '</li>'
    html += '<li>'
    html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
    html += '<li>'
    html += '<label>'
    html += '<input type="checkbox" class="dSCb1">'
    html += '<span style="vertical-align: top;">底色</span>'
    html += '</label>'
    html += '<div style="" class="fl BGCDiv">'
    html += '<div style="width:60px;" class="evo-cp-wrap">'
    html += '<input id="BackgroundColor" style="" onchange="BackgroundColor(this)" class="dsBgColorInput1 BackgroundColor BackgroundColor1 colorPicker evo-cp15" value="#FFF">'
    html += '<div class="evo-pointer evo- colorind" style="background-color:#FFF"></div>'
    html += '</div>'
    html += '</div>'
    html += '<input type="number" placeholder="透明度" value="" min="0" max="100" class="fl dSTransparency1" style="max-width: 100px;">'
    html += '</li>'
    html += '</ul>'
    html += '</li>'
    html += '<li>'
    html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
    html += '<li>'
    html += '<label>'
    html += '<input type="checkbox" class="dSCb2">'
    html += '<span style="vertical-align: top;">边框</span>'
    html += '</label><div style="" class="fl BGCDiv">'
    html += '<div style="width:60px;" class="evo-cp-wrap">'
    html += '<input id="BackgroundColor" style="" onchange="BackgroundColor(this)" class="colorPicker evo-cp16 dSFrameBgColor" value="#FFF">'
    html += '<div class="evo-pointer evo-colorind" style="background-color:#FFF">'
    html += '</div>'
    html += '</div>'
    html += '</div>'
    html += '<input type="number" placeholder="宽度" value="" min="0" max="100" class="fl dSWidth" style="max-width: 100px;">'
    html += '</li>'
    html += '</ul>'
    html += '</li>'
    html += '<li>'
    html += '<label></label>'
    html += '<div class="publicSelect fl" style="">'
    html += '<p class="publicSelectInput" style=""></p>'
    html += '<div class="publicSelectBody" style="">'
    html += '<p class="publicSelectBodyP"><span class="element elxuxian" value="empty"></span></p>'
    html += '<p class="publicSelectBodyP"><span class="element elshixianhei" value="real"></span></p>'
    html += '</div>'
    html += '</div>'
    html += '</li>'
    html += '<li>'
    html += '<label>'
    html += '<input type="checkbox" class="dSCb3">'
    html += '<span style="vertical-align: top;">显示数值</span></label>'
    html += '</li>'
    html += '</ul>'
    html += '</div>'
    html += '</div>'
    html += '</div>'
    $(".publicStyle").find(".DataStyleAdd").append(html)
    $(".publicStyle").find(".DataStyleAdd").find(".cellAttribute:last-child").find("#BackgroundColor").colorpicker() //底色调用
    var newDataStyleAdd = $(".publicStyle").find(".DataStyleAdd").find(".cellAttribute:last-child");
    $(newDataStyleAdd).find('.dSYValueSel1').val(getNullableValue(dataStyle.dSYValueSel1));
    $(newDataStyleAdd).find('.dSYValueSel2').val(getNullableValue(dataStyle.dSYValueSel2));
    $(newDataStyleAdd).find('.dSYValueInput1').val(getNullableValue(dataStyle.dSYValueInput1));
    $(newDataStyleAdd).find('.dSBgColorCb1').val(getNullableValue(dataStyle.dSBgColorCb1));
    $(newDataStyleAdd).find('.dSBgColorInput1').val(getNullableValue(dataStyle.dSBgColorInput1));
    $(newDataStyleAdd).find('.dSBgColorTransparency1').val(getNullableValue(dataStyle.dSBgColorTransparency1));
    $(newDataStyleAdd).find('.dSFrameCb1').val(getNullableValue(dataStyle.dSFrameCb1));
    $(newDataStyleAdd).find('.dSFrameColor1').val(getNullableValue(dataStyle.dSFrameColor1));
    $(newDataStyleAdd).find('.dSFrameColorTransparency1').val(getNullableValue(dataStyle.dSFrameColorTransparency1));
    $(newDataStyleAdd).find('.dSStyleSel1').val(getNullableValue(dataStyle.dSStyleSel1));
    $(newDataStyleAdd).find('.dSStyleSel2').val(getNullableValue(dataStyle.dSStyleSel2));
    $(newDataStyleAdd).find('.dSRangeNumber1').val(getNullableValue(dataStyle.dSRangeNumber1));
    $(newDataStyleAdd).find('.dSRangeNumber2').val(getNullableValue(dataStyle.dSRangeNumber2));
    $(newDataStyleAdd).find('.dSWidth').val(getNullableValue(dataStyle.dSWidth));
    $(newDataStyleAdd).find('.dSRangeNumber2').val(getNullableValue(dataStyle.dSRangeNumber2));
    $(newDataStyleAdd).find('.dSFrameBgColor').val(getNullableValue(dataStyle.dSFrameBgColor));

    $(newDataStyleAdd).find('.dsBgColorInput1')
        .css('background-color', getNullableValue(dataStyle.dSBgColorInput1));
    $(newDataStyleAdd).find('.dsBgColorInput1').val(getNullableValue(dataStyle.dSBgColorInput1));
    $(newDataStyleAdd).find('.dsBgColorInput1').next('div')
        .css('background-color', getNullableValue(dataStyle.dSBgColorInput1));
    $(newDataStyleAdd).find('.dsBgColorInput1')
        .css('background-color', getNullableValue(dataStyle.dSBgColorInput1));

    var dataStyle_DSBgColor = $(newDataStyleAdd).find('.DSBgColor');
    if (typeof dataStyle.DSBgColor !== 'undefined' && dataStyle_DSBgColor.length > 0) {
        $(dataStyle_DSBgColor[0])
            .css('background-color', getNullableValue(dataStyle.DSBgColor));
        $(dataStyle_DSBgColor[0]).val(getNullableValue(dataStyle.DSBgColor));
        $(dataStyle_DSBgColor[0]).next('div')
            .css('background-color', getNullableValue(dataStyle.DSBgColor));
        $(dataStyle_DSBgColor[0])
            .css('background-color', getNullableValue(dataStyle.DSBgColor));
    }

    $(newDataStyleAdd).find('.dSTransparency1').val(getNullableValue(dataStyle.dSTransparency1));
    $(newDataStyleAdd).find('.dSCb1').prop('checked', getNullableValue(dataStyle.dSCb1));
    $(newDataStyleAdd).find('.dSCb2').prop('checked', getNullableValue(dataStyle.dSCb2));
    $(newDataStyleAdd).find('.dSCb3').prop('checked', getNullableValue(dataStyle.dSCb3));
    $(newDataStyleAdd).find('.DataTypeShow .element').attr('value', getNullableValue(dataStyle.DataTypeShowElement));
    //empty
    //<span class="element elxuxian"></span>
    //real
    //<span class="element elshixianhei"></span>
    if (dataStyle.publicSelectInput === 'empty') {
        $(newDataStyleAdd).find('.publicSelectInput').html('<span class="element elxuxian"></span>');
    } else if (dataStyle.publicSelectInput === 'real') {
        $(newDataStyleAdd).find('.publicSelectInput').html('<span class="element elshixianhei"></span>');
    }
    //$(newDataStyleAdd).find('.publicSelectInput').attr('value', getNullableValue(dataStyle.publicSelectInput));
}

function getNullableValue(value) {
    if (typeof value === 'undefined')
        return '';
    else
        return value;
}

function updateRowHeadersAndColHeaders() {
    var numOfRows = handsonTable.countRows();
    var numOfCols = handsonTable.countCols();
    /*for (var i = 0; i < numOfRows; i++) {
        var heightHelper = handsonTable.getRowHeight(i);
    }*/
    var rowCounter = 0;
    var colCounter = 0;
    $('#handsonContainer .ht_clone_top .htCore .colHeader').each(function() {
        if (colCounter > 0) {//<= numOfCols) {
            var h = $(this).html();
            var hSplitted = h.split(',');
            var colWidth = handsonTable.getColWidth(colCounter-1);
            colWidth = parseFloat(colWidth.toFixed(1))
            $(this).html(hSplitted[0] + ',w:' + colWidth);
        }
        colCounter++;
    });

    /*for (var i = 0; i < numOfCols; i++) {
        var widthHelper = handsonTable.getColWidth(i);
    }*/
    $('#handsonContainer .ht_clone_left .htCore .rowHeader').each(function() {
        if (rowCounter > 0) {// <= numOfRows) {
            var h = $(this).html();
            var hSplitted = h.split(',');
            var rowHeight = handsonTable.getRowHeight(rowCounter-1);
            rowHeight = parseFloat(rowHeight.toFixed(1))
            $(this).html(hSplitted[0] + ',h:' + rowHeight);
        }
        rowCounter++;
    });
}

function saveAllStuffToLocalStorage() {
    localStorage.setItem('handsonTableHelperObj', JSON.stringify(handsonTableHelperObj));
}

function retrieveStuffFromLocalStorage(whatToRetrieve) {
    return;
}