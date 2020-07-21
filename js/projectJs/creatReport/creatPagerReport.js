//muban stuff
var muban_handsonTable_arr = []
var muban_handsonTableImgs = []//array of {}'s
var muban_handsonTableNextId = 0
var muban_Imgs = []
var yemianOrMubanMode = 1 //1 is yemian, 2 is muban
var handsonTableSelected = -1
//array of all handsonTables
var handsonTable;
var handsonTableOptions;
var handsonTableHelperObj = {};
var handsonTableArr = [];
var handsonTableOptions = [];
var BigobjHelper;
var handsonTableHelperObjArr = [];
var handsonTableHelperObjImgs = {};
var handsonTableHelperObjParetos = {};
var handsonTableHelperObjParetoSettings = {};
var handsonTableHelperObjTrendMaps = {};
var handsonTableHelperObjTrendMapSettings = {};
var handsonTableHelperObjHistograms = {};
var handsonTableHelperObjHistogramSettings = {};
var handsonTableHelperObjControlCharts = {};
var handsonTableHelperObjControlChartSettings = {};
var handsonTableHelperObjBoxLineCharts = {};
var handsonTableHelperObjBoxLineChartSettings = {};
var handsonTableHelperObjSigmaMaps = {};
var handsonTableHelperObjSigmaMapSettings = {};
var handsonTableHelperObjPieCharts = {};
var handsonTableHelperObjPieChartSettings = {};
var handsonTableHelperObjStackingMapCharts = {};
var handsonTableHelperObjStackingMapChartSettings = {};
var handsonTableHelperObjHelper = {};
//Use this, as ajax live connection tracker, when zero, call something like the movePareto charts function
var handsonTableActiveAjaxCalls = 0;
localStorage.setItem('handsonTableHelperObj', JSON.stringify(handsonTableHelperObj));
$(function() {


	//边框类型事件

	$(".reportRhide").on("click",".publicSelectInput",function(){

		if($(this).next().css("display")=="none"){
			$(this).next().slideDown()
		}else{
			$(this).next().slideUp()
		}
	})

	$(".reportRhide").on("click",".publicSelectBodyP",function(){
		$(this).parent(".publicSelectBody").slideUp()
		$(this).parent(".publicSelectBody").siblings(".publicSelectInput").html($(this).html())
		$(this).parent(".publicSelectBody").siblings(".publicSelectInput").attr("value",$(this).find("span").attr("value"))
	})
	//数据样式
	$(".publicStyle").on("click","p.DataTypeShow",function(){
		if($(this).next("div").css("display")=="none"){
			$(this).next("div").slideDown();
		}else{
			$(this).next("div").slideUp();
		}
	})
	$(".publicStyle").on("click","span",function(){
		$(this).parents(".DataType").find(".DataTypeShow>span").attr("class",$(this)[0].className)
		$(this).parents(".DataType").find(".DataTypeShow>span").attr("value",$(this).attr("value"))
		$(this).parent(".DataTypeBody").slideUp();
	})
	//指示线数据样式切换
	$(".IndicatorLineAdd").on("change",".IndicatorLineStyleChange",function(){
		$(this).parents("ul").find("li:eq(1)").remove()
		$(this).parents("ul").find("li:eq(1)").remove()
		if($(this).val()==1){
			var html="";
			html+='<li>'
			html+='<label>数值区间</label><input class="iLInputFrom" style="width: 40px;margin-right: 10px" type="text">-'
			html+='<input class="MrginL10 iLInputTo" style="width: 40px;margin-right: 10px" type="text">'
			html+='</li>'
			html+='<li>'
			html+='<label>宽度</label>'
			html+='<input type="number" class="WidthNumber" value="1"  style="max-width: 160px;" />'
			html+='</li>'
		}else if($(this).val()==2){
			var html="";
			html+='<li>'
			html += '<label>参数</label>'
			html += '<select style="max-width: 50px;margin-left: 2px !important;" class="iLSelParam1">'
            html += '<option value="1">公差</option>'
			html += '<option value="2">均值</option>'
			html += '</select>'
			html += '<select style="max-width: 50px;margin-left: 5px !important;" class="iLSelParam2">'
			html += '<option value="">*</option>'
			html += '</select>'
			html += '<input type="number" class="RangeNumber" value="1"  style="max-width: 60px;margin-left: 2px !important;" />'
			html += '</li>'
			html+='<li>'
			html+='<label>宽度</label>'
			html+='<input type="number" class="WidthNumber" value="1"  style="max-width: 160px;" />'
			html+='</li>'
		}else if($(this).val()==3){
			var html="";
			html+='<li>'
			html+='<label>长轴</label>'
			html+='<input type="number" class="" value="1"  style="max-width: 160px;" />'
			html+='</li>'
			html+='<li>'
			html+='<label>短轴</label>'
			html+='<input type="number" class="" value="1"  style="max-width: 160px;" />'
			html+='</li>'
		}
		$(this).parents("ul").find("li:eq(0)").after(html)
	});
	//数据样式 数据样式切换
	$(".DataStyleAdd").on("change",".DataStyleChange",function(){
		if($(this).val()==1){
			var html="";
			html+='<li>'
			html+='<label>数值区间</label><input class="" style="width: 40px;margin-right: 10px" type="text">-'
			html+='<input class="MrginL10" style="width: 40px;margin-right: 10px" type="text">'
			html+='</li>'
			html+='<li>'
			html+='<label>宽度</label>'
			html+='<input type="number" class="" value="1"  style="max-width: 160px;" />'
			html+='</li>'
		}else if($(this).val()==2){
			var html="";
			html+='<li>'
			html += '<label>参数</label>'
			html += '<select style="max-width: 50px;margin-left: 2px !important;" class="">'
			html += '<option value="">均值</option>'
			html += '</select>'
			html += '<select style="max-width: 50px;margin-left: 5px !important;" class="">'
			html += '<option value="">*</option>'
			html += '</select>'
			html += '<input type="number" class="RangeNumber" value="1"  style="max-width: 60px;margin-left: 2px !important;" />'
			html += '</li>'
			html+='<li>'
			html+='<label>宽度</label>'
			html+='<input type="number" class="" value="1"  style="max-width: 160px;" />'
			html+='</li>'
		}else if($(this).val()==3){
			var html="";
			html+='<li>'
			html+='<label>长轴</label>'
			html+='<input type="number" class="" value="1"  style="max-width: 160px;" />'
			html+='</li>'
			html+='<li>'
			html+='<label>短轴</label>'
			html+='<input type="number" class="" value="1"  style="max-width: 160px;" />'
			html+='</li>';
		}
		if($(this).parent("li").siblings("li").length==3) {
			$(this).parents("ul.DataStyleUl").find("li:eq(0)").after(html)
		}else{
			$(this).parents("ul.DataStyleUl").find("li:eq(1)").remove()
			$(this).parents("ul.DataStyleUl").find("li:eq(1)").remove()
			$(this).parents("ul.DataStyleUl").find("li:eq(0)").after(html)
		}
	});
	// 趋势图X轴单选事件
	$(".checkBoxLi .checkBoxLiradio").click(function(){
		console.log($(this).attr("checked"))
		if($(this).attr("checked")){
			$(this).attr("checked",false)
		}else{
			$(".checkBoxLiradio").attr("checked",false)
			$(this).attr("checked",true)
			// $(this).parents("p").siblings("p").find("checkBoxLiradio").attr("checked",true)
		}
	})
	//点击删除按钮删除组件
	$(".reportContCont").on("click", ".deleteBox", function() {
		$(this).parent(".ui-widget-content").remove()
	})

	//拖拉拽缩放
	$('.box-5 div').each(function() {13
		$(this).dragging({
			move: 'both',
			randomPosition: true,
			hander: '.hander'
		});
	});
	$(".resizable").resizable({
		aspectRatio: false
	});

	//页面，母版，数据源切换
	$(".reportSlideNavUl li").click(function() {
		$(this).addClass("on").siblings().removeClass("on")
		var num = $(this).data("num")
		yemianOrMubanMode = num
		if (num == 1) {
			//show handsonTables
			$('#handsonContainer').each(function() {
				//$(this).show();
				//$(this).css('visibility', 'visible')
				var handsonContainerParents = $(this).parents('.resizabletable')
				if (handsonContainerParents.length > 0) {
					$(handsonContainerParents[0]).css('visibility', 'visible')
				}
			})
			for (var property in handsonTableHelperObjImgs) {
				$('.' + handsonTableHelperObjImgs[property]).css('visibility', 'visible')
			}
			for (var i = 0; i < muban_handsonTableImgs.length; i++) {
				for (var property in muban_handsonTableImgs[i]) {
					$('.' + muban_handsonTableImgs[i][property]).css('visibility', 'hidden')
				}
			}
			for (var i = 0; i < muban_handsonTable_arr.length; i++) {
				//$('#handsonContainer' + i).hide()
				$('#handsonContainer' + i).css('visibility', 'hidden')
				$('#handsonContainer' + i + ' img').each(function(i) {
					$(this).css('visibility', 'hidden')
				})
			}
			// if($(this).attr("data-state")==1){
				$(".reportPager").css("display", "block").siblings().css("display", "none")
				//$(".reportContCont").html("")
				$(".yemianAction").show().siblings().hide()
				var MubanAttribute=JSON.parse(localStorage.getItem("MubanAttribute"))
				console.log(MubanAttribute)
				if (MubanAttribute) {
					$(".yemianAction #ModelSize").attr("value", MubanAttribute.ModelSize)
					$(".yemianAction #borderColor").attr("value", MubanAttribute.borderColor)
					$(".yemianAction #borderColor").css("background-color", MubanAttribute.borderColor)
					$(".yemianAction #borderWidth").attr("value", MubanAttribute.borderWidth)
					$(".yemianAction #borderType").attr("value", MubanAttribute.borderType)
					$(".yemianAction #LeftPadding").attr("value", MubanAttribute.LeftPadding)
					$(".yemianAction #TopPadding").attr("value", MubanAttribute.TopPadding)
					$(".yemianAction #RightPadding").attr("value", MubanAttribute.RightPadding)
					$(".yemianAction #BottomPadding").attr("value", MubanAttribute.BottomPadding)
				}
			// }else{
			// 	layer.confirm('当前操作没保存，需要保存吗？', {
			// 		btn: ['保存','不保存'] //按钮
			// 	}, function(){
			// 		savePage()
			// 		layer.msg('保存成功', {icon: 1});
			// 	}, function(){
			// 		$(".reportContCont").html("")
			// 	});
			// }

		} else if (num == 2) {
			//hide handsonTables
			$('#handsonContainer').each(function() {
				//$(this).hide();
				var handsonContainerParents = $(this).parents('.resizabletable')
				if (handsonContainerParents.length > 0) {
					$(handsonContainerParents[0]).css('visibility', 'hidden')
				}
			})
			for (var property in handsonTableHelperObjImgs) {
				$('.' + handsonTableHelperObjImgs[property]).css('visibility', 'hidden')
			}
			for (var i = 0; i < muban_handsonTableImgs.length; i++) {
				for (var property in muban_handsonTableImgs[i]) {
					$('.' + muban_handsonTableImgs[i][property]).css('visibility', 'visible')
				}
			}
			for (var i = 0; i < muban_handsonTable_arr.length; i++) {
				//$('#handsonContainer' + i).show()
				$('#handsonContainer' + i).css('visibility', 'visible')
				$('#handsonContainer' + i + ' img').each(function(i) {
					$(this).css('visibility', 'visible')
				})
			}
			$(".muban").css("display", "block").siblings().css("display", "none")
			// window.location.href = "../../../../../fenzu/creatFooterReport.html"
		} else if (num == 3) {
			// if($(this).attr("data-state")==1){
				$(".dataSource").css("display", "block").siblings().css("display", "none")
				$(".reportContCont").html("")
				$(".muban").show().siblings().hide()
			var MubanAttribute=JSON.parse(localStorage.getItem("MubanAttribute"))
			if(MubanAttribute){
				$(".muban #ModelSize").attr("value",MubanAttribute.ModelSize)
				$(".muban #borderColor").attr("value",MubanAttribute.borderColor)
				$(".muban #borderColor").css("background-color",MubanAttribute.borderColor)
				$(".muban #borderWidth").attr("value",MubanAttribute.borderWidth)
				$(".muban #borderType").val(MubanAttribute.borderType)
				$(".muban #LeftPadding").attr("value",MubanAttribute.LeftPadding)
				$(".muban #TopPadding").attr("value",MubanAttribute.TopPadding)
				$(".muban #RightPadding").attr("value",MubanAttribute.RightPadding)
				$(".muban #BottomPadding").attr("value",MubanAttribute.BottomPadding)
			}

			// }else{
			// 	layer.confirm('当前操作没保存，需要保存吗？', {
			// 		btn: ['保存','不保存'] //按钮
			// 	}, function(){
			// 		savePage()
			// 		layer.msg('保存成功', {icon: 1});
			// 	}, function(){
			// 		$(".reportContCont").html("")
			// 	});
			// }

		}
	})
	//页面切换事件及绑定
	$(".reportPager").on("click", "p", function() {
		$(this).addClass("on").siblings().removeClass("on")
		// $(".operationCont div.yemianAction input[name='name']").text($(this).text())
		$(".operationCont div.yemianAction input[name='pagerName']").val($(this).text())
		$(".yemianAction").show().siblings().hide()
		$(".reportContCont").html("")
		if ($(".yemianAction div.yemianCont").css("display") == 'none') {
			$(".yemianAction div.yemianCont").slideDown();
		}
	})
	// haspager()
	//母版切换事件及绑定
	$(".MasterEdition").on("click", "p", function() {
		$(this).addClass("on").siblings().removeClass("on")
		$(".operationCont div.muban input[name='MubanName']").val($(this).text())
		$(".muban").show().siblings().hide()
		$(".reportContCont").html("")
		if ($(".yemianAction div.muban").css("display") == 'none') {
			$(".yemianAction div.muban").slideDown();
		}
	})

	$(".closeBtnR span").click(function() {
		if ($(".reportRhide").css("right") == "-256px") {
			$(".reportRhide").animate({
				right: '0px'
			});
			$(this).removeClass("elqianjin-").addClass("elqianjin-1")
		} else {
			$(".reportRhide").animate({
				right: '-256px'
			});
			$(this).removeClass("elqianjin-1").addClass("elqianjin-")
			//加载右侧编辑内容
		}
	})

	//编辑栏显示隐藏
	$(".title").click(function() {
		if ($(this).next().css("display") == 'none') {
			if ($(this).html() === '趋势图') {
				//loadTrendMapSettings();
			}
			$(this).next().slideDown();
		} else {
			$(this).next().slideUp();
		}
	})
	$(".openClose").click(function openClose() {
		if ($(this).next().css("display") == 'none') {
			$(this).removeClass("elzhankai1").addClass("elzhankai")
			$(this).next().slideDown();
		} else {
			$(this).next().slideUp();
			$(this).removeClass("elzhankai").addClass("elzhankai1")
		}
	})
	// 特殊显示隐藏关闭
	$(".openClose1").click(function openClose() {
		if ($(this).parent("div").next().css("display") == 'none') {
			$(this).removeClass("elzhankai1").addClass("elzhankai")
			$(this).parent("div").next().slideDown();
		} else {
			$(this).parent("div").next().slideUp();
			$(this).removeClass("elzhankai").addClass("elzhankai1")
		}
	})
})

