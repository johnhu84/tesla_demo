function labelPositionOptimizer(labelW, labelH, count, x1, y1) {
    var useTheseSides = {up: true, left: true, right: true, bottom: true};
    getLabelPositions2HelperObj = {};
    var minW = 30;
    var minH = 30;
    var pageScreenWidth = document.getElementById('pageScreen').offsetWidth;
    var pageScreenHeight = document.getElementById('pageScreen').offsetHeight;
    /*var containerWidth = document.getElementById('container').offsetWidth;
    var containerHeight = document.getElementById('container').offsetHeight;
    var containerLeft = document.getElementById('container').offsetLeft;
    var containerTop = document.getElementById('container').offsetTop;*/
    var containerWidth = document.getElementById('canvas').offsetWidth;
    var containerHeight = document.getElementById('canvas').offsetHeight;
    var containerLeft = document.getElementById('canvas').offsetLeft;
    var containerTop = document.getElementById('canvas').offsetTop;
//globalObj.spacing.pageSpacingUpDown, globalObj.spacing.pageSpacingLeftRight
    //globalObj.spacing.chartSpacingUpDown, globalObj.spacing.chartSpacingLeftRight
    var topHeight = containerTop - globalObj.spacing.pageSpacingUpDown;
    var topBottomWidth = 0;
    var leftRightHeight = 0;
    var topBottomCount = 0;
    var leftRightCount = 0;
    var topWidth = pageScreenWidth - (2 * globalObj.spacing.pageSpacingLeftRight);
    if (topHeight < minH || !globalObj.labelPosition['up']) {
        useTheseSides.up = false;
    } else {
        topBottomWidth += topWidth;
    }
    var leftWidth = containerLeft - globalObj.spacing.pageSpacingLeftRight;
    var leftHeight = containerHeight;
    if (leftWidth < minW || !globalObj.labelPosition['left']) {
        useTheseSides.left = false;
    } else {
        leftRightHeight += leftHeight;
    }
    var rightWidth = pageScreenWidth - containerWidth - containerLeft - globalObj.spacing.pageSpacingLeftRight;
    var rightHeight = containerHeight;
    if (rightWidth < minW || !globalObj.labelPosition['right']) {
        useTheseSides.right = false;
    } else {
        leftRightHeight += rightHeight;
    }
    var bottomWidth = topWidth;
    var bottomHeight = pageScreenHeight - containerHeight - containerTop - globalObj.spacing.pageSpacingUpDown;
    if (bottomHeight < minH || !globalObj.labelPosition['down']) {
        useTheseSides.bottom = false;
    } else {
        topBottomWidth += bottomWidth;
    }
    var labelR = labelW/labelH;
    var widthGreaterThanHeight = labelW > labelH;
    var labelWMax = leftWidth > rightWidth?rightWidth:leftWidth;//labelW;
    var labelHMax = topHeight > bottomHeight?bottomHeight:topHeight;//labelH;
    var labelW2 = labelWMax;
    var labelH2 = labelHMax;
    var labelH4 = Math.floor(labelW2/labelR);
    if (labelH4 <= labelH2) {
        labelH2 = labelH4;
    } else {
//This part needs to be checked
        labelW2 = Math.floor(labelH2 * labelR);
        /*if (labelW2 > ()) {
        //If it gets here, that's a problem
        console.log("problem
        }*/
    }
    var labelH3, labelW3;
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
//Do calculation to see if this width and height are optimal
//First check to see if labelW2 is less than labelWMax and labelH2 = labelHMax
        if (labelW2 < labelWMax && labelH2 < labelHMax) {
            /*topBottomCount = (topBottomWidth)/((labelW2 * 3) + (globalObj.spacing.chartSpacingLeftRight * 4));
            leftRightCount = (leftRightHeight)/((labelH2 * 3) + (globalObj.spacing.chartSpacingUpDown * 4));*/
            topBottomCount = Math.floor((topWidth)/((labelW2 * 3) + (globalObj.spacing.chartSpacingLeftRight * 4))) +
                Math.floor((bottomWidth)/((labelW2 * 3) + (globalObj.spacing.chartSpacingLeftRight * 4)));
            leftRightCount = Math.floor((leftHeight)/((labelH2 * 3) + (globalObj.spacing.chartSpacingUpDown * 4))) +
                Math.floor((rightHeight)/((labelH2 * 3) + (globalObj.spacing.chartSpacingUpDown * 4)));
            if ((topBottomCount + leftRightCount) >= count) {
                break;
            }
        }
    }
    /*
    * ToDo: Make this algorithm take into factor total area as opposed to total width and total height
    */
    var x1Up = [];
    var y1Up = [];
    var x1Left = [];
    var y1Left = [];
    var x1Right = [];
    var y1Right = [];
    var x1Down = [];
    var y1Down = [];
    for (var i in useTheseSides) {
        if (useTheseSides[i]) {
            switch (i) {
                case "up":
                    var startX = globalObj.spacing.pageSpacingLeftRight;
                    var startY = globalObj.spacing.pageSpacingUpDown;
                    while ((startX + (3 * labelW2)) < pageScreenWidth) {
                        x1Up.push(startX);
                        y1Up.push(startY);
                        startX += (3 * labelW2) + (globalObj.spacing.chartSpacingLeftRight * 4);
                    }
                    break;
                case "left":
                    var startX = globalObj.spacing.pageSpacingLeftRight;
                    var startY = containerTop;
                    while ((startY + (3 * labelH2)) < (containerTop + containerHeight)) {
                        x1Left.push(startX);
                        y1Left.push(startY);
                        startY += (3 * labelH2) + (globalObj.spacing.chartSpacingUpDown * 4);
                    }
                    break;
                case "right":
                    var startX = containerLeft + containerWidth;
                    var startY = containerTop;
                    while ((startY + (3 * labelH2)) < (containerTop + containerHeight)) {
                        x1Right.push(startX);
                        y1Right.push(startY);
                        startY += (3 * labelH2) + (globalObj.spacing.chartSpacingUpDown * 4);
                    }
                    break;
                case "bottom":
                    var startX = globalObj.spacing.pageSpacingLeftRight;
                    var startY = containerTop + containerHeight;
                    while ((startX + (3 * labelW2)) < pageScreenWidth) {

                        x1Down.push(startX);
                        y1Down.push(startY);
                        startX += (3 * labelW2) + (globalObj.spacing.chartSpacingLeftRight * 4);
                    }
                    break;
                default:
                    break;
            }
        }
    }
    var rotateHelper = 0;
    var x1Up2 = [];
    var y1Up2 = [];
    var x1Left2 = [];
    var y1Left2 = [];
    var x1Right2 = [];
    var y1Right2 = [];
    var x1Down2 = [];
    var y1Down2 = [];
    var tempCounter = 0;
    while ((x1Up.length > 0 || x1Left.length > 0 || x1Right.length > 0 || x1Down.length > 0) && tempCounter < count-1) {
        switch (rotateHelper++) {
            case 0:
                if (x1Up.length > 0) {
                    x1Up2.push(x1Up.shift());
                    y1Up2.push(y1Up.shift());
                    tempCounter++;
                }
                break;
            case 1:
                if (x1Left.length > 0) {
                    x1Left2.push(x1Left.shift());
                    y1Left2.push(y1Left.shift());
                    tempCounter++;
                }
                break;
            case 2:
                if (x1Right.length > 0) {
                    x1Right2.push(x1Right.shift());
                    y1Right2.push(y1Right.shift());
                    tempCounter++;
                }
                break;
            case 3:
                if (x1Down.length > 0) {
                    x1Down2.push(x1Down.shift());
                    y1Down2.push(y1Down.shift());
                    tempCounter++;
                }
                rotateHelper = 0;
                break;
            default:
                break;
        }
    }

    if (x1Up2.length > 0) {
        var upUsedWidth = (x1Up2[x1Up2.length - 1] + (labelW2 * 3)) - x1Up2[0];
        var upMarginX = (topWidth - upUsedWidth) / 2;
        var upMarginY = (topHeight - labelH2) / 2;
        upMarginX = isNaN(upMarginX)?0:upMarginX;
        upMarginY = isNaN(upMarginY)?0:upMarginY;
        for (var i = 0; i < x1Up2.length; i++) {
            x1Up2[i] = Math.floor(x1Up2[i] + upMarginX);
            y1Up2[i] = Math.floor(y1Up2[i] + upMarginY);
            getLabelPositions2HelperObj[x1Up2[i] + ',' + y1Up2[i]] = 'up';
        }
    }

    if (x1Left2.length > 0) {
        var leftUsedHeight = (y1Left2[y1Left2.length - 1] + (labelH2 * 3)) - y1Left2[0];
        var leftMarginX = (leftWidth - labelW2) / 2;
        var leftMarginY = (leftHeight - leftUsedHeight) / 2;
        leftMarginX = isNaN(leftMarginX)?0:leftMarginX;
        leftMarginY = isNaN(leftMarginY)?0:leftMarginY;
        for (var i = 0; i < x1Left2.length; i++) {
            //x1Left2[i] = Math.floor(x1Left2[i] + leftMarginX);
            y1Left2[i] = Math.floor(y1Left2[i] + leftMarginY);
            getLabelPositions2HelperObj[x1Left2[i] + ',' + y1Left2[i]] = 'left';
        }
    }

    if (x1Right2.length > 0) {
        var rightUsedHeight = (y1Right2[y1Right2.length - 1] + (labelH2 * 3)) - y1Right2[0];
        //var rightMarginX = (rightWidth - labelW2) / 2;
        var rightMarginX = pageScreenWidth - (containerLeft + containerWidth) - (labelW2 + globalObj.spacing.pageSpacingLeftRight);
        //labelW2
        //globalObj.spacing.pageSpacingLeftRight
        var rightMarginY = (rightHeight - leftUsedHeight) / 2;
        rightMarginX = isNaN(rightMarginX)?0:rightMarginX;

        rightMarginY = isNaN(rightMarginY)?0:rightMarginY;
        for (var i = 0; i < x1Right2.length; i++) {
            x1Right2[i] = Math.floor(x1Right2[i] + rightMarginX);
            y1Right2[i] = Math.floor(y1Right2[i] + rightMarginY);
            getLabelPositions2HelperObj[x1Right2[i] + ',' + y1Right2[i]] = 'right';
        }
    }

    if (x1Down2.length > 0) {
        var downUsedWidth = (x1Down2[x1Down2.length - 1] + (labelW2 * 3)) - x1Down2[0];
        var downMarginX = (bottomWidth - downUsedWidth) / 2;
        var downMarginY = (bottomHeight - labelH2) / 2;
        downMarginX = isNaN(downMarginX)?0:downMarginX;
        downMarginY = isNaN(downMarginY)?0:downMarginY;
        for (var i = 0; i < x1Down2.length; i++) {
            x1Down2[i] = Math.floor(x1Down2[i] + downMarginX);
            y1Down2[i] = Math.floor(y1Down2[i] + downMarginY);
            getLabelPositions2HelperObj[x1Down2[i] + ',' + y1Down2[i]] = 'down';
        }
    }
    
    rotateHelper = 0;
    while (x1Up2.length > 0 || x1Left2.length > 0 || x1Right2.length > 0 || x1Down2.length > 0) {
        switch (rotateHelper++) {
            case 0:
                if (x1Up2.length > 0) {
                    x1.push(x1Up2.shift());
                    y1.push(y1Up2.shift());
                }
                break;
            case 1:
                if (x1Left2.length > 0) {
                    x1.push(x1Left2.shift());
                    y1.push(y1Left2.shift());
                }
                break;
            case 2:
                if (x1Right2.length > 0) {
                    x1.push(x1Right2.shift());
                    y1.push(y1Right2.shift());
                }
                break;
            case 3:
                if (x1Down2.length > 0) {
                    x1.push(x1Down2.shift());
                    y1.push(y1Down2.shift());
                }
                rotateHelper = 0;
                break;
            default:
                break;
        }
    }
