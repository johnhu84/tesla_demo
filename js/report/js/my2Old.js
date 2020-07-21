function toggleCamera(enable) {
    if (typeof enable === 'undefined') {
        enable = !controls.enabled;
    }
    if (enable) {
        controls.enabled = enable;
    } else {
        controls.enabled = enable;
    }
}

function truncateModeToggle(e) {
    e.preventDefault();
    if (typeof globalObj.truncateMode === 'undefined') {
        globalObj.truncateMode = {enabled: false};
    }

    globalObj.truncateMode.dialog.dialog("open");
}

function cb1Change(e) {
    globalObj.truncateMode.enabled = document.getElementById('cb1').checked;//!(!!globalObj.truncateMode.enabled);
    toggleHelper("truncateMode", globalObj.truncateMode.enabled);
    if (globalObj.truncateMode.enabled) {
        if (typeof globalObj.truncateMode.cuttingBox === 'undefined') {
            globalObj.truncateMode.cuttingBox = new THREE.Plane( new THREE.Vector3( 0, - 1, 0 ), 0.8 );
        }
        renderer.clippingPlanes = [globalObj.truncateMode.cuttingBox];
        renderer.localClippingEnabled = true;
    } else {
        //globalObj.truncateMode.dialog.dialog("close");
        renderer.clippingPlanes = [];//[localPlane];
        renderer.localClippingEnabled = false;
    }
}

function nchange() {
    if (typeof globalObj.truncateMode === 'undefined' || typeof globalObj.truncateMode.cuttingBox === 'undefined') {
        return false;
    }
    var point = new THREE.Vector3(document.getElementById('n1').value, document.getElementById('n2').value, document.getElementById('n3').value);
    var normalVector = new THREE.Vector3(document.getElementById('n5').value, document.getElementById('n6').value, document.getElementById('n7').value);
    globalObj.truncateMode.cuttingBox.setFromNormalAndCoplanarPoint(normalVector, point);
    /*globalObj.truncateMode.cuttingBox.normal.x = document.getElementById('n1').value;
      globalObj.truncateMode.cuttingBox.normal.y = document.getElementById('n2').value;
      globalObj.truncateMode.cuttingBox.normal.z = document.getElementById('n3').value;
      globalObj.truncateMode.cuttingBox.constant = document.getElementById('n4').value;*/
}

var inverseMatrix = new THREE.Matrix4();
var ray = new THREE.Ray();
var sphere = new THREE.Sphere();

var vA = new THREE.Vector3();
var vB = new THREE.Vector3();
var vC = new THREE.Vector3();

var tempA = new THREE.Vector3();
var tempB = new THREE.Vector3();
var tempC = new THREE.Vector3();

var morphA = new THREE.Vector3();
var morphB = new THREE.Vector3();
var morphC = new THREE.Vector3();

var uvA = new THREE.Vector2();
var uvB = new THREE.Vector2();
var uvC = new THREE.Vector2();

var intersectionPoint = new THREE.Vector3();
var intersectionPointWorld = new THREE.Vector3();

function raycast( obj, raycaster, intersects, minimumDistance ) {
    var geometry = obj.geometry;
    var material = obj.material;
    var matrixWorld = obj.matrixWorld;

    if ( material === undefined ) return;

    /*var modifier = new THREE.SimplifyModifier();
    var simplified = obj.clone();
    simplified.material = simplified.material.clone();
      simplified.material.flatShading = true;
      var count = Math.floor( simplified.geometry.attributes.position.count * 0.875 ); // number of vertices to remove*/
    //simplified.geometry = modifier.modify( simplified.geometry, count );
    //geometry = simplified.geometry;
    // Checking boundingSphere distance to ray

    if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

    sphere.copy( geometry.boundingSphere );
    sphere.applyMatrix4( matrixWorld );

    if ( raycaster.ray.intersectsSphere( sphere ) === false ) return;

    //

    inverseMatrix.getInverse( matrixWorld );
    ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

    // Check boundingBox before continuing

    if ( geometry.boundingBox !== null ) {

        if ( ray.intersectsBox( geometry.boundingBox ) === false ) return;

    }

    var intersection;

    if ( geometry.isBufferGeometry ) {

        var a, b, c;
        var index = geometry.index;
        var position = geometry.attributes.position;
        var morphPosition = geometry.morphAttributes.position;
        var uv = geometry.attributes.uv;
        var groups = geometry.groups;
        var drawRange = geometry.drawRange;
        var i, j, il, jl;
        var group, groupMaterial;
        var start, end;

        if ( index !== null ) {

            // indexed buffer geometry

            if ( Array.isArray( material ) ) {

                for ( i = 0, il = groups.length; i < il; i ++ ) {

                    group = groups[ i ];
                    groupMaterial = material[ group.materialIndex ];

                    start = Math.max( group.start, drawRange.start );
                    end = Math.min( ( group.start + group.count ), ( drawRange.start + drawRange.count ) );

                    /*for ( j = start, jl = end; j < jl; j += 3 ) {

                        a = index.getX( j );
                        b = index.getX( j + 1 );
                        c = index.getX( j + 2 );

                        intersection = checkBufferGeometryIntersection( obj, groupMaterial, raycaster, ray,
              position, morphPosition, uv, a, b, c, minimumDistance );

                        if ( intersection ) {

                            intersection.faceIndex = Math.floor( j / 3 ); // triangle number in indexed buffer semantics
                            intersection.face.materialIndex = group.materialIndex;
                            intersects.push( intersection );
              break;
                        }

                    }*/

                }

            } else {

                start = Math.max( 0, drawRange.start );
                end = Math.min( index.count, ( drawRange.start + drawRange.count ) );

                /*for ( i = start, il = end; i < il; i += 3 ) {

                    a = index.getX( i );
                    b = index.getX( i + 1 );
                    c = index.getX( i + 2 );

                    intersection = checkBufferGeometryIntersection( obj, material, raycaster, ray, position,
            morphPosition, uv, a, b, c, minimumDistance );

                    if ( intersection ) {

                        intersection.faceIndex = Math.floor( i / 3 ); // triangle number in indexed buffer semantics
                        intersects.push( intersection );
            break;
                    }

                }*/

            }

        } else if ( position !== undefined ) {

            // non-indexed buffer geometry

            if ( Array.isArray( material ) ) {

                for ( i = 0, il = groups.length; i < il; i ++ ) {

                    group = groups[ i ];
                    groupMaterial = material[ group.materialIndex ];

                    start = Math.max( group.start, drawRange.start );
                    end = Math.min( ( group.start + group.count ), ( drawRange.start + drawRange.count ) );

                    for ( j = start, jl = end; j < jl; j += 3 ) {

                        a = j;
                        b = j + 1;
                        c = j + 2;

                        intersection = checkBufferGeometryIntersection( obj, groupMaterial, raycaster, ray, position,
                            morphPosition, uv, a, b, c, minimumDistance );

                        if ( intersection ) {

                            intersection.faceIndex = Math.floor( j / 3 ); // triangle number in non-indexed buffer semantics
                            intersection.face.materialIndex = group.materialIndex;
                            intersects.push( intersection );
                            break;
                        }

                    }

                }

            } else {

                start = Math.max( 0, drawRange.start );
                end = Math.min( position.count, ( drawRange.start + drawRange.count ) );

                /*for ( i = start, il = end; i < il; i += 3 ) {

                    a = i;
                    b = i + 1;
                    c = i + 2;

                    intersection = checkBufferGeometryIntersection( obj, material, raycaster, ray, position,
            morphPosition, uv, a, b, c, minimumDistance );

                    if ( intersection ) {

                        intersection.faceIndex = Math.floor( i / 3 ); // triangle number in non-indexed buffer semantics
                        intersects.push( intersection );
            break;
                    }

                }*/

            }

        }

    } else if ( geometry.isGeometry ) {

        var fvA, fvB, fvC;
        var isMultiMaterial = Array.isArray( material );

        var vertices = geometry.vertices;
        var faces = geometry.faces;
        var uvs;

        var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
        if ( faceVertexUvs.length > 0 ) uvs = faceVertexUvs;

        for ( var f = 0, fl = faces.length; f < fl; f ++ ) {

            var face = faces[ f ];
            var faceMaterial = isMultiMaterial ? material[ face.materialIndex ] : material;

            if ( faceMaterial === undefined ) continue;

            fvA = vertices[ face.a ];
            fvB = vertices[ face.b ];
            fvC = vertices[ face.c ];
            /*var fvAd = getDistanceBetween23DPoints(camera.position, fvA);
            var fvBd = getDistanceBetween23DPoints(camera.position, fvB);
            var fvCd = getDistanceBetween23DPoints(camera.position, fvC);
            if (fvAd > minimumDistance && fvBd > minimumDistance && fvCd > minimumDistance)
              intersection = null;
            else*/
            intersection = checkIntersection( obj, faceMaterial, raycaster, ray, fvA, fvB, fvC, intersectionPoint, minimumDistance );

            if ( intersection ) {

                if ( uvs && uvs[ f ] ) {

                    var uvs_f = uvs[ f ];
                    uvA.copy( uvs_f[ 0 ] );
                    uvB.copy( uvs_f[ 1 ] );
                    uvC.copy( uvs_f[ 2 ] );

                    intersection.uv = THREE.Triangle.getUV( intersectionPoint, fvA, fvB, fvC, uvA, uvB, uvC, new THREE.Vector2() );

                }

                intersection.face = face;
                intersection.faceIndex = f;
                intersects.push( intersection );
                break;
            }

        }

    }

}

function intersectObjectHelper( object, raycaster, intersects, recursive, minimumDistance ) {

    if ( object.visible === false ) return;

    raycast( object, raycaster, intersects, minimumDistance );

    if ( recursive === true ) {

        var children = object.children;

        for ( var i = 0, l = children.length; i < l; i ++ ) {

            intersectObjectHelper( children[ i ], raycaster, intersects, true, minimumDistance );

        }

    }

}

function intersectObject ( raycaster, object, recursive, optionalTarget ) {

    var intersects = optionalTarget || [];

    intersectObjectHelper( object, raycaster, intersects, recursive );

    intersects.sort( ascSort );

    return intersects;

}

function ascSort( a, b ) {

    return a.distance - b.distance;

}

function intersectObjects ( raycaster, objects, recursive, optionalTarget ) {

    var intersects = optionalTarget || [];

    if ( Array.isArray( objects ) === false ) {

        console.warn( 'THREE.Raycaster.intersectObjects: objects is not an Array.' );
        return intersects;

    }
    var minimumDistance = getDistanceBetween23DPoints(objects[objects.length - 1].position, camera.position);
    for ( var i = 0, l = objects.length; i < l; i ++ ) {

        intersectObjectHelper( objects[ i ], raycaster, intersects, recursive, minimumDistance );

    }

    intersects.sort( ascSort );

    return intersects;

}

