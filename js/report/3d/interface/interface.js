window._animateOn = false;
window._animate = undefined;
window._frameNum = 0;
window._frameKey = 0;
window._distanceScaleRatio = 1;
window._specialPointCallBack = undefined;
window._camera = undefined;
window._scene = undefined;
window._renderer = undefined;
window._controls = undefined;
window._canvasWidth = 0;
window._canvasHeight = 0;
window._pickOn = false;
window._pick = undefined;
window._navigatorScene = undefined;
window._navigatorCamera = undefined;
window._navigatorViewPortWidth = 60;
window._navigatorViewPortHeight = 60;
window._navigatorViewPortLeft = 0;
window._navigatorViewPortBottom = 0;
window._navigatorOn = false;
window._navigatorViewOn = false;
window._navi = undefined;
window._measureDistanceOn = false;
window._measureDistance = undefined;
window._planeClipOn = false;
window._planeClip = undefined;
window._composeOn = false;
window._compose = undefined;
window._pickComposePointOn = false;

function composeMouseDown(_x, _y) {
    if (window._composeOn && window._pickComposePointOn) {
        window._compose._mouseDown(_x, _y);
    }
}

function composeMouseMove(_x, _y) {
    if (window._composeOn && window._pickComposePointOn) {
        window._compose._mouseMove(_x, _y);
    }
}

function composeMouseUp(_x, _y) {
    if (window._composeOn && window._pickComposePointOn) {
        window._compose._mouseUp(_x, _y);
    }
}

function clipMouseDown(_x, _y) {
    if (window._planeClipOn && window._planeClip) {
        window._planeClip._mouseDown(_x, _y);
    }
}

function clipMouseMove(_x, _y) {
    if (window._planeClipOn && window._planeClip) {
        window._planeClip._mouseMove(_x, _y);
    }
}

function clipMouseUp(_x, _y) {
    if (window._planeClipOn && window._planeClip) {
        window._planeClip._mouseUp(_x, _y);
    }
}

function measureDistanceMouseDown(_x, _y) {
    if (window._measureDistanceOn) {
        if (window._measureDistance) {
            window._measureDistance._mouseDown(_x, _y);
        }
    }
}

function measureDistanceMouseMove(_x, _y) {
    if (window._measureDistanceOn) {
        if (window._measureDistance) {
            window._measureDistance._mouseMove(_x, _y);
        }
    }
}

function measureDistanceMouseUp(_x, _y) {
    if (window._measureDistanceOn) {
        if (window._measureDistance) {
            window._measureDistance._mouseUp(_x, _y);
        }
    }
}

function pickMouseDown(_x, _y) {
    if (window._pickOn && window._pick) {
        if (window._pick._picker) {
            window._pick._picker._mouseDown(_x, _y);
        }
    }
}

function pickMouseMove(_x, _y) {
    if (window._pickOn && window._pick) {
        if (window._pick._picker) {
            if (window._pick._picker instanceof THREE._SquarePick) {
                window._pick._picker._mouseMove(_x, _y);
            }
        }
    }
}

function pickMouseUp(_x, _y) {
    if (window._pickOn && window._pick) {
        if (window._pick._picker) {
            if (window._pick._picker instanceof THREE._SquarePick) {
                window._pick._picker._mouseUp(_x, _y);
            }
        }
    }
}

function navigatorMouseDown(_x, _y) {
    if (window._navigatorViewOn && window._navi) {
        window._navi._mouseDown(_x, _y);
    }
}

function navigatorMouseMove(_x, _y) {
    if (window._navigatorViewOn && window._navi) {
        window._navi._mouseMove(_x, _y);
    }
}

function navigatorMouseUp(_x, _y) {
    if (window._navigatorViewOn && window._navi) {
        window._navi._mouseUp(_x, _y);
    }
}