//labelW2 and labelH2 are now the target width and height of each label
    return {width: labelW2, height: labelH2, originalWidth: labelW, originalHeight: labelH};
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

/*
 * Merge Cell looks like this
 * row: 1
 * col: 1
 * rowspan: 2
 * colspan: 2
*/
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

function hackThisHandsonTable() {
    /*var rowHelper = 0;
    $(handsonTable.table).find('tr').each(function() {
        var colHelper = 0;
        //var mergedCellRowAndCol = getMergedCellRowAndCol(rowHelper, colHelper);
        //var rowHeightHelper = handsonTable.getRowHeight(rowHelper);
        //var colWidthHelper = handsonTable.getColWidth(colHelper);
        $(this).find('td').each(function() {
            $(this).removeAttr('style');
            var rowHeightHelper = handsonTable.getRowHeight(rowHelper);
            //$(this).height();
            var colWidthHelper = $(this).width();
            var hackThisHandsonTableDiv = $(this).find('div');
            var hackThisHandsonTableSubDiv = $(hackThisHandsonTableDiv[0]).find('div');
            var hackThisHandsonTableDivId = $(hackThisHandsonTableDiv[0]).attr('id');
            var hackThisHandsonTableSubDivId = ''
            if (hackThisHandsonTableSubDiv && hackThisHandsonTableSubDiv.length > 0) {
                hackThisHandsonTableSubDivId = $(hackThisHandsonTableSubDiv[0]).attr('id');
            }
            if (hackThisHandsonTableDiv && hackThisHandsonTableDiv.length > 0
                && (hackThisHandsonTableSubDivId === '' ||
                    typeof hackThisHandsonTableSubDivId === 'undefined') &&
                (typeof handThisHandsonTableDivId === 'undefined'
                    || hackThisHandsonTableDivId === '')) {
                $(hackThisHandsonTableDiv[0]).css('width', colWidthHelper + "px");
                $(hackThisHandsonTableDiv[0]).css('height', rowHeightHelper + "px");
                if (hackThisHandsonTableSubDiv && hackThisHandsonTableSubDiv.length > 0) {
                    $(hackThisHandsonTableSubDiv[0]).css('width', colWidthHelper + 'px');
                    $(hackThisHandsonTableSubDiv[0]).css('height', rowHeightHelper + 'px');
                }
            }
            colHelper++;
        });
        rowHelper++;
    });*/
}

