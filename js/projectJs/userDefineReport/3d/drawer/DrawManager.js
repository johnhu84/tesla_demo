THREE._DrawManager = function(){

};

Object.assign(THREE._DrawManager.prototype, {
    _startLoop:function(){
        _loop();
    }
});

function _specialPointUpdate(){
    var _sceneManager = new THREE._SceneManager();
    _sceneManager._findCertainNode(window._scene, "ModelGroup");
    var _boundingBox = _sceneManager._getNodeBoundingBox(_sceneManager._certainNode);
    var _xMax = _boundingBox.max.x;
    var _xMin = _boundingBox.min.x;
    var _yMax = _boundingBox.max.y;
    var _yMin = _boundingBox.min.y;
    var _zMax = _boundingBox.max.z;
    var _zMin = _boundingBox.min.z;
    var _scaleRatio = Math.sqrt(Math.pow((_xMax - _xMin), 2)
        + Math.pow((_yMax - _yMin), 2)
        + Math.pow((_zMax - _zMin), 2));
    _scaleRatio /= 200;
    var _controlManager = new THREE._ControlManager();
    var _distanceScaleRatio = window._distanceScaleRatio;
    var _eyePos = _controlManager._getEyePosition();
    var _target = _controlManager._getTarget();
    var _far = window._camera.far;
    var _dist = THREE._Vector3._dist(_eyePos, _target);
    _distanceScaleRatio *= _dist / _far * 10;
    _scaleRatio *= _distanceScaleRatio;
    var _pointList = [];
    var _cameraManager = new THREE._CameraManager();
    _sceneManager._findCertainNode(window._scene, "ModelGroup");
    var _modelGroup = _sceneManager._certainNode;
    for(var i=0; i<_modelGroup.children.length; i++){
        _sceneManager._findCertainNode(_modelGroup.children[i], "SpecialPointGroup");
        var _specialPointGroup = _sceneManager._certainNode;
        for(var j=0; j<_specialPointGroup.children.length; j++){
            var _specialPoint = _specialPointGroup.children[j];
            var _specialPointPositionClone = _specialPoint.position.clone()
            var _positionOriginal = [_specialPointPositionClone.x, _specialPointPositionClone.y,
                _specialPointPositionClone.z];
            _specialPoint.scale.set(_scaleRatio, _scaleRatio, _scaleRatio);
            var _material = _specialPoint.material;
            var _visible = false;
            if(_material instanceof Array){
                for(var j=0; j<_material.length; j++){
                    if(_material[j].visible === true){
                        _visible = true;
                    }
                }
            }else if(!(_material instanceof Array)){
                if(_material.visible === true){
                    _visible = true;
                }
            }
            if(_visible){
                var _name = _specialPoint.name;
                var _parentName = _specialPointGroup.parent.name;
                var _position = [_specialPoint.position.x, _specialPoint.position.y, _specialPoint.position.z];
                var _screenXY = _cameraManager._convertWorldPositionToScreenCoord(window._camera, _position, window._canvasWidth, window._canvasHeight);
                var _point = {"_name":_name, "_parentName":_parentName, "_screenXY":_screenXY, "_position":_positionOriginal};
                _pointList.push(_point);
            }
        }
    }
    if(window._specialPointCallBack instanceof Function){
        window._specialPointCallBack(_pointList);
    }
}

