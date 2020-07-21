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

function InsertRowBefore() {
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    var mergeCellHelper = fourCornersHelper(currSelection[0]);
    handsonTableOptions = handsonTable.getSettings();

    var newRow = mergeCellHelper.topLeft.y;
    handsonTableOptions.data.splice(newRow, 0, []);
    handsonTableOptions.rowHeights.splice(newRow, 0, 20);
    handsonTableOptions.height += 20;
    handsonTableOptions.startRows++;
    var newHandsonTableHelperObj = {};
    //does handsonTableHelperObj need to be saved in localStorage?
    //handsonTableHelperObj = JSON.parse(localStorage.getItem('handsonTableHelperObj'));
    for (var i in handsonTableHelperObj) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObj[(Number(helper[0]) + 1) + ',' + helper[1]] = handsonTableHelperObj[i];
        } else {
            newHandsonTableHelperObj[helper[0] + ',' + helper[1]] = handsonTableHelperObj[i];
        }
    }
    var newHandsonTableHelperObjTrendMaps = {};
    for (var i in handsonTableHelperObjTrendMaps) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObjTrendMaps[(Number(helper[0]) + 1) + ',' + helper[1]] = handsonTableHelperObjTrendMaps[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjTrendMaps[helper[0] + ',' + helper[1]] = handsonTableHelperObjTrendMaps[i];
        }
    }
    var newHandsonTableHelperObjTrendMapSettings = {};
    for (var i in handsonTableHelperObjTrendMapSettings) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObjTrendMapSettings[(Number(helper[0]) + 1) + ',' + helper[1]] =
                handsonTableHelperObjTrendMapSettings[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjTrendMapSettings[helper[0] + ',' + helper[1]] = handsonTableHelperObjTrendMapSettings[i];
        }
    }
    var newHandsonTableHelperObjControlChartSettings = {};
    for (var i in handsonTableHelperObjControlChartSettings) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObjControlChartSettings[(Number(helper[0]) + 1) + ',' + helper[1]] =
                handsonTableHelperObjControlChartSettings[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjControlChartSettings[helper[0] + ',' + helper[1]] = handsonTableHelperObjControlChartSettings[i];
        }
    }
    var newHandsonTableHelperObjHistogramSettings = {};
    for (var i in handsonTableHelperObjHistogramSettings) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObjHistogramSettings[(Number(helper[0]) + 1) + ',' + helper[1]] =
                handsonTableHelperObjHistogramSettings[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjHistogramSettings[helper[0] + ',' + helper[1]] = handsonTableHelperObjHistogramSettings[i];
        }
    }
    var newHandsonTableHelperObjParetos = {};
    for (var i in handsonTableHelperObjParetos) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObjParetos[(Number(helper[0]) + 1) + ',' + helper[1]] = handsonTableHelperObjParetos[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjParetos[helper[0] + ',' + helper[1]] = handsonTableHelperObjParetos[i];
        }
    }
    var newHandsonTableHelperObjHistograms = {};
    for (var i in handsonTableHelperObjHistograms) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObjHistograms[(Number(helper[0]) + 1) + ',' + helper[1]] =
                handsonTableHelperObjHistograms[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjHistograms[helper[0] + ',' + helper[1]] =
                handsonTableHelperObjHistograms[i];
        }
    }
    var newHandsonTableHelperObjControlCharts = {};
    for (var i in handsonTableHelperObjControlCharts) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObjControlCharts[(Number(helper[0]) + 1) + ',' + helper[1]] =
                handsonTableHelperObjControlCharts[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjControlCharts[helper[0] + ',' + helper[1]] =
                handsonTableHelperObjControlCharts[i];
        }
    }
    var newHandsonTableHelperObjBoxLineCharts = {};
    for (var i in handsonTableHelperObjBoxLineCharts) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObjBoxLineCharts[(Number(helper[0]) + 1) + ',' + helper[1]] =
                handsonTableHelperObjBoxLineCharts[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjBoxLineCharts[helper[0] + ',' + helper[1]] =
                handsonTableHelperObjBoxLineCharts[i];
        }
    }
    
    var newHandsonTableHelperObjSigmaMaps = {};
    for (var i in handsonTableHelperObjSigmaMaps) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObjSigmaMaps[(Number(helper[0]) + 1) + ',' + helper[1]] =
                handsonTableHelperObjSigmaMaps[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjSigmaMaps[helper[0] + ',' + helper[1]] =
                handsonTableHelperObjSigmaMaps[i];
        }
    }
    var newHandsonTableHelperObjPieCharts = {};
    for (var i in handsonTableHelperObjPieCharts) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObjPieCharts[(Number(helper[0]) + 1) + ',' + helper[1]] =
                handsonTableHelperObjPieCharts[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjPieCharts[helper[0] + ',' + helper[1]] =
                handsonTableHelperObjPieCharts[i];
        }
    }
    var newHandsonTableHelperObjStackingMapCharts = {};
    for (var i in handsonTableHelperObjStackingMapCharts) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObjStackingMapCharts[(Number(helper[0]) + 1) + ',' + helper[1]] =
                handsonTableHelperObjStackingMapCharts[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjStackingMapCharts[helper[0] + ',' + helper[1]] =
                handsonTableHelperObjStackingMapCharts[i];
        }
    }
    for (var i = 0; i < handsonTableOptions.mergeCells.length; i++) {
        if (handsonTableOptions.mergeCells[i].row >= newRow) {
            handsonTableOptions.mergeCells[i].row++;
        }
    }
    var newHandsonTableHelperObjImgs = {}
    for (var i in handsonTableHelperObjImgs) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            handsonTableOptions.data[Number(helper[0]) + 1][helper[1]] =
                handsonTableOptions.data[helper[0]][helper[1]]
            handsonTableOptions.data[helper[0]][helper[1]] = ''
            newHandsonTableHelperObjImgs[(Number(helper[0]) + 1) + ',' + helper[1]] =
                handsonTableHelperObjImgs[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjImgs[i] = handsonTableHelperObjImgs[i];
        }
    }
    var newHandsonTableHelperObjParetoSettings = {};
    for (var i in handsonTableHelperObjParetoSettings) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObjParetoSettings[(Number(helper[0]) + 1) + ',' + helper[1]] =
                handsonTableHelperObjParetoSettings[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjParetoSettings[helper[0] + ',' + helper[1]] = 
                handsonTableHelperObjParetoSettings[i];
        }
    }
    var newHandsonTableHelperObjBoxLineChartSettings = {};
    for (var i in handsonTableHelperObjBoxLineChartSettings) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObjBoxLineChartSettings[(Number(helper[0]) + 1) + ',' + helper[1]] =
                handsonTableHelperObjBoxLineChartSettings[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjBoxLineChartSettings[helper[0] + ',' + helper[1]] =
                handsonTableHelperObjBoxLineChartSettings[i];
        }
    }
    var newHandsonTableHelperObjSigmaMapSettings = {};
    for (var i in handsonTableHelperObjSigmaMapSettings) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObjSigmaMapSettings[(Number(helper[0]) + 1) + ',' + helper[1]] =
                handsonTableHelperObjSigmaMapSettings[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjSigmaMapSettings[helper[0] + ',' + helper[1]] =
                handsonTableHelperObjSigmaMapSettings[i];
        }
    }
    var newHandsonTableHelperObjPieChartSettings = {};
    for (var i in handsonTableHelperObjPieChartSettings) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObjPieChartSettings[(Number(helper[0]) + 1) + ',' + helper[1]] =
                handsonTableHelperObjPieChartSettings[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjPieChartSettings[helper[0] + ',' + helper[1]] =
                handsonTableHelperObjPieChartSettings[i];
        }
    }
    var newHandsonTableHelperObjStackingMapChartSettings = {};
    for (var i in handsonTableHelperObjStackingMapChartSettings) {
        var helper = i.split(',');
        if (helper[0] >= newRow) {
            newHandsonTableHelperObjStackingMapChartSettings[(Number(helper[0]) + 1) + ',' + helper[1]] =
                handsonTableHelperObjStackingMapChartSettings[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjStackingMapChartSettings[helper[0] + ',' + helper[1]] =
                handsonTableHelperObjStackingMapChartSettings[i];
        }
    }
    handsonTableHelperObjStackingMapChartSettings = newHandsonTableHelperObjStackingMapChartSettings;
    handsonTableHelperObjPieChartSettings = newHandsonTableHelperObjPieChartSettings;
    handsonTableHelperObjSigmaMapSettings = newHandsonTableHelperObjSigmaMapSettings;
    handsonTableHelperObjBoxLineChartSettings = newHandsonTableHelperObjBoxLineChartSettings;
    handsonTableHelperObjParetoSettings = newHandsonTableHelperObjParetoSettings;
    handsonTableHelperObjImgs = newHandsonTableHelperObjImgs;
    handsonTableHelperObjControlCharts = newHandsonTableHelperObjControlCharts;
    handsonTableHelperObjBoxLineCharts = newHandsonTableHelperObjBoxLineCharts;
    handsonTableHelperObjSigmaMaps = newHandsonTableHelperObjSigmaMaps;
    handsonTableHelperObjPieCharts = newHandsonTableHelperObjPieCharts;
    handsonTableHelperObjStackingMapCharts = newHandsonTableHelperObjStackingMapCharts;
    handsonTableHelperObj = newHandsonTableHelperObj;
    handsonTableHelperObjTrendMaps = newHandsonTableHelperObjTrendMaps;
    handsonTableHelperObjTrendMapSettings = newHandsonTableHelperObjTrendMapSettings;
    handsonTableHelperObjControlChartSettings = newHandsonTableHelperObjControlChartSettings;
    handsonTableHelperObjHistogramSettings = newHandsonTableHelperObjHistogramSettings;
    handsonTableHelperObjParetos = newHandsonTableHelperObjParetos;
    handsonTableHelperObjHistograms = newHandsonTableHelperObjHistograms;
    
    localStorage.setItem('handsonTableHelperObj', JSON.stringify(handsonTableHelperObj));
    handsonTable.updateSettings(handsonTableOptions);
    
    setTimeout(function() {
        resizeCharts();
    }, 100);
}

