const {ccclass, property} = cc._decorator;

@ccclass
export class Login extends cc.Component {
    
    @property(cc.EditBox)
    username: cc.EditBox = null;

    @property(cc.EditBox)
    password: cc.EditBox = null;

    start(){
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
