function debugPrintHelperObjs() {
    console.log(JSON.stringify(handsonTableHelperObj));
    //What are handsonTableArr and handsonTableHelperObjArr
    //console.log(JSON.stringify(handsonTableArr));
    //console.log(JSON.stringify(handsonTableHelperObjArr));
    console.log('Imgs...');
    console.log(JSON.stringify(handsonTableHelperObjImgs));
    console.log('Paretos...');
    console.log(JSON.stringify(handsonTableHelperObjParetos));
    console.log('ParetoSettings...');
    console.log(JSON.stringify(handsonTableHelperObjParetoSettings));
    console.log('TrendMaps...');
    console.log(JSON.stringify(handsonTableHelperObjTrendMaps));
    console.log('TrendMapSettings...');
    console.log(JSON.stringify(handsonTableHelperObjTrendMapSettings));
    console.log('Histograms...');
    console.log(JSON.stringify(handsonTableHelperObjHistograms));
    console.log('HistogramSettings...');
    console.log(JSON.stringify(handsonTableHelperObjHistogramSettings));
    console.log('ControlCharts...');
    console.log(JSON.stringify(handsonTableHelperObjControlCharts));
    console.log('ControlChartSettings...');
    console.log(JSON.stringify(handsonTableHelperObjControlChartSettings));
    console.log('BoxLineCharts...');
    console.log(JSON.stringify(handsonTableHelperObjBoxLineCharts));
    console.log('BoxLineChartSettings...');
    console.log(JSON.stringify(handsonTableHelperObjBoxLineChartSettings));
    console.log('SigmaMaps...');
    console.log(JSON.stringify(handsonTableHelperObjSigmaMaps));
    console.log('SigmaMapSettings...');
    console.log(JSON.stringify(handsonTableHelperObjSigmaMapSettings));
    console.log('PieCharts...');
    console.log(JSON.stringify(handsonTableHelperObjPieCharts));
    console.log('PieChartSettings...');
    console.log(JSON.stringify(handsonTableHelperObjPieChartSettings));
    console.log('StackingMapCharts...');
    console.log(JSON.stringify(handsonTableHelperObjStackingMapCharts));
    console.log('StackingMapChartSettings...');
    console.log(JSON.stringify(handsonTableHelperObjStackingMapChartSettings));

    //next object has maxHeight and maxWidth used for the handsontable container
    //checks this when resizing columns
    console.log(JSON.stringify(handsonTableHelperObjHelper));
}

