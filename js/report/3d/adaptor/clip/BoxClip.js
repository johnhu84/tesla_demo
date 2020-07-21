THREE._BoxClip = function(){
    this._boxClipHelper = undefined;
    this._dragging = false;
    this._lastPos = [0, 0, 0];
};

Object.assign(THREE._BoxClip.prototype, {
    _init:function(){
        this._boxClipHelper = new THREE._BoxClipHelper();
        this._boxClipHelper._initBox();
        window._scene.add(this._boxClipHelper._obj);
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainGroup(window._scene, "ModelGroup");
        _sceneManager._enableClip(_sceneManager._certainGroup, [this._boxClipHelper._topPlane, this._boxClipHelper._bottomPlane, this._boxClipHelper._frontPlane, this._boxClipHelper._backPlane, this._boxClipHelper._leftPlane, this._boxClipHelper._rightPlane]);
        window._renderer.localClippingEnabled = true;
        window._renderer.render(window._scene, window._camera);
    },

    _destroy:function(){
        var _sceneManager = new THREE._SceneManager();
        this._boxClipHelper._destoryBox();
        _sceneManager._deleteNode(window._scene, this._boxClipHelper._obj.name);
        _sceneManager._findCertainGroup(window._scene, "ModelGroup");
        _sceneManager._disableClip(_sceneManager._certainGroup);
        window._renderer.localClippingEnabled = false;
        window._renderer.render(window._scene, window._camera);
    },

    _rayCast:function(_x, _y){
        var _mouse = new THREE.Vector2();
        var _rayCaster = new THREE.Raycaster();
        _mouse.x = (_x / window._canvasWidth) * 2 - 1;
        _mouse.y = - (_y / window._canvasHeight) * 2 + 1;
        _rayCaster.setFromCamera(_mouse, window._camera);
        return _rayCaster;
    },

    _getScaleRatio:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainGroup(window._scene, "ModelGroup");
        var _boundingBox = _sceneManager._getNodeBoundingBox(_sceneManager._certainGroup);
        var _xMax = _boundingBox.max.x;
        var _xMin = _boundingBox.min.x;
        var _yMax = _boundingBox.max.y;
        var _yMin = _boundingBox.min.y;
        var _zMax = _boundingBox.max.z;
        var _zMin = _boundingBox.min.z;
        var _scaleRatio = Math.sqrt(Math.pow((_xMax - _xMin), 2)
            + Math.pow((_yMax - _yMin), 2)
            + Math.pow((_zMax - _zMin), 2));
        _scaleRatio /= window._camera.far * 16;
        return _scaleRatio;
    },

    _mouseDown:function(_x, _y){
        var _rayCaster = this._rayCast(_x, _y);
        var _sceneManager = new THREE._SceneManager();
        var _modelMeshes = _sceneManager._getMeshesFromCertainGroup(window._scene, "BoxClipGroup");
        var _intersects = _rayCaster.intersectObjects(_modelMeshes);
        if (_intersects.length > 0){
            this._dragging = true;
            this._lastPos = [_x, _y, 0];
            this._boxClipHelper._planeUpdate = _intersects[0].object.name;
        }
    },

    _mouseMove:function(_x, _y){
        if(this._dragging){
            var _rayCaster = this._rayCast(_x, _y);
            var _sceneManager = new THREE._SceneManager();
            _sceneManager._findCertainMesh(this._boxClipHelper._obj, this._boxClipHelper._planeUpdate);
            var _planeMesh = _sceneManager._certainMesh;
            var _intersects = _rayCaster.intersectObject(_planeMesh);
            if(_intersects.length > 0){//交到剖面
                var _scaleRatio = this._getScaleRatio()*1000;
                var _currPos = [_x, _y, 0];
                if(this._boxClipHelper._planeUpdate === "BoxClipTopPlane"){
                    //将y轴向量投影到屏幕上
                    var _axisY = this._boxClipHelper._computeScreenYDir();
                    var _dragDir = THREE._Vector3._new();
                    THREE._Vector3._sub(_dragDir, _currPos, this._lastPos);
                    var _angle = THREE._Vector3._angle(_dragDir, _axisY);
                    var _distance = THREE._Vector3._len(_dragDir);
                    _distance *= Math.cos(_angle);
                    _distance *= _scaleRatio;
                    if(_distance < 0
                        && this._boxClipHelper._yMax - this._boxClipHelper._yMin + _distance <= 0){
                        this._dragging = false;
                        this._lastPos = [0, 0, 0];
                        this._boxClipHelper._planeUpdate = "";
                    }else{
                        this._boxClipHelper._updateBox(_distance);
                    }
                }else if(this._boxClipHelper._planeUpdate === "BoxClipBottomPlane"){
                    var _axisY = this._boxClipHelper._computeScreenYDir();
                    var _dragDir = THREE._Vector3._new();
                    THREE._Vector3._sub(_dragDir, _currPos, this._lastPos);
                    var _angle = THREE._Vector3._angle(_dragDir, _axisY);
                    var _distance = THREE._Vector3._len(_dragDir);
                    _distance *= Math.cos(_angle);
                    _distance *= _scaleRatio;
                    if(_distance > 0
                        && this._boxClipHelper._yMax - this._boxClipHelper._yMin - _distance <= 0){
                        this._dragging = false;
                        this._lastPos = [0, 0, 0];
                        this._boxClipHelper._planeUpdate = "";
                    }else{
                        this._boxClipHelper._updateBox(_distance);
                    }
                }else if(this._boxClipHelper._planeUpdate === "BoxClipFrontPlane"){
                    var _axisZ = this._boxClipHelper._computeScreenZDir();
                    var _dragDir = THREE._Vector3._new();
                    THREE._Vector3._sub(_dragDir, _currPos, this._lastPos);
                    var _angle = THREE._Vector3._angle(_dragDir, _axisZ);
                    var _distance = THREE._Vector3._len(_dragDir);
                    _distance *= Math.cos(_angle);
                    _distance *= _scaleRatio;
                    if(_distance < 0
                        && this._boxClipHelper._zMax - this._boxClipHelper._zMin + _distance <= 0){
                        this._dragging = false;
                        this._lastPos = [0, 0, 0];
                        this._boxClipHelper._planeUpdate = "";
                    }else{
                        this._boxClipHelper._updateBox(_distance);
                    }
                }else if(this._boxClipHelper._planeUpdate === "BoxClipBackPlane"){
                    var _axisZ = this._boxClipHelper._computeScreenZDir();
                    var _dragDir = THREE._Vector3._new();
                    THREE._Vector3._sub(_dragDir, _currPos, this._lastPos);
                    var _angle = THREE._Vector3._angle(_dragDir, _axisZ);
                    var _distance = THREE._Vector3._len(_dragDir);
                    _distance *= Math.cos(_angle);
                    _distance *= _scaleRatio;
                    if(_distance > 0
                        && this._boxClipHelper._zMax - this._boxClipHelper._zMin - _distance <= 0){
                        this._dragging = false;
                        this._lastPos = [0, 0, 0];
                        this._boxClipHelper._planeUpdate = "";
                    }else{
                        this._boxClipHelper._updateBox(_distance);
                    }
                }else if(this._boxClipHelper._planeUpdate === "BoxClipLeftPlane"){
                    var _axisX = this._boxClipHelper._computeScreenXDir();
                    var _dragDir = THREE._Vector3._new();
                    THREE._Vector3._sub(_dragDir, _currPos, this._lastPos);
                    var _angle = THREE._Vector3._angle(_dragDir, _axisX);
                    var _distance = THREE._Vector3._len(_dragDir);
                    _distance *= Math.cos(_angle);
                    _distance *= _scaleRatio;
                    if(_distance > 0
                        && this._boxClipHelper._xMax - this._boxClipHelper._xMin -_distance <= 0){
                        this._dragging = false;
                        this._lastPos = [0, 0, 0];
                        this._boxClipHelper._planeUpdate = "";
                    }else{
                        this._boxClipHelper._updateBox(_distance);
                    }
                }else if(this._boxClipHelper._planeUpdate === "BoxClipRightPlane"){
                    var _axisX = this._boxClipHelper._computeScreenXDir();
                    var _dragDir = THREE._Vector3._new();
                    THREE._Vector3._sub(_dragDir, _currPos, this._lastPos);
                    var _angle = THREE._Vector3._angle(_dragDir, _axisX);
                    var _distance = THREE._Vector3._len(_dragDir);
                    _distance *= Math.cos(_angle);
                    _distance *= _scaleRatio;
                    if(_distance < 0
                        && this._boxClipHelper._xMax - this._boxClipHelper._xMin + _distance <= 0){
                        this._dragging = false;
                        this._lastPos = [0, 0, 0];
                        this._boxClipHelper._planeUpdate = "";
                    }else{
                        this._boxClipHelper._updateBox(_distance);
                    }
                }
                this._lastPos = _currPos;
            }else{
                this._dragging = false;
                this._lastPos = [0, 0, 0];
                this._boxClipHelper._planeUpdate = "";
            }
        }
    },

    _mouseUp:function(_x, _y){
        this._dragging = false;
        this._lastPos = [0, 0, 0];
        this._boxClipHelper._planeUpdate = "";
    },

    _hide:function(){
        if(this._boxClipHelper){
            this._boxClipHelper._hidePlaneMesh();
        }
    },

    _show:function(){
        if(this._boxClipHelper){
            this._boxClipHelper._showPlaneMesh();
        }
    }
});