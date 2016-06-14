
(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

	var Render=laya.renders.Render,Matrix=laya.maths.Matrix,Color=laya.utils.Color,RunDriver=laya.utils.RunDriver;
	var SubmitCMD=laya.webgl.submit.SubmitCMD,Filter=laya.filters.Filter,Browser=laya.utils.Browser,Sprite=laya.display.Sprite;
	var Value2D=laya.webgl.shader.d2.value.Value2D,Rectangle=laya.maths.Rectangle,RenderContext=laya.renders.RenderContext;
	var ShaderDefines2D=laya.webgl.shader.d2.ShaderDefines2D,SubmitCMDScope=laya.webgl.submit.SubmitCMDScope;
	var FilterActionGL=laya.filters.webgl.FilterActionGL,RenderTarget2D=laya.webgl.resource.RenderTarget2D,Texture=laya.resource.Texture;
	var BlendMode=laya.webgl.canvas.BlendMode,ColorFilterActionGL=laya.filters.webgl.ColorFilterActionGL,ColorFilterAction=laya.filters.ColorFilterAction;
	/**
	*默认的FILTER,什么都不做
	*@private
	*/
	//class laya.filters.FilterAction
	var FilterAction=(function(){
		function FilterAction(){
			this.data=null;
		}

		__class(FilterAction,'laya.filters.FilterAction');
		var __proto=FilterAction.prototype;
		Laya.imps(__proto,{"laya.filters.IFilterAction":true})
		__proto.apply=function(data){
			return null;
		}

		return FilterAction;
	})()


	/**
	*@private
	*/
	//class laya.filters.WebGLFilter
	var WebGLFilter=(function(){
		function WebGLFilter(){};
		__class(WebGLFilter,'laya.filters.WebGLFilter');
		WebGLFilter.enable=function(){
			if (WebGLFilter.isInit)return;
			WebGLFilter.isInit=true;
			if (!Render.isWebGL)return;
			RunDriver.createFilterAction=function (type){
				var action;
				switch (type){
					case /*laya.filters.Filter.COLOR*/0x20:
						action=new ColorFilterActionGL();
						break ;
					case /*laya.filters.Filter.BLUR*/0x10:
						action=new BlurFilterActionGL();
						break ;
					case /*laya.filters.Filter.GLOW*/0x08:
						action=new GlowFilterActionGL();
						break ;
					}
				return action;
			}
		}

		WebGLFilter.isInit=false;
		WebGLFilter.__init$=function(){
			BlurFilterActionGL;
			ColorFilterActionGL;
			GlowFilterActionGL;
			Render;
			RunDriver;{
				RunDriver.createFilterAction=function (type){
					var action;
					switch (type){
						case /*laya.filters.Filter.BLUR*/0x10:
							action=new FilterAction();
							break ;
						case /*laya.filters.Filter.GLOW*/0x08:
							action=new FilterAction();
							break ;
						case /*laya.filters.Filter.COLOR*/0x20:
							action=new ColorFilterAction();
							break ;
						}
					return action;
				}
			}
		}

		return WebGLFilter;
	})()


	/**
	*模糊滤镜
	*/
	//class laya.filters.BlurFilter extends laya.filters.Filter
	var BlurFilter=(function(_super){
		function BlurFilter(strength){
			this.strength=NaN;
			BlurFilter.__super.call(this);
			(strength===void 0)&& (strength=4);
			if (Render.isWebGL)WebGLFilter.enable();
			this.strength=strength;
			this._action=RunDriver.createFilterAction(0x10);
			this._action.data=this;
		}

		__class(BlurFilter,'laya.filters.BlurFilter',_super);
		var __proto=BlurFilter.prototype;
		/**
		*@private
		*当前滤镜对应的操作器
		*/
		__getset(0,__proto,'action',function(){
			return this._action;
		});

		/**
		*@private
		*当前滤镜的类型
		*/
		__getset(0,__proto,'type',function(){
			return 0x10;
		});

		return BlurFilter;
	})(Filter)


	/**
	*发光滤镜(也可以当成阴影滤使用）
	*/
	//class laya.filters.GlowFilter extends laya.filters.Filter
	var GlowFilter=(function(_super){
		function GlowFilter(color,blur,offX,offY){
			this._color=null;
			GlowFilter.__super.call(this);
			this._elements=new Float32Array(9);
			(blur===void 0)&& (blur=4);
			(offX===void 0)&& (offX=6);
			(offY===void 0)&& (offY=6);
			if (Render.isWebGL){
				WebGLFilter.enable();
			}
			this._color=new Color(color);
			this.blur=blur;
			this.offX=offX;
			this.offY=offY;
			this._action=RunDriver.createFilterAction(0x08);
			this._action.data=this;
		}

		__class(GlowFilter,'laya.filters.GlowFilter',_super);
		var __proto=GlowFilter.prototype;
		/**@private */
		__proto.getColor=function(){
			return this._color._color;
		}

		/**
		*滤镜类型
		*/
		__getset(0,__proto,'type',function(){
			return 0x08;
		});

		/**@private */
		__getset(0,__proto,'action',function(){
			return this._action;
		});

		/**@private */
		/**@private */
		__getset(0,__proto,'offX',function(){
			return this._elements[5];
			},function(value){
			this._elements[5]=value;
		});

		/**@private */
		/**@private */
		__getset(0,__proto,'offY',function(){
			return this._elements[6];
			},function(value){
			this._elements[6]=value;
		});

		/**@private */
		/**@private */
		__getset(0,__proto,'blur',function(){
			return this._elements[4];
			},function(value){
			this._elements[4]=value;
		});

		return GlowFilter;
	})(Filter)


	/**
	*@private
	*/
	//class laya.filters.webgl.BlurFilterActionGL extends laya.filters.webgl.FilterActionGL
	var BlurFilterActionGL=(function(_super){
		function BlurFilterActionGL(){
			this.data
			BlurFilterActionGL.__super.call(this);
		}

		__class(BlurFilterActionGL,'laya.filters.webgl.BlurFilterActionGL',_super);
		var __proto=BlurFilterActionGL.prototype;
		__proto.setValueMix=function(shader){
			shader.defines.add(this.data.type);
			var o=shader;
		}

		__proto.apply3d=function(scope,sprite,context,x,y){
			var b=scope.getValue("bounds");
			var shaderValue=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
			shaderValue.setFilters([this.data]);
			var tMatrix=Matrix.EMPTY;
			tMatrix.identity();
			context.ctx.drawTarget(scope,0,0,b.width,b.height,Matrix.EMPTY,"src",shaderValue);
			shaderValue.setFilters(null);
		}

		__proto.setValue=function(shader){
			shader.strength=this.data.strength;
		}

		__getset(0,__proto,'typeMix',function(){return /*laya.filters.Filter.BLUR*/0x10;});
		return BlurFilterActionGL;
	})(FilterActionGL)


	/**
	*@private
	*/
	//class laya.filters.webgl.GlowFilterActionGL extends laya.filters.webgl.FilterActionGL
	var GlowFilterActionGL=(function(_super){
		function GlowFilterActionGL(){
			this.data=null;
			this._initKey=false;
			this._textureWidth=0;
			this._textureHeight=0;
			GlowFilterActionGL.__super.call(this);
		}

		__class(GlowFilterActionGL,'laya.filters.webgl.GlowFilterActionGL',_super);
		var __proto=GlowFilterActionGL.prototype;
		Laya.imps(__proto,{"laya.filters.IFilterActionGL":true})
		__proto.setValueMix=function(shader){}
		__proto.apply3d=function(scope,sprite,context,x,y){
			var b=scope.getValue("bounds");
			var w=b.width,h=b.height;
			this._textureWidth=w;
			this._textureHeight=h;
			var submit=SubmitCMD.create([scope,sprite,context,0,0],GlowFilterActionGL.tmpTarget);
			context.ctx.addRenderObject(submit);
			var shaderValue;
			var mat=Matrix.TEMP;
			mat.identity();
			shaderValue=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
			shaderValue.setFilters([this.data]);
			context.ctx.drawTarget(scope,0,0,this._textureWidth,this._textureHeight,mat,"src",shaderValue,null,BlendMode.TOINT.overlay);
			submit=SubmitCMD.create([scope,sprite,context,0,0],GlowFilterActionGL.startOut);
			context.ctx.addRenderObject(submit);
			shaderValue=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
			context.ctx.drawTarget(scope,0,0,this._textureWidth,this._textureHeight,mat,"tmpTarget",shaderValue,Texture.INV_UV,BlendMode.TOINT.overlay);
			shaderValue=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
			context.ctx.drawTarget(scope,0,0,this._textureWidth,this._textureHeight,mat,"src",shaderValue);
			submit=SubmitCMD.create([scope,sprite,context,0,0],GlowFilterActionGL.recycleTarget);
			context.ctx.addRenderObject(submit);
			return null;
		}

		__proto.setSpriteWH=function(sprite){
			this._textureWidth=sprite.width;
			this._textureHeight=sprite.height;
		}

		__proto.setValue=function(shader){
			shader.u_offsetX=this.data.offX;
			shader.u_offsetY=-this.data.offY;
			shader.u_strength=1.0;
			shader.u_blurX=this.data.blur;
			shader.u_blurY=this.data.blur;
			shader.u_textW=this._textureWidth;
			shader.u_textH=this._textureHeight;
			shader.u_color=this.data.getColor();
		}

		__getset(0,__proto,'typeMix',function(){return /*laya.filters.Filter.GLOW*/0x08;});
		GlowFilterActionGL.tmpTarget=function(scope,sprite,context,x,y){
			var b=scope.getValue("bounds");
			var out=scope.getValue("out");
			out.end();
			var tmpTarget=RenderTarget2D.create(b.width,b.height);
			tmpTarget.start();
			tmpTarget.clear(0,0,0,0);
			scope.addValue("tmpTarget",tmpTarget);
		}

		GlowFilterActionGL.startOut=function(scope,sprite,context,x,y){
			var tmpTarget=scope.getValue("tmpTarget");
			tmpTarget.end();
			var out=scope.getValue("out");
			out.start();
			out.clear(0,0,0,0);
		}

		GlowFilterActionGL.recycleTarget=function(scope,sprite,context,x,y){
			var src=scope.getValue("src");
			var tmpTarget=scope.getValue("tmpTarget");
			tmpTarget.recycle();
		}

		return GlowFilterActionGL;
	})(FilterActionGL)


	Laya.__init([WebGLFilter]);
})(window,document,Laya);
