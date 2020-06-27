const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
    player: cc.Node = null;
    camera: cc.Node = null;

    onLoad () {
        this.player = cc.find("Canvas/player");
        this.camera = cc.find("Canvas/Main Camera");
    }

    start () {

    }

    update (dt) {
        if((this.node.x > 480 || this.node.x < -480 || this.node.y - this.camera.y > 320 || this.node.y - this.camera.y < -320)){
            this.node.destroy();
        }
    }
}