function _measureNodeUpdate(){
    var _sceneManager = new THREE._SceneManager();
    _sceneManager._findCertainNode(window._scene, "ModelGroup");
    var _boundingBox = _sceneManager._getNodeBoundingBox(_sceneManager._certainNode);
    var _xMax = _boundingBox.max.x;
    var _xMin = _boundingBox.min.x;
    var _yMax = _boundingBox.max.y;
    var _yMin = _boundingBox.min.y;
    var _zMax = _boundingBox.max.z;
    var _zMin = _boundingBox.min.z;
    var _scaleRatio = Math.sqrt(Math.pow((_xMax - _xMin), 2)
        + Math.pow((_yMax - _yMin), 2)
        + Math.pow((_zMax - _zMin), 2));
    _scaleRatio /= 200;
    var _controlManager = new THREE._ControlManager();
    var _distanceScaleRatio = window._distanceScaleRatio;
    var _eyePos = _controlManager._getEyePosition();
    var _target = _controlManager._getTarget();
    var _far = window._camera.far;
    var _dist = THREE._Vector3._dist(_eyePos, _target);
    _distanceScaleRatio *= _dist / _far * 10;
    _scaleRatio *= _distanceScaleRatio;
    _sceneManager._certainNode = undefined;
    _sceneManager._findCertainNode(window._scene, "MeasureDistanceGroup");
    var _measureDistanceGroup = _sceneManager._certainNode;
    if(_measureDistanceGroup){
        for(var i=0; i<_measureDistanceGroup.children.length; i++){
            _sceneManager._certainNode = undefined;
            _sceneManager._findCertainNode(_measureDistanceGroup.children[i], "MeasurePoint_0");
            var _measurePoint_0 = _sceneManager._certainNode;
            if(_measurePoint_0){
                _measurePoint_0.scale.set(_scaleRatio, _scaleRatio, _scaleRatio);
            }
            _sceneManager._certainNode = undefined;
            _sceneManager._findCertainNode(_measureDistanceGroup.children[i], "MeasurePoint_1");
            var _measurePoint_1 = _sceneManager._certainNode;
            if(_measurePoint_1){
                _measurePoint_1.scale.set(_scaleRatio, _scaleRatio, _scaleRatio);
            }
            _sceneManager._certainNode = undefined;
            _sceneManager._findCertainNode(_measureDistanceGroup.children[i], "Text");
            var _textGroup = _sceneManager._certainNode;
            if(_textGroup){
                _sceneManager._findCertainNode(_measureDistanceGroup.children[i], "MeasurePoint_0");
                var _pos0 = _sceneManager._certainNode.position;
                _pos0 = [_pos0.x, _pos0.y, _pos0.z];
                _sceneManager._findCertainNode(_measureDistanceGroup.children[i], "MeasurePoint_1");
                var _pos1 = _sceneManager._certainNode.position;
                _pos1 = [_pos1.x, _pos1.y, _pos1.z];
                var _mPos = THREE._Vector3._new();
                THREE._Vector3._middle(_mPos, _pos0, _pos1);
                var _cameraMatrix = window._camera.matrix.elements;
                var _textGroupMatrix = _textGroup.matrix.elements;
                var _spriteMatrix = THREE._Matrix4._new();
                THREE._Matrix4._copyBasis(_cameraMatrix, _spriteMatrix);
                _spriteMatrix[12] = _mPos[0];
                _spriteMatrix[13] = _mPos[1];
                _spriteMatrix[14] = _mPos[2];
                var _scale = THREE._Vector3._create(_scaleRatio, _scaleRatio, _scaleRatio);
                THREE._Matrix4._scale(_spriteMatrix, _spriteMatrix, _scale);
                var _textGroupMatrixInverse = THREE._Matrix4._new();
                THREE._Matrix4._invert(_textGroupMatrixInverse, _textGroupMatrix);
                THREE._Matrix4._multiply(_spriteMatrix, _spriteMatrix, _textGroupMatrixInverse);
                var _spriteMatrix_THREE = new THREE._Matrix4();
                _spriteMatrix_THREE.elements = _spriteMatrix;
                _textGroup.applyMatrix(_spriteMatrix_THREE);
            }
        }
    }
}

function _loop(){
    requestAnimationFrame(_loop);
    if(window._animateOn){
        if(window._frameKey < window._frameNum){
            if(window._animate instanceof Function){
                window._animate();
            }
            window._frameKey ++;
        }else if(window._frameKey >= window._frameNum){
            window._animateOn = false;
            window._animate = undefined;
            window._frameNum = 0;
            window._frameKey = 0;
        }
    }
    window._controls._update();
    window._renderer.setViewport(0, 0, window._canvasWidth, window._canvasHeight);
    window._renderer.render(window._scene, window._camera);
    if(window._navigatorOn){
        window._renderer.setViewport(window._navigatorViewPortLeft, window._navigatorViewPortBottom, window._navigatorViewPortWidth, window._navigatorViewPortHeight);
        window._renderer.render(window._navigatorScene, window._navigatorCamera);
    }
    _specialPointUpdate();
    _measureNodeUpdate();
}