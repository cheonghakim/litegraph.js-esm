# litegraph.js

A powerful library in JavaScript to create node-based graphs in the browser, similar to Unreal Blueprints or PureData. Nodes can be programmed easily and it includes an editor to construct and test the graphs.

It can be integrated easily in any existing web applications and graphs can be run without the need of the editor.

![Node Graph](imgs/node_graph_example.png "LiteGraph")

## Features

- **Canvas2D Rendering** - Optimized rendering with zoom/pan support
- **Easy-to-use Editor** - Searchbox, keyboard shortcuts, multiple selection, context menu
- **High Performance** - Optimized to support hundreds of nodes per graph
- **Customizable Theme** - Colors, shapes, background all customizable
- **Flexible Callbacks** - Personalize every action/drawing/event of nodes
- **Subgraphs** - Nodes that contain graphs themselves
- **Live Mode** - Hides the graph but calls nodes to render custom UIs
- **NodeJS Support** - Graphs can be executed server-side
- **Highly Customizable Nodes** - Color, shape, slots, widgets, custom rendering
- **Easy Integration** - Single file, minimal dependencies
- **TypeScript Support** - Full TypeScript definitions included
- **HTML Overlays** - Rich property editors with standard HTML form elements

## Installation

### Using npm

```bash
npm install litegraph.js
```

### Using yarn

```bash
yarn add litegraph.js
```

### Manual Installation

Download the built files from the `dist` folder:
- `dist/litegraph-bundle.js` - ES module format
- `dist/litegraph-bundle.umd.js` - UMD format (browser global)
- `dist/litegraph-bundle.cjs` - CommonJS format (Node.js)
- `dist/litegraph.js.css` - Required CSS styles

Also include the CSS files from the `css` folder:
- `css/litegraph.css` - Core styles
- `css/litegraph-editor.css` - Editor styles
- `css/overlay.css` - HTML overlay styles (optional)

## Quick Start

### Basic Example

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="css/litegraph.css">
    <script type="module">
        import { LiteGraph, LGraph, LGraphCanvas } from './dist/litegraph-bundle.js';
        
        // Create graph
        const graph = new LGraph();
        
        // Create canvas
        const canvas = new LGraphCanvas("#mycanvas", graph);
        
        // Create nodes
        const nodeConst = LiteGraph.createNode("basic/const");
        nodeConst.pos = [200, 200];
        graph.add(nodeConst);
        nodeConst.setValue(4.5);
        
        const nodeWatch = LiteGraph.createNode("basic/watch");
        nodeWatch.pos = [700, 200];
        graph.add(nodeWatch);
        
        // Connect nodes
        nodeConst.connect(0, nodeWatch, 0);
        
        // Start execution
        graph.start();
    </script>
</head>
<body>
    <canvas id="mycanvas" width="1024" height="720"></canvas>
</body>
</html>
```

### Using UMD (Browser Global)

```html
<script src="dist/litegraph-bundle.umd.js"></script>
<script>
    const { LiteGraph, LGraph, LGraphCanvas } = window.LiteGraph;
    // Use as shown above
</script>
```

## Creating Custom Nodes

### Simple Node Example

```javascript
// Node constructor
function MyAddNode() {
    this.addInput("A", "number");
    this.addInput("B", "number");
    this.addOutput("A+B", "number");
    this.properties = { precision: 1 };
}

// Display name
MyAddNode.title = "Sum";

// Execution logic
MyAddNode.prototype.onExecute = function() {
    let A = this.getInputData(0);
    if (A === undefined) A = 0;
    let B = this.getInputData(1);
    if (B === undefined) B = 0;
    this.setOutputData(0, A + B);
}

// Register the node type
LiteGraph.registerNodeType("basic/sum", MyAddNode);
```

### Wrapping Functions

```javascript
function sum(a, b) {
    return a + b;
}

LiteGraph.wrapFunctionAsNode("math/sum", sum, ["Number", "Number"], "Number");
```

## HTML Overlay Property Editors

LiteGraph supports custom HTML overlays for nodes, allowing you to create rich property editors with standard HTML form elements. This is useful for creating complex UIs that go beyond simple widget controls.

### Creating a Node with HTML Overlay

To add an HTML overlay to your node, implement the `createPropertyOverlay()` method:

```javascript
function MyCustomNode() {
    this.properties = {
        text: "Hello",
        value: 100
    };
    this.size = [200, 100];
}

MyCustomNode.title = "Custom Node";

// Inherit from LGraphNode
MyCustomNode.prototype = Object.create(LGraphNode.prototype);
MyCustomNode.prototype.constructor = MyCustomNode;

