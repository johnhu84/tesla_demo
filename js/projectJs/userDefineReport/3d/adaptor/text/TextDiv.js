THREE._TextDiv = function(){

};

Object.assign(THREE._TextDiv.prototype, {
    //获取精灵图在屏幕的XY坐标
    _getScreenXY:function(_node, _camera, _screenWidth, _screenHeight){
        var _sceneManager = new THREE._SceneManager();
        var _boundingBox = _sceneManager._getNodeBoundingBox(_node);
        var _center = THREE._Vector3._new();
        _center[0] = (_boundingBox.max.x + _boundingBox.min.x)/2;
        _center[1] = (_boundingBox.max.y + _boundingBox.min.y)/2;
        _center[2] = (_boundingBox.max.z + _boundingBox.min.z)/2;
        var _modelViewMatrix = window._camera.matrixWorldInverse.elements;
        THREE._Vector3._transformMat4(_center, _center, _modelViewMatrix);
        var _screenPos = THREE._Vector3._new();
        THREE._Vector3._transformMat4(_screenPos, _center, window._camera.projectionMatrix.elements);
        _screenPos[0] = _screenPos[0] * _screenWidth / 2 + _screenWidth / 2;
        _screenPos[1] = - _screenPos[1] * _screenHeight / 2 + _screenHeight / 2;
        return [_screenPos[0], _screenPos[1]];
    },

    //添加精灵图div
    _createPop:function(_screenXY, _value, _document, _content){
        var _pop = _document.createElement("div");
        _pop.setAttribute('id', _value);
        _pop.setAttribute('style', '-webkit-user-select:none; -moz-user-select:none; -ms-user-select:none;user-select:none; position:absolute; width:50px; height:20px; left:'+_screenXY[0]+'px; top:'+_screenXY[1]+'px; font-size:6px;');
        _pop.setAttribute('class', 'sprite');
        _pop.innerHTML = _content;
        _document.body.appendChild(_pop);
    },

    //更新精灵图坐标位置
    _updatePop:function(_screenXY, _value, _document, _content){
        var _pop = _document.getElementById(_value);
        var _canvasLeft = _document.getElementById('canvas').clientLeft;
        var _canvasTop = _document.getElementById('canvas').clientTop + _document.body.scrollTop;
        var _left = _screenXY[0] + _canvasLeft;
        var _top = _screenXY[1] + _canvasTop;
        _pop.setAttribute('style', '-webkit-user-select:none; -moz-user-select:none; -ms-user-select:none;user-select:none; position:absolute; width:50px; height:20px; left:'+_left+'px; top:'+_top+'px; font-size:6px;');
        if(_content){
            _pop.innerHTML = _content;
        }
    },

    //删除精灵图div
    _deletePop:function(_document, _id){
        var _pop = document.getElementById(_id);
        _document.body.removeChild(_pop);
    },

    //更新相机
    _updateCamera:function(){
        this._updateDistanceText();
        this._updateAngleText();
        this._updateAreaText();
    },

    //更新所有距离测量文字
    _updateDistanceText:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainGroup(window._scene, "MeasureDistanceGroup");
        var _distanceGroup = _sceneManager._certainGroup;
        if(_distanceGroup){
            if(_distanceGroup.children.length > 0){
                for(var i=0; i<_distanceGroup.children.length; i++){
                    var _name = _distanceGroup.children[i].name;
                    if(document.getElementById(_name)){
                        var _screenXY = this._getScreenXY(_distanceGroup.children[i], window._camera, window._canvasWidth, window._canvasHeight);
                        var _content = document.getElementById(_name).innerHTML;
                        this._updatePop(_screenXY, _name, document, _content);
                    }
                }
            }
        }
    },

    //更新所有角度测量文字
    _updateAngleText:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainGroup(window._scene, "MeasureAngleGroup");
        var _angleGroup = _sceneManager._certainGroup;
        if(_angleGroup){
            if(_angleGroup.children.length > 0){
                for(var i=0; i<_angleGroup.children.length; i++){
                    var _name = _angleGroup.children[i].name;
                    if(document.getElementById(_name)){
                        var _screenXY = this._getScreenXY(_angleGroup.children[i], window._camera, window._canvasWidth, window._canvasHeight);
                        var _content = document.getElementById(_name).innerHTML;
                        this._updatePop(_screenXY, _name, document, _content);
                    }
                }
            }
        }
    },

    //更新所有面积测量文字
    _updateAreaText:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainGroup(window._scene, "MeasureAreaGroup");
        var _areaGroup = _sceneManager._certainGroup;
        if(_areaGroup){
            if(_areaGroup.children.length > 0){
                for(var i=0; i<_areaGroup.children.length; i++){
                    var _name = _areaGroup.children[i].name;
                    if(document.getElementById(_name)){
                        var _screenXY = this._getScreenXY(_areaGroup.children[i], window._camera, window._canvasWidth, window._canvasHeight);
                        var _content = document.getElementById(_name).innerHTML;
                        this._updatePop(_screenXY, _name, document, _content);
                    }
                }
            }
        }
    },

    //删除距离测量文字
    _deleteTextOfMeasureDistanceGroup:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainGroup(window._scene, "MeasureDistanceGroup");
        var _distanceGroup = _sceneManager._certainGroup;
        if(_distanceGroup){
            if(_distanceGroup.children.length > 0){
                for(var i=0; i<_distanceGroup.children.length; i++){
                    var _name = _distanceGroup.children[i].name;
                    this._deletePop(document, _name);
                }
            }
        }
    },

    //删除角度测量文字
    _deleteTextOfMeasureAngleGroup:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainGroup(window._scene, "MeasureAngleGroup");
        var _angleGroup = _sceneManager._certainGroup;
        if(_angleGroup){
            if(_angleGroup.children.length > 0){
                for(var i=0; i<_angleGroup.children.length; i++){
                    var _name = _angleGroup.children[i].name;
                    this._deletePop(document, _name);
                }
            }
        }
    },

    //删除面积测量文字
    _deleteTextOfMeasureAreaGroup:function(){
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainGroup(window._scene, "MeasureAreaGroup");
        var _angleGroup = _sceneManager._certainGroup;
        if(_angleGroup){
            if(_angleGroup.children.length > 0){
                for(var i=0; i<_angleGroup.children.length; i++){
                    var _name = _angleGroup.children[i].name;
                    this._deletePop(document, _name);
                }
            }
        }
    }
});