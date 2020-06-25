const {ccclass, property} = cc._decorator;

@ccclass
export default class ShieldTool extends cc.Component {

    @property(cc.Prefab)
    shield: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onBeginContact(contact, self, other) {
        if(other.tag === 0){
            contact.disabled = true;
            var newnode = cc.instantiate(this.shield);
            other.node.addChild(newnode);
            self.node.destroy();
        }
      }
}
