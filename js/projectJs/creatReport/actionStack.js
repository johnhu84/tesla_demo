/*
*All the helper objects
handsonTable
handsonTableOptions
handsonTableHelperObj
handsonTableArr
handsonTableOptions
BigobjHelper
handsonTableHelperObjArr
handsonTableHelperObjImgs
handsonTableHelperObjParetos
handsonTableHelperObjParetoSettings
handsonTableHelperObjTrendMaps
handsonTableHelperObjTrendMapSettings
handsonTableHelperObjHistograms
handsonTableHelperObjHistogramSettings
handsonTableHelperObjControlCharts
handsonTableHelperObjControlChartSettings
handsonTableHelperObjBoxLineCharts
handsonTableHelperObjBoxLineChartSettings
handsonTableHelperObjSigmaMaps
handsonTableHelperObjSigmaMapSettings
handsonTableHelperObjPieCharts
handsonTableHelperObjPieChartSettings
handsonTableHelperObjStackingMapCharts
handsonTableHelperObjStackingMapChartSettings
handsonTableHelperObjHelper
 */
var deepCopyHandsonTableHelperObj;
const MAX_S = 10

var actionStack = {
    currentAction: 0,
    stack: []
}

function createAction(actionType) {
    var newAction = {}
    /*switch (actionType) {
        default:
            break;
    }*/
    newAction.handsonTable = _.cloneDeep(handsonTable)
    newAction.handsonTableOptions = _.cloneDeep(handsonTableOptions)
    newAction.handsonTableHelperObj = _.cloneDeep(handsonTableHelperObj)
    newAction.handsonTableArr = _.cloneDeep(handsonTableArr)
    newAction.handsonTableOptions = _.cloneDeep(handsonTableOptions)
    newAction.BigobjHelper = _.cloneDeep(BigobjHelper)
    newAction.handsonTableHelperObjArr = _.cloneDeep(handsonTableHelperObjArr)
    newAction.handsonTableHelperObjImgs = _.cloneDeep(handsonTableHelperObjImgs)
    newAction.handsonTableHelperObjParetos = _.cloneDeep(handsonTableHelperObjParetos)
    newAction.handsonTableHelperObjParetoSettings = _.cloneDeep(handsonTableHelperObjParetoSettings)
    newAction.handsonTableHelperObjTrendMaps = _.cloneDeep(handsonTableHelperObjTrendMaps)
    newAction.handsonTableHelperObjTrendMapSettings = _.cloneDeep(handsonTableHelperObjTrendMapSettings)
    newAction.handsonTableHelperObjHistograms = _.cloneDeep(handsonTableHelperObjHistograms)
    newAction.handsonTableHelperObjHistogramSettings = _.cloneDeep(handsonTableHelperObjHistogramSettings)
    newAction.handsonTableHelperObjControlCharts = _.cloneDeep(handsonTableHelperObjControlCharts)
    newAction.handsonTableHelperObjControlChartSettings = _.cloneDeep(handsonTableHelperObjControlChartSettings)
    newAction.handsonTableHelperObjBoxLineCharts = _.cloneDeep(handsonTableHelperObjBoxLineCharts)
    newAction.handsonTableHelperObjBoxLineChartSettings = _.cloneDeep(handsonTableHelperObjBoxLineChartSettings)
    newAction.handsonTableHelperObjSigmaMaps = _.cloneDeep(handsonTableHelperObjSigmaMaps)
    newAction.handsonTableHelperObjSigmaMapSettings = _.cloneDeep(handsonTableHelperObjSigmaMapSettings)
    newAction.handsonTableHelperObjPieCharts = _.cloneDeep(handsonTableHelperObjPieCharts)
    newAction.handsonTableHelperObjPieChartSettings = _.cloneDeep(handsonTableHelperObjPieChartSettings)
    newAction.handsonTableHelperObjStackingMapCharts = _.cloneDeep(handsonTableHelperObjStackingMapCharts)
    newAction.handsonTableHelperObjStackingMapChartSettings = _.cloneDeep(handsonTableHelperObjStackingMapChartSettings)
    newAction.handsonTableHelperObjHelper = _.cloneDeep(handsonTableHelperObjHelper)
    actionStack.stack.push(newAction)
    actionStack.currentAction++
}

