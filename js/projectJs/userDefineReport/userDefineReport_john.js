var straightLines = []
var straightLineSettings = []
var operationTexts = []
$(document).ready(function() {
    $('#straightLineColor').colorpicker()
if (!mxClient.isBrowserSupported())
{
    // Displays an error message if the browser is not supported.
    mxUtils.error('Browser is not supported!', 200, false);
}
else {
    // Disables the built-in context menu
    mxEvent.disableContextMenu(document.getElementById('reportContCont'));

    // Creates the graph inside the given container
    graph = new mxGraph(document.getElementById('reportContCont'));

    // Enables rubberband selection
    new mxRubberband(graph);
    graph.addListener(mxEvent.CLICK, function(sender, evt){
        console.log("mxEvent.SELECT event fired")
        var cell = evt.getProperty("cell"); // cell may be null
        if (cell != null) {
            var selectedCellIndex = straightLines.indexOf(cell)
            straightLineSelected = cell
            if (selectedCellIndex >= 0) {
                $(".operationCont .straightLine").show().siblings().hide()
                loadStraightLineSelectedProperties()
            }
        }
        evt.consume();
        graph.getModel().beginUpdate();
            try {

            } finally {
                graph.getModel().endUpdate();
                graph.refresh();
            }
    });

    graph.getModel().addListener(mxEvent.SCALE, function(sender, evt){
        console.log('SCALE ' + evt)
    })

    graph.getModel().addListener(mxEvent.TRANSLATE, function(sender, evt){
        console.log('TRANSLATE ' + evt)
    })

    graph.getModel().addListener(mxEvent.SCALE_AND_TRANSLATE, function(sender, evt){
        console.log('SCALE AND TRANSLATE ' + evt)
    })

    graph.getModel().addListener(mxEvent.RESIZE_CELLS, function(sender, evt){
        console.log('RESIZE CELLS ' + evt)
    })

    graph.getModel().addListener(mxEvent.CELLS_RESIZED, function(sender, evt){
        console.log('CELLS RESIZED ' + evt)
    })

    /*graph.getModel().addListener(mxEvent.SCALE_AND_TRANSLATE, function(sender, evt){
        console.log('SCALE AND TRANSLATE ' + evt)
    })

    graph.getModel().addListener(mxEvent.RESIZE_CELLS, function(sender, evt){
        console.log('RESIZE CELLS ' + evt)
    })

    graph.getModel().addListener(mxEvent.CELLS_RESIZED, function(sender, evt){
        console.log('CELLS RESIZED ' + evt)
    })*/
    //handoverReport($('#id').val());
    setTimeout(function() {
        layer.closeAll()
    },1000)

    //setTimeout(function() {
            $('#container').css('position', 'absolute!important')
            $('#container').css('top', '5%')
            $('#container').css('left', '15%')
    //}, 3000)
}
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        if ((key === "Backspace" || key === "Delete") && graph && typeof graph !== 'undefined') {
            //graph.selectChildCell();
            //graph.removeCells();
            var selectedCell = graph.getSelectionCell()
            var selectedCellIndex = straightLines.indexOf(selectedCell)
            if (selectedCellIndex >= 0) {
                straightLines.splice(selectedCellIndex, 1)
                straightLineSettings.splice(selectedCellIndex, 1)

                //graph.removeCells([selectedCell.source, selectedCell.target, selectedCell])

            }
            graph.getModel().beginUpdate();
            try {
                if (straightLineSelected) {
                    graph.getModel().remove(straightLineSelected.source)
                    graph.getModel().remove(straightLineSelected.target)
                    graph.getModel().remove(straightLineSelected)
                }
                graph.getModel().remove(selectedCell.source)
                graph.getModel().remove(selectedCell.target)
                graph.getModel().remove(selectedCell)
                } catch (e) {
                console.log("error in document keydown: " + e)
            } finally {
                    graph.getModel().endUpdate();
                graph.refresh();
                }

        }
    });
})

