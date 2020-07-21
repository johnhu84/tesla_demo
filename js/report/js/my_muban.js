var muban_handsonTable_arr = []
var muban_handsonTableImgs = []//array of {}'s
var muban_Imgs = []
var specialPointsArr = []
var yemianOrMubanMode = 1 //1 is yemian, 2 is muban
var currentReportPage = -1 //this is a hack, will fix/change later
var handsonTableSelected = -1
const SELECTOR_MODE_NONE = 0;
const SELECTOR_MODE_SINGLE = 1;
const SELECTOR_MODE_BOX_TOP4 = 2;
const SELECTOR_MODE_UNBOX = 3;
const SELECTOR_MODE_BOX_ALL = 4;
const SELECTOR_MODE_UNBOX_ALL = 5;
var renderer, container, topLabel, rightLabel, bottomLabel, leftLabel;
var globalObj = {
    loadedObjects: [],
    lights: [],
    explodeMode: { enabled: false, carModelMode: 1 },
    colorMode: { enabled: false },
    lightMode: { enabled: false },
    truncateMode: { enabled: false },
    selectMode: { enabled: false },
    labelPosition: { up: true, down: true, left: true, right: true },
    labelsNeedUpdate: false,
    spacing: {
        pageSpacingUpDown: 0,
        pageSpacingLeftRight: 0,
        chartSpacingUpDown: 5,
        chartSpacingLeftRight: 5,
        numOfPages: 12
    },
    labelDimensions: {
        up: { width: 0, height: 0 },
        down: { width: 0, height: 0 },
        left: { width: 0, height: 0 },
        right: { width: 0, height: 0 },
        labels: []
    },
    randomPoints: [],
    beforeOrAfterSelectedPage: {selectedPage: -1, beforeOrAfter: ""},
    existingVertices: [],
    selectedmxGraphVertex: -1
};
var handsonTable;
var handsonTableOptions;
var handsonTableOptionsOriginal;
//holds rules retrieved by report
var handsonTableHelperObj;
//helper object for getLabelPositions2, this requirement fulfills the 3 tables per point, scaling size of each handson table
var getLabelPositions2HelperObj = {};
//holds pareto charts retrieved from report
var handsonTableHelperObjParetos;
var handsonTableHelperObjParetoSettings;
var handsonTableHelperObjParetoSettingsOriginal;
//cache data to hold original handsonTableOptionsData
var handsonTableOptionsData;
var handsonTableHelperObjTrendMapsCache = {};
var handsonTableHelperObjTrendMapSettings;
var handsonTableHelperObjTrendMapSettingsOriginal;
var handsonTableHelperObjControlChartSettings;
var handsonTableHelperObjControlChartSettingsOriginal;
var handsonTableHelperObjHistograms;
var handsonTableHelperObjHistogramSettings;
var handsonTableHelperObjHistogramSettingsOriginal;
var handsonTableHelperObjControlCharts;
var handsonTableHelperObjBoxLineCharts;
var handsonTableHelperObjBoxLineChartSettings;
var handsonTableHelperObjBoxLineChartSettingsOriginal;
var handsonTableHelperObjSigmaMaps;
var handsonTableHelperObjSigmaMapSettings;
var handsonTableHelperObjSigmaMapSettingsOriginal;
var handsonTableHelperObjPieCharts;
var handsonTableHelperObjPieChartSettings;
var handsonTableHelperObjPieChartSettingsOriginal;
var handsonTableHelperObjStackingMapCharts;
var handsonTableHelperObjStackingMapChartSettings;
var handsonTableHelperObjStackingMapChartSettingsOriginal;
var handsonTableHelperObjImgs;
//Use this, as ajax live connection tracker, when zero, call something like the movePareto charts function
var handsonTableActiveAjaxCalls = 0;
//delete this
/*function getYemianOrMubanMode() {
    var yemianOrMubanMode = 'yemian'
    $('.reportSlideNavUl .col-50').each(function(row) {
        if ($(this).data('num') === 2 && $(this).hasClass('on')) {
            yemianOrMubanMode = 'muban'
        }
    })
    console.log("getYemianOrMubanMode... mode is " + yemianOrMubanMode)
    return yemianOrMubanMode
}*/

//var muban_handsonTable_arr = []
function insertMubanTable() {
    console.log('insertMubanTable...')
    var beginId = "table"
    var id = beginId + Math.floor(Math.random() * 1000) //随机id
    var ids = WhetherId(id, beginId)
    var rowNum = $("#rowNum").val();
    var columnNum = $("#cellNum").val();
    var option = {
        row: rowNum,
        col: columnNum
    }
    var mubanTableId = 'handsonContainer' + muban_handsonTable_arr.length
    $("#reportContCont").prepend(
        "<div id='" + mubanTableId + "' class=" + "BigTable" + "  " +
        ids + "></div>"
    )
    var colWidthsArr = [];
    for (var i = 0; i < columnNum; i++) {
        colWidthsArr.push(400 / columnNum);
    }
    var rowHeightsArr = [];
    for (var i = 0; i < rowNum; i++) {
        rowHeightsArr.push(200 / rowNum);
    }
    var columnsArr = [];
    for (var i = 0; i < columnNum; i++) {
        columnsArr.push({ renderer: "html" });
    }
    var container = document.getElementById(mubanTableId);
    var customRenderer = function (instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        if (typeof value !== 'undefined' && value) {
            var valueHelper = value.split("=");
            if (valueHelper.length > 1 && valueHelper[0] == 'cpk') {
                td.style.background = '#CEC';
            }
        }
    }
    var emptyData = [];
    for (var i = 0; i < rowHeightsArr.length; i++) {
        emptyData.push([])
    }
    var mubanHandsonTableOptions = {
        data: emptyData,//Handsontable.helper.createSpreadsheetData(rowNum, columnNum),
        rowHeaders: true,
        colHeaders: true,
        width: 400,//'100%',
        height: 320,
        colWidths: colWidthsArr,//[45, 100, 160, 60, 80, 80, 80],
        rowHeights: rowHeightsArr,//[50, 40, 100],
        columns: columnsArr,
        manualColumnResize: true,
        manualRowResize: true,
        outsideClickDeselects: false,
        selectionMode: 'multiple',
        margeCells: true,
        mergeCells: [],
    };

    const data = [
        ['', 'Tesla', 'Volvo', 'Toyota', 'Ford'],
        ['2019', 10, 11, 12, 13],
        ['2020', 20, 11, 14, 13],
        ['2021', 30, 15, 12, 13]
    ];
    const hotOptions = {
        data: data,
        rowHeaders: true,
        colHeaders: true
    }

    //var mubanHandsonTable = new Handsontable(container, hotOptions);//mubanHandsonTableOptions);
    var mubanHandsonTable = new Handsontable(container, mubanHandsonTableOptions);
    muban_handsonTable_arr.push(mubanHandsonTable)
    muban_handsonTableImgs.push([])
    //getMaxBoundingRectForHandson();

    initHandsonTableMuban(mubanHandsonTable);

    $('#' + mubanTableId).width(mubanHandsonTable.table.clientWidth);
    $('#' + mubanTableId).height(mubanHandsonTable.table.clientHeight);
    $('#' + mubanTableId + ' .wtHolder').each(function () {
        var parents = $(this).parents('.handsontable');
        if (parents.length > 0) {
            var parentHeight = $(parents[0]).height();
            var currentHeight = $(this).height();
            $(this).height(parentHeight);
        }
    });
    $('#' + mubanTableId).dragging({
        hander: '.ht_clone_top_left_corner'
    })
}

