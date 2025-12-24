/**
 * Example nodes demonstrating HTML Overlay Property Editor functionality
 * These nodes show how to create custom UI overlays for editing node properties
 */

import { LGraphNode, LiteGraph } from "@/litegraph.js";

// Simple Text Editor Node
function SimpleTextEditorNode() {
    this.properties = {
        text: "Hello World",
        fontSize: 14
    };

    this.size = [200, 100];
}

SimpleTextEditorNode.title = "Text Editor";
SimpleTextEditorNode.desc = "Simple text editor with overlay";

// Proper inheritance from LGraphNode
SimpleTextEditorNode.prototype = Object.create(LGraphNode.prototype);
SimpleTextEditorNode.prototype.constructor = SimpleTextEditorNode;

SimpleTextEditorNode.prototype.createPropertyOverlay = function () {
    const container = document.createElement("div");
    container.style.padding = "10px";
    container.style.backgroundColor = "#353535";
    // container.style.border = "1px solid #555";
    container.style.borderRadius = "4px";
    container.style.boxSizing = "border-box";
    container.style.color = "#fff";

    // Text input
    const textLabel = document.createElement("div");
    textLabel.textContent = "Text:";
    textLabel.style.marginBottom = "4px";
    textLabel.style.fontSize = "12px";

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.setAttribute("data-property", "text");
    textInput.value = this.properties.text;
    textInput.style.width = "100%";
    textInput.style.padding = "4px";
    textInput.style.marginBottom = "8px";
    textInput.style.backgroundColor = "#333";
    textInput.style.border = "1px solid #666";
    textInput.style.color = "#fff";
    textInput.style.borderRadius = "3px";

    // Font size input
    const sizeLabel = document.createElement("div");
    sizeLabel.textContent = "Font Size:";
    sizeLabel.style.marginBottom = "4px";
    sizeLabel.style.fontSize = "12px";

    const sizeInput = document.createElement("input");
    sizeInput.type = "number";
    sizeInput.setAttribute("data-property", "fontSize");
    sizeInput.value = this.properties.fontSize;
    sizeInput.min = "8";
    sizeInput.max = "48";
    sizeInput.style.width = "100%";
    sizeInput.style.padding = "4px";
    sizeInput.style.backgroundColor = "#333";
    sizeInput.style.border = "1px solid #666";
    sizeInput.style.color = "#fff";
    sizeInput.style.borderRadius = "3px";

    // Event listeners
    const self = this;
    textInput.addEventListener("input", function (e) {
        self.updatePropertyFromOverlay("text", e.target.value);
    });

    sizeInput.addEventListener("input", function (e) {
        self.updatePropertyFromOverlay("fontSize", parseInt(e.target.value));
    });

    // Assemble
    container.appendChild(textLabel);
    container.appendChild(textInput);
    container.appendChild(sizeLabel);
    container.appendChild(sizeInput);

    return container;
};

SimpleTextEditorNode.prototype.onPropertyChanged = function (name, value) {
    console.log(`Property ${name} changed to:`, value);
    // Update overlay UI
    this.updateOverlayFromProperties();
};

LiteGraph.registerNodeType("examples/simple_text_editor", SimpleTextEditorNode);


// Color Picker Node
function ColorPickerNode() {
    this.properties = {
        color: "#ff0000",
        opacity: 1.0
    };

    this.size = [200, 120];
}

ColorPickerNode.title = "Color Picker";
ColorPickerNode.desc = "Color picker with opacity slider";

// Proper inheritance from LGraphNode
ColorPickerNode.prototype = Object.create(LGraphNode.prototype);
ColorPickerNode.prototype.constructor = ColorPickerNode;

