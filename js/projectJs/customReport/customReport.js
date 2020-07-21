var $table = $('#table');
var datas = [];

$(function() {

	$('#mytable').bootstrapTable({
		url: '/customReport/getPageInfo',
		queryParams : function(params) {//自定义参数，这里的参数是传给后台的，我这是是分页用的
			return {//这里的params是table提供的
				offset : params.offset,//从数据库第几条记录开始
				limit : params.limit//找多少条
				// searchType : $("#selectForm").val(),
				// searchText :$("#searchText").val()
			};
		},
		responseHandler : function(res) {
			//在ajax获取到数据，渲染表格之前，修改数据源
			return res;
		},
		toolbar: "#toolbar",
		sidePagination: "true",
		striped: true, // 是否显示行间隔色
		//search : "true",
		uniqueId: "ID",
		pageSize: "5",
		pagination: true, // 是否分页
		sortable: true, // 是否启用排序
		columns: [
			{
				field: 'id',
				title: '报告编号'
			},{
				field: 'name',
				title: '报告名称'
			},
			{
				field: 'updatetime',
				title: '更新时间'
			},
			{
				field: 'status',
				title: '状态',
				formatter: actionFormatter1,
			},
			{
				field: 'price',
				title: '操作',
				width: 320,
				align: 'center',
				valign: 'middle',
				formatter: actionFormatter,
			},

		]
	});
	// 开关按钮
	$('.circular1').click(function() {
		var left = $('.round-button1').css('left');
		left = parseInt(left);
		if (left == 0) {
			// 由关到开
			$('.round-button1').css({
				'left': '22px',
				'background-color': '#F00'
			});
			$(this).css({
				'background-color': '#e7e7e7',
				'box-shadow': '0 0 5px #999 inset'
			})
			$(".openbtn").val("1")
		} else {
			$('.round-button1').css({
				'left': '0',
				'background-color': '#fff'
			})
			$(".openbtn").val("0")
		}
	})

})



//操作栏的格式化
function actionFormatter(value, row, index) {
	var id = row.id;
	var result = "";
	result += "<a style='margin-left:10px' href='javascript:;' class='btn btn-xs green' onclick=\"MenuById('" + id +
		"', view='view')\" title='设置'><span  class='element elshumo' ></span></a>";
	result += "<a style='margin-left:10px' href='javascript:;' class='btn btn-xs blue' onclick=\"EditViewById('" + id +
		"')\" title='编辑'><span class='element elbianji'></span></a>";
	result += "<a style='margin-left:10px' href='javascript:;' class='btn btn-xs red' onclick=\"UpLoadByIds('" + id +
		"')\" title='导出报告'><span class='element elshangchuan'></span></a>";
	result += "<a style='margin-left:10px' href='javascript:;' class='btn btn-xs red' onclick=\"DeleteByIds('" + id +
		"')\" title='删除'><span class='element elshanchu'></span></a>";
	return result;
}
//状态
function actionFormatter1(value, row, index) {
	var id = row.id;
	var status = row.status;
	var statusStr  = status == 1 ? "on" : "off";

	var result = "";
	result += "<div class='btn_fath clearfix "+statusStr+"' onclick=\"toogle(this,'" + id +
		"')\" >" +
		"<div class='move' data-state='"+statusStr+"'></div>" +
		"<div class='btnSwitch btn1'>公开</div>" +
		"<div class='btnSwitch btn2'>私有</div></div>";
	return result;
}

function MenuById(id) {//设置
	console.log(id)
	layer.open({
		type: 1,
		offset: '10%', //top
		scrollbar: false,
		area: ['50%', '40%'],
		maxmin: true, //开启最大化最小化按钮
		shade: 0,
		shadeClose: true, //点击遮罩关闭
		content: $('#setUpRecord'), //注意，如果str是object，那么需要字符拼接。
		end: function() {
			$("#setUpRecord").hide();
		}
	});
}

function EditViewById(id) {//跳到制作报告页面
	window.open("/customReport/"+id+"/edit");
}

function UpLoadByIds(id) {//导出报告
	console.log(id)
}