$(function() {
	var idBox = null; //要插入的框
	$(".reportContCont").on("click", ".componentBox ", function() {
		idBox = $(this).attr("id")
	})
	//点击直线，柱图，折线图等显示右侧编辑
	$(".reportContNav ul li").click(function() {
		var index = $(this).data("num");

		if (index == "picture") { //上传图片
			$(".operationCont ." + index).show().siblings().hide()
			clearHandsonCell();
			document.getElementById("fileInput").click() //调用上传事件
		} else if (index == "operationText") { //插入文本输入框
			$(".operationCont ." + index).show().siblings().hide()
			/*$("#reportContCont").prepend(
				'<div class="ui-widget-content resizable2" style="padding: 10px;position:absolate;left:0px;top:0px"><i class="hander"></i><span class="element elcuo1-copy deleteBox"></span><span contenteditable="true">内容</span></div>'
			)*/
			var operationTextHtml = '<div class="ui-widget-content resizable2" style="padding: 10px;position:absolate;left:0px;top:0px"><i class="hander"></i><span class="element elcuo1-copy deleteBox"></span><span contenteditable="true">内容</span></div>';
			//拖拉拽缩放
			$('.box-5 div').each(function() {
				$(this).dragging({
					move: 'both',
					randomPosition: true,
					hander: '.hander'
				});
			});
			$(".resizable2").resizable({
				aspectRatio: false
			});
			updateSelectedHandsonCellWithHtml(operationTextHtml)
		} else if (index == "ParetoChart") { //帕雷托图
			createAction()
			$(".operationCont ." + index).show().siblings().hide()
			var beginId = "ParetoChart"
			var id = beginId + Math.floor(Math.random() * 1000) //随机id
			var ids = WhetherId(id, beginId)
			var currSelection = handsonTable.getSelected();
			//var currSelectionRange = handsonTable.getSelectedRange();
			if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
				|| currSelection[0].length < 4)
				return false;
			clearHandsonCell();
			handsonTableOptions.data[currSelection[0][0]][currSelection[0][1]] = paretoChartHtml;
			var rowHeightHelper = handsonTable.getRowHeight(currSelection[0][0]);
			var colWidthHelper = handsonTable.getColWidth(currSelection[0][1]);
			var paretoChartHtml = '<div class="ui-widget-content" id="' + ids +
				'" style="height:' + rowHeightHelper + 'px;width:' + colWidthHelper + 'px;"></div>'
			handsonTableHelperObjParetos[currSelection[0][0] + ',' + currSelection[0][1]] = ids;
			handsonTable.updateSettings(handsonTableOptions);
			resizeCharts(BigobjHelper);
			createAction()
		} else if (index == "ControlChart") { //控制图
			createAction()
			$(".operationCont ." + index).show().siblings().hide()
			var beginId = "ControlChart"
			var id = beginId + Math.floor(Math.random() * 1000) //随机id
			var ids = WhetherId(id, beginId)

			var controlChartHtml = '<div class="ui-widget-content resizable3" id="' + ids +
				'" style=""><i class="hander"></i><span class="element elcuo1-copy deleteBox"></span></div>';
			//拖拉拽缩放
			clearHandsonCell();
			var currSelection = handsonTable.getSelected();
			if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
				|| currSelection[0].length < 4)
				return false;
			handsonTableOptions.data[currSelection[0][0]][currSelection[0][1]] = controlChartHtml;
			handsonTable.updateSettings(handsonTableOptions);
			handsonTableHelperObjControlCharts[currSelection[0][0] + ',' + currSelection[0][1]] = ids;
			//拖拉拽缩放
			resizeCharts(BigobjHelper);
			createAction()
		} else if (index == "TrendMap") { //趋势图
			createAction()
			$(".operationCont ." + index).show().siblings().hide()
			var beginId = "TrendMap"
			var id = beginId + Math.floor(Math.random() * 1000) //随机id
			var ids = WhetherId(id, beginId)
			var currSelection = handsonTable.getSelected();
			if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
				|| currSelection[0].length < 4)
				return false;
			clearHandsonCell();
			var mergedCellRowAndCol = getMergedCellRowAndCol(currSelection[0][0], currSelection[0][1]);
			//handsonTableHelperObjTrendMaps[currSelection[0][0] + ',' + currSelection[0][1]] = ids;
			handsonTableHelperObjTrendMaps[mergedCellRowAndCol.row + ',' + mergedCellRowAndCol.col] = ids;
			var rowHeightHelper = handsonTable.getRowHeight(currSelection[0][0]);
			var colWidthHelper = handsonTable.getColWidth(currSelection[0][1]);
			rowHeightHelper = rowHeightHelper > 20?rowHeightHelper - 15:rowHeightHelper;
			colWidthHelper = colWidthHelper > 20?colWidthHelper - 15:colWidthHelper;
			var TrendMapHtml = '<div class="" id="' + ids +
				'" style="max-height:'+rowHeightHelper+'px;max-width:'+colWidthHelper+'px;height:'+rowHeightHelper+
				'px;width:'+colWidthHelper+'px;overflow:hidden;"></div>';
			updateSelectedHandsonCellWithHtml(TrendMapHtml);
			//afterInitChartsAndMaps();
			resizeCharts(BigobjHelper);
			createAction()
		} else if (index == "columnChart") { //直方图
			createAction()
			$(".operationCont ." + index).show().siblings().hide()
			var beginId = "histogram"
			var id = beginId + Math.floor(Math.random() * 1000) //随机id
			var ids = WhetherId(id, beginId)
			var currSelection = handsonTable.getSelected();
			if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
				|| currSelection[0].length < 4)
				return false;
			clearHandsonCell();
			var mergedCellRowAndCol = getMergedCellRowAndCol(currSelection[0][0], currSelection[0][1]);
			handsonTableHelperObjHistograms[mergedCellRowAndCol.row + ',' + mergedCellRowAndCol.col] = ids;
			var rowHeightHelper = handsonTable.getRowHeight(currSelection[0][0]);
			var colWidthHelper = handsonTable.getColWidth(currSelection[0][1]);
			rowHeightHelper = rowHeightHelper > 20?rowHeightHelper - 15:rowHeightHelper;
			colWidthHelper = colWidthHelper > 20?colWidthHelper - 15:colWidthHelper;
			var histogramHtml = '<div  id="' + ids +
				'" style="max-height:'+rowHeightHelper+'px;max-width:'+colWidthHelper+'px;height:'+rowHeightHelper+
				'px;width:'+colWidthHelper+'px;overflow:hidden;"></div>';
			updateSelectedHandsonCellWithHtml(histogramHtml);
			resizeCharts(BigobjHelper);
			createAction()
		} else if (index == "pieChart") { //饼状图图点击事件
			createAction()
			$(".operationCont ." + index).show().siblings().hide()
			var beginId = "StackingMap"
			var id = beginId + Math.floor(Math.random() * 1000) //随机id
			var ids = WhetherId(id, beginId)
			var pieChartHtml = '<div class="ui-widget-content bigPieChart resizable3" style="left:0px;top:0px"><div class="pieChart" id="' +
				ids + '" ></div><i class="hander"></i><span class="element elcuo1-copy deleteBox"></span></div>';
			var currSelection = handsonTable.getSelected();
			if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
				|| currSelection[0].length < 4)
				return false;
			clearHandsonCell();
			//handsonTableOptions.data[currSelection[0][0]][currSelection[0][1]] = controlChartHtml;
			//handsonTable.updateSettings(handsonTableOptions);
			updateSelectedHandsonCellWithHtml(pieChartHtml);
			handsonTableHelperObjPieCharts[currSelection[0][0] + ',' + currSelection[0][1]] = ids;
			//handsonTableHelperObjSigmaMaps[currSelection[0][0] + ',' + currSelection[0][1]] = ids;
			resizeCharts(BigobjHelper);
			createAction()
		} else if (index == "BoxLineChart") {//箱线图
			createAction()
			$(".operationCont ." + index).show().siblings().hide()
			var beginId = "BoxLineChart"
			var id = beginId + Math.floor(Math.random() * 1000) //随机id
			var ids = WhetherId(id, beginId)

			var componentBoxHtml = '<div class="ui-widget-content componentBox resizableBox" id="' +
				ids + '" ><i class="hander"></i><span class="element elcuo1-copy deleteBox"></span></div>';
			var currSelection = handsonTable.getSelected();
			if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
				|| currSelection[0].length < 4)
				return false;
			clearHandsonCell();
			//handsonTableOptions.data[currSelection[0][0]][currSelection[0][1]] = controlChartHtml;
			//handsonTable.updateSettings(handsonTableOptions);
			updateSelectedHandsonCellWithHtml(componentBoxHtml);
			handsonTableHelperObjBoxLineCharts[currSelection[0][0] + ',' + currSelection[0][1]] = ids;
			//拖拉拽缩放
			resizeCharts(BigobjHelper);
			createAction()
		} else if (index == "6sigma") {//6sigma图
			createAction()
			$(".operationCont ." + index).show().siblings().hide()
			var beginId = "sigma"
			var id = beginId + Math.floor(Math.random() * 1000) //随机id
			var ids = WhetherId(id, beginId)
			var sigmaMapHtml = '<div class="ui-widget-content componentBox resizableBox" id="' +
				ids + '" ><i class="hander"></i><span class="element elcuo1-copy deleteBox"></span></div>';
			var currSelection = handsonTable.getSelected();
			if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
				|| currSelection[0].length < 4)
				return false;
			clearHandsonCell();
			//handsonTableOptions.data[currSelection[0][0]][currSelection[0][1]] = controlChartHtml;
			//handsonTable.updateSettings(handsonTableOptions);
			updateSelectedHandsonCellWithHtml(sigmaMapHtml);
			handsonTableHelperObjSigmaMaps[currSelection[0][0] + ',' + currSelection[0][1]] = ids;
			resizeCharts(BigobjHelper);
			createAction()
		}else if (index == "StackingMapChart") {//堆积图
			createAction()
			$(".operationCont ." + index).show().siblings().hide()
			var beginId = "StackingMap"
			var id = beginId + Math.floor(Math.random() * 1000) //随机id
			var ids = WhetherId(id, beginId)
			var stackingMapHtml = '<div class="ui-widget-content componentBox resizableBox" id="' +
				ids + '" ><i class="hander"></i><span class="element elcuo1-copy deleteBox"></span></div>';
			var currSelection = handsonTable.getSelected();
			if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
				|| currSelection[0].length < 4)
				return false;
			clearHandsonCell();
			//handsonTableOptions.data[currSelection[0][0]][currSelection[0][1]] = controlChartHtml;
			//handsonTable.updateSettings(handsonTableOptions);
			updateSelectedHandsonCellWithHtml(stackingMapHtml);
			handsonTableHelperObjStackingMapCharts[currSelection[0][0] + ',' + currSelection[0][1]] = ids;
			//handsonTableHelperObjSigmaMaps[currSelection[0][0] + ',' + currSelection[0][1]] = ids;
			resizeCharts()//BigobjHelper);
			createAction()
		} else {
			loadFuwenben();
			$(".operationCont ." + index).show().siblings().hide()
			$(".operationCont ." + index).find('*').each(function() {
				$(this).show();
			});
		}
	})
})

