const {ccclass, property} = cc._decorator;

@ccclass
export class Login extends cc.Component {
    
    @property(cc.EditBox)
    editbox1: cc.EditBox = null;

    @property(cc.EditBox)
    editbox2: cc.EditBox = null;

    start(){
    }

    login(){
        //@ts-ignore
        firebase.auth().signInWithEmailAndPassword(this.editbox1.string, this.editbox2.string).then( ()=>{
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
