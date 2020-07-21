THREE._SquarePick = function(){
    this._squareObj = undefined;
    this._startPos = [0, 0];
    this._endPos = [0, 0];
    this._isPicking = false;
};

Object.assign(THREE._SquarePick.prototype, {
    //销毁框
    _deleteSquare:function(){
        if(this._squareObj){
            var _sceneManager = new THREE._SceneManager();
            _sceneManager._clearNode(this._squareObj);
            _sceneManager._deleteNode(window._scene, this._squareObj.name);
            this._squareObj = undefined;
        }
    },

    //创建框
    _createSquare:function(_x0, _y0, _x1, _y1){
        this._squareObj = new THREE.Group();
        this._squareObj.name = "squareGroup";
        var _cameraManager = new THREE._CameraManager();
        //将x0,y0,0.00001屏幕坐标转换成世界坐标
        var _p0 = _cameraManager._convertScreenCoordToWorldPosition(window._camera, [_x0, _y0, 0.00001], window._canvasWidth, window._canvasHeight);
        //将x0,y1,0.00001屏幕坐标转换成世界坐标
        var _p1 = _cameraManager._convertScreenCoordToWorldPosition(window._camera, [_x0, _y1, 0.00001], window._canvasWidth, window._canvasHeight);
        //将x1,y0,0.00001屏幕坐标转换成世界坐标
        var _p2 = _cameraManager._convertScreenCoordToWorldPosition(window._camera, [_x1, _y0, 0.00001], window._canvasWidth, window._canvasHeight);
        //将x1,y1,0.00001屏幕坐标转换成世界坐标
        var _p3 = _cameraManager._convertScreenCoordToWorldPosition(window._camera, [_x1, _y1, 0.00001], window._canvasWidth, window._canvasHeight);
        //左侧线
        this._createLine(_p0, _p1);
        //右侧线
        this._createLine(_p2, _p3);
        //上侧线
        this._createLine(_p0, _p2);
        //下侧线
        this._createLine(_p1, _p3);
        window._scene.add(this._squareObj);
    },

    //更新框
    _updateSquare:function(_x0, _y0, _x1, _y1){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._clearNode(this._squareObj);
        var _cameraManager = new THREE._CameraManager();
        //将x0,y0,0.00001屏幕坐标转换成世界坐标
        var _p0 = _cameraManager._convertScreenCoordToWorldPosition(window._camera, [_x0, _y0, 0.00001], window._canvasWidth, window._canvasHeight);
        //将x0,y1,0.00001屏幕坐标转换成世界坐标
        var _p1 = _cameraManager._convertScreenCoordToWorldPosition(window._camera, [_x0, _y1, 0.00001], window._canvasWidth, window._canvasHeight);
        //将x1,y0,0.00001屏幕坐标转换成世界坐标
        var _p2 = _cameraManager._convertScreenCoordToWorldPosition(window._camera, [_x1, _y0, 0.00001], window._canvasWidth, window._canvasHeight);
        //将x1,y1,0.00001屏幕坐标转换成世界坐标
        var _p3 = _cameraManager._convertScreenCoordToWorldPosition(window._camera, [_x1, _y1, 0.00001], window._canvasWidth, window._canvasHeight);
        //左侧线
        this._createLine(_p0, _p1);
        //右侧线
        this._createLine(_p2, _p3);
        //上侧线
        this._createLine(_p0, _p2);
        //下侧线
        this._createLine(_p1, _p3);
    },

    //画线
    _createLine:function(_p0, _p1){
        var _start = new THREE.Vector3(_p0[0], _p0[1], _p0[2]);
        var _end = new THREE.Vector3(_p1[0], _p1[1], _p1[2]);
        var _lineGeo = new THREE.Geometry();
        _lineGeo.vertices.push(_start, _end);
        var _lineMtl = new THREE.LineBasicMaterial({
            color:0xffff00
        });
        var _line = new THREE.Line(_lineGeo, _lineMtl);
        this._squareObj.add(_line);
    },

    //鼠标键落
    _mouseDown:function(_x, _y){
        this._startPos = [_x, _y];
        //初始框
        var _x0 = this._startPos[0];
        var _y0 = this._startPos[1];
        var _x1 = this._startPos[0];
        var _y1 = this._startPos[1];
        this._createSquare(_x0, _y0, _x1, _y1);
        this._isPicking = true;
    },

    //鼠标移动
    _mouseMove:function(_x, _y){
        if(this._isPicking){
            this._endPos = [_x, _y];
            var _x0 = this._startPos[0];
            var _y0 = this._startPos[1];
            var _x1 = this._endPos[0];
            var _y1 = this._endPos[1];
            //更新框
            this._updateSquare(_x0, _y0, _x1, _y1);
        }
    },

    //鼠标抬起
    _mouseUp:function(_x, _y){
        if(this._isPicking){
            this._isPicking = false;
            //销毁框
            this._deleteSquare();
            //判断哪些mesh在框范围内
            var _targetList = [];
            var _sceneManager = new THREE._SceneManager();
            if(window._pick._pickTarget === "MeshGroup"){
                _sceneManager._findCertainNode(window._scene, "ModelGroup");
                var _modelGroup = _sceneManager._certainNode;
                for(var i=0; i<_modelGroup.children.length; i++){
                    _sceneManager._findCertainNode(_modelGroup.children[i], "MeshGroup");
                    var _meshGroup = _sceneManager._certainNode;
                    var _meshList = _sceneManager._getMeshesFromCertainNode(_meshGroup);
                    for(var j=0; j<_meshList.length; j++){
                        _targetList.push(_meshList[j]);
                    }
                }
            }else if(window._pick._pickTarget === "SpecialPointGroup"){
                _sceneManager._findCertainNode(window._scene, "ModelGroup");
                var _modelGroup = _sceneManager._certainNode;
                for(var i=0; i<_modelGroup.children.length; i++){
                    _sceneManager._findCertainNode(_modelGroup.children[i], "SpecialPointGroup");
                    var _specialPointGroup = _sceneManager._certainNode;
                    var _specialPointList = _sceneManager._getMeshesFromCertainNode(_specialPointGroup);
                    for(var j=0; j<_specialPointList.length; j++){
                        _targetList.push(_specialPointList[j]);
                    }
                }
            }
            //框的AABB盒子
            var _squareBoundary = this._computeSquareBoundary(this._startPos, this._endPos);
            for(var i=0; i<_targetList.length; i++){
                //mesh包围盒屏幕投影坐标的AABB盒子
                var _meshBoundary = this._getScreenCoordOfObjectBoundary(_targetList[i]);
                if(this._boundaryAInBoundaryB(_meshBoundary, _squareBoundary)){
                    window._pick._pushPickedMesh(_targetList[i]);
                }
            }
            this._startPos = [0, 0];
            this._endPos = [0, 0];
            if(window._pick._callback instanceof Function){
                window._pick._callback(window._pick._pickedMeshes);
            }
        }
    },

    //计算mesh包围盒屏幕投影坐标的AABB盒子
    _getScreenCoordOfObjectBoundary:function(_node){
        var _sceneManager = new THREE._SceneManager();
        var _boundingBox = _sceneManager._getNodeBoundingBox(_node);
        var _x0 = _boundingBox.min.x;
        var _x1 = _boundingBox.max.x;
        var _y0 = _boundingBox.min.y;
        var _y1 = _boundingBox.max.y;
        var _z0 = _boundingBox.min.z;
        var _z1 = _boundingBox.max.z;
        var _p0 = THREE._Vector3._create(_x0, _y0, _z0);
        var _p1 = THREE._Vector3._create(_x0, _y1, _z0);
        var _p2 = THREE._Vector3._create(_x1, _y1, _z0);
        var _p3 = THREE._Vector3._create(_x1, _y0, _z0);
        var _p4 = THREE._Vector3._create(_x0, _y0, _z1);
        var _p5 = THREE._Vector3._create(_x0, _y1, _z1);
        var _p6 = THREE._Vector3._create(_x1, _y1, _z1);
        var _p7 = THREE._Vector3._create(_x1, _y0, _z1);
        var _cameraManager = new THREE._CameraManager();
        var _s0 = _cameraManager._convertWorldPositionToScreenCoord(window._camera, _p0, window._canvasWidth, window._canvasHeight);
        var _s1 = _cameraManager._convertWorldPositionToScreenCoord(window._camera, _p1, window._canvasWidth, window._canvasHeight);
        var _s2 = _cameraManager._convertWorldPositionToScreenCoord(window._camera, _p2, window._canvasWidth, window._canvasHeight);
        var _s3 = _cameraManager._convertWorldPositionToScreenCoord(window._camera, _p3, window._canvasWidth, window._canvasHeight);
        var _s4 = _cameraManager._convertWorldPositionToScreenCoord(window._camera, _p4, window._canvasWidth, window._canvasHeight);
        var _s5 = _cameraManager._convertWorldPositionToScreenCoord(window._camera, _p5, window._canvasWidth, window._canvasHeight);
        var _s6 = _cameraManager._convertWorldPositionToScreenCoord(window._camera, _p6, window._canvasWidth, window._canvasHeight);
        var _s7 = _cameraManager._convertWorldPositionToScreenCoord(window._camera, _p7, window._canvasWidth, window._canvasHeight);
        //AABB盒子
        var _xMin = _s0[0];
        var _xMax = _s0[0];
        var _yMin = _s0[1];
        var _yMax = _s0[1];
        //A-
        _xMin = _xMin <= _s1[0] ? _xMin : _s1[0];
        _xMin = _xMin <= _s2[0] ? _xMin : _s2[0];
        _xMin = _xMin <= _s3[0] ? _xMin : _s3[0];
        _xMin = _xMin <= _s4[0] ? _xMin : _s4[0];
        _xMin = _xMin <= _s5[0] ? _xMin : _s5[0];
        _xMin = _xMin <= _s6[0] ? _xMin : _s6[0];
        _xMin = _xMin <= _s7[0] ? _xMin : _s7[0];
        //A+
        _xMax = _xMax >= _s1[0] ? _xMax : _s1[0];
        _xMax = _xMax >= _s2[0] ? _xMax : _s2[0];
        _xMax = _xMax >= _s3[0] ? _xMax : _s3[0];
        _xMax = _xMax >= _s4[0] ? _xMax : _s4[0];
        _xMax = _xMax >= _s5[0] ? _xMax : _s5[0];
        _xMax = _xMax >= _s6[0] ? _xMax : _s6[0];
        _xMax = _xMax >= _s7[0] ? _xMax : _s7[0];
        //B-
        _yMin = _yMin <= _s1[1] ? _yMin : _s1[1];
        _yMin = _yMin <= _s2[1] ? _yMin : _s2[1];
        _yMin = _yMin <= _s3[1] ? _yMin : _s3[1];
        _yMin = _yMin <= _s4[1] ? _yMin : _s4[1];
        _yMin = _yMin <= _s5[1] ? _yMin : _s5[1];
        _yMin = _yMin <= _s6[1] ? _yMin : _s6[1];
        _yMin = _yMin <= _s7[1] ? _yMin : _s7[1];
        //B+
        _yMax = _yMax >= _s1[1] ? _yMax : _s1[1];
        _yMax = _yMax >= _s2[1] ? _yMax : _s2[1];
        _yMax = _yMax >= _s3[1] ? _yMax : _s3[1];
        _yMax = _yMax >= _s4[1] ? _yMax : _s4[1];
        _yMax = _yMax >= _s5[1] ? _yMax : _s5[1];
        _yMax = _yMax >= _s6[1] ? _yMax : _s6[1];
        _yMax = _yMax >= _s7[1] ? _yMax : _s7[1];
        //AABB盒子
        return [_xMin, _yMin, _xMax, _yMax];
    },

    //计算框AABB盒子
    _computeSquareBoundary:function(_startPos, _endPos){
        var _x0 = _startPos[0];
        var _y0 = _startPos[1];
        var _x1 = _endPos[0];
        var _y1 = _endPos[1];
        var _xMin = _x0 <= _x1 ? _x0 : _x1;
        var _xMax = _x0 >= _x1 ? _x0 : _x1;
        var _yMin = _y0 <= _y1 ? _y0 : _y1;
        var _yMax = _y0 >= _y1 ? _y0 : _y1;
        //AABB盒子
        return [_xMin, _yMin, _xMax, _yMax];
    },

    //判断A是否在B中
    _boundaryAInBoundaryB:function(_boundaryA, _boundaryB){
        var _inBox = false;
        if(_boundaryA[0] > _boundaryB[0] && _boundaryA[1] > _boundaryB[1]
            && _boundaryA[2] < _boundaryB[2] && _boundaryA[3] < _boundaryB[3]){
            _inBox = true;
        }
        return _inBox;
    }
});