import GameMgr from "./GameMgr";
import * as Buy from "./Buy"
const {ccclass, property} = cc._decorator;

@ccclass
export default class player extends cc.Component {

    private leftDown: boolean = false; // key for player to go left

    private rightDown: boolean = false; // key for player to go right

    private spaceDown: boolean = false; //get enemy

    private rocketOn: boolean = false;

    private playerSpeed: number = 0;

    private bulletspeed = 500;

    private magic_bomb_speed = 650;

    private maxbullet = 3;

    private anim = null;

    private animateState = null;

    private isDied = false;

    private knife: cc.Node = null;

    private isKnifing : boolean = false;
    //ninja attack
    private isThrow: boolean = false;
    private isThrowBack: boolean = false;

    //0:default 1:shield protect 2:rocket
    private mode = 0;

    // 0: normal, 1: snow, 2:ninja
    private kirby_state = 0;

    private isReborn = false;

    // record money
    @property(cc.Node)
    money: cc.Node = null;

    @property({ type: cc.AudioClip })
    soundEffect: cc.AudioClip = null;

    platform: cc.Node;//
    bulletPool: cc.Node;

    @property(cc.Node)
    platforms: cc.Node = null;

    @property({type:cc.AudioClip})
    abilitySound: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    CoinEffect: cc.AudioClip = null;

    @property({type: cc.AudioClip})
    DieEffect: cc.AudioClip = null;

    @property(GameMgr)
    gamemanager: GameMgr = null;

    @property(cc.Prefab)
    bullet: cc.Prefab = null;

    @property(cc.Prefab)
    ninja_bullet: cc.Prefab = null;

