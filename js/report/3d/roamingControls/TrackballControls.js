THREE._TrackballControls = function(_object, _domElement){
	this._object = _object;
	this._domElement = (_domElement !== undefined) ? _domElement : document;
	this._enabled = true;
	this._screen = {_left:0, _top:0, _width:0, _height:0};
	this._rotateSpeed = 1.0;
	this._zoomSpeed = 1.2;
	this._panSpeed = 0.3;
	this._noRotate = false;
	this._noZoom = false;
	this._noPan = false;
	this._staticMoving = false;
	this._dynamicDampingFactor = 0.2;
	this._minDistance = 0;
	this._maxDistance = Infinity;
	this._keys = [65/*A*/, 83/*S*/, 68/*D*/];
	this._target = new THREE.Vector3();
    this._target0 = this._target.clone();
    this._position0 = this._object.position.clone();
    this._up0 = this._object.up.clone();
    var _this = this;
    var _STATE = {_NONE:- 1, _ROTATE:2, _ZOOM:1, _PAN:1, _TOUCH_ROTATE:3, _TOUCH_ZOOM_PAN:4};
	var _EPS = 0.000001;
	var _lastPosition = new THREE.Vector3();
	var _state = _STATE._NONE,
		_prevState = _STATE._NONE,
		_eye = new THREE.Vector3(),
		_movePrev = new THREE.Vector2(),
		_moveCurr = new THREE.Vector2(),
		_lastAxis = new THREE.Vector3(),
		_lastAngle = 0,
		_zoomStart = new THREE.Vector2(),
		_zoomEnd = new THREE.Vector2(),
		_touchZoomDistanceStart = 0,
		_touchZoomDistanceEnd = 0,
		_panStart = new THREE.Vector2(),
		_panEnd = new THREE.Vector2();
	var _changeEvent = {type: 'change'};
	var _startEvent = {type: 'start'};
	var _endEvent = {type: 'end'};
	this._handleResize = function(){
		if(this._domElement === document){
			this._screen._left = 0;
			this._screen._top = 0;
			this._screen._width = window.innerWidth;
			this._screen._height = window.innerHeight;
		}else{
			var _box = this._domElement.getBoundingClientRect();
			var _d = this._domElement.ownerDocument.documentElement;
			this._screen._left = _box.left + window.pageXOffset - _d.clientLeft;
			this._screen._top = _box.top + window.pageYOffset - _d.clientTop;
			this._screen._width = _box.width;
			this._screen._height = _box.height;
		}
	};
	var _getMouseOnScreen = (function(){
		var _vector = new THREE.Vector2();
		return function _getMouseOnScreen(_pageX, _pageY){
			_vector.set(
				(_pageX - _this._screen._left) / _this._screen._width,
				(_pageY - _this._screen._top) / _this._screen._height
			);
			return _vector;
		};
	}());
	var _getMouseOnCircle = (function(){
		var _vector = new THREE.Vector2();
		return function _getMouseOnCircle(_pageX, _pageY){
			_vector.set(
				((_pageX - _this._screen._width * 0.5 - _this._screen._left) / (_this._screen._width * 0.5)),
				((_this._screen._height + 2 * (_this._screen._top - _pageY)) / _this._screen._width)
			);
			return _vector;
		};
	}());
	this._rotateCamera = (function(){
		var _axis = new THREE.Vector3(),
			_quaternion = new THREE.Quaternion(),
			_eyeDirection = new THREE.Vector3(),
			_objectUpDirection = new THREE.Vector3(),
			_objectSidewaysDirection = new THREE.Vector3(),
			_moveDirection = new THREE.Vector3(),
			_angle;
		return function _rotateCamera(){
			_moveDirection.set(_moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0);
			_angle = _moveDirection.length();
			if(_angle){
				_eye.copy(_this._object.position).sub(_this._target);
				_eyeDirection.copy(_eye).normalize();
				_objectUpDirection.copy(_this._object.up).normalize();
				_objectSidewaysDirection.crossVectors(_objectUpDirection, _eyeDirection).normalize();
				_objectUpDirection.setLength(_moveCurr.y - _movePrev.y);
				_objectSidewaysDirection.setLength(_moveCurr.x - _movePrev.x);
				_moveDirection.copy(_objectUpDirection.add(_objectSidewaysDirection));
				_axis.crossVectors(_moveDirection, _eye).normalize();
				_angle *= _this._rotateSpeed;
				_quaternion.setFromAxisAngle(_axis, _angle);
				_eye.applyQuaternion(_quaternion);
				_this._object.up.applyQuaternion(_quaternion);
				_lastAxis.copy(_axis);
				_lastAngle = _angle;
                if(window._navigatorCamera){
                    var _cameraPos = new THREE.Vector3();
                    _cameraPos.addVectors(_this._target, _eye);
                    _cameraPos = THREE._Vector3._create(_cameraPos.x, _cameraPos.y, _cameraPos.z);
                    var _cameraUp = THREE._Vector3._create(_this._object.up.x, _this._object.up.y, _this._object.up.z);
                    var _cameraTarget = THREE._Vector3._create(_this._target.x, _this._target.y, _this._target.z);
                    var _viewMatrix = THREE._Matrix4._new();
                    THREE._Matrix4._lookAt(_viewMatrix, _cameraPos, _cameraTarget, _cameraUp);
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
                }
			}else if(!_this._staticMoving && _lastAngle){
				_lastAngle *= Math.sqrt(1.0 - _this._dynamicDampingFactor);
				_eye.copy(_this._object.position).sub(_this._target);
				_quaternion.setFromAxisAngle(_lastAxis, _lastAngle);
				_eye.applyQuaternion(_quaternion);
				_this._object.up.applyQuaternion(_quaternion);
			}
			_movePrev.copy(_moveCurr);
		};
	}());
	this._zoomCamera = function(){
		var _factor;
		if(_state === _STATE._TOUCH_ZOOM_PAN){
			_factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
			_touchZoomDistanceStart = _touchZoomDistanceEnd;
			_eye.multiplyScalar(_factor);
		}else{
			_factor = 1.0 + (_zoomEnd.y - _zoomStart.y) * _this._zoomSpeed;
			if(_factor !== 1.0 && _factor > 0.0){
				_eye.multiplyScalar(_factor);
			}
			if(_this._staticMoving){
				_zoomStart.copy(_zoomEnd);
			}else{
				_zoomStart.y += (_zoomEnd.y - _zoomStart.y) * this._dynamicDampingFactor;
			}
		}
	};
	this._panCamera = (function(){
		var _mouseChange = new THREE.Vector2(),
			_objectUp = new THREE.Vector3(),
			_pan = new THREE.Vector3();
		return function _panCamera(){
			_mouseChange.copy(_panEnd).sub(_panStart);
			if(_mouseChange.lengthSq()){
				_mouseChange.multiplyScalar(_eye.length() * _this._panSpeed);
				_pan.copy(_eye).cross(_this._object.up).setLength(_mouseChange.x);
				_pan.add(_objectUp.copy(_this._object.up).setLength(_mouseChange.y));
				_this._object.position.add(_pan);
				_this._target.add(_pan);
				if(_this._staticMoving){
					_panStart.copy(_panEnd);
				}else{
					_panStart.add(_mouseChange.subVectors(_panEnd, _panStart).multiplyScalar(_this._dynamicDampingFactor));
				}
			}
		};
	}());
	this._checkDistances = function(){
		if(!_this._noZoom || !_this._noPan){
			if(_eye.lengthSq() > _this._maxDistance * _this._maxDistance){
				_this._object.position.addVectors(_this._target, _eye.setLength(_this._maxDistance));
				_zoomStart.copy(_zoomEnd);
			}
			if(_eye.lengthSq() < _this._minDistance * _this._minDistance){
				_this._object.position.addVectors(_this._target, _eye.setLength(_this._minDistance));
				_zoomStart.copy(_zoomEnd);
			}
		}
	};
	this._update = function(){
		_eye.subVectors(_this._object.position, _this._target);
		if(!_this._noRotate){
			_this._rotateCamera();
		}
		if(!_this._noZoom){
			_this._zoomCamera();
		}
		if (!_this._noPan){
			_this._panCamera();
		}
		_this._object.position.addVectors(_this._target, _eye);
		_this._checkDistances();
		_this._object.lookAt(_this._target);
		if(_lastPosition.distanceToSquared(_this._object.position) > _EPS){
			_this.dispatchEvent(_changeEvent);
			_lastPosition.copy(_this._object.position);
		}
	};
	this._reset = function(){
		_state = _STATE._NONE;
		_prevState = _STATE._NONE;
		_this._target.copy(_this._target0);
		_this._object.position.copy(_this._position0);
		_this._object.up.copy(_this._up0);
		_eye.subVectors(_this._object.position, _this._target);
		_this._object.lookAt(_this._target);
		_this.dispatchEvent(_changeEvent);
		_lastPosition.copy(_this._object.position);
	};

	function _keyDown(_event){
		if(_this._enabled === false) return;
		window.removeEventListener('keydown', _keyDown);
		_prevState = _state;
		if(_state !== _STATE._NONE){
			return;
		}else if(_event.keyCode === _this._keys[_STATE._ROTATE] && !_this._noRotate){
			_state = _STATE._ROTATE;
		}else if(_event.keyCode === _this._keys[_STATE._ZOOM] && !_this._noZoom){
			_state = _STATE._ZOOM;
		}else if(_event.keyCode === _this._keys[_STATE._PAN] && !_this._noPan){
			_state = _STATE._PAN;
		}
	}

	function _keyUp(_event){
		if(_this._enabled === false) return;
		_state = _prevState;
		window.addEventListener('keydown', _keyDown, false);
	}

	function _mouseDown(_event){
		if(_this._enabled === false) return;
		_event.preventDefault();
		_event.stopPropagation();
		if(_state === _STATE._NONE){
			_state = _event.button;
		}
		if(_state === _STATE._ROTATE && !_this._noRotate){
			_moveCurr.copy(_getMouseOnCircle(_event.pageX, _event.pageY));
			_movePrev.copy(_moveCurr);
		}else if(_state === _STATE._ZOOM && !_this._noZoom){
            _panStart.copy(_getMouseOnScreen(_event.pageX, _event.pageY));
            _panEnd.copy(_panStart);
		}else if(_state === _STATE._PAN && !_this._noPan){
			_panStart.copy(_getMouseOnScreen(_event.pageX, _event.pageY));
			_panEnd.copy(_panStart);
		}
		document.addEventListener('mousemove', _mouseMove, false);
		document.addEventListener('mouseup', _mouseUp, false);
		_this.dispatchEvent(_startEvent);
	}

	function _mouseMove(_event){
		if(_this._enabled === false) return;
		_event.preventDefault();
		_event.stopPropagation();
		if(_state === _STATE._ROTATE && !_this._noRotate){
			_movePrev.copy(_moveCurr);
			_moveCurr.copy(_getMouseOnCircle(_event.pageX, _event.pageY));
		}else if(_state === _STATE._ZOOM && !_this._noZoom){
            _panEnd.copy(_getMouseOnScreen(_event.pageX, _event.pageY));
		}else if(_state === _STATE._PAN && !_this._noPan){
			_panEnd.copy(_getMouseOnScreen(_event.pageX, _event.pageY));
		}
	}

	function _mouseUp(_event){
		if(_this._enabled === false) return;
        _event.preventDefault();
        _event.stopPropagation();
		_state = _STATE._NONE;
		document.removeEventListener('mousemove', _mouseMove);
		document.removeEventListener('mouseup', _mouseUp);
		_this.dispatchEvent(_endEvent);
	}

	function _mouseWheel(_event){
		if(_this._enabled === false) return;
		if(_this._noZoom === true) return;
        _event.preventDefault();
        _event.stopPropagation();
		switch(_event.deltaMode){
			case 2:
				_zoomStart.y -= _event.deltaY * 0.025;
				break;
			case 1:
				_zoomStart.y -= _event.deltaY * 0.01;
				break;
			default:
				_zoomStart.y -= _event.deltaY * 0.00025;
				break;
		}
		_this.dispatchEvent(_startEvent);
		_this.dispatchEvent(_endEvent);
	}

	function _touchStart(_event){
		if(_this._enabled === false) return;
        _event.preventDefault();
		switch(_event.touches.length){
			case 1:
				_state = _STATE._TOUCH_ROTATE;
				_moveCurr.copy(_getMouseOnCircle(_event.touches[0].pageX, _event.touches[0].pageY));
				_movePrev.copy(_moveCurr);
				break;
			default:
				_state = _STATE._TOUCH_ZOOM_PAN;
				var _dx = _event.touches[0].pageX - _event.touches[1].pageX;
				var _dy = _event.touches[0].pageY - _event.touches[1].pageY;
				_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(_dx * _dx + _dy * _dy);
				var _x = (_event.touches[0].pageX + _event.touches[1].pageX) / 2;
				var _y = (_event.touches[0].pageY + _event.touches[1].pageY) / 2;
				_panStart.copy(_getMouseOnScreen(_x, _y));
				_panEnd.copy(_panStart);
				break;
		}
		_this.dispatchEvent(_startEvent);
	}

	function _touchMove(_event){
		if(_this._enabled === false) return;
        _event.preventDefault();
        _event.stopPropagation();
		switch(_event.touches.length){
			case 1:
				_movePrev.copy(_moveCurr);
				_moveCurr.copy(_getMouseOnCircle(_event.touches[0].pageX, _event.touches[0].pageY));
				break;
			default:
				var _dx = _event.touches[0].pageX - _event.touches[1].pageX;
				var _dy = _event.touches[0].pageY - _event.touches[1].pageY;
				_touchZoomDistanceEnd = Math.sqrt(_dx * _dx + _dy * _dy);
				var _x = (_event.touches[0].pageX + _event.touches[1].pageX) / 2;
				var _y = (_event.touches[0].pageY + _event.touches[1].pageY) / 2;
				_panEnd.copy(_getMouseOnScreen(_x, _y));
				break;
		}
	}

	function _touchEnd(_event){
		if(_this._enabled === false) return;
		switch(_event.touches.length){
			case 0:
				_state = _STATE._NONE;
				break;
			case 1:
				_state = _STATE._TOUCH_ROTATE;
				_moveCurr.copy(_getMouseOnCircle(_event.touches[0].pageX, _event.touches[0].pageY));
				_movePrev.copy(_moveCurr);
				break;
		}
		_this.dispatchEvent(_endEvent);
	}

	function _contextMenu(_event){
		if(_this._enabled === false) return;
        _event.preventDefault();
	}

	this._dispose = function(){
		this._domElement.removeEventListener('contextmenu', _contextMenu, false);
		this._domElement.removeEventListener('mousedown', _mouseDown, false);
		this._domElement.removeEventListener('wheel', _mouseWheel, false);
		this._domElement.removeEventListener('touchstart', _touchStart, false);
		this._domElement.removeEventListener('touchend', _touchEnd, false);
		this._domElement.removeEventListener('touchmove', _touchMove, false);
		document.removeEventListener('mousemove', _mouseMove, false);
		document.removeEventListener('mouseup', _mouseUp, false);
		window.removeEventListener('keydown', _keyDown, false);
		window.removeEventListener('keyup', _keyUp, false);
	};

	this._domElement.addEventListener('contextmenu', _contextMenu, false);
	this._domElement.addEventListener('mousedown', _mouseDown, false);
	this._domElement.addEventListener('wheel', _mouseWheel, false);
	this._domElement.addEventListener('touchstart', _touchStart, false);
	this._domElement.addEventListener('touchend', _touchEnd, false);
	this._domElement.addEventListener('touchmove', _touchMove, false);
	window.addEventListener('keydown', _keyDown, false);
	window.addEventListener('keyup', _keyUp, false);
	this._handleResize();

	this._update();
};

THREE._TrackballControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE._TrackballControls.prototype.constructor = THREE._TrackballControls;