function checkIntersection( object, material, raycaster, ray, pA, pB, pC, point, minimumDistance ) {
    var intersect;

    if ( material.side === THREE.BackSide ) {

        intersect = ray.intersectTriangle( pC, pB, pA, true, point );

    } else {

        intersect = ray.intersectTriangle( pA, pB, pC, material.side !== THREE.DoubleSide, point );

    }

    if ( intersect === null ) return null;

    intersectionPointWorld.copy( point );
    intersectionPointWorld.applyMatrix4( object.matrixWorld );

    var distance = raycaster.ray.origin.distanceTo( intersectionPointWorld );

    if ( distance < raycaster.near || distance > raycaster.far || distance > minimumDistance ) return null;

    return {
        distance: distance,
        point: intersectionPointWorld.clone(),
        object: object
    };

}

function checkBufferGeometryIntersection( object, material, raycaster, ray, position, morphPosition, uv, a, b, c, minimumDistance ) {
    vA.fromBufferAttribute( position, a );
    vB.fromBufferAttribute( position, b );
    vC.fromBufferAttribute( position, c );
    var vAd = getDistanceBetween23DPoints(vA, camera.position);
    var vBd = getDistanceBetween23DPoints(vB, camera.position);
    var vCd = getDistanceBetween23DPoints(vC, camera.position);
    if (vAd > minimumDistance && vBd > minimumDistance && vCd > minimumDistance)
        return null;
    var morphInfluences = object.morphTargetInfluences;

    if ( material.morphTargets && morphPosition && morphInfluences ) {

        morphA.set( 0, 0, 0 );
        morphB.set( 0, 0, 0 );
        morphC.set( 0, 0, 0 );

        for ( var i = 0, il = morphPosition.length; i < il; i ++ ) {

            var influence = morphInfluences[ i ];
            var morphAttribute = morphPosition[ i ];

            if ( influence === 0 ) continue;

            tempA.fromBufferAttribute( morphAttribute, a );
            tempB.fromBufferAttribute( morphAttribute, b );
            tempC.fromBufferAttribute( morphAttribute, c );

            morphA.addScaledVector( tempA.sub( vA ), influence );
            morphB.addScaledVector( tempB.sub( vB ), influence );
            morphC.addScaledVector( tempC.sub( vC ), influence );

        }

        vA.add( morphA );
        vB.add( morphB );
        vC.add( morphC );

    }

    var intersection = checkIntersection( object, material, raycaster, ray, vA, vB, vC, intersectionPoint );

    if ( intersection ) {

        if ( uv ) {

            uvA.fromBufferAttribute( uv, a );
            uvB.fromBufferAttribute( uv, b );
            uvC.fromBufferAttribute( uv, c );

            intersection.uv = THREE.Triangle.getUV( intersectionPoint, vA, vB, vC, uvA, uvB, uvC, new THREE.Vector2() );

        }

        var face = new THREE.Face3( a, b, c );
        THREE.Triangle.getNormal( vA, vB, vC, face.normal );

        intersection.face = face;

    }

    return intersection;

}

function optimizeCentralObj() {
    var obj = null;
    if (typeof globalObj.centralObj !== 'undefined') {
        if (typeof globalObj.centralObj.children !== 'undefined') {
            obj = globalObj.centralObj.children[0];
        } else {
            obj = globalObj.centralObj;
        }
    }
    if (!obj)
        return false;
    var arr = [];
    var a = new THREE.Vector3();
    var b = new THREE.Vector3();
    var c = new THREE.Vector3();
    for (var i = 0; i < obj.geometry.index.count; i+=3) {
        var a1 = obj.geometry.index.getX(i);
        var b1 = obj.geometry.index.getX(i+1);
        var c1 = obj.geometry.index.getX(i+2);
        a.fromBufferAttribute( obj.geometry.attributes.position, a1 );
        b.fromBufferAttribute( obj.geometry.attributes.position, b1 );
        c.fromBufferAttribute( obj.geometry.attributes.position, c1 );
        arr.push([a.clone(), b.clone(), c.clone(), getDistanceBetween23DPoints(a.clone(), camera.position)]);
    }
    //arr.sort(geoSort);
}

function geoSort( a, b ) {

    return a[3] - b[3];//getDistanceBetween23DPoints(a[0], camera.position) - getDistanceBetween23DPoints(b[0], camera.position);

}

function pointSelectorModeClick(e) {
    //e.preventDefault();
    var selectedValue = document.querySelectorAll('input[name=pointSelectorMode]:checked');
    var pointSelector = document.getElementById('point-selector');
    var pointSelectorSelectedValue = pointSelector.options[pointSelector.selectedIndex];
    if (selectedValue.length <= 0)
        return false;
    switch (selectedValue[0].value) {
        case "top4":
            globalObj.selectMode.type = SELECTOR_MODE_BOX_TOP4;
            break;
        case "all":
            globalObj.selectMode.type = pointSelectorSelectedValue.value == 'unbox'?SELECTOR_MODE_UNBOX_ALL:SELECTOR_MODE_BOX_ALL;
            break;
        default:
            break;
    }
}

function pointSelectorModeChange(e) {
    e.preventDefault();
    var pointSelector = document.getElementById('point-selector');
    var selectedValue = pointSelector.options[pointSelector.selectedIndex];
    var selectedValue2 = document.querySelectorAll('input[name=pointSelectorMode]:checked');
    var allSelected = selectedValue2.length > 0 && selectedValue2[0].value == 'all'? true : false;
    switch (selectedValue.value) {
        case "single":
            globalObj.selectMode.type = SELECTOR_MODE_SINGLE;
            break;
        case "box":
            globalObj.selectMode.type = SELECTOR_MODE_BOX_TOP4;
            break;
        case "unbox":
            globalObj.selectMode.type = allSelected?SELECTOR_MODE_UNBOX_ALL:SELECTOR_MODE_UNBOX;
            break;
        default:
            break;
    }
    //typeof globalObj.selectMode.type
    /*if (typeof globalObj.boxSelector === 'undefined')
    globalObj.boxSelector = {enabled: false};
    globalObj.boxSelector.enabled = !(!!globalObj.boxSelector.enabled);
    toggleHelper("boxSelector", globalObj.boxSelector.enabled);
    if (globalObj.boxSelector.enabled) {
      controls.saveState();
      controls.enabled = false;
      e.currentTarget.style.backgroundColor = '#555555';
    } else {
      controls.enabled = true;
      controls.reset();
      e.currentTarget.style.backgroundColor = '#dddddd';
    }*/
}

function pointSelectorModeToggle(e) {
    globalObj.selectMode.enabled = e.currentTarget.checked;//!(!!globalObj.selectMode.enabled);
    toggleHelper("boxSelector", globalObj.selectMode.enabled);
    if (globalObj.selectMode.enabled) {

        var q = document.querySelector('.pointSelectorModeToggleSpan');
        q.innerHTML = "锁定";
        controls.saveState();
        controls.enabled = false;
        pointSelectorModeChange(e);
        pointSelectorModeClick(e);
    } else {
        var q = document.querySelector('.pointSelectorModeToggleSpan');
        q.innerHTML = "锁定";
        controls.enabled = true;
        controls.reset();
    }
}

function pointSelectorModeClear(e) {
    globalObj.points.forEach(function(vertex) {
        vertex.sphere.material.color.setHex(0xff0000);
    });
}

function updateLabels() {
    //make('','');
    handoverReport($('#handoverReport').val(), true);
}

function updateLabelHandler() {
    $('#ParetoDiagramHelper, #TrendMapDiagramHelper, #ControlChartDiagramHelper, ' +
        '#SigmaMapDiagramHelper, #BoxLineChartDiagramHelper, #StackingMapDiagramHelper, ' +
        '#PieChartDiagramHelper, #HistogramDiagramHelper').show();//css('display', 'block');
    var canvasRect = renderer.context.canvas.getBoundingClientRect();
    var graphContainerRect = document.getElementById('graphContainer').getBoundingClientRect();
    var topDiff = canvasRect.top - graphContainerRect.top;
    var leftDiff = canvasRect.left - graphContainerRect.left;
    var value = $("#boxs").find("option:selected").attr("zdy")
    if (typeof value === 'undefined') {
        $('.spinner, #overlay').hide();
        return false;
    }
    var list = JSON.parse(value);
    var x2 = [];
    x2.push(0);

    var y2 = [];
    y2.push(0);
    var z2 = []; //holds that onePoints information
    z2.push({});
    var duplicateCacheChecker = {};
    //if (typeof globalObj.points !== 'undefined' && globalObj.points.length > 0) {
    globalObj.pointsHelper.forEach(function (vertex) {
        //globalObj.points.forEach(function (vertex) {
        var accuratePos = getAccurateScreenPosition2(vertex.sphere);

        var msgPos = {x: accuratePos.x + leftDiff, y: accuratePos.y + topDiff};
        if (!isOutsideCanvas(msgPos)) {
            if (typeof duplicateCacheChecker[msgPos.x + ',' + msgPos.y] === 'undefined') {
                duplicateCacheChecker[msgPos.x + ',' + msgPos.y] = true;
                x2.push(msgPos.x);
                y2.push(msgPos.y);
                z2.push(vertex.onePoints);
            }
        }
    });
    //}
    var x1 = [0];
    var y1 = [0];
    var labelWidth = typeof handsonTableOptionsOriginal !== 'undefined' ? handsonTableOptionsOriginal.width:100;
    var labelHeight = typeof handsonTableOptionsOriginal !== 'undefined' ? handsonTableOptionsOriginal.height:70;
    //var positions = labelPositionOptimizer(labelWidth, labelHeight, x2.length, x1, y1);
    //var positions = labelPositionOptimizerUsingArea(labelWidth, labelHeight, x2.length, x1, y1);
    var positions = labelPositionOptimizerUsingArea2(labelWidth, labelHeight, x2.length, x1, y1);
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
            var checker = [];
            scaleWidthAndHeight(handsonTableOptions, positions.width, positions.height, positions.originalWidth,
                positions.originalHeight, x1, y1);
            handsonTable.updateSettings(handsonTableOptions);
            for (var i = 1; i < x2.length; i++) {

                var tx = x2[i];
                var ty = y2[i];
                var tz = z2[i];

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

                    addLine2(list[i - 1].flabel, twozb, msg[twozb], points, samples1, index, coordinates, i, positions, tz, false);
                } else {
                    console.log("out of container?");
                }
            }
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

            var len = parseInt($("#boxs").find("option:selected").val()) + 1;
            var str = '<div class="line' + len + '"></div>';
            $('body').append(str);
            $('.spinner, #overlay').hide();
            //orbitControlChange();
        }
    });
}