function deleteRow() {
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    var mergeCellHelper = fourCornersHelper(currSelection[0]);
    handsonTableOptions = handsonTable.getSettings();
    var newRow = mergeCellHelper.topLeft.y;
    handsonTableOptions.data.splice(newRow, 1);
    handsonTableOptions.rowHeights.splice(newRow, 1);
    handsonTableOptions.startRows--;
    var newHandsonTableHelperObj = {};
    for (var i in handsonTableHelperObj) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObj[(Number(helper[0]) - 1) + ',' + helper[1]] = handsonTableHelperObj[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObj[i] = handsonTableHelperObj[i];
        }
    }
    handsonTableHelperObj = newHandsonTableHelperObj;
    var newHandsonTableHelperObjTrendMaps = {};
    for (var i in handsonTableHelperObjTrendMaps) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObjTrendMaps[(Number(helper[0]) - 1) + ',' + helper[1]] = handsonTableHelperObjTrendMaps[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjTrendMaps[i] = handsonTableHelperObjTrendMaps[i];
        }
    }
    handsonTableHelperObjTrendMaps = newHandsonTableHelperObjTrendMaps;
    var newHandsonTableHelperObjTrendMapSettings = {};
    for (var i in handsonTableHelperObjTrendMapSettings) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObjTrendMapSettings[(Number(helper[0]) - 1) + ',' + helper[1]] = handsonTableHelperObjTrendMapSettings[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjTrendMapSettings[i] = handsonTableHelperObjTrendMapSettings[i];
        }
    }
    handsonTableHelperObjTrendMapSettings = newHandsonTableHelperObjTrendMapSettings;
    var newHandsonTableHelperObjControlChartSettings = {};
    for (var i in handsonTableHelperObjControlChartSettings) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObjControlChartSettings[(Number(helper[0]) - 1) + ',' + helper[1]] = handsonTableHelperObjControlChartSettings[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjControlChartSettings[i] = handsonTableHelperObjControlChartSettings[i];
        }
    }
    handsonTableHelperObjControlChartSettings = newHandsonTableHelperObjControlChartSettings;
    var newHandsonTableHelperObjHistogramSettings = {};
    for (var i in handsonTableHelperObjHistogramSettings) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObjHistogramSettings[(Number(helper[0]) - 1) + ',' + helper[1]] = handsonTableHelperObjHistogramSettings[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjHistogramSettings[i] = handsonTableHelperObjHistogramSettings[i];
        }
    }
    handsonTableHelperObjHistogramSettings = newHandsonTableHelperObjHistogramSettings;
    var newHandsonTableHelperObjParetos = {};
    for (var i in handsonTableHelperObjParetos) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObjParetos[(Number(helper[0]) - 1) + ',' + helper[1]] = handsonTableHelperObjParetos[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjParetos[i] = handsonTableHelperObjParetos[i];
        }
    }
    handsonTableHelperObjParetos = newHandsonTableHelperObjParetos;
    var newHandsonTableHelperObjHistograms = {};
    for (var i in handsonTableHelperObjHistograms) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObjHistograms[(Number(helper[0]) - 1) + ',' + helper[1]] =
                handsonTableHelperObjHistograms[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjHistograms[i] = handsonTableHelperObjHistograms[i];
        }
    }
    var newHandsonTableHelperObjControlCharts = {};
    for (var i in handsonTableHelperObjControlCharts) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObjControlCharts[(Number(helper[0]) - 1) + ',' + helper[1]] =
                handsonTableHelperObjControlCharts[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjControlCharts[i] = handsonTableHelperObjControlCharts[i];
        }
    }
    var newHandsonTableHelperObjBoxLineCharts = {};
    for (var i in handsonTableHelperObjBoxLineCharts) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObjBoxLineCharts[(Number(helper[0]) - 1) + ',' + helper[1]] =
                handsonTableHelperObjBoxLineCharts[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjBoxLineCharts[i] = handsonTableHelperObjBoxLineCharts[i];
        }
    }
    var newHandsonTableHelperObjSigmaMaps = {};
    for (var i in handsonTableHelperObjSigmaMaps) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObjSigmaMaps[(Number(helper[0]) - 1) + ',' + helper[1]] =
                handsonTableHelperObjSigmaMaps[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjSigmaMaps[i] = handsonTableHelperObjSigmaMaps[i];
        }
    }
    var newHandsonTableHelperObjPieCharts = {};
    for (var i in handsonTableHelperObjPieCharts) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObjPieCharts[(Number(helper[0]) - 1) + ',' + helper[1]] =
                handsonTableHelperObjPieCharts[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjPieCharts[i] = handsonTableHelperObjPieCharts[i];
        }
    }
    var newHandsonTableHelperObjStackingMapCharts = {};
    for (var i in handsonTableHelperObjStackingMapCharts) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObjStackingMapCharts[(Number(helper[0]) - 1) + ',' + helper[1]] =
                handsonTableHelperObjStackingMapCharts[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjStackingMapCharts[i] = handsonTableHelperObjStackingMapCharts[i];
        }
    }
    //test this now, 11:35 AM, 04/18/2020, then go to next deleteRow, insertCol and deleteCol...
    var newMergeCells = [];
    for (var i = 0; i < handsonTableOptions.mergeCells.length; i++) {
        if (handsonTableOptions.mergeCells[i].row > newRow) {
            newMergeCells.push({
                row: handsonTableOptions.mergeCells[i].row - 1,
                col: handsonTableOptions.mergeCells[i].col,
                rowspan: handsonTableOptions.mergeCells[i].rowspan,
                colspan: handsonTableOptions.mergeCells[i].colspan
            });
        } else if (handsonTableOptions.mergeCells[i].row + handsonTableOptions.mergeCells[i].rowspan <= newRow) {
            newMergeCells.push(handsonTableOptions.mergeCells[i]);
        }
    }
    var newHandsonTableHelperObjImgs = {}
    for (var i in handsonTableHelperObjImgs) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            handsonTableOptions.data[Number(helper[0]) - 1][helper[1]] =
                handsonTableOptions.data[helper[0]][helper[1]]
            handsonTableOptions.data[helper[0]][helper[1]] = ''
            newHandsonTableHelperObjImgs[(Number(helper[0]) - 1) + ',' + helper[1]] =
                handsonTableHelperObjImgs[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjImgs[i] = handsonTableHelperObjImgs[i];
        }
    }
    var newHandsonTableHelperObjStackingMapChartSettings = {};
    for (var i in handsonTableHelperObjStackingMapChartSettings) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObjStackingMapChartSettings[(Number(helper[0]) - 1) + ',' + helper[1]] = handsonTableHelperObjStackingMapChartSettings[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjStackingMapChartSettings[i] = handsonTableHelperObjStackingMapChartSettings[i];
        }
    }
    var newHandsonTableHelperObjPieChartSettings = {};
    for (var i in handsonTableHelperObjPieChartSettings) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObjPieChartSettings[(Number(helper[0]) - 1) + ',' + helper[1]] = handsonTableHelperObjPieChartSettings[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjPieChartSettings[i] = handsonTableHelperObjPieChartSettings[i];
        }
    }
    var newHandsonTableHelperObjSigmaMapSettings = {};
    for (var i in handsonTableHelperObjSigmaMapSettings) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObjSigmaMapSettings[(Number(helper[0]) - 1) + ',' + helper[1]] = handsonTableHelperObjSigmaMapSettings[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjSigmaMapSettings[i] = handsonTableHelperObjSigmaMapSettings[i];
        }
    }
    var newHandsonTableHelperObjBoxLineChartSettings = {};
    for (var i in handsonTableHelperObjBoxLineChartSettings) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObjBoxLineChartSettings[(Number(helper[0]) - 1) + ',' + helper[1]] = handsonTableHelperObjBoxLineChartSettings[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjBoxLineChartSettings[i] = handsonTableHelperObjBoxLineChartSettings[i];
        }
    }
    var newHandsonTableHelperObjParetoSettings = {};
    for (var i in handsonTableHelperObjParetoSettings) {
        var helper = i.split(',');
        if (helper[0] > newRow) {
            newHandsonTableHelperObjParetoSettings[(Number(helper[0]) - 1) + ',' + helper[1]] = handsonTableHelperObjParetoSettings[i];
        } else if (helper[0] < newRow) {
            newHandsonTableHelperObjParetoSettings[i] = handsonTableHelperObjParetoSettings[i];
        }
    }
    handsonTableHelperObjStackingMapChartSettings = newHandsonTableHelperObjStackingMapChartSettings;
    handsonTableHelperObjPieChartSettings = newHandsonTableHelperObjPieChartSettings;
    handsonTableHelperObjSigmaMapSettings = newHandsonTableHelperObjSigmaMapSettings;
    handsonTableHelperObjBoxLineChartSettings = newHandsonTableHelperObjBoxLineChartSettings;
    handsonTableHelperObjParetoSettings = newHandsonTableHelperObjParetoSettings;
    handsonTableOptions.mergeCells = newMergeCells;
    handsonTableHelperObjImgs = newHandsonTableHelperObjImgs;
    handsonTableHelperObjControlCharts = newHandsonTableHelperObjControlCharts;
    handsonTableHelperObjBoxLineCharts = newHandsonTableHelperObjBoxLineCharts;
    handsonTableHelperObjSigmaMaps = newHandsonTableHelperObjSigmaMaps;
    handsonTableHelperObjPieCharts = newHandsonTableHelperObjPieCharts;
    handsonTableHelperObjStackingMapCharts = newHandsonTableHelperObjStackingMapCharts;
    handsonTableHelperObjHistograms = newHandsonTableHelperObjHistograms;
    
    localStorage.setItem('handsonTableHelperObj', JSON.stringify(handsonTableHelperObj));
    handsonTable.updateSettings(handsonTableOptions);
    handsonTable.render();
    //handsonTable.alter('remove_row', handsonTable.countRows() - 1);
    resizeCharts();
}

function InsertColumn() {
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    var mergeCellHelper = fourCornersHelper(currSelection[0]);
    handsonTableOptions = handsonTable.getSettings();

    var newCol = mergeCellHelper.topLeft.x;
    handsonTableOptions.colWidths.splice(newCol, 0, 20);
    handsonTableOptions.width += 20;
    handsonTableOptions.startCols++;
    handsonTableOptions.columns.push({renderer: "html"});
    var newHandsonTableHelperObj = {};
    for (var i in handsonTableHelperObj) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObj[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObj[i];
        } else {
            newHandsonTableHelperObj[helper[0] + ',' + helper[1]] = handsonTableHelperObj[i];
        }
    }
    var newHandsonTableHelperObjTrendMaps = {};
    for (var i in handsonTableHelperObjTrendMaps) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjTrendMaps[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObjTrendMaps[i];
        } else {
            newHandsonTableHelperObjTrendMaps[helper[0] + ',' + helper[1]] = handsonTableHelperObjTrendMaps[i];
        }
    }
    var newHandsonTableHelperObjTrendMapSettings = {};
    for (var i in handsonTableHelperObjTrendMapSettings) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjTrendMapSettings[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObjTrendMapSettings[i];
        } else {
            newHandsonTableHelperObjTrendMapSettings[helper[0] + ',' + helper[1]] = handsonTableHelperObjTrendMapSettings[i];
        }
    }
    var newHandsonTableHelperObjControlChartSettings = {};
    for (var i in handsonTableHelperObjControlChartSettings) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjControlChartSettings[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObjControlChartSettings[i];
        } else {
            newHandsonTableHelperObjControlChartSettings[helper[0] + ',' + helper[1]] = handsonTableHelperObjControlChartSettings[i];
        }
    }
    var newHandsonTableHelperObjHistogramSettings = {};
    for (var i in handsonTableHelperObjHistogramSettings) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjHistogramSettings[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObjHistogramSettings[i];
        } else {
            newHandsonTableHelperObjHistogramSettings[helper[0] + ',' + helper[1]] = handsonTableHelperObjHistogramSettings[i];
        }
    }
    var newHandsonTableHelperObjParetos = {};
    for (var i in handsonTableHelperObjParetos) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjParetos[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObjParetos[i];
        } else {
            newHandsonTableHelperObjParetos[helper[0] + ',' + helper[1]] = handsonTableHelperObjParetos[i];
        }
    }
    var newHandsonTableHelperObjHistograms = {};
    for (var i in handsonTableHelperObjHistograms) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjHistograms[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObjHistograms[i];
        } else {
            newHandsonTableHelperObjHistograms[helper[0] + ',' + helper[1]] = handsonTableHelperObjHistograms[i];
        }
    }
    var newHandsonTableHelperObjControlCharts = {};
    for (var i in handsonTableHelperObjControlCharts) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjControlCharts[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObjControlCharts[i];
        } else {
            newHandsonTableHelperObjControlCharts[helper[0] + ',' + helper[1]] = handsonTableHelperObjControlCharts[i];
        }
    }
    var newHandsonTableHelperObjBoxLineCharts = {};
    for (var i in handsonTableHelperObjBoxLineCharts) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjBoxLineCharts[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObjBoxLineCharts[i];
        } else {
            newHandsonTableHelperObjBoxLineCharts[helper[0] + ',' + helper[1]] = handsonTableHelperObjBoxLineCharts[i];
        }
    }
    var newHandsonTableHelperObjSigmaMaps = {};
    for (var i in handsonTableHelperObjSigmaMaps) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjSigmaMaps[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObjSigmaMaps[i];
        } else {
            newHandsonTableHelperObjSigmaMaps[helper[0] + ',' + helper[1]] = handsonTableHelperObjSigmaMaps[i];
        }
    }
    var newHandsonTableHelperObjPieCharts = {};
    for (var i in handsonTableHelperObjPieCharts) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjPieCharts[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObjPieCharts[i];
        } else {
            newHandsonTableHelperObjPieCharts[helper[0] + ',' + helper[1]] = handsonTableHelperObjPieCharts[i];
        }
    }
    var newHandsonTableHelperObjStackingMapCharts = {};
    for (var i in handsonTableHelperObjStackingMapCharts) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjStackingMapCharts[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObjStackingMapCharts[i];
        } else {
            newHandsonTableHelperObjStackingMapCharts[helper[0] + ',' + helper[1]] = handsonTableHelperObjStackingMapCharts[i];
        }
    }

    var newMergeCells = [];
    for (var i = 0; i < handsonTableOptions.mergeCells.length; i++) {
        if (handsonTableOptions.mergeCells[i].col >= newCol) {
            newMergeCells.push({
                row: handsonTableOptions.mergeCells[i].row,
                col: handsonTableOptions.mergeCells[i].col + 1,
                rowspan: handsonTableOptions.mergeCells[i].rowspan,
                colspan: handsonTableOptions.mergeCells[i].colspan
            });
        } else {
            newMergeCells.push(handsonTableOptions.mergeCells[i]);
        }
    }
    //ToDo handsonTableHelperObjImgs
    var newHandsonTableHelperObjImgs = {}
    for (var i in handsonTableHelperObjImgs) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][Number(helper[1]) + 1] =
                handsonTableOptions.data[helper[0]][helper[1]]
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjImgs[helper[0] + ',' + (Number(helper[1]) + 1)] =
                handsonTableHelperObjImgs[i];
        } else {
            newHandsonTableHelperObjImgs[i] = handsonTableHelperObjImgs[i];
        }
    }
    var newHandsonTableHelperObjStackingMapChartSettings = {};
    for (var i in handsonTableHelperObjStackingMapChartSettings) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjStackingMapChartSettings[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObjStackingMapChartSettings[i];
        } else {
            newHandsonTableHelperObjStackingMapChartSettings[helper[0] + ',' + helper[1]] = handsonTableHelperObjStackingMapChartSettings[i];
        }
    }
    var newHandsonTableHelperObjPieChartSettings = {};
    for (var i in handsonTableHelperObjPieChartSettings) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjPieChartSettings[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObjPieChartSettings[i];
        } else {
            newHandsonTableHelperObjPieChartSettings[helper[0] + ',' + helper[1]] = handsonTableHelperObjPieChartSettings[i];
        }
    }
    var newHandsonTableHelperObjSigmaMapSettings = {};
    for (var i in handsonTableHelperObjSigmaMapSettings) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjSigmaMapSettings[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObjSigmaMapSettings[i];
        } else {
            newHandsonTableHelperObjSigmaMapSettings[helper[0] + ',' + helper[1]] = handsonTableHelperObjSigmaMapSettings[i];
        }
    }
    var newHandsonTableHelperObjBoxLineChartSettings = {};
    for (var i in handsonTableHelperObjBoxLineChartSettings) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjBoxLineChartSettings[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObjBoxLineChartSettings[i];
        } else {
            newHandsonTableHelperObjBoxLineChartSettings[helper[0] + ',' + helper[1]] = handsonTableHelperObjBoxLineChartSettings[i];
        }
    }
    var newHandsonTableHelperObjParetoSettings = {};
    for (var i in handsonTableHelperObjParetoSettings) {
        var helper = i.split(',');
        if (helper[1] >= newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
            newHandsonTableHelperObjParetoSettings[helper[0] + ',' + (Number(helper[1]) + 1)] = handsonTableHelperObjParetoSettings[i];
        } else {
            newHandsonTableHelperObjParetoSettings[helper[0] + ',' + helper[1]] = handsonTableHelperObjParetoSettings[i];
        }
    }
    handsonTableHelperObjStackingMapChartSettings = newHandsonTableHelperObjStackingMapChartSettings;
    handsonTableHelperObjPieChartSettings = newHandsonTableHelperObjPieChartSettings;
    handsonTableHelperObjSigmaMapSettings = newHandsonTableHelperObjSigmaMapSettings;
    handsonTableHelperObjBoxLineChartSettings = newHandsonTableHelperObjBoxLineChartSettings;
    handsonTableHelperObjParetoSettings = newHandsonTableHelperObjParetoSettings;
    handsonTableOptions.mergeCells = newMergeCells;
    handsonTableHelperObjImgs = newHandsonTableHelperObjImgs;
    handsonTableHelperObjControlCharts = newHandsonTableHelperObjControlCharts;
    handsonTableHelperObjBoxLineCharts = newHandsonTableHelperObjBoxLineCharts;
    handsonTableHelperObjSigmaMaps = newHandsonTableHelperObjSigmaMaps;
    handsonTableHelperObjPieCharts = newHandsonTableHelperObjPieCharts;
    handsonTableHelperObjStackingMapCharts = newHandsonTableHelperObjStackingMapCharts;
    handsonTableHelperObj = newHandsonTableHelperObj;
    handsonTableHelperObjTrendMaps = newHandsonTableHelperObjTrendMaps;
    handsonTableHelperObjTrendMapSettings = newHandsonTableHelperObjTrendMapSettings;
    handsonTableHelperObjControlChartSettings = newHandsonTableHelperObjControlChartSettings;
    handsonTableHelperObjHistogramSettings = newHandsonTableHelperObjHistogramSettings;
    handsonTableHelperObjParetos = newHandsonTableHelperObjParetos;
    handsonTableHelperObjHistograms = newHandsonTableHelperObjHistograms;
    localStorage.setItem('handsonTableHelperObj', JSON.stringify(handsonTableHelperObj));
    handsonTable.updateSettings(handsonTableOptions);
    handsonTable.render();
    resizeCharts();
}

