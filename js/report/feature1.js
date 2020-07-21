function reductionFeatureList(isReductionForm) {

    var type = sessionStorage.getItem('featureFilterType');
    var json = sessionStorage.getItem('featureFilterJson');


    var searchConditionId =  $("#searchConditionId").val();

    if (searchConditionId != undefined && searchConditionId != '' ) {
        clearFeatureFiltrateForm();
    }

    // if (res.dataType ==1) {//筛选条件
    if (isReductionForm == 1){
        FillFeatureOutForm();
    }

    var obj = {};

    if (type == 2) {

        //选择了样本

        console.log("选择了样本"+json);

    }

    if (type == 1) {

        // 搜索条件
        obj = json;

    }

    var url = '/searchCondition/findFeatureDataList?d=' + new Date();
    url += '&params=' + encodeURI(obj);
    url += '&rId=' + rId;
    url += '&type=' + type;

    if (type ==2){
        url += '&json=' + json;
    }

    return url;


}

function clearFeatureFiltrateForm() {

    console.log(111111111111111);

    var columnLength = $("#featureColumnListSize").val();
    for (var i = 0; i < columnLength; i++) {
        if (featureFilterBlockState[i].isShow) {
            $("#featureFilterBlock_" + i).addClass("fn-hide");
            featureFilterBlockState[i].isShow = false;
        }
    }

}

function FillFeatureOutForm() {
    // var id = record.id;
    // $("#customizeDataGroupsId").val(id);

    var type = sessionStorage.getItem('featureFilterType');

    if (type == 1){
        var json = sessionStorage.getItem('featureFilterJson');



        var jsonData = JSON.parse(json);
    var sampleConditions = JSON.parse(jsonData.jsonData);
    for (var i = 0, j = 0; i < sampleConditions.length; i++) {
        var data = sampleConditions[i];
        console.log("data" + JSON.stringify(data.jsonData));
        var logic = data.logic;
        var field = data.field;
        var value = data.value;

        if (field == 'f_r_id'){
            continue;
        }

        if (field == 'f_label') {
            $("#dateFiltrateName").val(value);
        } else {

            $("#featureFilterBlock_" + j).removeClass("fn-hide");
            featureFilterBlockState[j].isShow = true;
            $("#featureSelxAndOr_" + j).val(logic).trigger("change");
            $("#featureColumn_" + j).val(field).trigger("change");
            value = value.split(",");
            $("#featureColumnValue_" + j).val(value).trigger("change");
            j++;
        }
    }
    }
}