function loadFuwenben() {
    $(".operationCont .fuwenben").find('*').each(function() {
        $(this).show();
    });
    /*
    load table height, width, background color and table frame height, width, and background color into these
    inputs
    #handsonTableHeight
	#handsonTableWidth
	#handsonTableBackgroundColor
	#handsonTableFrameWidth
	#handsonTableFrameStyle
	#handsonTableFrameColor
     */
    if (handsonTable && typeof handsonTable !== 'undefined')
    {
        if (!handsonTableHelperObj.handsonTableHeight) {
            //} else {
            handsonTableHelperObj.handsonTableHeight = $(handsonTable.table).height()
        }
        $('#handsonTableHeight').val(handsonTableHelperObj.handsonTableHeight)
        if (!handsonTableHelperObj.handsonTableWidth) {
            handsonTableHelperObj.handsonTableWidth = $(handsonTable.table).width()
        }
        $('#handsonTableWidth').val(handsonTableHelperObj.handsonTableWidth)
        if (!handsonTableHelperObj.handsonTableBackgroundColor) {
            var color = $(handsonTable.table).css('background-color')
            var colorParsed = color.substring(color.lastIndexOf('(') + 1, color.lastIndexOf(')'))
            var colorParsedArr = colorParsed.split(',')
            handsonTableHelperObj.handsonTableBackgroundColor = '#' + colorParsedArr[0].toString(16) +
                colorParsedArr[1].toString(16) + colorParsedArr[2].toString(16)
        }
        $('#handsonTableBackgroundColor').val(handsonTableHelperObj.handsonTableBackgroundColor)
        var handsonTableBorder = $(handsonTable.table).css('border');
        var handsonTableBorderArr = handsonTableBorder.split(' ');
        if (!handsonTableHelperObj.handsonTableFrameWidth) {
            handsonTableHelperObj.handsonTableFrameWidth = handsonTableBorderArr[0]
        }
        $('#handsonTableFrameWidth').val(handsonTableHelperObj.handsonTableFrameWidth);
        if (!handsonTableHelperObj.handsonTableFrameStyle) {
            handsonTableHelperObj.handsonTableFrameStyle = parseInt(handsonTableBorderArr[1])
        }
        $('#handsonTableFrameStyle').val(handsonTableHelperObj.handsonTableFrameWidth);
        var color = handsonTableBorderArr[2]//$(handsonTable.table).css('background-color')
        var colorParsed = color.substring(color.lastIndexOf('(') + 1, color.lastIndexOf(')'))
        if (!handsonTableHelperObj.handsonTableFrameColor) {
            handsonTableHelperObj.handsonTableFrameColor = '#' + colorParsedArr[0].toString(16) +
                colorParsedArr[1].toString(16) + colorParsedArr[2].toString(16)
        }
        $('#handsonTableFrameColor').val(handsonTableHelperObj.handsonTableFrameColor)
    } else {
        return false
    }
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    var fuwenbenRules = handsonTableHelperObj[currSelection[0][0]+','+currSelection[0][1]];
    //clear .bigCellAttribute
    $('.fuwenben .bigCellAttribute').html('');
    //bigNewlyAddedCommand() for each rule object
    //each rule object has multiple conditions
    //use NewlyAddedCommand for that
    //conditionalObjs.push({cellProperties: cellProperties, RangeSymbol: RangeSymbol,
    // 					RangeNumber: RangeNumber, bgColor: bgColor});
    //{rules: conditionalObjs, bgColor: bgColor}
    var bigNewlyAddedCommandHelper = $('.fuwenben .PreservationCondition');

    /*for (var i = 0; i < fuwenbenRules.rules.length; i++) {
        bigNewlyAddedCommand(bigNewlyAddedCommandHelper);
        var NewlyAddedCommandHelper = $(".bigCellAttribute .cellAttribute:last-child .AddingConditions");
        var fuwenbenRule = fuwenbenRules.rules[i];
        var bgColor = '#FFF';
        for (var j = 0; j < fuwenbenRule.cellProperties.length; j++) {
            NewlyAddedCommand(NewlyAddedCommandHelper);
            var AddingConditionLast = $(".bigCellAttribute .cellAttribute:last-child .AddingConditions ul:last-child");
            var cellPropertiesCurr = fuwenbenRule.cellProperties[j];
            //load AddingCondition properties
            if (AddingConditionLast && AddingConditionLast.length > 0) {
                var cpProperties = $(AddingConditionLast[0]).find('.cellProperties');
                if (cpProperties && cpProperties.length > 0) {
                    $(cpProperties[0]).val(cellPropertiesCurr.cellProperties);
                }
                var rangeSymbol = $(AddingConditionLast[0]).find('.RangeSymbol');
                if (rangeSymbol && rangeSymbol.length > 0) {
                    $(rangeSymbol[0]).val(cellPropertiesCurr.RangeSymbol);
                }
                var rangeNumber = $(AddingConditionLast[0]).find('.RangeNumber');
                if (rangeNumber && rangeNumber.length > 0) {
                    $(rangeNumber[0]).val(cellPropertiesCurr.RangeNumber);
                }
            }
            bgColor = cellPropertiesCurr.bgColor;
        }
        var backgroundColorLast = $(".bigCellAttribute .cellAttribute:last-child .BackgroundColorGroup");
        if (backgroundColorLast && backgroundColorLast.length > 0) {
            //load background color information
            var backgroundColorHelper = $(backgroundColorLast[0]).find('.BackgroundColor');
            if (backgroundColorHelper && backgroundColorHelper.length > 0) {
                $(backgroundColorHelper[0]).val(bgColor);
            }
            //ToDo transparent value
        }
    }*/
}

