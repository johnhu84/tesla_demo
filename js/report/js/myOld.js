const SELECTOR_MODE_NONE = 0;
const SELECTOR_MODE_SINGLE = 1;
const SELECTOR_MODE_BOX_TOP4 = 2;
const SELECTOR_MODE_UNBOX = 3;
const SELECTOR_MODE_BOX_ALL = 4;
const SELECTOR_MODE_UNBOX_ALL = 5;
var renderer,container,topLabel,rightLabel,bottomLabel,leftLabel;
var globalObj = {
    loadedObjects: [],
    lights: [],
    explodeMode: {enabled: false, carModelMode: 1},
    colorMode: {enabled: false},
    lightMode: {enabled: false},
    truncateMode: {enabled: false},
    selectMode: {enabled: false},
    labelPosition: {up: true, down: true, left: true, right: true},
    labelsNeedUpdate: false,
    spacing: {pageSpacingUpDown: 0, pageSpacingLeftRight: 0, chartSpacingUpDown: 5, chartSpacingLeftRight: 5,
        numOfPages: 4},
    labelDimensions: {up: {width: 0, height: 0}, down: {width: 0, height: 0}, left: {width: 0, height: 0},
        right: {width: 0, height: 0}, labels: []},
    randomPoints: []
};
var handsonTable;
var handsonTableOptions;
var handsonTableOptionsOriginal;
//holds rules retrieved by report
var handsonTableHelperObj;
//helper object for getLabelPositions2, this requirement fulfills the 3 tables per point, scaling size of each handson table
var getLabelPositions2HelperObj = {};
//holds pareto charts retrieved from report
var handsonTableHelperObjParetos;
var handsonTableHelperObjParetoSettings;
var handsonTableHelperObjParetoSettingsOriginal;
//cache data to hold original handsonTableOptionsData
var handsonTableOptionsData;
var handsonTableHelperObjTrendMapsCache = {};
var handsonTableHelperObjTrendMapSettings;
var handsonTableHelperObjTrendMapSettingsOriginal;
var handsonTableHelperObjControlChartSettings;
var handsonTableHelperObjControlChartSettingsOriginal;
var handsonTableHelperObjHistograms;
var handsonTableHelperObjHistogramSettings;
var handsonTableHelperObjHistogramSettingsOriginal;
var handsonTableHelperObjControlCharts;
var handsonTableHelperObjBoxLineCharts;
var handsonTableHelperObjBoxLineChartSettings;
var handsonTableHelperObjBoxLineChartSettingsOriginal;
var handsonTableHelperObjSigmaMaps;
var handsonTableHelperObjSigmaMapSettings;
var handsonTableHelperObjSigmaMapSettingsOriginal;
var handsonTableHelperObjPieCharts;
var handsonTableHelperObjPieChartSettings;
var handsonTableHelperObjPieChartSettingsOriginal;
var handsonTableHelperObjStackingMapCharts;
var handsonTableHelperObjStackingMapChartSettings;
var handsonTableHelperObjStackingMapChartSettingsOriginal;
var handsonTableHelperObjImgs;
//Use this, as ajax live connection tracker, when zero, call something like the movePareto charts function
var handsonTableActiveAjaxCalls = 0;
//04/09/2020, default trend map settings, used for applyTrendMapSettings method
var defaultHandsonTableHelperObjTrendMapSetting = JSON.parse('{"trendMapSel2":"sample","trendMapCb1":true,"trendMapFrom1":"","trendMapTo1":"","trendMapSel3":"feature1","trendMapSel4":"feature1","trendMapSelXStyle":"none","trendMapSelLabel":"custom","trendMapNumIntFrom1":"","trendMapNumIntTo1":"","trendMapMinInt1":"","trendMapSelYStyle":"none","trendMapSelLabel2":"custom","trendMapNumIntFrom2":"","trendMapNumIntTo2":"","trendMapMinInt2":"","instructionLines":[{"iLSel1":"1","iLInputFrom":"","iLInputTo":"","iLWidthInput1":"1","iLColor1":"#ff0000","BackgroundColor":"#ff0000","iLInput2":"100","iLCb1":false,"iLCb2":false,"IndicatorLineStyleChange":"1","publicSelectInput":""}],"dataStyles":[{"dSYValueSel1":"greaterThan","dSYValueSel2":"","dSBgColorInput1":"#ffc000","dSStyleSel1":"1","dSStyleSel2":"","dSRangeNumber1":"","dSRangeNumber2":"","dSWidth":"","dSFrameBgColor":"","dSTransparency1":"","dSCb1":false,"dSCb2":false,"dSCb3":false,"publicSelectInput":""}],"miscMove1":"on","miscRadio1":false,"miscRadio2":false,"miscRadio3":false,"miscMove2":"on","miscSel1":"front","miscSel2":"10","miscSel3":"1","miscBgColorCb1":false,"miscBgColorInput1":"#FFF","miscBgColorTransparency1":"","miscFrameCb1":false,"miscFrameTransparency1":"","miscSel5":null,"miscSel6":null,"miscSel7":null,"miscInput1":"","miscInput2":"","miscInput3":"#FFF","miscInput4":""}');

$(document).ready(function() {
    if (typeof globalObj.colorMode.dialog === 'undefined') {
        globalObj.colorMode.dialog = $( "#dialog-color-form" ).dialog({
            autoOpen: false,
            height: 200,
            width: 250,
            modal: true,
            buttons: {
                Cancel: function() {
                    document.getElementById('colorMode').style.backgroundColor = '#dddddd';
                    globalObj.colorMode.dialog.dialog( "close" );
                    globalObj.colorMode.enabled = false;
                }
            },
            open: function() {
                var rect = renderer.context.canvas.getBoundingClientRect();
                var tP = $(this).parents('.ui-dialog');
                if (tP.length > 0) {
                    $(tP[0]).css({top: rect.top});
                }
            },
            close: function() {

            }
        });
    }
    var dialogParents = $('#dialog-color-form').parents('.ui-dialog');
    if (dialogParents.length > 0) {
        $(dialogParents[0]).css('z-index', 1);
        var closeIcon = $(dialogParents[0]).find('.ui-icon');
        $(closeIcon).css('top', '0%');
        $(closeIcon).css('left', '0%');
    }
    if (typeof globalObj.lightMode.dialog === 'undefined') {
        globalObj.lightMode.dialog = $( "#dialog-light-form" ).dialog({
            autoOpen: false,
            height: 600,
            width: 600,
            modal: true,
            buttons: {
                Cancel: function() {
                    globalObj.lightMode.dialog.dialog( "close" );
                    document.getElementById('toggleLight').style.backgroundColor = '#dddddd';
                    globalObj.lightMode.enabled = false;
                }
            },
            open: function() {
                refreshLightSel();
                var rect = renderer.context.canvas.getBoundingClientRect();
                var tP = $(this).parents('.ui-dialog');
                if (tP.length > 0) {
                    $(tP[0]).css({top: rect.top});
                }
            },
            close: function() {
                globalObj.lightMode.dialog.dialog( "close" );
                document.getElementById('toggleLight').style.backgroundColor = '#dddddd';
                globalObj.lightMode.enabled = false;
            }
        });
    }
    dialogParents = $('#dialog-light-form').parents('.ui-dialog');
    if (dialogParents.length > 0) {
        $(dialogParents[0]).css('z-index', 1);
        var closeIcon = $(dialogParents[0]).find('.ui-icon');
        $(closeIcon).css('top', '0%');
        $(closeIcon).css('left', '0%');
    }
    if (typeof globalObj.truncateMode.dialog === 'undefined') {
        globalObj.truncateMode.dialog = $( "#dialog-truncate-form" ).dialog({
            autoOpen: false,
            height: 400,
            width: 500,
            modal: true,
            buttons: {
                Cancel: function() {
                    globalObj.truncateMode.dialog.dialog( "close" );
                    document.getElementById('truncateMode').style.backgroundColor = '#fff';
                    globalObj.truncateMode.enabled = false;
                }
            },
            open: function() {
                var rect = renderer.context.canvas.getBoundingClientRect();
                var tP = $(this).parents('.ui-dialog');
                if (tP.length > 0) {
                    $(tP[0]).css({top: rect.top});
                }
            },
            close: function() {
                globalObj.truncateMode.dialog.dialog( "close" );
                document.getElementById('truncateMode').style.backgroundColor = '#dddddd';
                globalObj.truncateMode.enabled = false;
            }
        });
    }
    var dialogParents = $('#dialog-truncate-form').parents('.ui-dialog');
    if (dialogParents.length > 0) {
        $(dialogParents[0]).css('z-index', 1);
        var closeIcon = $(dialogParents[0]).find('.ui-icon');
        $(closeIcon).css('top', '0%');
        $(closeIcon).css('left', '0%');
    }
    if (typeof globalObj.selectMode.dialog === 'undefined') {
        globalObj.selectMode.dialog = $( "#dialog-selection-form" ).dialog({
            autoOpen: false,
            height: 320,
            width: 400,
            modal: true,
            buttons: {
                Close: function() {
                    globalObj.selectMode.dialog.dialog( "close" );
                    //document.getElementById('boxSelector').style.backgroundColor = '#dddddd';
                    //globalObj.selectMode.enabled = false;
                }
            },
            open: function() {
                var rect = renderer.context.canvas.getBoundingClientRect();
                var tP = $(this).parents('.ui-dialog');
                $(".ui-dialog-buttonset button").text("关闭")
                if (tP.length > 0) {
                    $(tP[0]).css({top: rect.top});
                }
            },
            close: function() {
                globalObj.selectMode.dialog.dialog( "close" );
                document.getElementById('boxSelector').style.backgroundColor = '#dddddd';
                //globalObj.selectMode.enabled = false;
            }
        });

        $(".ui-dialog-buttonset button").text("关闭")
    }
    dialogParents = $('#dialog-selection-form').parents('.ui-dialog');
    if (dialogParents.length > 0) {
        $(dialogParents[0]).css('z-index', 1);
        var closeIcon = $(dialogParents[0]).find('.ui-icon');
        $(closeIcon).css('top', '0%');
        $(closeIcon).css('left', '0%');
    }
});

container = document.getElementById("container");
function initRender() {
    //renderer = window._renderer
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.physicallyCorrectLights = true;

    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;

    renderer.setClearColor( 0xcccccc );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(500,500 );
    $('#container').width(500);
    $('#container').height(500);
    container.appendChild(renderer.domElement);
}

var camera,mesh;
function initCamera() {
    //camera = window._camera
    camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.01, 1000);
}

var scene;
function initScene() {
    //scene = window._scene
    scene = new THREE.Scene();
}

function initLight() {

}

var matrix4 =  new THREE.Matrix4();
function initModel() {
    //script block
    //change here

    var loader = new THREE.GLTFLoader().setPath( gltfPath );


    if (gltfPath == '' || gltfName == ''){
        console.log("没有数模");

        loadOnlyPoint(1,'');

    }else{

        THREE.DRACOLoader.setDecoderPath( ctx + '/static/js/report/threejs/examples/libs/draco/gltf1/' );
        //var loader = new THREE.GLTFLoader().setPath( 'static/models/gltf1/' );

        //THREE.DRACOLoader.setDecoderPath( 'static/js/report/threejs/examples/libs/draco/gltf/' );
        loader.setDRACOLoader( new THREE.DRACOLoader() );

        var startTime = new Date();
        loader.load(gltfName, function (gltf) {
            //创建纹理

            var scene1 = gltf.scene;
            var clips = gltf.animations || [];

            var box = new THREE.Box3().setFromObject(scene1);

            var multiplyScalar = new THREE.Vector3().addVectors( box.min, box.max ).multiplyScalar( 0.5 ).negate();
            globalObj.multiplyScalar = multiplyScalar;
            //matrix4.elements = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, multiplyScalar.z *1000, multiplyScalar.x*1000, multiplyScalar.y *1000, 1 ];
            var time2 = new Date();
            var diff = time2 - startTime;
            diff /= 1000;
            var seconds = Math.round(diff);
            console.log("elapsed time before loadPoint: " + seconds + " seconds");
            loadPoint(1,'');
            var time3 = new Date();
            var diff = time3 - time2;
            diff /= 1000;
            var seconds = Math.round(diff);
            console.log("elapsed time before setContent: " + seconds + " seconds");
            console.log('发送请求');
            setContent(scene1, clips);
            var time4 = new Date();
            var diff = time4 - time3;
            diff /= 1000;
            var seconds = Math.round(diff);
            console.log("elapsed time after setContent: " + seconds + " seconds");
        }, onProgress,function ( err ) {

            console.log(err);
            loadPoint(0,'');
        });

    }


}

/**
 * @param {THREE.Object3D} object
 * @param {Array<THREE.AnimationClip} clips
 */

function setContent ( object, clips ) {

    // this.clear();

    //-11.6038,-738.696,-73.4
    globalObj.centralObj = object;
    globalObj.loadedObjects.push(object);
    /*var modifier = new THREE.SimplifyModifier();
    var simplified = object.children[0].clone();
    simplified.material = simplified.material.clone();
    simplified.material.flatShading = true;
    var count = Math.floor( simplified.geometry.attributes.position.count * 0.875 ); // number of vertices to remove
    simplified.geometry = modifier.modify( simplified.geometry, count );*/
    /*var group = new THREE.Group();
    group.add(object);*/
    //scene.add(group);
    scene.add(object);

    var box = new THREE.Box3().setFromObject(object);
    //
    var size = box.getSize(new THREE.Vector3()).length();
    var center = box.getCenter(new THREE.Vector3());


    object.position.x += (object.position.x - center.x);
    object.position.y += (object.position.y - center.y);
    object.position.z += (object.position.z - center.z);
    // this.controls.maxDistance = size * 10;
    // this.camera.near = size / 100;
    // this.camera.far = size * 100;
    // this.camera.updateProjectionMatrix();

    this.camera.position.copy(center);
    this.camera.position.x += size / 2.0;
    this.camera.position.y += size / 5.0;
    this.camera.position.z += size / 2.0;
    this.camera.lookAt(center);

    this.updateLights();

    controls.update();
    globalObj.originalDistanceControlsToCamera = controls.target.distanceTo(controls.object.position);
    console.info('[glTF Viewer] THREE.Scene exported as `window.content`.');
    // this.printGraph(this.content);

}


var lights = [];

function updateLights () {

    if ( !lights.length) {
        addLights();
    } else if (lights.length) {
        this.removeLights();
    }

    renderer.toneMappingExposure = 1;

    if (lights.length === 2) {
        lights[0].intensity = 0.3;
        lights[0].color.setHex(0xFFFFFF);
        lights[1].intensity = 0.8 * Math.PI;
        lights[1].color.setHex(0xFFFFFF);
    }


}

function addLights () {

    var light1  = new THREE.AmbientLight(0xFFFFFF, 0.3);
    light1.name = 'ambient_light';

    var light2  = new THREE.DirectionalLight(0xFFFFFF, 0.8 * Math.PI);
    light2.position.set(0.5, 0, 0.866); // ~60º
    light2.name = 'main_light';
    //
    camera.add( light1 );
    camera.add( light2 );

    scene.add(camera);


    lights.push(light1, light2);
    globalObj.lights.push({light: light1}, {light: light2});

}

function removeLights () {

    lights.forEach((light) => light.parent.remove(light));
    lights.length = 0;

}

var starField,starsGeometry;

function addSencePoint(array,m,m2) {


    globalObj.points = array;
    starsGeometry = new THREE.BufferGeometry();

    // console.log(array);
    // var s = "[ \"3019.83,-284.576,1186.07\", \"3361.76,-564.477,502.344\", \"3271,-576,621\", \"2771.13,-475.863,1241.46\", \"2866.99,-629.791,1082.8\", \"2922.02,-323.825,1199.7\", \"2800.94,-355,1193.49\", \"3185.48,-551.156,884.765\", \"3012.76,-422.708,1145.88\", \"2776.54,-535.784,1203.58\", \"3020.33,-436.31,1138.75\", \"3328.05,-681.716,375.463\", \"2960.64,-679.757,961.371\", \"3219.78,-562.215,845.443\", \"3019.36,-391.165,1168.21\", \"3228.37,-744.325,515.408\", \"2957.39,-616.083,1005.57\", \"3011.4,-348.041,1171.07\", \"3217.65,-613.546,615.702\", \"2791.82,-438.101,1214.07\", \"2988.63,-689.626,940.463\", \"3039.5,-529.5,967.5\", \"3233.29,-736.047,442.914\", \"11.9997,2791.27,-334.5\", \"2775.54,-240.572,1251.29\", \"2944.6,-330.5,1198.51\", \"3034.61,-472.762,1089.3\", \"2840.52,-240.108,1176.73\", \"3222.73,-748.981,528.426\", \"3132.1,-697.427,772.229\", \"3207.59,-753.932,616.523\", \"2949,-480,1078\", \"2764.96,-443.426,1246.78\", \"2775.28,-364.399,1245.6\", \"2993.61,-689.176,940.159\", \"2791.27,-334.5,1226.6\", \"3330.27,-582.329,565.646\", \"3193.03,-711.343,647.751\", \"3017.68,-456.194,1111.53\", \"2771,-334,1249.7\", \"2847.79,-567.708,1141.88\", \"2793.44,-236.749,1222.34\", \"3193.36,-548.838,888.246\", \"2944.59,-360.5,1198.51\", \"3139.82,-537.177,924.107\", \"2820.69,-535.417,1173.27\", \"3171,-564.839,820.584\", \"2821.96,-606.344,1133.11\", \"3218,-574,747\", \"2848,-425,1242.2\", \"3100.22,-700.497,802.179\", \"3239.14,-564.889,831.589\", \"3356.23,-562.122,454.693\", \"3143.39,-537.205,927.06\", \"2800.77,-598.835,1144.92\", \"2896.25,-591.252,1082.79\", \"3059.68,-493.422,1046.16\", \"3012.44,-242.35,1176.4\", \"3300.16,-583.274,679.802\", \"3067.18,-686.29,842.382\", \"3278.52,-709.349,382.929\", \"2821.47,-606.189,1133.47\", \"3305.99,-581.578,686.466\", \"3094.23,-650,830\", \"3324.9,-582.074,620.487\", \"2911,-241,11\", \"3172.78,-677.031,694.317\", \"3361.23,-555.508,483.901\", \"2877.57,-639.793,1056.94\", \"3245.84,-622.882,528.193\", \"2899.27,-575.14,1077.58\", \"3286,-576,581\", \"2774.71,-275.415,1250.64\", \"2923.38,-608.761,1049.44\", \"3039.36,-688.29,874.816\", \"3126.11,-523.609,964.697\", \"2772.94,-276.185,1248.11\", \"3331.3,-582.077,562.854\", \"3154,-630.917,749.422\" ]";
    // msg = JSON.parse(s);

    // var array = [];
    // for (var i = 0; i < msg.length; i++) {
    //     let applyMatrix4 = msg[i].applyMatrix4(matrix4)
    //     array.push(new THREE.Vector3(applyMatrix4.y/1000, applyMatrix4.z/1000, applyMatrix4.x/1000));
    // }

    /*starsGeometry.setFromPoints(array)

    // var light = new THREE.PointLight(0xffffff, 1, Infinity);
    // camera.add(light);

    // textures
    var texture = new THREE.TextureLoader().load('static/js/report/threejs/textures/sprites/disc.png');
    // texture.needsUpdate = false;

    // starsGeometry.center();
    var starsMaterial = new THREE.PointsMaterial({
    color: 0xff0000,
    map: texture,
    size: 0.05,
    alphaTest: 0.5,
    transparent: false
  });

  starField = new THREE.Points(starsGeometry, starsMaterial);

  // starField.scale.set( 1, 1, 1 );

  // starField.geometry.center();

  //至于上层
  starField.renderOrder = 99;
  starField.material.depthTest = false;

  scene.add(starField);*/
    if(typeof m !== 'undefined') {
        globalObj.points.forEach(function (vertex, index) {

            var red = m.get(vertex.x + "," + vertex.y + "," + vertex.z);
            var f_id = m2.get(vertex.x + "," + vertex.y + "," + vertex.z);
            var geometry = new THREE.SphereGeometry(.01, 10, 10);

            var material;
            if (red == 0) {
                material = new THREE.MeshBasicMaterial({color: 0x008000});
            } else if (red == 1) {
                material = new THREE.MeshBasicMaterial({color: 0xff0000});
            } else {
                material = new THREE.MeshBasicMaterial({color: 0x00ff00});
            }

            var sphere = new THREE.Mesh(geometry, material);
            //sphere.position.set(vertex.x, vertex.y, vertex.z);
            sphere.position.set(vertex.x
                - globalObj.centralObj.position.x,
                vertex.y
                - globalObj.centralObj.position.y,
                vertex.z - globalObj.centralObj.position.z);
            sphere.original = vertex.original;
            vertex.sphere = sphere;
            vertex.f_id = f_id;
            //scene.add( sphere );
            globalObj.centralObj.add(sphere);
        });
    }
    render()

}