function applyTrendMapSettings(trendMapSettings, row, col, height, width, id, points) {
    /*var TrendMapHtml = '<div class="" id="' + id +
        '" style="height:' + height + 'px;width:' + width + 'px;overflow:hidden;"></div>'
    var tempHandsonTableOptions = handsonTableOptions;
    tempHandsonTableOptions.data[row][col] = TrendMapHtml;
    handsonTable.updateSettings(tempHandsonTableOptions);*/
    var el = document.getElementById(id);
    //趋势图
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
        data: [],
        width: width,
        height: height,
        Identification: [],
        dataIdentificationLine:[],
    }
    for (var i = 0; i < points.pcs.length; i++) {
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
        }
    }
    lineChart.setData(settings);
    /*if (document.getElementById(id)) {
        tempHandsonTableOptions.data[row][col] = document.getElementById(id).outerHTML;
        handsonTable.updateSettings(tempHandsonTableOptions);
        handsonTableHelperObjTrendMapsCache[id] = document.getElementById(id).outerHTML;
    } else {
        console.log("id, " + id + " is empty or null around line 515 of file my3.js");
    }*/
}

function labelPositionOptimizerUsingArea(labelW, labelH, count, x1, y1) {
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
        }
    }
    return {width: minW, height: minH, originalWidth: labelW, originalHeight: labelH};
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
        up: upSideHeight >= labelH?true:false,
        left: leftSideWidth >= labelW?true:false,
        right: rightSideWidth >= labelW?true:false,
        down: downSideHeight >= labelH?true:false
    };
    var startPositions = {
        up: {
            startX: useTheseSides.up?globalObj.spacing.pageSpacingLeftRight:0,
            startY: useTheseSides.up?globalObj.spacing.pageSpacingUpDown:0,
            endX: useTheseSides.up?pageScreenWidth:0,
            endY: useTheseSides.up?containerTop:0,
            currentX: 0
        },
        left: {
            startX: useTheseSides.left?globalObj.spacing.pageSpacingLeftRight:0,
            startY: useTheseSides.left?(useTheseSides.up?containerTop:globalObj.spacing.pageSpacingUpDown):0,
            endX: useTheseSides.left?containerLeft:0,
            endY: useTheseSides.left?(useTheseSides.down?pageScreenHeight:containerTop+containerHeight):0,
            currentY: 0
        },
        right: {
            startX: useTheseSides.right?containerLeft+containerWidth:0,
            startY: useTheseSides.right?(useTheseSides.up?containerTop:globalObj.spacing.pageSpacingUpDown):0,
            endX: useTheseSides.right?pageScreenWidth:0,
            endY: useTheseSides.right?(useTheseSides.down?containerTop+containerHeight:pageScreenHeight):0,
            currentY: 0
        },
        down: {
            startX: useTheseSides.down?globalObj.spacing.pageSpacingLeftRight:0,
            startY: useTheseSides.down?containerTop+containerHeight:0,
            endX: useTheseSides.down?pageScreenWidth:0,
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
    while (countHelper < count - 1) {
        var lastCountHelper = countHelper;
        switch(roundRobinULRD) {
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
        leftMarginX = isNaN(leftMarginX)?0:leftMarginX;
        leftMarginY = isNaN(leftMarginY)?0:leftMarginY;
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

function TrendMapTester(el, pcs, width, height) {
    var lineChart = new D3LineChart1(el, {});
    var settings = {
        dataLineStyle: [{ //数据线样式
            color: "blue",
            lineStyle: "empty", //real实线
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
        Identification: [{ //标识线数据格式
            color: 'blue',
            value: 1.3,
            lineWidth: "5,5",
            lineStyle: "real" //实线
        },{ //标识线数据格式
            color: 'blue',
            value: -1.3,
            lineWidth: "5,5",
            lineStyle: "real" //实线
        }, {
            color: 'blue',
            value: -1.4,
            lineWidth: "10,10",
            lineStyle: "empty" //虚线
        }, {
            color: 'blue',
            value: 1.4,
            lineWidth: "10,10",
            lineStyle: "empty" //虚线
        }],
        dataIdentificationLine:[ //折线数据
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
        ]
    }
    settings.data.push({
        name: 'S005',
        value: 1.1,
        color:"red",
        symbol:3,
    })
    var counter = 0;
    for (var i in pcs) {
        settings.data.push({name: 'S0' + (counter++), value: pcs[i],
            color:"red",symbol:5});
    }
    lineChart.setData(settings);
}

function setTrendMap(id,data,BigobjHelper,widthHelper2,heightHelper2){
    var el = document.getElementById(id);
    var lineChart = new D3LineChart1(el, {});
    var setData = []; //拼成图表所需的数据格式
    var totalNum=0;//数据和  用来求平均数
    var result=data.pcs||[];//数据
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
    if (typeof tolerance !== 'undefined') {
        tolerance.sort(compare)//公差排序
        for (var i = 0; i < tolerance.length - 1; i++) {//  循环生成 公差判断条件
            var item = {}
            if (i == tolerance.length - 1) {
                item.Rule = "startTime>=" + new Date(Date.parse(tolerance[i - 1].fvlBeginTime)).getTime()
                item.fvlBeginTime = tolerance[i].fvlBeginTime
                item.fvlHivalue = tolerance[i].fvlHivalue
                item.fvlLovalue = tolerance[i].fvlLovalue
            } else {
                if (new Date(Date.parse(tolerance[i + 1].fvlBeginTime)).getTime()) {
                    item.Rule = new Date(Date.parse(tolerance[i].fvlBeginTime)).getTime() + "<=startTime<" + new Date(Date.parse(tolerance[i + 1].fvlBeginTime)).getTime()

                } else {
                    item.Rule = new Date(Date.parse(tolerance[i].fvlBeginTime)).getTime() + "<=startTime"
                }
                item.fvlBeginTime = tolerance[i].fvlBeginTime
                item.fvlHivalue = tolerance[i].fvlHivalue
                item.fvlLovalue = tolerance[i].fvlLovalue

            }
            toleranceRule.push(item)
        }
    }

    for (var i = 0; i < result.length; i++) {//数据格式生成
        item = {};
        item.name = result[i].s_label
        item.value = result[i].pc

        //item.name = i
        //item.value = result[i]

        item.color=firstDataStyle.dSBgColorInput1||"green"
        // item.symbol=firstDataStyle.DataTypeShowElement//||BigobjHelper.dataStyles.symbol
        item.symbol= typeof firstDataStyle.DataTypeShowElement !== 'undefined'?firstDataStyle.DataTypeShowElement:6;
        setData.push(item)//数据生成

        var startTime= new Date(Date.parse(result[i].s_createdatetime)).getTime();
        //ToDo: how is this toleranceRule not length 0 in customReport?
        if(toleranceRule.length > 0 && startTime < Number(toleranceRule[0].Rule.split("<")[0].replace("=",""))){
            setData[i].fvlLovalue = Number(tolerance[tolerance.length-1].fvlLovalue)//数据下公差
            setData[i].fvlHivalue = Number(tolerance[tolerance.length-1].fvlHivalue)//数据上公差
        }else if(toleranceRule.length > 0 && startTime >= Number(toleranceRule[toleranceRule.length-1].Rule.split("<")[0].replace("=",""))){
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
                    if (typeof result !== 'undefined')
                        result.sort(sortId).reverse();
                    if (typeof setData !== 'undefined')
                        setData.sort(sortdata).reverse();
                }else if(BigobjHelper.miscRadio2){
                    if (typeof result !== 'undefined')
                        result.sort(sortId)
                    if (typeof setData !== 'undefined')
                        setData.sort(sortdata)
                }
                for (var i = 0; i < result.length; i++) {
                    if (typeof result !== 'undefined')
                        result[i].pc=Math.abs(result[i].pc)
                    if (typeof setData !== 'undefined')
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
                    var tolerance1 = data.featvarLimits||[];//公差
                    for(var z=0;z<tolerance1.length;z++){
                        tolerance1[z].fvlHivalue=UpToleranceLine(tolerance1[z].fvlHivalue,tolerance1[z].fvlLovalue,Number(BigobjHelper.instructionLines[j].RangeNumber))
                        tolerance1[z].fvlLovalue=DownToleranceLine(tolerance1[z].fvlHivalue,tolerance1[z].fvlLovalue,Number(BigobjHelper.instructionLines[j].RangeNumber))
                    }
                    for(var i=0;i<result.length;i++){
                        var startTime= new Date(Date.parse(result[i].s_createdatetime)).getTime();
                        if(toleranceRule.length > 0 && startTime < Number(toleranceRule[0].Rule.split("<")[0].replace("=",""))){
                            var timeItem={};
                            var timeItemLow={};
                            timeItem.x= result[i].s_label
                            timeItem.y= tolerance1[tolerance1.length-1].fvlHivalue
                            timeItemLow.x=result[i].s_label
                            timeItemLow.y = Number(tolerance1[tolerance1.length-1].fvlLovalue)
                            dataIdentificationLine.push(timeItem)
                            dataIdentificationLineLow.push(timeItemLow)
                        }else if(toleranceRule.length > 0 && startTime >= Number(toleranceRule[toleranceRule.length-1].Rule.split("<")[0].replace("=",""))){
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