function deleteColumn() {
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    var mergeCellHelper = fourCornersHelper(currSelection[0]);
    handsonTableOptions = handsonTable.getSettings();
    handsonTableOptions.colWidths.splice(newCol, 1);
    handsonTableOptions.columns.splice(0, 1);
    handsonTableOptions.startCols--;
    var newCol = mergeCellHelper.topLeft.x;
    var newHandsonTableHelperObj = {};
    for (var i in handsonTableHelperObj) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObj[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObj[i];
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObj[i] = handsonTableHelperObj[i];
        }
    }
    handsonTableHelperObj = newHandsonTableHelperObj;
    var newHandsonTableHelperObjTrendMaps = {};
    for (var i in handsonTableHelperObjTrendMaps) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObjTrendMaps[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjTrendMaps[i];
        } else if (helper[1] == newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObjTrendMaps[i] = handsonTableHelperObjTrendMaps[i];
        }
    }
    handsonTableHelperObjTrendMaps = newHandsonTableHelperObjTrendMaps;
    var newHandsonTableHelperObjTrendMapSettings = {};
    for (var i in handsonTableHelperObjTrendMapSettings) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObjTrendMapSettings[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjTrendMapSettings[i];
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObjTrendMapSettings[i] = handsonTableHelperObjTrendMapSettings[i];
        }
    }
    handsonTableHelperObjTrendMapSettings = newHandsonTableHelperObjTrendMapSettings;
    var newHandsonTableHelperObjControlChartSettings = {};
    for (var i in handsonTableHelperObjControlChartSettings) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObjControlChartSettings[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjControlChartSettings[i];
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObjControlChartSettings[i] = handsonTableHelperObjControlChartSettings[i];
        }
    }
    handsonTableHelperObjControlChartSettings = newHandsonTableHelperObjControlChartSettings;
    var newHandsonTableHelperObjHistogramSettings = {};
    for (var i in handsonTableHelperObjHistogramSettings) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObjHistogramSettings[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjHistogramSettings[i];
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObjHistogramSettings[i] = handsonTableHelperObjHistogramSettings[i];
        }
    }
    handsonTableHelperObjHistogramSettings = newHandsonTableHelperObjHistogramSettings;
    var newHandsonTableHelperObjParetos = {};
    for (var i in handsonTableHelperObjParetos) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObjParetos[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjParetos[i];
        } else if (helper[1] == newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObjParetos[i] = handsonTableHelperObjParetos[i];
        }
    }
    handsonTableHelperObjParetos = newHandsonTableHelperObjParetos;
    var newHandsonTableHelperObjHistograms = {};
    for (var i in handsonTableHelperObjHistograms) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObjHistograms[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjHistograms[i];
        } else if (helper[1] == newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObjHistograms[i] = handsonTableHelperObjHistograms[i];
        }
    }
    var newHandsonTableHelperObjControlCharts = {};
    for (var i in handsonTableHelperObjControlCharts) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObjControlCharts[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjControlCharts[i];
        } else if (helper[1] == newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObjControlCharts[i] = handsonTableHelperObjControlCharts[i];
        }
    }
    var newHandsonTableHelperObjBoxLineCharts = {};
    for (var i in handsonTableHelperObjBoxLineCharts) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObjBoxLineCharts[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjBoxLineCharts[i];
        } else if (helper[1] == newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObjBoxLineCharts[i] = handsonTableHelperObjBoxLineCharts[i];
        }
    }
    var newHandsonTableHelperObjSigmaMaps = {};
    for (var i in handsonTableHelperObjSigmaMaps) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObjSigmaMaps[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjSigmaMaps[i];
        } else if (helper[1] == newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObjSigmaMaps[i] = handsonTableHelperObjSigmaMaps[i];
        }
    }
    var newHandsonTableHelperObjPieCharts = {};
    for (var i in handsonTableHelperObjPieCharts) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObjPieCharts[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjPieCharts[i];
        } else if (helper[1] == newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObjPieCharts[i] = handsonTableHelperObjPieCharts[i];
        }
    }
    var newHandsonTableHelperObjStackingMapCharts = {};
    for (var i in handsonTableHelperObjStackingMapCharts) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObjStackingMapCharts[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjStackingMapCharts[i];
        } else if (helper[1] == newCol) {
            handsonTableOptions.data[helper[0]][helper[1]] = '';
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObjStackingMapCharts[i] = handsonTableHelperObjStackingMapCharts[i];
        }
    }

    var newMergeCells = [];
    for (var i = 0; i < handsonTableOptions.mergeCells.length; i++) {
        if (handsonTableOptions.mergeCells[i].col > newCol) {
            newMergeCells.push({
                row: handsonTableOptions.mergeCells[i].row,
                col: handsonTableOptions.mergeCells[i].col - 1,
                rowspan: handsonTableOptions.mergeCells[i].rowspan,
                colspan: handsonTableOptions.mergeCells[i].colspan
            });
        } else if (handsonTableOptions.mergeCells[i].col < newCol &&
            handsonTableOptions.mergeCells[i].col + handsonTableOptions.mergeCells[i].colspan <= newCol) {
            newMergeCells.push(handsonTableOptions.mergeCells[i]);
        }
    }
    //ToDo handsonTableHelperObjImgs
    var newHandsonTableHelperObjImgs = {}
    for (var i in handsonTableHelperObjImgs) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            handsonTableOptions.data[helper[0]][Number(helper[1]) - 1] =
                handsonTableOptions.data[helper[0]][helper[1]]
            handsonTableOptions.data[helper[0]][helper[1]] = ''
            newHandsonTableHelperObjImgs[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjImgs[i];
        } else if (helper[1] == newCol) {
            handsonTable.data[helper[0]][helper[1]] = '';
        } else {
            newHandsonTableHelperObjImgs[i] = handsonTableHelperObjImgs[i];
        }
    }
    var newHandsonTableHelperObjStackingMapChartSettings = {};
    for (var i in handsonTableHelperObjStackingMapChartSettings) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObjStackingMapChartSettings[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjStackingMapChartSettings[i];
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObjStackingMapChartSettings[i] = handsonTableHelperObjStackingMapChartSettings[i];
        }
    }
    var newHandsonTableHelperObjPieChartSettings = {};
    for (var i in handsonTableHelperObjPieChartSettings) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObjPieChartSettings[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjPieChartSettings[i];
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObjPieChartSettings[i] = handsonTableHelperObjPieChartSettings[i];
        }
    }
    var newHandsonTableHelperObjSigmaMapSettings = {};
    for (var i in handsonTableHelperObjSigmaMapSettings) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObjSigmaMapSettings[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjSigmaMapSettings[i];
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObjSigmaMapSettings[i] = handsonTableHelperObjSigmaMapSettings[i];
        }
    }
    var newHandsonTableHelperObjBoxLineChartSettings = {};
    for (var i in handsonTableHelperObjBoxLineChartSettings) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObjBoxLineChartSettings[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjBoxLineChartSettings[i];
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObjBoxLineChartSettings[i] = handsonTableHelperObjBoxLineChartSettings[i];
        }
    }
    var newHandsonTableHelperObjParetoSettings = {};
    for (var i in handsonTableHelperObjParetoSettings) {
        var helper = i.split(',');
        if (helper[1] > newCol) {
            newHandsonTableHelperObjParetoSettings[helper[0] + ',' + (Number(helper[1]) - 1)] =
                handsonTableHelperObjParetoSettings[i];
        } else if (helper[1] < newCol) {
            newHandsonTableHelperObjParetoSettings[i] = handsonTableHelperObjParetoSettings[i];
        }
    }
    handsonTableHelperObjStackingMapChartSettings = newHandsonTableHelperObjStackingMapChartSettings;
    handsonTableHelperObjPieChartSettings = newHandsonTableHelperObjPieChartSettings;
    handsonTableHelperObjSigmaMapSettings = newHandsonTableHelperObjSigmaMapSettings;
    handsonTableHelperObjBoxLineChartSettings = newHandsonTableHelperObjBoxLineChartSettings;
    handsonTableHelperObjParetoSettings = newHandsonTableHelperObjParetoSettings;
    handsonTableOptions.mergeCells = newMergeCells;
    handsonTableHelperObjImgs = newHandsonTableHelperObjImgs;

    handsonTableHelperObjControlCharts = newHandsonTableHelperObjControlCharts;
    handsonTableHelperObjBoxLineCharts = newHandsonTableHelperObjBoxLineCharts;
    handsonTableHelperObjSigmaMaps = newHandsonTableHelperObjSigmaMaps;
    handsonTableHelperObjPieCharts = newHandsonTableHelperObjPieCharts;
    handsonTableHelperObjStackingMapCharts = newHandsonTableHelperObjStackingMapCharts;
    handsonTableHelperObjHistograms = newHandsonTableHelperObjHistograms;
    for (var i = 0; i < handsonTableOptions.data.length; i++) {
        handsonTableOptions.data[i].splice(newCol, 1);
    }

    handsonTableOptions.colWidths.splice(newCol, 1);

    //handle mergedCells, 04/07/2020: and remember to do this for deleteRow, and
    //check for addRow and addColumn

    saveAllStuffToLocalStorage();
    handsonTable.updateSettings(handsonTableOptions);
    //handsonTable.render();
    //handsonTable.alter('remove_col', handsonTable.countCols() - 1);
    resizeCharts();
}

