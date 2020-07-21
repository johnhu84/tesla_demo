window._ocTree = undefined;
window._ocTreeLeafVertexNum = 0;
window._ocTreeFaceNum = 0;
window._ocTreeDistMax = 1000000;
window._ocTreeDistMin = -1000000;
window._ocTreeIndex = 0;

THREE._OCTree = function(){
    this._depth = 0;
    this._isLeaf = false;
    this._boundingBox = undefined;
    this._faceList = [];
    this._vertexList = [];
    this._parent = undefined;
    this._sectionXYZ = undefined;
    this._bBoxXYZ = undefined;
    this._sectionXYz = undefined;
    this._bBoxXYz = undefined;
    this._sectionxYz = undefined;
    this._bBoxxYz = undefined;
    this._sectionxYZ = undefined;
    this._bBoxxYZ = undefined;
    this._sectionXyZ = undefined;
    this._bBoxXyZ = undefined;
    this._sectionXyz = undefined;
    this._bBoxXyz = undefined;
    this._sectionxyz = undefined;
    this._bBoxxyz = undefined;
    this._sectionxyZ = undefined;
    this._bBoxxyZ = undefined;
};

Object.assign(THREE._OCTree.prototype, {
    _vb:function(_v, _b){
        var _inside = false;
        if(_v[0] >= _b.min.x && _v[0] <= _b.max.x
            && _v[1] >= _b.min.y && _v[1] <= _b.max.y
            && _v[2] >= _b.min.z && _v[2] <= _b.max.z){
            _inside = true;
        }
        return _inside;
    },

    _fb:function(_fb, _b){
        var _inside = false;
        if(_fb.min.x >= _b.min.x && _fb.max.x <= _b.max.x
            && _fb.min.y >= _b.min.y && _fb.max.y <= _b.max.y
            && _fb.min.z >= _b.min.z && _fb.max.z <= _b.max.z){
            _inside = true;
        }
        return _inside;
    },

    _insertVertex:function(_tree, _treeDepth, _boundingBox, _parent, _vertex){
        if(!_tree._boundingBox){
            _tree._boundingBox = _boundingBox;
        }
        if(!_tree._parent){
            _tree._parent = _parent;
        }
        if(_tree._depth === 0){
            if(!_parent){
                _tree._depth = 1;
            }else if(_parent){
                _tree._depth = _tree._parent._depth + 1;
            }
        }
        if(_tree._depth < _treeDepth){
            if(!_tree._bBoxXYZ){
                _tree._splitBoundingBox();
            }
            if(_tree._vb(_vertex, _tree._bBoxXYZ)){
                if(!_tree._sectionXYZ){
                    _tree._sectionXYZ = new THREE._OCTree();
                }
                _tree._sectionXYZ._insertVertex(_tree._sectionXYZ, _treeDepth, _tree._bBoxXYZ, _tree, _vertex);
            }
            if(_tree._vb(_vertex, _tree._bBoxXYz)){
                if(!_tree._sectionXYz){
                    _tree._sectionXYz = new THREE._OCTree();
                }
                _tree._sectionXYz._insertVertex(_tree._sectionXYz, _treeDepth, _tree._bBoxXYz, _tree, _vertex);
            }
            if(_tree._vb(_vertex, _tree._bBoxxYz)){
                if(!_tree._sectionxYz){
                    _tree._sectionxYz = new THREE._OCTree();
                }
                _tree._sectionxYz._insertVertex(_tree._sectionxYz, _treeDepth, _tree._bBoxxYz, _tree, _vertex);
            }
            if(_tree._vb(_vertex, _tree._bBoxxYZ)){
                if(!_tree._sectionxYZ){
                    _tree._sectionxYZ = new THREE._OCTree();
                }
                _tree._sectionxYZ._insertVertex(_tree._sectionxYZ, _treeDepth, _tree._bBoxxYZ, _tree, _vertex);
            }
            if(_tree._vb(_vertex, _tree._bBoxXyZ)){
                if(!_tree._sectionXyZ){
                    _tree._sectionXyZ = new THREE._OCTree();
                }
                _tree._sectionXyZ._insertVertex(_tree._sectionXyZ, _treeDepth, _tree._bBoxXyZ, _tree, _vertex);
            }
            if(_tree._vb(_vertex, _tree._bBoxXyz)){
                if(!_tree._sectionXyz){
                    _tree._sectionXyz = new THREE._OCTree();
                }
                _tree._sectionXyz._insertVertex(_tree._sectionXyz, _treeDepth, _tree._bBoxXyz, _tree, _vertex);
            }
            if(_tree._vb(_vertex, _tree._bBoxxyz)){
                if(!_tree._sectionxyz){
                    _tree._sectionxyz = new THREE._OCTree();
                }
                _tree._sectionxyz._insertVertex(_tree._sectionxyz, _treeDepth, _tree._bBoxxyz, _tree, _vertex);
            }
            if(_tree._vb(_vertex, _tree._bBoxxyZ)){
                if(!_tree._sectionxyZ){
                    _tree._sectionxyZ = new THREE._OCTree();
                }
                _tree._sectionxyZ._insertVertex(_tree._sectionxyZ, _treeDepth, _tree._bBoxxyZ, _tree, _vertex);
            }
        }else if(_tree._depth === _treeDepth){
            if(!_tree._isLeaf){
                _tree._isLeaf = true;
            }
            if(_tree._vertexList.length === 0){
                _tree._vertexList.push(_vertex);
            }
        }
    },

    _insertFace:function(_tree, _treeDepth, _boundingBox, _parent, _face){
        if(!_tree._boundingBox){
            _tree._boundingBox = _boundingBox;
        }
        if(!_tree._parent){
            _tree._parent = _parent;
        }
        if(_tree._depth === 0){
            if(!_parent){
                _tree._depth = 1;
            }else if(_parent){
                _tree._depth = _tree._parent._depth + 1;
            }
        }
        if(_tree._depth < _treeDepth){
            var _inherited = false;
            if(!_tree._bBoxXYZ){
                _tree._splitBoundingBox();
            }
            if(_tree._fb(_face.boundingBox, _tree._bBoxXYZ)){
                if(!_tree._sectionXYZ){
                    _tree._sectionXYZ = new THREE._OCTree();
                }
                _tree._sectionXYZ._insertFace(_tree._sectionXYZ, _treeDepth, _tree._bBoxXYZ, _tree, _face);
                _inherited = true;
            }
            if(_tree._fb(_face.boundingBox, _tree._bBoxXYz)){
                if(!_tree._sectionXYz){
                    _tree._sectionXYz = new THREE._OCTree();
                }
                _tree._sectionXYz._insertFace(_tree._sectionXYz, _treeDepth, _tree._bBoxXYz, _tree, _face);
                _inherited = true;
            }
            if(_tree._fb(_face.boundingBox, _tree._bBoxxYz)){
                if(!_tree._sectionxYz){
                    _tree._sectionxYz = new THREE._OCTree();
                }
                _tree._sectionxYz._insertFace(_tree._sectionxYz, _treeDepth, _tree._bBoxxYz, _tree, _face);
                _inherited = true;
            }
            if(_tree._fb(_face.boundingBox, _tree._bBoxxYZ)){
                if(!_tree._sectionxYZ){
                    _tree._sectionxYZ = new THREE._OCTree();
                }
                _tree._sectionxYZ._insertFace(_tree._sectionxYZ, _treeDepth, _tree._bBoxxYZ, _tree, _face);
                _inherited = true;
            }
            if(_tree._fb(_face.boundingBox, _tree._bBoxXyZ)){
                if(!_tree._sectionXyZ){
                    _tree._sectionXyZ = new THREE._OCTree();
                }
                _tree._sectionXyZ._insertFace(_tree._sectionXyZ, _treeDepth, _tree._bBoxXyZ, _tree, _face);
                _inherited = true;
            }
            if(_tree._fb(_face.boundingBox, _tree._bBoxXyz)){
                if(!_tree._sectionXyz){
                    _tree._sectionXyz = new THREE._OCTree();
                }
                _tree._sectionXyz._insertFace(_tree._sectionXyz, _treeDepth, _tree._bBoxXyz, _tree, _face);
                _inherited = true;
            }
            if(_tree._fb(_face.boundingBox, _tree._bBoxxyz)){
                if(!_tree._sectionxyz){
                    _tree._sectionxyz = new THREE._OCTree();
                }
                _tree._sectionxyz._insertFace(_tree._sectionxyz, _treeDepth, _tree._bBoxxyz, _tree, _face);
                _inherited = true;
            }
            if(_tree._fb(_face.boundingBox, _tree._bBoxxyZ)){
                if(!_tree._sectionxyZ){
                    _tree._sectionxyZ = new THREE._OCTree();
                }
                _tree._sectionxyZ._insertFace(_tree._sectionxyZ, _treeDepth, _tree._bBoxxyZ, _tree, _face);
                _inherited = true;
            }
            if(!_inherited){
                _tree._faceList.push(_face);
            }
        }else if(_tree._depth === _treeDepth){
            if(!_tree._isLeaf){
                _tree._isLeaf = true;
            }
            _tree._faceList.push(_face);
        }
    },

    _traverseTree:function(_tree){
        if(_tree._sectionXYZ){
            this._traverseTree(_tree._sectionXYZ);
        }
        if(_tree._sectionXYz){
            this._traverseTree(_tree._sectionXYz);
        }
        if(_tree._sectionXyZ){
            this._traverseTree(_tree._sectionXyZ);
        }
        if(_tree._sectionXyz){
            this._traverseTree(_tree._sectionXyz);
        }
        if(_tree._sectionxYZ){
            this._traverseTree(_tree._sectionxYZ);
        }
        if(_tree._sectionxYz){
            this._traverseTree(_tree._sectionxYz);
        }
        if(_tree._sectionxyZ){
            this._traverseTree(_tree._sectionxyZ);
        }
        if(_tree._sectionxyz){
            this._traverseTree(_tree._sectionxyz);
        }
        if(_tree._isLeaf){
            if(_tree._vertexList.length !== 0){
                window._ocTreeLeafVertexNum += _tree._vertexList.length;
            }
        }
        if(_tree._faceList.length !== 0){
            window._ocTreeFaceNum += _tree._faceList.length;
        }
    },

    _drawTree:function(_tree, _node){
        if(_tree._sectionXYZ){
            this._drawTree(_tree._sectionXYZ, _node);
        }
        if(_tree._sectionXYz){
            this._drawTree(_tree._sectionXYz, _node);
        }
        if(_tree._sectionXyZ){
            this._drawTree(_tree._sectionXyZ, _node);
        }
        if(_tree._sectionXyz){
            this._drawTree(_tree._sectionXyz, _node);
        }
        if(_tree._sectionxYZ){
            this._drawTree(_tree._sectionxYZ, _node);
        }
        if(_tree._sectionxYz){
            this._drawTree(_tree._sectionxYz, _node);
        }
        if(_tree._sectionxyZ){
            this._drawTree(_tree._sectionxyZ, _node);
        }
        if(_tree._sectionxyz){
            this._drawTree(_tree._sectionxyz, _node);
        }
        if(_tree._isLeaf){
            if(_tree._vertexList.length !== 0){
                this._drawFrame(_tree._boundingBox, _node);
            }
        }
    },

    _computeVertexFaceDist:function(_tree){
        if(_tree._sectionXYZ){
            this._computeVertexFaceDist(_tree._sectionXYZ);
        }
        if(_tree._sectionXYz){
            this._computeVertexFaceDist(_tree._sectionXYz);
        }
        if(_tree._sectionXyZ){
            this._computeVertexFaceDist(_tree._sectionXyZ);
        }
        if(_tree._sectionXyz){
            this._computeVertexFaceDist(_tree._sectionXyz);
        }
        if(_tree._sectionxYZ){
            this._computeVertexFaceDist(_tree._sectionxYZ);
        }
        if(_tree._sectionxYz){
            this._computeVertexFaceDist(_tree._sectionxYz);
        }
        if(_tree._sectionxyZ){
            this._computeVertexFaceDist(_tree._sectionxyZ);
        }
        if(_tree._sectionxyz){
            this._computeVertexFaceDist(_tree._sectionxyz);
        }
        if(_tree._isLeaf){
            var _faceList = [];
            _tree._findFaceList(_tree, _faceList);
            if(_tree._vertexList.length !== 0){
                for(var i=0; i<_tree._vertexList.length; i++){
                    var _minD = 0;
                    for(var j=0; j<_faceList.length; j++){
                        var _dist = THREE._Vector3._distPointToFace(_tree._vertexList[i], _faceList[j]);
                        if(_dist){
                            if(_minD === 0){
                                _minD = _dist;
                            }else if(_minD !== 0 && Math.abs(_dist) < Math.abs(_minD)){
                                _minD = _dist;
                            }
                        }
                    }
                    _tree._vertexList[i] = {"vertex":_tree._vertexList[i], "dist":_minD};
                }
            }
        }
    },

    _findFaceList:function(_tree, _faceList){
        if(_tree._faceList.length !== 0){
            for(var i=0; i<_tree._faceList.length; i++){
                _faceList.push(_tree._faceList[i]);
            }
        }
        if(_tree._parent){
            _tree._findFaceList(_tree._parent, _faceList);
        }
    },

    _getMaxMinDist:function(_tree){
        if(_tree._sectionXYZ){
            this._getMaxMinDist(_tree._sectionXYZ);
        }
        if(_tree._sectionXYz){
            this._getMaxMinDist(_tree._sectionXYz);
        }
        if(_tree._sectionXyZ){
            this._getMaxMinDist(_tree._sectionXyZ);
        }
        if(_tree._sectionXyz){
            this._getMaxMinDist(_tree._sectionXyz);
        }
        if(_tree._sectionxYZ){
            this._getMaxMinDist(_tree._sectionxYZ);
        }
        if(_tree._sectionxYz){
            this._getMaxMinDist(_tree._sectionxYz);
        }
        if(_tree._sectionxyZ){
            this._getMaxMinDist(_tree._sectionxyZ);
        }
        if(_tree._sectionxyz){
            this._getMaxMinDist(_tree._sectionxyz);
        }
        if(_tree._isLeaf){
            if(_tree._vertexList.length !== 0){
                for(var i=0; i<_tree._vertexList.length; i++){
                    if(window._ocTreeDistMin === -1000000){
                        window._ocTreeDistMin = _tree._vertexList[i].dist;
                    }else if(window._ocTreeDistMin !== -1000000 && window._ocTreeDistMin > _tree._vertexList[i].dist){
                        window._ocTreeDistMin = _tree._vertexList[i].dist;
                    }
                    if(window._ocTreeDistMax === 1000000){
                        window._ocTreeDistMax = _tree._vertexList[i].dist;
                    }else if(window._ocTreeDistMax !== 1000000 && window._ocTreeDistMax < _tree._vertexList[i].dist){
                        window._ocTreeDistMax = _tree._vertexList[i].dist;
                    }
                }
            }
        }
    },

    _computeVertexColor:function(_tree){
        if(_tree._sectionXYZ){
            this._computeVertexColor(_tree._sectionXYZ);
        }
        if(_tree._sectionXYz){
            this._computeVertexColor(_tree._sectionXYz);
        }
        if(_tree._sectionXyZ){
            this._computeVertexColor(_tree._sectionXyZ);
        }
        if(_tree._sectionXyz){
            this._computeVertexColor(_tree._sectionXyz);
        }
        if(_tree._sectionxYZ){
            this._computeVertexColor(_tree._sectionxYZ);
        }
        if(_tree._sectionxYz){
            this._computeVertexColor(_tree._sectionxYz);
        }
        if(_tree._sectionxyZ){
            this._computeVertexColor(_tree._sectionxyZ);
        }
        if(_tree._sectionxyz){
            this._computeVertexColor(_tree._sectionxyz);
        }
        if(_tree._isLeaf){
            if(_tree._vertexList.length !== 0){
                for(var i=0; i<_tree._vertexList.length; i++){
                    var _r, _g, _b;
                    if(_tree._vertexList[i].dist < 0){
                        if((_tree._vertexList[i].dist - window._ocTreeDistMin) <= (0 - window._ocTreeDistMin)/5){
                            _r = 0; _g = 0.2; _b = 0.8;
                        }else if((_tree._vertexList[i].dist - window._ocTreeDistMin) > (0 - window._ocTreeDistMin)/5
                            && (_tree._vertexList[i].dist - window._ocTreeDistMin) <= (0 - window._ocTreeDistMin)/5*2){
                            _r = 0; _g = 0.4; _b = 0.6;
                        }else if((_tree._vertexList[i].dist - window._ocTreeDistMin) > (0 - window._ocTreeDistMin)/5*2
                            && (_tree._vertexList[i].dist - window._ocTreeDistMin) <= (0 - window._ocTreeDistMin)/5*3){
                            _r = 0; _g = 0.5; _b = 0.5;
                        }else if((_tree._vertexList[i].dist - window._ocTreeDistMin) > (0 - window._ocTreeDistMin)/5*3
                            && (_tree._vertexList[i].dist - window._ocTreeDistMin) <= (0 - window._ocTreeDistMin)/5*4){
                            _r = 0; _g = 0.6; _b = 0.4;
                        }else if((_tree._vertexList[i].dist - window._ocTreeDistMin) > (0 - window._ocTreeDistMin)/5*4
                            && (_tree._vertexList[i].dist - window._ocTreeDistMin) <= (0 - window._ocTreeDistMin)){
                            _r = 0; _g = 0.8; _b = 0.2;
                        }
                    }else if(_tree._vertexList[i].dist === 0){
                        _r = 0; _g = 1; _b = 0;
                    }else if(_tree._vertexList[i].dist > 0){
                        if((_tree._vertexList[i].dist - 0) <= window._ocTreeDistMax/5){
                            _r = 0.2; _g = 0.8; _b = 0;
                        }else if((_tree._vertexList[i].dist - 0) > window._ocTreeDistMax/5
                            && (_tree._vertexList[i].dist - 0) <= window._ocTreeDistMax/5*2){
                            _r = 0.4; _g = 0.6; _b = 0;
                        }else if((_tree._vertexList[i].dist - 0) > window._ocTreeDistMax/5*2
                            && (_tree._vertexList[i].dist - 0) <= window._ocTreeDistMax/5*3){
                            _r = 0.5; _g = 0.5; _b = 0;
                        }else if((_tree._vertexList[i].dist - 0) > window._ocTreeDistMax/5*3
                            && (_tree._vertexList[i].dist - 0) <= window._ocTreeDistMax/5*4){
                            _r = 0.6; _g = 0.4; _b = 0;
                        }else if((_tree._vertexList[i].dist - 0) > window._ocTreeDistMax/5*4
                            && (_tree._vertexList[i].dist - 0) <= window._ocTreeDistMax){
                            _r = 0.8; _g = 0.2; _b = 0;
                        }
                    }
                    _tree._vertexList[i] = {
                        "vertex":_tree._vertexList[i].vertex,
                        "dist":_tree._vertexList[i].dist,
                        "color":[_r, _g, _b, 1]
                    };
                }
            }
        }
    },

    _drawPointCloud:function(_tree, _pointCloudGroup){
        if(_tree._sectionXYZ){
            this._drawPointCloud(_tree._sectionXYZ, _pointCloudGroup);
        }
        if(_tree._sectionXYz){
            this._drawPointCloud(_tree._sectionXYz, _pointCloudGroup);
        }
        if(_tree._sectionXyZ){
            this._drawPointCloud(_tree._sectionXyZ, _pointCloudGroup);
        }
        if(_tree._sectionXyz){
            this._drawPointCloud(_tree._sectionXyz, _pointCloudGroup);
        }
        if(_tree._sectionxYZ){
            this._drawPointCloud(_tree._sectionxYZ, _pointCloudGroup);
        }
        if(_tree._sectionxYz){
            this._drawPointCloud(_tree._sectionxYz, _pointCloudGroup);
        }
        if(_tree._sectionxyZ){
            this._drawPointCloud(_tree._sectionxyZ, _pointCloudGroup);
        }
        if(_tree._sectionxyz){
            this._drawPointCloud(_tree._sectionxyz, _pointCloudGroup);
        }
        if(_tree._isLeaf){
            if(_tree._vertexList.length !== 0){
                for(var i=0; i<_tree._vertexList.length; i++){
                    var _r = _tree._vertexList[i].color[0];
                    var _g = _tree._vertexList[i].color[1];
                    var _b = _tree._vertexList[i].color[2];
                    var _color = new THREE.Color(_r, _g, _b);
                    var _material = new THREE.SpriteMaterial({
                        color:_color
                    });
                    var _sp = new THREE.Sprite(_material);
                    _sp.scale.set(2, 2, 2);
                    _sp.position.set(_tree._vertexList[i].vertex[0], _tree._vertexList[i].vertex[1], _tree._vertexList[i].vertex[2]);
                    _sp.name = "bp_" + window._ocTreeIndex;
                    _sp.userData = {"dist":_tree._vertexList[i].dist, "color":[_r, _g, _b]};
                    _pointCloudGroup.add(_sp);
                    window._ocTreeIndex++;
                }
            }
        }
    },

    _intrudePCL:function(_tree, _color, _position){
        if(_tree._sectionXYZ){
            if(_tree._vb(_position, _tree._bBoxXYZ)){
                this._intrudePCL(_tree._sectionXYZ, _color, _position);
            }
        }
        if(_tree._sectionXYz){
            if(_tree._vb(_position, _tree._bBoxXYz)){
                this._intrudePCL(_tree._sectionXYz, _color, _position);
            }
        }
        if(_tree._sectionXyZ){
            if(_tree._vb(_position, _tree._bBoxXyZ)){
                this._intrudePCL(_tree._sectionXyZ, _color, _position);
            }
        }
        if(_tree._sectionXyz){
            if(_tree._vb(_position, _tree._bBoxXyz)){
                this._intrudePCL(_tree._sectionXyz, _color, _position);
            }
        }
        if(_tree._sectionxYZ){
            if(_tree._vb(_position, _tree._bBoxxYZ)){
                this._intrudePCL(_tree._sectionxYZ, _color, _position);
            }
        }
        if(_tree._sectionxYz){
            if(_tree._vb(_position, _tree._bBoxxYz)){
                this._intrudePCL(_tree._sectionxYz, _color, _position);
            }
        }
        if(_tree._sectionxyZ){
            if(_tree._vb(_position, _tree._bBoxxyZ)){
                this._intrudePCL(_tree._sectionxyZ, _color, _position);
            }
        }
        if(_tree._sectionxyz){
            if(_tree._vb(_position, _tree._bBoxxyz)){
                this._intrudePCL(_tree._sectionxyz, _color, _position);
            }
        }
        if(_tree._isLeaf){
            var _r = 0;
            var _g = 1;
            var _b = 0;
            var _a = 1;
            if(_tree._vertexList.length !== 0){
                _r = _tree._vertexList[0].color[0];
                _g = _tree._vertexList[0].color[1];
                _b = _tree._vertexList[0].color[2];
                _a = _tree._vertexList[0].color[3];
            }
            _color.push(_r, _g, _b, _a);
        }
    },

    _findLeaf:function(_tree, _position, _callBack){
        if(_tree._sectionXYZ){
            if(_tree._vb(_position, _tree._bBoxXYZ)){
                this._findLeaf(_tree._sectionXYZ, _position, _callBack);
            }
        }
        if(_tree._sectionXYz){
            if(_tree._vb(_position, _tree._bBoxXYz)){
                this._findLeaf(_tree._sectionXYz, _position, _callBack);
            }
        }
        if(_tree._sectionXyZ){
            if(_tree._vb(_position, _tree._bBoxXyZ)){
                this._findLeaf(_tree._sectionXyZ, _position, _callBack);
            }
        }
        if(_tree._sectionXyz){
            if(_tree._vb(_position, _tree._bBoxXyz)){
                this._findLeaf(_tree._sectionXyz, _position, _callBack);
            }
        }
        if(_tree._sectionxYZ){
            if(_tree._vb(_position, _tree._bBoxxYZ)){
                this._findLeaf(_tree._sectionxYZ, _position, _callBack);
            }
        }
        if(_tree._sectionxYz){
            if(_tree._vb(_position, _tree._bBoxxYz)){
                this._findLeaf(_tree._sectionxYz, _position, _callBack);
            }
        }
        if(_tree._sectionxyZ){
            if(_tree._vb(_position, _tree._bBoxxyZ)){
                this._findLeaf(_tree._sectionxyZ, _position, _callBack);
            }
        }
        if(_tree._sectionxyz){
            if(_tree._vb(_position, _tree._bBoxxyz)){
                this._findLeaf(_tree._sectionxyz, _position, _callBack);
            }
        }
        if(_tree._isLeaf){
            if(_tree._vertexList.length !== 0){
                var _pos = _tree._vertexList[0].vertex;
                var _dist = _tree._vertexList[0].dist;
                var _color = _tree._vertexList[0].color;
                if(_callBack instanceof Function){
                    _callBack(_pos, _dist, _color);
                }
            }
        }
    },

    _splitBoundingBox:function(){
        var _xi = this._boundingBox.min.x;
        var _yi = this._boundingBox.min.y;
        var _zi = this._boundingBox.min.z;
        var _xm = (this._boundingBox.max.x + this._boundingBox.min.x)/2;
        var _ym = (this._boundingBox.max.y + this._boundingBox.min.y)/2;
        var _zm = (this._boundingBox.max.z + this._boundingBox.min.z)/2;
        var _xa = this._boundingBox.max.x;
        var _ya = this._boundingBox.max.y;
        var _za = this._boundingBox.max.z;
        this._bBoxXYZ = {"max":{"x":_xa, "y":_ya, "z":_za}, "min":{"x":_xm, "y":_ym, "z":_zm}};
        this._bBoxXYz = {"max":{"x":_xa, "y":_ya, "z":_zm}, "min":{"x":_xm, "y":_ym, "z":_zi}};
        this._bBoxxYz = {"max":{"x":_xm, "y":_ya, "z":_zm}, "min":{"x":_xi, "y":_ym, "z":_zi}};
        this._bBoxxYZ = {"max":{"x":_xm, "y":_ya, "z":_za}, "min":{"x":_xi, "y":_ym, "z":_zm}};
        this._bBoxXyZ = {"max":{"x":_xa, "y":_ym, "z":_za}, "min":{"x":_xm, "y":_yi, "z":_zm}};
        this._bBoxXyz = {"max":{"x":_xa, "y":_ym, "z":_zm}, "min":{"x":_xm, "y":_yi, "z":_zi}};
        this._bBoxxyz = {"max":{"x":_xm, "y":_ym, "z":_zm}, "min":{"x":_xi, "y":_yi, "z":_zi}};
        this._bBoxxyZ = {"max":{"x":_xm, "y":_ym, "z":_za}, "min":{"x":_xi, "y":_yi, "z":_zm}};
    },

    _drawFrame:function(_boundingBox, _node){
        var _p___ = new THREE.Vector3(_boundingBox.max.x, _boundingBox.max.y, _boundingBox.max.z);
        var _p__0 = new THREE.Vector3(_boundingBox.max.x, _boundingBox.max.y, _boundingBox.min.z);
        var _p_00 = new THREE.Vector3(_boundingBox.max.x, _boundingBox.min.y, _boundingBox.min.z);
        var _p_0_ = new THREE.Vector3(_boundingBox.max.x, _boundingBox.min.y, _boundingBox.max.z);
        var _p0__ = new THREE.Vector3(_boundingBox.min.x, _boundingBox.max.y, _boundingBox.max.z);
        var _p0_0 = new THREE.Vector3(_boundingBox.min.x, _boundingBox.max.y, _boundingBox.min.z);
        var _p000 = new THREE.Vector3(_boundingBox.min.x, _boundingBox.min.y, _boundingBox.min.z);
        var _p00_ = new THREE.Vector3(_boundingBox.min.x, _boundingBox.min.y, _boundingBox.max.z);
        var _lineGeo = new THREE.Geometry();
        _lineGeo.vertices.push(_p___, _p__0, _p_00, _p_0_, _p___, _p0__, _p0_0, _p000, _p00_, _p0__, _p0_0, _p__0, _p_00, _p000, _p00_, _p_0_);
        var _lineMtl = new THREE.LineBasicMaterial({
            color:0xff0000
        });
        var _line = new THREE.Line(_lineGeo, _lineMtl);
        _node.add(_line);
    }
});