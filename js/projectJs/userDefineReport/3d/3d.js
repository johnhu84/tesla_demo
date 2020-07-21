// 导航开关
var navigator_switch = false;
// 视口位置
var view_location = null;
//选中的mesh对象
var pickedMeshList = [];
//单选 、 框选的对象
var nodeType = '';

/**
 * 导航开关
 * @returns
 */
function navigatorSwitch() {
    navigator_switch = !navigator_switch;
    if (navigator_switch) {
        var scaleRatio = 1;
        var navigatorViewPortWidth = 90;
        var navigatorViewPortHeight = 90;
        var navigatorViewPortLeft = window._canvasWidth - navigatorViewPortWidth;
        var navigatorViewPortBottom = 0;
        navigatorOn(scaleRatio, navigatorViewPortWidth, navigatorViewPortHeight, navigatorViewPortLeft, navigatorViewPortBottom);
    } else {
        navigatorOff();
    }
}

/**
 * 视角切换
 * @returns
 */
function frontFaceChange(node) {
    var v = $(node).val();
    // 正视图
    if (v == "1") {
        navigatorFrontFace();
        // 取消选中
        $(node).find("option:selected").prop("selected", false);
        // 左视图
    } else if (v == "2") {
        navigatorLeftFace();
        // 取消选中
        $(node).find("option:selected").prop("selected", false);
        // 俯视图
    } else if (v == "3") {
        navigatorTopFace();
        // 取消选中
        $(node).find("option:selected").prop("selected", false);
    }
}

/**
 * 显示隐藏
 * type = 1 模型
 * type = 2 测点
 * type = 3 点云
 * @returns
 */
function showOrHide(node, type) {
    var rId = $(node).val();
    var isShow = $(node).is(":checked");
    var modelName = rid_2_model_name[rId][0];

    // 显示
    if (isShow) {
        if (type === 1) {
            showNode(modelName, "MeshGroup", modelName + "_mesh");
        } else if (type == 2) {
            var data = rid_2_special_point[rId];
            if (data) {
                for (var i in data) {
                    showNode(modelName, "SpecialPointGroup", modelName + data[i]._name);
                }
            }
        }
        // 隐藏
    } else {
        if (type === 1) {
            hideNode(modelName, "MeshGroup", modelName + "_mesh");
        } else if (type == 2) {
            var data = rid_2_special_point[rId];
            if (data) {
                for (var i in data) {
                    hideNode(modelName, "SpecialPointGroup", modelName + data[i]._name);
                }
            }
        }
    }
}

/**
 * 关闭鼠标左键单击的所有操作
 * @returns
 */
function offAllClickOperation() {
    // 关闭框选放大
    navigatorViewOff();
    // 关闭测距
    measureDistanceOff();
    // 关闭特征点/模型交互操作
    pickOff();
}

/**
 * 保存、恢复视口
 * @returns
 */
function saveAndReverseView(node) {
    // 保存视口
    if ($(node).val() == "1") {
        view_location = navigatorViewSave();
        // 取消选中
        $(node).find("option:selected").prop("selected", false);
        // 恢复视口
    } else if ($(node).val() == "2") {
        if (view_location) {
            // 视点位置
            var target = [view_location._target[0],
            view_location._target[1],
            view_location._target[2]];
            // 眼睛位置
            var eyePos = [view_location._eyePos[0],
            view_location._eyePos[1],
            view_location._eyePos[2]];
            // 头顶方向
            var up = [view_location._up[0],
            view_location._up[1],
            view_location._up[2]];
            navigatorViewReverse(target, eyePos, up);
        }
        // 取消选中
        $(node).find("option:selected").prop("selected", false);
    }
}

$(function () {
    $("body").click(function (e) {
        // 点击空白处
        // 关闭鼠标左键单击的所有操作
        if (e.target.id == 'pageScreen') {
            offAllClickOperation();
        }
    });
});

//视窗操作所有接口
window.addEventListener('resize', function () {
    resizeCanvas(canvasWidth, canvasHeight);
}, false);

document.getElementById('canvas').addEventListener('mousedown', function (event) {
    if (event.button === 0) {
        pickMouseDown(event.offsetX, event.offsetY);
        navigatorMouseDown(event.offsetX, event.offsetY);
        measureDistanceMouseDown(event.offsetX, event.offsetY);
        clipMouseDown(event.offsetX, event.offsetY);
    }
}, false);