function unmergeCell() {
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    var mergeCellHelper = fourCornersHelper(currSelection[0]);
    var newMergeCells = [];
    for (var i = 0; i < handsonTableOptions.mergeCells.length; i++) {
        if (handsonTableOptions.mergeCells[i].row !== mergeCellHelper.topLeft.y || handsonTableOptions.mergeCells[i].col !== mergeCellHelper.topLeft.x) {
            newMergeCells.push(handsonTableOptions.mergeCells[i]);
        }
    }
    handsonTableOptions.mergeCells = newMergeCells;
    handsonTable.updateSettings(handsonTableOptions);
}

function deleteHandsonTable(e) {
    if (handsonTable != null) {
        var parents = $(handsonTable.table).parents(".ui-widget-content");
        if (parents.length > 0) {
            $(parents[0]).remove();
        }
    }
    handsonTableHelperObj = {};
    handsonTableArr = [];
    handsonTableOptions = [];
    handsonTableHelperObjArr = [];
    handsonTableHelperObjImgs = {};
    handsonTableHelperObjParetos = {};
    handsonTableHelperObjTrendMaps = {};
    handsonTableHelperObjTrendMapSettings = {};
    handsonTableHelperObjControlChartSettings = {};
    handsonTableHelperObjHistogramSettings = {};
    handsonTableHelperObjHistograms = {};
    handsonTableHelperObjControlCharts = {};
    handsonTableHelperObjBoxLineCharts = {};
    handsonTableHelperObjSigmaMaps = {};
    handsonTableHelperObjPieCharts = {};
    handsonTableHelperObjStackingMapCharts = {};
    handsonTableHelperObjHelper = {};
}

function updateSelectedHandsonCellWithHtml(html) {
    var currSelection = handsonTable.getSelected();
    //var currSelectionRange = handsonTable.getSelectedRange();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    handsonTableOptions.data[currSelection[0][0]][currSelection[0][1]] = html;
    handsonTable.updateSettings(handsonTableOptions);
}

