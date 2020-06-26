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
export default class GameMgr extends cc.Component {

    private physicManager: cc.PhysicsManager = null;

    private needmoreplatform : Boolean = false;

    private floor = 0;

    private count = 0;

    // Get the node of platform
    @property(cc.Node)
    platforms: cc.Node = null;

    // Get the Prefab of platform
    @property([cc.Prefab])
    platformPrefabs: cc.Prefab[] = [];

    @property(cc.Node)
    camera: cc.Node = null;

    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Node)
    player : cc.Node = null;

    @property(cc.Node)
    score : cc.Node = null;

    // @property(cc.Node)
    // Gameover : cc.Node = null;

    private backgroundSize = 256;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.physicManager = cc.director.getPhysicsManager();
        this.physicManager.enabled = true;
        this.floor = 0;
        this.count = -1000;
        //this.Gameover.active = false;
    }

    start () {
        //this.needmoreplatform = true;
        this.generatePlatforms(100, 40);
    }

    generatePlatforms(num, stepsize)
    {
        //if(this.needmoreplatform){
            //this.platforms.removeAllChildren();
            cc.log(this.floor);
            for(let i = this.floor; i < this.floor+num; i++)
            {
                let randIdx = this.randomChoosePlatform();
                let platform = cc.instantiate(this.platformPrefabs[randIdx]);
                platform.parent = this.platforms;
                platform.position = cc.v2((i < 5)?(Math.random()>0.5)? Math.random()*75: Math.random()*-75: (Math.random()>0.5)? Math.random()*400: Math.random()*-400, i*stepsize-280-(stepsize-40)*100 + Math.random()*5);
            }
            this.floor += num;
            this.count += 1000;
            
            //this.needmoreplatform = false;
        //}
    }

    randomChoosePlatform()
    {
        let rand = Math.random();

        //0: normal, 1: moveable, 2: time, 3: break
        let prob = [6, 1, 0.5, 1];
        let sum = prob.reduce((a,b)=>a+b);
        for(let i = 1; i < prob.length; i++)
            prob[i] += prob[i-1];
        for(let i = 0; i < prob.length; i++)
        {
            prob[i] /= sum;
            if(rand <= prob[i])
                return i;
        }
    }

    update (dt) {
        let height = parseInt(this.score.getComponent(cc.Label).string);
        if(this.player.y - this.camera.y > 100){
            height += Math.floor(3 + 3 * Math.random());
            this.score.getComponent(cc.Label).string = height + '';
            this.camera.y = this.player.y - 100;
        }
        if(this.camera.y - this.background.y >= this.backgroundSize)
            this.background.y += this.backgroundSize;
    
        if(height >= this.count + 750){
            //this.needmoreplatform = true;
            if(height >= 750)
                this.generatePlatforms(100, 45);
            else if(height >= 1750)
                this.generatePlatforms(100, 50);
            else if(height >= 2750)
                this.generatePlatforms(100, 60);
            else if(height >= 3750)
                this.generatePlatforms(100, 65);
            else if(height >= 4750)
                this.generatePlatforms(100, 70);
            else if(height >= 5750)
                this.generatePlatforms(100, 75);
            else if(height >= 6750)
                this.generatePlatforms(100, 80);
        }

        if(this.player.y - this.camera.y > 100)
            this.camera.y = this.player.y - 100;
    
        if(this.camera.y-300 > this.player.y)
        {
            if(this.player.active)
            {
                this.platforms.removeAllChildren();
                //this.gameover();
                     this.scheduleOnce(()=>{
                //         var action = cc.fadeIn(1.0);
                //         // this.Gameover.active = true;
                //         // this.Gameover.runAction(action);
                        this.player.active = false;
                //         this.camera.y = 0;  
                     }, 0.6);
                // }
                //this.player.playerDie();
                //this.gameOver();
            }
        }
    }
}
