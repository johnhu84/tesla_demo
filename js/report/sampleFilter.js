var $table1 = $("#table1");

var $columns1 = [
	{checkbox : true }
];

/**
 * 加载表格
 */
function loadTable1() {
	
	/**
	 * 加载显示的字段
	 */
	$.get(ctx + "/dataManagement/getShowField", {"table": "SAMPLE"}, function(data){
		if(data.code == 200) {
			var data = data.data;
			for(var i in data) {
				$columns1.push({
					"field": data[i].field,
					"title": data[i].name,
					"sortable": false,
					"visible": data[i].visible
				}) ;
			}
			
			// 渲染表格
			renderTable1();
		}
	});
	
	/**
	 * 渲染表格
	 */
	function renderTable1() {
		 var b1 = $table1.bootstrapTable({
	        sortable: false,                     //是否启用排序
	        columns: $columns1,//列
	        uniqueId: "ID",
	        striped: true,

	        //设置数据请求的额外参数
	        queryParams: function (params) {
	            var param = {};
	            param['offset'] = params.offset; // 页码
	            param['limit'] = params.limit; // 条数
	            
	            // 设置搜索参数
	            setQueryParam1(param);
	            
	            return param;
	        },

	        idField: "ID",
	        pageList: [10, 25, 50, 100, 'All']
	    });
	}
	
}

$(function() {
	// 加载表格
	loadTable1();
	
	// 加载筛选器字段
	$.get(ctx + "/dataManagement/getSearchFields", {dataType: 'SAMPLE'}, function(data){
		if(data.code == 200) {
			// 筛选器设置
			renderFilterSetting1(data.data);
			// 高级筛选
			renderAdvanceOption1();
		} else {
			parent.layer.msg("加载筛选器设置失败");
		}
	});
	
});

var dataFilter1 = []; // 筛选器字段
var defaultFilter1 = []; // 默认筛选器字段

/**
 * 搜索参数
 * @returns
 */
function setQueryParam1(param) {
	var orCondition = {};
	var andCondition = {};
	
	// 关键字搜索
	var keywords = $("#sampleSearch input[type='text']").val().trim();
	if(keywords != '') {
		// 名称
		if($("#sampleSearch input[name='label']").is(":checked")) {
			if($("#sampleSearch input[name='wholeWordMatch']").is(":checked")) {
				orCondition.s_label_EQ = keywords;
			} else {
				orCondition.s_label_LIKE = keywords;
			}
		}
		
		// 描述
		if($("#sampleSearch input[name='descr']").is(":checked")) {
			if($("#sampleSearch input[name='wholeWordMatch']").is(":checked")) {
				orCondition.s_descr_EQ = keywords;
			} else {
				orCondition.s_descr_LIKE = keywords;
			}
		}
	}
	
	var sampleType = $("#sampleSearch input[name='type']:checked").val();
	// 最近样本数量
	if(sampleType == "1") {
		var sampleCount = $("#sampleSearch input[name='sampleCount']").val();
		if(sampleCount != '') {
			param.recentSampleCount = $("#sampleSearch input[name='sampleCount']").val();
		}
	// 基于时间
	} else if(sampleType == "2"){
		var dateType = $("#sampleSearch select[name='dateType']").val();
		var beginDate = $("#sampleSearch input[name='beginDate']").val();
		var endDate = $("#sampleSearch input[name='endDate']").val();
		// 创建日期
		if(dateType == "1") {
			if(beginDate != '') {
				andCondition['S_CreateDate_GTE'] = beginDate;
			}
			if(endDate != '') {
				andCondition['S_CreateDate_LTE'] = endDate;
			}
		// 导入日期
		} else if(dateType == "2") {
			if(beginDate != '') {
				andCondition['S_ImportDate_GTE'] = beginDate;
			}
			if(endDate != '') {
				andCondition['S_ImportDate_LTE'] = endDate;
			}
		// 生产日期
		} else if(dateType == "3") {
			if(beginDate != '') {
				andCondition['S_ArchDate_GTE'] = beginDate;
			}
			if(endDate != '') {
				andCondition['S_ArchDate_LTE'] = endDate;
			}
		} 
	}
	
	filters().getSearchParams("#sampleHighLevelSearch .AdvancedOptions", andCondition);
	
	param.orCondition = JSON.stringify(orCondition);
	param.andCondition = JSON.stringify(andCondition);
}

/**
 * 渲染高级筛选项
 * @returns
 */
function renderAdvanceOption1() {
	// 默认的筛选器和非默认的合并一起
	var filtersArray = defaultFilter1.concat(dataFilter1);
	filters().initAdvanceOption("#sampleHighLevelSearch .AdvancedOptions", filtersArray);
}

/**
 * 筛选器设置
 * @returns
 */
function renderFilterSetting1(data) {
	for(var i in data) {
		var opt = {
			column: data[i].column,
			field: data[i].field,
			type: data[i].enumName,		
			title: data[i].treeName,	// 显示文字
	        name: data[i].name,			// 字段名称
	        filterType: data[i].inputType == 'SELECT' ? "select" : "manual",
	        contents: ["", "", ""]
		};
		
		if(data[i].inputType == 'SELECT') {
			var selectKeyValueList = data[i].selectKeyValueList;
			if(selectKeyValueList) {
				opt.contents = [];
				for(var j in selectKeyValueList) {
					opt.contents[j] = selectKeyValueList[j].value;
				}
			}
		}
		
		if(data[i].searchDefault) {
			dataFilter1.push(opt);
		} else {
			dataFilter1.push(opt);
		}
	}
}

/**
 * 显示样本
 * @returns
 */
function showSample() {
	var getSelectRows = $table1.bootstrapTable('getSelections', function (row) {
        return row;
	});
	var ids = "";
	for(var i in getSelectRows) {
		ids += getSelectRows[i].id + ",";
	}
	
	if(ids == "") {
		parent.layer.msg("请选择样本");
		return;
	}
	
	// 设置选中的样本ID
	parent.$("#iframe-" + rId)[0].contentWindow.showSampleFilter(ids);
	parent.layer.closeAll();
}