type Fn<A> = (arg: A) => void

export class EventEmitter<A = void, F extends Fn<A> = Fn<A>> {
  private subscribers: F[] = []

  fire = (arg: A) => {
    for (const subscriber of this.subscribers) {
      subscriber(arg)
    }
  }

  on = (fn: F) => {
    this.subscribers.push(fn)
    return () => {
      this.subscribers.splice(this.subscribers.indexOf(fn), 1)
    }
  }
}
