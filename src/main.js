import "/css/litegraph-editor.css";
import "/css/litegraph.css";

import {
    glMatrix,
    mat2,
    mat2d,
    mat3,
    mat4,
    quat,
    quat2,
    vec2,
    vec3,
    vec4,
} from "gl-matrix/esm/index.js";
import { GL, global } from "./litegl.js";
import { enableWebGLCanvas } from "./webglCanvas.js";

import {
    LiteGraph,
    ContextMenu,
    DragAndScale,
    LGraph,
    LGraphCanvas,
    LGraphGroup,
    LGraphNode,
    LLink,
    clamp,
} from "./litegraph.js";

import { Editor } from "./litegraph-editor.js";

if (import.meta.env.MODE === "development") {
    import("./code.js");
    import("./defaults.js");
    import("./demos.js");
}

// nodes
import "./nodes/trigger.js";
import "./nodes/logic.js";

export {
    LiteGraph,
    ContextMenu,
    DragAndScale,
    LGraph,
    LGraphCanvas,
    LGraphGroup,
    LGraphNode,
    LLink,
    Editor,
    enableWebGLCanvas,
    clamp,
    glMatrix,
    mat2,
    mat2d,
    mat3,
    mat4,
    quat,
    quat2,
    vec2,
    vec3,
    vec4,
    GL,
    global,
};
