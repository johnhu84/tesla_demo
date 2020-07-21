THREE._NavigatorHelper = function(){
    this._obj = undefined;
    this._scaleRatio = 1;
};

Object.assign(THREE._NavigatorHelper.prototype, {
    _createNavigator:function(_scaleRatio, _navigatorViewPortWidth, _navigatorViewPortHeight,
                              _navigatorViewPortLeft, _navigatorViewPortBottom){
        this._obj = new THREE.Group();
        this._obj.name = "NavigatorGroup";
        this._setSize(_scaleRatio, _navigatorViewPortWidth, _navigatorViewPortHeight,
            _navigatorViewPortLeft, _navigatorViewPortBottom);
        var _arrowGeometry = this._initArrow();
        this._initX(_arrowGeometry);
        this._initY(_arrowGeometry);
        this._initZ(_arrowGeometry);
        var _torusGeometry = this._initTorus();
        this._initY0Z(_torusGeometry);
        this._initZ0X(_torusGeometry);
        this._initX0Y(_torusGeometry);
        window._navigatorScene = new THREE.Scene();
        window._navigatorScene.add(this._obj);
        var _cameraManager = new THREE._CameraManager();
        var _fov = 30;
        var _near = 0.1;
        var _far = 100;
        window._navigatorCamera = _cameraManager._initCamera(_fov, window._navigatorViewPortWidth,
            window._navigatorViewPortHeight, _near, _far);
        this._setView();
    },

    _deleteNavigator:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._clearNode(window._navigatorScene);
        window._navigatorScene = undefined;
        window._navigatorCamera = undefined;
        window._navigatorViewPortWidth = 60;
        window._navigatorViewPortHeight = 60;
        window._navigatorViewPortLeft = 0;
        window._navigatorViewPortBottom = 0;
    },

    _setSize:function(_scaleRatio, _navigatorViewPortWidth, _navigatorViewPortHeight, _navigatorViewPortLeft, _navigatorViewPortBottom){
        this._scaleRatio = _scaleRatio;
        window._navigatorViewPortWidth = _navigatorViewPortWidth;
        window._navigatorViewPortHeight = _navigatorViewPortHeight;
        window._navigatorViewPortLeft = _navigatorViewPortLeft;
        window._navigatorViewPortBottom = _navigatorViewPortBottom;
    },

    _setView:function(){
        var _viewMatrix = window._camera.matrixWorldInverse.elements;
        var _viewX = THREE._Vector3._create(_viewMatrix[0], _viewMatrix[1], _viewMatrix[2]);
        var _viewY = THREE._Vector3._create(_viewMatrix[4], _viewMatrix[5], _viewMatrix[6]);
        var _viewZ = THREE._Vector3._create(_viewMatrix[8], _viewMatrix[9], _viewMatrix[10]);
        var _viewDir = THREE._Vector3._create(0, 0, 1);
        var _angleViewX = THREE._Vector3._angle(_viewDir, _viewX);
        var _x = Math.cos(_angleViewX);
        var _angleViewY = THREE._Vector3._angle(_viewDir, _viewY);
        var _y = Math.cos(_angleViewY);
        var _angleViewZ = THREE._Vector3._angle(_viewDir, _viewZ);
        var _z = Math.cos(_angleViewZ);
        var _eyePos = THREE._Vector3._create(_x, _y, _z);
        THREE._Vector3._scale(_eyePos, _eyePos, 6);
        var _upDir = THREE._Vector3._create(0, 1, 0);
        var _angleUpX = THREE._Vector3._angle(_upDir, _viewX);
        var _ux = Math.cos(_angleUpX);
        var _angleUpY = THREE._Vector3._angle(_upDir, _viewY);
        var _uy = Math.cos(_angleUpY);
        var _angleUpZ = THREE._Vector3._angle(_upDir, _viewZ);
        var _uz = Math.cos(_angleUpZ);
        var _up = THREE._Vector3._create(_ux, _uy, _uz);
        window._navigatorCamera.position.set(_eyePos[0], _eyePos[1], _eyePos[2]);
        window._navigatorCamera.up.set(_up[0], _up[1], _up[2]);
        window._navigatorCamera.lookAt(new THREE.Vector3());
    },

    //坐标轴箭头
    _initArrow:function(){
        var _polyhedron = new THREE._Polyhedron();
        //圆锥
        var _cone = _polyhedron._getCone(0.06, 0.2, 16);
        for(var i=0; i<_cone._vertices.length-1; i=i+3){
            _cone._vertices[i+1] = _cone._vertices[i+1] + 0.8;
        }
        //圆柱
        var _cylinder = _polyhedron._getCylinder(0.03, 0.8, 16);
        var _vertices = _cone._vertices.concat(_cylinder._vertices);
        for(var i=0; i<_cylinder._faces.length; i++){
            _cylinder._faces[i] += _cone._vertices.length/3;
        }
        var _faces = _cone._faces.concat(_cylinder._faces);
        return {"_vertices": _vertices, "_faces": _faces};
    },

    //初始化轨迹环
    _initTorus:function(){
        var _polyhedron = new THREE._Polyhedron();
        //圆环
        return _polyhedron._getTorus(0.6 , 0.03, 16, 60, Math.PI*2);
    },

    //初始化x轴
    _initX:function(_arrowGeometry){
        //geometry
        var _geometry = new THREE.BufferGeometry();
        _geometry.setIndex(_arrowGeometry._faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(Float32Array.from(_arrowGeometry._vertices), 3));
        //material
        var _material = new THREE.MeshBasicMaterial({
            color:0xffff00,
            depthTest:false
        });
        //mesh
        var _x = new THREE.Mesh(_geometry, _material);
        _x.renderOrder = 1;
        _x.name = "axisHelper_axisX";
        _x.rotateZ(-Math.PI/2);
        _x.scale.set(this._scaleRatio, this._scaleRatio, this._scaleRatio);
        this._obj.add(_x);
    },

    //初始化y轴
    _initY:function(_arrowGeometry){
        //geometry
        var _geometry = new THREE.BufferGeometry();
        _geometry.setIndex(_arrowGeometry._faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(Float32Array.from(_arrowGeometry._vertices), 3));
        //material
        var _material = new THREE.MeshBasicMaterial({
            color:0xff0000,
            depthTest:false
        });
        //mesh
        var _y = new THREE.Mesh(_geometry, _material);
        _y.renderOrder = 1;
        _y.name = "axisHelper_axisY";
        _y.scale.set(this._scaleRatio, this._scaleRatio, this._scaleRatio);
        this._obj.add(_y);
    },

    //初始化z轴
    _initZ:function(_arrowGeometry){
        //geometry
        var _geometry = new THREE.BufferGeometry();
        _geometry.setIndex(_arrowGeometry._faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(Float32Array.from(_arrowGeometry._vertices), 3));
        //material
        var _material = new THREE.MeshBasicMaterial({
            color:0x0000ff,
            depthTest:false
        });
        //mesh
        var _z = new THREE.Mesh(_geometry, _material);
        _z.renderOrder = 1;
        _z.name = "axisHelper_axisZ";
        _z.rotateX(Math.PI/2);
        _z.scale.set(this._scaleRatio, this._scaleRatio, this._scaleRatio);
        this._obj.add(_z);
    },

    //初始化y0z轨迹环
    _initY0Z:function(_torusGeometry){
        //geometry
        var _geometry = new THREE.BufferGeometry();
        _geometry.setIndex(_torusGeometry._faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(Float32Array.from(_torusGeometry._vertices), 3));
        //material
        var _material = new THREE.MeshBasicMaterial({
            color:0xffff00,
            depthTest:false
        });
        //mesh
        var _y0z = new THREE.Mesh(_geometry, _material);
        _y0z.renderOrder = 1;
        _y0z.name = "axisHelper_torusY0Z";
        _y0z.rotateY(-Math.PI/2);
        _y0z.scale.set(this._scaleRatio, this._scaleRatio, this._scaleRatio);
        this._obj.add(_y0z);
    },

    //初始化z0x轨迹环
    _initZ0X:function(_torusGeometry){
        //geometry
        var _geometry = new THREE.BufferGeometry();
        _geometry.setIndex(_torusGeometry._faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(Float32Array.from(_torusGeometry._vertices), 3));
        //material
        var _material = new THREE.MeshBasicMaterial({
            color:0xff0000,
            depthTest:false
        });
        //mesh
        var _z0x = new THREE.Mesh(_geometry, _material);
        _z0x.renderOrder = 1;
        _z0x.name = "axisHelper_torusZ0X";
        _z0x.rotateX(-Math.PI/2);
        _z0x.scale.set(this._scaleRatio, this._scaleRatio, this._scaleRatio);
        this._obj.add(_z0x);
    },

    //初始化x0y轨迹环
    _initX0Y:function(_torusGeometry){
        //geometry
        var _geometry = new THREE.BufferGeometry();
        _geometry.setIndex(_torusGeometry._faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(Float32Array.from(_torusGeometry._vertices), 3));
        //material
        var _material = new THREE.MeshBasicMaterial({
            color:0x0000ff,
            depthTest:false
        });
        //mesh
        var _x0y = new THREE.Mesh(_geometry, _material);
        _x0y.renderOrder = 1;
        _x0y.name = "axisHelper_torusX0Y";
        _x0y.scale.set(this._scaleRatio, this._scaleRatio, this._scaleRatio);
        this._obj.add(_x0y);
    }
});