function initHandsonTableMuban(handsonTable2, handsonTableId) {
    handsonTable2.addHook('beforeColumnResize', function (currentColumn, newSize, isDoubleClick) {
        handsonTableOptions2 = handsonTable2.getSettings();
        var numOfCols = handsonTable2.countCols();
        var widthHelper = 0;
        for (var i = 0; i < numOfCols; i++) {
            //if (i == currentColumn)
            var widthHelper2 = handsonTable2.getColWidth(i);
            widthHelper += widthHelper2;
        }
        console.log("widthHelper: " + widthHelper + ", width: " + handsonTableOptions2.width);
        if (widthHelper > handsonTableHelperObjHelper.maxWidth) {
            console.log("Exceeded max width returning false in afterColumnResize handler");
            return false;
        }
    });
    handsonTable2.addHook('afterColumnResize', function (colIndex, newWidth, isDoubleClick) {
        console.log('Resized Column ' + colIndex + ' to ' + newWidth + ', old width: ' + handsonTable2.getColWidth(colIndex));
        console.log("width is: " + handsonTable2.table.clientWidth + ", height is: " + handsonTable2.table.clientHeight);
        var tempHandsonTableOptions = handsonTable2.getSettings();
        var oldColWidth = tempHandsonTableOptions.colWidths[colIndex];
        var widthDiff = newWidth - oldColWidth;
        var numOfCols = handsonTable2.countCols();
        var widthHelper = 50;//fifty for that first column, is probably 50
        var widthHelperOld = 50;
        for (var i = 0; i < numOfCols; i++) {
            if (i == colIndex) {
                widthHelperOld += oldColWidth;
                var widthHelper2 = handsonTable2.getColWidth(i);
                widthHelper += widthHelper2;
            } else {
                var widthHelper2 = handsonTable2.getColWidth(i);
                widthHelper += widthHelper2;
                widthHelperOld += widthHelper2;
            }
        }
        if (tempHandsonTableOptions.width + widthDiff > handsonTableHelperObjHelper.maxWidth) {
            tempHandsonTableOptions.width = widthHelperOld;
            handsonTable2.table.clientWidth = widthHelperOld;
            handsonTable2.updateSettings(tempHandsonTableOptions);
            var wtHolder = $(handsonTable2.table).parents('.wtHolder');
            if (wtHolder.length > 0) {
                $(wtHolder[0]).width(widthHelperOld);
            }
            $('#' + handsonTableId + ' .htCore th:nth-child(' + (colIndex + 2) + ')').each(function () {
                $(this).width(oldColWidth);
                $(this).find('*').each(function () {
                    $(this).width(oldColWidth);
                });
            });
            $('#' + handsonTableId + ' .htCore td:nth-child(' + (colIndex + 2) + ')').each(function () {
                $(this).width(oldColWidth);
                $(this).find('*').each(function () {
                    $(this).width(oldColWidth);
                });
            });
            $('#' + handsonTableId + ' .htCore col:nth-child(' + (colIndex + 2) + ')').each(function () {
                $(this).width(oldColWidth);
                $(this).find('*').each(function () {
                    $(this).width(oldColWidth);
                });
            });
            $("#" + handsonTableId).width(widthHelperOld);
            console.log("Exceeded max width returning false in afterColumnResize handler");
            return false;
        }
        tempHandsonTableOptions.width += widthDiff;

        tempHandsonTableOptions.height = tempHandsonTableOptions.clientHeight;
        tempHandsonTableOptions.clientWidth = tempHandsonTableOptions.width;

        tempHandsonTableOptions.colWidths[colIndex] = newWidth;
        handsonTable2.updateSettings(tempHandsonTableOptions);
        setTimeout(function () {
            //ToDo? 06/06/2020
            handsonTableSelected = handsonTableId
            resizeChartsMuban(handsonTable2, null, null, colIndex);
            updateRowHeadersAndColHeadersMuban();

            var wtHolder = $(handsonTable2.table).parents('.wtHolder');
            var wtHider = $(handsonTable2.table).parents('.wtHider');
            if (wtHolder.length > 0 && wtHider.length > 0) {
                $(wtHolder[0]).width(handsonTable2.table.clientWidth);
                $(wtHider[0]).width(handsonTable2.table.clientWidth);
                $(wtHolder[0]).height(handsonTable2.table.clientHeight);
                $(wtHider[0]).height(handsonTable2.table.clientHeight);
            }
            $("#" + handsonTableId).width(handsonTable2.table.clientWidth);
            $("#" + handsonTableId).height(handsonTable2.table.clientHeight);
        }, 100);
    });
    handsonTable2.addHook('afterRowResize', function (rowIndex, newHeight, isDoubleClick) {
        var tempHandsonTableOptions = handsonTable2.getSettings();
        var oldRowHeight = tempHandsonTableOptions.rowHeights[rowIndex];
        var heightDiff = newHeight - oldRowHeight;

        if (tempHandsonTableOptions.height + heightDiff > handsonTableHelperObjHelper.maxHeight) {
            console.log("Exceeded max height returning false in afterRowResize handler");
            return false;
        }
        tempHandsonTableOptions.rowHeights[rowIndex] = newHeight;// = colWidthsArr;
        tempHandsonTableOptions.height += heightDiff;

        tempHandsonTableOptions.clientHeight = tempHandsonTableOptions.height;
        tempHandsonTableOptions.width = tempHandsonTableOptions.clientWidth;

        handsonTable2.updateSettings(tempHandsonTableOptions);
        setTimeout(function () {
            //ToDo 06/07/2020, which of these need refactored
            handsonTableSelected = handsonTableId
            resizeChartsMuban(handsonTable2, null, rowIndex, null);
            stabilizeHandsonTableSidesMuban(handsonTableSelected);
            updateRowHeadersAndColHeadersMuban();
            var wtHolder = $(handsonTable2.table).parents('.wtHolder');
            var wtHider = $(handsonTable2.table).parents('.wtHider');
            if (wtHolder.length > 0 && wtHider.length > 0) {
                $(wtHolder[0]).width(handsonTable2.table.clientWidth);
                $(wtHolder[0]).height(handsonTable2.table.clientHeight);
                $(wtHider[0]).width(handsonTable2.table.clientWidth);
                $(wtHider[0]).height(handsonTable2.table.clientHeight);
            }
            $("#" + handsonTableId).width(handsonTable2.table.clientWidth);
            $("#" + handsonTableId).height(handsonTable2.table.clientHeight);
        }, 100);
    });
    handsonTable2.addHook('afterSelection', function (row, column, row2, column2, preventScrolling, selectionLayerLevel) {
        console.log("afterSelection row: " + row2 + ", column: " + column2);
        var currSelection = [row, column, row2, column2];
        var mergeCellHelper = fourCornersHelper(currSelection);
        var selectedCell = handsonTable2.getCell(mergeCellHelper.topLeft.y, mergeCellHelper.topLeft.x);

        //ToDo 06/07/2020 need refactoring
        //triggerHandsonCellClick();

        $(selectedCell).parents("#" + handsonTableId).find("td").removeClass("td-chosen-css");
        $(selectedCell).addClass("td-chosen-css");
        setTimeout(function () {
            //ToDo 06/07/2020 refactor
            handsonTableSelected = handsonTableId
            stabilizeHandsonTableSidesMuban(handsonTableSelected);
            updateRowHeadersAndColHeadersMuban();

            var wtHolder = $(handsonTable2.table).parents('.wtHolder');
            var wtHider = $(handsonTable2.table).parents('.wtHider');
            if (wtHolder.length > 0 && wtHider.length > 0) {
                $(wtHolder[0]).width(handsonTable2.table.clientWidth);
                $(wtHolder[0]).height(handsonTable2.table.clientHeight);
                $(wtHider[0]).width(handsonTable2.table.clientWidth);
                $(wtHider[0]).height(handsonTable2.table.clientHeight);
            }
            $("#" + handsonTableId).width(handsonTable2.table.clientWidth);
            $("#" + handsonTableId).height(handsonTable2.table.clientHeight);
        }, 100);
    });
}