//趋势图数据上下公差切换事件
function DataChangeVariable(e){
	if($(e).attr("class")=="dSStyleSel1"){
		if($(e).val()==1){
			$(e).parent("li").next("li").find(".dSStyleSel2").val("1")
			$(e).parent("li").next("li").find(".SymbolicOperation2").css("display","none")
			$(e).next("select").css("display","none")
		}else if($(e).val()==2){
			$(e).parent("li").next("li").find(".dSStyleSel2").val("3")
			$(e).parent("li").next("li").find(".SymbolicOperation2").css("display","inline-block")
			$(e).next("select").css("display","inline-block")
		}else if($(e).val()==3){
			$(e).parent("li").next("li").find(".dSStyleSel2").val("2")
			$(e).parent("li").next("li").find(".SymbolicOperation2").css("display","inline-block")
			$(e).next("select").css("display","inline-block")
		}else if($(e).val()==4){
			$(e).parent("li").next("li").find(".dSStyleSel2").val("4")
			$(e).parent("li").next("li").find(".SymbolicOperation2").css("display","inline-block")
			$(e).next("select").css("display","inline-block")
		}else if($(e).val()==0){
			$(e).parent("li").next("li").find(".dSStyleSel2").val("0")
			$(e).parent("li").next("li").find(".SymbolicOperation2").css("display","none")
			$(e).next("select").css("display","none")
		}
	}else{
		if($(e).val()==1){
			$(e).parent("li").prev("li").find(".dSStyleSel1").val("1")
			$(e).parent("li").prev("li").find(".SymbolicOperation1").css("display","none")
			$(e).next("select").css("display","none")
		}else if($(e).val()==2){
			$(e).parent("li").prev("li").find(".dSStyleSel1").val("3")
			$(e).parent("li").prev("li").find(".SymbolicOperation1").css("display","inline-block")
			$(e).next("select").css("display","inline-block")
		}else if($(e).val()==3){
			$(e).parent("li").prev("li").find(".dSStyleSel1").val("2")
			$(e).parent("li").prev("li").find(".SymbolicOperation1").css("display","inline-block")
			$(e).next("select").css("display","inline-block")
		}else if($(e).val()==4){
			$(e).parent("li").prev("li").find(".dSStyleSel1").val("4")
			$(e).next("select").css("display","inline-block")
			$(e).parent("li").prev("li").find(".SymbolicOperation1").css("display","inline-block")
		}else if($(e).val()==0){
			$(e).parent("li").prev("li").find(".dSStyleSel1").val("0")
			$(e).parent("li").prev("li").find(".SymbolicOperation1").css("display","none")
			$(e).next("select").css("display","none")
		}
	}
}
//趋势图数据 符号切换事件
function DataChangeSymbol(e){
	if($(e).attr("class")=="dSYValueSel1"){
		if($(e).val()==1){
			$(e).parent("li").next("li").find(".dSYValueSel2").val("2")
		}else if($(e).val()==2){
			$(e).parent("li").next("li").find(".dSYValueSel2").val("1")
		}else if($(e).val()==0){
			$(e).parent("li").next("li").find(".dSYValueSel2").val("0")
		}
	}else{
		if($(e).val()==1){
			$(e).parent("li").prev("li").find(".dSYValueSel1").val("2")
		}else if($(e).val()==2){
			$(e).parent("li").prev("li").find(".dSYValueSel1").val("1")
		}else if($(e).val()==0){
			$(e).parent("li").prev("li").find(".dSYValueSel1").val("0")
		}
	}
}

function toogle(th) {
	console.log(th)
	var ele = $(th).children(".move");
	if (ele.attr("data-state") == "on") {
		ele.animate({
			left: "0"
		}, 300, function() {
			ele.attr("data-state", "off");
			$(th).removeClass("on").addClass("off");
		});
	} else if (ele.attr("data-state") == "off") {
		ele.animate({
			left: '17px'
		}, 300, function () {
			$(this).attr("data-state", "on");
			$(th).removeClass("off").addClass("on");
		});

	}
}
function openChecked(th){//绝对值切换选中状态
	if($(th).attr("data-state")==0){
		$(th).attr("data-state",1)
		$(th).prop("checked",true);
		if($(th).parent("li").siblings("li").find("input").attr("data-state")!=0){
			$(th).parent("li").siblings("li").find("input").attr("data-state",0).prop("checked",false)
		}

	}else{
		$(th).attr("data-state",0)
		$(th).prop("checked",false);
		if($(th).parent("li").siblings("li").find("input").attr("data-state")!=0){
			$(th).parent("li").siblings("li").find("input").attr("data-state",1).prop("checked",true)
		}

	}
}
function haspager() { //判断是否有页面显示第几个
	if ($(".reportPager").children().length > 0) {
		$(".reportPager p").eq(0).addClass("on").siblings().removeClass("on")
		$(".operationCont div.yemianAction p.title").text($(".reportPager p").eq(0).text())
		$(".yemianAction").show().siblings().hide()
		if ($(".yemianAction div.yemianCont").css("display") == 'none') {
			$(".yemianAction div.yemianCont").slideDown();
		}
	}
}

var preview = function(file) { //上传图片  创建插入图片标签
	var newImgDiv = document.createElement('IMG');
	newImgDiv.classList.add('img_driver1');

	//拖拉拽缩放
	var container = "img_driver"
	//缩略图类定义
	var Picture = function(file, container) {
		var height = 0,
			width = 0,
			ext = '',
			size = 0,
			name = '',
			path = '';
		var self = this;
		if (file) {
			name = file.value;
			if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
				file.select();
				path = document.selection.createRange().text;
			} else {
				if (file.files) {
					// path =  file.files.item(0).getAsDataURL(); // firefox7.0之后该方法弃用了，用下面那个

					var formData = new FormData();
					formData.append('file', file.files[0]);
					$.ajax({
						type: 'POST',
						url: "/customReport/uploadFile",
						data: formData,//$('#pictureFrm').serialize(),
						contentType: false,
						processData: false,
						success: function(response) {
							console.log("around line 361: " + response);
							//ext = name.substr(name.lastIndexOf("."), name.length);
							container.src = response;
							container.alt = name;
							container.style.visibility = 'visible';
							height = container.height;
							width = container.width;
							size = container.fileSize;

							var currSelection = handsonTable.getSelected();
							//var currSelectionRange = handsonTable.getSelectedRange();
							if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
								|| currSelection[0].length < 4)
								return false;
							height = handsonTable.getRowHeight(currSelection[0][0]);
							width = handsonTable.getColWidth(currSelection[0][1]);
							var beginImgClassName = "Img"
							var imgClassName = beginImgClassName + Math.floor(Math.random() * 1000)
							var imgClassNameFinal = WhetherId(imgClassName, beginImgClassName)
							container.classList.add(imgClassNameFinal);
							//container.id = imgIdFinal;
							container.setAttribute('width', width);
							container.setAttribute('height', height);
							container.style.width = width;
							container.style.height = height;
							container.style.overflow = 'hidden';
							var tempHandsonTableOptions = handsonTable.getSettings();
							tempHandsonTableOptions.data[currSelection[0][0]][currSelection[0][1]] =
								container.outerHTML;

							handsonTable.updateSettings(tempHandsonTableOptions);
							var currSelection = handsonTable.getSelected();
							handsonTableHelperObjImgs[currSelection[0][0] + ',' +
							currSelection[0][1]] = imgClassNameFinal;
						},
						error: function() {
							console.log("error for /customReport/uploadFile: " + error);
						}
					});
					path = window.URL.createObjectURL(file.files[0]);
				} else {
					path = file.value;
				}
			}
		} else {
			throw '无效的文件';
		}
		this.get = function(name) {
			return self[name];
		};
		this.isValid = function() {
			if (allowExt.indexOf(self.ext) !== -1) {
				throw '不允许上传该文件类型';
				return false;
			}
		}
	};

	try {
		var pic = new Picture(file, newImgDiv);
	} catch (e) {
		alert(e);
	}
};