document.getElementById('canvas').addEventListener('mousemove', function (event) {
    if (event.button === 0) {
        pickMouseMove(event.offsetX, event.offsetY);
        navigatorMouseMove(event.offsetX, event.offsetY);
        measureDistanceMouseMove(event.offsetX, event.offsetY);
        clipMouseMove(event.offsetX, event.offsetY);
    }
}, false);

document.getElementById('canvas').addEventListener('mouseup', function (event) {
    if (event.button === 0) {
        pickMouseUp(event.offsetX, event.offsetY);
        navigatorMouseUp(event.offsetX, event.offsetY);
        measureDistanceMouseUp(event.offsetX, event.offsetY);
        clipMouseUp(event.offsetX, event.offsetY);
    }
}, false);

/**
 * 取消table表格全部选中
 * @author nikoohp
 * @param {String} name 特征点名称
 */
function unselectAll(name) {
    var modelName = name.substring(0, name.lastIndexOf("_"));
    var rId = getRIdByModelName(modelName);
    $("#iframe-" + rId)[0].contentWindow.uncheckAll();
}
/**
 * 选中特征点的table表格中对应的数据
 * @author nikoohp
 * @param {String} name 特征点名称
 * @param {String} modelName 模型名称
 */
function selectMeshData(name, modelName) {
    var featureId = name.substring(name.lastIndexOf("_") + 1);
    var rId = getRIdByModelName(modelName);
    $("#iframe-" + rId)[0].contentWindow.checkFeature(featureId);
}

/**
 * 滚动到最后一个特征点的table表格位置
 * @author nikoohp
 * @param {Array} pickedMeshList 选中的特征点列表
 */
function scrollLastMeshPosition(pickedMeshList) {
    if (!pickedMeshList || !pickedMeshList.length) return;

    var lastPickedMesh = pickedMeshList[pickedMeshList.length - 1];
    var name = lastPickedMesh.name;
    var modelName = lastPickedMesh.modelName;
    var featureId = name.substring(name.lastIndexOf("_") + 1);
    var rId = getRIdByModelName(modelName);
    $("#iframe-" + rId)[0].contentWindow.scrollFeature(featureId);
}

/**
 * 拖拽放大缩小
 * @returns
 */

function toggleDragAndResize(e) {
    if (Number($(e).attr("data-state")) == 2) {
        $('#container').draggable({ disabled: true })
        $('#container').resizable({ disabled: true })
        $("#childrenSuo").resizable({ disabled: true })
        $("#childrenSuo").css("z-index", 5)
        $(e).attr("data-state", "1")
    } else {
        $('#container').draggable({ disabled: false })
        $('#container').resizable({ disabled: false })
        $("#childrenSuo").resizable({
            disabled: false,
            alsoResize: "#container",
        })
        $("#childrenSuo").css("z-index", 10)
        $('#container').resizable({
            resize: function (event, ui) {
                $('#canvas').width(ui.size.width)
                $('#canvas').height(ui.size.height)
                resizeCanvas(ui.size.width, ui.size.height);
            }
        });

        $(e).attr("data-state", 2)
    }
}

/**
 * 删除数模
 * @returns
 */
function delModel(node) {
    var rId = $(node).val();
    if (rId == '') {
        return;
    }
    var modelName = rid_2_model_name[rId][0];

    // 删除特征点
    deleteSpecialPoint(modelName);
    // 删除模型
    deleteModel(modelName);

    // 删除零件ID与模型的关联关系
    delete rid_2_model_name[rId];
    // 删除零件ID与特征点的关联关系
    delete rid_2_special_point[rId];

    // 删除节点元素
    $(node).find("option[value='" + rId + "']").remove();
    $(".selectModel p[data-id='" + rId + "']").remove();
    // 删除tab
    removeTab(rId);
}

/**
 * 打开选点/框选模型操作功能
 * @author nikoohp
 */
