const { ccclass, property } = cc._decorator;

@ccclass
export default class Trampoline extends cc.Component {
    @property(cc.AudioClip)
    soundEffect: cc.AudioClip = null;

    private springVelocity: number = 1500;

    start() {

    }

    update(dt) {

    }

    onBeginContact(contact, self, other) {
    if(contact.getWorldManifold().normal.y !== 1){
        contact.disabled = true;
        return;
    }
    if(other.tag === 0){
        this.node.height *= 1.4;
        cc.audioEngine.playEffect(this.soundEffect, false);
        other.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.springVelocity);
        this.scheduleOnce(function () {
            this.node.height = 20;
        }, 2);
    }
  }
}