function loadColumnChartSettings() {
    if (typeof handsonTable === 'undefined') {
        return false;
    }
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    if (typeof handsonTableHelperObjHistogramSettings[currSelection[0][0] + ',' + currSelection[0][1]] === 'undefined') {
        return false;
    } else {
        var columnChartSettings = handsonTableHelperObjHistogramSettings[currSelection[0][0] + ',' + currSelection[0][1]];
        //ToDo - load all selects and inputs
        //IndicatorLineAddAlt(IndicatorLine)
        //DataStyleAddAlt
        //load instruction lines via IndicatorLineAddAlt
        if (columnChartSettings.instructionLines.length > 0) {
            $(".publicStyle").find(".IndicatorLineAdd").html('');
        } else {
            $(".publicStyle").find(".IndicatorLineAdd:not(:first)").html('');
        }

        for (var i = 0; i < columnChartSettings.instructionLines.length; i++) {
            IndicatorLineAddAlt(columnChartSettings.instructionLines[i]);
        }

        if (columnChartSettings.dataStyles.length > 0) {
            $(".publicStyle").find(".DataStyleAdd").html('');
        } else {
            $(".publicStyle").find(".DataStyleAdd:not(:first)").html('');
        }

        for (var i = 0; i < columnChartSettings.dataStyles.length; i++) {
            DataStyleAddAlt(columnChartSettings.dataStyles[i]);
        }
        //use getNullableValue
        $(".columnChart select[name='columnChartSel1']").val(getNullableValue(columnChartSettings.columnChartSel1));
        $(".columnChart select[name='columnChartSel2']").val(getNullableValue(columnChartSettings.columnChartSel2));
        $(".columnChart input[name='columnChartCb1']").prop("checked", getNullableValue(columnChartSettings.columnChartCb1));
        $(".columnChart input[name='columnChartFrom1']").val(getNullableValue(columnChartSettings.columnChartFrom1));
        $(".columnChart input[name='columnChartTo1']").val(getNullableValue(columnChartSettings.columnChartTo1));
        $(".columnChart select[name='columnChartSel3']").val(getNullableValue(columnChartSettings.columnChartSel3));
        $(".columnChart select[name='columnChartSel4']").val(getNullableValue(columnChartSettings.columnChartSel4));
        $(".columnChart select[name='columnChartSelXStyle']").val(getNullableValue(columnChartSettings.columnChartSelXStyle));
        $(".columnChart select[name='columnChartSelLabel']").val(getNullableValue(columnChartSettings.columnChartSelLabel));
        $(".columnChart input[name='columnChartNumIntFrom1']").val(getNullableValue(columnChartSettings.columnChartNumIntFrom1));
        $(".columnChart input[name='columnChartNumIntTo1']").val(getNullableValue(columnChartSettings.columnChartNumIntTo1));
        $(".columnChart input[name='columnChartMinInt1']").val(getNullableValue(columnChartSettings.columnChartMinInt1));
        $(".columnChart select[name='columnChartSelYStyle']").val(getNullableValue(columnChartSettings.columnChartSelYStyle));
        $(".columnChart select[name='columnChartSelLabel2']").val(getNullableValue(columnChartSettings.columnChartSelLabel2));
        $(".columnChart input[name='columnChartNumIntFrom2']").val(getNullableValue(columnChartSettings.columnChartNumIntFrom2));
        $(".columnChart input[name='columnChartNumIntTo2']").val(getNullableValue(columnChartSettings.columnChartNumIntTo2));
        $(".columnChart input[name='columnChartMinInt2']").val(getNullableValue(columnChartSettings.columnChartMinInt2));

        //misc (remaining) inputs
        $('.columnChart .miscMove1').data('state', getNullableValue(columnChartSettings.miscMove1));
        $('.columnChart .miscRadio1').prop('checked', getNullableValue(columnChartSettings.miscRadio1));
        $('.columnChart .miscRadio2').prop('checked', getNullableValue(columnChartSettings.miscRadio2));
        $('.columnChart .miscRadio3').is('checked', getNullableValue(columnChartSettings.miscRadio3));
        $('.columnChart .miscMove2').data('state', getNullableValue(columnChartSettings.miscMove2));
        $('.columnChart .miscSel1').val(getNullableValue(columnChartSettings.miscSel1));
        $('.columnChart .miscSel2').val(getNullableValue(columnChartSettings.miscSel2));
        $('.columnChart .miscSel3').val(getNullableValue(columnChartSettings.miscSel3));
        $('.columnChart .miscBgColorCb1').prop('checked', getNullableValue(columnChartSettings.miscBgColorCb1));
        $('.columnChart .miscBgColorInput1').val(getNullableValue(columnChartSettings.miscBgColorInput1));
        $('.columnChart .miscBgColorTransparency1').val(getNullableValue(columnChartSettings.miscBgColorTransparency1));
        $('.columnChart .miscFrameCb1').prop('checked', getNullableValue(columnChartSettings.miscFrameCb1));
        $('.columnChart .miscFrameBgColor1').val(getNullableValue(columnChartSettings.miscFrameBgColor1));
        $('.columnChart .miscFrameTransparency1').val(getNullableValue(columnChartSettings.miscFrameTransparency1));
        $('.columnChart .miscSel4').val(getNullableValue(columnChartSettings.miscSel4));
        $('.columnChart .miscSel5').val(getNullableValue(columnChartSettings.miscSel5));
        $('.columnChart .miscSel6').val(getNullableValue(columnChartSettings.miscSel6));
        $('.columnChart .miscSel7').val(getNullableValue(columnChartSettings.miscSel7));
        $('.columnChart .miscInput1').val(getNullableValue(columnChartSettings.miscHeight));
        $('.columnChart .miscInput2').val(getNullableValue(columnChartSettings.miscWidth));
        $('.columnChart .miscInput3').val(getNullableValue(columnChartSettings.miscInput3));
        $('.columnChart .miscInput4').val(getNullableValue(columnChartSettings.miscFrameThickness));
        $('.columnChart .tableBorderStyle').attr('value', columnChartSettings.miscTableBorderStyle);
    }    
}

