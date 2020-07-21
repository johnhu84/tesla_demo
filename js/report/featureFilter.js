var $table2 = $("#table2");
var dataFilter2 = []; // 筛选器字段
var defaultFilter2 = []; // 默认高级筛选字段

var $columns2 = [
	{checkbox : true },
//    {field: 'label', title: '零件名称', sortable: false, visible: true}
];


var $columns2 = [
	{checkbox : true }
];

/**
 * 加载表格
 */
function loadTable2() {
	
	/**
	 * 加载显示的字段
	 */
	$.get(ctx + "/dataManagement/getShowField", {"table": "FEATURE"}, function(data){
		if(data.code == 200) {
			var data = data.data;
			for(var i in data) {
				$columns2.push({
					"field": data[i].field,
					"title": data[i].name,
					"sortable": false,
					"visible": data[i].visible
				}) ;
			}

			// 渲染表格
			renderTable2();
		}
	});

}

/**
 * 筛选器设置
 * @returns
 */
function renderFilterSetting2(data) {
	for(var i in data) {
		var opt = {
			column: data[i].column,
			field: data[i].field,
			type: data[i].enumName,
			title: data[i].treeName,	// 显示文字
			name: data[i].name,			// 字段名称
			filterType: data[i].inputType == 'SELECT' ? "select" : "manual",
			contents: [""]
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
			defaultFilter2.push(opt);
		} else {
			dataFilter2.push(opt);
		}
	}
}

$(function() {
	// 加载表格
	loadTable2();
	
	// 加载筛选器字段
	$.get(ctx + "/dataManagement/getSearchFields", {dataType: 'FEATURE'}, function(data){
		if(data.code == 200) {
			// 筛选器设置
			renderFilterSetting2(data.data);
			// 高级筛选
			renderAdvanceOption2();
		} else {
			parent.layer.msg("加载筛选器设置失败");
		}
	});
});

/**
 * 渲染高级筛选项
 * @returns
 */
function renderAdvanceOption2() {
	// 默认的筛选器和非默认的合并一起
	var filtersArray = defaultFilter2.concat(dataFilter2);
	filters().initAdvanceOption("#featureHighLevelSearch .AdvancedOptions", filtersArray);
}

/**
 * 初始化高级搜索框
 */
function initAdvanceOption(node, filters) {
	$(node).html(getFilterHtml(filters));
}

/**
 * 搜索参数
 * @returns
 */
function setQueryParam2(param) {
	var orCondition = {};
	var andCondition = {};

	// 关键字搜索
	var keywords = $("#featureSearch input[type='text']").val().trim();
	if(keywords != '') {
		// 名称
		if($("#featureSearch input[name='label']").is(":checked")) {
			if($("#featureSearch input[name='wholeWordMatch']").is(":checked")) {
				orCondition.f_label_EQ = keywords;
			} else {
				orCondition.f_label_LIKE = keywords;
			}
		}

		// 描述
		if($("#featureSearch input[name='descr']").is(":checked")) {
			if($("#featureSearch input[name='wholeWordMatch']").is(":checked")) {
				orCondition.f_descr_EQ = keywords;
			} else {
				orCondition.f_descr_LIKE = keywords;
			}
		}
	}

	filters().getSearchParams("#featureHighLevelSearch .AdvancedOptions", andCondition);

	param.orCondition = JSON.stringify(orCondition);
	param.andCondition = JSON.stringify(andCondition);
}


/**
 * 渲染表格
 */
function renderTable2() {
	var b1 = $table2.bootstrapTable({
		sortable: false,                     //是否启用排序
		columns: $columns2,//列
		uniqueId: "ID",
		striped: true,

		//设置数据请求的额外参数
		queryParams: function (params) {
			var param = {};
			param['offset'] = params.offset; // 页码
			param['limit'] = params.limit; // 条数

			// 设置搜索参数
			setQueryParam2(param);

			return param;
		},

		idField: "ID",
		pageList: [10, 25, 50, 100, 'All'],
		onEditableSave: function (field, row, oldValue, $el) {
			$.ajax({
				type: "post",
				url: "/dataManagement/updateField",
				data: {
					id: row.id,
					field: field,
					value: row[field],
					table: "FEATURE",
					dataSourceId: DATASOURCE_ID
				},
				dataType: 'JSON',
				success: function (data, status) {
					if (data.code != 200) {
						parent.layer.msg(data.msg);
					}
					$table2.bootstrapTable('refresh');
				},
				error: function () {
					parent.layer.msg("操作失败");
					$table2.bootstrapTable('refresh');
				},
				complete: function () {

				}
			});
		}
	});
}

/**
 * 显示测点
 * @returns
 */
function showFeature() {
	var getSelectRows = $table2.bootstrapTable('getSelections', function (row) {
        return row;
	});
	var ids = "";
	for(var i in getSelectRows) {
		ids += getSelectRows[i].id + ",";
	}
	
	if(ids == "") {
		parent.layer.msg("请选择测点");
		return;
	}
	
	parent.layer.load(1, {
	  shade: [0.8, '#EDEDED'] //0.1透明度的白色背景
	});
	
	// 设置选中的测点ID
	parent.$("#iframe-" + rId)[0].contentWindow.showFeatureFilter(ids);
	parent.layer.closeAll();
}