//初始化
function draw(_canvasWidth, _canvasHeight, _fov, _near, _far, _ambientColor,
    _ambientIntensity, _pointColor, _pointIntensity, _backgroundColor) {
    var _drawAdaptor = new THREE._DrawAdaptor();
    _drawAdaptor._setScreenSize(_canvasWidth, _canvasHeight);
    _drawAdaptor._init(_fov, _near, _far, _ambientColor, _ambientIntensity,
        _pointColor, _pointIntensity, _backgroundColor);
}

//视图接口
function resizeCanvas(_canvasWidth, _canvasHeight) {
    var _drawAdaptor = new THREE._DrawAdaptor();
    _drawAdaptor._resizeCanvas(_canvasWidth, _canvasHeight);
    if (window._navigatorOn) {
        navigatorOff();
        var scaleRatio = 1;
        var navigatorViewPortWidth = 90;
        var navigatorViewPortHeight = 90;
        var navigatorViewPortLeft = window._canvasWidth - navigatorViewPortWidth;
        var navigatorViewPortBottom = 0;
        navigatorOn(scaleRatio, navigatorViewPortWidth, navigatorViewPortHeight, navigatorViewPortLeft, navigatorViewPortBottom);
    }
}

function setSceneBackgroundColor(_backgroundColor) {
    var _sceneManager = new THREE._SceneManager();
    _sceneManager._setSceneBackgroundColor(_backgroundColor);
}

function navigatorOn(_scaleRatio, _navigatorViewPortWidth, _navigatorViewPortHeight, _navigatorViewPortLeft, _navigatorViewPortBottom) {
    if (!window._navigatorOn) {
        window._navigatorOn = true;
        window._navi = new THREE._Navigator();
        window._navi._init(_scaleRatio, _navigatorViewPortWidth, _navigatorViewPortHeight, _navigatorViewPortLeft, _navigatorViewPortBottom);
    }
}

function navigatorOff() {
    if (window._navigatorOn) {
        window._navigatorOn = false;
        window._navi._destroy();
        window._navi = undefined;
    }
}

function navigatorFit() {
    var _controlManager = new THREE._ControlManager();
    var _eyePos = _controlManager._getEyePosition();
    var _up = _controlManager._getUp();
    var _target = _controlManager._getTarget();
    var _dist = window._controls._object.far / 16 * 3;
    var _dir = THREE._Vector3._new();
    THREE._Vector3._sub(_dir, _eyePos, _target);
    THREE._Vector3._normalize(_dir, _dir);
    THREE._Vector3._scale(_dir, _dir, _dist);
    var _sceneManager = new THREE._SceneManager();
    _sceneManager._findCertainGroup(window._scene, "ModelGroup");
    var _sceneBox = _sceneManager._getNodeBoundingBox(_sceneManager._certainGroup);
    var _x = (_sceneBox.max.x + _sceneBox.min.x) * 0.5;
    var _y = (_sceneBox.max.y + _sceneBox.min.y) * 0.5;
    var _z = (_sceneBox.max.z + _sceneBox.min.z) * 0.5;
    var _origin = THREE._Vector3._create(_x, _y, _z);
    var _eye = THREE._Vector3._new();
    THREE._Vector3._add(_eye, _dir, _origin);
    _controlManager._setEyePosition(_eye);
    _controlManager._setUp(_up);
    _controlManager._setTarget(_origin);
}

function navigatorFrontFace() {
    var _up = THREE._Vector3._create(0, 1, 0);
    var _target = THREE._Vector3._create(0, 0, 0);
    var _dist = window._controls._object.far / 16 * 3;
    var _eyePos = THREE._Vector3._create(0, 0, _dist);
    var _dir = THREE._Vector3._new();
    THREE._Vector3._sub(_dir, _eyePos, _target);
    THREE._Vector3._normalize(_dir, _dir);
    THREE._Vector3._scale(_dir, _dir, _dist);
    var _sceneManager = new THREE._SceneManager();
    _sceneManager._findCertainGroup(window._scene, "ModelGroup");
    var _sceneBox = _sceneManager._getNodeBoundingBox(_sceneManager._certainGroup);
    var _x = (_sceneBox.max.x + _sceneBox.min.x) * 0.5;
    var _y = (_sceneBox.max.y + _sceneBox.min.y) * 0.5;
    var _z = (_sceneBox.max.z + _sceneBox.min.z) * 0.5;
    var _origin = THREE._Vector3._create(_x, _y, _z);
    var _eye = THREE._Vector3._new();
    THREE._Vector3._add(_eye, _dir, _origin);
    var _controlManager = new THREE._ControlManager();
    _controlManager._setEyePosition(_eye);
    _controlManager._setUp(_up);
    _controlManager._setTarget(_origin);
    if (window._navigatorCamera) {
        window._navigatorCamera.position.set(0, 0, 6);
        window._navigatorCamera.up.set(0, 1, 0);
        window._navigatorCamera.lookAt(new THREE.Vector3(0, 0, 0));
    }
}

