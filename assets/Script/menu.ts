const {ccclass, property} = cc._decorator;

import * as Buy from "./Buy"
import Invite from "./invite";

@ccclass
export default class Stage extends cc.Component {

    @property(cc.Button)
    leaderbutton: cc.Button = null;
    @property(cc.Button)
    storebutton: cc.Button = null;
    @property(cc.Button)
    instrbutton: cc.Button = null;
    @property(cc.Button)
    twoPbutton: cc.Button = null;
    @property(cc.Button)
    leftbutton: cc.Button = null;
    @property(cc.Button)
    rightbutton: cc.Button = null;

    @property(cc.Node)
    cover: cc.Node = null; //stop
    
    @property(cc.Node)
    boardPanel: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    boardPanel_store: cc.Node = null;

    @property(cc.Node)
    boardPanel_instr: cc.Node = null;

    @property(cc.Prefab)
    player1: cc.Prefab = null;

    @property(cc.Prefab)
    player2: cc.Prefab = null;

    @property(cc.Prefab)
    player3: cc.Prefab = null;

    @property(cc.Prefab)
    player: cc.Prefab = null;

    @property({type: cc.AudioClip})
    clickEffect: cc.AudioClip = null;

    private show: boolean = false;
    private storeshow: boolean = false;
    private instrshow: boolean = false;

    nameText: cc.Label;
    highestText: cc.Label;
    coinText: cc.Label;
    ID: string;
    money: Number;
    buttons: cc.Node[] = [];
    price: number[] = [];
    limits: number[] = [];
    // 0: jump; 1: range; 2: platform; 3: rocket; 4: shield
    level: number = 0;
    originPanel: cc.Node = null;
    spacePanel: cc.Node = null;
    ghostPanel: cc.Node = null;


    onLoad () {
        this.nameText = cc.find("Canvas/cover/username/name").getComponent(cc.Label);
        this.highestText = cc.find("Canvas/cover/highest/score").getComponent(cc.Label);
        this.coinText = cc.find("Canvas/cover/coin/number").getComponent(cc.Label);
        this.init();  //for store
        this.leftbutton.interactable = false;
        this.originPanel = cc.find("Canvas/cover/origin");
        this.spacePanel = cc.find("Canvas/cover/space");
        this.ghostPanel = cc.find("Canvas/cover/ghost");
        
        if(Buy.Global.username != ""){
            this.nameText.string = Buy.Global.username;
            this.highestText.string = (Array(6).join("0") + Buy.Global.highest.toString()).slice(-6);
            this.coinText.string = Buy.Global.coin.toString() + '$';
            this.ID = Buy.Global.userID;
        } else{
            //@ts-ignore
            firebase.auth().onAuthStateChanged(user => {
                this.ID = user.email.replace('@', '-').split('.').join('_');
                //@ts-ignore
                firebase.database().ref(`users/${this.ID}`).once('value', snapshot => {
                    this.nameText.string = Buy.Global.username = snapshot.val().name;
                });
                //@ts-ignore
                firebase.database().ref(`users/${this.ID}/highest`).once('value', snapshot => {
                    this.highestText.string = (Array(6).join("0") + snapshot.val().score.toString()).slice(-6);
                    Buy.Global.highest = parseInt(this.highestText.string);
                });
                //@ts-ignore
                firebase.database().ref(`users/${this.ID}/coin`).once('value', snapshot => {
                    this.coinText.string = snapshot.val().number.toString() + '$';
                    Buy.Global.coin = parseInt(this.coinText.string);
                });
            });
        }
        //@ts-ignore
        firebase.database().ref(`users/${this.ID}/2P`).set({
            score: 0,
            isDie: false
        });

        this.buttons[0] = cc.find("Canvas/store_page/scrollview/view/content/snow_kirby/snow_kirby");
        this.buttons[1] = cc.find("Canvas/store_page/scrollview/view/content/ninja_kirby/ninja_kirby");
        this.buttons[2] = cc.find("Canvas/store_page/scrollview/view/content/magic_kirby/magic_kirby");
        this.buttons[3] = cc.find("Canvas/store_page/scrollview/view/content/knight_kirby/knight_kirby");
        this.buttons[4] = cc.find("Canvas/store_page/scrollview/view/content/life/life");
        this.buttons[5] = cc.find("Canvas/store_page/scrollview/view/content/jump/jump");
        this.buttons[6] = cc.find("Canvas/store_page/scrollview/view/content/range/range");
        this.buttons[7] = cc.find("Canvas/store_page/scrollview/view/content/platform/platform");
        this.buttons[8] = cc.find("Canvas/store_page/scrollview/view/content/rocket/rocket");
        this.buttons[9] = cc.find("Canvas/store_page/scrollview/view/content/shield/shield");
    }

