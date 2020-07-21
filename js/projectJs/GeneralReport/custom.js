$(function () {
    //设置自定义报告画布大小
    $(".reportContCont").css({"height":"1075px","width":"1567px"})
    $(".paperSize").css({"height":"1095px","width":"1587px"})
    $(".reportSlide").css("height",1147+"px")
    $(".reportRhide ").css("height",1147+"px")

    var html='';
    html += '<option value="0"> 请选择 </option>'
    html += '<option value="1"> &gt; </option>'
    html += '<option value="2"> &lt; </option>'
    html += '<option value="3"> = </option>'
    html += '<option value="4"> >= </option>'
    html += '<option value="5"> <= </option>'
    

    $(".HistoChart .RangeSymbol").html(html)
    $(".HistoChart .RangeSymbol1").html(html)

    $(".reportContCont").on("click",".ui-widget-content",function(){
        $(this).addClass("GeneralBoxBorder").siblings("div").removeClass("GeneralBoxBorder")
        /*if($(this).attr("id").indexOf("HistoChart")>=0){
            $(".operationCont .HistoChart").css("display","block").siblings("div").css("display","none")
        }else if($(this).attr("id").indexOf("picture")>=0){
            $(".operationCont .picture").css("display","block").siblings("div").css("display","none")
        }*/
        return false //阻止冒泡
    })
    $("#reportContCont").click(function(){
        $(this).find(".ui-widget-content").removeClass("GeneralBoxBorder")
    })

    $.ajax({
        type: "GET",
        url: ctx + "/userDefineReport/getPacketTree",
        data: "",
        dataType: "json",
        cache: false,
        success: function (data) {
            if (data.code == 200){
                console.log(data)
                // if (data.data != null) {
                //     var id = $("#userId").val();
                //     addWebSocket(data.data, id);
                // }
            }
        },
        error: function (result) {
            // alert(result);
            layer.msg("error");
        }
    });
})
//AV属性添加
function AVAddAttribute(e){
    var html = ""
    html += '<div class="cellAttribute">'
    html += '<div class="bigAttribute">'
    html += '<div style="height:20px;">'
    html += '<span onclick="customBarDeleteAttribute(this)" style="" class="bigDeleteAttributeCommand customDelete element elshanchu11 fl MrginL10"></span>'
    html += ' </div>'
    html += '<div class="AddingConditions">'
    html += '<ul>'
    html += '<li>'
    html += '<label>'
    html += '<input checked type="checkbox" class="checkCommand">'
    html += '<span style="vertical-align: top;">命令</span>'
    html += '</label>'
    html += '<select id="" class="command">'
    html += '<option value="AV">AV</option>'
    html += '</select>'
    html += '</li>'
    html += '<li>'
    html += '<label>范围</label>'
    html += '<select style="max-width: 60px;" class="RangeSymbol">'
    html += '<option value="0"> 请选择 </option>'
    html += '<option value="1"> &gt; </option>'
    html += '<option value="2"> &lt; </option>'
    html += '<option value="3"> = </option>'
    html += '<option value="4"> >= </option>'
    html += '<option value="5"> <= </option>'
    html += '</select>'
    html += '<input type="number" class="RangeNumber" value="1" style="max-width: 100px;margin-left: 5px;">'
    html += '</li>'
    html += '<li>'
    html += '<label></label>'
    html += '<select style="max-width: 60px;" class="RangeSymbol1">'
    html += '<option value="0"> 请选择 </option>'
    html += '<option value="1"> &gt; </option>'
    html += '<option value="2"> &lt; </option>'
    html += '<option value="3"> = </option>'
    html += '<option value="4"> >= </option>'
    html += '<option value="5"> <= </option>'
    html += '</select>'
    html += '<input type="number" class="RangeNumber1" value="1" style="max-width: 100px;margin-left: 5px;">'
    html += '</li>'
    html += '</ul>'
    html += '</div>'
    html += '</div>'
    html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
    html += '<li>'
    html += '<label>'
    html += '<span style="vertical-align: top;">底色</span></label>'
    html += '<div style="" class="fl BGCDiv">'
    html += '<div style="width:60px;" class="evo-cp-wrap"><input id="BackgroundColor" style="" onchange="BackgroundColor(this)" class="BackgroundColor colorPicker evo-cp2" value="#FFF"><div class="evo-pointer evo-colorind" style="background-color: rgb(255, 255, 255); display: block;"></div></div>'
    html += '</div>'
    html += '<input type="number" placeholder="请输入值" value="100" min="0" max="100" class="fl " style="max-width: 100px;">'
    html += '</li>'
    html += '</ul>'
    html += '</div>'
    $(e).parents(".publicStyle").find(".AVAddAttribute").append(html)
    $(e).parents(".publicStyle").find(".AVAddAttribute").find(".cellAttribute:last-child").find(".BackgroundColor").colorpicker() //底色调用
}
//R属性添加
function RAddAttribute(e){
    var html = ""
    html += '<div class="cellAttribute">'
    html += '<div class="bigAttribute">'
    html += '<div style="height:20px;">'
    html += '<span onclick="customBarDeleteAttribute(this)" style="" class="bigDeleteAttributeCommand customDelete element elshanchu11 fl MrginL10"></span>'
    html += ' </div>'
    html += '<div class="AddingConditions">'
    html += '<ul>'
    html += '<li>'
    html += '<label>'
    html += '<input checked type="checkbox" class="checkCommand">'
    html += '<span style="vertical-align: top;">命令</span>'
    html += '</label>'
    html += '<select id="" class="command">'
    html += '<option value="R">R</option>'
    html += '</select>'
    html += '</li>'
    html += '<li>'
    html += '<label>范围</label>'
    html += '<select style="max-width: 60px;" class="RangeSymbol">'
    html += '<option value="0"> 请选择 </option>'
    html += '<option value="1"> &gt; </option>'
    html += '<option value="2"> &lt; </option>'
    html += '<option value="3"> = </option>'
    html += '<option value="4"> >= </option>'
    html += '<option value="5"> <= </option>'
    html += '</select>'
    html += '<input type="number" class="RangeNumber" value="1" style="max-width: 100px;margin-left: 5px;">'
    html += '</li>'
    html += '<li>'
    html += '<label></label>'
    html += '<select style="max-width: 60px;" class="RangeSymbol1">'
    html += '<option value="0"> 请选择 </option>'
    html += '<option value="1"> &gt; </option>'
    html += '<option value="2"> &lt; </option>'
    html += '<option value="3"> = </option>'
    html += '<option value="4"> >= </option>'
    html += '<option value="5"> <= </option>'
    html += '</select>'
    html += '<input type="number" class="RangeNumber1" value="1" style="max-width: 100px;margin-left: 5px;">'
    html += '</li>'
    html += '</ul>'
    html += '</div>'
    html += '</div>'
    html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
    html += '<li>'
    html += '<label>'
    html += '<span style="vertical-align: top;">底色</span></label>'
    html += '<div style="" class="fl BGCDiv">'
    html += '<div style="width:60px;" class="evo-cp-wrap"><input id="BackgroundColor" style="" onchange="BackgroundColor(this)" class="BackgroundColor colorPicker evo-cp2" value="#FFF"><div class="evo-pointer evo-colorind" style="background-color: rgb(255, 255, 255); display: block;"></div></div>'
    html += '</div>'
    html += '<input type="number" placeholder="请输入值" value="100" min="0" max="100" class="fl " style="max-width: 100px;">'
    html += '</li>'
    html += '</ul>'
    html += '</div>'
    $(e).parents(".publicStyle").find(".RAddAttribute").append(html)
    $(e).parents(".publicStyle").find(".RAddAttribute").find(".cellAttribute:last-child").find(".BackgroundColor").colorpicker() //底色调用
}
//CP属性添加
function CPAddAttribute(e){
    var html = ""
    html += '<div class="cellAttribute">'
    html += '<div class="bigAttribute">'
    html += '<div style="height:20px;">'
    html += '<span onclick="customBarDeleteAttribute(this)" style="" class="bigDeleteAttributeCommand customDelete element elshanchu11 fl MrginL10"></span>'
    html += ' </div>'
    html += '<div class="AddingConditions">'
    html += '<ul>'
    html += '<li>'
    html += '<label>'
    html += '<input checked type="checkbox" class="checkCommand">'
    html += '<span style="vertical-align: top;">命令</span>'
    html += '</label>'
    html += '<select id="" class="command">'
    html += '<option value="CP">CP</option>'
    html += '</select>'
    html += '</li>'
    html += '<li>'
    html += '<label>范围</label>'
    html += '<select style="max-width: 60px;" class="RangeSymbol">'
    html += '<option value="0"> 请选择 </option>'
    html += '<option value="1"> &gt; </option>'
    html += '<option value="2"> &lt; </option>'
    html += '<option value="3"> = </option>'
    html += '<option value="4"> >= </option>'
    html += '<option value="5"> <= </option>'
    html += '</select>'
    html += '<input type="number" class="RangeNumber" value="1" style="max-width: 100px;margin-left: 5px;">'
    html += '</li>'
    html += '<li>'
    html += '<label></label>'
    html += '<select style="max-width: 60px;" class="RangeSymbol1">'
    html += '<option value="0"> 请选择 </option>'
    html += '<option value="1"> &gt; </option>'
    html += '<option value="2"> &lt; </option>'
    html += '<option value="3"> = </option>'
    html += '<option value="4"> >= </option>'
    html += '<option value="5"> <= </option>'
    html += '</select>'
    html += '<input type="number" class="RangeNumber1" value="1" style="max-width: 100px;margin-left: 5px;">'
    html += '</li>'
    html += '</ul>'
    html += '</div>'
    html += '</div>'
    html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
    html += '<li>'
    html += '<label>'
    html += '<span style="vertical-align: top;">底色</span></label>'
    html += '<div style="" class="fl BGCDiv">'
    html += '<div style="width:60px;" class="evo-cp-wrap"><input id="BackgroundColor" style="" onchange="BackgroundColor(this)" class="BackgroundColor colorPicker evo-cp2" value="#FFF"><div class="evo-pointer evo-colorind" style="background-color: rgb(255, 255, 255); display: block;"></div></div>'
    html += '</div>'
    html += '<input type="number" placeholder="请输入值" value="100" min="0" max="100" class="fl " style="max-width: 100px;">'
    html += '</li>'
    html += '</ul>'
    html += '</div>'
    $(e).parents(".publicStyle").find(".CPAddAttribute").append(html)
    $(e).parents(".publicStyle").find(".CPAddAttribute").find(".cellAttribute:last-child").find(".BackgroundColor").colorpicker() //底色调用
}
//CPK属性添加
function CPKAddAttribute(e){
    var html = ""
    html += '<div class="cellAttribute">'
    html += '<div class="bigAttribute">'
    html += '<div style="height:20px;">'
    html += '<span onclick="customBarDeleteAttribute(this)" style="" class="bigDeleteAttributeCommand customDelete element elshanchu11 fl MrginL10"></span>'
    html += ' </div>'
    html += '<div class="AddingConditions">'
    html += '<ul>'
    html += '<li>'
    html += '<label>'
    html += '<input checked type="checkbox" class="checkCommand">'
    html += '<span style="vertical-align: top;">命令</span>'
    html += '</label>'
    html += '<select id="" class="command">'
    html += '<option value="CPK">CPK</option>'
    html += '</select>'
    html += '</li>'
    html += '<li>'
    html += '<label>范围</label>'
    html += '<select style="max-width: 60px;" class="RangeSymbol">'
    html += '<option value="0"> 请选择 </option>'
    html += '<option value="1"> &gt; </option>'
    html += '<option value="2"> &lt; </option>'
    html += '<option value="3"> = </option>'
    html += '<option value="4"> >= </option>'
    html += '<option value="5"> <= </option>'
    html += '</select>'
    html += '<input type="number" class="RangeNumber" value="1" style="max-width: 100px;margin-left: 5px;">'
    html += '</li>'
    html += '<li>'
    html += '<label></label>'
    html += '<select style="max-width: 60px;" class="RangeSymbol1">'
    html += '<option value="0"> 请选择 </option>'
    html += '<option value="1"> &gt; </option>'
    html += '<option value="2"> &lt; </option>'
    html += '<option value="3"> = </option>'
    html += '<option value="4"> >= </option>'
    html += '<option value="5"> <= </option>'
    html += '</select>'
    html += '<input type="number" class="RangeNumber1" value="1" style="max-width: 100px;margin-left: 5px;">'
    html += '</li>'
    html += '</ul>'
    html += '</div>'
    html += '</div>'
    html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
    html += '<li>'
    html += '<label>'
    html += '<span style="vertical-align: top;">底色</span></label>'
    html += '<div style="" class="fl BGCDiv">'
    html += '<div style="width:60px;" class="evo-cp-wrap"><input id="BackgroundColor" style="" onchange="BackgroundColor(this)" class="BackgroundColor colorPicker evo-cp2" value="#FFF"><div class="evo-pointer evo-colorind" style="background-color: rgb(255, 255, 255); display: block;"></div></div>'
    html += '</div>'
    html += '<input type="number" placeholder="请输入值" value="100" min="0" max="100" class="fl " style="max-width: 100px;">'
    html += '</li>'
    html += '</ul>'
    html += '</div>'
    $(e).parents(".publicStyle").find(".CPKAddAttribute").append(html)
    $(e).parents(".publicStyle").find(".CPKAddAttribute").find(".cellAttribute:last-child").find(".BackgroundColor").colorpicker() //底色调用
}
//自定义属性删除
function  customBarDeleteAttribute(e) {
    if($(e).parents(".bigCellAttribute").find(".cellAttribute").length>1){
        $(e).parents(".cellAttribute").remove()
    }
}
//柱状图保存属性
function HistoChartSaveAttribute(e){
    var AttributeStyles = {};
    var AVStyles = [];
    $('.HistoChart .AVAddAttribute .cellAttribute').each(function() {
        var cellAttribute = $(this);
        var AVStyle = {};
        // AV 开关
        AVStyle.checkCommand = $(cellAttribute).find('.checkCommand').is(':checked');
        //AV 变量名
        AVStyle.command = $(cellAttribute).find('.command').val();
        //AV 运算符号1
        AVStyle.RangeSymbol = $(cellAttribute).find('.RangeSymbol').val();
        //AV 运算变量值1
        AVStyle.RangeNumber = $(cellAttribute).find('.RangeNumber').val();
        //AV 运算符号2
        AVStyle.RangeSymbol1 = $(cellAttribute).find('.RangeSymbol1').val();
        //AV 运算变量值2
        AVStyle.RangeNumber1 = $(cellAttribute).find('.RangeNumber1').val();
        //AV 色值
        AVStyle.BackgroundColor  = $(cellAttribute).find('.BackgroundColor').val();
        //AV 透明度
        AVStyle.dSFrameColorTransparency1 = $(cellAttribute).find('.dSFrameColorTransparency1').val();
        if(AVStyle.checkCommand){
            AVStyles.push(AVStyle);
        }
    });
    var RStyles = [];
    $('.HistoChart .RAddAttribute .cellAttribute').each(function() {
        var cellAttribute = $(this);
        var RStyle = {};
        // R 开关
        RStyle.checkCommand = $(cellAttribute).find('.checkCommand').is(':checked');
        //R 变量名
        RStyle.command = $(cellAttribute).find('.command').val();
        //R 运算符号1
        RStyle.RangeSymbol = $(cellAttribute).find('.RangeSymbol').val();
        //R 运算变量值1
        RStyle.RangeNumber = $(cellAttribute).find('.RangeNumber').val();
        //R 运算符号2
        RStyle.RangeSymbol1 = $(cellAttribute).find('.RangeSymbol1').val();
        //R 运算符号2
        RStyle.RangeNumber1 = $(cellAttribute).find('.RangeNumber1').val();
        //R 色值
        RStyle.BackgroundColor  = $(cellAttribute).find('.BackgroundColor').val();
        //R 透明度
        RStyle.dSFrameColorTransparency1 = $(cellAttribute).find('.dSFrameColorTransparency1').val();
        if(RStyle.checkCommand){
            RStyles.push(RStyle);
        }
    });
    var CPStyles = [];
    $('.HistoChart .CPAddAttribute .cellAttribute').each(function() {
        var cellAttribute = $(this);
        var CPStyle = {};
        // CP 开关
        CPStyle.checkCommand = $(cellAttribute).find('.checkCommand').is(':checked');
        //CP 变量名
        CPStyle.command = $(cellAttribute).find('.command').val();
        //CP 运算符号1
        CPStyle.RangeSymbol = $(cellAttribute).find('.RangeSymbol').val();
        //CP 运算变量值1
        CPStyle.RangeNumber = $(cellAttribute).find('.RangeNumber').val();
        //CP 运算符号2
        CPStyle.RangeSymbol1 = $(cellAttribute).find('.RangeSymbol1').val();
        //CP 运算符号2
        CPStyle.RangeNumber1 = $(cellAttribute).find('.RangeNumber1').val();
        //CP 色值
        CPStyle.BackgroundColor  = $(cellAttribute).find('.BackgroundColor').val();
        //CP 透明度
        CPStyle.dSFrameColorTransparency1 = $(cellAttribute).find('.dSFrameColorTransparency1').val();
        if(CPStyle.checkCommand){
            CPStyles.push(CPStyle);
        }
    });
    var CPKStyles = [];
    $('.HistoChart .CPKAddAttribute .cellAttribute').each(function() {
        var cellAttribute = $(this);
        var CPKStyle = {};
        // CPK 开关
        CPKStyle.checkCommand = $(cellAttribute).find('.checkCommand').is(':checked');
        //CPK 变量名
        CPKStyle.command = $(cellAttribute).find('.command').val();
        //CPK 运算符号1
        CPKStyle.RangeSymbol = $(cellAttribute).find('.RangeSymbol').val();
        //CPK 运算变量值1
        CPKStyle.RangeNumber = $(cellAttribute).find('.RangeNumber').val();
        //CPK 运算符号2
        CPKStyle.RangeSymbol1 = $(cellAttribute).find('.RangeSymbol1').val();
        //CPK 运算符号2
        CPKStyle.RangeNumber1 = $(cellAttribute).find('.RangeNumber1').val();
        //CPK 色值
        CPKStyle.BackgroundColor  = $(cellAttribute).find('.BackgroundColor').val();
        //CPK 透明度
        CPKStyle.dSFrameColorTransparency1 = $(cellAttribute).find('.dSFrameColorTransparency1').val();
        if(CPKStyle.checkCommand){
            CPKStyles.push(CPKStyle);
        }
    });
    AttributeStyles.AVStyles=AVStyles
    AttributeStyles.RStyles=RStyles
    AttributeStyles.CPStyles=CPStyles
    AttributeStyles.CPKStyles=CPKStyles
    if($(".reportContCont  .GeneralBoxBorder").attr("id")){
        var ids = $(".reportContCont  .GeneralBoxBorder").attr("id")
    }else{
        alert("请选择要操作的标签")
        return false
    }
    $("#"+ids).attr("data-rules",JSON.stringify($(".HistoChart").html()))
    setHistoryChart(ids,AttributeStyles)
    return false
}
function setHistoryChart(ids,AttributeStyles) {
    if($("#"+ids).attr("data-rules")!=undefined){
        var str = $("#"+ids).attr("data-rules")
        console.log(eval('(' + str + ')'))
    }
    $("#"+ids+" .BarBox").remove()//清除html
    var pointName=["FLKRY2003 X","FLKRY2003 Y","FLKRY2003 Z"];
    var tolerance=[
        {
            "fvlHivalue": "1.5",
            "fvlBeginTime": "defualt date",
            "fvlLovalue": "-1.5"
        },
        {
            "fvlHivalue": "2",
            "fvlBeginTime": "2019/07/01 15:09:00",
            "fvlLovalue": "-2"
        },
        {
            "fvlHivalue": "1",
            "fvlBeginTime": "2019/09/01 15:09:00",
            "fvlLovalue": "-1"
        }
    ];//公差
    tolerance.sort(compare)
    var UpperDeviation= tolerance[tolerance.length-1].fvlHivalue
    var LowerDeviation= tolerance[tolerance.length-1].fvlLovalue
    var AV={
            name:"AV",
            AVnum:0.18,
            color:"#fff",
            tolerance:"+-1"
    }
    var data=[{
        "name":"R",
        "num":0.82,
        "color":"green"
    },{
        "name":"CP",
        "num":1.72,
        "color":"green"
    },{
        "name":"CPK",
        "num":1,
        "color":"green"
    },{
        "name":"N.Dist",
        "num":true,
        "color":"green"
    }];
    var AVRules=[],RRules=[],CPRules=[],CPKRules=[];
    if(AttributeStyles!=undefined&&typeof AttributeStyles !="String"){
        //AV 判断条件
        for(var i=0;i<AttributeStyles.AVStyles.length;i++){
            var item={}
            if(Number(AttributeStyles.AVStyles[i].RangeSymbol)!=0&&AttributeStyles.AVStyles[i].RangeSymbol!=undefined){
                if(Number(AttributeStyles.AVStyles[i].RangeSymbol)==1){
                    item.rule=">"+AttributeStyles.AVStyles[i].RangeNumber
                }else if(Number(AttributeStyles.AVStyles[i].RangeSymbol)==2){
                    item.rule="<"+AttributeStyles.AVStyles[i].RangeNumber
                }else if(Number(AttributeStyles.AVStyles[i].RangeSymbol)==3){
                    item.rule="=="+AttributeStyles.AVStyles[i].RangeNumber
                }else if(Number(AttributeStyles.AVStyles[i].RangeSymbol)==4){
                    item.rule=">="+AttributeStyles.AVStyles[i].RangeNumber
                }else if(Number(AttributeStyles.AVStyles[i].RangeSymbol)==5){
                    item.rule="<="+AttributeStyles.AVStyles[i].RangeNumber
                }
            }else{
                item.rule=null
            }
            if(Number(AttributeStyles.AVStyles[i].RangeSymbol1)!=0&&AttributeStyles.AVStyles[i].RangeSymbol1!=undefined){
                if(Number(AttributeStyles.AVStyles[i].RangeSymbol1)==1){
                    item.rule1=">"+AttributeStyles.AVStyles[i].RangeNumber1
                }else if(Number(AttributeStyles.AVStyles[i].RangeSymbol1)==2){
                    item.rule1="<"+AttributeStyles.AVStyles[i].RangeNumber1
                }else if(Number(AttributeStyles.AVStyles[i].RangeSymbol1)==3){
                    item.rule1="=="+AttributeStyles.AVStyles[i].RangeNumber1
                }else if(Number(AttributeStyles.AVStyles[i].RangeSymbol1)==4){
                    item.rule1=">="+AttributeStyles.AVStyles[i].RangeNumber1
                }else if(Number(AttributeStyles.AVStyles[i].RangeSymbol1)==5){
                    item.rule1="<="+AttributeStyles.AVStyles[i].RangeNumber1
                }
            }else{
                item.rule1=null
            }
            item.color=AttributeStyles.AVStyles[i].BackgroundColor
            item.dSFrameColorTransparency1=AttributeStyles.AVStyles[i].dSFrameColorTransparency1
            AVRules.push(item)
        }
        //改变AV色值
        for(var i=0;i<AVRules.length;i++){
            if(AVRules[i].rule!=null && AVRules[i].rule1!=null){
                if(eval(AV.AVnum+AVRules[i].rule)&&eval(AV.AVnum+AVRules[i].rule1)){
                    AV.color=AVRules[i].color
                }
            }else if(AVRules[i].rule!=null || AVRules[i].rule1!=null){
                if(AVRules[i].rule!=null){
                    if(eval(AV.AVnum+AVRules[i].rule)){
                        AV.color=AVRules[i].color
                    }
                }else{
                    if(eval(AV.AVnum+AVRules[i].rule1)){
                        AV.color=AVRules[i].color
                    }
                }
            }
        }
        //R 判断条件
        for(var i=0;i<AttributeStyles.RStyles.length;i++){
            var item={}
            if(Number(AttributeStyles.RStyles[i].RangeSymbol)!=0&&AttributeStyles.RStyles[i].RangeSymbol!=undefined){
                if(Number(AttributeStyles.RStyles[i].RangeSymbol)==1){
                    item.rule=">"+AttributeStyles.RStyles[i].RangeNumber
                }else if(Number(AttributeStyles.RStyles[i].RangeSymbol)==2){
                    item.rule="<"+AttributeStyles.RStyles[i].RangeNumber
                }else if(Number(AttributeStyles.RStyles[i].RangeSymbol)==3){
                    item.rule="=="+AttributeStyles.RStyles[i].RangeNumber
                }else if(Number(AttributeStyles.RStyles[i].RangeSymbol)==4){
                    item.rule=">="+AttributeStyles.RStyles[i].RangeNumber
                }else if(Number(AttributeStyles.RStyles[i].RangeSymbol)==5){
                    item.rule="<="+AttributeStyles.RStyles[i].RangeNumber
                }
            }else{
                item.rule=null
            }
            if(Number(AttributeStyles.RStyles[i].RangeSymbol1)!=0&&AttributeStyles.RStyles[i].RangeSymbol1!=undefined){
                if(Number(AttributeStyles.RStyles[i].RangeSymbol1)==1){
                    item.rule1=">"+AttributeStyles.RStyles[i].RangeNumber1
                }else if(Number(AttributeStyles.RStyles[i].RangeSymbol1)==2){
                    item.rule1="<"+AttributeStyles.RStyles[i].RangeNumber1
                }else if(Number(AttributeStyles.RStyles[i].RangeSymbol1)==3){
                    item.rule1="=="+AttributeStyles.RStyles[i].RangeNumber1
                }else if(Number(AttributeStyles.RStyles[i].RangeSymbol1)==4){
                    item.rule1=">="+AttributeStyles.RStyles[i].RangeNumber1
                }else if(Number(AttributeStyles.RStyles[i].RangeSymbol1)==5){
                    item.rule1="<="+AttributeStyles.RStyles[i].RangeNumber1
                }
            }else{
                item.rule1=null
            }
            item.color=AttributeStyles.RStyles[i].BackgroundColor
            item.dSFrameColorTransparency1=AttributeStyles.RStyles[i].dSFrameColorTransparency1
            RRules.push(item)
        }
        //CP判断条件
        for(var i=0;i<AttributeStyles.CPStyles.length;i++){
            var item={}
            if(Number(AttributeStyles.CPStyles[i].RangeSymbol)!=0&&AttributeStyles.CPStyles[i].RangeSymbol!=undefined){
                if(Number(AttributeStyles.CPStyles[i].RangeSymbol)==1){
                    item.rule=">"+AttributeStyles.CPStyles[i].RangeNumber
                }else if(Number(AttributeStyles.CPStyles[i].RangeSymbol)==2){
                    item.rule="<"+AttributeStyles.CPStyles[i].RangeNumber
                }else if(Number(AttributeStyles.CPStyles[i].RangeSymbol)==3){
                    item.rule="=="+AttributeStyles.CPStyles[i].RangeNumber
                }else if(Number(AttributeStyles.CPStyles[i].RangeSymbol)==4){
                    item.rule=">="+AttributeStyles.CPStyles[i].RangeNumber
                }else if(Number(AttributeStyles.CPStyles[i].RangeSymbol)==5){
                    item.rule="<="+AttributeStyles.CPStyles[i].RangeNumber
                }
            }else{
                item.rule=null
            }
            if(Number(AttributeStyles.CPStyles[i].RangeSymbol1)!=0&&AttributeStyles.CPStyles[i].RangeSymbol1!=undefined){
                if(Number(AttributeStyles.CPStyles[i].RangeSymbol1)==1){
                    item.rule1=">"+AttributeStyles.CPStyles[i].RangeNumber1
                }else if(Number(AttributeStyles.CPStyles[i].RangeSymbol1)==2){
                    item.rule1="<"+AttributeStyles.CPStyles[i].RangeNumber1
                }else if(Number(AttributeStyles.CPStyles[i].RangeSymbol1)==3){
                    item.rule1="=="+AttributeStyles.CPStyles[i].RangeNumber1
                }else if(Number(AttributeStyles.CPStyles[i].RangeSymbol1)==4){
                    item.rule1=">="+AttributeStyles.CPStyles[i].RangeNumber1
                }else if(Number(AttributeStyles.CPStyles[i].RangeSymbol1)==5){
                    item.rule1="<="+AttributeStyles.CPStyles[i].RangeNumber1
                }
            }else{
                item.rule1=null
            }
            item.color=AttributeStyles.CPStyles[i].BackgroundColor
            item.dSFrameColorTransparency1=AttributeStyles.CPStyles[i].dSFrameColorTransparency1
            CPRules.push(item)
        }
        //CPK 判断条件
        for(var i=0;i<AttributeStyles.CPKStyles.length;i++){
            var item={}
            if(Number(AttributeStyles.CPKStyles[i].RangeSymbol)!=0&&AttributeStyles.CPKStyles[i].RangeSymbol!=undefined){
                if(Number(AttributeStyles.CPKStyles[i].RangeSymbol)==1){
                    item.rule=">"+AttributeStyles.CPKStyles[i].RangeNumber
                }else if(Number(AttributeStyles.CPKStyles[i].RangeSymbol)==2){
                    item.rule="<"+AttributeStyles.CPKStyles[i].RangeNumber
                }else if(Number(AttributeStyles.CPKStyles[i].RangeSymbol)==3){
                    item.rule="=="+AttributeStyles.CPKStyles[i].RangeNumber
                }else if(Number(AttributeStyles.CPKStyles[i].RangeSymbol)==4){
                    item.rule=">="+AttributeStyles.CPKStyles[i].RangeNumber
                }else if(Number(AttributeStyles.CPKStyles[i].RangeSymbol)==5){
                    item.rule="<="+AttributeStyles.CPKStyles[i].RangeNumber
                }
            }else{
                item.rule=null
            }
            if(Number(AttributeStyles.CPKStyles[i].RangeSymbol1)!=0&&AttributeStyles.CPKStyles[i].RangeSymbol1!=undefined){
                if(Number(AttributeStyles.CPKStyles[i].RangeSymbol1)==1){
                    item.rule1=">"+AttributeStyles.CPKStyles[i].RangeNumber1
                }else if(Number(AttributeStyles.CPKStyles[i].RangeSymbol1)==2){
                    item.rule1="<"+AttributeStyles.CPKStyles[i].RangeNumber1
                }else if(Number(AttributeStyles.CPKStyles[i].RangeSymbol1)==3){
                    item.rule1="=="+AttributeStyles.CPKStyles[i].RangeNumber1
                }else if(Number(AttributeStyles.CPKStyles[i].RangeSymbol1)==4){
                    item.rule1=">="+AttributeStyles.CPKStyles[i].RangeNumber1
                }else if(Number(AttributeStyles.CPKStyles[i].RangeSymbol1)==5){
                    item.rule1="<="+AttributeStyles.CPKStyles[i].RangeNumber1
                }
            }else{
                item.rule1=null
            }
            item.color=AttributeStyles.CPKStyles[i].BackgroundColor
            item.dSFrameColorTransparency1=AttributeStyles.CPKStyles[i].dSFrameColorTransparency1
            CPKRules.push(item)
        }
        //改变R CP CPK色值
        for(var n=0;n<data.length;n++){
            if(data[n].name=="R"){
                for(var i=0;i<RRules.length;i++){
                    if(RRules[i].rule!=null && RRules[i].rule1!=null){
                        if(eval(data[n].num+RRules[i].rule)&&eval(data[n].num+RRules[i].rule1)){
                            data[n].color=RRules[i].color
                        }
                    }else if(RRules[i].rule!=null || RRules[i].rule1!=null){
                        if(RRules[i].rule!=null){
                            if(eval(data[n].num+RRules[i].rule)){
                                data[n].color=RRules[i].color
                            }
                        }else{
                            if(eval(data[n].num+RRules[i].rule1)){
                                data[n].color=RRules[i].color
                            }
                        }
                    }
                }
            }else if(data[n].name=="CP"){
                for(var i=0;i<CPRules.length;i++){
                    if(CPRules[i].rule!=null && CPRules[i].rule1!=null){
                        if(eval(data[n].num+CPRules[i].rule)&&eval(data[n].num+CPRules[i].rule1)){
                            data[n].color=CPRules[i].color
                        }
                    }else if(CPRules[i].rule!=null || CPRules[i].rule1!=null){
                        if(CPRules[i].rule!=null){
                            if(eval(data[n].num+CPRules[i].rule)){
                                data[n].color=CPRules[i].color
                            }
                        }else{
                            if(eval(data[n].num+CPRules[i].rule1)){
                                data[n].color=CPRules[i].color
                            }
                        }
                    }
                }
            }else if(data[n].name=="CPK"){
                for(var i=0;i<CPKRules.length;i++){
                    if(CPKRules[i].rule!=null && CPKRules[i].rule1!=null){
                        if(eval(data[n].num+CPKRules[i].rule)&&eval(data[n].num+CPKRules[i].rule1)){
                            data[n].color=CPKRules[i].color
                        }
                    }else if(CPKRules[i].rule!=null || CPKRules[i].rule1!=null){
                        if(CPKRules[i].rule!=null){
                            if(eval(data[n].num+CPKRules[i].rule)){
                                data[n].color=CPKRules[i].color
                            }
                        }else{
                            if(eval(data[n].num+CPKRules[i].rule1)){
                                data[n].color=CPKRules[i].color
                            }
                        }
                    }
                }
            }

        }
    }
    var direction=[];//方向
    $("input[name='alone']").each(function (num,val) {//插入方向
        if($(val).prop("checked")){
            if(num==0){
                var item={}
                item.direction="X"
                direction.push(item)
            }else if(num==1){
                var item={}
                item.direction="Y"
                direction.push(item)
            }else if(num == 2){
                var item={}
                item.direction="Z"
                direction.push(item)
            }
        }
    });
    for(var i=0;i<direction.length;i++){//重绘html
        var borderWidth=1;
        if(i!=0){
            borderWidth=0;
        }
        var html='';
        html+='<div class="'+ids+'Box fl BarBox" style="border-left-width:'+borderWidth+'px">'
        html+='<div id="'+ids+direction[i].direction+'Header" style="width: 140px;margin:5px;background-color: '+AV.color+'" class="clearfix" >'
        html+='<p id="'+ids+direction[i].direction+'Headerone" class="col-4 Mrgin0">'+AV.name+'</p>'
        html+='<p id="'+ids+direction[i].direction+'HeaderTwo" class="col-4 Mrgin0 text-center">'+AV.AVnum+'</p>'
        html+='<p id="'+ids+direction[i].direction+'HeaderThree" class="col-4 Mrgin0 text-right">'+AV.tolerance+'</p>'
        html+='</div>'
        html+='<div id="'+ids+direction[i].direction+'" style="width: 150px;height: 100px"></div>'
        html+='<p class="text-center Mrgin0" style="width: 150px;">'+pointName[i]+'</p>'
        html+='<table  class="BarTable" id="testXTable" style="width: 149px;height: 10px;">'
        for(var m=0;m<2;m++){
            html+="<tr>"
            for(var n=0;n<data.length;n++){
                if(m==0){
                    html+='<td style="background-color:'+data[n].color+'">'+data[n].name+'</td>'
                }else{
                    html+='<td>'+data[n].num+'</td>'
                }
            }
            html+="</tr>"
        }
        html+='</table>'
        html+='</div>'
        $("#"+ids).append(html)
        var settings = {
            id: "#"+ids+direction[i].direction,
            width: 150,
            height: 100,
            data: [0.5, -1.3, 0.8, 1.3, -5],
            color:[],
            Identification: [{ //标识线数据格式
                color: 'blue',
                value: 1.3,
                lineWidth: "5,5",
                lineStyle: "real" //实线
            }, { //标识线数据格式
                color: 'blue',
                value: -1.3,
                lineWidth: "5,5",
                lineStyle: "real" //实线
            }, {
                color: 'blue',
                value: -2.4,
                lineWidth: "10,10",
                lineStyle: "empty" //虚线
            }, {
                color: 'blue',
                value: 2.4,
                lineWidth: "10,10",
                lineStyle: "empty" //虚线
            }],
        }
        for(var m=0;m<settings.data.length;m++){
            if(settings.data[m]>=0){
                if(settings.data[m]>Number(UpperDeviation)){//红色
                    settings.color.push("red")
                }else if(settings.data[m]>Number(UpperDeviation)*0.8){//黄色
                    settings.color.push("yellow")
                }else{//绿色
                    settings.color.push("green")
                }
            }else{
                if(settings.data[m]<Number(LowerDeviation)){//红色
                    settings.color.push("red")
                }else if(settings.data[m]<Number(LowerDeviation)*0.8){//黄色
                    settings.color.push("yellow")
                }else{//绿色
                    settings.color.push("green")
                }
            }
        }
        HistoryChart(settings)
    }

}

