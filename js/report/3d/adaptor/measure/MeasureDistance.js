THREE._MeasureDistance = function(){
    this._isMeasuring = false;
    this._currMeasureDistanceName = "";
    this._measureTarget = "MeshGroup-SpecialPointGroup-SpecialPointAddedGroup";
};

Object.assign(THREE._MeasureDistance.prototype, {
    _init:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "MeasureDistanceGroup");
        if(!_sceneManager._certainNode){
            var _measureDistanceGroup = new THREE.Group();
            _measureDistanceGroup.name = "MeasureDistanceGroup";
            window._scene.add(_measureDistanceGroup);
        }
    },

    _destroy:function(){
        this._isMeasuring = false;
        this._currMeasureDistanceName = "";
        this._measureTarget = "MeshGroup-SpecialPointGroup-SpecialPointAddedGroup";
    },

    _setMeasureTarget:function(_measureTarget){
        this._measureTarget = _measureTarget;
    },

    _clearMeasureDistance:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "MeasureDistanceGroup");
        _sceneManager._clearNode(_sceneManager._certainNode);
    },

    _mouseDown:function(_x, _y){
        var _raycaster = undefined;
        if(window._boxClipOn && window._clipHide){
            _raycaster = this._rayCastClip(_x, _y);
        }else if(!window._boxClipOn || (window._boxClipOn && !window._clipHide)){
            _raycaster = this._rayCast(_x, _y);
        }
        var _targetMeshes = this._getTargetMeshes();
        var _intersects = _raycaster.intersectObjects(_targetMeshes);
        if(_intersects.length > 0){
            if(!this._isMeasuring){
                this._isMeasuring = true;
                var _object = _intersects[0].object;
                var _position = [_intersects[0].point.x, _intersects[0].point.y, _intersects[0].point.z];
                if(_object.name.substring(_object.name.lastIndexOf("_")) !== "_mesh"){
                    _position = [_object.position.x, _object.position.y, _object.position.z];
                }
                var _sceneManager = new THREE._SceneManager();
                _sceneManager._findCertainNode(window._scene, "MeasureDistanceGroup");
                var _measureDistanceGroup = _sceneManager._certainNode;
                var _currMeasureDistanceNode = new THREE.Group();
                var _measureNodeHelper = new THREE._MeasureNodeHelper();
                this._currMeasureDistanceName = "MeasureDistanceNode_"+_measureDistanceGroup.children.length;
                _measureNodeHelper._setName(_currMeasureDistanceNode, this._currMeasureDistanceName);
                _measureNodeHelper._createPoint(_currMeasureDistanceNode, _position, 0);
                _measureDistanceGroup.add(_currMeasureDistanceNode);
            }else if(this._isMeasuring){
                this._isMeasuring = false;
                var _object = _intersects[0].object;
                var _position = [_intersects[0].point.x, _intersects[0].point.y, _intersects[0].point.z];
                if(_object.name.substring(_object.name.lastIndexOf("_")) !== "_mesh"){
                    _position = [_object.position.x, _object.position.y, _object.position.z];
                }
                var _sceneManager = new THREE._SceneManager();
                _sceneManager._findCertainNode(window._scene, this._currMeasureDistanceName);
                var _currMeasureDistanceNode = _sceneManager._certainNode;
                _sceneManager._findCertainNode(_currMeasureDistanceNode, "MeasurePoint_0");
                var _lastPos = _sceneManager._certainNode.position;
                _lastPos = [_lastPos.x, _lastPos.y, _lastPos.z];
                var _measureNodeHelper = new THREE._MeasureNodeHelper();
                _measureNodeHelper._createLine(_currMeasureDistanceNode, _lastPos, _position, 0);
                _measureNodeHelper._createPoint(_currMeasureDistanceNode, _position, 1);
                this._createText();
            }
        }
    },

    _mouseMove:function(_x, _y){

    },

    _mouseUp:function(_x, _y){

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

    _getTargetMeshes:function(){
        var _targetMeshes = [];
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "ModelGroup");
        var _modelGroup = _sceneManager._certainNode;
        for(var i=0; i<_modelGroup.children.length; i++){
            var _modelTemp = _modelGroup.children[i];
            if(this._measureTarget === "MeshGroup"){
                _sceneManager._findCertainNode(_modelTemp, "MeshGroup");
                var _meshGroup = _sceneManager._certainNode;
                for(var j=0; j<_meshGroup.children.length; j++){
                    _targetMeshes.push(_meshGroup.children[j]);
                }
            }else if(this._measureTarget === "SpecialPointGroup"){
                _sceneManager._findCertainNode(_modelTemp, "SpecialPointGroup");
                var _specialPointGroup = _sceneManager._certainNode;
                for(var j=0; j<_specialPointGroup.children.length; j++){
                    _targetMeshes.push(_specialPointGroup.children[j]);
                }
            }else if(this._measureTarget === "SpecialPointAddedGroup"){
                _sceneManager._findCertainNode(_modelTemp, "SpecialPointAddedGroup");
                var _specialPointAddedGroup = _sceneManager._certainNode;
                for(var j=0; j<_specialPointAddedGroup.children.length; j++){
                    _targetMeshes.push(_specialPointAddedGroup.children[j]);
                }
            }else if(this._measureTarget === "HeapMapGroup"){
                _sceneManager._findCertainNode(_modelTemp, "HeapMapGroup");
                var _heapMapGroup = _sceneManager._certainNode;
                for(var j=0; j<_heapMapGroup.children.length; j++){
                    _targetMeshes.push(_heapMapGroup.children[j]);
                }
            }else if(this._measureTarget === "MeshGroup-SpecialPointGroup-SpecialPointAddedGroup"){
                _sceneManager._findCertainNode(_modelTemp, "MeshGroup");
                var _meshGroup = _sceneManager._certainNode;
                for(var j=0; j<_meshGroup.children.length; j++){
                    _targetMeshes.push(_meshGroup.children[j]);
                }
                _sceneManager._findCertainNode(_modelTemp, "SpecialPointGroup");
                var _specialPointGroup = _sceneManager._certainNode;
                for(var j=0; j<_specialPointGroup.children.length; j++){
                    _targetMeshes.push(_specialPointGroup.children[j]);
                }
                _sceneManager._findCertainNode(_modelTemp, "SpecialPointAddedGroup");
                var _specialPointAddedGroup = _sceneManager._certainNode;
                for(var j=0; j<_specialPointAddedGroup.children.length; j++){
                    _targetMeshes.push(_specialPointAddedGroup.children[j]);
                }
            }
        }
        return _targetMeshes;
    },

    //创建文字
    _createText:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, this._currMeasureDistanceName);
        var _currMeasureDistanceNode = _sceneManager._certainNode;
        _sceneManager._findCertainNode(_currMeasureDistanceNode, "MeasurePoint_0");
        var _pos0 = _sceneManager._certainNode.position;
        _pos0 = [_pos0.x, _pos0.y, _pos0.z];
        _sceneManager._findCertainNode(_currMeasureDistanceNode, "MeasurePoint_1");
        var _pos1 = _sceneManager._certainNode.position;
        _pos1 = [_pos1.x, _pos1.y, _pos1.z];
        var _distance = THREE._Vector3._dist(_pos0, _pos1).toFixed(2).toString();
        var _content = [];
        for(var i=0; i<_distance.length; i++){
            _content.push(_distance[i]);
        }
        _content.push("m", "m");
        var _textHelper = new THREE._TextHelper();
        var _textGroup = _textHelper._createText(_content, "Text");
        var _mPos = THREE._Vector3._new();
        THREE._Vector3._middle(_mPos, _pos0, _pos1);
        _textGroup.position.set(_mPos[0], _mPos[1], _mPos[2]);
        _currMeasureDistanceNode.add(_textGroup);
    }
});