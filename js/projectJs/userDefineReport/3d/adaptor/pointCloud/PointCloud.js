window._pointCloudArray = [];
window._pointCloudRelativeModelFaceList = [];
window._pointCloudRelativeModelCopy = undefined;
window._pointCloudInteractOn = false;

THREE._PointCloud = function(){

};

Object.assign(THREE._PointCloud.prototype, {
    _splitModel:function(_modelName){
        var _faceList = [];
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, _modelName);
        var _modelMesh = _sceneManager._certainNode;
        if(_modelMesh){
            var _positions = _modelMesh.geometry.attributes.position;
            var _num = _positions.count;
            var _posArray = _positions.array;
            for(var i=0; i<_num/3; i++){
                var _face = {
                    "vertices":{"t0":[], "t1":[], "t2":[]},
                    "normal":[],
                    "boundingBox":{"max":{"x":0, "y":0, "z":0}, "min":{"x":0, "y":0, "z":0}}
                };
                _face.vertices.t0 = [_posArray[i*3], _posArray[i*3+1], _posArray[i*3+2]];
                _face.vertices.t1 = [_posArray[i*3+3], _posArray[i*3+4], _posArray[i*3+5]];
                _face.vertices.t2 = [_posArray[i*3+6], _posArray[i*3+7], _posArray[i*3+8]];
                _face.normal = THREE._Vector3._new();
                var _v0 = THREE._Vector3._new();
                THREE._Vector3._sub(_v0, _face.vertices.t1, _face.vertices.t0);
                var _v1 = THREE._Vector3._new();
                THREE._Vector3._sub(_v1, _face.vertices.t2, _face.vertices.t1);
                THREE._Vector3._cross(_face.normal, _v0, _v1);
                THREE._Vector3._normalize(_face.normal, _face.normal);
                var _xMax = _face.vertices.t0[0];
                var _yMax = _face.vertices.t0[1];
                var _zMax = _face.vertices.t0[2];
                var _xMin = _face.vertices.t0[0];
                var _yMin = _face.vertices.t0[1];
                var _zMin = _face.vertices.t0[2];
                if(_xMax < _face.vertices.t1[0]){
                    _xMax = _face.vertices.t1[0];
                }
                if(_yMax < _face.vertices.t1[1]){
                    _yMax = _face.vertices.t1[1];
                }
                if(_zMax < _face.vertices.t1[2]){
                    _zMax = _face.vertices.t1[2];
                }
                if(_xMin > _face.vertices.t1[0]){
                    _xMin = _face.vertices.t1[0];
                }
                if(_yMin > _face.vertices.t1[1]){
                    _yMin = _face.vertices.t1[1];
                }
                if(_zMin > _face.vertices.t1[2]){
                    _zMin = _face.vertices.t1[2];
                }
                if(_xMax < _face.vertices.t2[0]){
                    _xMax = _face.vertices.t2[0];
                }
                if(_yMax < _face.vertices.t2[1]){
                    _yMax = _face.vertices.t2[1];
                }
                if(_zMax < _face.vertices.t2[2]){
                    _zMax = _face.vertices.t2[2];
                }
                if(_xMin > _face.vertices.t2[0]){
                    _xMin = _face.vertices.t2[0];
                }
                if(_yMin > _face.vertices.t2[1]){
                    _yMin = _face.vertices.t2[1];
                }
                if(_zMin > _face.vertices.t2[2]){
                    _zMin = _face.vertices.t2[2];
                }
                _face.boundingBox = {"max":{"x":_xMax, "y":_yMax, "z":_zMax}, "min":{"x":_xMin, "y":_yMin, "z":_zMin}};
                _faceList.push(_face);
            }
        }
        return _faceList;
    },

    _buildOctree:function(_treeDepth, _modelName){
        window._ocTree = new THREE._OCTree();
        window._ocTreeLeafVertexNum = 0;
        window._ocTreeFaceNum = 0;
        window._ocTreeDistMax = 1000000;
        window._ocTreeDistMin = -1000000;
        window._ocTreeIndex = 0;
        var _faceList = this._splitModel(_modelName);
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, _modelName);
        var _boundingBox = _sceneManager._getNodeOCTreeBoundary(_sceneManager._certainNode);
        for(var i=0; i<window._pointCloudArray.length; i++){
            window._ocTree._insertVertex(window._ocTree, _treeDepth, _boundingBox, undefined, window._pointCloudArray[i]);
        }
        for(var i=0; i<_faceList.length; i++){
            window._ocTree._insertFace(window._ocTree, _treeDepth, _boundingBox, undefined, _faceList[i]);
        }
        window._ocTree._traverseTree(window._ocTree);
    },

    _showOCTree:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "OCTreeGroup");
        var _ocTree = new THREE._OCTree();
        _ocTree._drawTree(window._ocTree, _sceneManager._certainNode);
    },

    _deleteOCTree:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "OCTreeGroup");
        _sceneManager._clearNode(_sceneManager._certainNode);
    },

    _computeOCTreePointToModelDistance:function(){
        if(window._ocTree){
            window._ocTree._computeVertexFaceDist(window._ocTree);
        }
        window._ocTree._getMaxMinDist(window._ocTree);
    },

    _computePointCloudColor:function(){
        if(window._ocTree){
            window._ocTree._computeVertexColor(window._ocTree);
        }
    },

    _showPointCloud:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "PointCloudGroup");
        if(window._ocTree){
            window._ocTree._drawPointCloud(window._ocTree, _sceneManager._certainNode);
        }
    },

    _deletePointCloud:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "PointCloudGroup");
        _sceneManager._clearNode(_sceneManager._certainNode);
    },

    _shadeModel:function(_modelName){
        var _index = [];
        var _color = [];
        var _position = [];
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, _modelName);
        var _modelMesh = _sceneManager._certainNode;
        if(_modelMesh){
            var _positions = _modelMesh.geometry.attributes.position;
            var _index = _modelMesh.geometry.index.array;
            var _count = _positions.count;
            _position = _positions.array;
            for(var i=0; i<_count; i++){
                var _posTemp = [_position[i*3], _position[i*3+1], _position[i*3+2]];
                var _colorTemp = [];
                window._ocTree._intrudePCL(window._ocTree, _colorTemp, _posTemp);
                if(_colorTemp.length === 0){
                    _color.push(0, 1, 0, 1);
                }else if(_colorTemp.length === 4){
                    _color.push(_colorTemp[0], _colorTemp[1], _colorTemp[2], _colorTemp[3]);
                }
            }
            _sceneManager._findCertainNode(window._scene, _modelName);
            if(window._pointCloudRelativeModelCopy instanceof THREE.Mesh){
                window._pointCloudRelativeModelCopy.geometry.dispose();
                window._pointCloudRelativeModelCopy.material.dispose();
            }
            window._pointCloudRelativeModelCopy = new THREE.Mesh(_sceneManager._certainNode.geometry.clone(false), _sceneManager._certainNode.material.clone(false));
            window._pointCloudRelativeModelCopy.name = _modelName;
            _sceneManager._findCertainNode(window._scene, "ModelGroup");
            _sceneManager._deleteNode(_sceneManager._certainNode, _modelName);
            var _geometry = new THREE.BufferGeometry();
            var _indexAttribute = new THREE.Uint32BufferAttribute(_index, 1);
            _geometry.setIndex(_indexAttribute);//拓扑索引
            _geometry.addAttribute('position', new THREE.BufferAttribute(Float32Array.from(_position), 3));
            _geometry.addAttribute('color', new THREE.BufferAttribute(Float32Array.from(_color), 4));
            _geometry.computeVertexNormals();
            var _material = new THREE.MeshPhongMaterial({
                vertexColors:THREE.VertexColors,
                side:THREE.DoubleSide,
                specular:0x111111,
                shininess:200
            });
            var _mesh = new THREE.Mesh(_geometry, _material);
            _mesh.name = _modelName;
            _sceneManager._findCertainNode(window._scene, "ModelGroup");
            _sceneManager._certainNode.add(_mesh);
        }
    },

    _recoverModel:function(_modelName){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "ModelGroup");
        _sceneManager._deleteNode(_sceneManager._certainNode, _modelName);
        _sceneManager._findCertainNode(window._scene, "ModelGroup");
        _sceneManager._certainNode.add(window._pointCloudRelativeModelCopy);
    },

    _pointCloudPickOn:function(){
        if(!window._pointCloudInteractOn){
            window._pointCloudInteractOn = true;
        }
    },

    _pointCloudPickOff:function(){
        if(window._pointCloudInteractOn){
            window._pointCloudInteractOn = false;
        }
    },

    _mouseDown:function(_x, _y, _callBack){
        if(window._pointCloudInteractOn){
            var _mouse = new THREE.Vector2();
            var _raycaster = new THREE.Raycaster();
            _mouse.x = (_x / window._canvasWidth) * 2 - 1;
            _mouse.y = -(_y / window._canvasHeight) * 2 + 1;
            _raycaster.setFromCamera(_mouse, window._camera);
            var _sceneManager = new THREE._SceneManager();
            _sceneManager._findCertainNode(window._scene, "ModelGroup");
            var _modelGroup = _sceneManager._certainNode;
            _sceneManager._meshes = [];
            _sceneManager._findMeshes(_modelGroup);
            var _meshes = _sceneManager._meshes;
            var _intersects = _raycaster.intersectObjects(_meshes);
            if(_intersects.length > 0){
                var _intersect = _intersects[0];
                var _pos = [_intersect.point.x, _intersect.point.y, _intersect.point.z];
                window._ocTree._findLeaf(window._ocTree, _pos, _callBack);
            }
        }
    }
});

