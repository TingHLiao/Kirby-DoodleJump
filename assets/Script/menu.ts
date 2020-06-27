const {ccclass, property} = cc._decorator;

@ccclass
export default class Stage extends cc.Component {

    @property
    public user = null;

    @property(cc.Button)
    leaderbutton: cc.Button = null;
    @property(cc.Button)
    storebutton: cc.Button = null;

    @property(cc.Node)
    cover: cc.Node = null; //stop
    
    @property(cc.Node)
    boardPanel: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    boardPanel_store: cc.Node = null;

    @property(cc.Prefab)
    player1: cc.Prefab = null;

    @property(cc.Prefab)
    player2: cc.Prefab = null;

    @property(cc.Prefab)
    player3: cc.Prefab = null;

    @property(cc.Prefab)
    player: cc.Prefab = null;

    private show: boolean = false;
    private storeshow: boolean = false;

    nameText: cc.Label;
    highestText: cc.Label;
    coinText: cc.Label;

    onLoad () {
        this.nameText = cc.find("Canvas/cover/username/name").getComponent(cc.Label);
        this.highestText = cc.find("Canvas/cover/highest/score").getComponent(cc.Label);
        this.coinText = cc.find("Canvas/cover/coin/number").getComponent(cc.Label);
        
        //@ts-ignore
        firebase.auth().onAuthStateChanged(user => {
            var ID = user.email.replace('@', '-').split('.').join('_');
            //@ts-ignore
            this.user = firebase.database().ref(`users/${ID}`);
            this.user.once('value', snapshot => {
                this.nameText.string = snapshot.val().name;
            });
            //@ts-ignore
            firebase.database().ref(`users/${ID}/highest`).once('value', snapshot => {
                this.highestText.string = (Array(6).join("0") + snapshot.val().score.toString()).slice(-6);
            });
            //@ts-ignore
            firebase.database().ref(`users/${ID}/coin`).once('value', snapshot => {
                this.coinText.string = snapshot.val().number.toString() + '$';
            });
        });
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
            this.cover.runAction(cc.fadeTo(0.2, 255));
            this.show = false;
            this.content.removeAllChildren();
            return;
        }
        this.leader();
        //cc.find("Canvas").getComponent("leader").leader();
        this.storebutton.interactable = false;
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
            cc.log(result)
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
            this.boardPanel_store.active = false;
            this.leaderbutton.interactable = true;
            this.cover.runAction(cc.fadeTo(0.2, 255));
            this.storeshow = false;
            this.content.removeAllChildren();
            return;
        }
        //cc.find("Canvas").getComponent("leader").leader();
        this.storeshow = true;
        this.leaderbutton.interactable = false;
        this.cover.runAction(cc.fadeTo(0.2, 128));
        this.boardPanel_store.active = true;
        this.boardPanel_store.runAction(cc.fadeIn(0.2));
    }

    buy_snow(){

    }

    buy_ninja(){

    }

    buy_kirby(){

    }
    // update (dt) {}
}