function isOutsideCanvas(pos) {
    var canvasRect = renderer.context.canvas.getBoundingClientRect();
    var graphContainerRect = document.getElementById('graphContainer').getBoundingClientRect();
    var topDiff = canvasRect.top - graphContainerRect.top;
    var leftDiff = canvasRect.left - graphContainerRect.left;
    var pageScreenWidth = document.getElementById('pageScreen').offsetWidth;
    var pageScreenHeight = document.getElementById('pageScreen').offsetHeight;
    var containerWidth = document.getElementById('container').offsetWidth;
    var containerHeight = document.getElementById('container').offsetHeight;
    var containerLeft = document.getElementById('container').offsetLeft;
    var containerTop = document.getElementById('container').offsetTop;
    if (pos.x < containerLeft || pos.x > (containerLeft + containerWidth)) {
        return true;
    }
    if (pos.y < containerTop || pos.y > (containerTop + containerHeight)) {
        return true;
    }
    return false;
}

function saveSpacings(e) {
    globalObj.spacing.pageSpacingUpDown = Number(document.getElementById('pageSpacingUpDown').value);
    globalObj.spacing.pageSpacingLeftRight = Number(document.getElementById('pageSpacingLeftRight').value);
    globalObj.spacing.chartSpacingUpDown = Number(document.getElementById('chartSpacingUpDown').value);
    globalObj.spacing.chartSpacingLeftRight = Number(document.getElementById('chartSpacingLeftRight').value);
    var selectedValue = document.querySelectorAll('input[name=Fruit]:checked');
    var prevNumOfPages = globalObj.spacing.numOfPages;
    if (selectedValue.length > 0) {
        if (selectedValue[0].value == 'singlePage') {
            globalObj.spacing.numOfPages = 1;
        } else {
            globalObj.spacing.numOfPages = document.getElementById('numOfPages').value;
        }
    }
    if (prevNumOfPages !== globalObj.spacing.numOfPages) {
        make('', '');
    }
}

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function() {
    // DOM is loaded and ready for manipulation here
    var labelPositionCBs = document.getElementsByClassName('labelPosition');
    for (var i = 0; i < labelPositionCBs.length; i++) {
        labelPositionCBs[i].checked = globalObj.labelPosition[labelPositionCBs[i].value];
        labelPositionCBs[i].addEventListener('click', function(e) {
            console.log("clicked on " + e.currentTarget.value + ", is now " +
                e.currentTarget.checked);
            globalObj.labelPosition[e.currentTarget.value] = e.currentTarget.checked;
        });
    }
});