function PickOnSelectAction(config) {
    // 合并参数
    var config = Object.assign({
        nodeType: 'SpecialPointGroup',
        pickType: 'PointerPick',
        groupType: 'add',
        isPoint: false
    }, config);

    nodeType = config.nodeType;
    var pickType = config.pickType;//PointerPick SquarePick
    var groupType = config.groupType;//add sub inter

    var callBack = function (pickedMeshes) {
        // 清理为undefined的项
        var pickedMeshes = pickedMeshes.filter(function (item) {
            if (item) return item;
        });

        if (!pickedMeshes.length) return;

        for (var i = 0; i < pickedMeshList.length; i++) {
            var name = pickedMeshList[i].name;
            var modelName = pickedMeshList[i].modelName;
            var nodeType = pickedMeshList[i].nodeType;
            var color = pickedMeshList[i].color;
            var opacity = pickedMeshList[i].opacity;
            modifyNodeOpacity(modelName, nodeType, name, opacity);
            modifyNodeColor(modelName, nodeType, name, color);
        }

        // 全部取消选中
        config.isPoint && unselectAll(pickedMeshes[0].name)

        pickedMeshList = pickedMeshes.map(function (item) {
            var name = item.name;
            var modelName = name.substring(0, name.lastIndexOf("_"));
            var defaultOpacity = .2;
            // 设置选中
            modifyNodeOpacity(modelName, nodeType, name, defaultOpacity);
            // 选中特征点的table表格中对应的数据
            config.isPoint && selectMeshData(name, modelName);

            return {
                "name": name,
                "modelName": modelName,
                "nodeType": nodeType,
                "opacity": defaultOpacity,//item.material.opacity,
                "color": item.material.color,
                "visible": item.material.visible
            };

        });

        // 滚动最后一个特征点的table表格位置
        config.isPoint && scrollLastMeshPosition(pickedMeshList);
    };

    CloseBoxSelectionSingleChoice(pickType);

    pickOn(nodeType, pickType, groupType, callBack);

}

/**
 * 单选点
 * @returns
 */
function SingleChoicePoint() {
    var nodeType = "SpecialPointGroup";//PointerPick SquarePick
    var pickType = "PointerPick";//PointerPick SquarePick
    var groupType = "add";//add sub inter

    PickOnSelectAction({
        isPoint: true,
        nodeType: nodeType,
        pickType: pickType
    });
    switchPickType(pickType);
    switchGroupType(groupType);
}

/**
 * 框选点
 * @returns
 */
function BoxSelectionPoint(e) {
    var nodeType = "SpecialPointGroup";//PointerPick SquarePick
    var pickType = "SquarePick";//PointerPick SquarePick
    var groupType = $(e).val();

    PickOnSelectAction({
        isPoint: true,
        nodeType: nodeType,
        pickType: pickType
    });
    switchPickType(pickType);
    switchGroupType(groupType);
}

/**
 * 框选模型
 * */
function BoxSelectionModel() {
    var nodeType = "MeshGroup";
    var pickType = "SquarePick";//PointerPick SquarePick
    var groupType = "add";//add sub inter

    PickOnSelectAction({
        isPoint: false,
        nodeType: nodeType,
        pickType: pickType
    });
    switchPickType(pickType);
}

/**
 * 关闭框选点选
 * */
function CloseBoxSelectionSingleChoice(pickType) {
    if (window._pickOn && window._pick && window._pick._pickTarget !== pickType) {
        pickOff();
    }

}

/**
 * 颜色
 */
$(function () {
    $(".DSBgColor").colorpicker(); //底色拾色器

    //透明度滑动插件
    scale = function (btn, bar, title, fn) {
        this.btn = document.getElementById(btn);
        this.bar = document.getElementById(bar);
        this.title = document.getElementById(title);
        this.step = this.bar.getElementsByTagName("DIV")[0];
        this.fn = fn || function () { };
        this.init();
    };
    scale.prototype = {
        init: function () {
            var f = this, g = document, b = window, m = Math;
            f.btn.onmousedown = function (e) {
                var x = (e || b.event).clientX;
                var l = this.offsetLeft;
                var max = f.bar.offsetWidth - this.offsetWidth;
                g.onmousemove = function (e) {
                    var thisX = (e || b.event).clientX;
                    var to = m.min(max, m.max(-2, l + (thisX - x)));
                    f.btn.style.left = to + 'px';
                    f.ondrag(m.round(m.max(0, to / max) * 10), to);
                    b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
                };
                g.onmouseup = new Function('this.onmousemove=null');
            };
        },
        ondrag: function (pos, x) {
            var opacity = pos / 10;
            this.step.style.width = Math.max(0, x) + 'px';
            this.title.innerHTML = opacity + '';
            this.fn(opacity)
        }
    }

    //ToDo 6/22/2020, don't know if this will be needed for userDefineReport
    /*new scale('btn0', 'bar0', 'title0', (opacity) => {
        console.log(opacity);

    });*/
})