    start () {
        cc.director.preloadScene("Play");
        cc.director.preloadScene("Play_space");
        cc.director.preloadScene("Play_ghost");
    }
    //write firebase
    playorigin(){
        cc.audioEngine.playEffect(this.clickEffect, false);
        cc.director.loadScene("Play");
        Buy.Global.select = 0;
    }
    playspace(){
        cc.audioEngine.playEffect(this.clickEffect, false);
        cc.director.loadScene("Play_space");
        Buy.Global.select = 1;
        cc.log("in");
    }
    playghost(){
        cc.audioEngine.playEffect(this.clickEffect, false);
        cc.director.loadScene("Play_ghost");
        Buy.Global.select = 2;
    }

    showboard(){
        cc.audioEngine.playEffect(this.clickEffect, false);
        if(this.show){
            this.boardPanel.active = false;
            this.storebutton.interactable = true;
            this.instrbutton.interactable = true;
            this.twoPbutton.interactable = true;
            this.leftbutton.interactable = (this.level == 0)? false : true;
            this.rightbutton.interactable = (this.level == 2)? false : true;
            this.cover.runAction(cc.fadeTo(0.2, 255));
            this.show = false;
            this.content.removeAllChildren();
            return;
        }
        this.leader();
        //cc.find("Canvas").getComponent("leader").leader();
        this.storebutton.interactable = false;
        this.instrbutton.interactable = false;
        this.twoPbutton.interactable = false;
        this.leftbutton.interactable = false;
        this.rightbutton.interactable = false;
        this.show = true;
        this.cover.runAction(cc.fadeTo(0.2, 128));
        this.boardPanel.active = true;
        this.boardPanel.runAction(cc.fadeIn(0.2));
    }

    leader(){
        var rank = 0;
        var result = [];
        //@ts-ignore
        firebase.database().ref(`leader`).orderByChild("score").limitToLast(10).once("value", snapshot => {
            snapshot.forEach(element =>{
                result.push([element.val().name, element.val().score]);
            })
        }).then(()=>{
            //cc.log(result)
            result.reverse().forEach(data =>{
                rank++;
                if(rank == 1){
                    var node = cc.instantiate(this.player1);
                    node.getChildByName("name").getComponent(cc.Label).string = data[0];
                    node.getChildByName("score").getComponent(cc.Label).string = (Array(6).join("0") + data[1].toString()).slice(-6);
                    this.content.addChild(node);
                } else if(rank == 2){
                    var node = cc.instantiate(this.player2);
                    node.getChildByName("name").getComponent(cc.Label).string = data[0];
                    node.getChildByName("score").getComponent(cc.Label).string = (Array(6).join("0") + data[1].toString()).slice(-6);
                    this.content.addChild(node);
                } else if(rank == 3){
                    var node = cc.instantiate(this.player3);
                    node.getChildByName("name").getComponent(cc.Label).string = data[0];
                    node.getChildByName("score").getComponent(cc.Label).string = (Array(6).join("0") + data[1].toString()).slice(-6);
                    this.content.addChild(node);
                } else{
                    var node = cc.instantiate(this.player);
                    node.getChildByName("rank").getComponent(cc.Label).string = rank.toString();
                    node.getChildByName("name").getComponent(cc.Label).string = data[0];
                    node.getChildByName("score").getComponent(cc.Label).string = (Array(6).join("0") + data[1].toString()).slice(-6);
                    this.content.addChild(node);
                }
            })
        })
    }

    onStoreClick(){
        cc.audioEngine.playEffect(this.clickEffect, false);
        this.updatemoney();
        if(this.storeshow){
            // this.updatemoney();
            this.boardPanel_store.active = false;
            this.leaderbutton.interactable = true;
            this.instrbutton.interactable = true;
            this.twoPbutton.interactable = true;
            this.leftbutton.interactable = (this.level == 0)? false : true;
            this.rightbutton.interactable = (this.level == 2)? false : true;
            this.cover.runAction(cc.fadeTo(0.2, 255));
            this.storeshow = false;
            return;
        }
        //cc.find("Canvas").getComponent("leader").leader();

        this.storeshow = true;
        this.leaderbutton.interactable = false;
        this.instrbutton.interactable = false;
        this.twoPbutton.interactable = false;
        this.leftbutton.interactable = false;
        this.rightbutton.interactable = false;
        this.cover.runAction(cc.fadeTo(0.2, 128));
        this.boardPanel_store.active = true;
        this.boardPanel_store.runAction(cc.fadeIn(0.2));  
    }