function WhetherId(id, beginId) { //判断页面是否存在这个id
	if ($("#" + id).length > 0) {
		var id = beginId + Math.floor(Math.random() * 1000) //随机id
		var ids = WhetherId(id)
		return ids
	} else {
		return id
	}
}
//自动生成报告
function GenerateReport() {
	var val = $("#dataSourceSelect").val(),
		beginId, id, ids
	if (val != 0) {
		handsonTableActiveAjaxCalls++
		var url = "static/js/projectJs/data1.json";
		if (val == 1) {
			url = "static/js/projectJs/data1.json"
		} else {
			url = "static/js/projectJs/data2.json"
		}
		$.ajax({
			url: url,
			type: "get",
			datatype: "JSON",
			// data: {
			// 	parameter_A: $("#parameter_A").val(),
			// 	parameter_B: $("#parameter_B").val()
			// },
			success: function(msg) {
				handsonTableActiveAjaxCalls--
				var result = msg.data
				var rule = msg.rule;
				for (var m = 0; m < result.length; m++) {
					beginId = "autoCreat"
					id = beginId + Math.floor(Math.random() * 100000) //随机id
					ids = WhetherId(id, beginId)
					if (localStorage.getItem("tableText")) {
						var tableText = JSON.parse(localStorage.getItem("tableText"))
						var totalColNum = tableText[0].totalColNum - 1,
							totalRowNum = tableText[0].totalRowNum - 1,
							width = tableText[0].parentWidth,
							rowNum, colNum, rowspan, colspan //第几行//第几列//合并行//合并列
						height = tableText[0].parentHeight
						var table = ""
						table += "<table class='creatTable' id='" + ids + "' border='1' cellspacing='0' cellpadding='0' style='width:" +
							width + ";height:" + height + "'>"
						table += JSON.parse(localStorage.getItem("table"))
						table += "</table>"
						$("#reportContCont").append(table)

						for (var j = 0; j < tableText.length; j++) {
							var resizabletableNUm = tableText[j].resizabletable
							var itemArry = tableText[j]
							if (itemArry.chartId != undefined) {
								console.log(result[m])
								var data = []; //拼成图表所需的数据格式
								var beginId = "ParetoChart"
								var id = beginId + Math.floor(Math.random() * 1000) //随机id
								var ids = WhetherId(id, beginId)
								var td = $("#reportContCont").find("table:eq(" + m + ")").find("tbody").find("tr:eq(" + itemArry.rowNum +
									")").find("td:eq(" + itemArry.colNum + ")")
								td.html("<div id='" + ids + "'></div>")
								for (var k in result[m]) {
									var item = {}
									if (k != "fx" && k != "f_label") {
										item.num_sent = k
										item.perc = result[m][k]
										data.push(item)
									}
								}
								width = $("#" + ids).parents("td").width(),
									height = $("#" + ids).parents("td").height();
								$("#" + ids).parents("td").attr("data-chartSource", JSON.stringify(data))
								ParetoChart(ids, data, width, height)
								if (handsonTableActiveAjaxCalls === 0) {
									moveChartsFromAltToAltHolder()
								}
							} else if (itemArry.imgSrc != undefined) {
								$("#reportContCont").find("table:eq(" + m + ")").find("tbody").find("tr:eq(" + itemArry.rowNum +
									")").find("td:eq(" + itemArry.colNum + ")").find("img").attr("src", itemArry.imgSrc)
							} else if (itemArry.imgSrc == undefined && itemArry.chartId == undefined) {
								var text = itemArry.text.replace(/;/g, '=').replace(/,/g, '=').replace(/；/g, '=').replace(/，/g, '=').split(
									"=")
								var strings = "",
									BackgroundColor;
								for (var i = 0; i < text.length; i++) {
									if (i % 2 == 0) {
										if (i == text.length - 2) {
											strings += text[i] + "=" + rule[0][text[i]]
										} else {
											strings += text[i] + "=" + rule[0][text[i]] + ","
										}

									}
								}
								if (itemArry.JudgementSTring) {
									var BackgroundColorArray = JSON.parse(itemArry.BackgroundColorArray),
										JudgementSTring = itemArry.JudgementSTring,
										keycondition = JSON.parse(itemArry.keycondition),
										num, NewJudgementSTring;
									console.log(BackgroundColorArray)
									console.log(keycondition)
									console.log(rule[0])
									for (var i = 0; i < keycondition.length; i++) {
										var itemkeycondition = keycondition[i]
										for (var n = 0; n < itemkeycondition.length; n++) {
											num = rule[0][itemkeycondition[n]]
											re = new RegExp(itemkeycondition[n], "g");
											JudgementSTring = JudgementSTring.replace(re, num)
										}
									}
									var JudgementArray = JudgementSTring.split("||")
									for (var i = 0; i < JudgementArray.length; i++) {
										if (eval(JudgementArray[i])) {
											$("#reportContCont").find("table:eq(" + m + ")").find("tbody").find("tr:eq(" + itemArry.rowNum +
												")").find("td:eq(" + itemArry.colNum + ")").css("background-color", BackgroundColorArray[i])
										}
									}
								}
								$("#reportContCont").find("table:eq(" + m + ")").find("tbody").find("tr:eq(" + itemArry.rowNum +
									")").find("td:eq(" + itemArry.colNum + ")").text(strings)
							}
						}
					}
				}
			},
			error: function() {
				handsonTableActiveAjaxCalls--
			}
		})
	} else {
		alert("请选择数据源")
	}
}
// 富文本编辑
function insertTable() { //插入表格确认事件
	layer.closeAll()
	if (yemianOrMubanMode == 2) {
		insertMubanTable()
		return false
	}
	var beginId = "table"
	var id = beginId + Math.floor(Math.random() * 1000) //随机id
	var ids = WhetherId(id, beginId)
	var rowNum = $("#rowNum").val();
	var columnNum = $("#cellNum").val();
	var option = {
		row: rowNum,
		col: columnNum
	}

	/*$("#reportContCont").prepend(
		"<div class='ui-widget-content resizabletable' style='min-width:150px;width:400px'><i class='hander'></i><span class='element elcuo1-copy deleteBox'></span><div class=" +
		ids + "></div></div>")*/
	/*$("#reportContCont").prepend(
		"<div class='ui-widget-content resizabletable' style='min-width:150px;width:400px;min-height:214px'>" + //<i class='hander'></i><span class='element elcuo1-copy deleteBox'></span>" +
		"<div id='handsonContainer' class=" +
		ids + "></div></div>")*/
	$("#reportContCont").html("");
	$("#reportContCont").prepend(
		// "<div class='BigTable' style='position:relative'>" + //<i class='hander'></i><span class='element elcuo1-copy deleteBox'></span>" +
		"<div id='handsonContainer' class=" +"BigTable" + "  " +
		ids + "></div>"
		// +"</div>"
	)
	$('.box-5 div').each(function() {
		$(this).dragging({
			move: 'both',
			randomPosition: false,
			hander: '.hander'
		});
	});
	var colWidthsArr = [];
	for (var i = 0; i < columnNum; i++) {
		colWidthsArr.push(400/columnNum);
	}
	var rowHeightsArr = [];
	for (var i = 0; i < rowNum; i++) {
		rowHeightsArr.push(200/rowNum);
	}
	var columnsArr = [];
	for (var i = 0; i < columnNum; i++) {
		columnsArr.push({renderer: "html"});
	}
	var container = document.getElementById('handsonContainer');
	var customRenderer = function(instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.TextRenderer.apply(this, arguments);
		if (typeof value !== 'undefined' && value) {
			var valueHelper = value.split("=");
			if (valueHelper.length > 1 && valueHelper[0] == 'cpk') {
				td.style.background = '#CEC';
			}
		}
		//td.style.fontWeight = 'bold';
		//td.style.color = 'green';
		//td.style.background = '#CEC';
	}
	var emptyData = [];
	for (var i = 0; i < rowHeightsArr.length; i++) {
		emptyData.push([])
	}
	handsonTableHelperObj = {};
	handsonTableArr = [];
	handsonTableOptions = [];
	handsonTableHelperObjArr = [];
	handsonTableHelperObjImgs = {};
	handsonTableHelperObjParetos = {};
	handsonTableHelperObjParetoSettings = {};
	handsonTableHelperObjTrendMaps = {};
	handsonTableHelperObjTrendMapSettings = {};
	handsonTableHelperObjHistograms = {};
	handsonTableHelperObjHistogramSettings = {};
	handsonTableHelperObjControlCharts = {};
	handsonTableHelperObjControlChartSettings = {};
	handsonTableHelperObjBoxLineCharts = {};
	handsonTableHelperObjBoxLineChartSettings = {};
	handsonTableHelperObjSigmaMaps = {};
	handsonTableHelperObjSigmaMapSettings = {};
	handsonTableHelperObjPieCharts = {};
	handsonTableHelperObjPieChartSettings = {};
	handsonTableHelperObjStackingMapCharts = {};
	handsonTableHelperObjStackingMapChartSettings = {};
	handsonTableHelperObjHelper = {};
	//Handsontable.renderers.registerRenderer('customRenderer', customRenderer);
	handsonTableOptions = {
		data: emptyData,//Handsontable.helper.createSpreadsheetData(rowNum, columnNum),
		rowHeaders: true,
		colHeaders: true,
		width: 400,//'100%',
		height: 320,
		colWidths: colWidthsArr,//[45, 100, 160, 60, 80, 80, 80],
		rowHeights: rowHeightsArr,//[50, 40, 100],
		columns: columnsArr,
		manualColumnResize: true,
		manualRowResize: true,
		outsideClickDeselects: false,
		selectionMode: 'multiple',
		margeCells: true,
		mergeCells: [],/*{row: 0, col: 0, rowspan: 2, colspan: 2}],
		cells: function (row, col, prop) {
			var cellProperties = {};
			cellProperties.renderer = customRenderer;
			return cellProperties;
		}*/
	};
	handsonTable = new Handsontable(container, handsonTableOptions);
	getMaxBoundingRectForHandson();
	initHandsonTable(handsonTable);

	/*var we = $("." + ids).wybExcel(option);*/
	$('.box-5 td > div').each(function() {
		$(this).dragging({
			move: 'both',
			randomPosition: false,
			hander: '.hander'
		});
	});
	/*we.setMaxWidth($("#reportContCont").width() - 50);*/
	//$(".resizabletable").resizable({
	/*$("#handsonContainer").resizable({
		aspectRatio: false,
		//maxWidth: we.getMaxWidth(),
		resize: function(event, ui) {

		}
	});*/
	$("#handsonContainer").width(handsonTable.table.clientWidth);
	$("#handsonContainer").height(handsonTable.table.clientHeight);
	console.log("resizing handsonContainer around line 699 to: " + $('#handsonContainer').width());
	console.log("resizing handsonContainer around line 699 to: " + $('#handsonContainer').height());
	// resize()//监听变化
	//resize()
	// hack for wtHolder class divs being taller than their parents
	$('#handsonContainer .wtHolder').each(function() {
		var parents = $(this).parents('.handsontable');
		if (parents.length > 0) {
			var parentHeight = $(parents[0]).height();
			var currentHeight = $(this).height();
			$(this).height(parentHeight);
		}
	});
	$('#handsonContainer').dragging({
		hander: '.ht_clone_top_left_corner'
	})
	$('.reportContCont *').each(function(index) {
		$(this).css({
			overflow: 'visible'
		});
	});
}

function InsertForm() { //插入表格弹框事件
	layer.open({
		type: 1,
		offset: '15%', //top
		scrollbar: false,
		area: ['30%', '25%'],
		maxmin: true, //开启最大化最小化按钮
		shade: 0,
		title: "创建表格",
		shadeClose: true, //点击遮罩关闭
		content: $('#formBombBox'), //注意，如果str是object，那么需要字符拼接。
		end: function() {
			$("#formBombBox").hide();
		}
	})
}

function resize() { //监听大小变化
	$(".resizabletable").resize(function() {
		var tableWidth = $(this).find("table").width()
		var ThisWidth = $(this).width()
		var _that = $(this)
		if (ThisWidth < tableWidth) {
			var AverageNum = (tableWidth - ThisWidth) / $(this).find("tbody").find("tr:eq(0)").children().length
			$(this).find("tbody").addClass("AutoWidth")
			$(this).find("table").width($(this).width())
			var total = null;
			$(this).find("tbody").find("tr:eq(0)").children().each(function(i, item) {
				var _this = $(this);
				total += parseInt($(this).outerWidth(true));
				_that.find(".col-width-panel").find("div.col-width-panel-item:eq(" + i + ")").css("left", (total - 4) + "px")
			})

		} else {
			$(this).find("table").width($(this).width())
			var total = null;
			$(this).find("tbody").find("tr:eq(0)").children().each(function(i, item) {
				var _this = $(this);
				total += parseInt($(this).outerWidth(true));
				_that.find(".col-width-panel").find("div.col-width-panel-item:eq(" + i + ")").css("left", (total - 4) + "px")
			})
		}

	});
}

function removeClassTable() { //table清除class
	$(".ui-widget-content").removeClass("td-chosen-css").removeClass("td-chosen-muli-css")
}

function TrendMap() { //趋势图

}

function Thickening() { //加粗IE8
	$(".td-chosen-css").css("font-weight", "bold")
}

function tilt() { //倾斜IE8
	$(".td-chosen-css").css("font-style", "oblique")
}

function Underline() { //下划线IE8
	$(".td-chosen-css").css("text-decoration", "underline")
}

function DeleteLine() { //删除线 ie8
	$(".td-chosen-css").css("text-decoration", "line-through")
}

function color() { //删除线 ie8
	$(".td-chosen-css").css("color", "line-through")
}

function DeleteLine() { //删除线 ie8
	$(".td-chosen-css").css("text-decoration", "line-through")
}

function fontColor(e) { //字体颜色
	$(".td-chosen-css").css("color", e.value)
}

function BgColor(e) { //背景颜色
	$(".td-chosen-css").css("background-color", e.value)
}

function LeftAlignment() { //左对齐
	$(".td-chosen-css").css("text-align", "left")
}

function TableLeftAlignment() { //表格左对齐
	$(".BigTable").addClass("TableLeftAlignment").removeClass("TableRightAlignment").removeClass("TableCenterAlignment")
	var className=$(".BigTable").attr("class")
	console.log(className)
	$(".BigTable").attr("data-originalstyle")
	$(".BigTable").css({"left":"0","transform":"translate(0)"})

}
function TableCenterAlignment() { //表格居中对齐
	$(".BigTable").addClass("TableCenterAlignment").removeClass("TableRightAlignment").removeClass("TableLeftAlignment")
	var className=$(".BigTable").attr("class")
	console.log(className)
	$(".BigTable").attr("data-originalstyle")
	$(".BigTable").css({"left":"50%","right":"none","transform":"translate(-50%)"})

}
function TableRightAlignment() { //表格居右对齐
	$(".BigTable").addClass("TableRightAlignment").removeClass("TableCenterAlignment").removeClass("TableLeftAlignment")
	var className=$(".BigTable").attr("class")
	console.log(className)
	$(".BigTable").attr("data-originalstyle")
	$(".BigTable").css({"right":"0","left":"none","transform":"translate(0)"})

}

function centerAlignment() { //居中对齐
	$(".td-chosen-css").css("text-align", "center")
}

function RightAlignment() { //右对齐
	$(".td-chosen-css").css("text-align", "right")
}