/**
 * 设置颜色
 */
function BackgroundColor(e) {
    $(e).val(e.value)
    var sheet = document.styleSheets[0];
    var rules = sheet.cssRules || sheet.rules;

    if (nodeType === "SpecialPointGroup") {// 更改特征点颜色
        for (var i = 0; i < pickedMeshList.length; i++) {
            var modelName = pickedMeshList[i].name.split("_")[0];
            modifyNodeColor(modelName, nodeType, pickedMeshList[i].name, new THREE.Color(e.value));
        }
    } else if (nodeType === "SpecialPointAddedGroup") {

    } else if (nodeType === "PointCloudGroup") {


    } else {// 更改模型颜色
        for (var i = 0; i < pickedMeshList.length; i++) {
            var modelName = pickedMeshList[i].name.split("_")[0];
            modifyNodeColor(modelName, nodeType, modelName + "_mesh", new THREE.Color(e.value));
        }

    }
}

/**
* 点样式
* */
function PointStyle(e) {
    var nodeType = "SpecialPointGroup";
    if (nodeType === "SpecialPointGroup") {
        if ($(e).val() == "") {
            return;
        }
        for (var i = 0; i < pickedMeshList.length; i++) {
            var modelName = pickedMeshList[i].name.split("_")[0];
            modifyNodeGeometry(modelName, nodeType, pickedMeshList[i].name, $(e).val());//sphere, arrow
        }
    } else if (nodeType === "SpecialPointAddedGroup") {

    } else if (nodeType === "PointCloudGroup") {

    }
}



// 关闭显示隐藏、透明度下拉
$(function () {
    $("body").click(function (e) {
        if (!$(e.target).hasClass("xianshi") && $(".selectModel").has(e.target).length == 0) {
            if ($(".selectModel").css("display") == "block") {
                $(".selectModel").hide();
            }
        }
        if (!$(e.target).hasClass("hasTransparency") && $(".ModelTransparency").has(e.target).length == 0) {//透明度
            if ($(".ModelTransparency").css("display") == "block") {
                $(".ModelTransparency").hide();
                var numTransparency = Number($(".ModelTransparency").find("#title0").text())
                if (nodeType === "MeshGroup") {
                    for (var i = 0; i < pickedMeshList.length; i++) {
                        var modelName = pickedMeshList[i].name.split("_")[0];
                        modifyNodeOpacity(modelName, nodeType, pickedMeshList[i].name, numTransparency);
                    }
                } else if (nodeType === "SpecialPointGroup") {
                    for (var i = 0; i < pickedMeshList.length; i++) {
                        var modelName = pickedMeshList[i].name.split("_")[0];
                        modifyNodeOpacity(modelName, nodeType, pickedMeshList[i].name, numTransparency);
                    }
                } else if (nodeType === "SpecialPointAddedGroup") {

                } else if (nodeType === "PointCloudGroup") {

                } else if (nodeType === "HeapMapGroup") {

                }
            }

        }
    });
})


/**
 * 测量距离
 *
 * **/
function MeasureDistance(e) {
    var $type = $(e).val();
    var measureTarget = 'MeshGroup-SpecialPointGroup-SpecialPointAddedGroup';
    if ($type === 'start') {
        measureDistanceOn(measureTarget);
        setMeasureDistanceTarget(measureTarget);
    }
    if ($type === 'clear') {
        clearMeasureDistance();
    }
}


/**
 * 获得当前零件对应的特征点相对屏幕的坐标
 * @returns
 */
