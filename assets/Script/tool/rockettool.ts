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
            this.player.getComponent("Player").anim.play("rocket");
            cc.director.getPhysicsManager().enabled = false;
            other.node.runAction(cc.moveBy(2.5, cc.v2(0, 2000)).easing(cc.easeCubicActionInOut()));
            self.node.active = false;
            this.scheduleOnce(function () {
                cc.director.getPhysicsManager().enabled = true;
                this.player.getComponent("Player").setmode("unshield");
            }, 2.5);
        }
      }
}
