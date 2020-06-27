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
export default class knife extends cc.Component {

    
    player: cc.Node = null;

    camera: cc.Node = null;

    private NeedDestroy: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.player = cc.find("Canvas/player");
        this.camera = cc.find("Canvas/Main Camera");
        this.NeedDestroy = false;
    }

    start () {

    }

    update (dt) {
        if((this.node.x > 480 || this.node.x < -480 || this.node.y - this.camera.y > 320 || this.node.y - this.camera.y < -320) && !this.NeedDestroy){
            this.NeedDestroy = true;
            this.des();
        }
    }

    des(){
        this.node.destroy();
    }

}
