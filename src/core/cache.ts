import Pio from './track'

export class Cache {
  // pio是否已实例化
  public loaded: boolean = false
  public instance!: Pio
}

export default new Cache()
