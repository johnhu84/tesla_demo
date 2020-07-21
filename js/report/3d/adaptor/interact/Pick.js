THREE._Pick = function(){
    this._pickTarget = "";
    this._callback = undefined;
    this._pickedMeshes = [];
    this._picker = undefined;
    this._groupType = "";
};

Object.assign(THREE._Pick.prototype, {
    //初始化
    _init:function(_pickTarget, _groupType, _callback){
        this._pickTarget = _pickTarget;
        this._callback = _callback;
        this._pickedMeshes = [];
        this._picker = undefined;
        this._groupType = _groupType;
    },

    //销毁
    _destroy:function(){
        if(window._pick){
            if(window._pick._picker){
                if(window._pick._picker instanceof THREE._SquarePick){
                    window._pick._picker._deleteSquare();
                    window._pick._picker = undefined;
                }else if(window._pick._picker instanceof THREE._PointerPick){
                    window._pick._picker = undefined;
                }
            }
            window._pick._clearPickedMeshes();
            window._pick._pickTarget = "";
            window._pick._callback = undefined;
            window._pick._groupType = "";
        }
    },

    //将框中的mesh压入this._pickedMeshes数组
    _pushPickedMesh:function(_certainMesh){
        if(window._pick._groupType === "add"){
            var _pushed = false;
            for(var i=window._pick._pickedMeshes.length-1; i>=0; i--){
                if(window._pick._pickedMeshes[i]){
                    if(window._pick._pickedMeshes[i].name === _certainMesh.name){
                        _pushed = true;
                        break;
                    }
                }
            }
            if(!_pushed){
                var _geometry = _certainMesh.geometry.clone(false);
                var _material = undefined;
                if(_certainMesh.material instanceof Array){
                    _material = [];
                    for(var i=0; i<_certainMesh.material.length; i++){
                        _material.push(_certainMesh.material[i].clone(false));
                    }
                }else if(!(_certainMesh.material instanceof Array)){
                    _material = _certainMesh.material.clone(false);
                }
                var _cloneMesh = new THREE.Mesh(_geometry, _material);
                _cloneMesh.uuid = _certainMesh.uuid;
                _cloneMesh.name = _certainMesh.name;
                _cloneMesh.position.set(_certainMesh.position.x, _certainMesh.position.y, _certainMesh.position.z);
                window._pick._pickedMeshes.push(_cloneMesh);
            }
        }else if(window._pick._groupType === "sub"){
            var _pushed = false;
            for(var i=window._pick._pickedMeshes.length-1; i>=0; i--){
                if(window._pick._pickedMeshes[i]){
                    if(window._pick._pickedMeshes[i].name === _certainMesh.name){
                        _pushed = true;
                        window._pick._pickedMeshes[i].geometry.dispose();
                        window._pick._pickedMeshes[i].material.dispose();
                        window._pick._pickedMeshes[i] = undefined;
                        break;
                    }
                }
            }
            if(!_pushed){
                var _geometry = _certainMesh.geometry.clone(false);
                var _material = undefined;
                if(_certainMesh.material instanceof Array){
                    _material = [];
                    for(var i=0; i<_certainMesh.material.length; i++){
                        _material.push(_certainMesh.material[i].clone(false));
                    }
                }else if(!(_certainMesh.material instanceof Array)){
                    _material = _certainMesh.material.clone(false);
                }
                var _cloneMesh = new THREE.Mesh(_geometry, _material);
                _cloneMesh.uuid = _certainMesh.uuid;
                _cloneMesh.name = _certainMesh.name;
                _cloneMesh.position.set(_certainMesh.position.x, _certainMesh.position.y, _certainMesh.position.z);
                window._pick._pickedMeshes.push(_cloneMesh);
            }
        }else if(window._pick._groupType === "inter"){
            var _pushed = false;
            for(var i=window._pick._pickedMeshes.length-1; i>=0; i--){
                if(window._pick._pickedMeshes[i]){
                    if(window._pick._pickedMeshes[i].name === _certainMesh.name){
                        _pushed = true;
                    }else if(window._pick._pickedMeshes[i].name !== _certainMesh.name){
                        window._pick._pickedMeshes[i].geometry.dispose();
                        window._pick._pickedMeshes[i].material.dispose();
                        window._pick._pickedMeshes[i] = undefined;
                        break;
                    }
                }
            }
        }
    },

    //清空选中的mesh列表
    _clearPickedMeshes:function(){
        if(this._pickedMeshes.length > 0){
            for(var i=this._pickedMeshes.length - 1; i>=0; i--){
                if(this._pickedMeshes[i]){
                    this._pickedMeshes[i].geometry.dispose();
                    if(this._pickedMeshes[i].material instanceof Array){
                        for(var j=0; j<this._pickedMeshes[i].material.length; j++){
                            this._pickedMeshes[i].material[j].dispose();
                        }
                    }else if(!(this._pickedMeshes[i].material instanceof Array)){
                        this._pickedMeshes[i].material.dispose();
                    }
                    this._pickedMeshes[i] = undefined;
                }
            }
        }
        this._pickedMeshes = [];
        if(window._pick._callback instanceof Function){
            window._pick._callback(window._pick._pickedMeshes);
        }
    }
});