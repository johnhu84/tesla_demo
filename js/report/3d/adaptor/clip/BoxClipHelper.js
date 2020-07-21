THREE._BoxClipHelper = function(){
    this._clipType = "BoxClip";
    //顶部剖切面
    this._topPlane = undefined;
    this._topPlaneMesh = undefined;
    this._yMax = 0;
    //底部剖切面
    this._bottomPlane = undefined;
    this._bottomPlaneMesh = undefined;
    this._yMin = 0;
    //左侧剖切面
    this._leftPlane = undefined;
    this._leftPlaneMesh = undefined;
    this._xMin = 0;
    //右侧剖切面
    this._rightPlane = undefined;
    this._rightPlaneMesh = undefined;
    this._xMax = 0;
    //前方剖切面
    this._frontPlane = undefined;
    this._frontPlaneMesh = undefined;
    this._zMax = 0;
    //后方剖切面
    this._backPlane = undefined;
    this._backPlaneMesh = undefined;
    this._zMin = 0;

    this._obj = undefined;
    this._planeUpdate = "";//用户正在拖动的剖切面
};

Object.assign(THREE._BoxClipHelper.prototype, {
    //隐藏剖切面
    _hidePlaneMesh:function(){
        if(this._obj){
            var _sceneManager = new THREE._SceneManager();
            _sceneManager._hideNode(this._obj);
        }
    },

    //显示剖斜面
    _showPlaneMesh:function(){
        if(this._obj){
            var _sceneManager = new THREE._SceneManager();
            _sceneManager._showNode(this._obj);
        }
    },

    //初始化剖切盒
    _initBox:function(){
        this._obj = new THREE.Group();
        this._obj.name = "BoxClipGroup";
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainGroup(window._scene, "ModelGroup");
        var _boundingBox = _sceneManager._getNodeBoundingBox(_sceneManager._certainGroup);
        var _length = Math.sqrt(
            Math.pow((_boundingBox.max.x - _boundingBox.min.x), 2) +
            Math.pow((_boundingBox.max.y - _boundingBox.min.y), 2) +
            Math.pow((_boundingBox.max.z - _boundingBox.min.z), 2));
        this._xMax = _boundingBox.max.x + _length / 36;
        this._xMin = _boundingBox.min.x - _length / 36;
        this._yMax = _boundingBox.max.y + _length / 36;
        this._yMin = _boundingBox.min.y - _length / 36;
        this._zMax = _boundingBox.max.z + _length / 36;
        this._zMin = _boundingBox.min.z - _length / 36;
        //初始化top
        this._initTop();
        //初始化bottom
        this._initBottom();
        //初始化front
        this._initFront();
        //初始化back
        this._initBack();
        //初始化left
        this._initLeft();
        //初始化right
        this._initRight();
    },

    _destoryBox:function(){
        var _sceneManager = new THREE._SceneManager();
        if(this._obj){
            _sceneManager._deleteNode(this._obj, "BoxClipTopPlane");
            _sceneManager._deleteNode(this._obj, "BoxClipBottomPlane");
            _sceneManager._deleteNode(this._obj, "BoxClipFrontPlane");
            _sceneManager._deleteNode(this._obj, "BoxClipBackPlane");
            _sceneManager._deleteNode(this._obj, "BoxClipLeftPlane");
            _sceneManager._deleteNode(this._obj, "BoxClipRightPlane");
        }
    },

    //初始化top
    _initTop:function(){
        var _top = this._xMax - 0;
        this._topPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), _top);
        var _geometry = new THREE.BufferGeometry();
        var _vertices = [this._xMax, this._yMax, this._zMax, this._xMax, this._yMax, this._zMin, this._xMin, this._yMax, this._zMax, this._xMin, this._yMax, this._zMin];
        var _faces = [0, 1, 2, 2, 1, 3];
        var _positions = Float32Array.from(_vertices);
        _geometry.setIndex(_faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(_positions, 3));
        var _material = new THREE.MeshBasicMaterial({
            transparent:true,
            side:THREE.DoubleSide,
            opacity:0.1,
            color:0xffff00
        });
        this._topPlaneMesh = new THREE.Mesh(_geometry, _material);
        this._topPlaneMesh.name = "BoxClipTopPlane";
        this._obj.add(this._topPlaneMesh);
    },

    //初始化bottom
    _initBottom:function(){
        var _bottom = 0 - this._xMin;
        this._bottomPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), _bottom);
        //底面平面mesh
        var _geometry = new THREE.BufferGeometry();
        var _vertices = [this._xMax, this._yMin, this._zMax, this._xMax, this._yMin, this._zMin, this._xMin, this._yMin, this._zMax, this._xMin, this._yMin, this._zMin];
        var _faces = [1, 0, 2, 1, 2, 3];
        var _positions = Float32Array.from(_vertices);
        _geometry.setIndex(_faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(_positions, 3));
        var _material = new THREE.MeshBasicMaterial({
            transparent:true,
            side:THREE.DoubleSide,
            opacity:0.1,
            color:0xffff00
        });
        this._bottomPlaneMesh = new THREE.Mesh(_geometry, _material);
        this._bottomPlaneMesh.name = "BoxClipBottomPlane";
        this._obj.add(this._bottomPlaneMesh);
    },

    //初始化front
    _initFront:function(){
        var _front = this._zMax - 0;
        this._frontPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), _front);
        //底面平面mesh
        var _geometry = new THREE.BufferGeometry();
        var _vertices = [this._xMax, this._yMax, this._zMax, this._xMax, this._yMin, this._zMax, this._xMin, this._yMax, this._zMax, this._xMin, this._yMin, this._zMax];
        var _faces = [1, 0, 2, 1, 2, 3];
        var _positions = Float32Array.from(_vertices);
        _geometry.setIndex(_faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(_positions, 3));
        var _material = new THREE.MeshBasicMaterial({
            transparent:true,
            side:THREE.DoubleSide,
            opacity:0.1,
            color:0xffaa00
        });
        this._frontPlaneMesh = new THREE.Mesh(_geometry, _material);
        this._frontPlaneMesh.name = "BoxClipFrontPlane";
        this._obj.add(this._frontPlaneMesh);
    },

    //初始化back
    _initBack:function(){
        var _back = 0 - this._zMin;
        this._backPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), _back);
        //底面平面mesh
        var _geometry = new THREE.BufferGeometry();
        var _vertices = [this._xMax, this._yMax, this._zMin, this._xMax, this._yMin, this._zMin, this._xMin, this._yMax, this._zMin, this._xMin, this._yMin, this._zMin];
        var _faces = [0, 1, 2, 2, 1, 3];
        var _positions = Float32Array.from(_vertices);
        _geometry.setIndex(_faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(_positions, 3));
        var _material = new THREE.MeshBasicMaterial({
            transparent:true,
            side:THREE.DoubleSide,
            opacity:0.1,
            color:0xffaa00
        });
        this._backPlaneMesh = new THREE.Mesh(_geometry, _material);
        this._backPlaneMesh.name = "BoxClipBackPlane";
        this._obj.add(this._backPlaneMesh);
    },

    //初始化left
    _initLeft:function(){
        var _left = 0 - this._xMin;
        this._leftPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), _left);
        //底面平面mesh
        var _geometry = new THREE.BufferGeometry();
        var _vertices = [this._xMin, this._yMax, this._zMin, this._xMin, this._yMin, this._zMin, this._xMin, this._yMax, this._zMax, this._xMin, this._yMin, this._zMax];
        var _faces = [0, 1, 2, 2, 1, 3];
        var _positions = Float32Array.from(_vertices);
        _geometry.setIndex(_faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(_positions, 3));
        var _material = new THREE.MeshBasicMaterial({
            transparent:true,
            side:THREE.DoubleSide,
            opacity:0.1,
            color:0xff6600
        });
        this._leftPlaneMesh = new THREE.Mesh(_geometry, _material);
        this._leftPlaneMesh.name = "BoxClipLeftPlane";
        this._obj.add(this._leftPlaneMesh);
    },

    //初始化right
    _initRight:function(){
        var _right = this._xMax - 0;
        this._rightPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), _right);
        //底面平面mesh
        var _geometry = new THREE.BufferGeometry();
        var _vertices = [this._xMax, this._yMax, this._zMin, this._xMax, this._yMin, this._zMin, this._xMax, this._yMax, this._zMax, this._xMax, this._yMin, this._zMax];
        var _faces = [1, 0, 2, 1, 2, 3];
        var _positions = Float32Array.from(_vertices);
        _geometry.setIndex(_faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(_positions, 3));
        var _material = new THREE.MeshBasicMaterial({
            transparent:true,
            side:THREE.DoubleSide,
            opacity:0.1,
            color:0xff6600
        });
        this._rightPlaneMesh = new THREE.Mesh(_geometry, _material);
        this._rightPlaneMesh.name = "BoxClipRightPlane";
        this._obj.add(this._rightPlaneMesh);
    },

    //更新剖切盒
    _updateBox:function(_distance){
        if(this._planeUpdate === "BoxClipTopPlane"){
            this._yMax += _distance;
            this._modifyFrontPlaneMesh();
            this._modifyBackPlaneMesh();
            this._modifyLeftPlaneMesh();
            this._modifyRightPlaneMesh();
            this._translateTopPlane(_distance);
        }else if(this._planeUpdate === "BoxClipBottomPlane"){
            this._yMin += _distance;
            this._modifyFrontPlaneMesh();
            this._modifyBackPlaneMesh();
            this._modifyLeftPlaneMesh();
            this._modifyRightPlaneMesh();
            this._translateBottomPlane(_distance);
        }else if(this._planeUpdate === "BoxClipFrontPlane"){
            this._zMax += _distance;
            this._modifyTopPlaneMesh();
            this._modifyBottomPlaneMesh();
            this._modifyLeftPlaneMesh();
            this._modifyRightPlaneMesh();
            this._translateFrontPlane(_distance);
        }else if(this._planeUpdate === "BoxClipBackPlane"){
            this._zMin += _distance;
            this._modifyTopPlaneMesh();
            this._modifyBottomPlaneMesh();
            this._modifyLeftPlaneMesh();
            this._modifyRightPlaneMesh();
            this._translateBackPlane(_distance);
        }else if(this._planeUpdate === "BoxClipLeftPlane"){
            this._xMin += _distance;
            this._modifyTopPlaneMesh();
            this._modifyBottomPlaneMesh();
            this._modifyFrontPlaneMesh();
            this._modifyBackPlaneMesh();
            this._translateLeftPlane(_distance);
        }else if(this._planeUpdate === "BoxClipRightPlane"){
            this._xMax += _distance;
            this._modifyTopPlaneMesh();
            this._modifyBottomPlaneMesh();
            this._modifyFrontPlaneMesh();
            this._modifyBackPlaneMesh();
            this._translateRightPlane(_distance);
        }
        //修正模型材质启用clip
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainGroup(window._scene, "ModelGroup");
        _sceneManager._enableClip(_sceneManager._certainGroup, [this._topPlane, this._bottomPlane, this._frontPlane, this._backPlane, this._leftPlane, this._rightPlane]);
    },

    //更新topPlaneMesh
    _modifyTopPlaneMesh:function(){
        //清除原先mesh
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._deleteNode(this._obj, "BoxClipTopPlane");
        this._topPlaneMesh = undefined;
        //重新构造mesh
        var _geometry = new THREE.BufferGeometry();
        var _vertices = [this._xMax, this._yMax, this._zMax, this._xMax, this._yMax, this._zMin, this._xMin, this._yMax, this._zMax, this._xMin, this._yMax, this._zMin];
        var _faces = [0, 1, 2, 2, 1, 3];
        var _positions = Float32Array.from(_vertices);
        _geometry.setIndex(_faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(_positions, 3));
        var _material = new THREE.MeshBasicMaterial({
            transparent:true,
            side:THREE.DoubleSide,
            opacity:0.1,
            color:0xffff00
        });
        this._topPlaneMesh = new THREE.Mesh(_geometry, _material);
        this._topPlaneMesh.name = "BoxClipTopPlane";
        this._obj.add(this._topPlaneMesh);
    },

    //更新bottomPlaneMesh
    _modifyBottomPlaneMesh:function(){
        //清除原先mesh
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._deleteNode(this._obj, "BoxClipBottomPlane");
        this._bottomPlaneMesh = undefined;
        //重新构造mesh
        var _geometry = new THREE.BufferGeometry();
        var _vertices = [this._xMax, this._yMin, this._zMax, this._xMax, this._yMin, this._zMin, this._xMin, this._yMin, this._zMax, this._xMin, this._yMin, this._zMin];
        var _faces = [1, 0, 2, 1, 2, 3];
        var _positions = Float32Array.from(_vertices);
        _geometry.setIndex(_faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(_positions, 3));
        var _material = new THREE.MeshBasicMaterial({
            transparent:true,
            side:THREE.DoubleSide,
            opacity:0.1,
            color:0xffff00
        });
        this._bottomPlaneMesh = new THREE.Mesh(_geometry, _material);
        this._bottomPlaneMesh.name = "BoxClipBottomPlane";
        this._obj.add(this._bottomPlaneMesh);
    },

    _modifyFrontPlaneMesh:function(){
        //清除原先mesh
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._deleteNode(this._obj, "BoxClipFrontPlane");
        this._frontPlaneMesh = undefined;
        //重新构造mesh
        var _geometry = new THREE.BufferGeometry();
        var _vertices = [this._xMax, this._yMax, this._zMax, this._xMax, this._yMin, this._zMax, this._xMin, this._yMax, this._zMax, this._xMin, this._yMin, this._zMax];
        var _faces = [1, 0, 2, 1, 2, 3];
        var _positions = Float32Array.from(_vertices);
        _geometry.setIndex(_faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(_positions, 3));
        var _material = new THREE.MeshBasicMaterial({
            transparent:true,
            side:THREE.DoubleSide,
            opacity:0.1,
            color:0xffaa00
        });
        this._frontPlaneMesh = new THREE.Mesh(_geometry, _material);
        this._frontPlaneMesh.name = "BoxClipFrontPlane";
        this._obj.add(this._frontPlaneMesh);
    },

    _modifyBackPlaneMesh:function(){
        //清除原先mesh
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._deleteNode(this._obj, "BoxClipBackPlane");
        this._backPlaneMesh = undefined;
        //重新构造mesh
        var _geometry = new THREE.BufferGeometry();
        var _vertices = [this._xMax, this._yMax, this._zMin, this._xMax, this._yMin, this._zMin, this._xMin, this._yMax, this._zMin, this._xMin, this._yMin, this._zMin];
        var _faces = [0, 1, 2, 2, 1, 3];
        var _positions = Float32Array.from(_vertices);
        _geometry.setIndex(_faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(_positions, 3));
        var _material = new THREE.MeshBasicMaterial({
            transparent:true,
            side:THREE.DoubleSide,
            opacity:0.1,
            color:0xffaa00
        });
        this._backPlaneMesh = new THREE.Mesh(_geometry, _material);
        this._backPlaneMesh.name = "BoxClipBackPlane";
        this._obj.add(this._backPlaneMesh);
    },

    _modifyLeftPlaneMesh:function(){
        //清除原先mesh
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._deleteNode(this._obj, "BoxClipLeftPlane");
        this._leftPlaneMesh = undefined;
        //重新构造mesh
        var _geometry = new THREE.BufferGeometry();
        var _vertices = [this._xMin, this._yMax, this._zMin, this._xMin, this._yMin, this._zMin, this._xMin, this._yMax, this._zMax, this._xMin, this._yMin, this._zMax];
        var _faces = [0, 1, 2, 2, 1, 3];
        var _positions = Float32Array.from(_vertices);
        _geometry.setIndex(_faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(_positions, 3));
        var _material = new THREE.MeshBasicMaterial({
            transparent:true,
            side:THREE.DoubleSide,
            opacity:0.1,
            color:0xff6600
        });
        this._leftPlaneMesh = new THREE.Mesh(_geometry, _material);
        this._leftPlaneMesh.name = "BoxClipLeftPlane";
        this._obj.add(this._leftPlaneMesh);
    },

    _modifyRightPlaneMesh:function(){
        //清除原先mesh
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._deleteNode(this._obj, "BoxClipRightPlane");
        this._rightPlaneMesh = undefined;
        //重新构造mesh
        var _geometry = new THREE.BufferGeometry();
        var _vertices = [this._xMax, this._yMax, this._zMin, this._xMax, this._yMin, this._zMin, this._xMax, this._yMax, this._zMax, this._xMax, this._yMin, this._zMax];
        var _faces = [1, 0, 2, 1, 2, 3];
        var _positions = Float32Array.from(_vertices);
        _geometry.setIndex(_faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(_positions, 3));
        var _material = new THREE.MeshBasicMaterial({
            transparent:true,
            side:THREE.DoubleSide,
            opacity:0.1,
            color:0xff6600
        });
        this._rightPlaneMesh = new THREE.Mesh(_geometry, _material);
        this._rightPlaneMesh.name = "BoxClipRightPlane";
        this._obj.add(this._rightPlaneMesh);
    },

    _translateTopPlane:function(_distance){
        var _top = this._yMax - 0;
        this._topPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), _top);
        this._topPlaneMesh.translateY(_distance);
    },

    _translateBottomPlane:function(_distance){
        var _bottom = 0 - this._yMin;
        this._bottomPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), _bottom);
        this._bottomPlaneMesh.translateY(_distance);
    },

    _translateFrontPlane:function(_distance){
        var _front = this._zMax - 0;
        this._frontPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), _front);
        this._frontPlaneMesh.translateZ(_distance);
    },

    _translateBackPlane:function(_distance){
        var _back = 0 - this._zMin;
        this._backPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), _back);
        this._backPlaneMesh.translateZ(_distance);
    },

    _translateLeftPlane:function(_distance){
        var _left = 0 - this._xMin;
        this._leftPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), _left);
        this._leftPlaneMesh.translateX(_distance);
    },

    _translateRightPlane:function(_distance){
        var _right = this._xMax - 0;
        this._rightPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), _right);
        this._rightPlaneMesh.translateX(_distance);
    },

    //空间坐标转屏幕坐标
    _modelSpaceToScreenSpace:function(_pos){
        var _viewPos = THREE._Matrix4._transferVectorByMatrix(_pos, window._camera.matrixWorldInverse.elements);
        _viewPos[3] = 1;
        var _clipPos = THREE._Matrix4._transferVectorByMatrix(_viewPos, window._camera.projectionMatrix.elements);
        //转ndc
        var _ndcPos = [_clipPos[0] / _clipPos[3], _clipPos[1] / _clipPos[3], _clipPos[2] / _clipPos[3]];
        var _fragCoord = [0, 0, 0, 1];
        _fragCoord[0] = (_ndcPos[0] + 1.0) / 2.0;
        _fragCoord[1] = (-_ndcPos[1] + 1.0) / 2.0;
        _fragCoord[2] = (_ndcPos[2] + 1.0) / 2.0;
        _fragCoord[0] *= window._canvasWidth;
        _fragCoord[1] *= window._canvasHeight;
        return [_fragCoord[0], _fragCoord[1], 0];
    },

    //计算y轴在屏幕上的投影向量
    _computeScreenYDir:function(){
        var _y0 = [0, 0, 0, 1];
        var _y1 = [0, 1, 0, 1];
        var _screen0 = this._modelSpaceToScreenSpace(_y0);
        var _screen1 = this._modelSpaceToScreenSpace(_y1);
        var _screenYDir = THREE._Vector3._new();
        THREE._Vector3._sub(_screenYDir, _screen1, _screen0);
        return _screenYDir;
    },

    //计算x轴在屏幕上的投影向量
    _computeScreenXDir:function(){
        var _x0 = [0, 0, 0, 1];
        var _x1 = [1, 0, 0, 1];
        var _screen0 = this._modelSpaceToScreenSpace(_x0);
        var _screen1 = this._modelSpaceToScreenSpace(_x1);
        var _screenXDir = THREE._Vector3._new();
        THREE._Vector3._sub(_screenXDir, _screen1, _screen0);
        return _screenXDir;
    },

    //计算z轴在屏幕上的投影向量
    _computeScreenZDir:function(){
        var _z0 = [0, 0, 0, 1];
        var _z1 = [0, 0, 1, 1];
        var _screen0 = this._modelSpaceToScreenSpace(_z0);
        var _screen1 = this._modelSpaceToScreenSpace(_z1);
        var _screenZDir = THREE._Vector3._new();
        THREE._Vector3._sub(_screenZDir, _screen1, _screen0);
        return _screenZDir;
    }
});