import * as Buy from "./Buy"
const {ccclass, property} = cc._decorator;

@ccclass
export class Login extends cc.Component {
    
    @property(cc.EditBox)
    username: cc.EditBox = null;

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

    login(){
        //@ts-ignore
        firebase.auth().signInWithEmailAndPassword(this.username.string, this.password.string).then( ()=>{
            //@ts-ignore
            let user = firebase.auth().currentUser; 
            var ID = this.username.string.replace('@', '-').split('.').join('_');
            if(user){
                this.loading.active = true;
                this.startAction();
                //@ts-ignore
                firebase.database().ref(`users/${ID}`).once('value', snapshot => {
                    Buy.Global.username = snapshot.val().name;
                });
                //@ts-ignore
                firebase.database().ref(`users/${ID}/highest`).once('value', snapshot => {
                    Buy.Global.highest = snapshot.val().score;
                });
                //@ts-ignore
                firebase.database().ref(`users/${ID}/coin`).once('value', snapshot => {
                    Buy.Global.coin = snapshot.val().number;
                });
                this.schedule(function(){
                    cc.director.loadScene("Menu");
                }, 4);
            }
        })
        .catch((error) => {
            alert(error.message);
        });
    }
    create(){
        cc.director.loadScene("SignUp");
    }
}
