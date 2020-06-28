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

    @property(cc.Node)
    choose: cc.Node = null;

    private show: boolean = false;
    private storeshow: boolean = false;
    private instrshow: boolean = false;
    private jump_limit: number = 0;
    private range_limit: number = 0;
    private buttons: cc.Node[] = [];

    nameText: cc.Label;
    highestText: cc.Label;
    coinText: cc.Label;
    ID: string;
    money: Number;
    price: Number[] = [];

    onLoad () {
        this.nameText = cc.find("Canvas/cover/username/name").getComponent(cc.Label);
        this.highestText = cc.find("Canvas/cover/highest/score").getComponent(cc.Label);
        this.coinText = cc.find("Canvas/cover/coin/number").getComponent(cc.Label);
        this.init();
        
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
                firebase.database().ref(`users/${ID}`).once('value', snapshot => {
                    this.nameText.string = Buy.Global.username = snapshot.val().name;
                });
                //@ts-ignore
                firebase.database().ref(`users/${ID}/highest`).once('value', snapshot => {
                    this.highestText.string = (Array(6).join("0") + snapshot.val().score.toString()).slice(-6);
                    Buy.Global.highest = parseInt(this.highestText.string);
                });
                //@ts-ignore
                firebase.database().ref(`users/${ID}/coin`).once('value', snapshot => {
                    this.coinText.string = snapshot.val().number.toString() + '$';
                    Buy.Global.coin = parseInt(this.coinText.string);
                });
            });
        }

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
    }
    //write firebase
    play(){
        cc.director.loadScene("Play");
    }

    showboard(){
        if(this.show){
            this.boardPanel.active = false;
            this.storebutton.interactable = true;
            this.instrbutton.interactable = true;
            this.cover.runAction(cc.fadeTo(0.2, 255));
            this.show = false;
            this.content.removeAllChildren();
            return;
        }
        this.leader();
        //cc.find("Canvas").getComponent("leader").leader();
        this.storebutton.interactable = false;
        this.instrbutton.interactable = false;
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
        this.updatemoney();
        if(this.storeshow){
            // this.updatemoney();
            this.boardPanel_store.active = false;
            this.leaderbutton.interactable = true;
            this.instrbutton.interactable = true;
            this.cover.runAction(cc.fadeTo(0.2, 255));
            this.storeshow = false;
            return;
        }
        //cc.find("Canvas").getComponent("leader").leader();

        this.storeshow = true;
        this.leaderbutton.interactable = false;
        this.instrbutton.interactable = false;
        this.cover.runAction(cc.fadeTo(0.2, 128));
        this.boardPanel_store.active = true;
        this.boardPanel_store.runAction(cc.fadeIn(0.2));  
    }

    buy_Kirby(event){
        switch(event.target.name){
            case 'snow_kirby': {
                Buy.Global.Buy_Kirby = 1;
                Buy.Global.coin -= 5;
                break;
            }
            case 'ninja_kirby': {
                Buy.Global.Buy_Kirby = 2;
                Buy.Global.coin -= 10;
                break;
            }
            case 'magic_kirby': {
                Buy.Global.Buy_Kirby = 3;
                Buy.Global.coin -= 20;
                break;
            }
            case 'knight_kirby': {
                Buy.Global.Buy_Kirby = 4;
                Buy.Global.coin -= 100;
                break;
            }
            default: {
                break;
            }
        }
        this.updatemoney();
        cc.log(Buy.Global.coin);
    }

    buy_ability(event){
        switch(event.target.name){
            case 'life': {
                Buy.Global.Extra_life++;
                Buy.Global.coin -= 5;
                break;
            }
            case 'jump': {
                if(this.jump_limit >= 5){
                    event.target.getComponent(cc.Button).interactable = false;
                    event.target.opacity = 130;
                    event.target.zIndex = 100;
                    break;
                }
                this.jump_limit++;
                Buy.Global.Extra_jump++;
                Buy.Global.coin -= 5;
                break;
            }
            case 'range': {
                if(this.range_limit >= 5){
                    event.target.getComponent(cc.Button).interactable = false;
                    event.target.opacity = 130;
                    event.target.zIndex = 100;
                    break;
                }
                this.range_limit++;
                Buy.Global.Extra_range++;
                Buy.Global.coin -= 5;
                break;
            }
            case 'platform': {
                Buy.Global.platform++;
                Buy.Global.coin -= 5;
                break;
            }
            case 'rocket': {
                Buy.Global.more_Rocket++;
                Buy.Global.coin -= 5;
                break;
            }
            case 'shield': {
                Buy.Global.more_Shield++;
                Buy.Global.coin -= 5;
                break;
            }
            default: {
                break;
            }
        }
        this.updatemoney();
        cc.log(Buy.Global.coin);
    }

    updatemoney(){
        for(var i = 0; i < this.buttons.length; i++){
            if(this.price[i] > Buy.Global.coin){ 
                this.buttons[i].getComponent(cc.Button).interactable = false;
                this.buttons[i].opacity = 130;
                this.buttons[i].zIndex = 100;
            }
        }
        if(parseInt(this.coinText.string) == Buy.Global.coin)   // not sure
            return;
        this.coinText.string = Buy.Global.coin.toString() + "$";
        
        //@ts-ignore
        firebase.database().ref(`users/${this.ID}/coin`).set({
            number: Buy.Global.coin
        }).then(()=>{
            cc.log("save");
        });
    }

    onInstrClick(){
        if(this.instrshow){
            this.boardPanel_instr.active = false;
            this.leaderbutton.interactable = true;
            this.storebutton.interactable = true;
            this.cover.runAction(cc.fadeTo(0.2, 255));
            this.instrshow = false;
            return;
        }
        this.instrshow = true;
        this.leaderbutton.interactable = false;
        this.storebutton.interactable = false;
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
        this.price = [5, 10, 20, 100, 5, 5, 5, 5, 5, 5];
    }
}
