// 样本
var $manualSampleTable = $('#sampleTabel');
// 最近几个样本数
var recentSampleCount = 5;
// 数据筛选后选中的样本ID
var sampleSelectedIds = "";
// 测点
var $featureTable = $('#featureTable');
// 数据筛选后选中的测点ID
var featureSelectedIds = "";

var normalIds = {};
var abnormalIds = {};

$(function () {
		window.parent._rid = window.name.split('iframe-tabs-')[1];
    initSample();
})

// 样本
var $manualSampleTableColumn = [
    {
        field: 'checked',
        checkbox: true,
        align: 'center',
        valign: 'middle',
        formatter: function (value, row, index) {//设置满足条件的行可以使用复选框
            return {
                checked : true//设置选中
            };
        }
    },
    {field: 'id', title: 'id', visible: false},
    {field: 'label', title: '样本名称'},
    {field: 'createDateStr', title: '创建时间'}

];

/**
 * 加载样本数据
 * @returns
 */
function initSample() {

    $manualSampleTable.bootstrapTable({
        url: ctx + "/dataset/filter/sample?rId=" + rId,
        columns: $manualSampleTableColumn,  //表头
        striped: true,
        uniqueId:'ID',
        idField: "ID",
        pagination: false,
        //设置数据请求的额外参数
        queryParams: function (params) {
            var param = {};
            param.offset = 0;
            param.limit = 100;
            // 默认显示5个样本数据
            param.recentSampleCount = recentSampleCount;

            var andCondition = {};
            andCondition.S_R_ID_EQ = rId;
            // 选中的样本ID
            if(sampleSelectedIds != "") {
            	andCondition.S_ID_IN = sampleSelectedIds;
            	// 取消5个样本的限制
            	param.recentSampleCount = null;
            }
            param.andCondition = JSON.stringify(andCondition);
            return param;
        },
        responseHandler: function (res) {
        	if(res.rows && res.rows.length) {
						var sampleIds = res.rows.map(function(item) {
							return item.id;
						});
        		var sampleNames = res.rows.map(function(item) {
							return item.label;
						});
	        	// 加载测点
	        	initFeature(sampleIds, sampleNames);
        	}

        	// 选中所有行
        	// $manualSampleTable.bootstrapTable("checkAll");

					return res.rows;
        },
        onCheck:function(row){
            featureShowColumn("~" + row.label);
            // 显示选中的行，隐藏其他行
						showFeatureRow(featureSelectedIds);
						_calcPoint();
        },
        onUncheck:function(row){
            // 显示选中的行，隐藏其他行
						showFeatureRow(featureSelectedIds);
						_calcPoint();
						featureHideColumn("~" + row.label);

        },
        onCheckAll: function (row) {
            for (let i = 0; i <row.length; i++) {
                featureShowColumn("~" + row[i].label)
            }
            // 显示选中的行，隐藏其他行
						showFeatureRow(featureSelectedIds);
						_calcPoint();
         },
        onUncheckAll: function (row) {
            for (let i = 0; i <row.length; i++) {
                featureHideColumn("~" + row[i].label);
            }
            // 显示选中的行，隐藏其他行
						showFeatureRow(featureSelectedIds);
						_calcPoint();
         }
    });

}

/**
 * 重新设置测点table列
 * 重新计算测点异常/正常点
 * @author nikoohp
 */
function _calcPoint() {
	var rows = $manualSampleTable.bootstrapTable('getSelections');
	var data = $featureTable.bootstrapTable('getData', { includeHiddenRows: false })

	var sampleIds = rows.map(function (item) {
		return item.id;
	});
	var sampleNames = rows.map(function (item) {
		return item.label;
	});

	// 样本勾选取消时清空正常异常点
	normalIds = {};
	abnormalIds = {};

	data.forEach(function(item) {
		sampleNames.forEach(function(sample) {
			_calcPointStatus(item['~' + sample], item);
		});
	});

	// 未选择样本时，异常/正常点为0
	if (!sampleNames.length) {
		window.parent._abnormalIds = [];
		window.parent._normalIds = [];
		window.parent._resetPointColor();
	}
	// 是否显示/隐藏异常/正常点
	window.parent._toggleAbnormal();
	window.parent._toggleNormal();

	// 统计
	window.parent._countPointNum();
}