function toggle10Random(turnOn) {
    var randoms = {};
    var counter = 0;
    if (turnOn) {
        if (globalObj.points.length > 10) {
            while (counter < 10) {
                var random = getRandomInt(globalObj.points.length);
                if (typeof randoms[random] === 'undefined') {
                    counter++;
                    randoms[random] = true;
                }
            }
            for (var i in randoms) {
                if (typeof globalObj.points[i] !== 'undefined') {
                    var helper = globalObj.points[i];
                    helper.sphere.material.color.setHex(0x0000ff);
                    globalObj.randomPoints.push(helper);
                }
            }
        } else {
            globalObj.points.forEach(function(vertex) {
                vertex.sphere.material.color.setHex(0x0000ff);
                globalObj.randomPoints.push(vertex);
            });
        }
    } else {
        if (globalObj.randomPoints.length > 0) {
            globalObj.randomPoints.forEach(function(vertex) {
                vertex.sphere.material.color.setHex(0xff0000);
            });
            globalObj.randomPoints.length = 0;
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function updateReport(e) {
    $('.spinner, #overlay').show();
    updateLabels();
}

function checkReportTable2(handsonTable, handsonTableOptions, points) {
    var numOfRows = handsonTable.countRows();
    var numOfCols = handsonTable.countCols();
    for (var i = 0; i < numOfRows; i++) {
        for (var j = 0; j < numOfCols; j++) {
            var handsonTd = handsonTable.getCell(i, j);
            var tempHandsonTableOptions = handsonTable.getSettings();
            if (typeof handsonTd === 'undefined' || !handsonTd) {
                console.log("handsonTd is null");
                //} else if ((String(handsonTd)).indexOf('~mean~') >= 0 || handsonTableOptionsData[i][j] === '~mean~') {
            } else if (typeof handsonTableOptionsData[i][j] !== 'undefined' &&
                handsonTableOptionsData[i][j] &&
                handsonTableOptionsData[i][j].indexOf('~mean~') >= 0) {
                tempHandsonTableOptions.data[i][j] = handsonTableOptionsData[i][j].replace(/~mean~/g,
                    points['~mean~']);//points['~mean~'];
                handsonTable.updateSettings(tempHandsonTableOptions);
            } else if (handsonTd === '~cpk~' || handsonTableOptionsData[i][j] === '~cpk~') {
                tempHandsonTableOptions.data[i][j] = points['~cpk~'];
                handsonTable.updateSettings(tempHandsonTableOptions)
            } else if (handsonTd === '~cp~' || handsonTableOptionsData[i][j] === '~cp~') {
                tempHandsonTableOptions.data[i][j] = points['~cp~'];
                handsonTable.updateSettings(tempHandsonTableOptions)
            } else if (handsonTd === '~Range~' || handsonTableOptionsData[i][j] === '~Range~') {
                tempHandsonTableOptions.data[i][j] = points['~Range~'];
                handsonTable.updateSettings(tempHandsonTableOptions)
            }// else {
            var handsonTdVal = handsonTableOptions.data[i][j];//handsonTd.innerHTML;
            /*var handsonTdValArr = handsonTdVal.split("=");
            handsonTdValArr[0] = handsonTdValArr[0];
            handsonTdValArr[1] = handsonTdValArr[1];*/
            if (typeof handsonTableHelperObj[i + ',' + j] !== 'undefined') {
                var conditionalObjs = handsonTableHelperObj[i + ',' + j].rules;
                var bgColor = handsonTableHelperObj[i + ',' + j].bgColor;
                //if (handsonTdValArr.length > 1) {
                //var conditionSatisfied = satisfiesCondition2(conditionalObjs, handsonTdVal, points, i, j, bgColor, handsonTable, tempHandsonTableOptions);
                //handsonTableOptionsData[i][j]
                var conditionSatisfied = satisfiesCondition2(conditionalObjs, handsonTableOptionsData[i][j], points, i, j, bgColor, handsonTable, tempHandsonTableOptions);
                if (conditionSatisfied && typeof handsonTdVal !== 'undefined'
                    && typeof handsonTdVal !== 'undefined') {
                    console.log("condition satisfied");
                    $(handsonTd).css('background-color', conditionSatisfied.bgColor);
                } else {
                    $(handsonTd).css('background-color', '#FFF');
                }
                //}
            }
            //}
        }
    }
}

//handsonTableOptionsOriginal
function modifyHandsonTableForShowReport(handsonTable, handsonTableOptions, id) {
    var rowHelper = 0;
    $(handsonTable.table).find('tr').each(function() {
        var colHelper = 0;
        $(this).find('td').each(function() {
            for (var i = 0; i < handsonTableOptions.mergeCells.length; i++) {
                if (rowHelper == handsonTableOptions.mergeCells[i].row &&
                    colHelper == handsonTableOptions.mergeCells[i].col) {
                    $(this).attr('rowspan', handsonTableOptions.mergeCells[i].rowspan);
                    $(this).attr('colspan', handsonTableOptions.mergeCells[i].colspan);
                }

            }
            colHelper++;
        });
        rowHelper++;
    });
    rowHelper = 0;
    $('#' + id + ' .htCore tr').each(function() {
        var colHelper = 0;
        $(this).find('td').each(function() {
            for (var i = 0; i < handsonTableOptions.mergeCells.length; i++) {
                if (rowHelper == handsonTableOptions.mergeCells[i].row &&
                    colHelper == handsonTableOptions.mergeCells[i].col) {
                    $(this).attr('rowspan', handsonTableOptions.mergeCells[i].rowspan);
                    $(this).attr('colspan', handsonTableOptions.mergeCells[i].colspan);
                }

            }
            colHelper++;
        });
        rowHelper++;
    });
    rowHelper = 0;
    $(handsonTable.table).find('tr').each(function() {
        var colHelper = 0;
        var colToDel = [];
        for (var i = 0; i < handsonTable.countCols(); i++) {
            //check if this row and col is a part of one of the 8 charts, if it is, continue
            if (typeof handsonTableHelperObjTrendMapSettings[rowHelper+','+colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjParetoSettings[rowHelper+','+colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjControlChartSettings[rowHelper+','+colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjSigmaMapSettings[rowHelper+','+colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjBoxLineChartSettings[rowHelper+','+colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjHistogramSettings[rowHelper+','+colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjPieChartSettings[rowHelper+','+colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjStackingMapChartSettings[rowHelper+','+colHelper] !== 'undefined'
            ) {
                continue;
            }
            var isPartOfMergeCell = false;
            var isRowSpanColSpanDefiner = false;
            for (var j = 0; j < handsonTableOptions.mergeCells.length; j++) {
                if (rowHelper >= handsonTableOptions.mergeCells[j].row &&
                    rowHelper < handsonTableOptions.mergeCells[j].row + handsonTableOptions.mergeCells[j].rowspan
                    && colHelper >= handsonTableOptions.mergeCells[j].col
                    && colHelper < handsonTableOptions.mergeCells[j].col + handsonTableOptions.mergeCells[j].colspan) {
                    isPartOfMergeCell = true;
                }
                isRowSpanColSpanDefiner = rowHelper == handsonTableOptions.mergeCells[j].row &&
                    colHelper == handsonTableOptions.mergeCells[j].col;
            }
            var extractedStyle = extractDataCellStyleFromOriginalHandsonTable(rowHelper, colHelper);
            var childHelper = $(this).find('td:nth-child(' + (colHelper + 1) + ')');
            var h = $(childHelper).html();
            if (!isPartOfMergeCell) {
                colWidth = handsonTable.getColWidth(colHelper);
                if ($(childHelper).width() !== colWidth) {
                    var h2 = "<div style='width:" + colWidth + "px;"+
                        extractedStyle+"'>" + $(childHelper).html() + "</div>";
                    $(childHelper).html(h2);
                }
                colHelper++;
            } else if (isRowSpanColSpanDefiner) {
                var mergedCellDimensionHelper = getMergedCellHeightAndWidth(rowHelper, colHelper);
                colWidth = mergedCellDimensionHelper.width;
                if ($(childHelper).width() !== colWidth) {
                    var h2 = "<div style='width:1px;"+extractedStyle+"'>" + $(childHelper).html() + "</div>";
                    $(childHelper).html(h2);
                }
                colHelper++;
            } else if (h !== '') {
                colWidth = handsonTable.getColWidth(colHelper);
                var h2 = "<div style='width:"+colWidth+"px;"+extractedStyle+"'>" + h + "</div>";
                $(childHelper).html(h2);
                colHelper++;
            } else {
                colToDel.push(colHelper);
                colHelper++;
            }
        }
        var removed = 0;
        for (var i = 0; i < colToDel.length; i++) {
            var childHelper = $(this).find('td:nth-child(' + (colToDel[i] - (removed++) + 1) + ')');
            $(childHelper).remove();
        }
        rowHelper++;
    });
}

function modifyHandsonTable(handsonTable, handsonTableOptions, id) {
    var rowHelper = 0;
    $(handsonTable.table).find('tr').each(function() {
        var colHelper = 0;
        $(this).find('td').each(function() {
            for (var i = 0; i < handsonTableOptions.mergeCells.length; i++) {
                if (rowHelper == handsonTableOptions.mergeCells[i].row &&
                    colHelper == handsonTableOptions.mergeCells[i].col) {
                    $(this).attr('rowspan', handsonTableOptions.mergeCells[i].rowspan);
                    $(this).attr('colspan', handsonTableOptions.mergeCells[i].colspan);
                }

            }
            colHelper++;
        });
        rowHelper++;
    });
    rowHelper = 0;
    $('#' + id + ' .htCore tr').each(function() {
        var colHelper = 0;
        $(this).find('td').each(function() {
            for (var i = 0; i < handsonTableOptions.mergeCells.length; i++) {
                if (rowHelper == handsonTableOptions.mergeCells[i].row &&
                    colHelper == handsonTableOptions.mergeCells[i].col) {
                    $(this).attr('rowspan', handsonTableOptions.mergeCells[i].rowspan);
                    $(this).attr('colspan', handsonTableOptions.mergeCells[i].colspan);
                }

            }
            colHelper++;
        });
        rowHelper++;
    });
    rowHelper = 0;
    $(handsonTable.table).find('tr').each(function() {
        var colHelper = 0;
        var colToDel = [];
        for (var i = 0; i < handsonTable.countCols(); i++) {
            //check if this row and col is a part of one of the 8 charts, if it is, continue
            if (typeof handsonTableHelperObjTrendMapSettings[rowHelper+','+colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjParetoSettings[rowHelper+','+colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjControlChartSettings[rowHelper+','+colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjSigmaMapSettings[rowHelper+','+colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjBoxLineChartSettings[rowHelper+','+colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjHistogramSettings[rowHelper+','+colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjPieChartSettings[rowHelper+','+colHelper] !== 'undefined' ||
                typeof handsonTableHelperObjStackingMapChartSettings[rowHelper+','+colHelper] !== 'undefined'
            ) {
                continue;
            }
            var isPartOfMergeCell = false;
            var isRowSpanColSpanDefiner = false;
            for (var j = 0; j < handsonTableOptions.mergeCells.length; j++) {
                if (rowHelper >= handsonTableOptions.mergeCells[j].row &&
                    rowHelper < handsonTableOptions.mergeCells[j].row + handsonTableOptions.mergeCells[j].rowspan
                    && colHelper >= handsonTableOptions.mergeCells[j].col
                    && colHelper < handsonTableOptions.mergeCells[j].col + handsonTableOptions.mergeCells[j].colspan) {
                    isPartOfMergeCell = true;
                }
                isRowSpanColSpanDefiner = rowHelper == handsonTableOptions.mergeCells[j].row &&
                    colHelper == handsonTableOptions.mergeCells[j].col;
            }
            var childHelper = $(this).find('td:nth-child(' + (colHelper + 1) + ')');
            var h = $(childHelper).html();
            var extractedStyle = extractDataCellStyleFromOriginalHandsonTable(rowHelper, colHelper);
            if (!isPartOfMergeCell) {
                colWidth = handsonTable.getColWidth(colHelper);
                if ($(childHelper).width() !== colWidth) {
                    var h2 = "<div style='width:" + colWidth + "px;"+extractedStyle+"'>" + $(childHelper).html() + "</div>";
                    $(childHelper).html(h2);
                }
                colHelper++;
            } else if (isRowSpanColSpanDefiner) {
                var mergedCellDimensionHelper = getMergedCellHeightAndWidth(rowHelper, colHelper);
                colWidth = mergedCellDimensionHelper.width;
                if ($(childHelper).width() !== colWidth) {
                    var h2 = "<div style='width:1px;"+extractedStyle+"'>" + $(childHelper).html() + "</div>";
                    $(childHelper).html(h2);
                }
                colHelper++;
            } else if (h !== '') {
                colWidth = handsonTable.getColWidth(colHelper);
                var h2 = "<div style='width:"+colWidth+"px;"+extractedStyle+"'>" + h + "</div>";
                $(childHelper).html(h2);
                colHelper++;
            } else {
                colToDel.push(colHelper);
                colHelper++;
            }
        }
        var removed = 0;
        for (var i = 0; i < colToDel.length; i++) {
            var childHelper = $(this).find('td:nth-child(' + (colToDel[i] - (removed++) + 1) + ')');
            $(childHelper).remove();
        }
        rowHelper++;
    });
}

//handleCustomCharts
function handleCustomCharts(handsonTable, handsonTableOptions, x1, y1, points) {
    try {
        var idHelper = 0;
        for (var i in handsonTableHelperObjParetos) {
            var ids = handsonTableHelperObjParetos[i] + x1 + y1 + (idHelper++);
            if (document.getElementById(ids)) {
                console.log("already has an id element: " + ids);
                console.log(document.getElementById(ids));
            }
            var rowAndColArr = i.split(',');
            //拖拉拽缩放
            var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
            var heightHelper = heightAndWidthObj.height;//handsonTable.getRowHeight(rowAndColArr[0]);
            var widthHelper = heightAndWidthObj.width;//handsonTable.getColWidth(rowAndColArr[1]);
            var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
            heightHelper = heightHelper > 20 ? heightHelper - 15 : heightHelper;
            widthHelper = widthHelper > 20 ? widthHelper - 15 : widthHelper;
            var tempHandsonTableOptions = handsonTable.getSettings();
            //var paretoChartHtml = '<div class="" id="' + ids +
            //'altholder" style="width:' + widthHelper + 'px;height:' + heightHelper + 'px;margin:auto;pointer-events:all"></div>';
            var paretoSetting = handsonTableHelperObjParetoSettings[i];
            if (paretoSetting && typeof paretoSetting !== 'undefined') {
                widthHelperFromSetting = Number(paretoSetting.miscWidth)
                heightHelperFromSetting = Number(paretoSetting.miscHeight)
                if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                    widthHelper = widthHelperFromSetting
                }
                if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                    heightHelper = heightHelperFromSetting
                }
            }
            var paretoHtmlOb = createHandsonCellDivWithProps(ids+'altholder', widthHelper, heightHelper, paretoSetting);
            var obj = document.createElement('div');
            obj.id = ids + "alt";
            obj.style.cssText = 'width:'+widthHelper+'px;height:'+heightHelper+'px;margin:auto;';
            document.getElementById("ParetoDiagramHelper").appendChild(obj);

            tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = paretoHtmlOb.outerHTML;
            handsonTable.updateSettings(tempHandsonTableOptions);
            resizeChartsParetoChartAjaxHelper(rowAndColObj.row, rowAndColObj.col, ids+'alt', widthHelper, heightHelper,
                handsonTableHelperObjParetoSettings[rowAndColObj.row +','+ rowAndColObj.col]);
        }

        idHelper = 0;
        for (var i in handsonTableHelperObjTrendMaps) {
            var ids = handsonTableHelperObjTrendMaps[i] + x1 + y1 + (idHelper++);
            var rowAndColArr = i.split(',');
            if (typeof handsonTableHelperObjTrendMapsCache[ids] !== 'undefined') {
                var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
                var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
                var tempHandsonTableOptions = handsonTable.getSettings();
                tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = handsonTableHelperObjTrendMapsCache[ids];//document.getElementById(ids).outerHTML;
                handsonTable.updateSettings(tempHandsonTableOptions);
            } else {
                var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
                var heightHelper = heightAndWidthObj.height;//handsonTable.getRowHeight(rowAndColArr[0]);
                var widthHelper = heightAndWidthObj.width;//handsonTable.getColWidth(rowAndColArr[1]);
                var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
                var trendMapSetting = handsonTableHelperObjTrendMapSettings[i];
                if (trendMapSetting && typeof trendMapSetting !== 'undefined') {
                    widthHelperFromSetting = Number(trendMapSetting.miscWidth)
                    heightHelperFromSetting = Number(trendMapSetting.miscHeight)
                    if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                        widthHelper = widthHelperFromSetting
                    }
                    if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                        heightHelper = heightHelperFromSetting
                    }
                }
                var trendMapHtmlOb = createHandsonCellDivWithProps(ids+'altholder', widthHelper, heightHelper, trendMapSetting);
                var tempHandsonTableOptions = handsonTable.getSettings();

                tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = trendMapHtmlOb.outerHTML;
                handsonTable.updateSettings(tempHandsonTableOptions);
                var obj = document.createElement('div');
                obj.id = ids + "alt";
                obj.style.cssText = 'width:'+widthHelper+'px;height:'+heightHelper+'px;margin:auto;';
                document.getElementById("TrendMapDiagramHelper").appendChild(obj);
                var idsAlt = ids + "alt";
                if (typeof handsonTableHelperObjTrendMapSettings
                    [rowAndColObj.row+','+rowAndColObj.col] !== 'undefined') {
                    var handsonTableHelperObjTrendMapSetting = handsonTableHelperObjTrendMapSettings
                        [rowAndColObj.row + ',' + rowAndColObj.col];
                    resizeChartsTrendMapAjaxHelper(idsAlt, widthHelper, heightHelper,
                        handsonTableHelperObjTrendMapSetting)
                } else {
                    resizeChartsTrendMapAjaxHelper(idsAlt, widthHelper, heightHelper, null)
                }
            }
        }

        idHelper = 0;
        for (var i in handsonTableHelperObjHistograms) {
            var ids = handsonTableHelperObjHistograms[i] + x1 + y1 + (idHelper++);
            var rowAndColArr = i.split(',');
            var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
            var heightHelper = heightAndWidthObj.height;
            var widthHelper = heightAndWidthObj.width;
            var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
            //var HistogramHtml = '<div class="" id="' + ids +
            //'altholder" style="height:' + heightHelper + 'px;width:' + widthHelper + 'px;overflow:hidden;"></div>'
            var tempHandsonTableOptions = handsonTable.getSettings();
            var histogramSetting = handsonTableHelperObjHistogramSettings[i];
            if (histogramSetting && typeof histogramSetting !== 'undefined') {
                widthHelperFromSetting = Number(histogramSetting.miscWidth)
                heightHelperFromSetting = Number(histogramSetting.miscHeight)
                if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                    widthHelper = widthHelperFromSetting
                }
                if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                    heightHelper = heightHelperFromSetting
                }
            }
            var histogramHtmlOb = createHandsonCellDivWithProps(ids+'altholder', widthHelper, heightHelper, histogramSetting);
            tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = histogramHtmlOb.outerHTML;
            handsonTable.updateSettings(tempHandsonTableOptions);
            var obj = document.createElement('div');
            obj.id = ids + "alt";
            obj.style.cssText = 'width:'+widthHelper+'px;height:'+heightHelper+'px;margin:auto;';
            document.getElementById("HistogramDiagramHelper").appendChild(obj);
            var idsAlt = ids + "alt";
            if (typeof handsonTableHelperObjHistogramSettings
                [rowAndColObj.row+','+rowAndColObj.col] !== 'undefined') {
                var handsonTableHelperObjHistogramSetting = handsonTableHelperObjHistogramSettings
                    [rowAndColObj.row + ',' + rowAndColObj.col];
                setHistogram(idsAlt, widthHelper, heightHelper, handsonTableHelperObjHistogramSetting)
            } else {
                setHistogram(idsAlt, widthHelper, heightHelper)
            }
        }

        idHelper = 0;
        for (var i in handsonTableHelperObjControlCharts) {
            var ids = handsonTableHelperObjControlCharts[i] + x1 + y1 + (idHelper++);
            var rowAndColArr = i.split(',');
            var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
            var heightHelper = heightAndWidthObj.height;
            var widthHelper = heightAndWidthObj.width;
            var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
            var ControlChartHtml = '<div class="" id="' + ids +
                'altholder" style="height:' + heightHelper + 'px;width:' + widthHelper + 'px;overflow:hidden;"></div>'
            var tempHandsonTableOptions = handsonTable.getSettings();
            var controlChartSetting = handsonTableHelperObjControlChartSettings[i];
            if (controlChartSetting && typeof controlChartSetting !== 'undefined') {
                widthHelperFromSetting = Number(controlChartSetting.miscWidth)
                heightHelperFromSetting = Number(controlChartSetting.miscHeight)
                if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                    widthHelper = widthHelperFromSetting
                }
                if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                    heightHelper = heightHelperFromSetting
                }
            }
            var controlChartHtmlOb = createHandsonCellDivWithProps(ids+'altholder', widthHelper, heightHelper, controlChartSetting);
            tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = controlChartHtmlOb.outerHTML;
            handsonTable.updateSettings(tempHandsonTableOptions);
            var obj = document.createElement('div');
            obj.id = ids + "alt";
            obj.style.cssText = 'width:'+widthHelper+'px;height:'+heightHelper+'px;margin:auto;';
            document.getElementById("ControlChartDiagramHelper").appendChild(obj);
            var idsAlt = ids + "alt";
            resizeChartsControlChartAjaxHelper(rowAndColArr[0], rowAndColArr[1], ids + 'alt', widthHelper, heightHelper,
                controlChartSetting)
        }

        idHelper = 0;
        for (var i in handsonTableHelperObjBoxLineCharts) {
            var ids = handsonTableHelperObjBoxLineCharts[i] + x1 + y1 + (idHelper++);
            var rowAndColArr = i.split(',');
            var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
            var heightHelper = heightAndWidthObj.height;
            var widthHelper = heightAndWidthObj.width;
            var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
            //var BoxLineChartHtml = '<div class="" id="' + ids +
            //'altholder" style="height:' + heightHelper + 'px;width:' + widthHelper + 'px;overflow:hidden;"></div>'
            var boxLineSetting = handsonTableHelperObjBoxLineChartSettings[i];
            if (boxLineSetting && typeof boxLineSetting !== 'undefined') {
                widthHelperFromSetting = Number(boxLineSetting.miscWidth)
                heightHelperFromSetting = Number(boxLineSetting.miscHeight)
                if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                    widthHelper = widthHelperFromSetting
                }
                if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                    heightHelper = heightHelperFromSetting
                }
            }
            var boxLineHtmlOb = createHandsonCellDivWithProps(ids+'altholder', widthHelper, heightHelper, boxLineSetting);
            var tempHandsonTableOptions = handsonTable.getSettings();
            tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = boxLineHtmlOb.outerHTML;
            handsonTable.updateSettings(tempHandsonTableOptions);
            var obj = document.createElement('div');
            obj.id = ids + "alt";
            obj.style.cssText = 'width:'+widthHelper+'px;height:'+heightHelper+'px;margin:auto;';
            document.getElementById("BoxLineChartDiagramHelper").appendChild(obj);
            var idsAlt = ids + "alt";
            resizeChartsBoxDiagramAjaxHelper(rowAndColObj.row, rowAndColObj.col, idsAlt, widthHelper,
                heightHelper, boxLineSetting);//, BigobjHelper);

            //BoxLineChartForHandsonCell(idsAlt, , widthHelper, heightHelper);
        }

        idHelper = 0;
        for (var i in handsonTableHelperObjSigmaMaps) {
            var ids = handsonTableHelperObjSigmaMaps[i] + x1 + y1 + (idHelper++);
            var rowAndColArr = i.split(',');
            var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
            var heightHelper = heightAndWidthObj.height;
            var widthHelper = heightAndWidthObj.width;
            var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
            //var SigmaMapHtml = '<div class="" id="' + ids +
            //'altholder" style="height:' + heightHelper + 'px;width:' + widthHelper + 'px;overflow:hidden;"></div>'
            var tempHandsonTableOptions = handsonTable.getSettings();
            var sigmaSetting = handsonTableHelperObjSigmaMapSettings[i];
            if (sigmaSetting && typeof sigmaSetting !== 'undefined') {
                widthHelperFromSetting = Number(sigmaSetting.miscWidth)
                heightHelperFromSetting = Number(sigmaSetting.miscHeight)
                if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                    widthHelper = widthHelperFromSetting
                }
                if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                    heightHelper = heightHelperFromSetting
                }
            }
            var sigmaHtmlOb = createHandsonCellDivWithProps(ids+'altholder', widthHelper, heightHelper, sigmaSetting);
            tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = sigmaHtmlOb.outerHTML;
            handsonTable.updateSettings(tempHandsonTableOptions);
            var obj = document.createElement('div');
            obj.id = ids + "alt";
            obj.style.cssText = 'width:'+widthHelper+'px;height:'+heightHelper+'px;margin:auto;';
            document.getElementById("SigmaMapDiagramHelper").appendChild(obj);
            var idsAlt = ids + "alt";
            resizeSigmaChartAjaxHelper(rowAndColObj.row, rowAndColObj.col, idsAlt, widthHelper,
                heightHelper, sigmaSetting);
            //SigmaMapForHandsonCell(idsAlt, rowAndColObj.row, rowAndColObj.col, widthHelper, heightHelper);
        }

        idHelper = 0;
        for (var i in handsonTableHelperObjPieCharts) {
            var ids = handsonTableHelperObjPieCharts[i] + x1 + y1 + (idHelper++);
            var rowAndColArr = i.split(',');
            var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
            var heightHelper = heightAndWidthObj.height;
            var widthHelper = heightAndWidthObj.width;
            var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
            //var PieChartHtml = '<div class="" id="' + ids +
            //'altholder" style="height:' + heightHelper + 'px;width:' + widthHelper + 'px;overflow:hidden;"></div>'
            var pieChartSetting = handsonTableHelperObjPieChartSettings[i];
            if (pieChartSetting && typeof pieChartSetting !== 'undefined') {
                widthHelperFromSetting = Number(pieChartSetting.miscWidth)
                heightHelperFromSetting = Number(pieChartSetting.miscHeight)
                if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                    widthHelper = widthHelperFromSetting
                }
                if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                    heightHelper = heightHelperFromSetting
                }
            }
            var pieChartHtmlOb = createHandsonCellDivWithProps(ids+'altholder', widthHelper, heightHelper, pieChartSetting);
            var tempHandsonTableOptions = handsonTable.getSettings();
            tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = pieChartHtmlOb.outerHTML;
            handsonTable.updateSettings(tempHandsonTableOptions);
            var obj = document.createElement('div');
            obj.id = ids + "alt";
            obj.style.cssText = 'width:'+widthHelper+'px;height:'+heightHelper+'px;margin:auto;';
            document.getElementById("PieChartDiagramHelper").appendChild(obj);
            var idsAlt = ids + "alt";
            //PieChartForHandsonCell(ids+'alt', rowAndColObj.row, rowAndColObj.col, widthHelper, heightHelper);
            resizeChartsPieChartAjaxHelper(rowAndColObj.row, rowAndColObj.col, idsAlt, widthHelper,
                heightHelper, pieChartSetting);
            //BigobjHelper);
        }

        idHelper = 0;
        for (var i in handsonTableHelperObjStackingMapCharts) {
            var ids = handsonTableHelperObjStackingMapCharts[i] + x1 + y1 + (idHelper++);
            var rowAndColArr = i.split(',');
            var heightAndWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
            var heightHelper = heightAndWidthObj.height;
            var widthHelper = heightAndWidthObj.width;
            var rowAndColObj = getMergedCellRowAndCol(rowAndColArr[0], rowAndColArr[1]);
            //var StackingMapChartHtml = '<div class="" id="' + ids +
            //'altholder" style="height:' + heightHelper + 'px;width:' + widthHelper + 'px;overflow:hidden;"></div>'
            var stackingSetting = handsonTableHelperObjStackingMapChartSettings[i];
            if (stackingSetting && typeof stackingSetting !== 'undefined') {
                widthHelperFromSetting = Number(stackingSetting.miscWidth)
                heightHelperFromSetting = Number(stackingSetting.miscHeight)
                if (widthHelperFromSetting < widthHelper && widthHelperFromSetting > 10) {
                    widthHelper = widthHelperFromSetting
                }
                if (heightHelperFromSetting < heightHelper && heightHelperFromSetting > 10) {
                    heightHelper = heightHelperFromSetting
                }
            }
            var stackingHtmlOb = createHandsonCellDivWithProps(ids+'altholder', widthHelper, heightHelper, stackingSetting);
            var tempHandsonTableOptions = handsonTable.getSettings();
            tempHandsonTableOptions.data[rowAndColObj.row][rowAndColObj.col] = stackingHtmlOb.outerHTML;
            handsonTable.updateSettings(tempHandsonTableOptions);
            var obj = document.createElement('div');
            obj.id = ids + "alt";
            obj.style.cssText = 'width:'+widthHelper+'px;height:'+heightHelper+'px;margin:auto;';
            document.getElementById("StackingMapDiagramHelper").appendChild(obj);
            var idsAlt = ids + "alt";
            //StackingMapChartForHandsonCell(idsAlt, rowAndColObj.row, rowAndColObj.col, widthHelper, heightHelper);
            resizeStackingMapAjaxHelper(rowAndColObj.row, rowAndColObj.col, idsAlt, widthHelper,
                heightHelper, stackingSetting);
        }

        for (var i in handsonTableHelperObjImgs) {
            var rowAndColArr = i.split(',');

            var heightWidthObj = getMergedCellHeightAndWidth(rowAndColArr[0], rowAndColArr[1]);
            var heightHelper = heightWidthObj.height;
            var widthHelper = heightWidthObj.width;
            var tempHandsonTableSettings = handsonTable.getSettings();
            var imgCell = $(handsonTable.table).find('.' + handsonTableHelperObjImgs[i]);
            //tempHandsonTableSettings.data[rowAndColArr[0]][rowAndColArr[1]]).find('img');
            if (imgCell && imgCell.length > 0) {
                $(imgCell[0]).css('width', widthHelper + 'px');
                $(imgCell[0]).css('height', heightHelper + 'px');
                $(imgCell[0]).attr('width', widthHelper);
                $(imgCell[0]).attr('height', heightHelper);
                tempHandsonTableSettings.data[rowAndColArr[0]][rowAndColArr[1]] = $(imgCell[0])[0].outerHTML;
                handsonTable.updateSettings(tempHandsonTableSettings);
            }
        }
    } catch (err) {
        console.log(err.message);
    }
}

function satisfiesCondition2(conditionalObjs, handsonTdVal, points, row, col, bgColor, handsonTable, handsonTableOptions) {
    //var command = $('#command').val();
    var satisfied = {result: true, bgColor: '#FFF'};
    if (!handsonTdVal || typeof handsonTdVal === 'undefined')
        return satisfied;
    for (var i = 0; i < conditionalObjs[0].cellProperties.length; i++) {
        switch (conditionalObjs[0].cellProperties[i].cellProperties) {
            case "all":
                if (!satisfiesConditionHelper(conditionalObjs[0].cellProperties[i], handsonTdVal)) {
                    return false;
                } else {
                    var rowHeightHelper = handsonTable.getRowHeight(row);
                    var colWidthHelper = handsonTable.getColWidth(col);
                    bgColor = conditionalObjs[0].cellProperties[i].bgColor;
                    if (handsonTdVal.indexOf('~cpk~') >= 0) {
                        var cpkValueToChangeTo = handsonTdVal.replace(/~cpk~/g, points['~cpk~']);
                        handsonTableOptions.data[row][col] = "<div style='background-color:"+bgColor+";width:"+colWidthHelper+"px;height:"+rowHeightHelper
                            +"px;'>"+cpkValueToChangeTo+"</div>";
                        handsonTable.updateSettings(handsonTableOptions);
                    }
                    if (handsonTdVal.indexOf('~mean~') >= 0) {
                        var meanValueToChangeTo = handsonTdVal.replace(/~mean~/g, points['~mean~']);
                        handsonTableOptions.data[row][col] = "<div style='background-color:"+bgColor+";width:"+colWidthHelper+"px;height:"+rowHeightHelper
                            +"px;'>"+meanValueToChangeTo+"</div>";
                        handsonTable.updateSettings(handsonTableOptions);
                    }
                    if (handsonTdVal.indexOf('~cp~') >= 0) {
                        var cpValueToChangeTo = handsonTdVal.replace(/~cp~/g, points['~cp~']);
                        handsonTableOptions.data[row][col] = "<div style='background-color:"+bgColor+";width:" + colWidthHelper + "px;height:" + rowHeightHelper
                            + "px;'>" + cpValueToChangeTo + "</div>";
                        handsonTable.updateSettings(handsonTableOptions);
                    }
                    if (handsonTdVal.indexOf('~Range~') >= 0) {
                        var RangeValueToChangeTo = handsonTdVal.replace(/~Range~/g, points['~Range~']);
                        handsonTableOptions.data[row][col] = "<div style='background-color:"+bgColor+";width:"+colWidthHelper+"px;height:"+rowHeightHelper
                            +"px;'>"+RangeValueToChangeTo+"</div>";
                        handsonTable.updateSettings(handsonTableOptions);
                    }
                    satisfied.bgColor = bgColor;
                }
                break;
            case "cpk":
                var cpkValueToChangeTo = handsonTdVal.replace(/~cpk~/g, points['~cpk~']);
                if (handsonTdVal.indexOf('~cpk~') >= 0 && !satisfiesConditionHelper(
                    conditionalObjs[0].cellProperties[i], points['~cpk~'])) {
                    handsonTableOptions.data[row][col] = "<div style='width:"+colWidthHelper+"px;height:"+rowHeightHelper
                        +"px;'>"+cpkValueToChangeTo+"</div>";
                    handsonTable.updateSettings(handsonTableOptions);
                    return false;
                } else {
                    bgColor = conditionalObjs[0].cellProperties[i].bgColor;
                    var rowHeightHelper = handsonTable.getRowHeight(row);
                    var colWidthHelper = handsonTable.getColWidth(col);
                    handsonTableOptions.data[row][col] = "<div style='background-color:"+bgColor+";width:"+colWidthHelper+"px;height:"+rowHeightHelper
                        +"px;'>"+cpkValueToChangeTo+"</div>";
                    handsonTable.updateSettings(handsonTableOptions);
                    satisfied.bgColor = bgColor;
                }
                break;
            case "mean":
                /*if (command !== 'mean' && command !== 'all') {
                    return false;
                }*/
                var meanValueToChangeTo = handsonTdVal.replace(/~mean~/g, points['~mean~']);
                console.log("debug helper, line 1300 of my2.js, handsonTdVal = " + handsonTdVal +
                    ", meanValueToChangeTo: " + meanValueToChangeTo);
                if (handsonTdVal.indexOf('~mean~') >= 0 && !satisfiesConditionHelper(
                    conditionalObjs[0].cellProperties[i], points['~mean~'])) {
                    handsonTableOptions.data[row][col] = "<div style='width:"+colWidthHelper+"px;height:"+rowHeightHelper
                        +"px;'>"+meanValueToChangeTo+"</div>";
                    handsonTable.updateSettings(handsonTableOptions);
                    satisfied.bgColor = bgColor;
                    return satisfied;
                } else {
                    var rowHeightHelper = handsonTable.getRowHeight(row);
                    var colWidthHelper = handsonTable.getColWidth(col);
                    bgColor = conditionalObjs[0].cellProperties[i].bgColor;
                    handsonTableOptions.data[row][col] = "<div style='background-color:"+bgColor+";width:"+colWidthHelper+"px;height:"+rowHeightHelper
                        +"px;'>"+meanValueToChangeTo+"</div>";
                    handsonTable.updateSettings(handsonTableOptions);
                    satisfied.bgColor = bgColor;
                    return satisfied;
                }
                break;
            case "cp":
                var cpValueToChangeTo = handsonTdVal.replace(/~cp~/g, points['~cp~']);
                if (handsonTdVal.indexOf('~cp~') >= 0 && !satisfiesConditionHelper(conditionalObjs[0].cellProperties[i], points['~cp~'])) {
                    handsonTableOptions.data[row][col] = "<div style='width:"+colWidthHelper+"px;height:"+rowHeightHelper
                        +"px;'>"+cpValueToChangeTo+"</div>";
                    handsonTable.updateSettings(handsonTableOptions);
                    return satisfied;
                } else {
                    var rowHeightHelper = handsonTable.getRowHeight(row);
                    var colWidthHelper = handsonTable.getColWidth(col);
                    bgColor = conditionalObjs[0].cellProperties[i].bgColor;
                    handsonTableOptions.data[row][col] = "<div style='background-color:"+bgColor+";width:" + colWidthHelper + "px;height:" + rowHeightHelper
                        + "px;'>" + cpValueToChangeTo + "</div>";
                    handsonTable.updateSettings(handsonTableOptions);
                    satisfied.bgColor = bgColor;
                }
                break;
            case "Range":
                var RangeValueToChangeTo = handsonTdVal.replace(/~Range~/g, points['~Range~']);
                if (handsonTdVal.indexOf('~Range~') >= 0 && !satisfiesConditionHelper(conditionalObjs[0].cellProperties[i], points['~Range~'])) {
                    handsonTableOptions.data[row][col] = "<div style='width:"+colWidthHelper+"px;height:"+rowHeightHelper
                        +"px;'>"+RangeValueToChangeTo+"</div>";
                    handsonTable.updateSettings(handsonTableOptions);
                    return satisfied;
                } else {
                    var rowHeightHelper = handsonTable.getRowHeight(row);
                    var colWidthHelper = handsonTable.getColWidth(col);
                    bgColor = conditionalObjs[0].cellProperties[i].bgColor;
                    handsonTableOptions.data[row][col] = "<div style='background-color:"+bgColor+";width:"+colWidthHelper+"px;height:"+rowHeightHelper
                        +"px;'>"+RangeValueToChangeTo+"</div>";
                    handsonTable.updateSettings(handsonTableOptions);
                    satisfied.bgColor = bgColor;
                }
                break;
            default:
                break;
        }
    }
    return satisfied;
}

function satisfiesConditionHelper(conditionalObj, handsonTdVal) {
    var satisfied = false;
    switch (conditionalObj.RangeSymbol) {
        case "greaterThan":
            if (handsonTdVal > conditionalObj.RangeNumber)
                return true;
            break;
        case "lessThan":
            if (handsonTdVal < conditionalObj.RangeNumber)
                return true;
            break;
        case "beEqualTo":
            if (handsonTdVal == conditionalObj.RangeNumber)
                return true;
            break;
        default:
            break;
    }
    return satisfied;
}

$(document).ready(function() {
    handoverReport($('#handoverReport').val());
});

function getLabelPosition2(count, labelWidth, labelHeight, x1, y1) {
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
    var maxLabelHeight = 120;//typeof handsonTableOptions !== 'undefined' ? handsonTableOptions.height:90;
    var maxLabelWidth = 200;//typeof handsonTableOptions !== 'undefined' ? handsonTableOptions.width:100;
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
                udlr.up.spaces.push(upFirst);
            }
            var upSecond = {startX: containerLeft + containerWidth,
                endX: pageScreenWidth - globalObj.spacing.pageSpacingLeftRight};
            if (upSecond.endX - upSecond.startX >= maxLabelWidth) {
                upCap += (upSecond.endX - upSecond.startX);
                udlr.up.spaces.push(upSecond);
            }
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
                udlr.down.spaces.push(downFirst);
            }
            var downSecond = {startX: containerLeft + containerWidth,
                endX: pageScreenWidth - globalObj.spacing.pageSpacingLeftRight};
            if (downSecond.endX - downSecond.startX >= maxLabelWidth) {
                downCap += (downSecond.endX - downSecond.startX);
                udlr.down.spaces.push(downSecond);
            }
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
                udlr.left.spaces.push(leftFirst);
            }
            var leftSecond = {startY: containerTop + containerHeight,
                endY: pageScreenHeight - globalObj.spacing.pageSpacingUpDown - maxLabelHeight
                    - globalObj.spacing.chartSpacingUpDown};
            if (leftSecond.endY - leftSecond.startY >= maxLabelHeight) {
                leftCap += (leftSecond.endY - leftSecond.startY);
                udlr.left.spaces.push(leftSecond);
            }
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
                udlr.right.spaces.push(rightFirst);
            }
            var rightSecond = {startY: containerTop + containerHeight,
                endY: pageScreenHeight - globalObj.spacing.pageSpacingUpDown - maxLabelHeight
                    - globalObj.spacing.chartSpacingUpDown};
            if (rightSecond.endY - rightSecond.startY >= maxLabelHeight) {
                rightCap += (rightSecond.endY - rightSecond.startY);
                udlr.right.spaces.push(rightSecond);
            }
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

    //clear getLabelPositions2HelperObj
    getLabelPositions2HelperObj = {};

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
                var x1UpHelper = startX + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight));
                var y1UpHelper = startY;
                getLabelPositions2HelperObj[x1UpHelper + ',' + y1UpHelper] = 'up';
                x1Up.push(x1UpHelper);
                y1Up.push(y1UpHelper);
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
                var x1DownHelper = startX + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight));
                var y1DownHelper = startY;
                getLabelPositions2HelperObj[x1DownHelper + ',' + y1DownHelper] = 'down';
                x1Down.push(x1DownHelper);
                y1Down.push(y1DownHelper);
                downCountActual++;
            }
        }
        if (downCountActual != downCounter) {
            console.log("downCountActual does not equal to downCounter");
        }
        //get down space dimension
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
                var x1LeftHelper = startX;
                var y1LeftHelper = (j * (optimalHeight + globalObj.spacing.chartSpacingUpDown)) + startY;
                getLabelPositions2HelperObj[x1LeftHelper + ',' + y1LeftHelper] = 'left';
                x1Left.push(x1LeftHelper);// + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight)));
                y1Left.push(y1LeftHelper);
                console.log("left adding: y, " + ((j * (optimalHeight + globalObj.spacing.chartSpacingUpDown)) + startY));
                leftCountActual++;
            }
        }
        if (leftCountActual != leftCounter) {
            console.log("leftCountActual does not equal to leftCounter");
        }
        //get left space dimension
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
                var x1RightHelper = startX;
                var y1RightHelper = (j * (optimalHeight + globalObj.spacing.chartSpacingUpDown)) + startY;
                getLabelPositions2HelperObj[x1RightHelper + ',' + y1RightHelper] = 'right';
                x1Right.push(x1RightHelper);// + (j * (optimalWidth + globalObj.spacing.chartSpacingLeftRight)));
                y1Right.push(y1RightHelper);
                rightCountActual++;
            }
        }
        if (rightCountActual != rightCounter) {
            console.log("rightCountActual does not equal to rightCounter");
        }
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