function getSpecialPointsLocation(_specialPointCallback) {
    var modelName = rid_2_model_name[rId][0];
    locationArray = [];
    var callback = function (specialPointGroup) {
        for (var i = 0; i < specialPointGroup.length; i++) {
            var name = specialPointGroup[i]._name;
            name = name.substring(name.lastIndexOf("_") + 1);
            var screenPos = specialPointGroup[i]._screenXY;
            var canvasLeft = $("#canvas").offset().left;
            var canvasTop = $("#canvas").offset().top;
            var left = screenPos[0] + canvasLeft;
            var top = screenPos[1] + canvasTop;

            locationArray.push({
                id: name,
                screen_x: left,
                screen_y: top,
                x: screenPos[0],
                y: screenPos[1],
                z: screenPos[2]
            });
        }
        _specialPointCallback && _specialPointCallback(locationArray);
        // 关闭特征点回调方法
        specialPointCallBackOff();
    };
    // 特征点回调
    specialPointCallBackOn(callback);
}


// 剖切
var clipInstance;
function ClipMode(e) {
    var $type = $(e).val();

    if (!(clipInstance instanceof Clip_)) {
        clipInstance = new Clip_();
    }

    clipInstance[$type]();
}
/**
 * 剖切构造函数
 * @author nikoohp
 */
function Clip_() {
    this.id = Math.floor(Math.random() * 1000);
}
Object.assign(Clip_.prototype, {
    create() {
        if (window._planeClipOn) return;

        clipOn();
        var clipPlaneColor = new THREE.Color(1, 1, 0);
        var clipPlaneOpacity = 0.3;
        createClipPlane(id, clipPlaneColor, clipPlaneOpacity);
    },
    show() {
        if (window._planeClipOn) return;

        showClipPlane(this.id);
    },
    hide() {
        if (window._planeClipOn) return;

        hideClipPlane(this.id);
    },
    delete() {
        deleteClipPlane(this.id);
        clipOff();
        this.id = Math.floor(Math.random() * 1000);
    },
});

/**
 * table 表格勾选时，选中特征点
 * @author nikoohp
 */
function checkTableToPickPoint(modelName, id, rid) {
    // 判断勾选的点id，是否在特征点中
    // 异常点过滤（测试数据，部分点和特征点对不上）
    var hasName = rid_2_special_point[rid].some(function(item) {
        return item._name === id;
    });

    if (!hasName) return;

    modifyNodeOpacity(modelName, undefined, modelName+'_'+id, 0.2);
}


/**
 * 异常点开关
 * @author nikoohp
 * @param {Object} _this 点击节点jq对象
 */
function switchBtn(_this) {
    var $stateElm = $(_this).find('.move');
    var type = $(_this).data('type');
    var state = $stateElm.data('state')
    var changeState = state === 'off' ? 'on' : 'off';

    $(_this).removeClass(state).addClass(changeState);
    $stateElm.data('state', changeState);

    switch (type) {
        case 'abnormal':
            toggleAbnormal(changeState);
            break;
        case 'normal':
            toggleNormal(changeState);
            break;

        default:
            break;
    }

}

/**
 * 特征点设置颜色
 * @author nikoohp
 * @param {参数类型} 参数名称 参数描述
 * @returns {返回值类型} 返回值描述
 */
function _togglePoint(list, color) {
    var modelName = rid_2_model_name[window._rid][0];
    var nodeType = 'SpecialPointGroup';
    // 特征点
    var specialPointIds = window.rid_2_special_point[window._rid].map(function (item) {
        return item._name;
    });
    // 异常点过滤（测试数据，部分点和特征点对不上）
    var _list = list.filter(function (item) {
        return specialPointIds.indexOf(item) !== -1;
    });
    _list.forEach(function (item) {
        modifyNodeColor(modelName, nodeType, modelName + '_' + item, color);
    });
}

/**
 * 显示/隐藏异常点
 * @author nikoohp
 * @param {String} state 显示/隐藏异常点状态
 */
function toggleAbnormal(state) {
    var color = state === 'off' ? new THREE.Color(0, 1, 0) : new THREE.Color(1, 0, 0);
    _togglePoint(window._abnormalIds, color);
}
/**
 * 显示/隐藏正常点
 * @author nikoohp
 * @param {String} state 显示/隐藏异常点状态
 */
function toggleNormal(state) {
    var color = state === 'off' ? new THREE.Color(0, 1, 0) : new THREE.Color(0, 0, 1);
    _togglePoint(window._normalIds, color);
}
