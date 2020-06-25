const {ccclass, property} = cc._decorator;

@ccclass
export default class ShieldTool extends cc.Component {

    @property({ type: cc.AudioClip })
    soundEffect: cc.AudioClip = null;
    
    @property(cc.Prefab)
    shield: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onBeginContact(contact, self, other) {
        if(other.tag === 0){
            contact.disabled = true;
            cc.audioEngine.playEffect(this.soundEffect, false);
            var newnode = cc.instantiate(this.shield);
            other.node.addChild(newnode);
            self.node.destroy();
        }
      }
}
