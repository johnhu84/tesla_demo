THREE._SceneManager = function () {
    this._meshes = [];
    this._certainMesh = undefined;
    this._certainGroup = undefined;
    this._certainLine = undefined;
    this._certainNode = undefined;
};

Object.assign(THREE._SceneManager.prototype, {
    //清空sceneManager
    _clear: function () {
        this._meshes = [];
        this._certainMesh = undefined;
        this._certainGroup = undefined;
        this._certainLine = undefined;
        this._certainNode = undefined;
    },

    //清空缓存
    _disposeNode: function (_node) {
        if (_node) {
            if (_node.geometry) {
                _node.geometry.dispose();
            }
            if (_node.material) {
                if (_node.material instanceof Array) {
                    for (var i = 0; j < _node.material.length; i++) {
                        _node.material[i].dispose();
                    }
                } else if (!(_node.material instanceof Array)) {
                    _node.material.dispose();
                }
            }
            for (var i = _node.children.length - 1; i >= 0; i--) {
                this._disposeNode(_node.children[i]);
            }
        }
    },

    //清空节点
    _clearNode: function (_node) {
        this._disposeNode(_node);
        if (_node) {
            if (_node.children.length > 0) {
                for (var i = _node.children.length - 1; i >= 0; i--) {
                    _node.remove(_node.children[i]);
                }
            }
        }
    },

    //删除节点
    _deleteNode: function (_node, _name) {
        if (_node) {
            this._findCertainNode(_node, _name);
            this._clearNode(this._certainNode);
            _node.remove(_node, this._certainNode);
        }
    },

    //隐藏整个节点
    _hideNode: function (_node) {
        if (_node) {
            if (_node.material) {
                if (_node.material instanceof Array) {
                    for (var j = 0; j < _node.material.length; j++) {
                        _node.material[j].visible = false;
                    }
                } else if (!(_node.material instanceof Array)) {
                    _node.material.visible = false;
                }
            }
            if (_node.children.length !== 0) {
                for (var i = _node.children.length - 1; i >= 0; i--) {
                    this._hideNode(_node.children[i]);
                }
            }
        }
    },

    //显示整个节点
    _showNode: function (_node) {
        if (_node) {
            if (_node.material) {
                if (_node.material instanceof Array) {
                    for (var j = 0; j < _node.material.length; j++) {
                        _node.material[j].visible = true;
                    }
                } else if (!(_node.material instanceof Array)) {
                    _node.material.visible = true;
                }
            }
            if (_node.children.length !== 0) {
                for (var i = _node.children.length - 1; i >= 0; i--) {
                    this._showNode(_node.children[i]);
                }
            }
        }
    },

    //寻找目标里的所有mesh
    _findMeshes: function (_node) {
        if (_node.children.length > 0) {
            for (var i = 0; i < _node.children.length; i++) {
                if (_node.children[i] instanceof THREE.Mesh
                    || _node.children[i] instanceof THREE.Line) {
                    this._meshes.push(_node.children[i]);
                }
                if (_node.children[i].children.length !== 0) {
                    this._findMeshes(_node.children[i]);
                }
            }
        }
    },

    //寻找目标里的指定mesh
    _findCertainMesh: function (_node, _name) {
        if (_node.children.length > 0) {
            for (var i = 0; i < _node.children.length; i++) {
                if (_node.children[i].children.length !== 0) {
                    this._findCertainMesh(_node.children[i], _name);
                } else if (_node.children[i].children.length === 0
                    && (_node.children[i] instanceof THREE.Mesh
                        || _node.children[i] instanceof THREE.Line)
                    && _node.children[i].name === _name) {
                    this._certainMesh = _node.children[i];
                    break;
                }
            }
        }
    },

    //寻找目标里的指定line
    _findCertainLine: function (_node, _name) {
        if (_node.children.length > 0) {
            for (var i = 0; i < _node.children.length; i++) {
                if (_node.children[i].type === "Group") {
                    this._findCertainLine(_node.children[i], _name);
                } else if (_node.children[i].type === "Line") {
                    if (_node.children[i].name === _name) {
                        this._certainLine = _node.children[i];
                        break;
                    }
                }
            }
        }
    },

    //找到某个group
    _findCertainGroup: function (_node, _name) {
        if (_node) {
            if (_node.name === _name) {
                this._certainGroup = _node;
                return this._certainGroup;
            } else if (_node.name !== _name && _node.children.length !== 0) {
                for (var i = 0; i < _node.children.length; i++) {
                    this._findCertainGroup(_node.children[i], _name);
                }
            }
        }
    },

    _findCertainNode: function (_node, _name) {
        if (_node.children.length !== 0) {
            for (var i = 0; i < _node.children.length; i++) {
                if (_node.children[i].name === _name) {
                    this._certainNode = _node.children[i];
                    break;
                } else if (_node.children[i].name !== _name
                    && _node.children[i].children.length !== 0) {
                    this._findCertainNode(_node.children[i], _name);
                }
            }
        }
    },

    //找到某个group的所有mesh
    _getMeshesFromCertainGroup: function (_node, _name) {
        this._meshes = [];
        this._findCertainGroup(_node, _name);
        this._findMeshes(this._certainGroup);
        return this._meshes;
    },

    _getMeshesFromCertainNode: function (_node) {
        this._meshes = [];
        this._findMeshes(_node);
        return this._meshes;
    },

    //获取节点包围盒
    _getNodeBoundingBox: function (_node) {
        return new THREE.Box3().setFromObject(_node);
    },

    _getNodeOCTreeBoundary: function (_node) {
        var _boundingBox = this._getNodeBoundingBox(_node);
        var _boundary = _boundingBox.max.x - _boundingBox.min.x;
        if (_boundary < _boundingBox.max.y - _boundingBox.min.y) {
            _boundary = _boundingBox.max.y - _boundingBox.min.y;
        }
        if (_boundary < _boundingBox.max.z - _boundingBox.min.z) {
            _boundary = _boundingBox.max.z - _boundingBox.min.z;
        }
        _boundingBox.max.x = _boundingBox.min.x + _boundary;
        _boundingBox.max.y = _boundingBox.min.y + _boundary;
        _boundingBox.max.z = _boundingBox.min.z + _boundary;
        var _length = _boundingBox.max.x - _boundingBox.min.x;
        _boundingBox.max.x += _length / 1000;
        _boundingBox.max.y += _length / 1000;
        _boundingBox.max.z += _length / 1000;
        _boundingBox.min.x -= _length / 1000;
        _boundingBox.min.y -= _length / 1000;
        _boundingBox.min.z -= _length / 1000;
        return _boundingBox;
    },

    //场景模型材质启用clip
    _setClipPlanes: function (_node, _clipPlanes) {
        if (_node.material && _node.material instanceof Array) {
            for (var i = 0; i < _node.material.length; i++) {
                _node.material[i].clippingPlanes = _clipPlanes;
                _node.material[i].clipIntersection = false;
            }
        } else if (_node.material && !(_node.material instanceof Array)) {
            _node.material.clippingPlanes = _clipPlanes;
            _node.material.clipIntersection = false;
        }
        if (_node.children.length !== 0) {
            for (var i = 0; i < _node.children.length; i++) {
                this._setClipPlanes(_node.children[i], _clipPlanes);
            }
        }
    },

    //初始化场景
    _initScene: function (_backgroundColor) {
        var _scene = new THREE.Scene();
        _scene.background = new THREE.Color(_backgroundColor);
        return _scene;
    },

    //设置scene背景色
    _setSceneBackgroundColor: function (_backgroundColor) {
        window._scene.background = new THREE.Color(_backgroundColor);
    },

    //添加ModelGroup
    _initModelGroup: function (_node) {
        var _modelGroup = new THREE.Group();
        _modelGroup.name = "ModelGroup";
        _node.add(_modelGroup);
    },

    _deleteModel: function (_modelName) {
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, "ModelGroup");
        _sceneManager._deleteNode(_sceneManager._certainNode, _modelName);
    },

    _deleteSpecialPoint: function (_modelName) {
        var _sceneManager = new THREE._SceneManager();
        _sceneManager._findCertainNode(window._scene, _modelName);
        _sceneManager._findCertainNode(_sceneManager._certainNode, "SpecialPointGroup");
        _sceneManager._clearNode(_sceneManager._certainNode);
    }
});