function mergeCell() { //合并单元格
	var currSelection = handsonTable.getSelected();
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
	for (var i = 0; i < handsonTableOptions.mergeCells.length; i++) {
		if (handsonTableOptions.mergeCells[i].row >= mergeCellHelper.topLeft.y && handsonTableOptions.mergeCells[i].row <= mergeCellHelper.bottomLeft.y &&
			handsonTableOptions.mergeCells[i].col >= mergeCellHelper.topLeft.x && handsonTableOptions.mergeCells[i].col <= mergeCellHelper.topRight.x) {

		} else {
			newMergeCells.push(handsonTableOptions.mergeCells[i]);
		}
	}
	handsonTableOptions.mergeCells = newMergeCells;
	handsonTableOptions.mergeCells.push(
		{row: mergeCellHelper.topLeft.y, col: mergeCellHelper.topLeft.x, rowspan: rowSpanHelper,
			colspan: colSpanHelper}
	);
	handsonTable.updateSettings(handsonTableOptions);
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

function allCondition(e, bgcColor, type) { //多个条件时变色
	if (type == 1) {
		var currentNum = $(e).parents("ul").index()
		var totalLength = $(e).parents(".AddingConditions").find("ul").length
		var datasource = JSON.parse($(".td-chosen-css").parents(".resizabletable").data("source"))
		var ArrayCondition = [] //条件数组
		var Judgement = "";
		for (var i = 0; i < totalLength; i++) {
			var items = {}
			// cellProperties //命令
			// RangeSymbol //符号
			// RangeNumber //范围值
			if ($(e).parents(".AddingConditions").find("ul:eq(" + i + ")").find(".cellProperties").val() != "all") {
				items.cellProperties = $(e).parents(".AddingConditions").find("ul:eq(" + i + ")").find(".cellProperties").val()
				items.RangeSymbol = $(e).parents(".AddingConditions").find("ul:eq(" + i + ")").find(".RangeSymbol").val()
				items.RangeNumber = $(e).parents(".AddingConditions").find("ul:eq(" + i + ")").find(".RangeNumber").val()
				ArrayCondition.push(items)
			}
		}
		if (datasource != null) {
			for (var i = 0; i < ArrayCondition.length; i++) {
				if (ArrayCondition[i].RangeSymbol == "greaterThan") {
					if (i == ArrayCondition.length - 1) {
						Judgement += datasource[ArrayCondition[i].cellProperties] + ">" + ArrayCondition[i].RangeNumber
					} else {
						Judgement += datasource[ArrayCondition[i].cellProperties] + ">" + ArrayCondition[i].RangeNumber + "&&"
					}
				} else if (ArrayCondition[i].RangeSymbol == "lessThan") {
					if (i == ArrayCondition.length - 1) {
						Judgement += datasource[ArrayCondition[i].cellProperties] + "<" + ArrayCondition[i].RangeNumber
					} else {
						Judgement += datasource[ArrayCondition[i].cellProperties] + "<" + ArrayCondition[i].RangeNumber + "&&"
					}
				} else if (ArrayCondition[i].RangeSymbol == "beEqualTo") {
					if (i == ArrayCondition.length - 1) {
						Judgement += datasource[ArrayCondition[i].cellProperties] + "==" + ArrayCondition[i].RangeNumber
					} else {
						Judgement += datasource[ArrayCondition[i].cellProperties] + "==" + ArrayCondition[i].RangeNumber + "&&"
					}
				}
			}
			if (eval(Judgement)) {
				$(".td-chosen-css").css("background-color", bgcColor)
			} else {
				$(".td-chosen-css").css("background-color", "#fff")
			}
		} else {
			alert("请选择数据源")
		}
	} else {
		var totalLength, bigTotalLength = $(".cellAttribute").length,
			BigArrayCondition = [],
			Judgement = "",
			BackgroundColor = [],
			datasource = JSON.parse($(".td-chosen-css").parents(".resizabletable").data("source"));
		for (var j = 0; j < bigTotalLength; j++) {
			var arrayItem = []

			totalLength = $(".bigCellAttribute .cellAttribute").eq(j).find(".AddingConditions").find("ul").length
			for (var i = 0; i < totalLength; i++) {
				var items = {}
				// cellProperties //命令
				// RangeSymbol //符号
				// RangeNumber //范围值
				if ($(".bigCellAttribute .cellAttribute").eq(j).find(".AddingConditions").find("ul:eq(" + i + ")").find(
					".cellProperties").val() != "all") {
					items.cellProperties = $(".bigCellAttribute .cellAttribute").eq(j).find(".AddingConditions").find("ul:eq(" + i +
						")").find(".cellProperties").val()
					items.RangeSymbol = $(".bigCellAttribute .cellAttribute").eq(j).find(".AddingConditions").find("ul:eq(" + i + ")")
						.find(".RangeSymbol").val()
					items.RangeNumber = $(".bigCellAttribute .cellAttribute").eq(j).find(".AddingConditions").find("ul:eq(" + i + ")")
						.find(".RangeNumber").val()
					items.BackgroundColor = $(".bigCellAttribute .cellAttribute").eq(j).find(".BackgroundColor").val()
					arrayItem.push(items)
				}
			}
			if (arrayItem.length != 0) {
				BackgroundColor.push($(".bigCellAttribute .cellAttribute").eq(j).find(".BackgroundColor").val())
				BigArrayCondition.push(arrayItem)
			}
		}
		if (datasource != null) {
			for (var j = 0; j < BigArrayCondition.length; j++) {
				var JudgementItem = "";
				var ArrayCondition = BigArrayCondition[j]
				if (ArrayCondition.length != 0) {
					for (var i = 0; i < ArrayCondition.length; i++) {

						if (ArrayCondition[i].RangeSymbol == "greaterThan") {
							if (i == ArrayCondition.length - 1) {
								JudgementItem += datasource[ArrayCondition[i].cellProperties] + ">" + ArrayCondition[i].RangeNumber
							} else {
								JudgementItem += datasource[ArrayCondition[i].cellProperties] + ">" + ArrayCondition[i].RangeNumber + "&&"
							}
						} else if (ArrayCondition[i].RangeSymbol == "lessThan") {
							if (i == ArrayCondition.length - 1) {
								JudgementItem += datasource[ArrayCondition[i].cellProperties] + "<" + ArrayCondition[i].RangeNumber
							} else {
								JudgementItem += datasource[ArrayCondition[i].cellProperties] + "<" + ArrayCondition[i].RangeNumber + "&&"
							}
						} else if (ArrayCondition[i].RangeSymbol == "beEqualTo") {
							if (i == ArrayCondition.length - 1) {
								JudgementItem += datasource[ArrayCondition[i].cellProperties] + "==" + ArrayCondition[i].RangeNumber
							} else {
								JudgementItem += datasource[ArrayCondition[i].cellProperties] + "==" + ArrayCondition[i].RangeNumber + "&&"
							}
						}
					}
					if (BigArrayCondition.length == 1) {
						Judgement += JudgementItem
					} else {
						if (j == BigArrayCondition.length - 1) {
							Judgement += JudgementItem
						} else {
							Judgement += JudgementItem + "||"
						}
					}
				}
			}
			var JudgementArray = Judgement.split("||")
			for (var i = 0; i < JudgementArray.length; i++) {
				if (eval(JudgementArray[i])) {
					$(".td-chosen-css").css("background-color", BackgroundColor[i])
				}
				// else {
				// 	$(".td-chosen-css").css("background-color", "#fff")
				// }
			}

		} else {
			alert("请选择数据源")
		}
	}
}

function PreservationCondition(e) { //保存生成条件
	var cellPropertiesObj = [];
	$(".fuwenben .bigCellAttribute .cellAttribute").each(function() {
		//BackgroundColorGroup
		var conditions = $(this).find('.AddingConditions ul');
		var backgroundColorGroup = $(this).find('.BackgroundColorGroup');
		var bgColor = "#FFF";
		if (backgroundColorGroup && backgroundColorGroup.length > 0) {
			bgColor = $(backgroundColorGroup[0]).find('.BackgroundColor').val();
		}
		var conditionalObjs = [];
		conditions.each(function() {
			var condition = $(this);
			var cellProperties = $(condition).find('.cellProperties');
			var RangeSymbol = $(condition).find('.RangeSymbol');
			var RangeNumber = $(condition).find('.RangeNumber');
			cellProperties = cellProperties.length > 0?$(cellProperties[0]).val():'';
			RangeSymbol = RangeSymbol.length > 0?$(RangeSymbol[0]).val():'';
			RangeNumber = RangeNumber.length > 0?$(RangeNumber[0]).val():'';
			if (cellProperties !== '' && RangeSymbol !== '' && RangeNumber !== '') {
				conditionalObjs.push({cellProperties: cellProperties, RangeSymbol: RangeSymbol,
					RangeNumber: RangeNumber, bgColor: bgColor});
			}
		});
		cellPropertiesObj.push({cellProperties: conditionalObjs});
	});

	var currSelection = handsonTable.getSelected();
	if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
		|| currSelection[0].length < 4)
		return false;
	var mergeCellHelper = fourCornersHelper(currSelection[0]);
	//handsonTableHelperObj = JSON.parse(localStorage.getItem('handsonTableHelperObj'));
	handsonTableHelperObj[mergeCellHelper.topLeft.y + ',' + mergeCellHelper.topLeft.x] =
		{rules: cellPropertiesObj, bgColor: "#FFF"};
}

function cellProperties(e) { //单元格命令选择
	var RangeSymbolVal = $(e).parent("li").next("li").find(".RangeSymbol").val()
	var RangeNumberVal = Number($(e).parent("li").next("li").find(".RangeNumber").val())
	var bgcColor = $(e).parents(".bigAttribute").next(".BackgroundColorGroup").find(".BackgroundColor").val()
	var datasource = JSON.parse($(".td-chosen-css").parents(".resizabletable").data("source"))
	if ($(".cellAttribute").length == 1) {
		if ($("#AddingConditions ul").length == 1) {
			if (RangeSymbolVal == "greaterThan") {
				if (datasource[e.value] <= RangeNumberVal) {
					$(".td-chosen-css").css("background-color", "#fff")
				} else {
					$(".td-chosen-css").css("background-color", bgcColor)
				}
			} else if (RangeSymbolVal == "lessThan") {
				if (datasource[e.value] >= RangeNumberVal) {
					$(".td-chosen-css").css("background-color", "#fff")
				} else {
					$(".td-chosen-css").css("background-color", bgcColor)
				}
			} else if (RangeSymbolVal == "beEqualTo") {
				if (datasource[e.value] < RangeNumberVal || datasource[e.value] > RangeNumberVal) {
					$(".td-chosen-css").css("background-color", "#fff")
				} else {
					$(".td-chosen-css").css("background-color", bgcColor)
				}
			}
		} else {
			var type = 1
			allCondition(e, bgcColor, type) //多个条件时变色
		}
	} else {
		var type = 2
		allCondition(e, bgcColor, type) //多个条件时变色
	}

}

function RangeNumber(e) { //范围值失去焦点
	var RangeSymbolVal = $("#AddingConditions ul").eq(0).find(".RangeSymbol").val()
	var RangeNumberVal = Number($(e).val())
	var cellPropertiesVal = $("#AddingConditions ul").eq(0).find(".cellProperties").val()
	var bgcColor = $(e).parents(".bigAttribute").next(".BackgroundColorGroup").find(".BackgroundColor").val()
	var datasource = $(".td-chosen-css").parents(".resizabletable").data("source")
	if ($("#AddingConditions ul").length == 1) {
		if ($("#AddingConditions ul").eq(0).find(".cellProperties").val() != "all") {
			if ($("#AddingConditions ul").length == 1) {
				if (RangeSymbolVal == "greaterThan") {
					if (datasource[cellPropertiesVal] <= RangeNumberVal) {
						$(".td-chosen-css").css("background-color", "#fff")
					} else {
						$(".td-chosen-css").css("background-color", bgcColor)
					}
				} else if (RangeSymbolVal == "lessThan") {
					if (datasource[cellPropertiesVal] >= RangeNumberVal) {
						$(".td-chosen-css").css("background-color", "#fff")
					} else {
						$(".td-chosen-css").css("background-color", bgcColor)
					}
				} else if (RangeSymbolVal == "beEqualTo") {
					if (datasource[cellPropertiesVal] < RangeNumberVal || datasource[cellPropertiesVal] >
						RangeNumberVal) {
						$(".td-chosen-css").css("background-color", "#fff")
					} else {
						$(".td-chosen-css").css("background-color", bgcColor)
					}
				}
			}
		} else {
			$(".td-chosen-css").css("background-color", "#fff")
		}
	} else {
		var type = 1
		allCondition(e, bgcColor, type) //多个条件时变色
	}
}

function RangeSymbol(e) { //范围符号切换时间
	var RangeSymbolVal = $(e).val()
	var RangeNumberVal = Number($("#AddingConditions ul").eq(0).find(".RangeNumber").val())
	var cellPropertiesVal = $("#AddingConditions ul").eq(0).find(".cellProperties").val()
	var bgcColor = $(e).parents(".bigAttribute").next(".BackgroundColorGroup").find(".BackgroundColor").val()
	var datasource = JSON.parse($(".td-chosen-css").parents(".resizabletable").data("source"))
	if ($("#AddingConditions ul").length == 1) {
		if ($("#AddingConditions ul").eq(0).find(".cellProperties").val() != "all") {

			if ($("#AddingConditions ul").length == 1) {
				if (RangeSymbolVal == "greaterThan") {
					if (datasource[cellPropertiesVal] <= RangeNumberVal) {
						$(".td-chosen-css").css("background-color", "#fff")
					} else {
						$(".td-chosen-css").css("background-color", bgcColor)
					}
				} else if (RangeSymbolVal == "lessThan") {
					if (datasource[cellPropertiesVal] >= RangeNumberVal) {
						$(".td-chosen-css").css("background-color", "#fff")
					} else {
						$(".td-chosen-css").css("background-color", bgcColor)
					}
				} else if (RangeSymbolVal == "beEqualTo" || $(".td-chosen-css").data(cellPropertiesVal) == undefined) {

					if (datasource[cellPropertiesVal] < RangeNumberVal || datasource[cellPropertiesVal] >
						RangeNumberVal) {
						$(".td-chosen-css").css("background-color", "#fff")
					} else {
						$(".td-chosen-css").css("background-color", bgcColor)
					}
				}
			}
		} else {
			$(".td-chosen-css").css("background-color", "#fff")
		}
	} else {
		var type = 1
		allCondition(e, bgcColor, type) //多个条件时变色
	}
}

function transparency(e) { //设置背景颜色透明度
	var num = e.value / 100;
	var color = $(e).prev('div').find(".BackgroundColor").val()
	var rgbColor = colorRgb(color, num)
	var RangeSymbolVal = $(e).parent("li").next("li").find(".RangeSymbol").val()
	var RangeNumberVal = Number($(e).parent("li").next("li").find(".RangeNumber").val())
	// if(RangeSymbolVal=="greaterThan"){
	// 	if($("#AddingConditions ul").length==1){
	// 		if($(".td-chosen-css").data(e.value)<=RangeNumberVal){
	// 			$(".td-chosen-css").css("background-color", "#fff")
	// 		}
	// 	}else{
	// 		alert(11)
	// 	}
	// }else if(RangeSymbolVal=="lessThan"){
	// 	
	// }else if(RangeSymbolVal=="beEqualTo"){
	// 	
	// }

	// $(".td-chosen-css").css("background-color", rgbColor)
}

function DeleteAttributeCommand(e) { //删除命令范围
	if ($(e).parents(".bigAttribute").find(".AddingConditions").children("ul").length > 1) {
		$(e).parents(".bigAttribute").find(".AddingConditions").children("ul:last-child").remove()
	}
}