ColorPickerNode.prototype.createPropertyOverlay = function () {
    const container = document.createElement("div");
    container.style.padding = "10px";
    container.style.backgroundColor = "#353535";
    // container.style.border = "1px solid #555";
    container.style.borderRadius = "4px";
    container.style.boxSizing = "border-box";
    container.style.color = "#fff";

    // Color picker
    const colorLabel = document.createElement("div");
    colorLabel.textContent = "Color:";
    colorLabel.style.marginBottom = "4px";
    colorLabel.style.fontSize = "12px";

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.setAttribute("data-property", "color");
    colorInput.value = this.properties.color;
    colorInput.style.width = "100%";
    colorInput.style.height = "30px";
    colorInput.style.marginBottom = "8px";
    colorInput.style.border = "1px solid #666";
    colorInput.style.borderRadius = "3px";
    colorInput.style.cursor = "pointer";

    // Opacity slider
    const opacityLabel = document.createElement("div");
    opacityLabel.textContent = `Opacity: ${(this.properties.opacity * 100).toFixed(0)}%`;
    opacityLabel.style.marginBottom = "4px";
    opacityLabel.style.fontSize = "12px";

    const opacityInput = document.createElement("input");
    opacityInput.type = "range";
    opacityInput.setAttribute("data-property", "opacity");
    opacityInput.min = "0";
    opacityInput.max = "1";
    opacityInput.step = "0.01";
    opacityInput.value = this.properties.opacity;
    opacityInput.style.width = "100%";

    // Event listeners
    const self = this;
    colorInput.addEventListener("input", function (e) {
        self.updatePropertyFromOverlay("color", e.target.value);
    });

    opacityInput.addEventListener("input", function (e) {
        const value = parseFloat(e.target.value);
        self.updatePropertyFromOverlay("opacity", value);
        opacityLabel.textContent = `Opacity: ${(value * 100).toFixed(0)}%`;
    });

    // Assemble
    container.appendChild(colorLabel);
    container.appendChild(colorInput);
    container.appendChild(opacityLabel);
    container.appendChild(opacityInput);

    return container;
};

ColorPickerNode.prototype.onPropertyChanged = function (name, value) {
    this.updateOverlayFromProperties();
};

LiteGraph.registerNodeType("examples/color_picker", ColorPickerNode);


// Form Editor Node
function FormEditorNode() {
    this.properties = {
        name: "",
        email: "",
        age: 0,
        subscribe: false
    };

    this.size = [220, 180];
}

FormEditorNode.title = "Form Editor";
FormEditorNode.desc = "Complex form with multiple input types";

// Proper inheritance from LGraphNode
FormEditorNode.prototype = Object.create(LGraphNode.prototype);
FormEditorNode.prototype.constructor = FormEditorNode;

FormEditorNode.prototype.createPropertyOverlay = function () {
    const container = document.createElement("div");
    container.style.padding = "10px";
    container.style.backgroundColor = "#353535";
    // container.style.border = "1px solid #555";
    container.style.borderRadius = "4px";
    container.style.boxSizing = "border-box";
    container.style.color = "#fff";
    container.style.fontSize = "12px";

    const self = this;

    function createField(label, type, property, options = {}) {
        const fieldContainer = document.createElement("div");
        fieldContainer.style.marginBottom = "8px";

        const labelEl = document.createElement("label");
        labelEl.textContent = label;
        labelEl.style.display = "block";
        labelEl.style.marginBottom = "2px";

        const input = document.createElement("input");
        input.type = type;
        input.setAttribute("data-property", property);

        if (type === "checkbox") {
            input.checked = self.properties[property];
            input.style.marginLeft = "4px";
            labelEl.style.display = "inline";
            labelEl.style.cursor = "pointer";

            input.addEventListener("change", function (e) {
                self.updatePropertyFromOverlay(property, e.target.checked);
            });

            fieldContainer.appendChild(input);
            fieldContainer.appendChild(labelEl);
        } else {
            input.value = self.properties[property];
            input.style.width = "100%";
            input.style.padding = "4px";
            input.style.backgroundColor = "#333";
            input.style.border = "1px solid #666";
            input.style.color = "#fff";
            input.style.borderRadius = "3px";

            if (options.min !== undefined) input.min = options.min;
            if (options.max !== undefined) input.max = options.max;

            input.addEventListener("input", function (e) {
                let value = e.target.value;
                if (type === "number") value = parseInt(value) || 0;
                self.updatePropertyFromOverlay(property, value);
            });

            fieldContainer.appendChild(labelEl);
            fieldContainer.appendChild(input);
        }

        return fieldContainer;
    }

    container.appendChild(createField("Name:", "text", "name"));
    container.appendChild(createField("Email:", "email", "email"));
    container.appendChild(createField("Age:", "number", "age", { min: 0, max: 120 }));
    container.appendChild(createField("Subscribe to newsletter", "checkbox", "subscribe"));

    return container;
};

FormEditorNode.prototype.onPropertyChanged = function (name, value) {
    console.log(`Form property ${name} changed to:`, value);
    this.updateOverlayFromProperties();
};

LiteGraph.registerNodeType("examples/form_editor", FormEditorNode);
