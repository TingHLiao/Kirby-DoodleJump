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

import * as Buy from "./Buy"

@ccclass
export default class GameMgr extends cc.Component {

    private physicManager: cc.PhysicsManager = null;

    private needmoreplatform : Boolean = false;

    private mousedown : Boolean = false;

    private pause: Boolean = false;

    private istwoP: Boolean = false;

    private floor = 0;

    private count = 0;

    private ID: string = '';
    private username: string = '';

    private highestScore: number = 0;

    private remaincoin: number = 0;

    private last_platform_y : number = 0;

    private knife : cc.Node = null;

    //counter for 2P
    timer: cc.Node = null;
    twoPscore: cc.Node = null;
    c: number = 0;
    remaintime: number = 0;
    write: boolean = true;
    read: boolean = true;
    twoPshowscore: number = 0;

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

    @property(cc.Node)
    gameoverPanel: cc.Node = null;

    @property({type: cc.AudioClip})
    DieEffect: cc.AudioClip = null;

    @property(cc.Node)
    twoPgameoverPanel: cc.Node = null;

    @property(cc.SpriteFrame)
    winSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    loseSprite: cc.SpriteFrame = null;

    @property({ type: cc.AudioClip })
    basic_bgm: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    space_bgm: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    ghost_bgm: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    lose1_effect: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    lose2_effect: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    win_effect: cc.AudioClip = null;

    // @property(cc.Node)
    // Gameover : cc.Node = null;