function DeleteByIds(id) {//删除

	if(window.confirm('你确定要删除吗？')){
		var params = {
			"id": id
		};
		$.ajax({
			type: "POST",
			url: " /customReport/"+id+"/delete",
			data: params,
			dataType: "json",
			cache: false,
			success: function (data) {
				alert(data == 0? "删除成功":"删除失败");
				$('#mytable').bootstrapTable('refresh');
			}
		});
		return true;
	}else{
		return false;
	}


}
$('#locale').change(initTable);

function spanDown() {
	var num = $("#ReportSetUp").css("right")
	console.log(num)
	if (num != "0px") {
		$(".ReportSetUp").animate({
			"right": "0px"
		}, 600);
		$(".tipMask").addClass("tipMask1")
	} else {
		$(".ReportSetUp").animate({
			"right": "-276px"
		}, 600);
		$(".tipMask").removeClass("tipMask1")
	}
}
// 开关按钮
function toogle(th,id) {
	console.log(id)
	var ele = $(th).children(".move");
	if (ele.attr("data-state") == "on") {
		ele.animate({
			left: "0"
		}, 300, function() {
			ele.attr("data-state", "off");
		});
		$(th).removeClass("on").addClass("off");
		t1(id,0);
	} else if (ele.attr("data-state") == "off") {
		ele.animate({
			left: '30px'
		}, 300, function() {
			$(this).attr("data-state", "on");
		});
		$(th).removeClass("off").addClass("on");
		t1(id,1);
	}
}


function t1(id,status) {

	jQuery.ajax({
		url: '/customReport/save',
		type: 'post',
		data: {
			'id': id,
			'status': status
		},
		error: function (msg) {
			alert("error");
		},
		success: function (msg) {

			if (msg == 0){
				console.log(("保存成功,报告编号为:"+$("#id").val()));
			}else{
				console.log("保存失败");
			}
		}
	});
}


function initTable() {
	// 先销毁再创建
	$table.bootstrapTable('destroy').bootstrapTable({
		data: datas, // 表格数据
		locale: "zh-CN", // 语言
		classes: 'table table-bordered table-hover table-striped', // 样式，table-striped 隔行变色
		columns: [ // 列详情
			{
				title: '序号', // 表头字段名
				field: 'id', // 数据 key
				sortable: true, // 排序
				align: 'center', // 居中
			}, {
				title: '报告名称',
				field: 'name',
				align: 'center'
			}, {
				title: '更新时间',
				field: 'price',
				align: 'center'
			}, {
				title: '状态',
				field: '',
				align: 'center',
				formatter: function() { // 处理该行数据
					return '<input type="checkbox" name="my-checkbox" checked>';
				}
			}, {
				field: '',
				title: '管理',
				halign: 'center',
				align: 'center',
				width: '320px',
				formatter: function() {
					return '<span class="element elshumo" style="margin-left:10px" οnclick="modifyUserData(this)" title="设置"></span>' +
						'<span class="element elbianji" style="margin-left:10px" οnclick="deleteUserData(this)" title="编辑"></span>' +
						'<span class="element elshangchuan" style="margin-left:10px" οnclick="deleteUserData(this)" title="上传"></span>' +
						'<span class="element elshanchu" style="margin-left:10px" οnclick="deleteUserData(this)" title="删除"></span>';
					// '<button class="btn btn-warning"οnclick="resetPassword(this)">密码重置</button>';
				},
			}
		],
		pagination: true, //设置为 true 会在表格底部显示分页条。
		paginationLoop: false, //设置为 true 启用分页条无限循环的功能。
		pageSize: 20, //每页初始显示的条数
		pageList: [10, 15, 20],
		toolbar: '#toolbar', //工具栏
		toolbarAlign: 'right', //工具栏的位置
	});

}

function modifyUserData(e) {
	alert(111)
	console.log(e)
}

function changeReportType() { //创建类型
	layer.closeAll() //先关闭上一个弹框
	if ($("#modaltype").val() == 6) {
		layer.open({
			type: 1,
			offset: '10%', //top
			scrollbar: false,
			area: ['50%', '40%'],
			maxmin: true, //开启最大化最小化按钮
			shade: 0,
			shadeClose: true, //点击遮罩关闭
			content: $('#changeReportType'), //注意，如果str是object，那么需要字符拼接。
			end: function() {
				$("#changeReportType").hide();
			}
		});
	}

}

