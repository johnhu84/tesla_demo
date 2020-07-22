const maxXYZ = 1.5
var spheres = []

function lWidthChange(e) {

}

function lHeightChange(e) {

}

function lNumChange(e) {

}

function changeCanvas(e) {
  var lWidth = document.getElementById('lWidth').value
  var lHeight = document.getElementById('lHeight').value
  var lNum = document.getElementById('lNum').value
  graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
  for (var i in spheres) {
    let sphere = spheres[i]
    window._scene.remove(spheres[i].sphere)
  }
  spheres = []
  spheres = getRandomXYZCoordinates(lNum)

  spheres.forEach(function (sphere) {
      // 显示标签对应的测点
      var _cameraManager = new THREE._CameraManager();
      var _screenXY = _cameraManager._convertWorldPositionToScreenCoord(window._camera, _position, window._canvasWidth, window._canvasHeight);
      //vertex.visible = true;
      //vertex.scale.set(3, 3, 3);
      //var vertexPosition = [vertex.position.x, vertex.position.y, vertex.position.z]
      /*var accuratePos2 = _cameraManager._convertWorldPositionToScreenCoord(window._camera, vertexPosition, window._canvasWidth, window._canvasHeight);
      var accuratePos = getAccurateScreenPosition2(vertex);
      var msgPos = { x: accuratePos2[0] + leftDiff3, y: accuratePos2[1] + topDiff3 };
      if (typeof duplicateCacheChecker[msgPos.x + ',' + msgPos.y] === 'undefined') {
          duplicateCacheChecker[msgPos.x + ',' + msgPos.y] = true;
          x2.push(msgPos.x);
          y2.push(msgPos.y);
          z2.push(vertex.onePoints);
      }*/
  });
var x1 = [0]
var y1 = [0]
  var positions = labelPositionOptimizerUsingArea2(labelWidth, labelHeight, x2.length, x1, y1);
}

function getRandomXYZCoordinates(lNum) {
  var retArr = []
  for (var i = 0; i < lNum; i++) {
    let x = Math.random() * Math.floor(maxXYZ)
    let y = Math.random() * Math.floor(maxXYZ)
    let z = Math.random() * Math.floor(maxXYZ)
    let np = {x: x, y: y, z: z}
    let geometry = new THREE.SphereGeometry(.02, 3, 3)
    let material = new THREE.MeshBasicMaterial({color: 0x00ff00})
    var sphere = new THREE.Mesh(geometry, material)
    sphere.position.set(x, y, z)
    window._scene.add(sphere)
    np.sphere = sphere
    retArr.push(np)
  }
  return retArr;
}

function getNewNumberArray(n) {
  var retArr = []
  for (var i = 0; i < n; i++) {
    retArr.push(0)
  }
  return retArr
}

function copyNumberArray(x) {
  var retArr = []
  for (var i = 0; i < x.length; i++) {
    retArr.push(x[i])
  }
  return retArr
}

function getNewBooleanArray(n) {
  var retArr = []
  for (var i = 0; i < n; i++) {
    retArr.push(false)
  }
  return retArr
}

function getNewNumber2DArray(n, n) {
  var retArr = []
  for (var i = 0; i < n; i++) {
    var retArr2 = []
    for (var j = 0; j < n; j++) {
      retArr2.push(0)
    }
    retArr.push(retArr2)
  }
  return retArr
}

/*private Map<String, Object> lineHelper(
            Double[] x11
            , Double[] y11
            , Double[] x22
            , Double[] y22*/
function lineHelper(x11, y11, x22, y22) {

            const N = 205;
            const INF = 50005;
            var n;
            var X1 = getNewNumberArray(N);
            var Y1 = getNewNumberArray(N);
            var X2 = getNewNumberArray(N);
            var Y2 = getNewNumberArray(N);
            var W = getNewNumber2DArray(N, N);
            var Lx = getNewNumberArray(N);
            var Ly = getNewNumberArray(N);
            var left = getNewNumberArray(N);
            var S = getNewBooleanArray(N);
            var T = getNewBooleanArray(N);

            n = y22.length - 1;

            var x1 = copyNumberArray(x11);
            var x2 = copyNumberArray(x22);
            var y1 = copyNumberArray(y11);
            var y2 = copyNumberArray(y22);

            for (var i = 1; i <= n; i++) {
                X1[i] = x1[i];
                Y1[i] = y1[i];
            }
            for (var i = 1; i <= n; i++) {

                X2[i] = x2[i];
                Y2[i] = y2[i];
            }

            for (var i = 1; i <= n; i++) {
                for (var j = 1; j <= n; j++) {
                    W[j][i] = -Math.sqrt(Math.pow(X1[i] - X2[j], 2) + Math.pow(Y1[i] - Y2[j], 2));
                }
            }

            //km
            for (var i = 1; i <= n; i++) {
                left[i] = 0;
                Lx[i] = 0;
                Ly[i] = 0;
                for (var j = 1; j <= n; j++) {
                    Lx[i] = Math.max(Lx[i], W[i][j]);
                }
            }
            for (var i = 1; i <= n; i++) {
                while (true) {
                    for (var j = 1; j <= n; j++) {
                        S[j] = T[j] = false;
                    }
                    //ToDo, 7/21/2020, what's this match here?  and the INF
                    if (match(S, n, Lx, Ly, W, T, left, i)) {
                        break;
                    } else {
                        var a = INF;
                        for (var h = 1; h <= n; h++) {
                            if (!S[h]) {
                                continue;
                            }
                            for (var m = 1; m <= n; m++) {
                                if (T[m]) {
                                    continue;
                                }
                                a = Math.min(a, Lx[h] + Ly[m] - W[h][m]);
                            }
                        }
                        for (var w = 1; w <= n; w++) {
                            if (S[w]) {
                                Lx[w] -= a;
                            }
                            if (T[w]) {
                                Ly[w] += a;
                            }
                        }

                    }
                }
            }
            //////

            var result = {};
            for (var i = 1; i <= n; i++) {
                //内点 key
                result[X2[left[i]] + "," + Y2[left[i]]] = X1[i] + "," + Y1[i];
            }

            return result;
    }
