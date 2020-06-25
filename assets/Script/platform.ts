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

    private anim: cc.Animation = null;

    private animState: cc.AnimationState = null;

    private jumpvelocity : number = 1000;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.anim = this.getComponent(cc.Animation);
        this.animState = null;
        if(this.node.name == "normal_basic"){
            
        }
        else if(this.node.name == "move_basic"){
            let dir = (Math.random() > 0.5) ? "v" : "h"; // choose to move vertical or horizontal
            if(dir == 'v') this.platformmove_v();
            else this.platformmove_h();
        }
        else if(this.node.name == "time_basic"){

        }
        else if(this.node.name == "break_basic"){
            
        }
    }

    private platformmove_h(){
        let t1 = (423-this.node.position.x)/141;
        let t2 = (this.node.position.x+423)/141;
        let moveright1 = cc.moveTo(t1, 423, this.node.position.y);
        let moveleft1 = cc.moveTo(t2, -423, this.node.position.y);
        let moveright = cc.moveTo(6, 423, this.node.position.y);
        let moveleft = cc.moveTo(6, -423, this.node.position.y);
        
        if(Math.random() > 0.5){
            this.node.runAction(moveleft1);
            this.scheduleOnce(()=>{
                this.node.runAction(cc.repeatForever(cc.sequence(moveright, moveleft)));
            }, t2);
            
        }
        else{
            this.node.runAction(moveright1);
            this.scheduleOnce(()=>{
                this.node.runAction(cc.repeatForever(cc.sequence(moveleft, moveright)));
            }, t1);
            
        }
    }
    
    private platformmove_v(){
        //let easeRate = 2;
        let moveup = cc.moveBy(2.5, 0, 175);
        let movedown = cc.moveBy(2.5, 0, -175);
        // moveup.easing(cc.easeInOut(easeRate));
        // movedown.easing(cc.easeInOut(easeRate));

        if(Math.random() > 0.5){
            this.node.runAction(cc.repeatForever(cc.sequence(moveup, movedown)));
        }
        else{
            this.node.runAction(cc.repeatForever(cc.sequence(movedown, moveup)));
        }
    }
    
    update (dt) {}

    onBeginContact(contact, self, other){
        if(contact.getWorldManifold().normal.y != 1 || contact.getWorldManifold().normal.x != 0){
            contact.disabled = true;
        }
        else{
            if(self.node.name == "break_basic"){
                contact.disabled = true;
                this.anim.play("basic_break");
                this.scheduleOnce(function(){
                    this.node.destroy();
                  }, 0.3)
            }
            else if(self.node.name == "time_basic"){
                if(this.animState == null || this.animState.name != "basic_time")this.animState = this.anim.play("basic_time");
                this.scheduleOnce(function(){
                    this.node.destroy();
                  }, 1.3)
                other.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.jumpvelocity);
                
            }
            else if(other.tag == 0 /* player*/ ) other.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.jumpvelocity);
        }
    }
}
