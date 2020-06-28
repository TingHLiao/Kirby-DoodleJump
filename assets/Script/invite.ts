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

    private User = null;
    private Users = null;
    private Name : string = "";
    private ID : string = "";
    private isShow : Boolean = false;

    //the one i want to invite
    private inviteName: string = "";
    //the one who invite me
    private beinvitedNmae: string = "";
    private beinvitedID: string = "";

    onLoad () {
        cc.log('onload')
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
        });
    }

    // onLoad () {}

    start () {

    }

    update (dt) {}

    showAllUser(){
        if(this.isShow){
            this.InvitePanel.active = false;
            this.storebutton.interactable = true;
            this.instrbutton.interactable = true;
            this.leaderbutton.interactable = true;
            this.cover.runAction(cc.fadeTo(0.2, 255));
            this.isShow = false;
            this.content.removeAllChildren();
            return;
        }
        this.InvitePanel.active = true;
        this.storebutton.interactable = false;
        this.instrbutton.interactable = false;
        this.leaderbutton.interactable = false;
        this.cover.runAction(cc.fadeTo(0.2, 128));
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
            this.storebutton.interactable = true;
            this.instrbutton.interactable = true;
            this.leaderbutton.interactable = true;
            this.cover.runAction(cc.fadeTo(0.2, 255));
            this.isShow = false;
            this.content.removeAllChildren();
        }
        this.Users.child(inviteID + '/Request').push({
            name: this.Name,
            id: this.ID
        })
    }
    ReponseChecking(){

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
                    }
                }
            })
        })
    }

    Agree(){
        this.BeInvitedPanel.active = false;
        this.Users.child(this.beinvitedID + '/Reponse').push({
            message: 'OK',
            name: this.Name,
            id: this.ID
        })
    }
    Reject(){
        this.BeInvitedPanel.active = false;
        this.Users.child(this.beinvitedID + '/Reponse').push({
            message: 'NO',
            name: this.Name,
            id: this.ID
        })
    }
}
