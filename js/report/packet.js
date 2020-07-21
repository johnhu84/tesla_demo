var selectFeatureIds = "", sampleSelections = "";

/**
 * 创建分组
 * @returns
 */
function createPacket() {
	// feature
	//使用getSelections即可获得，row是json格式的数据
	var getSelectRows = $featureTable.bootstrapTable('getSelections', function (row) {
          return row;
	});
	selectFeatureIds = "";
	for(var i in getSelectRows) {
		selectFeatureIds += getSelectRows[i].uuid + ",";
	}
	
	// sample
	//使用getSelections即可获得，row是json格式的数据
	getSelectRows = $manualSampleTable.bootstrapTable('getSelections', function (row) {
          return row;
	});
	sampleSelections = "";
	for(var i in getSelectRows) {
		sampleSelections += getSelectRows[i].id + ",";
	}
	
	if(selectFeatureIds == "" || sampleSelections == "") {
		parent.layer.msg("请选择待分组的测点数据");
		return;
	}
	
	sampleSelections = sampleSelections.substring(0, sampleSelections.length);
	selectFeatureIds = selectFeatureIds.substring(0, selectFeatureIds.length);
	
	// 判断值 弹出筛选按钮
    parent.layer.open({
        type: 1,
        btn: ["保存","取消"],
        scrollbar: false,
        area: ['500px', '480px'],
        maxmin: true, //开启最大化最小化按钮
        shade: 0,
        title: "创建分组",
        shadeClose: true, //点击遮罩关闭
        content: $("#createPacket").html(),
        success: function() {
        	// 加载树结构
        	loadTree("#ztree1");
        },
        yes: function() {
        	// 保存分组
        	savePacket();
        	return false;
        },
        end: function () {
        	$("#createPacket").hide();
        	parent.layer.closeAll();
        }
    });
}

/**
 * 分组列表
 * @returns
 */
function ClickList() { 
	// 判断值 弹出筛选按钮
	parent.layer.open({
        type: 1,
        btn: ["显示分组数据","取消"],
        fixed: false,
        scrollbar: false,
        area: ['500px', '480px'],
        maxmin: true, //开启最大化最小化按钮
        shade: 0,
        title: "分组列表",
        shadeClose: true, //点击遮罩关闭
        content: $("#showPacket").html(),
        success: function() {
        	// 加载树结构
        	loadTree("#ztree2");
        },
        yes: function() {
        	// 展示分组数据
        	showPacketData();
        	return false;
        },
        end: function () {
        	$("#showPacket").hide();
        	parent.layer.closeAll();
        }
    });
}

/**
 * 加载树结构
 * @returns
 */
function loadTree(id) {
	var zTreeObj, setting;
	
	// 创建分组的树结构
	if(id == "#ztree1") {
		setting = {
	        view : {
	            enable : true,
	            showLine : true
	        },
	        data : {
	            simpleData : {
	                enable : true
	            }
	        }
	    };
	// 分组列表
	} else {
		setting = {
	        view : {
	            enable : true,
	            showLine : true,
				removeHoverDom: removeHoverDom
	        },
	        data : {
	            simpleData : {
	                enable : true
	            }
	        },
			edit:{
	            enable: true,
				showRenameBtn: showRenameBtn,
				showRemoveBtn: showRemoveBtn
	        },
			callback : {
				beforeRemove: beforeRemove,
				onRename: zTreeOnRename,
				onRemove: zTreeOnRemove
			},
	    };
	}
    
	
	$.ajax({
        async : true, //是否异步
        cache : false, //是否使用缓存
        type : 'post', //请求方式,post
        dataType : "json", //数据传输格式
        url : ctx + "/dataset/packet/tree", //请求链接
        data:{
            'rId': rId,
        },
        success : function(data) {
        	zTreeObj = $.fn.zTree.init($(id, window.parent.document), setting, data);
            zTreeObj.expandAll(true);
            zTreeObj.selectNode(zTreeObj.getNodes()[0]);
        },error : function(XMLHttpRequest,data) {
            console.log("加载错误");
        }
    });
}

/**
 * 保存分组
 * @returns
 */
function savePacket() {
	var groupName = $("#groupName", window.parent.document).val();
	if(groupName == '') {
		parent.layer.msg("请输入分组名称");
		return;
	}
	
	var nodes = $.fn.zTree.getZTreeObj("ztree1").getSelectedNodes();
	if(nodes.length == 0) {
		parent.layer.msg("请选择父级");
		return;
	} else if(nodes.length > 1) {
		parent.layer.msg("请选择一个父级");
		return;
	}
	
	parent.layer.load(1, {
        shade: [0.5, '#EDEDED'] //0.1透明度的白色背景
    });
	
	$.post(ctx + "/dataset/packet/save", {"name": groupName, "pid": nodes[0].id, "featureSelections": selectFeatureIds, "sampleSelections": sampleSelections, "rId": rId}, function(data) {
		parent.layer.msg(data.msg);
		if(data.code == 200) {
			parent.layer.closeAll();
			$featureTable.bootstrapTable('uncheckAll');
		} 
	});
}


/***
 * 树结构操作 begin
 */
function showIconForTreeRight(treeId, treeNode) {
    return !treeNode.isParent;
};

function zTreeOnRename(event, treeId, treeNode, isCancel) {
    $.post(ctx + '/dataset/packet/rename', {
        'id': $.trim(treeNode.id),
        'name': treeNode.name
    }, function(data, textStatus, xhr) {
        /*optional stuff to do after success */
        if (textStatus == "success") {
        	 parent.layer.msg("修改成功")
        } 
    });
}
function zTreeOnRemove(event, treeId, treeNode) {
    $.post(ctx + '/dataset/packet/'+treeNode.id+"/delete", { }, function(data, textStatus, xhr) {
        // optional stuff to do after success
        if (textStatus == "success") {
            parent.layer.msg("删除成功")
        }
    });
}

// 是否显示重命名按钮
function showRenameBtn(treeId, treeNode) {
	return treeNode.id != "1";
}
//是否显示删除按钮
function showRemoveBtn(treeId, treeNode) {
	return treeNode.id != "1";
}

function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
}

function beforeRemove(treeId, treeNode) {
    if(treeNode.isParent){
        alert("请先删除子节点");
        return false;
    }
    return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
}


function beforeClick(treeId, treeNode) {
    var check = !(treeNode.id == 1);
    return true;
}
/**
 * 树结构操作 End
 */ 


/**
 * 展示分组数据
 */
function showPacketData() {
	var nodes = $.fn.zTree.getZTreeObj("ztree2").getSelectedNodes();
	if(nodes.length == 0) {
		parent.layer.msg("请选择分组数据");
		return;
	} else if(nodes.length > 1) {
		parent.layer.msg("请选择一条分组数据");
		return;
	} else if(nodes.id == "1") {
		parent.layer.msg("不能选择全部分组");
		return;
	}
	
	parent.layer.load(1, {
        shade: [0.5, '#EDEDED'] //0.1透明度的白色背景
    });
	
	// 加载分组数据
	$.post(ctx + "/dataset/packet/detail", {id: nodes[0].id}, function(data) {
		if(data.code == 200) {
			// 待选中的样本数据
			sampleSelectedIds = data.data.sampleSelections;
			// 待选中的测点数据
			featureSelectedIds = data.data.featureSelections;
			// 刷新样本
			$manualSampleTable.bootstrapTable('refresh');
		}
		
		parent.layer.closeAll();
	});
	
}
