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

import * as Buy_Kirby from "./Buy"

@ccclass
export default class GameMgr extends cc.Component {

    private physicManager: cc.PhysicsManager = null;

    private needmoreplatform : Boolean = false;

    private mousedown : Boolean = false;

    private pause: Boolean = false;

    private floor = 0;

    private count = 0;

    private ID: string = '';
    private username: string = '';

    private highestScore: number = 0;

    private remaincoin: number = 0;

    private knife : cc.Node = null;

    // Get the node of platform
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

    @property(cc.Node)
    stopPanel: cc.Node = null;

    // @property(cc.Node)
    // Gameover : cc.Node = null;

    private backgroundSize = 256;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.physicManager = cc.director.getPhysicsManager();
        this.physicManager.enabled = true;
        this.platforms = cc.find("Canvas/platform");
        this.floor = 0;
        this.count = -1000;
        this.knife = cc.find("Canvas/knife");
        //@ts-ignore
        firebase.auth().onAuthStateChanged(user => {
            this.ID = user.email.replace('@', '-').split('.').join('_');
            //@ts-ignore
            firebase.database().ref(`users/${this.ID}`).once('value', snapshot => {
                this.username = snapshot.val().name.toString().toUpperCase();
            });
            //@ts-ignore
            firebase.database().ref(`users/${this.ID}/highest`).once('value', snapshot => {
                this.highestScore = snapshot.val().score;
            });
            //@ts-ignore
            firebase.database().ref(`users/${this.ID}/coin`).once('value', snapshot => {
                this.remaincoin = snapshot.val().number;
            });
        });
    }

    start () {
        //this.needmoreplatform = true;
        this.generatePlatforms(100, 40);
        this.camera.on('mousedown', function(event){
            if(event.getButton() == 0){
                this.mouseDown = true;
                //calculate the position relating to center
                let pos = cc.v2(this.player.x - this.camera.x, this.player.y - this.camera.y);
                this.player.getComponent('Player').attack(event.getLocationX()-480, event.getLocationY()-320, pos);
            }
        }, this);
        this.camera.on('mouseup', function(event){
            if(event.getButton() == 0){
                this.mouseDown = false;
            }
        }, this);
    }

    generatePlatforms(num, stepsize)
    {
        //if(this.needmoreplatform){
            //this.platforms.removeAllChildren();
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
    
        if(height >= this.count + 550){
            //this.needmoreplatform = true;
            if(height >= 550)
                this.generatePlatforms(100, 45);
            else if(height >= 1550)
                this.generatePlatforms(100, 50);
            else if(height >= 2550)
                this.generatePlatforms(100, 60);
            else if(height >= 3550)
                this.generatePlatforms(100, 65);
            else if(height >= 4550)
                this.generatePlatforms(100, 70);
            else if(height >= 5550)
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
                if(this.knife.isValid)this.knife.destroy();
                this.scheduleOnce(()=>{
                    this.player.active = false;
                }, 0.6);
            }
        }
    }

    gameover(money: number){
        let s = parseInt(this.score.getComponent(cc.Label).string);
        if(s > this.highestScore){
            //@ts-ignore
            firebase.database().ref(`users/${this.ID}/highest`).set({
                score: s
            });
            //@ts-ignore
            firebase.database().ref(`leader/${this.ID}`).set({
                name: this.username,
                score: s
            });
        }
        //@ts-ignore
        firebase.database().ref(`users/${this.ID}/coin`).set({
            number: this.remaincoin + money
        });
    }

    gamePause(){
        if(this.pause){
            this.pause = false;
            this.stopPanel.active = false;
            cc.director.resume();
            return;
        }
        this.pause = true;
        this.stopPanel.active = true;
        this.scheduleOnce(()=>{
            cc.director.pause();
        }, 0.1);
    }
}