function addLine2(f_label,inPoint,outPoint,points,samples,pageFeatureIndex,coordinates,index,positions,onePoints,isShowReport) {
    if (typeof globalObj.cache === 'undefined')
        globalObj.cache = [];
    globalObjIndex = globalObj.cache.length;
    globalObj.cache[globalObjIndex] = {
        f_label: f_label,
        inPoint: inPoint,
        outPoint: outPoint,
        points: points,
        samples: samples
    }
    if (inPoint != undefined){

        //内点
        var split = typeof inPoint === 'undefined'?[0,0,0]:inPoint.split(",")
        var x = parseFloat(split[0])
        var y = parseFloat(split[1])

        var split1 = typeof outPoint === 'undefined'?[0,0,0]:outPoint.split(",")
        var x1 = parseFloat(split1[0])
        var y1 = parseFloat(split1[1])

        //默认第0个

        var mHeight = $("#pageScreen").height()/5.5;
        //var marginWidth = parseInt( $('#container').css('marginLeft') );
        var marginWidth = parseInt( $('#container').offset().left );//css('marginLeft') );

        var width1= marginWidth * 0.6;//图表占marginLeft0.8
        var height1 = mHeight*3;

        rewriteConvertValueToString(samples, points, arguments,pageFeatureIndex,width1,mHeight);//生成xyz 一张图表作为一个 cell

        // Enables rubberband selection
        var rubberBand = new mxRubberband(graph);
        if (typeof globalObj.rubberBands === 'undefined') {
            globalObj.rubberBands = [];
        }
        globalObj.rubberBands.push(rubberBand);

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

                var labelWidth = positions.width;//positions.labelWidth - globalObj.spacing.chartSpacingLeftRight;
                var labelHeight = positions.height;//positions.labelHeight - globalObj.spacing.chartSpacingUpDown;
                var position = positions[index];
                var handsonTableBorderStyle = createHandsonTableBackgroundColorCSSThenReturnBorderStyle()
                if (labelWidth < 20 && labelHeight < 20) {
                    var labelHelper = labelWidth < labelHeight?labelHeight:labelWidth;
                    labelHelper = labelHelper < 20?20:labelHelper;
                    var v1Value = "<div style='background-color:black;width:" + labelHelper + "px;height:" +
                        labelHelper + "px;display:inline-block;'>&nbsp;</div>";
                    var v1 = graph.insertVertex(parent, f_label, v1Value, x1, y1, labelHelper, labelHelper,
                        'overflow=fill;fillColor=none;fontColor=#000000;');
                    //} else if (labelWidth >= 100 && labelHeight >= 90) {
                } else if (labelWidth >= 20 && labelHeight >= 20) {//90 && labelHeight >= 80) {

                    if (typeof handsonTableOptions === 'undefined') {
                        var columnsArr = [];
                        for (var i = 0; i < 6; i++) {
                            columnsArr.push({renderer: "html"});
                        }

                        handsonTableOptions = {
                            data: Handsontable.helper.createSpreadsheetData(6, 6),
                            rowHeaders: false,
                            colHeaders: false,
                            width: 200,//'100%',
                            height: 160,
                            colWidths: [30, 30, 30, 30, 30, 30],
                            rowHeights: [25, 25, 25, 25, 25, 25],
                            columns: columnsArr,
                            manualColumnResize: false,
                            manualRowResize: false,
                            outsideClickDeselects: false,
                            selectionMode: 'multiple',
                            margeCells: true,
                            mergeCells: []
                        };
                    }
                    //scaleWidthAndHeight(handsonTableOptions, labelWidth, labelHeight, positions.originalWidth,
                    //positions.originalHeight, x1, y1);

                    handleCustomCharts(handsonTable, handsonTableOptions, Math.floor(x1), Math.floor(y1), onePoints.points[0]);
                    checkReportTable2(handsonTable, handsonTableOptions, onePoints.points[0]);
                    if (!isShowReport) {
                        modifyHandsonTable(handsonTable, handsonTableOptions, 'testContainer');
                    } else {
                        modifyHandsonTableForShowReport(handsonTable, handsonTableOptions, 'testContainer');
                    }
                    hackThisHandsonTable();
                    //postHandleCustomCharts(handsonTable, handsonTableOptions, x1, y1);
                    var v1Value = "<div style='border: " + handsonTableBorderStyle + "'>"
                        + handsonTable.table.outerHTML +
                        "</div>";
                    var xyKey = x1 + ',' + y1;
                    var xyValue = getLabelPositions2HelperObj[xyKey];
                    var v1 = graph.insertVertex(parent, f_label, v1Value, x1, y1,
                        handsonTableOptions.width, handsonTableOptions.height,//);//200, 160,
                        'text;html=1;overflow=fill;fillColor=none;');//fontColor=#000000;fontSize=1;');
                    /*if (isShowReport) {
                        console.log("handsonTable outer html in showReport: " + handsonTable.table.outerHTML);//JSON.stringify(handsonTable.getSettings().__proto__, null, 4));
                    } else {
                        console.log("handsonTable outer html in updateLabel: " + handsonTable.table.outerHTML);//JSON.stringify(handsonTable.getSettings().__proto__, null, 4));
                    }*/
                    //table .htCore td {background-color:somecolor;}
                    if (typeof xyValue !== 'undefined') {
                        if (xyValue == 'up' || xyValue == 'down') {
                            handleCustomCharts(handsonTable, handsonTableOptions, Math.floor(x1 + labelWidth), Math.floor(y1), onePoints.points[1]);
                            checkReportTable2(handsonTable, handsonTableOptions, onePoints.points[1]);
                            if (!isShowReport) {
                                modifyHandsonTable(handsonTable, handsonTableOptions, 'testContainer');
                            } else {
                                modifyHandsonTableForShowReport(handsonTable, handsonTableOptions, 'testContainer');
                            }
                            hackThisHandsonTable();
                            //postHandleCustomCharts(handsonTable, handsonTableOptions, x1, y1);
                            v1Value = "<div style='border: " + handsonTableBorderStyle + "'>"
                                + handsonTable.table.outerHTML +
                                "</div>";
                            var v1_2 = graph.insertVertex(parent, f_label, v1Value, x1 + labelWidth, y1,
                                handsonTableOptions.width, handsonTableOptions.height,//);//200, 160,
                                'text;html=1;overflow=fill;fillColor=none;');
                            handleCustomCharts(handsonTable, handsonTableOptions, Math.floor(x1 + (2 * labelWidth)), Math.floor(y1), onePoints.points[2]);
                            checkReportTable2(handsonTable, handsonTableOptions, onePoints.points[2]);
                            if (!isShowReport) {
                                modifyHandsonTable(handsonTable, handsonTableOptions, 'testContainer');
                            } else {
                                modifyHandsonTableForShowReport(handsonTable, handsonTableOptions, 'testContainer');
                            }
                            hackThisHandsonTable();
                            v1Value = "<div style='border: " + handsonTableBorderStyle + "'>"
                                + handsonTable.table.outerHTML +
                                "</div>";
                            var v1_3 = graph.insertVertex(parent, f_label, v1Value, x1 + (2 * labelWidth), y1,
                                handsonTableOptions.width, handsonTableOptions.height,//);//200, 160,
                                'text;html=1;overflow=fill;fillColor=none;');
                        } else if (xyValue == 'left' || xyValue == 'right') {
                            handleCustomCharts(handsonTable, handsonTableOptions, Math.floor(x1),
                                Math.floor(y1 + labelHeight), onePoints.points[1]);
                            checkReportTable2(handsonTable, handsonTableOptions, onePoints.points[1]);
                            if (!isShowReport) {
                                modifyHandsonTable(handsonTable, handsonTableOptions, 'testContainer');
                            } else {
                                modifyHandsonTableForShowReport(handsonTable, handsonTableOptions, 'testContainer');
                            }
                            hackThisHandsonTable();
                            //postHandleCustomCharts(handsonTable, handsonTableOptions, x1, y1, onePoints.points[1]);
                            v1Value = "<div style='border: " + handsonTableBorderStyle + "'>"
                                + handsonTable.table.outerHTML +
                                "</div>";
                            var v1_2 = graph.insertVertex(parent, f_label, v1Value, x1, y1 + labelHeight,
                                handsonTableOptions.width, handsonTableOptions.height,//);//200, 160,
                                'text;html=1;overflow=fill;fillColor=none;');
                            handleCustomCharts(handsonTable, handsonTableOptions, Math.floor(x1), Math.floor(y1 + (2 * labelHeight)), onePoints.points[2]);
                            checkReportTable2(handsonTable, handsonTableOptions, onePoints.points[2]);
                            if (!isShowReport) {
                                modifyHandsonTable(handsonTable, handsonTableOptions, 'testContainer');
                            } else {
                                modifyHandsonTableForShowReport(handsonTable, handsonTableOptions, 'testContainer');
                            }
                            //hackThisHandsonTable();
                            v1Value = "<div style='border: " + handsonTableBorderStyle + "'>"
                                + handsonTable.table.outerHTML +
                                "</div>";
                            var v1_3 = graph.insertVertex(parent, f_label, v1Value, x1, y1 + (2 * labelHeight),
                                handsonTableOptions.width, handsonTableOptions.height,//);//200, 160,
                                'text;html=1;overflow=fill;fillColor=none;');
                        }
                    }

                } else {
                    var fontSizeHelper = labelWidth < labelHeight?labelWidth:labelHeight;
                    var fontSize = 1;
                    var v1Value = "<div style='display:inline-block;fontSize:1;'>x: " + coordinates.x + "<br/>y: "
                        + coordinates.y + "<br/>z: "
                        + coordinates.z + "</div>";
                    var v1 = graph.insertVertex(parent, f_label, v1Value, x1, y1, labelWidth, labelHeight, 'text;html=1;overflow=fill;fillColor=none;fontColor=#000000;fontSize=1;');
                }
                var v2 = graph.insertVertex(parent, f_label+"point2", '', x, y, 0, 0,'overflow=fill;fillColor=none;fontColor=#000000;');
                var e1 = graph.insertEdge(parent, f_label+"point3", '', v1_2, v2);
                globalObj.cache[globalObjIndex].edge = e1;
                globalObj.cache[globalObjIndex].v1 = v1;
                globalObj.cache[globalObjIndex].v2 = v2;
            } finally {
                graph.getModel().endUpdate();
                //$('.spinner, #overlay').hide();
            }
        }
    }
}

