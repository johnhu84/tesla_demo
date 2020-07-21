$(function() {
	// changechildfenzu()////选择分组二调用
	changefenzu() //选择分组一调用
	tubiao() //加载图标
	// table_yangben()
	// table_cedian()
	// zhexian()

	$(".TraceBackTo ul").on("click", "li", function() {
		$(this).addClass("on").siblings("li").removeClass("on")
		var num = $(this).index()
		$(".TraceBackTo .col-10>div").eq(num).removeClass("displayN").siblings().addClass("displayN")
	})
	
	//进入页面进行的dom操作
	$(".publicTab ul li").click(function(){
         $(this).addClass("on").siblings("li").removeClass("on")
		// $(this).parents("publicTab").find("publicTabcont").children("div:eq("+$(this).index()+")").addClass("on").siblings("div").removeClass("on")
	})
})

function attrSrc() { //设置ifram  src 切换页面
	parent.attrParent("./passRateSortChild.html")
}

// var obj = document.getElementById("proxyserial1")//切换选择分组
// var flag = false
// obj.addEventListener("click", funcNum , false);//监听点击事件
function funcNum(){
		if(flag){
			flag = false
		}else{
			flag = true
			if($("#proxyserial2").text()=="区域"){
				// alert(111)
				changechildfenzu()
			}else{
				changechildfenzu1()
			}
		}
	
	
}

function changefenzu() { //主页面父级 选择分组
	var setting = {
		view: {
			dblClickExpand: false,
			selectedMulti: false,
			showIcon: true,
			// fontCss : getFontCss
		},
		check: {
			// chkStyle: "checkbox", //多选
			chkStyle: "radio", //单选
			enable: true
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			onClick: zTreeOnClick,
			// onCheck: zTreeOnCheck,
			// onSelect : zTreeOnSelect
		}
	};
	var zNodes1 = [
		{
			"id": 2,
			"pId": 0,
			"name": "区域",
			"title": "区域",
			"open": true,
			 "checked":true
		},
		{
			"id": 3,
			"pId": 0,
			"name": "类型",
			"title": "类型",
			"open": true
		}

	];
	// $("#proxyserial2").zTreeSelect(setting, zNodes1);
	$("#proxyserial2").text("区域")
}

function changechildfenzu1() { //选择分组
	var setting = {
		view: {
			dblClickExpand: false,
			selectedMulti: false,
			showIcon: true,
			// fontCss : getFontCss
		},
		check: {
			chkStyle : "checkbox",//多选
			// chkStyle: "radio", //单选
			enable: true
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			onClick: zTreeOnClick,
			onCheck: zTreeOnCheck,
			// onSelect : zTreeOnSelect
		}
	};
	var zNodes1 = [{
			"id": 1,
			"pId": 0,
			"name": "类型H",
			"title": "类型H",
			"open": true
		},
		{
			"id": 2,
			"pId": 0,
			"name": "类型A",
			"title": "类型A",
			"open": true
		},
		{
			"id": 3,
			"pId": 0,
			"name": "类型B",
			"title": "类型B",
			"open": true
		}

	];
	$("#proxyserial1").zTreeSelect(setting, zNodes1);
}

function changechildfenzu() { //选择分组
	var setting = {
		view: {
			dblClickExpand: false,
			selectedMulti: false,
			showIcon: true,
			// fontCss : getFontCss
		},
		check: {
			chkStyle : "checkbox",//多选
			// chkStyle: "radio", //单选
			enable: true
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			onClick: zTreeOnClick,
			onCheck: zTreeOnCheck,
			// onSelect : zTreeOnSelect
		}
	};
	var zNodes1 = [{
			"id": 1,
			"pId": 0,
			"name": "机舱H",
			"title": "机舱",
			"open": true
		},
		{
			"id": 2,
			"pId": 0,
			"name": "机舱A",
			"title": "机舱A",
			"open": true
		},
		{
			"id": 3,
			"pId": 0,
			"name": "机舱B",
			"title": "机舱B",
			"open": true
		},
		{
			"id": 5,
			"pId": 0,
			"name": "机舱C",
			"title": "机舱C",
			"open": true
		},
		{
			"id": 6,
			"pId": 0,
			"name": "机舱D",
			"title": "机舱D",
			"open": true
		}

	];
	$("#proxyserial1").zTreeSelect(setting, zNodes1);
}