//母版属性保存
function MubanSaveAttribute(e){
    var AttributeStyles = {};
    AttributeStyles.ModelSize=$(".muban #ModelSize").val()
    if(AttributeStyles.ModelSize==1){
        $(".reportContCont").css({"height":"1075px","width":"1567px"})
        $(".paperSize").css({"height":"1095px","width":"1587px"})
        $(".reportSlide").css("height",1147+"px")
        $(".reportRhide ").css("height",1147+"px")
    }
    AttributeStyles.borderColor=$(".muban .borderColor").val()
    AttributeStyles.borderWidth=$(".muban #borderWidth").val()
    AttributeStyles.borderType=$(".muban #borderType").val()
    AttributeStyles.LeftPadding=$(".muban #LeftPadding").val()
    AttributeStyles.TopPadding=$(".muban #TopPadding").val()
    AttributeStyles.RightPadding=$(".muban #RightPadding").val()
    AttributeStyles.BottomPadding=$(".muban #BottomPadding").val()
    $(".reportContCont").css({
        "border":AttributeStyles.borderWidth+"px "+ AttributeStyles.borderType+" "+AttributeStyles.borderColor,
        "padding-left":AttributeStyles.LeftPadding+"px",
        "padding-top":AttributeStyles.TopPadding+"px",
        "padding-right":AttributeStyles.RightPadding+"px",
        "padding-bottom":AttributeStyles.BottomPadding+"px",

    })
    localStorage.setItem("MubanAttribute",JSON.stringify(AttributeStyles))
    // AttributeStyles.
    return false
}
//新建页面
function NewPage(e){
    if(Number($(".reportSlideNavUl .on").attr("data-num"))==1){
        $(".reportContCont").empty()
        $(".reportSlidecont .reportPager").find("p").removeClass("on")
        $(".reportSlidecont .reportPager").append("<p class='on'>页面"+($('.reportSlidecont .reportPager').find('p').length+1)+"</p>")
    }else{
        $(".reportContCont").empty()
        $(".reportSlidecont .MasterEdition").find("p").removeClass("on")
        $(".reportSlidecont .MasterEdition").append("<p class='on'>母版"+($('.reportSlidecont .MasterEdition').find('p').length+1)+"</p>")
    }
}
//删除页面 删除模板
function deletePager(e){
    if(Number($(".reportSlideNavUl .on").attr("data-num"))==1){
        var num=$(".reportSlidecont .reportPager").find("p.on").index()
        $(".reportSlidecont .reportPager").find("p.on").remove()
        if(num!=0){
            $(".reportSlidecont .reportPager").find("p:eq("+(num-1)+")").addClass("on")
        }else{
            $(".reportSlidecont .reportPager").find("p:eq(0)").addClass("on")
        }

    }else{
        var num=$(".reportSlidecont .MasterEdition").find("p.on").index()
        $(".reportSlidecont .MasterEdition").find("p.on").remove()
        if(num!=0){
            $(".reportSlidecont .MasterEdition").find("p:eq("+(num-1)+")").addClass("on")
        }else{
            $(".reportSlidecont .MasterEdition").find("p:eq(0)").addClass("on")
        }
    }
}