function loadPoint(code,data,flabels,onePoints) {

    //判断是否有3d模型,从cookie取,没有模型自行计算

    var normalPoint = $("#normalPoint").children(".move").attr("data-state") ;//正常点
    var outlier = $("#outlier").children(".move").attr("data-state") ;//异常点

    var normalPointVal = 0;
    var outlierVal = 0;
    if (normalPoint== "on") {
        normalPointVal = 1;
    }else{
        normalPointVal = 0;
    }

    if (outlier == "on"){
        outlierVal = 1;
    }else{
        outlierVal = 0;
    }

    if (code == 1){
        //从ajax 获取
        //change here
        jQuery.ajax({
            //url: 'getVertices.json',
            //url: ctx + '/report/getVertices',
            //"static/js/projectJs/data1.json";
            url: "static/js/projectJs/getvertices.json",
            type: 'post',
            data: {
                'rId': rId
                ,'normalPointVal': normalPointVal
                ,'outlierVal': outlierVal
            },
            error: function (msg) {
                alert("error");
                globalObj.points = []
            },
            success: function (msg) {

                var pm1 = new Map(); // 空Map
                var pm2 = new Map();
                var array = [];
                var array2 = [];
                var hm = {};
                for (var i = 0; i < msg.length; i++) {
                    var xyz = typeof msg[i].zb === 'undefined' ? [0,0,0] : msg[i].zb.split(",");
                    if (typeof hm[msg[i].zb] !== 'undefined') {
                        continue;
                    }
                    hm[msg[i].zb] = true;
                    //var applyMatrix4 = new THREE.Vector3(xyz[0], xyz[1], xyz[2]).applyMatrix4(matrix4);
                    var applyMatrix4_1 = new THREE.Vector3(parseInt(xyz[0]),
                        //+ globalObj.multiplyScalar.z * 1000,
                        parseInt(xyz[1]),
                        //+ globalObj.multiplyScalar.x * 1000,
                        parseInt(xyz[2]));// + globalObj.multiplyScalar.y * 1000);
                    var newVertex = new THREE.Vector3(applyMatrix4_1.y/1000, applyMatrix4_1.z/1000, applyMatrix4_1.x/1000);
                    newVertex.original = {x: parseInt(xyz[0]), y: parseInt(xyz[1]), z: parseInt(xyz[2])};
                    array.push(newVertex);
                    pm1.set(newVertex.x+","+newVertex.y+","+newVertex.z, msg[i].red);
                    pm2.set(newVertex.x+","+newVertex.y+","+newVertex.z, msg[i].f_id);
                }
                addSencePoint(array,pm1,pm2);

            }
        });
    } else if (code  == 2){
        var retArr = [];
        //addSencePoint(data);
        globalObj.points.forEach(function(vertex) {
            if (typeof vertex.sphere !== 'undefined') {
                for (var i = 0; i < data.length; i++) {
                    var j = data[i];
                    var m = flabels[i];
                    var k = new THREE.Vector3(j.x + globalObj.multiplyScalar.z * 1000,
                        j.y + globalObj.multiplyScalar.x * 1000, j.z + globalObj.multiplyScalar.y * 1000);
                    var l = new THREE.Vector3(k.y/1000, k.z/1000, k.x/1000);
                    var m_arr = m.split(',');
                    if ((vertex.sphere.position.x === j.x && vertex.sphere.position.y === j.y &&
                        vertex.sphere.position.z === j.z) || (vertex.sphere.position.x === k.x &&
                        vertex.sphere.position.y === k.y && vertex.sphere.position.z === k.z) ||
                        (vertex.sphere.position.x === l.x && vertex.sphere.position.y === l.y &&
                            vertex.sphere.position.z === l.z) || (m_arr.length > 1 && vertex.f_id === m_arr[0])) {
                        console.log("this is getting set visible to true: " + vertex.f_id);
                        vertex.sphere.visible = true;
                        vertex.onePoints = onePoints[i];
                        retArr.push(vertex);
                    } else {
                        vertex.sphere.visible = false;
                    }
                }
            }
        });
        return retArr;
    }



}



function loadOnlyPoint() {

    var normalPoint = $("#normalPoint").children(".move").attr("data-state") ;//正常点
    var outlier = $("#outlier").children(".move").attr("data-state") ;//异常点

    var normalPointVal = 0;
    var outlierVal = 0;
    if (normalPoint== "on") {
        normalPointVal = 1;
    }else{
        normalPointVal = 0;
    }

    if (outlier == "on"){
        outlierVal = 1;
    }else{
        outlierVal = 0;
    }

    //从ajax 获取
    jQuery.ajax({
        //url: ctx + '/report/getVertices',
        url: "static/js/projectJs/getvertices.json",
        type: 'post',
        data: {
            'rId': rId
            ,'normalPointVal': normalPointVal
            ,'outlierVal': outlierVal
        },
        error: function (msg) {
            alert("error");
            globalObj.points = []
        },
        success: function (msg) {

            var pm1 = new Map(); // 空Map
            var array = []
            var array2 = []
            for (var i = 0; i < msg.length; i++) {

                var xyz = typeof msg[i].zb === 'undefined' ? [0,0,0] : msg[i].zb.split(",");
                array.push(new THREE.Vector3(xyz[0], xyz[1], xyz[2]))
            }

            var box = new THREE.Box3().setFromPoints(array);
            globalObj.multiplyScalar = new THREE.Vector3().addVectors( box.min, box.max ).multiplyScalar( 0.5 );//.negate();
            for (var i = 0; i < msg.length; i++) {
                var xyz = typeof msg[i].zb === 'undefined' ? [0,0,0] : msg[i].zb.split(",");

                var applyMatrix4_1 = new THREE.Vector3(parseInt(xyz[0]) - globalObj.multiplyScalar.x,
                    parseInt(xyz[1]) - globalObj.multiplyScalar.y, parseInt(xyz[2]) - globalObj.multiplyScalar.z);
                var newVertex = new THREE.Vector3(applyMatrix4_1.y/1000, applyMatrix4_1.z/1000, applyMatrix4_1.x/1000);
                array2.push(newVertex);
                pm1.set(newVertex.x+","+newVertex.y+","+newVertex.z, msg[i].red);
            }
            addSencePoint1(array2,pm1);
            var box2 = new THREE.Box3().setFromPoints(array2);//box.getSize(new THREE.Vector3()).length();
            var center2 = box2.getCenter(new THREE.Vector3());
            var size = box2.getSize(new THREE.Vector3()).length();

            camera.position.copy(center2);
            camera.position.x += size / 2.0;
            camera.position.y += size / 5.0;
            camera.position.z += size / 2.0;
            camera.lookAt(center2);
            camera.zoom = 1;
            controls.update();
        }
    });

}

function addSencePoint1(array) {

    starsGeometry = new THREE.BufferGeometry();

    starsGeometry.setFromPoints(array)

    // textures
    var texture = new THREE.TextureLoader().load('/static/js/report/threejs/textures/sprites/disc.png');
    // texture.needsUpdate = false;

    // starsGeometry.center();
    var starsMaterial = new THREE.PointsMaterial({
        color: 0xff0000,
        map: texture,
        size: 0.05,
        alphaTest: 0.5,
        transparent: false
    });

    starField = new THREE.Points(starsGeometry, starsMaterial);

    // starField.scale.set( 1, 1, 1 );

    // starField.geometry.center();

    //至于上层
    starField.renderOrder = 99;
    starField.material.depthTest = false;

    scene.add(starField);
}




//用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
var controls;
function initControls() {

    controls = new THREE.CustomOrbitControls( camera, renderer.domElement );

    // 如果使用animate方法时，将此函数删除
    //controls.addEventListener( 'change', render );
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    controls.enableDamping = false;
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    //controls.dampingFactor = 0.25;
    //是否可以缩放
    controls.enableZoom = true;
    //是否自动旋转
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 0.5;
    //设置相机距离原点的最远距离 zz的配置
    // controls.minDistance  = 1;
    //设置相机距离原点的最远距离
    // controls.maxDistance  = 200;
    //是否开启右键拖拽
    controls.enablePan = true;

    //controls.enabled = false;
    controls.addEventListener('change', orbitControlChange);
}

function toScreenPosition(obj, vector, camera)
{
    vector = new THREE.Vector3();
    var canvasBoundingClientRect = renderer.context.canvas.getBoundingClientRect();
    var widthHalf = 0.25*(canvasBoundingClientRect.width + renderer.context.canvas.width);
    var heightHalf = 0.25*(canvasBoundingClientRect.height + renderer.context.canvas.height);
    //var widthHalf = 0.5*renderer.context.canvas.width;
    //var heightHalf = 0.5*renderer.context.canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return {
        x: vector.x,
        y: vector.y
    };
}

function screenPositionCompare(a, b) {
    if (a.y > b.y) return 1;
    if (b.y > a.y) return -1;

    return 0;
}

function sortByDistance(a, b) {
    if (a.distance > b.distance) return 1;
    if (b.distance > a.distance) return -1;

    return 0;
}

function getAccurateScreenPosition2( obj ) {
    const canvas = renderer.context.canvas;
    let canvasWidth = $('#container canvas').width() / 2;
    let canvasHeight = $('#container canvas').height() / 2;
    var mouseVector = new THREE.Vector3();
    var pos = new THREE.Vector3();
    pos = pos.setFromMatrixPosition(obj.matrixWorld);
    pos.project(camera)
    var percX = (pos.x * canvasWidth) + canvasWidth;
    var percY = (-pos.y * canvasHeight) + canvasHeight;
    return {
        x: percX,//(left - canvasWidth / 2),//mouseVector.x * canvasWidth,
        y: percY//(top - canvasHeight / 2)//mouseVector.y * canvasHeight
    };
}

function getAccurateScreenPosition3( pos ) {
    //const canvas = renderer.context.canvas;
    let canvasWidth = $('#container canvas').width() / 2;
    let canvasHeight = $('#container canvas').height() / 2;
    //var mouseVector = new THREE.Vector3();
    //var pos = new THREE.Vector3();
    //pos = pos.setFromMatrixPosition(obj.matrixWorld);
    //pos.set(pos.x - globalObj.centralObj.position.x,
    //pos.y - globalObj.centralObj.position.y,
    //pos.z - globalObj.centralObj.position.z);

    //pos.project(camera)
    var percX = (pos.x * canvasWidth) + canvasWidth;
    var percY = (-pos.y * canvasHeight) + canvasHeight;
    return {
        x: percX,//(left - canvasWidth / 2),//mouseVector.x * canvasWidth,
        y: percY//(top - canvasHeight / 2)//mouseVector.y * canvasHeight
    };
}

function orbitControlChange(e, doAccurateChecking) {
    //optimizeCentralObj();
    /*if (typeof globalObj.points !== 'undefined' && globalObj.points.length > 0) {
        let counter = 0;
        let screenPositions = [];
        var canvasRect = renderer.context.canvas.getBoundingClientRect();
        var graphContainerRect = document.getElementById('graphContainer').getBoundingClientRect();
        let topDiff = canvasRect.top - graphContainerRect.top;
        //$('#container canvas').offset().top - $('#graphContainer').offset().top + 15;
        let leftDiff = canvasRect.left - graphContainerRect.left;
        //$('#container canvas').offset().left - $('#graphContainer').offset().left + 15;
        let outerWidth = $('#graphContainer').width();
        let outerHeight = $('#graphContainer').height();
        let innerWidth = $('#container canvas').width();
        let innerHeight = $('#container canvas').height();
        let offsetX = 10, offsetY = 10;
        globalObj.points.forEach(function(vertex) {
            var screenPosition = getAccurateScreenPosition2(vertex.sphere);
            screenPosition.sphere = vertex.sphere;
            screenPositions.push(screenPosition);
            console.log("check4 (from orbitControlChange) sphere position x: " + vertex.sphere.position.x +
            ", y: " + vertex.sphere.position.y + ", z: " + vertex.sphere.position.z);
            console.log("check4 (from orbitControlChange) x: " + screenPosition.x + ", y: " + screenPosition.y);
        });
        screenPositions.sort(screenPositionCompare);
        //graph.removeCells(graph.getChildVertices(graph.getDefaultParent()))
        if (screenPositions.length > 0) {
            updateLines(screenPositions);
        }
    }*/
    if (typeof globalObj.points !== 'undefined' && typeof globalObj.originalDistanceControlsToCamera !== 'undefined') {
        var r = (controls.target.distanceTo(controls.object.position)) / globalObj.originalDistanceControlsToCamera;
        globalObj.points.forEach(function (vertex) {
            if (typeof vertex.sphere !== 'undefined') {
                vertex.sphere.scale.set(r, r, r);
            }
        });
    }
    if (typeof globalObj.twoPoints !== 'undefined' && globalObj.twoPoints.enabled && globalObj.twoPoints.vertex1 && globalObj.twoPoints.vertex2 && globalObj.twoPoints.vertex3
        && globalObj.twoPoints.vertex4 && globalObj.twoPoints.line) {
        graph.getModel().remove(globalObj.twoPoints.vertex1);
        graph.getModel().remove(globalObj.twoPoints.vertex2);
        graph.getModel().remove(globalObj.twoPoints.vertex3);
        graph.getModel().remove(globalObj.twoPoints.vertex4);
        graph.getModel().remove(globalObj.twoPoints.vertex5);
        graph.getModel().remove(globalObj.twoPoints.line);
    }
    graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
    if (typeof globalObj.cache !== 'undefined') {
        for (var i in globalObj.cache) {
            graph.removeCells([globalObj.cache[i].edge, globalObj.cache[i].v1, globalObj.cache[i].v2]);
        }
    }
}

function render() {
    //光源相机转动
    // lights[0].position.z = camera.position.z - 10
    if (globalObj.explodeMode.carModelMode === 2) { //expanding
        var l = globalObj.explodeMode.carModel.length;
        var counter = 0;
        for (var i = 0; i < l; i++) {
            var dp = globalObj.explodeMode.carModelDestPos[i];
            var op = globalObj.explodeMode.carModelOrigPos[i];
            var cm = globalObj.explodeMode.carModel[i];
            var diffX = (dp.x - op.x)/70;
            var diffY = (dp.y - op.y)/70;
            var diffZ = (dp.z - op.z)/70;
            if (cm.position.x === dp.x && cm.position.y === dp.y && cm.position.z === dp.z) {
                counter++;
            } else if (Math.abs(cm.position.x - dp.x) < .004
                && Math.abs(cm.position.y - dp.y) < .004
                && Math.abs(cm.position.z - dp.z) < .004
            ) {
                cm.position.copy(dp);
                counter++;
            } else {
                cm.position.set(cm.position.x + diffX, cm.position.y + diffY, cm.position.z + diffZ);
                //cm.position.translateX(diffX);
                //cm.position.translateY(diffY);
                //cm.position.translateZ(diffZ);
            }
        }
        if (counter === l) {
            globalObj.explodeMode.carModelMode = 4;
            document.getElementById('explodeModeToggle').innerHTML = '扩小';
        }
    } else if (globalObj.explodeMode.carModelMode === 3) { //shrinking
        var l = globalObj.explodeMode.carModel.length;
        var counter = 0;
        for (var i = 0; i < l; i++) {
            var dp = globalObj.explodeMode.carModelDestPos[i];
            var op = globalObj.explodeMode.carModelOrigPos[i];
            var cm = globalObj.explodeMode.carModel[i];
            var diffX = (op.x - dp.x)/70;
            var diffY = (op.y - dp.y)/70;
            var diffZ = (op.z - dp.z)/70;
            if (cm.position.x === op.x && cm.position.y === op.y && cm.position.z === op.z) {
                counter++;
            } else if (Math.abs(cm.position.x - op.x) < .004
                && Math.abs(cm.position.y - op.y) < .004
                && Math.abs(cm.position.z - op.z) < .004
            ) {
                cm.position.copy(op);
                counter++;
            } else {
                cm.position.set(cm.position.x + diffX, cm.position.y + diffY, cm.position.z + diffZ);
                //cm.position.translateY(diffY);
                //cm.position.translateZ(diffZ);
            }
        }
        if (counter === l) {
            globalObj.explodeMode.carModelMode = 1;
            document.getElementById('explodeModeToggle').innerHTML = '扩大';
        }
    }
    renderer.render( scene, camera );
}

//窗口变动触发的函数
function onWindowResize() {

    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    // console.log(camera.position);
    render();

    // background.style({aspect: camera.aspect});

    renderer.setSize( container.offsetWidth, container.offsetHeight );
    //graph.updateGroupBounds();
    //var borderSizes = graph.getBorderSizes();
    /*var graphBounds = graph.getGraphBounds();
    console.log(graphBounds);
    graph.fit();
    graph.center();
    graph.view.rendering = true;
    graph.refresh();*/

    /*var margin = 2;
    var max = 3;

    var bounds = graph.getGraphBounds();
    var cw = graph.container.clientWidth - margin;
    var ch = graph.container.clientHeight - margin;
    var w = bounds.width / graph.view.scale;
    var h = bounds.height / graph.view.scale;
    var s = Math.min(max, Math.min(cw / w, ch / h));

    graph.view.scaleAndTranslate(s,
    (margin + cw - w * s) / (2 * s) - bounds.x / graph.view.scale,
    (margin + ch - h * s) / (2 * s) - bounds.y / graph.view.scale);*/
}

function animate() {

    requestAnimationFrame(animate);
    //更新控制器
    render();
}

var background ;

var IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

function draw() {
    initRender();
    initScene();
    initCamera();
    initLight();
    initModel();
    initControls();
    //Make ThreeJS canvas sizable and movable
    $("#container").draggable({ containment: "#graphContainer", distance: 10, disabled: true,
        drag: function() {
            orbitControlChange();
        }
    });
    $("#container").resizable({
        handles: 'n, e, s, w, ne, nw, sw, se', disabled: true,
        resize: function( event, ui ) {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( container.offsetWidth, container.offsetHeight );
            /*var canvasRect = renderer.context.canvas.getBoundingClientRect();
            var graphContainerRect = document.getElementById('graphContainer').getBoundingClientRect();
            var topDiff2 = $('#container canvas').offset().top - $('#graphContainer').offset().top;
            var leftDiff2 = $('#container canvas').offset().left - $('#graphContainer').offset().left;
            var topDiff = canvasRect.top - graphContainerRect.top;
            var leftDiff = canvasRect.left - graphContainerRect.left;
            try {

              // Adds cells to the model in a single step
              graph.getModel().beginUpdate();
              var graphBounds = graph.getGraphBounds();
              parent = graph.getDefaultParent();
              var v1 = graph.insertVertex(parent, 'anchor1', '', 0 - graphBounds.x, 0 - graphBounds.y, 0, 0,'overflow=fill;fillColor=none;fontColor=#000000;');
              var v2 = graph.insertVertex(parent, 'anchor2', '', leftDiff - graphBounds.x, topDiff - graphBounds.y, 0, 0,'overflow=fill;fillColor=none;fontColor=#000000;');
              var e1 = graph.insertEdge(parent, 'anchorEdge', '', v1, v2);
              if (typeof globalObj.anchor === 'undefined')
              globalObj.anchor = {};
              else {
                graph.getModel().remove(globalObj.anchor.v1);
                graph.getModel().remove(globalObj.anchor.v2);
                graph.getModel().remove(globalObj.anchor.e1);
              }
              //graph.remove
              globalObj.anchor.v1 = v1;
              globalObj.anchor.v2 = v2;
              globalObj.anchor.e1 = e1;
            } finally {
              graph.getModel().endUpdate();
            }*/
            orbitControlChange();
        }
    });

    animate();

// background = createBackground({
//     aspect: camera.aspect,
//     grainScale: IS_IOS ? 0 : 0.001, // mattdesl/three-vignette-background#1
//     colors: ['#ffffff', '#353535']
// });
// scene.add(background);

    window.onresize = onWindowResize;
}


// var elem = document.getElementById("myBar");
//
function onProgress (xhr) {

    var width = parseInt(xhr.loaded / xhr.total * 100);

    // elem.style.width = width + '%';
    // elem.innerHTML = width * 1 + '%';

    if(width == 100){
        //
        // elem.innerHTML = '加载完成';
        //
        // elem.style.display = "none";

        setTimeout(function(){

            //记录默认相机位置
            localStorage.setItem("defaultCameraState",JSON.stringify(camera.matrix.toArray()));
            $('body').append('<div class="nodeCompleted"></div>');

        }, 4000);

    }
}

$(function () {
    draw();
    $("#pageScreen").height($(window).height()-30);
})

function getBoundingBox(obj) {
    if (obj.type === 'Scene') {
        var bbox = new THREE.Box3().setFromObject(obj.children[0]);
    } else if (obj.type ==='Mesh') {
        var bbox = new THREE.Box3().setFromObject(obj);
    }
    return bbox;
}

function changeZIndex (zx) {
    var focusAdjuster = document.getElementById('focusAdjuster').value;

    /*if (zx == 0 ) {
      $("#container").css( "zIndex", 10 )
      $("#graphContainer").css( "zIndex", 8 )
    } else {
      $("#container").css( "zIndex", 8 )
      $("#graphContainer").css( "zIndex", 10 )

      showReport();
    }*/
    var bbox = getBoundingBox(globalObj.centralObj);
    var bboxCenter = new THREE.Vector3();
    bbox.getCenter(bboxCenter);
    switch(focusAdjuster) {
        case "XY"://front
            camera.position.set(0, 0, bbox.max.z + 1);
            camera.lookAt(bboxCenter);
            break;
        case "YX"://behind
            camera.position.set(0, 0, bbox.min.z + 1);
            camera.lookAt(bboxCenter);
            break;
        case "XZ"://above
            camera.position.set(0, bbox.max.y + 1, 0);
            camera.lookAt(bboxCenter);
            break;
        case "ZX"://below
            camera.position.set(0, bbox.min.y + 1, 0);
            camera.lookAt(bboxCenter);
            break;
        case "ZY"://right
            camera.position.set(bbox.max.x + 1, 0, 0);
            camera.lookAt(bboxCenter);
            break;
        case "YZ"://left
            camera.position.set(bbox.min.x + 1, 0, 0);
            camera.lookAt(bboxCenter);
            break;
        default:
            break;
    }
}

document.getElementById("graphContainer").onclick=function(e){
    var eve = e || window.event;
    var x = eve.clientX,  // 相对于客户端的X坐标
        y = eve.clientY; // 相对于客户端的Y坐标

    console.log(
        "相对客户端的坐标：\n"+
        "x = "+x+"\n"+
        "y = "+y+"\n\n"
    );
}


function saveCamera(){


    var cameraState = JSON.stringify(camera.matrix.toArray());

    var page = parseInt($("#boxs").val())+1;

    //change here
    jQuery.ajax({
        url: ctx + '/perspective/save',
        type: 'post',
        data: {'json': cameraState,"page":page},
        error: function(msg) {
            alert("error");
        },
        success: function(msg) {
            perspectiveMap[page] = cameraState;
            alert(msg == 0 ? "保存成功" :"保存失败");
        }
    });


}
var result = [];
var samples1 = [];
var perspectiveMap;

function make(sId,fId, isFromUpdateLabel){
    if (isFromUpdateLabel) {
        $('.spinner, #overlay').show();
    }
    console.log("点击了生成报告");

    var handoverReportId = $("#handoverReport").val();

    //change here
    jQuery.ajax({
        //url: 'make.json',
        url: ctx + '/report/make',
        type: 'post',
        data:  {"rId":rId,"sId":sId,"fId":fId,"pz":globalObj.spacing.numOfPages,"handoverReportId":handoverReportId},
        error: function(msg) {
            alert("error");
        },
        success: function(msg) {

            //msg  = JSON.parse(msg);
            result = [];
            samples1 = [];
            result = msg.result;
            samples1 =msg.samples1;
            perspectiveMap =msg.perspectiveMap;

            //一页两个点 xyz 不放在一起

            var options = "<option value=\"-1\">请选择</option>\n";
            if (result) {
                for (var i = 0; i < result.length; i++) {
                    var map = result[i];
                    options += "<option zdy='" + JSON.stringify(map) + "' value='" + i + "'>第" + (i + 1) + "页</option>";
                }
            }
            $("#boxs").html(options);

            $('body').append('<div class="selectnodeCompleted"></div>');

        },
        complete: function() {
            if (isFromUpdateLabel) {
                updateLabelHandler();
            }
            $('.spinner, #overlay').hide();
        }
    });
}

