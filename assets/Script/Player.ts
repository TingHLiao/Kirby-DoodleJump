const {ccclass, property} = cc._decorator;

@ccclass
export default class player extends cc.Component {

    private leftDown: boolean = false; // key for player to go left

    private rightDown: boolean = false; // key for player to go right

    private spaceDown: boolean = false; //get enemy

    private playerSpeed: number = 0;

    private anim = null;

    private animateState = null;

    private isDied = false;

    @property(cc.Node)
    platforms: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;   
        this.anim = this.getComponent(cc.Animation);
    }

    start () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.node.getComponent(cc.RigidBody).linearVelocity = cc. v2(0, 1000);
        this.anim.play("jump");
    }

    onKeyDown(event) {
        if(event.keyCode == cc.macro.KEY.left) {
            this.leftDown = true;
            this.rightDown = false;
        } else if(event.keyCode == cc.macro.KEY.right) {
            this.leftDown = false;
            this.rightDown = true;
        } 
        if(event.keyCode == cc.macro.KEY.space){
            this.spaceDown = true;
            //this.node.getComponent(cc.PhysicsPolygonCollider).enabled = true;
            if(this.anim.getAnimationState('jump').isPlaying){
                this.anim.stop('jump');
                this.animateState = this.anim.play('suck');
            }
        }
    }
    
    onKeyUp(event) {
        if(event.keyCode == cc.macro.KEY.left)
            this.leftDown = false;
        else if(event.keyCode == cc.macro.KEY.right)
            this.rightDown = false;
        if(event.keyCode == cc.macro.KEY.space){
            this.spaceDown = false;
            //this.node.getComponent(cc.PhysicsPolygonCollider).enabled = false;
            if(this.anim.getAnimationState('suck').isPlaying){
                this.anim.stop('suck');
                this.animateState = this.anim.play('stopsuck');
            }
        }
    }

    update (dt) {
        this.playermovement(dt);
        if(this.node.x-11.5 <= -480 && this.leftDown){
            this.node.x = 491.5;
        }
        else if(this.node.x + 11.5 >= 480 && this.rightDown){
            this.node.x = -491.5;
        }
    }

    onBeginContact(contact, self, other){
        if(self.tag == 0){
            if(other.tag == 4 && contact.getWorldManifold().normal.y == 1){ // enemy and doesn't contact from top
                this.isDied = true;
                this.gameover();
                cc.log("DIED")
            }
            else{
                if(contact.getWorldManifold().normal.y != -1 || contact.getWorldManifold().normal.x != 0)
                contact.disabled = true;
                else{
                    if(other.tag == 1){
                        this.animateState = this.anim.play("jump");
                    }
                }
            }
            if(other.tag == 4 && this.spaceDown){ //change to 5
                //other.node.removeFromParent();
                return;
            }
        } else if(self.tag == 3 && other.tag == 4){ //change to 5
            if(!this.spaceDown){
                contact.disabled = true;
                return;
            }
            contact.disabled = true;
            other.node.runAction(cc.moveTo(3, self.node.position.sub(cc.v2(480, 320))).easing(cc.easeCubicActionOut()));
        } else{
            contact.disabled = true;
        }
    }

    onPreSolve(contact, self, other){
        if(self.tag == 3 && other.tag == 4){ //change to 5
            //cc.log('c')
            if(!this.spaceDown){
                contact.disabled = true;
                return;
            }
            let move = self.node.position.sub(other.node.parent.position).sub(other.node.position);
            //cc.log(move)
            other.node.stopAllActions();
            other.node.runAction(cc.moveBy(1, move));
            //.easing(cc.easeCubicActionOut())
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
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.scheduleOnce(()=>{
            this.platforms.removeAllChildren();
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -250);
        }, 0.3);
        
    }
}