function navigatorLeftFace() {
    var _up = THREE._Vector3._create(0, 1, 0);
    var _target = THREE._Vector3._create(0, 0, 0);
    var _dist = window._controls._object.far / 16 * 3;
    var _eyePos = THREE._Vector3._create(-_dist, 0, 0);
    var _dir = THREE._Vector3._new();
    THREE._Vector3._sub(_dir, _eyePos, _target);
    THREE._Vector3._normalize(_dir, _dir);
    THREE._Vector3._scale(_dir, _dir, _dist);
    var _sceneManager = new THREE._SceneManager();
    _sceneManager._findCertainGroup(window._scene, "ModelGroup");
    var _sceneBox = _sceneManager._getNodeBoundingBox(_sceneManager._certainGroup);
    var _x = (_sceneBox.max.x + _sceneBox.min.x) * 0.5;
    var _y = (_sceneBox.max.y + _sceneBox.min.y) * 0.5;
    var _z = (_sceneBox.max.z + _sceneBox.min.z) * 0.5;
    var _origin = THREE._Vector3._create(_x, _y, _z);
    var _eye = THREE._Vector3._new();
    THREE._Vector3._add(_eye, _dir, _origin);
    var _controlManager = new THREE._ControlManager();
    _controlManager._setEyePosition(_eye);
    _controlManager._setUp(_up);
    _controlManager._setTarget(_origin);
    if (window._navigatorCamera) {
        window._navigatorCamera.position.set(-6, 0, 0);
        window._navigatorCamera.up.set(0, 1, 0);
        window._navigatorCamera.lookAt(new THREE.Vector3(0, 0, 0));
    }
}

function navigatorTopFace() {
    var _up = THREE._Vector3._create(0, 0, -1);
    var _target = THREE._Vector3._create(0, 0, 0);
    var _dist = window._controls._object.far / 16 * 3;
    var _eyePos = THREE._Vector3._create(0, _dist, 0);
    var _dir = THREE._Vector3._new();
    THREE._Vector3._sub(_dir, _eyePos, _target);
    THREE._Vector3._normalize(_dir, _dir);
    THREE._Vector3._scale(_dir, _dir, _dist);
    var _sceneManager = new THREE._SceneManager();
    _sceneManager._findCertainGroup(window._scene, "ModelGroup");
    var _sceneBox = _sceneManager._getNodeBoundingBox(_sceneManager._certainGroup);
    var _x = (_sceneBox.max.x + _sceneBox.min.x) * 0.5;
    var _y = (_sceneBox.max.y + _sceneBox.min.y) * 0.5;
    var _z = (_sceneBox.max.z + _sceneBox.min.z) * 0.5;
    var _origin = THREE._Vector3._create(_x, _y, _z);
    var _eye = THREE._Vector3._new();
    THREE._Vector3._add(_eye, _dir, _origin);
    var _controlManager = new THREE._ControlManager();
    _controlManager._setEyePosition(_eye);
    _controlManager._setUp(_up);
    _controlManager._setTarget(_origin);
    if (window._navigatorCamera) {
        window._navigatorCamera.position.set(0, 6, 0);
        window._navigatorCamera.up.set(0, 0, -1);
        window._navigatorCamera.lookAt(new THREE.Vector3(0, 0, 0));
    }
}

