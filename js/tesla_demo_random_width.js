const maxXYZ = 1.5
var labelToPointPathHelperObj = {}
var labelToPointMapperHelper = {}
var pointToLabelMapperHelper = {}
var randomWidthMapper = {}
var spheres = []
/*var spheresOriginal = []

$(document).ready(function() {
  spheresOriginal = getRandomXYZCoordinates(100)
})*/

function lWidthChange(e) {

}

function lHeightChange(e) {

}

function lNumChange(e) {

}

function getRandom(m) {
  return Math.floor(Math.random()*m)
}

function changeCanvas(e) {
  var lWidth = 400//document.getElementById('lWidth').value
  var lHeight = document.getElementById('lHeight').value
  //lWidth = lWidth <= 0?300:lWidth
  //lHeight = lHeight <= 0?300:lHeight
  lWidth = getRandom(lWidth)
  //lHeight = getRandom(lHeight)
  document.getElementById('lWidth').value = lWidth
  document.getElementById('lHeight').value = lHeight
  var lNum = document.getElementById('lNum').value
  var containerElm = document.getElementById('container');
  //var containerElm2 = document.getElementById('canvas');
  var graphContainerElm = document.getElementById('graphContainer');

  var topDiff3 = containerElm.offsetTop - graphContainerElm.offsetTop + 20;
  var leftDiff3 = containerElm.offsetLeft - graphContainerElm.offsetLeft + 20;
  graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
  for (var i in spheres) {
    let sphere = spheres[i]
    window._scene.remove(spheres[i].sphere)
  }
  spheres = []
  spheres = getRandomXYZCoordinates(lNum)
  var x2 = [0]
  var y2 = [0]
  spheres.forEach(function (sphere) {
      // 显示标签对应的测点
      var _cameraManager = new THREE._CameraManager();
      sphere.sphere.position[0] = sphere.sphere.position['x']
      sphere.sphere.position[1] = sphere.sphere.position['y']
      sphere.sphere.position[2] = sphere.sphere.position['z']
      var canvasElem = document.getElementById('canvas')
      var _screenXY = _cameraManager._convertWorldPositionToScreenCoord(window._camera, sphere.sphere.position,
        window._canvasWidth, window._canvasHeight);
        //canvasElem.offsetWidth, canvasElem.offsetHeight)
        //window._canvasWidth, window._canvasHeight);
      //var _position = {x: _screenXY.x, y: _screenXY.y}

      x2.push(_screenXY[0] + leftDiff3)
      y2.push(_screenXY[1] + topDiff3)

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
  var positions = labelPositionOptimizerUsingAreaTesla(Number(lWidth), Number(lHeight), x2.length, x1, y1);
  if (x1.length !== x2.length) {
    alert("没办法画，试试别的数子")
  } else {
    drawLabels(x1, y1, x2, y2, positions.width, positions.height, positions.retArr)
  }
}

function drawLabels(x1, y1, x2, y2, lWidth, lHeight, retArr) {
  console.log('drawLabels...')

  labelToPointPathHelperObj = retArr
  labelToPointPathHelperObj.lWidth = lWidth
  labelToPointPathHelperObj.lHeight = lHeight
  mxGraph.prototype.ordered = false;
  try {
      graph.getModel().beginUpdate();
      var parent = graph.getDefaultParent();
      var edges = []
      var vertices = []
      /*var cell = new mxCell('your text', new mxGeometry(0, 0, 50, 50), 'curved=1;endArrow=classic;html=1;');
      cell.geometry.setTerminalPoint(new mxPoint(50, 150), true);
      cell.geometry.setTerminalPoint(new mxPoint(150, 50), false);

      cell.geometry.relative = true;
      cell.edge = true;

      cell = graph.addCell(cell);
      edges.push(cell)*/
      var lineHelperResult = lineHelper(x1, y1, x2, y2)
      for (var i = 1; i < x1.length; i++) {
        var f_label = "f_label" + i
        //the label x, y
        //var _x1 = x1[i]
        //var _y1 = y1[i]
        //the point x, y
        var x = x2[i]
        x = x < 0?0:x
        var y = y2[i]
        y = y < 0?0:y
        var _xHelper = lineHelperResult[x+','+y]
        if (_xHelper) {
          var _xHelperArr = _xHelper.split(',')
          var _x1 = _xHelperArr[0]
          _x1 = _x1<0?0:_x1
          var _y1 = _xHelperArr[1]
          _y1 = _y1<0?0:_y1
        labelToPointMapperHelper[_x1+','+_y1] = {x:x,y:y}
        pointToLabelMapperHelper[x+','+y] = {x:_x1,y:_y1}
      /*var v1ValueTest = '_x1 (rect): ' + _x1 + ', _y1 (rect): ' + _y1 +
      ', x: ' + x + ', y: ' + y;*/
      var tempLWidth = randomWidthMapper[_x1+','+_y1]
      //var v1Value = '<div style="width:'+lWidth+'px;height:'+lHeight+'px;border: 1px solid black;"></div>'
      var v1Value = '<div style="width:'+tempLWidth+'px;height:'+lHeight+'px;border: 1px solid black;"></div>'
      //var len = res.points.length;
      //var tableMargin = '';

      //for testing
      //var _temp = 'margin-right: '+globalObj.spacing.chartSpacingLeftRight+'px;';
      /*v1Value += "<div class='svg-table' " +
          "style='margin-top:20px;display:inline-block;border: " + handsonTableBorderStyle +
          ";background-color: #fff;" + _temp +"'>" + v1ValueTest + "</div>"*/

      /*res.points.forEach(function (item, i) {
          // 最后一个table不需要间隔
          // var _temp = i < len - 1 ? tableMargin : '';
          var _temp = 'margin-right: '+globalObj.spacing.chartSpacingLeftRight+'px;';
          v1Value += "<div class='svg-table' data-dir='" + item.fx + "' " +
              "style='display:inline-block;border: " + handsonTableBorderStyle +
              ";background-color: #fff;" + _temp +"'>" + hTableHtml[i] + "</div>"
      });*/

      var v1 = graph.insertVertex(parent, f_label, v1Value, _x1, _y1, tempLWidth, lHeight, 'text;html=1;overflow=fill;fillColor=white;textOpacity:50');
      //existingVertices is for the functionality "应用到“
      //globalObj.existingVertices.push(v1);

      // canvas测点坐标
      var v2 = graph.insertVertex(parent, f_label + "point2", '', x, y, 0, 0, 'overflow=fill;fillColor=none;fontColor=#000000;');
      vertices.push(v1)
      // 连线
      var e1 = graph.insertEdge(parent, f_label + "point3", '', v1, v2,
          "shape=link;")
          edges.push(e1)
        }
        }
        graph.orderCells(true, edges)
        graph.orderCells(false, vertices)
      /*globalObj.cache[globalObjIndex].edge = e1;
      globalObj.cache[globalObjIndex].v1 = v1;
      globalObj.cache[globalObjIndex].v2 = v2;*/
  } finally {
      graph.getModel().endUpdate();
  }
}

function findEdgeRouterPoints(srcX, srcY, destX, destY) {
  var pageScreenWidth = document.getElementById('pageScreen').offsetWidth;
  var pageScreenHeight = document.getElementById('pageScreen').offsetHeight;
  var containerWidth = document.getElementById('container').offsetWidth;
  var containerHeight = document.getElementById('container').offsetHeight;
  var containerLeft = document.getElementById('container').offsetLeft;
  var containerTop = document.getElementById('container').offsetTop;
  var lWidth = labelToPointPathHelperObj.lWidth
  var lHeight = labelToPointPathHelperObj.lHeight

  //labelToPointMapperHelper
  //pointToLabelMapperHelper
  var labelPoint = pointToLabelMapperHelper[destX+','+destY]
  var labelX = labelPoint.x
  var labelY = labelPoint.y
  var retArr = []
  //check if that labelToPointPathHelperObj has srcX,srcY or destX,destY
  //if (labelToPointPathHelperObj[srcX+','+srcY]) {
  if (labelToPointPathHelperObj[labelX+','+labelY]) {
    var udlr = labelToPointPathHelperObj[labelX+','+labelY];
    console.log('udlr: ' + udlr)
    if (udlr == 'up') {
      retArr.push({x:labelPoint.x + lWidth/2,y:labelPoint.y+lHeight})
      //draw next point down by half of globalObj.spacing.chartSpacingUpDown
      retArr.push({x:labelPoint.x + lWidth/2,y:labelPoint.y+lHeight+(globalObj.spacing.chartSpacingUpDown/2)})
      //check if label is to the left of point or to the right
      if (labelX < destX) { //to the left
        retArr.push({x:labelPoint.x+lWidth+(globalObj.spacing.chartSpacingLeftRight/2),
          y:labelPoint.y+lHeight+(globalObj.spacing.chartSpacingUpDown/2)})
          retArr.push({x:labelPoint.x+lWidth+(globalObj.spacing.chartSpacingLeftRight/2),
            y:containerTop-globalObj.spacing.chartSpacingUpDown})
      } else {
        retArr.push({x:labelPoint.x+lWidth+(globalObj.spacing.chartSpacingLeftRight/2),
          y:labelPoint.y+lHeight+(globalObj.spacing.chartSpacingUpDown/2)})
          //
          retArr.push({x:labelPoint.x+lWidth+(globalObj.spacing.chartSpacingLeftRight/2),
            y:containerTop-globalObj.spacing.chartSpacingUpDown})
      }

      //check if "labelPoint.x+lWidth+(globalObj.spacing.chartSpacingLeftRight/2)" is to the left of container's left
      //or to the right of the container's right
      if (labelPoint.x+lWidth+(globalObj.spacing.chartSpacingLeftRight/2) < containerLeft) {
        /*retArr.push({x:containerLeft,y:labelPoint.y+lHeight+(globalObj.spacing.chartSpacingUpDown/2)})
        retArr.push({x:labelPoint.x+lWidth+(globalObj.spacing.chartSpacingLeftRight/2),
        y:containerTop-globalObj.spacing.chartSpacingUpDown})*/
        retArr.push({x:containerLeft,y:containerTop-globalObj.spacing.chartSpacingUpDown})
      } else if (labelPoint.x+lWidth+(globalObj.spacing.chartSpacingLeftRight/2) >
      (containerLeft + containerWidth)) {
        /*retArr.push({x:containerLeft+containerWidth,y:labelPoint.y+lHeight+(globalObj.spacing.chartSpacingUpDown/2)})
        retArr.push({x:labelPoint.x+lWidth+(globalObj.spacing.chartSpacingLeftRight/2),
        y:containerTop-globalObj.spacing.chartSpacingUpDown})*/
        retArr.push({x:containerLeft+containerWidth,y:containerTop-globalObj.spacing.chartSpacingUpDown})
      }/* else {
        retArr.push({x:labelPoint.x+lWidth+(globalObj.spacing.chartSpacingLeftRight/2),
        y:containerTop-globalObj.spacing.chartSpacingUpDown})
      }*/
    } else if (udlr == 'left') {

    } else if (udlr == 'right') {

    } else {

    }
  } else if (labelToPointPathHelperObj[destX+','+destY]) {

  }
  return []//retArr
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

function getRandomXYZCoordinates2(lNum) {
  var retArr = []
  for (var i = 0; i < 100; i++) {
    /*let x = Math.random() * Math.floor(maxXYZ)
    let y = Math.random() * Math.floor(maxXYZ)
    let z = Math.random() * Math.floor(maxXYZ)*/
    //let np = {x: spheresOriginal[i].position.x, y: spheresOriginal[i].position.y, z: spheresOriginal[i].position.z}
    /*let geometry = new THREE.SphereGeometry(.02, 3, 3)
    let material = new THREE.MeshBasicMaterial({color: 0x00ff00})
    var sphere = new THREE.Mesh(geometry, material)
    sphere.position.set(x, y, z)
    window._scene.add(sphere)
    np.sphere = sphere*/
    if (i < lNum) {
      retArr.push(spheresOriginal[i])
      spheresOriginal[i].sphere.visible = true
    } else {
      spheresOriginal[i].sphere.visible = false
    }
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

/*<<<<<<< Updated upstream
function match(S,n,Lx,Ly,W,T,left,i)
{
    S[i] = true;
    for (var j = 1; j <= n; j++)
    {
        if (Math.abs(Lx[i] + Ly[j] - W[i][j]) < 1e-9 && !T[j])
        {
            T[j] = true;
            if (left[j] == 0 || match(S,n,Lx,Ly,W,T,left,left[j]))
            {
                left[j] = i;
                return true;
            }
        }
    }
    return false;
}

=======*/
//function match(boolean[] S,int n,double[] Lx,double[] Ly,double[][] W,boolean[] T,int[] left,int i)
function match(S,n,Lx,Ly,W,T,left,i)
    {
        S[i] = true;
        for (var j = 1; j <= n; j++)
        {
            if (Math.abs(Lx[i] + Ly[j] - W[i][j]) < 1e-9 && !T[j])
            {
                T[j] = true;
                if (left[j] == 0 || match(S,n,Lx,Ly,W,T,left,left[j]))
                {
                    left[j] = i;
                    return true;
                }
            }
        }
        return false;
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

    function toggleDragAndResize(e) {
        globalObj.dragAndResize = !(!!globalObj.dragAndResize);
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

    function getStartingLabelWidthAndHeight(maximumArea, labelW, labelH, count) {
      var x = Math.sqrt(maximumArea / (labelW * labelH * count))
      var retLabelWidthAndHeight = {labelW: labelW * x, labelH: labelH * x};
      return retLabelWidthAndHeight
    }

    function getMaximumAreaPerLabel(labelW, labelH, count) {
      var pageScreenWidth = document.getElementById('pageScreen').offsetWidth;
      var pageScreenHeight = document.getElementById('pageScreen').offsetHeight;
      var containerWidth = document.getElementById('container').offsetWidth;
      var containerHeight = document.getElementById('container').offsetHeight;
      var containerLeft = document.getElementById('container').offsetLeft;
      var containerTop = document.getElementById('container').offsetTop;
      var totalArea = 0;

      var startPositions = {
          up: {
              startX: 0,//globalObj.spacing.pageSpacingLeftRight,
              startY: 0,//useTheseSides.up ? globalObj.spacing.pageSpacingUpDown : 0,
              endX: pageScreenWidth,//useTheseSides.up ? pageScreenWidth : 0,
              endY: containerTop,//useTheseSides.up ? containerTop : 0,
              currentX: 0
          },
          left: {
              startX: 0,//useTheseSides.left ? globalObj.spacing.pageSpacingLeftRight : 0,
              startY: containerTop,//useTheseSides.left ? (useTheseSides.up ? containerTop : globalObj.spacing.pageSpacingUpDown) : 0,
              endX: containerLeft,//0,useTheseSides.left ? containerLeft : 0,
              endY: containerTop + containerHeight,//useTheseSides.left ? (useTheseSides.down ? pageScreenHeight : containerTop + containerHeight) : 0,
              currentY: 0
          },
          right: {
              startX: containerLeft + containerWidth,
              startY: containerTop,
              endX: pageScreenWidth,
              endY: containerTop + containerHeight,
              currentY: 0
          },
          down: {
              startX: 0,
              startY: containerTop + containerHeight,
              endX: pageScreenWidth,
              endY: pageScreenHeight,
              currentX: 0
          }
      };

      for (var i in startPositions) {
        var startPosition = startPositions[i]
        totalArea += (startPosition.endY - startPosition.startY) * (startPosition.endX - startPosition.startX)
      }
      return totalArea
    }

    function labelPositionOptimizerGetStartPositions(labelW, labelH, count, x1, y1) {
      var pageScreenWidth = document.getElementById('pageScreen').offsetWidth;
      var pageScreenHeight = document.getElementById('pageScreen').offsetHeight;
      /*var containerWidth = document.getElementById('container').offsetWidth;
      var containerHeight = document.getElementById('container').offsetHeight;
      var containerLeft = document.getElementById('container').offsetLeft;*/
      var containerWidth = document.getElementById('container').offsetWidth;
      var containerHeight = document.getElementById('container').offsetHeight;
      var containerLeft = document.getElementById('container').offsetLeft;
      var leftSideWidth = containerLeft - globalObj.spacing.pageSpacingLeftRight;
      var rightSideWidth = pageScreenWidth - containerLeft - containerWidth - globalObj.spacing.pageSpacingLeftRight;
      //var containerTop = document.getElementById('container').offsetTop;
      var containerTop = document.getElementById('container').offsetTop;
      var downSideHeight = pageScreenHeight - containerTop - containerHeight - globalObj.spacing.pageSpacingUpDown;
      var upSideHeight = containerTop - globalObj.spacing.pageSpacingUpDown;
      var useTheseSides = {
          up: upSideHeight >= labelH ? true : false,
          left: leftSideWidth >= labelW ? true : false,
          right: rightSideWidth >= labelW ? true : false,
          down: downSideHeight >= labelH ? true : false
      };
      var startPositions = {
          up: {
              startX: useTheseSides.up ? globalObj.spacing.pageSpacingLeftRight : 0,
              startY: useTheseSides.up ? globalObj.spacing.pageSpacingUpDown : 0,
              endX: useTheseSides.up ? pageScreenWidth : 0,
              endY: useTheseSides.up ? containerTop : 0,
              currentX: 0,
              currentY: 0,
              used: useTheseSides.up
          },
          left: {
              startX: useTheseSides.left ? globalObj.spacing.pageSpacingLeftRight : 0,
              startY: useTheseSides.left ? (useTheseSides.up ? containerTop : globalObj.spacing.pageSpacingUpDown) : 0,
              endX: useTheseSides.left ? containerLeft : 0,
              endY: useTheseSides.left ? (useTheseSides.down ? containerTop + containerHeight:pageScreenHeight) : 0,
              currentX: 0,
              currentY: 0,
              used: useTheseSides.left
          },
          right: {
              startX: useTheseSides.right ? containerLeft + containerWidth : 0,
              startY: useTheseSides.right ? (useTheseSides.up ? containerTop : globalObj.spacing.pageSpacingUpDown) : 0,
              endX: useTheseSides.right ? pageScreenWidth : 0,
              //endY: useTheseSides.right ? (useTheseSides.down ? containerTop + containerHeight : pageScreenHeight) : 0,
              endY: useTheseSides.right ? (useTheseSides.down ? containerTop + containerHeight:pageScreenHeight) : 0,
              currentX: 0,
              currentY: 0,
              used: useTheseSides.right
          },
          down: {
              startX: useTheseSides.down ? globalObj.spacing.pageSpacingLeftRight : 0,
              startY: useTheseSides.down ? containerTop + containerHeight : 0,
              endX: useTheseSides.down ? pageScreenWidth : 0,
              endY: useTheseSides.down ? pageScreenHeight - globalObj.spacing.pageSpacingUpDown : 0,
              currentX: 0,
              currentY: 0,
              used: useTheseSides.down
          }
      };
      return startPositions
    }

    function labelPositionOptimizerUsingAreaHelperTesla(labelW, labelH, count, x1, y1, startPositions) {
        var roundRobinULRD = 1;
        var countHelper = 0;
        startPositions.up.currentX = startPositions.up.startX;
        startPositions.up.currentY = startPositions.up.startY;
        startPositions.left.currentX = startPositions.left.startX;
        startPositions.left.currentY = startPositions.left.startY;
        startPositions.right.currentX = startPositions.right.startX;
        startPositions.right.currentY = startPositions.right.startY;
        startPositions.down.currentX = startPositions.down.startX;
        startPositions.down.currentY = startPositions.down.startY;
        var x1Up = [];
        var y1Up = [];
        var x1Left = [];
        var y1Left = [];
        var x1Right = [];
        var y1Right = [];
        var x1Down = [];
        var y1Down = [];
        while (countHelper < count - 1) {
            var lastCountHelper = countHelper;
            switch (roundRobinULRD) {
                case 1: //up
                    if ((startPositions.up.currentX + ((3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4)))
                        <= startPositions.up.endX) {
                        x1Up.push(startPositions.up.currentX);
                        y1Up.push(startPositions.up.startY);
                        startPositions.up.currentX += (3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4);
                        countHelper++;
                    }
                    break;
                case 2: //left
                    if ((startPositions.left.currentY + ((3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4)))
                        <= startPositions.left.endY) {
                        x1Left.push(startPositions.left.startX);
                        y1Left.push(startPositions.left.currentY);
                        startPositions.left.currentY += (3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4);
                        countHelper++;
                    }
                    break;
                case 3: //right
                    if ((startPositions.right.currentY + ((3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4)))
                        <= startPositions.right.endY) {
                        x1Right.push(startPositions.right.startX);
                        y1Right.push(startPositions.right.currentY);
                        startPositions.right.currentY += (3 * labelH) + (globalObj.spacing.chartSpacingUpDown * 4);
                        countHelper++;
                    }
                    break;
                case 4: //down
                    if ((startPositions.down.currentX + ((3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4)))
                        <= startPositions.down.endX) {
                        x1Down.push(startPositions.down.currentX);
                        y1Down.push(startPositions.down.startY);
                        startPositions.down.currentX += (3 * labelW) + (globalObj.spacing.chartSpacingLeftRight * 4);
                        countHelper++;
                    }
                    break;
                default:
                    break;
            }
            if (lastCountHelper == countHelper)
                return false;
            if (++roundRobinULRD > 4) {
                roundRobinULRD = 1;
            }
        }

        if (x1Up.length > 0) {
            var upUsedWidth = (x1Up[x1Up.length - 1] + (labelW * 3)) - x1Up[0];
            var upMarginX = (pageScreenWidth - upUsedWidth) / 2;
            var upMarginY = (containerTop - labelH) / 2;
            upMarginX = isNaN(upMarginX) ? 0 : upMarginX;
            upMarginY = isNaN(upMarginY) ? 0 : upMarginY;
            for (var i = 0; i < x1Up.length; i++) {
                x1Up[i] = Math.floor(x1Up[i] + upMarginX);
                y1Up[i] = Math.floor(y1Up[i] + upMarginY);
                getLabelPositions2HelperObj[x1Up[i] + ',' + y1Up[i]] = 'up';
            }
        }

        if (x1Left.length > 0) {
            var leftWidth = containerLeft - globalObj.spacing.pageSpacingLeftRight;
            var leftHeight = containerHeight;
            if (!useTheseSides.up) {
                leftHeight += containerTop;
            }
            if (!useTheseSides.down) {
                leftHeight += (pageScreenHeight - containerHeight - containerTop);
            }
            var leftUsedHeight = (y1Left[y1Left.length - 1] + (labelH * 3)) - y1Left[0];
            var leftMarginX = (leftWidth - labelW) / 2;
            var leftMarginY = (leftHeight - leftUsedHeight) / 2;
            leftMarginX = isNaN(leftMarginX) ? 0 : leftMarginX;
            leftMarginY = isNaN(leftMarginY) ? 0 : leftMarginY;
            for (var i = 0; i < x1Left.length; i++) {
                y1Left[i] = Math.floor(y1Left[i] + leftMarginY);
                getLabelPositions2HelperObj[x1Left[i] + ',' + y1Left[i]] = 'left';
            }
        }

        if (x1Right.length > 0) {
            var rightUsedHeight = (y1Right[y1Right.length - 1] + (labelH * 3)) - y1Right[0];
            var rightHeight = containerHeight;
            if (!useTheseSides.up) {
                rightHeight += containerTop;
            }
            if (!useTheseSides.down) {
                rightHeight += (pageScreenHeight - containerHeight - containerTop);
            }
            var rightMarginX = pageScreenWidth - (containerLeft + containerWidth) -
                (labelW + globalObj.spacing.pageSpacingLeftRight);
            var rightMarginY = (rightHeight - rightUsedHeight) / 2;
            rightMarginX = isNaN(rightMarginX) ? 0 : rightMarginX;
            rightMarginY = isNaN(rightMarginY) ? 0 : rightMarginY;
            for (var i = 0; i < x1Right.length; i++) {
                x1Right[i] = Math.floor(x1Right[i] + rightMarginX);
                y1Right[i] = Math.floor(y1Right[i] + rightMarginY);
                getLabelPositions2HelperObj[x1Right[i] + ',' + y1Right[i]] = 'right';
            }
        }

        if (x1Down.length > 0) {
            var bottomWidth = pageScreenWidth;
            var bottomHeight = pageScreenHeight - containerHeight - containerTop;
            var downUsedWidth = (x1Down[x1Down.length - 1] + (labelW * 3)) - x1Down[0];
            var downMarginX = (bottomWidth - downUsedWidth) / 2;
            var downMarginY = (bottomHeight - labelH) / 2;
            downMarginX = isNaN(downMarginX) ? 0 : downMarginX;
            downMarginY = isNaN(downMarginY) ? 0 : downMarginY;
            for (var i = 0; i < x1Down.length; i++) {
                x1Down[i] = Math.floor(x1Down[i] + downMarginX);
                y1Down[i] = Math.floor(y1Down[i] + downMarginY);
                getLabelPositions2HelperObj[x1Down[i] + ',' + y1Down[i]] = 'down';
            }
        }

        rotateHelper = 0;
        while (x1Up.length > 0 || x1Left.length > 0 || x1Right.length > 0 || x1Down.length > 0) {
            switch (rotateHelper++) {
                case 0:
                    if (x1Up.length > 0) {
                        x1.push(x1Up.shift());
                        y1.push(y1Up.shift());
                    }
                    break;
                case 1:
                    if (x1Left.length > 0) {
                        x1.push(x1Left.shift());
                        y1.push(y1Left.shift());
                    }
                    break;
                case 2:
                    if (x1Right.length > 0) {
                        x1.push(x1Right.shift());
                        y1.push(y1Right.shift());
                    }
                    break;
                case 3:
                    if (x1Down.length > 0) {
                        x1.push(x1Down.shift());
                        y1.push(y1Down.shift());
                    }
                    rotateHelper = 0;
                    break;
                default:
                    break;
            }
        }
        return true;
    }

    function labelPositionOptimizerUsingAreaHelperFirst(labelW, labelH, count, x1, y1, startPositions) {
        var roundRobinULRD = 1;
        var countHelper = 0;
        var pageScreenWidth = document.getElementById('pageScreen').offsetWidth;
        var pageScreenHeight = document.getElementById('pageScreen').offsetHeight;
        var containerWidth = document.getElementById('container').offsetWidth;
        var containerHeight = document.getElementById('container').offsetHeight;
        var containerLeft = document.getElementById('container').offsetLeft;
        //var leftSideWidth = containerLeft - globalObj.spacing.pageSpacingLeftRight;
        //var rightSideWidth = pageScreenWidth - containerLeft - containerWidth - globalObj.spacing.pageSpacingLeftRight;
        var containerTop = document.getElementById('container').offsetTop;
        startPositions.up.currentX = startPositions.up.startX;
        startPositions.up.currentY = startPositions.up.startY;
        startPositions.left.currentX = startPositions.left.startX;
        startPositions.left.currentY = startPositions.left.startY;
        startPositions.right.currentX = startPositions.right.startX;
        startPositions.right.currentY = startPositions.right.startY;
        startPositions.down.currentX = startPositions.down.startX;
        startPositions.down.currentY = startPositions.down.startY;
        var x1Up = [];
        var y1Up = [];
        var x1Left = [];
        var y1Left = [];
        var x1Right = [];
        var y1Right = [];
        var x1Down = [];
        var y1Down = [];
        var upNumOfLabelsPerRow = 0
        var upNumOfLabelsPerRowCount = true
        var upNumOfRows = 1
        var leftNumOfLabelsPerColumn = 0
        var leftNumOfLabelsPerColumnCount = true
        var leftNumOfColumns = 1
        var rightNumOfLabelsPerColumn = 0
        var rightNumOfLabelsPerColumnCount = true
        var rightNumOfColumns = 1
        var downNumOfLabelsPerRow = 0
        var downNumOfLabelsPerRowCount = true
        var downNumOfRows = 1
        //chartSpacingUpDown: 5,
        //chartSpacingLeftRight: 5,
        while (countHelper < count - 1) {
            //var lastCountHelper = countHelper;
            var errorOccurred = false
            switch (roundRobinULRD) {
                case 1: //up
                    if (!startPositions.up.used) {
                      errorOccurred = true
                    } else if ((startPositions.up.currentX + labelW)
                        <= startPositions.up.endX) {
                        x1Up.push(startPositions.up.currentX);
                        y1Up.push(startPositions.up.currentY);
                        startPositions.up.currentX += (labelW + globalObj.spacing.chartSpacingLeftRight);// + (globalObj.spacing.chartSpacingLeftRight * 4);
                        countHelper++;
                        errorOccurred = true
                        if (upNumOfLabelsPerRowCount) {
                          upNumOfLabelsPerRow++
                        }
                    } else {
                      if ((startPositions.up.currentY + (labelH * 2) + (globalObj.spacing.chartSpacingUpDown * 2)) <= startPositions.up.endY) {
                        startPositions.up.currentY += labelH + globalObj.spacing.chartSpacingUpDown
                        startPositions.up.currentX = startPositions.up.startX
                        errorOccurred = true
                        upNumOfRows++
                      } else {
                        startPositions.up.used = false
                      }
                      upNumOfLabelsPerRowCount = false
                    }
                    break;
                case 2: //left
                  if (!startPositions.left.used) {
                    errorOccurred = true
                  } else if ((startPositions.left.currentY + labelH)
                        <= startPositions.left.endY) {
                        x1Left.push(startPositions.left.currentX);
                        y1Left.push(startPositions.left.currentY);
                        startPositions.left.currentY += (labelH + globalObj.spacing.chartSpacingUpDown);// + (globalObj.spacing.chartSpacingUpDown * 4);
                        countHelper++;
                        errorOccurred = true
                        if (leftNumOfLabelsPerColumnCount) {
                          leftNumOfLabelsPerColumn++
                        }
                    } else {
                      if ((startPositions.left.currentX + (labelW * 2) + (globalObj.spacing.chartSpacingLeftRight * 2)) <= startPositions.left.endX) {
                        startPositions.left.currentX += labelW + globalObj.spacing.chartSpacingLeftRight
                        startPositions.left.currentY = startPositions.left.startY
                        errorOccurred = true
                        leftNumOfColumns++
                      } else {
                        startPositions.left.used = false
                      }
                      leftNumOfLabelsPerColumnCount = false
                    }
                    break;
                case 3: //right
                  if (!startPositions.right.used) {
                    errorOccurred = true
                  } else if ((startPositions.right.currentY + labelH)
                        <= startPositions.right.endY) {
                        x1Right.push(startPositions.right.currentX);
                        y1Right.push(startPositions.right.currentY);
                        startPositions.right.currentY += labelH + globalObj.spacing.chartSpacingUpDown;// + (globalObj.spacing.chartSpacingUpDown * 4);
                        countHelper++;
                        errorOccurred = true
                        if (rightNumOfLabelsPerColumnCount) {
                          rightNumOfLabelsPerColumn++
                        }
                    } else {
                      if ((startPositions.right.currentX + (labelW * 2) + (globalObj.spacing.chartSpacingLeftRight * 2))
                       <= startPositions.right.endX) {
                        startPositions.right.currentX += labelW + globalObj.spacing.chartSpacingLeftRight
                        startPositions.right.currentY = startPositions.right.startY// + globalObj.spacing.chartSpacingUpDown
                        errorOccurred = true
                        rightNumOfColumns++
                      } else {
                        startPositions.right.used = false
                      }
                      rightNumOfLabelsPerColumnCount = false
                    }
                    break;
                case 4: //down
                  if (!startPositions.down.used) {
                    errorOccurred = true
                  } else if ((startPositions.down.currentX + labelW)
                        <= startPositions.down.endX) {
                        x1Down.push(startPositions.down.currentX);
                        y1Down.push(startPositions.down.currentY);
                        startPositions.down.currentX += labelW + globalObj.spacing.chartSpacingLeftRight;// + (globalObj.spacing.chartSpacingLeftRight * 4);
                        countHelper++;
                        errorOccurred = true
                        if (downNumOfLabelsPerRowCount) {
                          downNumOfLabelsPerRow++
                        }
                    } else {
                      if ((startPositions.down.currentY + (labelH * 2) + (globalObj.spacing.chartSpacingUpDown * 2)) <= startPositions.down.endY) {
                        startPositions.down.currentY += labelH + globalObj.spacing.chartSpacingUpDown
                        startPositions.down.currentX = startPositions.down.startX// + globalObj.spacing.chartSpacingLeftRight
                        errorOccurred = true
                        downNumOfRows++
                      } else {
                        startPositions.down.used = false
                      }
                      downNumOfLabelsPerRowCount = false
                    }
                    break;
                default:
                    break;
            }
            console.log('errorOccurred is ' + errorOccurred + ', up used: ' +
          startPositions.up.used + ', left used: ' + startPositions.left.used + ', right used: '
          + startPositions.right.used + ', down used: ' + startPositions.down.used)
            if (//!errorOccurred ||
              !(startPositions.up.used || startPositions.left.used ||
                startPositions.right.used || startPositions.down.used))//lastCountHelper == countHelper)
                return false;
            if (++roundRobinULRD > 4) {
                roundRobinULRD = 1;
            }
        }

        //07/23/2020 this next four if blocks is for centering all the labels within their up|left|right|down blocks
        if (x1Up.length > 0) {
            var upUsedWidth = x1Up[upNumOfLabelsPerRow - 1] +
            (labelW + globalObj.spacing.chartSpacingLeftRight) - x1Up[0];
            //x1Up[x1Up.length - 1] + labelW - x1Up[0];
            var upUsedHeight = y1Up[y1Up.length - 1] + (labelH + globalObj.spacing.chartSpacingUpDown) - y1Up[0]
            //y1Up[y1Up.length - 1] + labelH - y1Up[0]
            var upBalance = (pageScreenWidth - upUsedWidth)
            var upMarginX = (pageScreenWidth - upUsedWidth) / (upNumOfLabelsPerRow + 1)
            //(pageScreenWidth - upUsedWidth) / 2;
            var upMarginY = (containerTop - upUsedHeight) / (upNumOfRows + 1)
            //(containerTop - upUsedHeight) / 2;
            upMarginX = isNaN(upMarginX) ? 0 : upMarginX;
            upMarginY = isNaN(upMarginY) ? 0 : upMarginY;
            var currentRow = 0;
            var currentColumn = 0;
            var widthBalancer = 0;
            for (var i = 0; i < x1Up.length; i++) {
              currentColumn = i % upNumOfLabelsPerRow;
              currentRow = Math.floor(i / upNumOfLabelsPerRow)
              if (currentColumn == 0) {
                widthBalancer = 0;
                upBalance = (pageScreenWidth - upUsedWidth)
              }

                x1Up[i] = Math.floor(x1Up[i] + widthBalancer)
                  //(upMarginX * ((i%upNumOfLabelsPerRow) + 1))) + widthBalancer;
                y1Up[i] = Math.floor(y1Up[i] + (upMarginY * (Math.floor(i/upNumOfLabelsPerRow) + 1)));
                //if (i == upNumOfLabelsPerRow)
                var tempRandom = randomBalancer(upBalance)//labelW/2)
                upBalance -= (tempRandom + globalObj.spacing.chartSpacingLeftRight + 1)
                widthBalancer += tempRandom + globalObj.spacing.chartSpacingLeftRight

                /*if (currentColumn == (upNumOfLabelsPerRow - 1)) {
                  tempRandom = widthBalancer - (pageScreenWidth - upUsedWidth)
                }*/

                randomWidthMapper[x1Up[i]+','+y1Up[i]] = (labelW + tempRandom)
                if (x1Up[i] < 0 || y1Up[i] < 0) {
                  x1 = [0]
                  y1 = [0]
                  return false;
                }
                //getLabelPositions2HelperObj[x1Up[i] + ',' + y1Up[i]] = 'up';
            }
        }

        if (x1Left.length > 0) {
            var leftWidth = containerLeft/* - globalObj.spacing.pageSpacingLeftRight;*/
            var leftHeight = containerHeight;
            /*if (!useTheseSides.up) {
                leftHeight += containerTop;
            }
            if (!useTheseSides.down) {
                leftHeight += (pageScreenHeight - containerHeight - containerTop);
            }*/
            var leftUsedHeight = y1Left[leftNumOfLabelsPerColumn - 1] +
            (labelH + globalObj.spacing.chartSpacingUpDown) - y1Left[0];
            //y1Left[y1Left.length - 1] + labelH - y1Left[0];
            var leftUsedWidth = x1Left[x1Left.length - 1] +
            (labelW + globalObj.spacing.chartSpacingLeftRight) - x1Left[0];
            var leftBalance = leftWidth - leftUsedWidth
            var leftMarginX = (leftWidth - leftUsedWidth) / (leftNumOfColumns + 1)// / 2;
            var leftMarginY = (leftHeight - leftUsedHeight) / (leftNumOfLabelsPerColumn + 1)//2;
            leftMarginX = isNaN(leftMarginX) ? 0 : leftMarginX;
            leftMarginY = isNaN(leftMarginY) ? 0 : leftMarginY;
            var currentRow = 0;
            var currentColumn = 0;
            var widthBalancer = 0;
            for (var i = 0; i < x1Left.length; i++) {
              currentRow = i % leftNumOfLabelsPerColumn;
              currentColumn = Math.floor(i / leftNumOfLabelsPerColumn)//leftNumOfLabelsPerRow)
              if (currentColumn == 0) {
                widthBalancer = 0;
                leftBalance = leftWidth - leftUsedWidth
              }
                x1Left[i] = Math.floor(x1Left[i] + widthBalancer)
                  // + (leftMarginX * (Math.floor(i/leftNumOfLabelsPerColumn) + 1))) + widthBalancer
                y1Left[i] = Math.floor(y1Left[i] + (leftMarginY * ((i%leftNumOfLabelsPerColumn) + 1)));
                var tempRandom = randomBalancer(leftBalance)//labelW/2)
                leftBalance -= (tempRandom + globalObj.spacing.chartSpacingLeftRight + 1)
                widthBalancer += tempRandom + globalObj.spacing.chartSpacingLeftRight
                randomWidthMapper[x1Left[i]+','+y1Left[i]] = (labelW + tempRandom)
                //getLabelPositions2HelperObj[x1Left[i] + ',' + y1Left[i]] = 'left';
                if (x1Left[i] < 0 || y1Left[i] < 0) {
                  x1 = [0]
                  y1 = [0]
                  return false;
                }
            }
        }

        if (x1Right.length > 0) {
            var rightUsedHeight = (y1Right[rightNumOfLabelsPerColumn - 1] + labelH +
              globalObj.spacing.chartSpacingUpDown) - y1Right[0];
            //(y1Right[y1Right.length - 1] + labelH) - y1Right[0];
            var rightUsedWidth = (x1Right[x1Right.length - 1] + labelW +
              globalObj.spacing.chartSpacingLeftRight) - x1Right[0];
            var rightHeight = containerHeight;
            /*if (!useTheseSides.up) {
                rightHeight += containerTop;
            }
            if (!useTheseSides.down) {
                rightHeight += (pageScreenHeight - containerHeight - containerTop);
            }*/
            var rightWidth = pageScreenWidth - (containerLeft + containerWidth)
            var rightMarginX = (pageScreenWidth - (containerLeft + containerWidth) -
                rightUsedWidth) / (rightNumOfColumns + 1)//2
            var rightBalance = rightWidth - rightUsedWidth
                //(labelW)// + globalObj.spacing.pageSpacingLeftRight);
            var rightMarginY = (rightHeight - rightUsedHeight) / (rightNumOfLabelsPerColumn + 1)//2;
            rightMarginX = isNaN(rightMarginX) ? 0 : rightMarginX;
            rightMarginY = isNaN(rightMarginY) ? 0 : rightMarginY;
            var currentRow = 0;
            var currentColumn = 0;
            var widthBalancer = 0;
            for (var i = 0; i < x1Right.length; i++) {
              currentRow = i % rightNumOfLabelsPerColumn;
              currentColumn = Math.floor(i / rightNumOfLabelsPerColumn)
              if (currentColumn == 0) {
                widthBalancer = 0;
                rightBalance = rightWidth - rightUsedWidth
              }
                x1Right[i] = Math.floor(x1Right[i] + widthBalancer)
                  // + (rightMarginX * (Math.floor(i/rightNumOfLabelsPerColumn) + 1)))
                //+ widthBalancer;
                y1Right[i] = Math.floor(y1Right[i] + (rightMarginY * ((i%rightNumOfLabelsPerColumn) + 1)));
                //getLabelPositions2HelperObj[x1Right[i] + ',' + y1Right[i]] = 'right';
                //if (i == rightNumOfLabelsPerRow)
                var tempRandom = randomBalancer(rightBalance)//labelW/2)
                rightBalance -= (tempRandom + globalObj.spacing.chartSpacingLeftRight + 1)
                widthBalancer += tempRandom + globalObj.spacing.chartSpacingLeftRight
                randomWidthMapper[x1Right[i]+','+y1Right[i]] = (labelW + tempRandom)
                if (x1Right[i] < 0 || y1Right[i] < 0) {
                  x1 = [0]
                  y1 = [0]
                  return false;
                }
            }
        }

        if (x1Down.length > 0) {
            var bottomWidth = pageScreenWidth;
            var bottomHeight = pageScreenHeight - containerHeight - containerTop;
            var downUsedWidth = (x1Down[downNumOfLabelsPerRow - 1] + labelW +
            globalObj.spacing.chartSpacingLeftRight) - x1Down[0];
            //(x1Down[x1Down.length - 1] + labelW) - x1Down[0];
            var downUsedHeight = (y1Down[y1Down.length - 1] + labelH +
            globalObj.spacing.chartSpacingUpDown) - y1Down[0];
            var downBalance = bottomWidth - downUsedWidth
            var downMarginX = (bottomWidth - downUsedWidth) / (downNumOfLabelsPerRow + 1)//2;
            var downMarginY = (bottomHeight - downUsedHeight) / (downNumOfRows + 1)//2;
            downMarginX = isNaN(downMarginX) ? 0 : downMarginX;
            downMarginY = isNaN(downMarginY) ? 0 : downMarginY;
            var currentRow = 0;
            var currentColumn = 0;
            var widthBalancer = 0;
            for (var i = 0; i < x1Down.length; i++) {
              currentColumn = i % downNumOfLabelsPerRow;
              currentRow = Math.floor(i / downNumOfLabelsPerRow)
              if (currentColumn == 0) {
                widthBalancer = 0;
                downBalance = bottomWidth - downUsedWidth
              }
                x1Down[i] = Math.floor(x1Down[i] + widthBalancer)
                  // + (downMarginX * ((i%downNumOfLabelsPerRow) + 1))) +
                //widthBalancer;
                y1Down[i] = Math.floor(y1Down[i] + (downMarginY * (Math.floor(i/downNumOfLabelsPerRow) + 1)));
                //getLabelPositions2HelperObj[x1Down[i] + ',' + y1Down[i]] = 'down';
                var tempRandom = randomBalancer(downBalance)//labelW/2)
                downBalance -= (tempRandom + globalObj.spacing.chartSpacingLeftRight + 1)
                widthBalancer += tempRandom + globalObj.spacing.chartSpacingLeftRight
                randomWidthMapper[x1Down[i]+','+y1Down[i]] = (labelW + tempRandom)
                if (x1Down[i] < 0 || y1Down[i] < 0) {
                  x1 = [0]
                  y1 = [0]
                  return false;
                }
            }
        }//*/
        var retArr = {}
        rotateHelper = 0;
        while (x1Up.length > 0 || x1Left.length > 0 || x1Right.length > 0 || x1Down.length > 0) {
            switch (rotateHelper++) {
                case 0:
                    if (x1Up.length > 0) {
                      var x1UpTemp = x1Up.shift()
                      var y1UpTemp = y1Up.shift()
                        x1.push(x1UpTemp);
                        y1.push(y1UpTemp);
                        retArr[x1UpTemp+','+y1UpTemp] = 'up'
                    }
                    break;
                case 1:
                    if (x1Left.length > 0) {
                      var x1LeftTemp = x1Left.shift()
                      var y1LeftTemp = y1Left.shift()
                        x1.push(x1LeftTemp);
                        y1.push(y1LeftTemp);
                        retArr[x1LeftTemp+','+y1LeftTemp] = 'left'
                    }
                    break;
                case 2:
                    if (x1Right.length > 0) {
                      var x1RightTemp = x1Right.shift()
                      var y1RightTemp = y1Right.shift()
                        x1.push(x1RightTemp);
                        y1.push(y1RightTemp);
                        retArr[x1RightTemp + ',' + y1RightTemp] = 'right'
                    }
                    break;
                case 3:
                    if (x1Down.length > 0) {
                      var x1DownTemp = x1Down.shift()
                      var y1DownTemp = y1Down.shift()
                        x1.push(x1DownTemp);
                        y1.push(y1DownTemp);
                        retArr[x1DownTemp + ',' + y1DownTemp] = 'down'
                    }
                    rotateHelper = 0;
                    break;
                default:
                    break;
            }
        }
        return {res: true, retArr: retArr};
    }

    function randomBalancer(n) {
      var retVal = Math.floor(Math.random() * n)
      //retVal -= (n/2)
      return retVal
    }

    function labelPositionOptimizerUsingAreaTesla(labelW, labelH, count, x1, y1) {
        getLabelPositions2HelperObj = {};
        var minW = 10;
        var minH = 10;
        var labelR = labelW / labelH;
        var widthGreaterThanHeight = labelW > labelH;
        var _width = minW;
        var _height = minH;
        var maximumArea = getMaximumAreaPerLabel(labelW, labelH, count)
        var startingLabelWidthAndHeight = getStartingLabelWidthAndHeight(maximumArea, labelW, labelH, count)
        var labelW2 = startingLabelWidthAndHeight.labelW > labelW ? labelW:startingLabelWidthAndHeight.labelW
        var labelH2 = startingLabelWidthAndHeight.labelH > labelH ? labelH:startingLabelWidthAndHeight.labelH
        labelW2 = labelW2 < minW?minW:labelW2
        labelH2 = labelH2 < minH?minH:labelH2
        var _retArr = []
        while (labelW2 >= minW && labelH2 >= minH) {
            if (widthGreaterThanHeight) {
                labelH2 = labelH2 - 1;
                labelW2 = Math.floor(labelH2 * labelR);
            } else {
                labelW2= labelW2 - 1;
                labelH2 = Math.floor(labelW2 / labelR);
            }
            //if ((labelW2 * labelH2 * count) < maximumArea) {
              var startPositions = labelPositionOptimizerGetStartPositions(labelW2, labelH2, count, x1, y1)
              var containerAreaHelperTesla = labelPositionOptimizerUsingAreaHelperFirst(labelW2,
                labelH2, count, x1, y1, startPositions);

              //call helper function here to see this labelW2 and this labelH2 can fit count number of labels
              if (containerAreaHelperTesla.res && x1.length == count) {//x2.length) {
                _width = labelW2;
                _height = labelH2;
                _retArr = containerAreaHelperTesla.retArr
                break;
              }
            //}
        }

        return {
            width: _width,
            height: _height,
            originalWidth: labelW,
            originalHeight: labelH,
            retArr: _retArr
        };
    }
