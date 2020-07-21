THREE._Navigator = function(){
    this._squareObj = undefined;
    this._startPos = [0, 0];
    this._endPos = [0, 0];
    this._isPicking = false;
};

Object.assign(THREE._Navigator.prototype, {
    //创建导航器
    _init:function(_scaleRatio, _navigatorViewPortWidth, _navigatorViewPortHeight,
                   _navigatorViewPortLeft, _navigatorViewPortBottom){
        var _navigatorHelper = new THREE._NavigatorHelper();
        _navigatorHelper._createNavigator(_scaleRatio, _navigatorViewPortWidth,
            _navigatorViewPortHeight, _navigatorViewPortLeft, _navigatorViewPortBottom);
    },

    //销毁导航器
    _destroy:function(){
        var _navigatorHelper = new THREE._NavigatorHelper();
        _navigatorHelper._deleteNavigator();
    },

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
            this._deleteSquare();
            var _squareCenter = this._computeSquareCenter(this._startPos, this._endPos);
            var _viewportTarget = this._computeViewportTarget(_squareCenter);
            var _viewportEyePos = this._computeViewportEyePos(_viewportTarget, this._startPos, this._endPos);
            this._startPos = [0, 0];
            this._endPos = [0, 0];
            var _controlManager = new THREE._ControlManager();
            var _viewportUp = _controlManager._getUp();
            this._setMainCamera(_viewportTarget, _viewportEyePos, _viewportUp);
            if(window._navigatorOn && window._navigatorCamera){
                var _navigatorHelper = new THREE._NavigatorHelper();
                _navigatorHelper._setView();
            }
        }
    },

    _computeSquareCenter:function(_startPos, _endPos){
        var _x0 = _startPos[0];
        var _y0 = _startPos[1];
        var _x1 = _endPos[0];
        var _y1 = _endPos[1];
        var _xMin = _x0 <= _x1 ? _x0 : _x1;
        var _xMax = _x0 >= _x1 ? _x0 : _x1;
        var _yMin = _y0 <= _y1 ? _y0 : _y1;
        var _yMax = _y0 >= _y1 ? _y0 : _y1;
        //AABB盒子
        var _x = (_xMin + _xMax) * 0.5;
        var _y = (_yMin + _yMax) * 0.5;
        return [_x, _y];
    },

    _computeViewportTarget:function(_squareCenter){
        var _controlManager = new THREE._ControlManager();
        var _target = _controlManager._getTarget();
        var _cameraManager = new THREE._CameraManager();
        var _depth = _cameraManager._convertWorldPositionToScreenCoord(window._camera, _target, window._canvasWidth, window._canvasHeight)[2];
        return _cameraManager._convertScreenCoordToWorldPosition(window._camera, [_squareCenter[0], _squareCenter[1], _depth], window._canvasWidth, window._canvasHeight);
    },

    _computeViewportEyePos:function(_viewportTarget, _startPos, _endPos){
        var _controlManager = new THREE._ControlManager();
        var _target = _controlManager._getTarget();
        var _eyePos = _controlManager._getEyePosition();
        var _planeNormal = THREE._Vector3._new();
        THREE._Vector3._sub(_planeNormal, _eyePos, _target);
        THREE._Vector3._normalize(_planeNormal, _planeNormal);
        var _dist = THREE._Vector3._dist(_eyePos, _target);
        var _scaleRatio = this._computeScaleRatio(_startPos, _endPos);
        var _dir = THREE._Vector3._new();
        THREE._Vector3._scale(_dir, _planeNormal, _dist * _scaleRatio * 1.6);
        var _viewportEyePos = THREE._Vector3._new();
        THREE._Vector3._add(_viewportEyePos, _viewportTarget, _dir);
        return _viewportEyePos;
    },

    _computeScaleRatio:function(_startPos, _endPos){
        var _x0 = _startPos[0];
        var _y0 = _startPos[1];
        var _x1 = _endPos[0];
        var _y1 = _endPos[1];
        var _xMin = _x0 <= _x1 ? _x0 : _x1;
        var _xMax = _x0 >= _x1 ? _x0 : _x1;
        var _yMin = _y0 <= _y1 ? _y0 : _y1;
        var _yMax = _y0 >= _y1 ? _y0 : _y1;
        var _w = _xMax - _xMin;
        var _h = _yMax - _yMin;
        var _scaleRatio = 1;
        if(_w > _h){
            _scaleRatio = _h / window._canvasHeight;
        }else if(_w <= _h){
            _scaleRatio = _w / window._canvasWidth;
        }
        return _scaleRatio;
    },

    _setMainCamera:function(_target, _eyePos, _up){
        var _controlManager = new THREE._ControlManager();
        _controlManager._setTarget(_target);
        _controlManager._setEyePosition(_eyePos);
        _controlManager._setUp(_up);
    },

    _reverseView:function(_target, _eyePos, _up){
        this._setMainCamera(_target, _eyePos, _up);
        if(window._navigatorOn && window._navigatorCamera){
            var _viewMatrix = THREE._Matrix4._new();
            THREE._Matrix4._lookAt(_viewMatrix, _eyePos, _target, _up);
            var _viewX = THREE._Vector3._create(_viewMatrix[0], _viewMatrix[1], _viewMatrix[2]);
            var _viewY = THREE._Vector3._create(_viewMatrix[4], _viewMatrix[5], _viewMatrix[6]);
            var _viewZ = THREE._Vector3._create(_viewMatrix[8], _viewMatrix[9], _viewMatrix[10]);
            var _viewDir = THREE._Vector3._create(0, 0, 1);
            var _angleViewX = THREE._Vector3._angle(_viewDir, _viewX);
            var _x = Math.cos(_angleViewX);
            var _angleViewY = THREE._Vector3._angle(_viewDir, _viewY);
            var _y = Math.cos(_angleViewY);
            var _angleViewZ = THREE._Vector3._angle(_viewDir, _viewZ);
            var _z = Math.cos(_angleViewZ);
            var _eyePos = THREE._Vector3._create(_x, _y, _z);
            THREE._Vector3._scale(_eyePos, _eyePos, 6);
            var _upDir = THREE._Vector3._create(0, 1, 0);
            var _angleUpX = THREE._Vector3._angle(_upDir, _viewX);
            var _ux = Math.cos(_angleUpX);
            var _angleUpY = THREE._Vector3._angle(_upDir, _viewY);
            var _uy = Math.cos(_angleUpY);
            var _angleUpZ = THREE._Vector3._angle(_upDir, _viewZ);
            var _uz = Math.cos(_angleUpZ);
            var _up = THREE._Vector3._create(_ux, _uy, _uz);
            window._navigatorCamera.position.set(_eyePos[0], _eyePos[1], _eyePos[2]);
            window._navigatorCamera.up.set(_up[0], _up[1], _up[2]);
            window._navigatorCamera.lookAt(new THREE.Vector3());
        }
    }
});