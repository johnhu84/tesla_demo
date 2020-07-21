function reductionList(isReductionForm) {

    var type = sessionStorage.getItem('sampleFilterType');
    var json = sessionStorage.getItem('sampleFilterJson');


    var searchConditionId =  $("#searchConditionId").val();
    if (searchConditionId != undefined && searchConditionId != '' ) {
        clearDateFiltrateForm();
    }


    if (isReductionForm == 1){
        //初次加载还原form
        FillSampleOutForm();
    }


    var url = '/searchCondition/findSampleDataList?d=' + new Date();

    var obj = {};

    if (type == 2) {

        //选择了样本

        url += '&type=' + type;

        console.log("选择了样本"+json);

    } else if (type == 1) {


        // 搜索条件
        obj = json;

        url += '&type=' + type;


    } else {
        url += '&type=1';

        obj = JSON.stringify({"dateFiltrateSampleCount": "5"});
    }

    url += '&params=' + encodeURI(obj);
    url += '&rId=' + rId;


    if (type ==2){
        url += '&json=' + json;
    }

    return url;

}


function FillSampleOutForm() {

    var type = sessionStorage.getItem('sampleFilterType');

    if (type == 1){

        var json = sessionStorage.getItem('sampleFilterJson');

        // 样本个数
        var jsonData = JSON.parse(json);
        var dateFiltrateSampleCount = jsonData.dateFiltrateSampleCount;
        $("#dateFiltrateSampleCount").val(dateFiltrateSampleCount);
        // 时间
        var dateFiltrateBegin = jsonData.dateFiltrateBegin;
        $("#dateFiltrateBegin").val(dateFiltrateBegin);
        var dateFiltrateEnd = jsonData.dateFiltrateEnd;
        $("#dateFiltrateEnd").val(dateFiltrateEnd);
        var sampleConditions = JSON.parse(jsonData.jsonData);
        for (var i = 0, j = 0; i < sampleConditions.length; i++) {
            var data = sampleConditions[i];
            console.log("data" + JSON.stringify(data.jsonData));
            var logic = data.logic;
            var field = data.field;
            var value = data.value;
            // 班次
            if (field == 'S_FilterE') { // 班次
                $("#dateFiltrateBatchAndOr").val(logic).trigger("change");
                value = value.split(",");
                $("#dateFiltrateBatch").val(value).trigger("change");
            } else if (field == 'S_FilterG') { // 测量人
                $("#dateFiltrateMeasurePeopleAndOr").val(logic).trigger("change");
                value = value.split(",");
                $("#dateFiltrateMeasurePeople").val(value).trigger("change");
            } else if (field == 'S_FilterF') { // 轮班
                $("#dateFiltrateShiftAndOr").val(logic).trigger("change");
                value = value.split(",");
                $("#dateFiltrateShift").val(value).trigger("change");
            } else {
                $("#dateFiltrateSelxBlock_" + j).removeClass("fn-hide");
                dateFiltrateSelxBlockState[j].isShow = true;
                $("#dateFiltrateSelxAndOr_" + j).val(logic).trigger("change");
                $("#dateFiltrateColumn_" + j).val(field).trigger("change");
                value = value.split(",");
                $("#dateFiltrateColumnValue_" + j).val(value).trigger("change");
                j++;
            }
        }
    }
}

/**
 * 样本筛选 清空表单
 */
function clearDateFiltrateForm() {
    $("#customizeDataGroupsId").val('');
    $("#dateFiltrateName").val('');
    // 样本个数
    $("#dateFiltrateSampleCount").val('');
    // 时间
    $("#dateFiltrateBegin").val('');
    $("#dateFiltrateEnd").val('');
    //批次
    $("#dateFiltrateBatchAndOr").val([]).trigger("change");
    $("#dateFiltrateBatch").val([]).trigger("change");
    // 测量人
    $("#dateFiltrateMeasurePeopleAndOr").val([]).trigger("change");
    $("#dateFiltrateMeasurePeople").val([]).trigger("change");
    // 轮班
    $("#dateFiltrateShiftAndOr").val([]).trigger("change");
    $("#dateFiltrateShift").val([]).trigger("change");
    var columnLength = $("#sampleColumnListSize").val();
    for (var i = 0; i < columnLength; i++) {
        if (dateFiltrateSelxBlockState[i].isShow) {
            $("#dateFiltrateSelxBlock_" + i).addClass("fn-hide");
            dateFiltrateSelxBlockState[i].isShow = false;
        }
    }
}
