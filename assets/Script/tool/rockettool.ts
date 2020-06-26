const {ccclass, property} = cc._decorator;

@ccclass
export default class RocketTool extends cc.Component {

    @property({ type: cc.AudioClip })
    soundEffect: cc.AudioClip = null;

    player: cc.Node;

    onLoad () {
        this.player = cc.find("Canvas/player");
    }

    start () {

    }

    onBeginContact(contact, self, other) {
        if(other.tag === 0){
            contact.disabled = true;
            cc.audioEngine.playEffect(this.soundEffect, false);
            this.player.getComponent("Player").setmode("rocket");
            //other.anim.play("rocket");
            other.node.runAction(cc.moveBy(4, cc.v2(0, 3000)).easing(cc.easeCubicActionOut()));
            self.node.active = false;
            this.scheduleOnce(function () {
                this.player.getComponent("Player").setmode("unshield");
            }, 4);
        }
      }
}