function navigatorViewOn() {
    if (!window._navigatorViewOn) {
        window._navigatorViewOn = true;
    }
    if (!window._navi) {
        window._navi = new THREE._Navigator();
    }
}

function navigatorViewOff() {
    if (window._navigatorViewOn) {
        window._navigatorViewOn = false;
    }
    if (window._navi && !window._navigatorOn) {
        window._navi = undefined;
    }
}

function navigatorViewSave() {
    var _controlManager = new THREE._ControlManager();
    var _target = _controlManager._getTarget();
    var _eyePos = _controlManager._getEyePosition();
    var _up = _controlManager._getUp();
    return { "_target": _target, "_eyePos": _eyePos, "_up": _up };
}

function navigatorViewReverse(_target, _eyePos, _up) {
    var _navigator = new THREE._Navigator();
    _navigator._reverseView(_target, _eyePos, _up);
}

//增删节点接口
function loadModel(_parentNode, _modelType, _modelName, _path, _callBack) {
    var _loadManager = new THREE._LoadManager();
    if (!_parentNode) {
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "ModelGroup");
        _parentNode = _sceneManager._certainNode;
    }
    _loadManager._loadModel(_parentNode, _modelType, _modelName, _path, _callBack);
}

function deleteModel(_modelName) {
    var _sceneManager = new THREE._SceneManager();
    _sceneManager._deleteModel(_modelName);
}

function loadSpecialPoint(_modelName, _pointList, _color, _distanceScaleRatio, _callBack) {
    var _loadManager = new THREE._LoadManager();
    _loadManager._loadSpecialPoint(_modelName, _pointList, _color, _distanceScaleRatio, _callBack);
}

function deleteSpecialPoint(_modelName) {
    var _sceneManager = new THREE._SceneManager();
    _sceneManager._deleteSpecialPoint(_modelName);
}

//节点交互接口
function specialPointCallBackOn(_callBack) {
    window._specialPointCallBack = _callBack;
}

function specialPointCallBackOff() {
    window._specialPointCallBack = undefined;
}

function hideNode(_modelName, _nodeType, _nodeName) {
    var _sceneManager = new THREE._SceneManager();
    _sceneManager._findCertainNode(window._scene, _modelName);
    _sceneManager._findCertainNode(_sceneManager._certainNode, _nodeType);
    _sceneManager._findCertainNode(_sceneManager._certainNode, _nodeName);
    _sceneManager._hideNode(_sceneManager._certainNode);
}

function showNode(_modelName, _nodeType, _nodeName) {
    var _sceneManager = new THREE._SceneManager();
    _sceneManager._findCertainNode(window._scene, _modelName);
    _sceneManager._findCertainNode(_sceneManager._certainNode, _nodeType);
    _sceneManager._findCertainNode(_sceneManager._certainNode, _nodeName);
    _sceneManager._showNode(_sceneManager._certainNode);
}

function modifyNodeGeometry(_modelName, _nodeType, _nodeName, _geometryType) {
    var _sceneManager = new THREE._SceneManager();
    _sceneManager._findCertainNode(window._scene, _modelName);
    _sceneManager._findCertainNode(_sceneManager._certainNode, _nodeType);
    _sceneManager._findCertainNode(_sceneManager._certainNode, _nodeName);
    var _scaleRatio = _sceneManager._certainNode.parent.userData._scaleRatio;
    _sceneManager._certainNode.geometry.dispose();
    if (_geometryType === "sphere") {
        _sceneManager._certainNode.geometry = new THREE.SphereBufferGeometry(_scaleRatio, 16, 16);
    } else if (_geometryType === "arrow") {
        _sceneManager._certainNode.geometry = new THREE.BoxBufferGeometry(_scaleRatio, _scaleRatio, _scaleRatio);
    }
}

