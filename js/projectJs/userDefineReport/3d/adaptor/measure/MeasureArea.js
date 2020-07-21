THREE._MeasureArea = function(){
    this._objList = undefined;
    this._isMeasuring = false;
    this._isModifying = false;
    this._currNode = undefined;
    this._currSp = undefined;
};

Object.assign(THREE._MeasureArea.prototype, {
    _init:function(){
        this._objList = new THREE.Group();
        this._objList.name = "MeasureAreaGroup";
        window._scene.add(this._objList);
    },

    _destroy:function(){
        var _textDiv = new THREE._TextDiv();
        _textDiv._deleteTextOfMeasureAreaGroup();
        var _sceneManager = new THREE._SceneManager();
        if(window._scene.children.length > 0){
            for(var i = 0; i < window._scene.children.length; i++){
                if(window._scene.children[i].name === "MeasureAreaGroup"){
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

    //鼠标mousedown
    _mouseDown:function(_x, _y){
        if(!window._modifyAreaOn){
            if(!this._isMeasuring){
                var _raycaster = undefined;
                if(window._boxClipOn && window._clipHide){
                    _raycaster = this._rayCastClip(_x, _y);
                }else if(!window._boxClipOn || (window._boxClipOn && !window._clipHide)){
                    _raycaster = this._rayCast(_x, _y);
                }
                if(_raycaster){
                    var _sceneManager = new THREE._SceneManager();
                    var _modelMeshes = _sceneManager._getMeshesFromCertainGroup(window._scene, "");
                    var _intersects = _raycaster.intersectObjects(_modelMeshes);
                    //交到模型
                    if (_intersects.length > 0){
                        this._isMeasuring = true;
                        var _intersect = _intersects[0];
                        var _position = [_intersect.point.x, _intersect.point.y, _intersect.point.z];
                        this._currNode = new THREE._MeasureNode();
                        this._currNode._setName("MeasureAreaNode_"+this._objList.children.length);
                        this._currNode._createPoint(_position, 0);
                        this._objList.add(this._currNode._obj);
                    }
                }
            }else if(this._isMeasuring){
                var _raycaster = undefined;
                if(window._boxClipOn && window._clipHide){
                    _raycaster = this._rayCastClip(_x, _y);
                }else if(!window._boxClipOn || (window._boxClipOn && !window._clipHide)){
                    _raycaster = this._rayCast(_x, _y);
                }
                if(_raycaster){
                    var _sceneManager = new THREE._SceneManager();
                    var _modelMeshes = _sceneManager._getMeshesFromCertainGroup(window._scene, "");
                    var _intersects = _raycaster.intersectObjects(_modelMeshes);
                    //交到模型
                    if (_intersects.length > 0){
                        var _intersect = _intersects[0];
                        var _position = [_intersect.point.x, _intersect.point.y, _intersect.point.z];
                        if(this._absorb(_position)){
                            this._isMeasuring = false;
                            if(this._currNode._getPointNum() >= 3){
                                //创建文字
                                this._createText();
                            }
                        }else if(!this._absorb(_position)){
                            this._currNode._createPoint(_position, this._currNode._getPointNum());
                        }
                    }
                }
            }
        }else if(window._modifyAreaOn){
            if(!this._isModifying){
                var _raycaster = undefined;
                if(window._boxClipOn && window._clipHide){
                    _raycaster = this._rayCastClip(_x, _y);
                }else if(!window._boxClipOn || (window._boxClipOn && !window._clipHide)){
                    _raycaster = this._rayCast(_x, _y);
                }
                var _sceneManager = new THREE._SceneManager();
                var _measureMeshes = _sceneManager._getMeshesFromCertainGroup(window._scene, "MeasureAreaGroup");
                var _intersects = _raycaster.intersectObjects(_measureMeshes);
                //交到模型
                if (_intersects.length > 0){
                    this._isModifying = true;
                    var _intersect = _intersects[0];
                    var _spName = _intersect.object.name;
                    var _parentName = _intersect.object.parent.name;
                    this._currNode = new THREE._MeasureNode();
                    this._currSp = undefined;
                    var _sceneManager = new THREE._SceneManager();
                    _sceneManager._findCertainGroup(this._objList, _parentName);
                    this._currNode._obj = _sceneManager._certainGroup;
                    _sceneManager._findCertainMesh(this._currNode._obj, _spName);
                    this._currSp = _sceneManager._certainMesh;
                }
            }else if(this._isModifying && this._currNode && this._currSp){
                var _raycaster = undefined;
                if(window._boxClipOn && window._clipHide){
                    _raycaster = this._rayCastClip(_x, _y);
                }else if(!window._boxClipOn || (window._boxClipOn && !window._clipHide)){
                    _raycaster = this._rayCast(_x, _y);
                }
                var _sceneManager = new THREE._SceneManager();
                var _modelMeshes = _sceneManager._getMeshesFromCertainGroup(window._scene, "");
                var _intersects = _raycaster.intersectObjects(_modelMeshes);
                //交到模型
                if (_intersects.length > 0){
                    this._isModifying = false;
                    var _intersect = _intersects[0];
                    var _position = [_intersect.point.x, _intersect.point.y, _intersect.point.z];
                    //重新画点
                    this._currSp.position.set(_position[0], _position[1], _position[2]);
                    //重新画线
                    var _spIndex = this._currSp.name.substring(13).trim() - 0;
                    var _spLast = this._currNode._getPointNum() - 1;
                    if(_spIndex === 0){
                        //重画第n-1条线
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_"+_spLast);
                        var _p0 = [_sceneManager._certainMesh.position.x, _sceneManager._certainMesh.position.y, _sceneManager._certainMesh.position.z];
                        this._currNode._createLine(_p0, _position, _spLast);
                        //重画第0条线
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_"+1);
                        _p0 = [_sceneManager._certainMesh.position.x, _sceneManager._certainMesh.position.y, _sceneManager._certainMesh.position.z];
                        this._currNode._createLine(_p0, _position, 0);
                    }else if(_spIndex > 0){
                        //重画第spIndex-1条线
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_"+(_spIndex-1));
                        var _p0 = [_sceneManager._certainMesh.position.x, _sceneManager._certainMesh.position.y, _sceneManager._certainMesh.position.z];
                        this._currNode._createLine(_p0, _position, _spIndex-1);
                        //重画第spIndex条线
                        if(_spIndex === _spLast){
                            _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_"+0);
                        }else if(_spIndex < _spLast){
                            _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_"+(_spIndex+1));
                        }
                        _p0 = [_sceneManager._certainMesh.position.x, _sceneManager._certainMesh.position.y, _sceneManager._certainMesh.position.z];
                        this._currNode._createLine(_p0, _position, _spIndex);
                    }
                }
            }
        }
    },

    //鼠标mousemove
    _mouseMove:function(_x, _y){
        if(!window._modifyAreaOn){
            if(this._isMeasuring && this._currNode){
                var _raycaster = undefined;
                if(window._boxClipOn && window._clipHide){
                    _raycaster = this._rayCastClip(_x, _y);
                }else if(!window.boxClipOn || (window.boxClipOn && !window.clipHide)){
                    _raycaster = this._rayCast(_x, _y);
                }
                var _sceneManager = new THREE._SceneManager();
                var _spLast = this._currNode._getPointNum() - 1;
                _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_"+_spLast);
                var _lastPos = _sceneManager._certainMesh.position;
                _lastPos = [_lastPos.x, _lastPos.y, _lastPos.z];
                //交模型mesh列表
                var _modelMeshes = _sceneManager._getMeshesFromCertainGroup(window._scene, "");
                var _intersects = _raycaster.intersectObjects(_modelMeshes);
                //交到模型
                if (_intersects.length > 0){
                    var _intersect = _intersects[0];
                    var _position = [_intersect.point.x, _intersect.point.y, _intersect.point.z];
                    if(this._absorb(_position)){
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_0");
                        _position = _sceneManager._certainMesh.position;
                        _position = [_position.x, _position.y, _position.z];
                    }
                    //画线
                    this._currNode._createLine(_lastPos, _position, _spLast);
                }
            }
        }else if(window._modifyAreaOn){
            if(this._isModifying && this._currNode && this._currSp){
                var _raycaster = undefined;
                if(window._boxClipOn && window._clipHide){
                    _raycaster = this._rayCastClip(_x, _y);
                }else if(!window._boxClipOn || (window._boxClipOn && !window._clipHide)){
                    _raycaster = this._rayCast(_x, _y);
                }
                //交模型mesh列表
                var _sceneManager = new THREE._SceneManager();
                var _modelMeshes = _sceneManager._getMeshesFromCertainGroup(window._scene, "");
                var _intersects = _raycaster.intersectObjects(_modelMeshes);
                if (_intersects.length > 0){//交到模型
                    var _intersect = _intersects[0];
                    var _position = [_intersect.point.x, _intersect.point.y, _intersect.point.z];
                    this._currSp.position.set(_position[0], _position[1], _position[2]);
                    var _spIndex = this._currSp.name.substring(13).trim() - 0;
                    var _spLast = this._currNode._getPointNum() - 1;
                    if(_spIndex === 0){
                        //重画第n-1条线
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_"+_spLast);
                        var _p0 = [_sceneManager._certainMesh.position.x, _sceneManager._certainMesh.position.y, _sceneManager._certainMesh.position.z];
                        this._currNode._createLine(_p0, _position, _spLast);
                        //重画第0条线
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_"+1);
                        _p0 = [_sceneManager._certainMesh.position.x, _sceneManager._certainMesh.position.y, _sceneManager._certainMesh.position.z];
                        this._currNode._createLine(_p0, _position, 0);
                    }else if(_spIndex > 0){
                        //重画第spIndex-1条线
                        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_"+(_spIndex-1));
                        var _p0 = [_sceneManager._certainMesh.position.x, _sceneManager._certainMesh.position.y, _sceneManager._certainMesh.position.z];
                        this._currNode._createLine(_p0, _position, _spIndex-1);
                        //重画第spIndex条线
                        if(_spIndex === _spLast){
                            _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_"+0);
                        }else if(_spIndex < _spLast){
                            _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_"+(_spIndex+1));
                        }
                        _p0 = [_sceneManager._certainMesh.position.x, _sceneManager._certainMesh.position.y, _sceneManager._certainMesh.position.z];
                        this._currNode._createLine(_p0, _position, _spIndex);
                    }
                }
                this._updateText();
            }
        }
    },

    _rayCast:function(_x, _y){
        var _mouse = new THREE.Vector2();
        var _raycaster = new THREE.Raycaster();
        _mouse.x = (_x / window._canvasWidth) * 2 - 1;
        _mouse.y = - (_y / window._canvasHeight) * 2 + 1;
        _raycaster.setFromCamera(_mouse, window._camera);
        return _raycaster;
    },

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

    _createText:function(){
        var _textDiv = new THREE._TextDiv();
        var _screenXY = _textDiv._getScreenXY(this._currNode._obj, window._camera, window._canvasWidth, window._canvasHeight);
        //计算面积
        var _spList = [];
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findMeshes(this._currNode._obj);
        _spList = _sceneManager._meshes;
        var _area = this._computeArea(_spList);
        _textDiv._createPop(_screenXY, this._currNode._obj.name, document, _area);
    },

    //更新文字
    _updateText:function(){
        var _textDiv = new THREE._TextDiv();
        var _screenXY = _textDiv._getScreenXY(this._currNode._obj, window._camera, window._canvasWidth, window._canvasHeight);
        //计算面积
        var _spList = [];
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findMeshes(this._currNode._obj);
        _spList = _sceneManager._meshes;
        var _area = this._computeArea(_spList);
        _textDiv._updatePop(_screenXY, this._currNode._obj.name, document, _area);
    },

    //计算面积
    _computeArea:function(_spList){
        var _area = 0;
        for(var i=0; i<_spList.length - 2; i++){
            var _p0 = [_spList[0].position.x, _spList[0].position.y, _spList[0].position.z];
            var _p1 = [_spList[i+1].position.x, _spList[i+1].position.y, _spList[i+1].position.z];
            var _p2 = [_spList[i+2].position.x, _spList[i+2].position.y, _spList[i+2].position.z];
            var _vec1 = THREE._Vector3._new();
            THREE._Vector3._sub(_vec1, _p1, _p0);
            var _vec2 = THREE._Vector3._new();
            THREE._Vector3._sub(_vec2, _p2, _p0);
            var _out = THREE._Vector3._new();
            THREE._Vector3._cross(_out, _vec1, _vec2);
            var _length = THREE._Vector3._len(_out);
            _area += _length/2;
        }
        return _area;
    },

    //吸附判断
    _absorb:function(_position){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainMesh(this._currNode._obj, "MeasurePoint_0");
        var _sp0Position = [_sceneManager._certainMesh.position.x, _sceneManager._certainMesh.position.y, _sceneManager._certainMesh.position.z];
        if(THREE._Vector3._dist(_sp0Position, _position) <= 10){
            return true;
        }else if(THREE._Vector3._dist(_sp0Position, _position) > 10){
            return false;
        }
    }
});

window._measureAreaOn = false;
window._modifyAreaOn = false;
window._measureArea = undefined;

document.getElementById('measure-btn3').addEventListener('click', function(){
    if(window._modifyAreaOn){
        if(window._measureArea){
            if(window._measureArea._isModifying){
                alert("正在修改不能测量");
            }else{
                window._modifyAreaOn = false;
                window._measureArea._isModifying = false;
                document.getElementById('modify-measure-btn3').setAttribute('style', 'left:700px;');
                if(!window._measureAreaOn){
                    window._measureAreaOn = true;
                    document.getElementById('measure-btn3').setAttribute('style', 'left:600px; background-color:#ffff00;');
                    if(window._measureArea === undefined){
                        window._measureArea = new THREE._MeasureArea();
                        window._measureArea._init();
                    }
                }else{
                    window._measureAreaOn = false;
                    document.getElementById('measure-btn3').setAttribute('style', 'left:600px;');
                }
            }
        }
    }else{
        if(!window._measureAreaOn){
            window._measureAreaOn = true;
            document.getElementById('measure-btn3').setAttribute('style', 'left:600px; background-color:#ffff00;');
            if(window._measureArea === undefined){
                window._measureArea = new THREE._MeasureArea();
                window._measureArea._init();
            }
        }else{
            window._measureAreaOn = false;
            document.getElementById('measure-btn3').setAttribute('style', 'left:600px;');
        }
    }
}, false);

document.getElementById('modify-measure-btn3').addEventListener('click', function(){
    if(window._measureAreaOn){
        if(window._measureArea._isMeasuring){
            alert("正在测量不能修改");
        }else{
            window._measureAreaOn = false;
            window._measureArea._isMeasuring = false;
            document.getElementById('measure-btn3').setAttribute('style', 'left:600px;');
            window._modifyAreaOn = true;
            document.getElementById('modify-measure-btn3').setAttribute('style', 'left:700px; background-color:#ffff00;');
        }
    }else{
        if(window._measureArea){
            window._measureArea._isMeasuring = false;
        }
        document.getElementById('measure-btn3').setAttribute('style', 'left:600px;');
        if(!window._modifyAreaOn){
            window._modifyAreaOn = true;
            document.getElementById('modify-measure-btn3').setAttribute('style', 'left:700px; background-color:#ffff00;');
        }else{
            window._modifyAreaOn = false;
            document.getElementById('modify-measure-btn3').setAttribute('style', 'left:700px;');
        }
    }
}, false);

document.getElementById('destroy-measure-btn3').addEventListener('click', function(){
    window._measureAreaOn = false;
    window._modifyAreaOn = false;
    if(window._measureArea){
        window._measureArea._isMeasuring = false;
        window._measureArea._isModifying = false;
        window._measureArea._destroy();
    }
    window._measureArea = undefined;
    document.getElementById('measure-btn3').setAttribute('style', 'left:600px;');
    document.getElementById('modify-measure-btn3').setAttribute('style', 'left:700px;');
}, false);

document.getElementById('canvas').addEventListener('mousedown', function(event){
    if(event.button === 0){
        if(window._measureAreaOn || window._modifyAreaOn){
            if(window._measureArea){
                window._measureArea._mouseDown(event.offsetX, event.offsetY);
            }
        }
    }
}, false);

document.getElementById('canvas').addEventListener('mousemove', function(event){
    if(event.button === 0){
        if(window._measureAreaOn || window._modifyAreaOn){
            if(window._measureArea){
                window._measureArea._mouseMove(event.offsetX, event.offsetY);
            }
        }
    }
}, false);