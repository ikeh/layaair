package laya.d3.core.particleShuriKen.module.shape {
	import laya.d3.core.render.RenderState;
	import laya.d3.math.Vector3;
	
	/**
	 * <code>SphereShape</code> 类用于创建球形粒子形状。
	 */
	public class SphereShape extends BaseShape {
		/**发射器半径。*/
		public var radius:Number;
		/**从外壳发射。*/
		public var emitFromShell:Boolean;
		/**随机方向。*/
		public var randomDirection:Boolean;
		
		/**
		 * 创建一个 <code>SphereShape</code> 实例。
		 */
		public function SphereShape() {
			super();
			radius = 1.0;
			emitFromShell = false;
			randomDirection = false;
		}
		
		/**
		 *  用于生成粒子初始位置和方向。
		 * @param	position 粒子位置。
		 * @param	direction 粒子方向。
		 */
		override public function generatePositionAndDirection(position:Vector3, direction:Vector3):void {
			if (emitFromShell)
				ShapeUtils._randomPointUnitSphere(position);
			else
				ShapeUtils._randomPointInsideUnitSphere(position);
			
			Vector3.scale(position, radius, position);
			
			if (randomDirection) {
				ShapeUtils._randomPointUnitSphere(direction);
			} else {
				position.cloneTo(direction);
			}
		}
	}

}