function NewlyAddedCommand(e) { //添加命令范围
	var html = ""
	html += "<ul>"
	html +=
		'<li><label>命令</label><select id="cellProperties" class="cellProperties" ></select></li>'
	html +=
		'<li><label>范围</label><select style="max-width: 60px;" class="RangeSymbol" ></select>' +
		'<input type="number" class="RangeNumber" value="1" style="max-width: 100px;margin-left:4px" /></li>'
	html += "</ul>"
	$(e).parents(".bigAttribute").find(".AddingConditions").append(html)
	CreatRangeSymbol(e) //范围符号下拉创建
	CreatCellProperties(e) //命令下拉创建
}
function HistogramLineAdd(e){//直方图指示线添加
	var html = ""
	html += '<div class="cellAttribute"  style="position: relative">'
	html += '<span onclick="IndicatorLineDelete(this)" style="display: none;position: absolute;top: 15px" class="IndicatorLineDelete bigDeleteAttributeCommand element elshanchu11 fl MrginL10"></span>'
	html += '<div class="bigAttribute">'
	html += '<div class="AddingConditions">'
	html += '<ul>'
	html+='<li>'
	html += '<label>参数</label>'
	html += '<select style="max-width: 160px;margin-left: 2px !important;" class="iLSelParam1">'
	html += '<option value="0">请选择</option>'
	html += '<option value="1">上偏差</option>'
	html += '<option value="2">下偏差</option>'
	html += '<option value="3">中值线</option>'
	html += '<option value="4">零线</option>'
	html += '<option value="5">sigma线</option>'
	html += '</select>'
	html += '</li>'
	html+='<li>'
	html+='<label>宽度</label>'
	html+='<input type="number" class="WidthNumber" value="1"  style="max-width: 160px;" />'
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
	html += '<input id="" style="" onchange="BackgroundColor(this)" style="max-width: 20px;" class="ColorNum iLColor1 BackgroundColor" value="#FFF" />'
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

	$(e).parents(".publicStyle").find(".IndicatorLineAdd").append(html)
	$(e).parents(".publicStyle").find(".IndicatorLineAdd").find(".cellAttribute:last-child").find(".BackgroundColor").colorpicker() //底色调用
}
function ControlChartLineAdd(e){//指示线添加
	var html = ""
	html += '<div class="cellAttribute"  style="position: relative">'
	html += '<span onclick="IndicatorLineDelete(this)" style="display: none;position: absolute;top: 15px" class="IndicatorLineDelete bigDeleteAttributeCommand element elshanchu11 fl MrginL10"></span>'
	html += '<div class="bigAttribute">'
	html += '<div class="AddingConditions">'
	html += '<ul>'
	html += '<li>'
	html += '<label>图示</label>'
	html += '<select data-mode id=""   class="MapStyle">'
	html += '<option value="0">请选择</option>'
	html += '<option value="1">A图</option>'
	html += '<option value="2">B图</option>'
	html += '</select>'
	html += '</li>'
	html += '<li>'
	html += '<label>方式</label>'
	html += '<select id="" class="IndicatorLineStyleChange iLSel1">'
	html += '<option value="1">定义区间</option>'
	html += '<option value="2">选择参数</option>'
	html += '</select>'
	html += '</li>'
	html+='<li>'
	html+='<label>数值区间</label><input class="iLInputFrom" style="width: 40px;margin-right: 10px" type="text">-'
	html+='<input class="MrginL10 iLInputTo" style="width: 40px;margin-right: 10px" type="text">'
	html+='</li>'
	html+='<li>'
	html+='<label>宽度</label>'
	html+='<input type="number" class="iLWidthInput1 WidthNumber" value="1"  style="max-width: 160px;" />'
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
	html += '<input id="" style="" onchange="BackgroundColor(this)" style="max-width: 20px;" class="iLColor1 BackgroundColor" value="#FFF" />'
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

	$(e).parents(".publicStyle").find(".ControlChartLineAdd").append(html)
	$(e).parents(".publicStyle").find(".ControlChartLineAdd").find(".cellAttribute:last-child").find(".BackgroundColor").colorpicker() //底色调用
}
function IndicatorLineAdd(e){//指示线添加
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
	html+='<input type="number" class="iLWidthInput1 WidthNumber" value="1"  style="max-width: 160px;" />'
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
	html += '<input id="" style="" onchange="BackgroundColor(this)" style="max-width: 20px;" class="iLColor1 BackgroundColor" value="#FFF" />'
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

	$(e).parents(".publicStyle").find(".IndicatorLineAdd").append(html)
	$(e).parents(".publicStyle").find(".IndicatorLineAdd").find(".cellAttribute:last-child").find(".BackgroundColor").colorpicker() //底色调用
}

function DataStyleAdd(e){//数据样式添加
	var html = ""
	html += '<div class="cellAttribute"  style="position: relative">'
	html += '<span onclick="DataStyleDelete(this)" style="display: none;position: absolute;top: 15px" class="IndicatorLineDelete bigDeleteAttributeCommand element elshanchu11 fl MrginL10"></span>'
	html += '<div class="bigAttribute">'
	html += '<div class="AddingConditions">'
	html += '<ul>'
	html += '<li>'
	html += '<select style="max-width: 40px;margin-left: 40px !important;" onchange="DataChangeSymbol(this)" class="dSYValueSel1">'
	html += '<option value="0"> 请选择</option>'
	html += '<option value="1"> > </option>'
	html += '<option value="2"> < </option>'
	html += '</select>'
	html += '<select style="max-width: 60px;margin-left: 5px !important;" onchange="DataChangeVariable(this)" class="dSStyleSel1">'
	html += '<option value="0"> 请选择</option>'
	html += '<option value="1">常量</option>'
	html += '<option value="2">上公差</option>'
	html += '<option value="3">下公差</option>'
	html += '<option value="4">均值</option>'
	html += '</select>'
	html += '<select style="max-width: 40px;margin-left: 5px !important;display: none"  class="SymbolicOperation1">'
	// html += '<option value="0"> 请选择</option>'
	// html += '<option value="+"> + </option>'
	// html += '<option value="-"> - </option>'
	html += '<option value="*"> * </option>'
	// html += '<option value="/"> / </option>'
	html += '</select>'
	html += '<input type="number" class="dSRangeNumber1" value="" style="max-width: 40px;margin-left: 5px !important;">'
	html += '</li>'
	html += '<li>'
	html += '<select style="max-width: 40px;margin-left: 40px !important;" onchange="DataChangeSymbol(this)" class="dSYValueSel2">'
	html += '<option value="0"> 请选择</option>'
	html += '<option value="1"> > </option>'
	html += '<option value="2"> < </option>'
	html += '</select>'
	html += '<select style="max-width: 60px;margin-left: 5px !important;" onchange="DataChangeVariable(this)" class="dSStyleSel2">'
	html += '<option value="0"> 请选择</option>'
	html += '<option value="1">常量</option>'
	html += '<option value="2">上公差</option>'
	html += '<option value="3">下公差</option>'
	html += '<option value="4">均值</option>'
	html += '</select>'
	html += '<select style="max-width: 40px;margin-left: 5px !important;display: none"  class="SymbolicOperation2">'
	// html += '<option value="0"> 请选择</option>'
	// html += '<option value="+"> + </option>'
	// html += '<option value="-"> - </option>'
	html += '<option value="*"> * </option>'
	// html += '<option value="/"> / </option>'
	html += '</select>'
	html += '<input type="number" class="dSRangeNumber2" value="" style="max-width: 40px;margin-left: 5px !important;">'
	html += '</li>'
	html += '<li>'
	html += '<label>数据样式</label>'
	html += '<div style="position: relative;float: left" class="DataType">'
	html += '<p class="Mrgin0 DataTypeShow">'
	html += '<span class=""></span>'
	html += '</p>'
	html += '<div class="DataTypeBody" style="padding:7px 0px">'
	html += '<span class="element elzhengfangxing" value="3" style="margin-left: 10px !important;"></span>'
	html += '<span class="element elduobianxing" value="9" style="margin-left: 10px !important;"></span>'
	html += '<span class="element elsanjiaoxing" value="5" style="margin-left: 10px !important;"></span>'
	html += '<span class="element elyuanxing2" value="6" style="margin-left: 10px !important;"></span>'
	html += '<span class="element ellingxing2" value="2" style="margin-left: 10px !important;"></span>'
	html += '</div>'
	html += '</div>'
	html += '</li>'
	html += '<li>'
	html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
	html += '<li>'
	html += '<label>'
	html += '<input type="checkbox"  checked class="dSCb1 DisplayN">'
	html += '<span style="vertical-align: top;">底色</span>'
	html += '</label>'
	html += '<div style="" class="fl BGCDiv">'
	html += '<div style="width:60px;" class="evo-cp-wrap">'
	html += '<input id="" style="" onchange="BackgroundColor(this)" class="BackgroundColor DSBgColor BackgroundColor1 colorPicker evo-cp15" value="#FFF">'
	html += '<div class="evo-pointer evo- colorind" style="background-color:#FFF"></div>'
	html += '</div>'
	html += '</div>'
	html += '<input type="number" placeholder="透明度" value="" min="0" max="100" class="fl dSTransparency1" style="max-width: 100px;">'
	html += '</li>'
	html += '</ul>'
	html += '</li>'
	// html += '<li>'
	// html += '<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
	// html += '<li>'
	// html += '<label>'
	// html += '<input type="checkbox" class="dSCb2">'
	// html += '<span style="vertical-align: top;">边框</span>'
	// html += '</label><div style="" class="fl BGCDiv">'
	// html += '<div style="width:60px;" class="evo-cp-wrap">'
	// html += '<input id="" style="" onchange="BackgroundColor(this)" class="BackgroundColor BorderColor colorPicker evo-cp16 dSFrameBgColor" value="#FFF">'
	// html += '<div class="evo-pointer evo-colorind" style="background-color:#FFF">'
	// html += '</div>'
	// html += '</div>'
	// html += '</div>'
	// html += '<input type="number" placeholder="宽度" value="" min="0" max="100" class="fl dSWidth" style="max-width: 100px;">'
	// html += '</li>'
	// html += '</ul>'
	// html += '</li>'
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
	html += '<li>'
	html += '<label>'
	html += '<input type="checkbox" checked class="dSCb3">'
	html += '<span style="vertical-align: top;">显示数值</span></label>'
	html += '</li>'
	html += '</ul>'
	html += '</div>'
	html += '</div>'
	html += '</div>'

	$(e).parents(".publicStyle").find(".DataStyleAdd").append(html)
	$(e).parents(".publicStyle").find(".DataStyleAdd").find(".cellAttribute:last-child").find(".BackgroundColor").colorpicker() //底色调用
}

function IndicatorLineDelete(e) { //指示线删除一个大的条件操作栏
	if ($(e).parents(".publicStyle").find(".IndicatorLineAdd").children(".cellAttribute").length > 1) {
		$(e).parents(".cellAttribute").remove()
	}
	if ($(e).parents(".publicStyle").find(".ControlChartLineAdd").children(".cellAttribute").length > 1) {
		$(e).parents(".cellAttribute").remove()
	}
}
function DataStyleDelete(e) { //指示线删除一个大的条件操作栏
	if ($(e).parents(".publicStyle").find(".DataStyleAdd").children(".cellAttribute").length > 1) {
		$(e).parents(".cellAttribute").remove()
	}
}

function bigNewlyAddedCommand(e) { //单元格属性添加一个大的条件操作栏
	var html = ""
	html += '<div class="cellAttribute">'
	html += '<div class="bigAttribute">'
	html += '		<div style="height:20px;">'
	html +=
		'<span onclick="bigDeleteAttributeCommand(this)" style="display: none;" class="bigDeleteAttributeCommand element elshanchu11 fl MrginL10"></span>'
	html += '			<span onclick="NewlyAddedCommand(this)" class="element elxinjian1 fr NewlyAddedCommand MarginR10"></span>'
	html +=
		' 			<span onclick="DeleteAttributeCommand(this)" class="DeleteAttribute element elshanchu11 fr MarginR10"></span>'
	html += ' 			<p class="fr MarginR10 AddCommandText" >添加多条命令</p>'
	html += '		</div>'
	html += ' 		<div id="AddingConditions" class="AddingConditions">'
	html += ' 			<ul>'
	html += ' 				<li>'
	html += ' 					<label>命令</label>'
	html += ' 					<select id="cellProperties" class="cellProperties" ></select>'
	html += ' 				</li>'
	html += ' 				<li>'
	html += ' 					<label>范围</label>'
	html += ' 					<select style="max-width: 60px;" class="RangeSymbol"></select>'
	html +=
		' 					<input type="number" class="RangeNumber" value="1" style="max-width: 100px;" />'
	html += ' 				</li>'
	html += ' 			</ul>'
	html += ' 		</div>'
	html += ' 	</div>'
	html += ' 	<ul id="BackgroundColorGroup" class="BackgroundColorGroup">'
	html += '		<li>'
	html += ' 			<label><span style="vertical-align: top;">底色</span></label>'
	html += ' 			<div style="" class="fl BGCDiv">'
	html +=
		' 				<input id=""  onchange="BackgroundColor(this)" style="" style="max-width: 20px;" class="BackgroundColor" value="#FFF" />'
	html += ' 			</div>'
	html +=
		' 			<input type="number"  placeholder="请输入值" value="100" min="0" max="100" class="fl " style="max-width: 100px;" />'
	html += ' 		</li>'
	html += ' 	</ul>'
	html += ' </div>'

	$(e).parents(".publicStyle").find(".bigCellAttribute").append(html)
	var e1 = $(e).parents(".publicStyle").find(".bigCellAttribute").find(".cellAttribute:last-child").find(
		".cellProperties")
	var e2 = $(e).parents(".publicStyle").find(".bigCellAttribute").find(".cellAttribute:last-child").find(".RangeSymbol")
	$(e).parents(".publicStyle").find(".bigCellAttribute").find(".cellAttribute:last-child").find(".BackgroundColor").colorpicker() //底色调用
	CreatRangeSymbol(e2) //范围符号下拉创建
	CreatCellProperties(e1) //命令下拉创建
}

