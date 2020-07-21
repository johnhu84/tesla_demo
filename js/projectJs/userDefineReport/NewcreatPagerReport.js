
var compare = function (obj1, obj2) {//对象排序
    var val1 = obj1.fvlBeginTime;
    var val2 = obj2.fvlBeginTime;
    if (val1 < val2) {
        return -1;
    } else if (val1 > val2) {
        return 1;
    } else {
        return 0;
    }
}
//将数组array分成长度为subGroupLength的小数组并返回新数组
function group(array, subGroupLength) {
    let index = 0;
    let newArray = [];
    while(index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
}
function sortId(a,b){//绝对值排序
    return Math.abs(a.pc) -Math.abs(b.pc)
}
function sortIdNormal(a,b){//排序
    return a.pc -b.pc
}
function sortId1(a,b){//排序
    return Number(b.num) - Number(a.num)
}
function  sortdata(a,b) {//绝对值排序
    return Math.abs(a.value) -Math.abs(b.value)
}
function  sortdataOne(a,b) {//时间排序
    return Math.abs(a.value) -Math.abs(b.value)
}
// result.sort(sortId);
function UpToleranceLine(UpTolerance,DownTolerance,X){
    return Number(UpTolerance)-(Number(UpTolerance)-Number(DownTolerance))*(1-X)*0.5
}
function DownToleranceLine(UpTolerance,DownTolerance,X){
    return Number(DownTolerance)+(Number(UpTolerance)-Number(DownTolerance))*(1-X)*0.5
}
//整理趋势图数据参数
function setTrendMap(id,data,BigobjHelper,widthHelper2,heightHelper2){
    var el = document.getElementById(id);
    var lineChart = new D3LineChart1(el, {});
    var setData = []; //拼成图表所需的数据格式
    var totalNum=0;//数据和  用来求平均数
    var result=data.sample;//数据
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
    tolerance.sort(compare)//公差排序
    for(var i=0;i<tolerance.length-1;i++){//  循环生成 公差判断条件
        var item={}
        if(i==tolerance.length-1){
            item.Rule="startTime>="+new Date(Date.parse(tolerance[i-1].fvlBeginTime)).getTime()
            item.fvlBeginTime=tolerance[i].fvlBeginTime
            item.fvlHivalue=tolerance[i].fvlHivalue
            item.fvlLovalue=tolerance[i].fvlLovalue
        }else{
            if(new Date(Date.parse(tolerance[i+1].fvlBeginTime)).getTime()){
                item.Rule=new Date(Date.parse(tolerance[i].fvlBeginTime)).getTime()+"<=startTime<"+new Date(Date.parse(tolerance[i+1].fvlBeginTime)).getTime()

            }else{
                item.Rule=new Date(Date.parse(tolerance[i].fvlBeginTime)).getTime()+"<=startTime"
            }
            item.fvlBeginTime=tolerance[i].fvlBeginTime
            item.fvlHivalue=tolerance[i].fvlHivalue
            item.fvlLovalue=tolerance[i].fvlLovalue

        }
        toleranceRule.push(item)
    }


    for (var i = 0; i < result.length; i++) {//数据格式生成
        item = {};
        item.name = result[i].s_label
        item.value = result[i].pc
        item.color=firstDataStyle.dSBgColorInput1||"green"
        // item.symbol=firstDataStyle.DataTypeShowElement//||BigobjHelper.dataStyles.symbol
        item.symbol= typeof firstDataStyle.DataTypeShowElement !== 'undefined'?firstDataStyle.DataTypeShowElement:6;
        setData.push(item)//数据生成

        var startTime= new Date(Date.parse(result[i].s_createdatetime)).getTime();
        if(startTime < Number(toleranceRule[0].Rule.split("<")[0].replace("=",""))){
            setData[i].fvlLovalue = Number(tolerance[tolerance.length-1].fvlLovalue)//数据下公差
            setData[i].fvlHivalue = Number(tolerance[tolerance.length-1].fvlHivalue)//数据上公差
        }else if(startTime >= Number(toleranceRule[toleranceRule.length-1].Rule.split("<")[0].replace("=",""))){
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
                    result.sort(sortId).reverse();
                    setData.sort(sortdata).reverse();
                }else if(BigobjHelper.miscRadio2){
                    result.sort(sortId)
                    setData.sort(sortdata)
                }
                for (var i = 0; i < result.length; i++) {
                    result[i].pc=Math.abs(result[i].pc)
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
                    var tolerance1 = data.featvarLimits;//公差
                    for(var z=0;z<tolerance1.length;z++){
                        tolerance1[z].fvlHivalue=UpToleranceLine(tolerance1[z].fvlHivalue,tolerance1[z].fvlLovalue,Number(BigobjHelper.instructionLines[j].RangeNumber))
                        tolerance1[z].fvlLovalue=DownToleranceLine(tolerance1[z].fvlHivalue,tolerance1[z].fvlLovalue,Number(BigobjHelper.instructionLines[j].RangeNumber))
                    }
                    for(var i=0;i<result.length;i++){
                        var startTime= new Date(Date.parse(result[i].s_createdatetime)).getTime();
                        if(startTime < Number(toleranceRule[0].Rule.split("<")[0].replace("=",""))){
                            var timeItem={};
                            var timeItemLow={};
                            timeItem.x= result[i].s_label
                            timeItem.y= tolerance1[tolerance1.length-1].fvlHivalue
                            timeItemLow.x=result[i].s_label
                            timeItemLow.y = Number(tolerance1[tolerance1.length-1].fvlLovalue)
                            dataIdentificationLine.push(timeItem)
                            dataIdentificationLineLow.push(timeItemLow)
                        }else if(startTime >= Number(toleranceRule[toleranceRule.length-1].Rule.split("<")[0].replace("=",""))){
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
                            for(var k=0;k<tolerance.length;k++){
                                if(Number(tolerance[k].fvlHivalue)==Number(dataIdentificationLine[n].y)){
                                    dataIdentificationLine[n].y=Number(tolerance[k].fvlHivalue)-(Number(tolerance[k].fvlHivalue)-Number(tolerance[k].fvlLovalue)) *(1-Number(BigobjHelper.instructionLines[j].RangeNumber))*0.5
                                }
                            }



                            toleranceStyleOne.color=BigobjHelper.instructionLines[j].BackgroundColor
                            toleranceStyleOne.lineWidth=BigobjHelper.instructionLines[j].WidthNumber
                            toleranceStyleOne.lineStyle=BigobjHelper.instructionLines[j].publicSelectInput
                            for(var k=0;k<tolerance.length;k++){
                                if(Number(tolerance[k].fvlHivalue)==Number(dataIdentificationLine[n].y)){
                                    dataIdentificationLineLow[n].y= Number(tolerance[k].fvlLovalue)+(Number(tolerance[k].fvlHivalue)-Number(tolerance[k].fvlLovalue)) *(1-Number(BigobjHelper.instructionLines[j].RangeNumber))*0.5
                                }
                            }


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
                if(BigobjHelper.dataStyles[j].dSStyleSel1!=null &&BigobjHelper.dataStyles[j].dSStyleSel1!=0 && BigobjHelper.dataStyles[j].dSYValueSel1!=0&&BigobjHelper.dataStyles[j].dSYValueSel1!=null){//符号和变量 都不==0
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
                                item.rule= ">"+"=="+getNullableAndUndefinable(BigobjHelper.dataStyles[j].SymbolicOperation1)
                                    +BigobjHelper.dataStyles[j].dSRangeNumber1
                                item.ruleName1= BigobjHelper.dataStyles[j].dSStyleSel1
                                item.ruleColor= BigobjHelper.dataStyles[j].DSBgColor
                                item.ruleTransparency= BigobjHelper.dataStyles[j].dSTransparency1
                                item.DataTypeShow=BigobjHelper.dataStyles[j].DataTypeShow
                            }else{
                                item.rule= "<"+"=="+getNullableAndUndefinable(BigobjHelper.dataStyles[j].SymbolicOperation1)
                                    +BigobjHelper.dataStyles[j].dSRangeNumber1
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
                if(BigobjHelper.dataStyles[j].dSStyleSel2!=null &&BigobjHelper.dataStyles[j].dSStyleSel2!=0 && BigobjHelper.dataStyles[j].dSYValueSel2!=0&& BigobjHelper.dataStyles[j].dSYValueSel2!=null){//符号和变量 都不==0
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
                                //item.ruleOne= ">"+"=="+getNullableAndUndefinable(BigobjHelper.dataStyles[j].SymbolicOperation2)
                                //+BigobjHelper.dataStyles[j].dSRangeNumber2
                                item.ruleOne= ">"+"="+getNullableAndUndefinable(BigobjHelper.dataStyles[j].SymbolicOperation2)
                                    +BigobjHelper.dataStyles[j].dSRangeNumber2
                                item.ruleName2= BigobjHelper.dataStyles[j].dSStyleSel2
                                item.ruleColor= BigobjHelper.dataStyles[j].DSBgColor
                                item.ruleTransparency= BigobjHelper.dataStyles[j].dSTransparency1
                                item.DataTypeShow=BigobjHelper.dataStyles[j].DataTypeShow
                            }else{
                                //item.ruleOne= "<"+"=="+getNullableAndUndefinable(BigobjHelper.dataStyles[j].SymbolicOperation2)
                                //+BigobjHelper.dataStyles[j].dSRangeNumber2
                                item.ruleOne= "<"+"="+getNullableAndUndefinable(BigobjHelper.dataStyles[j].SymbolicOperation2)
                                    +BigobjHelper.dataStyles[j].dSRangeNumber2
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
                if(eval(setData[i].value + dataStyleRule[j].rule) && eval(setData[i].value + dataStyleRule[j].ruleOne)){
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

//整理直方图数据
function setHistogram(ids, widthHelper, heightHelper,BigobjHelper){
    removeClassTable()
    handsonTableActiveAjaxCalls++;
//moveChartsFromAltToAltHolder
//moveParetoChartsFromAltToAltHolder, my4.js
    var result;
    $.ajax({
        url: "/static/js/projectJs/data2.json",
        type: "get",
        dataType: "JSON",
        success: function(msg) {
            result = msg.points[0];
            var options = {
                data: [{
                    x: -1.5,
                    y: 1
                }, {
                    x: -1,
                    y: 1.7
                }, {
                    x: 0,
                    y: 5
                }, {
                    x: 1,
                    y: 1.7
                }, {
                    x: 1.5,
                    y: 1
                }], //6sigma线数据
                id: "#"+ids,
                BarColor:"yellow",//柱子颜色
                publicSelectInput:"real",//主子边框样式
                dSWidth:1,//边框宽度
                BorderColor:"green",//边框颜色
                sigamaColor: "#000000",//6sigma线颜色
                sigamaWidth:1,//6sigma线宽度
                SigmaBorderStyle:"real",//6sigma线  实现
                min: -6, //X轴最小值
                max: 6, //X轴最大值
                SvgWidth: widthHelper, //图表宽度
                SvgHeight: heightHelper, //图表高度
                tickNum: 12, //X轴分12份
                Identification: [],//标识线
                values: [], //柱子数据
                xAxisData:[]
            }
            result.sample.sort(sortIdNormal)
            //最大值  最小值计算
            if(result.sample[0].pc<(result.command.standardDeviation-result.command.sigma*3)){
                options.min=result.sample[0].pc-0.5
            }else if(result.sample[0].pc>(result.command.standardDeviation-result.command.sigma*3)){
                options.min=result.command.standardDeviation-result.command.sigma*3-0.5
            }else{
                options.min=result.sample[0].pc-0.5
            }
            if(result.sample[result.sample.length-1].pc<(result.command.standardDeviation+result.command.sigma*3)){
                options.max=result.command.standardDeviation+result.command.sigma*3+0.5
            }else if(result.sample[result.sample.length-1].pc>(result.command.standardDeviation+result.command.sigma*3)){
                options.max=result.sample[result.sample.length-1].pc +0.5
            }else{
                options.max=result.sample[result.sample.length-1].pc +0.5
            }
            // 循环取出数据
            for(var i=0;i<result.sample.length;i++){
                options.values.push(result.sample[i].pc)
            }
            //设置属性
            if(BigobjHelper&& typeof BigobjHelper != 'string'){
                for(var i=0;i<BigobjHelper.instructionLines.length;i++){
                    if(Number(BigobjHelper.instructionLines[i].iLSelParam1)!=0){
                        var name="",item={};
                        if(Number(BigobjHelper.instructionLines[i].iLSelParam1)==1){
                            name="上偏差"
                            if(result.command.UpperDeviation){
                                item={ //标识线数据格式
                                    name:name,
                                    color: BigobjHelper.instructionLines[i].ColorNum !=undefined?BigobjHelper.instructionLines[i].ColorNum:"blue" ,
                                    value: result.command.UpperDeviation,
                                    lineWidth:BigobjHelper.instructionLines[i].iLWidthInput1 !=undefined?BigobjHelper.instructionLines[i].iLWidthInput1:1,
                                    lineStyle: BigobjHelper.instructionLines[i].publicSelectInput !=undefined?BigobjHelper.instructionLines[i].publicSelectInput:"real" //实线
                                }
                                options.Identification.push(item)
                            }
                        }else if(Number(BigobjHelper.instructionLines[i].iLSelParam1)==2){
                            name="下偏差"
                            if(result.command.LowerDeviation){
                                item={ //标识线数据格式
                                    name:name,
                                    color: BigobjHelper.instructionLines[i].ColorNum !=undefined?BigobjHelper.instructionLines[i].ColorNum:"blue" ,
                                    value: result.command.LowerDeviation,
                                    lineWidth:BigobjHelper.instructionLines[i].iLWidthInput1 !=undefined?BigobjHelper.instructionLines[i].iLWidthInput1:1,
                                    lineStyle: BigobjHelper.instructionLines[i].publicSelectInput !=undefined?BigobjHelper.instructionLines[i].publicSelectInput:"real" //实线
                                }
                                options.Identification.push(item)
                            }
                        }else if(Number(BigobjHelper.instructionLines[i].iLSelParam1)==3){
                            name="均值"
                            if(result.command.standardDeviation){
                                item={ //标识线数据格式
                                    name:name,
                                    color: BigobjHelper.instructionLines[i].ColorNum !=undefined?BigobjHelper.instructionLines[i].ColorNum:"blue" ,
                                    value: result.command.standardDeviation,
                                    lineWidth:BigobjHelper.instructionLines[i].iLWidthInput1 !=undefined?BigobjHelper.instructionLines[i].iLWidthInput1:1,
                                    lineStyle: BigobjHelper.instructionLines[i].publicSelectInput !=undefined?BigobjHelper.instructionLines[i].publicSelectInput:"real" //实线
                                }
                                options.Identification.push(item)
                            }
                        }else if(Number(BigobjHelper.instructionLines[i].iLSelParam1)==4){
                            name="零线"
                            if(result.command.ZeroLine==0){
                                item={ //标识线数据格式
                                    name:name,
                                    color: BigobjHelper.instructionLines[i].ColorNum !=undefined?BigobjHelper.instructionLines[i].ColorNum:"blue" ,
                                    value: result.command.ZeroLine,
                                    lineWidth:BigobjHelper.instructionLines[i].iLWidthInput1 !=undefined?BigobjHelper.instructionLines[i].iLWidthInput1:1,
                                    lineStyle: BigobjHelper.instructionLines[i].publicSelectInput !=undefined?BigobjHelper.instructionLines[i].publicSelectInput:"real" //实线
                                }
                                options.Identification.push(item)
                            }
                        }else if(Number(BigobjHelper.instructionLines[i].iLSelParam1==5)){
                            console.log("sigma线")
                        }
                    }

                }
                if(BigobjHelper.dataStyles[0].dSCb1){//柱子颜色设置
                    options.BarColor= BigobjHelper.dataStyles[0].DSBgColor
                }
                if(BigobjHelper.dataStyles[0].dSCb2){//柱子边框设置
                    options.BorderColor= BigobjHelper.dataStyles[0].BorderColor
                    options.dSWidth= BigobjHelper.dataStyles[0].dSWidth
                }
                options.publicSelectInput= BigobjHelper.dataStyles[0].publicSelectInput
                if(BigobjHelper.sigama=="on"){
                    if(BigobjHelper.sigamaChecked){
                        options.sigamaColor= BigobjHelper.sigamaColor
                        options.sigamaWidth= Number(BigobjHelper.sigamaWidth)
                        options.SigmaBorderStyle = BigobjHelper.SigmaBorderStyle
                    }
                }
            }
            histogram(options)
            for (var i in handsonTableHelperObjHistograms) {
                if (handsonTableHelperObjHistograms[i] === ids) {
                    var rowAndColArr = i.split(',');
                    if (document.getElementById(ids) != null) {
                        var tempHandsonTableOptions = handsonTable.getSettings();
                        tempHandsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = document.getElementById(ids).outerHTML;
                        handsonTable.updateSettings(tempHandsonTableOptions);
                        break;
                    }
                }
            }
            if (--handsonTableActiveAjaxCalls === 0) {
                setTimeout(function() {
                    moveChartsFromAltToAltHolder();
                }, 300)
            }
        },
        error: function() {
            --handsonTableActiveAjaxCalls;
            alert("æ��äº¤å¤±è´¥ï¼�");
        },
        complete: function() {

        }
    });

}

//整理控制图数据
function setControlChart(id, row, col, width, height,BigobjHelper,Result,loadEventHandler){

    var AMap=[],BMap=[],ADataMap=[],BDataMap=[],categories=[];
    var activity = {
        "id":id,
        "Letter":['a', 'b', 'c', 'd',"f",'g', 'h', 'i', 'j',"k",'l', 'm', 'n', 'o',"p",'q', 'r', 's', 't',"u", 'v', 'w', 'q',"y","z"],
        "xMarks": ['a', 'b', 'c', 'd',"f",'g', 'h', 'i', 'j',"k",'l', 'm', 'n', 'o',"p",'q', 'r', 's', 't',"u"],
        "xData": ['a', 'b', 'c', 'd',"f",'g', 'h', 'i', 'j',"k",'l', 'm', 'n', 'o',"p",'q', 'r', 's', 't',"u", 'v', 'w', 'q',"y","z"],
        "height":height,
        "symbol":[{symbol:2,color:"red"},{symbol:5,color:"blue"}],
        "categories": ['a', 'b', 'c', 'd','e',"f",'g', 'h', 'i', 'j',"k",'l', 'm', 'n', 'o',"p",'q', 'r', 's', 't'],
        "width":width,
        "dataset": [],
        "datasets": [{
            "name": "A图",
            "data": [12, 123, 153, 180,12,13,15,16,17,18,19,120,123,124,23,24,252,62,25,78],
            "unit": "",
            "type": "line",
            "valueDecimals": 1,
            "color": "red",
            "lineWidth": 1,
            "lineColor": "red",
            "symbol": "square"
        }, {
            "name": "B图",
            "data": [12, 123, 153, 180,12,13,15,16,17,18,19,120,123,124,23,24,252,62,25,78],
            "unit": "",
            "type": "line",
            "valueDecimals": 0,
            "color": "blue",
            "lineWidth": 1,
            "lineColor": "blue",
            "symbol": "triangle"
        }],
        "yAxis":[
            {
                lineWidth:1,
                gridLineWidth:0,
                lineColor:"#ccd6eb",
                tickWidth:1,
                title: {
                    text: null
                },
                // plotLines:activity.Identification[i]
            },
            {
                lineWidth:1,
                gridLineWidth:0,
                lineColor:"#ccd6eb",
                tickWidth:1,
                title: {
                    text: null
                },
                // plotLines:activity.Identification[i]
            }
        ],
        "Identification": [],
    }
    for(var i=0;i<3;i++){
        var Letter=activity.Letter[i]
        for(var j=0;j<activity.Letter.length;j++){
            activity.xData.push(Letter+activity.Letter[j])
        }
    }


    if(Number($(".ControlChart").find(".ControlChartType").val())==1 ||BigobjHelper.ControlChartType==1){//数据计算  X-MR
        // objHelper.controlXaxisStyle = $(".ControlChart select[name='controlXaxisStyle']").val();//X轴样式
        // objHelper.controlXaxis = $(".ControlChart select[name='controlXaxis']").val();//标签设置
        for(var i=0;i<Result.points[0].sample.length;i++) {
                ADataMap.push(Result.points[0].sample[i].pc)//A图数据
                if (i == 0) {//B图数据
                    var number = 0;
                    BDataMap.push(number)
                    BDataMap.push(Number(Math.abs(Result.points[0].sample[i + 1].pc - Result.points[0].sample[i].pc).toFixed(2)))
                } else {
                    if (i != Result.points[0].sample.length - 1) {
                        BDataMap.push(Number(Math.abs(Result.points[0].sample[i + 1].pc - Result.points[0].sample[i].pc).toFixed(2)))
                    }
                }
                if (Number($(".ControlChart").find(".controlXaxisStyle").val()) == 1||BigobjHelper.controlXaxisStyle) {//X轴样式   自定义
                    if (Number($(".ControlChart").find(".controlXaxis").val()) == 4||BigobjHelper.controlXaxis==4) {//标签设置  数字序列
                        categories.push(i + 1)
                    } else if (Number($(".ControlChart").find(".controlXaxis").val()) == 5||BigobjHelper.controlXaxis==5) {//字母序列
                        categories.push(activity.xData[i])
                    }
                }
            }
        }else if(Number($(".ControlChart").find(".ControlChartType").val())==2||BigobjHelper.ControlChartType==2){//数据计算  MA-MR
            for(var i=0;i<Result.points[0].sample.length;i++){
                if (i == 0) {//A B图数据
                    ADataMap.push(Number((Result.points[0].sample[i + 1].pc - Result.points[0].sample[i].pc).toFixed(2))/2)
                    BDataMap.push(Number(Math.abs(Result.points[0].sample[i + 1].pc - Result.points[0].sample[i].pc).toFixed(2)))
                } else {
                    if (i != Result.points[0].sample.length - 1) {
                        ADataMap.push(Number((Result.points[0].sample[i + 1].pc - Result.points[0].sample[i].pc).toFixed(2))/2)
                        BDataMap.push(Number(Math.abs(Result.points[0].sample[i + 1].pc - Result.points[0].sample[i].pc).toFixed(2)))
                    }
                }
            }
            for(var i=0;i<ADataMap.length;i++){
                if (Number($(".ControlChart").find(".controlXaxisStyle").val()) == 1||BigobjHelper.controlXaxisStyle==1) {//X轴样式   自定义
                    if (Number($(".ControlChart").find(".controlXaxis").val()) == 4||BigobjHelper.controlXaxisStyle==4) {//标签设置  数字序列
                        categories.push(i + 1)
                    } else if (Number($(".ControlChart").find(".controlXaxis").val()) == 5||BigobjHelper.controlXaxisStyle==5) {//字母序列
                        categories.push(activity.xData[i])
                    }
                }
            }
        }else if(Number($(".ControlChart").find(".ControlChartType").val())==3||BigobjHelper.ControlChartType==3){//数据计算  Xbar-R
            var Num;
            if(BigobjHelper.ControlGroupingCules){
                Num=BigobjHelper.ControlGroupingCules
            }else{
                Num=Number($(".ControlChart").find(".ControlGroupingCules").val())
            }
            for(var i=0;i<Result.points[0].sample.length;i++){
                activity.dataset.push(Result.points[0].sample[i])
            }
            var Group=group(activity.dataset,Num)
            for(var i=0;i<Group.length;i++){
                var totalNum=0;//每组总和
                for(var j=0;j<Group[i].length;j++){
                    totalNum+=Group[i][j].pc
                }
                ADataMap.push(Number((totalNum/Num).toFixed(2)))
                Group[i].sort(sortIdNormal)
                if(Group[i].length<Num){
                    BDataMap.push(Math.abs(Number((Group[i][Group[i].length-1].pc-Group[i][0].pc).toFixed(2))))
                }else{
                    BDataMap.push(Math.abs(Number((Group[i][Num-1].pc-Group[i][0].pc).toFixed(2))))
                }




            }
            for(var i=0;i<ADataMap.length;i++){
                if (Number($(".ControlChart").find(".controlXaxisStyle").val()) == 1||BigobjHelper.controlXaxisStyle==1) {//X轴样式   自定义
                    if (Number($(".ControlChart").find(".controlXaxis").val()) == 4||BigobjHelper.controlXaxisStyle==4) {//标签设置  数字序列
                        categories.push(i + 1)
                    } else if (Number($(".ControlChart").find(".controlXaxis").val()) == 5||BigobjHelper.controlXaxisStyle==5) {//字母序列
                        categories.push(activity.xData[i])
                    }
                }
            }

        }else if(Number($(".ControlChart").find(".ControlChartType").val())==4||BigobjHelper.ControlChartType==4){//数据计算  Xbar-S
            var Num;
            if(BigobjHelper.ControlGroupingCules){
                Num=BigobjHelper.ControlGroupingCules
            }else{
                Num=Number($(".ControlChart").find(".ControlGroupingCules").val())
            }
            for(var i=0;i<Result.points[0].sample.length;i++){
                activity.dataset.push(Result.points[0].sample[i])
            }
            var Group=group(activity.dataset,Num)
            for(var i=0;i<Group.length;i++){
                var totalNum=0;//每组总和
                for(var j=0;j<Group[i].length;j++){
                    totalNum+=Group[i][j].pc
                }
                ADataMap.push(Number((totalNum/Num).toFixed(2)))
                // Group[i].sort(sortIdNormal)
                // if(Group[i].length<Num){
                //     BDataMap.push(Math.abs(Number((Group[i][Group[i].length-1].pc-Group[i][0].pc).toFixed(2))))
                // }else{
                //     BDataMap.push(Math.abs(Number((Group[i][Num-1].pc-Group[i][0].pc).toFixed(2))))
                // }
            }
            for(var i=0;i<ADataMap.length;i++){
                if (Number($(".ControlChart").find(".controlXaxisStyle").val()) == 1||BigobjHelper.controlXaxisStyle==1) {//X轴样式   自定义
                    if (Number($(".ControlChart").find(".controlXaxis").val()) == 4||BigobjHelper.controlXaxisStyle==4) {//标签设置  数字序列
                        categories.push(i + 1)
                    } else if (Number($(".ControlChart").find(".controlXaxis").val()) == 5||BigobjHelper.controlXaxisStyle==5) {//字母序列
                        categories.push(activity.xData[i])
                    }
                }
            }
        }
        activity.datasets[0].data=ADataMap
        activity.datasets[1].data=BDataMap
        activity.categories=categories


    if(BigobjHelper&& typeof BigobjHelper != 'string'){
        //指示线
        for(var i=0;i<BigobjHelper.instructionLines.length;i++){
            if(Number(BigobjHelper.instructionLines[i].MapStyle)==1){//A图 判断是A图还是B图
                if(Number(BigobjHelper.instructionLines[i].IndicatorLineStyleChange)==1){//判断是区间还是参数
                    for(var j=0;j<2;j++){//区间有两条数据线
                        var Aitem={};
                        Aitem.color=BigobjHelper.instructionLines[i].BackgroundColor
                        if(BigobjHelper.instructionLines[i].BackgroundColor=="empty"){
                            Aitem.dashStyle="Dash"
                        }else{
                            Aitem.dashStyle="solid"
                        }
                        if(j==0){
                            Aitem.value =Number(BigobjHelper.instructionLines[i].iLInputFrom)
                        }else if(j==1){
                            Aitem.value =Number(BigobjHelper.instructionLines[i].iLInputTo)
                        }
                        Aitem.width=Number(BigobjHelper.instructionLines[i].WidthNumber)
                        AMap.push(Aitem)
                    }
                }else{
                    var Aitem={};
                    Aitem.color=BigobjHelper.instructionLines[i].BackgroundColor
                    if(BigobjHelper.instructionLines[i].BackgroundColor=="empty"){
                        Aitem.dashStyle="Dash"
                    }else{
                        Aitem.dashStyle="solid"
                    }
                    Aitem.width=Number(BigobjHelper.instructionLines[i].WidthNumber)
                    if(Number(BigobjHelper.instructionLines[i].iLSelParam3)==1){//均值
                        Aitem.value =300
                        // Aitem.value =Number(BigobjHelper.instructionLines[i].ParameterNum)
                    }else{
                        Aitem.value =0
                        // Aitem.value =Number(BigobjHelper.instructionLines[i].ParameterNum)
                    }

                    AMap.push(Aitem)
                }
            }else if(Number(BigobjHelper.instructionLines[i].MapStyle)==2){//B图
                var Aitem={};
                Aitem.color=BigobjHelper.instructionLines[i].BackgroundColor
                if(BigobjHelper.instructionLines[i].BackgroundColor=="empty"){
                    Aitem.dashStyle="Dash"
                }else{
                    Aitem.dashStyle="solid"
                }
                Aitem.width=Number(BigobjHelper.instructionLines[i].WidthNumber)
                Aitem.value =Number(BigobjHelper.instructionLines[i].ParameterNum)
                BMap.push(Aitem)
            }

        }
        activity.Identification.push(AMap)//指示线
        activity.Identification.push(BMap)//指示线
        //数据样式
        for(var i=0;i<BigobjHelper.dataStyles.length;i++){
            if(Number(BigobjHelper.dataStyles[i].DataMapStyle)==1){
                if(BigobjHelper.dataStyles[i].dSCb1){
                    activity.datasets[0].color=BigobjHelper.dataStyles[i].DSBgColor
                }
                if(BigobjHelper.dataStyles[i].dSCb2){
                    activity.datasets[0].lineColor=BigobjHelper.dataStyles[i].BorderColor
                    activity.datasets[0].lineWidth=Number(BigobjHelper.dataStyles[i].dSWidth)
                }
                activity.datasets[0].symbol=BigobjHelper.dataStyles[i].DataTypeShow
            }else{
                if(BigobjHelper.dataStyles[i].dSCb1){
                    activity.datasets[1].color=BigobjHelper.dataStyles[i].DSBgColor
                }
                if(BigobjHelper.dataStyles[i].dSCb2){
                    activity.datasets[1].lineColor=BigobjHelper.dataStyles[i].BorderColor
                    activity.datasets[1].lineWidth=Number(BigobjHelper.dataStyles[i].dSWidth)
                }
                activity.datasets[1].symbol=BigobjHelper.dataStyles[i].DataTypeShow
            }
        }



    }
    if(activity.Identification.length>0){
        for(var i=0;i<activity.Identification.length;i++){
            if(activity.Identification[i].length>0){
                activity.yAxis[i].plotLines=activity.Identification[i]
            }

        }
    }
    ControlChart(activity, loadEventHandler)
}

//整理帕雷图数据
function setPareToDiagram(ids, data, widthHelper, heightHelper, BigobjHelper, loadEventHandler){
    var id = ids,splineData= [],AMap=[],tolerance=data.points[0].featvarLimits;
    var ParetoDiagramSet={
        Letter:['a', 'b', 'c', 'd',"f",'g', 'h', 'i', 'j',"k",'l', 'm', 'n', 'o',"p",'q', 'r', 's', 't',"u", 'v', 'w', 'q',"y","z"],
        xData: ['a', 'b', 'c', 'd',"f",'g', 'h', 'i', 'j',"k",'l', 'm', 'n', 'o',"p",'q', 'r', 's', 't',"u", 'v', 'w', 'q',"y","z"],
        LineStyle:"",
        LineWidth:Number,
        LineDataTypeShow:"",
        LineColor:"",
        LineTransparency:"",
        BarBorderWidth:"",
        BarBorderColor:"",
        BarBgColor:"",
        BarBgTransparency:"",
        BarBorderDashStyle:"",
        categories:[],
        Xcategories:[],
        columnData:[],
        splineDataLabel:[],
        plotLines:[],
    }
    for(var i=0;i<3;i++){
        var Letter=ParetoDiagramSet.Letter[i]
        for(var j=0;j<ParetoDiagramSet.Letter.length;j++){
            ParetoDiagramSet.xData.push(Letter+ParetoDiagramSet.Letter[j])
        }
    }
    for(var i=0;i<data.points[0].sample.length;i++){//数据
        var item={};
            item.name=data.points[0].sample[i].s_label;
            item.num=Math.abs(data.points[0].sample[i].pc);

            if(BigobjHelper&&typeof  BigobjHelper!=String){

                if(BigobjHelper.ProportionLine=="on"){
                    // 线条样式
                    ParetoDiagramSet.LineStyle =BigobjHelper.publicSelectInput;
                    ParetoDiagramSet.LineWidth=BigobjHelper.ProportionLineWidth;
                    ParetoDiagramSet.LineDataTypeShow=BigobjHelper.DataTypeShow;
                    ParetoDiagramSet.LineColor=BigobjHelper.LineColor;
                    ParetoDiagramSet.LineTransparency=BigobjHelper.LineTransparency;
                }else{
                    // 线条样式
                    ParetoDiagramSet.LineStyle ="Solid";
                    ParetoDiagramSet.LineWidth=0;
                    ParetoDiagramSet.LineDataTypeShow="circle";
                    ParetoDiagramSet.LineColor="transparent";
                    ParetoDiagramSet.LineTransparency=100
                }

                // 柱子样式
                if (BigobjHelper.dataStyles.length > 0) {
                    ParetoDiagramSet.BarBorderWidth=BigobjHelper.dataStyles[0].ProportionLineWidth ;
                    ParetoDiagramSet.BarBorderColor=BigobjHelper.dataStyles[0].BorderColor;
                    ParetoDiagramSet.BarBgColor=BigobjHelper.dataStyles[0].DSBgColor;
                    ParetoDiagramSet.BarBgTransparency=BigobjHelper.dataStyles[0].dSBgColorTransparency1;
                    ParetoDiagramSet.BarBorderDashStyle=BigobjHelper.dataStyles[0].publicSelectInput;
                }

                item.symbol=BigobjHelper.DataTypeShow;
                item.color=BigobjHelper.LineColor;
            }else{
                item.symbol="circle";
                item.color="green";


                // 柱子样式
                ParetoDiagramSet.BarBorderWidth=1;
                ParetoDiagramSet.BarBorderColor="blue";
                ParetoDiagramSet.BarBgColor="blue";
                ParetoDiagramSet.BarBgTransparency=100;
                ParetoDiagramSet.BarBorderDashStyle="Solid";
                    // 线条样式
                    ParetoDiagramSet.LineStyle ="Solid";
                    ParetoDiagramSet.LineWidth=0;
                    ParetoDiagramSet.LineDataTypeShow="circle";
                    ParetoDiagramSet.LineColor="transparent";
                    ParetoDiagramSet.LineTransparency=100
            }
        splineData.push(item)
    }

    splineData.sort(sortId1);
    var totalNum=0;
    for(var i=0;i<splineData.length;i++){
        totalNum+=splineData[i].num
    }
    var PercentageNum=0;
    for(var i=0;i<splineData.length;i++){
        // splineData[i-1].num/totalNum
        var y=0;
        if(i==0){
            PercentageNum=splineData[i].num
            y=(PercentageNum/totalNum).toFixed(2)
        }else{
            PercentageNum+=splineData[i].num
            y=(PercentageNum/totalNum).toFixed(2)
            // (this.y/totalNum * 100).toFixed(2)
        }
        var item={
            name: splineData[i].name,
            color: ParetoDiagramSet.LineColor,
            marker: {
                symbol: ParetoDiagramSet.LineDataTypeShow,
                lineColor: ParetoDiagramSet.LineColor,
                lineWidth: 1,
                states:{
                    hover:{
                        enabled:false
                    },
                    select: {
                        nabled:false
                    }
                }
            },
            y: y*100
        }
        // if(BigobjHelper&&typeof  BigobjHelper!=String){
        //     if(BigobjHelper.ProportionLine){
        //
        //     }
        // }
        ParetoDiagramSet.categories.push(splineData[i].name)//Xaxis
        ParetoDiagramSet.columnData.push(splineData[i].num)//Bar 数据
        ParetoDiagramSet.splineDataLabel.push(item)//tyLine  数据
    }
    if(BigobjHelper&& typeof BigobjHelper != 'string'){
        for(var i=0;i<BigobjHelper.instructionLines.length;i++){
            //指示线
            if(Number(BigobjHelper.instructionLines[i].IndicatorLineStyleChange)==1){//判断是区间还是参数
                for(var j=0;j<2;j++){//区间有两条数据线
                    var Aitem={};
                    Aitem.color=BigobjHelper.instructionLines[i].BackgroundColor
                    Aitem.dashStyle=BigobjHelper.instructionLines[i].publicSelectInput
                    if(j==0){
                        Aitem.value =Number(BigobjHelper.instructionLines[i].iLInputFrom)
                    }else if(j==1){
                        Aitem.value =Number(BigobjHelper.instructionLines[i].iLInputTo)
                    }
                    Aitem.width=Number(BigobjHelper.instructionLines[i].WidthNumber)
                    ParetoDiagramSet.plotLines.push(Aitem)
                }
            }else{
                tolerance.sort(compare)
                if(Number(BigobjHelper.instructionLines[i].iLSelParam1)==1){//公差
                    for(var m=0;m<2;m++){
                        var Aitem={};
                        Aitem.color=BigobjHelper.instructionLines[i].BackgroundColor
                        Aitem.dashStyle=BigobjHelper.instructionLines[i].publicSelectInput
                        Aitem.width=Number(BigobjHelper.instructionLines[i].WidthNumber)
                        var fvlHivalue =tolerance[tolerance.length-1].fvlHivalue
                        var fvlLovalue = tolerance[tolerance.length-1].fvlLovalue
                        if(m==0){
                            Aitem.value = fvlHivalue-(fvlHivalue-fvlLovalue)*(1-BigobjHelper.instructionLines[i].RangeNumber)*0.5
                        }else if(m==1){
                            Aitem.value = fvlLovalue+(fvlHivalue-fvlLovalue)*(1-BigobjHelper.instructionLines[i].RangeNumber)*0.5
                        }
                        ParetoDiagramSet.plotLines.push(Aitem)
                    }

                }else{//均值
                    Aitem.value =0
                    // Aitem.value =Numb
                    //
                    // er(BigobjHelper.instructionLines[i].ParameterNum)
                }

            }
        }
    }
    // if()
    for(var i=0;i<ParetoDiagramSet.columnData.length;i++){
        if (typeof BigobjHelper !== 'undefined' && BigobjHelper && (Number($(".ParetoChart").find(".controlXaxisStyle").val()) == 1||BigobjHelper.controlXaxisStyle==1)) {//X轴样式   自定义
            if (Number($(".ParetoChart").find(".controlXaxis").val()) == 4||BigobjHelper.controlXaxisStyle==4) {//标签设置  数字序列
                ParetoDiagramSet.Xcategories.push(i + 1)
            } else if (Number($(".ParetoChart").find(".controlXaxis").val()) == 5||BigobjHelper.controlXaxisStyle==5) {//字母序列
                ParetoDiagramSet.Xcategories.push(ParetoDiagramSet.xData[i])
            }
        } else {
            ParetoDiagramSet.Xcategories.push(ParetoDiagramSet.xData[i])
        }
    }

    ParetoDiagramSet.categories=ParetoDiagramSet.Xcategories
    ParetoDiagram(id, ParetoDiagramSet, totalNum, loadEventHandler)
}

//整理箱线图数据
function setBoxDiagram(ids,data, rowAndColArr, rowAndColArr, widthHelper, heightHelper,BigobjHelper){
    var id=ids,tolerance=data.points[0].featvarLimits,DataList=[],result=data.points[0].sample;
    var BoxDiagramData={
        Letter:['a', 'b', 'c', 'd',"f",'g', 'h', 'i', 'j',"k",'l', 'm', 'n', 'o',"p",'q', 'r', 's', 't',"u", 'v', 'w', 'q',"y","z"],
        data:[
            // [100, 200, 248, 295, 509],
        ],
        color:"blue",
        fillColor:"#fff",
        categories:[],
        lineWidth:1,
        plotBackgroundColor:"#fff",
        stemDashStyle:"empty",
        abnormal:{
            abnormalData:[ // x, y positions where 0 is the first category  异常数据

            ],
            abnormalName:"异常值",
            abnormalColor:"red"
        },
        plotLines:[]
    }
    if(BigobjHelper&& typeof BigobjHelper != 'string'){
        for(var i=0;i<BigobjHelper.instructionLines.length;i++){
            //指示线
            if(Number(BigobjHelper.instructionLines[i].IndicatorLineStyleChange)==1){//判断是区间还是参数
                for(var j=0;j<2;j++){//区间有两条数据线
                    var Aitem={
                            value: 0,
                            color: 'red',
                            width: 1,
                            dashStyle:"Solid",//实线
                            label: {
                                text: '下公差',
                                align: 'right',
                                style: {
                                color: 'blue'
                                }
                            }
                        }
                    Aitem.color=BigobjHelper.instructionLines[i].BackgroundColor
                    Aitem.dashStyle=BigobjHelper.instructionLines[i].publicSelectInput
                    if(j==0){
                        Aitem.value =Number(BigobjHelper.instructionLines[i].iLInputFrom)
                    }else if(j==1){
                        Aitem.value =Number(BigobjHelper.instructionLines[i].iLInputTo)
                    }
                    Aitem.width=Number(BigobjHelper.instructionLines[i].WidthNumber)
                    BoxDiagramData.plotLines.push(Aitem)
                }
            }else{
                tolerance.sort(compare)
                if(Number(BigobjHelper.instructionLines[i].iLSelParam1)==1){//公差
                    for(var j=0;j<2;j++){
                        var Aitem={
                            value: 1,
                            color: 'red',
                            width: 1,
                            dashStyle:"Solid",//实线
                            label: {
                                text: '下公差',
                                align: 'right',
                                style: {
                                    color: 'blue'
                                }
                            }
                        }
                        Aitem.color=BigobjHelper.instructionLines[i].BackgroundColor
                        Aitem.dashStyle=BigobjHelper.instructionLines[i].publicSelectInput
                        if(j==0){
                            Aitem.value = Number(tolerance[tolerance.length-1].fvlHivalue)*BigobjHelper.instructionLines[i].RangeNumber
                        }else if(j==1){
                            Aitem.value = Number(tolerance[tolerance.length-1].fvlLovalue)*BigobjHelper.instructionLines[i].RangeNumber
                        }
                        Aitem.width=Number(BigobjHelper.instructionLines[i].WidthNumber)


                        BoxDiagramData.plotLines.push(Aitem)
                    }

                }else{//均值
                    Aitem.value =0
                    // Aitem.value =Numb
                    //
                    // er(BigobjHelper.instructionLines[i].ParameterNum)
                }

            }
        }
        //数据样式
        for(var i=0;i<BigobjHelper.dataStyles.length;i++){
                if(BigobjHelper.dataStyles[i].dSCb1){
                    BoxDiagramData.fillColor=BigobjHelper.dataStyles[i].DSBgColor
                }
                if(BigobjHelper.dataStyles[i].dSCb2){
                    BoxDiagramData.color=BigobjHelper.dataStyles[i].BorderColor
                    BoxDiagramData.lineWidth=Number(BigobjHelper.dataStyles[i].dSWidth)
                    if(BigobjHelper.dataStyles[i].publicSelectInput=="empty"){
                        BoxDiagramData.stemDashStyle = "dot"
                    }else{
                        BoxDiagramData.stemDashStyle = "Solid"
                    }

                }
        }

    }

    //数据计算
    result.sort(sortIdNormal)
    var Qi = (result.length+1)/4
    var Q1 = result[Math.floor(Qi)-1].pc*0.25+result[Math.ceil(Qi)-1].pc*0.75
    var median = result[Math.floor(Qi*2)-1].pc*0.5+result[Math.ceil(Qi*2)-1].pc*0.5
    var Q3 = result[Math.floor(Qi*3)-1].pc*0.75+result[Math.ceil(Qi*3)-1].pc*0.25
    var IQR = Q3-Q1
    var max = Q3 + 1.5*IQR
    var min = Q1 - 1.5*IQR
    DataList.push(min)
    DataList.push(Q1)
    DataList.push(median)
    DataList.push(Q3)
    DataList.push(max)
    BoxDiagramData.data.push(DataList)
    for(var i=0;i<result.length;i++){
        var abnormalData=[];
            if(result[i].pc<min||result[i].pc>max){
                abnormalData.push(0,result[i].pc)
                BoxDiagramData.abnormal.abnormalData.push(abnormalData)
            }

    }
    //设置X轴
    // for(var i=0;i<BoxDiagramData.data.length;i++){//X轴样式
    //     if (typeof BigobjHelper !== 'undefined' && BigobjHelper && (Number($(".BoxLineChart").find(".BoxLineXaxisStyle").val()) == 1||BigobjHelper.BoxLineXaxisStyle==1)) {//X轴样式   自定义
    //         if (Number($(".BoxLineChart").find(".BoxLineXaxis").val()) == 4||BigobjHelper.BoxLineXaxis==4) {//标签设置  数字序列
    //             BoxDiagramData.categories.push(i + 1)
    //         } else if (Number($(".BoxLineChart").find(".BoxLineXaxis").val()) == 5||BigobjHelper.BoxLineXaxis==5) {//字母序列
    //             BoxDiagramData.categories.push(BoxDiagramData.Letter[i])
    //         }
    //     } else {
    //         BoxDiagramData.categories.push(i + 1)
    //     }
    // }
    // try {
        BoxDiagram(id, BoxDiagramData)
    // } catch (err) {
    //
    // }
}

//整理饼图数据
function setPieChart(ids,data, rowAndColArr, rowAndColArr, widthHelper, heightHelper,BigobjHelper){
    var id=ids,PieChartSet={
        Data:[{
            name: 'Chrome',
            y: 61.41,
            sliced: true,
            selected: true
        }, {
            name: 'Internet Explorer',
            y: 11.84
        }, {
            name: 'Firefox',
            y: 10.85
        }, {
            name: 'Edge',
            y: 4.67
        }, {
            name: 'Safari',
            y: 4.18
        }],
        colors:["red","yellow","green","#000","blue"]
    }
    PieChart(id,PieChartSet)
}

//整理6Sigma图数据
function setSigmaChart(ids,data, rowAndColArr, rowAndColArr, widthHelper, heightHelper,BigobjHelper){
    var id="#"+ids,plotLines=[],dataArray=[],SetPlotLines=[],SetDataArray=[],width=widthHelper,height=heightHelper;
    var tolerance=data.points[0].featvarLimits,result=data.points[0].sample;
    // var
    var BoxStyle={
        BackgroundColor:"#8080FF",
        BorderWidth:1,
        borderColor:"#443785",
        dashStyle:"real",
    }
    PlotLinesStyle={
        BackgroundColor:"#8080FF",
        BorderWidth:1,
        borderColor:"#443785",
        dashStyle:"real",
     }
    //指示线
    plotLines.push(data.points[0].command.UpperDeviation)
    plotLines.push(data.points[0].command.LowerDeviation)
    //数据
    dataArray.push(3*data.points[0].command.sigma,-3*data.points[0].command.sigma)
    if(BigobjHelper&& typeof BigobjHelper != 'string'){
        //指示线
        for(var i=0;i<BigobjHelper.instructionLines.length;i++){
            //指示线
            if(Number(BigobjHelper.instructionLines[i].IndicatorLineStyleChange)==1){//判断是区间还是参数
                for(var j=0;j<2;j++){//区间有两条数据线
                    PlotLinesStyle.BackgroundColor=BigobjHelper.instructionLines[i].BackgroundColor
                    PlotLinesStyle.dashStyle=BigobjHelper.instructionLines[i].publicSelectInput
                    if(j==0){
                        SetPlotLines.push(Number(BigobjHelper.instructionLines[i].iLInputFrom))
                    }else if(j==1){
                        SetPlotLines.push(Number(BigobjHelper.instructionLines[i].iLInputTo))
                    }
                    PlotLinesStyle.BorderWidth=Number(BigobjHelper.instructionLines[i].WidthNumber)
                }
                plotLines=SetPlotLines
            }else{
                tolerance.sort(compare)
                if(Number(BigobjHelper.instructionLines[i].iLSelParam1)==1){//公差
                    for(var j=0;j<2;j++){
                        PlotLinesStyle.BackgroundColor=BigobjHelper.instructionLines[i].BackgroundColor
                        PlotLinesStyle.dashStyle=BigobjHelper.instructionLines[i].publicSelectInput
                        if(j==0){
                            SetPlotLines.push(Number(tolerance[tolerance.length-1].fvlHivalue)*BigobjHelper.instructionLines[i].RangeNumber)
                        }else if(j==1){
                            SetPlotLines.push(Number(tolerance[tolerance.length-1].fvlLovalue)*BigobjHelper.instructionLines[i].RangeNumber)
                        }
                        PlotLinesStyle.BorderWidth=Number(BigobjHelper.instructionLines[i].WidthNumber)
                    }
                    plotLines=SetPlotLines
                }else{//均值
                    Aitem.value =0
                    // Aitem.value =Numb
                    //
                    // er(BigobjHelper.instructionLines[i].ParameterNum)
                }

            }
        }
        //数据样式
        for(var i=0;i<BigobjHelper.dataStyles.length;i++){
            if(BigobjHelper.dataStyles[i].dSCb1){
                BoxStyle.BackgroundColor=BigobjHelper.dataStyles[i].DSBgColor
            }
            if(BigobjHelper.dataStyles[i].dSCb2){
                BoxStyle.borderColor=BigobjHelper.dataStyles[i].BorderColor
                BoxStyle.BorderWidth=Number(BigobjHelper.dataStyles[i].dSWidth)
                BoxStyle.dashStyle=BigobjHelper.dataStyles[i].publicSelectInput

            }
        }

    }
    SigmaMap(id, dataArray, plotLines, width, height,BoxStyle,PlotLinesStyle)
}

//整理堆积图数据
function setStackingMapChart(id,data, row, col, width, height,BigobjHelper){
    var fvlHivalue,fvlLovalue;
    var tolerance=data.points[0].featvarLimits,result=data.points[0].sample;
    var rule=[];
    tolerance.sort(compare)
    fvlHivalue=Number(tolerance[tolerance.length-1].fvlHivalue)
    fvlLovalue=Number(tolerance[tolerance.length-1].fvlLovalue)
    var id="#"+id,Bigheight=height,Bigwidth=width,testdata=[],data1=[
        {
            color: "red",
            num: 60
        },
        {
            color: "blue",
            num: 10
        },
        {
            color: "red",
            num: 60
        },
        {
            color: "gray",
            num: 10
        },
        {
            color: "green",
            num: 10
        },
        {
            color: "#eee",
            num: 0
        },
        {
            color: "#000",
            num: 40
        }
    ];
    if(BigobjHelper&& typeof BigobjHelper != 'string'){
        if(BigobjHelper.SortOrder==1){//从大到小序列
            var SortArray1=[]
            for(var i=0;i<BigobjHelper.dataStyles.length;i++){//去除空值
                if(BigobjHelper.dataStyles[i].iLInputFrom!=""){
                    SortArray1.push(BigobjHelper.dataStyles[i])
                }
            }
            for(var i=0;i<SortArray1.length;i++){//循环计算节点值
                if(Number(SortArray1[i].dSStyleSel1)==1){//常量
                    SortArray1[i].num=Number(SortArray1[i].iLInputFrom)
                }else if(Number(SortArray1[i].dSStyleSel1)==2){//上公差
                    SortArray1[i].num=fvlHivalue-(fvlHivalue-fvlLovalue)*(1-Number(SortArray1[i].iLInputFrom))*0.5

                }else if(Number(SortArray1[i].dSStyleSel1)==3){//下公差
                    SortArray1[i].num=fvlLovalue+(fvlHivalue-fvlLovalue)*(1-Number(SortArray1[i].iLInputFrom))*0.5
                }
            }

            var SortArray=SortArray1.sort(sortId1);
            var obj = {};
            var deWeightFour=function() {//去除重复值
                SortArray = SortArray.reduce(function(a, b) {
                    obj[b.num] ? '' : obj[b.num] = true && a.push(b);
                    return a;
                }, [])
                return SortArray;
            }
            var newArr4 = deWeightFour()
            //生成判断条件
            for(var j=0;j<newArr4.length;j++){

                var item={},FirstLast={};
                if(j==0){
                    item.Min=Number(newArr4[j].num)
                    item.name="Out>"+newArr4[j].num
                    item.color=BigobjHelper.DSBgColor
                    item.borderColor= BigobjHelper.BorderColor
                    item.dSWidth= BigobjHelper.dSWidth
                    rule.push(item)
                }else if(j==newArr4.length-1){
                    FirstLast.Min=Number(newArr4[j].num)
                    FirstLast.Max=Number(newArr4[j-1].num)
                    FirstLast.color=newArr4[j-1].DSBgColor
                    FirstLast.name=Number(newArr4[j].num)+"In"+Number(newArr4[j-1].num)
                    FirstLast.BorderColor=newArr4[j-1].BorderColor
                    FirstLast.dSWidth= newArr4[j-1].dSWidth

                    item.Max=Number(newArr4[j].num)
                    item.name="Out<"+newArr4[j].num
                    item.color=newArr4[j].DSBgColor
                    item.borderColor= newArr4[j].BorderColor
                    item.dSWidth= newArr4[j].dSWidth
                    rule.push(FirstLast)
                    rule.push(item)
                }else{
                    item.Min=Number(newArr4[j].num)
                    item.Max=Number(newArr4[j-1].num)
                    item.name=newArr4[j].num+"<=In<"+newArr4[j-1].num
                    item.color= newArr4[j-1].DSBgColor
                    item.borderColor= newArr4[j-1].BorderColor
                    rule.push(item)
                }

            }
            //根据条件判断数据
            for(var i=0;i<rule.length;i++){
                var item={num:0,color:"green"};
                for (var n=0;n<result.length;n++){
                    if(i==0){
                        if(result[n].pc>=rule[i].Min){
                            item.num++;
                            item.name=rule[i].name
                            item.color=rule[i].color
                        }

                    }else if(i==rule.length-1){
                        if(result[n].pc<rule[i].Max){
                            item.num++;
                            item.name=rule[i].name
                            item.color=rule[i].color
                        }
                    }else{
                        if(result[n].pc>=rule[i].Min && result[n].pc<rule[i].Max){
                            item.num++;
                            item.name=rule[i].name
                            item.color=rule[i].color
                        }
                    }
                }
                testdata.push(item)
            }
            data1=testdata
        }else if(BigobjHelper.SortOrder==2){//从小到大序列
            var SortArray1=[]
            for(var i=0;i<BigobjHelper.dataStyles.length;i++){//去除空值
                if(BigobjHelper.dataStyles[i].iLInputFrom!=""){
                    SortArray1.push(BigobjHelper.dataStyles[i])
                }
            }
            for(var i=0;i<SortArray1.length;i++){//循环计算节点值
                if(Number(SortArray1[i].dSStyleSel1)==1){//常量
                    SortArray1[i].num=Number(SortArray1[i].iLInputFrom)
                }else if(Number(SortArray1[i].dSStyleSel1)==2){//上公差
                    SortArray1[i].num=fvlHivalue-(fvlHivalue-fvlLovalue)*(1-Number(SortArray1[i].iLInputFrom))*0.5

                }else if(Number(SortArray1[i].dSStyleSel1)==3){//下公差
                    SortArray1[i].num=fvlLovalue+(fvlHivalue-fvlLovalue)*(1-Number(SortArray1[i].iLInputFrom))*0.5
                }
            }
            var SortArray=SortArray1.sort(sortId1).reverse();
            var obj = {};
            var deWeightFour=function() {//去除重复值
                SortArray = SortArray.reduce(function(a, b) {
                    obj[b.num] ? '' : obj[b.num] = true && a.push(b);
                    return a;
                }, [])
                return SortArray;
            }
            var newArr4 = deWeightFour()
            //生成判断条件
            for(var j=0;j<newArr4.length;j++){

                var item={},FirstLast={};
                if(j==0){
                    item.Max=Number(newArr4[j].num)
                    item.name="Out<"+newArr4[j].num
                    item.color=BigobjHelper.DSBgColor
                    item.borderColor= BigobjHelper.BorderColor
                    item.dSWidth= BigobjHelper.dSWidth
                    rule.push(item)
                }else if(j==newArr4.length-1){
                    FirstLast.Min=Number(newArr4[j-1].num)
                    FirstLast.Max=Number(newArr4[j].num)
                    FirstLast.color=newArr4[j-1].DSBgColor
                    FirstLast.borderColor= newArr4[j-1].BorderColor
                    FirstLast.name= Number(newArr4[j].num)+">In>="+Number(newArr4[j-1].num)
                    FirstLast.dSWidth= newArr4[j-1].dSWidth

                    item.Min=Number(newArr4[j].num)
                    item.name="Out>="+newArr4[j].num
                    item.color=newArr4[j].DSBgColor
                    item.borderColor= newArr4[j].BorderColor
                    item.dSWidth= newArr4[j].dSWidth
                    rule.push(FirstLast)
                    rule.push(item)
                }else{
                    item.Max=Number(newArr4[j].num)
                    item.Min=Number(newArr4[j-1].num)
                    item.color=newArr4[j-1].DSBgColor
                    item.borderColor= newArr4[j-1].BorderColor
                    item.name=newArr4[j].num+">In>="+newArr4[j-1].num
                    item.dSWidth= newArr4[j-1].dSWidth
                    rule.push(item)
                }

            }
            //根据条件判断数据
            for(var i=0;i<rule.length;i++){
                var item={num:0,color:"green"};
                for (var n=0;n<result.length;n++){
                    if(i==0){
                        if(result[n].pc<rule[i].Max){
                            item.num++;
                            item.name=rule[i].name
                            item.color=rule[i].color
                        }

                    }else if(i==rule.length-1){
                        if(result[n].pc>=rule[i].Min){
                            item.num++;
                            item.name=rule[i].name
                            item.color=rule[i].color
                        }
                    }else{
                        if(result[n].pc>=rule[i].Min && result[n].pc<rule[i].Max){
                            item.num++;
                            item.name=rule[i].name
                            item.color=rule[i].color
                        }
                    }
                }
                testdata.push(item)
            }
            data1=testdata
        }else if(BigobjHelper.SortOrder==3){//从中间到两边序列
            var SortArray1=[]
            for(var i=0;i<BigobjHelper.dataStyles.length;i++){//去除空值
                if(BigobjHelper.dataStyles[i].iLInputFrom!=""){
                    SortArray1.push(BigobjHelper.dataStyles[i])
                }
            }
            for(var i=0;i<SortArray1.length;i++){//循环计算节点值
                if(Number(SortArray1[i].dSStyleSel1)==1){//常量
                    SortArray1[i].num=Number(SortArray1[i].iLInputFrom)
                }else if(Number(SortArray1[i].dSStyleSel1)==2){//上公差
                    SortArray1[i].num=fvlHivalue-(fvlHivalue-fvlLovalue)*(1-Number(SortArray1[i].iLInputFrom))*0.5

                }else if(Number(SortArray1[i].dSStyleSel1)==3){//下公差
                    SortArray1[i].num=fvlLovalue+(fvlHivalue-fvlLovalue)*(1-Number(SortArray1[i].iLInputFrom))*0.5
                }
            }
            var SortArray=SortArray1.sort(sortId1);
            var obj = {};
            var deWeightFour=function() {//去除重复值
                SortArray = SortArray.reduce(function(a, b) {
                    obj[b.num] ? '' : obj[b.num] = true && a.push(b);
                    return a;
                }, [])
                return SortArray;
            }
            var newArr4 = deWeightFour()//去重
            var newArr5=[]
            for(var i=0;i<newArr4.length;i++){//去除设置0节点
                if(newArr4[i].num != 0){
                    newArr5.push(newArr4[i])
                }
            }
            //生成判断条件
            for(var j=0;j<newArr5.length;j++){
                if(Number(newArr5[0].num)<0){

                    var item={},FirstLast={};
                    if(j==0){
                        item.Max=Number(newArr5[j].num)
                        item.name="Out<"+newArr5[j].num
                        item.color=BigobjHelper.DSBgColor
                        item.borderColor= BigobjHelper.BorderColor
                        item.dSWidth= BigobjHelper.dSWidth
                        rule.push(item)
                    }else if(j==newArr4.length-1){
                        FirstLast.Min=Number(newArr5[j-1].num)
                        FirstLast.Max=Number(newArr5[j].num)
                        FirstLast.color=newArr5[j-1].DSBgColor
                        FirstLast.borderColor= newArr5[j-1].BorderColor
                        FirstLast.name= Number(newArr5[j].num)+">In>="+Number(newArr4[j-1].num)
                        FirstLast.dSWidth= newArr5[j-1].dSWidth

                        item.Min=Number(newArr5[j].num)
                        item.name="Out>="+newArr5[j].num
                        item.color=newArr5[j].DSBgColor
                        item.borderColor= newArr5[j].BorderColor
                        item.dSWidth= newArr5[j].dSWidth
                        rule.push(FirstLast)
                        rule.push(item)
                    }else{
                        item.Max=Number(newArr5[j].num)
                        item.Min=Number(newArr5[j-1].num)
                        item.color=newArr5[j-1].DSBgColor
                        item.borderColor= newArr5[j-1].BorderColor
                        item.name=newArr5[j].num+">In>="+newArr5[j-1].num
                        item.dSWidth= newArr5[j-1].dSWidth
                        rule.push(item)
                    }
                }else if(Number(newArr5[newArr5.length-1].num)>0){
                    var item={},FirstLast={};
                    if(j==0){
                        item.Min=Number(newArr5[j].num)
                        item.name="Out>"+newArr5[j].num
                        item.color=newArr4[j].DSBgColor
                        item.borderColor= newArr5[j].BorderColor
                        item.dSWidth= newArr5[j].dSWidth
                        rule.push(item)
                    }else if(j==newArr5.length-1){
                        FirstLast.Max=Number(newArr5[j-1].num)
                        FirstLast.Min=Number(newArr5[j].num)
                        FirstLast.color=newArr5[j].DSBgColor
                        FirstLast.borderColor= newArr5[j].BorderColor
                        FirstLast.name= Number(newArr5[j-1].num)+">In>="+Number(newArr5[j].num)
                        FirstLast.dSWidth= newArr5[j].dSWidth

                        item.Max=Number(newArr5[j].num)
                        item.name="Out<"+newArr5[j].num
                        item.color=BigobjHelper.DSBgColor
                        item.borderColor= BigobjHelper.BorderColor
                        item.dSWidth= BigobjHelper.dSWidth
                        rule.push(FirstLast)
                        rule.push(item)
                    }else{
                        item.Min=Number(newArr5[j].num)
                        item.Max=Number(newArr5[j-1].num)
                        item.color=newArr5[j].DSBgColor
                        item.borderColor= newArr5[j].BorderColor
                        item.name=Number(newArr5[j-1].num)+">In>="+Number(newArr5[j].num)
                        item.dSWidth= newArr5[j].dSWidth
                        rule.push(item)
                    }
                }else{
                    var item={},FirstLast={};
                    if(j==0){
                        item.Min=Number(newArr5[j].num)
                        item.name="Out>="+newArr5[j].num
                        rule.push(item)
                    }else if(j==newArr5.length-1){
                        FirstLast.Max=Number(newArr5[j-1].num)
                        FirstLast.Min=Number(newArr5[j].num)
                        FirstLast.name= Number(newArr5[j-1].num)+">In>="+Number(newArr5[j].num)

                        item.Max=Number(newArr5[j].num)
                        item.name="Out<"+newArr5[j].num
                        rule.push(FirstLast)
                        rule.push(item)
                    }else{
                        item.Min=Number(newArr5[j].num)
                        item.Max=Number(newArr5[j-1].num)
                        item.name=Number(newArr5[j-1].num)+">In>="+Number(newArr5[j].num)
                        rule.push(item)
                    }
                    if(newArr5.length==rule.length-1){
                        var n=0;
                        for(var i=0;i<rule.length;i++){
                            if(i==0){
                                rule[i].color=newArr5[i].DSBgColor
                                rule[i].borderColor= newArr5[i].BorderColor
                                rule[i].dSWidth= newArr5[i].dSWidth
                            }else if(i==rule.length-1){
                                rule[i].color=newArr5[newArr5.length-1].DSBgColor
                                rule[i].borderColor= newArr5[newArr5.length-1].BorderColor
                                rule[i].dSWidth= newArr5[newArr5.length-1].dSWidth
                            }else{
                                if(rule[i].Min<=0 && rule[i].Max>0){
                                    n=i
                                    rule[i].color=BigobjHelper.DSBgColor
                                    rule[i].borderColor= BigobjHelper.BorderColor
                                    rule[i].dSWidth= BigobjHelper.dSWidth
                                }else {
                                    if(n!=0){
                                        rule[i].color=newArr5[i-1].DSBgColor
                                        rule[i].borderColor= newArr5[i-1].BorderColor
                                        rule[i].dSWidth= newArr5[i-1].dSWidth
                                    }else{
                                        rule[i].color=newArr5[i].DSBgColor
                                        rule[i].borderColor= newArr5[i].BorderColor
                                        rule[i].dSWidth= newArr5[i].dSWidth
                                    }

                                }
                            }
                        }
                    }
                }
            }
            //根据条件判断数据
            for(var i=0;i<rule.length;i++){
                var item={num:0,color:"green"};
                for (var n=0;n<result.length;n++){
                    if(i==0){
                        if(result[n].pc>=rule[i].Min){
                            item.num++;
                            item.name=rule[i].name
                            item.color=rule[i].color
                        }

                    }else if(i==rule.length-1){
                        if(result[n].pc<rule[i].Max){
                            item.num++;
                            item.name=rule[i].name
                            item.color=rule[i].color
                        }
                    }else{
                        if(result[n].pc>=rule[i].Min && result[n].pc<rule[i].Max){
                            item.num++;
                            item.name=rule[i].name
                            item.color=rule[i].color
                        }
                    }
                }
                testdata.push(item)
            }
            data1=testdata
        }

    }
    StackingMap(id,data1,Bigwidth,Bigheight)
}

// array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
// (function(必选初始值或计算结束返回值, 必选当前元素, 可选索引, 可选原数组),可选函数初始值)
//数组去重


//趋势图  保存属性
function saveTrendMapSettings1() {
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
     * 指示线 IndicatorLineAdd
     */
    var instructionLines = [];
    //$('.TrendMap .instructionLines .cellAttribute').each(function() {
    $('.TrendMap .IndicatorLineAdd .cellAttribute').each(function() {
        var cellAttribute = $(this);
        var instructionLine = {};
        // 指示线方式 [定义区间，选择参数]
        instructionLine.IndicatorLineStyleChange = $(cellAttribute).find('.IndicatorLineStyleChange').val();
        // 指示线 最小 数据区间
        instructionLine.iLInputFrom = $(cellAttribute).find('.iLInputFrom').val();
        // 指示线 最大 数据区间
        instructionLine.iLInputTo = $(cellAttribute).find('.iLInputTo').val();
        // 指示线 宽度 数值
        instructionLine.WidthNumber = $(cellAttribute).find('.WidthNumber').val();
        // 指示线类型 [虚线、实线]
        if($(cellAttribute).find('.publicSelectInput').find("span").hasClass("elxuxian")){
            instructionLine.publicSelectInput = "empty";
        }else {
            instructionLine.publicSelectInput = "real"
        }
        // 指示线颜色
        instructionLine.ColorNum = $(cellAttribute).find('.ColorNum').val();
        // 指示线数值 iLInput2
        instructionLine.iLInput2 = $(cellAttribute).find('.iLInput2').val();
        // 显示数值
        instructionLine.iLCb1 = $(cellAttribute).find('.iLCb1').is(':checked');

        // 命令 ？
        instructionLine.cellProperties = $(cellAttribute).find('.cellProperties').val();
        instructionLine.iLParameter = $(cellAttribute).find('.iLParameter').val();
        instructionLine.iLSel1 = $(cellAttribute).find('.iLSel1').val();
        instructionLine.iLInput1 = $(cellAttribute).find('.iLInput1').val();
        instructionLine.iLInputTo = $(cellAttribute).find('.iLInputTo').val();
        instructionLine.iLWidthInput1 = $(cellAttribute).find('.iLWidthInput1').val();
        instructionLine.iLSelParam1 = $(cellAttribute).find('.iLSelParam1').val();
        instructionLine.iLSelParam2 = $(cellAttribute).find('.iLSelParam2').val();
        instructionLine.RangeNumber = $(cellAttribute).find('.RangeNumber').val();
        instructionLine.WidthNumber = $(cellAttribute).find('.WidthNumber').val();

        instructionLine.BackgroundColor = $(cellAttribute).find('.BackgroundColor').val();
        instructionLine.iLCb2 = $(cellAttribute).find('.iLCb2').is(':checked');
        instructionLine.IndicatorLineStyleChange = $(cellAttribute).find('.IndicatorLineStyleChange').val();
        instructionLine.iLMapNumIntFrom1 = $(cellAttribute).find('.iLMapNumIntFrom1').val();
        instructionLine.iLMapNumIntFrom2 = $(cellAttribute).find('.iLMapNumIntFrom2').val();
        instructionLines.push(instructionLine);
    });
    objHelper.instructionLines = instructionLines;
    /**
     * Get DataStyles, use classname dataStyles, each data style is identified
     * by class cellAttribute
     * 数据样式 DataStyleAdd
     */
    var dataStyles = [];
    $('.TrendMap .DataStyleAdd .cellAttribute').each(function() {
        var cellAttribute = $(this);
        var dataStyle = {};
        // 数据样式 类型[<,>,=]
        dataStyle.dSYValueSel1 = $(cellAttribute).find('.dSYValueSel1').val();
        //变量
        dataStyle.dSStyleSel1 = $(cellAttribute).find('.dSStyleSel1').val();
        //运算符号
        if(dataStyle.dSStyleSel1!=1){
            dataStyle.SymbolicOperation1 = $(cellAttribute).find('.SymbolicOperation1').val();
        }
        //变量倍数
        dataStyle.dSRangeNumber1 = $(cellAttribute).find('.dSRangeNumber1').val();
        // 数据样式 类型[<,>,=]
        dataStyle.dSYValueSel2 = $(cellAttribute).find('.dSYValueSel2').val();
        //变量
        dataStyle.dSStyleSel2 = $(cellAttribute).find('.dSStyleSel2').val();
        //运算符号
        if(dataStyle.dSStyleSel2!=1) {
            dataStyle.SymbolicOperation2 = $(cellAttribute).find('.SymbolicOperation2').val();
        }
        //变量倍数
        dataStyle.dSRangeNumber2 = $(cellAttribute).find('.dSRangeNumber2').val();
        //数据样式
        if((dataStyle.dSStyleSel1!=0 && dataStyle.dSYValueSel1!=0)||(dataStyle.dSStyleSel2!=0 && dataStyle.dSYValueSel2!=0)) {
            if ($(cellAttribute).find('.DataTypeShow').find("span").attr("value")) {
                dataStyle.DataTypeShow = $(cellAttribute).find('.DataTypeShow').find("span").attr("value");
            } else {
                dataStyle.DataTypeShow = 6
            }
        }

        //底色开关    色值   透明度
        dataStyle.dSCb1 = $(cellAttribute).find('.dSCb1').is(':checked');
        dataStyle.DSBgColor = $(cellAttribute).find('.DSBgColor').val();
        dataStyle.dSTransparency1 = $(cellAttribute).find('.dSTransparency1').val();
        //边框开关    色值   宽度  类型
        // dataStyle.dSCb2 = $(cellAttribute).find('.dSCb2').is(':checked');
        // dataStyle.BorderColor = $(cellAttribute).find(".BorderColor").val();
        // dataStyle.dSWidth = $(cellAttribute).find('.dSWidth').val();
        // if($(cellAttribute).find('.publicSelectInput').find("span").hasClass("elxuxian")){
        //     dataStyle.publicSelectInput = "empty";
        // }else {
        //     dataStyle.publicSelectInput = "real"//默认实线
        // }

        dataStyle.dSYValueInput1 = $(cellAttribute).find('.dSYValueInput1').val();
        dataStyle.dSBgColorCb1 = $(cellAttribute).find('.dSBgColorCb1').val();
        dataStyle.dSBgColorInput1 = $(cellAttribute).find('.dSBgColorInput1').val();
        dataStyle.dSBgColorTransparency1 = $(cellAttribute).find('.dSBgColorTransparency1').val();
        dataStyle.dSFrameCb1 = $(cellAttribute).find('.dSFrameCb1').val();
        dataStyle.dSFrameColor1 = $(cellAttribute).find('.dSFrameColor1').val();
        dataStyle.dSFrameBgColor = $(cellAttribute).find('dSFrameBgColor').val();
        dataStyle.dSFrameColorTransparency1 = $(cellAttribute).find('.dSFrameColorTransparency1').val();

        dataStyle.dSRangeNumber2 = $(cellAttribute).find('.dSRangeNumber2').val();



        dataStyle.dSCb3 = $(cellAttribute).find('.dSCb3').is(':checked');
        dataStyle.DataTypeShowElement = 6
        dataStyles.push(dataStyle);
    });
    // 特殊点 开关
    objHelper.miscMove2 = $('.TrendMap .miscMove2').attr('data-state');
    // 特殊点  方向
    objHelper.miscSel1 = $('.TrendMap .miscSel1').val();
    // 特殊点 数据数量
    objHelper.miscSel2 = $('.TrendMap .miscSel2').val();
    // 特殊点 参数变量
    objHelper.miscSel3 = $('.TrendMap .miscSel3').val();
    //特殊点  数据样式
    //数据样式

        if($(".TrendMap").find('.SpecialPoint').find("span").attr("value")){
            objHelper.SpecialPoint = $(".TrendMap").find('.SpecialPoint').find("span").attr("value");
        }else {
            objHelper.SpecialPoint =6
        }

    // 特殊点 底色开关
    objHelper.miscBgColorCb1 = $('.TrendMap .miscBgColorCb1').is(':checked');
    // 特殊点 底色
    if($('.TrendMap .miscBgColorInput1').val()=="#FFF"){
        objHelper.miscBgColorInput1 = "red";
    }else{
        objHelper.miscBgColorInput1 = $('.TrendMap .miscBgColorInput1').val();
    }

    // 特殊点 透明度
    objHelper.miscBgColorTransparency1 = $('.TrendMap .miscBgColorTransparency1').val();


    objHelper.dataStyles = dataStyles;
    objHelper.miscMove1 = $('.TrendMap .miscMove1').attr('data-state');
    objHelper.miscRadio1 = $('.TrendMap .miscRadio1').is(':checked');
    objHelper.miscRadio2 = $('.TrendMap .miscRadio2').is(':checked');
    objHelper.miscRadio3 = $('.TrendMap .miscRadio3').is(':checked');





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
    var BigobjHelper=objHelper
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    handsonTableHelperObjTrendMapSettings[currSelection[0][0] + ',' + currSelection[0][1]] = objHelper;
    resizeCharts(BigobjHelper)

}

//直方图  保存属性
function saveHistogramSettings() {
    var objHelper = {};
    objHelper.columnChartSel1 = $(".columnChart select[name='trendMapSel1']").val();
    objHelper.columnChartSel2 = $(".columnChart select[name='trendMapSel2']").val();
    objHelper.columnChartCb1 = $(".columnChart input[name='trendMapCb1']").is(":checked");
    objHelper.columnChartFrom1 = $(".columnChart input[name='trendMapFrom1']").val();
    objHelper.columnChartTo1 = $(".columnChart input[name='trendMapTo1']").val();
    objHelper.columnChartSel3 = $(".columnChart select[name='trendMapSel3']").val();
    objHelper.columnChartSel4 = $(".columnChart select[name='trendMapSel4']").val();
    objHelper.columnChartSelXStyle = $(".columnChart select[name='trendMapSelXStyle']").val();
    objHelper.columnChartSelLabel = $(".columnChart select[name='trendMapSelLabel']").val();
    objHelper.columnChartNumIntFrom1 = $(".columnChart input[name='trendMapNumIntFrom1']").val();
    objHelper.columnChartNumIntTo1 = $(".columnChart input[name='trendMapNumIntTo1']").val();
    objHelper.columnChartMinInt1 = $(".columnChart input[name='trendMapMinInt1']").val();
    objHelper.columnChartSelYStyle = $(".columnChart select[name='trendMapSelYStyle']").val();
    objHelper.columnChartSelLabel2 = $(".columnChart select[name='trendMapSelLabel2']").val();
    objHelper.columnChartNumIntFrom2 = $(".columnChart input[name='trendMapNumIntFrom2']").val();
    objHelper.columnChartNumIntTo2 = $(".columnChart input[name='trendMapNumIntTo2']").val();
    objHelper.columnChartMinInt2 = $(".columnChart input[name='trendMapMinInt2']").val();
    var instructionLines = [];
    //$('.TrendMap .instructionLines .cellAttribute').each(function() {
    $('.columnChart .IndicatorLineAdd  .cellAttribute').each(function() {
        var cellAttribute = $(this);
        var instructionLine = {};
        // 指示线方式 [定义区间，选择参数]
        instructionLine.IndicatorLineStyleChange = $(cellAttribute).find('.IndicatorLineStyleChange').val();
        //指示线  参数
        instructionLine.iLSelParam1 = $(cellAttribute).find('.iLSelParam1').val();
        // 指示线 最小 数据区间
        instructionLine.iLInputFrom = $(cellAttribute).find('.iLInputFrom').val();
        // 指示线 最大 数据区间
        instructionLine.iLInputTo = $(cellAttribute).find('.iLInputTo').val();
        // 指示线 宽度 数值
        instructionLine.iLWidthInput1 = $(cellAttribute).find('.WidthNumber').val();
        // 指示线类型 [虚线、实线]
        if($(cellAttribute).find('.publicSelectInput').find("span").hasClass("elxuxian")){
            instructionLine.publicSelectInput = "empty";
        }else {
            instructionLine.publicSelectInput = "real"
        }
        // 指示线颜色
        instructionLine.ColorNum = $(cellAttribute).find('.ColorNum').val();
        // 指示线数值 iLInput2
        instructionLine.iLInput2 = $(cellAttribute).find('.iLInput2').val();
        // 显示数值
        instructionLine.iLCb1 = $(cellAttribute).find('.iLCb1').is(':checked');
        instructionLines.push(instructionLine);
    });
    objHelper.instructionLines = instructionLines;
    var dataStyles = [];
    $('.columnChart .ColumnChartDataStyle .DataStyleUl').each(function() {
        var cellAttribute = $(this);
        var dataStyle = {};
        //底色开关    色值   透明度
        dataStyle.dSCb1 = $(cellAttribute).find('.dSCb1').is(':checked');
        if($(cellAttribute).find('.DSBgColor').val()=="#FFF"||$(cellAttribute).find('.DSBgColor').val()=="#ffffff"){
            dataStyle.DSBgColor = "yellow";
        }else{
            dataStyle.DSBgColor = $(cellAttribute).find('.DSBgColor').val();
        }

        dataStyle.dSTransparency1 = $(cellAttribute).find('.dSBgColorTransparency1').val();
        //边框开关    色值   宽度  类型
        dataStyle.dSCb2 = $(cellAttribute).find('.dSCb2').is(':checked');
        dataStyle.BorderColor = $(cellAttribute).find(".BorderColor").val();
        if($(cellAttribute).find('.dSWidth').val()){
            dataStyle.dSWidth = $(cellAttribute).find('.dSWidth').val();
        }else{
            dataStyle.dSWidth=1
        }

        if($(cellAttribute).find('.publicSelectInput').find("span").hasClass("elxuxian")){
            dataStyle.publicSelectInput = "empty";
        }else {
            dataStyle.publicSelectInput = "real"//默认实线
        }
        dataStyles.push(dataStyle);
    });
    objHelper.dataStyles = dataStyles;
    // 6Sigma 开关
    objHelper.sigama = $('.columnChart .sigama .move').attr('data-state');
    // 6Sigma 开关2
    objHelper.sigamaChecked = $('.columnChart .sigamaChecked').is(':checked');
    // 6Sigma 颜色
    objHelper.sigamaColor = $('.columnChart .sigamaColor').val();
    // 6Sigma  宽度
    objHelper.sigamaWidth = $('.columnChart .sigamaWidth').val();
    //6Sigma  样式
    if($(".columnChart").find('.SigmaBorderStyle').find("span").hasClass("elxuxian")){
        objHelper.SigmaBorderStyle = "empty";
    }else {
        objHelper.SigmaBorderStyle = "real"//默认实线
    }
    objHelper.miscFrameCb1 = $('.columnChart .miscFrameCb1').is(':checked');
    objHelper.miscFrameBgColor1 = $('.columnChart .miscFrameBgColor1').val();
    objHelper.miscFrameTransparency1 = $('.columnChart .miscFrameTransparency1').val();
    objHelper.miscSel4 = $('.columnChart .miscSel4').val();
    objHelper.miscSel5 = $('.columnChart .miscSel5').val();
    objHelper.miscSel6 = $('.columnChart .miscSel6').val();
    objHelper.miscSel7 = $('.columnChart .miscSel7').val();
    objHelper.miscHeight = $('.columnChart .miscInput1').val();
    objHelper.miscWidth = $('.columnChart .miscInput2').val();
    objHelper.miscInput3 = $('.columnChart .miscInput3').val();
    objHelper.miscTableBorderStyle = $('.columnChart .tableBorderStyle').attr('value');
    objHelper.miscFrameThickness = $('.columnChart .miscInput4').val();
    objHelper.miscBGColor = $('.columnChart .miscInput3').val();
    objHelper.miscTableBorderColor = $('.columnChart .miscInput3').val();
    var BigobjHelper=objHelper
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    handsonTableHelperObjHistogramSettings[currSelection[0][0] + ',' + currSelection[0][1]] = objHelper;
    resizeCharts(BigobjHelper)
}

//控制图  保存属性
function saveControlChartSettings() {
    var objHelper = {};
    objHelper.ControlChartType = Number($(".ControlChart").find(".ControlChartType").val());//图表类型
    objHelper.controlXaxisStyle = Number($(".ControlChart select[name='controlXaxisStyle']").val());//X轴样式
    objHelper.controlXaxis = Number($(".ControlChart select[name='controlXaxis']").val());//标签设置
    objHelper.ControlGroupingCules = Number($(".ControlChart .ControlGroupingCules").val())//分组规则
    // Number($(".ControlChart").find(".ControlChartType").val())
    objHelper.Sel1 = $(".ControlChart select[name='controlChartSel1']").val();
    objHelper.controlChartSel2 = $(".ControlChart select[name='controlChartSel2']").val();
    objHelper.controlChartCb1 = $(".ControlChart input[name='controlChartCb1']").is(":checked");
    objHelper.controlChartFrom1 = $(".ControlChart input[name='controlChartFrom1']").val();
    objHelper.controlChartTo1 = $(".ControlChart input[name='controlChartTo1']").val();
    objHelper.controlChartSel3 = $(".ControlChart select[name='controlChartSel3']").val();
    objHelper.controlChartSel4 = $(".ControlChart select[name='controlChartSel4']").val();

    objHelper.controlChartNumIntFrom1 = $(".ControlChart input[name='controlChartNumIntFrom1']").val();
    objHelper.controlChartNumIntTo1 = $(".ControlChart input[name='controlChartNumIntTo1']").val();
    objHelper.controlChartMinInt1 = $(".ControlChart input[name='controlChartMinInt1']").val();
    objHelper.controlChartSelYStyle = $(".ControlChart select[name='controlChartSelYStyle']").val();
    objHelper.controlChartSelLabel2 = $(".ControlChart select[name='controlChartSelLabel2']").val();
    objHelper.controlChartNumIntFrom2 = $(".ControlChart input[name='controlChartNumIntFrom2']").val();
    objHelper.controlChartNumIntTo2 = $(".ControlChart input[name='controlChartNumIntTo2']").val();
    objHelper.controlChartMinInt2 = $(".ControlChart input[name='controlChartMinInt2']").val();
    /**
     * Get InstructionLines, use classname instructionLines, each instruction line is identified
     * by class cellAttribute
     * 指示线 IndicatorLineAdd
     */
    var instructionLines = [];
    //$('.ControlChart .instructionLines .cellAttribute').each(function() {
    $('.ControlChart .ControlChartLineAdd .cellAttribute').each(function() {
        var cellAttribute = $(this);
        var instructionLine = {};
        //指示线  图示
        instructionLine.MapStyle = $(cellAttribute).find('.MapStyle').val();
        instructionLine.ParameterNum = $(cellAttribute).find('.ParameterNum').val();
        instructionLine.iLSelParam3 = $(cellAttribute).find('.iLSelParam3').val();
        // 指示线方式 [定义区间，选择参数]
        instructionLine.IndicatorLineStyleChange = $(cellAttribute).find('.IndicatorLineStyleChange').val();
        // 指示线 最小 数据区间
        instructionLine.iLInputFrom = $(cellAttribute).find('.iLInputFrom').val();
        // 指示线 最大 数据区间
        instructionLine.iLInputTo = $(cellAttribute).find('.iLInputTo').val();
        // 指示线 宽度 数值
        instructionLine.WidthNumber = $(cellAttribute).find('.WidthNumber').val();
        // 指示线类型 [虚线、实线]
        if($(cellAttribute).find('.publicSelectInput').find("span").hasClass("elxuxian")){
            instructionLine.publicSelectInput = "empty";
        }else {
            instructionLine.publicSelectInput = "real"
        }
        // 指示线颜色
        instructionLine.ColorNum = $(cellAttribute).find('.ColorNum').val();
        // 指示线数值 iLInput2
        instructionLine.iLInput2 = $(cellAttribute).find('.iLInput2').val();
        // 显示数值
        instructionLine.iLCb1 = $(cellAttribute).find('.iLCb1').is(':checked');

        // 命令 ？
        instructionLine.cellProperties = $(cellAttribute).find('.cellProperties').val();
        instructionLine.iLParameter = $(cellAttribute).find('.iLParameter').val();
        instructionLine.iLSel1 = $(cellAttribute).find('.iLSel1').val();
        instructionLine.iLInput1 = $(cellAttribute).find('.iLInput1').val();
        instructionLine.iLInputTo = $(cellAttribute).find('.iLInputTo').val();
        instructionLine.iLWidthInput1 = $(cellAttribute).find('.iLWidthInput1').val();
        instructionLine.iLSelParam1 = $(cellAttribute).find('.iLSelParam1').val();
        instructionLine.iLSelParam2 = $(cellAttribute).find('.iLSelParam2').val();
        instructionLine.RangeNumber = $(cellAttribute).find('.RangeNumber').val();
        instructionLine.WidthNumber = $(cellAttribute).find('.WidthNumber').val();

        instructionLine.BackgroundColor = $(cellAttribute).find('.BackgroundColor').val();
        instructionLine.iLCb2 = $(cellAttribute).find('.iLCb2').is(':checked');
        instructionLine.IndicatorLineStyleChange = $(cellAttribute).find('.IndicatorLineStyleChange').val();
        instructionLine.iLMapNumIntFrom1 = $(cellAttribute).find('.iLMapNumIntFrom1').val();
        instructionLine.iLMapNumIntFrom2 = $(cellAttribute).find('.iLMapNumIntFrom2').val();
        instructionLines.push(instructionLine);
    });
    objHelper.instructionLines = instructionLines;
    /**
     * Get DataStyles, use classname dataStyles, each data style is identified
     * by class cellAttribute
     * 数据样式 DataStyleAdd
     */
    var dataStyles = [];
    $('.ControlChart .ControlChartDataStyle .cellAttribute').each(function() {
        var cellAttribute = $(this);
        var dataStyle = {};
        dataStyle.DataMapStyle = $(cellAttribute).find('.DataMapStyle').val();
        //底色开关    色值   透明度
        dataStyle.dSCb1 = $(cellAttribute).find('.dSCb1').is(':checked');
        if($(cellAttribute).find('.DSBgColor').val()=="#FFF"||$(cellAttribute).find('.DSBgColor').val()=="#ffffff"){
            dataStyle.DSBgColor = "yellow";
        }else{
            dataStyle.DSBgColor = $(cellAttribute).find('.DSBgColor').val();
        }

        dataStyle.dSTransparency1 = $(cellAttribute).find('.dSBgColorTransparency1').val();
        //边框开关    色值   宽度  类型
        dataStyle.dSCb2 = $(cellAttribute).find('.dSCb2').is(':checked');
        dataStyle.BorderColor = $(cellAttribute).find(".BorderColor").val();
        if($(cellAttribute).find('.dSWidth').val()){
            dataStyle.dSWidth = $(cellAttribute).find('.dSWidth').val();
        }else{
            dataStyle.dSWidth=1
        }

            // "circle"（圆形）、"square"（正方形）、"diamond"（菱形）、 "triangle"（三角形）及 "triangle-down"（倒三角形）
            if(Number($(cellAttribute).find('.DataTypeShow').find("span").attr("value"))==3){
                dataStyle.DataTypeShow = "square"//正方形
            }else if(Number($(cellAttribute).find('.DataTypeShow').find("span").attr("value"))==9){
                dataStyle.DataTypeShow = "diamond"//多边形
            }else if(Number($(cellAttribute).find('.DataTypeShow').find("span").attr("value"))==5){
                dataStyle.DataTypeShow = "triangle"
            }else if(Number($(cellAttribute).find('.DataTypeShow').find("span").attr("value"))==6){
                dataStyle.DataTypeShow = "circle"
            }else if(Number($(cellAttribute).find('.DataTypeShow').find("span").attr("value"))==2){
                dataStyle.DataTypeShow = "diamond"
            }else{
                dataStyle.DataTypeShow = "circle"
            }
        dataStyles.push(dataStyle);
    });
    objHelper.dataStyles = dataStyles;
    // 特殊点 开关
    objHelper.miscMove2 = $('.ControlChart .miscMove2').attr('data-state');
    // 特殊点  方向
    objHelper.miscSel1 = $('.ControlChart .miscSel1').val();
    // 特殊点 数据数量
    objHelper.miscSel2 = $('.ControlChart .miscSel2').val();
    // 特殊点 参数变量
    objHelper.miscSel3 = $('.ControlChart .miscSel3').val();
    //特殊点  数据样式
    //数据样式

    if($(".ControlChart").find('.SpecialPoint').find("span").attr("value")){
        objHelper.SpecialPoint = $(".ControlChart").find('.SpecialPoint').find("span").attr("value");
    }else {
        objHelper.SpecialPoint =6
    }

    // 特殊点 底色开关
    objHelper.miscBgColorCb1 = $('.ControlChart .miscBgColorCb1').is(':checked');
    // 特殊点 底色
    if($('.ControlChart .miscBgColorInput1').val()=="#FFF"){
        objHelper.miscBgColorInput1 = "red";
    }else{
        objHelper.miscBgColorInput1 = $('.ControlChart .miscBgColorInput1').val();
    }

    // 特殊点 透明度
    objHelper.miscBgColorTransparency1 = $('.ControlChart .miscBgColorTransparency1').val();

    objHelper.dataStyles = dataStyles;
    objHelper.miscMove1 = $('.ControlChart .miscMove1').attr('data-state');
    objHelper.miscRadio1 = $('.ControlChart .miscRadio1').is(':checked');
    objHelper.miscRadio2 = $('.ControlChart .miscRadio2').is(':checked');
    objHelper.miscRadio3 = $('.ControlChart .miscRadio3').is(':checked');

    objHelper.miscFrameCb1 = $('.ControlChart .miscFrameCb1').is(':checked');
    objHelper.miscFrameBgColor1 = $('.ControlChart .miscFrameBgColor1').val();
    objHelper.miscFrameTransparency1 = $('.ControlChart .miscFrameTransparency1').val();
    objHelper.miscSel4 = $('.ControlChart .miscSel4').val();
    objHelper.miscSel5 = $('.ControlChart .miscSel5').val();
    objHelper.miscSel6 = $('.ControlChart .miscSel6').val();
    objHelper.miscSel7 = $('.ControlChart .miscSel7').val();
    objHelper.miscHeight = $('.ControlChart .miscInput1').val();
    objHelper.miscWidth = $('.ControlChart .miscInput2').val();
    objHelper.miscInput3 = $('.ControlChart .miscInput3').val();
    objHelper.miscTableBorderStyle = $('.ControlChart .tableBorderStyle').attr('value');
    objHelper.miscFrameThickness = $('.ControlChart .miscInput4').val();
    objHelper.miscBGColor = $('.ControlChart .miscInput3').val();
    objHelper.miscTableBorderColor = $('.ControlChart .miscInput3').val();
    var BigobjHelper=objHelper
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    handsonTableHelperObjControlChartSettings[currSelection[0][0] + ',' + currSelection[0][1]] = objHelper;
    resizeCharts(BigobjHelper)
}

//帕累托图 保存属性
function savePareToDiagramSettings() {
    var objHelper = {};
    objHelper.controlXaxisStyle = Number($(".ParetoChart select[name='controlXaxisStyle']").val());//X轴样式
    objHelper.controlXaxis = Number($(".ParetoChart select[name='controlXaxis']").val());//标签设置
    objHelper.ControlGroupingCules = Number($(".ParetoChart .ControlGroupingCules").val())//分组规则
    objHelper.paretoSel1 = $(".ParetoChart select[name='paretoSel1']").val();
    objHelper.paretoSel2 = $(".ParetoChart select[name='paretoSel2']").val();
    objHelper.paretoCb1 = $(".ParetoChart input[name='paretoCb1']").is(":checked");
    objHelper.paretoFrom1 = $(".ParetoChart input[name='paretoFrom1']").val();
    objHelper.paretoTo1 = $(".ParetoChart input[name='paretoTo1']").val();
    objHelper.paretoSel3 = $(".ParetoChart select[name='paretoSel3']").val();
    objHelper.paretoSel4 = $(".ParetoChart select[name='paretoSel4']").val();
    objHelper.paretoSelXStyle = $(".ParetoChart select[name='paretoSelXStyle']").val();
    objHelper.paretoSelLabel = $(".ParetoChart select[name='paretoSelLabel']").val();
    objHelper.paretoNumIntFrom1 = $(".ParetoChart input[name='paretoNumIntFrom1']").val();
    objHelper.paretoNumIntTo1 = $(".ParetoChart input[name='paretoNumIntTo1']").val();
    objHelper.paretoMinInt1 = $(".ParetoChart input[name='paretoMinInt1']").val();
    objHelper.paretoSelYStyle = $(".ParetoChart select[name='paretoSelYStyle']").val();
    objHelper.paretoSelLabel2 = $(".ParetoChart select[name='paretoSelLabel2']").val();
    objHelper.paretoNumIntFrom2 = $(".ParetoChart input[name='paretoNumIntFrom2']").val();
    objHelper.paretoNumIntTo2 = $(".ParetoChart input[name='paretoNumIntTo2']").val();
    objHelper.paretoMinInt2 = $(".ParetoChart input[name='paretoMinInt2']").val();
    /**
     * Get InstructionLines, use classname instructionLines, each instruction line is identified
     * by class cellAttribute
     * 指示线 IndicatorLineAdd
     */
    var instructionLines = [];
    //$('.TrendMap .instructionLines .cellAttribute').each(function() {
    $('.ParetoChart .IndicatorLineAdd  .cellAttribute').each(function() {
        var cellAttribute = $(this);
        var instructionLine = {};
        // 指示线方式 [定义区间，选择参数]
        instructionLine.IndicatorLineStyleChange = $(cellAttribute).find('.IndicatorLineStyleChange').val();
        // 指示线 最小 数据区间
        instructionLine.iLInputFrom = $(cellAttribute).find('.iLInputFrom').val();
        // 指示线 最大 数据区间
        instructionLine.iLInputTo = $(cellAttribute).find('.iLInputTo').val();
        // 指示线 宽度 数值
        instructionLine.WidthNumber = $(cellAttribute).find('.WidthNumber').val();
        // 指示线类型 [虚线、实线]
        if($(cellAttribute).find('.publicSelectInput').find("span").hasClass("elxuxian")){
            instructionLine.publicSelectInput = "Dash";
        }else {
            instructionLine.publicSelectInput = "Solid"
        }

        // 指示线颜色
        instructionLine.ColorNum = $(cellAttribute).find('.ColorNum').val();
        // 指示线数值 iLInput2
        instructionLine.iLInput2 = $(cellAttribute).find('.iLInput2').val();
        // 显示数值
        instructionLine.iLCb1 = $(cellAttribute).find('.iLCb1').is(':checked');

        // 命令 ？
        instructionLine.cellProperties = $(cellAttribute).find('.cellProperties').val();
        instructionLine.iLParameter = $(cellAttribute).find('.iLParameter').val();
        instructionLine.iLSel1 = $(cellAttribute).find('.iLSel1').val();
        instructionLine.iLInput1 = $(cellAttribute).find('.iLInput1').val();
        instructionLine.iLInputTo = $(cellAttribute).find('.iLInputTo').val();
        instructionLine.iLWidthInput1 = $(cellAttribute).find('.iLWidthInput1').val();
        instructionLine.iLSelParam1 = $(cellAttribute).find('.iLSelParam1').val();
        instructionLine.iLSelParam2 = $(cellAttribute).find('.iLSelParam2').val();
        instructionLine.RangeNumber = $(cellAttribute).find('.RangeNumber').val();
        instructionLine.WidthNumber = $(cellAttribute).find('.WidthNumber').val();

        instructionLine.BackgroundColor = $(cellAttribute).find('.BackgroundColor').val();
        instructionLine.iLCb2 = $(cellAttribute).find('.iLCb2').is(':checked');
        instructionLine.IndicatorLineStyleChange = $(cellAttribute).find('.IndicatorLineStyleChange').val();
        instructionLine.iLMapNumIntFrom1 = $(cellAttribute).find('.iLMapNumIntFrom1').val();
        instructionLine.iLMapNumIntFrom2 = $(cellAttribute).find('.iLMapNumIntFrom2').val();
        instructionLines.push(instructionLine);
    });
    objHelper.instructionLines = instructionLines;
    /**
     * Get DataStyles, use classname dataStyles, each data style is identified
     * by class cellAttribute
     * 数据样式 DataStyleAdd
     */
    var dataStyles = [];
    $('.ParetoChart .ParetoDataStyle .DataStyleUl').each(function() {
        var cellAttribute = $(this);
        var dataStyle = {};
        //底色开关    色值   透明度
        dataStyle.dSCb1 = $(cellAttribute).find('.dSCb1').is(':checked');
        if($(cellAttribute).find('.DSBgColor').val()=="#FFF"||$(cellAttribute).find('.DSBgColor').val()=="#ffffff"){
            dataStyle.DSBgColor = "blue";
        }else{
            dataStyle.DSBgColor = $(cellAttribute).find('.DSBgColor').val();
        }

        dataStyle.dSTransparency1 = $(cellAttribute).find('.dSBgColorTransparency1').val();
        //边框开关    色值   宽度  类型
        dataStyle.dSCb2 = $(cellAttribute).find('.dSCb2').is(':checked');

        if($(cellAttribute).find('.BorderColor').val()=="#FFF"||$(cellAttribute).find('.BorderColor').val()=="#ffffff"){
            dataStyle.BorderColor = "blue";
        }else{
            dataStyle.BorderColor = $(cellAttribute).find(".BorderColor").val();
        }
        if($(cellAttribute).find('.dSWidth').val()){
            dataStyle.dSWidth = $(cellAttribute).find('.dSWidth').val();
        }else{
            dataStyle.dSWidth=1
        }

        if($(cellAttribute).find('.publicSelectInput').find("span").hasClass("elxuxian")){
            dataStyle.publicSelectInput = "empty";
        }else {
            dataStyle.publicSelectInput = "real"//默认实线
        }
        dataStyles.push(dataStyle);
    });
    objHelper.dataStyles = dataStyles;

    // 累计占比 开关
    objHelper.ProportionLine = $('.ParetoChart .ProportionLine').attr('data-state');
    //  线条样式
    if($(".ParetoChart").find('.Proportion .publicSelectInput').find("span").hasClass("elxuxian")){
        objHelper.publicSelectInput = "Dash";
    }else {
        objHelper.publicSelectInput = "Solid"//默认实线
    }
    // 线条  宽度
    objHelper.ProportionLineWidth = $('.ParetoChart').find(".Proportion .ProportionLineWidth").val();
    // "circle"（圆形）、"square"（正方形）、"diamond"（菱形）、 "triangle"（三角形）及 "triangle-down"（倒三角形）
    if(Number($('.ParetoChart').find('.Proportion .DataTypeShow').find("span").attr("value"))==3){
        objHelper.DataTypeShow = "square"//正方形
    }else if(Number($('.ParetoChart').find('.Proportion .DataTypeShow').find("span").attr("value"))==9){
        objHelper.DataTypeShow = "diamond"//多边形
    }else if(Number($('.ParetoChart').find('.Proportion .DataTypeShow').find("span").attr("value"))==5){
        objHelper.DataTypeShow = "triangle"
    }else if(Number($('.ParetoChart').find('.Proportion .DataTypeShow').find("span").attr("value"))==6){
        objHelper.DataTypeShow = "circle"
    }else if(Number($('.ParetoChart').find('.Proportion .DataTypeShow').find("span").attr("value"))==2){
        objHelper.DataTypeShow = "diamond"
    }else{
        objHelper.DataTypeShow = "circle"
    }
    //开关
    objHelper.dSBgColorCb1 = $('.ParetoChart ').find(".Proportion .dSBgColorCb1").is(':checked');
    //  颜色
    if($('.ParetoChart ').find(".Proportion .LineColor").val()=="#FFF"||$('.ParetoChart ').find(".Proportion .LineColor").val()=="#ffffff"){
        objHelper.LineColor = "green";
    }else{
        objHelper.LineColor =$('.ParetoChart ').find(".Proportion .LineColor").val();
    }

    //透明度LineTransparency
    objHelper.LineTransparency =$('.ParetoChart ').find(".Proportion .LineTransparency").val();

    var BigobjHelper=objHelper

    // 特殊点 开关
    objHelper.miscMove2 = $('.ParetoChart .miscMove2').attr('data-state');
    // 特殊点  方向
    objHelper.miscSel1 = $('.ParetoChart .miscSel1').val();
    // 特殊点 数据数量
    objHelper.miscSel2 = $('.ParetoChart .miscSel2').val();
    // 特殊点 参数变量
    objHelper.miscSel3 = $('.ParetoChart .miscSel3').val();
    //特殊点  数据样式
    //数据样式

    if($(".ParetoChart").find('.SpecialPoint').find("span").attr("value")){
        objHelper.SpecialPoint = $(".ParetoChart").find('.SpecialPoint').find("span").attr("value");
    }else {
        objHelper.SpecialPoint =6
    }

    objHelper.dataStyles = dataStyles;
    objHelper.miscMove1 = $('.ParetoChart .miscMove1').attr('data-state');
    objHelper.miscRadio1 = $('.ParetoChart .miscRadio1').is(':checked');
    objHelper.miscRadio2 = $('.ParetoChart .miscRadio2').is(':checked');
    objHelper.miscRadio3 = $('.ParetoChart .miscRadio3').is(':checked');

    objHelper.miscFrameCb1 = $('.ParetoChart .miscFrameCb1').is(':checked');
    objHelper.miscFrameBgColor1 = $('.ParetoChart .miscFrameBgColor1').val();
    objHelper.miscFrameTransparency1 = $('.ParetoChart .miscFrameTransparency1').val();
    objHelper.miscSel4 = $('.ParetoChart .miscSel4').val();
    objHelper.miscSel5 = $('.ParetoChart .miscSel5').val();
    objHelper.miscSel6 = $('.ParetoChart .miscSel6').val();
    objHelper.miscSel7 = $('.ParetoChart .miscSel7').val();
    objHelper.miscHeight = $('.ParetoChart .miscInput1').val();
    objHelper.miscWidth = $('.ParetoChart .miscInput2').val();
    objHelper.miscInput3 = $('.ParetoChart .miscInput3').val();
    objHelper.miscTableBorderStyle = $('.ParetoChart .tableBorderStyle').attr('value');
    objHelper.miscFrameThickness = $('.ParetoChart .miscInput4').val();
    objHelper.miscBGColor = $('.ParetoChart .miscInput3').val();
    objHelper.miscTableBorderColor = $('.ParetoChart .miscInput3').val();
    var BigobjHelper=objHelper
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    handsonTableHelperObjParetoSettings[currSelection[0][0] + ',' + currSelection[0][1]] = objHelper;
    resizeCharts(BigobjHelper)

}

//箱线图  保存属性
function saveBoxLineChart(){
    var objHelper = {};
    // objHelper.controlXaxisStyle = Number($(".ParetoChart select[name='controlXaxisStyle']").val());//X轴样式
    // objHelper.controlXaxis = Number($(".ParetoChart select[name='controlXaxis']").val());//标签设置
    // objHelper.ControlGroupingCules = Number($(".ParetoChart .ControlGroupingCules").val())//分组规则

    objHelper.BoxLineXaxisStyle = Number($(".BoxLineChart select[name='BoxLineXaxisStyle']").val());//X轴样式
    objHelper.BoxLineXaxis = Number($(".BoxLineChart select[name='BoxLineXaxis']").val());//标签设置
    objHelper.BoxLineGroupingCules = Number($(".BoxLineChart .BoxLineGroupingCules").val())//分组规则
    objHelper.paretoSel1 = $(".BoxLineChart select[name='paretoSel1']").val();
    objHelper.paretoSel2 = $(".BoxLineChart select[name='paretoSel2']").val();
    objHelper.paretoCb1 = $(".BoxLineChart input[name='paretoCb1']").is(":checked");
    objHelper.paretoFrom1 = $(".BoxLineChart input[name='paretoFrom1']").val();
    objHelper.paretoTo1 = $(".BoxLineChart input[name='paretoTo1']").val();
    objHelper.paretoSel3 = $(".BoxLineChart select[name='paretoSel3']").val();
    objHelper.paretoSel4 = $(".BoxLineChart select[name='paretoSel4']").val();
    objHelper.paretoSelXStyle = $(".BoxLineChart select[name='paretoSelXStyle']").val();
    objHelper.paretoSelLabel = $(".BoxLineChart select[name='paretoSelLabel']").val();
    objHelper.paretoNumIntFrom1 = $(".BoxLineChart input[name='paretoNumIntFrom1']").val();
    objHelper.paretoNumIntTo1 = $(".BoxLineChart input[name='paretoNumIntTo1']").val();
    objHelper.paretoMinInt1 = $(".BoxLineChart input[name='paretoMinInt1']").val();
    objHelper.paretoSelYStyle = $(".BoxLineChart select[name='paretoSelYStyle']").val();
    objHelper.paretoSelLabel2 = $(".BoxLineChart select[name='paretoSelLabel2']").val();
    objHelper.paretoNumIntFrom2 = $(".BoxLineChart input[name='paretoNumIntFrom2']").val();
    objHelper.paretoNumIntTo2 = $(".BoxLineChart input[name='paretoNumIntTo2']").val();
    objHelper.paretoMinInt2 = $(".BoxLineChart input[name='paretoMinInt2']").val();
    /**
     * Get InstructionLines, use classname instructionLines, each instruction line is identified
     * by class cellAttribute
     * 指示线 IndicatorLineAdd
     */
    var instructionLines = [];
    //$('.TrendMap .instructionLines .cellAttribute').each(function() {
    $('.BoxLineChart .IndicatorLineAdd .cellAttribute').each(function() {
        var cellAttribute = $(this);
        var instructionLine = {};
        // 指示线方式 [定义区间，选择参数]
        instructionLine.IndicatorLineStyleChange = $(cellAttribute).find('.IndicatorLineStyleChange').val();
        // 指示线 最小 数据区间
        instructionLine.iLInputFrom = $(cellAttribute).find('.iLInputFrom').val();
        // 指示线 最大 数据区间
        instructionLine.iLInputTo = $(cellAttribute).find('.iLInputTo').val();
        // 指示线 宽度 数值
        instructionLine.WidthNumber = $(cellAttribute).find('.WidthNumber').val();
        // 指示线类型 [虚线、实线]
        if($(cellAttribute).find('.publicSelectInput').find("span").hasClass("elxuxian")){
            instructionLine.publicSelectInput = "dot";
        }else {
            instructionLine.publicSelectInput = "solid"
        }
        // 指示线颜色
        instructionLine.ColorNum = $(cellAttribute).find('.ColorNum').val();
        // 指示线数值 iLInput2
        instructionLine.iLInput2 = $(cellAttribute).find('.iLInput2').val();
        // 显示数值
        instructionLine.iLCb1 = $(cellAttribute).find('.iLCb1').is(':checked');

        // 命令 ？
        instructionLine.cellProperties = $(cellAttribute).find('.cellProperties').val();
        instructionLine.iLParameter = $(cellAttribute).find('.iLParameter').val();
        instructionLine.iLSel1 = $(cellAttribute).find('.iLSel1').val();
        instructionLine.iLInput1 = $(cellAttribute).find('.iLInput1').val();
        instructionLine.iLInputTo = $(cellAttribute).find('.iLInputTo').val();
        instructionLine.iLWidthInput1 = $(cellAttribute).find('.iLWidthInput1').val();
        instructionLine.iLSelParam1 = $(cellAttribute).find('.iLSelParam1').val();
        instructionLine.iLSelParam2 = $(cellAttribute).find('.iLSelParam2').val();
        instructionLine.RangeNumber = $(cellAttribute).find('.RangeNumber').val();
        instructionLine.WidthNumber = $(cellAttribute).find('.WidthNumber').val();

        instructionLine.BackgroundColor = $(cellAttribute).find('.BackgroundColor').val();
        instructionLine.iLCb2 = $(cellAttribute).find('.iLCb2').is(':checked');
        instructionLine.IndicatorLineStyleChange = $(cellAttribute).find('.IndicatorLineStyleChange').val();
        instructionLine.iLMapNumIntFrom1 = $(cellAttribute).find('.iLMapNumIntFrom1').val();
        instructionLine.iLMapNumIntFrom2 = $(cellAttribute).find('.iLMapNumIntFrom2').val();
        instructionLines.push(instructionLine);
    });
    objHelper.instructionLines = instructionLines;
    var dataStyles = [];
    $('.BoxLineChart .ColumnChartDataStyle .DataStyleUl').each(function() {
        var cellAttribute = $(this);
        var dataStyle = {};
        //底色开关    色值   透明度
        dataStyle.dSCb1 = $(cellAttribute).find('.dSCb1').is(':checked');
        if($(cellAttribute).find('.DSBgColor').val()=="#FFF"||$(cellAttribute).find('.DSBgColor').val()=="#ffffff"){
            dataStyle.DSBgColor = "yellow";
        }else{
            dataStyle.DSBgColor = $(cellAttribute).find('.DSBgColor').val();
        }

        dataStyle.dSTransparency1 = $(cellAttribute).find('.dSBgColorTransparency1').val();
        //边框开关    色值   宽度  类型
        dataStyle.dSCb2 = $(cellAttribute).find('.dSCb2').is(':checked');
        dataStyle.BorderColor = $(cellAttribute).find(".BorderColor").val();
        if($(cellAttribute).find('.dSWidth').val()){
            dataStyle.dSWidth = $(cellAttribute).find('.dSWidth').val();
        }else{
            dataStyle.dSWidth=1
        }

        if($(cellAttribute).find('.publicSelectInput').find("span").hasClass("elxuxian")){
            dataStyle.publicSelectInput = "empty";
        }else {
            dataStyle.publicSelectInput = "real"//默认实线
        }
        dataStyles.push(dataStyle);
    });
    objHelper.dataStyles = dataStyles;
    var BigobjHelper=objHelper
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    handsonTableHelperObjBoxLineChartSettings[currSelection[0][0] + ',' + currSelection[0][1]] = objHelper;
    resizeCharts(BigobjHelper)
}
//6sigma图  保存属性
function setSigmaChartSettings(){
    var objHelper = {};
    /**
     * Get InstructionLines, use classname instructionLines, each instruction line is identified
     * by class cellAttribute
     * 指示线 IndicatorLineAdd
     */
    var instructionLines = [];
    //$('.TrendMap .instructionLines .cellAttribute').each(function() {
    $('.BigSigma .IndicatorLineAdd .cellAttribute').each(function() {
        var cellAttribute = $(this);
        var instructionLine = {};
        // 指示线方式 [定义区间，选择参数]
        instructionLine.IndicatorLineStyleChange = $(cellAttribute).find('.IndicatorLineStyleChange').val();
        // 指示线 最小 数据区间
        instructionLine.iLInputFrom = $(cellAttribute).find('.iLInputFrom').val();
        // 指示线 最大 数据区间
        instructionLine.iLInputTo = $(cellAttribute).find('.iLInputTo').val();
        // 指示线 宽度 数值
        instructionLine.WidthNumber = $(cellAttribute).find('.WidthNumber').val();
        // 指示线类型 [虚线、实线]
        if($(cellAttribute).find('.publicSelectInput').find("span").hasClass("elxuxian")){
            instructionLine.publicSelectInput = "empty";
        }else {
            instructionLine.publicSelectInput = "real   "
        }
        // 指示线颜色
        instructionLine.ColorNum = $(cellAttribute).find('.ColorNum').val();
        // 指示线数值 iLInput2
        instructionLine.iLInput2 = $(cellAttribute).find('.iLInput2').val();
        // 显示数值
        instructionLine.iLCb1 = $(cellAttribute).find('.iLCb1').is(':checked');

        // 命令 ？
        instructionLine.cellProperties = $(cellAttribute).find('.cellProperties').val();
        instructionLine.iLParameter = $(cellAttribute).find('.iLParameter').val();
        instructionLine.iLSel1 = $(cellAttribute).find('.iLSel1').val();
        instructionLine.iLInput1 = $(cellAttribute).find('.iLInput1').val();
        instructionLine.iLInputTo = $(cellAttribute).find('.iLInputTo').val();
        instructionLine.iLWidthInput1 = $(cellAttribute).find('.iLWidthInput1').val();
        instructionLine.iLSelParam1 = $(cellAttribute).find('.iLSelParam1').val();
        instructionLine.iLSelParam2 = $(cellAttribute).find('.iLSelParam2').val();
        instructionLine.RangeNumber = $(cellAttribute).find('.RangeNumber').val();
        instructionLine.WidthNumber = $(cellAttribute).find('.WidthNumber').val();

        instructionLine.BackgroundColor = $(cellAttribute).find('.BackgroundColor').val();
        instructionLine.iLCb2 = $(cellAttribute).find('.iLCb2').is(':checked');
        instructionLine.IndicatorLineStyleChange = $(cellAttribute).find('.IndicatorLineStyleChange').val();
        instructionLine.iLMapNumIntFrom1 = $(cellAttribute).find('.iLMapNumIntFrom1').val();
        instructionLine.iLMapNumIntFrom2 = $(cellAttribute).find('.iLMapNumIntFrom2').val();
        instructionLines.push(instructionLine);
    });
    objHelper.instructionLines = instructionLines;
    var dataStyles = [];
    $('.BigSigma .SigmaChartDataStyle .DataStyleUl').each(function() {
        var cellAttribute = $(this);
        var dataStyle = {};
        //底色开关    色值   透明度
        dataStyle.dSCb1 = $(cellAttribute).find('.dSCb1').is(':checked');
        if($(cellAttribute).find('.DSBgColor').val()=="#FFF"||$(cellAttribute).find('.DSBgColor').val()=="#ffffff"){
            dataStyle.DSBgColor = "yellow";
        }else{
            dataStyle.DSBgColor = $(cellAttribute).find('.DSBgColor').val();
        }

        dataStyle.dSTransparency1 = $(cellAttribute).find('.dSBgColorTransparency1').val();
        //边框开关    色值   宽度  类型
        dataStyle.dSCb2 = $(cellAttribute).find('.dSCb2').is(':checked');
        dataStyle.BorderColor = $(cellAttribute).find(".BorderColor").val();
        if($(cellAttribute).find('.dSWidth').val()){
            dataStyle.dSWidth = $(cellAttribute).find('.dSWidth').val();
        }else{
            dataStyle.dSWidth=1
        }

        if($(cellAttribute).find('.publicSelectInput').find("span").hasClass("elxuxian")){
            dataStyle.publicSelectInput = "empty";
        }else {
            dataStyle.publicSelectInput = "real"//默认实线
        }
        dataStyles.push(dataStyle);
    });
    objHelper.dataStyles = dataStyles;
    var BigobjHelper=objHelper
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    handsonTableHelperObjSigmaMapSettings[currSelection[0][0] + ',' + currSelection[0][1]] = objHelper;
    resizeCharts(BigobjHelper)

}
//饼图  保存属性
//堆积图  保存属性
function saveStackingMapChartSettings(){
    var objHelper = {};
    objHelper.SortOrder=$(".StackingMapChart #SortOrder").val()
    //起始底色开关    色值   透明度
    objHelper.dSCb1 = $(".StackingMapChart .startStyle").find('.dSCb1').is(':checked');
    if($(".StackingMapChart .startStyle").find('.DSBgColor').val()=="#FFF"||$(".StackingMapChart .startStyle").find('.DSBgColor').val()=="#ffffff"){
        objHelper.DSBgColor = "yellow";
    }else{
        objHelper.DSBgColor = $(".StackingMapChart .startStyle").find('.DSBgColor').val();
    }

    objHelper.dSTransparency1 = $(".StackingMapChart .startStyle").find('.dSBgColorTransparency1').val();
    //起始边框开关    色值   宽度  类型
    objHelper.dSCb2 = $(".StackingMapChart .startStyle").find('.dSCb2').is(':checked');
    objHelper.BorderColor = $(".StackingMapChart .startStyle").find(".BorderColor").val();
    if($(".StackingMapChart .startStyle").find('.dSWidth').val()){
        objHelper.dSWidth = $(".StackingMapChart .startStyle").find('.dSWidth').val();
    }else{
        objHelper.dSWidth=1
    }
    var dataStyles = [];
    $('.StackingMapChart .DataStyleAdd .cellAttribute').each(function() {
        var cellAttribute = $(this);
        var dataStyle = {};
        //常量  公差
        dataStyle.dSStyleSel1=$(cellAttribute).find('.dSStyleSel1').val();
        //符号
        dataStyle.SymbolicOperation1=$(cellAttribute).find('.SymbolicOperation1').val();
        dataStyle.num = $(cellAttribute).find('.iLInputFrom').val();
        // 指示线
        dataStyle.iLInputFrom = $(cellAttribute).find('.iLInputFrom').val();
        //底色开关    色值   透明度
        dataStyle.dSCb1 = $(cellAttribute).find('.dSCb1').is(':checked');
        if($(cellAttribute).find('.DSBgColor').val()=="#FFF"||$(cellAttribute).find('.DSBgColor').val()=="#ffffff"){
            dataStyle.DSBgColor = "yellow";
        }else{
            dataStyle.DSBgColor = $(cellAttribute).find('.DSBgColor').val();
        }

        dataStyle.dSTransparency1 = $(cellAttribute).find('.dSBgColorTransparency1').val();
        //边框开关    色值   宽度  类型
        dataStyle.dSCb2 = $(cellAttribute).find('.dSCb2').is(':checked');
        dataStyle.BorderColor = $(cellAttribute).find(".BorderColor").val();
        if($(cellAttribute).find('.dSWidth').val()){
            dataStyle.dSWidth = $(cellAttribute).find('.dSWidth').val();
        }else{
            dataStyle.dSWidth=1
        }

        // if($(cellAttribute).find('.publicSelectInput').find("span").hasClass("elxuxian")){
        //     dataStyle.publicSelectInput = "empty";
        // }else {
        //     dataStyle.publicSelectInput = "real"//默认实线
        // }
        dataStyles.push(dataStyle);
    });
    objHelper.dataStyles = dataStyles;
    var BigobjHelper=objHelper
    var currSelection = handsonTable.getSelected();
    if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
        || currSelection[0].length < 4)
        return false;
    handsonTableHelperObjStackingMapChartSettings[currSelection[0][0] + ',' + currSelection[0][1]] = objHelper;
    resizeCharts(BigobjHelper)
}
function getNullableAndUndefinable(value, mustBeNumber) {
    if (!value || typeof value === 'undefined') {
        return '';
    }
    return mustBeNumber && typeof mustBeNumber !== 'undefined'?Number(value):value;
}