function resizeCharts(BigobjHelper, rowIndex, colIndex) {
    var BigobjHelper = null;
    var tempHandsonTableSettings = handsonTable.getSettings();
    $('#TrendMapHelper, #ControlChartHelper, #BoxLineChartHelper, #SigmaMapChartHelper, '+
        '#PieChartHelper, #StackingMapChartHelper, #HistogramDiagramHelper, #ParetoChartHelper').show();
    $('.spinner, #overlay').show();
    var affectedMergeCells = [];
    if (rowIndex && typeof rowIndex !== 'undefined') {
        console.log("in resizeCharts, rowIndex: " + rowIndex);
        for (var i = 0; i < tempHandsonTableSettings.mergeCells.length; i++) {
            if (tempHandsonTableSettings.mergeCells[i].row + tempHandsonTableSettings.mergeCells[i].rowspan
                >= rowIndex && tempHandsonTableSettings.mergeCells[i].row <= rowIndex) {
                affectedMergeCells.push(tempHandsonTableSettings.mergeCells[i]);
            }
        }
    }

    if (colIndex && typeof colIndex !== 'undefined') {
        console.log("in resizeCharts, colIndex: " + colIndex);
        for (var i = 0; i < tempHandsonTableSettings.mergeCells.length; i++) {
            if (tempHandsonTableSettings.mergeCells[i].col + tempHandsonTableSettings.mergeCells[i].colspan
                > colIndex && tempHandsonTableSettings.mergeCells[i].col <= colIndex) {
                affectedMergeCells.push(tempHandsonTableSettings.mergeCells[i]);
            }
        }
    }

    for (var i in handsonTableHelperObjParetos) {
        var ids = handsonTableHelperObjParetos[i];
        var rowAndColArr = i.split(',');
        //check if this needs to be re-rendered
        //is rowIndex or colIndex defined?
        //----Beginning----
        /*if (rowIndex && typeof rowIndex !== 'undefined') {
            //is rowIndex !== rowAndColArr[0]
            //or is rowAndColArr not part of one of the mergedCells
            var needsRender = false;
            if (rowIndex != rowAndColArr[0]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(rowAndColArr[0], null, affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        } else if (colIndex && typeof colIndex !== 'undefined') {
            var needsRender = false;
            if (colIndex != rowAndColArr[1]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(null, rowAndColArr[1], affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        }*/
        //----End----

        //拖拉拽缩放

        var heightWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
        var heightHelper = heightWidthObj.height;
        var widthHelper = heightWidthObj.width;

        heightHelper = heightHelper > 20?heightHelper - 10:heightHelper;
        widthHelper = widthHelper > 20?widthHelper - 10:widthHelper;
        var paretoChartSetting = handsonTableHelperObjParetoSettings[i];
        if (paretoChartSetting && typeof paretoChartSetting !== 'undefined') {
            widthHelperFromSetting = Number(paretoChartSetting.miscWidth)
            heightHelperFromSetting = Number(paretoChartSetting.miscHeight)
            if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                widthHelper = widthHelperFromSetting
            }
            if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                heightHelper = heightHelperFromSetting
            }
        }
        var paretoChartHtmlOb = createHandsonCellDivWithProps(ids+'altholder', widthHelper, heightHelper, paretoChartSetting);
        //var paretoChartHtml = '<div class="" id="' + ids +
            //'altholder" style="width:' + widthHelper + 'px;height:' + heightHelper + 'px"></div>';
        var tempHandsonTableOptions = handsonTable.getSettings();
        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = paretoChartHtmlOb.outerHTML;
        handsonTable.updateSettings(tempHandsonTableOptions);
        var obj = document.createElement('div');
        obj.id = ids + "alt";
        obj.style.cssText = 'width:'+widthHelper+'px;height:'+heightHelper+'px;margin:auto;';
        document.getElementById("ParetoChartHelper").appendChild(obj);

        resizeChartsParetoChartAjaxHelper(rowAndColArr[0], rowAndColArr[1], ids + 'alt', widthHelper, heightHelper,
            typeof paretoChartSetting !== 'undefined'?paretoChartSetting:BigobjHelper)
    }

    for (var i in handsonTableHelperObjTrendMaps) {
        var ids = handsonTableHelperObjTrendMaps[i];
        var rowAndColArr = i.split(',');
        //check if this needs to be re-rendered
        //is rowIndex or colIndex defined?
        //----Beginning----
        /*if (rowIndex && typeof rowIndex !== 'undefined') {
            //is rowIndex !== rowAndColArr[0]
            //or is rowAndColArr not part of one of the mergedCells
            var needsRender = false;
            if (rowIndex != rowAndColArr[0]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(rowAndColArr[0], null, affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        } else if (colIndex && typeof colIndex !== 'undefined') {
            var needsRender = false;
            if (colIndex != rowAndColArr[1]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(null, rowAndColArr[1], affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        }*/
        //----End----

        //use function getMergedCellHeightAndWidth
        var heightWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
        var heightHelper = heightWidthObj.height;//handsonTable.getRowHeight(rowAndColArr[0]);
        var widthHelper = heightWidthObj.width;//handsonTable.getColWidth(rowAndColArr[1]);
        heightHelper = heightHelper > 20?heightHelper - 10:heightHelper;
        widthHelper = widthHelper > 20?widthHelper - 10:widthHelper;
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
        var trendMapHtmlOb = createHandsonCellDivWithProps(ids+'altholder', widthHelper, heightHelper, 
            trendMapSetting);
        //var TrendMapHtml = '<div class="" id="' + ids +
            //'altholder" style="height:'+heightHelper+'px;width:'+widthHelper+'px;overflow:hidden;"></div>'
        var tempHandsonTableOptions = handsonTable.getSettings();
        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = trendMapHtmlOb.outerHTML;
        handsonTable.updateSettings(tempHandsonTableOptions);
        var obj = document.createElement('div');
        obj.id = ids + "alt";
        obj.style.cssText = 'width:'+widthHelper+'px;height:'+heightHelper+'px;';
        document.getElementById("TrendMapHelper").appendChild(obj);
        var trendMapSettings = handsonTableHelperObjTrendMapSettings[i];
        resizeChartsTrendMapAjaxHelper(rowAndColArr[0], rowAndColArr[1], ids+'alt', widthHelper, heightHelper,
            typeof trendMapSettings !== 'undefined' ? trendMapSettings:BigobjHelper);
            //typeof BigobjHelper !== 'undefined' ? BigobjHelper:trendMapSettings);
    }

    for (var i in handsonTableHelperObjHistograms) {
        var ids = handsonTableHelperObjHistograms[i];
        var rowAndColArr = i.split(',');
        //拖拉拽缩放
        //check if this needs to be re-rendered
        //is rowIndex or colIndex defined?
        //----Beginning----
        /*if (rowIndex && typeof rowIndex !== 'undefined') {
            //is rowIndex !== rowAndColArr[0]
            //or is rowAndColArr not part of one of the mergedCells
            var needsRender = false;
            if (rowIndex != rowAndColArr[0]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(rowAndColArr[0], null, affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        } else if (colIndex && typeof colIndex !== 'undefined') {
            var needsRender = false;
            if (colIndex != rowAndColArr[1]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(null, rowAndColArr[1], affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        }*/
        //----End----

        var heightWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
        var heightHelper = heightWidthObj.height;
        var widthHelper = heightWidthObj.width;

        heightHelper = heightHelper > 20?heightHelper - 10:heightHelper;
        widthHelper = widthHelper > 20?widthHelper - 10:widthHelper;
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
        var histogramHtmlOb = createHandsonCellDivWithProps(ids+'altholder', widthHelper, heightHelper, histogramSetting);
        //var histogramHtml = '<div class="" id="' + ids +
            //'altholder" style="width:' + widthHelper + 'px;height:' + heightHelper + 'px;overflow:hidden"></div>';
        var tempHandsonTableOptions = handsonTable.getSettings();
        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = histogramHtmlOb.outerHTML;
        handsonTable.updateSettings(tempHandsonTableOptions);
        var obj = document.createElement('div');
        obj.id = ids + "alt";
        obj.style.cssText = 'width:'+widthHelper+'px;height:'+heightHelper+'px;margin:auto;';
        document.getElementById("HistogramDiagramHelper").appendChild(obj);
        setHistogram(ids + "alt", widthHelper, heightHelper,typeof histogramSetting !== 'undefined'?histogramSetting:BigobjHelper)
    }

    for (var i in handsonTableHelperObjControlCharts) {
        var ids = handsonTableHelperObjControlCharts[i];
        var rowAndColArr = i.split(',');
        //check if this needs to be re-rendered
        //is rowIndex or colIndex defined?
        //----Beginning----
        /*if (rowIndex && typeof rowIndex !== 'undefined') {
            //is rowIndex !== rowAndColArr[0]
            //or is rowAndColArr not part of one of the mergedCells
            var needsRender = false;
            if (rowIndex != rowAndColArr[0]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(rowAndColArr[0], null, affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        } else if (colIndex && typeof colIndex !== 'undefined') {
            var needsRender = false;
            if (colIndex != rowAndColArr[1]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(null, rowAndColArr[1], affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        }*/
        //----End----

        var heightWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
        var heightHelper = heightWidthObj.height;
        var widthHelper = heightWidthObj.width;

        heightHelper = heightHelper > 20?heightHelper - 10:heightHelper;
        widthHelper = widthHelper > 20?widthHelper - 10:widthHelper;
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
        var controlChartHtmlOb = createHandsonCellDivWithProps(ids+'altholder', widthHelper, heightHelper, controlChartSetting);
        //var controlChartHtml = '<div class="" id="' + ids +
            //'altholder" style="width:' + widthHelper + 'px;height:' + heightHelper + 'px;overflow:hidden"></div>';
        var tempHandsonTableOptions = handsonTable.getSettings();
        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = controlChartHtmlOb.outerHTML;
        handsonTable.updateSettings(tempHandsonTableOptions);
        var obj = document.createElement('div');
        obj.id = ids + "alt";
        obj.style.cssText = 'width:'+widthHelper+'px;height:'+heightHelper+'px;margin:auto;';
        document.getElementById("ControlChartHelper").appendChild(obj);

        var controlChartSettings = handsonTableHelperObjControlChartSettings[i];
        resizeChartsControlChartAjaxHelper(rowAndColArr[0], rowAndColArr[1], ids + 'alt', widthHelper, heightHelper,
            typeof controlChartSettings !== 'undefined' ? controlChartSettings:BigobjHelper);
        //ControlChartForHandsonCell('ControlChartHelper', rowAndColArr[0], rowAndColArr[1], widthHelper, heightHelper)
    }

    for (var i in handsonTableHelperObjBoxLineCharts) {
        var ids = handsonTableHelperObjBoxLineCharts[i];
        var rowAndColArr = i.split(',');
        //check if this needs to be re-rendered
        //is rowIndex or colIndex defined?
        //----Beginning----
        /*if (rowIndex && typeof rowIndex !== 'undefined') {
            //is rowIndex !== rowAndColArr[0]
            //or is rowAndColArr not part of one of the mergedCells
            var needsRender = false;
            if (rowIndex != rowAndColArr[0]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(rowAndColArr[0], null, affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        } else if (colIndex && typeof colIndex !== 'undefined') {
            var needsRender = false;
            if (colIndex != rowAndColArr[1]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(null, rowAndColArr[1], affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        }*/
        //----End----

        var heightWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
        var heightHelper = heightWidthObj.height;
        var widthHelper = heightWidthObj.width;

        heightHelper = heightHelper > 20?heightHelper - 10:heightHelper;
        widthHelper = widthHelper > 20?widthHelper - 10:widthHelper;
        var boxLineChartSetting = handsonTableHelperObjBoxLineChartSettings[i];
        if (boxLineChartSetting && typeof boxLineChartSetting !== 'undefined') {
            widthHelperFromSetting = Number(boxLineChartSetting.miscWidth)
            heightHelperFromSetting = Number(boxLineChartSetting.miscHeight)
            if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                widthHelper = widthHelperFromSetting
            }
            if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                heightHelper = heightHelperFromSetting
            }
        }
        var boxLineChartHtmlOb = createHandsonCellDivWithProps(ids+'altholder', widthHelper, heightHelper, boxLineChartSetting);
        //var boxLineChartHtml = '<div class="" id="' + ids +
            //'" style="width:' + widthHelper + 'px;height:' + heightHelper + 'px;overflow:hidden"></div>';
        var tempHandsonTableOptions = handsonTable.getSettings();
        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = boxLineChartHtmlOb.outerHTML;
        handsonTable.updateSettings(tempHandsonTableOptions);

        var boxLineChartSettings = handsonTableHelperObjBoxLineChartSettings[i];
         var obj = document.createElement('div');
         obj.id = ids + "alt";
         obj.style.cssText = 'width:'+widthHelper+'px;height:'+heightHelper+'px;margin:auto;';
         document.getElementById("BoxLineChartHelper").appendChild(obj);
        // BoxLineChartForHandsonCell(ids+'alt', rowAndColArr[0], rowAndColArr[1], widthHelper, heightHelper)
        resizeChartsBoxDiagramAjaxHelper(rowAndColArr[0], rowAndColArr[1], ids+'alt',
            widthHelper, heightHelper, boxLineChartSettings);
        /*$.ajax({
            url: "/static/js/projectJs/data2.json",
            type: "get",
            datatype: "JSON",
            success: function(msg) {
                var data=msg
                setBoxDiagram(ids+'altholder',data, rowAndColArr[0], rowAndColArr[1], widthHelper, heightHelper,typeof boxLineChartSettings !== 'undefined' ? boxLineChartSettings:BigobjHelper)
            },
            error: function(msg) {
                alert("msg");
            }
        });*/
    }

    for (var i in handsonTableHelperObjSigmaMaps) {
        var ids = handsonTableHelperObjSigmaMaps[i];
        var rowAndColArr = i.split(',');
        //check if this needs to be re-rendered
        //is rowIndex or colIndex defined?
        //----Beginning----
        /*if (rowIndex && typeof rowIndex !== 'undefined') {
            //is rowIndex !== rowAndColArr[0]
            //or is rowAndColArr not part of one of the mergedCells
            var needsRender = false;
            if (rowIndex != rowAndColArr[0]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(rowAndColArr[0], null, affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        } else if (colIndex && typeof colIndex !== 'undefined') {
            var needsRender = false;
            if (colIndex != rowAndColArr[1]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(null, rowAndColArr[1], affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        }*/
        //----End----

        var heightWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
        var heightHelper = heightWidthObj.height;
        var widthHelper = heightWidthObj.width;

        heightHelper = heightHelper > 20?heightHelper - 10:heightHelper;
        widthHelper = widthHelper > 20?widthHelper - 10:widthHelper;
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
        var sigmaHtmlOb = createHandsonCellDivWithProps(ids+'altholder', widthHelper, heightHelper, sigmaSetting);
        //var sigmaMapHtml = '<div class="'+ids+'" id="' + ids +
            //'altholder" style="width:' + widthHelper + 'px;height:' + heightHelper + 'px;"></div>';
        var tempHandsonTableOptions = handsonTable.getSettings();
        handsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = sigmaHtmlOb.outerHTML;
        handsonTable.updateSettings(tempHandsonTableOptions);
        var obj = document.createElement('div');
        obj.id = ids + "alt";
        obj.style.cssText = 'width:'+widthHelper+'px;height:'+heightHelper+'px;margin:auto;';
        document.getElementById("SigmaMapChartHelper").appendChild(obj);
        //SigmaMapForHandsonCell(ids+'alt', rowAndColArr[0], rowAndColArr[1], widthHelper, heightHelper)

        resizeSigmaChartAjaxHelper(rowAndColArr[0], rowAndColArr[1], ids+'alt',
            widthHelper, heightHelper, sigmaSetting);

        /*var SigmaChartSettings = handsonTableHelperObjSigmaMapSettings[i];
        $.ajax({
            url: "/static/js/projectJs/data2.json",
            type: "get",
            datatype: "JSON",
            success: function(msg) {
                var data=msg
                setSigmaChart(ids+'alt',data, rowAndColArr[0], rowAndColArr[1], widthHelper, heightHelper,typeof SigmaChartSettings !== 'undefined' ? SigmaChartSettings:BigobjHelper)
            },
            error: function(msg) {
                alert("msg");
            }
        });*/
    }

    for (var i in handsonTableHelperObjPieCharts) {
        var ids = handsonTableHelperObjPieCharts[i];
        var rowAndColArr = i.split(',');
        //check if this needs to be re-rendered
        //is rowIndex or colIndex defined?
        //----Beginning----
        /*if (rowIndex && typeof rowIndex !== 'undefined') {
            //is rowIndex !== rowAndColArr[0]
            //or is rowAndColArr not part of one of the mergedCells
            var needsRender = false;
            if (rowIndex != rowAndColArr[0]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(rowAndColArr[0], null, affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        } else if (colIndex && typeof colIndex !== 'undefined') {
            var needsRender = false;
            if (colIndex != rowAndColArr[1]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(null, rowAndColArr[1], affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        }*/
        //----End----

        var heightWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
        var heightHelper = heightWidthObj.height;
        var widthHelper = heightWidthObj.width;

        heightHelper = heightHelper > 20?heightHelper - 10:heightHelper;
        widthHelper = widthHelper > 20?widthHelper - 10:widthHelper;
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
        var pieChartHtmlOb = createHandsonCellDivWithProps(ids+'altholder', widthHelper, heightHelper, pieChartSetting);
        //var pieChartHtml = '<div class="" id="' + ids +
            //'altholder" style="width:' + widthHelper + 'px;height:' + heightHelper + 'px;overflow:hidden"></div>';
        var tempHandsonTableOptions = handsonTable.getSettings();
        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = pieChartHtmlOb.outerHTML;
        handsonTable.updateSettings(tempHandsonTableOptions);
        var obj = document.createElement('div');
        obj.id = ids + "alt";
        obj.style.cssText = 'width:'+widthHelper+'px;height:'+heightHelper+'px;margin:auto;';
        document.getElementById("PieChartHelper").appendChild(obj);
        // PieChartForHandsonCell(ids+'alt', rowAndColArr[0], rowAndColArr[1], widthHelper, heightHelper)
        resizeChartsPieChartAjaxHelper(rowAndColArr[0], rowAndColArr[1], ids+'alt', widthHelper,
            heightHelper, pieChartSetting);
        //, BigobjHelper) {
        /*$.ajax({
            url: "/static/js/projectJs/data2.json",
            type: "get",
            datatype: "JSON",
            success: function(msg) {
                var data=msg
                setPieChart(ids+'alt',data, rowAndColArr[0], rowAndColArr[1], widthHelper, heightHelper,typeof PieChartSettings !== 'undefined' ? PieChartSettings:BigobjHelper)
            },
            error: function(msg) {
                alert("msg");
            }
        });*/
    }

    for (var i in handsonTableHelperObjStackingMapCharts) {
        var ids = handsonTableHelperObjStackingMapCharts[i];
        var rowAndColArr = i.split(',');
        //check if this needs to be re-rendered
        //is rowIndex or colIndex defined?
        //----Beginning----
        /*if (rowIndex && typeof rowIndex !== 'undefined') {
            //is rowIndex !== rowAndColArr[0]
            //or is rowAndColArr not part of one of the mergedCells
            var needsRender = false;
            if (rowIndex != rowAndColArr[0]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(rowAndColArr[0], null, affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        } else if (colIndex && typeof colIndex !== 'undefined') {
            var needsRender = false;
            if (colIndex != rowAndColArr[1]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(null, rowAndColArr[1], affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        }*/
        //----End----

        var heightWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
        var heightHelper = heightWidthObj.height;
        var widthHelper = heightWidthObj.width;

        heightHelper = heightHelper > 20?heightHelper - 10:heightHelper;
        widthHelper = widthHelper > 20?widthHelper - 10:widthHelper;
        var stackingMapSetting = handsonTableHelperObjStackingMapChartSettings[i];
        if (stackingMapSetting && typeof stackingMapSetting !== 'undefined') {
            widthHelperFromSetting = Number(stackingMapSetting.miscWidth)
            heightHelperFromSetting = Number(stackingMapSetting.miscHeight)
            if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                widthHelper = widthHelperFromSetting
            }
            if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                heightHelper = heightHelperFromSetting
            }
        }
        var stackingMapHtmlOb = createHandsonCellDivWithProps(ids+'altholder', widthHelper, heightHelper, stackingMapSetting);
        //var sigmaMapChartHtml = '<div class="" id="' + ids +
            //'altholder" style="width:' + widthHelper + 'px;height:' + heightHelper + 'px;overflow:hidden"></div>';
        var tempHandsonTableOptions = handsonTable.getSettings();
        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = stackingMapHtmlOb.outerHTML;
        handsonTable.updateSettings(tempHandsonTableOptions);
        var obj = document.createElement('div');
        obj.id = ids + "alt";
        obj.style.cssText = 'width:'+widthHelper+'px;height:'+heightHelper+'px;margin:auto;';
        document.getElementById("StackingMapChartHelper").appendChild(obj);
        resizeStackingMapAjaxHelper(rowAndColArr[0], rowAndColArr[1], ids+'alt',
            widthHelper, heightHelper, stackingMapSetting)
