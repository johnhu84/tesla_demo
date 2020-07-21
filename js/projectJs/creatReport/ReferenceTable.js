$(function(){
	//基准表 饼图


	// 箱线

})
//堆积图

function StackingMapDataStyleAdd(e){//数据样式添加
	var html = ""
	html += '<div class="cellAttribute"  style="position: relative">'
	html += '<span onclick="DataStyleDelete(this)" style="display: none;position: absolute;top: 5px" class="IndicatorLineDelete bigDeleteAttributeCommand element elshanchu11 fl MrginL10"></span>'
	html += '<div class="bigAttribute" style="margin-top: 10px">'
	html += '<div class="AddingConditions">'
	html += '<ul>'
	html+='<li>'
	html+='<label>区间节点</label>'
	html+='<select style="max-width: 50px" onchange="DataChangeVariable(this)" class="dSStyleSel1">'
	html+='<option value="1">常量</option>'
	html+='<option value="2">上公差</option>'
	html+='<option value="3">下公差</option>'
	html+='</select>'
	html+='<select style="max-width: 40px;margin-left: 5px !important;display: none"  class="SymbolicOperation1">'
	html+='<option value="1"> * </option>'
	html+='</select>'
	html+='<input class="iLInputFrom"  max="100" min="-100" style="width: 40px;margin-left: 5px !important;" type="text">'
	// html+='<input class="MrginL10 iLInputTo"  max="100" min="-100" style="width: 40px;margin-right: 10px" type="text">'
	html+='</li>'
	html += '<li>'
	html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
	html += '<li>'
	html += '<label>'
	html += '<input type="checkbox" checked class="dSCb1">'
	html += '<span style="vertical-align: top;">底色</span>'
	html += '</label>'
	html += '<div style="" class="fl BGCDiv">'
	html += '<div style="width:60px;" class="evo-cp-wrap">'
	html += '<input id="BackgroundColor" style="" onchange="BackgroundColor(this)" class="DSBgColor BackgroundColor BackgroundColor1 colorPicker evo-cp15" value="#FFF">'
	html += '<div class="evo-pointer evo- colorind" style="background-color:#FFF"></div>'
	html += '</div>'
	html += '</div>'
	html += '<input type="number" placeholder="透明度" value="" min="0" max="100" class="dSBgColorTransparency1 fl " style="max-width: 100px;">'
	html += '</li>'
	html += '</ul>'
	html += '</li>'
	html += '<li>'
	html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
	html += '<li>'
	html += '<label>'
	html += '<input type="checkbox" checked class="dSCb2">'
	html += '<span style="vertical-align: top;">边框</span>'
	html += '</label><div style="" class="fl BGCDiv">'
	html += '<div style="width:60px;" class="evo-cp-wrap">'
	html += '<input id="BackgroundColor" style="" onchange="BackgroundColor(this)" class="BorderColor  BackgroundColor colorPicker evo-cp16 dSFrameBgColor" value="#FFF">'
	html += '<div class="evo-pointer evo-colorind" style="background-color:#FFF">'
	html += '</div>'
	html += '</div>'
	html += '</div>'
	html += '<input type="number" placeholder="宽度" value="" min="0" max="100" class="fl dSWidth" style="max-width: 100px;">'
	html += '</li>'
	html += '</ul>'
	html += '</li>'
	// html += '<li>'
	// html += '<label></label>'
	// html += '<div class="publicSelect fl" style="">'
	// html += '<p class="publicSelectInput" style=""></p>'
	// html += '<div class="publicSelectBody" style="">'
	// html += '<p class="publicSelectBodyP"><span class="element elxuxian" value="empty"></span></p>'
	// html += '<p class="publicSelectBodyP"><span class="element elshixianhei" value="real"></span></p>'
	// html += '</div>'
	// html += '</div>'
	// html += '</li>'
	// html += '<li>'
	// html += '<label>'
	// html += '<input type="checkbox" checked  class="dSCb3">'
	// html += '<span style="vertical-align: top;">显示数值</span></label>'
	// html += '</li>'
	html += '</ul>'
	html += '</div>'
	html += '</div>'
	html += '</div>'
	$(e).parents(".publicStyle").find(".DataStyleAdd").append(html)

	$(e).parents(".publicStyle").find(".DataStyleAdd").find(".cellAttribute:last-child").find("#BackgroundColor").colorpicker() //底色调用
}