    @property(cc.Prefab)
    magicbomb: cc.Prefab = null;


    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        this.anim = this.getComponent(cc.Animation);
        this.platform = cc.find("Canvas/platform");
        this.bulletPool = cc.find("Canvas/bullet");
        this.knife = cc.find("Canvas/knife");
        this.kirby_state = Buy.Global.Buy_Kirby;
        cc.log(Buy.Global.Extra_life);
    }

    start () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.node.getComponent(cc.RigidBody).linearVelocity = cc. v2(0, 1000);
        if(this.kirby_state == 0) this.anim.play("jump");
        else if(this.kirby_state == 1) this.anim.play("snow_jump");
        else if(this.kirby_state == 2) this.anim.play("ninja_jump");
        else if(this.kirby_state == 3) this.anim.play("magic_jump");
        else if(this.kirby_state == 4) this.anim.play("knight_jump");
    }

    onKeyDown(event) {
        if(event.keyCode == cc.macro.KEY.a) {
            this.leftDown = true;
            this.rightDown = false;
        } else if(event.keyCode == cc.macro.KEY.d) {
            this.leftDown = false;
            this.rightDown = true;
        } 
        if(event.keyCode == cc.macro.KEY.space){
            this.spaceDown = true;

            switch(this.kirby_state){
                case 0: {
                    if(this.anim.getAnimationState('jump').isPlaying){
                        this.anim.stop('jump');
                        this.animateState = this.anim.play('suck');
                    }
                    break;
                }
                case 1: {
                    if(this.anim.getAnimationState('snow_jump').isPlaying){
                        this.anim.stop('snow_jump');
                        this.animateState = this.anim.play('snow_suck');
                    }
                    break;
                }
                case 2: {
                    if(this.anim.getAnimationState('ninja_jump').isPlaying){
                        this.anim.stop('ninja_jump');
                        this.animateState = this.anim.play('ninja_suck');
                    }
                    break;
                }
                case 3: {
                    if(this.anim.getAnimationState('magic_jump').isPlaying){
                        this.anim.stop('magic_jump');
                        this.animateState = this.anim.play('magic_suck');
                    }
                    break;
                }
                case 4: {
                    if(this.anim.getAnimationState('knight_jump').isPlaying){
                        this.anim.stop('knight_jump');
                        this.animateState = this.anim.play('knight_suck');
                    }
                    break;
                }
                default: {
                    if(this.anim.getAnimationState('jump').isPlaying){
                        this.anim.stop('jump');
                        this.animateState = this.anim.play('suck');
                    }
                    break;
                }
            }
        }
    }
    
    onKeyUp(event) {
        if(event.keyCode == cc.macro.KEY.a)  
            this.leftDown = false;
        else if(event.keyCode == cc.macro.KEY.d)
            this.rightDown = false;
        if(event.keyCode == cc.macro.KEY.space){
            this.spaceDown = false;

            switch(this.kirby_state){
                case 0: {
                    if(this.anim.getAnimationState('suck').isPlaying){
                        this.anim.stop('suck');
                        this.animateState = this.anim.play('stopsuck');
                    }
                    break;
                }
                case 1: {
                    if(this.anim.getAnimationState('snow_suck').isPlaying){
                        this.anim.stop('snow_suck');
                        this.animateState = this.anim.play('stop_snowsuck');
                    }
                    break;
                }
                case 2: {
                    if(this.anim.getAnimationState('ninja_suck').isPlaying){
                        this.anim.stop('ninja_suck');
                        this.animateState = this.anim.play('stop_ninjasuck');
                    }
                    break;
                }
                case 3: {
                    if(this.anim.getAnimationState('magic_suck').isPlaying){
                        this.anim.stop('magic_suck');
                        this.animateState = this.anim.play('stop_magicsuck');
                    }
                    break;
                }
                case 4: {
                    if(this.anim.getAnimationState('knight_suck').isPlaying){
                        this.anim.stop('knight_suck');
                        this.animateState = this.anim.play('stop_knightsuck');
                    }
                    break;
                }
                default: {
                    if(this.anim.getAnimationState('suck').isPlaying){
                        this.anim.stop('suck');
                        this.animateState = this.anim.play('stopsuck');
                    }
                    break;
                }
            }
        }
    }

    update (dt) {
        this.playermovement(dt);
        this.ninja_bullet_back();
        if(this.node.x-11.5 <= -480 && this.leftDown){
            this.node.x = 491.5;
        }
        else if(this.node.x + 11.5 >= 480 && this.rightDown){
            this.node.x = -491.5;
        }
    }

    onBeginContact(contact, self, other){
        if(self.tag == 0 && !this.isReborn){

            if(other.tag == 1 && other.node.name != "break_basic" && contact.getWorldManifold().normal.y == -1) cc.audioEngine.playEffect(this.soundEffect, false);

            if(other.tag == 4 || other.tag == 5 || other.tag == 6 ){
                if(other.tag == 5 && this.spaceDown){
                    if(other.node.name == "snowman_enemy"){
                        if(this.kirby_state != 1) this.anim.play("changetosnow");
                        this.kirby_state = 1;
                    }
                    else if(other.node.name == "ninja_enemy"){
                        if(this.kirby_state != 2) this.anim.play("changetoninja");
                        this.kirby_state = 2;
                    }
                    else if(other.node.name == "bomb_enemy"){
                        if(this.kirby_state != 3) this.anim.play("changetomagic");
                        this.kirby_state = 3;
                    }
                    else if(other.node.name == "knight_enemy"){
                        if(this.kirby_state != 4) this.anim.play("changetoknight");
                        this.kirby_state = 4;
                    }
                }
                if(this.mode > 0){
                    contact.disabled = true; 
                    return;
                }
                if((!this.spaceDown && other.tag == 5) || other.tag == 4){   //collide with enemy and die
                    if(contact.getWorldManifold().normal.y == 1 || contact.getWorldManifold().normal.x != 0){ // enemy and doesn't contact from top
                        this.gameover();
                    }
                }
                if(other.tag == 6){     //collide with enemy bullets
                    other.node.destroy();
                    this.gameover();
                }  
            }
            else if(other.tag == 7){
                let num = parseInt(this.money.getComponent(cc.Label).string);
                num += 1;
                this.money.getComponent(cc.Label).string = num + '';
                cc.audioEngine.playEffect(this.CoinEffect, false);
                contact.disabled = true;
                other.node.destroy();
            }
            else if(other.tag == 10 && this.isThrowBack){
                this.isThrow = false;
                this.isThrowBack = false;
                this.bulletPool.removeAllChildren();
            }
            else{
                if(contact.getWorldManifold().normal.y != -1 || contact.getWorldManifold().normal.x != 0)
                contact.disabled = true;
                else{
                    if(other.tag == 1 && this.mode != 2 && this.kirby_state == 0){
                        this.animateState = this.anim.play("jump");
                    }
                    else if(other.tag == 1 && this.mode != 2 && this.kirby_state == 1){
                        this.animateState = this.anim.play("snow_jump");
                    }
                    else if(other.tag == 1 && this.mode != 2 && this.kirby_state == 2){
                        this.animateState = this.anim.play("ninja_jump");
                    }
                    else if(other.tag == 1 && this.mode != 2 && this.kirby_state == 3){
                        this.animateState = this.anim.play("magic_jump");
                    }
                    else if(other.tag == 1 && this.mode != 2 && this.kirby_state == 4){
                        this.animateState = this.anim.play("knight_jump");
                    }
                }
            }
        } else if(self.tag == 3 && other.tag == 5){ //can't suck during rocket
            contact.disabled = true;
            if(!this.spaceDown)
                return;
        } else{
            contact.disabled = true;
        }
    }

    onPreSolve(contact, self, other){
        if(self.tag == 0 && other.tag == 5 && this.spaceDown){ //get ability
            contact.disabled = true;
            cc.audioEngine.playEffect(this.abilitySound, false);
            other.node.destroy();
            return;
        }
        if(self.tag == 3 && other.tag == 5 && !this.rocketOn){
            if(!this.spaceDown || !other.node.isValid){
                if(other.node.isValid && other.node.getComponent("Enemy").sucktrigger){
                    other.node.stopAllActions();
                    other.node.getComponent("Enemy").sucktrigger = false;
                    other.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
                    other.node.runAction(cc.moveBy(1.5, cc.v2(0, -800)));
                    other.scheduleOnce( function(){
                        other.node.destroy();
                    }, 1.5);
                }
                return;
            }
            other.node.getComponent("Enemy").sucktrigger = true;
            let move = self.node.position.sub(other.node.parent.position).sub(other.node.position).divSelf(8);
            other.node.runAction(cc.moveBy(0.2, move));
        }
    }
    
    onEndContact(contact, self, other){
        if(self.tag == 3 && other.tag == 5 && !this.rocketOn){
            if(other.node.isValid && other.node.getComponent("Enemy").sucktrigger){
                //other.node.stopAllActions();
                //other.node.getComponent("Enemy").sucktrigger = false;
                //other.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
                other.node.runAction(cc.moveBy(1.5, cc.v2(0, -800)));
                other.scheduleOnce( function(){
                    other.node.destroy();
                }, 1.5);
            }
            
        }
    }

    private playermovement(dt){
        this.playerSpeed = 0;
        if(this.leftDown){
            this.playerSpeed = -400;
            this.node.scaleX = -2;
        }
        else if(this.rightDown){
            this.playerSpeed = 400;
            this.node.scaleX = 2;
        }

        this.node.x += this.playerSpeed * dt;
    }

    private gameover(){

        if(Buy.Global.Extra_life > 0){
            this.isReborn  = true;
            Buy.Global.Extra_life--;
            cc.log(Buy.Global.Extra_life);
            this.anim.stop();

            if(this.kirby_state == 0){
                this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                this.node.runAction(cc.blink(1, 6));
            }
            else{
                this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                
                if(this.kirby_state == 1){
                    this.animateState = this.anim.play("changetosnow");  
                    this.animateState.wrapMode = cc.WrapMode.Reverse;
                    this.animateState.speed = 0.7;
                }
                else if(this.kirby_state == 2){
                    this.animateState = this.anim.play("changetoninja");  
                    this.animateState.wrapMode = cc.WrapMode.Reverse;
                    this.animateState.speed = 0.7;
                }
                else if(this.kirby_state == 3){
                    this.animateState = this.anim.play("changetomagic");  
                    this.animateState.wrapMode = cc.WrapMode.Reverse;
                    this.animateState.speed = 0.7;
                }
                else if(this.kirby_state == 4){
                    this.animateState = this.anim.play("changetoknight");  
                    this.animateState.wrapMode = cc.WrapMode.Reverse;
                    this.animateState.speed = 0.7;
                }
            } 
            this.scheduleOnce(()=>{
                this.isReborn = false;
                this.kirby_state = 0;     // back to normal
                this.anim.stop();
                this.animateState = this.anim.play("jump");
            },1);
        }
        else{
            /*this.isDied = true;
            switch(this.kirby_state){
                case 0: {                 // normal
                    this.anim.stop('jump');
                    this.animateState = this.anim.play("die");
                    break;
                }
                case 1: {                 // snowman
                    this.anim.stop('snow_jump');
                    this.animateState = this.anim.play("snowman_die");
                    break;
                }
                case 2: {                 // ninja
                    this.anim.stop('ninja_jump');
                    this.animateState = this.anim.play("ninja_die");
                    break;
                }
                case 3: {                //magic
                    this.anim.stop('magic_jump');
                    this.animateState = this.anim.play("magic_die");
                    break;
                }
                case 4:{
                    this.anim.stop('knight_jump');
                    this.animateState = this.anim.play("knight_die");
                    break; 
                }
                default: {
                    this.anim.stop('jump');
                    this.animateState = this.anim.play("die");
                    break;
                }
            }
            this.node.getComponent(cc.RigidBody).enabledContactListener = false;
            //get money and score to database, handle by GameMgr
            this.gamemanager.gameover(parseInt(this.money.getComponent(cc.Label).string));
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            this.scheduleOnce(()=>{ 
                cc.audioEngine.playEffect(this.DieEffect, false);
                this.platforms.removeAllChildren();
                this.bulletPool.removeAllChildren();
                this.knife.removeAllChildren();
                this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -150);
            }, 0.3);*/
        }
       
    }

    private attack(x: number, y: number, playerpos: cc.Vec2){
        if(this.rocketOn)
            return;
        //can only attack maxbullet in window
        if(this.bulletPool.childrenCount >= this.maxbullet)
            return;

        if(playerpos.x > x)
            this.node.scaleX = -2;
        else
            this.node.scaleX = 2;

        switch(this.kirby_state){
            case 0: {                 // normal
                break;
            }
            case 1: {                 // snowman
                let newnode = cc.instantiate(this.bullet);
                this.bulletPool.addChild(newnode);
                newnode.position = cc.v2(this.node.position.add(cc.v2(14, 0)));
                //direction vector for bullet
                let dir = cc.v2(x,y).sub(playerpos);
                //linearVelocity = unit vector multiple bulletspeed
                newnode.getComponent(cc.RigidBody).linearVelocity = dir.divSelf(dir.mag()).mulSelf(this.bulletspeed);
                break;
            }
            case 2: {                 // ninja
                this.anim.stop('ninja_jump');
                this.animateState = this.anim.play("ninja_die");
                
                if(!this.isThrow){
                    this.isThrow = true;
                    let newnode = cc.instantiate(this.ninja_bullet);
                    this.bulletPool.addChild(newnode);
                    newnode.position = cc.v2(this.node.position.add(cc.v2(14, 0)));
                    let dir = cc.v2(x,y).sub(playerpos);
                    cc.log(dir);
                    newnode.runAction(cc.moveBy(0.8, dir.divSelf(dir.mag()).mulSelf(400)));
                    this.scheduleOnce(function(){
                        this.isThrowBack = true;
                    }, 0.81);
                }
                break;
            }
            case 3: {                //magic
                let newnode = cc.instantiate(this.magicbomb);
                this.bulletPool.addChild(newnode);
                newnode.position = cc.v2(this.node.position.add(cc.v2(14, 0)));
                //direction vector for bullet
                let dir = cc.v2(x,y).sub(playerpos);
                //linearVelocity = unit vector multiple bulletspeed
                newnode.getComponent(cc.RigidBody).linearVelocity = dir.divSelf(dir.mag()).mulSelf(this.magic_bomb_speed);
                break;
            }
            case 4:{                   // knight
                this.anim.play("knight_attack");
                this.isKnifing = true;
                this.scheduleOnce(()=>{
                    this.isKnifing = false;
                }, 0.35)
                break; 
            }
            default: {
                this.anim.stop('jump');
                this.animateState = this.anim.play("die");
                break;
            }
        }
    }

    ninja_bullet_back(){
        if(this.isThrowBack){
            let n = this.bulletPool.children[0];
            if(this.bulletPool.childrenCount!=0 && n.isValid){
                let move = this.node.position.sub(n.position).divSelf(15);
                if(move.mag() < 50)
                    n.runAction(cc.moveBy(0.001, move));
                else
                    n.runAction(cc.moveBy(0.05, move));
            } else{
                cc.log('d')
                this.isThrowBack = false;
            }
        }
    }

    setmode(status : string){
        if(status == "shield")
            this.mode++;
        else if(status == "unshield")
            this.mode--;
        else if(status == "rocket"){
            this.mode++;
            this.rocketOn = true;
        } else if(status == "unrocket"){
            this.mode--;
            this.rocketOn = false;
        }
    }

    setdie(){
        this.gameover();
    }

    get_state(){
        return this.kirby_state;
    }
}