//ToDo
function loadControlChartSettings() {
    if (typeof handsonTable === 'undefined') {
        return false;
    }
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    if (typeof handsonTableHelperObjControlChartSettings[currSelection[0][0] + ',' + currSelection[0][1]] === 'undefined') {
        return false;
    } else {
        var controlChartSettings = handsonTableHelperObjControlChartSettings[currSelection[0][0] + ',' + currSelection[0][1]];
        //ToDo - load all selects and inputs
        //IndicatorLineAddAlt(IndicatorLine)
        //DataStyleAddAlt
        //load instruction lines via IndicatorLineAddAlt
        if (controlChartSettings.instructionLines.length > 0) {
            $(".publicStyle").find(".IndicatorLineAdd").html('');
        } else {
            $(".publicStyle").find(".IndicatorLineAdd:not(:first)").html('');
        }

        for (var i = 0; i < controlChartSettings.instructionLines.length; i++) {
            IndicatorLineAddAlt(controlChartSettings.instructionLines[i]);
        }

        if (controlChartSettings.dataStyles.length > 0) {
            $(".publicStyle").find(".DataStyleAdd").html('');
        } else {
            $(".publicStyle").find(".DataStyleAdd:not(:first)").html('');
        }

        for (var i = 0; i < controlChartSettings.dataStyles.length; i++) {
            DataStyleAddAlt(controlChartSettings.dataStyles[i]);
        }
        //use getNullableValue
        $(".controlChart select[name='controlChartSel1']").val(getNullableValue(controlChartSettings.controlChartSel1));
        $(".controlChart select[name='controlChartSel2']").val(getNullableValue(controlChartSettings.controlChartSel2));
        $(".controlChart input[name='controlChartCb1']").prop("checked", getNullableValue(controlChartSettings.controlChartCb1));
        $(".controlChart input[name='controlChartFrom1']").val(getNullableValue(controlChartSettings.controlChartFrom1));
        $(".controlChart input[name='controlChartTo1']").val(getNullableValue(controlChartSettings.controlChartTo1));
        $(".controlChart select[name='controlChartSel3']").val(getNullableValue(controlChartSettings.controlChartSel3));
        $(".controlChart select[name='controlChartSel4']").val(getNullableValue(controlChartSettings.controlChartSel4));
        $(".controlChart select[name='controlChartSelXStyle']").val(getNullableValue(controlChartSettings.controlChartSelXStyle));
        $(".controlChart select[name='controlChartSelLabel']").val(getNullableValue(controlChartSettings.controlChartSelLabel));
        $(".controlChart input[name='controlChartNumIntFrom1']").val(getNullableValue(controlChartSettings.controlChartNumIntFrom1));
        $(".controlChart input[name='controlChartNumIntTo1']").val(getNullableValue(controlChartSettings.controlChartNumIntTo1));
        $(".controlChart input[name='controlChartMinInt1']").val(getNullableValue(controlChartSettings.controlChartMinInt1));
        $(".controlChart select[name='controlChartSelYStyle']").val(getNullableValue(controlChartSettings.controlChartSelYStyle));
        $(".controlChart select[name='controlChartSelLabel2']").val(getNullableValue(controlChartSettings.controlChartSelLabel2));
        $(".controlChart input[name='controlChartNumIntFrom2']").val(getNullableValue(controlChartSettings.controlChartNumIntFrom2));
        $(".controlChart input[name='controlChartNumIntTo2']").val(getNullableValue(controlChartSettings.controlChartNumIntTo2));
        $(".controlChart input[name='controlChartMinInt2']").val(getNullableValue(controlChartSettings.controlChartMinInt2));

        //misc (remaining) inputs
        $('.controlChart .miscMove1').data('state', getNullableValue(controlChartSettings.miscMove1));
        $('.controlChart .miscRadio1').prop('checked', getNullableValue(controlChartSettings.miscRadio1));
        $('.controlChart .miscRadio2').prop('checked', getNullableValue(controlChartSettings.miscRadio2));
        $('.controlChart .miscRadio3').is('checked', getNullableValue(controlChartSettings.miscRadio3));
        $('.controlChart .miscMove2').data('state', getNullableValue(controlChartSettings.miscMove2));
        $('.controlChart .miscSel1').val(getNullableValue(controlChartSettings.miscSel1));
        $('.controlChart .miscSel2').val(getNullableValue(controlChartSettings.miscSel2));
        $('.controlChart .miscSel3').val(getNullableValue(controlChartSettings.miscSel3));
        $('.controlChart .miscBgColorCb1').prop('checked', getNullableValue(controlChartSettings.miscBgColorCb1));
        $('.controlChart .miscBgColorInput1').val(getNullableValue(controlChartSettings.miscBgColorInput1));
        $('.controlChart .miscBgColorTransparency1').val(getNullableValue(controlChartSettings.miscBgColorTransparency1));
        $('.controlChart .miscFrameCb1').prop('checked', getNullableValue(controlChartSettings.miscFrameCb1));
        $('.controlChart .miscFrameBgColor1').val(getNullableValue(controlChartSettings.miscFrameBgColor1));
        $('.controlChart .miscFrameTransparency1').val(getNullableValue(controlChartSettings.miscFrameTransparency1));
        $('.controlChart .miscSel4').val(getNullableValue(controlChartSettings.miscSel4));
        $('.controlChart .miscSel5').val(getNullableValue(controlChartSettings.miscSel5));
        $('.controlChart .miscSel6').val(getNullableValue(controlChartSettings.miscSel6));
        $('.controlChart .miscSel7').val(getNullableValue(controlChartSettings.miscSel7));
        $('.controlChart .miscInput1').val(getNullableValue(controlChartSettings.miscHeight));
        $('.controlChart .miscInput2').val(getNullableValue(controlChartSettings.miscWidth));
        $('.controlChart .miscInput3').val(getNullableValue(controlChartSettings.miscInput3));
        $('.controlChart .miscInput4').val(getNullableValue(controlChartSettings.miscFrameThickness));
        $('.controlChart .tableBorderStyle').attr('value', controlChartSettings.miscTableBorderStyle);
    }
}

