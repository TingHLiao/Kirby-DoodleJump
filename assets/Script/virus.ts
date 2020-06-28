// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class virus extends cc.Component {

    private anim = null;

    private jumpvelocity : number = 1000;

    private isDead: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;   
        this.anim = this.getComponent(cc.Animation);
    }

    start () {
        if(this.node.name == "virus_red1"){
            this.anim.play("virus_red1");
            this.virus_r1_move();
        }
    }

    //update (dt) {}

    private virus_r1_move(){
        let moveup = cc.moveBy(2, 0, 15);
        let movedown = cc.moveBy(2, 0, -15);
        this.node.runAction(cc.repeatForever(cc.sequence(moveup, movedown)));
    }

    onBeginContact(contact, self, other){
        if(this.isDead){
            contact.disable = true;
            return;
        }
        if(other.tag == 0){
            if(contact.getWorldManifold().normal.y == 1) {
                other.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.jumpvelocity);
                this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -500);
                this.scheduleOnce(()=>{
                    this.node.destroy();
                }, 1)
            }
        } else if(other.tag == 8 || other.tag == 10){
            other.node.destroy();
            this.node.getComponent(cc.PhysicsCircleCollider).enabled = false;
            this.isDead = true;   
            this.anim.play("virus_die");
            this.scheduleOnce(()=>{
                this.node.destroy();
            }, 1)
        }
    }
}
