/**
 * Horizontal Overlay Node Example
 * Demonstrates HTML Overlay with horizontal layout (slots on top/bottom)
 */

import { LGraphNode, LiteGraph } from "@/litegraph.js";

// Horizontal Button Trigger Node
function HorizontalButtonNode() {
    this.properties = {
        text: "Click Me",
        count: 0
    };

    // horizontal: true makes slots appear on top/bottom instead of left/right
    this.horizontal = true;

    this.addInput("Input", LiteGraph.EVENT);
    this.addOutput("Output", LiteGraph.EVENT);

    this.size = [200, 120];
}

HorizontalButtonNode.title = "Horizontal Button";
HorizontalButtonNode.desc = "Horizontal node with button overlay";

// Proper inheritance from LGraphNode
HorizontalButtonNode.prototype = Object.create(LGraphNode.prototype);
HorizontalButtonNode.prototype.constructor = HorizontalButtonNode;

HorizontalButtonNode.prototype.createPropertyOverlay = function () {
    const container = document.createElement("div");
    container.style.padding = "15px";
    container.style.backgroundColor = "#353535";
    container.style.borderRadius = "4px";
    container.style.boxSizing = "border-box";
    container.style.color = "#fff";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";

    // Text input
    const textLabel = document.createElement("div");
    textLabel.textContent = "Button Text:";
    textLabel.style.fontSize = "12px";
    textLabel.style.marginBottom = "4px";

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.setAttribute("data-property", "text");
    textInput.value = this.properties.text;
    textInput.style.width = "100%";
    textInput.style.padding = "6px";
    textInput.style.backgroundColor = "#333";
    textInput.style.border = "1px solid #666";
    textInput.style.color = "#fff";
    textInput.style.borderRadius = "3px";

    // Count display
    const countLabel = document.createElement("div");
    countLabel.textContent = `Click Count: ${this.properties.count}`;
    countLabel.style.fontSize = "14px";
    countLabel.style.fontWeight = "bold";
    countLabel.style.textAlign = "center";
    countLabel.style.padding = "8px";
    countLabel.style.backgroundColor = "#444";
    countLabel.style.borderRadius = "3px";
    countLabel.id = "count-display";

    // Trigger button
    const triggerBtn = document.createElement("button");
    triggerBtn.textContent = this.properties.text || "Trigger";
    triggerBtn.style.padding = "12px";
    triggerBtn.style.backgroundColor = "#4CAF50";
    triggerBtn.style.color = "#fff";
    triggerBtn.style.border = "none";
    triggerBtn.style.borderRadius = "4px";
    triggerBtn.style.cursor = "pointer";
    triggerBtn.style.fontSize = "14px";
    triggerBtn.style.fontWeight = "bold";
    triggerBtn.style.transition = "background-color 0.2s";

    triggerBtn.addEventListener("mouseenter", function () {
        triggerBtn.style.backgroundColor = "#45a049";
    });

    triggerBtn.addEventListener("mouseleave", function () {
        triggerBtn.style.backgroundColor = "#4CAF50";
    });

    // Event listeners
    const self = this;

    textInput.addEventListener("input", function (e) {
        self.updatePropertyFromOverlay("text", e.target.value);
        triggerBtn.textContent = e.target.value || "Trigger";
    });

    triggerBtn.addEventListener("click", function () {
        // Increment count
        self.properties.count++;
        countLabel.textContent = `Click Count: ${self.properties.count}`;

        // Trigger output event
        self.triggerSlot(0);

        // Visual feedback
        triggerBtn.style.backgroundColor = "#2196F3";
        setTimeout(() => {
            triggerBtn.style.backgroundColor = "#4CAF50";
        }, 200);
    });

    // Reset button
    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset Count";
    resetBtn.style.padding = "8px";
    resetBtn.style.backgroundColor = "#f44336";
    resetBtn.style.color = "#fff";
    resetBtn.style.border = "none";
    resetBtn.style.borderRadius = "3px";
    resetBtn.style.cursor = "pointer";
    resetBtn.style.fontSize = "12px";

    resetBtn.addEventListener("click", function () {
        self.properties.count = 0;
        countLabel.textContent = `Click Count: 0`;
    });

    // Assemble
    container.appendChild(textLabel);
    container.appendChild(textInput);
    container.appendChild(countLabel);
    container.appendChild(triggerBtn);
    container.appendChild(resetBtn);

    return container;
};