//scale colWidths according to labelWidth
//scale rowHeights according to labelHeight
/*
* handsonTableOptions = {
* data: emptyData,//Handsontable.helper.createSpreadsheetData(6, 6),
* rowHeaders: false,
                            colHeaders: false,
                            width: 200,//'100%',
                            height: 160,
                            colWidths: [30, 30, 30, 30, 30, 30],
                            rowHeights: [25, 25, 25, 25, 25, 25],
                            columns: columnsArr,
                            manualColumnResize: false,
                            manualRowResize: false,
                            outsideClickDeselects: false,
                            selectionMode: 'multiple',
                            margeCells: true,
                            mergeCells: []
                        };*/
function scaleWidthAndHeight(handsonTableOptions, labelWidth, labelHeight, originalWidth, originalHeight, x1, y1) {
    var xyKey = x1 + ',' + y1;
    var xyValue = getLabelPositions2HelperObj[xyKey];
    var labelR = labelWidth / originalWidth;
    var labelR2 = labelHeight / originalHeight;
    var colSoFar = 0;
    for (var i = 0; i < handsonTableOptionsOriginal.colWidths.length; i++) {
        var colHere = Math.floor(handsonTableOptionsOriginal.colWidths[i] * labelR);
        colSoFar += colHere;
        handsonTableOptions.colWidths[i] = colHere;
    }
    var widthDiff = labelWidth - colSoFar;
    var widthCounterHelper = 0;
    while (widthDiff > 0) {
        if (widthCounterHelper == handsonTableOptions.colWidths.length) {
            widthCounterHelper = 0;
        } else {
            handsonTableOptions.colWidths[widthCounterHelper++]++;
            widthDiff--;
        }
    }
    var heightSoFar = 0;
    for (var i = 0; i < handsonTableOptionsOriginal.rowHeights.length; i++) {
        var heightHere = Math.floor(handsonTableOptionsOriginal.rowHeights[i] * labelR2);
        heightSoFar += heightHere;
        handsonTableOptions.rowHeights[i] = heightHere;
    }
    var heightDiff = labelHeight - heightSoFar;
    var heightCounterHelper = 0;
    while (heightDiff > 0) {
        if (heightCounterHelper == handsonTableOptions.rowHeights.length) {
            heightCounterHelper = 0;
        } else {
            handsonTableOptions.rowHeights[heightCounterHelper++]++;
            heightDiff--;
        }
    }
    handsonTableOptions.width = labelWidth;
    handsonTableOptions.height = labelHeight;
    var heightRatios = {};
    var widthRatios = {};
    for (var i = 0; i < handsonTableOptions.rowHeights.length; i++) {
        var heightRatio =
            handsonTableOptions.rowHeights[i] /
            handsonTableOptionsOriginal.rowHeights[i];
        heightRatios[i] = heightRatio;
    }
    for (var i = 0; i < handsonTableOptions.colWidths.length; i++) {
        var widthRatio =
            handsonTableOptions.colWidths[i] /
            handsonTableOptionsOriginal.colWidths[i];
        widthRatios[i] = widthRatio;
    }
    for (var i in handsonTableHelperObjTrendMapSettings) {
        var rowAndColArr = i.split(',');

        handsonTableHelperObjTrendMapSettings[i].miscHeight = Math.floor(heightRatios[rowAndColArr[0]]
            *handsonTableHelperObjTrendMapSettingsOriginal[i].miscHeight)
        handsonTableHelperObjTrendMapSettings[i].miscWidth = Math.floor(widthRatios[rowAndColArr[1]]
            *handsonTableHelperObjTrendMapSettingsOriginal[i].miscWidth)
    }
    for (var i in handsonTableHelperObjControlChartSettings) {
        var rowAndColArr = i.split(',');

        handsonTableHelperObjControlChartSettings[i].miscHeight = Math.floor(heightRatios[rowAndColArr[0]]
            *handsonTableHelperObjControlChartSettingsOriginal[i].miscHeight)
        handsonTableHelperObjControlChartSettings[i].miscWidth = Math.floor(widthRatios[rowAndColArr[1]]
            *handsonTableHelperObjControlChartSettingsOriginal[i].miscWidth)
    }
    for (var i in handsonTableHelperObjHistogramSettings) {
        var rowAndColArr = i.split(',');
        handsonTableHelperObjHistogramSettings[i].miscHeight = Math.floor(heightRatios[rowAndColArr[0]]
            *handsonTableHelperObjHistogramSettingsOriginal[i].miscHeight)
        handsonTableHelperObjHistogramSettings[i].miscWidth = Math.floor(widthRatios[rowAndColArr[1]]
            *handsonTableHelperObjHistogramSettingsOriginal[i].miscWidth)
    }
    for (var i in handsonTableHelperObjBoxLineChartSettings) {
        var rowAndColArr = i.split(',');
        handsonTableHelperObjBoxLineChartSettings[i].miscHeight = Math.floor(heightRatios[rowAndColArr[0]]
            *handsonTableHelperObjBoxLineChartSettingsOriginal[i].miscHeight)
        handsonTableHelperObjBoxLineChartSettings[i].miscWidth = Math.floor(widthRatios[rowAndColArr[1]]
            *handsonTableHelperObjBoxLineChartSettingsOriginal[i].miscWidth)
    }
    for (var i in handsonTableHelperObjSigmaMapSettings) {
        var rowAndColArr = i.split(',');
        handsonTableHelperObjSigmaMapSettings[i].miscHeight = Math.floor(heightRatios[rowAndColArr[0]]
            *handsonTableHelperObjSigmaMapSettingsOriginal[i].miscHeight)
        handsonTableHelperObjSigmaMapSettings[i].miscWidth = Math.floor(widthRatios[rowAndColArr[1]]
            *handsonTableHelperObjSigmaMapSettingsOriginal[i].miscWidth)
    }
    for (var i in handsonTableHelperObjPieChartSettings) {
        var rowAndColArr = i.split(',');
        handsonTableHelperObjPieChartSettings[i].miscHeight = Math.floor(heightRatios[rowAndColArr[0]]
            *handsonTableHelperObjPieChartSettingsOriginal[i].miscHeight)
        handsonTableHelperObjPieChartSettings[i].miscWidth = Math.floor(widthRatios[rowAndColArr[1]]
            *handsonTableHelperObjPieChartSettingsOriginal[i].miscWidth)
    }
    for (var i in handsonTableHelperObjStackingMapChartSettings) {
        var rowAndColArr = i.split(',');
        handsonTableHelperObjStackingMapChartSettings[i].miscHeight = Math.floor(heightRatios[rowAndColArr[0]]
            *handsonTableHelperObjStackingMapChartSettingsOriginal[i].miscHeight)
        handsonTableHelperObjStackingMapChartSettings[i].miscWidth = Math.floor(widthRatios[rowAndColArr[1]]
            *handsonTableHelperObjStackingMapChartSettingsOriginal[i].miscWidth)
    }
    for (var i in handsonTableHelperObjParetoSettings) {
        var rowAndColArr = i.split(',');
        handsonTableHelperObjParetoSettings[i].miscHeight = Math.floor(heightRatios[rowAndColArr[0]]
            *handsonTableHelperObjParetoSettingsOriginal[i].miscHeight)
        handsonTableHelperObjParetoSettings[i].miscWidth = Math.floor(widthRatios[rowAndColArr[1]]
            *handsonTableHelperObjParetoSettingsOriginal[i].miscWidth)
    }
    /*var clientWidth = handsonTableOptions.clientWidth;
    var clientHeight = handsonTableOptions.clientHeight;
    if (typeof xyValue !== 'undefined') {
        if (xyValue == 'up' || xyValue == 'down') {

        } else if (xyValue == 'left' || xyValue == 'right') {

        }
    }*/
}