// Create the HTML overlay
MyCustomNode.prototype.createPropertyOverlay = function() {
    const container = document.createElement("div");
    container.style.padding = "10px";
    container.style.backgroundColor = "rgba(40, 40, 40, 0.95)";
    container.style.border = "1px solid #555";
    container.style.borderRadius = "4px";
    container.style.color = "#fff";

    // Add form elements
    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.value = this.properties.text;
    textInput.style.width = "100%";
    textInput.style.padding = "4px";
    
    // Update node properties when input changes
    const self = this;
    textInput.addEventListener("input", function(e) {
        self.updatePropertyFromOverlay("text", e.target.value);
    });

    container.appendChild(textInput);
    return container;
};

// Handle property changes
MyCustomNode.prototype.onPropertyChanged = function(name, value) {
    console.log(`Property ${name} changed to:`, value);
    this.updateOverlayFromProperties();
};

LiteGraph.registerNodeType("custom/my_node", MyCustomNode);
```

### Enabling Overlays

After creating nodes with overlays, ensure they are created and positioned:

```javascript
const graph = new LGraph();
const canvas = new LGraphCanvas("#mycanvas", graph);

// Create your node
const node = LiteGraph.createNode("custom/my_node");
node.pos = [100, 100];
graph.add(node);

// Enable the overlay
canvas.ensureNodeOverlay(node);
```

### Key Features

- **Positioning**: Overlays are automatically positioned below the input/output slots
- **Scaling**: Overlays scale with the canvas zoom level
- **Auto-sizing**: Nodes automatically adjust their height to fit the overlay content
- **Interactive**: Full support for HTML form elements (inputs, checkboxes, sliders, color pickers, etc.)
- **Synchronized**: Properties sync bidirectionally between node and overlay UI

### CSS Styling

Include the overlay CSS for proper styling:

```html
<link rel="stylesheet" href="css/litegraph.css">
<link rel="stylesheet" href="css/overlay.css">
```

For a complete example, see `editor/overlay_demo.html` in the repository.

## Development

### Setup

```bash
# Install dependencies
npm install
# or
yarn install
```

### Running Development Server

```bash
npm run dev
# or
yarn dev
```

The development server will start at `http://localhost:8084`

### Building

```bash
# Production build
npm run build
# or
yarn build

# Development build
npm run build-dev
# or
yarn build-dev
```

Build outputs will be generated in the `dist` folder:
- `litegraph-bundle.js` - ES module (for modern bundlers)
- `litegraph-bundle.umd.js` - UMD format (for browsers)
- `litegraph-bundle.cjs` - CommonJS (for Node.js)
- `litegraph.js.css` - Bundled CSS

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run prettier

# Run tests
npm test
```

## Demos and Examples

### Main Editor
Open `index.html` in your browser or visit the development server to access the full editor with various example graphs.

### HTML Overlay Demo
See `editor/overlay_demo.html` for examples of HTML overlay property editors with:
- Text Editor Node - Simple text and font size inputs
- Color Picker Node - Color picker and opacity slider
- Form Editor Node - Complex form with multiple field types

### Additional Examples
Check the `editor/examples/` folder for more demonstrations.

## Server-Side Usage (Node.js)

LiteGraph can run server-side using Node.js, though some nodes (audio, graphics, input) won't work:

```javascript
const { LiteGraph, LGraph } = require("./dist/litegraph-bundle.cjs");

const graph = new LGraph();

const nodeTime = LiteGraph.createNode("basic/time");
graph.add(nodeTime);

const nodeConsole = LiteGraph.createNode("basic/console");
nodeConsole.mode = LiteGraph.ALWAYS;
graph.add(nodeConsole);

nodeTime.connect(0, nodeConsole, 1);

graph.start();
```

## Project Structure

```
litegraph.js/
├── src/              # Source files
│   ├── litegraph.js  # Main library file
│   ├── nodes/        # Built-in node definitions
│   └── main.js       # Entry point
├── css/              # Stylesheets
│   ├── litegraph.css
│   ├── litegraph-editor.css
│   └── overlay.css
├── dist/             # Built files (generated)
├── editor/           # Editor demos and examples
└── vite.config.js    # Build configuration
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- For older browsers, use the UMD build with a polyfill

## TypeScript

TypeScript definitions are included in `src/litegraph.d.ts`.

```typescript
import { LiteGraph, LGraph, LGraphCanvas, LGraphNode } from 'litegraph.js';

const graph: LGraph = new LGraph();
const canvas: LGraphCanvas = new LGraphCanvas("#mycanvas", graph);
```

## Projects Using LiteGraph

### [ComfyUI](https://github.com/comfyanonymous/ComfyUI)
A powerful node-based UI for Stable Diffusion

### [WebGLStudio](http://webglstudio.org)
A full 3D graphics editor in the browser

### [MOI Elephant](http://moiscript.weebly.com/elephant-systegraveme-nodal.html)
Node-based modeling system

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Feedback

For bugs, feature requests, or questions, please open an issue on [GitHub](https://github.com/jagenjo/litegraph.js/issues).

## Credits

Original author: Javi Agenjo (javi.agenjo@gmail.com)

Contributors: atlasan, kriffe, rappestad, InventivetalentDev, NateScarlet, coderofsalvation, ilyabesk, gausszhou