HorizontalButtonNode.prototype.onExecute = function () {
    // This node is event-driven, no continuous execution needed
};

HorizontalButtonNode.prototype.onPropertyChanged = function (name, value) {
    console.log(`Property ${name} changed to:`, value);
    this.updateOverlayFromProperties();
};

LiteGraph.registerNodeType("examples/horizontal_button", HorizontalButtonNode);


// Horizontal Slider Control Node
function HorizontalSliderNode() {
    this.properties = {
        value: 50,
        min: 0,
        max: 100,
        step: 1
    };

    this.horizontal = true;

    this.addOutput("value", "number");

    this.size = [220, 140];
}

HorizontalSliderNode.title = "Horizontal Slider";
HorizontalSliderNode.desc = "Horizontal node with slider control";

HorizontalSliderNode.prototype = Object.create(LGraphNode.prototype);
HorizontalSliderNode.prototype.constructor = HorizontalSliderNode;

HorizontalSliderNode.prototype.createPropertyOverlay = function () {
    const container = document.createElement("div");
    container.style.padding = "15px";
    container.style.backgroundColor = "#353535";
    container.style.borderRadius = "4px";
    container.style.boxSizing = "border-box";
    container.style.color = "#fff";

    // Value display
    const valueDisplay = document.createElement("div");
    valueDisplay.textContent = `Value: ${this.properties.value}`;
    valueDisplay.style.fontSize = "18px";
    valueDisplay.style.fontWeight = "bold";
    valueDisplay.style.textAlign = "center";
    valueDisplay.style.marginBottom = "15px";
    valueDisplay.style.color = "#4CAF50";

    // Slider
    const slider = document.createElement("input");
    slider.type = "range";
    slider.setAttribute("data-property", "value");
    slider.min = this.properties.min;
    slider.max = this.properties.max;
    slider.step = this.properties.step;
    slider.value = this.properties.value;
    slider.style.width = "100%";
    slider.style.marginBottom = "15px";

    // Min/Max labels
    const minMaxContainer = document.createElement("div");
    minMaxContainer.style.display = "flex";
    minMaxContainer.style.justifyContent = "space-between";
    minMaxContainer.style.fontSize = "11px";
    minMaxContainer.style.color = "#999";
    minMaxContainer.style.marginBottom = "10px";

    const minLabel = document.createElement("span");
    minLabel.textContent = `Min: ${this.properties.min}`;

    const maxLabel = document.createElement("span");
    maxLabel.textContent = `Max: ${this.properties.max}`;

    minMaxContainer.appendChild(minLabel);
    minMaxContainer.appendChild(maxLabel);

    // Event listeners
    const self = this;

    slider.addEventListener("input", function (e) {
        const value = parseFloat(e.target.value);
        self.updatePropertyFromOverlay("value", value);
        valueDisplay.textContent = `Value: ${value}`;
    });

    // Assemble
    container.appendChild(valueDisplay);
    container.appendChild(slider);
    container.appendChild(minMaxContainer);

    return container;
};

HorizontalSliderNode.prototype.onExecute = function () {
    this.setOutputData(0, this.properties.value);
};

HorizontalSliderNode.prototype.onPropertyChanged = function (name, value) {
    this.updateOverlayFromProperties();
};

LiteGraph.registerNodeType("examples/horizontal_slider", HorizontalSliderNode);
