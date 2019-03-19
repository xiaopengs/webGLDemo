// index.js

// 顶点着色器代码
var VSHADER_SOURCE =`
    attribute vec4 a_Position;
    varying vec2 uv;

    void main() {
        gl_Position = vec4(vec2(a_Position), 0.0, 1.0);
        uv = vec2(0.5, 0.5) * (vec2(a_Position) + vec2(1.0, 1.0));
    }
`
// 片元着色器代码
var FSHADER_SOURCE =`
    precision mediump float;
    varying vec2 uv;

    void main() {
        gl_FragColor = vec4(0.,1,0.,1.);
    }
`;


function main() {
    var canvas = document.getElementById('album');
    // 这里的宽高按实际情况设置
    canvas.width = 375;
    canvas.height = 667;

    // 获取 webgl 上下文（getWebGLContext 是前面引入的工具库预设的）
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // 初始化着色器（initShaders 是工具库定义的函数，传入上下文，顶点/片元着色器代码）
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // 设置顶点数据（initVertexBuffers 函数详见下面）
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
    }

    // 清空画布
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制顶点(三个点决定一个矩形，四个点可以绘制两个三角形，组成为矩形，也就是我们的画布)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

// 初始化顶点缓冲区
function initVertexBuffers(gl) {
    // 顶点坐标（画布的四个点）
    var verticesTexCoords = new Float32Array([
        1.0, -1.0,
        1.0, 1.0,
        -1.0, 1.0,
        -1.0, -1.0
    ]);

    // 顶点数量（4个点决定一个矩形）
    var n = 4;

    // 创建顶点缓冲区
    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // 绑定缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    // 获取数组每个元素的大小
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    // 获取 a_Position 的存储位置并设置缓冲区
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 2, 0);
    gl.enableVertexAttribArray(a_Position);

    return n;
}
