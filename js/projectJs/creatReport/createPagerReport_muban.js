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
    var mubanTableIdNew = (muban_handsonTableNextId++)//muban_handsonTable_arr.length
    var mubanTableId = 'handsonContainer' + mubanTableIdNew//muban_handsonTable_arr.length
    $("#reportContCont").prepend(
        "<div id='" + mubanTableId + "' class=" +"BigTable" + "  " +
        ids + "></div>"
    )
    var colWidthsArr = [];
    for (var i = 0; i < columnNum; i++) {
        colWidthsArr.push(400/columnNum);
    }
    var rowHeightsArr = [];
    for (var i = 0; i < rowNum; i++) {
        rowHeightsArr.push(200/rowNum);
    }
    var columnsArr = [];
    for (var i = 0; i < columnNum; i++) {
        columnsArr.push({renderer: "html"});
    }
    var container = document.getElementById(mubanTableId);
    var customRenderer = function(instance, td, row, col, prop, value, cellProperties) {
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
    var mubanHandsonTable = new Handsontable(container, mubanHandsonTableOptions);
    muban_handsonTable_arr.push(mubanHandsonTable)
    muban_handsonTableImgs.push([])
    //getMaxBoundingRectForHandson();

    initHandsonTableMuban(mubanHandsonTable, mubanTableIdNew);

    $('#' + mubanTableId).width(mubanHandsonTable.table.clientWidth);
    $('#' + mubanTableId).height(mubanHandsonTable.table.clientHeight);
    $('#' + mubanTableId + ' .wtHolder').each(function() {
        var parents = $(this).parents('.handsontable');
        if (parents.length > 0) {
            var parentHeight = $(parents[0]).height();
            var currentHeight = $(this).height();
            $(this).height(parentHeight);
        }
    });
    /*$('#' + mubanTableId).dragging({
        hander: '.ht_clone_top_left_corner',
        containment: '#paperSizeContainment'
    })*/
    wireHandsonContainerClick(mubanTableIdNew)
    $('#' + mubanTableId).draggable({
        handle: '.ht_clone_top_left_corner',
        containment: '#paperSizeContainment'
    })
}