function bigDeleteAttributeCommand(e) { //单元格属性删除一个大的条件操作栏
	if ($(e).parents(".publicStyle").find(".bigCellAttribute").children(".cellAttribute").length > 1) {
		$(e).parents(".cellAttribute").remove()
	}
}

function CreatCellProperties(e) { //命令下拉创建
	var html = "";
	html += '<option value="all">请选择</option>'
	html += '<option value="cpk">~cpk~</option>'
	html += '<option value="mean">~mean~</option>'
	html += '<option value="cp">~cp~</option>'
	html += '<option value="Range">~Range~</option>'
	if (e != undefined) {
		$(e).parents(".bigAttribute").find(".AddingConditions").children("ul:last-child").find(".cellProperties").html(html)
	} else {
		$(".cellProperties").html(html)
	}
}

function CreatRangeSymbol(e) { //范围符号下拉创建
	var html = "";
	html += '<option value="greaterThan"> > </option>'
	html += '<option value="lessThan"> < </option>'
	html += '<option value="beEqualTo"> = </option>'
	if (e != undefined) {
		$(e).parents(".bigAttribute").find(".AddingConditions").children("ul:last-child").find(".RangeSymbol").html(html)
	} else {
		$(".RangeSymbol").html(html)
	}
}

function RGBToHex(rgb) { //色值转换  rgb与16位色值之间的转换
	var regexp = /[0-9]{0,3}/g;
	var re = rgb.match(regexp); //利用正则表达式去掉多余的部分，将rgb中的数字提取
	var hexColor = "#";
	var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
	for (var i = 0; i < re.length; i++) {
		var r = null,
			c = re[i],
			l = c;
		var hexAr = [];
		while (c > 16) {
			r = c % 16;
			c = (c / 16) >> 0;
			hexAr.push(hex[r]);
		}
		hexAr.push(hex[c]);
		if (l < 16 && l != "") {
			hexAr.push(0)
		}
		hexColor += hexAr.reverse().join('');
	}
	//alert(hexColor)  
	return hexColor;
}

function colorRgb(sColor, num) { //色值转换  16位与rgb色值之间的转换
	sColor = sColor.toLowerCase();
	//十六进制颜色值的正则表达式
	var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	// 如果是16进制颜色
	if (sColor && reg.test(sColor)) {
		if (sColor.length === 4) {
			var sColorNew = "#";
			for (var i = 1; i < 4; i += 1) {
				sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
			}
			sColor = sColorNew;
		}
		//处理六位的颜色值
		var sColorChange = [];
		for (var i = 1; i < 7; i += 2) {
			sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
		}
		return "rgba(" + sColorChange.join(",") + "," + num + ")";
	}
	return sColor;
};

