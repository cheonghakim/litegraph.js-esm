"use strict";

// Canvas2DtoWebGL: https://github.com/jagenjo/Canvas2DtoWebGL

//replaces the Canvas2D functions by WebGL functions, the behaviour is not 100% the same but it kind of works in many cases
//not all functions have been implemented

const GL = window.GL;
if (typeof GL == "undefined")
    throw "litegl.js must be included to use enableWebGLCanvas";

export function enableWebGLCanvas(canvas, options) {
    var gl;
    let MAX_IN_PAGE = 0;
    options = options || {};

    // Detect if canvas is WebGL enabled and get context if possible
    if (!canvas.is_webgl) {
        options.canvas = canvas;
        options.alpha = true;
        options.stencil = true;
        try {
            gl = GL.create(options);
        } catch (e) {
            console.log(
                "This canvas cannot be used as WebGL, maybe WebGL is not supported or this canvas has already a 2D context associated"
            );
            gl = canvas.getContext("2d", options);
            return gl;
        }
    } else gl = canvas.gl;

    const error = gl.getError();
    if (error !== gl.NO_ERROR) {
        console.error("WebGL error:", error);
    }

    // Return if canvas is already canvas2DtoWebGL enabled
    if (canvas.canvas2DtoWebGL_enabled) return gl;

    //settings
    var curveSubdivisions = 50;
    var max_points = 10000; //max amount of vertex allowed to have in a single primitive
    var max_characters = 1000; //max amount of characters allowed to have in a single fillText

    //flag it for future uses
    canvas.canvas2DtoWebGL_enabled = true;

    var prev_gl = null;

    var ctx = (canvas.ctx = gl);
    ctx.WebGLCanvas = {};
    var white = vec4.fromValues(1, 1, 1, 1);

    //reusing same buffer
    var global_index = 0;
    var global_vertices = new Float32Array(max_points * 3);
    var global_mesh = new GL.Mesh();
    var global_buffer = global_mesh.createVertexBuffer(
        "vertices",
        null,
        null,
        global_vertices,
        gl.STREAM_DRAW
    );
    var quad_mesh = GL.Mesh.getScreenQuad();
    var circle_mesh = GL.Mesh.circle({ size: 1 });
    var extra_projection = mat4.create();
    var anisotropic =
        options.anisotropic !== undefined ? options.anisotropic : 2;

    var uniforms = {
        u_texture: 0,
    };

    var extra_macros = {};
    if (options.allow3D) extra_macros.EXTRA_PROJECTION = "";

    //used to store font atlas textures (images are not stored here)
    var textures = (gl.WebGLCanvas.textures_atlas = {});
    gl.WebGLCanvas.clearAtlas = function () {
        textures = gl.WebGLCanvas.textures_atlas = {};
    };

    var vertex_shader = null;
    var vertex_shader2 = null;
    var flat_shader = null;
    var texture_shader = null;
    var clip_texture_shader = null;
    var flat_primitive_shader = null;
    var textured_transform_shader = null;
    var textured_primitive_shader = null;
    var gradient_primitive_shader = null;
    var point_text_shader = null;

    gl.WebGLCanvas.set3DMatrix = function (matrix) {
        if (!matrix) mat4.identity(extra_projection);
        else extra_projection.set(matrix);
        if (extra_macros.EXTRA_PROJECTION == null) {
            extra_macros.EXTRA_PROJECTION = "";
            compileShaders();
            uniforms.u_projection = extra_projection;
        }
        uniforms.u_projection_enabled = !!matrix;
    };

    compileShaders();

    function compileShaders() {
        vertex_shader =
            "\n\
				precision highp float;\n\
				attribute vec3 a_vertex;\n\
				uniform vec2 u_viewport;\n\
				uniform mat3 u_transform;\n\
				#ifdef EXTRA_PROJECTION\n\
					uniform bool u_projection_enabled;\n\
					uniform mat4 u_projection;\n\
				#endif\n\
				varying float v_visible;\n\
				void main() { \n\
					vec3 pos = a_vertex;\n\
					v_visible = pos.z;\n\
					pos = u_transform * vec3(pos.xy,1.0);\n\
					pos.z = 0.0;\n\
					#ifdef EXTRA_PROJECTION\n\
						if(u_projection_enabled)\n\
						{\n\
							gl_Position = u_projection * vec4(pos.xy,0.0,1.0);\n\
							return;\n\
						}\n\
					#endif\n\
					//normalize\n\
					pos.x = (2.0 * pos.x / u_viewport.x) - 1.0;\n\
					pos.y = -((2.0 * pos.y / u_viewport.y) - 1.0);\n\
					gl_Position = vec4(pos, 1.0); \n\
				}\n\
				";

        vertex_shader2 =
            "\n\
			precision highp float;\n\
			attribute vec3 a_vertex;\n\
			attribute vec2 a_coord;\n\
			varying vec2 v_coord;\n\
			uniform vec2 u_position;\n\
			uniform vec2 u_size;\n\
			uniform vec2 u_viewport;\n\
			uniform mat3 u_transform;\n\
			#ifdef EXTRA_PROJECTION\n\
				uniform bool u_projection_enabled;\n\
				uniform mat4 u_projection;\n\
			#endif\n\
			void main() { \n\
				vec3 pos = vec3(u_position + vec2(a_coord.x,1.0 - a_coord.y)  * u_size, 1.0);\n\
				v_coord = a_coord; \n\
				pos = u_transform * pos;\n\
				pos.z = 0.0;\n\
				#ifdef EXTRA_PROJECTION\n\
					if(u_projection_enabled)\n\
					{\n\
						gl_Position = u_projection * vec4(pos.xy,0.0,1.0);\n\
						return;\n\
					}\n\
				#endif\n\
				//normalize\n\
				pos.x = (2.0 * pos.x / u_viewport.x) - 1.0;\n\
				pos.y = -((2.0 * pos.y / u_viewport.y) - 1.0);\n\
				gl_Position = vec4(pos, 1.0); \n\
			}\n\
		";

        //flat_shader = new GL.Shader( GL.Shader.QUAD_VERTEX_SHADER, GL.Shader.FLAT_FRAGMENT_SHADER );
        //texture_shader = new GL.Shader( GL.Shader.QUAD_VERTEX_SHADER, GL.Shader.SCREEN_COLORED_FRAGMENT_SHADER );

        flat_shader = new GL.Shader(
            vertex_shader2,
            "\n\
				precision highp float;\n\
				uniform vec4 u_color;\n\
				void main() {\n\
					gl_FragColor = u_color;\n\
				}\n\
			",
            extra_macros
        );

        texture_shader = new GL.Shader(
            vertex_shader2,
            "\n\
				precision highp float;\n\
				varying vec2 v_coord;\n\
				uniform vec4 u_color;\n\
				uniform sampler2D u_texture;\n\
				void main() {\n\
					gl_FragColor = u_color * texture2D( u_texture, v_coord );\n\
				}\n\
			",
            extra_macros
        );

        clip_texture_shader = new GL.Shader(
            vertex_shader2,
            "\n\
				precision highp float;\n\
				varying vec2 v_coord;\n\
				uniform vec4 u_color;\n\
				uniform sampler2D u_texture;\n\
				void main() {\n\
					vec4 color = u_color * texture2D( u_texture, v_coord );\n\
					if(color.a <= 0.0)\n\
						discard;\n\
					gl_FragColor = color;\n\
				}\n\
			",
            extra_macros
        );

        flat_primitive_shader = new GL.Shader(
            vertex_shader,
            "\n\
				precision highp float;\n\
				varying float v_visible;\n\
				uniform vec4 u_color;\n\
				void main() {\n\
					if (v_visible == 0.0)\n\
						discard;\n\
					gl_FragColor = u_color;\n\
				}\n\
			",
            extra_macros
        );

        textured_transform_shader = new GL.Shader(
            GL.Shader.QUAD_VERTEX_SHADER,
            "\n\
				precision highp float;\n\
				uniform sampler2D u_texture;\n\
				uniform vec4 u_color;\n\
				uniform vec4 u_texture_transform;\n\
				varying vec2 v_coord;\n\
				void main() {\n\
					vec2 uv = v_coord * u_texture_transform.zw + vec2(u_texture_transform.x,0.0);\n\
					uv.y = uv.y - u_texture_transform.y + (1.0 - u_texture_transform.w);\n\
					uv = clamp(uv,vec2(0.0),vec2(1.0));\n\
					gl_FragColor = u_color * texture2D(u_texture, uv);\n\
				}\n\
			",
            extra_macros
        );

        textured_primitive_shader = new GL.Shader(
            vertex_shader,
            "\n\
				precision highp float;\n\
				varying float v_visible;\n\
				uniform vec4 u_color;\n\
				uniform sampler2D u_texture;\n\
				uniform vec4 u_texture_transform;\n\
				uniform vec2 u_viewport;\n\
				uniform mat3 u_itransform;\n\
				void main() {\n\
					vec2 pos = (u_itransform * vec3( gl_FragCoord.s, u_viewport.y - gl_FragCoord.t,1.0)).xy;\n\
					pos *= vec2( (u_viewport.x * u_texture_transform.z), (u_viewport.y * u_texture_transform.w) );\n\
					vec2 uv = fract(pos / u_viewport) + u_texture_transform.xy;\n\
					uv.y = 1.0 - uv.y;\n\
					gl_FragColor = u_color * texture2D( u_texture, uv);\n\
				}\n\
			",
            extra_macros
        );

        gradient_primitive_shader = new GL.Shader(
            vertex_shader,
            "\n\
				precision highp float;\n\
				varying float v_visible;\n\
				uniform vec4 u_color;\n\
				uniform sampler2D u_texture;\n\
				uniform vec4 u_gradient;\n\
				uniform vec2 u_viewport;\n\
				uniform mat3 u_itransform;\n\
				void main() {\n\
					vec2 pos = (u_itransform * vec3( gl_FragCoord.s, u_viewport.y - gl_FragCoord.t,1.0)).xy;\n\
					//vec2 pos = vec2( gl_FragCoord.s, u_viewport.y - gl_FragCoord.t);\n\
					vec2 AP = pos - u_gradient.xy;\n\
					vec2 AB = u_gradient.zw - u_gradient.xy;\n\
					float dotAPAB = dot(AP,AB);\n\
					float dotABAB = dot(AB,AB);\n\
					float x = dotAPAB / dotABAB;\n\
					vec2 uv = vec2( x, 0.0 );\n\
					gl_FragColor = u_color * texture2D( u_texture, uv );\n\
				}\n\
			",
            extra_macros
        );

        //used for text
        var POINT_TEXT_VERTEX_SHADER =
            "\n\
			precision highp float;\n\
			attribute vec3 a_vertex;\n\
			attribute vec2 a_coord;\n\
			varying vec2 v_coord;\n\
			uniform vec2 u_viewport;\n\
			uniform mat3 u_transform;\n\
			#ifdef EXTRA_PROJECTION\n\
				uniform bool u_projection_enabled;\n\
				uniform mat4 u_projection;\n\
			#endif\n\
			uniform float u_pointSize;\n\
			void main() { \n\
				vec3 pos = a_vertex;\n\
				pos = u_transform * pos;\n\
				pos.z = 0.0;\n\
				#ifdef EXTRA_PROJECTION\n\
					if(u_projection_enabled)\n\
					{\n\
						gl_Position = u_projection * vec4(pos.xy,0.0,1.0);\n\
						return;\n\
					}\n\
				#endif\n\
				//normalize\n\
				pos.x = (2.0 * pos.x / u_viewport.x) - 1.0;\n\
				pos.y = -((2.0 * pos.y / u_viewport.y) - 1.0);\n\
				gl_Position = vec4(pos, 1.0); \n\
				gl_PointSize = ceil(u_pointSize);\n\
				v_coord = a_coord;\n\
			}\n\
			";

        var POINT_TEXT_FRAGMENT_SHADER =
            "\n\
			precision highp float;\n\
			uniform sampler2D u_texture;\n\
			uniform float u_iCharSize;\n\
			uniform vec4 u_color;\n\
			uniform float u_pointSize;\n\
			uniform vec2 u_viewport;\n\
			uniform vec2 u_angle_sincos;\n\
			varying vec2 v_coord;\n\
			void main() {\n\
				vec2 uv = vec2(1.0 - gl_PointCoord.s, gl_PointCoord.t);\n\
				uv = vec2( ((uv.y - 0.5) * u_angle_sincos.y - (uv.x - 0.5) * u_angle_sincos.x) + 0.5, ((uv.x - 0.5) * u_angle_sincos.y + (uv.y - 0.5) * u_angle_sincos.x) + 0.5);\n\
				uv = v_coord - uv * u_iCharSize + vec2(u_iCharSize*0.5);\n\
				uv.y = 1.0 - uv.y;\n\
				gl_FragColor = vec4(u_color.xyz, u_color.a * texture2D(u_texture, uv, -1.0  ).a);\n\
      }\n\
			";

        point_text_shader = new GL.Shader(
            POINT_TEXT_VERTEX_SHADER,
            POINT_TEXT_FRAGMENT_SHADER,
            extra_macros
        );
    }

    ctx.createImageShader = function (code) {
        return new GL.Shader(
            GL.Shader.QUAD_VERTEX_SHADER,
            "\n\
			precision highp float;\n\
			uniform sampler2D u_texture;\n\
			uniform vec4 u_color;\n\
			uniform vec4 u_texture_transform;\n\
			uniform vec2 u_viewport;\n\
			varying vec2 v_coord;\n\
			void main() {\n\
				vec2 uv = v_coord * u_texture_transform.zw + vec2(u_texture_transform.x,0.0);\n\
				uv.y = uv.y - u_texture_transform.y + (1.0 - u_texture_transform.w);\n\
				uv = clamp(uv,vec2(0.0),vec2(1.0));\n\
				vec4 color = u_color * texture2D(u_texture, uv);\n\
				" +
                code +
                ";\n\
				gl_FragColor = color;\n\
			}\n\
		",
            extra_macros
        );
    };

    //some people may reuse it
    ctx.WebGLCanvas.vertex_shader = vertex_shader;

    //STACK and TRANSFORM
    ctx._matrix = mat3.create();
    var tmp_mat3 = mat3.create();
    var tmp_vec2 = vec2.create();
    var tmp_vec4 = vec4.create();
    var tmp_vec4b = vec4.create();
    var tmp_vec2b = vec2.create();
    ctx._stack = [];
    ctx._stack_size = 0;
    var global_angle = 0;
    var viewport = ctx.viewport_data.subarray(2, 4);

    ctx.translate = function (x, y) {
        tmp_vec2[0] = x;
        tmp_vec2[1] = y;
        mat3.translate(this._matrix, this._matrix, tmp_vec2);
    };

    ctx.rotate = function (angle) {
        mat3.rotate(this._matrix, this._matrix, angle);
        global_angle += angle;
    };

    ctx.scale = function (x, y) {
        tmp_vec2[0] = x;
        tmp_vec2[1] = y;
        mat3.scale(this._matrix, this._matrix, tmp_vec2);
    };

    //own method to reset internal stuff
    ctx.resetTransform = function () {
        //reset transform
        gl._stack_size = 0;
        this._matrix.set([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        global_angle = 0;
    };

    ctx.save = function () {
        if (this._stack_size >= 32) return;
        var current_level = null;
        if (this._stack_size == this._stack.length) {
            current_level = this._stack[this._stack_size] = {
                matrix: mat3.create(),
                fillColor: vec4.create(),
                strokeColor: vec4.create(),
                shadowColor: vec4.create(),
                globalAlpha: 1,
                font: "",
                fontFamily: "",
                fontSize: 14,
                fontMode: "",
                textAlign: "",
                clip_level: 0,
            };
        } else current_level = this._stack[this._stack_size];
        this._stack_size++;

        current_level.matrix.set(this._matrix);
        current_level.fillColor.set(this._fillcolor);
        current_level.strokeColor.set(this._strokecolor);
        current_level.shadowColor.set(this._shadowcolor);
        current_level.globalAlpha = this._globalAlpha;
        current_level.font = this._font;
        current_level.fontFamily = this._font_family;
        current_level.fontSize = this._font_size;
        current_level.fontMode = this._font_mode;
        current_level.textAlign = this.textAlign;
        current_level.clip_level = this.clip_level;
    };

    ctx.restore = function () {
        if (this._stack_size == 0) {
            mat3.identity(this._matrix);
            global_angle = 0;
            return;
        }

        this._stack_size--;
        var current_level = this._stack[this._stack_size];

        this._matrix.set(current_level.matrix);
        this._fillcolor.set(current_level.fillColor);
        this._strokecolor.set(current_level.strokeColor);
        this._shadowcolor.set(current_level.shadowColor);
        this._globalAlpha = current_level.globalAlpha;
        this._font = current_level.font;
        this._font_family = current_level.fontFamily;
        // 문자열을 강제로 int로 변경
        this._font_size = parseInt(current_level.fontSize);
        this._font_mode = current_level.fontMode;
        this.textAlign = current_level.textAlign;
        var prev_clip_level = this.clip_level;
        this.clip_level = current_level.clip_level;

        global_angle = Math.atan2(this._matrix[3], this._matrix[4]); //use up vector

        if (prev_clip_level == this.clip_level) {
            //nothing
        } else if (this.clip_level == 0) {
            //exiting stencil mode
            //clear and disable
            gl.enable(gl.STENCIL_TEST);
            gl.clearStencil(0x0);
            gl.clear(gl.STENCIL_BUFFER_BIT);
            gl.disable(gl.STENCIL_TEST);
        } //reduce clip level
        else {
            gl.stencilFunc(gl.LEQUAL, this.clip_level, 0xff); //why LEQUAL?? should be GEQUAL but doesnt work
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        }
    };

    ctx.clip = function () {
        //first one clears?
        if (this.clip_level == 0) {
            //??
        }

        this.clip_level++;

        gl.colorMask(false, false, false, false);
        gl.depthMask(false);

        //fill stencil buffer
        gl.enable(gl.STENCIL_TEST);
        //gl.stencilFunc( gl.ALWAYS, 1, 0xFF );
        //gl.stencilOp( gl.KEEP, gl.KEEP, gl.REPLACE ); //TODO using INCR we could allow 8 stencils
        gl.stencilFunc(gl.EQUAL, this.clip_level - 1, 0xff);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);

        this.fill();

        gl.colorMask(true, true, true, true);
        gl.depthMask(true);
        //gl.stencilFunc( gl.EQUAL, 1, 0xFF );
        gl.stencilFunc(gl.EQUAL, this.clip_level, 0xff);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    };

    ctx.clipImage = function (image, x, y, w, h) {
        this.clip_level++;

        gl.colorMask(false, false, false, false);
        gl.depthMask(false);
        gl.enable(gl.STENCIL_TEST);
        gl.stencilFunc(gl.EQUAL, this.clip_level - 1, 0xff);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);

        //draw image with discard
        this.drawImage(image, x, y, w, h, clip_texture_shader);

        gl.colorMask(true, true, true, true);
        gl.depthMask(true);
        gl.stencilFunc(gl.EQUAL, this.clip_level, 0xff);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    };

    ctx.transform = function (a, b, c, d, e, f) {
        var m = tmp_mat3;

        m[0] = a;
        m[1] = b;
        m[2] = 0;
        m[3] = c;
        m[4] = d;
        m[5] = 0;
        m[6] = e;
        m[7] = f;
        m[8] = 1; //fix
        //m[0] = a; m[1] = c;	m[2] = e; m[3] = b;	m[4] = d; m[5] = f;	m[6] = 0; m[7] = 0;	m[8] = 1;

        mat3.multiply(this._matrix, this._matrix, m);
        global_angle = Math.atan2(this._matrix[0], this._matrix[1]);
    };

    ctx.setTransform = function (a, b, c, d, e, f) {
        var m = this._matrix;

        m[0] = a;
        m[1] = b;
        m[2] = 0;
        m[3] = c;
        m[4] = d;
        m[5] = 0;
        m[6] = e;
        m[7] = f;
        m[8] = 1; //fix
        //m[0] = a; m[1] = c;	m[2] = e; m[3] = b;	m[4] = d; m[5] = f;	m[6] = 0; m[7] = 0;	m[8] = 1;

        //this._matrix.set([a,c,e,b,d,f,0,0,1]);
        global_angle = Math.atan2(this._matrix[0], this._matrix[1]);
    };

    //Images
    var last_uid = 1;

    //textures are stored inside images, so as long as the image exist in memory, the texture will exist
    function getTexture(img) {
        var tex = null;
        if (img.constructor === GL.Texture) {
            if (img._context_id == gl.context_id) return img;
            return null;
        } else {
            //same image could be used in several contexts
            if (!img.gl) img.gl = {};

            //Regular image
            if (img.src) {
                var wrap = gl.REPEAT;

                tex = img.gl[gl.context_id];
                if (tex) {
                    if (img.mustUpdate) {
                        tex.uploadData(img);
                        img.mustUpdate = false;
                    }
                    return tex;
                }
                return (img.gl[gl.context_id] = GL.Texture.fromImage(img, {
                    magFilter: gl.LINEAR,
                    minFilter: gl.LINEAR_MIPMAP_LINEAR,
                    wrap: wrap,
                    ignore_pot: true,
                    premultipliedAlpha: true,
                    anisotropic: anisotropic,
                }));
            } //probably a canvas
            else {
                tex = img.gl[gl.context_id];
                if (tex) {
                    if (img.mustUpdate) {
                        tex.uploadData(img);
                        img.mustUpdate = false;
                    }
                    return tex;
                }
                return (img.gl[gl.context_id] = GL.Texture.fromImage(img, {
                    minFilter: gl.LINEAR,
                    magFilter: gl.LINEAR,
                    anisotropic: anisotropic,
                }));
            }
        }
    }

    //it supports all versions of drawImage (3 params, 5 params or 9 params)
    //it allows to pass a shader, otherwise it uses texture_shader (code is GL.Shader.SCREEN_COLORED_FRAGMENT_SHADER)
    ctx.drawImage = function (img, x, y, w, h, shader) {
        if (!img) return;

        var img_width = img.videoWidth || img.width;
        var img_height = img.videoHeight || img.height;

        if (img_width == 0 || img_height == 0) return;

        var tex = getTexture(img);
        if (!tex) return;

        if (arguments.length == 9) {
            //img, sx,sy,sw,sh, x,y,w,h
            tmp_vec4b.set([
                x / img_width,
                y / img_height,
                w / img_width,
                h / img_height,
            ]);
            x = arguments[5];
            y = arguments[6];
            w = arguments[7];
            h = arguments[8];
            shader = textured_transform_shader;
        } else tmp_vec4b.set([0, 0, 1, 1]); //reset texture transform

        tmp_vec2[0] = x;
        tmp_vec2[1] = y;
        tmp_vec2b[0] = w === undefined ? tex.width : w;
        tmp_vec2b[1] = h === undefined ? tex.height : h;

        tex.bind(0);
        if (tex !== img)
            //only apply the imageSmoothingEnabled if we are dealing with images, not textures
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_MAG_FILTER,
                this.imageSmoothingEnabled ? gl.LINEAR : gl.NEAREST
            );

        if (!this.tintImages) {
            tmp_vec4[0] = tmp_vec4[1] = tmp_vec4[2] = 1.0;
            tmp_vec4[3] = this._globalAlpha;
        }

        uniforms.u_color = this.tintImages ? this._fillcolor : tmp_vec4;
        uniforms.u_position = tmp_vec2;
        uniforms.u_size = tmp_vec2b;
        uniforms.u_transform = this._matrix;
        uniforms.u_texture_transform = tmp_vec4b;
        uniforms.u_viewport = viewport;

        shader = shader || texture_shader;

        shader.uniforms(uniforms).draw(quad_mesh);
        extra_projection[14] -= 0.001;
    };

    ctx.createPattern = function (img) {
        return getTexture(img);
    };

    //to create gradients
    function WebGLCanvasGradient(x, y, x2, y2) {
        this.id = ctx._last_gradient_id++ % ctx._max_gradients;
        this.points = new Float32Array([x, y, x2, y2]);
        this.stops = [];
        this._must_update = true;
    }

    //to avoid creating textures all the time
    ctx._last_gradient_id = 0;
    ctx._max_gradients = 16;
    ctx._gradients_pool = [];

    WebGLCanvasGradient.prototype.addColorStop = function (pos, color) {
        var final_color = hexColorToRGBA(color);
        var v = new Uint8Array(4);
        v[0] = Math.clamp(final_color[0], 0, 1) * 255;
        v[1] = Math.clamp(final_color[1], 0, 1) * 255;
        v[2] = Math.clamp(final_color[2], 0, 1) * 255;
        v[3] = Math.clamp(final_color[3], 0, 1) * 255;
        this.stops.push([pos, v]);
        this.stops.sort(function (a, b) {
            return a[0] > b[0] ? 1 : b[0] > a[0] ? -1 : 0;
        });
        this._must_update = true;
    };

    WebGLCanvasGradient.prototype.toTexture = function () {
        //create a texture from the pool
        if (!this._texture) {
            if (this.id != -1) this._texture = ctx._gradients_pool[this.id];
            if (!this._texture) {
                this._texture = new GL.Texture(128, 1, {
                    format: gl.RGBA,
                    magFilter: gl.LINEAR,
                    wrap: gl.CLAMP_TO_EDGE,
                    minFilter: gl.NEAREST,
                });
                if (this.id != -1) ctx._gradients_pool[this.id] = this._texture;
            }
        }
        if (!this._must_update) return this._texture;
        this._must_update = false;
        if (this.stops.length < 1) return this._texture; //no stops
        if (this.stops.length < 2) {
            this._texture.fill(this.stops[0][1]);
            return this._texture; //one color
        }

        //fill buffer
        var index = 0;
        var current = this.stops[index];
        var next = this.stops[index + 1];

        var buffer = new Uint8Array(128 * 4);
        for (var i = 0; i < 128; i += 1) {
            var color = buffer.subarray(i * 4, i * 4 + 4);
            var t = i / 128;
            if (current[0] > t) {
                if (index == 0) color.set(current[1]);
                else {
                    index += 1;
                    current = this.stops[index];
                    next = this.stops[index + 1];
                    if (!next) break;
                    i -= 1;
                }
            } else if (current[0] <= t && t < next[0]) {
                var f = (t - current[0]) / (next[0] - current[0]);
                vec4.lerp(color, current[1], next[1], f);
            } else if (next[0] <= t) {
                index += 1;
                current = this.stops[index];
                next = this.stops[index + 1];
                if (!next) break;
                i -= 1;
            }
        }
        //fill the remaining
        if (i < 128)
            for (var j = i; j < 128; j += 1) buffer.set(current[1], j * 4);
        this._texture.uploadData(buffer);
        return this._texture;
    };

    ctx.createLinearGradient = function (x, y, x2, y2) {
        return new WebGLCanvasGradient(x, y, x2, y2);
    };

    //Primitives

    ctx.beginPath = function () {
        global_index = 0;
    };

    ctx.closePath = function () {
        if (global_index < 3) return;
        global_vertices[global_index] = global_vertices[0];
        global_vertices[global_index + 1] = global_vertices[1];
        global_vertices[global_index + 2] = 1;
        global_index += 3;
    };

    ctx.moveTo = function (x, y) {
        //not the first line
        if (global_index == 0) {
            global_vertices[global_index] = x;
            global_vertices[global_index + 1] = y;
            global_vertices[global_index + 2] = 1;
            global_index += 3;
        } else {
            global_vertices[global_index] = global_vertices[global_index - 3];
            global_vertices[global_index + 1] =
                global_vertices[global_index - 2];
            global_vertices[global_index + 2] = 0;
            global_index += 3;
            global_vertices[global_index] = x;
            global_vertices[global_index + 1] = y;
            global_vertices[global_index + 2] = 0;
            global_index += 3;
        }
    };

    ctx.lineTo = function (x, y) {
        global_vertices[global_index] = x;
        global_vertices[global_index + 1] = y;
        global_vertices[global_index + 2] = 1;
        global_index += 3;
    };

    ctx.bezierCurveTo = function (m1x, m1y, m2x, m2y, ex, ey) {
        if (global_index < 3) return;

        var last = [
            global_vertices[global_index - 3],
            global_vertices[global_index - 2],
        ];
        var cp = [last, [m1x, m1y], [m2x, m2y], [ex, ey]];
        for (var i = 0; i <= curveSubdivisions; i++) {
            var t = i / curveSubdivisions;
            var ax, bx, cx;
            var ay, by, cy;
            var tSquared, tCubed;

            /* cálculo de los coeficientes polinomiales */
            cx = 3.0 * (cp[1][0] - cp[0][0]);
            bx = 3.0 * (cp[2][0] - cp[1][0]) - cx;
            ax = cp[3][0] - cp[0][0] - cx - bx;

            cy = 3.0 * (cp[1][1] - cp[0][1]);
            by = 3.0 * (cp[2][1] - cp[1][1]) - cy;
            ay = cp[3][1] - cp[0][1] - cy - by;

            /* calculate the curve point at parameter value t */
            tSquared = t * t;
            tCubed = tSquared * t;

            var x = ax * tCubed + bx * tSquared + cx * t + cp[0][0];
            var y = ay * tCubed + by * tSquared + cy * t + cp[0][1];
            global_vertices[global_index] = x;
            global_vertices[global_index + 1] = y;
            global_vertices[global_index + 2] = 1;
            global_index += 3;
        }
    };

    ctx.quadraticCurveTo = function (mx, my, ex, ey) {
        if (global_index < 3) return;

        var sx = global_vertices[global_index - 3];
        var sy = global_vertices[global_index - 2];

        for (var i = 0; i <= curveSubdivisions; i++) {
            var f = i / curveSubdivisions;
            var nf = 1 - f;

            var m1x = sx * nf + mx * f;
            var m1y = sy * nf + my * f;

            var m2x = mx * nf + ex * f;
            var m2y = my * nf + ey * f;

            global_vertices[global_index] = m1x * nf + m2x * f;
            global_vertices[global_index + 1] = m1y * nf + m2y * f;
            global_vertices[global_index + 2] = 1;
            global_index += 3;
        }
    };

    ctx.fill = function () {
        if (global_index < 9) return;

        //update buffer
        global_buffer.uploadRange(0, global_index * 4); //4 bytes per float
        uniforms.u_viewport = viewport;
        var shader = flat_primitive_shader;

        //first the shadow
        if (this._shadowcolor[3] > 0.0) {
            uniforms.u_color = this._shadowcolor;
            this.save();
            this.translate(this.shadowOffsetX, this.shadowOffsetY);
            shader
                .uniforms(uniforms)
                .drawRange(global_mesh, gl.TRIANGLE_FAN, 0, global_index / 3);
            this.restore();
        }

        uniforms.u_color = this._fillcolor;
        uniforms.u_transform = this._matrix;

        var fill_style = this._fillStyle;

        if (fill_style.constructor === WebGLCanvasGradient) {
            //gradient
            var grad = fill_style;
            var tex = grad.toTexture();
            uniforms.u_color = [1, 1, 1, this.globalAlpha];
            uniforms.u_gradient = grad.points;
            uniforms.u_texture = 0;
            uniforms.u_itransform = mat3.invert(tmp_mat3, this._matrix);
            tex.bind(0);
            shader = gradient_primitive_shader;
        } else if (fill_style.constructor === GL.Texture) {
            //pattern
            var tex = fill_style;
            uniforms.u_color = [1, 1, 1, this._globalAlpha];
            uniforms.u_texture = 0;
            tmp_vec4.set([0, 0, 1 / tex.width, 1 / tex.height]);
            uniforms.u_texture_transform = tmp_vec4;
            uniforms.u_itransform = mat3.invert(tmp_mat3, this._matrix);
            tex.bind(0);
            shader = textured_primitive_shader;
        }

        //render
        shader
            .uniforms(uniforms)
            .drawRange(global_mesh, gl.TRIANGLE_FAN, 0, global_index / 3);
        extra_projection[14] -= 0.001;
    };

    //basic stroke using gl.LINES
    ctx.strokeThin = function () {
        if (global_index < 6) return;

        //update buffer
        global_buffer.uploadRange(0, global_index * 4); //4 bytes per float
        //global_buffer.upload( gl.STREAM_DRAW );

        gl.setLineWidth(this.lineWidth);
        uniforms.u_color = this._strokecolor;
        uniforms.u_transform = this._matrix;
        uniforms.u_viewport = viewport;
        flat_primitive_shader
            .uniforms(uniforms)
            .drawRange(global_mesh, gl.LINE_STRIP, 0, global_index / 3);
    };

    //advanced stroke (it takes width into account)
    var lines_vertices = new Float32Array(max_points * 3);
    var lines_mesh = new GL.Mesh();
    var lines_buffer = lines_mesh.createVertexBuffer(
        "vertices",
        null,
        null,
        lines_vertices,
        gl.STREAM_DRAW
    );

    ctx.stroke = function () {
        if (global_index < 6) return;

        tmp_vec2[0] = this._matrix[0];
        tmp_vec2[1] = this._matrix[1];

        if (this.lineWidth * vec2.length(tmp_vec2) <= 1.0)
            return this.strokeThin();

        var num_points = global_index / 3;
        var vertices = lines_vertices;
        var l = global_index;
        var line_width = this.lineWidth * 0.5;

        var points = global_vertices;

        var delta_x = 0;
        var delta_y = 0;
        var prev_delta_x = 0;
        var prev_delta_y = 0;
        var average_x = 0;
        var average_y = 0;
        var first_delta_x = 0;
        var first_delta_y = 0;

        if (
            points[0] == points[global_index - 3] &&
            points[1] == points[global_index - 2]
        ) {
            delta_x = points[global_index - 3] - points[global_index - 6];
            delta_y = points[global_index - 2] - points[global_index - 5];
            var dist = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
            if (dist != 0) {
                delta_x = delta_x / dist;
                delta_y = delta_y / dist;
            }
        }

        var i,
            pos = 0;
        for (i = 0; i < l - 3; i += 3) {
            prev_delta_x = delta_x;
            prev_delta_y = delta_y;

            delta_x = points[i + 3] - points[i];
            delta_y = points[i + 4] - points[i + 1];
            var dist = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
            if (dist != 0) {
                delta_x = delta_x / dist;
                delta_y = delta_y / dist;
            }
            if (i == 0) {
                first_delta_x = delta_x;
                first_delta_y = delta_y;
            }

            average_x = delta_x + prev_delta_x;
            average_y = delta_y + prev_delta_y;

            var dist = Math.sqrt(average_x * average_x + average_y * average_y);
            if (dist != 0) {
                average_x = average_x / dist;
                average_y = average_y / dist;
            }

            vertices[pos + 0] = points[i] - average_y * line_width;
            vertices[pos + 1] = points[i + 1] + average_x * line_width;
            vertices[pos + 2] = 1;
            vertices[pos + 3] = points[i] + average_y * line_width;
            vertices[pos + 4] = points[i + 1] - average_x * line_width;
            vertices[pos + 5] = 1;

            pos += 6;
        }

        //final points are tricky
        if (
            points[0] == points[global_index - 3] &&
            points[1] == points[global_index - 2]
        ) {
            average_x = delta_x + first_delta_x;
            average_y = delta_y + first_delta_y;
            var dist = Math.sqrt(average_x * average_x + average_y * average_y);
            if (dist != 0) {
                average_x = average_x / dist;
                average_y = average_y / dist;
            }
            vertices[pos + 0] = points[i] - average_y * line_width;
            vertices[pos + 1] = points[i + 1] + average_x * line_width;
            vertices[pos + 2] = 1;
            vertices[pos + 3] = points[i] + average_y * line_width;
            vertices[pos + 4] = points[i + 1] - average_x * line_width;
            vertices[pos + 5] = 1;
        } else {
            var dist = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
            if (dist != 0) {
                average_x = delta_x / dist;
                average_y = delta_y / dist;
            }

            vertices[pos + 0] =
                points[i] - (average_y - average_x) * line_width;
            vertices[pos + 1] =
                points[i + 1] + (average_x + average_y) * line_width;
            vertices[pos + 2] = 1;
            vertices[pos + 3] =
                points[i] + (average_y + average_x) * line_width;
            vertices[pos + 4] =
                points[i + 1] - (average_x - average_y) * line_width;
            vertices[pos + 5] = 1;
        }

        pos += 6;

        lines_buffer.upload(gl.STREAM_DRAW);
        lines_buffer.uploadRange(0, pos * 4); //4 bytes per float

        uniforms.u_transform = this._matrix;
        uniforms.u_viewport = viewport;

        //first the shadow
        if (this._shadowcolor[3] > 0.0) {
            uniforms.u_color = this._shadowcolor;
            this.save();
            this.translate(this.shadowOffsetX, this.shadowOffsetY);
            flat_primitive_shader
                .uniforms(uniforms)
                .drawRange(global_mesh, gl.TRIANGLE_STRIP, 0, pos / 3);
            this.restore();
        }

        //gl.setLineWidth( this.lineWidth );
        uniforms.u_color = this._strokecolor;
        flat_primitive_shader
            .uniforms(uniforms)
            .drawRange(lines_mesh, gl.TRIANGLE_STRIP, 0, pos / 3);
        extra_projection[14] -= 0.001;
    };

    ctx.rect = function (x, y, w, h) {
        global_vertices[global_index] = x;
        global_vertices[global_index + 1] = y;
        global_vertices[global_index + 2] = 1;

        global_vertices[global_index + 3] = x + w;
        global_vertices[global_index + 4] = y;
        global_vertices[global_index + 5] = 1;

        global_vertices[global_index + 6] = x + w;
        global_vertices[global_index + 7] = y + h;
        global_vertices[global_index + 8] = 1;

        global_vertices[global_index + 9] = x;
        global_vertices[global_index + 10] = y + h;
        global_vertices[global_index + 11] = 1;

        global_vertices[global_index + 12] = x;
        global_vertices[global_index + 13] = y;
        global_vertices[global_index + 14] = 1;

        global_index += 15;
    };

    ctx.roundRect = function (x, y, w, h, radius, radius_low) {
        var top_left_radius = 0;
        var top_right_radius = 0;
        var bottom_left_radius = 0;
        var bottom_right_radius = 0;

        if (radius === 0) {
            this.rect(x, y, w, h);
            return;
        }

        if (radius_low === undefined) radius_low = radius;

        //make it compatible with official one
        if (radius != null && radius.constructor === Array) {
            if (radius.length == 1)
                top_left_radius =
                    top_right_radius =
                    bottom_left_radius =
                    bottom_right_radius =
                        radius[0];
            else if (radius.length == 2) {
                top_left_radius = bottom_right_radius = radius[0];
                top_right_radius = bottom_left_radius = radius[1];
            } else if (radius.length == 4) {
                top_left_radius = radius[0];
                top_right_radius = radius[1];
                bottom_left_radius = radius[2];
                bottom_right_radius = radius[3];
            } else return;
        } //old using numbers
        else {
            top_left_radius = radius || 0;
            top_right_radius = radius || 0;
            bottom_left_radius = radius_low || 0;
            bottom_right_radius = radius_low || 0;
        }

        var gv = global_vertices;
        var gi = global_index;

        //topleft
        if (top_left_radius > 0)
            for (var i = 0; i < 10; ++i) {
                var ang = (i / 10) * Math.PI * 0.5;
                gv[gi] = x + top_left_radius * (1.0 - Math.cos(ang));
                gv[gi + 1] = y + top_left_radius * (1.0 - Math.sin(ang));
                gv[gi + 2] = 1;
                gi += 3;
            }

        gv[gi + 0] = x + top_left_radius;
        gv[gi + 1] = y;
        gv[gi + 2] = 1;
        gv[gi + 3] = x + w - top_right_radius;
        gv[gi + 4] = y;
        gv[gi + 5] = 1;
        gi += 6;

        //top right
        if (top_right_radius > 0)
            for (var i = 0; i < 10; ++i) {
                var ang = (i / 10) * Math.PI * 0.5;
                gv[gi + 0] = x + w - top_right_radius * (1.0 - Math.sin(ang));
                gv[gi + 1] = y + top_right_radius * (1.0 - Math.cos(ang));
                gv[gi + 2] = 1;
                gi += 3;
            }

        gv[gi + 0] = x + w;
        gv[gi + 1] = y + top_right_radius;
        gv[gi + 2] = 1;
        gv[gi + 3] = x + w;
        gv[gi + 4] = y + h - bottom_right_radius;
        gv[gi + 5] = 1;
        gi += 6;

        //bottom right
        if (bottom_right_radius > 0)
            for (var i = 0; i < 10; ++i) {
                var ang = (i / 10) * Math.PI * 0.5;
                gv[gi + 0] =
                    x + w - bottom_right_radius * (1.0 - Math.cos(ang));
                gv[gi + 1] =
                    y + h - bottom_right_radius * (1.0 - Math.sin(ang));
                gv[gi + 2] = 1;
                gi += 3;
            }

        gv[gi + 0] = x + w - bottom_right_radius;
        gv[gi + 1] = y + h;
        gv[gi + 2] = 1;
        gv[gi + 3] = x + bottom_left_radius;
        gv[gi + 4] = y + h;
        gv[gi + 5] = 1;
        gi += 6;

        //bottom right
        if (bottom_left_radius > 0)
            for (var i = 0; i < 10; ++i) {
                var ang = (i / 10) * Math.PI * 0.5;
                gv[gi + 0] = x + bottom_left_radius * (1.0 - Math.sin(ang));
                gv[gi + 1] = y + h - bottom_left_radius * (1.0 - Math.cos(ang));
                gv[gi + 2] = 1;
                gi += 3;
            }

        gv[gi + 0] = x;
        gv[gi + 1] = y + top_left_radius;
        gv[gi + 2] = 1;
        global_index = gi + 3;
    };

    ctx.arc = function (x, y, radius, start_ang, end_ang) {
        var scale = Math.max(
            Math.abs(this._matrix[0]),
            Math.abs(this._matrix[1]),
            Math.abs(this._matrix[3]),
            Math.abs(this._matrix[4])
        ); //the axis defining ones
        var num = Math.ceil(radius * 2 * scale + 1);
        if (num < 1) return;
        num = Math.min(num, 1024); //clamp it or bad things can happend

        start_ang = start_ang === undefined ? 0 : start_ang;
        end_ang = end_ang === undefined ? Math.PI * 2 : end_ang;

        var delta = (end_ang - start_ang) / num;

        for (var i = 0; i <= num; i++) {
            var f = start_ang + i * delta;
            this.lineTo(x + Math.cos(f) * radius, y + Math.sin(f) * radius);
        }
    };

    ctx.strokeRect = function (x, y, w, h) {
        this.beginPath();
        this.rect(x, y, w, h); //[x,y,1, x+w,y,1, x+w,y+h,1, x,y+h,1, x,y,1 ];
        this.stroke();
    };

    ctx.fillRect = function (x, y, w, h) {
        global_index = 0;

        //fill using a gradient or pattern
        if (
            this._fillStyle.constructor == GL.Texture ||
            this._fillStyle.constructor === WebGLCanvasGradient
        ) {
            this.beginPath();
            this.rect(x, y, w, h);
            this.fill();
            return;
        }

        uniforms.u_color = this._fillcolor;
        tmp_vec2[0] = x;
        tmp_vec2[1] = y;
        tmp_vec2b[0] = w;
        tmp_vec2b[1] = h;
        uniforms.u_position = tmp_vec2;
        uniforms.u_size = tmp_vec2b;
        uniforms.u_transform = this._matrix;
        uniforms.u_viewport = viewport;
        flat_shader.uniforms(uniforms).draw(quad_mesh);
        extra_projection[14] -= 0.001;
    };

    //other functions
    ctx.clearRect = function (x, y, w, h) {
        if (x != 0 || y != 0 || w != canvas.width || h != canvas.height) {
            gl.enable(gl.SCISSOR_TEST);
            gl.scissor(x, y, w, h);
        }

        //gl.clearColor( 0.0,0.0,0.0,0.0 );
        gl.clear(gl.COLOR_BUFFER_BIT);
        var v = gl.viewport_data;
        gl.scissor(v[0], v[1], v[2], v[3]);
        gl.disable(gl.SCISSOR_TEST);
    };

    ctx.fillCircle = function (x, y, r) {
        global_index = 0;

        //fill using a gradient or pattern
        if (
            this._fillStyle.constructor == GL.Texture ||
            this._fillStyle.constructor === WebGLCanvasGradient
        ) {
            this.beginPath();
            this.arc(x, y, r, 0, Math.PI * 2);
            this.fill();
            return;
        }

        uniforms.u_color = this._fillcolor;
        tmp_vec2[0] = x;
        tmp_vec2[1] = y;
        tmp_vec2b[0] = r;
        tmp_vec2b[1] = r;
        uniforms.u_position = tmp_vec2;
        uniforms.u_size = tmp_vec2b;
        uniforms.u_transform = this._matrix;
        uniforms.u_viewport = viewport;
        flat_shader.uniforms(uniforms).draw(circle_mesh);
        extra_projection[14] -= 0.001;
    };

    //control funcs: used to set flags at the beginning and the end of the render
    ctx.start2D = function () {
        prev_gl = window.gl;
        window.gl = this;
        var gl = this;

        //viewport[0] = gl.viewport_data[2];
        //viewport[1] = gl.viewport_data[3];
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.STENCIL_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.blendEquation(gl.FUNC_ADD);
        gl.lineWidth = 1;
        global_index = 0;
        mat4.identity(extra_projection);
        this.clip_level = 0; //sure?
    };

    ctx.finish2D = function () {
        global_index = 0;
        gl.lineWidth = 1;
        window.gl = prev_gl;
        gl.disable(gl.STENCIL_TEST);
    };

    /*
	var max_triangle_characters = 64;
	var triangle = new Float32Array([-1,1,0, -1,-1,0, 1,-1,0, -1,1,0, 1,-1,0, 1,1,0]);
	var triangle_text_vertices = new Float32Array( max_triangle_characters * 6 * 3 );
	var triangle_text_mesh = new GL.Mesh();
	var triangle_text_vertices_buffer = triangle_text_mesh.createVertexBuffer("vertices", null, null, triangle_text_vertices );
	var tv = triangle_text_vertices;
	for(var i = 0; i < triangle_text_vertices.length; i += 6*3)
	{
		tv.set(triangle, i);
		tv[2] = tv[5] = tv[8] = tv[11] = t[14] = t[17] = i / (6*3);
	}
	triangle_text_vertices_buffer.upload();

	var TRIANGLE_TEXT_VERTEX_SHADER = "\n\
			precision highp float;\n\
			#define MAX_CHARS 64;
			attribute vec3 a_vertex;\n\
			varying vec2 v_coord;\n\
			uniform vec2 u_viewport;\n\
			uniform vec2 u_charPos[ MAX_CHARS ];\n\
			uniform vec2 u_charCoord[ MAX_CHARS ];\n\
			uniform mat3 u_transform;\n\
			uniform float u_pointSize;\n\
			void main() { \n\
				vec3 pos = a_vertex;\n\
				v_coord = a_vertex * 0.5 + vec2(0.5);\n\
				int char_index = (int)pos.z;\n\
				pos.z = 1.0;\n\
				pos.xz = pos.xz * u_pointSize + u_charPos[char_index];\n\
				pos = u_transform * pos;\n\
				pos.z = 0.0;\n\
				//normalize\n\
				pos.x = (2.0 * pos.x / u_viewport.x) - 1.0;\n\
				pos.y = -((2.0 * pos.y / u_viewport.y) - 1.0);\n\
				gl_Position = vec4(pos, 1.0); \n\
			}\n\
			";

	var TRIANGLE_TEXT_FRAGMENT_SHADER = "\n\
			precision highp float;\n\
			uniform sampler2D u_texture;\n\
			uniform float u_iCharSize;\n\
			uniform vec4 u_color;\n\
			uniform float u_pointSize;\n\
			uniform vec2 u_viewport;\n\
			varying vec2 v_coord;\n\
			void main() {\n\
				vec2 uv = vec2(1.0 - gl_PointCoord.s, 1.0 - gl_PointCoord.t);\n\
				uv = v_coord - uv * u_iCharSize + vec2(u_iCharSize*0.5);\n\
				uv.y = 1.0 - uv.y;\n\
				gl_FragColor = vec4(u_color.xyz, u_color.a * texture2D(u_texture, uv, -1.0  ).a);\n\
			}\n\
			";
	*/

    //text rendering
    var point_text_vertices = new Float32Array(max_characters * 3);
    var point_text_coords = new Float32Array(max_characters * 2);
    var point_text_mesh = new GL.Mesh();
    var point_text_vertices_buffer = point_text_mesh.createVertexBuffer(
        "vertices",
        null,
        null,
        point_text_vertices,
        gl.STREAM_DRAW
    );
    var point_text_coords_buffer = point_text_mesh.createVertexBuffer(
        "coords",
        null,
        null,
        point_text_coords,
        gl.STREAM_DRAW
    );

    ctx.fillText = ctx.strokeText = function (text, startx, starty) {
        if (text === null || text === undefined) return;
        if (text.constructor !== String) text = String(text);

        let pageWidth = 0;
        const { textures, info } = createFontAtlas.call(
            this,
            this._font_family,
            this._font_mode
        );
        // console.log("createFontAtlas: ", text, this._font_family, this._font_mode);

        const points = point_text_vertices;
        const coords = point_text_coords;
        const point_size = this._font_size * 1.1;

        if (point_size < 1) point_size = 1;

        let x = 0;
        let y = 0;
        const l = text.length;
        const spacing = info.spacing;
        const kernings = info.kernings;
        let is_first_char = true;

        let vertices_index = 0,
            coords_index = 0;

        let currentPage = -1; // 현재 페이지 추적

        // 이전 데이터를 렌더링하는 함수
        function renderCurrentBatch() {
            if (
                vertices_index === 0 ||
                coords_index === 0 ||
                currentPage === -1
            ) {
                return; // 데이터가 없으면 렌더링하지 않음
            }

            // 데이터 업로드
            point_text_vertices_buffer.uploadRange(0, vertices_index * 4);
            point_text_coords_buffer.uploadRange(0, coords_index * 4);

            // 셰이더 Uniform 설정
            uniforms.u_color = this._fillcolor;
            uniforms.u_pointSize = point_size * vec2.length(this._matrix);
            uniforms.u_iCharSize = info.char_size / pageWidth;
            uniforms.u_transform = this._matrix;
            uniforms.u_viewport = viewport;
            if (!uniforms.u_angle_sincos)
                uniforms.u_angle_sincos = vec2.create();
            const oldAngle = global_angle;
            global_angle = 0;
            uniforms.u_angle_sincos[1] = Math.sin(-global_angle);
            uniforms.u_angle_sincos[0] = -Math.cos(-global_angle);
            global_angle = oldAngle;

            // 셰이더 실행
            point_text_shader
                .uniforms(uniforms)
                .drawRange(point_text_mesh, gl.POINTS, 0, vertices_index / 3);

            // 인덱스 초기화
            vertices_index = 0;
            coords_index = 0;
        }

        for (let i = 0; i < l; i++) {
            const char_code = text.charCodeAt(i);

            // 페이지 번호와 문자 정보 가져오기
            const charInfo = info.pages[char_code];

            if (!charInfo) {
                if (char_code === 10) {
                    // 줄 바꿈 처리
                    x = 0;
                    y += point_size;
                    is_first_char = true;
                } else {
                    x += point_size * 0.5; // 유효하지 않은 문자 간격 처리
                }
                continue;
            }

            const [u, v, page, character] = charInfo;

            // 페이지가 변경되면 누적된 데이터를 렌더링
            if (page !== currentPage) {
                renderCurrentBatch.call(this); // 이전 데이터를 렌더링
                currentPage = page;

                // 새로운 페이지의 텍스처를 바인딩
                if (textures[page]) {
                    textures[page].bind(0);
                    pageWidth = textures[page].width;
                } else {
                    console.error(`Page ${page} not found in textures.`);
                    continue;
                }
            }

            // 커닝 정보 적용
            const kern = kernings[text[i]];
            if (is_first_char) {
                x -= point_size * (kern?.nwidth || 0) * 0.25;
                is_first_char = false;
            }

            // 버텍스 데이터 추가
            points[vertices_index + 0] = startx + x + point_size * 0.5;
            points[vertices_index + 1] = starty + y - point_size * 0.25;
            points[vertices_index + 2] = 1;
            vertices_index += 3;

            // UV 좌표 추가
            coords[coords_index + 0] = u;
            coords[coords_index + 1] = v;
            coords_index += 2;

            // 다음 문자 위치 계산
            const pair_kern = kernings[text[i + 1]]
                ? kernings[text[i + 1]].nwidth
                : spacing / info.char_size;
            x += point_size * pair_kern;
        }

        // 마지막 배치 데이터 렌더링
        renderCurrentBatch.call(this);

        // 텍스트 정렬 처리
        let offset = 0;
        if (this.textAlign === "right") offset = x + point_size * 0.5;
        else if (this.textAlign === "center")
            offset = (x + point_size * 0.5) * 0.5;
        if (offset) {
            for (let i = 0; i < vertices_index; i += 3) {
                points[i] -= offset;
            }
        }
        return { x: x, y: y };
    };

    ctx.measureText = function (text) {
        const { info } = createFontAtlas.call(
            this,
            this._font_family,
            this._font_mode
        );

        const point_size = Math.ceil(this._font_size * (info.line_height || 1));
        let textsize = 0;

        // 문자 간 기본 간격 계산
        const default_spacing = point_size * (info.spacing / info.char_size);

        for (let i = 0; i < text.length; ++i) {
            const charinfo = info.kernings[text[i]];

            if (charinfo) {
                textsize += charinfo.nwidth; // 커닝 정보 반영
            } else {
                textsize += default_spacing; // 기본 간격 추가
            }
        }

        textsize *= point_size; // 최종 텍스트 크기 계산

        // 결과 반환
        return { width: textsize, height: point_size };
    };

    ctx.cacheFontAtlas = function (
        fontname = "monospace",
        fontmode = "normal",
        force = false
    ) {
        const textureName = `:font_${fontname}:${fontmode}:${enableWebGLCanvas.useInternationalFont}`;

        // 이미 캐싱된 텍스처가 있으면 반환
        if (!force && textures[textureName]) {
            return textures[textureName];
        }

        // createFontAtlas를 내부에서 호출
        const fontAtlas = createFontAtlas.call(this, fontname, fontmode, force);
        textures[textureName] = fontAtlas;

        return fontAtlas;
    };

    ctx.loadCachedTextures = async function () {
        const cachedData = await getAllData();
        if (cachedData && cachedData?.length > 0) {
            for (let i in cachedData) {
                const item = cachedData[i];
                textures[item.name] = item;
            }
        }
    };

    function createFontAtlas(
        fontname = "monospace",
        fontmode = "normal",
        force = false
    ) {
        const textureName = `:font_${fontname}:${fontmode}:${enableWebGLCanvas.useInternationalFont}`;

        // 캐시된 텍스처가 있으면 반환
        if (!force && textures[textureName]) {
            return textures[textureName];
        }

        const clip = true; // 클리핑 활성화
        const useInternationalFont = enableWebGLCanvas.useInternationalFont;

        let canvasSize = 1024;
        let charsPerRow = 10; // 행당 문자 수
        let max_ascii_code = 200;

        if (useInternationalFont) {
            //more characters
            max_ascii_code = 0xd7a3;
            charsPerRow = 20;
            canvasSize = 2048;
        }

        const imageSmoothingEnabled = this.imageSmoothingEnabled;
        const charSize = Math.floor(canvasSize / charsPerRow);
        const fontSize = Math.floor(charSize * 0.95);

        let xoffset = 0.5;
        let yoffset = fontSize * -0.15;
        const texturesArray = []; // 텍스처를 저장할 배열
        const info = {
            font_size: fontSize,
            char_size: charSize,
            spacing: charSize * 0.6,
            space: null,
            kernings: {},
            pages: [],
        };

        const checkMarks = (charCode) => {
            return (
                (charCode >= 32 && charCode <= 47) || // !"#$%&'()*+,-./
                (charCode >= 58 && charCode <= 64) || // :;<=>?@
                (charCode >= 91 && charCode <= 96) || // [\]^_`
                (charCode >= 123 && charCode <= 126)
            );
        };

        const checkEn = (charCode) => {
            // 영어 대소문자
            return (
                (charCode >= 65 && charCode <= 90) || // A-Z
                (charCode >= 97 && charCode <= 122) // a-z
            );
        };

        // 유효한 문자를 필터링하는 함수
        const isValidCharacter = (charCode) =>
            // 영어 대소문자
            (charCode >= 65 && charCode <= 90) || // A-Z
            (charCode >= 97 && charCode <= 122) || // a-z
            // 숫자
            (charCode >= 48 && charCode <= 57) || // 0-9
            // 특수기호
            (charCode >= 32 && charCode <= 47) || // !"#$%&'()*+,-./
            (charCode >= 58 && charCode <= 64) || // :;<=>?@
            (charCode >= 91 && charCode <= 96) || // [\]^_`
            (charCode >= 123 && charCode <= 126) || // {|}~
            // 한글
            (charCode >= 0xac00 && charCode <= 0xd7a3) || // 한글 음절
            // 이모지
            (charCode >= 0x1f300 && charCode <= 0x1f6ff); // 일부 이모지 범위

        // 유효한 문자의 코드 포인트만 배열로 추출
        const validCharacters = [];
        for (let i = 32; i <= max_ascii_code; i++) {
            if (isValidCharacter(i)) {
                validCharacters.push(i);
            }
        }

        const maxPages = Math.ceil(
            validCharacters.length / (charsPerRow * charsPerRow)
        );

        for (let page = 0; page < maxPages; page++) {
            const canvas = createCanvas(canvasSize, canvasSize);
            const ctx = canvas.getContext("2d");

            ctx.fillStyle = "white";
            ctx.imageSmoothingEnabled = imageSmoothingEnabled;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${fontmode} ${fontSize}px ${fontname}`;
            ctx.textAlign = "center";

            let x = 0;
            let y = 0;

            const startCode = page * charsPerRow * charsPerRow;
            const endCode = Math.min(
                validCharacters.length,
                startCode + charsPerRow * charsPerRow
            );

            for (let i = startCode; i < endCode; i++) {
                const charCode = validCharacters[i];
                const character = String.fromCharCode(charCode);
                let charWidth = ctx.measureText(character).width;

                const isMark = checkMarks(charCode);
                if (isMark && charWidth < 50) {
                    charWidth *= 1.8;
                }

                // 커닝 데이터 저장
                info.kernings[character] = {
                    width: charWidth,
                    nwidth: charWidth / fontSize,
                };

                // UV 좌표와 페이지 번호 저장
                info.pages[charCode] = [
                    (x + charSize * 0.5) / canvas.width,
                    (y + charSize * 0.5) / canvas.height,
                    page,
                    character,
                ];

                if (clip) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(
                        Math.floor(x) + 0.5,
                        Math.floor(y) + 0.5,
                        charSize - 2,
                        charSize - 2
                    );
                    ctx.clip();
                    ctx.fillText(
                        character,
                        Math.floor(x + charSize * xoffset),
                        Math.floor(y + charSize + yoffset),
                        charSize
                    );
                    ctx.restore();
                } else {
                    ctx.fillText(
                        character,
                        Math.floor(x + charSize * xoffset),
                        Math.floor(y + charSize + yoffset),
                        charSize
                    );
                }

                x += charSize; // X 축 이동
                if (x + charSize > canvas.width) {
                    x = 0; // 다음 줄로 이동
                    y += charSize;
                }
            }

            // 텍스처 생성
            // 필터링 모드 / 작동 방식 / 주요 특징 / 장점 / 단점
            // NEAREST	가장 가까운 샘플 1개 선택	픽셀화(Pixelation)	매우 빠름	품질이 낮고 계단 현상 발생
            // LINEAR	4개 샘플을 선형 보간	부드러운 텍스처	품질 우수	비용이 더 높음
            // NEAREST_MIPMAP_NEAREST	가까운 MIPMAP 1개에서 가장 가까운 샘플	단계적(LOD) 변화, 빠름	빠른 성능	경계에서 깨짐 현상 발생
            // LINEAR_MIPMAP_NEAREST	가까운 MIPMAP 1개에서 선형 보간	부드러운 텍스처	품질 좋음	중간 정도의 계산 비용
            // NEAREST_MIPMAP_LINEAR	두 MIPMAP 수준에서 가장 가까운 샘플	MIPMAP 경계 부드러움	부드러운 품질	성능과 품질의 절충안
            // LINEAR_MIPMAP_LINEAR	두 MIPMAP 수준에서 선형 보간 후 보간	가장 부드럽고 고품질	최상의 품질	계산 비용 가장 높음
            const texture = GL.Texture.fromImage(canvas, {
                format: gl.RGBA,
                magFilter: gl.LINEAR,
                minFilter: gl.LINEAR_MIPMAP_LINEAR,
                premultiply_alpha: false,
                anisotropic: 1,
            });

            texturesArray.push(texture);
        }

        // 커닝 데이터 간격 처리
        // for (let i = 0; i < validCharacters.length; ++i) {
        //   const charCode = validCharacters[i];
        //   const character = String.fromCharCode(charCode);
        //   const kerning = info.kernings[character];
        //   const charWidth = kerning.width;

        //   for (let j = 0; j < validCharacters.length; ++j) {
        //     const otherCode = validCharacters[j];
        //     const other = String.fromCharCode(otherCode);
        //     const otherWidth = info.kernings[other].width;

        //     if (!otherWidth) continue;

        //     const totalWidth = ctx.measureText(character + other).width;
        //     kerning[other] =
        //       (totalWidth * 1.45 - charWidth - otherWidth) / fontSize;
        //   }
        // }

        // 공간 문자 처리
        info.space = info.kernings[" "]
            ? info.kernings[" "].width / fontSize
            : 0;

        // 캐시에 텍스처와 정보를 저장
        const textureData = {
            textures: texturesArray,
            info,
            name: textureName,
        };
        textures[textureName] = textureData;

        saveComplexData(textureData, 1);

        // debugTextures(texturesArray);
        return textures[textureName];
    }

    //NOT TESTED
    ctx.getImageData = function (x, y, w, h) {
        var buffer = new Uint8Array(w * h * 4);
        gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
        return { data: buffer, width: w, height: h, resolution: 1 };
    };

    ctx.putImageData = function (imagedata, x, y) {
        var tex = new GL.Texture(imagedata.width, imagedata.height, {
            filter: gl.NEAREST,
            pixel_data: imagedata.data,
        });
        tex.renderQuad(x, y, tex.width, tex.height);
    };

    Object.defineProperty(gl, "fillStyle", {
        get: function () {
            return this._fillStyle;
        },
        set: function (v) {
            if (!v) return;
            this._fillStyle = v;
            hexColorToRGBA(v, this._fillcolor, this._globalAlpha);
        },
    });

    Object.defineProperty(gl, "strokeStyle", {
        get: function () {
            return this._strokeStyle;
        },
        set: function (v) {
            if (!v) return;
            this._strokeStyle = v;
            hexColorToRGBA(v, this._strokecolor, this._globalAlpha);
        },
    });

    //shortcuts
    Object.defineProperty(gl, "fillColor", {
        get: function () {
            return this._fillcolor;
        },
        set: function (v) {
            if (!v) return;
            if (v.length < 5) this._fillcolor.set(v);
            else console.error("fillColor value has more than 4 components");
        },
    });

    Object.defineProperty(gl, "strokeColor", {
        get: function () {
            return this._strokecolor;
        },
        set: function (v) {
            if (!v) return;
            if (v.length < 5) this._strokecolor.set(v);
            else console.error("strokeColor value has more than 4 components");
        },
    });

    Object.defineProperty(gl, "shadowColor", {
        get: function () {
            return this._shadowcolor;
        },
        set: function (v) {
            if (!v) return;
            hexColorToRGBA(v, this._shadowcolor, this._globalAlpha);
        },
    });

    Object.defineProperty(gl, "globalAlpha", {
        get: function () {
            return this._globalAlpha;
        },
        set: function (v) {
            this._globalAlpha = v;
            this._strokecolor[3] = this._fillcolor[3] = v;
        },
    });

    Object.defineProperty(gl, "globalCompositeOperation", {
        get: function () {
            return this._globalCompositeOperation;
        },
        set: function (v) {
            this._globalCompositeOperation = v;
            gl.blendEquation(gl.FUNC_ADD);
            //gl.blendEquationSeparate( );
            switch (v) {
                case "source-over":
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    break;
                case "difference":
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    gl.blendEquation(gl.FUNC_REVERSE_SUBTRACT);
                    break;
            }
        },
    });

    Object.defineProperty(gl, "font", {
        get: function () {
            return this._font;
        },
        set: function (v) {
            this._font = v;

            var t = v.split(" ");
            if (t.length >= 3) {
                this._font_mode = t[0];
                this._font_size = parseFloat(t[1]);
                if (Number.isNaN(this._font_size)) this._font_size = 14;
                // 최소 포인트를 5로 설정
                if (this._font_size < 5) this._font_size = 5;
                this._font_family = t[2];
            } else if (t.length == 2) {
                this._font_mode = "normal";
                this._font_size = parseFloat(t[0]);
                if (Number.isNaN(this._font_size)) this._font_size = 14;
                // 최소 포인트를 5로 설정
                if (this._font_size < 5) this._font_size = 5;
                this._font_family = t[1];
            } else {
                this._font_mode = "normal";
                this._font_family = t[0];
            }

            // 강제로 폰트를 설정 *** "Notosans Poppins Arial sans-serif";
            // this._font_family = "Notosans";
        },
    });

    //define globals
    ctx._fillcolor = vec4.fromValues(0, 0, 0, 1);
    ctx._strokecolor = vec4.fromValues(0, 0, 0, 1);
    ctx._shadowcolor = vec4.fromValues(0, 0, 0, 0);
    ctx._globalAlpha = 1;
    ctx._font = "14px monospace";
    ctx._font_family = "monospace";
    ctx._font_size = "14px";
    ctx._font_mode = "normal";

    //STATE
    ctx.clip_level = 0;
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.shadowColor = "transparent";
    ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.setLineWidth = ctx.lineWidth; //save the webgl function
    ctx.lineWidth = 4; //set lineWidth as a number
    ctx.imageSmoothingEnabled = true;
    ctx.tintImages = false; //my own parameter

    //empty functions: this is used to create null functions in those Canvas2D funcs not implemented here
    var names = ["arcTo", "isPointInPath", "createImageData"]; //all functions have been implemented
    var null_func = function () {};
    for (var i in names) ctx[names[i]] = null_func;

    return ctx;
}

export function debugTextures(texturesArray) {
    const debugContainer = document.createElement("div");
    debugContainer.style.display = "flex";
    debugContainer.style.flexWrap = "wrap";
    debugContainer.style.gap = "10px";
    debugContainer.style.marginTop = "20px";
    debugContainer.style.position = "absolute";
    debugContainer.style.left = "200px";

    texturesArray.forEach((texture, index) => {
        const textureCanvas = document.createElement("canvas");
        textureCanvas.width = texture.width;
        textureCanvas.height = texture.height;

        const ctx = textureCanvas.getContext("2d");

        // 텍스처의 Y축 반전을 적용하여 렌더링
        ctx.translate(0, textureCanvas.height); // 캔버스의 기준점을 아래로 이동
        ctx.scale(1, -1); // Y축 반전
        ctx.drawImage(texture.toCanvas(), 0, 0); // 텍스처를 캔버스에 렌더링

        const label = document.createElement("div");
        label.textContent = `Page ${index}`;
        label.style.textAlign = "center";

        const wrapper = document.createElement("div");
        wrapper.style.display = "inline-block";
        wrapper.style.textAlign = "center";
        wrapper.appendChild(textureCanvas);
        wrapper.appendChild(label);

        debugContainer.appendChild(wrapper);
    });

    document.body.appendChild(debugContainer);
}

export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("WebglContextDB", 2); // fontTexture 이름을 바꾸면 버전을 증가 시켜야 함
        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames?.contains("fontTexture")) {
                db.createObjectStore("fontTexture", { keyPath: "name" }); // id를 키로 사용
            }
        };

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };

        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

/**
 * load 할때 사용.
 * base64 -> blob -> image -> texture
 */
export async function makeTexture(textureContainer) {
    const blob = base64ToBlob(textureContainer.data);
    const img = await blobToImage(blob);

    const texture = GL.Texture.fromImage(img);

    // 텍스처 속성 복원
    texture.wrapS = textureContainer.wrapS || texture.gl.CLAMP_TO_EDGE;
    texture.wrapT = textureContainer.wrapT || texture.gl.CLAMP_TO_EDGE;
    texture.minFilter = textureContainer.minFilter || texture.gl.LINEAR;
    texture.magFilter = textureContainer.magFilter || texture.gl.LINEAR;

    // 텍스처 포맷 복원
    texture.format = textureContainer.format || texture.format;
    texture.internalFormat =
        textureContainer.internalFormat || texture.internalFormat;
    texture.type = textureContainer.type || texture.type;
    texture.texture_type =
        textureContainer.texture_type || texture.texture_type;

    // 텍스처 크기 복원
    texture.width = textureContainer.width || texture.width;
    texture.height = textureContainer.height || texture.height;

    // mipmap 상태 복원
    // if (textureContainer.has_mipmaps) {
    //   texture.generateMipmaps(); // Mipmaps 재생성
    // } else {
    //   texture.has_mipmaps = false; // Mipmap 사용 안 함
    // }

    textureContainer = texture;
    return textureContainer;
}

//  base64 -> blob
export function base64ToBlob(base64) {
    const byteString = atob(base64.split(",")[1]); // Base64 디코딩
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0]; // MIME 타입 추출

    const byteNumbers = new Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        byteNumbers[i] = byteString.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeString });
}

// blob -> image
export function blobToImage(blob) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
    });
}

/**
 * save 할때 사용.
 * texture -> base64
 */
export function textureToBase64(glTexture) {
    const gl = glTexture.gl; // WebGL 컨텍스트
    const texture = glTexture.handler; // WebGL 텍스처
    const width = glTexture.width;
    const height = glTexture.height;

    // 프레임버퍼 생성 및 텍스처 바인딩
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture, // WebGL 텍스처 바인딩
        0
    );

    // 프레임버퍼 상태 확인
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        console.error("Framebuffer is not complete.");
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.deleteFramebuffer(framebuffer);
        return null;
    }

    // 픽셀 데이터를 읽기
    const pixels = new Uint8Array(width * height * 4); // RGBA 데이터
    const format = glTexture.format || gl.RGBA;
    const type = glTexture.type || gl.UNSIGNED_BYTE;

    try {
        gl.readPixels(0, 0, width, height, format, type, pixels);
    } catch (error) {
        console.error("Error reading pixels from framebuffer:", error);
        return null;
    }
    // Canvas에 데이터 쓰기
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(width, height);

    // 데이터 복사 및 좌표계 반전
    for (let y = 0; y < height; y++) {
        const sourceRow = y * width * 4;
        const targetRow = (height - y - 1) * width * 4; // WebGL 좌표계를 반전
        imageData.data.set(
            pixels.subarray(sourceRow, sourceRow + width * 4),
            targetRow
        );
    }

    ctx.putImageData(imageData, 0, 0);

    // Base64 데이터 URI 생성
    const base64Data = canvas.toDataURL("image/png");

    // 프레임버퍼 정리
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(framebuffer);

    return base64Data; // Base64 데이터 반환
}

/**
 * 데이터를 IndexedDB에 저장
 * @param {object} data texture, kernings
 * @param {number} expiryInDays 업데이트 주기
 */
export async function saveComplexData(data, expiryInDays = 1) {
    try {
        const db = await openDatabase();
        const transaction = db.transaction("fontTexture", "readwrite");
        const store = transaction.objectStore("fontTexture");

        // File 배열을 Base64로 변환
        const promises = data.textures?.map((textureContainer) => {
            const {
                width,
                height,
                format,
                internalFormat,
                type,
                wrapS,
                wrapT,
                minFilter,
                magFilter,
                has_mipmaps,
                texture_type,
            } = textureContainer;

            // 텍스처 데이터를 Base64로 변환
            const base64Data = textureToBase64(textureContainer);

            return {
                width,
                height,
                format,
                internalFormat,
                type,
                wrapS,
                wrapT,
                minFilter,
                magFilter,
                has_mipmaps,
                texture_type,
                data: base64Data, // 텍스처 데이터
            };
        });

        const base64Files = promises;

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiryInDays); // 현재 날짜 + 유효 기간(일)

        const dataToStore = {
            info: data.info,
            textures: base64Files, // Null 값 제거
            name: data.name,
            expiresAt: expiresAt.toISOString(),
        };
        const request = store.put(dataToStore); // IndexedDB에 저장
        request.onsuccess = function () {
            // console.log("Data saved successfully!");
        };
        request.onerror = function (error) {
            console.error("Error saving data:", error);
        };
    } catch (error) {
        console.error("Error in saveComplexData:", error);
    }
}

/**
 * IndexedDB에 저장된 정보를 모두 가져오기
 * @returns {Array<data>} 데이터 배열
 */
export async function getAllData() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("fontTexture", "readwrite");
        const store = transaction.objectStore("fontTexture");

        const request = store.getAll();
        request.onsuccess = async function (event) {
            const data = event.target.result;
            const filtered = data.filter((item) => {
                const now = new Date();
                const expiresAt = new Date(item.expiresAt);
                if (now < expiresAt) {
                    // 만료된 데이터
                    return true;
                }

                // 삭제
                store.delete(item.name);
                return false;
            });

            if (filtered?.length === 0) {
                resolve([]);
                return;
            }

            // console.log("Data retrieved: ", filtered);
            // textures 배열을 복원
            for (const item of filtered) {
                item.textures = await Promise.all(
                    item.textures.map(async (textureContainer) => {
                        return makeTexture(textureContainer); // 복원 함수 호출
                    })
                );
            }

            resolve(filtered); // 복원된 데이터를 반환
        };

        request.onerror = function (event) {
            console.error("Error retrieving data:", event.target.error);
            reject(event.target.error);
        };
    });
}

enableWebGLCanvas.useInternationalFont = true; //render as much characters as possible in the texture atlas
enableWebGLCanvas.fontOffsetY = 0; //hack, some fonts need extra offsets, dont know why
