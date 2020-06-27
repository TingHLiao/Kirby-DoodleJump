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
export default class Enemy extends cc.Component {

    private anim = null;

    private jumpvelocity : number = 1000;

    @property(cc.Prefab)
    snowball: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;   
        this.anim = this.getComponent(cc.Animation);
    }

    start () {
        if(this.node.name == "ninja_enemy"){
            this.anim.play("ninja_enemy");
            this.ninja_move();
        }
        else if(this.node.name == "snowman_enemy"){
            this.anim.play("snowman_enemy");
            this.snowman_attack();
        }
    }

    //update (dt) {}

    private ninja_move(){
        let t1 = (25-this.node.position.x)/30;
        let t2 = (this.node.position.x+25)/30;
        let moveright1 = cc.moveTo(t1, 30, this.node.position.y);
        let moveleft1 = cc.moveTo(t2, -30, this.node.position.y);
        let flipx = cc.flipX(true);
        let nflipx = cc.flipX(false);
        let moveright = cc.moveTo(2, 30, this.node.position.y);
        let moveleft = cc.moveTo(2, -30, this.node.position.y);
        
        if(Math.random() > 0.5){
            this.node.runAction(flipx);
            this.node.runAction(moveleft1);
            this.scheduleOnce(()=>{
                this.node.runAction(cc.repeatForever(cc.sequence(cc.spawn(nflipx, moveright), cc.spawn(flipx, moveleft))));
            }, t2);
            
        }
        else{
            this.node.runAction(moveright1);
            this.scheduleOnce(()=>{
                this.node.runAction(cc.repeatForever(cc.sequence(cc.spawn(flipx, moveleft), cc.spawn(nflipx, moveright))));
            }, t1);
            
        }
    }

    private snowman_attack(){
        let speed = (this.node.scaleX > 0) ? 50 : -50;
        let t = 2.55*5 +6;
        this.schedule(()=>{
            this.schedule(()=>{
                let newnode = cc.instantiate(this.snowball);
                this.node.addChild(newnode);
                newnode.position = cc.v2(14, 0);
                newnode.getComponent(cc.RigidBody).linearVelocity = cc.v2(speed, 0);
                cc.log("in")
            }, 3.4, 2, 5);    //interval, repeat, delay
        }, t);
            
        

        for (var i = 0; i < this.node.children.length; ++i) {
            let pos = this.node.children[i].position.x + this.node.position.x;
            if( pos > 425 || pos < 425)
                this.node.children[i].destroy();
        }
    }

    onBeginContact(contact, self, other){
        if(other.tag == 0){
            if(contact.getWorldManifold().normal.y == 1) {
                cc.log("snow");
                other.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.jumpvelocity);
                self.node.stopAllActions();
                self.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -500);
                self.scheduleOnce(()=>{
                    self.node.destroy();
                }, 1)
            }
        } else if(other.tag == 8){
            self.node.destroy();
        }
    }
}
