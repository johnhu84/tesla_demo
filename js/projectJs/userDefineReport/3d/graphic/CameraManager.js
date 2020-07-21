THREE._CameraManager = function(){

};

Object.assign(THREE._CameraManager.prototype, {
    _initCamera:function(_fov, _screenWidth, _screenHeight, _near, _far){
        var _aspect = _screenWidth/_screenHeight;
        return new THREE.PerspectiveCamera(_fov, _aspect, _near, _far);
    },

    //屏幕坐标转世界坐标
    _convertScreenCoordToWorldPosition:function(_camera, _screenCoord, _screenWidth, _screenHeight){
        var _worldPosition = THREE._Vector3._new();
        var _invProjMat = _camera.projectionMatrixInverse.elements;
        var _invModelViewMat = _camera.matrixWorld.elements;
        var _ndc = [0, 0, 0];
        _ndc[0] = _screenCoord[0] * 2 / _screenWidth - 1;
        _ndc[1] = 1 - _screenCoord[1] * 2 / _screenHeight;
        _ndc[2] = _screenCoord[2] * 2 - 1;
        THREE._Vector3._transformMat4(_worldPosition, _ndc, _invProjMat);
        THREE._Vector3._transformMat4(_worldPosition, _worldPosition, _invModelViewMat);
        return _worldPosition;
    },

    //世界坐标转屏幕坐标
    _convertWorldPositionToScreenCoord:function(_camera, _worldPosition, _screenWidth, _screenHeight){
        var _screenCoord = THREE._Vector3._new();
        var _modelViewMatrix = _camera.matrixWorldInverse.elements;
        THREE._Vector3._transformMat4(_worldPosition, _worldPosition, _modelViewMatrix);
        THREE._Vector3._transformMat4(_screenCoord, _worldPosition, _camera.projectionMatrix.elements);
        _screenCoord[0] = _screenCoord[0] * _screenWidth / 2 + _screenWidth / 2;
        _screenCoord[1] = - _screenCoord[1] * _screenHeight / 2 + _screenHeight / 2;
        _screenCoord[2] = _screenCoord[2] / 2 + 0.5;
        return _screenCoord;
    }
});