function optimizeCamera( camera, points, offset, controls ) {
    offset = offset || 1.25;
    const boundingBox = new THREE.Box3();
    // get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromPoints( points );

    const center = boundingBox.getCenter();

    const size = boundingBox.getSize();

    // get the max side of the bounding box (fits to width OR height as needed )
    const maxDim = Math.max( size.x, size.y, size.z );
    const fov = camera.fov * ( Math.PI / 180 );
    let cameraZ = Math.abs( maxDim / 4 * Math.tan( fov * 2 ) );

    cameraZ *= offset; // zoom out a little so that objects don't fill the screen

    camera.position.z = center.z + cameraZ;

    const minZ = boundingBox.min.z;
    const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;

    camera.far = cameraToFarEdge * 3;
    camera.updateProjectionMatrix();

    if ( controls ) {

        // set camera to rotate around center of loaded object
        controls.target = center;

        // prevent camera from zooming out far enough to create far plane cutoff
        //controls.maxDistance = cameraToFarEdge * 2;

        controls.saveState();

    } else {

        camera.lookAt( center )

    }
}

function showReport() {
    $('.spinner, #overlay').show();
    $('#ParetoDiagramHelper, #TrendMapDiagramHelper, #ControlChartDiagramHelper, ' +
        '#SigmaMapDiagramHelper, #BoxLineChartDiagramHelper, #StackingMapDiagramHelper, ' +
        '#PieChartDiagramHelper, #HistogramDiagramHelper').show();//css('display', 'block');
    $('#testContainer').show();
    handsonTableHelperObjTrendMapsCache = {};
    if (typeof globalObj.twoPoints !== 'undefined') {
        /*if (typeof globalObj.twoPoints.vertex1 !== 'undefined') {
        graph.getModel().remove(globalObj.twoPoints.vertex1);
      }
      if (typeof globalObj.twoPoints.vertex2 !== 'undefined') {
      graph.getModel().remove(globalObj.twoPoints.vertex2);
    }
    if (typeof globalObj.twoPoints.line !== 'undefined') {
    graph.getModel().remove(globalObj.twoPoints.line);
    }*/
        globalObj.twoPoints.vertex1 = null;
        globalObj.twoPoints.vertex2 = null;
        globalObj.twoPoints.vertex3 = null;
        globalObj.twoPoints.vertex4 = null;
        globalObj.twoPoints.line = null;
    }
    var vv1 =  parseInt($("#boxs").find("option:selected").val())+1
    if (typeof globalObj.twoPoints !== 'undefined') {
        if (globalObj.twoPoints.point1 && typeof globalObj.twoPoints.point1 !== 'undefined') {
            globalObj.twoPoints.point1.material.color.setHex(0xff0000);
            globalObj.twoPoints.point1.material.needsUpdate = true;
            globalObj.twoPoints.point1 = null;
        }
        if (globalObj.twoPoints.point2 && typeof globalObj.twoPoints.point2 !== 'undefined') {
            globalObj.twoPoints.point2.material.color.setHex(0xff0000);
            globalObj.twoPoints.point2.material.needsUpdate = true;
            globalObj.twoPoints.point2 = null;
        }
        scene.remove(globalObj.twoPoints.line);
        globalObj.twoPoints.enabled = false;

        document.getElementById('toggleTwoPointsBtn').style.backgroundColor = '#dddddd';
    }

    //Don't delete this, may use this again for restoring camera state
    /*var cameraState= typeof perspectiveMap === 'undefined' ? null : perspectiveMap[vv1];
    if (cameraState != undefined){
        //使用默认的视角
        // cameraState = localStorage.getItem("defaultCameraState");

        //使用数据库中保存的视角
        camera.matrix.fromArray(JSON.parse(cameraState));
        // Get back position/rotation/scale attributes
        camera.matrix.decompose(camera.position, camera.quaternion, camera.scale);
        render();//刷新
    }*/

//删除所有
    graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
    if (typeof globalObj.cache !== 'undefined') {
        for (var i in globalObj.cache) {
            graph.removeCells([globalObj.cache[i].edge, globalObj.cache[i].v1, globalObj.cache[i].v2]);
        }
    }

    var value = $("#boxs").find("option:selected").attr("zdy")
    if (typeof value === 'undefined') {
        $('.spinner, #overlay').hide();
        return false;
    }
    var list = JSON.parse(value);

// var df1= list[0].coordinate.split(",")
// var vector = new THREE.Vector3(df1[0], df1[1], df1[2]);
// vector.unproject(camera);
// vector.sub(camera.position);
// camera.position.addVectors(camera.position,vector.setLength(10));

// render()

    if (starField !== undefined) {
        //销毁
        scene.remove(starField);
        starsGeometry.dispose();
    }

    /*if (typeof globalObj.points !== 'undefined') {
        globalObj.points.forEach(function (vertex) {
            if (typeof vertex.sphere !== 'undefined') {
                vertex.sphere.parent.remove(vertex.sphere);
            }
        });
    }*/
    var tmpPoint = []
    var tmpPoint2 = []
    var tmpPoint3 = []

    var x2 = [];
    x2.push(0);

    var y2 = [];
    y2.push(0);

    var width1 = $('#graphContainer').width();
    var height1 = $('#graphContainer').height();

//@TODO 默认 -2 为了对应点位置
//var autoWith= parseInt( $('#container').css('marginLeft'))-2;
    var containerRect = document.getElementById('container').getBoundingClientRect();
    var graphContainerRect = document.getElementById('graphContainer').getBoundingClientRect();
    var autoWith= parseInt(containerRect.left - graphContainerRect.left) - 2;
//parseInt( $('#container').offset().left - $('#graphContainer').offset().left ) - 2;//.css('marginLeft'))-2;
    var autoTop= containerRect.top - 2;//document.getElementById("container").offsetTop-2;
    var canvasRect = renderer.context.canvas.getBoundingClientRect();
    var graphContainerRect = document.getElementById('graphContainer').getBoundingClientRect();
    var topDiff = canvasRect.top - graphContainerRect.top;
    var leftDiff = canvasRect.left - graphContainerRect.left;
    for (var i = 0; i < list.length; i++) {

        var onePoints  = list[i];
        var coordinate  = onePoints.coordinate
        var flabel = onePoints.flabel
        var xyz = typeof coordinate === 'undefined' ? [0,0,0] : coordinate.split(",");
        // 计算该点的二维坐标
        var tmp;
        if (globalObj.multiplyScalar && typeof globalObj.multiplyScalar !== 'undefined') {
            tmp = new THREE.Vector3(parseInt(xyz[0]) + globalObj.multiplyScalar.z * 1000, parseInt(xyz[1]) + globalObj.multiplyScalar.x * 1000,
                parseInt(xyz[2]) + globalObj.multiplyScalar.y * 1000);
        } else {
            tmp = new THREE.Vector3(parseInt(xyz[0]), parseInt(xyz[1]), parseInt(xyz[2]));
        }
        var applyMatrix4 = new THREE.Vector3(tmp.y/1000, tmp.z/1000, tmp.x/1000);
        tmpPoint.push(applyMatrix4.clone());
        tmpPoint2.push(flabel)
        tmpPoint3.push(onePoints)
    }
    var retArr = loadPoint(2,tmpPoint,tmpPoint2,tmpPoint3)
    //loadPoint(1,tmpPoint);
    /*var x3 = [];
    var y3 = [];
    globalObj.points.forEach(function(vertex) {
        var accuratePos = getAccurateScreenPosition2(vertex.sphere);
        x3.push(accuratePos.x);// + leftDiff);
        y3.push(accuratePos.y);// + topDiff);
    });*/
    /*for (var child in scene.children) {
    scene.children[child].visible = false;
    }*/
    /*globalObj.centralObj.visible = false;
    globalObj.points.forEach(function(vertex) {
        if (typeof vertex.sphere !== 'undefined') {
            vertex.sphere.visible = false;
        }
    });*/
    /*var sphere;
    if (typeof globalObj.sphere === 'undefined') {
        var geometry = new THREE.SphereGeometry( 3.909306011075836, 5, 5 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        sphere = new THREE.Mesh( geometry, material );
        sphere.visible = false;
        scene.add( sphere );
        globalObj.sphere = sphere;
    }
    var originalCameraRotation = camera.rotation.clone();
    var zOptimalRotation = camera.position.clone();
    var zOptimal = 0;
    var angles = [];
    var x, y, z, counter = 0;
    const boundingBox = new THREE.Box3();
// get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromPoints( globalObj.points );

    const center = boundingBox.getCenter();
    var counter = 0;
    var myVar = setInterval(function() {
        //for (counter; counter < globalObj.sphere.geometry.vertices.length; counter++) {
        if (counter >= globalObj.sphere.geometry.vertices.length - 1) {
            angles.sort(areaCompare);
            for (var i = 0; i < angles.length; i++) {
                camera.position.copy(angles[i].position);
                camera.lookAt(center);
                camera.updateProjectionMatrix();
                var sphere1 = globalObj.points[0].sphere;
                var direction = sphere1.position.clone();
                var startPoint = camera.position.clone();
                var directionVector = direction.sub( startPoint );
                var ray = new THREE.Raycaster(startPoint, directionVector.clone().normalize());
                var intersects = ray.intersectObjects(scene.children, true);
                if ( intersects.length > 0 && intersects[0].object !== sphere1 ) {
                    //console.log("hidden");
                    continue;
                } else {
                    //console.log("not hidden");
                }
                var sphere2 = globalObj.points[1].sphere;
                var direction = sphere2.position.clone();
                var startPoint = camera.position.clone();
                var directionVector = direction.sub( startPoint );
                var ray = new THREE.Raycaster(startPoint, directionVector.clone().normalize());
                var intersects = ray.intersectObjects(scene.children, true);
                if ( intersects.length > 0 && intersects[0].object !== sphere2 ) {
                    //console.log("hidden");
                    continue;
                } else {
                    //console.log("not hidden");
                }
                var sphere3 = globalObj.points[2].sphere;
                var direction = sphere3.position.clone();
                var startPoint = camera.position.clone();
                var directionVector = direction.sub( startPoint );
                var ray = new THREE.Raycaster(startPoint, directionVector.clone().normalize());
                var intersects = ray.intersectObjects(scene.children, true);
                if ( intersects.length > 0 && intersects[0].object !== sphere3 ) {
                    //console.log("hidden");
                    continue;
                } else {
                    //console.log("not hidden");
                }
                var sphere4 = globalObj.points[3].sphere;
                var direction = sphere4.position.clone();
                var startPoint = camera.position.clone();
                var directionVector = direction.sub( startPoint );
                var ray = new THREE.Raycaster(startPoint, directionVector.clone().normalize());
                var intersects = ray.intersectObjects(scene.children, true);
                if ( intersects.length > 0 && intersects[0].object !== sphere4 ) {
                    //console.log("hidden");
                    continue;
                } else {
                    //console.log("not hidden");
                }
                var frustum = new THREE.Frustum();
                var projScreenMatrix = new THREE.Matrix4();
                projScreenMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );

                frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse ) );

                if (!frustum.containsPoint( globalObj.points[0].sphere.position ) || !frustum.containsPoint(globalObj.points[1].sphere.position)
                    || !frustum.containsPoint(globalObj.points[2].sphere.position) || !frustum.containsPoint(globalObj.points[3].sphere.position)) {
                    //console.log("not in view...?");
                    continue;
                }
                zOptimalRotation = angles[i].position.clone();
                break;
            }

            camera.position.copy(zOptimalRotation);
            camera.lookAt(center);//globalObj.centralObj);
            camera.zoom = 4;
            camera.updateProjectionMatrix();
            globalObj.centralObj.visible = true;
            globalObj.points.forEach(function(vertex) {
                if (typeof vertex.sphere !== 'undefined') {
                    vertex.sphere.visible = true;
                }
            });*/
    setTimeout(function() {
        //orbitControlChange();

        var x2 = [];
        x2.push(0);

        var y2 = [];
        y2.push(0);

        var z2 = []; //holds that onePoints information
        z2.push({});
        var duplicateCacheChecker = {};
        //if (typeof globalObj.points !== 'undefined' && globalObj.points.length > 0) {

        //globalObj.points.forEach(function (vertex) {
        console.log("around line 1433, retArr is " + retArr);
        retArr.forEach(function (vertex) {
            console.log("around line 1434, visibility is: " + vertex.sphere.visible);
            vertex.sphere.visible = true;
            console.log("around line 1437, scale is: " + vertex.sphere.scale.x + ", " +
                vertex.sphere.scale.y + ", " + vertex.sphere.scale.z);
            vertex.sphere.scale.set(3, 3, 3);
            //for (var i = 0; i < tmpPoint.length; i++) {
            //if (vertex.sphere.position.x === tmpPoint[i].x &&
            //vertex.sphere.position.y === tmpPoint[i].y &&
            //vertex.sphere.position.z === tmpPoint[i].z) {
            //if (typeof vertex.sphere !== 'undefined' && vertex.sphere.visible) {
            var accuratePos = getAccurateScreenPosition2(vertex.sphere);
            console.log("around line 1438, x: " + vertex.sphere.position.x
                + ", y: " + vertex.sphere.position.y + ", z: " + vertex.sphere.position.z);
            var msgPos = {x: accuratePos.x + leftDiff, y: accuratePos.y + topDiff};
            if (!isOutsideCanvas(msgPos)) {
                console.log("isOutsideCanvas is false for " + msgPos);
                if (typeof duplicateCacheChecker[msgPos.x + ',' + msgPos.y] === 'undefined') {
                    duplicateCacheChecker[msgPos.x + ',' + msgPos.y] = true;
                    x2.push(msgPos.x);
                    y2.push(msgPos.y);
                    z2.push(vertex.onePoints);
                }
            } else {
                console.log("isOutsideCanvas is true for " + msgPos);
            }
            //}
            //}
            //}
        });
        //}
        globalObj.pointsHelper = retArr;
        var containerRect = document.getElementById('container').getBoundingClientRect();
        var graphContainerRect = document.getElementById('graphContainer').getBoundingClientRect();
        var marginWidth = containerRect.left - graphContainerRect.left;
//parseInt( $('#container').offset().left - $('#graphContainer').offset().left );

        var wwidth1 = marginWidth * 0.6;//图表占marginLeft0.8

        var mHeight = $("#pageScreen").height() / 5.5;
        var x1 = [0];
        var y1 = [0];
        var labelWidth = typeof handsonTableOptionsOriginal !== 'undefined' ? handsonTableOptionsOriginal.width:100;
        var labelHeight = typeof handsonTableOptionsOriginal !== 'undefined' ? handsonTableOptionsOriginal.height:70;
        /*var maxWidthAndHeight = getMaxWidthAndHeight();
        labelWidth = maxWidthAndHeight.maxWidth;
        labelHeight = maxWidthAndHeight.maxHeight;*/

        //03/07/2020 - working on scaling of label using width and height (to do later, use area instead)
        //var positions = getLabelPosition2(x2.length, labelWidth, labelHeight, x1, y1);
        //function labelPositionOptimizer(labelW, labelH, count, x1, y1) {
        //var positions = labelPositionOptimizer(labelWidth, labelHeight, x2.length, x1, y1);
        var positions = labelPositionOptimizerUsingArea2(labelWidth, labelHeight, x2.length, x1, y1);

        if (x1.length > x2.length) {
            while (x1.length > x2.length) {
                x1.pop();
                y1.pop();
            }
        } else if (x1.length !== x2.length) {
            $('.spinner, #overlay').hide();
            return false;
        }
//change here
//求内点外点不交叉的线
        jQuery.ajax({
            //url: 'line'+vv1+'.json',
            url: ctx + '/report/line',
            type: 'post',
            data:
                {
                    'x1': x1
                    , 'y1': y1
                    , 'x2': x2
                    , 'y2': y2
                },
            error: function (msg) {
                alert("error");
            },
            success: function (msg) {

                //msg  = JSON.parse(msg);
                //clear object that caches four lines
                globalObj.cache = [];
                graph.removeCells(graph.getChildVertices(graph.getDefaultParent()))
                if (typeof globalObj.cache !== 'undefined') {
                    for (var i in globalObj.cache) {
                        graph.removeCells([globalObj.cache[i].edge, globalObj.cache[i].v1, globalObj.cache[i].v2]);
                    }
                }
                var checker = [];
                scaleWidthAndHeight(handsonTableOptions, positions.width, positions.height, positions.originalWidth,
                    positions.originalHeight, x1, y1);
                handsonTable.updateSettings(handsonTableOptions);
                for (var i = 1; i < x2.length; i++) {

                    var tx = x2[i];
                    var ty = y2[i];
                    var tz = z2[i];//that onePoints information

                    if (true
                        //(tx >= autoWith && tx <= (autoWith+container.offsetWidth)) &&
                        //(ty >= autoTop && ty <= (autoTop+container.offsetHeight))
                    ) {
                        //设置三维坐标转换二维坐标的map
                        var twozb = tx + "," + ty  //这个点的2d坐标
                        console.log("twozb is: " + twozb);
                        if (typeof checker[twozb] !== 'undefined') {
                            console.log("twozb " + twozb + " already in checker cache");
                        } else {
                            checker[twozb] = true;
                        }
                        var points = list[i - 1].points
                        var coordinates = list[i - 1].coordinate.split(',');
                        var coordinates = coordinates.length > 2 ?
                            {
                                x: coordinates[0],
                                y: coordinates[1],
                                z: coordinates[2]
                            }
                            :
                            {x: 0, y: 0, z: 0};

                        var index;

                        var split1 = typeof msg[twozb] === 'undefined' ? [0, 0, 0] : msg[twozb].split(",")
                        var x = parseFloat(split1[0])
                        var y = parseFloat(split1[1])

                        if (x == 0) {
                            index = 1;
                        } else if (y == 0) {
                            index = 3;
                        } else if (typeof wx2 !== 'undefined' && wx2 == x) {
                            index = 2;
                        } else if (typeof wy4 !== 'undefined' && wy4 == y) {
                            index = 4
                        }
                        var msgPos = {x: tx, y: ty};
                        //if (!isOutsideCanvas(msgPos)) {
                        //addLine(list[i - 1].flabel, twozb, msg[twozb], points, samples1, index, coordinates, i, positions);
                        addLine2(list[i - 1].flabel, twozb, msg[twozb], points, samples1, index, coordinates, i, positions, tz, true);
                        //}
                    } else {
                        console.log("out of container?");
                    }
                }
                var len = parseInt($("#boxs").find("option:selected").val()) + 1;
                var str = '<div class="line' + len + '"></div>';
                $('body').append(str);
                $('#testContainer').hide();
                if (handsonTableActiveAjaxCalls <= 0) {
                    handsonTableActiveAjaxCalls = 0;
                    moveParetoChartsFromAltToAltHolder();
                    $('.spinner, #overlay').hide();
                } else {
                    //do a setInterval here
                    //might be better
                    setTimeout(function() {
                        //if (handsonTableActiveAjaxCalls > 0) {
                        handsonTableActiveAjaxCalls = 0;
                        moveParetoChartsFromAltToAltHolder();
                        $('.spinner, #overlay').hide();
                        //}, 4000)
                        //}
                    }, 100 * handsonTableActiveAjaxCalls);
                }
            }
        });
    }, 400);
    //clearInterval(myVar);

    /*}
    x = globalObj.sphere.geometry.vertices[counter].x;
    y = globalObj.sphere.geometry.vertices[counter].y;
    z = globalObj.sphere.geometry.vertices[counter].z;
    counter++;

    camera.position.set(x, y, z);
    camera.lookAt(center);
    camera.updateProjectionMatrix();

    let screenPositions = [];
    globalObj.points.forEach(function(vertex) {
        var screenPosition = toScreenPosition(vertex.sphere, vertex.clone(), camera);
        screenPositions.push(screenPosition);
    });
    screenPositions.sort(screenPositionCompare);
    if (screenPositions.length == 4) {
        if (screenPositions[0].x < screenPositions[1].x) {
            if (screenPositions[2].x < screenPositions[3].x) {
                x1 = getTriangleArea(screenPositions[0], screenPositions[1], screenPositions[2]);
                y1 = getTriangleArea(screenPositions[2], screenPositions[3], screenPositions[1]);
                z1 = x1 + y1;
            } else {
                x1 = getTriangleArea(screenPositions[0], screenPositions[1], screenPositions[3]);
                y1 = getTriangleArea(screenPositions[2], screenPositions[3], screenPositions[0]);
                z1 = x1 + y1;
            }
        } else {
            if (screenPositions[2].x < screenPositions[3].x) {
                x1 = getTriangleArea(screenPositions[0], screenPositions[1], screenPositions[2]);
                y1 = getTriangleArea(screenPositions[2], screenPositions[3], screenPositions[0]);
                z1 = x1 + y1;
            } else {
                x1 = getTriangleArea(screenPositions[0], screenPositions[1], screenPositions[3]);
                y1 = getTriangleArea(screenPositions[2], screenPositions[3], screenPositions[1]);
                z1 = x1 + y1;
            }
        }
        console.log("area: " + z1);
        console.log("position x: " + x + ", y: " + y + ", z: " + z);
        console.log("screen1: " + screenPositions[0].x + ", " + screenPositions[0].y);
        console.log("screen2: " + screenPositions[1].x + ", " + screenPositions[1].y);
        console.log("screen3: " + screenPositions[2].x + ", " + screenPositions[2].y);
        console.log("screen4: " + screenPositions[3].x + ", " + screenPositions[3].y);

        angles.push({area: z1, position: camera.position.clone()})
    }
}, 30);*/

}

function areaCompare(a, b) {
    if (a.area < b.area) return 1;
    if (b.area < a.area) return -1;

    return 0;
}

function getTriangleArea(x, y, z) {
    var x1 = Math.sqrt(Math.pow(x.x - y.x, 2) + Math.pow(x.y - y.y, 2));
    var y1 = Math.sqrt(Math.pow(y.x - z.x, 2) + Math.pow(y.y - z.y, 2));
    return x1 * y1 / 2;
}

