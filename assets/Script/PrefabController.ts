import { _decorator, Component, Node,Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PrefabController')
export class PrefabController extends Component {


    @property(Prefab)
    public rankPrefab: Prefab = null;

    @property(Prefab)
    public loading: Prefab = null;

    @property(Prefab)
    public maskGlobal:Prefab;
    start() {

    }

    update(deltaTime: number) {
        
    }
}

