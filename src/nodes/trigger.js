/**
 * addProperty(name: string, default_value: any, type: string, extra_info?: object | undefined)
 * 속성을 추가, 접근 시 this[프로퍼티명]
 */
import { LiteGraph, LGraphNode } from "@/litegraph.js";

// 노드 공통 클래스
class RootNode extends LGraphNode {
    constructor() {
        super();

        this.mode = 0; // 실행을 기준으로 맞춰야 함. 읽기 일때는 모든 노드 순환하면서 모드 바꿔주면 됨!

        this.addProperty("status", 0, "number");
        this.addProperty("message", "", "string");
    }
}

class ManualTrigger extends RootNode {
    constructor() {
        super();
        this.title = "수동 시작";
    }

    onExecute() {}
}

LiteGraph.registerNodeType("trigger/manualTrigger", ManualTrigger);
