import "/css/litegraph-editor.css";
import "/css/litegraph.css";

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
    clamp,
};