/*        $.ajax({
            url: "/static/js/projectJs/data2.json",
            type: "get",
            datatype: "JSON",
            success: function(msg) {
                var data=msg
                setStackingMapChart(ids+'alt',data, rowAndColArr[0], rowAndColArr[1], widthHelper, heightHelper,typeof StackingMapChartSettings !== 'undefined' ? StackingMapChartSettings:BigobjHelper)
                // setPieChart(ids+'alt',data, rowAndColArr[0], rowAndColArr[1], widthHelper, heightHelper,typeof PieChartSettings !== 'undefined' ? PieChartSettings:BigobjHelper)
            },
            error: function(msg) {
                alert("msg");
            }
        });*/
    }

    for (var i in handsonTableHelperObjImgs) {
        var rowAndColArr = i.split(',');
        //check if this needs to be re-rendered
        //is rowIndex or colIndex defined?
        //----Beginning----
        /*if (rowIndex && typeof rowIndex !== 'undefined') {
            //is rowIndex !== rowAndColArr[0]
            //or is rowAndColArr not part of one of the mergedCells
            var needsRender = false;
            if (rowIndex != rowAndColArr[0]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(rowAndColArr[0], null, affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        } else if (colIndex && typeof colIndex !== 'undefined') {
            var needsRender = false;
            if (colIndex != rowAndColArr[1]) {
                for (var i = 0; i < affectedMergeCells.length; i++) {
                    if (isPartOfMergeCell(null, rowAndColArr[1], affectedMergeCells[i])) {
                        //is part of this merge cell
                        needsRender = true;
                        break;
                    }
                }
            } else {
                needsRender = true;
            }
            if (!needsRender) {
                continue;
            }
        }*/
        //----End----

        var heightWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
        var heightHelper = heightWidthObj.height;
        var widthHelper = heightWidthObj.width;
        var tempHandsonTableSettings = handsonTable.getSettings();
        var imgCell = $(handsonTable.table).find('.' + handsonTableHelperObjImgs[i]);
        if (imgCell && imgCell.length > 0) {
            $(imgCell[0]).css('width', widthHelper + 'px');
            $(imgCell[0]).css('height', heightHelper + 'px');
            $(imgCell[0]).attr('width', widthHelper);
            $(imgCell[0]).attr('height', heightHelper);
            tempHandsonTableSettings.data[rowAndColArr[0]][rowAndColArr[1]] = $(imgCell[0])[0].outerHTML;
            handsonTable.updateSettings(tempHandsonTableSettings);
        }
    }

    if (handsonTableActiveAjaxCalls <= 0) {
        handsonTableActiveAjaxCalls = 0;
        moveChartsFromAltToAltHolder();
        $('.spinner, #overlay').hide();
    } else {
        //do a setInterval here
        //might be better
        setTimeout(function() {
            //if (handsonTableActiveAjaxCalls > 0) {
                handsonTableActiveAjaxCalls = 0;
                //setTimeout(function() {
                    moveChartsFromAltToAltHolder();
                    $('.spinner, #overlay').hide();
                //}, 4000)
            //}
        }, 1000 * handsonTableActiveAjaxCalls);
    }
}

function resizeChartsTrendMapAjaxHelper(row, col, ids, widthHelper2, heightHelper2,BigobjHelper) {
    handsonTableActiveAjaxCalls++
    $.ajax({
        url: "/static/js/projectJs/data2.json",
        type: "get",
        dataType: "JSON",
        success: function(msg) {
            handsonTableActiveAjaxCalls--
            //moveChartsFromAltToAltHolder
            //moveParetoChartsFromAltToAltHolder, my4.js
            var data = msg.points[0];
            console.log(BigobjHelper)
            setTrendMap(ids,data,BigobjHelper,widthHelper2,heightHelper2)
            if (handsonTableActiveAjaxCalls <= 0) {
                //setTimeout(function() {
                    handsonTableActiveAjaxCalls = 0;
                    setTimeout(function() {
                        moveChartsFromAltToAltHolder();
                    }, 300)
                //}, 2000)
            }
            /*if (document.getElementById(ids)) {
                var tempHandsonTableOptions = handsonTable.getSettings();
                tempHandsonTableOptions.data[row][col] = document.getElementById(ids).outerHTML;
                handsonTable.updateSettings(tempHandsonTableOptions);
            }*/
            /*var wtHolder = $(handsonTable.table).parents('.wtHolder');
            var wtHider = $(handsonTable.table).parents('.wtHider');
            if (wtHolder.length > 0 && wtHider.length > 0) {
                $(wtHolder[0]).width(handsonTable.table.clientWidth);
                $(wtHider[0]).width(handsonTable.table.clientWidth);
                $(wtHolder[0]).height(handsonTable.table.clientHeight);
                $(wtHider[0]).height(handsonTable.table.clientHeight);
            }
            $("#handsonContainer").width(handsonTable.table.clientWidth);
            $("#handsonContainer").height(handsonTable.table.clientHeight);*/
        },
        error: function() {
            alert("æ��äº¤å¤±è´¥ï¼�");
        }
    });
}

function resizeChartsControlChartAjaxHelper(row, col, ids, widthHelper, heightHelper,
    BigobjHelper) {
        handsonTableActiveAjaxCalls++
        $.ajax({
            url: "/static/js/projectJs/data2.json",
            type: "get",
            dataType: "JSON",
            success: function(msg) {
                handsonTableActiveAjaxCalls--
                //moveChartsFromAltToAltHolder
                var Result=msg
                setControlChart(ids, row, col, widthHelper, heightHelper, BigobjHelper, Result, function() {
                    if (handsonTableActiveAjaxCalls <= 0) {
                        handsonTableActiveAjaxCalls = 0;
                        setTimeout(function() {
                            moveChartsFromAltToAltHolder();
                        }, 300)
                    }
                })
                // if (document.getElementById(ids)) {
                //     var tempHandsonTableOptions = handsonTable.getSettings();
                //     tempHandsonTableOptions.data[row][col] = document.getElementById(ids).outerHTML;
                //     handsonTable.updateSettings(tempHandsonTableOptions);
                // }
            },
            error: function(msg) {
                alert("msg");
            }
        });
}