function initHandsonTableMuban(handsonTable2, handsonTableId) {
    handsonTable2.addHook('beforeColumnResize', function(currentColumn, newSize, isDoubleClick) {
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
    handsonTable2.addHook('afterColumnResize', function(colIndex, newWidth, isDoubleClick) {
        console.log('Resized Column '+ colIndex + ' to ' + newWidth + ', old width: ' + handsonTable2.getColWidth(colIndex));
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
            tempHandsonTableOptions.width = handsonTableHelperObjHelper.maxWidth - 100
                //widthHelperOld;
            handsonTable2.table.clientWidth = handsonTableHelperObjHelper.maxWidth - 100
                //widthHelperOld;
            handsonTable2.updateSettings(tempHandsonTableOptions);
            var wtHolder = $(handsonTable2.table).parents('.wtHolder');
            if (wtHolder.length > 0) {
                $(wtHolder[0]).width(widthHelperOld);
            }
            $('#handsonContainer' + handsonTableId + ' .htCore th:nth-child('+(colIndex + 2)+')').each(function() {
                $(this).width(oldColWidth);
                $(this).find('*').each(function() {
                    $(this).width(oldColWidth);
                });
            });
            $('#handsonContainer' + handsonTableId + ' .htCore td:nth-child('+(colIndex + 2)+')').each(function() {
                $(this).width(oldColWidth);
                $(this).find('*').each(function() {
                    $(this).width(oldColWidth);
                });
            });
            $('#handsonContainer' + handsonTableId + ' .htCore col:nth-child('+(colIndex + 2)+')').each(function() {
                $(this).width(oldColWidth);
                $(this).find('*').each(function() {
                    $(this).width(oldColWidth);
                });
            });
            $("#handsonContainer" + handsonTableId).width(widthHelperOld);
            console.log("Exceeded max width returning false in afterColumnResize handler");
            return false;
        }
        tempHandsonTableOptions.width += widthDiff;

        tempHandsonTableOptions.height = tempHandsonTableOptions.clientHeight;
        tempHandsonTableOptions.clientWidth = tempHandsonTableOptions.width;

        tempHandsonTableOptions.colWidths[colIndex] = newWidth;
        handsonTable2.updateSettings(tempHandsonTableOptions);
        setTimeout(function() {
            //ToDo? 06/06/2020
            handsonTableSelected = handsonTableId
            resizeChartsMuban(handsonTable2, null, null, colIndex);
            updateRowHeadersAndColHeadersMuban();

            /*var wtHolder = $(handsonTable2.table).parents('.wtHolder');
            var wtHider = $(handsonTable2.table).parents('.wtHider');
            if (wtHolder.length > 0 && wtHider.length > 0) {
                $(wtHolder[0]).width(handsonTable2.table.clientWidth);
                $(wtHider[0]).width(handsonTable2.table.clientWidth);
                $(wtHolder[0]).height(handsonTable2.table.clientHeight);
                $(wtHider[0]).height(handsonTable2.table.clientHeight);
            }
            $("#handsonContainer" + handsonTableId).width(handsonTable2.table.clientWidth);
            $("#handsonContainer" + handsonTableId).height(handsonTable2.table.clientHeight);*/
            stabilizeHandsonTableMuban()
        }, 100);
    });
    handsonTable2.addHook('afterRowResize', function(rowIndex, newHeight, isDoubleClick) {
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
        setTimeout(function() {
            //ToDo 06/07/2020, which of these need refactored
            handsonTableSelected = handsonTableId
            resizeChartsMuban(handsonTable2, null, rowIndex, null);
            stabilizeHandsonTableSidesMuban(handsonTableSelected);
            updateRowHeadersAndColHeadersMuban();
            /*var wtHolder = $(handsonTable2.table).parents('.wtHolder');
            var wtHider = $(handsonTable2.table).parents('.wtHider');
            if (wtHolder.length > 0 && wtHider.length > 0) {
                $(wtHolder[0]).width(handsonTable2.table.clientWidth);
                $(wtHolder[0]).height(handsonTable2.table.clientHeight);
                $(wtHider[0]).width(handsonTable2.table.clientWidth);
                $(wtHider[0]).height(handsonTable2.table.clientHeight);
            }
            $("#handsonContainer" + handsonTableId).width(handsonTable2.table.clientWidth);
            $("#handsonContainer" + handsonTableId).height(handsonTable2.table.clientHeight);*/
            stabilizeHandsonTableMuban()
        }, 100);
    });
    handsonTable2.addHook('afterSelection', function(row, column, row2, column2, preventScrolling, selectionLayerLevel) {
        console.log("afterSelection row: " + row2 + ", column: " + column2);
        var currSelection = [row, column, row2, column2];
        var mergeCellHelper = fourCornersHelper(currSelection);
        var selectedCell = handsonTable2.getCell(mergeCellHelper.topLeft.y, mergeCellHelper.topLeft.x);

        //ToDo 06/07/2020 refactor
        handsonTableSelected = handsonTableId

        $(selectedCell).parents("#handsonContainer" + handsonTableId).find("td").removeClass("td-chosen-css");
        $(selectedCell).addClass("td-chosen-css");
        setTimeout(function() {
            stabilizeHandsonTableSidesMuban(handsonTableSelected);
            updateRowHeadersAndColHeadersMuban();

            /*var wtHolder = $(handsonTable2.table).parents('.wtHolder');
            var wtHider = $(handsonTable2.table).parents('.wtHider');
            if (wtHolder.length > 0 && wtHider.length > 0) {
                $(wtHolder[0]).width(handsonTable2.table.clientWidth);
                $(wtHolder[0]).height(handsonTable2.table.clientHeight);
                $(wtHider[0]).width(handsonTable2.table.clientWidth);
                $(wtHider[0]).height(handsonTable2.table.clientHeight);
            }
            $("#handsonContainer" + handsonTableId).width(handsonTable2.table.clientWidth);
            $("#handsonContainer" + handsonTableId).height(handsonTable2.table.clientHeight);*/
            stabilizeHandsonTableMuban()
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

var previewMuban = function(file) { //上传图片  创建插入图片标签
    var newImgDiv = document.createElement('IMG');
    newImgDiv.classList.add('img_driver1');

    //拖拉拽缩放
    var container = "img_driver"
    //缩略图类定义
    var Picture = function(file, container) {
        var height = 0,
            width = 0,
            ext = '',
            size = 0,
            name = '',
            path = '';
        var self = this;
        //getSelectedHandsonTableId()
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
                        success: function(response) {
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
                            if (handsonTableSelected > (muban_handsonTableImgs.length - 1)) {
                                var l = muban_handsonTableImgs.length
                                for (var x = 0; x < handsonTableSelected - l + 1; x++) {
                                    muban_handsonTableImgs.push({})
                                }
                            }
                            muban_handsonTableImgs[handsonTableSelected][currSelection[0][0] + ',' +
                            currSelection[0][1]] = imgClassNameFinal;
                        },
                        error: function() {
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
        this.get = function(name) {
            return self[name];
        };
        this.isValid = function() {
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
            var tableId = i
            var matchingHelper = $(muban_handsonTable_arr[i].table).parents("[id^='handsonContainer']")//attr('id')
            if (matchingHelper.length > 0) {
                matchingHelper = matchingHelper[0]
                tableId = $(matchingHelper).attr('id')
                tableId = tableId.replace('handsonContainer', '')
            }
            handsonTableSelected = tableId
            return handsonTableSelected
        }
    }
    handsonTableSelected = -1
    return handsonTableSelected
}

function updateRowHeadersAndColHeadersMuban() {
    //getSelectedHandsonTableId()
    if (handsonTableSelected < 0 || typeof handsonTableSelected === 'undefined') {
        return false;
    }
    var handsonTable2 = muban_handsonTable_arr[handsonTableSelected]
    var numOfRows = handsonTable2.countRows();
    var numOfCols = handsonTable2.countCols();
    var rowCounter = 0;
    var colCounter = 0;
    $('#handsonContainer' + handsonTableSelected + ' .ht_clone_top .htCore .colHeader').each(function() {
        if (colCounter > 0) {//<= numOfCols) {
            var h = $(this).html();
            var hSplitted = h.split(',');
            var colWidth = handsonTable2.getColWidth(colCounter-1);
            colWidth = parseFloat(colWidth.toFixed(1))
            $(this).html(hSplitted[0] + ',w:' + colWidth);
        }
        colCounter++;
    });

    /*for (var i = 0; i < numOfCols; i++) {
        var widthHelper = handsonTable.getColWidth(i);
    }*/
    $('#handsonContainer' + handsonTableSelected + ' .ht_clone_left .htCore .rowHeader').each(function() {
        if (rowCounter > 0) {// <= numOfRows) {
            var h = $(this).html();
            var hSplitted = h.split(',');
            var rowHeight = handsonTable2.getRowHeight(rowCounter-1);
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
    rowSpanHelper = rowSpanHelper < 1 ? 1:rowSpanHelper;
    var colSpanHelper = mergeCellHelper.topRight.x - mergeCellHelper.topLeft.x + 1;
    colSpanHelper = colSpanHelper < 1 ? 1:colSpanHelper;
    var newMergeCells = [];
    var tempHandsonTableOptions = handsonTable2.getSettings()
    if (tempHandsonTableOptions.mergeCells) {
        for (var i = 0; i < tempHandsonTableOptions.mergeCells.length; i++) {
            if (tempHandsonTableOptions.mergeCells[i].row >= mergeCellHelper.topLeft.y &&
                tempHandsonTableOptions.mergeCells[i].row <= mergeCellHelper.bottomLeft.y &&
                tempHandsonTableOptions.mergeCells[i].col >= mergeCellHelper.topLeft.x &&
                tempHandsonTableOptions.mergeCells[i].col <= mergeCellHelper.topRight.x) {

            } else {
                newMergeCells.push(tempHandsonTableOptions.mergeCells[i]);
            }
        }
    }
    tempHandsonTableOptions.mergeCells = newMergeCells;
    tempHandsonTableOptions.mergeCells.push(
        {row: mergeCellHelper.topLeft.y, col: mergeCellHelper.topLeft.x, rowspan: rowSpanHelper,
            colspan: colSpanHelper}
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
    if (tempHandsonTableOptions.mergeCells) {
        for (var i = 0; i < tempHandsonTableOptions.mergeCells.length; i++) {
            if (tempHandsonTableOptions.mergeCells[i].row !== mergeCellHelper.topLeft.y ||
                tempHandsonTableOptions.mergeCells[i].col !== mergeCellHelper.topLeft.x) {
                newMergeCells.push(tempHandsonTableOptions.mergeCells[i]);
            }
        }
    }
    tempHandsonTableOptions.mergeCells = newMergeCells;
    handsonTable2.updateSettings(tempHandsonTableOptions);
}

function deleteHandsonTableWrapper(e) {
    if (yemianOrMubanMode == 2) {
        //console.log("about to previewMuban...")
        //return false
        deleteHandsonTableMuban(e)
        return false
    } else {
        deleteHandsonTable(e)
        return false
    }
}

function deleteHandsonTableMuban(e) {
    //getSelectedHandsonTableId()
    if (handsonTableSelected < 0) {
        return false;
    }
    var handsonTable2
    var tableToDelete = -1
    for (var i = 0; i < muban_handsonTable_arr.length; i++) {

        var matchingHelper = $(muban_handsonTable_arr[i].table).parents("[id^='handsonContainer']")//attr('id')
        if (matchingHelper.length > 0) {
            matchingHelper = matchingHelper[0]
            tableId = $(matchingHelper).attr('id')
            tableId = tableId.replace('handsonContainer', '')
            if (Number(tableId) === handsonTableSelected) {
                handsonTable2 = muban_handsonTable_arr[i]
                tableToDelete = i
            }
        }
    }
    if (!handsonTable2 || typeof handsonTable2 === 'undefined' || tableToDelete < 0) {
        return false
    }
    var parents = $(handsonTable2.table).parents("#handsonContainer" + handsonTableSelected)
    //.ui-widget-content");
    if (parents.length > 0) {
        $(parents[0]).remove();
    }
    muban_handsonTable_arr.splice(tableToDelete, 1)
    muban_handsonTableImgs.splice(tableToDelete, 1)
}

function mubanInitFromHandOver(muban_handsonTableOptions_arr, muban_handsonTableOptionsAdd_arr) {
    console.log('inside mubanInitFromHandOver')
    for (var i2 = 0; i2 < muban_handsonTableOptions_arr.length; i2++) {
        var handsonTableOptions2 = muban_handsonTableOptions_arr[i2]
        var colNum = handsonTableOptions2.numOfCols;
        var rowNum = handsonTableOptions2.numOfRows;
        var columnsArr = [];
        for (var i = 0; i < colNum; i++) {
            columnsArr.push({renderer: "html"});
        }

        var clientWidthHelper = 50;
        var clientHeightHelper = 50;
        for (var i = 0; i < handsonTableOptions2.colWidths.length; i++) {
            if (!handsonTableOptions2.colWidths[i] || typeof handsonTableOptions2.colWidths[i] === 'undefined') {
                handsonTableOptions2.colWidths[i] = 20;
            }
            clientWidthHelper += handsonTableOptions2.colWidths[i];
        }

        for (var i = 0; i < handsonTableOptions2.rowHeights.length; i++) {
            if (!handsonTableOptions2.rowHeights[i] || typeof handsonTableOptions2.rowHeights[i] === 'undefined') {
                handsonTableOptions2.rowHeights[i] = 20;
            }
            clientHeightHelper += handsonTableOptions2.rowHeights[i];
        }

        handsonTableOptions2 = {
            data: handsonTableOptions2.data,//Handsontable.helper.createSpreadsheetData(6, 6),
            rowHeaders: true,
            colHeaders: true,
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
        var newTableId = (muban_handsonTableNextId++)
        $("#reportContCont").prepend(
            "<div id='handsonContainer" + newTableId + "' class='BigTable'></div>"
        )

        var container = document.getElementById('handsonContainer'+newTableId);

        handsonTable2 = new Handsontable(container, handsonTableOptions2);
        muban_handsonTable_arr.push(handsonTable2)
        initHandsonTableMuban(handsonTable2, newTableId);
        resizeChartsMuban(handsonTable2);
        /*$('#handsonContainer' + i2).dragging({
            hander: '.ht_clone_top_left_corner'
        })*/
        stabilizeHandsonTableMuban(newTableId)
        mubanTableDraggableWrapper('#handsonContainer' + newTableId)
        /*$('#handsonContainer' + newTableId).draggable({
            handle: '.ht_clone_top_left_corner',
            containment: '#paperSizeContainment',
            stop: function(event, ui) {
                mubanTableDragConstrainChecker('#handsonContainer' + newTableId, ui)
            }
        })*/
        wireHandsonContainerClick(newTableId)

        $('#handsonContainer'+newTableId).css('top', muban_handsonTableOptionsAdd_arr[i2].top)
        $('#handsonContainer'+newTableId).css('left', muban_handsonTableOptionsAdd_arr[i2].left)
        //for (var i = 0; i < muban_handsonTableImgs.length; i++) {
            for (var property in muban_handsonTableImgs[i2]) {
                $('.' + muban_handsonTableImgs[i2][property]).css('visibility', 'hidden')
            }
        //}
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
    for (var i = 0; i < muban_handsonTable_arr.length; i++) {
        //$('#handsonContainer' + i).hide()
        $('#handsonContainer' + i).css('visibility', 'hidden')
        $('#handsonContainer' + i + ' img').each(function(i) {
            $(this).css('visibility', 'hidden')
        })
    }
}

function mubanTableDraggableWrapper(selector) {
    $(selector).draggable({
        handle: '.ht_clone_top_left_corner',
        containment: '#paperSizeContainment',
        stop: function(event, ui) {
            mubanTableDragConstrainChecker(selector, ui)
        }
    })
}

function mubanTableDragConstrainChecker(handsonTableSelector, ui) {
    //things you can consider using
    //getBoundingClientRect().top
    //getBoundingClientRect().left
    //offsetTop
    //offsetLeft

    //check #paperSizeContainment
    //check .reportRhide
    //and handsonTableSelector

    //check is left crossed over ToDo

    //check is top crossed over ToDo

    //check is bottom crossed over ToDo

    //check is right crossed over

    var paperSizeContainmentOffset = $('#paperSizeContainment').offset()
    var reportRhideOffset = $('.reportRhide').offset()
    var handsonTableOffset = $(handsonTableSelector).offset()
    var actualWidth = reportRhideOffset.left - paperSizeContainmentOffset.left
    /*if ((handsonTableOffset.left - paperSizeContainmentOffset.left) + $(handsonTableSelector).width()
    ) {

    }*/
    if (handsonTableOffset.left + $(handsonTableSelector).width() > reportRhideOffset.left) {
        var newLeft = reportRhideOffset.left - $(handsonTableSelector).width() - 30
        $(handsonTableSelector).offset({left: newLeft})
        ui.position.left = newLeft - paperSizeContainmentOffset.left
        return newLeft
    }
}

function getRealHandsonTableRowHeightsAndColWidthsMuban(index) {
    var retObj = {rowHeights: [], colWidths: []};
    var rowIndex = 0;
    $('#handsonContainer' + index + ' .ht_master.handsontable .htCore tr').each(function() {
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

function stabilizeHandsonTableMuban(index) {
    if (typeof index === 'undefined') {
        getSelectedHandsonTableId()
        if (handsonTableSelected < 0) {
            return false;
        }
        index = handsonTableSelected
    }
    var handsonTable2 = muban_handsonTable_arr[index]//handsonTableSelected]
    setTimeout(function() {
        /*var wtHolder = $(handsonTable2.table).parents('.wtHolder');
        var wtHider = $(handsonTable2.table).parents('.wtHider');
        if (wtHolder.length > 0 && wtHider.length > 0) {
            $(wtHolder[0]).width(handsonTable2.table.clientWidth);
            $(wtHolder[0]).height(handsonTable2.table.clientHeight);
            $(wtHider[0]).width(handsonTable2.table.clientWidth);
            $(wtHider[0]).height(handsonTable2.table.clientHeight);
        }
        $("#handsonContainer" + index).width(handsonTable2.table.clientWidth);
        $("#handsonContainer" + index).height(handsonTable2.table.clientHeight);*/
        var wtHolder = $(handsonTable2.table).parents('.wtHolder');
        var wtHider = $(handsonTable2.table).parents('.wtHider');
        var hT_t_clientWidth = handsonTable2.table.clientWidth + 10
        var hT_t_clientHeight = handsonTable2.table.clientHeight + 10
        if (wtHolder.length > 0 && wtHider.length > 0) {
            if ($(wtHider[0]).width() > hT_t_clientWidth) {
                hT_t_clientWidth = $(wtHider[0]).width()
            } else {
                $(wtHider[0]).width(hT_t_clientWidth)
            }
            if ($(wtHider[0]).height() > hT_t_clientHeight) {
                hT_t_clientHeight = $(wtHider[0]).height()
            } else {
                $(wtHider[0]).height(hT_t_clientHeight)
            }
            $(wtHolder[0]).width(hT_t_clientWidth);
            $(wtHolder[0]).height(hT_t_clientHeight);
        }
        $("#handsonContainer" + index).width(hT_t_clientWidth);
        $("#handsonContainer" + index).height(hT_t_clientHeight);
    }, 100);
}

function stabilizeHandsonTableSidesMuban(index) {
    setTimeout(function() {
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

function wireHandsonContainerClick(i2) {
    $('#handsonContainer' + i2).click(function(e) {
        handsonTableSelected = i2
        console.log('clicked on handsonContainer' + i2)
    })
}