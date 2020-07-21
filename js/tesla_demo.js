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
  for (var i in spheres) {
    let sphere = spheres[i]
    window._scene.remove(spheres[i].sphere)
  }
  spheres = []
  spheres = getRandomXYZCoordinates(lNum)
  //var positions = labelPositionOptimizerUsingArea2(labelWidth, labelHeight, x2.length, x1, y1);
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

/*private Map<String, Object> lineHelper(
            Double[] x11
            , Double[] y11
            , Double[] x22
            , Double[] y22*/
/*function lineHelper(x11, y11, x22, y22) {

            final int N = 205;
            final int INF = 50005;
            int n;
            double[] X1 = new double[N];
            double[] Y1 = new double[N];
            double[] X2 = new double[N];
            double[] Y2 = new double[N];
            double[][] W = new double[N][N];
            double[] Lx = new double[N];
            double[] Ly = new double[N];
            int[] left = new int[N];
            boolean[] S = new boolean[N];
            boolean[] T = new boolean[N];

            n = y22.length - 1;

            List<Double> x1 = new ArrayList<Double>(Arrays.asList(x11));
            List<Double> x2 = new ArrayList<Double>(Arrays.asList(x22));
            List<Double> y1 = new ArrayList<Double>(Arrays.asList(y11));
            List<Double> y2 = new ArrayList<Double>(Arrays.asList(y22));

            for (int i = 1; i <= n; i++) {
                X1[i] = x1.get(i);
                Y1[i] = y1.get(i);
            }
            for (int i = 1; i <= n; i++) {

                X2[i] = x2.get(i);
                Y2[i] = y2.get(i);
            }


            for (int i = 1; i <= n; i++) {
                for (int j = 1; j <= n; j++) {
                    W[j][i] = -Math.sqrt(Math.pow(X1[i] - X2[j], 2) + Math.pow(Y1[i] - Y2[j], 2));
                }
            }


            //km
            for (int i = 1; i <= n; i++) {
                left[i] = 0;
                Lx[i] = 0;
                Ly[i] = 0;
                for (int j = 1; j <= n; j++) {
                    Lx[i] = Math.max(Lx[i], W[i][j]);
                }
            }
            for (int i = 1; i <= n; i++) {
                while (true) {
                    for (int j = 1; j <= n; j++) {
                        S[j] = T[j] = false;
                    }
                    if (match(S, n, Lx, Ly, W, T, left, i)) {
                        break;
                    } else {

                        double a = INF;
                        for (int h = 1; h <= n; h++) {
                            if (!S[h]) {
                                continue;
                            }
                            for (int m = 1; m <= n; m++) {
                                if (T[m]) {
                                    continue;
                                }
                                a = Math.min(a, Lx[h] + Ly[m] - W[h][m]);
                            }
                        }
                        for (int w = 1; w <= n; w++) {
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

            Map<String, Object> result = new HashMap<>();
            for (int i = 1; i <= n; i++) {

                //内点 key
                result.put(X2[left[i]] + "," + Y2[left[i]], X1[i] + "," + Y1[i]);
            }

            return result;
        } catch (Exception e) {
            System.out.println("lineHelper exception: ");
            System.out.println(e.getMessage());
            HashMap<String, Object> exceptionHm = new HashMap();
            exceptionHm.put("msg", e.getMessage());
            return exceptionHm;
        }
    }*/
