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

//import Player from "./Player";

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
    
    // Snowman_enemy
    @property(cc.Prefab)
    SnowmanEnemy: cc.Prefab = null;

    // Knight_enemy
    @property(cc.Prefab)
    KnightEnemy: cc.Prefab = null;

    // Bomb_enemy
    @property(cc.Prefab)
    BombEnemy: cc.Prefab = null;

    // Coin
    @property(cc.Prefab)
    coinPrefab: cc.Prefab = null;

    @property({ type: cc.AudioClip })
    soundEffect: cc.AudioClip = null;

    private cnt_jump = 0;

    private anim: cc.Animation = null;

    private animState: cc.AnimationState = null;

    player: cc.Node;

    camera: cc.Node;

    scoreNode: cc.Node;
    
    score: number;

    private jumpvelocity : number = 1000;
    // LIFE-CYCLE CALLBACKS:

    onLoad(){
        this.player = cc.find("Canvas/player");
        this.camera = cc.find("Canvas/Main Camera");
        this.scoreNode = cc.find("Canvas/Main Camera/score");
        this.score = parseInt(this.scoreNode.getComponent(cc.Label).string);
    }


    start () {
        this.anim = this.getComponent(cc.Animation);
        this.animState = null;
        //this.node.zIndex = 100;
        if(this.node.name == "normal_basic"){
            let withrocket = (Math.random()< 0.02) ? true : false;
            let withitem = false;
            if(withrocket){
                withitem = true;
                let newnode = cc.instantiate(this.rocketPrefab); // newnode is the rocket
                this.node.addChild(newnode);
                newnode.position = cc.v2((Math.random()>0.5)? 55*Math.random() : -55*Math.random(), 37.2); // 37.2 = half of platform's height + half of 0.6rocket's height
                newnode.scale = 0.6;
            }

            if(!withitem && Math.random()>0.8){
                withitem = true;
                var newnode = cc.instantiate(this.coinPrefab); // newnode is coin
                this.node.addChild(newnode);
                newnode.position = cc.v2((Math.random()>0.5)? 55*Math.random() : -55*Math.random(), 25.7);
            }

            if(!withitem && Math.random()>0.95){
                withitem = true;
                var newnode = cc.instantiate(this.trampoline); // newnode is trampoline
                this.node.addChild(newnode);
                newnode.position = cc.v2((Math.random()>0.5)? -37 : 40, 13);
            }

            if(!withitem && Math.random() > 0.7 && this.score > 500){
                withitem = true;
                let newnode = cc.instantiate(this.virus_red1); // newnode is the virus_red1
                this.node.addChild(newnode);
                newnode.position = cc.v2((Math.random()>0.5)? 55*Math.random() : -55*Math.random(), 38.35);
            }

            if(!withitem && Math.random() > 0.85 && this.score > 1000){
                withitem = true;
                let newnode = cc.instantiate(this.virus_green1); // newnode is the virus_g1
                this.node.addChild(newnode);
                newnode.position = cc.v2((Math.random()>0.5)? 55*Math.random() : -55*Math.random(), 50.025);
            }

            if(!withitem && Math.random() > 0.95 && this.score > 1500){
                withitem = true;
                let newnode = cc.instantiate(this.NinjaEnemy); // newnode is the Ninja_enemy
                this.node.addChild(newnode);
                newnode.position = cc.v2((Math.random()>0.5)? 55*Math.random() : -55*Math.random(), 45.025);
            }

            if(!withitem && Math.random() > 0.95 && this.score > 2500){
                withitem = true;
                let newnode = cc.instantiate(this.SnowmanEnemy);  // newnode is the Snowman_enemy
                this.node.addChild(newnode);
                newnode.scaleX = (Math.random() > 0.5)? 1.5 : -1.5;
                newnode.position = cc.v2((Math.random()>0.5)? 55*Math.random() : -55*Math.random(), 37.75);
            }

            if(!withitem && Math.random() > 0.9 /*&& this.score > 3500*/){
                withitem = true;
                let newnode = cc.instantiate(this.KnightEnemy);  // newnode is the Knight_enemy
                this.node.addChild(newnode);
                newnode.scaleX = (Math.random() > 0.5)? 1.5 : -1.5;
                newnode.position = cc.v2((Math.random()>0.5)? 55*Math.random() : -55*Math.random(), 37.5);
            }

            if(!withitem && Math.random() > 0.7 && this.score > 2500){
                withitem = true;
                let newnode = cc.instantiate(this.BombEnemy);  // newnode is the Bomb_enemy
                this.node.addChild(newnode);
                newnode.scaleX = (Math.random() > 0.5)? 1.5 : -1.5;
                newnode.position = cc.v2((Math.random()>0.5)? 55*Math.random() : -55*Math.random(), 33.5);
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
    
    update (dt) {
        if(this.camera.position.y - this.node.position.y > 2500) {
            this.node.destroy();
        }
    }

    onBeginContact(contact, self, other){
        if(contact.getWorldManifold().normal.y != 1 || contact.getWorldManifold().normal.x != 0){
            contact.disabled = true;
        }
        else{
            if(this.node.name == "normal_basic" && other.tag == 0) this.cnt_jump++;

            if(this.cnt_jump == 5 && other.tag == 0){
                var newnode = cc.instantiate(this.trampoline);
                this.node.addChild(newnode);
                newnode.position = cc.v2((Math.random()>0.5)? -37 : 40, 13);
            }
            if(self.node.name == "break_basic" && other.tag == 0){
                contact.disabled = true;
                cc.audioEngine.playEffect(this.soundEffect, false);
                this.anim.play("basic_break");
                this.scheduleOnce(function(){
                    this.node.destroy();
                  }, 0.3)
            }
            else if(self.node.name == "time_basic" && other.tag == 0){
                if(this.animState == null || this.animState.name != "basic_time") this.animState = this.anim.play("basic_time");
                this.scheduleOnce(function(){
                    cc.audioEngine.playEffect(this.soundEffect, false);
                    this.node.destroy();
                  }, 1.3)
                other.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.jumpvelocity);
                //
            }
            else if(other.tag == 0 /* player*/ ){
                cc.log(this.player.getComponent("Player").isDied);
                if(this.player.getComponent("Player").isDied){
                    //cc.log(this.player.getComponent("Player").isDied);
                    cc.log("dead");
                    other.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                    contact.disabled = true;
                }      
                else{
                    other.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.jumpvelocity);
                    cc.log("still jumping");
                }
            }
        }
    }   
}