function ParetoChart(ids, data, width, height) { //帕雷托图
    //removeClassTable()
    $("#" + ids).find("svg").remove()
    if (data == null && data == undefined) {
        var data = [{
            num_sent: "s0011",
            perc: '100'
        },
            {
                num_sent: "s0012",
                perc: '70'
            },
            {
                num_sent: "s0013",
                perc: '-50'
            },
            {
                num_sent: "s0014",
                perc: '60'
            },
            {
                num_sent: "s0015",
                perc: '80'
            }
        ]
    } else {
        var data = data;
    }
    var barChart = Chart.barChart({
        selector: "#" + ids,
        data: data,
        width: width,
        height: height,
        dimensionName: 'num_sent',
        onClick: function(d, i, el) {
            console.log(d.num_sent)
        }
    })
    barChart.createHorizontalLine(60, 'red');
    /*for (var i in handsonTableHelperObjParetos) {
        if (handsonTableHelperObjParetos[i] === ids) {
            var rowAndColArr = i.split(',');
            handsonTableOptions.data[rowAndColArr[0]][rowAndColArr[1]] = document.getElementById(ids).outerHTML;
            handsonTable.updateSettings(handsonTableOptions);
            break;
        }
    }*/
    // barChart.createHorizontalLine(80,'yellow');
}