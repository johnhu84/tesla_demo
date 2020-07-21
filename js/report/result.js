function getResult(type) {

    $("#result").html("");

    var typeStr = '';

    if( type == 1){
        //均值

        typeStr = "均值";


        fun1(1);

    }else if( type == 2){

        typeStr = "最小值";

        fun1(2)

    }else if( type == 3){

        typeStr = "最大值";
        fun1(3)
    }


    if (typeStr == ''){
        $("#result1").text("");
    }else{
        $("#result1").text(typeStr+"计算结果:");
    }


}

function getMean(arr) {

    var sum=0;
    for(var i = 0; i < arr.length; i++){
        sum += arr[i];
    }
    var mean  = sum / arr.length;
    return mean;
}

function getMax(arr) {
    var max = Math.max.apply(null,arr);
    return max;
}

function getMin(arr) {
    var min = Math.min.apply(null, arr);
    return min;
}


function fun1(type) {
    var thStr = "<tr>";
    var tdStr = "<tr>";

    var features = $featureTable.bootstrapTable('getAllSelections');

    $.each($manualSampleTable.bootstrapTable('getAllSelections'), function (i, item) {
        thStr += "<th>" + item.s_label + "</th>>"

        var itemArr = [];
        for (let j = 0; j < features.length; j++) {
            var fitem = features[j];
            var v = fitem[item.s_label];
            var split = v.split("~");
            var rv = split[0];
            if (rv == '-') {
                continue
            } else {
                itemArr.push(parseFloat(rv));
            }
        }

        var mean = "";
        if (type ==1){
             mean = getMean(itemArr);
        }

        if (type ==2){
            mean = getMin(itemArr);
        }

        if (type ==3){
            mean = getMax(itemArr);
        }

        console.log(mean);

        mean = isNaN(mean) == true ? "-" : mean;
        tdStr += "<td>" + mean + "</td>>";

    });

    thStr += "</tr>"

    tdStr += "</tr>";


    $("#result").append(thStr);
    $("#result").append(tdStr);
}
