/**
 * 添加tab标签页
 * @returns
 */
function addTab(rName, rId, firstTimeLoad) {
	layui.use(['element'], function() {
        var element = layui.element;
        //一些事件监听
        element.tabAdd('dataset-tabs', {
			title: rName,
			content: "<iframe name='iframe-tabs-" + rId + "' id='iframe-" + rId + "' src='" + ctx + "/dataset?rId=" + rId + "&rName=" + rName + "' frameborder='0' align='left' width='100%' class='pull-left' height='400px' scrolling='no'></iframe>" ,
			id: rId
        });
        
        if(firstTimeLoad) {
        	// 切换到新增的tab标签上
        	element.tabChange('dataset-tabs', rId);
        }
    });
}

/**
 * 删除tab标签页
 * @returns
 */
function removeTab(rId) {
	layui.use(['element'], function() {
		var element = layui.element;
		element.tabDelete("dataset-tabs", rId);
	});
}