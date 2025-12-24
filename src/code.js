import { Editor } from "./litegraph-editor.js";
import { LiteGraph } from "./litegraph.js";

(async function () {
    let webgl_canvas = null;

    LiteGraph.node_images_path = "../nodes_data/";

    const editor = new Editor("main", { miniwindow: false });
    await editor.init();
    const graph = editor.graph;

    updateEditorHiPPICanvas();
    window.addEventListener("resize", function () {
        editor.graphcanvas.resize();
        updateEditorHiPPICanvas();
    });
    window.addEventListener(
        "keydown",
        editor.graphcanvas.processKey.bind(editor.graphcanvas)
    );
    window.onbeforeunload = function () {
        var data = JSON.stringify(graph.serialize());
        localStorage.setItem("litegraphg demo backup", data);
    };

    function updateEditorHiPPICanvas() {
        const ratio = window.devicePixelRatio;
        if (ratio == 1) {
            return;
        }
        const rect = editor.canvas.parentNode.getBoundingClientRect();
        const { width, height } = rect;
        editor.canvas.width = width * ratio;
        editor.canvas.height = height * ratio;
        editor.canvas.style.width = width + "px";
        editor.canvas.style.height = height + "px";
        editor.canvas.getContext("2d").scale(ratio, ratio);
        return editor.canvas;
    }

    //enable scripting
    LiteGraph.allow_scripts = true;

    //test
    //editor.graphcanvas.viewport = [200,200,400,400];

    //create scene selector
    var elem = document.createElement("span");
    elem.id = "LGEditorTopBarSelector";
    elem.className = "selector";
    elem.innerHTML = "";
    elem.innerHTML +=
        "Demo <button class='btn' id='save'>Save</button><button class='btn' id='load'>Load</button><button class='btn' id='download'>Download</button> | <button class='btn' id='webgl'>WebGL</button> <button class='btn' id='multiview'>Multiview</button>";
    editor.tools.appendChild(elem);


    elem.querySelector("#save").addEventListener("click", function () {
        console.log("saved");
        localStorage.setItem(
            "graphdemo_save",
            JSON.stringify(graph.serialize())
        );
    });

    elem.querySelector("#load").addEventListener("click", function () {
        var data = localStorage.getItem("graphdemo_save");
        if (data) graph.configure(JSON.parse(data));
        console.log("loaded");
    });

    elem.querySelector("#download").addEventListener("click", function () {
        var data = JSON.stringify(graph.serialize());
        var file = new Blob([data]);
        var url = URL.createObjectURL(file);
        var element = document.createElement("a");
        element.setAttribute("href", url);
        element.setAttribute("download", "graph.JSON");
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        setTimeout(function () {
            URL.revokeObjectURL(url);
        }, 1000 * 60); //wait one minute to revoke url
    });

    elem.querySelector("#webgl").addEventListener("click", enableWebGL);
    elem.querySelector("#multiview").addEventListener("click", function () {
        const target = elem.querySelector("#multiview");
        const check = target.getAttribute("data-clicked");

        if (check === "true") {
            editor.subMultiview();
            target.removeAttribute("data-clicked");
        } else {
            editor.addMultiview();
            target.setAttribute("data-clicked", true);
        }
    });


    //allows to use the WebGL nodes like textures
    function enableWebGL() {
        if (webgl_canvas) {
            webgl_canvas.style.display =
                webgl_canvas.style.display == "none" ? "block" : "none";
            return;
        }

        // var libs = [
        //     // "js/libs/gl-matrix-min.js",
        //     // "js/libs/litegl.js",

        //     "../src/nodes/gltextures.js",
        //     "../src/nodes/glfx.js",
        //     "../src/nodes/glshaders.js",
        //     "../src/nodes/geometry.js",
        // ];

        // function fetchJS() {
        //     if (libs.length == 0) return on_ready();

        //     var script = null;
        //     script = document.createElement("script");
        //     script.onload = fetchJS;
        //     script.src = libs.shift();
        //     document.head.appendChild(script);
        // }

        // fetchJS();

        on_ready();
        function on_ready() {
            if (!window.GL) return;
            webgl_canvas = document.createElement("canvas");
            webgl_canvas.width = 400;
            webgl_canvas.height = 300;
            webgl_canvas.style.position = "absolute";
            webgl_canvas.style.top = "0px";
            webgl_canvas.style.right = "0px";
            webgl_canvas.style.border = "1px solid #AAA";

            webgl_canvas.addEventListener("click", function () {
                var rect = webgl_canvas.parentNode.getBoundingClientRect();
                if (webgl_canvas.width != rect.width) {
                    webgl_canvas.width = rect.width;
                    webgl_canvas.height = rect.height;
                } else {
                    webgl_canvas.width = 400;
                    webgl_canvas.height = 300;
                }
            });

            var parent = document.querySelector(".editor-area");
            parent.appendChild(webgl_canvas);
            var gl = GL.create({ canvas: webgl_canvas });
            if (!gl) return;

            editor.graph.onBeforeStep = ondraw;

            console.log("webgl ready");
            function ondraw() {
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            }
        }
    }

    // Tests
    // CopyPasteWithConnectionToUnselectedOutputTest();
    // demo();
})();