function createHandsonCellDivWithProps(id, width, height, setting) {
    var retOb = document.createElement('div')
    retOb.id = id
    if (typeof setting !== 'undefined' && setting) {
        //坐标区域
        if (!isNaN(setting.miscHeight) && Number(setting.miscHeight) > 0) {
            height = Number(setting.miscHeight)
        }
        if (!isNaN(setting.miscWidth) && Number(setting.miscWidth) > 0) {
            width = Number(setting.miscWidth)
        }
        if (setting.miscBGColor) {
            retOb.style.backgroundColor = setting.miscBGColor
        }
        if (setting.miscTableBorderStyle) {
            retOb.style.borderStyle = setting.miscTableBorderStyle == 'empty'?'dotted':'solid'
            retOb.style.borderWidth = Number(setting.miscFrameThickness) > 0?Number(setting.miscFrameThickness)
                +'px':'1px'
            retOb.style.borderColor = setting.miscTableBorderColor
        }
    }
    //retOb.style.width = width
    //retOb.style.height = height
    retOb.style.cssText += 'width:' + width + 'px;height:' + height + 'px;';
    return retOb;
}

function tableMiscSettings() {
    //update handsonTableHelperObj
}

function handsonTableHeightChange(e) {
    //use handsonTableHelperObj
    //you will need ratio function for this
    console.log("handsonTableHeightChange: " + e.currentTarget.value)
    var height = Number(e.currentTarget.value)
    handsonTableHelperObj.handsonTableHeight = height
    //$(handsonTable.table).height(height)
    $('#handsonContainer').height(height)
}

