/**
 * 四元数工具类
 * */

THREE._Quaternion = function(){

};

THREE._Quaternion.prototype.constructor = THREE._Quaternion;

THREE._Quaternion._new = function () {
    var out = new Float32Array(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

THREE._Quaternion._new_d = function () {
    var out = new Float64Array(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

//clone
THREE._Quaternion._clone = function (v) {
    var out = new Float32Array(4);
    out[0] = v[0];
    out[1] = v[1];
    out[2] = v[2];
    out[3] = v[3];
    return out;
};
THREE._Quaternion._clone_d = function (v) {
    var out = new Float64Array(4);
    out[0] = v[0];
    out[1] = v[1];
    out[2] = v[2];
    out[3] = v[3];
    return out;
};

//create
THREE._Quaternion._create = function (x, y, z, w) {
    var out = new Float32Array(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};
THREE._Quaternion._create_d = function (x, y, z, w) {
    var out = new Float64Array(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

//copy
THREE._Quaternion._copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

//set
THREE._Quaternion._set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

//makeRotate
THREE._Quaternion._makeRotate = function(angle, x, y, z, result) {
    var length = Math.sqrt(x * x + y * y + z * z);
    if (length < 0.00001) {
        return this.init(result);
    }

    var inversenorm = 1.0 / length;
    var coshalfangle = Math.cos(0.5 * angle);
    var sinhalfangle = Math.sin(0.5 * angle);
    var value = sinhalfangle * inversenorm;
    result[0] = x * value;
    result[1] = y * value;
    result[2] = z * value;
    result[3] = coshalfangle;
    return result;
};

//multiply
//result不能用a,b复用
THREE._Quaternion._multiply = function(a, b, result) {
    // result[0] = a[0] * b[3] - a[1] * b[2] + a[2] * b[1] + a[3] * b[0];
    // result[1] = a[0] * b[2] + a[1] * b[3] - a[2] * b[0] + a[3] * b[1];
    // result[2] = -a[0] * b[1] + a[1] * b[0] + a[2] * b[3] + a[3] * b[2];
    // result[3] = -a[0] * b[0] - a[1] * b[1] - a[2] * b[2] + a[3] * b[3];

    result[0] = a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0];
    result[1] = -a[0] * b[2] + a[1] * b[3] + a[2] * b[0] + a[3] * b[1];
    result[2] = a[0] * b[1] - a[1] * b[0] + a[2] * b[3] + a[3] * b[2];
    result[3] = -a[0] * b[0] - a[1] * b[1] - a[2] * b[2] + a[3] * b[3];
    return result;
};
THREE._Quaternion._mul = THREE._Quaternion._multiply;

//transformVec3 q-quat a-vec3 result-vec3
THREE._Quaternion._transformVec3 = function(q, a, result) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var qx = q[0];
    var qy = q[1];
    var qz = q[2];
    var qw = q[3];
    // calculate quat * vec
    var ix = qw * x + qy * z - qz * y;
    var iy = qw * y + qz * x - qx * z;
    var iz = qw * z + qx * y - qy * x;
    var iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    result[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    result[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    result[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return result;
};

//从四元数里获取转轴转角
THREE._Quaternion._toAxisAngle = function(q){
    var axis = new Float32Array(3);
    var angle = 2 * Math.acos(q[3]);
    axis[0] = q[0] / Math.sqrt(1-q[3]*q[3]);
    axis[1] = q[1] / Math.sqrt(1-q[3]*q[3]);
    axis[2] = q[2] / Math.sqrt(1-q[3]*q[3]);
    return {axis:axis, angle:angle};
};

//四元数线性插值
THREE._Quaternion._interpolate = function(q1, q2, t){
    var a = new Float32Array(4);
    var b = new Float32Array(4);
    a[0] = q1[0];
    a[1] = q1[1];
    a[2] = q1[2];
    a[3] = q1[3];
    b[0] = q2[0];
    b[1] = q2[1];
    b[2] = q2[2];
    b[3] = q2[3];
    var v = a[0]*b[0] + a[1]*b[1] + a[2]*b[2] + a[3]*b[3];
    var phi = Math.acos(v);
    if(phi > 0.01){
        a[0] = a[0]*(Math.sin(phi*(1-t))/Math.sin(phi));
        a[1] = a[1]*(Math.sin(phi*(1-t))/Math.sin(phi));
        a[2] = a[2]*(Math.sin(phi*(1-t))/Math.sin(phi));
        a[3] = a[3]*(Math.sin(phi*(1-t))/Math.sin(phi));
        b[0] = b[0]*(Math.sin(phi*t)/Math.sin(phi));
        b[1] = b[1]*(Math.sin(phi*t)/Math.sin(phi));
        b[2] = b[2]*(Math.sin(phi*t)/Math.sin(phi));
        b[3] = b[3]*(Math.sin(phi*t)/Math.sin(phi));
    }
    var c = new Float32Array(4);
    c[0] = a[0] + b[0];
    c[1] = a[1] + b[1];
    c[2] = a[2] + b[2];
    c[3] = a[3] + b[3];
    if(v<-0.999){
        var d = t*(1-t);
        if(c[0] === 0){
            c[0] += d;
        }else{
            c[1] += d;
        }
    }
    var len = c[0] * c[0] + c[1] * c[1] + c[2] * c[2] + c[3] * c[3];
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        c[0] = c[0] * len;
        c[1] = c[1] * len;
        c[2] = c[2] * len;
        c[3] = c[3] * len;
    }
    return c;
};