function resizeChartsParetoChartAjaxHelper(row, col, ids, widthHelper, heightHelper, BigobjHelper) {
    handsonTableActiveAjaxCalls++
    $.ajax({
        url: "/static/js/projectJs/data2.json",
        type: "get",
        dataType: "JSON",
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
                        //moveChartsFromAltToAltHolder();
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
        dataType: "JSON",
        success: function(msg) {
            var data=msg
            setBoxDiagram(ids,data, row, col, widthHelper, heightHelper,BigobjHelper)
            handsonTableActiveAjaxCalls--;
            if (handsonTableActiveAjaxCalls <= 0) {
                handsonTableActiveAjaxCalls = 0;
            }
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
        dataType: "JSON",
        success: function(msg) {
            var data=msg
            setPieChart(ids, data, row, col,
                widthHelper, heightHelper,BigobjHelper)
            handsonTableActiveAjaxCalls--;
            if (handsonTableActiveAjaxCalls <= 0) {
                handsonTableActiveAjaxCalls = 0;
            }
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
        dataType: "JSON",
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
        dataType: "JSON",
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

/**
 *  切换报告获取值
 * @param val
 */
function handoverReport(val) {
    deleteHandsonTable()
    //refactor out this hack at some point
    if (val == '') {
        val = $('#id').val()
        if (val == '') {
            val = 190
        }
    }
    $.ajax({
        type: "POST",
        url: "/customReport/"+val,
        dataType: "json",
        cache: false,
        async: false,
        success: function (data) {
            handsonTableOptions = JSON.parse(data.json);
            handsonTableOptions = handsonTableOptions||{};
            handsonTableHelperObj = handsonTableOptions.handsonTableHelperObj||{};
            muban_handsonTableOptions_arr = handsonTableOptions.muban_handsonTableOptions_arr||[]
            muban_handsonTableOptionsAdd_arr = handsonTableOptions.muban_handsonTableOptionsAdd_arr||[]
            muban_handsonTableImgs = handsonTableOptions.muban_handsonTableImgs||[]
            handsonTableHelperObjParetos = handsonTableOptions.handsonTableHelperObjParetos||{};//JSON.parse(handsonTableOptions.handsonTableHelperObjParetos);
            handsonTableHelperObjParetoSettings = handsonTableOptions.handsonTableHelperObjParetoSettings||{};
            handsonTableHelperObjTrendMaps = handsonTableOptions.handsonTableHelperObjTrendMaps||{};
            handsonTableHelperObjTrendMapSettings = handsonTableOptions.handsonTableHelperObjTrendMapSettings||{};
            handsonTableHelperObjControlChartSettings = handsonTableOptions.handsonTableHelperObjControlChartSettings||{};
            handsonTableHelperObjHistogramSettings = handsonTableOptions.handsonTableHelperObjHistogramSettings||{};
            handsonTableHelperObjHistograms = handsonTableOptions.handsonTableHelperObjHistograms||{};
            handsonTableHelperObjTrendMaps = handsonTableOptions.handsonTableHelperObjTrendMaps||{};
            handsonTableHelperObjControlCharts = handsonTableOptions.handsonTableHelperObjControlCharts||{};
            handsonTableHelperObjBoxLineCharts = handsonTableOptions.handsonTableHelperObjBoxLineCharts||{};
            handsonTableHelperObjSigmaMaps = handsonTableOptions.handsonTableHelperObjSigmaMaps||{};
            handsonTableHelperObjPieCharts = handsonTableOptions.handsonTableHelperObjPieCharts||{};
            handsonTableHelperObjStackingMapCharts = handsonTableOptions.handsonTableHelperObjStackingMapCharts||{};
            handsonTableHelperObjImgs = handsonTableOptions.handsonTableHelperObjImgs||{};
            handsonTableHelperObjControlChartSettings =
                handsonTableOptions.handsonTableHelperObjControlChartSettings||{};
            handsonTableHelperObjHistogramSettings = handsonTableOptions.handsonTableHelperObjHistogramSettings||{};
            handsonTableHelperObjBoxLineChartSettings = handsonTableOptions.handsonTableHelperObjBoxLineChartSettings||{};
            handsonTableHelperObjSigmaMapSettings = handsonTableOptions.handsonTableHelperObjSigmaMapSettings||{};
            handsonTableHelperObjPieChartSettings = handsonTableOptions.handsonTableHelperObjPieChartSettings||{};
            handsonTableHelperObjStackingMapChartSettings = handsonTableOptions.handsonTableHelperObjStackingMapChartSettings||{};

            var colNum = handsonTableOptions.numOfCols;
            var rowNum = handsonTableOptions.numOfRows;
            var columnsArr = [];
            for (var i = 0; i < colNum; i++) {
                columnsArr.push({renderer: "html"});
            }

            var clientWidthHelper = 50;
            var clientHeightHelper = 50;
            if (handsonTableOptions != null && handsonTableOptions.colWidths != null) {
                for (var i = 0; i < handsonTableOptions.colWidths.length; i++) {
                    if (!handsonTableOptions.colWidths[i] || typeof handsonTableOptions.colWidths[i] === 'undefined') {
                        handsonTableOptions.colWidths[i] = 20;
                    }
                    clientWidthHelper += handsonTableOptions.colWidths[i];
                }
            }

            if (handsonTableOptions != null && handsonTableOptions.rowHeights != null) {
                for (var i = 0; i < handsonTableOptions.rowHeights.length; i++) {
                    if (!handsonTableOptions.rowHeights[i] || typeof handsonTableOptions.rowHeights[i] === 'undefined') {
                        handsonTableOptions.rowHeights[i] = 20;
                    }
                    clientHeightHelper += handsonTableOptions.rowHeights[i];
                }
            }

            handsonTableOptions = {
                data: handsonTableOptions.data,//Handsontable.helper.createSpreadsheetData(6, 6),
                rowHeaders: true,
                colHeaders: true,
                width: typeof handsonTableOptions.clientWidth !== 'undefined' &&
                    handsonTableOptions.clientWidth && !isNaN(handsonTableOptions.clientWidth) ?
                    handsonTableOptions.clientWidth + 50:
                    clientWidthHelper,
                height: typeof handsonTableOptions.clientHeight !== 'undefined' &&
                    handsonTableOptions.clientHeight && !isNaN(handsonTableOptions.clientHeight) ?
                    handsonTableOptions.clientHeight + 50:
                    clientHeightHelper,
                colWidths: handsonTableOptions.colWidths,//[30, 30, 30, 30, 30, 30],
                rowHeights: handsonTableOptions.rowHeights,//[25, 25, 25, 25, 25, 25],
                columns: columnsArr,
                manualColumnResize: true,
                manualRowResize: true,
                outsideClickDeselects: false,
                selectionMode: 'multiple',
                margeCells: true,
                mergeCells: handsonTableOptions.mergeCells
            };

            layer.closeAll()
            var beginId = "table"
            var id = beginId + Math.floor(Math.random() * 1000) //随机id
            var ids = WhetherId(id, beginId)

            $("#reportContCont").prepend(
                "<div class='ui-widget-content resizabletable' style=''>" + //<i class='hander'></i><span class='element elcuo1-copy deleteBox'></span>" +
                "<div id='handsonContainer' class=" +
                ids + "></div></div>")

            var container = document.getElementById('handsonContainer');

            handsonTable = new Handsontable(container, handsonTableOptions);

            //get dimensional boundaries for this handson table
            //ToDo: needs to be tweaked/fixed
            getMaxBoundingRectForHandson();
            //wire up all event handlers for this handson table
            initHandsonTable(handsonTable);
            resizeCharts();

            if (handsonTableHelperObj.handsonTableWidth) {
                $('#handsonContainer').width(handsonTableHelperObj.handsonTableWidth)
            }
            if (handsonTableHelperObj.handsonTableHeight) {
                $('#handsonContainer').height(handsonTableHelperObj.handsonTableHeight)
            }
            if (handsonTableHelperObj.handsonTableBackgroundColor) {
                var color = handsonTableHelperObj.handsonTableBackgroundColor

                var sheetToBeRemoved = document.getElementById('handsonTableBackgroundColorStyle');
                if (sheetToBeRemoved) {
                    var sheetParent = sheetToBeRemoved.parentNode;
                    sheetParent.removeChild(sheetToBeRemoved);
                }

                var sheet = document.createElement('style')
                sheet.id = 'handsonTableBackgroundColorStyle'
                sheet.innerHTML = "#handsonContainer td {background-color: " + color + ";}";
                document.body.appendChild(sheet);
            }
            updateHandsonTableFrame();
            mubanInitFromHandOver(muban_handsonTableOptions_arr,
                muban_handsonTableOptionsAdd_arr)
            make('', '');
        }
    });
}

$(document).ready(function() {
   handoverReport($('#id').val());
   $('#handsonTableBackgroundColor, #handsonTableFrameColor').colorpicker();
});

function saveTrendMapSettings() {
    var objHelper = {};
    objHelper.trendMapSel1 = $(".TrendMap select[name='trendMapSel1']").val();
    objHelper.trendMapSel2 = $(".TrendMap select[name='trendMapSel2']").val();
    objHelper.trendMapCb1 = $(".TrendMap input[name='trendMapCb1']").is(":checked");
    objHelper.trendMapFrom1 = $(".TrendMap input[name='trendMapFrom1']").val();
    objHelper.trendMapTo1 = $(".TrendMap input[name='trendMapTo1']").val();
    objHelper.trendMapSel3 = $(".TrendMap select[name='trendMapSel3']").val();
    objHelper.trendMapSel4 = $(".TrendMap select[name='trendMapSel4']").val();
    objHelper.trendMapSelXStyle = $(".TrendMap select[name='trendMapSelXStyle']").val();
    objHelper.trendMapSelLabel = $(".TrendMap select[name='trendMapSelLabel']").val();
    objHelper.trendMapNumIntFrom1 = $(".TrendMap input[name='trendMapNumIntFrom1']").val();
    objHelper.trendMapNumIntTo1 = $(".TrendMap input[name='trendMapNumIntTo1']").val();
    objHelper.trendMapMinInt1 = $(".TrendMap input[name='trendMapMinInt1']").val();
    objHelper.trendMapSelYStyle = $(".TrendMap select[name='trendMapSelYStyle']").val();
    objHelper.trendMapSelLabel2 = $(".TrendMap select[name='trendMapSelLabel2']").val();
    objHelper.trendMapNumIntFrom2 = $(".TrendMap input[name='trendMapNumIntFrom2']").val();
    objHelper.trendMapNumIntTo2 = $(".TrendMap input[name='trendMapNumIntTo2']").val();
    objHelper.trendMapMinInt2 = $(".TrendMap input[name='trendMapMinInt2']").val();
    /**
     * Get InstructionLines, use classname instructionLines, each instruction line is identified
     * by class cellAttribute
     */
    var instructionLines = [];
    //$('.TrendMap .instructionLines .cellAttribute').each(function() {
    $('.TrendMap .IndicatorLineAdd .cellAttribute').each(function() {
        var cellAttribute = $(this);
        var instructionLine = {};
        instructionLine.cellProperties = $(cellAttribute).find('.cellProperties').val();
        instructionLine.iLParameter = $(cellAttribute).find('.iLParameter').val();
        instructionLine.iLSel1 = $(cellAttribute).find('.iLSel1').val();
        instructionLine.iLInput1 = $(cellAttribute).find('.iLInput1').val();
        instructionLine.iLInputFrom = $(cellAttribute).find('.iLInputFrom').val();
        instructionLine.iLInputTo = $(cellAttribute).find('.iLInputTo').val();
        instructionLine.iLWidthInput1 = $(cellAttribute).find('.iLWidthInput1').val();
        instructionLine.iLTypesSel1 = $(cellAttribute).find('.iLTypesSel1').val();
        instructionLine.iLSelParam1 = $(cellAttribute).find('.iLSelParam1').val();
        instructionLine.iLSelParam2 = $(cellAttribute).find('.iLSelParam2').val();
        instructionLine.RangeNumber = $(cellAttribute).find('.RangeNumber').val();
        instructionLine.WidthNumber = $(cellAttribute).find('.WidthNumber').val();
        instructionLine.iLColor1 = $(cellAttribute).find('.iLColor1').val();
        instructionLine.BackgroundColor = $(cellAttribute).find('.BackgroundColor').val();
        instructionLine.iLInput2 = $(cellAttribute).find('.iLInput2').val();
        instructionLine.iLCb1 = $(cellAttribute).find('.iLCb1').is(':checked');
        instructionLine.iLCb2 = $(cellAttribute).find('.iLCb2').is(':checked');
        instructionLine.IndicatorLineStyleChange = $(cellAttribute).find('.IndicatorLineStyleChange').val();
        instructionLine.iLMapNumIntFrom1 = $(cellAttribute).find('.iLMapNumIntFrom1').val();
        instructionLine.iLMapNumIntFrom2 = $(cellAttribute).find('.iLMapNumIntFrom2').val();
        instructionLine.publicSelectInput = $(cellAttribute).find('.publicSelectInput').attr('value');
        instructionLines.push(instructionLine);
    });
    objHelper.instructionLines = instructionLines;
    /**
     * Get DataStyles, use classname dataStyles, each data style is identified
     * by class cellAttribute
     */
    var dataStyles = [];
    $('.TrendMap .DataStyleAdd .cellAttribute').each(function() {
        var cellAttribute = $(this);
        var dataStyle = {};
        dataStyle.dSYValueSel1 = $(cellAttribute).find('.dSYValueSel1').val();
        dataStyle.dSYValueSel2 = $(cellAttribute).find('.dSYValueSel2').val();
        dataStyle.dSYValueInput1 = $(cellAttribute).find('.dSYValueInput1').val();
        dataStyle.dSBgColorCb1 = $(cellAttribute).find('.dSBgColorCb1').val();
        dataStyle.dSBgColorInput1 = $(cellAttribute).find('.dSBgColorInput1').val();
        dataStyle.dSBgColorTransparency1 = $(cellAttribute).find('.dSBgColorTransparency1').val();
        dataStyle.dSFrameCb1 = $(cellAttribute).find('.dSFrameCb1').val();
        dataStyle.dSFrameColor1 = $(cellAttribute).find('.dSFrameColor1').val();
        dataStyle.dSFrameColorTransparency1 = $(cellAttribute).find('.dSFrameColorTransparency1').val();
        dataStyle.dSStyleSel1 = $(cellAttribute).find('.dSStyleSel1').val();
        dataStyle.dSStyleSel2 = $(cellAttribute).find('.dSStyleSel2').val();
        dataStyle.dSRangeNumber1 = $(cellAttribute).find('.dSRangeNumber1').val();
        dataStyle.dSRangeNumber2 = $(cellAttribute).find('.dSRangeNumber2').val();
        dataStyle.dSWidth = $(cellAttribute).find('.dSWidth').val();
        dataStyle.dSRangeNumber2 = $(cellAttribute).find('.dSRangeNumber2').val();
        dataStyle.dSFrameBgColor = $(cellAttribute).find('.dSFrameBgColor').val();
        dataStyle.dSTransparency1 = $(cellAttribute).find('.dSTransparency1').val();
        dataStyle.dSCb1 = $(cellAttribute).find('.dSCb1').is(':checked');
        dataStyle.dSCb2 = $(cellAttribute).find('.dSCb2').is(':checked');
        dataStyle.dSCb3 = $(cellAttribute).find('.dSCb3').is(':checked');
        dataStyle.DataTypeShowElement = $(cellAttribute).find('.DataTypeShow .element').attr('value');
        dataStyle.publicSelectInput = $(cellAttribute).find('.publicSelectInput').attr('value');
        dataStyles.push(dataStyle);
    });
    objHelper.dataStyles = dataStyles;
    //misc (remaining) inputs
    objHelper.miscMove1 = $('.TrendMap .miscMove1').data('state');
    objHelper.miscRadio1 = $('.TrendMap .miscRadio1').is(':checked');
    objHelper.miscRadio2 = $('.TrendMap .miscRadio2').is(':checked');
    objHelper.miscRadio3 = $('.TrendMap .miscRadio3').is(':checked');
    objHelper.miscMove2 = $('.TrendMap .miscMove2').data('state');
    objHelper.miscSel1 = $('.TrendMap .miscSel1').val();
    objHelper.miscSel2 = $('.TrendMap .miscSel2').val();
    objHelper.miscSel3 = $('.TrendMap .miscSel3').val();
    objHelper.miscBgColorCb1 = $('.TrendMap .miscBgColorCb1').is(':checked');
    objHelper.miscBgColorInput1 = $('.TrendMap .miscBgColorInput1').val();
    objHelper.miscBgColorTransparency1 = $('.TrendMap .miscBgColorTransparency1').val();
    objHelper.miscFrameCb1 = $('.TrendMap .miscFrameCb1').is(':checked');
    objHelper.miscFrameBgColor1 = $('.TrendMap .miscFrameBgColor1').val();
    objHelper.miscFrameTransparency1 = $('.TrendMap .miscFrameTransparency1').val();
    objHelper.miscSel4 = $('.TrendMap .miscSel4').val();
    objHelper.miscSel5 = $('.TrendMap .miscSel5').val();
    objHelper.miscSel6 = $('.TrendMap .miscSel6').val();
    objHelper.miscSel7 = $('.TrendMap .miscSel7').val();
    objHelper.miscHeight = $('.TrendMap .miscInput1').val();
    objHelper.miscWidth = $('.TrendMap .miscInput2').val();
    objHelper.miscInput3 = $('.TrendMap .miscInput3').val();
    objHelper.miscTableBorderStyle = $('.TrendMap .tableBorderStyle').attr('value');
    objHelper.miscFrameThickness = $('.TrendMap .miscInput4').val();
    objHelper.miscBGColor = $('.TrendMap .miscInput3').val();
    objHelper.miscTableBorderColor = $('.TrendMap .miscInput3').val();
    saveTrendMap(objHelper)
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    handsonTableHelperObjTrendMapSettings[currSelection[0][0] + ',' + currSelection[0][1]] = objHelper;
    applyTrendMapSettings(currSelection[0][0], currSelection[0][1], objHelper);
    alert("TrendMap settings saved");

}

function loadTrendMapSettings() {
    if (typeof handsonTable === 'undefined') {
        return false;
    }
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    if (typeof handsonTableHelperObjTrendMapSettings[currSelection[0][0] + ',' + currSelection[0][1]] === 'undefined') {
        return false;
    } else {
        var trendMapSettings = handsonTableHelperObjTrendMapSettings[currSelection[0][0] + ',' + currSelection[0][1]];
        //ToDo - load all selects and inputs
        //IndicatorLineAddAlt(IndicatorLine)
        //DataStyleAddAlt
        //load instruction lines via IndicatorLineAddAlt
        if (trendMapSettings.instructionLines.length > 0) {
            $(".publicStyle").find(".IndicatorLineAdd").html('');
        } else {
            $(".publicStyle").find(".IndicatorLineAdd:not(:first)").html('');
        }

        for (var i = 0; i < trendMapSettings.instructionLines.length; i++) {
            IndicatorLineAddAlt(trendMapSettings.instructionLines[i]);
        }

        if (trendMapSettings.dataStyles.length > 0) {
            $(".publicStyle").find(".DataStyleAdd").html('');
        } else {
            $(".publicStyle").find(".DataStyleAdd:not(:first)").html('');
        }

        for (var i = 0; i < trendMapSettings.dataStyles.length; i++) {
            DataStyleAddAlt(trendMapSettings.dataStyles[i]);
        }
        //use getNullableValue
        $(".TrendMap select[name='trendMapSel1']").val(getNullableValue(trendMapSettings.trendMapSel1));
        $(".TrendMap select[name='trendMapSel2']").val(getNullableValue(trendMapSettings.trendMapSel2));
        $(".TrendMap input[name='trendMapCb1']").prop("checked", getNullableValue(trendMapSettings.trendMapCb1));
        $(".TrendMap input[name='trendMapFrom1']").val(getNullableValue(trendMapSettings.trendMapFrom1));
        $(".TrendMap input[name='trendMapTo1']").val(getNullableValue(trendMapSettings.trendMapTo1));
        $(".TrendMap select[name='trendMapSel3']").val(getNullableValue(trendMapSettings.trendMapSel3));
        $(".TrendMap select[name='trendMapSel4']").val(getNullableValue(trendMapSettings.trendMapSel4));
        $(".TrendMap select[name='trendMapSelXStyle']").val(getNullableValue(trendMapSettings.trendMapSelXStyle));
        $(".TrendMap select[name='trendMapSelLabel']").val(getNullableValue(trendMapSettings.trendMapSelLabel));
        $(".TrendMap input[name='trendMapNumIntFrom1']").val(getNullableValue(trendMapSettings.trendMapNumIntFrom1));
        $(".TrendMap input[name='trendMapNumIntTo1']").val(getNullableValue(trendMapSettings.trendMapNumIntTo1));
        $(".TrendMap input[name='trendMapMinInt1']").val(getNullableValue(trendMapSettings.trendMapMinInt1));
        $(".TrendMap select[name='trendMapSelYStyle']").val(getNullableValue(trendMapSettings.trendMapSelYStyle));
        $(".TrendMap select[name='trendMapSelLabel2']").val(getNullableValue(trendMapSettings.trendMapSelLabel2));
        $(".TrendMap input[name='trendMapNumIntFrom2']").val(getNullableValue(trendMapSettings.trendMapNumIntFrom2));
        $(".TrendMap input[name='trendMapNumIntTo2']").val(getNullableValue(trendMapSettings.trendMapNumIntTo2));
        $(".TrendMap input[name='trendMapMinInt2']").val(getNullableValue(trendMapSettings.trendMapMinInt2));

        //misc (remaining) inputs
        $('.TrendMap .miscMove1').data('state', getNullableValue(trendMapSettings.miscMove1));
        $('.TrendMap .miscRadio1').prop('checked', getNullableValue(trendMapSettings.miscRadio1));
        $('.TrendMap .miscRadio2').prop('checked', getNullableValue(trendMapSettings.miscRadio2));
        $('.TrendMap .miscRadio3').is('checked', getNullableValue(trendMapSettings.miscRadio3));
        $('.TrendMap .miscMove2').data('state', getNullableValue(trendMapSettings.miscMove2));
        $('.TrendMap .miscSel1').val(getNullableValue(trendMapSettings.miscSel1));
        $('.TrendMap .miscSel2').val(getNullableValue(trendMapSettings.miscSel2));
        $('.TrendMap .miscSel3').val(getNullableValue(trendMapSettings.miscSel3));
        $('.TrendMap .miscBgColorCb1').prop('checked', getNullableValue(trendMapSettings.miscBgColorCb1));
        $('.TrendMap .miscBgColorInput1').val(getNullableValue(trendMapSettings.miscBgColorInput1));
        $('.TrendMap .miscBgColorTransparency1').val(getNullableValue(trendMapSettings.miscBgColorTransparency1));
        $('.TrendMap .miscFrameCb1').prop('checked', getNullableValue(trendMapSettings.miscFrameCb1));
        $('.TrendMap .miscFrameBgColor1').val(getNullableValue(trendMapSettings.miscFrameBgColor1));
        $('.TrendMap .miscFrameTransparency1').val(getNullableValue(trendMapSettings.miscFrameTransparency1));
        $('.TrendMap .miscSel4').val(getNullableValue(trendMapSettings.miscSel4));
        $('.TrendMap .miscSel5').val(getNullableValue(trendMapSettings.miscSel5));
        $('.TrendMap .miscSel6').val(getNullableValue(trendMapSettings.miscSel6));
        $('.TrendMap .miscSel7').val(getNullableValue(trendMapSettings.miscSel7));
        $('.TrendMap .miscInput1').val(getNullableValue(trendMapSettings.miscHeight));
        $('.TrendMap .miscInput2').val(getNullableValue(trendMapSettings.miscWidth));
        $('.TrendMap .miscInput3').val(getNullableValue(trendMapSettings.miscInput3));
        $('.TrendMap .miscInput4').val(getNullableValue(trendMapSettings.miscFrameThickness));
        $('.TrendMap .tableBorderStyle').attr('value', trendMapSettings.miscTableBorderStyle);
    }
}

function getMaxBoundingRectForHandson() {
    var reportRhide = document.getElementsByClassName('reportRhide');
    var paperSize = document.getElementsByClassName('paperSize');
    if (reportRhide.length > 0 && paperSize.length > 0) {
        var reportRhideBoundingClient = reportRhide[0].getBoundingClientRect();
        var paperSizeBoundingClient = paperSize[0].getBoundingClientRect();
        var maxWidth = reportRhideBoundingClient.left - paperSizeBoundingClient.left - 20;
        var maxHeight = paperSizeBoundingClient.height - 20;
        handsonTableHelperObjHelper.maxWidth = maxWidth;
        handsonTableHelperObjHelper.maxHeight = maxHeight;
    }
}

function initHandsonTable(handsonTable) {
    handsonTable.addHook('beforeColumnResize', function(currentColumn, newSize, isDoubleClick) {
        handsonTableOptions = handsonTable.getSettings();
        var numOfCols = handsonTable.countCols();
        var widthHelper = 0;
        for (var i = 0; i < numOfCols; i++) {
            //if (i == currentColumn)
            var widthHelper2 = handsonTable.getColWidth(i);
            widthHelper += widthHelper2;
        }
        console.log("widthHelper: " + widthHelper + ", width: " + handsonTableOptions.width);
        if (widthHelper > handsonTableHelperObjHelper.maxWidth) {
            console.log("Exceeded max width returning false in afterColumnResize handler");
            return false;
        }
    });
    handsonTable.addHook('afterColumnResize', function(colIndex, newWidth, isDoubleClick) {
        console.log('Resized Column '+ colIndex + ' to ' + newWidth + ', old width: ' + handsonTable.getColWidth(colIndex));
        console.log("width is: " + handsonTable.table.clientWidth + ", height is: " + handsonTable.table.clientHeight);
        handsonTableOptions = handsonTable.getSettings();
        var oldColWidth = handsonTableOptions.colWidths[colIndex];
        var widthDiff = newWidth - oldColWidth;
        var numOfCols = handsonTable.countCols();
        var widthHelper = 50;//fifty for that first column, is probably 50
        var widthHelperOld = 50;
        for (var i = 0; i < numOfCols; i++) {
            if (i == colIndex) {
                widthHelperOld += oldColWidth;
                var widthHelper2 = handsonTable.getColWidth(i);
                widthHelper += widthHelper2;
            } else {
                var widthHelper2 = handsonTable.getColWidth(i);
                widthHelper += widthHelper2;
                widthHelperOld += widthHelper2;
            }
        }
        if (handsonTableOptions.width + widthDiff > handsonTableHelperObjHelper.maxWidth) {
            handsonTableOptions.width = handsonTableHelperObjHelper.maxWidth - 100
                //widthHelperOld;
            handsonTable.table.clientWidth = handsonTableHelperObjHelper.maxWidth - 100
                //widthHelperOld;
            handsonTable.updateSettings(handsonTableOptions);
            var wtHolder = $(handsonTable.table).parents('.wtHolder');
            if (wtHolder.length > 0) {
                $(wtHolder[0]).width(widthHelperOld);
            }
            $('#handsonContainer .htCore th:nth-child('+(colIndex + 2)+')').each(function() {
                $(this).width(oldColWidth);
                $(this).find('*').each(function() {
                    $(this).width(oldColWidth);
                });
            });
            $('#handsonContainer .htCore td:nth-child('+(colIndex + 2)+')').each(function() {
                $(this).width(oldColWidth);
                $(this).find('*').each(function() {
                    $(this).width(oldColWidth);
                });
            });
            $('#handsonContainer .htCore col:nth-child('+(colIndex + 2)+')').each(function() {
                $(this).width(oldColWidth);
                $(this).find('*').each(function() {
                    $(this).width(oldColWidth);
                });
            });
            $("#handsonContainer").width(widthHelperOld);
            console.log("Exceeded max width returning false in afterColumnResize handler");
            return false;
        }
        handsonTableOptions.width += widthDiff;

        handsonTableOptions.height = handsonTableOptions.clientHeight;
        handsonTableOptions.clientWidth = handsonTableOptions.width;

        handsonTableOptions.colWidths[colIndex] = newWidth;
        handsonTable.updateSettings(handsonTableOptions);
        setTimeout(function() {
            resizeCharts(null, null, colIndex);
            //stabilizeHandsonTableSides();
            updateRowHeadersAndColHeaders();
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
        }, 100);
    });
    handsonTable.addHook('afterRowResize', function(rowIndex, newHeight, isDoubleClick) {
        //console.log('Resized Row '+ rowIndex + ' to ' + newHeight + ', old height: ' + handsonTable.getRowHeight(rowIndex));
        //console.log("width is: " + handsonTable.table.clientWidth + ", height is: " + handsonTable.table.clientHeight);
        handsonTableOptions = handsonTable.getSettings();
        var oldRowHeight = handsonTableOptions.rowHeights[rowIndex];
        var heightDiff = newHeight - oldRowHeight;

        if (handsonTableOptions.height + heightDiff > handsonTableHelperObjHelper.maxHeight) {
            console.log("Exceeded max height returning false in afterRowResize handler");
            return false;
        }
        handsonTableOptions.rowHeights[rowIndex] = newHeight;// = colWidthsArr;
        handsonTableOptions.height += heightDiff;

        handsonTableOptions.clientHeight = handsonTableOptions.height;
        handsonTableOptions.width = handsonTableOptions.clientWidth;

        //handsonTableOptions.rowHeights = rowHeightsArr;
        handsonTable.updateSettings(handsonTableOptions);
        //resizeCharts();
        //handsonTable.render();
        setTimeout(function() {
            resizeCharts(null, rowIndex, null);
            stabilizeHandsonTableSides();
            updateRowHeadersAndColHeaders();
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
        }, 100);
    });
    handsonTable.addHook('afterSelection', function(row, column, row2, column2, preventScrolling, selectionLayerLevel) {
        console.log("afterSelection row: " + row2 + ", column: " + column2);
        var currSelection = [row, column, row2, column2];
        var mergeCellHelper = fourCornersHelper(currSelection);
        var selectedCell = handsonTable.getCell(mergeCellHelper.topLeft.y, mergeCellHelper.topLeft.x);
        triggerHandsonCellClick();

        $(selectedCell).parents("#handsonContainer").find("td").removeClass("td-chosen-css");
        $(selectedCell).addClass("td-chosen-css");
        setTimeout(function() {
            //added here 04/09/2020 12:47AM
            //delete if causing some more trouble
            stabilizeHandsonTableSides();
            updateRowHeadersAndColHeaders();
            //no need to resizeCharts in afterSelection event
            //resizeCharts();
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
        }, 100);
    });
    handsonTable.addHook('afterChange', function(changes) {
        //console.log('afterChange...');
    });

    handsonTable.addHook('afterLoadData', function(initialLoad) {
       //stabilizeHandsonTableSides();
    });

    handsonTable.addHook('afterCreateRow', function(index, amount, source) {
       //stabilizeHandsonTableSides();
    });

    handsonTable.addHook('afterRender', function(isForced) {
       //stabilizeHandsonTableSides();
    });
}