function resizeChartsMuban(handsonTable2, BigobjHelper, rowIndex, colIndex) {
    var BigobjHelper = null;
    var tempHandsonTableSettings = handsonTable2.getSettings();
    //getSelectedHandsonTableId()
    if (handsonTableSelected < 0) {
        return false;
    }
    var handsonTableImgs = muban_handsonTableImgs[handsonTableSelected]
    for (var i in handsonTableImgs) {
        var rowAndColArr = i.split(',');
        var heightWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
        var heightHelper = heightWidthObj.height;
        var widthHelper = heightWidthObj.width;
        var tempHandsonTableSettings = handsonTable2.getSettings();
        var imgCell = $(handsonTable2.table).find('.' + handsonTableImgs[i]);
        if (imgCell && imgCell.length > 0) {
            $(imgCell[0]).css('width', widthHelper + 'px');
            $(imgCell[0]).css('height', heightHelper + 'px');
            $(imgCell[0]).attr('width', widthHelper);
            $(imgCell[0]).attr('height', heightHelper);
            tempHandsonTableSettings.data[rowAndColArr[0]][rowAndColArr[1]] = $(imgCell[0])[0].outerHTML;
            handsonTable2.updateSettings(tempHandsonTableSettings);
        }
    }

}

function previewWrapper(file) {
    if (yemianOrMubanMode == 2) {
        //console.log("about to previewMuban...")
        //return false
        previewMuban(file)
        return false
    } else {
        preview(file)
        return false
    }
}

var previewMuban = function (file) { //上传图片  创建插入图片标签
    var newImgDiv = document.createElement('IMG');
    newImgDiv.classList.add('img_driver1');

    //拖拉拽缩放
    var container = "img_driver"
    //缩略图类定义
    var Picture = function (file, container) {
        var height = 0,
            width = 0,
            ext = '',
            size = 0,
            name = '',
            path = '';
        var self = this;
        getSelectedHandsonTableId()
        if (handsonTableSelected < 0) {
            return false;
        }
        if (file) {
            name = file.value;
            if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
                file.select();
                path = document.selection.createRange().text;
            } else {
                if (file.files) {
                    // path =  file.files.item(0).getAsDataURL(); // firefox7.0之后该方法弃用了，用下面那个

                    var formData = new FormData();
                    formData.append('file', file.files[0]);
                    $.ajax({
                        type: 'POST',
                        url: "/customReport/uploadFile",
                        data: formData,//$('#pictureFrm').serialize(),
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            console.log("around line 361: " + response);
                            //ext = name.substr(name.lastIndexOf("."), name.length);
                            container.src = response;
                            container.alt = name;
                            container.style.visibility = 'visible';
                            height = container.height;
                            width = container.width;
                            size = container.fileSize;
                            var handsonTable2 = muban_handsonTable_arr[handsonTableSelected]
                            var currSelection = handsonTable2.getSelected();
                            if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
                                || currSelection[0].length < 4)
                                return false;
                            height = handsonTable2.getRowHeight(currSelection[0][0]);
                            width = handsonTable2.getColWidth(currSelection[0][1]);
                            var beginImgClassName = "Img"
                            var imgClassName = beginImgClassName + Math.floor(Math.random() * 1000)
                            var imgClassNameFinal = WhetherId(imgClassName, beginImgClassName)
                            container.classList.add(imgClassNameFinal);
                            container.setAttribute('width', width);
                            container.setAttribute('height', height);
                            container.style.width = width;
                            container.style.height = height;
                            container.style.overflow = 'hidden';
                            var tempHandsonTableOptions = handsonTable2.getSettings();
                            tempHandsonTableOptions.data[currSelection[0][0]][currSelection[0][1]] =
                                container.outerHTML;

                            handsonTable2.updateSettings(tempHandsonTableOptions);
                            var currSelection = handsonTable2.getSelected();
                            muban_handsonTableImgs[handsonTableSelected][currSelection[0][0] + ',' +
                                currSelection[0][1]] = imgClassNameFinal;
                        },
                        error: function () {
                            console.log("error for /customReport/uploadFile: " + error);
                        }
                    });
                    path = window.URL.createObjectURL(file.files[0]);
                } else {
                    path = file.value;
                }
            }
        } else {
            throw '无效的文件';
        }
        this.get = function (name) {
            return self[name];
        };
        this.isValid = function () {
            if (allowExt.indexOf(self.ext) !== -1) {
                throw '不允许上传该文件类型';
                return false;
            }
        }
    };

    try {
        var pic = new Picture(file, newImgDiv);
    } catch (e) {
        alert(e);
    }
};

function getSelectedHandsonTableId() {
    for (var i = 0; i < muban_handsonTable_arr.length; i++) {
        var handsonTable = muban_handsonTable_arr[i]
        var currSelection = handsonTable.getSelected();
        if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
            || currSelection[0].length < 4) {

        } else {
            handsonTableSelected = i
            return handsonTableSelected
        }
    }
    handsonTableSelected = -1
    return handsonTableSelected
}

function updateRowHeadersAndColHeadersMuban() {
    getSelectedHandsonTableId()
    if (handsonTableSelected < 0 || typeof handsonTableSelected === 'undefined') {
        return false;
    }
    var handsonTable2 = muban_handsonTable_arr[handsonTableSelected]
    var numOfRows = handsonTable2.countRows();
    var numOfCols = handsonTable2.countCols();
    var rowCounter = 0;
    var colCounter = 0;
    $('#handsonContainer' + handsonTableSelected + ' .ht_clone_top .htCore .colHeader').each(function () {
        if (colCounter > 0) {//<= numOfCols) {
            var h = $(this).html();
            var hSplitted = h.split(',');
            var colWidth = handsonTable2.getColWidth(colCounter - 1);
            colWidth = parseFloat(colWidth.toFixed(1))
            $(this).html(hSplitted[0] + ',w:' + colWidth);
        }
        colCounter++;
    });

    /*for (var i = 0; i < numOfCols; i++) {
        var widthHelper = handsonTable.getColWidth(i);
    }*/
    $('#handsonContainer' + handsonTableSelected + ' .ht_clone_left .htCore .rowHeader').each(function () {
        if (rowCounter > 0) {// <= numOfRows) {
            var h = $(this).html();
            var hSplitted = h.split(',');
            var rowHeight = handsonTable2.getRowHeight(rowCounter - 1);
            rowHeight = parseFloat(rowHeight.toFixed(1))
            $(this).html(hSplitted[0] + ',h:' + rowHeight);
        }
        rowCounter++;
    });
}