function buildOCTree(_treeDepth, _modelName){
    var _pointCloud = new THREE._PointCloud();
    _pointCloud._buildOctree(_treeDepth, _modelName);
    console.log("过滤剩余点数:", window._ocTreeLeafVertexNum);
    console.log("总面数:", window._ocTreeFaceNum);
    //alert("过滤剩余点数：" + window._ocTreeLeafVertexNum + "，总面数：" + window._ocTreeFaceNum);
}

function showOCTree(){
    var _pointCloud = new THREE._PointCloud();
    _pointCloud._showOCTree();
}

function deleteOCTree(){
    var _pointCloud = new THREE._PointCloud();
    _pointCloud._deleteOCTree();
}

function computeOCTreePointToModelDistance(){
    var _pointCloud = new THREE._PointCloud();
    _pointCloud._computeOCTreePointToModelDistance();
    console.log("distMax:", window._ocTreeDistMax, ", distMin:", window._ocTreeDistMin);
    //alert("distMax:"+window._ocTreeDistMax+", distMin:"+window._ocTreeDistMin);
}

function computePointCloudColor(_callBack){
    var _pointCloud = new THREE._PointCloud();
    _pointCloud._computePointCloudColor();
    //alert("点云着色完成");
    if(_callBack instanceof Function){
        _callBack(window._ocTreeDistMin, window._ocTreeDistMax);
    }
}

function showPointCloud(){
    var _pointCloud = new THREE._PointCloud();
    _pointCloud._showPointCloud();
}

function deletePointCloud(){
    var _pointCloud = new THREE._PointCloud();
    _pointCloud._deletePointCloud();
}

function shadeModel(_modelName){
    var _pointCloud = new THREE._PointCloud();
    _pointCloud._shadeModel(_modelName);
}

function recoverModel(_modelName){
    var _pointCloud = new THREE._PointCloud();
    _pointCloud._recoverModel(_modelName);
}

function pointCloudPickOn(){
    var _pointCloud = new THREE._PointCloud();
    _pointCloud._pointCloudPickOn();
}

function pointCloudPickOff(){
    var _pointCloud = new THREE._PointCloud();
    _pointCloud._pointCloudPickOff();
}

function pointCloudMouseDown(_x, _y, _callBack){
    var _pointCloud = new THREE._PointCloud();
    _pointCloud._mouseDown(_x, _y, _callBack);
}