function addStraightLine()
{
    if (graph && typeof graph !== 'undefined') {
        // Gets the default parent for inserting new cells. This
        // is normally the first child of the root (ie. layer 0).
        var parent = graph.getDefaultParent();

        // Adds cells to the model in a single step
        graph.getModel().beginUpdate();
        try
        {
            var v1 = graph.insertVertex(parent, null, '', 20, 20, 0, 0,
                'fontSize=16;align=left;spacingTop=10;spacingLeft=10;verticalAlign=top;fontColor=#ffffff;fillColor=#1e4093;rounded=1;strokeColor=none;');
            var v2 = graph.insertVertex(parent, null, '', 460, 20, 0, 0,
                'fontSize=16;align=left;spacingTop=10;spacingLeft=10;verticalAlign=top;fontColor=#ffffff;fillColor=#69b630;rounded=1;strokeColor=none;');

            // Edge from left to right
            //var e1 = graph.insertEdge(parent, null, '', v1, v2,
                //'strokeColor=#69b630;strokeWidth=3;endArrow=classic;endSize=8;');
            var e1 = graph.insertEdge(parent, null, '', v1, v2,
                'endArrow=classic;');
            straightLines.push(e1)
            straightLineSettings.push({})
            /*e1.addListener('select', function(e) {
                $(".operationCont .straightLine").show().siblings().hide()
            });*/
        }
        finally
        {
            // Updates the display
            graph.getModel().endUpdate();
        }
    }
}