// 显示测点
function featureShowColumn(id) {
    $featureTable.bootstrapTable('showColumn', id);
}

// 隐藏测点
function featureHideColumn(id) {
    $featureTable.bootstrapTable('hideColumn', id);
}

// 格式化日期，如月、日、时、分、秒保证为2位数
function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n;
}

// 参数number为毫秒时间戳，format为需要转换成的日期格式
function formatTime(number, format) {
    var time = new Date(number)
    var newArr = []
    var formatArr = ['Y', 'M', 'D', 'h', 'm', 's']
    newArr.push(time.getFullYear())
    newArr.push(formatNumber(time.getMonth() + 1))
    newArr.push(formatNumber(time.getDate()))
    newArr.push(formatNumber(time.getHours()))
    newArr.push(formatNumber(time.getMinutes()))
    newArr.push(formatNumber(time.getSeconds()))
    for (var i in newArr) {
        format = format.replace(formatArr[i], newArr[i])
    }
    return format;
}

//////////////////////////////////feature///////////////////////

/**
 * 计算测点为正常点还是异常点
 * @author nikoohp
 * @param {Number} value 测点值
 * @param {Object} row 每个测点数据
 * @returns {String} class名称
 */
function _calcPointStatus(value, row) {
	// 理论值
	var defaultValue = row.value;
	var valueType = row.sl.limitValueType;
	// 上公差
	var hiValue = row.sl.hiValue;
	// 下公差
	var loValue = row.sl.loValue;
	var className = '';

	// 绝对: 实测值在上下公差范围内
	if (valueType === 1) {
		if (value >= loValue && value <= hiValue) {
			className = 'normal';
			normalIds[row.id] = row.id
		} else {
			className = 'abnormal';
			abnormalIds[row.id] = row.id
		}
	} else if (valueType === 2) {
		// 相对: 实测值在理论值+下公差、理论值+下公差范围内
		if (value >= defaultValue + loValue && value <= defaultValue + hiValue) {
			className = 'normal';
			normalIds[row.id] = row.id;
		} else {
			className = 'abnormal';
			abnormalIds[row.id] = row.id;
		}

	}

	var _normalIds = Object.keys(normalIds);
	var _abnormalIds = Object.keys(abnormalIds);
	// 同一个id同时存在于正常点与异常点时，说明该点X/Y/Z方向有异常，该点为异常点
	// 过滤同时存在于正常点与异常点id
	_normalIds = _normalIds.filter(function (item) {
		return _abnormalIds.indexOf(item) === -1;
	});

	window.parent._normalIds = _normalIds;
	window.parent._abnormalIds = _abnormalIds;

	return className;
}

/**
 * 设置测点table表格表头
 * @author nikoohp
 * @param {Array} data 表格数据
 * @param {Array} sampleNames 样本列表
 */
function getTableColumns(data, sampleNames) {
	// 样本全部取消时
	if (!sampleNames.length) {
		window.parent._abnormalIds = [];
		window.parent._normalIds = [];
	}

	// 固定列
	var featureColumns = [
		{
			field: 'checked',
			checkbox: true,
			align: 'center',
			valign: 'middle',
			formatter: function (value, row, index) {
				return {
					checked: false
				};
			}
		},
		{ "title": "唯一ID", field: "uuid", visible: false },
		{ "title": "测点名称", field: "label" },
		{ "title": "测点方向", field: "typeStr" },
	];

	// 样本列
	var samplColumns = sampleNames.map(function (item) {
		return {
			title: item,
			field: '~' + item,
			cellStyle: cellStyle,
			formatter: function (value, row, index) {
				if(value) {
					return new Number(value).toFixed(2);
				}
				return null;
			}
		}
	})

	// 是否为空,0值为不为空
	function isEmpty(num) {
		if (num === null || num === undefined || num === '') return true;
		return false
	}

	// 单元格样式
	function cellStyle(value, row, index) {
		var defaultClass = {
			classes: 'default'
		};
		// value的值不存在且不为0
		if (isEmpty(row.value) || isEmpty(row.sl)) return defaultClass;

		// 公差不存在或者值类型为0；值类型：1：绝对  2：相对
		if (isEmpty(row.sl.hiValue) || isEmpty(row.sl.loValue) || !row.sl.limitValueType) return defaultClass

		var className = _calcPointStatus(value, row);

		return {
			classes: className
		}
	}

	return featureColumns.concat(samplColumns);
}
/**
 * 加载测点
 * @param {Array} sampleIds 样本id
 * @param {Array} sampleNames 样本名称
 * @returns
 */