function NewCreatReport() { //新建报告
	var data = [{
			name: "趋势图",
			id: "1"
		},
		{
			name: "周报统计",
			id: "2"
		},
		{
			name: "八项判异",
			id: "3"
		},
		{
			name: "关联零件分析",
			id: "4"
		},
		{
			name: "间隙段差分析",
			id: "5"
		},
		{
			name: "创建类型",
			id: "6"
		}
	]
	var option = "";
	for (var i = 0; i < data.length; i++) {
		if (data[i].name == "创建类型") {
			option += "<option value='" + data[i].id + "'>+" + data[i].name + "</option>"
		} else {
			option += "<option value='" + data[i].id + "'>" + data[i].name + "</option>"
		}

	}


	$("#modaltype").html(option)
	layer.open({
		type: 1,
		offset: '10%', //top
		scrollbar: false,
		area: ['50%', '40%'],
		maxmin: true, //开启最大化最小化按钮
		shade: 0,
		shadeClose: true, //点击遮罩关闭
		content: $('#NewReportModal'), //注意，如果str是object，那么需要字符拼接。
		end: function() {
			$("#NewReportModal").hide();
		}
	});
}

function historicalRecord() { // 历史记录
	jQuery("#historicalRecordTable").jqGrid({
		url: '/static/js/passRateSort/data.json',
		datatype: "json",
		colNames: ['报告名称', '类型', '更新时间', "Action"],
		colModel: [

			{
				name: 'id',
				index: 'id',
				width: 110
			},
			{
				name: 'invdate',
				index: 'invdate',
				width: 160
			},
			{
				name: 'name',
				index: 'name',
				width: 160
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
		pager: '#historicalRecordPager',
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
			var ids = jQuery("#historicalRecordTable").jqGrid('getDataIDs');
			for (var i = 0; i < ids.length; i++) {
				var cl = ids[i];
				cc = "<a class='MrginL10 delRow' href='#' data-id=" + cl + " >删除</a>";
				jQuery("#historicalRecordTable").jqGrid('setRowData', ids[i], {
					act: cc
				});
			}
		},
		editurl: '/static/js/jqGrid/data.json',

		beforeSelectRow: function(rowid, e) {
			$("#historicalRecordTable").jqGrid('resetSelection');
			return (true);
		},

		// caption : "Custom edit ",//表头
		loadComplete: function() {
			var ids = localStorage.getItem("rowdata")
			if (ids != null && ids != undefined) {
				for (var i = 0; i < ids.length; i++) {
					$("#historicalRecordTable").jqGrid('setSelection', ids[i].id);
				}
			}


		}
	});
	jQuery("#addsurbtn1").click(function() {
		// var id=$('#newCreatReport').jqGrid('getGridParam','selarrrow');//获取多行id
		var ids = jQuery("#historicalRecordTable").jqGrid("getGridParam", "selrow") //获取点击最后一行id
		console.log(ids)
	});
	jQuery("#historicalRecordTable").on("click", ".delRow", function() { //删除
		console.log($(this).data("id"))
		$("#historicalRecordTable").trigger("reloadGrid");
	});
	jQuery("#historicalRecordTable").jqGrid('navGrid', '#pager13', {
			add: false,
			edit: false,
			del: false
		}, {}, // edit parameters
		{}, // add parameters
		{
			reloadAfterSubmit: false
		} //delete parameters
	);
	var myGrid = $("#historicalRecordTable");
	$("#cb_" + myGrid[0].id).hide();

}

function creatReportSureBtn() { //创建报告确定按钮跳转页面

	var name = 	$("#name").val();
	var status  = $('input:radio[name="status"]:checked').val();

	jQuery.ajax({
		url: '/customReport/save',
		type: 'post',
		data: {
			 'name': name
			,"status":status
		},
		error: function (msg) {
			alert("error");
		},
		success: function (msg) {

			if (msg == 0){
				alert("保存成功");
				$("#name").val("");
				layer.closeAll();

				$('#mytable').bootstrapTable('refresh');

			}else{
				alert("保存失败");
			}

		}
	});

}

function setUpRecord() { //自动生成报告策略设置

}
