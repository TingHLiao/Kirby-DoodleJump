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
export default class magicbomb extends cc.Component {

    private anim = null;

    private camera : cc.Node = null;

    @property({type:cc.AudioClip})
    BombEffect: cc.AudioClip = null;

    onLoad () {
        this.anim = this.getComponent(cc.Animation);
        this.camera = cc.find("Canvas/Main Camera");
    }

    start () {

    }

    update (dt) {
        if((this.node.x > 480 || this.node.x < -480 || this.node.y - this.camera.y > 320 || this.node.y - this.camera.y < -320)){
            this.node.destroy();
        }
    }

    onBeginContact(contact, self, other){
        if((other.tag == 1 || other.tag == 4 || other.tag == 5) && contact.getWorldManifold().normal.y == -1){
           if(other.tag == 1){
                this.anim.play("bomb_explode");
                cc.audioEngine.playEffect(this.BombEffect, false);
                this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
                this.scheduleOnce(()=>{
                    this.node.destroy();
                    if(other.node.isValid) other.node.destroy();
                },0.27)
           }
           else{
                this.anim.play("bomb_explode");
                cc.audioEngine.playEffect(this.BombEffect, false);
                this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
                this.scheduleOnce(()=>{
                    this.node.destroy();
                    if(other.node.isValid) other.node.parent.destroy();
                },0.27)
           }
       }
       else{
           contact.disabled = true;
       }
    }
}
