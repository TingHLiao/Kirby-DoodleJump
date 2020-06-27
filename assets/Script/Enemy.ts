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

    private knight_canshoot: boolean = true;

    private isbomb: boolean = false;

    private spacedown : boolean = false;

    private sucktrigger: boolean = false;

    @property(cc.Prefab)
    snowball: cc.Prefab = null;

    @property(cc.Prefab)
    knife: cc.Prefab = null;

    player: cc.Node = null;

    private cnt : number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;   
        this.anim = this.getComponent(cc.Animation);
        this.player = cc.find("Canvas/player");
    }

    start () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        if(this.node.name == "ninja_enemy"){
            this.anim.play("ninja_enemy");
            this.ninja_move();
        }
        else if(this.node.name == "snowman_enemy"){
            this.anim.play("snowman_enemy");
            this.snowman_attack();
        }
        else if(this.node.name == "knight_enemy"){
            this.anim.play("knight_enemy");
            this.knight_move();
        }
        else if(this.node.name == "bomb_enemy"){
            this.anim.play("bomb_enemy");
            this.bomb_move();
        }
    }

    // ninja_enemy
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

    onKeyDown(event){
        if(event.keyCode == cc.macro.KEY.space) this.spacedown = true;
        else this.spacedown = false;
    }

    onKeyUp(event){
        if(event.keyCode == cc.macro.KEY.space) this.spacedown = false;
    }


    // snowman_enemy
    private snowman_attack(){
        let speed = (this.node.scaleX > 0) ? 50 : -50;
        let t = 2.55*5 +6;
        this.schedule(()=>{
            this.schedule(()=>{
                let newnode = cc.instantiate(this.snowball);
                this.node.addChild(newnode);
                newnode.position = cc.v2(14, 0);
                newnode.getComponent(cc.RigidBody).linearVelocity = cc.v2(speed, 0);
            }, 3.4, 2, 5);    //interval, repeat, delay
        }, t);
            
        for (var i = 0; i < this.node.children.length; ++i) {
            let pos = this.node.children[i].position.x + this.node.position.x;
            if( pos > 425 || pos < 425)
                this.node.children[i].destroy();
        }
    }


    // knight_enemy
    private knight_move(){
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

    // bomb_enemy
    private bomb_move(){
        let t1 = (25-this.node.position.x)/20;
        let t2 = (this.node.position.x+25)/20;
        let moveright1 = cc.moveTo(t1, 30, this.node.position.y);
        let moveleft1 = cc.moveTo(t2, -30, this.node.position.y);
        let flipx = cc.flipX(false);
        let nflipx = cc.flipX(true);
        let moveright = cc.moveTo(3, 30, this.node.position.y);
        let moveleft = cc.moveTo(3, -30, this.node.position.y);
        
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

    // Knight Enemy Attack
    knight_attack(){
        let offsetx = (Math.random()>0.5)? 40*Math.random() : -40*Math.random();
        let offsety = (Math.random()>0.5)? 40*Math.random() : -40*Math.random();
        let diffx = this.player.x- this.node.parent.x + offsetx;
        let diffy = this.player.y - this.node.parent.y + offsety;
        let angle = cc.v2(diffx, diffy).signAngle(cc.v2(1,0));
        let degree = angle/Math.PI * 180;
        let mdegree = angle/Math.PI * 180;
        this.scheduleOnce(function(){
            this.knight_canshoot = true;
        }, 2);
        let newnode = cc.instantiate(this.knife);
        if(this.node.scale > 0) newnode.rotation = degree;
        else newnode.rotation = mdegree;
        this.node.addChild(newnode);
        newnode.position = cc.v2(14, 0);
        newnode.getComponent(cc.RigidBody).linearVelocity = cc.v2((this.player.x- this.node.parent.x + offsetx), (this.player.y - this.node.parent.y + offsety));
        newnode.parent = cc.find("Canvas/knife");
        this.anim.play("knight_enemy_attack");
        this.scheduleOnce(()=>{
            this.anim.play("knight_enemy");
        }, 0.38);
    }

    bomb_attack(){
        this.scheduleOnce(()=>{
            this.anim.play("bomb_enemy_attack");
            this.scheduleOnce(()=>{
                this.node.parent.destroy();
            },0.8)
        }, 1)
    }

    onBeginContact(contact, self, other){
        if(other.tag == 0){
            if(contact.getWorldManifold().normal.y == 1) {
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

    update (dt) {
        if(this.node.name == "knight_enemy"){
            let diffx = this.node.parent.x - this.player.x;
            let diffy = this.node.parent.y - this.player.y;
            let dist = Math.sqrt(diffx*diffx + diffy*diffy);
            if(dist < 300 && this.knight_canshoot){
                this.knight_canshoot = false;
                this.knight_attack();
            }
        }
        else if(this.node.name == "bomb_enemy"){
            let diffx = this.node.parent.x - this.player.x;
            let diffy = this.node.parent.y - this.player.y;
            let dist = Math.sqrt(diffx*diffx + diffy*diffy);
            if(this.isbomb && dist < 89){
                this.cnt++;
                if(this.cnt > 15) {
                    this.player.getComponent("Player").setdie();
                    cc.log("KIRBY BOMB")
                }
            }
            if(dist < 150 && !this.isbomb && !this.spacedown){
                this.isbomb = true;
                this.bomb_attack();
            }
        }
    }
}