function getDistanceBetween23DPoints(x, y, scale) {
    if (typeof scale === 'undefined')
        scale = 1;
    var x1 = Math.pow((x.x * scale) - (y.x * scale), 2) + Math.pow((x.y * scale) - (y.y * scale), 2)
        + Math.pow((x.z * scale) - (y.z * scale), 2);
    return Math.sqrt(x1);
}

function getDistanceBetween22DPoints(x, y) {
    var x1 = Math.pow(x.x - y.x, 2) + Math.pow(x.y - y.y, 2);
    return Math.sqrt(x1);
}

function clearTwoPointsVertices() {
    if (typeof globalObj.twoPoints !== 'undefined' && globalObj.twoPoints.point1 && typeof globalObj.twoPoints.point1 !== 'undefined') {
        globalObj.twoPoints.point1.material.color.setHex(0xff0000);
        globalObj.twoPoints.point1 = null;
    }
    if (typeof globalObj.twoPoints !== 'undefined' && globalObj.twoPoints.point2 && typeof globalObj.twoPoints.point2 !== 'undefined') {
        globalObj.twoPoints.point2.material.color.setHex(0xff0000);
        globalObj.twoPoints.point2 = null;
    }
    if (typeof globalObj.twoPoints.vertex1 !== 'undefined') {
        graph.getModel().remove(globalObj.twoPoints.vertex1);
    }
    if (typeof globalObj.twoPoints.vertex2 !== 'undefined') {
        graph.getModel().remove(globalObj.twoPoints.vertex2);
    }
    if (typeof globalObj.twoPoints.vertex3 !== 'undefined') {
        graph.getModel().remove(globalObj.twoPoints.vertex3);
    }
    if (typeof globalObj.twoPoints.vertex4 !== 'undefined') {
        graph.getModel().remove(globalObj.twoPoints.vertex4);
    }
    if (typeof globalObj.twoPoints.vertex5 !== 'undefined') {
        graph.getModel().remove(globalObj.twoPoints.vertex5);
    }
    if (typeof globalObj.twoPoints.line !== 'undefined') {
        graph.getModel().remove(globalObj.twoPoints.line);
    }
}

function toggleHelper(name, enable) {
    if (enable) {
        if (name != "dragAndResize") {
            if (typeof globalObj.dragAndResize !== 'undefined') {
                globalObj.dragAndResize = false;
                //controls.enabled = true;
                $('#container').draggable('disable');
                $('#container').resizable('disable');
                document.getElementById('toggleDragAndResize').style.backgroundColor = '#dddddd';
            }
        }
        if (name != "objectRotator") {
            controls.enabled = true;
            if (typeof globalObj.transformControl !== 'undefined') {
                globalObj.transformControl.detach(globalObj.centralObj);
            }
            document.getElementById('objectRotator').style.backgroundColor = '#dddddd';
        }
        if (name != "boxSelector") {
            if (typeof globalObj.selectMode !== 'undefined') {
                globalObj.selectMode.enabled = false;
            }
            //document.getElementById('boxSelector').style.backgroundColor = '#dddddd';
        }

        /*if (name !== "twoPoints") {
          if (typeof globalObj.twoPoints !== 'undefined') {
            globalObj.twoPoints.enabled = false;
            clearTwoPointsVertices();
            document.getElementById('toggleTwoPointsBtn').style.backgroundColor = '#dddddd';
          }
        }*/

        if (name !== "singleSelector") {
            if (typeof globalObj.singleSelector !== 'undefined') {
                globalObj.singleSelector.enabled = false;
                document.getElementById('singleSelector').style.backgroundColor = '#dddddd';
            }
        }

        if (name !== "modelSelector" && name !== "colorMode" && name !== "lightMode") {
            if (typeof globalObj.modelSelector !== 'undefined') {
                if (typeof globalObj.modelSelector.box !== 'undefined') {
                    scene.remove(globalObj.modelSelector.box);
                }
                globalObj.modelSelector.enabled = false;
                document.getElementById('modelSelector').style.backgroundColor = '#dddddd';
            }
        }

        if (name === "colorMode" || name === "deleteMode" || name === "lightMode") {
            document.getElementById('modelSelector').style.backgroundColor = '#dddddd';
        }

        if (name !== "regionSelector") {
            controls.enabled = true;
            //camera.clearViewOffset();
            document.getElementById('regionSelector').style.backgroundColor = '#dddddd';
        }
        //controls.enabled = true;
        if (name !== "explodeMode") {
            if (typeof globalObj.explodeMode !== 'undefined' && typeof globalObj.explodeMode.carModel !== 'undefined') {
                toggleVisibility(scene, true);
                for (var i = 0; i < globalObj.explodeMode.carModel.length; i++) {
                    toggleVisibility(globalObj.explodeMode.carModel[i], false);
                }
            }
            document.getElementById('explodeMode').style.backgroundColor = '#dddddd';
        }
    } else {
        if (name == "modelSelector") {
            if (typeof globalObj.modelSelector !== 'undefined') {
                if (typeof globalObj.modelSelector.box !== 'undefined') {
                    scene.remove(globalObj.modelSelector.box);
                }

                globalObj.modelSelector.enabled = false;
                document.getElementById('modelSelector').style.backgroundColor = '#dddddd';
            }
        }
        if (name != "dragAndResize") {
            if (typeof globalObj.dragAndResize !== 'undefined') {
                globalObj.dragAndResize = false;
                //controls.enabled = true;
                $('#container').draggable('disable');
                $('#container').resizable('disable');
                document.getElementById('toggleDragAndResize').style.backgroundColor = '#dddddd';
            }
        }
        if (typeof globalObj.transformControl !== 'undefined') {
            globalObj.transformControl.detach(globalObj.transformControl.object);
        }
    }
}

function toggleObjectRotator(e) {
    if (typeof globalObj.objectRotator === 'undefined')
        globalObj.objectRotator = {enabled: false};
    globalObj.objectRotator.enabled = !(!!globalObj.objectRotator.enabled);
    toggleHelper('objectRotator', globalObj.objectRotator.enabled);
    if (globalObj.objectRotator.enabled) {
        controls.enabled = false;
        if (typeof globalObj.transformControl === 'undefined') {
            globalObj.transformControl = new THREE.TransformControls( camera, renderer.domElement );
            globalObj.transformControl.addEventListener( 'change', render );
            globalObj.transformControl.setMode( "rotate" );
            globalObj.transformControl.addEventListener( 'dragging-changed', function ( event ) {

            } );
            scene.add( globalObj.transformControl );
        }
        globalObj.transformControl.attach( globalObj.centralObj );

        e.currentTarget.style.backgroundColor = '#555555';
    } else {
        controls.enabled = true;
        globalObj.transformControl.detach(globalObj.centralObj);
        e.currentTarget.style.backgroundColor = '#dddddd';
    }
}

function toggleRegionSelector(e) {
    e.preventDefault();
    if (typeof globalObj.regionSelector === 'undefined')
        globalObj.regionSelector = {enabled: false};
    globalObj.regionSelector.enabled = !(!!globalObj.regionSelector.enabled);
    toggleHelper('regionSelector', globalObj.regionSelector.enabled);
    if (globalObj.regionSelector.enabled) {
        controls.enabled = false;

        e.currentTarget.style.backgroundColor = '#555555';
    } else {
        //camera.clearViewOffset();
        controls.enabled = true;
        e.currentTarget.style.backgroundColor = '#dddddd';
    }
}

function addToMode(e) {
    globalObj.fileInput.click();
}

function deleteMode(e) {
    if (typeof globalObj.modelSelector !== 'undefined' && typeof globalObj.modelSelector.box !== 'undefined' && globalObj.modelSelector !== null && globalObj.modelSelector.box !== null) {
        scene.remove(globalObj.modelSelector.box);
        if (typeof globalObj.modelSelector.box.object.parent !== 'undefined' && globalObj.modelSelector.box.object.parent.type === 'Group') {
            scene.remove(globalObj.modelSelector.box.object.parent);
            for (var i = 0; i < globalObj.loadedObjects.length; i++) {
                var loadedObject = globalObj.loadedObjects[i];
                if (loadedObject === globalObj.modelSelector.box.object.parent) {
                    globalObj.loadedObjects.splice(i, 1);
                    break;
                }
            }
        } else {
            scene.remove(globalObj.modelSelector.box.object);
            for (var i = 0; i < globalObj.loadedObjects.length; i++) {
                var loadedObject = globalObj.loadedObjects[i];
                if (loadedObject === globalObj.modelSelector.box.object.parent) {
                    globalObj.loadedObjects.splice(i, 1);
                    break;
                }
            }
        }
        scene.remove(globalObj.modelSelector.box);
        if (typeof globalObj.transformControl !== 'undefined')
            globalObj.transformControl.detach();
        globalObj.modelSelector.box = null;
        //scene.remove(globalObj.modelSelector.box.object);
    } else {
        alert('先用"选择3D模型"选一个模型');
    }
}

function colorMode(e) {
    if (typeof globalObj.colorMode === 'undefined') {
        globalObj.colorMode = {enabled: false};
    }
    e.preventDefault();
    if (typeof globalObj.modelSelector !== 'undefined' && typeof globalObj.modelSelector.box !== 'undefined') {
        globalObj.colorMode.enabled = !(!!globalObj.colorMode.enabled);
        toggleHelper('colorMode', globalObj.colorMode.enabled);
        if (globalObj.colorMode.enabled) {
            globalObj.colorMode.dialog.dialog("open");
            e.currentTarget.style.backgroundColor = '#555555';
        } else {
            globalObj.colorMode.dialog.dialog("close");
            e.currentTarget.style.backgroundColor = '#dddddd';
        }
    } else {
        alert('先用"选择3D模型"选一个模型');
    }
}

function colorChange(e) {
    e.preventDefault();
    //var objColor = document.getElementById('objColor');
    if (typeof globalObj.modelSelector !== 'undefined' && typeof globalObj.modelSelector.box !== 'undefined') {
        if (typeof globalObj.modelSelector.box.object.parent !== 'undefined' && globalObj.modelSelector.box.object.parent.type === 'Group') {
            for (var i = 0; i < globalObj.loadedObjects.length; i++) {
                var loadedObject = globalObj.loadedObjects[i];
                if (loadedObject === globalObj.modelSelector.box.object.parent) {
                    var newColor = "0x" + document.getElementById('objColor').value.substring(1, document.getElementById('objColor').value.length);
                    loadedObject.material.color.setHex(newColor);
                    break;
                }
            }
        } else {
            for (var i = 0; i < globalObj.loadedObjects.length; i++) {
                var loadedObject = globalObj.loadedObjects[i];
                if (loadedObject === globalObj.modelSelector.box.object ||
                    (typeof loadedObject.children !== 'undefined' && loadedObject.children[0] === globalObj.modelSelector.box.object)) {
                    if (typeof loadedObject.material === 'undefined') {
                        if (typeof loadedObject.children[0] !== 'undefined' && typeof loadedObject.children[0].material !== 'undefined') {
                            var newColor = "0x" + document.getElementById('objColor').value.substring(1, document.getElementById('objColor').value.length);
                            loadedObject.children[0].material.color.setHex(newColor);
                        }
                    } else {
                        var newColor = "0x" + document.getElementById('objColor').value.substring(1, document.getElementById('objColor').value.length);
                        loadedObject.material.color.setHex(newColor);
                    }
                    break;
                }
            }
        }
        //scene.remove(globalObj.modelSelector.box);
        //globalObj.modelSelector.box = null;
    } else {
        alert('先用"选择3D模型"选一个模型');
    }
}

function toggleExplodeMode(e) {
    e.preventDefault();
    if (typeof globalObj.explodeMode === 'undefined')
        globalObj.explodeMode = {enabled: false};
    globalObj.explodeMode.enabled = !(!!globalObj.explodeMode.enabled);
    toggleHelper("explodeMode", globalObj.explodeMode.enabled);
    if (globalObj.explodeMode.enabled) {
        globalObj.explodeMode.carModelMode = 1; //1 - shrunk, 2 - expand, 3 - shrink, 4 - expanded
        toggleVisibility(scene, false);
        scene.visible = true;
        if (typeof globalObj.explodeMode.carModel === 'undefined' || globalObj.explodeMode.carModel.length <= 0) {
            globalObj.explodeMode.carModel = [];
            globalObj.explodeMode.carModelOrigPos = [];
            globalObj.explodeMode.carModelDestPos = [
                new THREE.Vector3(.4, .8, 1),
                new THREE.Vector3(-1, 1, 0),
                new THREE.Vector3(1, 1, 0),
                new THREE.Vector3(.4, .8, 0),
                new THREE.Vector3(-1, .8, 0),
                new THREE.Vector3(.4, .8, -1),
                new THREE.Vector3(-.4, .8, -1),
                new THREE.Vector3(-.5, .8, -1),
                new THREE.Vector3(-.4, .8, 1),
                new THREE.Vector3(-.5, .8, 1)
            ];
            var loader = new THREE.STLLoader();
            //change here
            loader.load( ctx + '/static/models/hu/RAV4 -zuohoumen.stl', function ( geometry ) {
                //loader.load( 'static/models/RAV4 -zuohoumen.stl', function ( geometry ) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color:0x0006B5}))
                mesh.rotation.x = -Math.PI / 2;
                mesh.position.setY(.8);
                globalObj.explodeMode.carModel[0] = mesh;
                globalObj.explodeMode.carModelOrigPos[0] = mesh.position.clone();
                scene.add( mesh );
            } );
            //change here
            loader.load( ctx + '/static/models/hu/RAV4-fadongjizhao.stl', function ( geometry ) {
                //loader.load( 'static/models/RAV4-fadongjizhao.stl', function ( geometry ) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: 0x03FCEC}))
                mesh.rotation.x = -Math.PI / 2;
                mesh.position.setY(.8);
                globalObj.explodeMode.carModel[1] = mesh;
                globalObj.explodeMode.carModelOrigPos[1] = mesh.position.clone();
                scene.add( mesh );
            } );
            //change here
            loader.load( ctx + '/static/models/hu/RAV4-houbeimen.stl', function ( geometry ) {
                //loader.load( 'static/models/RAV4-houbeimen.stl', function ( geometry ) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color:0xB41BBF}))
                mesh.rotation.x = -Math.PI / 2;
                mesh.position.setY(.8);
                globalObj.explodeMode.carModel[2] = mesh;
                globalObj.explodeMode.carModelOrigPos[2] = mesh.position.clone();
                scene.add( mesh );
            } );
            //change here
            loader.load( ctx + '/static/models/hu/RAV4-houfangzhaungliang.stl', function ( geometry ) {
                //loader.load( 'static/models/RAV4-houfangzhaungliang.stl', function ( geometry ) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color:0xBF571B}))
                mesh.rotation.x = -Math.PI / 2;
                mesh.position.setY(.8);
                globalObj.explodeMode.carModel[3] = mesh;
                globalObj.explodeMode.carModelOrigPos[3] = mesh.position.clone();
                scene.add( mesh );
            } );
            //change here
            loader.load( ctx + '/static/models/hu/RAV4-qianfangzhuangliang.stl', function ( geometry ) {
                //loader.load( 'static/models/RAV4-qianfangzhuangliang.stl', function ( geometry ) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial())
                mesh.rotation.x = -Math.PI / 2;
                mesh.position.setY(.8);
                globalObj.explodeMode.carModel[4] = mesh;
                globalObj.explodeMode.carModelOrigPos[4] = mesh.position.clone();
                scene.add( mesh );
            } );
            //change here
            loader.load( ctx + '/static/models/hu/RAV4-youhoumen.stl', function ( geometry ) {
                //loader.load( 'static/models/RAV4-youhoumen.stl', function ( geometry ) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: 0xEB4034}))
                mesh.rotation.x = -Math.PI / 2;
                mesh.position.setY(.8);
                globalObj.explodeMode.carModel[5] = mesh;
                globalObj.explodeMode.carModelOrigPos[5] = mesh.position.clone();
                scene.add( mesh );
            } );
            //change here
            loader.load( ctx + '/static/models/hu/RAV4-youqianmen.stl', function ( geometry ) {
                //loader.load( 'static/models/RAV4-youqianmen.stl', function ( geometry ) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: 0xBF635E}))
                mesh.rotation.x = -Math.PI / 2;
                mesh.position.setY(.8);
                globalObj.explodeMode.carModel[6] = mesh;
                globalObj.explodeMode.carModelOrigPos[6] = mesh.position.clone();
                scene.add( mesh );
            } );
            //change here
            loader.load( ctx + '/static/models/hu/RAV4-youyiziban.stl', function ( geometry ) {
                //loader.load( 'static/models/RAV4-youyiziban.stl', function ( geometry ) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial())
                mesh.rotation.x = -Math.PI / 2;
                mesh.position.setY(.8);
                globalObj.explodeMode.carModel[7] = mesh;
                globalObj.explodeMode.carModelOrigPos[7] = mesh.position.clone();
                scene.add( mesh );
            } );
            //change here
            loader.load( ctx + '/static/models/hu/RAV4-zuoqianmen.stl', function ( geometry ) {
                //loader.load( 'static/models/RAV4-zuoqianmen.stl', function ( geometry ) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: 0x00B50F}))
                mesh.rotation.x = -Math.PI / 2;
                mesh.position.setY(.8);
                globalObj.explodeMode.carModel[8] = mesh;
                globalObj.explodeMode.carModelOrigPos[8] = mesh.position.clone();
                scene.add( mesh );
            } );
            //change here
            loader.load( ctx + '/static/models/hu/RAV4-zuoyiziban.stl', function ( geometry ) {
                //loader.load( 'static/models/RAV4-zuoyiziban.stl', function ( geometry ) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial())
                mesh.rotation.x = -Math.PI / 2;
                mesh.position.setY(.8);
                globalObj.explodeMode.carModel[9] = mesh;
                globalObj.explodeMode.carModelOrigPos[9] = mesh.position.clone();
                scene.add( mesh );
            } );
        } else {
            for (var i = 0; i < globalObj.explodeMode.carModel.length; i++) {
                toggleVisibility(globalObj.explodeMode.carModel[i], true);
            }
        }

        e.currentTarget.style.backgroundColor = '#555555';
    } else {
        toggleVisibility(scene, true);
        for (var i = 0; i < globalObj.explodeMode.carModel.length; i++) {
            toggleVisibility(globalObj.explodeMode.carModel[i], false);
        }
        e.currentTarget.style.backgroundColor = '#dddddd';
    }
}

function toggleVisibility(obj, visibility) {
    if (typeof obj === 'undefined' || typeof obj.children === 'undefined')
        return false;
    obj.visible = visibility;
    for (var i = 0; i < obj.children.length; i++) {
        if (typeof obj.children[i].children !== 'undefined') {
            toggleVisibility(obj.children[i], visibility);
        }
        obj.children[i].visible = visibility;
    }
}

function explodeModeToggle(e) {
    if (typeof globalObj.explodeMode === 'undefined' || !globalObj.explodeMode.enabled) {
        alert('请先启用"爆炸图"');
        return false;
    }
    if (globalObj.explodeMode.carModelMode === 1) {
        globalObj.explodeMode.carModelMode = 2;
    } else if (globalObj.explodeMode.carModelMode === 4) {
        globalObj.explodeMode.carModelMode = 3;
    }
}

function toggleSingleSelector(e) {
    e.preventDefault();
    if (typeof globalObj.singleSelector === 'undefined')
        globalObj.singleSelector = {enabled: false};
    globalObj.singleSelector.enabled = !(!!globalObj.singleSelector.enabled);
    if (globalObj.singleSelector.enabled) {
        //controls.enabled = false;
        if (typeof globalObj.dragAndResize !== 'undefined') {
            globalObj.dragAndResize = false;
            controls.enabled = true;
            $('#container').draggable('disable');
            $('#container').resizable('disable');
        }
        if (typeof globalObj.selectMode !== 'undefined') {
            globalObj.selectMode.enabled = false;
        }
        if (typeof globalObj.twoPoints !== 'undefined') {
            globalObj.twoPoints.enabled = false;
            clearTwoPointsVertices();
        }
        controls.enabled = true;
        document.getElementById('boxSelector').style.backgroundColor = '#dddddd';
        document.getElementById('toggleTwoPointsBtn').style.backgroundColor = '#dddddd';
        e.currentTarget.style.backgroundColor = '#555555';
    } else {
        //controls.enabled = true;
        e.currentTarget.style.backgroundColor = '#dddddd';
    }
}

function toggleLight(e) {
    if (typeof globalObj.lightMode === 'undefined') {
        globalObj.lightMode = {enabled: false};
    }
    e.preventDefault();
    globalObj.lightMode.enabled = !(!!globalObj.lightMode.enabled);
    toggleHelper('lightMode', globalObj.lightMode.enabled);
    if (globalObj.lightMode.enabled) {
        document.getElementById('objLight').selectedIndex = 0;
        $('#commonLightDiv').hide();
        $('#pointLightDiv').hide();
        $('#spotLightDiv').hide();
        $('#directionalLightDiv').hide();
        $('#hemisphereLightDiv').hide();
        $('#ambientLightDiv').hide();
        globalObj.lightMode.dialog.dialog("open");
        e.currentTarget.style.backgroundColor = '#555555';
    } else {
        globalObj.lightMode.dialog.dialog("close");
        e.currentTarget.style.backgroundColor = '#dddddd';
    }
}

function addLight(e) {
    var objLight = document.getElementById('objLight');
    var light = {};
    switch (objLight.value) {
        case "point":
            var color = 0xffffff;
            var intensity = 1;
            var distance = 0;

            light.light = new THREE.PointLight( color, intensity, distance );
            light.light.name = "pointlight" + globalObj.lights.length;
            light.helper = new THREE.PointLightHelper(light.light, 1);
            break;
        case "spot":
            var color = 0xffffff;
            var intensity = 1;
            var distance = 0;
            var angle = Math.PI * 0.1;
            var penumbra = 0;

            light.light = new THREE.SpotLight( color, intensity, distance, angle, penumbra );
            light.light.name = "spotlight" + globalObj.lights.length;
            light.helper = new THREE.SpotLightHelper(light.light, 1);
            break;
        case "directional":
            var color = 0xffffff;
            var intensity = 1;

            light.light = new THREE.DirectionalLight( color, intensity );
            light.light.name = "directionallight" + globalObj.lights.length;
            if (typeof globalObj.centralObj.children !== 'undefined') {
                light.light.target = globalObj.centralObj.children[0];
            } else {
                light.light.target = globalObj.centralObj;
            }
            light.helper = new THREE.DirectionalLightHelper(light.light, 1);
            break;
        case "hemisphere":
            var skyColor = 0x00aaff;
            var groundColor = 0xffaa00;
            var intensity = 1;

            light.light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
            light.light.name = "hemispherelight" + globalObj.lights.length;
            light.helper = new THREE.HemisphereLightHelper(light.light, 1);
            break;
        case "ambient":
            var color = 0x222222;

            light.light = new THREE.AmbientLight( color );
            light.light.name = "ambientlight" + globalObj.lights.length;
            break;
        default:
            break;
    }
    globalObj.lights.push(light);
    refreshLightSel();
    if (typeof light.light !== 'undefined')
        scene.add(light.light);
    if (typeof light.helper !== 'undefined')
        scene.add(light.helper);
}