function modifyNodeColor(_modelName, _nodeType, _nodeName, _color) {
    var _sceneManager = new THREE._SceneManager();
    _sceneManager._findCertainNode(window._scene, _modelName);
    _sceneManager._findCertainNode(_sceneManager._certainNode, _nodeType);
    _sceneManager._findCertainNode(_sceneManager._certainNode, _nodeName);
    _sceneManager._certainNode.material.color = _color;
    _sceneManager._certainNode.material.vertexColors = 0;
}

function reverseMeshColor(_modelName, _nodeType, _nodeName) {
    var _sceneManager = new THREE._SceneManager();
    _sceneManager._findCertainNode(window._scene, _modelName);
    if (_nodeType === "MeshGroup") {
        _sceneManager._findCertainNode(_sceneManager._certainNode, _nodeType);
        _sceneManager._findCertainNode(_sceneManager._certainNode, _nodeName);
        _sceneManager._certainNode.material.color = new THREE.Color(1, 1, 1);
        _sceneManager._certainNode.material.vertexColors = THREE.VertexColors;
    }
}

function modifyNodeOpacity(_modelName, _nodeType, _nodeName, _opacity) {
    var _sceneManager = new THREE._SceneManager();
    _sceneManager._findCertainNode(window._scene, _modelName);
    _sceneManager._findCertainNode(_sceneManager._certainNode, _nodeType);
    _sceneManager._findCertainNode(_sceneManager._certainNode, _nodeName);
    _sceneManager._certainNode.material.transparent = true;
    _sceneManager._certainNode.material.opacity = _opacity;
}

function pickOn(_pickTarget, _pickType, _groupType, _callback) {
    if (!window._boxClipOn && !window._measureDistanceOn
        && !window._measureAngleOn && !window._measureAreaOn && !window._pickOn) {
        window._pickOn = true;
        window._pick = new THREE._Pick();
        window._pick._init(_pickTarget, _groupType, _callback);
        if (_pickType === "PointerPick") {
            window._pick._picker = new THREE._PointerPick();
        } else if (_pickType === "SquarePick") {
            window._pick._picker = new THREE._SquarePick();
        }
    }
}

function pickOff() {
    if (window._pickOn) {
        window._pickOn = false;
        window._pick._destroy();
        window._pick = undefined;
    }
}

function switchPickType(_pickType) {
    if (window._pickOn && window._pick) {
        if (!window._pick._picker) {
            if (_pickType === "SquarePick") {
                window._pick._picker = new THREE._SquarePick();
            } else if (_pickType === "PointerPick") {
                window._pick._picker = new THREE._PointerPick();
            }
        } else if (window._pick._picker) {
            if (_pickType === "SquarePick") {
                if (window._pick._picker instanceof THREE._SquarePick) {
                    window._pick._picker._deleteSquare();
                } else if (window._pick._picker instanceof THREE._PointerPick) {
                    window._pick._picker = new THREE._SquarePick();
                }
            } else if (_pickType === "PointerPick") {
                if (window._pick._picker instanceof THREE._SquarePick) {
                    window._pick._picker._deleteSquare();
                    window._pick._picker = new THREE._PointerPick();
                }
            }
        }
    }
}

function switchGroupType(_groupType) {
    if (window._pickOn && window._pick) {
        window._pick._groupType = _groupType;
    }
}

function measureDistanceOn(_measureTarget) {
    if (!window._measureDistanceOn) {
        window._measureDistanceOn = true;
        window._measureDistance = new THREE._MeasureDistance();
        window._measureDistance._init();
        window._measureDistance._setMeasureTarget(_measureTarget);
    }
}

function measureDistanceOff() {
    if (window._measureDistanceOn) {
        window._measureDistanceOn = false;
        window._measureDistance._destroy();
        window._measureDistance = undefined;
    }
}

function setMeasureDistanceTarget(_measureTarget) {
    if (window._measureDistanceOn) {
        window._measureDistance._setMeasureTarget(_measureTarget);
    }
}

function clearMeasureDistance() {
    var _measureDistance = new THREE._MeasureDistance();
    _measureDistance._clearMeasureDistance();
}

