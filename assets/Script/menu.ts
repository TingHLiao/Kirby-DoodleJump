const {ccclass, property} = cc._decorator;

@ccclass
export default class Stage extends cc.Component {

    @property
    public user = null;

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
                this.coinText.string = (Array(8).join("0") + snapshot.val().coin.toString()).slice(-8);
            });
            //@ts-ignore
            firebase.database().ref(`users/${ID}/highest`).once('value', snapshot => {
                this.highestText.string = (Array(8).join("0") + snapshot.val().score.toString()).slice(-8);
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
            this.cover.runAction(cc.fadeTo(0.2, 255));
            this.show = false;
            this.content.removeAllChildren();
            return;
        }
        this.leader();
        //cc.find("Canvas").getComponent("leader").leader();
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
                    node.getChildByName("name").getComponent(cc.Label).string = data[0].toUpperCase();
                    node.getChildByName("score").getComponent(cc.Label).string = (Array(8).join("0") + data[1].toString()).slice(-8);
                    this.content.addChild(node);
                } else if(rank == 2){
                    var node = cc.instantiate(this.player2);
                    node.getChildByName("name").getComponent(cc.Label).string = data[0].toUpperCase();
                    node.getChildByName("score").getComponent(cc.Label).string = (Array(8).join("0") + data[1].toString()).slice(-8);
                    this.content.addChild(node);
                } else if(rank == 3){
                    var node = cc.instantiate(this.player3);
                    node.getChildByName("name").getComponent(cc.Label).string = data[0].toUpperCase();
                    node.getChildByName("score").getComponent(cc.Label).string = (Array(8).join("0") + data[1].toString()).slice(-8);
                    this.content.addChild(node);
                } else{
                    var node = cc.instantiate(this.player);
                    node.getChildByName("rank").getComponent(cc.Label).string = rank.toString();
                    node.getChildByName("name").getComponent(cc.Label).string = data[0].toUpperCase();
                    node.getChildByName("score").getComponent(cc.Label).string = (Array(8).join("0") + data[1].toString()).slice(-8);
                    this.content.addChild(node);
                }
            })
        })
    }

    onStoreClick(){
        if(this.show){
            this.boardPanel_store.active = false;
            this.cover.runAction(cc.fadeTo(0.2, 255));
            this.show = false;
            this.content.removeAllChildren();
            return;
        }
        this.store();
        //cc.find("Canvas").getComponent("leader").leader();
        this.show = true;
        this.cover.runAction(cc.fadeTo(0.2, 128));
        this.boardPanel_store.active = true;
        this.boardPanel_store.runAction(cc.fadeIn(0.2));
    }

    store(){

    }

    // update (dt) {}
}