function toggleLightHelperVisibility(e) {
    e.preventDefault();
    var light = globalObj.lights[document.getElementById('objLightSel').value];
    if (light.light.isPointLight) {
        if (typeof light.helper !== 'undefined') {
            light.helper.visible = !light.helper.visible;
        }
    } else if (light.light.isDirectionalLight) {
        if (typeof light.helper !== 'undefined') {
            light.helper.visible = !light.helper.visible;
        }
    } else if (light.light.isSpotLight) {
        if (typeof light.helper !== 'undefined') {
            light.helper.visible = !light.helper.visible;
        }
    } else if (light.light.isHemisphereLight) {
        if (typeof light.helper !== 'undefined') {
            light.helper.visible = !light.helper.visible;
        }
    } else { //Ambient light
    }
}

function refreshLightSel() {
    var objLightSel = document.getElementById('objLightSel');
    var l = objLightSel.options.length;
    for (var i = 0; i < l; i++) {
        objLightSel.options[0] = null;
    }
    var counter = 0;
    var defaultLightOpt = document.createElement('option');
    defaultLightOpt.value = '';
    defaultLightOpt.innerHTML = '--选光灯--';
    objLightSel.appendChild(defaultLightOpt);
    globalObj.lights.forEach(function(light) {
        var lightOpt = document.createElement('option');
        lightOpt.value = counter++;
        lightOpt.innerHTML = light.light.name;
        objLightSel.appendChild(lightOpt);
    });
}

function objLightChange(e) {
    var light = globalObj.lights[e.currentTarget.value];
    if (light.light.isPointLight) {
        document.getElementById('pointLightDistance').value = light.light.distance;
        document.getElementById('pointLightDecay').value = light.light.decay;
        $('#pointLightDiv').show();
    } else if (light.light.isDirectionalLight) {
        $('#directionalLightDiv').show();
    } else if (light.light.isSpotLight) {
        document.getElementById('spotLightDistance').value = light.light.distance;
        document.getElementById('spotLightDecay').value = light.light.decay;
        document.getElementById('spotLightAngle').value = light.light.angle;
        document.getElementById('spotLightPenumbra').value = light.light.penumbra;
        $('#spotLightDiv').show();
    } else if (light.light.isHemisphereLight) {
        $('#hemisphereLightDiv').show();
    } else { //Ambient light
        $('#ambientLightDiv').show();
    }
    document.getElementById('lightPosX').value = light.light.position.x;
    document.getElementById('lightPosY').value = light.light.position.y;
    document.getElementById('lightPosZ').value = light.light.position.z;
    document.getElementById('lightColor').value = light.light.color;
    document.getElementById('lightIntensity').value = light.light.intensity;
    document.getElementById('lightVisible').checked = light.light.visible;
    $('#commonLightDiv').show();
}

function updateLight(e) {
    var light = globalObj.lights[document.getElementById('objLightSel').value];
    if (light) {
        if (light.light.isPointLight) {
            light.light.distance = document.getElementById('pointLightDistance').value;
            light.light.decay = document.getElementById('pointLightDecay').value;
        } else if (light.light.isDirectionalLight) {

        } else if (light.light.isSpotLight) {
            light.light.distance = document.getElementById('spotLightDistance').value;
            light.light.decay = document.getElementById('spotLightDecay').value;
            light.light.angle = document.getElementById('spotLightAngle').value;
            light.light.penumbra = document.getElementById('spotLightPenumbra').value;
        } else if (light.light.isHemisphereLight) {
            light.light.groundColor.setHex("0x" + document.getElementById('groundLightColor').value.substring(1, document.getElementById('groundLightColor').value.length - 1));
        } else { //Ambient light

        }
        var lightPos = new THREE.Vector3(document.getElementById('lightPosX').value, document.getElementById('lightPosY').value, document.getElementById('lightPosZ').value);
        light.light.position.copy(lightPos);
        light.light.color.setHex("0x" + document.getElementById('lightColor').value.substring(1, document.getElementById('lightColor').value.length - 1));
        light.light.intensity = document.getElementById('lightIntensity').value;
        light.light.visible = document.getElementById('lightVisible').checked;
    }
}

function deleteLight(e) {
    e.preventDefault();
    var light = globalObj.lights[document.getElementById('objLightSel').value];
    if (light.light.name === 'ambient_light') {
        camera.remove(light.light);
    } else if (light.light.name === 'main_light') {
        camera.remove(light.light);
    }
    for (var i = 0; i < globalObj.lights.length; i++) {
        var light2 = globalObj.lights[i];
        if (light == light2) {
            scene.remove(light2.light);
            light2.light = null;
            if (typeof light2.helper !== 'undefined') {
                scene.remove(light2.helper);
                light2.helper = null;
            }
            globalObj.lights.splice(i, 1);
            refreshLightSel();
            break;
        }
    }
    $('#commonLightDiv').hide();
    $('#pointLightDiv').hide();
    $('#spotLightDiv').hide();
    $('#directionalLightDiv').hide();
    $('#hemisphereLightDiv').hide();
    $('#ambientLightDiv').hide();
    recUpdateMaterials(scene);
}

function recUpdateMaterials(obj) {
    for (var i = 0; i < obj.children.length; i++) {
        if (typeof obj.children[i].children !== 'undefined') {
            recUpdateMaterials(obj.children[i]);
        } else if (obj.children[i].material) {
            obj.children[i].material.needsUpdate = true;
        }
    }
}

function moveLightOnCanvas(e) {
    var light = globalObj.lights[document.getElementById('objLightSel').value];
    if (typeof globalObj.transformControl === 'undefined') {
        globalObj.transformControl = new THREE.TransformControls( camera, renderer.domElement );
        globalObj.transformControl.addEventListener( 'change', render );
        globalObj.transformControl.addEventListener( 'dragging-changed', function ( event ) {

        } );
        scene.add( globalObj.transformControl );
    }
    if (light.light.isPointLight) {
        globalObj.transformControl.attach(light.light);//.helper);
    } else if (light.light.isDirectionalLight) {
        globalObj.transformControl.attach(light.light);//.helper);
    } else if (light.light.isSpotLight) {
        globalObj.transformControl.attach(light.light);//.helper);
    } else if (light.light.isHemisphereLight) {
        globalObj.transformControl.attach(light.light);//.helper);
    }
    controls.enabled = false;
    globalObj.lightMode.dialog.dialog("close");
    e.currentTarget.style.backgroundColor = '#dddddd';
}

function toggleBoxSelector(e) {
    e.preventDefault();
    globalObj.selectMode.dialog.dialog("open");
}

function toggle75View(e) {
    if (typeof globalObj.zoom75 === 'undefined')
        globalObj.zoom75 = {enabled: false};
    globalObj.zoom75.enabled = !(!!globalObj.zoom75.enabled);
    if (globalObj.zoom75.enabled) {
        camera.zoom *= 1.25;
        camera.updateProjectionMatrix();
        e.currentTarget.style.backgroundColor = '#555555';
    } else {
        camera.zoom *= .75;
        camera.updateProjectionMatrix();
        e.currentTarget.style.backgroundColor = '#dddddd';
    }
}

function toggleModelSelector(e) {
    if (typeof globalObj.modelSelector === 'undefined')
        globalObj.modelSelector = {enabled: false};
    globalObj.modelSelector.enabled = !(!!globalObj.modelSelector.enabled);
    toggleHelper("modelSelector", globalObj.modelSelector.enabled);
    if (globalObj.modelSelector.enabled) {
        e.currentTarget.style.backgroundColor = '#555555';
    } else {
        e.currentTarget.style.backgroundColor = '#dddddd';
    }
}

function toggleTwoPoints(e) {
    var point1, point2;
    if (typeof globalObj.twoPoints === 'undefined')
        globalObj.twoPoints = {enabled: false};
    globalObj.twoPoints.enabled = !(!!globalObj.twoPoints.enabled);
    toggleHelper("twoPoints", globalObj.twoPoints.enabled);
    if (globalObj.twoPoints.enabled) {
        if (typeof globalObj.selectMode !== 'undefined') {
            globalObj.selectMode.enabled = false;
            //document.getElementById('boxSelector').style.backgroundColor = '#dddddd';
        }
        if (typeof globalObj.singleSelector !== 'undefined') {
            globalObj.singleSelector.enabled = false;
            document.getElementById('singleSelector').style.backgroundColor = '#dddddd';
        }
        if (typeof globalObj.dragAndResize !== 'undefined') {
            globalObj.dragAndResize = false;
            //controls.enabled = true;
            $('#container').draggable('disable');
            $('#container').resizable('disable');
        }
        e.currentTarget.style.backgroundColor = '#555555';
    } else {
        clearTwoPointsVertices();
        e.currentTarget.style.backgroundColor = '#dddddd';
    }
}

function modelSelectorModeClick(e) {
    if (typeof globalObj.transformControl === 'undefined') {
        globalObj.transformControl = new THREE.TransformControls( camera, renderer.domElement );
        globalObj.transformControl.addEventListener( 'change', render );
        globalObj.transformControl.addEventListener( 'dragging-changed', function ( event ) {

        } );
        scene.add( globalObj.transformControl );
    }
    toggleHelper('objectRotator', globalObj.objectRotator.enabled);
    globalObj.transformControl.setMode( e.currentTarget.value );
}

function toggleDragAndResize(e) {
    globalObj.dragAndResize = !(!!globalObj.dragAndResize);
    console.log("dragAndResize is " + globalObj.dragAndResize);
    toggleHelper("dragAndResize", globalObj.dragAndResize);
    if (globalObj.dragAndResize) {
        var canvasRect = renderer.context.canvas.getBoundingClientRect();
        var graphContainerRect = document.getElementById('graphContainer').getBoundingClientRect();
        let topDiff = canvasRect.top - graphContainerRect.top;
        //$('#container canvas').offset().top - $('#graphContainer').offset().top;// + 15;
        let leftDiff = canvasRect.left - graphContainerRect.left;
        $('#container').css('right', 'auto');
        $('#container').css('bottom', 'auto');
        $('#container').css('left', leftDiff);
        $('#container').css('top', topDiff);
        $('#container').draggable('enable');
        $('#container').resizable('enable');
        e.currentTarget.style.backgroundColor = '#555555';
        controls.enabled = false;
    } else {
        $('#container').draggable('disable');
        $('#container').resizable('disable');
        controls.enabled = true;
        e.currentTarget.style.backgroundColor = '#dddddd';
    }
}
var i = 0;
function switchPerspective() {

    $("#container").css( "zIndex", 10 )
    //$("#graphContainer").css( "zIndex", 8 )

    var f = ""
    if(i <= 2){
        f = "+"
    }else{
        f = "-"
    }

    var length =  camera.position.length()
    var array = [0,0,0]
    var index  = i % 3
    array[index] = parseFloat((f)+length)

    i++;

    if (i == 6){
        i  = 0;
    }
    camera.position.set(array[0], array[1], array[2])
    // console.log(array);
    camera.lookAt(scene.position)
    render()
}

var hi = 0
function hiddenModel(e) {
    /*hi++
    var b = hi%2 == 0
    mesh.visible = b;*/
    if (typeof globalObj.modelSelector === 'undefined' || typeof globalObj.modelSelector.selectedObj === 'undefined') {
        alert('先用"选择3D模型"选一个模型');
    }
    globalObj.isHidden = !(!!globalObj.isHidden);
    console.log("isHidden is " + globalObj.isHidden);
    //toggleHelper("hideModel", globalObj.isHidden);
    if (globalObj.isHidden) {
        /*if (globalObj.centralObj.type === "Scene") {
          globalObj.centralObj.children[0].visible = false;
        } else {
          globalObj.centralObj.visible = false;
        }*/
        if (globalObj.modelSelector.selectedObj.type === "Scene") {
            globalObj.modelSelector.selectedObj.children[0].visible = false;
        }// else {
        globalObj.modelSelector.selectedObj.visible = false;
        //}
        e.currentTarget.style.backgroundColor = '#555555';
    } else {
        if (globalObj.modelSelector.selectedObj.type === "Scene") {
            globalObj.modelSelector.selectedObj.children[0].visible = true;
        }// else {
        globalObj.modelSelector.selectedObj.visible = true;
        //}
        e.currentTarget.style.backgroundColor = '#dddddd';
    }
}

function prevPage() {

    var v = parseInt($("#boxs").val());

    if (v <= 0){
        alert("已经是最前页");
    } else{
        $("#boxs").val(v-1);
        $("#boxs").trigger("change");
    }

}

function nextPage() {
    var v = parseInt($("#boxs").val());
    var index = v+1;
    if(index > $('#boxs option:last').val()){
        alert("已经是最尾页");
    }else{
        $("#boxs").val(index);
        $("#boxs").trigger("change");
    }
}

$('#ffeature').on('click','.layui-table-body tr',function(){


    //现在是点击某个点跳转到哪个点,如果选中多个点,一页不能显示出完整？？

    if ($(this).css("background-color") == "rgb(173, 216, 230)") {

        $(this).removeAttr("style");

    } else {
        $(this).css("background-color", "lightblue");
    }

    var fearure = $(this).find("td").eq(0).text();

    var p = 0;
    for (var i = 0; i < result.length; i++) {

        var page = result[i];
        for (var j = 0; j < page.length; j++) {

            if(page[j].flabel == fearure){
                p = i+1;
                break;
            }
        }
    }

    $("#boxs").val(p);
    $("#boxs").trigger("change");

})


function downloadPdf() {

    jQuery.ajax({
        url: '${ctx}/cover',
        type: 'get',
        data:  {},
        error: function(msg) {
            alert("error");
        },
        success: function(msg) {
            parent.layer.open({
                type: 1,
                offset: '10%',//top
                scrollbar: false,
                area: ['80%', '80%'],
                maxmin: true, //开启最大化最小化按钮
                shade: 0 ,
                shadeClose: true, //点击遮罩关闭
                title:'请填写封面信息',
                content: msg //注意，如果str是object，那么需要字符拼接。
            });
        }
    });

}


