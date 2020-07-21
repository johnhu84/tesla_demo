THREE._MeasureAngle = function(){
    this._objList = undefined;
    this._isMeasuring = false;
    this._isModifying = false;
    this._currNode = undefined;
    this._currSp = undefined;
};

Object.assign(THREE._MeasureAngle.prototype, {
    _init:function(){
        this._objList = new THREE.Group();
        this._objList.name = "MeasureAngleGroup";
        window._scene.add(this._objList);
    },

    _destroy:function(){
        var _textDiv = new THREE._TextDiv();
        _textDiv._deleteTextOfMeasureAngleGroup();
        var _sceneManager = new THREE._SceneManager();
        if(window._scene.children.length > 0){
            for(var i = 0; i < window._scene.children.length; i++){
                if(window._scene.children[i].name === "MeasureAngleGroup"){
                    _sceneManager._clearNode(window._scene.children[i]);
                    window._scene.remove(window._scene.children[i]);
                    break;
                }
            }
        }
        if(this._currNode){
            _sceneManager._clearNode(this._currNode._obj);
        }
        this._currNode = undefined;
    },

    _mouseDown:function(_x, _y){
        if(!window._modifyAngleOn){//测量角度
            if(!this._isMeasuring){//还未开启一次测量
                var _raycaster = undefined;
                if(window._boxClipOn && window._clipHide){
                    _raycaster = this._rayCastClip(_x, _y);
                }else if(!window._boxClipOn || (window._boxClipOn && !window._clipHide)){
                    _raycaster = this._rayCast(_x, _y);
                }
                var _sceneManager = new THREE._SceneManager();
                var _modelMeshes = _sceneManager._getMeshesFromCertainGroup(window._scene, "");
                var _intersects = _raycaster.intersectObjects(_modelMeshes);
                if (_intersects.length > 0){
                    this._isMeasuring = true;
                    var _intersect = _intersects[0];
                    var _position = [_intersect.point.x, _intersect.point.y, _intersect.point.z];
                    this._currNode = new THREE._MeasureNode();
                    this._currNode._setName("MeasureAngleNode_"+this._objList.children.length);
                    this._currNode._createPoint(_position, 0);
                    this._objList.add(this._currNode._obj);
                }
            }else if(this._isMeasuring){//正在进行一次测量
                var _raycaster = undefined;
                if(window._boxClipOn && window._clipHide){
                    _raycaster = this._rayCastClip(_x, _y);
                }else if(!window._boxClipOn || (window._boxClipOn && !window._clipHide)){
                    _raycaster = this._rayCast(_x, _y);
                }
                var _sceneManager = new THREE._SceneManager();
                var _modelMeshes = _sceneManager._getMeshesFromCertainGroup(window._scene, "");
                var _intersects = _raycaster.intersectObjects(_modelMeshes);
                if (_intersects.length > 0){
                    //判断是第二个sp还是第三个sp
                    if(this._currNode._getPointNum() === 1){
                        var _intersect = _intersects[0];
                        var _position = [_intersect.point.x, _intersect.point.y, _intersect.point.z];
                        this._currNode._createPoint(_position, 1);
                        //创建文字
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_0");
                        var _p0 = _sceneManager._certainMesh.position;
                        _p0 = [_p0.x, _p0.y, _p0.z];
                        this._createText(_p0, _position, _p0);
                    }else if(this._currNode._getPointNum() === 2){
                        this._isMeasuring = false;
                        var _intersect = _intersects[0];
                        var _position = [_intersect.point.x, _intersect.point.y, _intersect.point.z];
                        this._currNode._createPoint(_position, 2);
                        //更新文字
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_0");
                        var _sp0Pos = _sceneManager._certainMesh.position;
                        _sp0Pos = [_sp0Pos.x, _sp0Pos.y, _sp0Pos.z];
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_1");
                        var _sp1Pos = _sceneManager._certainMesh.position;
                        _sp1Pos = [_sp1Pos.x, _sp1Pos.y, _sp1Pos.z];
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_2");
                        var _sp2Pos = _sceneManager._certainMesh.position;
                        _sp2Pos = [_sp2Pos.x, _sp2Pos.y, _sp2Pos.z];
                        this._updateText(_sp0Pos, _sp1Pos, _sp2Pos);
                    }
                }
            }
        }else if(window._modifyAngleOn){//修改角度
            if(!this._isModifying){//还未开启一次修改
                var _raycaster = undefined;
                if(window._boxClipOn && window._clipHide){
                    _raycaster = this._rayCastClip(_x, _y);
                }else if(!window._boxClipOn || (window._boxClipOn && !window._clipHide)){
                    _raycaster = this._rayCast(_x, _y);
                }
                var _sceneManager = new THREE._SceneManager();
                var _measureMeshes = _sceneManager._getMeshesFromCertainGroup(window._scene, "MeasureAngleGroup");
                var _intersects = _raycaster.intersectObjects(_measureMeshes);
                if (_intersects.length > 0){
                    this._isModifying = true;
                    var _intersect = _intersects[0];
                    var _position = [_intersect.point.x, _intersect.point.y, _intersect.point.z];
                    var _spName = _intersect.object.name;
                    var _parentName = _intersect.object.parent.name;
                    this._currNode = new THREE._MeasureNode();
                    this._currSp = undefined;
                    _sceneManager._findCertainGroup(this._objList, _parentName);
                    this._currNode._obj = _sceneManager._certainGroup;
                    _sceneManager._findCertainMesh(this._currNode._obj, _spName);
                    this._currSp = _sceneManager._certainMesh;
                }
            }else if(this._isModifying && this._currNode && this._currSp){//正在进行一次修改
                var _raycaster = undefined;
                if(window._boxClipOn && window._clipHide){
                    _raycaster = this._rayCastClip(_x, _y);
                }else if(!window._boxClipOn || (window._boxClipOn && !window._clipHide)){
                    _raycaster = this._rayCast(_x, _y);
                }
                var _sceneManager = new THREE._SceneManager();
                var _modelMeshes = _sceneManager._getMeshesFromCertainGroup(window._scene, "");
                var _intersects = _raycaster.intersectObjects(_modelMeshes);
                if (_intersects.length > 0){
                    this._isModifying = false;
                    var _intersect = _intersects[0];
                    var _position = [_intersect.point.x, _intersect.point.y, _intersect.point.z];
                    //重新画点
                    this._currSp.position.set(_position[0], _position[1], _position[2]);
                    //重新画线
                    if(this._currSp.name === "MeasurePoint_0"){
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_1");
                        var _sp1Pos = _sceneManager._certainMesh.position;
                        _sp1Pos = [_sp1Pos.x, _sp1Pos.y, _sp1Pos.z];
                        this._currNode._createLine(_sp1Pos, _position, 0);
                    }else if(this._currSp.name === "MeasurePoint_1"){
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_0");
                        var _sp0Pos = _sceneManager._certainMesh.position;
                        _sp0Pos = [_sp0Pos.x, _sp0Pos.y, _sp0Pos.z];
                        this._currNode._createLine(_sp0Pos, _position, 0);
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_2");
                        var _sp2Pos = _sceneManager._certainMesh.position;
                        _sp2Pos = [_sp2Pos.x, _sp2Pos.y, _sp2Pos.z];
                        this._currNode._createLine(_sp2Pos, _position, 1);
                    }else if(this._currSp.name === "MeasurePoint_2"){
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_1");
                        var _sp1Pos = _sceneManager._certainMesh.position;
                        _sp1Pos = [_sp1Pos.x, _sp1Pos.y, _sp1Pos.z];
                        this._currNode._createLine(_sp1Pos, _position, 1);
                    }
                }
            }
        }
    },

    _mouseMove:function(_x, _y){
        if(!window._modifyAngleOn){//测量角度
            if(this._isMeasuring && this._currNode){//正在测量角度
                var _raycaster = undefined;
                if(window._boxClipOn && window._clipHide){
                    _raycaster = this._rayCastClip(_x, _y);
                }else if(!window._boxClipOn || (window._boxClipOn && !window._clipHide)){
                    _raycaster = this._rayCast(_x, _y);
                }
                if(this._currNode._getPointNum() === 1){//只有一个点
                    var _sceneManager = new THREE._SceneManager();
                    _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_0");
                    var _lastPos = _sceneManager._certainMesh.position;
                    _lastPos = [_lastPos.x, _lastPos.y, _lastPos.z];
                    var _modelMeshes = _sceneManager._getMeshesFromCertainGroup(window._scene, "");
                    var _intersects = _raycaster.intersectObjects(_modelMeshes);
                    if(_intersects.length > 0){
                        var _intersect = _intersects[0];
                        var _position = [_intersect.point.x, _intersect.point.y, _intersect.point.z];
                        this._currNode._createLine(_lastPos, _position, 0);
                    }
                }else if(this._currNode._getPointNum() === 2){//已经两个点
                    var _sceneManager = new THREE._SceneManager();
                    _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_1");
                    var _lastPos = _sceneManager._certainMesh.position;
                    _lastPos = [_lastPos.x, _lastPos.y, _lastPos.z];
                    var _modelMeshes = _sceneManager._getMeshesFromCertainGroup(window._scene, "");
                    var _intersects = _raycaster.intersectObjects(_modelMeshes);
                    if (_intersects.length > 0){
                        var _intersect = _intersects[0];
                        var _position = [_intersect.point.x, _intersect.point.y, _intersect.point.z];
                        this._currNode._createLine(_lastPos, _position, 1);
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_0");
                        var _sp0Pos = _sceneManager._certainMesh.position;
                        _sp0Pos = [_sp0Pos.x, _sp0Pos.y, _sp0Pos.z];
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_1");
                        var _sp1Pos = _sceneManager._certainMesh.position;
                        _sp1Pos = [_sp1Pos.x, _sp1Pos.y, _sp1Pos.z];
                        this._updateText(_sp0Pos, _sp1Pos, _position);
                    }
                }
            }
        }else if(window._modifyAngleOn){
            if(this._isModifying && this._currNode && this._currSp){
                var _raycaster = undefined;
                if(window._boxClipOn && window._clipHide){
                    _raycaster = this._rayCastClip(_x, _y);
                }else if(!window._boxClipOn || (window._boxClipOn && !window._clipHide)){
                    _raycaster = this._rayCast(_x, _y);
                }
                var _sceneManager = new THREE._SceneManager();
                var _modelMeshes = _sceneManager._getMeshesFromCertainGroup(window._scene, "");
                var _intersects = _raycaster.intersectObjects(_modelMeshes);
                if (_intersects.length > 0){
                    var _intersect = _intersects[0];
                    var _position = [_intersect.point.x, _intersect.point.y, _intersect.point.z];
                    this._currSp.position.set(_position[0], _position[1], _position[2]);
                    if(this._currSp.name === "MeasurePoint_0"){
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_1");
                        var _sp1Pos = _sceneManager._certainMesh.position;
                        _sp1Pos = [_sp1Pos.x, _sp1Pos.y, _sp1Pos.z];
                        this._currNode._createLine(_sp1Pos, _position, 0);
                    }else if(this._currSp.name === "MeasurePoint_1"){
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_0");
                        var _sp0Pos = _sceneManager._certainMesh.position;
                        _sp0Pos = [_sp0Pos.x, _sp0Pos.y, _sp0Pos.z];
                        this._currNode._createLine(_sp0Pos, _position, 0);
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_2");
                        var _sp2Pos = _sceneManager._certainMesh.position;
                        _sp2Pos = [_sp2Pos.x, _sp2Pos.y, _sp2Pos.z];
                        this._currNode._createLine(_sp2Pos, _position, 1);
                    }else if(this._currSp.name === "MeasurePoint_2"){
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_1");
                        var _sp1Pos = _sceneManager._certainMesh.position;
                        _sp1Pos = [_sp1Pos.x, _sp1Pos.y, _sp1Pos.z];
                        this._currNode._createLine(_sp1Pos, _position, 1);
                    }
                    _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_0");
                    var _sp0Pos = _sceneManager._certainMesh.position;
                    _sp0Pos = [_sp0Pos.x, _sp0Pos.y, _sp0Pos.z];
                    _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_1");
                    var _sp1Pos = _sceneManager._certainMesh.position;
                    _sp1Pos = [_sp1Pos.x, _sp1Pos.y, _sp1Pos.z];
                    _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_2");
                    var _sp2Pos = _sceneManager._certainMesh.position;
                    _sp2Pos = [_sp2Pos.x, _sp2Pos.y, _sp2Pos.z];
                    this._updateText(_sp0Pos, _sp1Pos, _sp2Pos);
                }
            }
        }
    },

    //相机射线
    _rayCast:function(_x, _y){
        var _mouse = new THREE.Vector2();
        var _raycaster = new THREE.Raycaster();
        _mouse.x = (_x / window._canvasWidth) * 2 - 1;
        _mouse.y = - (_y / window._canvasHeight) * 2 + 1;
        _raycaster.setFromCamera(_mouse, window._camera);
        return _raycaster;
    },

    //剖切盒射线
    _rayCastClip:function(_x, _y){
        var _raycasterModel = undefined;
        var _mouse = new THREE.Vector2();
        var _raycaster = new THREE.Raycaster();
        _mouse.x = (_x / window._canvasWidth) * 2 - 1;
        _mouse.y = - (_y / window._canvasHeight) * 2 + 1;
        _raycaster.setFromCamera(_mouse, window._camera);
        //交剖切盒
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainGroup(window._scene, "BoxClipGroup");
        var _boxClipGroup = _sceneManager._certainGroup;
        if(_boxClipGroup) {
            _sceneManager._findMeshes(_boxClipGroup);
            var _planes = _sceneManager._meshes;
            var _intersects = _raycaster.intersectObjects(_planes);
            if (_intersects.length > 0) {
                var _origin = new THREE.Vector3(_intersects[0].point.x, _intersects[0].point.y, _intersects[0].point.z);
                var _direction = _raycaster.ray.direction;
                _raycasterModel = new THREE.Raycaster(_origin, _direction);
            }
        }
        return _raycasterModel;
    },

    //创建文字
    _createText:function(_p0, _p1, _p2){
        var _textDiv = new THREE._TextDiv();
        var _screenXY = _textDiv._getScreenXY(this._currNode._obj, window._camera, window._canvasWidth, window._canvasHeight);
        var _angle = this._computeAngle(_p0, _p1, _p2);
        _textDiv._createPop(_screenXY, this._currNode._obj.name, document, _angle);
    },

    //更新文字
    _updateText:function(_p0, _p1, _p2){
        var _textDiv = new THREE._TextDiv();
        var _screenXY = _textDiv._getScreenXY(this._currNode._obj, window._camera, window._canvasWidth, window._canvasHeight);
        var _angle = this._computeAngle(_p0, _p1, _p2);
        _textDiv._updatePop(_screenXY, this._currNode._obj.name, document, _angle);
    },

    //计算角度
    _computeAngle:function(_p0, _p1, _p2){
        var _angle = 0;
        var _v1 = [0, 0, 0];
        THREE._Vector3._sub(_v1, _p0, _p1);
        var _v2 = [0, 0, 0];
        THREE._Vector3._sub(_v2, _p2, _p1);
        _angle = THREE._Vector3._angle(_v1, _v2);
        _angle = _angle / Math.PI * 180;
        return _angle;
    }
});

