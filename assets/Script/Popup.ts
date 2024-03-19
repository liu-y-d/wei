import { _decorator, Component, Node ,Prefab } from 'cc';
import {UIManager} from "db://assets/Script/UIManager";
const { ccclass, property } = _decorator;

@ccclass('Popup')
export class Popup extends Component {

    @property(Prefab)
    public gameOverTooltip:Prefab;

    @property(Prefab)
    public promptTooltip:Prefab;

    @property(Prefab)
    public menuTooltip:Prefab;



    init(popupType:number) {
        UIManager.getInstance().popupMap.get(popupType).init();
    }
}