$(function(){

    $('#container canvas').click(function(e) {
        onCanvasMouseDown(e);
        orbitControlChange(e, true);
        updateTwoPointsLabels(e);
    });
    $('#container canvas').mousedown(function(e) {
        if (typeof globalObj.selectMode !== 'undefined' && typeof globalObj.selectMode.pendingReset !== 'undefined'
            && globalObj.selectMode.pendingReset) {
            e.preventDefault();
            camera.clearViewOffset();
            camera.updateProjectionMatrix();
            globalObj.selectMode.pendingReset = false;
            return false;
        }
        if (typeof globalObj.regionSelector !== 'undefined' && typeof globalObj.regionSelector.pendingReset !== 'undefined' && globalObj.regionSelector.pendingReset) {
            e.preventDefault();
            camera.clearViewOffset();
            controls.enabled = true;
            globalObj.regionSelector.pendingReset = false;
            globalObj.regionSelector.enabled = false;
            document.getElementById('regionSelector').style.backgroundColor = '#dddddd';
            return false;
        }
        if (!isWithinCanvas(e)) {
            e.preventDefault();
            return false;
        }
        if (typeof globalObj.selectMode !== 'undefined' && globalObj.selectMode.enabled && (globalObj.selectMode.type === SELECTOR_MODE_BOX_ALL || globalObj.selectMode.type === SELECTOR_MODE_UNBOX || globalObj.selectMode.type === SELECTOR_MODE_BOX_TOP4
            || globalObj.selectMode.type === SELECTOR_MODE_UNBOX_ALL)) {
            var pos = getCanvasRelativePosition(e);
            globalObj.selectMode.pos = pos;
            globalObj.selectMode.mousedown = true;
            /*if (globalObj.selectMode.type !== SELECTOR_MODE_UNBOX) {
              globalObj.points.forEach(function(vertex) {
                vertex.sphere.material.color.setHex(0xff0000);
              });
            }*/
        } else if (typeof globalObj.regionSelector !== 'undefined' && globalObj.regionSelector.enabled) {
            var pos = getCanvasRelativePosition(e);
            globalObj.regionSelector.pos = pos;
            globalObj.regionSelector.mousedown = true;
            /*globalObj.points.forEach(function(vertex) {
              vertex.sphere.material.color.setHex(0xff0000);
            });*/
        } else if (typeof globalObj.selectMode === 'undefined' || !globalObj.selectMode.enabled) {
            var value = $("#boxs").find("option:selected").attr("zdy")
            if (typeof value !== 'undefined' && value !== -1) {

                graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
                if (typeof globalObj.cache !== 'undefined') {
                    for (var i in globalObj.cache) {
                        graph.removeCells([globalObj.cache[i].edge, globalObj.cache[i].v1, globalObj.cache[i].v2]);
                    }
                }

                if (starField !== undefined) {
                    //销毁
                    scene.remove(starField);
                    starsGeometry.dispose();
                }

                /*globalObj.points.forEach(function (vertex) {
                    //if (typeof vertex.sphere.parent !== 'undefined') {
                    //vertex.sphere.parent.remove(vertex.sphere);
                    //}
                    vertex.sphere.visible = false;
                });*/
                globalObj.labelNeedsUpdate = true;
            }
        }
    });

    $('#container canvas').mousemove(function(e) {
        if (!isWithinCanvas(e)) {
            e.preventDefault();
            console.log("preventing default windows mousemove");
            return false;
        }
        if (typeof globalObj.selectMode !== 'undefined' && globalObj.selectMode.enabled &&
            globalObj.selectMode.mousedown) {
            var pos = getCanvasRelativePosition(e);
            var canvasRect = renderer.context.canvas.getBoundingClientRect();
            var graphContainerRect = document.getElementById('graphContainer').getBoundingClientRect();
            var topDiff = canvasRect.top - graphContainerRect.top;
            var leftDiff = canvasRect.left - graphContainerRect.left;
            try {
                var fourCorners = getFourCorners(pos, globalObj.selectMode.pos);
                console.log("pos1 x: " + pos.x + ", pos1 y: " + pos.y + ", pos2 x: " + globalObj.selectMode.pos.x + ", pos2 y: " + globalObj.selectMode.pos.y);
                console.log("topLeft x: " + fourCorners.topLeft.x + ", topLeft y: " + fourCorners.topLeft.y);
                if (typeof globalObj.selectMode.box !== 'undefined')
                    graph.getModel().remove(globalObj.selectMode.box);
                // Adds cells to the model in a single step
                graph.getModel().beginUpdate();
                var v = graph.insertVertex(parent, null, '', fourCorners.topLeft.x + leftDiff, fourCorners.topLeft.y + topDiff,
                    Math.abs(fourCorners.topLeft.x - fourCorners.topRight.x), Math.abs(fourCorners.topLeft.y - fourCorners.bottomLeft.y), 'rounded=0;whiteSpace=wrap;html=1;dashed=1;strokeWidth=2;perimeterSpacing=0;fillColor=none;');
                globalObj.selectMode.box = v;
            } finally {
                graph.getModel().endUpdate();
            }
        }
        if (typeof globalObj.regionSelector !== 'undefined' && globalObj.regionSelector.enabled &&
            globalObj.regionSelector.mousedown) {
            var pos = getCanvasRelativePosition(e);
            var canvasRect = renderer.context.canvas.getBoundingClientRect();
            var graphContainerRect = document.getElementById('graphContainer').getBoundingClientRect();
            var topDiff = canvasRect.top - graphContainerRect.top;
            var leftDiff = canvasRect.left - graphContainerRect.left;
            try {
                var fourCorners = getFourCorners(pos, globalObj.regionSelector.pos);
                console.log("pos1 x: " + pos.x + ", pos1 y: " + pos.y + ", pos2 x: " + globalObj.regionSelector.pos.x + ", pos2 y: " + globalObj.regionSelector.pos.y);
                console.log("topLeft x: " + fourCorners.topLeft.x + ", topLeft y: " + fourCorners.topLeft.y);
                if (typeof globalObj.regionSelector.box !== 'undefined')
                    graph.getModel().remove(globalObj.regionSelector.box);
                // Adds cells to the model in a single step
                graph.getModel().beginUpdate();
                var v = graph.insertVertex(parent, null, '', fourCorners.topLeft.x + leftDiff, fourCorners.topLeft.y + topDiff,
                    Math.abs(fourCorners.topLeft.x - fourCorners.topRight.x), Math.abs(fourCorners.topLeft.y - fourCorners.bottomLeft.y), 'rounded=0;whiteSpace=wrap;html=1;dashed=1;strokeWidth=2;perimeterSpacing=0;fillColor=none;');
                globalObj.regionSelector.box = v;
            } finally {
                graph.getModel().endUpdate();
            }
        }
    });

    $(window).mouseup(function(e) {
        if (typeof globalObj.selectMode !== 'undefined' && globalObj.selectMode.enabled && globalObj.selectMode.mousedown &&
            (globalObj.selectMode.type === SELECTOR_MODE_BOX_ALL || globalObj.selectMode.type === SELECTOR_MODE_BOX_TOP4 || globalObj.selectMode.type === SELECTOR_MODE_UNBOX
                || globalObj.selectMode.type === SELECTOR_MODE_UNBOX_ALL)) {
            $('.spinner, #overlay').show();
            var pos = getCanvasRelativePosition(e);
            try {
                if (typeof globalObj.selectMode.box !== 'undefined')
                    graph.getModel().remove(globalObj.selectMode.box);
                var fourCorners = getFourCorners(pos, globalObj.selectMode.pos);
                // Adds cells to the model in a single step
                graph.getModel().beginUpdate();
                globalObj.inViewArr = [];
                globalObj.points.forEach(function(vertex) {
                    var screenPosition = getAccurateScreenPosition2(vertex.sphere);
                    if (isWithin(fourCorners, screenPosition)) {
                        if (globalObj.selectMode.type === SELECTOR_MODE_BOX_TOP4) {
                            globalObj.inViewArr.push({sphere: vertex.sphere, distance: getDistanceBetween23DPoints(camera.position, vertex.sphere.position)});
                        } else if (globalObj.selectMode.type === SELECTOR_MODE_BOX_ALL) {
                            vertex.sphere.material.color.setHex(0x00ff00);
                        } else if (globalObj.selectMode.type === SELECTOR_MODE_UNBOX || globalObj.selectMode.type === SELECTOR_MODE_UNBOX_ALL) {
                            vertex.sphere.material.color.setHex(0xff0000);
                        }
                    }
                });
                if (globalObj.selectMode.type === SELECTOR_MODE_BOX_TOP4) {
                    globalObj.inViewArr.sort(sortByDistance);
                    for (var i = 0; i < globalObj.inViewArr.length; i++) {
                        if (i < 4) {
                            globalObj.inViewArr[i].sphere.material.color.setHex(0x00ff00);
                        } else {
                            globalObj.inViewArr[i].sphere.material.color.setHex(0xff0000);
                        }
                    }
                }
                //$('.spinner, #overlay').hide();
                var counter = 0;
                var counterSolved = 0;

                $('.spinner, #overlay').hide();
                globalObj.selectMode.box = null;
                globalObj.selectMode.mousedown = false;
            } finally {
                graph.getModel().endUpdate();
            }
        }
        if (typeof globalObj.regionSelector !== 'undefined' && globalObj.regionSelector.enabled) {
            var pos = getCanvasRelativePosition(e);
            if (typeof globalObj.regionSelector.box !== 'undefined')
                graph.getModel().remove(globalObj.regionSelector.box);
            var fourCorners = getFourCorners(pos, globalObj.regionSelector.pos);
            var widthHelper = Math.abs(fourCorners.topLeft.x - fourCorners.topRight.x);
            var heightHelper = Math.floor(widthHelper * $('#container canvas').height() / $('#container canvas').width());//Math.abs(fourCorners.topLeft.y - fourCorners.bottomLeft.y);
            //var dimensionHelper = widthHelper > width
            // Adds cells to the model in a single step
            camera.setViewOffset($('#container canvas').width(), $('#container canvas').height(), fourCorners.topLeft.x, fourCorners.topLeft.y,
                widthHelper, heightHelper);
            globalObj.regionSelector.pendingReset = true;
            /*window.addEventListener('mousedown', function(e) {
              camera.clearViewOffset();
              controls.enabled = true;
              document.getElementById('regionSelector').style.backgroundColor = '#dddddd';
            }, true);*/
            globalObj.regionSelector.box = null;
            globalObj.regionSelector.mousedown = false;
        }
        if (globalObj.labelNeedsUpdate && (typeof globalObj.selectMode === 'undefined' || !globalObj.selectMode.enabled)) {
            //updateLabels();
            globalObj.labelNeedsUpdate = false;
        }
    });

    $('#zoomAdjuster').slider({
        min: 0,
        max: 4,
        step: .1,
        slide: function(event, ui) {
            var v = ui.value;
            if (ui.value < 0.01) {
                v = 0.01;
            }
            if (typeof globalObj.zoom === 'undefined') {
                globalObj.zoom = v;
            }
            var zoomIn = v > globalObj.zoom;
            var diff = zoomIn?(globalObj.zoom == 0?0:v/globalObj.zoom):(v == 0?0:globalObj.zoom/v);
            globalObj.zoom = v;
            $('#zoom-custom-handle').text(ui.value.toFixed(1));
            /*if (typeof camera !== 'undefined') {
              camera.zoom = ui.value;
              camera.updateProjectionMatrix();
            }*/
            if (typeof controls !== 'undefined') {
                if (zoomIn) {
                    controls.dollyIn(diff);
                    controls.update();
                } else {
                    controls.dollyOut(diff);
                    controls.update();
                }
            }
        }
    });
    $('#opacityAdjuster').slider({
        min: 0,
        max: 1,
        step: .01,
        slide: function(event, ui) {

            //console.log(ui.value + ", " + $(this).slider('value'));
            if (typeof globalObj.modelSelector !== 'undefined' && typeof globalObj.modelSelector.selectedObj !== 'undefined') {
                $('#opacity-custom-handle').text(ui.value);
                changeOpacity(globalObj.modelSelector.selectedObj, ui.value);
            } else {
                alert('先用"选择3D模型"选一个模型');
            }

            /*if (typeof globalObj.centralObj !== 'undefined') {
              changeOpacity(globalObj.centralObj, ui.value);
            }*/
        }
    });
    var form = document.createElement( 'form' );
    form.style.display = 'none';
    document.body.appendChild( form );
    var fileInput = document.createElement( 'input' );
    fileInput.multiple = true;
    fileInput.type = 'file';
    var loader = new Loader();
    fileInput.addEventListener( 'change', function ( event ) {

        loader.loadFiles( fileInput.files );
        form.reset();

    } );
    globalObj.fileInput = fileInput;
    form.appendChild( fileInput );

    /*$('#pageScreen, #graphContainer *, #container').click(function(e) {
    //$(window).mousedown(function(e) {
    globalObj.points.forEach(function(vertex) {
    var screenPosition = toScreenPosition(starField, vertex.clone(), camera);
    var p = getCanvasRelativePosition(e);
    var xs = screenPosition.x - p.x;
    var ys = screenPosition.y - p.y;
    xs *= xs;
    ys *= ys;
    if (Math.sqrt(xs + ys) < 1) {
    globalObj.selectedObj = vertex.sphere;
    return;
  }
  });
  });*/
});
function changeOpacity(obj, opacity) {
    if (obj.type === 'Scene') {
        obj.children.forEach(function(obj2) {
            obj2.material.opacity = opacity;
            obj2.material.transparent = true;
        });
    } else if (obj.type ==='Mesh') {
        obj.material.opacity = opacity;
        obj.material.transparent = true;
    }
}
function getFourCorners(pos1, pos2) {
    var retObj = {};
    if (typeof pos1 === 'undefined') {
        retObj.topLeft = {x: pos1.x, y: pos1.y};
        retObj.topRight = {x: pos1.x, y: pos1.y};
        retObj.bottomLeft = {x: pos1.x, y: pos1.y};
        retObj.bottomRight = {x: pos1.x, y: pos1.y};
        return retObj;
    }
    if (typeof pos2 === 'undefined') {
        retObj.topLeft = {x: pos2.x, y: pos2.y};
        retObj.topRight = {x: pos2.x, y: pos2.y};
        retObj.bottomLeft = {x: pos2.x, y: pos2.y};
        retObj.bottomRight = {x: pos2.x, y: pos2.y};
        return retObj;
    }
    if (pos1.x < pos2.x) {
        if (pos1.y < pos2.y) { //pos1 is left of pos2, pos1 is above pos2
            retObj.topLeft = {x: pos1.x, y: pos1.y};
            retObj.topRight = {x: pos2.x, y: pos1.y};
            retObj.bottomLeft = {x: pos1.x, y: pos2.y};
            retObj.bottomRight = {x: pos2.x, y: pos2.y};
        } else { //pos1 is left of pos2, pos1 is below pos2
            retObj.topLeft = {x: pos1.x, y: pos2.y};
            retObj.topRight = {x: pos2.x, y: pos2.y};
            retObj.bottomLeft = {x: pos1.x, y: pos1.y};
            retObj.bottomRight = {x: pos2.x, y: pos1.y};
        }
    } else {
        if (pos1.y < pos2.y) { //pos1 is right of pos2, pos1 is above pos2
            retObj.topLeft = {x: pos2.x, y: pos1.y};
            retObj.topRight = {x: pos1.x, y: pos1.y};
            retObj.bottomLeft = {x: pos2.x, y: pos2.y};
            retObj.bottomRight = {x: pos1.x, y: pos2.y};
        } else { //pos1 is right of pos2, pos1 is below pos2
            retObj.topLeft = {x: pos2.x, y: pos2.y};
            retObj.topRight = {x: pos1.x, y: pos2.y};
            retObj.bottomLeft = {x: pos2.x, y: pos1.y};
            retObj.bottomRight = {x: pos1.x, y: pos1.y};
        }
    }
    return retObj;
}

function isWithin(rect, pos) {
    return (pos.x < rect.topRight.x && pos.x > rect.topLeft.x) && (pos.y < rect.bottomRight.y && pos.y > rect.topLeft.y);
}

function updateTwoPointsLabels(e) {
    if (typeof globalObj.twoPoints !== 'undefined') {// && (typeof globalObj.twoPoints.point1 !== 'undefined' && globalObj.twoPoints.point1) && (typeof globalObj.twoPoints.point2 !== 'undefined' && globalObj.twoPoints.point2)) {
        var canvasRect = renderer.context.canvas.getBoundingClientRect();
        var graphContainerRect = document.getElementById('graphContainer').getBoundingClientRect();
        var topDiff = canvasRect.top - graphContainerRect.top;
        //$('#container canvas').offset().top - $('#graphContainer').offset().top + 15;
        var leftDiff = canvasRect.left - graphContainerRect.left;
        //let topDiff = $('#container canvas').offset().top - $('#graphContainer').offset().top;// + 15;
        //let leftDiff = $('#container canvas').offset().left - $('#graphContainer').offset().left;// + 15;
        try {

            // Adds cells to the model in a single step
            graph.getModel().beginUpdate();
            if (typeof globalObj.twoPoints.vertex1 !== 'undefined') {
                graph.getModel().remove(globalObj.twoPoints.vertex1);
            }
            if (typeof globalObj.twoPoints.vertex2 !== 'undefined') {
                graph.getModel().remove(globalObj.twoPoints.vertex2);
            }
            if (typeof globalObj.twoPoints.vertex3 !== 'undefined') {
                graph.getModel().remove(globalObj.twoPoints.vertex3);
            }
            if (typeof globalObj.twoPoints.vertex4 !== 'undefined') {
                graph.getModel().remove(globalObj.twoPoints.vertex4);
            }
            if (typeof globalObj.twoPoints.vertex5 !== 'undefined') {
                graph.getModel().remove(globalObj.twoPoints.vertex5);
            }
            if (typeof globalObj.twoPoints.line !== 'undefined') {
                graph.getModel().remove(globalObj.twoPoints.line);
            }
            if (typeof globalObj.twoPoints !== 'undefined' && (typeof globalObj.twoPoints.point1 !== 'undefined' && globalObj.twoPoints.point1)) {// && (typeof globalObj.twoPoints.point2 !== 'undefined' && globalObj.twoPoints.point2)) {
                var pos1 = getAccurateScreenPosition2(globalObj.twoPoints.point1);

                var v1Txt = "x: " + (globalObj.twoPoints.point1.original.x)//.position.x.toFixed(2) * 1000)
                    + ", y: " + (globalObj.twoPoints.point1.original.y)//.position.y.toFixed(2) * 1000)
                    + ", z: " + (globalObj.twoPoints.point1.original.z);//.position.z.toFixed(2) * 1000);
                var v3 = graph.insertVertex(parent, "highlightPoint3", v1Txt, pos1.x + leftDiff + 5, pos1.y + topDiff + 5,
                    100, 20, 'strokeColor=none;fillColor=none;fontColor=#0000FF;');//, 'rounded=0;whiteSpace=wrap;html=1;fillColor=none;fontColor=#0000FF;');//text;html=1;strokeColor=blue;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#0000FF;');//'overflow=fill;fillColor=none;fontColor=#000000;text');
                globalObj.twoPoints.vertex3 = v3;
            }
            if (typeof globalObj.twoPoints !== 'undefined' && (typeof globalObj.twoPoints.point2 !== 'undefined' && globalObj.twoPoints.point2)) {
                var pos2 = getAccurateScreenPosition2(globalObj.twoPoints.point2);

                var v2Txt = "x: " + (globalObj.twoPoints.point2.original.x)//.position.x.toFixed(2) * 1000)
                    + ", y: " + (globalObj.twoPoints.point2.original.y)//.position.y.toFixed(2) * 1000)
                    + ", z: " + (globalObj.twoPoints.point2.original.z);//.position.z.toFixed(2) * 1000);
                var v4 = graph.insertVertex(parent, "highlightPoint4", v2Txt, pos2.x + leftDiff + 5, pos2.y + topDiff + 5,
                    100, 20, 'strokeColor=none;fillColor=none;fontColor=#0000FF;');//,'rounded=0;whiteSpace=wrap;html=1;fillColor=none;fontColor=#0000FF;');//text;html=1;strokeColor=blue;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#0000FF;');//'overflow=fill;fillColor=none;fontColor=#000000;text');
                globalObj.twoPoints.vertex4 = v4;
            }
            if (typeof globalObj.twoPoints !== 'undefined' && (typeof globalObj.twoPoints.point1 !== 'undefined' && globalObj.twoPoints.point1) && (typeof globalObj.twoPoints.point2 !== 'undefined' && globalObj.twoPoints.point2)) {
                var d = getDistanceBetween23DPoints(globalObj.twoPoints.point1.original, globalObj.twoPoints.point2.original);

                var v5 = graph.insertVertex(parent, "highlightPoint5", "distance: " + d.toFixed(2), ((pos1.x + leftDiff + 5) + (pos2.x + leftDiff + 5))/2, ((pos1.y + topDiff + 5) + (pos2.y + topDiff + 5))/2,
                    100, 20, 'strokeColor=none;fillColor=none;fontColor=#0000FF;');
                var v1 = graph.insertVertex(parent, "highlightPoint1", '', pos1.x + leftDiff, pos1.y + topDiff, 0, 0,'overflow=fill;fillColor=none;fontColor=#000000;');
                var v2 = graph.insertVertex(parent, "highlightPoint2", '', pos2.x + leftDiff, pos2.y + topDiff, 0, 0,'overflow=fill;fillColor=none;fontColor=#000000;');
                var e1 = graph.insertEdge(parent, "highlightEdge", '', v1, v2, 'overflow=fill;fillColor=blue;strokeColor=#64b96a;endArrow=none;strokeWidth=3;');
                globalObj.twoPoints.line = e1;
                globalObj.twoPoints.vertex1 = v1;
                globalObj.twoPoints.vertex2 = v2;

                globalObj.twoPoints.vertex5 = v5;
            }

        } finally {
            graph.getModel().endUpdate();
        }
    }
}

function getCanvasRelativePosition(event) {
    const canvas = renderer.context.canvas;
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
}

function isWithinCanvas(event) {
    const canvas = renderer.context.canvas;
    const rect = canvas.getBoundingClientRect();
    return (event.clientX < rect.right && event.clientX > rect.left)
        && (event.clientY < rect.bottom && event.clientY > rect.top);
}

function onCanvasMouseDown( e ) {
    e.preventDefault();
    const canvas = renderer.context.canvas;
    let canvasWidth = $('#container canvas').width();
    let canvasHeight = $('#container canvas').height();
    var mouseVector = new THREE.Vector2();
    const pos = getCanvasRelativePosition(e);
    mouseVector.x = (pos.x / canvas.clientWidth) * 2 - 1;
    mouseVector.y = (pos.y / canvas.clientHeight) * -2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouseVector, camera);
    var intersects = raycaster.intersectObjects( scene.children, true );//[0].children, true );//starField );
    //var intersects = raycaster.intersectObjects( globalObj.loadedObjects, true );//[0].children, true );//starField );
    var hitAPoint = false;
    if (intersects.length > 0) { //&& intersects[0].object.type === "Mesh") {
        var intersected = intersects[0];
        intersects.forEach(function (intersect) {
            if (intersect.object.type === "Mesh")
                intersected = intersect;
        });
        if (typeof globalObj.modelSelector !== 'undefined' && globalObj.modelSelector.enabled) {
            globalObj.loadedObjects.forEach(function (obj) {
                if (intersected.object === obj) {
                    if (typeof globalObj.modelSelector.box !== 'undefined') {
                        scene.remove(globalObj.modelSelector.box);
                    }
                    var box = new THREE.BoxHelper(intersected.object, 0xffff00);
                    globalObj.modelSelector.box = box;
                    globalObj.modelSelector.selectedObj = intersected.object;
                    scene.add(box);
                } else if (typeof obj.children !== 'undefined') {
                    obj.children.forEach(function (obj2) {
                        if (intersected.object === obj2) {
                            if (typeof globalObj.modelSelector.box !== 'undefined') {
                                scene.remove(globalObj.modelSelector.box);
                            }
                            var box = new THREE.BoxHelper(obj, 0xffff00);
                            globalObj.modelSelector.box = box;
                            globalObj.modelSelector.selectedObj = obj;
                            scene.add(box);
                        }
                    });
                }
            });
            /*globalObj.lights.forEach(function (light) {
                if (typeof globalObj.transformControl === 'undefined') {
                    globalObj.transformControl = new THREE.TransformControls(camera, renderer.domElement);
                    globalObj.transformControl.addEventListener('change', render);
                    globalObj.transformControl.setMode("rotate");
                    globalObj.transformControl.addEventListener('dragging-changed', function (event) {

                    });
                    scene.add(globalObj.transformControl);
                }
                globalObj.transformControl.attach(globalObj.centralObj);
            });*/
        }
    }
    //var intersects = raycaster.intersectObjects( scene.children, true );//[0].children, true );//starField );
    if (intersects.length > 0) { //&& intersects[0].object.type === "Mesh") {
        var intersected = intersects[0];
        intersects.forEach(function (intersect) {
            if (intersect.object.type === "Mesh")
                intersected = intersect;
        });
        if (typeof globalObj.twoPoints !== 'undefined' && globalObj.twoPoints && globalObj.twoPoints.enabled) {
            //globalObj.points.forEach(function(vertex) {
            for (var i = 0; i < globalObj.points.length; i++) {
                var vertex = globalObj.points[i];
                if (intersected.object === vertex.sphere) {
                    if (intersected.object === globalObj.twoPoints.point1) {
                        globalObj.twoPoints.point1.material.color.setHex(0xff0000);
                        globalObj.twoPoints.point1.material.needsUpdate = true;
                        globalObj.twoPoints.point1 = null;
                    } else if (intersected.object === globalObj.twoPoints.point2) {
                        globalObj.twoPoints.point2.material.color.setHex(0xff0000);
                        globalObj.twoPoints.point2.material.needsUpdate = true;
                        globalObj.twoPoints.point2 = null;
                    } else if (!(!!globalObj.twoPoints.point1)) {
                        globalObj.twoPoints.point1 = vertex.sphere;
                        globalObj.twoPoints.point1.material.color.setHex(0xffff00);
                        globalObj.twoPoints.point1.material.needsUpdate = true;
                    } else {
                        if (globalObj.twoPoints.point2 && typeof globalObj.twoPoints.point2 !== 'undefined') {
                            globalObj.twoPoints.point2.material.color.setHex(0xff0000);
                            globalObj.twoPoints.point2.material.needsUpdate = true;
                        }
                        globalObj.twoPoints.point2 = vertex.sphere;
                        globalObj.twoPoints.point2.material.color.setHex(0xffff00);
                        globalObj.twoPoints.point2.material.needsUpdate = true;
                    }
                    hitAPoint = true;
                    break;
                }
            }
            //});
        }
        if (typeof globalObj.selectMode.type !== 'undefined' && globalObj.selectMode.type === SELECTOR_MODE_SINGLE &&
            globalObj.selectMode.enabled) {
            var breakException = {};
            //globalObj.points.forEach(function(vertex) {
            for (var i = 0; i < globalObj.points.length; i++) {
                var vertex = globalObj.points[i];
                if (intersected.object === vertex.sphere) {
                    if (vertex.sphere.material.color.getHexString() == '00ff00') {
                        vertex.sphere.material.color.setHex(0xff0000);
                    } else {
                        vertex.sphere.material.color.setHex(0x00ff00);
                    }
                    vertex.sphere.material.needsUpdate = true;
                    hitAPoint = true;
                } else {
                    var screenPosition = getAccurateScreenPosition2(vertex.sphere);
                    var distanceHelper = getDistanceBetween22DPoints(screenPosition, pos);
                    if (distanceHelper < 3) {
                        if (vertex.sphere.material.color.getHexString() == '00ff00') {
                            vertex.sphere.material.color.setHex(0xff0000);
                        } else {
                            vertex.sphere.material.color.setHex(0x00ff00);
                        }
                        vertex.sphere.material.needsUpdate = true;
                        hitAPoint = true;
                    }
                }
            }
        }
    }
    if (!hitAPoint && typeof globalObj.twoPoints !== 'undefined' &&
        globalObj.twoPoints && globalObj.twoPoints.enabled) {
        var findingPoint2 = true;
        if (typeof globalObj.twoPoints.point1 === 'undefined' || !globalObj.twoPoints.point1) {
            findingPoint2 = false;
        }
        globalObj.points.forEach(function(vertex) {
            var screenPosition = getAccurateScreenPosition2(vertex.sphere);
            var distanceHelper = getDistanceBetween22DPoints(screenPosition, pos);
            if (distanceHelper < 3) {
                if (vertex.sphere === globalObj.twoPoints.point1) {
                    globalObj.twoPoints.point1.material.color.setHex(0xff0000);
                    globalObj.twoPoints.point1.material.needsUpdate = true;
                    globalObj.twoPoints.point1 = null;
                } else if (vertex.sphere === globalObj.twoPoints.point2) {
                    globalObj.twoPoints.point2.material.color.setHex(0xff0000);
                    globalObj.twoPoints.point2.material.needsUpdate = true;
                    globalObj.twoPoints.point2 = null;
                } else if (!findingPoint2) {//(!!globalObj.twoPoints.point1)) {
                    globalObj.twoPoints.point1 = vertex.sphere;
                    globalObj.twoPoints.point1.material.color.setHex(0xffff00);
                    globalObj.twoPoints.point1.material.needsUpdate = true;
                } else {
                    if (globalObj.twoPoints.point2 && typeof globalObj.twoPoints.point2 !== 'undefined') {
                        globalObj.twoPoints.point2.material.color.setHex(0xff0000);
                        globalObj.twoPoints.point2.material.needsUpdate = true;
                    }
                    globalObj.twoPoints.point2 = vertex.sphere;
                    globalObj.twoPoints.point2.material.color.setHex(0xffff00);
                }
                hitAPoint = true;
            }
        });
        if (hitAPoint && globalObj.twoPoints.point1 && globalObj.twoPoints.point2) {
            if (typeof globalObj.twoPoints.point1 === 'undefined' || typeof globalObj.twoPoints.point2 === 'undefined'
                || !globalObj.twoPoints.point1 || !globalObj.twoPoints.point2) {
                if (typeof globalObj.twoPoints.line !== 'undefined') {
                    graph.getModel().remove(globalObj.twoPoints.line);
                    graph.getModel().remove(globalObj.twoPoints.vertex1);
                    graph.getModel().remove(globalObj.twoPoints.vertex2);
                    return false;
                }
            }

        }
    }
    if (hitAPoint && typeof globalObj.twoPoints !== 'undefined' && globalObj.twoPoints.point1 && globalObj.twoPoints.point2) {
        /*var d = getDistanceBetween23DPoints(globalObj.twoPoints.point1.position, globalObj.twoPoints.point2.position);
        var message = "两点距离是: " + d + ", ";
        message += "x的距离是：" + Math.abs(globalObj.twoPoints.point1.position.x - globalObj.twoPoints.point2.position.x) + ", ";
        message += "y的距离是：" + Math.abs(globalObj.twoPoints.point1.position.y - globalObj.twoPoints.point2.position.y) + ", ";
        message += "z的距离是：" + Math.abs(globalObj.twoPoints.point1.position.z - globalObj.twoPoints.point2.position.z);
        document.getElementById('displayMessage').innerHTML = message;*/
        if ((typeof globalObj.twoPoints.point1 !== 'undefined' && globalObj.twoPoints.point1) && (typeof globalObj.twoPoints.point2 !== 'undefined' && globalObj.twoPoints.point2)) {
            updateTwoPointsLabels();
        }
    }
    if (!hitAPoint && typeof intersected !== 'undefined') {
        if (typeof globalObj.modelSelector !== 'undefined' && globalObj.modelSelector.enabled) {
            //to fix, probably change to dropdown to select from loaded objects
            obj = globalObj.loadedObjects[0].children[0];
            if (typeof globalObj.modelSelector.box !== 'undefined') {
                scene.remove(globalObj.modelSelector.box);
            }
            var box = new THREE.BoxHelper(obj, 0xffff00);
            globalObj.modelSelector.box = box;
            globalObj.modelSelector.selectedObj = obj;
            scene.add(box);
        }
    }
}

