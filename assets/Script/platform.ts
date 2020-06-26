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

    // Rocket
    @property(cc.Prefab)
    rocketPrefab: cc.Prefab = null;

     // virus_red1
     @property(cc.Prefab)
     virus_red1: cc.Prefab = null;

     // virus_green1
     @property(cc.Prefab)
     virus_green1: cc.Prefab = null;

    // Trampoline
    @property(cc.Prefab)
    trampoline: cc.Prefab = null;

    // Shield
    @property(cc.Prefab)
    shield: cc.Prefab = null;

    // Ninja enemy
    @property(cc.Prefab)
    NinjaEnemy: cc.Prefab = null;

    private anim: cc.Animation = null;

    private animState: cc.AnimationState = null;

    private jumpvelocity : number = 1000;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.anim = this.getComponent(cc.Animation);
        this.animState = null;
        if(this.node.name == "normal_basic"){
            let withrocket = (Math.random()< 0.01) ? true : false;
            let withitem = false;
            if(withrocket){
                withitem = true;
                let newnode = cc.instantiate(this.rocketPrefab); // newnode is the rocket
                this.node.addChild(newnode);
                newnode.position = cc.v2((Math.random()>0.5)? 60*Math.random() : -60*Math.random(), 37.2); // 37.2 = half of platform's height + half of 0.6rocket's height
                newnode.scale = 0.6;
            }

            if(Math.random()>0.95 && !withitem){
                withitem = true;
                var newnode = cc.instantiate(this.trampoline);
                this.node.addChild(newnode);
                newnode.position = cc.v2((Math.random()>0.5)? -37 : 40, 13);
            }

            if(!withitem && Math.random() > 0.9){
                withitem = true;
                let newnode = cc.instantiate(this.virus_red1); // newnode is the rocket
                this.node.addChild(newnode);
                newnode.position = cc.v2((Math.random()>0.5)? 60*Math.random() : -60*Math.random(), 38.35);
            }

            if(!withitem && Math.random() > 1){
                withitem = true;
                let newnode = cc.instantiate(this.virus_green1); // newnode is the rocket
                this.node.addChild(newnode);
                newnode.position = cc.v2((Math.random()>0.5)? 60*Math.random() : -60*Math.random(), 50.025);
            }

            if(!withitem && Math.random() > 0.95){
                withitem = true;
                let newnode = cc.instantiate(this.NinjaEnemy); // newnode is the rocket
                this.node.addChild(newnode);
                newnode.position = cc.v2((Math.random()>0.5)? 60*Math.random() : -60*Math.random(), 45.025);
            }
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
        if(Math.random()>0.99){
            var newnode = cc.instantiate(this.shield);
            this.node.addChild(newnode);
            newnode.position = cc.v2((Math.random()>0.5)? -37 : 40, 45);
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
            if(self.node.name == "break_basic" && other.tag == 0){
                contact.disabled = true;
                this.anim.play("basic_break");
                this.scheduleOnce(function(){
                    this.node.destroy();
                  }, 0.3)
            }
            else if(self.node.name == "time_basic"){
                if(this.animState == null || this.animState.name != "basic_time") this.animState = this.anim.play("basic_time");
                this.scheduleOnce(function(){
                    this.node.destroy();
                  }, 1.3)
                other.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.jumpvelocity);
                
            }
            else if(other.tag == 0 /* player*/ ) other.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.jumpvelocity);
        }
    }
}
