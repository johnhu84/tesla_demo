THREE._LoadManager = function(){

};

Object.assign(THREE._LoadManager.prototype, {
    _loadModel:function(_modelType, _modelName, _path, _callBack){
        var _onProgress = function(_xhr){
            if(_xhr.lengthComputable){
                var _percentComplete = _xhr.loaded / _xhr.total * 100;
                console.log(Math.round(_percentComplete, 2) + '% downloaded');
            }
        };
        var _onError = function(_xhr){};
        THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
        if(_path === undefined){
            var _certainModelGroup = new THREE.Group();
            _certainModelGroup.name = _modelName;
            var _meshGroup = new THREE.Group();
            _meshGroup.name = "MeshGroup";
            _certainModelGroup.add(_meshGroup);
            var _specialPointGroup = new THREE.Group();
            _specialPointGroup.name = "SpecialPointGroup";
            _certainModelGroup.add(_specialPointGroup);
            var _specialPointAddedGroup = new THREE.Group();
            _specialPointAddedGroup.name = "SpecialPointAddedGroup";
            _certainModelGroup.add(_specialPointAddedGroup);
            var _pointCloudGroup = new THREE.Group();
            _pointCloudGroup.name = "PointCloudGroup";
            _certainModelGroup.add(_pointCloudGroup);
            var _heapMapGroup = new THREE.Group();
            _heapMapGroup.name = "HeapMapGroup";
            _certainModelGroup.add(_heapMapGroup);
            var _sceneManager = new THREE._SceneManager();
            _sceneManager._findCertainGroup(window._scene, "ModelGroup");
            _sceneManager._certainGroup.add(_certainModelGroup);
            var _controlManager = new THREE._ControlManager();
            _controlManager._fitControls(window._scene, "ModelGroup");
            if(_callBack instanceof Function){
                _callBack();
            }
        }else if(_path !== undefined){
            if(_modelType === "stl"){
                var _loader = new THREE.STLLoader();
                _loader.load(
                    _path + _modelName,
                    function(_geometry){
                        var _certainModelGroup = new THREE.Group();
                        _certainModelGroup.name = _modelName;
                        _geometry.computeVertexNormals();
                        var _material = new THREE.MeshPhongMaterial({
                            color:0xff5533,
                            side:THREE.DoubleSide,
                            specular:0x111111,
                            shininess:200
                        });
                        _material.polygonOffset = true;
                        _material.polygonOffsetFactor = 0.1;
                        _material.polygonOffsetUnits = 1.0;
                        var _mesh = new THREE.Mesh(_geometry, _material);
                        _mesh.name = _modelName + "_mesh";
                        var _meshGroup = new THREE.Group();
                        _meshGroup.name = "MeshGroup";
                        _meshGroup.add(_mesh);
                        _certainModelGroup.add(_meshGroup);
                        var _specialPointGroup = new THREE.Group();
                        _specialPointGroup.name = "SpecialPointGroup";
                        _certainModelGroup.add(_specialPointGroup);
                        var _specialPointAddedGroup = new THREE.Group();
                        _specialPointAddedGroup.name = "SpecialPointAddedGroup";
                        _certainModelGroup.add(_specialPointAddedGroup);
                        var _pointCloudGroup = new THREE.Group();
                        _pointCloudGroup.name = "PointCloudGroup";
                        _certainModelGroup.add(_pointCloudGroup);
                        var _heapMapGroup = new THREE.Group();
                        _heapMapGroup.name = "HeapMapGroup";
                        _certainModelGroup.add(_heapMapGroup);
                        var _sceneManager = new THREE._SceneManager();
                        _sceneManager._findCertainGroup(window._scene, "ModelGroup");
                        _sceneManager._certainGroup.add(_certainModelGroup);
                        var _controlManager = new THREE._ControlManager();
                        _controlManager._fitControls(window._scene, "ModelGroup");
                        if(_callBack instanceof Function){
                            _callBack();
                        }
                    },
                    _onProgress,
                    _onError
                );
            }else if(_modelType === "ply"){
                var _loader = new THREE.PLYLoader();
                _loader.load(
                    _path + _modelName,
                    function(_geometry){
                        var _certainModelGroup = new THREE.Group();
                        _certainModelGroup.name = _modelName;
                        _geometry.computeVertexNormals();
                        var _material = new THREE.MeshPhongMaterial({
                            vertexColors:THREE.VertexColors,
                            side:THREE.DoubleSide,
                            specular:0x111111,
                            shininess:200
                        });
                        _material.polygonOffset = true;
                        _material.polygonOffsetFactor = 0.1;
                        _material.polygonOffsetUnits = 1.0;
                        var _mesh = new THREE.Mesh(_geometry, _material);
                        _mesh.name = _modelName + "_mesh";
                        var _meshGroup = new THREE.Group();
                        _meshGroup.name = "MeshGroup";
                        _meshGroup.add(_mesh);
                        _certainModelGroup.add(_meshGroup);
                        var _specialPointGroup = new THREE.Group();
                        _specialPointGroup.name = "SpecialPointGroup";
                        _certainModelGroup.add(_specialPointGroup);
                        var _specialPointAddedGroup = new THREE.Group();
                        _specialPointAddedGroup.name = "SpecialPointAddedGroup";
                        _certainModelGroup.add(_specialPointAddedGroup);
                        var _pointCloudGroup = new THREE.Group();
                        _pointCloudGroup.name = "PointCloudGroup";
                        _certainModelGroup.add(_pointCloudGroup);
                        var _heapMapGroup = new THREE.Group();
                        _heapMapGroup.name = "HeapMapGroup";
                        _certainModelGroup.add(_heapMapGroup);
                        var _sceneManager = new THREE._SceneManager();
                        _sceneManager._findCertainGroup(window._scene, "ModelGroup");
                        _sceneManager._certainGroup.add(_certainModelGroup);
                        var _controlManager = new THREE._ControlManager();
                        _controlManager._fitControls(window._scene, "ModelGroup");
                        if(_callBack instanceof Function){
                            _callBack();
                        }
                    },
                    _onProgress,
                    _onError
                );
            }
        }
    },

    _loadSpecialPoint:function(_modelName, _pointList, _color, _distanceScaleRatio, _callBack){
        window._distanceScaleRatio = _distanceScaleRatio;
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, _modelName);
        _sceneManager._findCertainNode(_sceneManager._certainNode, "SpecialPointGroup");
        for(var i=0; i<_pointList.length; i++){
            var _pointName = _modelName + "_" + _pointList[i]._name;
            var _pointPosition = _pointList[i]._cpcPos;
            var _geometry = new THREE.SphereBufferGeometry(1, 9, 6);
            var _material = new THREE.MeshBasicMaterial({
                color:_color
            });
            var _mesh = new THREE.Mesh(_geometry, _material);
            _mesh.name = _pointName;
            _mesh.position.set(_pointPosition[0], _pointPosition[1], _pointPosition[2]);
            _sceneManager._certainNode.add(_mesh);
        }
        var _controlManager = new THREE._ControlManager();
        _controlManager._fitControls(window._scene, "ModelGroup");
        if(_callBack instanceof Function){
            _callBack();
        }
    }
});