function initFeature(sampleIds, sampleNames) {
	$('#featureTable').bootstrapTable('destroy');

	var searchOpt = {"sampleIds": sampleIds.join(',')};
	$.get(ctx + "/dataset/filter/sampleFeature", searchOpt, function(data){

		$featureTable.bootstrapTable({
			data: data.rows,
			columns: getTableColumns(data.rows, sampleNames),
			method: 'get',
			striped: true,
			uniqueId:'uuid',
			pagination: false,
			clickToSelect: true,
			onCheck:function(row){
				var rid = window.name.split('iframe-tabs-')[1];
				var modelName = window.parent.rid_2_model_name[rid][0];
				var name = modelName + '_' + row.id;

				window.parent.checkTableToPickPoint(modelName, row.id, rid);
			},
			onUncheck:function(row){
			},
			onCheckAll: function (row) {
			},
			onUncheckAll: function (row) {
			}
		});

		// 显示选中的行，隐藏其他行
		showFeatureRow(featureSelectedIds);

		// 3d.js 加载特征点
		parent.initSpecialPoints(rId, featureSelectedIds == '');

	});

}

/**
 * 显示选中的行，隐藏其他行
 * @returns
 */
function showFeatureRow(featureSelectedIds) {
	// 测点筛选选中的数据
	if(featureSelectedIds != '') {
		// 显示选中行 / 隐藏其他行
		var data = $featureTable.bootstrapTable('getData', {includeHiddenRows: true});
		for(var i in data) {
			// 显示分组 （通过uuid来设置）
			if(featureSelectedIds.indexOf(data[i].uuid) > -1 && featureSelectedIds.indexOf("~") > -1){
				$featureTable.bootstrapTable('showRow', {uniqueId: data[i].uuid})
			// 测点筛选（通过ID来设置）
			} else if(featureSelectedIds.indexOf(data[i].id) > -1 && featureSelectedIds.indexOf("~") < 0){
				$featureTable.bootstrapTable('showRow', {uniqueId: data[i].uuid})
			} else {
				$featureTable.bootstrapTable('hideRow', {uniqueId: data[i].uuid})
			}
		}
	}
}

/**
 * 从表格中获得特征点的数据
 * 构建特征点数据的格式
 * @returns
 */
function getSpecialPointData() {
	// 这里bootstrap-table有点bug，还可以查出来隐藏的行
	var data = $featureTable.bootstrapTable('getData', {useCurrentPage:false, includeHiddenRows:false});
	if(!data || data.length == 0) {
		return null;
	}

    var specialPointList = [];
    var name = null, x = null, y = null, z = null, i = null, j = null, k = null, lastDataIndex = null, _key = 0;
	for(var key in data) {
		// 筛选过后的测点数据
		if(featureSelectedIds != '') {
			if(featureSelectedIds.indexOf(data[key].id) < 0) {
				continue;
			}
		}

		lastDataIndex = key;

		// 第一次进来
		if(name == null) {
			name = data[key].label;
			x = null, y = null, z = null, i = null, j = null, k = null;
		// 换了一个测点
		} else if(name != data[key].label) {
			if(x && y && z) {
				var normal = [];
				if(i && j && k) {
					normal = [i, j, k];
				}
				// 插入上一个测点的值到数组
				specialPointList.push({
					"_cpcPos":[x, y, z],
					"_normal": normal,
					"_twins":[],
					"_scanSize":0,
					"_nearest":undefined,
					"_name": data[_key].id
				});
			}
			name = data[key].label;
			x = null, y = null, z = null, i = null, j = null, k = null;
		}

		// 设置对应方向的值
		if(data[key].typeStr == "X") {
			x = data[key].value;
		} else if(data[key].typeStr == "Y") {
			y = data[key].value;
		} else if(data[key].typeStr == "Z") {
			z = data[key].value;
		} else if(data[key].typeStr == "I") {
			i = data[key].value;
		} else if(data[key].typeStr == "J") {
			j = data[key].value;
		} else if(data[key].typeStr == "K") {
			k = data[key].value;
		}
		_key = key;
	} // End For

	// 最后一个点
	if(lastDataIndex && name == data[lastDataIndex].label) {
		if(x && y && z) {
			var normal = [];
			if(i && j && k) {
				normal = [i, j, k];
			}
			// 插入上一个测点的值到数组
			specialPointList.push({
				"_cpcPos":[x, y, z], "_normal": normal, "_twins":[], "_scanSize":0, "_nearest":undefined, "_name": data[key].id
			});
		}
	}

	return specialPointList;
}

