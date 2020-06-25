const {ccclass, property} = cc._decorator;

@ccclass
export default class Shield extends cc.Component {
    onLoad () {}

    start () {
        this.scheduleOnce(function () {
            this.node.runAction(cc.blink(1.5, 10));
            this.scheduleOnce(function () {
                this.node.removeFromParent();
            }, 1.6);
        }, 5);
    }
}
