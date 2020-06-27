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

    private startx : number = 0;

    private starty : number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.player = cc.find("Canvas/player");
        this.camera = cc.find("Canvas/Main Camera");
        this.NeedDestroy = false;
    }

    start () {
        this.startx = this.node.x;
        this.starty = this.node.y;
    }

    update (dt) {
        if((this.node.x > this.startx + 240 || this.node.x < this.startx - 240 || this.node.y - this.starty > 160 || this.node.y - this.starty < -160) && !this.NeedDestroy){
            this.NeedDestroy = true;
            this.des();
        }
    }

    des(){
        this.node.destroy();
    }

}