function changechildfenzu2() { //选择分组
	var setting = {
		view: {
			dblClickExpand: false,
			selectedMulti: false,
			showIcon: true,
			// fontCss : getFontCss
		},
		check: {
			chkStyle : "checkbox",//多选
			// chkStyle: "radio", //单选
			enable: true
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			onClick: zTreeOnClick,
			onCheck: zTreeOnCheck,
			// onSelect : zTreeOnSelect
		}
	};
	var zNodes1 = [{
			"id": 1,
			"pId": 0,
			"name": "子机舱H",
			"title": "子机舱",
			"open": true
		},
		{
			"id": 2,
			"pId": 0,
			"name": "子机舱A",
			"title": "子机舱A",
			"open": true
		},
		{
			"id": 3,
			"pId": 0,
			"name": "子机舱B",
			"title": "子机舱B",
			"open": true
		},
		{
			"id": 5,
			"pId": 0,
			"name": "子机舱C",
			"title": "子机舱C",
			"open": true
		},
		{
			"id": 6,
			"pId": 0,
			"name": "子机舱D",
			"title": "子机舱D",
			"open": true
		}

	];
	$("#proxyserial3").zTreeSelect(setting, zNodes1);
}


function tubiao() { //图标加载函数
	var data = [60, 97, 80, 91, 85]
	var id = "#container"
	var title = '区域合格率'
	var categories = ['机舱', '车门', '底板', '车头', '轮胎']
	var seriesdata = []
	var seriesname = "区域"
	var minTargetValue = 70
	var TargetValue = 90
	for (var i = 0; i < data.length; i++) {
		if (data[i] >= TargetValue) {
			var obj = {}
			obj.y = data[i]
			obj.color = "#4FCB73"
			// obj.sliced= true,//默认选择这个数据
			// obj.selected= true//默认选择这个数据
			seriesdata.push(obj)
		} else if (data[i] > minTargetValue && data[i] <= TargetValue) {
			var obj = {}
			obj.y = data[i]
			obj.color = "#FFAE00"
			seriesdata.push(obj)
		} else if (data[i] < minTargetValue) {
			var obj = {}
			obj.y = data[i]
			obj.color = "#FF0000"
			seriesdata.push(obj)
		}
	}
	// chartdefault(id, title, categories, seriesdata, seriesname, minTargetValue, TargetValue) //图标生成
}

function AjaxData(name,title) { //点击柱子加载子
	var data = [69, 90, 70, 88, 99]
	var id = "#container"
	var title = '机舱合格率'
	var categories = ['机舱A', '机舱B', '机舱C', '机舱D', '机舱F']
	var seriesdata = []
	var seriesname = "机舱"
	var minTargetValue = 70
	var TargetValue = 90
	for (var i = 0; i < data.length; i++) {
		if (data[i] >= TargetValue) {
			var obj = {}
			obj.y = data[i]
			obj.color = "#4FCB73"
			seriesdata.push(obj)
		} else if (data[i] >= minTargetValue && data[i] < TargetValue) {
			var obj = {}
			obj.y = data[i]
			obj.color = "#FFAE00"
			seriesdata.push(obj)
		} else if (data[i] < minTargetValue) {
			var obj = {}
			obj.y = data[i]
			obj.color = "#FF0000"
			seriesdata.push(obj)
		}
	}
	$(".zTreeSelectparent").css("display","none")
	$(".zTreeSelectparentone").css("display","none")
	$(".zTreeSelectparenttwo").css("display","block")
	changechildfenzu2()//点击主子加载下拉选择
	// chartdefault1(id, title, categories, seriesdata, seriesname, minTargetValue, TargetValue)//调用生成子图表
	
}

function AjaxDatachild(name,title) { //点击子柱子加载表格数据
alert("11")
	
	// changechildfenzu()//改变下拉的值
}