/**
 * 刷新列表
 * @returns
 */
function refresh() {
	// 销毁表格
	$('#sampleTabel').bootstrapTable('destroy');
	$('#featureTable').bootstrapTable('destroy');
	// 删除选中的样本、测点ID
	sampleSelectedIds = "";
	featureSelectedIds = "";
	// 重新加载样本、测点数据
	initSample();
}

/**
 * 样本筛选
 * @returns
 */
function sampleFilter() {
	parent.layer.open({
		type: 2,
		btn: ['确定', '取消'],
		title: '样本筛选',
		shadeClose: true,
		shade: 0.8,
		area: ['90%',"600px"],
		content: ctx + "/dataset/filter/samplePage?rId=" + rId,
		yes: function(index, layero){
        	// 显示样本
			parent.window[layero.find('iframe')[0]['name']].showSample();
        	return false;
        },
		end : function() {

		}
	});
}

/**
 * 显示选择筛选后的样本
 * @returns
 */
function showSampleFilter(ids) {
	// 设置选中的样本ID
	sampleSelectedIds = ids;
	$manualSampleTable.bootstrapTable('refresh');
}

/**
 * 样本筛选
 * @returns
 */
function featureFilter() {
	parent.layer.open({
		type: 2,
		btn: ['确定', '取消'],
		title: '测点筛选',
		shadeClose: true,
		shade: 0.8,
		area: ['90%',"600px"],
		content: ctx + "/dataset/filter/featurePage?rId=" + rId,
		yes: function(index, layero){
        	// 显示测点
			parent.window[layero.find('iframe')[0]['name']].showFeature();
        	return false;
        },
		end : function() {
		}
	});
}

/**
 * 显示选择筛选后的测点
 * @returns
 */
function showFeatureFilter(ids) {
	// 选中的测点ID
	featureSelectedIds = ids;
	// 显示选中的行，隐藏其他行
	showFeatureRow(featureSelectedIds);
}

/**
 * 取消全部选中
 * @author nikoohp
 */
function uncheckAll() {
    // 全部取消选中
    $featureTable.bootstrapTable("uncheckAll");
}

/**
 * 选中对应的测点
 * @returns
 */
function checkFeature(featureId) {
    $featureTable.bootstrapTable("checkBy", { "field": "id", "values": [featureId] });
}

/**
 * 滚动特征点的table表格位置
 * @author nikoohp
 * @param {featureId} featureId 特征点id
 */
function scrollFeature(featureId) {
    // 表格数据
    var data = $featureTable.bootstrapTable('getData', { includeHiddenRows: false });
    var row = 0;
    var height = 0;

    // 计算选中行号
    for (var i = 0, len = data.length; i < len; i++) {
        // 滚动到数据所在的行位置
        if (data[i].id == featureId) {
            row = i;
            break;
        }
    }

    // 计算所有行高度
    $featureTable.find('tbody tr').each(function (i) {
        if (i < row) {
            height += $(this).height();
        }
    });

    $featureTable.bootstrapTable("scrollTo", height);
}


/**
 * 获得选中的样本ID，多个ID中间用逗号分隔
 */
function getCheckSampleIds() {
	//使用getSelections即可获得，row是json格式的数据
	var getSelectRows = $manualSampleTable.bootstrapTable('getSelections');
	var sampleIds = "";
	for(var i in getSelectRows) {
		sampleIds += getSelectRows[i].id + ",";
	}
	return sampleIds;
}