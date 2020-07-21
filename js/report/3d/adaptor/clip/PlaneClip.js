THREE._PlaneClip = function(){
    this._dragging = false;
    this._currNode = undefined;
    this._lastPos = [0, 0, 0];
};

Object.assign(THREE._PlaneClip.prototype, {
    _init:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "PlaneClipGroup");
        if(!_sceneManager._certainNode){
            var _planeClipGroup = new THREE.Group();
            _planeClipGroup.name = "PlaneClipGroup";
            window._scene.add(_planeClipGroup);
        }
        window._renderer.localClippingEnabled = true;
    },

    _destroy:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "PlaneClipGroup");
        _sceneManager._clearNode(_sceneManager._certainNode);
        _sceneManager._findCertainNode(window._scene, "ModelGroup");
        _sceneManager._setClipPlanes(_sceneManager._certainNode, []);
        window._renderer.localClippingEnabled = false;
    },

    _createClipPlane:function(_clipPlaneId, _clipPlaneColor, _clipPlaneOpacity){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "PlaneClipGroup");
        var _planeClipGroup = _sceneManager._certainNode;
        var _planeClipHelper = new THREE._PlaneClipHelper();
        var _clipPlane = _planeClipHelper._createClipPlane(_clipPlaneId, _clipPlaneColor, _clipPlaneOpacity);
        _planeClipGroup.add(_clipPlane);
    },

    _mouseDown:function(_x, _y){
        this._dragging = true;
        var _raycaster = this._rayCast(_x, _y);
        var _targetMeshes = this._getTargetMeshes();
        var _intersects = _raycaster.intersectObjects(_targetMeshes);
        if(_intersects.length !== 0){
            this._currNode = _intersects[0].object;
            this._lastPos = [_intersects[0].point.x, _intersects[0].point.y, _intersects[0].point.z];
        }
    },

    _mouseMove:function(_x, _y){
        if(this._dragging && this._currNode){
            var _raycaster = this._rayCast(_x, _y);
            var _intersects = _raycaster.intersectObject(this._currNode);
            if(_intersects.length !== 0){
                var _currPos = [_intersects[0].point.x, _intersects[0].point.y, _intersects[0].point.z];
                if(this._currNode.name === "PlaneMesh"){
                    var _xProjectionArea = this._getProjectionAreaOnPlane(this._currNode.parent, "XMesh", this._lastPos, _currPos);
                    var _yProjectionArea = this._getProjectionAreaOnPlane(this._currNode.parent, "YMesh", this._lastPos, _currPos);
                    var _planeClipHelper = new THREE._PlaneClipHelper();
                    _planeClipHelper._resizePlaneMesh(this._currNode, _xProjectionArea._projection, _xProjectionArea._area, _yProjectionArea._projection, _yProjectionArea._area);
                }else if(this._currNode.name === "XMesh"){
                    var _x = this._getAxis(this._currNode.parent, this._currNode.name);
                    var _distance = this._getProjectionDistance(_x, this._lastPos, _currPos);
                    this._currNode.parent.translateX(_distance);
                }else if(this._currNode.name === "YMesh"){
                    var _y = this._getAxis(this._currNode.parent, this._currNode.name);
                    var _distance = this._getProjectionDistance(_y, this._lastPos, _currPos);
                    this._currNode.parent.translateY(_distance);
                }else if(this._currNode.name === "ZMesh"){
                    var _z = this._getAxis(this._currNode.parent, this._currNode.name);
                    var _distance = this._getProjectionDistance(_z, this._lastPos, _currPos);
                    this._currNode.parent.translateZ(_distance);
                }else if(this._currNode.name === "Y0ZMesh"){
                    var _origin = this._getOrigin(this._currNode.parent);
                    var _angleAxis = this._getAngleAxis(_origin, this._lastPos, _currPos, this._currNode.parent, "XMesh");
                    var _axis = new THREE.Vector3(_angleAxis._axis[0], _angleAxis._axis[1], _angleAxis._axis[2]);
                    this._currNode.parent.rotateOnAxis(_axis, _angleAxis._angle);
                }else if(this._currNode.name === "Z0XMesh"){
                    var _origin = this._getOrigin(this._currNode.parent);
                    var _angleAxis = this._getAngleAxis(_origin, this._lastPos, _currPos, this._currNode.parent, "YMesh");
                    var _axis = new THREE.Vector3(_angleAxis._axis[0], _angleAxis._axis[1], _angleAxis._axis[2]);
                    this._currNode.parent.rotateOnAxis(_axis, _angleAxis._angle);
                }else if(this._currNode.name === "X0YMesh"){
                    var _origin = this._getOrigin(this._currNode.parent);
                    var _angleAxis = this._getAngleAxis(_origin, this._lastPos, _currPos, this._currNode.parent, "ZMesh");
                    var _axis = new THREE.Vector3(_angleAxis._axis[0], _angleAxis._axis[1], _angleAxis._axis[2]);
                    this._currNode.parent.rotateOnAxis(_axis, _angleAxis._angle);
                }
                this._currNode.parent.updateMatrixWorld(true);
                this._lastPos = _currPos;
                this._updateClipPlanes();
            }else if(_intersects.length === 0){
                this._dragging = false;
                this._currNode = undefined;
                this._lastPos = [0, 0, 0];
            }
        }
    },

    _mouseUp:function(_x, _y){
        this._dragging = false;
        this._currNode = undefined;
        this._lastPos = [0, 0, 0];
        this._updateClipPlanes();
    },

    _rayCast:function(_x, _y){
        var _mouse = new THREE.Vector2();
        var _raycaster = new THREE.Raycaster();
        _mouse.x = (_x / window._canvasWidth) * 2 - 1;
        _mouse.y = - (_y / window._canvasHeight) * 2 + 1;
        _raycaster.setFromCamera(_mouse, window._camera);
        return _raycaster;
    },

    _getTargetMeshes:function(){
        var _targetMeshes = [];
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "PlaneClipGroup");
        var _planeClipGroup = _sceneManager._certainNode;
        for(var i=0; i<_planeClipGroup.children.length; i++){
            if(_planeClipGroup.children[i].children[0].material.visible){
                for(var j=0; j<_planeClipGroup.children[i].children.length; j++){
                    _targetMeshes.push(_planeClipGroup.children[i].children[j]);
                }
            }
        }
        return _targetMeshes;
    },

    _getAxis:function(_node, _axisName){
        var _axis = [0, 0, 0];
        if(_axisName === "XMesh"){
            _axis[0] = _node.matrixWorld.elements[0];
            _axis[1] = _node.matrixWorld.elements[1];
            _axis[2] = _node.matrixWorld.elements[2];
        }else if(_axisName === "YMesh"){
            _axis[0] = _node.matrixWorld.elements[4];
            _axis[1] = _node.matrixWorld.elements[5];
            _axis[2] = _node.matrixWorld.elements[6];
        }else if(_axisName === "ZMesh"){
            _axis[0] = _node.matrixWorld.elements[8];
            _axis[1] = _node.matrixWorld.elements[9];
            _axis[2] = _node.matrixWorld.elements[10];
        }
        return _axis;
    },

    _getOrigin:function(_node){
        var _origin = [0, 0, 0];
        _origin[0] = _node.matrixWorld.elements[12];
        _origin[1] = _node.matrixWorld.elements[13];
        _origin[2] = _node.matrixWorld.elements[14];
        return _origin;
    },

    _getProjectionDistance:function(_v0, _p0, _p1){
        var _v1 = THREE._Vector3._new();
        THREE._Vector3._sub(_v1, _p1, _p0);
        var _angle = THREE._Vector3._angle(_v0, _v1);
        var _dist = THREE._Vector3._dist(_p1, _p0);
        _dist *= Math.cos(_angle);
        return _dist;
    },

    _getProjectionAreaOnPlane:function(_node, _axisName, _lastPos, _currPos){
        var _area = "+";
        var _axis = this._getAxis(_node, _axisName);
        var _projection = this._getProjectionDistance(_axis, _lastPos, _currPos);
        var _origin = this._getOrigin(_node);
        var _originLastProjection = this._getProjectionDistance(_axis, _origin, _lastPos);
        var _originCurrProjection = this._getProjectionDistance(_axis, _origin, _currPos);
        if(_originLastProjection < 0 && _originCurrProjection < 0){
            _area = "-";
        }else if((_originLastProjection <= 0 && _originCurrProjection >= 0)
            || (_originLastProjection >= 0 && _originCurrProjection <= 0)){
            _projection = 0;
            _area = "+";
        }
        return {"_projection":_projection, "_area":_area};
    },

    _getAngleAxis:function(_origin, _p0, _p1, _node, _axisName){
        var _v0 = THREE._Vector3._new();
        THREE._Vector3._sub(_v0, _p0, _origin);
        var _v1 = THREE._Vector3._new();
        THREE._Vector3._sub(_v1, _p1, _origin);
        var _angle = THREE._Vector3._angle(_v0, _v1);
        var _axisRot = THREE._Vector3._new();
        THREE._Vector3._cross(_axisRot, _v0, _v1);
        var _axis = this._getAxis(_node, _axisName);
        var _rad = THREE._Vector3._angle(_axisRot, _axis);
        if(_axisName === "XMesh"){
            _axisRot = _rad < Math.PI/2 ? [1, 0, 0] : [-1, 0, 0];
        }else if(_axisName === "YMesh"){
            _axisRot = _rad < Math.PI/2 ? [0, 1, 0] : [0, -1, 0];
        }else if(_axisName === "ZMesh"){
            _axisRot = _rad < Math.PI/2 ? [0, 0, 1] : [0, 0, -1];
        }
        return {"_angle":_angle, "_axis":_axisRot};
    },

    _updateClipPlanes:function(){
        var _clipPlanes = [];
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "PlaneClipGroup");
        var _planeClipGroup = _sceneManager._certainNode;
        for(var i=0; i<_planeClipGroup.children.length; i++){
            var _planeClipNode = _planeClipGroup.children[i];
            var _normal = THREE._Vector3._new();
            _normal[0] = _planeClipNode.matrixWorld.elements[8];
            _normal[1] = _planeClipNode.matrixWorld.elements[9];
            _normal[2] = _planeClipNode.matrixWorld.elements[10];
            var _translate = THREE._Vector3._new();
            _translate[0] = _planeClipNode.matrixWorld.elements[12];
            _translate[1] = _planeClipNode.matrixWorld.elements[13];
            _translate[2] = _planeClipNode.matrixWorld.elements[14];
            var _angle = THREE._Vector3._angle(_normal, _translate);
            var _distance = THREE._Vector3._dist(_translate, THREE._Vector3._new());
            var _constant = _distance*Math.cos(_angle);
            var _clipPlane = new THREE.Plane(new THREE.Vector3(-_normal[0], -_normal[1], -_normal[2]), _constant);
            _clipPlanes.push(_clipPlane);
        }
        _sceneManager._findCertainNode(window._scene, "ModelGroup");
        _sceneManager._setClipPlanes(_sceneManager._certainNode, _clipPlanes);
    },

    _setClipPlaneNormal:function(_clipPlaneId, _clipPlaneNormal){
        var _clipPlaneName = "ClipPlane_" + _clipPlaneId;
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "PlaneClipGroup");
        _sceneManager._findCertainNode(_sceneManager._certainNode, _clipPlaneName);
        var _clipPlane = _sceneManager._certainNode;
        var _lastNormal = THREE._Vector3._new();
        _lastNormal[0] = _clipPlane.matrixWorld.elements[8];
        _lastNormal[1] = _clipPlane.matrixWorld.elements[9];
        _lastNormal[2] = _clipPlane.matrixWorld.elements[10];
        var _axis = THREE._Vector3._new();
        THREE._Vector3._cross(_axis, _lastNormal, _clipPlaneNormal);
        THREE._Vector3._normalize(_axis, _axis);
        var _angle = THREE._Vector3._angle(_lastNormal, _clipPlaneNormal);
        var _matrix = THREE._Matrix4._new();
        THREE._Matrix4._rotate(_matrix, _matrix, _angle, _axis);
        var _lastPosition = THREE._Vector3._new();
        _lastPosition[0] = _clipPlane.matrixWorld.elements[12];
        _lastPosition[1] = _clipPlane.matrixWorld.elements[13];
        _lastPosition[2] = _clipPlane.matrixWorld.elements[14];
        _matrix[12] = -_lastPosition[0];
        _matrix[13] = -_lastPosition[1];
        _matrix[14] = -_lastPosition[2];
        var _mat = new THREE.Matrix4();
        _mat.elements = _matrix;
        _clipPlane.applyMatrix(_mat);
        _clipPlane.position.set(_lastPosition[0], _lastPosition[1], _lastPosition[2]);
        _clipPlane.updateMatrixWorld(true);
        this._updateClipPlanes();
    },

    _setClipPlanePosition:function(_clipPlaneId, _clipPlanePosition){
        var _clipPlaneName = "ClipPlane_" + _clipPlaneId;
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "PlaneClipGroup");
        _sceneManager._findCertainNode(_sceneManager._certainNode, _clipPlaneName);
        var _clipPlane = _sceneManager._certainNode;
        _clipPlane.position.set(_clipPlanePosition[0], _clipPlanePosition[1], _clipPlanePosition[2]);
        _clipPlane.updateMatrixWorld(true);
        this._updateClipPlanes();
    },

    _hideClipPlane:function(_clipPlaneId){
        var _clipPlaneName = "ClipPlane_" + _clipPlaneId;
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "PlaneClipGroup");
        _sceneManager._findCertainNode(_sceneManager._certainNode, _clipPlaneName);
        var _clipPlane = _sceneManager._certainNode;
        _sceneManager._hideNode(_clipPlane);
    },

    _showClipPlane:function(_clipPlaneId){
        var _clipPlaneName = "ClipPlane_" + _clipPlaneId;
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "PlaneClipGroup");
        _sceneManager._findCertainNode(_sceneManager._certainNode, _clipPlaneName);
        var _clipPlane = _sceneManager._certainNode;
        _sceneManager._showNode(_clipPlane);
    },

    _deleteClipPlane:function(_clipPlaneId){
        var _clipPlaneName = "ClipPlane_" + _clipPlaneId;
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "PlaneClipGroup");
        _sceneManager._deleteNode(_sceneManager._certainNode, _clipPlaneName);
        this._updateClipPlanes();
    }
});