window._measureAngleOn = false;
window._modifyAngleOn = false;
window._measureAngle = undefined;

document.getElementById('measure-btn2').addEventListener('click', function(){
    if(window._modifyAngleOn){
        if(window._measureAngle){
            if(window._measureAngle._isModifying){
                alert("正在修改不能测量");
            }else{
                window._modifyAngleOn = false;
                window._measureAngle._isModifying = false;
                document.getElementById('modify-measure-btn2').setAttribute('style', 'left:400px;');
                if(!window._measureAngleOn){
                    window._measureAngleOn = true;
                    document.getElementById('measure-btn2').setAttribute('style', 'left:300px; background-color:#ffff00;');
                    if(window._measureAngle === undefined){
                        window._measureAngle = new THREE._MeasureAngle();
                        window._measureAngle._init();
                    }
                }else{
                    window._measureAngleOn = false;
                    document.getElementById('measure-btn2').setAttribute('style', 'left:300px;');
                }
            }
        }
    }else{
        if(!window._measureAngleOn){
            window._measureAngleOn = true;
            document.getElementById('measure-btn2').setAttribute('style', 'left:300px; background-color:#ffff00;');
            if(window._measureAngle === undefined){
                window._measureAngle = new THREE._MeasureAngle();
                window._measureAngle._init();
            }
        }else{
            window._measureAngleOn = false;
            document.getElementById('measure-btn2').setAttribute('style', 'left:300px;');
        }
    }
}, false);

