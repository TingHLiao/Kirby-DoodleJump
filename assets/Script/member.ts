const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {

    private anim = null; 
    private pos = 1;
    private left: boolean = false;
    private right: boolean = false;
    

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        this.anim = this.getComponent(cc.Animation);
    }

    start () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown(event) {
        if(event.keyCode == cc.macro.KEY.left) {
            if(this.pos == 0)
                return;
            this.node.x -= 200;
            this.pos -= 1;
        } else if(event.keyCode == cc.macro.KEY.right) {
            if(this.pos == 2)
                return;
            this.node.x += 200;
            this.pos += 1;
        } 
    }

    onBeginContact(contact, self, other){
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 1000);
    }
}
