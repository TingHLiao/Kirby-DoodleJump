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

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;   
        this.anim = this.getComponent(cc.Animation);
    }

    start () {
        if(this.node.name == "virus_r1"){
            this.anim.play("virus_r1");
            this.virus_r1_move();
        }
    }

    //update (dt) {}

    private virus_r1_move(){
        let moveup = cc.moveTo(6, this.node.position.x, 15);
        let movedown = cc.moveTo(6, this.node.position.x, -15);
        this.node.runAction(cc.repeatForever(cc.sequence(moveup, movedown)));
    }
}
