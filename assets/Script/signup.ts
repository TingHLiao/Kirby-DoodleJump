import * as Buy from "./Buy"
const {ccclass, property} = cc._decorator;

@ccclass
export default class Register extends cc.Component {
    @property(cc.EditBox)
    user: cc.EditBox = null;

    @property(cc.EditBox)
    email: cc.EditBox = null;

    @property(cc.EditBox)
    password: cc.EditBox = null;

    @property(cc.Node)
    loading: cc.Node = null;

    @property(cc.Node)
    label1: cc.Node = null;
    @property(cc.Node)
    label2: cc.Node = null;
    @property(cc.Node)
    label3: cc.Node = null;

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
    }

    start () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown(event) {
        if(event.keyCode == cc.macro.KEY.escape){
            cc.director.loadScene("Member");
        }
    }

    startAction(){
        this.label1.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.3), cc.delayTime(0.5), cc.fadeOut(0.3), cc.delayTime(2.2))));
        this.label2.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1.1), cc.fadeIn(0.3), cc.delayTime(0.5), cc.fadeOut(0.4), cc.delayTime(1.1))));
        this.label3.runAction(cc.repeatForever(cc.sequence(cc.delayTime(2.2), cc.fadeIn(0.3), cc.delayTime(0.5), cc.fadeOut(0.3))));
    }

    register(){
        if(!this.onlyLetters(this.user.string)){
            alert("Username allow number and alphabet only!");
            return ;
        }
        //@ts-ignore
        firebase.auth().createUserWithEmailAndPassword(this.email.string, this.password.string).then( ()=>{
            this.loading.active = true;
            this.startAction();
            //@ts-ignore
            let loginUser = firebase.auth().currentUser;
            let path = loginUser.email.replace('@', '-').split('.').join('_');
            let id = this.user.string;
            //@ts-ignore
            firebase.database().ref('users/' + path).set({
                name: id,
                highest: {
                    score: 0
                },
                coin: {
                    number: 0
                },
                Request: [{
                    name: 'none'
                }],
                Reponse: [{
                    name: 'none'
                }]
            });
            //alert("Create Success!");
            Buy.Global.username = id;
            Buy.Global.highest = 0;
            Buy.Global.coin = 0;
            this.schedule(function(){
                cc.director.loadScene("Menu");
            }, 4);
        })
        .catch((error) => {
            alert(error.message);
        });
    }

    onlyLetters(str) {
        return str.match("^[A-Za-z0-9]+$");
    }
}