function getSelectedHandsonTableId() {
    for (var i = 0; i < handsonTable_arr.length; i++) {
        var handsonTable = handsonTable_arr[i]
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

function updateStraightLine(e) {
    if (!straightLineSelected) {
        return false
    }
    var straightLineStyle = $('#straightLineStyle').val()
    var straightLineStartArrow = $('#straightLineStartArrow').is(':checked')
    var straightLineEndArrow = $('#straightLineEndArrow').is(':checked')
    var straightLineColor = $('#straightLineColor').val()
    var straightLineStyleStr = 'html=1;'
    if (straightLineStyle && straightLineStyle === 'solid') {
        straightLineStyleStr += 'dashed=1;dashPattern=1;'
    }
    if (straightLineStartArrow) {
        straightLineStyleStr += 'startArrow=classic;'
    } else {
        straightLineStyleStr += 'startArrow=none;'
    }
    if (straightLineEndArrow) {
        straightLineStyleStr += 'endArrow=classic;'
    } else {
        straightLineStyleStr += 'endArrow=none;'
    }
    if (straightLineColor && straightLineColor.length > 0) {
        straightLineStyleStr += 'strokeColor=' + straightLineColor + ';'
    }

    graph.getModel().beginUpdate();
    try
    {
        straightLineSelected.setStyle(straightLineStyleStr)
    }
    finally
    {
        // Updates the display
        graph.getModel().endUpdate();
        graph.refresh()
    }
}

function loadStraightLineSelectedProperties() {
    if (!straightLineSelected) {
        return false
    }
    var straightLineStyleStr = straightLineSelected.getStyle()
    var straightLineStyleArr = straightLineStyleStr.split(';')
    //endArrow=classic;startArrow=classic;html=1;dashed=1;dashPattern=1 1;
    var straightLineEndArrow = false
    var straightLineStartArrow = false
    var straightLineStyle = 'dotted'
    for (var i = 0; i < straightLineStyleArr.length; i++) {
        var straightLineStyleArrHelper = straightLineStyleArr[i].split('=')
        if (straightLineStyleArrHelper.length > 0) {
            switch (straightLineStyleArrHelper[0]) {
                case 'endArrow':
                    if (straightLineStyleArrHelper[1] === 'classic') {
                        $('#straightLineEndArrow').prop('checked', true)
                        straightLineEndArrow = true
                    }
                    break;
                case 'startArrow':
                    if (straightLineStyleArrHelper[1] === 'classic') {
                        $('#straightLineStartArrow').prop('checked', true)
                        straightLineStartArrow = true
                    }
                    break;
                case 'dashed':
                    straightLineStyle = 'solid'
                    break;
                case 'strokeColor':
                    $('#straightLineColor').val(straightLineStyleArrHelper[1])
                default:
                    break;
            }
        }
    }
    if (!straightLineEndArrow) {
        $('#straightLineEndArrow').prop('checked', false)
    }
    if (!straightLineStartArrow) {
        $('#straightLineStartArrow').prop('checked', false)
    }
    $('#straightLineStyle').val(straightLineStyle).change()
}

function addStraightLines(newStraightLines)
{
    if (graph && typeof graph !== 'undefined') {
        // Gets the default parent for inserting new cells. This
        // is normally the first child of the root (ie. layer 0).
        var parent = graph.getDefaultParent();

        // Adds cells to the model in a single step
        graph.getModel().beginUpdate();
        try
        {
            for (var i = 0; i < newStraightLines.length; i++) {
                var v1 = graph.insertVertex(parent, null, '', newStraightLines[i].source.x,
                    newStraightLines[i].source.y, 0, 0,
                    'fontSize=16;align=left;spacingTop=10;spacingLeft=10;verticalAlign=top;fontColor=#ffffff;fillColor=#69b630;rounded=1;strokeColor=none;');
                var v2 = graph.insertVertex(parent, null, '', newStraightLines[i].target.x,
                    newStraightLines[i].target.y, 0, 0,
                    'fontSize=16;align=left;spacingTop=10;spacingLeft=10;verticalAlign=top;fontColor=#ffffff;fillColor=#69b630;rounded=1;strokeColor=none;');

                // Edge from left to right
                //var e1 = graph.insertEdge(parent, null, '', v1, v2,
                //'strokeColor=#69b630;strokeWidth=3;endArrow=classic;endSize=8;');
                var e1 = graph.insertEdge(parent, null, '', v1, v2,
                    newStraightLines[i].style);
                straightLines.push(e1)
                straightLineSettings.push({})
            }
        }
        finally
        {
            // Updates the display
            graph.getModel().endUpdate();
        }
    }
}

function deleteTextBox(textBoxId, e) {
    e.preventDefault()
    e.stopPropagation()
    for (const property in operationTexts) {
        if (property == textBoxId) {
            delete operationTexts[property]
            $('#' + textBoxId).remove()
            return false
        }
    }
}

function mergeCell() { //合并单元格
    getSelectedHandsonTableId()
    if (handsonTableSelected < 0)
        return false
    var currSelection = handsonTable_arr[handsonTableSelected].getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    var mergeCellHelper = fourCornersHelper(currSelection[0]);
    //handsonTable.merge(mergeCellHelper.topLeft.y, mergeCellHelper.topLeft.x, mergeCellHelper.bottomRight.y, mergeCellHelper.bottomRight.x);
    var rowSpanHelper = mergeCellHelper.bottomLeft.y - mergeCellHelper.topLeft.y + 1;
    rowSpanHelper = rowSpanHelper < 1 ? 1:rowSpanHelper;
    var colSpanHelper = mergeCellHelper.topRight.x - mergeCellHelper.topLeft.x + 1;
    colSpanHelper = colSpanHelper < 1 ? 1:colSpanHelper;
    var newMergeCells = [];
    for (var i = 0; i < handsonTableOptions_arr[handsonTableSelected].mergeCells.length; i++) {
        if (handsonTableOptions_arr[handsonTableSelected].mergeCells[i].row >=
            mergeCellHelper.topLeft.y && handsonTableOptions_arr[handsonTableSelected].mergeCells[i].row <= mergeCellHelper.bottomLeft.y &&
            handsonTableOptions_arr[handsonTableSelected].mergeCells[i].col >= mergeCellHelper.topLeft.x && handsonTableOptions_arr[handsonTableSelected].mergeCells[i].col <= mergeCellHelper.topRight.x) {

        } else {
            newMergeCells.push(handsonTableOptions_arr[handsonTableSelected].mergeCells[i]);
        }
    }
    handsonTableOptions_arr[handsonTableSelected].mergeCells = newMergeCells;
    handsonTableOptions_arr[handsonTableSelected].mergeCells.push(
        {row: mergeCellHelper.topLeft.y, col: mergeCellHelper.topLeft.x, rowspan: rowSpanHelper,
            colspan: colSpanHelper}
    );
    handsonTable_arr[handsonTableSelected].updateSettings(handsonTableOptions_arr[handsonTableSelected]);
    resizeCharts();
    stabilizeHandsonTable();
    stabilizeHandsonTableSides();
}

function fourCornersHelper(handsonHighlighted) {
    var retObj = {topLeft: {x: 0, y: 0}, topRight: {x: 0, y: 0}, bottomLeft: {x: 0, y: 0}, bottomRight: {x: 0, y: 0}};
    if (handsonHighlighted[1] < handsonHighlighted[3]) {
        retObj.topLeft.x = handsonHighlighted[1];
        retObj.bottomLeft.x = handsonHighlighted[1];
        retObj.topRight.x = handsonHighlighted[3];
        retObj.bottomRight.x = handsonHighlighted[3];
    } else {
        retObj.topLeft.x = handsonHighlighted[3];
        retObj.bottomLeft.x = handsonHighlighted[3];
        retObj.topRight.x = handsonHighlighted[1];
        retObj.bottomRight.x = handsonHighlighted[1];
    }
    if (handsonHighlighted[0] < handsonHighlighted[2]) {
        retObj.topLeft.y = handsonHighlighted[0];
        retObj.topRight.y = handsonHighlighted[0];
        retObj.bottomLeft.y = handsonHighlighted[2];
        retObj.bottomRight.y = handsonHighlighted[2];
    } else {
        retObj.topLeft.y = handsonHighlighted[2];
        retObj.topRight.y = handsonHighlighted[2];
        retObj.bottomLeft.y = handsonHighlighted[0];
        retObj.bottomRight.y = handsonHighlighted[0];
    }
    return retObj;
}

function insert3DPly() {
    console.log("insert3DPly")
    var canvasId = 'container' + threeJsModels.length
    var canvasHtml = '<div id="' + canvasId + '" style="width:530px;height:390px;' +
        'background-color:green;"><canvas id="canvas" style="margin-top:15px;margin-left:15px;"></canvas></div>'
    $('.reportContCont').prepend(canvasHtml)
    onLoadDoCanvasStuff()
    var modelType = 'ply'//document.getElementById('file-type-select').value;
    var modelName = '2.ply'//document.getElementById('file-name-select').value;
    var path = "report/models/";//"./models/";
    loadModel(modelType, modelName, path);
}

(function() {
    //onLoadDoCanvasStuff()
})();
function onLoadDoCanvasStuff() {
    var canvasWidth = 500;
    var canvasHeight = 360;
    var fov = 30;
    var near = 0.1;
    var far = 100;
    var ambientColor = 0xcccccc;
    var ambientIntensity = 0.2;
    var pointColor = 0xffffff;
    var pointIntensity = 0.8;
    var backgroundColor = 0xaaaaaa;
    draw(canvasWidth, canvasHeight, fov, near, far, ambientColor, ambientIntensity, pointColor, pointIntensity, backgroundColor);
}

function make(sId,fId, isFromUpdateLabel){
    if (isFromUpdateLabel) {
        $('.spinner, #overlay').show();
    }
    console.log("点击了生成报告");
    //uncomment this when getSpecialPointsLocation is ready
    return false
//    var handoverReportId = $("#handoverReport").val();

    // holi's code
    // 获得canvas上面所有的点 -> 3d.js
    getSpecialPointsLocation(function(data){
        if(data) {
            var options = "<option value=\"-1\">请选择</option>\n";
            $("#boxs").html(options);
            var array = [];
            var page = 0;
            // 每页显示点的个数
            var perPageShowCount = 4;
            for(var i in data) {
                if(i > 0 && i % perPageShowCount == 0) {
                    options = "<option zdy='" + JSON.stringify(array) + "' value='" + i + "'>第" + (++page) + "页</option>";
                    $("#boxs").append(options);
                    array = [];
                }

                array.push({
                    "flabel": data[i].id,
                    // 3d 坐标
                    "coordinate": data[i].x + "," + data[i].y + "," + data[i].z,
                    // 2d 坐标 x
                    "screen_x": data[i].screen_x,
                    // 2d 坐标 y
                    "screen_y": data[i].screen_y
                });
            }

            if(array.length > 0) {
                options = "<option zdy='" + JSON.stringify(array) + "' value='" + i + "'>第" + (++page) + "页</option>";
                $("#boxs").append(options);
            }

            $('body').append('<div class="selectnodeCompleted"></div>');

            if (isFromUpdateLabel) {
                updateLabelHandler();
            }
            $('.spinner, #overlay').hide();
        }

        samples1 = [];
    });
}