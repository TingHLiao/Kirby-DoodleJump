const {ccclass, property} = cc._decorator;

@ccclass
export default class RocketTool extends cc.Component {

    @property({ type: cc.AudioClip })
    soundEffect: cc.AudioClip = null;

    player: cc.Node;

    onLoad () {
        this.player = cc.find("Canvas/player");
    }

    // start () {

    // }

    onBeginContact(contact, self, other) {
        if(other.tag === 0){
            contact.disabled = true;
            if(this.player.getComponent("Player").isDied) return;
            var rocketid = cc.audioEngine.playEffect(this.soundEffect, false);
            cc.audioEngine.setVolume(rocketid, 0.35)
            this.player.getComponent("Player").setmode("rocket");
            
            let state = this.player.getComponent("Player").get_state();
            switch(state){
                case 0:{
                    this.player.getComponent("Player").anim.play("rocket");
                    break;
                }
                case 1: {
                    this.player.getComponent("Player").anim.play("snow_rocket");
                    break;
                }
                case 2: {
                    this.player.getComponent("Player").anim.play("ninja_rocket");
                    break;
                }
                case 3: {
                    this.player.getComponent("Player").anim.play("magic_rocket");
                    break;
                }
                case 4: {
                    this.player.getComponent("Player").anim.play("knight_rocket");
                    break;
                }
                default: {
                    this.player.getComponent("Player").anim.play("rocket");
                    break;
                }
            }
           
            cc.director.getPhysicsManager().enabled = false;
            other.node.runAction(cc.moveBy(2.5, cc.v2(0, 2000)).easing(cc.easeQuadraticActionInOut()));
            self.node.active = false;
            this.scheduleOnce(function () {
                cc.director.getPhysicsManager().enabled = true;
                this.player.getComponent("Player").setmode("unrocket");
            }, 2.5);
        }
      }
}
