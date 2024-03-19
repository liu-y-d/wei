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

    @property(Prefab)
    public obstacleEmit:Prefab;

    @property(Prefab)
    public propsEmit:Prefab;

    @property(Prefab)
    public props:Prefab;
    start() {

    }

    update(deltaTime: number) {
        
    }
}