function mergeCellWrapper() {
    if (yemianOrMubanMode == 2) {
        //console.log("about to previewMuban...")
        //return false
        mergeCellMuban()
        return false
    } else {
        mergeCell()
        return false
    }
}

function unmergeCellWrapper() {
    if (yemianOrMubanMode == 2) {
        //console.log("about to previewMuban...")
        //return false
        unmergeCellMuban()
        return false
    } else {
        unmergeCell()
        return false
    }
}

function mergeCellMuban() { //合并单元格
    getSelectedHandsonTableId()
    if (handsonTableSelected < 0) {
        return false;
    }
    var handsonTable2 = muban_handsonTable_arr[handsonTableSelected]
    var currSelection = handsonTable2.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    var mergeCellHelper = fourCornersHelper(currSelection[0]);
    var rowSpanHelper = mergeCellHelper.bottomLeft.y - mergeCellHelper.topLeft.y + 1;
    rowSpanHelper = rowSpanHelper < 1 ? 1 : rowSpanHelper;
    var colSpanHelper = mergeCellHelper.topRight.x - mergeCellHelper.topLeft.x + 1;
    colSpanHelper = colSpanHelper < 1 ? 1 : colSpanHelper;
    var newMergeCells = [];
    var tempHandsonTableOptions = handsonTable2.getSettings()
    for (var i = 0; i < tempHandsonTableOptions.mergeCells.length; i++) {
        if (tempHandsonTableOptions.mergeCells[i].row >= mergeCellHelper.topLeft.y &&
            tempHandsonTableOptions.mergeCells[i].row <= mergeCellHelper.bottomLeft.y &&
            tempHandsonTableOptions.mergeCells[i].col >= mergeCellHelper.topLeft.x &&
            tempHandsonTableOptions.mergeCells[i].col <= mergeCellHelper.topRight.x) {

        } else {
            newMergeCells.push(tempHandsonTableOptions.mergeCells[i]);
        }
    }
    tempHandsonTableOptions.mergeCells = newMergeCells;
    tempHandsonTableOptions.mergeCells.push(
        {
            row: mergeCellHelper.topLeft.y, col: mergeCellHelper.topLeft.x, rowspan: rowSpanHelper,
            colspan: colSpanHelper
        }
    );
    handsonTable2.updateSettings(tempHandsonTableOptions);
    resizeChartsMuban(handsonTable2);

    //ToDo 06/08/2020 what are the next two?  do they need to be refactored into muban versions?
    stabilizeHandsonTableMuban(handsonTableSelected);
    stabilizeHandsonTableSides(handsonTableSelected);
}

function unmergeCellMuban() {
    getSelectedHandsonTableId()
    if (handsonTableSelected < 0) {
        return false;
    }
    var handsonTable2 = muban_handsonTable_arr[handsonTableSelected]
    var tempHandsonTableOptions = handsonTable2.getSettings()
    var currSelection = handsonTable2.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    var mergeCellHelper = fourCornersHelper(currSelection[0]);
    var newMergeCells = [];
    for (var i = 0; i < tempHandsonTableOptions.mergeCells.length; i++) {
        if (tempHandsonTableOptions.mergeCells[i].row !== mergeCellHelper.topLeft.y ||
            tempHandsonTableOptions.mergeCells[i].col !== mergeCellHelper.topLeft.x) {
            newMergeCells.push(tempHandsonTableOptions.mergeCells[i]);
        }
    }
    tempHandsonTableOptions.mergeCells = newMergeCells;
    handsonTable2.updateSettings(tempHandsonTableOptions);
}

function deleteHandsonTableMuban(e) {
    getSelectedHandsonTableId()
    if (handsonTableSelected < 0) {
        return false;
    }
    var handsonTable2 = muban_handsonTable_arr[handsonTableSelected]
    var parents = $(handsonTable2.table).parents(".ui-widget-content");
    if (parents.length > 0) {
        $(parents[0]).remove();
    }
    muban_handsonTable_arr.splice(handsonTableSelected, 1)
    muban_handsonTableImgs.splice(handsonTableSelected, 1)
}

