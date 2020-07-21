
/**
 *  切换报告获取值
 * @param val
 */
function handoverReport(val, isFromUpdateLabel) {
	if(val == '') {
		return;
	}

    $('.spinner, #overlay').show();
    $.ajax({
        type: "POST",
        url: "/customReport/"+val,
        dataType: "json",
        cache: false,
        // async: false,
        success: function (data) {

            // console.log(data.json);//模版json
            handsonTableOptions = JSON.parse(data.json);
            handsonTableOptions = handsonTableOptions||{}
                handsonTableHelperObj = handsonTableOptions.handsonTableHelperObj || {};

                //muban stuff
                var muban_handsonTableOptions_arr = handsonTableOptions.muban_handsonTableOptions_arr||[]
                var muban_handsonTableOptionsAdd_arr = handsonTableOptions.muban_handsonTableOptionsAdd_arr||[]
                // 生成母版
                mubanInitFromHandOver(muban_handsonTableOptions_arr, muban_handsonTableOptionsAdd_arr)

                handsonTableHelperObjParetos = handsonTableOptions.handsonTableHelperObjParetos || {};//JSON.parse(handsonTableOptions.handsonTableHelperObjParetos);
                handsonTableHelperObjParetoSettings = handsonTableOptions.handsonTableHelperObjParetoSettings || {};//JSON.parse(handsonTableOptions.handsonTableHelperObjParetos);
                handsonTableHelperObjParetoSettingsOriginal = handsonTableOptions.handsonTableHelperObjParetoSettings || {};//JSON.parse(handsonTableOptions.handsonTableHelperObjParetos);
                handsonTableHelperObjHistograms = handsonTableOptions.handsonTableHelperObjHistograms || {};
                handsonTableHelperObjTrendMaps = handsonTableOptions.handsonTableHelperObjTrendMaps || {};
                handsonTableHelperObjControlCharts = handsonTableOptions.handsonTableHelperObjControlCharts || {};
                handsonTableHelperObjBoxLineCharts = handsonTableOptions.handsonTableHelperObjBoxLineCharts || {};
                handsonTableHelperObjSigmaMaps = handsonTableOptions.handsonTableHelperObjSigmaMaps || {};
//danYangBen
                handsonTableHelperObjPieCharts = handsonTableOptions.handsonTableHelperObjPieCharts || {};
                handsonTableHelperObjStackingMapCharts = handsonTableOptions.handsonTableHelperObjStackingMapCharts || {};
                handsonTableHelperObjImgs = handsonTableOptions.handsonTableHelperObjImgs || {};
                handsonTableHelperObjTrendMapSettings = handsonTableOptions.handsonTableHelperObjTrendMapSettings || {};
                handsonTableHelperObjTrendMapSettingsOriginal = handsonTableOptions.handsonTableHelperObjTrendMapSettings || {};
                handsonTableHelperObjHistogramSettings = handsonTableOptions.handsonTableHelperObjHistogramSettings || {};
                handsonTableHelperObjHistogramSettingsOriginal = handsonTableOptions.handsonTableHelperObjHistogramSettings || {};
                handsonTableHelperObjControlChartSettings =
                    handsonTableOptions.handsonTableHelperObjControlChartSettings || {};
                handsonTableHelperObjControlChartSettingsOriginal =
                    handsonTableOptions.handsonTableHelperObjControlChartSettings || {};
                handsonTableHelperObjHistogramSettings = handsonTableOptions.handsonTableHelperObjHistogramSettings || {};
                handsonTableHelperObjHistogramSettingsOriginal = handsonTableOptions.handsonTableHelperObjHistogramSettings || {};
                handsonTableHelperObjBoxLineChartSettings = handsonTableOptions.handsonTableHelperObjBoxLineChartSettings || {};
                handsonTableHelperObjBoxLineChartSettingsOriginal = handsonTableOptions.handsonTableHelperObjBoxLineChartSettings || {};
                handsonTableHelperObjSigmaMapSettings = handsonTableOptions.handsonTableHelperObjSigmaMapSettings || {};
                handsonTableHelperObjSigmaMapSettingsOriginal = handsonTableOptions.handsonTableHelperObjSigmaMapSettings || {};
                handsonTableHelperObjPieChartSettings = handsonTableOptions.handsonTableHelperObjPieChartSettings || {};
                handsonTableHelperObjPieChartSettingsOriginal = handsonTableOptions.handsonTableHelperObjPieChartSettings || {};
                handsonTableHelperObjStackingMapChartSettings = handsonTableOptions.handsonTableHelperObjStackingMapChartSettings || {};
                handsonTableHelperObjStackingMapChartSettingsOriginal = handsonTableOptions.handsonTableHelperObjStackingMapChartSettings || {};
                var colNum = handsonTableOptions.numOfCols;
                var rowNum = handsonTableOptions.numOfRows;
                var emptyData = [];
                for (var i = 0; i < rowNum; i++) {
                    var k = [];
                    for (var j = 0; j < colNum; j++) {
                        k.push(Math.floor(Math.random() * 100));
                    }
                    emptyData.push(k)
                }
                var columnsArr = [];
                for (var i = 0; i < colNum; i++) {
                    columnsArr.push({renderer: "html"});
                }

                if (handsonTableOptions.data) {
                    handsonTableOptionsData = JSON.parse(JSON.stringify(handsonTableOptions.data))
                } else {
                    handsonTableOptionsData = {}
                }

                // 将数据置为空字符串
                if (handsonTableOptions.data) {
                    for (var i = 0; i < handsonTableOptions.data.length; i++) {
                        for (var j = 0; j < handsonTableOptions.data[i].length; j++) {
                            if (!handsonTableOptions.data[i][j] || typeof handsonTableOptions.data[i][j] === 'undefined') {
                                handsonTableOptions.data[i][j] = '';
                            }
                        }
                    }
                }

                handsonTableOptions = {
                    data: handsonTableOptions.data,//Handsontable.helper.createSpreadsheetData(6, 6),
                    rowHeaders: false,
                    colHeaders: false,
                    width: handsonTableOptions.width,//200,//'100%',
                    height: handsonTableOptions.height,//160,
                    colWidths: handsonTableOptions.colWidths,//[30, 30, 30, 30, 30, 30],
                    rowHeights: handsonTableOptions.rowHeights,//[25, 25, 25, 25, 25, 25],
                    columns: columnsArr,
                    manualColumnResize: false,
                    manualRowResize: false,
                    outsideClickDeselects: false,
                    selectionMode: 'multiple',
                    margeCells: true,
                    mergeCells: handsonTableOptions.mergeCells
                };
                handsonTableOptionsOriginal = {
                    data: handsonTableOptions.data,//Handsontable.helper.createSpreadsheetData(6, 6),
                    rowHeaders: false,
                    colHeaders: false,
                    width: handsonTableOptions.width,//200,//'100%',
                    height: handsonTableOptions.height,//160,
                    colWidths: handsonTableOptions.colWidths,//[30, 30, 30, 30, 30, 30],
                    rowHeights: handsonTableOptions.rowHeights,//[25, 25, 25, 25, 25, 25],
                    columns: columnsArr,
                    manualColumnResize: false,
                    manualRowResize: false,
                    outsideClickDeselects: false,
                    selectionMode: 'multiple',
                    margeCells: true,
                    mergeCells: handsonTableOptions.mergeCells
                };
                var helperElement = document.getElementById('testContainer');
                helperElement.innerHTML = '';
                if (handsonTable) {
                    handsonTable.destroy();
                    handsonTable = null;
                }
                // 生成标签框表格
                handsonTable = new Handsontable(helperElement, handsonTableOptions);
            // 生成报告下拉列表
            if (typeof isFromUpdateLabel === 'undefined' || !isFromUpdateLabel) {
                make();
                //$('.spinner, #overlay').hide();
            } else {
                make(true);
                //$('.spinner, #overlay').hide();
            }

            // 加载配置项
            // loadSettings();
        },
        error: function() {

        }
    });
}

