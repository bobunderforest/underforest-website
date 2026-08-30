type SubscriptionFN<V> = (nextValue: V, prevValue: V) => void

export class WatchedValue<V, FN extends SubscriptionFN<V> = SubscriptionFN<V>> {
  private value: V
  private fns: FN[] = []

  constructor(initial: V) {
    this.value = initial
  }

  get() {
    return this.value
  }

  set(value: V) {
    if (value === this.value) return
    const prevValue = this.value
    this.value = value
    for (const fn of this.fns) {
      fn(this.value, prevValue)
    }
  }

  watch(fn: FN) {
    this.fns.push(fn)
    return () => this.unwatch(fn)
  }

  unwatch(fn: FN) {
    const fnIdx = this.fns.findIndex((f) => f === fn)
    if (fnIdx === -1) return
    this.fns.splice(fnIdx, 1)
  }
}
