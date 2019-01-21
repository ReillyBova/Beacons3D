// Grid node class
function GridNode() {
    this.type = 'GridNode';
    this.geometry = new THREE.BoxGeometry( 540, 540, 14 );
    this.material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );

    THREE.Mesh.call( this, this.geometry, this.material );
}

CustomObject.prototype = Object.create( THREE.Mesh.prototype );
CustomObject.prototype.constructor = CustomObject;

CustomObject.prototype.getMesh = function() {

    return this.mesh;

}