function edit() { //设置目标值
	// $.ajax({
	// 	type: "POST",
	// 	url: " ${ctx}/deviationTargetValue/get",
	// 	data: params,
	// 	dataType: "json",
	// 	cache: false,
	// 	success: function(data) {
	// 		// $("#id").val(data.id);
	// 		// $("#targetValue").val(data.targetValue);
	// 		// $("#minTargetValue").val(data.minTargetValue);
	// 	}
	// });
	layer.open({
		type: 1,
		offset: '10%', //top
		scrollbar: false,
		area: ['50%', '50%'],
		maxmin: true, //开启最大化最小化按钮
		shade: 0,
		shadeClose: true, //点击遮罩关闭
		content: $('#myModal'), //注意，如果str是object，那么需要字符拼接。
		end: function() {
			$("#myModal").hide();
		}
	});
}


// function table_yangben() {// 样本主页面表格加载
// 	jQuery("#table_yangben").jqGrid({
// 		url: 'static/js/passRateSort/data.json',
// 		datatype: "json",
// 		colNames: ['模板编号', '模板名称', '保存时间', '制作人', "Action"],
// 		colModel: [
//
// 			{
// 				name: 'id',
// 				index: 'id',
// 				width: 110
// 			},
// 			{
// 				name: 'invdate',
// 				index: 'invdate',
// 				width: 160
// 			},
// 			{
// 				name: 'name',
// 				index: 'name',
// 				width: 160
// 			},
// 			{
// 				name: 'amount',
// 				index: 'amount',
// 				align: "right",
// 				width: 110
// 			},
// 			{
// 				name: 'act',
// 				index: 'act',
// 				width: 110,
// 				sortable: false
// 			}, //操作栏
// 			// {name : 'tax',index : 'tax',align : "right",width : 110},
// 		],
// 		rowNum: 10,
// 		rowList: [10, 20, 30],
// 		pager: '#pagerYangben',
// 		sortname: 'id',
// 		pgbuttons: true, //控制翻页按钮
// 		// loadonce: true,//
// 		pginput: true, //控制跳转框
// 		autowidth: true,
// 		shrinkToFit: true,
// 		viewrecords: true, //设置是否在Pager Bar显示所有记录的总数。
// 		sortorder: "desc",
// 		multiselect: true, //checkbox控制多选框显示与否
// 		multiboxonly: true,
// 		gridComplete: function() {
// 			var ids = jQuery("#table_yangben").jqGrid('getDataIDs');
// 			console.log(ids)
// 			for (var i = 0; i < ids.length; i++) {
// 				var cl = ids[i];
// 				ce = "<a class=' delRow' href='#' data-id=" + cl + " >删除</a>";
// 				jQuery("#table_yangben").jqGrid('setRowData', ids[i], {
// 					act: ce
// 				});
// 			}
// 		},
// 		editurl: '${ctx}/static/js/jqGrid/data.json',
// 		// caption : "Custom edit ",//表头
// 		loadComplete: function() {
// 			var ids = localStorage.getItem("rowdata")
// 			if(ids!=null&&ids!=undefined){
// 				for (var i = 0; i < ids.length; i++) {
// 					$("#table_yangben").jqGrid('setSelection', ids[i].id);
// 				}
// 			}
//
//
// 		}
// 	});
// 	jQuery("#addsurbtn1").click(function() {
// 		// var id=$('#gridTable').jqGrid('getGridParam','selarrrow');//获取多行id
// 		var ids = jQuery("#table_yangben").jqGrid("getGridParam", "selrow") //获取点击最后一行id
// 		console.log(ids)
// 	});
// 	jQuery("#cm1s").click(function() {
// 		jQuery("#table_yangben").jqGrid('setSelection', "13");
// 	});
// 	jQuery("#table_yangben").on("click", ".delRow", function() { //点击删除一行
// 		console.log($(this).data("id"))
// 		$("#table_yangben").trigger("reloadGrid");
// 	});
// 	jQuery("#table_yangben").jqGrid('navGrid', '#pager13', {
// 			add: false,
// 			edit: false,
// 			del: false
// 		}, {}, // edit parameters
// 		{}, // add parameters
// 		{
// 			reloadAfterSubmit: false
// 		} //delete parameters
// 	);
//
// }