function getMaxWidthAndHeight() {
    var pageScreenWidth = document.getElementById('pageScreen').offsetWidth;
    var pageScreenHeight = document.getElementById('pageScreen').offsetHeight;
    var containerWidth = document.getElementById('container').offsetWidth;
    var containerHeight = document.getElementById('container').offsetHeight;
    var containerLeft = document.getElementById('container').offsetLeft;
    var containerTop = document.getElementById('container').offsetTop;
    var retObj = {};
    var topMaxHeight = containerTop - globalObj.spacing.pageSpacingUpDown;
    var bottomMaxHeight = pageScreenHeight - containerTop - containerHeight;
    retObj.maxHeight = topMaxHeight > bottomMaxHeight?bottomMaxHeight:topMaxHeight;
    var leftMaxWidth = containerLeft - globalObj.spacing.pageSpacingLeftRight;
    var rightMaxWidth = pageScreenWidth - containerLeft - containerWidth - globalObj.spacing.pageSpacingLeftRight;
    retObj.maxWidth = leftMaxWidth > rightMaxWidth?rightMaxWidth:leftMaxWidth;
    return retObj;
}

function getLabelPosition(count, labelWidth, labelHeight, x1, y1) {
    var retObj = {labelWidth: labelWidth, labelHeight: labelHeight};
    var l = 0;
    var retPositions = [];
    for (var key in globalObj.labelPosition){
        if (globalObj.labelPosition[key]) {
            //positions.push(key);
            l++;
        }
    }
    var countAtEachPosition = Math.floor(count / l);
    var countLeftover = count - (countAtEachPosition * l);
    var pageScreenWidth = document.getElementById('pageScreen').offsetWidth;
    var pageScreenHeight = document.getElementById('pageScreen').offsetHeight;
    var containerWidth = document.getElementById('container').offsetWidth;
    var containerHeight = document.getElementById('container').offsetHeight;
    var containerLeft = document.getElementById('container').offsetLeft;
    var containerTop = document.getElementById('container').offsetTop;
    globalObj.labelDimensions.labels = [];
    var upCounter = 0, downCounter = 0, leftCounter = 0, rightCounter = 0;
    var upCap = 0, downCap = 0, leftCap = 0, rightCap = 0;
    var minLabelHeight = 18;
    var minLabelWidth = 20;
    var maxLabelHeight = typeof handsonTableOptions !== 'undefined' ? handsonTableOptions.height:90;
    var maxLabelWidth = typeof handsonTableOptions !== 'undefined' ? handsonTableOptions.width:100;
    var udlr = {
        up: {
            spaces: [],
            height: 0
        },
        down: {
            spaces: [],
            height: 0
        },
        left: {
            spaces: [],
            height: 0
        },
        right: {
            spaces: [],
            height: 0
        }
    };
    //get upper
    if (globalObj.labelPosition['up']) {
        //check if container will obstruct space in upper region
        //if (containerTop <= (globalObj.spacing.pageSpacingUpDown + minLabelHeight)) {
        if (containerTop <= (globalObj.spacing.pageSpacingUpDown + maxLabelHeight)) {
            //upCap = pageScreenWidth - containerWidth
            //- (2 * globalObj.spacing.pageSpacingLeftRight);
            upCap = 0;
            var upFirst = {startX: globalObj.spacing.pageSpacingLeftRight,
                endX: containerLeft};
            if (upFirst.endX - upFirst.startX >= maxLabelWidth) {
                upCap += (upFirst.endX - upFirst.startX);
            }
            udlr.up.spaces.push(upFirst);
            var upSecond = {startX: containerLeft + containerWidth,
                endX: pageScreenWidth - globalObj.spacing.pageSpacingLeftRight};
            if (upSecond.endX - upSecond.startX >= maxLabelWidth) {
                upCap += (upSecond.endX - upSecond.startX);
            }
            udlr.up.spaces.push(upSecond);
        } else {
            upCap = pageScreenWidth - (2 * globalObj.spacing.pageSpacingLeftRight);
            udlr.up.spaces.push({startX: globalObj.spacing.pageSpacingLeftRight,
                endX: pageScreenWidth - globalObj.spacing.pageSpacingLeftRight});
        }
    }
    if (globalObj.labelPosition['down']) {
        //if (containerTop + containerHeight >= (pageScreenHeight - minLabelHeight - globalObj.spacing.pageSpacingUpDown)) {
        if (containerTop + containerHeight >= (pageScreenHeight - maxLabelHeight - globalObj.spacing.pageSpacingUpDown)) {
            //downCap = pageScreenWidth - containerWidth
            //- (2 * globalObj.spacing.pageSpacingLeftRight);upCap = 0;
            var downFirst = {startX: globalObj.spacing.pageSpacingLeftRight,
                endX: containerLeft};
            if (downFirst.endX - downFirst.startX >= maxLabelWidth) {
                downCap += (downFirst.endX - downFirst.startX);
            }
            udlr.down.spaces.push(downFirst);
            var downSecond = {startX: containerLeft + containerWidth,
                endX: pageScreenWidth - globalObj.spacing.pageSpacingLeftRight};
            if (downSecond.endX - downSecond.startX >= maxLabelWidth) {
                downCap += (downSecond.endX - downSecond.startX);
            }
            udlr.down.spaces.push(downSecond);
        } else {
            downCap = pageScreenWidth - (2 * globalObj.spacing.pageSpacingLeftRight);
            udlr.down.spaces.push({startX: globalObj.spacing.pageSpacingLeftRight,
                endX: pageScreenWidth - globalObj.spacing.pageSpacingLeftRight});
        }
    }
    if (globalObj.labelPosition['left']) {
        //check if container will obstruct space in upper region
        //if (containerLeft <= (globalObj.spacing.pageSpacingLeftRight + minLabelWidth)) {
        if (containerLeft <= (globalObj.spacing.pageSpacingLeftRight + maxLabelWidth)) {
            var leftCap = 0;
            var leftFirst = {startY: maxLabelHeight + globalObj.spacing.pageSpacingUpDown,
                endY: containerTop};
            if (leftFirst.endY - leftFirst.startY >= maxLabelHeight) {
                leftCap += (leftFirst.endY - leftFirst.startY);
            }
            udlr.left.spaces.push(leftFirst);
            var leftSecond = {startY: containerTop + containerHeight,
                endY: pageScreenHeight - globalObj.spacing.pageSpacingUpDown - maxLabelHeight
                    - globalObj.spacing.chartSpacingUpDown};
            if (leftSecond.endY - leftSecond.startY >= maxLabelHeight) {
                leftCap += (leftSecond.endY - leftSecond.startY);
            }
            udlr.left.spaces.push(leftSecond);
            /*leftCap = pageScreenHeight - containerHeight - (2 * (maxLabelHeight
                + globalObj.spacing.pageSpacingUpDown
                + globalObj.spacing.chartSpacingUpDown));
            udlr.left.spaces.push({startY: maxLabelHeight + globalObj.spacing.pageSpacingUpDown,
            endY: containerTop});
            udlr.left.spaces.push({startY: containerTop + containerHeight,
                endY: pageScreenHeight - globalObj.spacing.pageSpacingUpDown - maxLabelHeight
                    - globalObj.spacing.chartSpacingUpDown});*/
        } else {
            leftCap = pageScreenHeight - (2 * (maxLabelHeight + globalObj.spacing.pageSpacingUpDown
                + globalObj.spacing.chartSpacingUpDown));
            udlr.left.spaces.push({startY: maxLabelHeight + globalObj.spacing.pageSpacingUpDown + globalObj.spacing.chartSpacingUpDown,
                endY: pageScreenHeight - globalObj.spacing.pageSpacingUpDown - maxLabelHeight
                    - globalObj.spacing.chartSpacingUpDown});
        }
    }
    if (globalObj.labelPosition['right']) {
        //if (containerLeft + containerWidth >= (pageScreenWidth - minLabelWidth - globalObj.spacing.pageSpacingLeftRight)) {
        if (containerLeft + containerWidth >= (pageScreenWidth - maxLabelWidth - globalObj.spacing.pageSpacingLeftRight)) {
            var rightCap = 0;
            var rightFirst = {startY: maxLabelHeight + globalObj.spacing.pageSpacingUpDown,
                endY: containerTop};
            if (rightFirst.endY - rightFirst.startY >= maxLabelHeight) {
                rightCap += (rightFirst.endY - rightFirst.startY);
            }
            udlr.right.spaces.push(rightFirst);
            var rightSecond = {startY: containerTop + containerHeight,
                endY: pageScreenHeight - globalObj.spacing.pageSpacingUpDown - maxLabelHeight
                    - globalObj.spacing.chartSpacingUpDown};
            if (rightSecond.endY - rightSecond.startY >= maxLabelHeight) {
                rightCap += (rightSecond.endY - rightSecond.startY);
            }
            udlr.right.spaces.push(rightSecond);
        } else {
            rightCap = pageScreenHeight - (2 * (maxLabelHeight + globalObj.spacing.pageSpacingUpDown
                + globalObj.spacing.chartSpacingUpDown));
            udlr.right.spaces.push({startY: maxLabelHeight + globalObj.spacing.pageSpacingUpDown + globalObj.spacing.chartSpacingUpDown,
                endY: pageScreenHeight - globalObj.spacing.pageSpacingUpDown - maxLabelHeight
                    - globalObj.spacing.chartSpacingUpDown});
        }
    }
    var totalCap = upCap + downCap + leftCap + rightCap;

    //get optimal width
    var upDownCap = upCap + downCap;
    var upDownCount = Math.floor(upDownCap / totalCap * count);
    upCounter = Math.floor(upCap / upDownCap * upDownCount);//upDownCount / 2);
    downCounter = upDownCount - upCounter;
    var downCounterCap = Math.floor(downCap / upDownCap * upDownCount);
    var optimalWidth = Math.floor(upDownCap / upDownCount) - (2 * globalObj.spacing.chartSpacingLeftRight) - 5;
    optimalWidth = optimalWidth < minLabelWidth?minLabelWidth:optimalWidth;
    optimalWidth = optimalWidth > maxLabelWidth?maxLabelWidth-5:optimalWidth;
    if (Number.isNaN(optimalWidth)) {
        optimalWidth = minLabelWidth;
    }
    //get optimal height
    var leftRightCap = leftCap + rightCap;
    var leftRightCount = count - upDownCount;
    var leftRightCountCap = Math.floor(leftRightCap / totalCap * count);
    var leftCountCap2 = Math.floor(leftCap / (maxLabelHeight + globalObj.spacing.chartSpacingUpDown));
    var rightCountCap2 = Math.floor(rightCap / (maxLabelHeight + globalObj.spacing.chartSpacingUpDown));
    leftCounter = Math.floor(leftCap / leftRightCap * leftRightCount);//leftRightCount / 2);
    var leftCounterCap = Math.floor(leftCap/leftRightCap * leftRightCountCap);
    leftCounterCap = leftCounterCap < leftCountCap2 ? leftCountCap2:leftCounterCap;
    rightCounter = leftRightCount - leftCounter;
    var rightCounterCap = Math.floor(rightCap/leftRightCap * leftRightCountCap);
    rightCounterCap = rightCounterCap < rightCountCap2 ? rightCountCap2:rightCounterCap;
    var optimalHeight = Math.floor(leftRightCap / leftRightCount) - (2 * globalObj.spacing.chartSpacingUpDown) - 5;
    optimalHeight = optimalHeight < minLabelHeight?minLabelHeight:optimalHeight;
    optimalHeight = optimalHeight > maxLabelHeight?maxLabelHeight-5:optimalHeight;
    if (Number.isNaN(optimalHeight)) {
        optimalHeight = minLabelHeight;
    }
    var labelDimensionBalancerObj = labelDimensionBalancer(upCounter, downCounter, leftCounter, rightCounter,
        upCounter, downCounterCap, leftCounterCap, rightCounterCap, countAtEachPosition, count);
    if (typeof labelDimensionBalancerObj !== 'undefined') {
        upCounter = labelDimensionBalancerObj.upCounter;
        downCounter = labelDimensionBalancerObj.downCounter;
        leftCounter = labelDimensionBalancerObj.leftCounter;
        rightCounter = labelDimensionBalancerObj.rightCounter;
    }
    var x3 = x1;
    var y3 = y1;
    var x1Up = [];
    var x1Down = [];
    var x1Left = [];
    var x1Right = [];
    var y1Up = [];
    var y1Down = [];
    var y1Left = [];
    var y1Right = [];

    if (globalObj.labelPosition['up']) {
        /*var upFirst = {startX: globalObj.spacing.pageSpacingLeftRight,
            endX: containerLeft};
        if (upFirst.endX - upFirst.startX >= maxLabelWidth) {
            upCap += (upFirst.endX - upFirst.startX);
        }
        udlr.up.spaces.push(upFirst);*/
        var upCountActual = 0;
        for (var i = 0; i < udlr.up.spaces.length; i++) {
            //get upper space dimension
            var startX = udlr.up.spaces[i].startX;
            var endX = udlr.up.spaces[i].endX;
            var interimWidth = endX - startX;

            var startY = globalObj.spacing.pageSpacingUpDown <= 0 ? 0 : globalObj.spacing.pageSpacingUpDown;
            var k = 0;
            var upRowCountHelper = Math.floor(interimWidth/(optimalWidth + globalObj.spacing.chartSpacingLeftRight));//upCounter;//countAtEachPosition;
            if (upRowCountHelper <= 0)
                continue;
            else if (upRowCountHelper > upCounter)
                upRowCountHelper = upCounter;
            if (i == udlr.up.spaces.length - 1) {
                upRowCountHelper = upCounter;// - upCountActual;
            }
            var upRowWidthActual = upRowCountHelper * (optimalWidth + (2 * globalObj.spacing.chartSpacingLeftRight));
            if (interimWidth > upRowWidthActual) {
                startX += Math.floor((interimWidth - upRowWidthActual) / 2);
            }
            for (var j = 0; j < upRowCountHelper && x1.length <= (count + 1) && startX < (endX - optimalWidth); j++) {//pageScreenWidth; j++) {
                /*if ((((startX + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight))) >= containerLeft &&
                    (startX + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight))) <= containerLeft + containerWidth)
                    ||
                    ((startX + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight)) + optimalWidth) >= containerLeft &&
                        (startX + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight)) + optimalWidth) <= containerLeft + containerWidth))
                    && optimalHeight + startY >= containerTop) {
                    //countLeftover++;
                    console.log("should not get here");
                    j--;
                    startX += optimalWidth;
                    continue;
                }*/
                x1Up.push(startX + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight)));
                y1Up.push(startY);
                upCountActual++;
                globalObj.labelDimensions.labels[(startX + (j * optimalWidth)) +
                ',' + startY] = 'up';
            }
        }
        if (upCountActual != upCounter) {
            console.log('upCountActual not equal to upCounter');
        }
    }

    //get down
    if (globalObj.labelPosition['down']) {
        var downCountActual = 0;
        for (var i = 0; i < udlr.down.spaces.length; i++) {
            //get down space dimension
            var startX = udlr.down.spaces[i].startX;
            var endX = udlr.down.spaces[i].endX;
            var interimWidth = endX - startX;
            var startY = pageScreenHeight - optimalHeight - globalObj.spacing.pageSpacingUpDown;//containerTop + containerHeight;// + globalObj.spacing.chartSpacingUpDown;
            startY = startY <= 0 ? 0 : startY;
            var k = 0;
            var downRowCountHelper = Math.floor(interimWidth/(optimalWidth + globalObj.spacing.chartSpacingLeftRight));//upCounter;//countAtEachPosition;
            if (downRowCountHelper <= 0)
                continue;
            else if (downRowCountHelper > downCounter)
                downRowCountHelper = downCounter;
            if (i == udlr.down.spaces.length - 1) {
                downRowCountHelper = downCounter;// - upCountActual;
            }
            var downRowWidthActual = downRowCountHelper * (optimalWidth + (2 * globalObj.spacing.chartSpacingLeftRight));
            if (interimWidth > downRowWidthActual) {
                startX += Math.floor((interimWidth - downRowWidthActual) / 2);
            }
            for (var j = 0; j < downRowCountHelper && x1.length <= (count + 1) && startX < (endX - optimalWidth); j++) {//pageScreenWidth; j++) {
                x1Down.push(startX + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight)));
                y1Down.push(startY);
                downCountActual++;
            }
        }
        if (downCountActual != downCounter) {
            console.log("downCountActual does not equal to downCounter");
        }
        //get down space dimension
        /*var startX = globalObj.spacing.pageSpacingLeftRight;
        startX = startX <= 0 ? 0 : startX;
        var startY = pageScreenHeight - optimalHeight - globalObj.spacing.pageSpacingUpDown;//containerTop + containerHeight;// + globalObj.spacing.chartSpacingUpDown;
        startY = startY <= 0 ? 0 : startY;
        var downWidth = pageScreenWidth - globalObj.spacing.pageSpacingLeftRight;
        downWidth = downWidth <= 0 ? optimalWidth : downWidth;
        var downHeight = pageScreenHeight - startY - globalObj.spacing.pageSpacingUpDown - globalObj.spacing.chartSpacingUpDown;
        downHeight = downHeight <= 0 ? optimalHeight : downHeight;
        var count2 = countLeftover > 0 ? countAtEachPosition + countLeftover : countAtEachPosition;
        if (countLeftover > 0)
            countLeftover = 0;
        var downRowCountHelper = downCounter;
        for (var j = 0; j < downRowCountHelper && x1.length <= count && startX < pageScreenWidth; j++) {
            if ((((startX + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight))) >= containerLeft &&
                (startX + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight))) <= containerLeft + containerWidth)
                ||
                ((startX + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight)) + optimalWidth) >= containerLeft &&
                        (startX + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight)) + optimalWidth) <= containerLeft + containerWidth)
                )
                && startY <= containerTop + containerHeight) {
                //countLeftover++;
                j--;
                startX += optimalWidth;
                continue;
            }
            x1.push(startX + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight)));
            y1.push(startY);
            downCounter++;
        }*/
    }

    //get left
    if (globalObj.labelPosition['left']) {
        var leftCountActual = 0;
        for (var i = 0; i < udlr.left.spaces.length; i++) {
            //get left space dimension
            var startY = udlr.left.spaces[i].startY;
            var endY = udlr.left.spaces[i].endY;
            var interimHeight = endY - startY;
            var startX = globalObj.spacing.pageSpacingLeftRight;
            startY = startY <= 0 ? 0 : startY;
            var k = 0;
            var leftRowCountHelper = Math.floor(interimHeight/(optimalHeight + globalObj.spacing.chartSpacingUpDown));//upCounter;//countAtEachPosition;
            if (leftRowCountHelper <= 0)
                continue;
            else if (leftRowCountHelper > leftCounter)
                leftRowCountHelper = leftCounter;
            if (i == udlr.left.spaces.length - 1) {
                leftRowCountHelper = leftCounter;// - upCountActual;
            }
            var leftRowHeightActual = leftRowCountHelper * (optimalHeight + (2 * globalObj.spacing.chartSpacingUpDown));
            if (interimHeight > leftRowHeightActual) {
                startY += Math.floor((interimHeight - leftRowHeightActual) / 2);
            }
            for (var j = 0; j < leftRowCountHelper && x1.length <= (count + 1) && startY < (endY - optimalHeight); j++) {//pageScreenWidth; j++) {
                x1Left.push(startX);// + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight)));
                y1Left.push((j * (optimalHeight + globalObj.spacing.chartSpacingUpDown)) + startY);
                console.log("left adding: y, " + ((j * (optimalHeight + globalObj.spacing.chartSpacingUpDown)) + startY));
                leftCountActual++;
            }
        }
        if (leftCountActual != leftCounter) {
            console.log("leftCountActual does not equal to leftCounter");
        }
        //get left space dimension
        /*var startX = globalObj.spacing.pageSpacingLeftRight;
        startX = startX <= 0 ? 0 : startX;
        var startY = (maxLabelHeight + globalObj.spacing.pageSpacingUpDown);
        startY = startY <= 0 ? 0 : startY;
        var leftWidth = maxLabelWidth + globalObj.spacing.pageSpacingLeftRight;;
        leftWidth = leftWidth <= 0 ? optimalWidth : leftWidth;
        var leftHeight = pageScreenHeight - (2*(maxLabelHeight + globalObj.spacing.pageSpacingUpDown));
        leftHeight = leftHeight <= 0 ? optimalHeight : leftHeight;
        var count2 = countLeftover > 0 ? countAtEachPosition + countLeftover : countAtEachPosition;
        if (countLeftover > 0)
            countLeftover = 0;
        var k = 0;
        var leftRowCountHelper = leftCounter;
        for (var j = 0; j < leftRowCountHelper && x1.length <= count && startY < pageScreenHeight; j++) {
            if ((((startY + (j * (optimalHeight + globalObj.spacing.chartSpacingUpDown))) >= containerTop &&
                (startY + (j * (optimalHeight + globalObj.spacing.chartSpacingUpDown))) <= containerTop + containerHeight)
                ||
                ((startY + (j * (optimalHeight + globalObj.spacing.chartSpacingUpDown)) + optimalHeight) >= containerTop &&
                    (startY + (j * (optimalHeight + globalObj.spacing.chartSpacingUpDown)) + optimalHeight) <= containerTop + containerHeight))
                && startX + optimalWidth >= containerLeft) {
                //countLeftover++;
                j--;
                startY += optimalHeight;
                continue;
            }
            x1.push(startX);
            y1.push((j * (optimalHeight + globalObj.spacing.chartSpacingUpDown)) + startY);
            leftCounter++;
        }*/
    }

    //get right
    if (globalObj.labelPosition['right']) {
        //get right space dimension
        var rightCountActual = 0;
        for (var i = 0; i < udlr.right.spaces.length; i++) {
            //get right space dimension
            var startY = udlr.right.spaces[i].startY;
            var endY = udlr.right.spaces[i].endY;
            var interimHeight = endY - startY;
            var startX = pageScreenWidth - optimalWidth - globalObj.spacing.pageSpacingLeftRight;
            startY = startY <= 0 ? 0 : startY;
            var k = 0;
            var rightRowCountHelper = Math.floor(interimHeight/(optimalHeight + globalObj.spacing.chartSpacingUpDown));//upCounter;//countAtEachPosition;
            if (rightRowCountHelper <= 0)
                continue;
            else if (rightRowCountHelper > rightCounter)
                rightRowCountHelper = rightCounter;
            if (i == udlr.right.spaces.length - 1) {
                rightRowCountHelper = rightCounter;// - upCountActual;
            }
            var rightRowHeightActual = rightRowCountHelper * (optimalHeight + (2 * globalObj.spacing.chartSpacingUpDown));
            if (interimHeight > rightRowHeightActual) {
                startY += Math.floor((interimHeight - rightRowHeightActual) / 2);
            }
            for (var j = 0; j < rightRowCountHelper && x1.length <= (count + 1) && startY < (endY - optimalHeight); j++) {//pageScreenWidth; j++) {
                x1Right.push(startX);// + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight)));
                y1Right.push((j * (optimalHeight + globalObj.spacing.chartSpacingUpDown)) + startY);
                rightCountActual++;
            }
        }
        if (rightCountActual != rightCounter) {
            console.log("rightCountActual does not equal to rightCounter");
        }
        /*var startX = pageScreenWidth - optimalWidth - globalObj.spacing.pageSpacingLeftRight;
        startX = startX <= 0 ? 0 : startX;
        var startY = (maxLabelHeight + globalObj.spacing.pageSpacingUpDown);
        startY = startY <= 0 ? 0 : startY;
        var rightWidth = optimalWidth + globalObj.spacing.pageSpacingLeftRight;
        rightWidth = rightWidth <= 0 ? optimalWidth : rightWidth;
        var rightHeight = containerHeight;
        rightHeight = rightHeight <= 0 ? optimalHeight : rightHeight;
        var count2 = countLeftover > 0 ? countAtEachPosition + countLeftover : countAtEachPosition;
        if (countLeftover > 0)
            countLeftover = 0;
        var rightRowCountHelper = rightCounter;
        var rightRowEachWidth = Math.floor(rightWidth / rightRowCountHelper);
        var eachLabelHeight = rightHeight / count2;// + globalObj.spacing.chartSpacingUpDown;
        for (var j = 0; j < rightRowCountHelper && x1.length <= count && startY < pageScreenHeight; j++) {
            if ((((startY + (j * (optimalHeight + globalObj.spacing.chartSpacingUpDown))) >= containerTop &&
                (startY + (j * (optimalHeight + globalObj.spacing.chartSpacingUpDown))) <= containerTop + containerHeight)
                ||
                ((startY + (j * (optimalHeight + globalObj.spacing.chartSpacingUpDown)) + optimalHeight) >= containerTop &&
                    (startY + (j * (optimalHeight + globalObj.spacing.chartSpacingUpDown)) + optimalHeight) <= containerTop + containerHeight))
                && startX <= containerLeft + containerWidth) {
                //countLeftover++;
                j--;
                startY += optimalHeight;
                continue;
            }
            x1.push(startX);
            y1.push((j * (optimalHeight + globalObj.spacing.chartSpacingUpDown)) + startY);
            rightCounter++;
            //globalObj.labelDimensions.labels[startX + ',' + ((j * eachLabelHeight) + startY)] ='up';
        }*/
    }
    var i = 0;
    while (i < count && x1.length <= (count + 1) && (i < x1Up.length || i < x1Down.length || i < x1Left.length || i < x1Right.length)) {
        var doneSomething = false;
        if (i < x1Up.length && x1.length <= (count + 1) && i < count) {
            x1.push(x1Up[i]);
            y1.push(y1Up[i]);
            doneSomething = true;
        }
        if (i < x1Left.length && x1.length <= (count + 1) && i < count) {
            x1.push(x1Left[i]);
            y1.push(y1Left[i]);
            doneSomething = true;
        }
        if (i < x1Right.length && x1.length <= (count + 1) && i < count) {
            x1.push(x1Right[i]);
            y1.push(y1Right[i]);
            doneSomething = true;
        }
        if (i < x1Down.length && x1.length <= (count + 1) && i < count) {
            x1.push(x1Down[i]);
            y1.push(y1Down[i]);
            doneSomething = true;
        }
        if (!doneSomething) {
            break;
        }
        i++;
    }
    retObj.width = optimalWidth;
    retObj.height = optimalHeight;
    return retObj;
}

