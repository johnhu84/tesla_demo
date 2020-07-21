/**
 * 初始化画布大小 、 加载模型 、 加载特征点
 */

var canvasWidth = 400;
var canvasHeight = 360;
// 默认的模型名称
var default_model_name = "DEFAULT_MODEL_NAME";
// 模型是否加载成功
var model_already_load = false;
// 导航开关
var navigator_switch = false;
// 视口位置
var view_location = null;
// 单选 、 框选的对象
var node_type = null;
// 模型名称和零件ID的关系（key -> routineId, value -> [模型名称数组]）
var rid_2_model_name = {};
// 特征点和零件ID的关系（key -> routineId, value -> [特征点数组]）
var rid_2_special_point = {};

$(function(){
	var fov = 30;
    var near = 0.1;
    var far = 100;
    var ambientColor = 0xcccccc;
    var ambientIntensity = 0.2;
    var pointColor = 0xffffff;
    var pointIntensity = 0.8;
    var backgroundColor = 0xaaaaaa;
    // 加载画布
    draw(canvasWidth, canvasHeight, fov, near, far, ambientColor, ambientIntensity, pointColor, pointIntensity, backgroundColor);

    // 加载模型
    initModel(rId, rName, true);
});

/**
 * 加载模型
 * @returns
 */
function initModel(rId, rName, firstTimeLoad) {
	model_already_load = false;
	layer.load(1, {
        shade: [0.8, '#EDEDED'] //0.1透明度的白色背景
    });

	// 插入tab组
	addTab(rName, rId, firstTimeLoad);

	$.get(ctx + "/report/loadImage", {"rId": rId}, function(data){
		if(data.code == 200) {
			// 数模路径
			var imagePath = data.data.imagePath;
			// 点云路径
			var cgoPath = data.data.cgoPath;
			// 第一次加载模型(清空之前保留的参数)
			if(firstTimeLoad) {
				rid_2_model_name = {};
				rid_2_special_point = {};
			}

			// 加载模型
			if(imagePath && imagePath != '' && imagePath.indexOf("\\") != 0) {
				var array = imagePath.split(",");
				rid_2_model_name[rId] = [];
				for(var i in array) {
					var url = array[i];
					var modelType = url.substring(url.lastIndexOf(".") + 1, url.length);
				    var modelName = url.substring(url.lastIndexOf("/") + 1, url.length);
				    // 零件ID与模型名称关联Map
				    rid_2_model_name[rId].push(modelName);
				    // 加载模型到canvas
				    loadModel(modelType, modelName, ctx + "files" + url.substring(0, url.lastIndexOf("/") + 1), function(){
				    	model_already_load = true;
				    });
				}
			} else {
				// 零件ID与模型名称关联Map
				rid_2_model_name[rId] = [default_model_name];
				// 加载模型到canvas
			    loadModel(".ply", default_model_name, undefined, function(){
			    	model_already_load = true;
			    });
			}

			// 数模按钮增加节点
			appendModel(rId, rName, imagePath, cgoPath);


			// TODO 点云文件
		}
	});
}

/**
 * 加载特征点（表格数据加载成功后的回调）
 * @returns
 */
function initSpecialPoints(rId, firstTimeLoad) {
	var itr = setInterval(function(){
		// 模型加载成功后
		if(model_already_load) {
			var modelNameArray = rid_2_model_name[rId];
			// 非第一次加载
			if(!firstTimeLoad) {
				// 删除之前加载的特征点数据
				deleteSpecialPoint(modelNameArray[modelNameArray.length - 1]);
			}
			// dataset.js getSpecialPointData 获得当前列表中显示的测点数据
			var data = $("#iframe-" + rId)[0].contentWindow.getSpecialPointData();
			if(data) {
				var color = new THREE.Color(0, 1, 0);
				// 加载特征点
				loadSpecialPoint(modelNameArray[modelNameArray.length - 1], data, color, 0.7, undefined);
			}
			// 零件ID和特征点关联的map
			rid_2_special_point[rId] = data;
		    // 清除定时循环
			clearInterval(itr);
			layer.closeAll('loading');

			// 是否显示/隐藏异常/正常点
			_toggleAbnormal();
			_toggleNormal();
		}
	}, 100);
}

/**
 * 第一次加载是否显示异常点
 * @author nikoohp
 */
function _toggleAbnormal() {
	var $type = $('#abnormalPoint .move').data('state');
	toggleAbnormal($type);
}
/**
 * 第一次加载是否显示正常点
 * @author nikoohp
 */
function _toggleNormal() {
	var $type = $('#normalPoint .move').data('state');
	toggleNormal($type);
}

/**
 * 数模按钮增加节点
 */
function appendModel(rId, rName, imagePath, cgoPath) {
	// 显示隐藏模型节点  beign
	var modelDisabled = true;
	if(imagePath && imagePath != '') {
		modelDisabled = false;
	}

	var html = "<p data-id='" + rId + "' class=\"clearfix\">"
        + "<label title='" + rName + "'><input name=\"part\" onclick='showOrHide(this, 1)' type=\"checkbox\" value=\"" + rId + "\" " + (modelDisabled ? "disabled" : "checked") + ">" + rName + "</label>"
        + "<label><input name=\"point\" onclick='showOrHide(this, 2)' type=\"checkbox\" value=\"" + rId + "\" checked>测点</label>";

	var cgoDisabled = "";
	// 没有点云数据
	if(!cgoPath || cgoPath == '') {
		cgoDisabled = "disabled";
	}

    html += "<label><input name=\"pointCloud\" onclick='showOrHide(this, 3)' type=\"checkbox\" value=\"" + rId + "\"" + cgoDisabled + ">点云</label>";
    + "</p>";
	$(".selectModel").append(html);
	// 显示隐藏模型节点  end

	// 删除模型节点  beign
	if(this.rId != rId) {
		html = "<option value='" + rId + "'>" + rName + "</option>"
		$("#deleteModel").append(html);
	}
	// 删除模型节点  end
}

/**
 * 添加模型
 * @returns
 */
function addModel() {
	// 判断值 弹出筛选按钮
    layer.open({
        type: 1,
        btn: ["添加到画布","取消"],
        offset: '7%', //top
        scrollbar: false,
        area: ['400px', '560px'],
        maxmin: true, //开启最大化最小化按钮
        shade: 0,
        title: "添加数模",
        shadeClose: true, //点击遮罩关闭
        content: $('#addModelDiv'), //注意，如果str是object，那么需要字符拼接。
        yes: function() {
        	var node = getAddModelTreeSelectedNode();
        	if(node) {
        		// 加载模型
        		initModel(node.rId, node.name, false);
        		layer.closeAll();
        		return true;
        	} else {
        		layer.msg("请选择零件节点");
        	}
        	return false;
        },
        end: function () {
            $("#addModelDiv").hide();
        }
    });
}

/**
 * 通过数模名称获得零件ID
 * @returns
 */
function getRIdByModelName(modelName) {
	for(var key in rid_2_model_name) {
		for(var i in rid_2_model_name[key]) {
			if(rid_2_model_name[key][i] == modelName) {
				return key;
			}
		}
	}
	return null;
}
