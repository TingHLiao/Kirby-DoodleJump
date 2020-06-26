const {ccclass, property} = cc._decorator;

@ccclass
export class Login extends cc.Component {
    
    @property(cc.EditBox)
    username: cc.EditBox = null;

    @property(cc.EditBox)
    password: cc.EditBox = null;

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

    login(){
        //@ts-ignore
        firebase.auth().signInWithEmailAndPassword(this.username.string, this.password.string).then( ()=>{
            //@ts-ignore
            var user = firebase.auth().currentUser; 
            if(user){
                cc.director.loadScene("Menu");
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