function labelDimensionBalancer(upCounter, downCounter, leftCounter, rightCounter, upCounterCap, downCounterCap,
                                leftCounterCap, rightCounterCap, countAtEachPosition, count) {
    var labelDimensionBalancerObj = {upCounter: 0,
        downCounter: 0, leftCounter: 0, rightCounter: 0};
    upCounterCap = upCounter < upCounterCap?upCounterCap:upCounter;
    downCounterCap = downCounter < downCounterCap?downCounterCap:downCounter;
    leftCounterCap = leftCounter < leftCounterCap?leftCounterCap:leftCounter;
    rightCounterCap = rightCounter < rightCounterCap?rightCounterCap:rightCounter;
    var counter = 0;
    while (counter <= count) {
        var doneSomething = false;
        if (labelDimensionBalancerObj.upCounter < upCounterCap) {
            labelDimensionBalancerObj.upCounter++;
            counter++;
            doneSomething = true;
        }
        if (labelDimensionBalancerObj.downCounter < downCounterCap && counter <= count) {
            labelDimensionBalancerObj.downCounter++;
            counter++;
            doneSomething = true;
        }
        if (labelDimensionBalancerObj.leftCounter < leftCounterCap && counter <= count) {
            labelDimensionBalancerObj.leftCounter++;
            counter++;
            doneSomething = true;
        }
        if (labelDimensionBalancerObj.rightCounter < rightCounterCap && counter <= count) {
            labelDimensionBalancerObj.rightCounter++;
            counter++;
            doneSomething = true;
        }
        if (!doneSomething)
            break;
    }
    /*while (upCounter > countAtEachPosition) {
        if (downCounter < downCounterCap) {
            downCounter++;
            labelDimensionBalancerObj.upCounter--;
        } else if (leftCounter < leftCounterCap) {
            leftCounter++;
            labelDimensionBalancerObj.upCounter--;
        } else if (rightCounter < rightCounterCap) {
            rightCounter++;
            labelDimensionBalancerObj.upCounter--;
        } else {
            break;
        }
    }
    while (downCounter > countAtEachPosition) {
        if (leftCounter < leftCounterCap) {
            leftCounter++;
            labelDimensionBalancerObj.downCounter--;
        } else if (rightCounter < rightCounterCap) {
            rightCounter++;
            labelDimensionBalancerObj.downCounter--;
        } else {
            break;
        }
    }
    while (leftCounter > countAtEachPosition) {
        if (rightCounter < rightCounterCap) {
            rightCounter++;
            labelDimensionBalancerObj.leftCounter--;
        } else {
            break;
        }
    }*/
    return labelDimensionBalancerObj;
}

function updateLines(positions) {//f_label,inPoint,outPoint,points,samples,pageFeatureIndex) {
    var counter = 0;
    var canvasRect = renderer.context.canvas.getBoundingClientRect();
    var graphContainerRect = document.getElementById('graphContainer').getBoundingClientRect();
    //let topDiff = canvasRect.top - graphContainerRect.top;
    //$('#container canvas').offset().top - $('#graphContainer').offset().top + 15;
    //let leftDiff = canvasRect.left - graphContainerRect.left;

    var topDiff = canvasRect.top - graphContainerRect.top;
    //$('#container canvas').offset().top - $('#graphContainer').offset().top;// + 15;
    var leftDiff = canvasRect.left - graphContainerRect.left;
    //$('#container canvas').offset().left - $('#graphContainer').offset().left;// + 15;
    if (typeof globalObj.cache !== 'undefined') {
        globalObj.cache.forEach(function(obj) {
            try {

                // Adds cells to the model in a single step
                graph.getModel().beginUpdate();
                //obj.edge.target.x = positions[counter].x;
                //obj.edge.target.y = positions[counter].y;
                if (typeof positions[counter] === 'undefined' || typeof positions[counter].x === 'undefined' || typeof positions[counter].y === 'undefined') {

                } else {
                    var x = positions[counter].x;
                    var y = positions[counter].y;
                    if (graph.getModel().contains(obj.edge)) {
                        console.log("contains edge" + counter);
                    }

                    var v2 = graph.insertVertex(parent, obj.v2.id, '', x + leftDiff, y + topDiff, 0, 0,'overflow=fill;fillColor=none;fontColor=#000000;');
                    var e1 = graph.insertEdge(parent, obj.edge.id, '', obj.v1, v2);
                    graph.getModel().remove(obj.v2);
                    graph.getModel().remove(obj.edge);
                    obj.v2 = v2;
                    obj.edge = e1;
                }
                //graph.remove
                counter++;
            } finally {
                graph.getModel().endUpdate();
            }
            /*globalObj.cache[pageFeatureIndex] = {
            f_label: f_label,
            inPoint: inPoint,
            outPoint: outPoint,
            points: points,
            samples: samples
          }*/
            /*if (inPoint != undefined){

            //内点
            var split = typeof inPoint === 'undefined'?[0,0,0]:inPoint.split(",")
            var x = parseFloat(split[0])
            var y = parseFloat(split[1])


            var split1 = typeof outPoint === 'undefined'?[0,0,0]:outPoint.split(",")
            var x1 = parseFloat(split1[0])
            var y1 = parseFloat(split1[1])

            //默认第0个

            var mHeight = $("#pageScreen").height()/5.5;
            var marginWidth = parseInt( $('#container').css('marginLeft') );

            var width1= marginWidth * 0.6;//图表占marginLeft0.8
            var height1 = mHeight*3;

            rewriteConvertValueToString(samples, points, arguments,pageFeatureIndex,width1,mHeight);//生成xyz 一张图表作为一个 cell

            // Enables rubberband selection
            new mxRubberband(graph);

            // Gets the default parent for inserting new cells. This
            // is normally the first child of the root (ie. layer 0).
            var parent = graph.getDefaultParent();


            if (pageFeatureIndex  == 1){
            width1= marginWidth * 0.6;//图表占marginLeft0.8
            height1 = mHeight*3;
          }else if (pageFeatureIndex  == 2){

          width1= width1;
          height1 = mHeight*3;
        }else if (pageFeatureIndex  == 3){
        width1= width1*3;
        height1 = mHeight;
        }else if (pageFeatureIndex  == 4){

        width1= width1*3;
        height1 = mHeight;
        }

        if (x != "" && y !=""){
        try {

        // Adds cells to the model in a single step
        graph.getModel().beginUpdate();
        var autoWith= document.getElementById("graphContainer").offsetTop;
        y=y-autoWith

        var v1 = graph.insertVertex(parent, f_label, 'Hello', x1, y1, width1, height1,'overflow=fill;fillColor=none;fontColor=#000000;');
        var v2 = graph.insertVertex(parent, f_label+"point2", '', x, y, 0, 0,'overflow=fill;fillColor=none;fontColor=#000000;');
        var e1 = graph.insertEdge(parent, f_label+"point3", '', v1, v2);
        } finally {
        graph.getModel().endUpdate();
        }
        }
        }*/
        });
    }
}

function chartConfig(samples,data,pointBackgroundColor1,tol1,tol2) {

    var config = {
        type: 'line',
        data: {
            labels: samples,
            datasets: [ {
                // label: "偏差",
                fill: false,
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgb(54, 162, 235)',

                //线
                borderWidth: 0.5,
                //点大小
                pointRadius: 5,
                pointHoverRadius: 2,

                data: data,
                pointBackgroundColor:pointBackgroundColor1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            //不显示标题 begin
            legend: {
                display: false
            },
            tooltips: {
                mode: 'index',
                intersect: true
            },
            annotation: {
                annotations: [{
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y-axis-0',
                    value: tol1,
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    label: {
                        enabled: true,
                        xPadding: 0,
                        yPadding: 0,
                        backgroundColor: "white",
                        fontColor: "blue",
                        content: 'AFT'
                    }
                },{
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y-axis-0',
                    value: tol2,
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    label: {
                        enabled: true,
                        xPadding: 0,
                        yPadding: 0,
                        backgroundColor: "white",
                        fontColor: "blue",
                        content: 'FORE'
                    }
                }]
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45,//@TODO 设置了图表会缩在一起
                        minRotation: 45,
                        fontSize: 7
                    },
                    scaleLabel: {
                        // display: true,
                        // labelString: 'samples'
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        min: -2,
                        max: 2,
                        stepSize: 1,
                        fontSize: 7
                    }
                    // scaleLabel: {
                    //   display: true,
                    //   labelString: '偏差'
                    // }
                }]
            }
        }
    };

    return config;
}

function rewriteConvertValueToString(samples, points, arguments,pageFeatureIndex,width1,mHeight) {
    // Returns canvas with dynamic chart for vertex labels
    var graphConvertValueToString = graph.convertValueToString;
    graph.convertValueToString = function (cell) {
        if (this.model.isVertex(cell)) {

            if (cell.value != 'Hello'){
                return cell.value;
            }

            var featureDiv = document.createElement("div");

            if (pageFeatureIndex == 3 || pageFeatureIndex == 4){
                //横着排放
                featureDiv.style.width = width1*3+"px";
                featureDiv.style.height = mHeight+"px";
                featureDiv.style.margin = " 0 auto ";
            }else{
                featureDiv.style.height = (mHeight*3)+"px";
            }

            for (var p = 0; p < points.length; p++) {

                var newDiv = document.createElement("div");

                if (pageFeatureIndex == 3 || pageFeatureIndex == 4){
                    //横着排放
                    newDiv.style.width = width1-3+"px";
                    newDiv.style.height = mHeight+"px";
                    newDiv.style.cssFloat = "right";
                    newDiv.style.borderRight = "1px solid black";

                }else{
                    newDiv.style.width = width1+"px";
                    newDiv.style.height = mHeight+"px";
                    newDiv.style.borderBottom = "1px solid black";

                }

                //title
                var title = document.createElement("div");
                title.style.height = (mHeight*0.1)+'px';
                title.style.lineHeight = (mHeight*0.1)+'px';

                var fx = points[p].fx;

                if (fx == "2"){
                    fx = "X";
                }else if (fx == "3"){
                    fx = "Y";
                }else if (fx == "4"){
                    fx = "Z";
                }


                //测点
                var tspan1= document.createElement("span");
                var newText = document.createTextNode(cell.id);
                tspan1.appendChild(newText);
                tspan1.style.color = "blue";
                tspan1.style.cssFloat = "left";
                tspan1.style.width = "50%";
                tspan1.style.padding = (mHeight*0.1)/2+"px 0";
                tspan1.style.verticalAlign = "middle";
                tspan1.style.textAlign = "left";


                var fvc_value = (points[p].fvc_value);
                fvc_value =  fvc_value == null ? 'NaN' : fvc_value.toFixed(2);

                //理论值
                var tspan2= document.createElement("span");
                tspan2.innerHTML="Nominal<br/>"+fx+":"+fvc_value
                tspan2.style.cssFloat = "left";
                tspan2.style.width = "25%";
                tspan2.style.textAlign = "left";
                tspan2.style.borderLeft = "1px solid black";

                //最后一个偏差

                var pcs = points[p].pcs;

                var pc1 = 'NaN';

                if (pcs != null && pcs.length > 0 ){
                    pc1 = pcs[0];

                    if (pc1 == null){
                        pc1 = 'NaN';
                    }else{
                        pc1 = pc1.toFixed(2);
                    }
                }

                var tspan3= document.createElement("span");
                var newText = document.createTextNode(pc1);
                tspan3.appendChild(newText);
                tspan3.style.backgroundColor = "green";
                tspan3.style.color = "black";
                tspan3.style.cssFloat = "right";
                tspan3.style.width = "20%";
                tspan3.style.padding = (mHeight*0.1)/2+"px 0";
                tspan3.style.verticalAlign = "middle";
                tspan3.style.textAlign = "right";
                tspan3.style.borderLeft = "1px solid black";
                tspan3.style.marginRight = "5px";

                title.append(tspan1);
                title.append(tspan2);
                title.append(tspan3);
                newDiv.appendChild(title);

                //table
                var table = document.createElement("table");
                table.style.height = (mHeight*0.3)+"px";
                table.style.marginBottom = 0+"px";
                table.className = 'chartTabel';


                // var arrColor = ["#f00","#ff0","lightgreen" ];



                var tol1 = points[p].tol1;
                var tol2 = points[p].tol2;

                var newPcs = [];
                for (var i = 0; i <pcs.length; i++) {

                    var val = pcs[i];
                    if (val == null){
                        val = 0;
                    }else{
                        val =  parseFloat(val.toFixed(2));
                    }
                    newPcs.push(val);
                }

                var sfArr = [];
                var arr = [['Mean','Range','CP','CPK','Sigma','TOL-','TOL+','Sample']];

                var range = (max(newPcs)-min(newPcs)).toFixed(2);

                var sum = function(x,y){ return x+y;};//求和函数
                var square = function(x){ return x*x;};//数组中每个元素求它的平方
                var mean = newPcs.reduce(sum)/newPcs.length;
                var deviations = newPcs.map(function(x){return x-mean;});
                var stddev = Math.sqrt(deviations.map(square).reduce(sum)/(newPcs.length-1));

                stddev =  (Math.round(stddev * 100) / 100)

                // https://www.codetd.com/article/1895661

                var cp = (tol1-tol2)/6*stddev;
                //console.log("cp  "+cp);

                var cpk = 0.0;

                var threeSigma = 3 * stddev;

                var num1 = (tol1-mean)/threeSigma;
                var num2 = (mean-tol2)/threeSigma;

                if (num1 > num2){
                    cpk = num2;
                } else{
                    cpk = num1;
                }

                sfArr[0] = mean.toFixed(2);
                sfArr[1] = range;
                sfArr[2] = cp.toFixed(2);
                sfArr[3] = cpk.toFixed(2);
                sfArr[4] = stddev.toFixed(2);
                sfArr[5] = tol2 == null ? 'NAN':tol2;
                sfArr[6] = tol1 == null ? 'NAN':tol1;
                sfArr[7] = 10;

                //console.log(sfArr);
                arr.push(sfArr);

                for (var i = 0; i < arr.length; i++) {
                    var tr = document.createElement("tr");
                    tr.style.height = (mHeight*0.3)/3 +"px";

                    var itemArr =  arr[i];
                    for (var j = 0; j < itemArr.length; j++) {
                        td = document.createElement("td");

                        if (i ==1 && (j == 2 ||j == 3)){

                            var number = parseFloat(itemArr[j]);

                            var color = '';
                            if (number < 1){
                                color = "#f00";

                            }else if (number > 1 && number < 1.33){
                                color = "#ff0";
                            }else if (number > 1.33){
                                color = "lightgreen";
                            }

                            // var index = Math.floor((Math.random()*arrColor.length));
                            td.style.backgroundColor = ''+color+'';
                        }

                        td.innerHTML = itemArr[j];
                        tr.appendChild(td);
                    }
                    table.appendChild(tr);
                }
                newDiv.appendChild(table);

                //包在chart外面的div
                var chartParentDiv = document.createElement("div");

                //node
                var node = document.createElement('canvas');
                node.style.display = "block"

                chartParentDiv.appendChild(node)

                newDiv.appendChild(chartParentDiv)

                // Document for empty output if not in DOM
                document.body.appendChild(newDiv);

                var ctx = node.getContext("2d");

                var pointBackgroundColor1 = [];

                // "#f00","#ff0","lightgreen"

                for (i = 0; i < newPcs.length; i++) {

                    if (newPcs[i] <= tol1 && tol2 <= newPcs[i]) {
                        pointBackgroundColor1.push("lightgreen");
                    } else {
                        pointBackgroundColor1.push("#f00");
                    }
                }

                var chart = new Chart(ctx, chartConfig(newPcs, newPcs,pointBackgroundColor1,tol1,tol2));

                chart.canvas.parentNode.style.height = (mHeight*0.6)+'px';
                chart.canvas.parentNode.style.width = width1+'px';

                featureDiv.appendChild(newDiv);
            }

            return featureDiv;
        }

        return graphConvertValueToString.apply(this, arguments);
    };

    // function avg(array) {//封装求平均值函数
    //   var len = array.length;
    //   var sum = 0;
    //   for(var i = 0;i<len;i++){
    //     sum +=parseFloat(array[i]);
    //   }
    //   return (sum/len).toFixed(2);
    // }
    //
    function max(array) {//封装求平均值函数
        var max = Math.max.apply(null, array);
        console.log(max) // 55,6
        return max;
    }

    function min(array) {//封装求平均值函数
        var min = Math.min.apply(null, array);
        console.log(min) // 55,6
        return min;
    }





}
