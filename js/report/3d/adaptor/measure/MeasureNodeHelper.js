THREE._MeasureNodeHelper = function(){

};

Object.assign(THREE._MeasureNodeHelper.prototype, {
    _setName:function(_node, _name){
        _node.name = _name;
    },

    _createPoint:function(_node, _position, _index){
        var _spGeo = new THREE.SphereGeometry(1, 9, 6);
        var _spMtl = new THREE.MeshBasicMaterial({
            color:0x000000
        });
        var _sp = new THREE.Mesh(_spGeo, _spMtl);
        _sp.name = "MeasurePoint_"+_index;
        _sp.position.set(_position[0], _position[1], _position[2]);
        _node.add(_sp);
    },

    _createLine:function(_node, _lastPos, _currPos, _index){
        var _start = new THREE.Vector3(_lastPos[0], _lastPos[1], _lastPos[2]);
        var _end = new THREE.Vector3(_currPos[0], _currPos[1], _currPos[2]);
        var _lineGeo = new THREE.Geometry();
        _lineGeo.vertices.push(_start, _end);
        var _lineMtl = new THREE.LineBasicMaterial({
            color:0xff0000
        });
        var _line = new THREE.Line(_lineGeo, _lineMtl);
        _line.name = "MeasureLine_"+_index;
        _node.add(_line);
    },

    _getPointNum:function(_node){
        var _pointNum = 0;
        if(_node.children.length > 0){
            for(var i=0; i<_node.children.length; i++){
                if(_node.children[i] instanceof THREE.Mesh){
                    _pointNum ++;
                }
            }
        }
        return _pointNum;
    }
});