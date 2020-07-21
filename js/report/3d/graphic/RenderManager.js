THREE._RenderManager = function(){

};

Object.assign(THREE._RenderManager.prototype, {
    _initRenderer:function(){
        window._renderer = new THREE.WebGLRenderer({
            canvas:document.getElementById('canvas'),
            antialias:true,
            alpha:true
        });
        var _pixelRatio = window.devicePixelRatio < 1.5 ? 1.5 : window.devicePixelRatio;
        window._renderer.setPixelRatio(_pixelRatio);
        window._renderer.setSize(window._canvasWidth, window._canvasHeight);
        window._renderer.autoClear = false;
    }
});