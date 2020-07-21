var $table = $('#table');
var datas = [];

$(function() {

	$('#mytable').bootstrapTable({
		url: '/userDefineReport/getPageInfo',
		queryParams : function(params) {//自定义参数，这里的参数是传给后台的，我这是是分页用的
			return {//这里的params是table提供的
				offset : params.offset,//从数据库第几条记录开始
				limit : params.limit//找多少条
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
		pageSize: "10",
		pagination: true, // 是否分页
		sortable: true, // 是否启用排序
		columns: [
			{
				field: 'id',
				title: '报告编号'
			},{
				field: 'name',
				title: '报告名称'
			},{
				field: 'dataSourceName',
				title: '数据库名称'
			},{
				field: 'routineLabel',
				title: '零件名称'
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
//	result += "<a style='margin-left:10px' href='javascript:;' class='btn btn-xs green' onclick=\"MenuById('" + id +
//		"', view='view')\" title='设置'><span  class='element elshumo' ></span></a>";
	result += "<a style='margin-left:10px' href='javascript:;' class='btn btn-xs blue' onclick=\"EditViewById('" + id +
		"')\" title='编辑'><span class='element elbianji'></span></a>";
//	result += "<a style='margin-left:10px' href='javascript:;' class='btn btn-xs red' onclick=\"UpLoadByIds('" + id +
//		"')\" title='导出报告'><span class='element elshangchuan'></span></a>";
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

function EditViewById(id) {//跳到制作报告页面
	window.open("/userDefineReport/"+id+"/edit");
}

function DeleteByIds(id) {//删除

	if(window.confirm('你确定要删除吗？')){
		var params = {
			"id": id
		};
		$.ajax({
			type: "POST",
			url: " /userDefineReport/"+id+"/delete",
			data: params,
			dataType: "json",
			cache: false,
			success: function (data) {
				$('#mytable').bootstrapTable('refresh');
			}
		});
		return true;
	}else{
		return false;
	}


}

// 开关按钮
function toogle(th,id) {
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
		url: '/userDefineReport/save',
		type: 'post',
		data: {
			'id': id,
			'status': status
		},
		error: function (msg) {
			alert("error");
		},
		success: function (msg) {

		}
	});
}

$(function(){
	
	$("#createdept-form").validate({
		rules: {
			name: {
				required: true,
				maxlength: 50
			},	
			"dataSource.id": {
				required: true,
			},	
			routineId: {
				required: true,
			}
		},
		onfocusout:false,//失去焦点时不执行验证
        errorPlacement:function(error,element) {//错误提示，错误对象
            layer.tips(error[0].innerText, element, {//1.错误信息，2提示位置，3同时提示多个错误
                tipsMore: true//错误信息可以同时提示多个，...
            });
        },
		submitHandler: function (form) {
			layer.load(1, {
		        shade: [0.8, '#EDEDED'] //0.1透明度的白色背景
		    });
			
			$.post(ctx + "/userDefineReport/save", $("#createdept-form").serialize() + "&routineLabel=" + $("select[name='routineId']").find("option:selected").text(), function(data){
				if(data == 0) {
					location.reload();
				} else {
					layer.msg(data.msg);
				}
				layer.closeAll('loading');
			});
		}
	});
	
	if($("select[name='dataSource.id']").val() != '') {
		loadRoutineLabels($("select[name='dataSource.id']").val());
	}
	
	$("select[name='dataSource.id']").change(function(){
		$("select[name='routineId']").html('');
		loadRoutineLabels($(this).val());
	});
});


/**
 * 加载零件名称
 * @param dataSourceId
 * @returns
 */
function loadRoutineLabels(dataSourceId) {
	$.get(ctx + "/userDefineReport/getRoutines", {"dataSourceId": dataSourceId}, function(data){
		if(data.code == 200) {
			var html = "";
			for(var key in data.data) {
				html += "<option value='" + data.data[key].id + "'>" + data.data[key].label + "</option>";
			}
			$("select[name='routineId']").html(html);
		}
	});
}
	

/**
 * 新建报告
 */
function NewCreatReport() { 
	layer.open({
		type: 1,
		title: '新建报告',
		offset: '10%', //top
		scrollbar: false,
		area: ['600px', '300px'],
		maxmin: true, //开启最大化最小化按钮
		shade: 0,
		shadeClose: true, //点击遮罩关闭
		content: $('#NewReportModal'), //注意，如果str是object，那么需要字符拼接。
		end: function() {
			$("#NewReportModal").hide();
		}
	});
}
