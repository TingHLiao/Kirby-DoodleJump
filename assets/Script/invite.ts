import * as Buy from "./Buy"
const {ccclass, property} = cc._decorator;

@ccclass
export default class Invite extends cc.Component {

    @property(cc.Button)
    leaderbutton: cc.Button = null;
    @property(cc.Button)
    storebutton: cc.Button = null;
    @property(cc.Button)
    instrbutton: cc.Button = null;

    @property(cc.Node)
    cover: cc.Node = null;

    @property(cc.Node)
    BeInvitedPanel: cc.Node = null;

    @property(cc.Node)
    InvitePanel: cc.Node = null;

    @property(cc.Prefab)
    userPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    waiting: cc.Node = null;

    @property(cc.Node)
    reponse: cc.Node = null;

    @property(cc.Node)
    label1: cc.Node = null;
    @property(cc.Node)
    label2: cc.Node = null;
    @property(cc.Node)
    label3: cc.Node = null;

    private User = null;
    private Users = null;
    private Name : string = "";
    private ID : string = "";
    private isShow : Boolean = false;
    private getreponse : Boolean = true;
    private readytoplay : Boolean = false;
    private click : Boolean = false;

    //the one i want to invite
    private inviteName: string = "";
    //the one who invite me
    private beinvitedNmae: string = "";
    private beinvitedID: string = "";

    onLoad () {
        //@ts-ignore
        firebase.auth().onAuthStateChanged(user => {
            this.ID = user.email.replace('@', '-').split('.').join('_');
            //@ts-ignore
            this.Users = firebase.database().ref(`users`);
            //@ts-ignore
            this.User = firebase.database().ref(`users/${this.ID}`);
            this.User.once('value', snapshot => {
                this.Name = snapshot.val().name;
            })
            this.BeInvited();
            this.ReponseChecking();
        });
    }

    // onLoad () {}

    start () {

    }

    update (dt) {
        if(this.readytoplay){
            Buy.Global.twoP = true;
            this.readytoplay = false;
            this.scheduleOnce(()=>{
                cc.director.loadScene("Play");
            }, 2)
        }
    }

    showAllUser(){
        if(this.isShow){
            this.InvitePanel.active = false;
            this.uncover();
            this.isShow = false;
            this.content.removeAllChildren();
            return;
        }
        this.InvitePanel.active = true;
        this.getcover();
        this.isShow = true;
        this.Users.once('value').then(snapshot => {
            snapshot.forEach(element => {
                let name = element.val().name;
                if (element.key === this.ID) return;
                let node = cc.instantiate(this.userPrefab);
                let click = new cc.Component.EventHandler();
                let btn = node.getChildByName("btn").getComponent(cc.Button);
                node.getChildByName("name").getComponent(cc.Label).string = name;
                click.target = cc.find("Canvas");
                click.component = "invite";
                click.handler = "Invite";
                click.customEventData = element.key;
                btn.clickEvents.push(click);
                this.content.addChild(node);
            })
        });
    }

    Invite(event, inviteID: string){
        if(this.isShow){
            this.InvitePanel.active = false;
            this.getreponse = false;
            this.waiting.active = true;
            this.startAction();
            this.User.child(inviteID).once('value', snapshot => {
                this.inviteName = snapshot.val().name;
            })
            this.scheduleOnce(()=>{
                if(!this.getreponse){
                    this.reponse.getComponent(cc.Label).string = `Sorry ${this.inviteName} doesn't\nwant to play with youQQ`;
                    this.getreponse = true;
                    this.waiting.active = false;
                    this.reponse.active = true;
                    this.scheduleOnce(()=>{
                        this.reponse.active = false;
                        this.uncover();
                        this.isShow = false;
                    }, 2)
                }
            }, 10)
            this.content.removeAllChildren();
        }
        this.Users.child(inviteID + '/Request').push({
            name: this.Name,
            id: this.ID
        })
    }
    ReponseChecking(){
        let first_count = 0;
        let second_count = 0;
        let mes = "";
        this.User.child('Reponse').once('value').then(snapshot => {
            snapshot.forEach(element => {
                first_count += 1;
                let name = element.val().name;
                if(name != "none"){
                    this.User.child(`Reponse/${element.key}`).remove();
                }
            })

            this.User.child('Reponse').on('child_added', element => {
                second_count += 1;
                if (second_count > first_count) {
                    this.inviteName = element.val().name;
                    if(this.inviteName != "none"){
                        mes = element.val().message;
                        this.User.child(`Reponse/${element.key}`).remove();
                        if(!this.getreponse){
                            this.getreponse = true;
                            if(mes == "NO")
                                this.reponse.getComponent(cc.Label).string = `Sorry ${this.inviteName} doesn't\nwant to play with youQQ`;
                            else{
                                this.readytoplay = true;
                                this.reponse.getComponent(cc.Label).string = `${this.inviteName} takes your challenge!`;
                            }
                            this.waiting.active = false;
                            this.reponse.active = true;
                            this.scheduleOnce(()=>{
                                this.reponse.active = false;
                                if(!this.readytoplay)this.uncover();
                                this.isShow = false;
                            }, 2)
                        }
                    }
                }
            })
        })
    }

    BeInvited(){
        let first_count = 0;
        let second_count = 0;
        this.User.child('Request').once('value').then(snapshot => {
            snapshot.forEach(element => {
                first_count += 1;
                let name = element.val().name;
                if(name != "none"){
                    this.User.child(`Request/${element.key}`).remove();
                }
            })

            this.User.child('Request').on('child_added', element => {
                second_count += 1;
                if (second_count > first_count) {
                    this.beinvitedNmae = element.val().name;
                    this.beinvitedID = element.val().id;
                    if(this.beinvitedNmae != "none"){
                        this.User.child(`Request/${element.key}`).remove();
                        this.BeInvitedPanel.getChildByName("name").getComponent(cc.Label).string = this.beinvitedNmae;
                        this.BeInvitedPanel.active = true;
                        this.click = false;
                        this.getcover();
                        this.scheduleOnce(()=>{
                            if(!this.click){
                                this.BeInvitedPanel.active = false;
                                this.uncover();
                            }
                        },10)
                    }
                }
            })
        })
    }

    Agree(){
        this.click = true;
        this.BeInvitedPanel.active = false;
        this.Users.child(this.beinvitedID + '/Reponse').push({
            message: 'OK',
            name: this.Name,
            id: this.ID
        })
        this.readytoplay = true;
    }
    Reject(){
        this.click = true;
        this.BeInvitedPanel.active = false;
        this.uncover();
        this.Users.child(this.beinvitedID + '/Reponse').push({
            message: 'NO',
            name: this.Name,
            id: this.ID
        })
    }
    startAction(){
        this.label1.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.3), cc.delayTime(0.5), cc.fadeOut(0.3), cc.delayTime(2.2))));
        this.label2.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1.1), cc.fadeIn(0.3), cc.delayTime(0.5), cc.fadeOut(0.4), cc.delayTime(1.1))));
        this.label3.runAction(cc.repeatForever(cc.sequence(cc.delayTime(2.2), cc.fadeIn(0.3), cc.delayTime(0.5), cc.fadeOut(0.3))));
    }
    getcover(){
        this.storebutton.interactable = false;
        this.instrbutton.interactable = false;
        this.leaderbutton.interactable = false;
        this.cover.runAction(cc.fadeTo(0.2, 128));
    }
    uncover(){
        this.storebutton.interactable = true;
        this.instrbutton.interactable = true;
        this.leaderbutton.interactable = true;
        this.cover.runAction(cc.fadeTo(0.2, 255));
    }
}
