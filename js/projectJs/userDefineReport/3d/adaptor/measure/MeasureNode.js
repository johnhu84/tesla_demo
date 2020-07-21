THREE._MeasureNode = function(){
    this._obj = new THREE.Group();
};

Object.assign(THREE._MeasureNode.prototype, {
    _setName:function(_name){
        this._obj.name = _name;
    },

    //画点
    _createPoint:function(_position, _index){
        var _spGeo = new THREE.SphereGeometry(1, 10, 10);
        var _spMtl = new THREE.MeshBasicMaterial({
            color:0x000000
        });
        var _sp = new THREE.Mesh(_spGeo, _spMtl);
        _sp.name = "MeasurePoint_"+_index;
        _sp.position.set(_position[0], _position[1], _position[2]);
        this._obj.add(_sp);
    },

    //重新画线
    _createLine:function(_lastPos, _currPos, _index){
        var _start = new THREE.Vector3(_lastPos[0], _lastPos[1], _lastPos[2]);
        var _end = new THREE.Vector3(_currPos[0], _currPos[1], _currPos[2]);
        var _lineGeo = new THREE.Geometry();
        _lineGeo.vertices.push(_start, _end);
        var _lineMtl = new THREE.LineBasicMaterial({
            color:0xff0000
        });
        var _line = new THREE.Line(_lineGeo, _lineMtl);
        _line.name = "MeasureLine_"+_index;
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._deleteNode(this._obj, _line.name);
        this._obj.add(_line);
    },

    //已有顶点数
    _getPointNum:function(){
        var _pointNum = 0;
        if(this._obj.children.length > 0){
            for(var i=0; i<this._obj.children.length; i++){
                if(this._obj.children[i] instanceof THREE.Mesh){
                    _pointNum ++;
                }
            }
        }
        return _pointNum;
    }
});