function clipOn() {
    if (!window._planeClipOn) {
        window._planeClipOn = true;
        window._planeClip = new THREE._PlaneClip();
        window._planeClip._init();
    }
}

function clipOff() {
    if (window._planeClipOn) {
        window._planeClipOn = false;
        window._planeClip._destroy();
        window._planeClip = undefined;
    }
}

function createClipPlane(_clipPlaneId, _clipPlaneColor, _clipPlaneOpacity) {
    if (window._planeClipOn) {
        window._planeClip._createClipPlane(_clipPlaneId, _clipPlaneColor, _clipPlaneOpacity);
    }
}

function setClipPlaneNormal(_clipPlaneId, _clipPlaneNormal) {
    if (window._planeClipOn) {
        window._planeClip._setClipPlaneNormal(_clipPlaneId, _clipPlaneNormal);
    }
}

function setClipPlanePosition(_clipPlaneId, _clipPlanePosition) {
    if (window._planeClipOn) {
        window._planeClip._setClipPlanePosition(_clipPlaneId, _clipPlanePosition);
    }
}

function hideClipPlane(_clipPlaneId) {
    if (window._planeClipOn) {
        window._planeClip._hideClipPlane(_clipPlaneId);
    }
}

function showClipPlane(_clipPlaneId) {
    if (window._planeClipOn) {
        window._planeClip._showClipPlane(_clipPlaneId);
    }
}

function deleteClipPlane(_clipPlaneId) {
    if (window._planeClipOn) {
        window._planeClip._deleteClipPlane(_clipPlaneId);
    }
}

function clipPlaneInteractOn() {

}

function clipPlaneInteractOff() {

}

function composeOn() {
    if (!window._composeOn) {
        window._composeOn = true;
        window._compose = new THREE._Compose();
        window._compose._init();
    }
}

function composeOff() {
    if (window._composeOn) {
        window._composeOn = false;
        window._compose._destroy();
        window._compose = undefined;
    }
}

function createComposeTree(_composeTree) {
    if (window._composeOn) {
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "ModelGroup");
        window._compose._createComposeTree(_sceneManager._certainNode, _composeTree);
    }
}

function composeTreeLoadModel(_composeTreeNodeName, _modelType, _modelName, _path, _callBack) {
    if (window._composeOn) {
        window._compose._composeTreeLoadModel(_composeTreeNodeName, _modelType, _modelName, _path, _callBack);
    }
}

function setMainSubstructure(_mainNodeName, _substructureNodeName) {
    if (window._composeOn) {
        window._compose._setMainSubstructure(_mainNodeName, _substructureNodeName);
    }
}

function transformSubstructureNode(_position, _axis, _angle) {
    if (window._composeOn) {
        window._compose._transformSubstructureNode(_position, _axis, _angle);
    }
}

function setComposePoint(_composePointName) {
    if (window._composeOn) {
        window._compose._setComposePoint(_composePointName);
    }
}

function pickComposePointOn() {
    if (window._composeOn) {
        window._pickComposePointOn = true;
    }
}

function pickComposePointOff() {
    if (window._composeOn) {
        window._pickComposePointOn = false;
    }
}

function drawComposeMainPlane() {
    if (window._composeOn) {
        window._compose._drawMainPlane();
    }
}

function drawComposeReferencePlane0(_planeNormal) {
    if (window._composeOn) {
        window._compose._drawReferencePlane0(_planeNormal);
    }
}

function drawComposeReferencePlane1() {
    if (window._composeOn) {
        window._compose._drawReferencePlane1();
    }
}

function drawComposeReferencePlane2() {
    if (window._composeOn) {
        window._compose._drawReferencePlane2();
    }
}

function getComposeAssistanceGroup() {
    var _composeAssistanceGroup = undefined;
    if (window._composeOn) {
        _composeAssistanceGroup = window._compose._getComposeAssistanceGroup();
    }
    return _composeAssistanceGroup;
}

function compose(_step) {
    if (window._composeOn) {
        window._compose._compose(_step);
    }
}