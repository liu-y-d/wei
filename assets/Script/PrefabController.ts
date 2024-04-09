import { _decorator, Component, Node,Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PrefabController')
export class PrefabController extends Component {


    @property(Prefab)
    public rankPrefab: Prefab = null;
    @property(Prefab)
    public WorldRankPrefab:Prefab;

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

    @property(Prefab)
    public Star_4:Prefab;

    @property(Prefab)
    public Star_6:Prefab;

    @property(Prefab)
    public Star_8:Prefab;
    start() {

    }

    update(deltaTime: number) {

    }
}

