//x1 and y1 are outPoint x,y
function findEdgeRouterPoints(x, y, x1, y1) {
    //use edgeRouterHelperArr, which maps inPoints to outPoints
    //globalObj.tableLocation.width, globalObj.tableLocation.height
    var p1 = {x: x, y: y}
    var p2 = {x: x1, y: y1}
    var retArr = []
    for (var x in edgeRouterHelperArr) {
        var xSplitted = x.split(',');
        var x1Splitted = edgeRouterHelperArr[x].split(',')
        //if (x1 !== x1Splitted[0] && y1 !== x1Splitted[1]) {
        if (x1 !== Number(xSplitted[0]) && y1 !== Number(xSplitted[1])) {
            var r = {x: Number(x1Splitted[0]), y: Number(x1Splitted[1])}
            if (LineIntersectsRect(p1, p2, r)) {
                //push onto retArr instead, the mid point that will resolve this issue
                var mp = resolveByFindingMidPoint(p1, p2, r)
                retArr.push(mp)
                //retArr.push({x: r.x, y: r.y})
            }
        } else {
            console.log("should get here 12 times")
        }
    }
    return retArr
}

//p2 is the x, y point of the rectangle, p1 is the x, y point in the threejs scene
function resolveByFindingMidPoint(p1, p2, r) {
    //should be four different slopes
    var slope = getDirection(p1, p2)
    var midPoint = {x: p2.x, y: p2.y}
    switch (slope) {
        case 1: //p1 is north west of p2
            //midPoint.y = r.y
            midPoint.y = r.y// + globalObj.tableLocation.height
            midPoint.x = r.x + globalObj.tableLocation.width + 1
            break;
        case 2: //north east
            //midPoint.y = r.y
            midPoint.y = r.y// + globalObj.tableLocation.height
            midPoint.x = r.x - 1
            break;
        case 3: //south west
            //midPoint.y = r.y + globalObj.tableLocation.height
            midPoint.y = r.y + globalObj.tableLocation.height
            midPoint.x = r.x + globalObj.tableLocation.width + 1
            break;
        case 4: //south east
            //midPoint.y = r.y + globalObj.tableLocation.height
            midPoint.y = r.y + globalObj.tableLocation.height
            midPoint.x = r.x - 1
            break;
        default:
            break;
    }
    return midPoint;
}

//right now will only handle if p1, which is 3D point x, y is north west (1)
//north east (2), south west (3), or south east (4) of p2, which is the x, y point of the rectangle
function getDirection(p1, p2) {
    //first check is p1 is north of p2
    if (p1.y < p2.y) {
        //check if p1 is west of p2
        if (p1.x < p2.x) {
            return 1;
        } else {
            return 2;
        }
    }
    //else
    else {
        if (p1.x < p2.x) {
            return 3;
        } else {
            return 4;
        }
    }
    //return (p2.y - p1.y)/(p2.x - p1.x)
}

function LineIntersectsRect(p1, p2, r)
{
    /*var z1 = LineIntersectsLine(p1, p2, {x: r.x, y: r.y},
        {x: r.x + globalObj.tableLocation.width, y: r.y})
    var z2 = LineIntersectsLine(p1, p2, {x: r.x + globalObj.tableLocation.width, y: r.y},
        {x: r.x + globalObj.tableLocation.width, y: r.y + globalObj.tableLocation.height})
    var z3 = LineIntersectsLine(p1, p2, {x: r.x + globalObj.tableLocation.width,
            y: r.y + globalObj.tableLocation.height},
        {x: r.x, y: r.y + globalObj.tableLocation.height})
    var z4 = LineIntersectsLine(p1, p2, {x: r.x, y: r.y + globalObj.tableLocation.height},
        {x: r.x, y: r.y})*/
    var z1 = doIntersect(p1, p2, {x: r.x, y: r.y},
        {x: r.x + globalObj.tableLocation.width, y: r.y})
    var z2 = doIntersect(p1, p2, {x: r.x + globalObj.tableLocation.width, y: r.y},
        {x: r.x + globalObj.tableLocation.width, y: r.y + globalObj.tableLocation.height})
    var z3 = doIntersect(p1, p2, {x: r.x + globalObj.tableLocation.width,
            y: r.y + globalObj.tableLocation.height},
        {x: r.x, y: r.y + globalObj.tableLocation.height})
    var z4 = doIntersect(p1, p2, {x: r.x, y: r.y + globalObj.tableLocation.height},
        {x: r.x, y: r.y})
    /*console.log("for x: " + p1.x + ", y: " + p1.y + ", x1: " + p2.x + ", y1: " + p2.y +
    ", rX: " + r.x + ", rY: " + r.y)
    console.log("result is for z1: " + z1 + ", z2: " + z2 + ", z3: " + z3 + ", z4: " + z4)*/
        return (z1 ||
               z2 ||
               z3 ||
               z4) &&
               !(Contains(r.x, r.y, r.x + globalObj.tableLocation.width,
                   r.y + globalObj.tableLocation.height, p1.x, p1.y) ||
                   Contains(r.x, r.y, r.x + globalObj.tableLocation.width,
                       r.y + globalObj.tableLocation.height, p2.x, p2.y));
}

function LineIntersectsLine(l1p1, l1p2, l2p1, l2p2)
{
    var q = (l1p1.y - l2p1.y) * (l2p2.x - l2p1.x) - (l1p1.x - l2p1.x) * (l2p2.y - l2p1.y);
    var d = (l1p2.x - l1p1.x) * (l2p2.y - l2p1.y) - (l1p2.y - l1p1.y) * (l2p2.x - l2p1.x);

    if( d == 0 )
    {
        return false;
    }

    var r = q / d;

    q = (l1p1.y - l2p1.y) * (l1p2.x - l1p1.x) - (l1p1.x - l2p1.x) * (l1p2.y - l1p1.y);
    var s = q / d;

    if( r < 0 || r > 1 || s < 0 || s > 1 )
    {
        return false;
    }

    return true;
}

function Contains(x1, y1, x2, y2, px, py){
    return px >= x1 && px <= x2 && py >= y1 && py <= y2;
}

function onSegment(p, q, r)
{
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
        return true;

    return false;
}

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are colinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p, q, r)
{
    // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
    // for details of below formula.
    v = (q.y - p.y) * (r.x - q.x) -
    (q.x - p.x) * (r.y - q.y);

    if (v == 0) return 0; // colinear

    return (v > 0)? 1: 2; // clock or counterclock wise
}

// The main function that returns true if line segment 'p1q1'
// and 'p2q2' intersect.
function doIntersect(p1, q1, p2, q2)
{
    // Find the four orientations needed for general and
    // special cases
    var o1 = orientation(p1, q1, p2);
    var o2 = orientation(p1, q1, q2);
    var o3 = orientation(p2, q2, p1);
    var o4 = orientation(p2, q2, q1);

    // General case
    if (o1 != o2 && o3 != o4)
        return true;

    // Special Cases
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1
    if (o1 == 0 && onSegment(p1, p2, q1)) return true;

    // p1, q1 and q2 are colinear and q2 lies on segment p1q1
    if (o2 == 0 && onSegment(p1, q2, q1)) return true;

    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
    if (o3 == 0 && onSegment(p2, p1, q2)) return true;

    // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    if (o4 == 0 && onSegment(p2, q1, q2)) return true;

    return false; // Doesn't fall in any of the above cases
}