// function table_cedian() {//测点主页面表格加载
// 	jQuery("#table_cedian").jqGrid({
// 		url: 'static/js/passRateSort/data.json',
// 		datatype: "json",
// 		colNames: ['模板编号', '模板名称', '保存时间', '制作人', "Action"],
// 		colModel: [
//
// 			{
// 				name: 'id',
// 				index: 'id',
// 				width: 110
// 			},
// 			{
// 				name: 'invdate',
// 				index: 'invdate',
// 				width: 160
// 			},
// 			{
// 				name: 'name',
// 				index: 'name',
// 				width: 160
// 			},
// 			{
// 				name: 'amount',
// 				index: 'amount',
// 				align: "right",
// 				width: 110
// 			},
// 			{
// 				name: 'act',
// 				index: 'act',
// 				width: 110,
// 				sortable: false
// 			}, //操作栏
// 			// {name : 'tax',index : 'tax',align : "right",width : 110},
// 		],
// 		rowNum: 10,
// 		rowList: [10, 20, 30],
// 		pager: '#pagerCedian',
// 		sortname: 'id',
// 		pgbuttons: true, //控制翻页按钮
// 		// loadonce: true,//
// 		pginput: true, //控制跳转框
// 		autowidth: true,
// 		shrinkToFit: true,
// 		viewrecords: true, //设置是否在Pager Bar显示所有记录的总数。
// 		sortorder: "desc",
// 		multiselect: true, //checkbox控制多选框显示与否
// 		multiboxonly: true,
// 		gridComplete: function() {
// 			var ids = jQuery("#table_cedian").jqGrid('getDataIDs');
// 			console.log(ids)
// 			for (var i = 0; i < ids.length; i++) {
// 				var cl = ids[i];
// 				ce = "<a class=' delRow' href='#' data-id=" + cl + " >删除</a>";
// 				jQuery("#table_cedian").jqGrid('setRowData', ids[i], {
// 					act: ce
// 				});
// 			}
// 		},
// 		editurl: '${ctx}/static/js/jqGrid/data.json',
// 		// caption : "Custom edit ",//表头
// 		loadComplete: function() {
// 			var ids = localStorage.getItem("rowdata")
// 			if(ids!=null&&ids!=undefined){
// 				for (var i = 0; i < ids.length; i++) {
// 					$("#table_yangben").jqGrid('setSelection', ids[i].id);
// 				}
// 			}
//
// 		}
// 	});
// 	jQuery("#addsurbtn1").click(function() {
// 		var id=$('#gridTable').jqGrid('getGridParam','selarrrow');//获取多行id
// 		// var ids = jQuery("#table_cedian").jqGrid("getGridParam", "selrow") //获取点击最后一行id
// 		console.log(ids)
// 	});
// 	jQuery("#cm1s").click(function() {
// 		jQuery("#table_cedian").jqGrid('setSelection', "13");
// 	});
// 	jQuery("#table_cedian").on("click", ".delRow", function() { //点击删除一行
// 		console.log($(this).data("id"))
// 		$("#table_cedian").trigger("reloadGrid");
// 	});
// 	jQuery("#table_cedian").jqGrid('navGrid', '#pager13', {
// 			add: false,
// 			edit: false,
// 			del: false
// 		}, {}, // edit parameters
// 		{}, // add parameters
// 		{
// 			reloadAfterSubmit: false
// 		} //delete parameters
// 	);
//
// }

function yangben() { //样本筛选

	layer.open({
		type: 2,
		title: '样本筛选',
		shadeClose: true,
		shade: 0.8,
		area: ['90%',"90%"],
		content: ctx+'/deviation/sample?rId='+rId, //iframe的url
		end : function() {
			sampleRefresh();
		}
	});

}

function cedian() { //测点筛选

	layer.open({
		type: 2,
		title: '测点筛选',
		shadeClose: true,
		shade: 0.8,
		area: ['90%',"90%"],
		content: ctx+'/deviation/feature?rId='+rId, //iframe的url
		end : function() {
			featureRefresh();
		}
	});

}