    buy_Kirby(event){
        switch(event.target.name){
            case 'snow_kirby': {
                Buy.Global.Buy_Kirby = 1;
                Buy.Global.coin -= this.price[0];
                break;
            }
            case 'ninja_kirby': {
                Buy.Global.Buy_Kirby = 2;
                Buy.Global.coin -= this.price[1];
                break;
            }
            case 'magic_kirby': {
                Buy.Global.Buy_Kirby = 3;
                Buy.Global.coin -= this.price[2];
                break;
            }
            case 'knight_kirby': {
                Buy.Global.Buy_Kirby = 4;
                Buy.Global.coin -= this.price[3];
                break;
            }
            default: {
                break;
            }
        }
        event.target.getComponent(cc.Button).interactable = false;
        event.target.opacity = 130;
        this.updatemoney();
    }

    buy_ability(event){
        switch(event.target.name){
            case 'life': {
                Buy.Global.Extra_life++;
                Buy.Global.coin -= this.price[4];
                break;
            }
            case 'jump': {
                this.limits[0]++;
                Buy.Global.Extra_jump++;
                Buy.Global.coin -= this.price[5];
                break;
            }
            case 'range': {
                this.limits[1]++;
                Buy.Global.Extra_range++;
                Buy.Global.coin -= this.price[6];
                break;
            }
            case 'platform': {
                this.limits[2]++;
                Buy.Global.platform++;
                Buy.Global.coin -= this.price[7];
                break;
            }
            case 'rocket': {
                this.limits[3]++;
                Buy.Global.more_Rocket++;
                Buy.Global.coin -= this.price[8];
                break;
            }
            case 'shield': {
                this.limits[4]++;
                Buy.Global.more_Shield++;
                Buy.Global.coin -= this.price[9];
                break;
            }
            default: {
                break;
            }
        }
        this.updatemoney();
    }

    updatemoney(){
        for(var i = 0; i < 5; i++){
            if(this.limits[i] == 5){
                this.buttons[i+5].getComponent(cc.Button).interactable = false;
                this.buttons[i+5].opacity = 130;
                this.buttons[i+5].zIndex = 100;
            }
        }

        for(var i = 0; i < this.buttons.length; i++){
            if(this.price[i] > Buy.Global.coin){ 
                this.buttons[i].getComponent(cc.Button).interactable = false;
                this.buttons[i].opacity = 130;
                this.buttons[i].zIndex = 100;
            }
        }
        // if(parseInt(this.coinText.string) == Buy.Global.coin)   // not sure
        //     return;
        this.coinText.string = Buy.Global.coin.toString() + "$";
        
        //@ts-ignore
        firebase.database().ref(`users/${this.ID}/coin`).set({
            number: Buy.Global.coin
        });
    }

    onInstrClick(){
        cc.audioEngine.playEffect(this.clickEffect, false);
        if(this.instrshow){
            this.boardPanel_instr.active = false;
            this.leaderbutton.interactable = true;
            this.storebutton.interactable = true;
            this.twoPbutton.interactable = true;
            this.leftbutton.interactable = (this.level == 0)? false : true;
            this.rightbutton.interactable = (this.level == 2)? false : true;
            this.cover.runAction(cc.fadeTo(0.2, 255));
            this.instrshow = false;
            return;
        }
        this.instrshow = true;
        this.leaderbutton.interactable = false;
        this.storebutton.interactable = false;
        this.twoPbutton.interactable = false;
        this.leftbutton.interactable = false;
        this.rightbutton.interactable = false;
        this.cover.runAction(cc.fadeTo(0.2, 128));
        this.boardPanel_instr.active = true;
        this.boardPanel_instr.runAction(cc.fadeIn(0.2));
    }
    // update (dt) {}


    private init(){
        Buy.Global.Buy_Kirby = 0;
        Buy.Global.Extra_jump = 0;
        Buy.Global.Extra_life = 0;
        Buy.Global.Extra_range = 0;
        Buy.Global.more_Rocket = 0;
        Buy.Global.more_Shield = 0;
        Buy.Global.platform = 0;
        this.price = [5, 10, 20, 100, 5, 5, 5, 5, 5, 5];  // can change
        this.limits = [0, 0, 0, 0, 0];
    }

    private rightclick(){
        cc.audioEngine.playEffect(this.clickEffect, false);
        if(this.level == 0){
            this.spacePanel.active = true;
            this.originPanel.active = false;
            this.leftbutton.interactable = true;
            this.level++;
        } else if(this.level == 1){
            this.ghostPanel.active = true;
            this.spacePanel.active = false;
            this.rightbutton.interactable = false;
            this.level++;
        }
    }
    private leftclick(){
        cc.audioEngine.playEffect(this.clickEffect, false);
        if(this.level == 2){
            this.spacePanel.active = true;
            this.ghostPanel.active = false;
            this.rightbutton.interactable = true;
            this.level--;
        } else if(this.level == 1){
            this.originPanel.active = true;
            this.spacePanel.active = false;
            this.leftbutton.interactable = false;
            this.level--;
        }
    }

}