//基准表 饼图
function ReferenceableDataStyleAdd(e){//数据样式添加
	var html = ""
	html += '<div class="cellAttribute"  style="position: relative">'
	html += '<span onclick="DataStyleDelete(this)" style="display: none;position: absolute;top: 5px" class="IndicatorLineDelete bigDeleteAttributeCommand element elshanchu11 fl MrginL10"></span>'
	html += '<div class="bigAttribute" style="margin-top: 10px">'
	html += '<div class="AddingConditions">'
	html += '<ul>'
	html+='<li>'
	html+='<label>数值区间</label><input class="iLInputFrom" style="width: 40px;margin-right: 10px" type="text">-'
	html+='<input class="MrginL10 iLInputTo" style="width: 40px;margin-right: 10px" type="text">'
	html+='</li>'
	html += '<li>'
	html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
	html += '<li>'
	html += '<label>'
	html += '<input type="checkbox" checked  class="dSCb1">'
	html += '<span style="vertical-align: top;">底色</span>'
	html += '</label>'
	html += '<div style="" class="fl BGCDiv">'
	html += '<div style="width:60px;" class="evo-cp-wrap">'
	html += '<input id="BackgroundColor" style="" onchange="BackgroundColor(this)" class="BackgroundColor BackgroundColor1 colorPicker evo-cp15" value="#FFF">'
	html += '<div class="evo-pointer evo- colorind" style="background-color:#FFF"></div>'
	html += '</div>'
	html += '</div>'
	html += '<input type="number" placeholder="透明度" value="" min="0" max="100" class="fl dSTransparency1" style="max-width: 100px;">'
	html += '</li>'
	html += '</ul>'
	html += '</li>'
	html += '<li>'
	html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
	html += '<li>'
	html += '<label>'
	html += '<input type="checkbox" checked  class="dSCb2">'
	html += '<span style="vertical-align: top;">边框</span>'
	html += '</label><div style="" class="fl BGCDiv">'
	html += '<div style="width:60px;" class="evo-cp-wrap">'
	html += '<input id="BackgroundColor" style="" onchange="BackgroundColor(this)" class="BackgroundColor colorPicker evo-cp16 dSFrameBgColor" value="#FFF">'
	html += '<div class="evo-pointer evo-colorind" style="background-color:#FFF">'
	html += '</div>'
	html += '</div>'
	html += '</div>'
	html += '<input type="number" placeholder="宽度" value="" min="0" max="100" class="fl dSWidth" style="max-width: 100px;">'
	html += '</li>'
	html += '</ul>'
	html += '</li>'
	html += '<li>'
	html += '<label></label>'
	html += '<div class="publicSelect fl" style="">'
	html += '<p class="publicSelectInput" style=""></p>'
	html += '<div class="publicSelectBody" style="">'
	html += '<p class="publicSelectBodyP"><span class="element elxuxian" value="empty"></span></p>'
	html += '<p class="publicSelectBodyP"><span class="element elshixianhei" value="real"></span></p>'
	html += '</div>'
	html += '</div>'
	html += '</li>'
	html += '<li>'
	html += '<label>'
	html += '<input type="checkbox" checked  class="dSCb3">'
	html += '<span style="vertical-align: top;">显示数值</span></label>'
	html += '</li>'
	html += '</ul>'
	html += '</div>'
	html += '</div>'
	html += '</div>'

	$(e).parents(".publicStyle").find(".DataStyleAdd").append(html)
	$(e).parents(".publicStyle").find(".DataStyleAdd").find(".cellAttribute:last-child").find("#BackgroundColor").colorpicker() //底色调用
}