function pageInit13(idlist, pager,surebtn) { //样本测点弹框数据
				jQuery(idlist).jqGrid({
					url: ctx+'/static/js/jqGrid/data.json',
					datatype: "json",
					colNames: ['测点名称', '时间', '方向', '实测值', '均值', '极差', '6a', 'CP', 'CPK', 'PP', '上公差', '下公差', 'Action'],
					colModel: [{
							name: 'id',
							index: 'id',
							width: 110
						},
						{
							name: 'name',
							index: 'name',
							width: 160
						},
						{
							name: 'amount',
							index: 'amount',
							align: "right",
							width: 110
						},
						{
							name: 'data',
							index: 'data',
							align: "right",
							width: 110
						},
						{
							name: 'junzhi',
							index: 'junzhi',
							align: "right",
							width: 110
						},
						{
							name: 'jicha',
							index: 'jicha',
							align: "right",
							width: 110
						},
						{
							name: '6a',
							index: '6a',
							align: "right",
							width: 110
						},
						{
							name: 'cp',
							index: 'cp',
							align: "right",
							width: 110
						},
						{
							name: 'cpk',
							index: 'cpk',
							align: "right",
							width: 110
						},
						{
							name: 'pp',
							index: 'pp',
							align: "right",
							width: 110
						},
						{
							name: 'SGC',
							index: 'SGC',
							align: "right",
							width: 110
						},
						{
							name: 'XGC',
							index: 'XGC',
							align: "right",
							width: 110
						},
						{
							name: 'act',
							index: 'act',
							width: 110,
							sortable: false
						}, //操作栏
						// {name : 'tax',index : 'tax',align : "right",width : 110},
					],
					rowNum: 10,
					rowList: [10, 20, 30],
					pager: pager,
					sortname: 'id',
					pgbuttons: true, //控制翻页按钮
					// loadonce: true,//
					pginput: true, //控制跳转框
					autowidth: true,
					shrinkToFit: true,
					viewrecords: true, //设置是否在Pager Bar显示所有记录的总数。
					sortorder: "desc",
					multiselect: true, //checkbox控制多选框显示与否
					multiboxonly: true,
					gridComplete: function() {
						var ids = jQuery(idlist).jqGrid('getDataIDs');
						for (var i = 0; i < ids.length; i++) {
							var cl = ids[i];
							ce = "<a class=' delRow' href='#' data-id=" + cl + " >删除</a>";
							jQuery(idlist).jqGrid('setRowData', ids[i], {
								act: ce
							});
						}
					},
					editurl: '${ctx}/static/js/jqGrid/data.json',
					// caption : "Custom edit ",//表头
					loadComplete: function() {
						var ids = localStorage.getItem("rowdata")
						if (ids != null && ids != undefined && ids != '') {
							for (var i = 0; i < ids.length; i++) {
								$("#list").jqGrid('setSelection', ids[i].id);
							}
						}
					}
				});
				jQuery(surebtn).click(function() {
					var ids=$(idlist).jqGrid('getGridParam','selarrrow');//获取多行id
					// var ids = jQuery("#list").jqGrid("getGridParam", "selrow") //获取点击最后一行id
					console.log(ids)
				});
				jQuery(idlist).on("click", ".delRow", function() { //点击删除一行
					console.log($(this).data("id"))
					$(idlist).trigger("reloadGrid");
				});
				jQuery(idlist).jqGrid('navGrid', pager, {
						add: false,
						edit: false,
						del: false
					}, {}, // edit parameters
					{}, // add parameters
					{
						reloadAfterSubmit: false
					} //delete parameters
				);
			}

function createPacket() { //创建分组

	jQuery.ajax({
		url: '/packet/create',
		type: 'get',
		data:  {'rId':rId},
		error: function(msg) {
			alert("error");
		},
		success: function(msg) {
			layer.open({
				type: 1,
				title: '保存数据组测点勾选到分组',
				offset: '10%',//top
				scrollbar: false,
				area: ['70%', '70%'],
				maxmin: true, //开启最大化最小化按钮
				shade: 0 ,
				shadeClose: true, //点击遮罩关闭
				content: msg //注意，如果str是object，那么需要字符拼接。
			});
		}
	});
}


