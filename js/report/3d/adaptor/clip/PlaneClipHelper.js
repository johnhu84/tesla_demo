THREE._PlaneClipHelper = function(){

};

Object.assign(THREE._PlaneClipHelper.prototype, {
    _createClipPlane:function(_clipPlaneId, _clipPlaneColor, _clipPlaneOpacity){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "ModelGroup");
        var _boundingBox = _sceneManager._getNodeBoundingBox(_sceneManager._certainNode);
        var _width = _boundingBox.max.x - _boundingBox.min.x;
        _width = _width > (_boundingBox.max.y - _boundingBox.min.y) ? _width : (_boundingBox.max.y - _boundingBox.min.y);
        _width = _width > (_boundingBox.max.z - _boundingBox.min.z) ? _width : (_boundingBox.max.z - _boundingBox.min.z);
        _width += _width / 18;
        _width /= 2;
        var _center = [(_boundingBox.max.x + _boundingBox.min.x)/2, (_boundingBox.max.y + _boundingBox.min.y)/2, (_boundingBox.max.z + _boundingBox.min.z)/2];
        var _clipPlane = new THREE.Group();
        _clipPlane.name = "ClipPlane_" + _clipPlaneId;
        var _planeMesh = this._createPlaneMesh(_clipPlaneColor, _clipPlaneOpacity, _width);
        _clipPlane.add(_planeMesh);
        var _xMesh = this._createXMesh(_width);
        _clipPlane.add(_xMesh);
        var _yMesh = this._createYMesh(_width);
        _clipPlane.add(_yMesh);
        var _zMesh = this._createZMesh(_width);
        _clipPlane.add(_zMesh);
        var _y0zMesh = this._createY0ZMesh(_width);
        _clipPlane.add(_y0zMesh);
        var _z0xMesh = this._createZ0XMesh(_width);
        _clipPlane.add(_z0xMesh);
        var _x0yMesh = this._createX0YMesh(_width);
        _clipPlane.add(_x0yMesh);
        _clipPlane.translateX(_center[0]);
        _clipPlane.translateY(_center[1]);
        _clipPlane.translateZ(_center[2] + _width);
        return _clipPlane;
    },

    _createPlaneMesh:function(_color, _opacity, _width){
        var _geometry = new THREE.BufferGeometry();
        var _vertices = [];
        var _faces = [];
        _vertices = [_width, _width, 0, -_width, _width, 0, -_width, -_width, 0, _width, -_width, 0];
        _faces = [0, 1, 2, 0, 2, 3];
        var _positions = Float32Array.from(_vertices);
        _geometry.setIndex(_faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(_positions, 3));
        var _material = new THREE.MeshBasicMaterial({
            transparent:true,
            side:THREE.DoubleSide,
            opacity:_opacity,
            color:_color
        });
        var _planeMesh = new THREE.Mesh(_geometry, _material);
        _planeMesh.name = "PlaneMesh";
        return _planeMesh;
    },

    _createXMesh:function(_width){
        var _polyhedron = new THREE._Polyhedron();
        var _coneRadius = _width / 60;
        var _coneHeight = _width / 15;
        var _cylinderRadius = _width / 120;
        var _cylinderHeight = _width / 3;
        var _arrowGeometry = _polyhedron._getArrow(_coneRadius, _coneHeight, _cylinderRadius, _cylinderHeight);
        var _geometry = new THREE.BufferGeometry();
        _geometry.setIndex(_arrowGeometry._faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(Float32Array.from(_arrowGeometry._vertices), 3));
        var _material = new THREE.MeshBasicMaterial({
            color:0x00ff00
        });
        var _x = new THREE.Mesh(_geometry, _material);
        _x.name = "XMesh";
        _x.rotateZ(-Math.PI/2);
        return _x;
    },

    _createYMesh:function(_width){
        var _polyhedron = new THREE._Polyhedron();
        var _coneRadius = _width / 60;
        var _coneHeight = _width / 15;
        var _cylinderRadius = _width / 120;
        var _cylinderHeight = _width / 3;
        var _arrowGeometry = _polyhedron._getArrow(_coneRadius, _coneHeight, _cylinderRadius, _cylinderHeight);
        var _geometry = new THREE.BufferGeometry();
        _geometry.setIndex(_arrowGeometry._faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(Float32Array.from(_arrowGeometry._vertices), 3));
        var _material = new THREE.MeshBasicMaterial({
            color:0xff0000
        });
        var _y = new THREE.Mesh(_geometry, _material);
        _y.name = "YMesh";
        return _y;
    },

    _createZMesh:function(_width){
        var _polyhedron = new THREE._Polyhedron();
        var _coneRadius = _width / 60;
        var _coneHeight = _width / 15;
        var _cylinderRadius = _width / 120;
        var _cylinderHeight = _width / 3;
        var _arrowGeometry = _polyhedron._getArrow(_coneRadius, _coneHeight, _cylinderRadius, _cylinderHeight);
        var _geometry = new THREE.BufferGeometry();
        _geometry.setIndex(_arrowGeometry._faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(Float32Array.from(_arrowGeometry._vertices), 3));
        var _material = new THREE.MeshBasicMaterial({
            color:0x0000ff
        });
        var _z = new THREE.Mesh(_geometry, _material);
        _z.name = "ZMesh";
        _z.rotateX(Math.PI/2);
        return _z;
    },

    _createY0ZMesh:function(_width){
        var _polyhedron = new THREE._Polyhedron();
        var _radius = _width / 6;
        var _tube = _width / 120;
        var _radialSegments = 16;
        var _tubularSegments = 60;
        var _arc = Math.PI * 2;
        var _torusGeometry = _polyhedron._getTorus(_radius, _tube, _radialSegments, _tubularSegments, _arc);
        var _geometry = new THREE.BufferGeometry();
        _geometry.setIndex(_torusGeometry._faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(Float32Array.from(_torusGeometry._vertices), 3));
        var _material = new THREE.MeshBasicMaterial({
            color:0x00ff00
        });
        var _y0z = new THREE.Mesh(_geometry, _material);
        _y0z.name = "Y0ZMesh";
        _y0z.rotateY(-Math.PI/2);
        return _y0z;
    },

    _createZ0XMesh:function(_width){
        var _polyhedron = new THREE._Polyhedron();
        var _radius = _width / 6;
        var _tube = _width / 120;
        var _radialSegments = 16;
        var _tubularSegments = 60;
        var _arc = Math.PI * 2;
        var _torusGeometry = _polyhedron._getTorus(_radius, _tube, _radialSegments, _tubularSegments, _arc);
        var _geometry = new THREE.BufferGeometry();
        _geometry.setIndex(_torusGeometry._faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(Float32Array.from(_torusGeometry._vertices), 3));
        var _material = new THREE.MeshBasicMaterial({
            color:0xff0000
        });
        var _z0x = new THREE.Mesh(_geometry, _material);
        _z0x.name = "Z0XMesh";
        _z0x.rotateX(-Math.PI/2);
        return _z0x;
    },

    _createX0YMesh:function(_width){
        var _polyhedron = new THREE._Polyhedron();
        var _radius = _width / 6;
        var _tube = _width / 120;
        var _radialSegments = 16;
        var _tubularSegments = 60;
        var _arc = Math.PI * 2;
        var _torusGeometry = _polyhedron._getTorus(_radius, _tube, _radialSegments, _tubularSegments, _arc);
        var _geometry = new THREE.BufferGeometry();
        _geometry.setIndex(_torusGeometry._faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(Float32Array.from(_torusGeometry._vertices), 3));
        var _material = new THREE.MeshBasicMaterial({
            color:0x0000ff
        });
        var _x0y = new THREE.Mesh(_geometry, _material);
        _x0y.name = "X0YMesh";
        return _x0y;
    },

    _resizePlaneMesh:function(_node, _xModify, _xArea, _yModify, _yArea){
        var _vertices = _node.geometry.attributes.position.array;
        if(_xArea === "+"){
            _vertices[0] += _xModify;
            _vertices[9] += _xModify;
        }else if(_xArea === "-"){
            _vertices[3] += _xModify;
            _vertices[6] += _xModify;
        }
        if(_yArea === "+"){
            _vertices[1] += _yModify;
            _vertices[4] += _yModify;
        }else if(_yArea === "-"){
            _vertices[7] += _yModify;
            _vertices[10] += _yModify;
        }
        var _faces = [0, 1, 2, 0, 2, 3];
        _node.geometry.dispose();
        var _positions = Float32Array.from(_vertices);
        var _geometry = new THREE.BufferGeometry();
        _geometry.setIndex(_faces);
        _geometry.addAttribute('position', new THREE.BufferAttribute(_positions, 3));
        _node.geometry = _geometry;
    }
});