// 箱线
function BoxDataStyleAdd(e){//数据样式添加
	var html = ""
	html += '<div class="cellAttribute"  style="position: relative">'
	html += '<span onclick="DataStyleDelete(this)" style="display: none;position: absolute;top: 5px" class="IndicatorLineDelete bigDeleteAttributeCommand element elshanchu11 fl MrginL10"></span>'
	html += '<div class="bigAttribute" style="margin-top: 10px">'
	html += '<div class="AddingConditions">'
	html += '<ul>'
	html += '<li>'
	html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
	html += '<li>'
	html += '<label>'
	html += '<input type="checkbox"  checked class="dSCb1">'
	html += '<span style="vertical-align: top;">底色</span>'
	html += '</label>'
	html += '<div style="" class="fl BGCDiv">'
	html += '<div style="width:60px;" class="evo-cp-wrap">'
	html += '<input id="BackgroundColor" style="" onchange="BackgroundColor(this)" class="BackgroundColor BackgroundColor1 colorPicker evo-cp15" value="#FFF">'
	html += '<div class="evo-pointer evo- colorind" style="background-color:#FFF"></div>'
	html += '</div>'
	html += '</div>'
	html += '<input type="number" placeholder="透明度" value="" min="0" max="100" class="fl dSTransparency1" style="max-width: 100px;">'
	html += '</li>'
	html += '</ul>'
	html += '</li>'
	html += '<li>'
	html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
	html += '<li>'
	html += '<label>'
	html += '<input type="checkbox" checked  class="dSCb2">'
	html += '<span style="vertical-align: top;">边框</span>'
	html += '</label><div style="" class="fl BGCDiv">'
	html += '<div style="width:60px;" class="evo-cp-wrap">'
	html += '<input id="BackgroundColor" style="" onchange="BackgroundColor(this)" class="BackgroundColor colorPicker evo-cp16 dSFrameBgColor" value="#FFF">'
	html += '<div class="evo-pointer evo-colorind" style="background-color:#FFF">'
	html += '</div>'
	html += '</div>'
	html += '</div>'
	html += '<input type="number" placeholder="宽度" value="" min="0" max="100" class="fl dSWidth" style="max-width: 100px;">'
	html += '</li>'
	html += '</ul>'
	html += '</li>'
	html += '<li>'
	html += '<label></label>'
	html += '<div class="publicSelect fl" style="">'
	html += '<p class="publicSelectInput" style=""></p>'
	html += '<div class="publicSelectBody" style="">'
	html += '<p class="publicSelectBodyP"><span class="element elxuxian" value="empty"></span></p>'
	html += '<p class="publicSelectBodyP"><span class="element elshixianhei" value="real"></span></p>'
	html += '</div>'
	html += '</div>'
	html += '</li>'
	html += '<li>'
	html += '<label>'
	html += '<input type="checkbox"  checked  class="dSCb3">'
	html += '<span style="vertical-align: top;">显示数值</span></label>'
	html += '</li>'
	html += '</ul>'
	html += '</div>'
	html += '</div>'
	html += '</div>'

	$(e).parents(".publicStyle").find(".DataStyleAdd").append(html)
	$(e).parents(".publicStyle").find(".DataStyleAdd").find(".cellAttribute:last-child").find("#BackgroundColor").colorpicker() //底色调用
}


// 控制图ControlChartDataStyleAdd