function ClickList() { //数组列表

	jQuery.ajax({
		url: '/packet/list',
		type: 'get',
		data:  {'rId':rId},
		error: function(msg) {
			alert("error");
		},
		success: function(msg) {
			layer.open({
				type: 1,
				title: '数组列表',
				offset: '10%',//top
				scrollbar: false,
				area: ['50%', '50%'],
				maxmin: true, //开启最大化最小化按钮
				shade: 0 ,
				shadeClose: true, //点击遮罩关闭
				content: msg //注意，如果str是object，那么需要字符拼接。
			});
		}
	});
}

function historicalRecord() { //历史记录
	pointCondition() //默认测点条件
	layer.open({
		type: 1,
		offset: '1%', //top
		scrollbar: false,
		area: ['60%', "40%"],
		maxmin: true, //开启最大化最小化按钮
		shade: 0,
		shadeClose: false, //点击遮罩关闭
		title: '历史记录',
		content: $('#history'), //注意，如果str是object，那么需要字符拼接。
		cancel: function(index, layero) {
			// if(confirm('确定要关闭么')){
			layer.close(index)
			$('#history').css("display", "none")
			// }
			return false;
		}
	})
}

function cancelsurbtn() { //取消所有弹框
	$("#modalListK").css("display", "none")
	$('#history').css("display", "none")
	$('#fenzu').css("display", "none")
	$('#yangben').css("display", "none")
	$('#cedian').css("display", "none")
	layer.closeAll()
}

function fenzusurbtn() { //分组确认按钮

	var packetId = $("#packetId").val();

	var sampleData = $manualSampleTable.bootstrapTable("getData");
	var sampleSelectionArr = [];
	for (var i = 0; i < sampleData.length; i++) {
		var checked = sampleData[i].checked;
		if (checked){
			sampleSelectionArr.push(sampleData[i].s_id);
		}
	}


	var featureData = $featureTable.bootstrapTable('getData');
	var featureSelectionArr = [];
	for (var i = 0; i < featureData.length; i++) {
		var checked = featureData[i].checked;
		if (checked){
			featureSelectionArr.push(featureData[i].f_id);
		}
	}

	var sampleFilterType = sessionStorage.getItem('sampleFilterType');
	var sampleFilterJson = sessionStorage.getItem('sampleFilterJson');

	var featureFilterType = sessionStorage.getItem('featureFilterType');
	var featureFilterJson = sessionStorage.getItem('featureFilterJson');

	var sampleSelections = sampleSelectionArr.join(",");
	var featureSelections = featureSelectionArr.join(",");

	var data = {};
	data.rId = rId;
	data.id = packetId;
	data.sampleFilterType = sampleFilterType;
	data.sampleFilterJson = sampleFilterJson;
	data.featureFilterType = featureFilterType;
	data.featureFilterJson = featureFilterJson;
	data.featureSelections = featureSelections;
	data.sampleSelections = sampleSelections;

	$.ajax({
		type: "POST",
		url: "/packet/save",
		data: data,
		dataType: "json",
		cache: false,
		success: function (res) {
			if (res == 0) {
				alert("保存成功");
				layer.closeAll();
				$("#groupName").val("");
				$("#parentGroupName").val("");

			}else{
				alert("保存失败");
			}
		}
	});



}