// 生成母版表格
function mubanInitFromHandOver(muban_handsonTableOptions_arr, muban_handsonTableOptionsAdd_arr) {
    console.log('inside mubanInitFromHandOver')
    for (var i = 0; i < muban_handsonTable_arr.length; i++) {
        $('#' + muban_handsonTable_arr[i]).remove()
    }
    if (muban_handsonTableOptions_arr.length > 0) {
        muban_handsonTable_arr = []
    }
    for (var i2 = 0; i2 < muban_handsonTableOptions_arr.length; i2++) {
        var handsonTableOptions2 = muban_handsonTableOptions_arr[i2]
        var colNum = handsonTableOptions2.numOfCols;
        var rowNum = handsonTableOptions2.numOfRows;
        var columnsArr = [];
        for (var i = 0; i < colNum; i++) {
            columnsArr.push({ renderer: "html" });
        }

        var clientWidthHelper = 50;
        var clientHeightHelper = 50;
        // 列宽
        for (var i = 0; i < handsonTableOptions2.colWidths.length; i++) {
            if (!handsonTableOptions2.colWidths[i] || typeof handsonTableOptions2.colWidths[i] === 'undefined') {
                handsonTableOptions2.colWidths[i] = 20;
            }
            clientWidthHelper += handsonTableOptions2.colWidths[i];
        }
        // 行高
        for (var i = 0; i < handsonTableOptions2.rowHeights.length; i++) {
            if (!handsonTableOptions2.rowHeights[i] || typeof handsonTableOptions2.rowHeights[i] === 'undefined') {
                handsonTableOptions2.rowHeights[i] = 20;
            }
            clientHeightHelper += handsonTableOptions2.rowHeights[i];
        }



        handsonTableOptions2 = {
            data: handsonTableOptions2.data,//Handsontable.helper.createSpreadsheetData(6, 6),
            rowHeaders: false,
            colHeaders: false,
            width: typeof handsonTableOptions2.clientWidth !== 'undefined' &&
                handsonTableOptions2.clientWidth && !isNaN(handsonTableOptions2.clientWidth) ?
                handsonTableOptions2.clientWidth + 50 :
                clientWidthHelper,
            height: typeof handsonTableOptions2.clientHeight !== 'undefined' &&
                handsonTableOptions2.clientHeight && !isNaN(handsonTableOptions2.clientHeight) ?
                handsonTableOptions2.clientHeight + 50 :
                clientHeightHelper,
            colWidths: handsonTableOptions2.colWidths,//[30, 30, 30, 30, 30, 30],
            rowHeights: handsonTableOptions2.rowHeights,//[25, 25, 25, 25, 25, 25],
            columns: columnsArr,
            manualColumnResize: true,
            manualRowResize: true,
            outsideClickDeselects: false,
            selectionMode: 'multiple',
            margeCells: true,
            mergeCells: handsonTableOptions2.mergeCells
        };

        layer.closeAll()

        $("#mubanContainer").prepend(
            "<div id='handsonContainer" + i2 + "' class=" + "BigTable" + " style='position:absolute;'></div>"
        )

        var container = document.getElementById('handsonContainer' + i2);
        /*const data = [
            ['', 'Tesla', 'Volvo', 'Toyota', 'Ford'],
            ['2019', 10, 11, 12, 13],
            ['2020', 20, 11, 14, 13],
            ['2021', 30, 15, 12, 13]
        ];
        const hotOptions ={
            data: data,
            rowHeaders: true,
            colHeaders: true
        }*/
        //handsonTable2 = new Handsontable(container, hotOptions)//handsonTableOptions2);
        handsonTable2 = new Handsontable(container, handsonTableOptions2);
        if (muban_handsonTableOptionsAdd_arr[i2] != null) {
            $('#handsonContainer' + i2).css('top', muban_handsonTableOptionsAdd_arr[i2].top)
            $('#handsonContainer' + i2).css('left', muban_handsonTableOptionsAdd_arr[i2].left)
        }
        //muban_handsonTable_arr.push(handsonTable2)
        //initHandsonTableMuban(handsonTable2, i2);
        //resizeChartsMuban(handsonTable2);
        muban_handsonTable_arr.push('handsonContainer' + i2)
        /*$('#handsonContainer' + i2).dragging({
            hander: '.ht_clone_top_left_corner'
        })*/
    }

    //use the following for toggling visibility, should start off with yemian stuff being visible
    //and muban stuff being hidden
    /*$('#handsonContainer').each(function() {
        //$(this).show();
        //$(this).css('visibility', 'visible')
        var handsonContainerParents = $(this).parents('.resizabletable')
        if (handsonContainerParents.length > 0) {
            $(handsonContainerParents[0]).css('visibility', 'visible')
        }
    })
    for (var property in handsonTableHelperObjImgs) {
        $('.' + handsonTableHelperObjImgs[property]).css('visibility', 'visible')
    }
    for (var i = 0; i < muban_handsonTableImgs.length; i++) {
        for (var property in muban_handsonTableImgs[i]) {
            $('.' + muban_handsonTableImgs[i][property]).css('visibility', 'hidden')
        }
    }*/
    /*for (var i = 0; i < muban_handsonTable_arr.length; i++) {
        //$('#handsonContainer' + i).hide()
        $('#handsonContainer' + i).css('visibility', 'hidden')
    }*/
}

