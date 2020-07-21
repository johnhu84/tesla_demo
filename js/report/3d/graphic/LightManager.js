THREE._LightManager = function(){

};

Object.assign(THREE._LightManager.prototype, {
    //节点内加入环境光
    _addAmbientLight:function(_node, _color, _intensity){
        var _ambientLight = new THREE.AmbientLight(_color, _intensity);
        _node.add(_ambientLight);
    },

    //节点内加入点光源
    _addPointLight:function(_node, _color, _intensity){
        var _pointLight = new THREE.PointLight(_color, _intensity);
        _node.add(_pointLight);
    }
});