/**
 * 加载设置项
 * @author nikoohp
 */
function loadSettings() {
    $.ajax({
        url: '/report/loadModelView',
        type: 'get',
        dataType: 'json',
        sync: true,
        data: {
            routineId: rId,
            reportId: reportId,
            page: $("#boxs").find("option:selected").index() || 1
        },
        success: function (res) {

            if (!res || !res.data) {
                res.data = {}
            } else {
                var _target = [+res.data.targetX, +res.data.targetY, +res.data.targetZ];
                var _eyePos = [+res.data.eyePosX, +res.data.eyePosY, +res.data.eyePosZ];
                var _up = [+res.data.upX, +res.data.upY, +res.data.upZ];
                // 记录视口位置
                globalObj.navigatorView = {
                    _target: _target,
                    _eyePos: _eyePos,
                    _up: _up
                }

            }

            // 设置视图
            // navigatorViewReverse(_target, _eyePos, _up);
            // 更新测点位置
            // refreshPointLocation();

            // 缓存设置的值
            Object.assign(globalObj.spacing, {
                chartSpacingLeftRight: res.data.chartMarginLeft || 5,
                chartSpacingUpDown: res.data.chartMarginTop || 5,
                pageSpacingLeftRight: res.data.pageMarginLeft || 0,
                pageSpacingUpDown: res.data.pageMarginTop || 0,
                numOfPages: res.data.pointCount || 4,
                apply: res.data.apply || 0,
                currentPage: res.data.page || 1
            });

            // 生成页数
            generatePages();
        }
    });
}

/**
 * 根据配置生成报告的页数
 * @author nikoohp
 */
function generatePages() {
    // 该模型所有的测点
    var $pointData = $("#iframe-" + rId)[0].contentWindow.getSpecialPointData();

    var options = "<option value=\"-1\">请选择</option>\n";

    var array = [];
    var page = 0;
    // 根据每页的设置变换
    var _beforePageSize = globalObj.spacing._beforePageSize || globalObj.spacing.numOfPages;
    // 每页显示点的个数
    var perPageShowCount = globalObj.spacing.numOfPages;
    // 当前显示的是第几页
    var currentPage = globalObj.spacing.currentPage || 1;
    // 应用范围
    var apply = globalObj.spacing.apply;

    $pointData.forEach(function (item, idx) {
        if (apply === 'after' && idx <= currentPage * _beforePageSize) {
            if (idx > 0 && idx % _beforePageSize === 0) {
                options += "<option zdy='" + JSON.stringify(array) + "' value='" + idx + "'>第" + (++page) + "页</option>";
                array = [];
            }
        } else {
            if (idx > 0 && idx % perPageShowCount === 0) {
                options += "<option zdy='" + JSON.stringify(array) + "' value='" + idx + "'>第" + (++page) + "页</option>";
                array = [];
            }
        }

        array.push(item);
    });

    if (array.length > 0) {
        options += "<option zdy='" + JSON.stringify(array) + "' value='" + data.length + "'>第" + (++page) + "页</option>";
        $("#boxs").append(options);
    }

    $("#boxs").html(options);
    $('body').append('<div class="selectnodeCompleted"></div>');

    $('.spinner, #overlay').hide();

    samples1 = [];

    // 选中报告第一页
    if (!window._notFirstLoad) {
        window._notFirstLoad = true;
        setTimeout(() => {
            $('#boxs').find('option').eq(1).attr("selected", true);
            window.showReport();
        }, 16);
    }
}