function ControlChartDataStyleAdd(e){//控制图数据样式添加
	var html = ""
	html += '<div class="cellAttribute"  style="position: relative">'
	html += '<span onclick="DataStyleDelete(this)" style="display: none;position: absolute;top: 5px" class="IndicatorLineDelete bigDeleteAttributeCommand element elshanchu11 fl MrginL10"></span>'
	html += '<div class="bigAttribute" style="margin-top: 10px">'
	html += '<div class="AddingConditions">'
	html += '<ul>'
	html += '<li>'
	html += '<label>图示</label>'
	html += '<select data-mode id=""   class="DataMapStyle">'
	html += '<option value="0">请选择</option>'
	html += '<option value="1">A图</option>'
	html += '<option value="2">B图</option>'
	html += '</select>'
	html += '</li>'
	html += '<li>'
	html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
	html += '<li>'
	html += '<label>'
	html += '<input type="checkbox" checked  class="dSCb1">'
	html += '<span style="vertical-align: top;">底色</span>'
	html += '</label>'
	html += '<div style="" class="fl BGCDiv">'
	html += '<div style="width:60px;" class="evo-cp-wrap">'
	html += '<input id="BackgroundColor" style="" onchange="BackgroundColor(this)" class="DSBgColor BackgroundColor BackgroundColor1 colorPicker evo-cp15" value="#FFF">'
	html += '<div class="evo-pointer evo- colorind" style="background-color:#FFF"></div>'
	html += '</div>'
	html += '</div>'
	html += '<input type="number" placeholder="透明度" value="" min="0" max="100" class="dSBgColorTransparency1 fl " style="max-width: 100px;">'
	html += '</li>'
	html += '</ul>'
	html += '</li>'
	html += '<li>'
	html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
	html += '<li>'
	html += '<label>'
	html += '<input type="checkbox"  checked class="dSCb2">'
	html += '<span style="vertical-align: top;">边框</span>'
	html += '</label><div style="" class="fl BGCDiv">'
	html += '<div style="width:60px;" class="evo-cp-wrap">'
	html += '<input id="BackgroundColor" style="" onchange="BackgroundColor(this)" class="BorderColor BackgroundColor colorPicker evo-cp16 dSFrameBgColor" value="#FFF">'
	html += '<div class="evo-pointer evo-colorind" style="background-color:#FFF">'
	html += '</div>'
	html += '</div>'
	html += '</div>'
	html += '<input type="number" placeholder="宽度" value="" min="0" max="100" class="fl dSWidth" style="max-width: 100px;">'
	html += '</li>'
	html += '</ul>'
	html += '</li>'
	html += '<li>'
	html += '<label>数据样式</label>'
	html += '<div style="position: relative;float: left" class="DataType">'
	html += '<p class="Mrgin0 DataTypeShow">'
	html += '<span class="element elyuanxing2" value="6" style="margin-left: 10px !important;"></span>'
	html += '</p>'
	html += '<div class="DataTypeBody" style="padding:7px 0px">'
	html += '<span class="element elzhengfangxing" value="3" style="margin-left: 10px !important;"></span>'
	// html += '<span class="element elduobianxing" value="9" style="margin-left: 10px !important;"></span>'
	html += '<span class="element elsanjiaoxing" value="5" style="margin-left: 10px !important;"></span>'
	html += '<span class="element elyuanxing2" value="6" style="margin-left: 10px !important;"></span>'
	html += '<span class="element ellingxing2" value="2" style="margin-left: 10px !important;"></span>'
	html += '</div>'
	html += '</div>'
	html += '</li>'
	// html += '<li>'
	// html += '<label>'
	// html += '<input type="checkbox" checked  class="dSCb3">'
	// html += '<span style="vertical-align: top;">显示数值</span></label>'
	// html += '</li>'
	html += '</ul>'
	html += '</div>'
	html += '</div>'
	html += '</div>'

	$(e).parents(".publicStyle").find(".ControlChartDataStyle").append(html)
	$(e).parents(".publicStyle").find(".ControlChartDataStyle").find(".cellAttribute:last-child").find("#BackgroundColor").colorpicker() //底色调用
}



$(function(){
	//指示线数据样式切换
	$(".ControlChart").on("change",".IndicatorLineStyleChange",function(){

		if($(this).val()==1){
			$(this).parents("ul").find("li:eq(2)").remove()
			// $(this).parents("ul").find("li:eq(1)").remove()
			var html="";
			html+='<li>'
			html+='<label>数值区间</label><input class="iLInputFrom" style="width: 40px;margin-right: 10px" type="text">-'
			html+='<input class="MrginL10 iLInputTo" style="width: 40px;margin-right: 10px" type="text">'
			html+='</li>'
		}else if($(this).val()==2){
			$(this).parents("ul").find("li:eq(2)").remove()
			var html="";
			html+='<li>'
			html += '<label>参数</label>'
			html += '<select style="max-width: 160px;margin-left: 2px !important;" class="iLSelParam3">'
			html += '<option value="1">均值</option>'
			html += '<option value="2">零线</option>'
			html += '</select>'
			html += '</li>'
		}
		$(this).parents("ul").find("li:eq(1)").after(html)
	});
	// 控制图图示切换
	$(".ControlChart").on("change",".MapStyle",function(){
		if($(this).parent("li").parent("ul").children("li").length==7){
			$(this).parent("li").parent("ul").children("li:eq(1)").remove()
			$(this).parent("li").parent("ul").children("li:eq(1)").remove()
		}else{
			$(this).parent("li").parent("ul").children("li:eq(1)").remove()
		}

		if(Number($(this).val())==1){
			var html="";
			html+='<li>'
			html+='<label>方式</label>'
			html+='<select data-mode id="IndicatorLineStyleChange"  class="IndicatorLineStyleChange">'
			html+='<option value="1">定义区间</option>'
			html+='<option value="2">选择参数</option>'
			html+='</select>'
			html+='</li>'
			html+='<li>'
			html+='<label>数值区间</label>'
			html+='<input class="iLInputFrom" style="width: 40px;margin-right: 10px" type="text">-'
			html+='<input class="MrginL10 iLInputTo" style="width: 40px;margin-right: 10px" type="text">'
			html+='</li>'
			$(this).parents("ul").children("li:eq(0)").after(html)
		}else if(Number($(this).val()==2)){
			var html="";
			var html="";
			html+='<li>'
			html += '<label>参数</label>'
			html += '<input type="number" class="ParameterNum" value="1"  style="max-width: 160px;margin-left: 2px !important;" />'
			html += '</li>'
			$(this).parents("ul").children("li:eq(0)").after(html)
		}else{
			var html="";
			html+='<li>'
			html+='<label>方式</label>'
			html+='<select data-mode id="IndicatorLineStyleChange"  class="IndicatorLineStyleChange">'
			html+='<option value="1">定义区间</option>'
			html+='<option value="2">选择参数</option>'
			html+='</select>'
			html+='</li>'
			html+='<li>'
			html+='<label>数值区间</label>'
			html+='<input class="iLInputFrom" style="width: 40px;margin-right: 10px" type="text">-'
			html+='<input class="MrginL10 iLInputTo" style="width: 40px;margin-right: 10px" type="text">'
			html+='</li>'
			$(this).parents("ul").children("li:eq(0)").after(html)
		}

	})

	////控制图  图表类型切换
	$(".operationCont").on("change",".ControlChartType",function(){
		// <option value="1">X-MR</option>
		// <option value="2">MA-MR</option>
		// <option value="3">Xbar-R</option>
		// <option value="4">Xbar-S</option>
		if($(this).val()==1){

			$(this).parent("li").next("li").children("input").attr("disabled",true)
		}else if($(this).val()==2){
			$(this).parent("li").next("li").children("input").attr("disabled",true)
		}else if($(this).val()==3){
			$(this).parent("li").next("li").children("input").attr("disabled",false)
		}else if($(this).val()==4){
			$(this).parent("li").next("li").children("input").attr("disabled",false)
		}
	})
})