document.getElementById('modify-measure-btn2').addEventListener('click', function(){
    if(window._measureAngleOn){
        if(window._measureAngle){
            if(window._measureAngle._isMeasuring){
                alert("正在测量不能修改");
            }else{
                window._measureAngleOn = false;
                window._measureAngle._isMeasuring = false;
                document.getElementById('measure-btn2').setAttribute('style', 'left:300px;');
                window._modifyAngleOn = true;
                document.getElementById('modify-measure-btn2').setAttribute('style', 'left:400px; background-color:#ffff00;');
            }
        }
    }else if(!window._measureAngleOn){
        if(window._measureAngle){
            window._measureAngle._isMeasuring = false;
        }
        document.getElementById('measure-btn2').setAttribute('style', 'left:300px;');
        if(!window._modifyAngleOn){
            window._modifyAngleOn = true;
            document.getElementById('modify-measure-btn2').setAttribute('style', 'left:400px; background-color:#ffff00;');
        }else{
            window._modifyAngleOn = false;
            document.getElementById('modify-measure-btn2').setAttribute('style', 'left:400px;');
        }
    }
}, false);

document.getElementById('destroy-measure-btn2').addEventListener('click', function(){
    window._measureAngleOn = false;
    window._modifyAngleOn = false;
    if(window._measureAngle){
        window._measureAngle._isMeasuring = false;
        window._measureAngle._isModifying = false;
        window._measureAngle._destroy();
    }
    window._measureAngle = undefined;
    document.getElementById('measure-btn2').setAttribute('style', 'left:300px;');
    document.getElementById('modify-measure-btn2').setAttribute('style', 'left:400px;');
}, false);

document.getElementById('canvas').addEventListener('mousedown', function(event){
    if(event.button === 0){
        if(window._measureAngleOn || window._modifyAngleOn){
            if(window._measureAngle){
                window._measureAngle._mouseDown(event.offsetX, event.offsetY);
            }
        }
    }
}, false);

document.getElementById('canvas').addEventListener('mousemove', function(event){
    if(event.button === 0){
        if(window._measureAngleOn || window._modifyAngleOn){
            if(window._measureAngle){
                window._measureAngle._mouseMove(event.offsetX, event.offsetY);
            }
        }
    }
}, false);