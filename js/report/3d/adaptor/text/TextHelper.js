THREE._TextHelper = function(){

};

Object.assign(THREE._TextHelper.prototype, {
    _createText:function(_content, _name){
        var _textGroup = new THREE.Group();
        _textGroup.name = _name;
        var _offset = 0;
        for(var i=0; i<_content.length; i++){
            var _generated = this._generateCharacter(_content[i], _offset);
            var _characterMesh = _generated._characterMesh;
            _textGroup.add(_characterMesh);
            _offset += _generated._width;
        }
        return _textGroup;
    },

    _generateCharacter:function(_characterName, _offset){
        var _polyhedron = new THREE._Polyhedron();
        var _polyhedronGeometry = undefined;
        if(_characterName === "0"){
            _polyhedronGeometry = _polyhedron._get_0();
        }else if(_characterName === "1"){
            _polyhedronGeometry = _polyhedron._get_1();
        }else if(_characterName === "2"){
            _polyhedronGeometry = _polyhedron._get_2();
        }else if(_characterName === "3"){
            _polyhedronGeometry = _polyhedron._get_3();
        }else if(_characterName === "4"){
            _polyhedronGeometry = _polyhedron._get_4();
        }else if(_characterName === "5"){
            _polyhedronGeometry = _polyhedron._get_5();
        }else if(_characterName === "6"){
            _polyhedronGeometry = _polyhedron._get_6();
        }else if(_characterName === "7"){
            _polyhedronGeometry = _polyhedron._get_7();
        }else if(_characterName === "8"){
            _polyhedronGeometry = _polyhedron._get_8();
        }else if(_characterName === "9"){
            _polyhedronGeometry = _polyhedron._get_9();
        }else if(_characterName === "."){
            _polyhedronGeometry = _polyhedron._get_point();
        }else if(_characterName === "m"){
            _polyhedronGeometry = _polyhedron._get_m();
        }
        var _geometry = new THREE.BufferGeometry();
        _geometry.setIndex(_polyhedronGeometry._faces);//拓扑索引
        _geometry.addAttribute('position', new THREE.BufferAttribute(Float32Array.from(_polyhedronGeometry._vertices), 3));
        var _material = new THREE.MeshBasicMaterial({
            color:0xffffff,
            depthTest:false,
            side:THREE.DoubleSide
        });
        var _characterMesh = new THREE.Mesh(_geometry, _material);
        _characterMesh.renderOrder = 1;
        _characterMesh.name = _characterName;
        _characterMesh.translateX(_offset);
        var _sceneManager = new THREE._SceneManager();
        var _boundingBox = _sceneManager._getNodeBoundingBox(_characterMesh);
        var _width = _boundingBox.max.x - _boundingBox.min.x;
        return {"_characterMesh":_characterMesh, "_width":_width};
    }
});