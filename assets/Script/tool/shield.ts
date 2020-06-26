import Player_shield from "../player";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Shield extends cc.Component {
    player: cc.Node;

    onLoad () {
        this.player = cc.find("Canvas/player");
    }

    start () {
        this.scheduleOnce(function () {
            this.node.runAction(cc.blink(1.5, 10));
            this.scheduleOnce(function () {
                this.player.getComponent("Player").setmode("unshield");
                this.node.removeFromParent();
            }, 1.6);
        }, 5);
    }
}