function getRealHandsonTableRowHeightsAndColWidthsMuban(index) {
    var retObj = { rowHeights: [], colWidths: [] };
    var rowIndex = 0;
    $('#handsonContainer' + index + ' .ht_master.handsontable .htCore tr').each(function () {
        if (rowIndex > 0) {
            var rowHeight = $(this).height();
            retObj.rowHeights.push(rowHeight);
        }
        if (rowIndex == 1) {
            var colIndex = 0;
            $(this).find('td').each(function () {
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

function stabilizeHandsonTableMuban(index) {
    getSelectedHandsonTableId()
    if (handsonTableSelected < 0) {
        return false;
    }
    var handsonTable2 = muban_handsonTable_arr[handsonTableSelected]
    setTimeout(function () {
        var wtHolder = $(handsonTable2.table).parents('.wtHolder');
        var wtHider = $(handsonTable2.table).parents('.wtHider');
        if (wtHolder.length > 0 && wtHider.length > 0) {
            $(wtHolder[0]).width(handsonTable2.table.clientWidth);
            $(wtHolder[0]).height(handsonTable2.table.clientHeight);
            $(wtHider[0]).width(handsonTable2.table.clientWidth);
            $(wtHider[0]).height(handsonTable2.table.clientHeight);
        }
        $("#handsonContainer" + index).width(handsonTable2.table.clientWidth);
        $("#handsonContainer" + index).height(handsonTable2.table.clientHeight);
    }, 100);
}

function stabilizeHandsonTableSidesMuban(index) {
    setTimeout(function () {
        //ht_master
        var htMasterWidth = $('#handsonContainer' + index + ' .ht_master').width();
        var htMasterHeight = $('#handsonContainer' + index + ' .ht_master').height();
        //ht_clone_top
        $('#handsonContainer' + index + ' .ht_clone_top').width(htMasterWidth);
        $('#handsonContainer' + index + ' .ht_clone_top .wtHider').width(htMasterWidth);
        $('#handsonContainer' + index + ' .ht_clone_top .wtHolder').width(htMasterWidth);

        //ht_clone_left
        $('#handsonContainer' + index + ' .ht_clone_left').height(htMasterHeight);
        $('#handsonContainer' + index + ' .ht_clone_left .wtHider').height(htMasterHeight);
        $('#handsonContainer' + index + ' .ht_clone_left .wtHolder').height(htMasterHeight);
    }, 100);
}

// 生成报告下拉列表
function make(isFromUpdateLabel) {
    if (isFromUpdateLabel) {
        $('.spinner, #overlay').show();
    }
    console.log("点击了生成报告");

    // holi's code
    // 获得canvas上面所有的点 -> 3d.js
    getSpecialPointsLocation(function (data) {
        if (!data.length) return;

        var options = "<option value=\"-1\">请选择</option>\n";

        var array = [];
        var page = 0;
        // 根据每页的设置变换
        var _beforePageSize = globalObj.spacing._beforePageSize || 4;
        // 每页显示点的个数
        var perPageShowCount = globalObj.spacing.numOfPages;
        // 当前显示的是第几页
        var currentPage = globalObj.spacing.currentPage || 1;
        // 应用范围
        var useRange = globalObj.spacing.useRange;

        data.forEach(function (item, idx) {
            if (useRange === 'after' && idx <= currentPage * _beforePageSize) {
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

            array.push({
                "flabel": item.id,
                // 3d 坐标
                "coordinate": item.x + "," + item.y + "," + item.z,
                // 2d 坐标 x
                "screen_x": item.screen_x,
                // 2d 坐标 y
                "screen_y": item.screen_y
            });
        });

        if (array.length > 0) {
            options += "<option zdy='" + JSON.stringify(array) + "' value='" + data.length + "'>第" + (++page) + "页</option>";
            $("#boxs").append(options);
        }

        $("#boxs").html(options);
        $('body').append('<div class="selectnodeCompleted"></div>');

        if (isFromUpdateLabel) {
            updateLabelHandler();
        }
        $('.spinner, #overlay').hide();


        // 选中报告第一页
        if (!window._notFirstLoad) {
            window._notFirstLoad = true;
            setTimeout(() => {
                $('#boxs').find('option').eq(1).attr("selected", true);
                window.showReport();
            }, 16);
        }

        samples1 = [];
    });

}

function updateLabelHandler() {
    $('#ParetoDiagramHelper, #TrendMapDiagramHelper, #ControlChartDiagramHelper, ' +
        '#SigmaMapDiagramHelper, #BoxLineChartDiagramHelper, #StackingMapDiagramHelper, ' +
        '#PieChartDiagramHelper, #HistogramDiagramHelper').show();//css('display', 'block');
    var canvasRect = renderer.context.canvas.getBoundingClientRect();
    var graphContainerRect = document.getElementById('graphContainer').getBoundingClientRect();
    var topDiff = canvasRect.top - graphContainerRect.top;
    var leftDiff = canvasRect.left - graphContainerRect.left;
    var value = $("#boxs").find("option:selected").attr("zdy")
    if (typeof value === 'undefined') {
        $('.spinner, #overlay').hide();
        return false;
    }
    var list = JSON.parse(value);
    var x2 = [];
    x2.push(0);

    var y2 = [];
    y2.push(0);
    var z2 = []; //holds that onePoints information
    z2.push({});
    var duplicateCacheChecker = {};
    //if (typeof globalObj.points !== 'undefined' && globalObj.points.length > 0) {
    globalObj.pointsHelper.forEach(function (vertex) {
        //globalObj.points.forEach(function (vertex) {
        var accuratePos = getAccurateScreenPosition2(vertex.sphere);

        var msgPos = { x: accuratePos.x + leftDiff, y: accuratePos.y + topDiff };
        if (!isOutsideCanvas(msgPos)) {
            if (typeof duplicateCacheChecker[msgPos.x + ',' + msgPos.y] === 'undefined') {
                duplicateCacheChecker[msgPos.x + ',' + msgPos.y] = true;
                x2.push(msgPos.x);
                y2.push(msgPos.y);
                z2.push(vertex.onePoints);
            }
        }
    });
    //}
    var x1 = [0];
    var y1 = [0];
    var labelWidth = typeof handsonTableOptionsOriginal !== 'undefined' ? handsonTableOptionsOriginal.width : 100;
    var labelHeight = typeof handsonTableOptionsOriginal !== 'undefined' ? handsonTableOptionsOriginal.height : 70;
    //var positions = labelPositionOptimizer(labelWidth, labelHeight, x2.length, x1, y1);
    //var positions = labelPositionOptimizerUsingArea(labelWidth, labelHeight, x2.length, x1, y1);
    var positions = labelPositionOptimizerUsingArea2(labelWidth, labelHeight, x2.length, x1, y1);
    //change here
    //求内点外点不交叉的线
    jQuery.ajax({
        //url: 'line'+vv1+'.json',
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
            var checker = [];
            scaleWidthAndHeight(handsonTableOptions, positions.width, positions.height, positions.originalWidth,
                positions.originalHeight, x1, y1);
            handsonTable.updateSettings(handsonTableOptions);
            for (var i = 1; i < x2.length; i++) {

                var tx = x2[i];
                var ty = y2[i];
                var tz = z2[i];

                if (true
                    //(tx >= autoWith && tx <= (autoWith+container.offsetWidth)) &&
                    //(ty >= autoTop && ty <= (autoTop+container.offsetHeight))
                ) {
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

                    addLine2(list[i - 1].flabel, twozb, msg[twozb], points, samples1, index, coordinates, i, positions, tz, false);
                } else {
                    console.log("out of container?");
                }
            }
            if (handsonTableActiveAjaxCalls <= 0) {
                handsonTableActiveAjaxCalls = 0;
                moveParetoChartsFromAltToAltHolder();
                $('.spinner, #overlay').hide();
            } else {
                //do a setInterval here
                //might be better
                setTimeout(function () {
                    //if (handsonTableActiveAjaxCalls > 0) {
                    handsonTableActiveAjaxCalls = 0;
                    moveParetoChartsFromAltToAltHolder();
                    $('.spinner, #overlay').hide();
                    //}, 4000)
                    //}
                }, 100 * handsonTableActiveAjaxCalls);
            }

            var len = parseInt($("#boxs").find("option:selected").val()) + 1;
            var str = '<div class="line' + len + '"></div>';
            $('body').append(str);
            $('.spinner, #overlay').hide();
        }
    });
}

function getAccurateScreenPosition2(obj) {
    const canvas = window._renderer.context.canvas//renderer.context.canvas;
    let canvasWidth = $('#container canvas').width() / 2;
    let canvasHeight = $('#container canvas').height() / 2;
    var mouseVector = new THREE.Vector3();
    var pos = new THREE.Vector3();
    pos = pos.setFromMatrixPosition(obj.matrixWorld);
    pos.project(window._camera)
    var percX = (pos.x * canvasWidth) + canvasWidth// + canvas.width//canvasWidth;
    var percY = (-pos.y * canvasHeight) + canvasHeight// + canvas.height//canvasHeight;
    return {
        x: percX,//(left - canvasWidth / 2),//mouseVector.x * canvasWidth,
        y: percY//(top - canvasHeight / 2)//mouseVector.y * canvasHeight
    };
}

function isOutsideCanvas(pos) {
    var canvasRect = window._renderer.context.canvas.getBoundingClientRect();
    var graphContainerRect = document.getElementById('graphContainer').getBoundingClientRect();
    var topDiff = canvasRect.top - graphContainerRect.top;
    var leftDiff = canvasRect.left - graphContainerRect.left;
    var pageScreenWidth = document.getElementById('pageScreen').offsetWidth;
    var pageScreenHeight = document.getElementById('pageScreen').offsetHeight;
    var containerWidth = document.getElementById('container').offsetWidth;
    var containerHeight = document.getElementById('container').offsetHeight;
    var containerLeft = document.getElementById('container').offsetLeft;
    var containerTop = document.getElementById('container').offsetTop;
    if (pos.x < containerLeft || pos.x > (containerLeft + containerWidth)) {
        return true;
    }
    if (pos.y < containerTop || pos.y > (containerTop + containerHeight)) {
        return true;
    }
    return false;
}

// 缩放
function scaleWidthAndHeight(handsonTableOptions, labelWidth, labelHeight, originalWidth, originalHeight, x1, y1) {
    var xyKey = x1 + ',' + y1;
    var xyValue = getLabelPositions2HelperObj[xyKey];
    var labelR = labelWidth / originalWidth;
    var labelR2 = labelHeight / originalHeight;
    var colSoFar = 0;
    for (var i = 0; i < handsonTableOptionsOriginal.colWidths.length; i++) {
        var colHere = Math.floor(handsonTableOptionsOriginal.colWidths[i] * labelR);
        colSoFar += colHere;
        handsonTableOptions.colWidths[i] = colHere;
    }
    var widthDiff = labelWidth - colSoFar;
    var widthCounterHelper = 0;
    while (widthDiff > 0) {
        if (widthCounterHelper == handsonTableOptions.colWidths.length) {
            widthCounterHelper = 0;
        } else {
            handsonTableOptions.colWidths[widthCounterHelper++]++;
            widthDiff--;
        }
    }
    var heightSoFar = 0;
    for (var i = 0; i < handsonTableOptionsOriginal.rowHeights.length; i++) {
        var heightHere = Math.floor(handsonTableOptionsOriginal.rowHeights[i] * labelR2);
        heightSoFar += heightHere;
        handsonTableOptions.rowHeights[i] = heightHere;
    }
    var heightDiff = labelHeight - heightSoFar;
    var heightCounterHelper = 0;
    while (heightDiff > 0) {
        if (heightCounterHelper == handsonTableOptions.rowHeights.length) {
            heightCounterHelper = 0;
        } else {
            handsonTableOptions.rowHeights[heightCounterHelper++]++;
            heightDiff--;
        }
    }
    handsonTableOptions.width = labelWidth;
    handsonTableOptions.height = labelHeight;
    var heightRatios = {};
    var widthRatios = {};
    for (var i = 0; i < handsonTableOptions.rowHeights.length; i++) {
        var heightRatio =
            handsonTableOptions.rowHeights[i] /
            handsonTableOptionsOriginal.rowHeights[i];
        heightRatios[i] = heightRatio;
    }
    for (var i = 0; i < handsonTableOptions.colWidths.length; i++) {
        var widthRatio =
            handsonTableOptions.colWidths[i] /
            handsonTableOptionsOriginal.colWidths[i];
        widthRatios[i] = widthRatio;
    }
    for (var i in handsonTableHelperObjTrendMapSettings) {
        var rowAndColArr = i.split(',');

        handsonTableHelperObjTrendMapSettings[i].miscHeight = Math.floor(heightRatios[rowAndColArr[0]]
            * handsonTableHelperObjTrendMapSettingsOriginal[i].miscHeight)
        handsonTableHelperObjTrendMapSettings[i].miscWidth = Math.floor(widthRatios[rowAndColArr[1]]
            * handsonTableHelperObjTrendMapSettingsOriginal[i].miscWidth)
    }
    for (var i in handsonTableHelperObjControlChartSettings) {
        var rowAndColArr = i.split(',');

        handsonTableHelperObjControlChartSettings[i].miscHeight = Math.floor(heightRatios[rowAndColArr[0]]
            * handsonTableHelperObjControlChartSettingsOriginal[i].miscHeight)
        handsonTableHelperObjControlChartSettings[i].miscWidth = Math.floor(widthRatios[rowAndColArr[1]]
            * handsonTableHelperObjControlChartSettingsOriginal[i].miscWidth)
    }
    for (var i in handsonTableHelperObjHistogramSettings) {
        var rowAndColArr = i.split(',');
        handsonTableHelperObjHistogramSettings[i].miscHeight = Math.floor(heightRatios[rowAndColArr[0]]
            * handsonTableHelperObjHistogramSettingsOriginal[i].miscHeight)
        handsonTableHelperObjHistogramSettings[i].miscWidth = Math.floor(widthRatios[rowAndColArr[1]]
            * handsonTableHelperObjHistogramSettingsOriginal[i].miscWidth)
    }
    for (var i in handsonTableHelperObjBoxLineChartSettings) {
        var rowAndColArr = i.split(',');
        handsonTableHelperObjBoxLineChartSettings[i].miscHeight = Math.floor(heightRatios[rowAndColArr[0]]
            * handsonTableHelperObjBoxLineChartSettingsOriginal[i].miscHeight)
        handsonTableHelperObjBoxLineChartSettings[i].miscWidth = Math.floor(widthRatios[rowAndColArr[1]]
            * handsonTableHelperObjBoxLineChartSettingsOriginal[i].miscWidth)
    }
    for (var i in handsonTableHelperObjSigmaMapSettings) {
        var rowAndColArr = i.split(',');
        handsonTableHelperObjSigmaMapSettings[i].miscHeight = Math.floor(heightRatios[rowAndColArr[0]]
            * handsonTableHelperObjSigmaMapSettingsOriginal[i].miscHeight)
        handsonTableHelperObjSigmaMapSettings[i].miscWidth = Math.floor(widthRatios[rowAndColArr[1]]
            * handsonTableHelperObjSigmaMapSettingsOriginal[i].miscWidth)
    }
    for (var i in handsonTableHelperObjPieChartSettings) {
        var rowAndColArr = i.split(',');
        handsonTableHelperObjPieChartSettings[i].miscHeight = Math.floor(heightRatios[rowAndColArr[0]]
            * handsonTableHelperObjPieChartSettingsOriginal[i].miscHeight)
        handsonTableHelperObjPieChartSettings[i].miscWidth = Math.floor(widthRatios[rowAndColArr[1]]
            * handsonTableHelperObjPieChartSettingsOriginal[i].miscWidth)
    }
    for (var i in handsonTableHelperObjStackingMapChartSettings) {
        var rowAndColArr = i.split(',');
        handsonTableHelperObjStackingMapChartSettings[i].miscHeight = Math.floor(heightRatios[rowAndColArr[0]]
            * handsonTableHelperObjStackingMapChartSettingsOriginal[i].miscHeight)
        handsonTableHelperObjStackingMapChartSettings[i].miscWidth = Math.floor(widthRatios[rowAndColArr[1]]
            * handsonTableHelperObjStackingMapChartSettingsOriginal[i].miscWidth)
    }
    for (var i in handsonTableHelperObjParetoSettings) {
        var rowAndColArr = i.split(',');
        handsonTableHelperObjParetoSettings[i].miscHeight = Math.floor(heightRatios[rowAndColArr[0]]
            * handsonTableHelperObjParetoSettingsOriginal[i].miscHeight)
        handsonTableHelperObjParetoSettings[i].miscWidth = Math.floor(widthRatios[rowAndColArr[1]]
            * handsonTableHelperObjParetoSettingsOriginal[i].miscWidth)
    }
    /*var clientWidth = handsonTableOptions.clientWidth;
    var clientHeight = handsonTableOptions.clientHeight;
    if (typeof xyValue !== 'undefined') {
        if (xyValue == 'up' || xyValue == 'down') {

        } else if (xyValue == 'left' || xyValue == 'right') {

        }
    }*/
}

function addLine2(f_label, inPoint, outPoint, points, samples, pageFeatureIndex, coordinates, index, positions, onePoints, isShowReport) {
    if (typeof globalObj.cache === 'undefined') {
        globalObj.cache = [];
    }
    globalObjIndex = globalObj.cache.length;
    globalObj.cache[globalObjIndex] = {
        f_label: f_label,
        inPoint: inPoint,
        outPoint: outPoint,
        points: points,
        samples: samples
    }
    if ((typeof f_label === 'undefined' || f_label == '' || f_label == null) &&
        (typeof onePoints.flabel === 'undefined' || onePoints.flabel == '' || onePoints.flabel == null)) {
        console.log("both f_label and onePoints.flabel are empty")
    } else if (typeof onePoints.flabel === 'undefined' || onePoints.flabel == '' || onePoints.flabel == null) {
        onePoints.flabel = f_label
    }
    if (inPoint != undefined) {

        //内点
        var split = typeof inPoint === 'undefined' ? [0, 0, 0] : inPoint.split(",")
        var x = parseFloat(split[0])
        var y = parseFloat(split[1])

        var split1 = typeof outPoint === 'undefined' ? [0, 0, 0] : outPoint.split(",")
        var x1 = parseFloat(split1[0])
        var y1 = parseFloat(split1[1])

        //默认第0个

        // Enables rubberband selection
        // 拖拽选择
        var rubberBand = new mxRubberband(graph);
        if (typeof globalObj.rubberBands === 'undefined') {
            globalObj.rubberBands = [];
        }
        globalObj.rubberBands.push(rubberBand);


        if (x != "" && y != "") {
            try {

                // Adds cells to the model in a single step
                // graph.getModel().beginUpdate();
                var autoWith = document.getElementById("graphContainer").offsetTop;
                y = y - autoWith

                var labelWidth = positions.width;
                var labelHeight = positions.height;
                var handsonTableBorderStyle = ''
                if (labelWidth < 20 && labelHeight < 20) {
                    var labelHelper = labelWidth < labelHeight ? labelHeight : labelWidth;
                    labelHelper = labelHelper < 20 ? 20 : labelHelper;
                    var v1Value = "<div style='background-color:black;width:" + labelHelper + "px;height:" + labelHelper + "px;display:inline-block;'>&nbsp;</div>";
                    var v1 = graph.insertVertex(parent, f_label, v1Value, x1, y1, labelHelper, labelHelper, 'overflow=fill;fillColor=none;fontColor=#000000;');
                } else if (labelWidth >= 20 && labelHeight >= 20) {

                    if (typeof handsonTableOptions === 'undefined') {
                        var columnsArr = [];
                        for (var i = 0; i < 6; i++) {
                            columnsArr.push({ renderer: "html" });
                        }

                        handsonTableOptions = {
                            data: Handsontable.helper.createSpreadsheetData(6, 6),
                            rowHeaders: false,
                            colHeaders: false,
                            width: 200,//'100%',
                            height: 160,
                            colWidths: [30, 30, 30, 30, 30, 30],
                            rowHeights: [25, 25, 25, 25, 25, 25],
                            columns: columnsArr,
                            manualColumnResize: false,
                            manualRowResize: false,
                            outsideClickDeselects: false,
                            selectionMode: 'multiple',
                            margeCells: true,
                            mergeCells: []
                        };
                    }

                    var _x = Math.floor(x1);
                    var _y = Math.floor(y1);

                    if (!isShowReport) {
                        // modifyHandsonTable(handsonTable, handsonTableOptions, 'testContainer');
                    } else {
                        // modifyHandsonTableForShowReport(handsonTable, handsonTableOptions, 'testContainer');
                    }
                    var xyKey = x1 + ',' + y1;
                    var xyValue = getLabelPositions2HelperObj[xyKey];
                    if (typeof xyValue !== 'undefined') {
                        if (xyValue === 'up' || xyValue === 'down') {
                            _x = Math.floor(x1 + (2 * labelWidth));
                        }
                        if (xyValue === 'left' || xyValue === 'right') {
                            _y = Math.floor(y1 + (2 * labelHeight));
                        }
                    }


                    // 还原图表
                    handleCustomCharts(handsonTable, handsonTableOptions, _x, _y, {}, onePoints.flabel, {
                        pointX: x,
                        pointY: y,
                        posX: x1,
                        posY: y1
                    });


                    // var v1Value = "<div class='svg-table' data-dir='X' style='border: " + handsonTableBorderStyle + "'> " + handsonTable.table.outerHTML + "</div>"
                    // + "<div class='svg-table' data-dir='Y' style='border: " + handsonTableBorderStyle + "'> " + handsonTable.table.outerHTML + "</div>"
                    // + "<div class='svg-table' data-dir='Z' style='border: " + handsonTableBorderStyle + "'> " + handsonTable.table.outerHTML + "</div>"

                    // var v1 = graph.insertVertex(parent, f_label, v1Value, x1, y1, handsonTableOptions.width, handsonTableOptions.height, 'text;html=1;overflow=fill;fillColor=none;');//fontColor=#000000;fontSize=1;');

                } else {
                    var fontSizeHelper = labelWidth < labelHeight ? labelWidth : labelHeight;
                    var fontSize = 1;
                    var v1Value = "<div style='display:inline-block;fontSize:1;'>x: " + coordinates.x + "<br/>y: "
                        + coordinates.y + "<br/>z: "
                        + coordinates.z + "</div>";
                    var v1 = graph.insertVertex(parent, f_label, v1Value, x1, y1, labelWidth, labelHeight, 'text;html=1;overflow=fill;fillColor=none;fontColor=#000000;fontSize=1;');
                }

                // canvas测点坐标
                // var v2 = graph.insertVertex(parent, f_label + "point2", '', x, y, 0, 0, 'overflow=fill;fillColor=none;fontColor=#000000;');
                // // 连线
                // var e1 = graph.insertEdge(parent, f_label + "point3", '', v1, v2);
                // globalObj.cache[globalObjIndex].edge = e1;
                // globalObj.cache[globalObjIndex].v1 = v1;
                // globalObj.cache[globalObjIndex].v2 = v2;
            } finally {
                // graph.getModel().endUpdate();
                //$('.spinner, #overlay').hide();
            }
        }
    }
}

function addLine2(f_label, inPoint, outPoint, points, samples, pageFeatureIndex, coordinates, index, positions, onePoints, isShowReport) {
    if (typeof globalObj.cache === 'undefined') {
        globalObj.cache = [];
    }
    globalObjIndex = globalObj.cache.length;
    globalObj.cache[globalObjIndex] = {
        f_label: f_label,
        inPoint: inPoint,
        outPoint: outPoint,
        points: points,
        samples: samples
    }
    if ((typeof f_label === 'undefined' || f_label == '' || f_label == null) &&
        (typeof onePoints.flabel === 'undefined' || onePoints.flabel == '' || onePoints.flabel == null)) {
        console.log("both f_label and onePoints.flabel are empty")
    } else if (typeof onePoints.flabel === 'undefined' || onePoints.flabel == '' || onePoints.flabel == null) {
        onePoints.flabel = f_label
    }

    // 标签框
    var split = typeof inPoint === 'undefined' ? [0, 0, 0] : inPoint.split(",")
    var inPointX = parseFloat(split[0])
    var inPointY = parseFloat(split[1])
    // 测点
    var split1 = typeof outPoint === 'undefined' ? [0, 0, 0] : outPoint.split(",")
    var outPointX = parseFloat(split1[0])
    var outPointY = parseFloat(split1[1])

    //默认第0个

    // Enables rubberband selection
    // 拖拽选择
    var rubberBand = new mxRubberband(graph);
    if (typeof globalObj.rubberBands === 'undefined') {
        globalObj.rubberBands = [];
    }
    globalObj.rubberBands.push(rubberBand);

    if (inPointX === '' || inPointY === '') return;

    // 还原图表
    handleCustomCharts(
        handsonTable,
        handsonTableOptions,
        outPointX,
        outPointY,
        {},
        onePoints.flabel,
        {
            pointX: inPointX,
            pointY: inPointY,
            posX: outPointX,
            posY: outPointY
        }
    );
}