    private backgroundSize = 256;
    private EffectOn = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.physicManager = cc.director.getPhysicsManager();
        this.physicManager.enabled = true;
        this.platforms = cc.find("Canvas/platform");
        this.floor = 0;
        this.last_platform_y = -280;
        this.count = -1000;
        this.knife = cc.find("Canvas/knife");
        if(Buy.Global.twoP){
            this.istwoP = true;
            this.timer = cc.find("Canvas/Main Camera/Timer/counter");
            this.twoPscore = cc.find("Canvas/Main Camera/2Pscore");
            this.twoPscore.active =  true;
            this.timer.getComponent(cc.Label).string = "60";
            this.remaintime = 10;
            cc.find("Canvas/Main Camera/Timer").active = true;
            this.twoPscore.active = true;
        }
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
                platform.position = cc.v2((i < 5)?(Math.random()>0.5)? Math.random()*75: Math.random()*-75: (Math.random()>0.5)? Math.random()*400: Math.random()*-400, this.last_platform_y + stepsize + (5*Math.random()));
                this.last_platform_y = platform.position.y;
            }
            this.floor += num;
            this.count += 1000;
            
            //this.needmoreplatform = false;
        //}
    }

    randomChoosePlatform()
    {
        let rand = Math.random();
        let height = parseInt(this.score.getComponent(cc.Label).string);
        let extra = 0.02 * Buy.Global.platform;

        //0: normal, 1: moveable, 2: time, 3: break
        let prob1 = [6 + extra , 1, 0.5, 1];
        let prob2 = [5.5 + extra, 1.5, 0.5, 1];
        let prob3 = [5 + extra, 1.5, 0.5, 1.5];
        let prob4 = [4.5 + extra, 1.5, 1.5, 1.5];
        let prob5 = [4 + extra, 2, 1.5, 1.5];
        let prob6 = [3.5 + extra, 2, 2, 1.5];
        let prob7 = [3 + extra, 2, 2.5, 1.5];
        let prob8 = [2.5 + extra, 2.5, 2.5, 1.5];
        let prob = (height >= 1500) ? (height >= 2500) ? (height >= 3500) ? (height > 4500) ? (height>=5500) ? (height >= 6500) ? (height >=7500) ? prob8 : prob7 : prob6: prob5 : prob4 : prob3 : prob2 : prob1;
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
        this.counter();
        let height = parseInt(this.score.getComponent(cc.Label).string);
        let Dead = this.player.getComponent("Player").isDied;
        if(this.player.y - this.camera.y > 100){
            height += Math.floor(3 + 3 * Math.random());
            this.score.getComponent(cc.Label).string = height + '';
            this.camera.y = this.player.y - 100;
        }
        if(this.camera.y - this.background.y >= this.backgroundSize)
           this.background.y += this.backgroundSize;
    
        if(height >= this.count + 550){
            //this.needmoreplatform = true;
            if(height >= 6750){
                this.generatePlatforms(100, 70);
            }
            else if(height >= 5550){
                this.generatePlatforms(100, 70);
            }
            else if(height >= 4550){
                this.generatePlatforms(100, 65);
            }
            else if(height >= 3550){
                this.generatePlatforms(100, 65);
            }
            else if(height >= 2550){
                this.generatePlatforms(100, 60);
            }
            else if(height >= 1550){
                this.generatePlatforms(100, 50);
            }
            else if(height >= 550){
                this.generatePlatforms(100, 45);
            }
                
        }

        if(this.player.y - this.camera.y > 100)
            this.camera.y = this.player.y - 100;
    
        if(this.camera.y-300 > this.player.y && !this.EffectOn && !Dead)
        {
            if(this.player.active)
            {   
                cc.audioEngine.stopAll();
                var dieid = cc.audioEngine.playEffect(this.DieEffect, false);
                cc.audioEngine.setVolume(dieid, 0.25);
                this.EffectOn = true;
                this.platforms.removeAllChildren();
                if(this.knife.isValid)this.knife.destroy();
                this.player.getComponent("Player").isDied = true;
                this.gameover(parseInt(cc.find("Canvas/Main Camera/money").getComponent(cc.Label).string));
                //if(!Buy.Global.twoP) this.gameoverPanel.runAction(cc.fadeIn(1));
                this.scheduleOnce(()=>{
                    this.gameovershow();
                }, 1)
                this.scheduleOnce(()=>{
                    this.player.active = false;
                }, 0.6);
            }
        }
    }

    counter(){
        if(!this.istwoP) return;
        let s = parseInt(this.score.getComponent(cc.Label).string);
        if(this.c == 60){
            if(this.remaintime == 0){
                /*this.player.active = false;
                this.read = false;
                this.write = false;
                this.gameover(parseInt(cc.find("Canvas/Main Camera/money").getComponent(cc.Label).string));
                this.scheduleOnce(()=>{
                    this.gameovershow();
                }, 0.5)*/
                this.player.getComponent("Player").gameover();
                this.remaintime --;
            } else if(this.remaintime > 0){
                this.remaintime--;
                this.timer.getComponent(cc.Label).string = this.remaintime.toString();

                //stop reading if competitor isDie
                if(this.read){
                    //@ts-ignore
                    firebase.database().ref(`users/${this.ID}/2P`).once('value', snapshot => {
                        this.twoPshowscore = snapshot.val().score;
                        if(snapshot.val().isDie){
                            this.read = false;
                            if(this.player.getComponent("Player").isDied)
                                this.gameovershow();
                        }
                    }).then(()=>{
                        this.twoPscore.getChildByName("score").getComponent(cc.Label).string = this.twoPshowscore.toString();
                    });
                }

                //stop writting if isDie
                if(!this.player.getComponent("Player").isDied){
                    //@ts-ignore
                    firebase.database().ref(`users/${Buy.Global.competitorID}/2P`).set({
                        score: s,
                        isDie: false
                    });
                } else if(this.write){
                    //@ts-ignore
                    firebase.database().ref(`users/${Buy.Global.competitorID}/2P`).set({
                        score: s,
                        isDie: true
                    });
                    this.write = false;
                }
                this.c = 0;
            }
        } else{
            this.c ++;
        }
        
    }

    gameovershow(){
        cc.audioEngine.stopAll();
        if(Buy.Global.twoP){
            if(this.remaintime > 0 && this.read) return;
            cc.find("Canvas/Main Camera/2PGameOver/label").runAction(cc.blink(1.5, 7));
            cc.find("Canvas/Main Camera/2PGameOver/otherscore/number").getComponent(cc.Label).string = (Array(6).join("0") + this.twoPshowscore.toString()).slice(-6);
            cc.find("Canvas/Main Camera/2PGameOver/otherscore").getComponent(cc.Label).string = `${Buy.Global.competitorName}'s Score: `;
            //lose
            if(this.twoPshowscore > parseInt(this.score.getComponent(cc.Label).string)){
                cc.find("Canvas/Main Camera/2PGameOver/sprite").getComponent(cc.Sprite).spriteFrame = this.loseSprite;
                cc.find("Canvas/Main Camera/2PGameOver/sprite/label").getComponent(cc.Label).string = "LOSE QQ";
                cc.audioEngine.playEffect(this.lose2_effect, false);
            } else{ //win
                cc.find("Canvas/Main Camera/2PGameOver/sprite").getComponent(cc.Sprite).spriteFrame = this.winSprite;
                cc.find("Canvas/Main Camera/2PGameOver/sprite/label").getComponent(cc.Label).string = "WIN ! !";
                cc.audioEngine.playEffect(this.win_effect, false);
            }
            this.twoPgameoverPanel.active = true;
            Buy.Global.twoP = false;

            let action = cc.spawn(cc.moveBy(0.9, 0, -50), cc.fadeIn(0.9));
            cc.find("Canvas/Main Camera/2PGameOver/label").runAction(cc.blink(1.5, 7));
            this.scheduleOnce(()=>{
                cc.find("Canvas/Main Camera/2PGameOver/coin").runAction(action);
                cc.find("Canvas/Main Camera/2PGameOver/score").runAction(action);
            }, 1.5);
            this.scheduleOnce(()=>{
                cc.find("Canvas/Main Camera/2PGameOver/otherscore").runAction(action);
            },2.45);
            this.scheduleOnce(()=>{
                cc.find("Canvas/Main Camera/2PGameOver/sprite").runAction(cc.fadeTo(0.7, 230));
            }, 3.4);
            
        } else{
            this.gameoverPanel.active = true;
            this.scheduleOnce(()=>{
                cc.find("Canvas/Main Camera/GameOver/label").runAction(cc.blink(1.5, 7));
                let action = cc.spawn(cc.moveBy(0.9, 0, -50), cc.fadeIn(0.9));
                this.scheduleOnce(()=>{
                    cc.find("Canvas/Main Camera/GameOver/Score").runAction(action);
                }, 1.5);
                this.scheduleOnce(()=>{
                    cc.find("Canvas/Main Camera/GameOver/Coin").runAction(action);
                }, 2.45);
            }, 0.01);
            
            cc.audioEngine.playEffect(this.lose1_effect, false);
        }
    }

    gameover(money: number){
        let s = parseInt(this.score.getComponent(cc.Label).string);
        cc.find("Canvas/Main Camera/GameOver/Coin/number").getComponent(cc.Label).string = money.toString() + '$';
        cc.find("Canvas/Main Camera/GameOver/Score/number").getComponent(cc.Label).string = (Array(6).join("0") + this.score.getComponent(cc.Label).string).slice(-6);
        cc.find("Canvas/Main Camera/2PGameOver/coin/number").getComponent(cc.Label).string = money.toString() + '$';
        cc.find("Canvas/Main Camera/2PGameOver/score/number").getComponent(cc.Label).string = (Array(6).join("0") + this.score.getComponent(cc.Label).string).slice(-6);    
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
        Buy.Global.coin = this.remaincoin + money;
        this.reset();
    }

    reset(){
        Buy.Global.Buy_Kirby = 0;
        Buy.Global.Extra_jump = 0;
        Buy.Global.Extra_life = 0;
        Buy.Global.Extra_range = 0;
        Buy.Global.more_Rocket = 0;
        Buy.Global.more_Shield = 0;
        Buy.Global.platform = 0;
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

    playagain(){
        cc.audioEngine.stopAll();
        switch(Buy.Global.select){
            case 0: {
                cc.director.loadScene("Play");
                var basicid = cc.audioEngine.playMusic(this.basic_bgm, true);
                cc.audioEngine.setVolume(basicid, 0.5);
                break;
            }
            case 1: {
                var spaceid = cc.audioEngine.playMusic(this.space_bgm, true);
                cc.audioEngine.setVolume(spaceid, 0.5);
                cc.director.loadScene("Play_space");
                break;
            }
            case 2: {
                cc.director.loadScene("Play_ghost");
                var ghostid = cc.audioEngine.playMusic(this.ghost_bgm, true);
                cc.audioEngine.setVolume(ghostid, 0.5);
            }
            default: {
                break;
            }
        }
    }
    backtomenu(){
        cc.director.loadScene("Menu");
        cc.audioEngine.stopAll();
    }
}
