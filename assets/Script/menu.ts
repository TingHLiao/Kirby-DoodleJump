const {ccclass, property} = cc._decorator;

import * as Buy from "./Buy"

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

    //private buttons: cc.Node[] = [];

    // private button_snow : cc.Node = cc.find("Canvas/store_page/scrollview/view/content/snow_kirby/snow_kirby");
    // private button_ninja : cc.Node = cc.find("Canvas/store_page/scrollview/view/content/ninja_kirby/ninja_kirby");
    // private button_magic : cc.Node = cc.find("Canvas/store_page/scrollview/view/content/magic_kirby/magic_kirby");
    // private button_knight : cc.Node = cc.find("Canvas/store_page/scrollview/view/content/knight_kirby/knight_kirby");
    // private button_life : cc.Node = cc.find("Canvas/store_page/scrollview/view/content/life/square1");
    // private button_jump : cc.Node = cc.find("Canvas/store_page/scrollview/view/content/jump/square1");
    // private button_range : cc.Node = cc.find("Canvas/store_page/scrollview/view/content/range/square1");
    // private button_platform : cc.Node = cc.find("Canvas/store_page/scrollview/view/content/platform/square1");
    // private button_rocket : cc.Node = cc.find("Canvas/store_page/scrollview/view/content/rocket/square1");
    // private button_shield : cc.Node = cc.find("Canvas/store_page/scrollview/view/content/shield/square1");

    nameText: cc.Label;
    highestText: cc.Label;
    coinText: cc.Label;
    ID: cc.Label;
    money: Number;

    onLoad () {
        this.nameText = cc.find("Canvas/cover/username/name").getComponent(cc.Label);
        this.highestText = cc.find("Canvas/cover/highest/score").getComponent(cc.Label);
        this.coinText = cc.find("Canvas/cover/coin/number").getComponent(cc.Label);
        //this.kirby_state = 0;   //normal
        Buy.Global.Buy_Kirby = 0;
        
        if(Buy.Global.username != ""){
            this.nameText.string = Buy.Global.username;
            this.highestText.string = (Array(6).join("0") + Buy.Global.highest.toString()).slice(-6);
            this.coinText.string = Buy.Global.coin.toString() + '$';
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
        if(this.storeshow){
            this.updatemoney();
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

    buy_snow(){
        Buy.Global.Buy_Kirby = 1;
        Buy.Global.coin -= 5;
    }

    buy_ninja(){
        Buy.Global.Buy_Kirby = 2;
        Buy.Global.coin -= 10;
    }

    buy_magic(){
        Buy.Global.Buy_Kirby = 3;
        Buy.Global.coin -= 20;
    }

    buy_knight(){
        Buy.Global.Buy_Kirby = 4;
        Buy.Global.coin -= 100;
    }

    buy_extralife(){
        Buy.Global.Extra_life++;
        Buy.Global.coin -= 5;
    }

    buy_rocket(){
        Buy.Global.more_Rocket++;
        Buy.Global.coin -= 5;
    }

    buy_shield(){
        Buy.Global.more_Shield++;
        Buy.Global.coin -= 5;
    }

    buy_platform(){
        Buy.Global.platform++;
        Buy.Global.coin -= 5;
    }

    buy_jump(){
        if(this.jump_limit < 5){
            this.jump_limit++;
            Buy.Global.Extra_jump++;
            Buy.Global.coin -= 5;
        }
    }

    buy_range(){
        if(this.range_limit < 5){
            this.range_limit++;
            Buy.Global.Extra_range++;
            Buy.Global.coin -= 5;
        } 
    }

    updatemoney(){
        if(parseInt(this.coinText.string) == Buy.Global.coin)
            return;
        this.coinText.string = (Array(6).join("0") + Buy.Global.coin.toString()).slice(-6);
        //@ts-ignore
        firebase.database().ref(`users/${this.ID}/coin`).set({
            number: Buy.Global.coin
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
}