function pointCondition() { //测点条件
	jQuery("#one_grid").jqGrid({
		url: '${ctx}/static/js/jqGrid/data.json',
		datatype: "json",
		colNames: ['测点名称', '时间', '方向', '实测值', '均值', 'Action'],
		colModel: [{
				name: 'id',
				index: 'id',
				width: 110
			},
			{
				name: 'name',
				index: 'name',
				width: 160
			},
			{
				name: 'amount',
				index: 'amount',
				align: "right",
				width: 110
			},
			{
				name: 'data',
				index: 'data',
				align: "right",
				width: 110
			},
			{
				name: 'junzhi',
				index: 'junzhi',
				align: "right",
				width: 110
			},
			{
				name: 'act',
				index: 'act',
				width: 110,
				sortable: false
			}, //操作栏
			// {name : 'tax',index : 'tax',align : "right",width : 110},
		],
		rowNum: 10,
		rowList: [10, 20, 30],
		pager: "#pager",
		sortname: 'id',
		pgbuttons: true, //控制翻页按钮
		// loadonce: true,//
		pginput: true, //控制跳转框
		autowidth: true,
		shrinkToFit: true,
		viewrecords: true, //设置是否在Pager Bar显示所有记录的总数。
		sortorder: "desc",
		multiselect: true, //checkbox控制多选框显示与否
		multiboxonly: true,
		gridComplete: function() {
			var ids = jQuery("#one_grid").jqGrid('getDataIDs');
			for (var i = 0; i < ids.length; i++) {
				var cl = ids[i];
				ce = "<a class='delRow' href='#' data-id=" + cl + " >删除</a>";
				jQuery("#one_grid").jqGrid('setRowData', ids[i], {
					act: ce
				});
			}
		},
		editurl: '${ctx}/static/js/jqGrid/data.json',
		// caption : "Custom edit ",//表头
		loadComplete: function() {
			var ids = localStorage.getItem("rowdata")
			if (ids != null && ids != undefined && ids != '') {
				for (var i = 0; i < ids.length; i++) {
					$("#one_grid").jqGrid('setSelection', ids[i].id);
				}
			}
		}
	});
	jQuery("#addsurbtn").click(function() {
		var id=$('#gridTable').jqGrid('getGridParam','selarrrow');//获取多行id
		// var ids = jQuery("#list").jqGrid("getGridParam", "selrow") //获取点击最后一行id
		console.log(ids)
	});
	jQuery("#one_grid").on("click", ".delRow", function() { //点击删除一行
		console.log($(this).data("id"))
		$("#one_grid").trigger("reloadGrid");
	});
	jQuery("#one_grid").jqGrid('navGrid', pager, {
			add: false,
			edit: false,
			del: false
		}, {}, // edit parameters
		{}, // add parameters
		{
			reloadAfterSubmit: false
		} //delete parameters
	)
}

function pointGrouping() { //测点分组
	jQuery("#one_grid").jqGrid({
		url: '${ctx}/static/js/jqGrid/date.json',
		datatype: "json",
		width: 300,
		treeGrid: true,
		treeGridModel: 'adjacency',
		ExpandColumn: 'name',
		colNames: ['id', '节点名称', '结束日期', '节点层级', '备注', "Action"],
		colModel: [{
				name: 'id',
				index: 'id',
				hidden: true
			},
			{
				name: 'name',
				index: 'name',
				width: 200,
				sortable: false
			},
			{
				name: 'endDate',
				index: 'endDate',
				width: 70,
				sortable: false
			},
			{
				name: 'nodeLevel',
				index: 'nodeLevel',
				width: 100,
				sortable: false
			},
			{
				name: 'remark',
				index: 'remark',
				width: 80,
				sortable: false
			},
			{
				name: 'act',
				index: 'act',
				width: 110,
				sortable: false
			}, //操作栏
		],
		rowNum: 10,
		rowList: [10, 20, 30],
		pager: "#pager",
		pgbuttons: true, //控制翻页按钮
		// loadonce: true,//
		pginput: true, //控制跳转框
		autowidth: true,
		shrinkToFit: true,
		viewrecords: true, //设置是否在Pager Bar显示所有记录的总数。
		sortorder: "desc",
		multiselect: true, //checkbox控制多选框显示与否
		gridComplete: function() {
			var ids = jQuery("#one_grid").jqGrid('getDataIDs');
			for (var i = 0; i < ids.length; i++) {
				var cl = ids[i];
				ce = "<a class=' delRow' href='#' data-id=" + cl + " >删除</a>";
				jQuery("#one_grid").jqGrid('setRowData', ids[i], {
					act: ce
				});
			}
		},
		jsonReader: {
			root: "dataRows",
			repeatitems: false
		},
		treeReader: {
			level_field: "level",
			parent_id_field: "parent",
			leaf_field: "isLeaf",
			expanded_field: "expanded"
		},
		sortorder: "desc",
		height: '100%'
	});
}
