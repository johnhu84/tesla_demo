THREE._DrawAdaptor = function(){

};

Object.assign(THREE._DrawAdaptor.prototype, {
    _setScreenSize:function(_width, _height){
        window._canvasWidth = _width;
        window._canvasHeight = _height;
    },

    _init:function(_fov, _near, _far, _ambientColor, _ambientIntensity, _pointColor, _pointIntensity, _backgroundColor){
        this._initScene(_backgroundColor);
        this._initCamera(_fov, _near, _far);
        this._initLight(_ambientColor, _ambientIntensity, _pointColor, _pointIntensity);
        this._initModelGroup();
        this._initRenderer();
        this._initControls();
        this._initDrawManager();
    },

    _initScene:function(_backgroundColor){
        var _sceneManager = new THREE._SceneManager();
        window._scene = _sceneManager._initScene(_backgroundColor);
    },

    _initCamera:function(_fov, _near, _far){
        var _cameraManager = new THREE._CameraManager();
        window._camera = _cameraManager._initCamera(_fov, window._canvasWidth, window._canvasHeight, _near, _far);
        window._camera.position.set(0, 0, 6);
        window._scene.add(window._camera);
    },

    _initLight:function(_ambientColor, _ambientIntensity, _pointColor, _pointIntensity){
        var _lightManager = new THREE._LightManager();
        _lightManager._addAmbientLight(window._scene, _ambientColor, _ambientIntensity);
        _lightManager._addPointLight(window._camera, _pointColor, _pointIntensity);
    },

    _initModelGroup:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._initModelGroup(window._scene);
    },

    _initRenderer:function(_clearColor){
        var _renderManager = new THREE._RenderManager();
        _renderManager._initRenderer(_clearColor);
    },

    _initControls:function(){
        var _controlManager = new THREE._ControlManager();
        _controlManager._initControls();
    },

    _initDrawManager:function(){
        var _drawManager = new THREE._DrawManager();
        _drawManager._startLoop();
    },

    _resizeCanvas:function(_width, _height){
        window._canvasWidth = _width;
        window._canvasHeight = _height;
        window._controls._object.aspect = window._canvasWidth / window._canvasHeight;
        window._controls._object.updateProjectionMatrix();
        window._renderer.setSize(window._canvasWidth, window._canvasHeight);
    }
});