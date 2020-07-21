THREE._PointerPick = function(){

};

Object.assign(THREE._PointerPick.prototype, {
    _rayCaster:function(_x, _y){
        var _mouse = new THREE.Vector2();
        var _raycaster = new THREE.Raycaster();
        _mouse.x = (_x / window._canvasWidth) * 2 - 1;
        _mouse.y = - (_y / window._canvasHeight) * 2 + 1;
        _raycaster.setFromCamera(_mouse, window._camera);
        //交模型mesh列表
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
        return _raycaster.intersectObjects(_targetList);
    },

    _mouseDown:function(_x, _y){
        var _intersects = this._rayCaster(_x, _y);
        //交到模型
        if (_intersects.length > 0){
            var _intersect = _intersects[0];
            var _mesh = _intersect.object;
            window._pick._pushPickedMesh(_mesh);
            if(window._pick._callback instanceof Function){
                window._pick._callback(window._pick._pickedMeshes);
            }
        }
    }
});