function handsonTableWidthChange(e) {
    console.log("handsonTableWidthChange: " + e.currentTarget.value)
    var width = Number(e.currentTarget.value)
    handsonTableHelperObj.handsonTableWidth = width
    //$(handsonTable.table).width(width)
    $('#handsonContainer').width(width)
}

function handsonTableBackgroundColorChange(e) {
    console.log("handsonTableBackgroundColorChange: " + e.target.value)
    var color = e.target.value
    handsonTableHelperObj.handsonTableBackgroundColor = color
    //$(handsonTable.table).css('background-color', color)

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

function handsonTableFrameWidthChange(e) {
    console.log("handsonTableFrameWidth: " + e.currentTarget.value)
    handsonTableHelperObj.handsonTableFrameWidth = Number(e.currentTarget.value)
    updateHandsonTableFrame();
}

function handsonTableFrameStyleChange(e) {
    console.log("handsonTableFrameStyle: " + e.currentTarget.value)
    handsonTableHelperObj.handsonTableFrameStyle = e.currentTarget.value
    updateHandsonTableFrame();
}

function handsonTableFrameColorChange(e) {
    console.log("handsonTableFrameColor: " + e.target.value)
    handsonTableHelperObj.handsonTableFrameColor = e.target.value
    updateHandsonTableFrame();
}

function updateHandsonTableFrame() {
    var borderStyleArr = []
    if (handsonTableHelperObj.handsonTableFrameWidth && handsonTableHelperObj.handsonTableFrameWidth.length > 0) {
        borderStyleArr.push(handsonTableHelperObj.handsonTableFrameWidth + 'px')
    }
    if (handsonTableHelperObj.handsonTableFrameStyle && handsonTableHelperObj.handsonTableFrameStyle.length > 0) {
        borderStyleArr.push(handsonTableHelperObj.handsonTableFrameStyle)
    }
    if (handsonTableHelperObj.handsonTableFrameColor && handsonTableHelperObj.handsonTableFrameColor.length > 0) {
        borderStyleArr.push(handsonTableHelperObj.handsonTableFrameColor)
    }
    var borderStyle = borderStyleArr.join(' ')
    //$(handsonTable.table).css('border', borderStyle)
    $('#handsonContainer').css('border', borderStyle)
}

/*function cleanupRichText(richText) {
    return richText.replace(/rgb\((.+?)\)/ig, (_, rgb) => {
        return '#' + rgb.split(',')
            .map(str => parseInt(str, 10).toString(16).padStart(2, '0'))
            .join('')
    })
}*/