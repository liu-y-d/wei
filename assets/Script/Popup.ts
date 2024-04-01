import { _decorator, Component, Node ,Prefab } from 'cc';
import {UIManager} from "db://assets/Script/UIManager";
import {Global} from "db://assets/Script/Global";
import {AudioMgr} from "db://assets/Script/AudioMgr";
const { ccclass, property } = _decorator;

@ccclass('Popup')
export class Popup extends Component {

    @property(Prefab)
    public gameOverTooltip:Prefab;

    @property(Prefab)
    public promptTooltip:Prefab;

    @property(Prefab)
    public menuTooltip:Prefab;

    @property(Prefab)
    public mainMenuTooltip:Prefab;



    init(popupType:number) {
        if (Global.getInstance().getSoundEffectState()) {
            AudioMgr.inst.playOneShot('audio/menu')
        }
        UIManager.getInstance().popupMap.get(popupType).init();
    }
}


