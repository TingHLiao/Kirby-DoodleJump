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
            
            let state = this.player.getComponent("Player").get_state();
            if(state == 0) this.player.getComponent("Player").anim.play("rocket");
            else if(state == 1) this.player.getComponent("Player").anim.play("snow_rocket");

            cc.director.getPhysicsManager().enabled = false;
            other.node.runAction(cc.moveBy(2.5, cc.v2(0, 2000)).easing(cc.easeQuadraticActionInOut()));
            self.node.active = false;
            this.scheduleOnce(function () {
                cc.director.getPhysicsManager().enabled = true;
                this.player.getComponent("Player").setmode("unshield");
            }, 2.5);
        }
      }
}