//帕累托图

function ParetoDiagramLineAdd(e){//指示线添加
	var html = ""
	html += '<div class="cellAttribute"  style="position: relative">'
	html += '<span onclick="IndicatorLineDelete(this)" style="display: none;position: absolute;top: 15px" class="IndicatorLineDelete bigDeleteAttributeCommand element elshanchu11 fl MrginL10"></span>'
	html += '<div class="bigAttribute">'
	html += '<div class="AddingConditions">'
	html += '<ul>'
	html += '<li>'
	html += '<label>方式</label>'
	html += '<select id="" class="IndicatorLineStyleChange iLSel1">'
	html += '<option value="1">定义区间</option>'
	html += '<option value="2">选择参数</option>'
	// html += '<option value="3">椭圆</option>'
	html += '</select>'
	html += '</li>'
	html+='<li>'
	html+='<label>数值区间</label><input class="iLInputFrom" style="width: 40px;margin-right: 10px" type="text">-'
	html+='<input class="MrginL10 iLInputTo" style="width: 40px;margin-right: 10px" type="text">'
	html+='</li>'
	html+='<li>'
	html+='<label>宽度</label>'
	html+='<input type="number" class="iLWidthInput1" value="1"  style="max-width: 160px;" />'
	html+='</li>'
	html += '<li>'
	html += '<label>类型</label>'
	html += '<div class="publicSelect fl" style="">'
	html += '<p class="publicSelectInput" style=""></p>'
	html += '<div class="publicSelectBody" style="">'
	html += '<p class="publicSelectBodyP"><span class="element elxuxian"></span></p>'
	html += '<p class="publicSelectBodyP"><span class="element elshixianhei"></p>'
	html += '</div>'
	html += '</div>'
	html += '</li>'
	html += '<li>'
	html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
	html += '<li>'
	html += '<label>'
	html += '<span style="vertical-align: top;">颜色</span></label>'
	html += '<div style="" class="fl BGCDiv">'
	html += '<input id="BackgroundColor" style="" onchange="BackgroundColor(this)" style="max-width: 20px;" class="iLColor1 BackgroundColor" value="#FFF" />'
	html += '</div>'
	html += '<input type="number" placeholder="请输入值" value="100" min="0" max="100" class="iLInput2 fl" style="max-width: 100px;" />'
	html += '</li>'
	html += '</ul>'
	html += '</li>'
	html += '<li><label><input class="iLCb1" checked type="checkbox"><span style="vertical-align: top;">显示数值</span></label></li>'
	html += '</ul>'
	html += '</div>'
	html += '</div>'

	html += '</div>'

	$(e).parents(".publicStyle").find(".ParetoDiagramLineAdd").append(html)
	$(e).parents(".publicStyle").find(".ParetoDiagramLineAdd").find(".cellAttribute:last-child").find("#BackgroundColor").colorpicker() //底色调用
}



