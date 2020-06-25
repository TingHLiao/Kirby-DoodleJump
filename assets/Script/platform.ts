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
export default class platform extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        if(this.node.name == "normal_basic"){
            
        }
        else if(this.node.name == "move_basic"){
            let dir = (Math.random() > 0.5) ? "v" : "h"; // choose move vertical or horizontal
            if(dir == 'v') this.platformmove_v();
            else this.platformmove_h();
        }
        else if(this.node.name == "time_basic"){

        }
        else if(this.node.name == "break_basic"){
            
        }
    }

    private platformmove_v(){
        let easeRate: number = Math.random() * 3;
        let movespeed = Math.random() * 50;
        let moveright = cc.moveBy(2, movespeed, 0);
        let moveleft = cc.moveBy(2, -movespeed, 0);
        moveright.easing(cc.easeInOut(easeRate));
        moveleft.easing(cc.easeInOut(easeRate));
        this.node.runAction(cc.repeatForever(cc.sequence(moveright, moveleft)));
    }
    
    private platformmove_h(){
        let easeRate: number = Math.random() * 3;
        let movespeed = Math.random() * 50;
        let moveup = cc.moveBy(2, 0, movespeed);
        let movedown = cc.moveBy(2, 0, -movespeed);
        moveup.easing(cc.easeInOut(easeRate));
        movedown.easing(cc.easeInOut(easeRate));
        this.node.runAction(cc.repeatForever(cc.sequence(moveup, movedown)));
    }
    update (dt) {}
}
