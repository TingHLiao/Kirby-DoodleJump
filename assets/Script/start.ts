const {ccclass, property} = cc._decorator;

@ccclass
export default class Start extends cc.Component {

    @property(cc.Node)
    label: cc.Node = null;

    fadeAction: cc.Action = null;

    @property({ type: cc.AudioClip })
    bgm: cc.AudioClip = null;

    onLoad() {
        this.fadeAction = this.setAction();
    }

    start () {
        cc.audioEngine.playMusic(this.bgm, true);
        this.schedule(function (){
            this.label.runAction(this.fadeAction);
        },2.7);

        this.node.on('mousedown', function(event){
            if(event.getButton() == 0){
                cc.director.loadScene("Member");
            }
        }, this);
    }

    setAction() {
        var fadeIn = cc.fadeIn(0.5);
        var delay = cc.delayTime(0.5);
        var fadeOut = cc.fadeOut(1.5);
        return cc.sequence(fadeIn, delay, fadeOut);
    }
}
