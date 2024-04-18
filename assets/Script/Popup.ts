import { _decorator, Component, Node ,Prefab } from 'cc';
import {UIManager} from "db://assets/Script/UIManager";
import {Global} from "db://assets/Script/Global";
import {AudioMgr} from "db://assets/Script/AudioMgr";
const { ccclass, property } = _decorator;

@ccclass('Popup')
export class Popup extends Component {

    @property(Prefab)
    public gameOverWinTooltip:Prefab;
    @property(Prefab)
    public gameOverLoseTooltip:Prefab;

    @property(Prefab)
    public promptTooltip:Prefab;

    @property(Prefab)
    public menuTooltip:Prefab;

    @property(Prefab)
    public mainMenuTooltip:Prefab;

    @property(Prefab)
    public guide:Prefab;

    @property(Prefab)
    public share:Prefab
    @property(Prefab)
    public mapPropsGuide:Prefab



    init(popupType:number) {
        if (Global.getInstance().getSoundEffectState()) {
            AudioMgr.inst.playOneShot('menu')
        }
        UIManager.getInstance().popupMap.get(popupType).init();
    }
}


