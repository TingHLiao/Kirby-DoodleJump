const {ccclass, property} = cc._decorator;

@ccclass
export default class Register extends cc.Component {
    @property(cc.EditBox)
    user: cc.EditBox = null;

    @property(cc.EditBox)
    email: cc.EditBox = null;

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

    register(){
        if(!this.onlyLetters(this.user.string)){
            alert("Username allow number and alphabet only!");
            return ;
        }
        //@ts-ignore
        firebase.auth().createUserWithEmailAndPassword(this.email.string, this.password.string).then( ()=>{
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
                }
            });
            //alert("Create Success!");
            setTimeout(() => {
                cc.director.loadScene("Menu");
            }, 1000);
        })
        .catch((error) => {
            alert(error.message);
        });
    }

    onlyLetters(str) {
        return str.match("^[A-Za-z0-9]+$");
    }
}