function undoAction() {
    var lastAction = actionStack.stack[actionStack.currentAction]//.pop()
    if (lastAction) {
        //undo this action
    }
    //decrement currentAction

}

function redoAction() {
    var redoActionIndex = actionStack.currentAction + 1
    if (redoActionIndex < actionStack.stack.length) {
        var redoAction = actionStack.stack[redoActionIndex]
        if (redoAction) {

        }
    }
    actionStack.currentAction++;
}

function applyAction(action) {
    //check handsonTable width and height
    newAction.handsonTable = _.cloneDeep(handsonTable)
    newAction.handsonTableOptions = _.cloneDeep(handsonTableOptions)
    newAction.handsonTableHelperObj = _.cloneDeep(handsonTableHelperObj)
    newAction.handsonTableArr = _.cloneDeep(handsonTableArr)
    newAction.handsonTableOptions = _.cloneDeep(handsonTableOptions)
    newAction.BigobjHelper = _.cloneDeep(BigobjHelper)
    newAction.handsonTableHelperObjArr = _.cloneDeep(handsonTableHelperObjArr)
    newAction.handsonTableHelperObjImgs = _.cloneDeep(handsonTableHelperObjImgs)
    newAction.handsonTableHelperObjParetos = _.cloneDeep(handsonTableHelperObjParetos)
    newAction.handsonTableHelperObjParetoSettings = _.cloneDeep(handsonTableHelperObjParetoSettings)
    newAction.handsonTableHelperObjTrendMaps = _.cloneDeep(handsonTableHelperObjTrendMaps)
    newAction.handsonTableHelperObjTrendMapSettings = _.cloneDeep(handsonTableHelperObjTrendMapSettings)
    newAction.handsonTableHelperObjHistograms = _.cloneDeep(handsonTableHelperObjHistograms)
    newAction.handsonTableHelperObjHistogramSettings = _.cloneDeep(handsonTableHelperObjHistogramSettings)
    newAction.handsonTableHelperObjControlCharts = _.cloneDeep(handsonTableHelperObjControlCharts)
    newAction.handsonTableHelperObjControlChartSettings = _.cloneDeep(handsonTableHelperObjControlChartSettings)
    newAction.handsonTableHelperObjBoxLineCharts = _.cloneDeep(handsonTableHelperObjBoxLineCharts)
    newAction.handsonTableHelperObjBoxLineChartSettings = _.cloneDeep(handsonTableHelperObjBoxLineChartSettings)
    newAction.handsonTableHelperObjSigmaMaps = _.cloneDeep(handsonTableHelperObjSigmaMaps)
    newAction.handsonTableHelperObjSigmaMapSettings = _.cloneDeep(handsonTableHelperObjSigmaMapSettings)
    newAction.handsonTableHelperObjPieCharts = _.cloneDeep(handsonTableHelperObjPieCharts)
    newAction.handsonTableHelperObjPieChartSettings = _.cloneDeep(handsonTableHelperObjPieChartSettings)
    newAction.handsonTableHelperObjStackingMapCharts = _.cloneDeep(handsonTableHelperObjStackingMapCharts)
    newAction.handsonTableHelperObjStackingMapChartSettings = _.cloneDeep(handsonTableHelperObjStackingMapChartSettings)
    newAction.handsonTableHelperObjHelper = _.cloneDeep(handsonTableHelperObjHelper)
}

$(document).ready(function() {
    //test lodash
    if (handsonTableHelperObj) {
        deepCopyHandsonTableHelperObj = _.cloneDeep(handsonTableHelperObj)
    }
})