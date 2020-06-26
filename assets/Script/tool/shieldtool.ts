const {ccclass, property} = cc._decorator;

@ccclass
export default class ShieldTool extends cc.Component {

    @property({ type: cc.AudioClip })
    soundEffect: cc.AudioClip = null;
    
    @property(cc.Prefab)
    shield: cc.Prefab = null;

    player: cc.Node;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.player = cc.find("Canvas/player");
    }

    start () {

    }

    onBeginContact(contact, self, other) {
        if(other.tag === 0){
            contact.disabled = true;
            this.player.getComponent("Player").setmode("shield");
            cc.audioEngine.playEffect(this.soundEffect, false);
            var newnode = cc.instantiate(this.shield);
            other.node.addChild(newnode);
            self.node.destroy();
        }
      }
}
