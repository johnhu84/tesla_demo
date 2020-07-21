THREE._ControlManager = function(){

};

Object.assign(THREE._ControlManager.prototype, {
    _initControls:function(){
        window._controls = new THREE._TrackballControls(window._camera, window._renderer.domElement);
        window._controls._rotateSpeed = 1.6;//旋转速度
        window._controls._zoomSpeed = 1.6;//缩放速度
        window._controls._panSpeed = 0.6;//平controls
        window._controls._staticMoving = true;//静止移动，为 true 则没有惯性
        window._controls._dynamicDampingFactor = 0.2;//阻尼系数 越小 则滑动越大
        window._controls._minDistance = window._camera.near;//最近
        window._controls._maxDistance = window._camera.far;//最远
    },

    _fitControls:function(_node, _targetName){
        var _sceneBox = undefined;
        var _sceneManager = new THREE._SceneManager();
        if(_targetName){
            _sceneManager._findCertainGroup(_node, _targetName);
            _sceneBox = _sceneManager._getNodeBoundingBox(_sceneManager._certainGroup);
        }else if(!_targetName){
            _sceneBox = _sceneManager._getNodeBoundingBox(_node);
        }
        var _dist = this._computeDist(_sceneBox);
        if(_dist === Infinity){
            _dist = 1;
        }
        this._setCameraFar(_dist*16);
        this._setMaxDistance(_dist*16);
        var _position = THREE._Vector3._create(0, 0, _dist*3);
        this._setEyePosition(_position);
        var _target = this._computeTarget(_sceneBox);
        this._setTarget(_target);
        var _up = [0, 1, 0];
        this._setUp(_up);
        this._modifyNavigatorCamera();
    },

    _modifyNavigatorCamera:function(){
        if(window._navigatorCamera){
            window._navigatorCamera.position.set(0, 0, 6);
            window._navigatorCamera.up.set(0, 1, 0);
            window._navigatorCamera.lookAt(new THREE.Vector3(0, 0, 0));
        }
    },

    _computeTarget:function(_sceneBox){
        var _x = (_sceneBox.max.x + _sceneBox.min.x) * 0.5;
        var _y = (_sceneBox.max.y + _sceneBox.min.y) * 0.5;
        var _z = (_sceneBox.max.z + _sceneBox.min.z) * 0.5;
        return [_x, _y, _z];
    },

    _computeDist:function(_sceneBox){
        var _x = _sceneBox.max.x - _sceneBox.min.x;
        var _y = _sceneBox.max.y - _sceneBox.min.y;
        var _z = _sceneBox.max.z - _sceneBox.min.z;
        return Math.sqrt(_x * _x + _y * _y + _z * _z);
    },

    _setCameraFar:function(_far){
        window._controls._object.far = _far;
        window._controls._object.updateProjectionMatrix();
    },

    _setMaxDistance:function(_maxDistance){
        window._controls._maxDistance = _maxDistance;
    },

    _lockControls:function(){
        window._controls._noZoom = true;
        window._controls._noPan = true;
    },

    _releaseControls:function(){
        window._controls._noZoom = false;
        window._controls._noPan = false;
    },

    _getEyePosition:function(){
        return [window._controls._object.position.x, window._controls._object.position.y, window._controls._object.position.z];
    },

    _setEyePosition:function(_position){
        window._controls._object.position.set(_position[0], _position[1], _position[2]);
    },

    _getUp:function(){
        return [window._controls._object.up.x, window._controls._object.up.y, window._controls._object.up.z];
    },

    _setUp:function(_up){
        window._controls._object.up.set(_up[0], _up[1], _up[2]);
    },

    _getTarget:function(){
        return [window._controls._target.x, window._controls._target.y, window._controls._target.z];
    },

    _setTarget:function(_target){
        window._controls._target = new THREE.Vector3(_target[0], _target[1], _target[2]);
    }
});