//var insertImg = function(file) { //表格里面插入图片
function insertImg(file) {
	var beginId = "picture"
	var id = beginId + Math.floor(Math.random() * 1000) //随机id
	var ids = WhetherId(id, beginId)
	// if($(".td-chosen-css").children("img")>0){
	// 	$(".td-chosen-css").children("img").remove()
	// }
	$(".td-chosen-css").prepend(
		"<div><img src='' class='img_table' id='" + ids + "'></div>"
	)
	var container = document.createElement('img');
	container.id = ids;

	//var container = $(".td-chosen-css > div").children("img").attr("id")
	//缩略图类定义
	var Picture = function(file, container) {
		var height = 0,
			width = 0,
			ext = '',
			size = 0,
			name = '',
			path = '';
		var self = this;
		if (file) {
			name = file.value;
			if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
				file.select();
				path = document.selection.createRange().text;
			} else {
				if (file.files) {
					// path =  file.files.item(0).getAsDataURL(); // firefox7.0之后该方法弃用了，用下面那个
					path = window.URL.createObjectURL(file.files[0]);
				} else {
					path = file.value;
				}
			}
		} else {
			throw '无效的文件';
		}
		ext = name.substr(name.lastIndexOf("."), name.length);
		container.src = path;
		container.alt = name;
		container.style.visibility = 'visible';
		height = container.height;
		width = container.width;
		size = container.fileSize;
		var currSelection = handsonTable.getSelected();
		if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
			|| currSelection[0].length < 4)
			return false;
		handsonTableOptions.data[currSelection[0][0]][currSelection[0][1]] = container.outerHTML;
		handsonTable.updateSettings(handsonTableOptions);
		this.get = function(name) {
			return self[name];
		};
		this.isValid = function() {
			if (allowExt.indexOf(self.ext) !== -1) {
				throw '不允许上传该文件类型';
				return false;
			}
		}
	};

	try {
		var pic = new Picture(file, container);//document.getElementById('' + container));
	} catch (e) {
		alert(e);
	}
}
function BackgroundColor(e) { //单元格属性底色
	$(e).css("background-color", e.value)
	var sheet = document.styleSheets[0];
	var rules = sheet.cssRules || sheet.rules;
	// 	var RangeSymbolVal = $("#AddingConditions ul").eq(0).find(".RangeSymbol").val()
	// 	var RangeNumberVal = Number($("#AddingConditions ul").eq(0).find(".RangeNumber").val())
	// 	var cellPropertiesVal = $("#AddingConditions ul").eq(0).find(".cellProperties").val()
	// 	var datasource = JSON.parse($(".td-chosen-css").parents(".resizabletable").data("source"))
	// 	if ($("#AddingConditions ul").length <= 1) {
	// 		if ($("#AddingConditions ul").eq(0).find(".cellProperties").val() != "all") {
	// 			if ($("#AddingConditions ul").length == 1) {
	// 				if (RangeSymbolVal == "greaterThan") {
	// 					if (datasource[cellPropertiesVal] <= RangeNumberVal) {
	// 						$(".td-chosen-css").css("background-color", "#fff")
	// 					} else {
	// 						$(".td-chosen-css").css("background-color", e.value)
	// 					}
	// 				} else if (RangeSymbolVal == "lessThan") {
	// 					if (datasource[cellPropertiesVal] >= RangeNumberVal) {
	// 						$(".td-chosen-css").css("background-color", "#fff")
	// 					} else {
	// 						$(".td-chosen-css").css("background-color", e.value)
	// 					}
	// 				} else if (RangeSymbolVal == "beEqualTo" || $(".td-chosen-css").data(cellPropertiesVal) == undefined) {
	//
	// 					if (datasource[cellPropertiesVal] < RangeNumberVal || datasource[cellPropertiesVal] >
	// 						RangeNumberVal) {
	// 						$(".td-chosen-css").css("background-color", "#fff")
	// 					} else {
	// 						$(".td-chosen-css").css("background-color", e.value)
	// 					}
	// 				}
	// 			}
	// 		} else {
	// 			$(".td-chosen-css").css("background-color", "#fff")
	// 		}
	// 	} else {
	// 		bacColorCondition(e)
	//
	// 	}
}
$(function() { //富文本操作
	CreatRangeSymbol() //范围符号下拉创建
	CreatCellProperties() //命令下拉创建
	$('#cpBoth').colorpicker(); //字体颜色拾色器
	$("#BgColor").colorpicker(); //背景颜色拾色器
	$("#BackgroundColor10").colorpicker();
	$(".BackgroundColor").colorpicker(); //底色拾色器
	$(".BackgroundColor1").colorpicker(); //底色拾色器
	$(".BackgroundColor2").colorpicker(); //底色拾色器
	$(".BackgroundColor3").colorpicker(); //底色拾色器
	$("#BackgroundColor4").colorpicker(); //底色拾色器
	$("#BackgroundColor5").colorpicker(); //底色拾色器

	$(document).on("click", function() { //点击其他保存表格数据

		if ($(".reportContCont .resizabletable").length == 1) {
			localStorage.setItem("table", JSON.stringify($(".reportContCont .resizabletable").eq(0).find("table").html()))
			var trNum = $(".reportContCont .resizabletable").eq(0).find("tbody").find("tr").length
			var tdNum = $(".reportContCont .resizabletable").eq(0).find("tr:eq(0)").find("td").length
			var td = null
			var tableText = []
			for (var i = 0; i < trNum; i++) {
				if (i != 0) {
					for (var j = 0; j < tdNum; j++) {
						if (j != 0) {
							td = $(".reportContCont .resizabletable").eq(0).find("tbody").find("tr:eq(" + i + ")").find("td:eq(" + j +
								")")
							if (td.text() || $(td).find("img").length > 0 || $(td).find(".resizable3").length > 0) {
								var item = {}
								item.resizabletable = $(td).parents(".resizabletable").index()
								item.tableClass = $(td).parents(".wyb-excel-table").attr("class")
								item.rowNum = $(td).parents("tr").index() //第几行
								item.colNum = $(td).index() //第几列
								item.rowspan = $(td).attr("rowspan") //合并行
								item.colspan = $(td).attr("colspan") //合并列
								item.totalRowNum = $(td).parents("tbody").find("tr").length
								item.totalColNum = $(td).parents("tr").find("td").length
								item.parentWidth = $(td).parents(".resizabletable ").css("width")
								item.parentHeight = $(td).parents(".resizabletable ").css("height")
								item.BackgroundColor = $(td).css("background-color")
								if ($(td).attr("data-ThRule")) {
									item.ruleString = $(td).attr("data-ThRule") //变色规则字符串
								}
								if ($(td).attr("data-keycondition")) {
									item.keycondition = $(td).attr("data-keycondition") //根据这些关键字的值形成规则
								}
								if ($(td).attr("data-BackgroundColorArray")) {
									item.BackgroundColorArray = $(td).attr("data-BackgroundColorArray") //变色规则对应的色值
								}
								if ($(td).attr("data-JudgementSTring")) {
									item.JudgementSTring = $(td).attr("data-JudgementSTring") //变色规则
								}
								if ($(td).find("img").length > 0) {
									item.imgSrc = $(td).find("img").attr("src")
								} else if ($(td).find(".resizable3").length > 0) {
									item.chartId = $(td).find(".resizable3").attr("id")
								} else {
									item.text = $(td).text()
								}
								tableText.push(item)
								localStorage.setItem("tableText", JSON.stringify(tableText));

								var table1 = JSON.stringify($(".reportContCont .resizabletable").eq(0).find("table").html());
								var tableText1 = JSON.stringify(tableText);

								// ajax 报告id =1
								jQuery.ajax({
									url: '/report/save',
									type: 'post',
									data: {
										'id': "1"
										,'table1': table1
										,"tableText":tableText1
									},
									error: function(msg) {
										alert("error");
									},
									success: function(msg) {
										console.log(msg == 0 ? "保存成功" :"保存失败");
									}
								});
							}
						}
					}
				}

			}
		} else {
			var resizabletableLength = $(".reportContCont .resizabletable").length
			var bigTableText = []
			for (var n = 0; n < resizabletableLength; n++) {
				var trNum = $(".reportContCont .resizabletable").eq(n).find("tbody").find("tr").length
				var tdNum = $(".reportContCont .resizabletable").eq(n).find("tbody").find("tr:eq(0)").find("td").length
				var td = null
				var tableText = []
				for (var i = 0; i < trNum; i++) {
					if (i != 0) {
						for (var j = 0; j < tdNum; j++) {
							if (j != 0) {
								td = $(".reportContCont .resizabletable").eq(n).find("tbody").find("tr:eq(" + i + ")").find("td:eq(" + j +
									")")
								if (td.text() || $(td).find("img").length > 0 || $(td).find(".resizable3").length > 0) {
									var item = {}
									item.resizabletable = $(td).parents(".resizabletable").index()
									item.tableClass = $(td).parents(".wyb-excel-table").attr("class")
									item.rowNum = $(td).parents("tr").index()
									item.colNum = $(td).index()
									item.rowspan = $(td).attr("rowspan")
									item.colspan = $(td).attr("colspan")
									item.totalRowNum = $(td).parents("tbody").find("tr").length
									item.totalColNum = $(td).parents("tr").find("td").length
									item.parentWidth = $(td).parents(".resizabletable ").css("width")
									item.parentHeight = $(td).parents(".resizabletable ").css("height")
									item.BackgroundColor = $(td).css("background-color")
									if ($(td).attr("data-ThRule")) {
										item.ruleString = $(td).attr("data-ThRule") //变色规则字符串
									}
									if ($(td).attr("data-keycondition")) {
										item.keycondition = $(td).attr("data-keycondition") //根据这些关键字的值形成规则
									}
									if ($(td).attr("data-BackgroundColorArray")) {
										item.BackgroundColorArray = $(td).attr("data-BackgroundColorArray") //变色规则对应的色值
									}
									if ($(td).attr("data-JudgementSTring")) {
										item.JudgementSTring = $(td).attr("data-JudgementSTring") //变色规则
									}
									if ($(td).find("img").length > 0) {
										item.imgSrc = $(td).find("img").attr("src")
									} else if ($(td).find(".resizable3").length > 0) {
										item.chartId = $(td).find(".resizable3").attr("id")
									} else {
										item.text = $(td).text()
									}
									tableText.push(item)
									localStorage.setItem("tableText", JSON.stringify(tableText))

								}
							}
						}
					}

				}
				bigTableText.push(tableText)
			}
		}
	})
	var dataoption = [ {
		"lable": "1",
		"name": "biaoyi"
	}
	]
	var option = "";
	for (var i = 0; i < dataoption.length; i++) { //数据源
		option += "<option value = '" + dataoption[i].lable + "'>" + dataoption[i].name + "</option>"
	}
	$(".dataSourceSelect").append(option) //数据源
	$("#dataSourceSelect").change(function() { //加载数据源数据
		var val = $(this).val()
		handsonTableActiveAjaxCalls++
		var url = ctx + "/static/js/projectJs/data1.json";
		if (val == 1) {
			url = ctx + "/static/js/projectJs/data1.json"
		} else {
			url = ctx + "/static/js/projectJs/data2.json"
		}
		$.ajax({
			url: url,
			type: "get",
			datatype: "JSON",
			// data: {
			// 	parameter_A: $("#parameter_A").val(),
			// 	parameter_B: $("#parameter_B").val()
			// },
			success: function(msg) {
				var result = msg.data;
				var rule = msg.rule;
				handsonTableActiveAjaxCalls--
				for (var i = 0; i < rule.length; i++) {
					$("#reportContCont .resizabletable").eq(i).attr("data-source", JSON.stringify(rule[i]))
				}
				if (localStorage.getItem("tableText")) {
					var tableText = JSON.parse(localStorage.getItem("tableText"))
					for (var j = 0; j < tableText.length; j++) {
						var resizabletableNUm = tableText[j].resizabletable
						var itemArry = tableText[j]
						if (itemArry.chartId != undefined) {
							var data = []; //拼成图表所需的数据格式
							for (var i = 0; i < result.length; i++) {
								item = {}
								if (i == 0) {
									for (var k in result[0]) {
										var item = {}
										if (k != "fx" && k != "f_label") {
											item.num_sent = k
											item.perc = result[0][k]
											data.push(item)
										}
									}
								}
							}
							var ids = itemArry.chartId,
								width = $("#" + itemArry.chartId).parents("td").width(),
								height = $("#" + itemArry.chartId).parents("td").height();
							$("#" + itemArry.chartId).parents("td").attr("data-chartSource", JSON.stringify(data))
							if (itemArry.JudgementSTring) {
								var BackgroundColorArray = JSON.parse(itemArry.BackgroundColorArray),
									JudgementSTring = itemArry.JudgementSTring,
									keycondition = JSON.parse(itemArry.keycondition),
									num, NewJudgementSTring;
								console.log(BackgroundColorArray)
								console.log(keycondition)
								console.log(rule[0])
								for (var i = 0; i < keycondition.length; i++) {
									var itemkeycondition = keycondition[i]
									for (var n = 0; n < itemkeycondition.length; n++) {
										num = rule[0][itemkeycondition[n]]
										re = new RegExp(itemkeycondition[n], "g");
										JudgementSTring = JudgementSTring.replace(re, num)
									}
								}
								var JudgementArray = JudgementSTring.split("||")
								for (var i = 0; i < JudgementArray.length; i++) {
									if (eval(JudgementArray[i])) {
										$("#reportContCont .resizabletable").eq(resizabletableNUm).find("tbody").find("tr:eq(" + itemArry.rowNum +
											")").find("td:eq(" + itemArry.colNum + ")").css("background-color", BackgroundColorArray[i])
									}
								}
							}
							ParetoChart(ids, data, width, height)
							if (handsonTableActiveAjaxCalls == 0) {
								moveChartsFromAltToAltHolder()
							}
						} else if (itemArry.imgSrc != undefined) {
							if (itemArry.JudgementSTring) {
								var BackgroundColorArray = JSON.parse(itemArry.BackgroundColorArray),
									JudgementSTring = itemArry.JudgementSTring,
									keycondition = JSON.parse(itemArry.keycondition),
									num, NewJudgementSTring;
								for (var i = 0; i < keycondition.length; i++) {
									var itemkeycondition = keycondition[i]
									for (var n = 0; n < itemkeycondition.length; n++) {
										num = rule[0][itemkeycondition[n]]
										re = new RegExp(itemkeycondition[n], "g");
										JudgementSTring = JudgementSTring.replace(re, num)
									}
								}
								var JudgementArray = JudgementSTring.split("||")
								for (var i = 0; i < JudgementArray.length; i++) {
									if (eval(JudgementArray[i])) {
										$("#reportContCont .resizabletable").eq(resizabletableNUm).find("tbody").find("tr:eq(" + itemArry.rowNum +
											")").find("td:eq(" + itemArry.colNum + ")").css("background-color", BackgroundColorArray[i])
									}
								}
							}
							$("#reportContCont .resizabletable").eq(resizabletableNUm).find("tbody").find("tr:eq(" + itemArry.rowNum +
								")").find("td:eq(" + itemArry.colNum + ")").find("img").attr("src", itemArry.imgSrc)
						} else if (itemArry.imgSrc == undefined && itemArry.chartId == undefined) {
							var text = itemArry.text.replace(/;/g, '=').replace(/,/g, '=').replace(/；/g, '=').replace(/，/g, '=').split(
								"=")
							var strings = "",
								BackgroundColor;
							for (var i = 0; i < text.length; i++) {
								if (i % 2 == 0) {
									if (i == text.length - 2) {
										strings += text[i] + "=" + rule[0][text[i]]
									} else {
										strings += text[i] + "=" + rule[0][text[i]] + ","
									}

								}
							}
							if (itemArry.JudgementSTring) {
								var BackgroundColorArray = JSON.parse(itemArry.BackgroundColorArray),
									JudgementSTring = itemArry.JudgementSTring,
									keycondition = JSON.parse(itemArry.keycondition),
									num, NewJudgementSTring;
								for (var i = 0; i < keycondition.length; i++) {
									var itemkeycondition = keycondition[i]
									for (var n = 0; n < itemkeycondition.length; n++) {
										num = rule[0][itemkeycondition[n]]
										re = new RegExp(itemkeycondition[n], "g");
										JudgementSTring = JudgementSTring.replace(re, num)
									}
								}
								var JudgementArray = JudgementSTring.split("||")
								for (var i = 0; i < JudgementArray.length; i++) {
									if (eval(JudgementArray[i])) {
										$("#reportContCont .resizabletable").eq(resizabletableNUm).find("tbody").find("tr:eq(" + itemArry.rowNum +
											")").find("td:eq(" + itemArry.colNum + ")").css("background-color", BackgroundColorArray[i])
									}
								}
							}
							$("#reportContCont .resizabletable").eq(resizabletableNUm).find("tbody").find("tr:eq(" + itemArry.rowNum +
								")").find("td:eq(" + itemArry.colNum + ")").text(strings)
						}
					}

				}

			},
			error: function() {
				alert("提交失败！");
			}
		});
	})

	$(".reportContCont").on("resize", ".resizable3", function() { //监听图表放大缩小
		var ids = $(this).attr("id"),
			width = $(this).width(),
			height = $(this).height(),
			data;
		if (ids.indexOf("ParetoChar") >= 0) {
			if ($("#" + ids).parents("td").attr("data-chartSource")) {
				data = JSON.parse($("#" + ids).parents("td").attr("data-chartSource"))
			}
			ParetoChart(ids, data, width, height)
		} else if (ids.indexOf("barChart") >= 0) {
			columnChart(ids, width, height)
		}
	});

	$('#command').change(function() { //命令切换事件
		var _this = $(this)
		var val = $("#dataSourceSelect").val()
		if (val != 0) {
			$(".td-chosen-css").attr("data-command", $(this).val())
			var url = "static/js/projectJs/data1.json";
			if (val == 1) {
				url = "static/js/projectJs/data1.json"
			} else {
				url = "static/js/projectJs/data2.json"
			}
			$.ajax({
				url: url,
				type: "get",
				datatype: "JSON",
				// data: {
				// 	parameter_A: $("#parameter_A").val(),
				// 	parameter_B: $("#parameter_B").val()
				// },
				success: function(msg) {
					var rule = msg.rule;;
					if (rule.length > 0) {
						$(".td-chosen-css").append(rule[0][$(_this.val()).selector])
					}
				},
				error: function() {
					alert("提交失败！");
				}
			});
		} else {
			alert("请选择数据源")
		}

		populateCellWithCommand($(this).val());
	})

	//$(".reportContCont").on("click", "td", function() { //多个表格消除添加td-chosen-css // 不同table只能有一个class  td-chosen-css
	$("#handsonContainer").on("click", "td", function() { //多个表格消除添加td-chosen-css // 不同table只能有一个class  td-chosen-css
		//$(this).parents(".reportContCont").find("td").removeClass("td-chosen-css")
		var currentChosenTds = $(this).parents('#handsonContainer')
			.find('td');
		for (var i = 0; i < currentChosenTds.length; i++) {
			var currentCellHelper = $(currentChosenTds[i]).html().split('=');
			if (currentCellHelper.length > 1) {
				if (currentCellHelper[0] === 'cp' || currentCellHelper[0] === 'cpk'
					|| currentCellHelper[0] === 'mean' || currentCellHelper[0] === 'Range') {
					$(currentChosenTds[i]).attr('cellType', currentCellHelper[0]);
					$(currentChosenTds[i]).attr('cellValue', currentCellHelper[1]);
					$(currentChosenTds[i]).html(currentCellHelper[1]);
				}
			}
		}

		$(this).parents("#handsonContainer").find("td").removeClass("td-chosen-css");

		var currentCellType = $(this).attr('cellType');
		var currentCellValue = $(this).attr('cellValue');
		if (currentCellType && currentCellValue && typeof currentCellType !== 'undefined'
			&& typeof currentCellValue !== 'undefined') {
			if (currentCellType === 'cp' || currentCellType === 'cpk'
				|| currentCellType === 'mean' || currentCellType === 'Range') {
				$(this).html(currentCellType + '=' + currentCellValue);
			}
		}
		$(this).addClass("td-chosen-css")
		var ids = $(this).attr("id")
		var selectedHandsonTableCellType = '';
		if (typeof handsonTable !== 'undefined') {
			var currSelection = handsonTable.getSelected();
			if (typeof currSelection === 'undefined' || typeof currSelection[0] === 'undefined'
				|| currSelection[0].length < 4) {
				//return false;
			} else {
				if (typeof handsonTableHelperObjTrendMaps[currSelection[0][0]+','+currSelection[0][1]]
					!== 'undefined') {
					selectedHandsonTableCellType = 'TrendMap';
				} else if (typeof handsonTableHelperObjParetos[currSelection[0][0]+','+currSelection[0][1]]
					!== 'undefined') {
					selectedHandsonTableCellType = 'ParetoChart';
				} else if (typeof handsonTableHelperObjHistograms[currSelection[0][0]+','+currSelection[0][1]]
					!== 'undefined') {
					selectedHandsonTableCellType = 'Histogram';
				}
			}
		}
		if ($(this).find("div[id^='ParetoChart']").length > 0 || selectedHandsonTableCellType === 'ParetoChart') {
			toggleOperationContControls('ParetoChart');
		} else if ($(this).find("div[id^='barChart']").length > 0) { //直方图
			columnChart(ids, width, height)
		} else if ($(this).find("div[id^='TrendMap']").length > 0 || selectedHandsonTableCellType === 'TrendMap') { //趋势图
			toggleOperationContControls('TrendMap');
		} else if ($(this).find("div[id^='Histogram']").length > 0 ||
			selectedHandsonTableCellType === 'Histogram') { //趋势图
			toggleOperationContControls('Histogram');
		} else {
			toggleOperationContControls('fuwenben');
		}
	})
	$("#ParagraphDistance").change(function() { //段前距
		$(".td-chosen-css").css({
			"padding-top": $(this).val() + "px"
		}).addClass("verticalTop")
	});
	$("#SegmentBackDistance").change(function() { //段后距
		$(".td-chosen-css").css({
			"padding-bottom": $(this).val() + "em"
		}).addClass("verticalBottom")
	});
	$("#RowSpacing").change(function() { //行间距
		$(".td-chosen-css").css("line-height", $(this).val() + "em")
	});
	$("#Title").change(function() { //标题
		alert($(this).val())
		$(".td-chosen-css").css({
			"font-size": $(this).val() + "px"
		})
	});
	$("#fontSize").change(function() { //字号
		$(".td-chosen-css").css("font-size", $(this).val() + "px")
	});
	$("#InsertRowBefore").click(function() { //向前插入行
		InsertRowBeforeWrapper();
	})
	$("#deleteRow").click(function() { //删除行
		deleteRowWrapper();
	})
	$("#InsertColumn").click(function() { //向前插入列
		InsertColumnWrapper();
	})
	$("#deleteColumn").click(function() { //删除列
		deleteColumnWrapper();
	})
})
