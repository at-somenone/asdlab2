import { createAtom, IAtom } from 'mobx'

class Hhh {
    private number: number
    atom: IAtom
    constructor() {
        this.number = 0
        this.atom = createAtom(
            'testy',
            () => console.log('wow!'),
            () => console.log('!wow')
        )
    }

    increment() {
        this.number += 5
        this.atom.reportChanged()
    }

    getNumber() {
        console.log(this.atom.reportObserved())
        return this.number
    }
}
export default class WhoaList {
    testy: Hhh = new Hhh()
    private atom: IAtom

    constructor() {
        this.atom = createAtom(
            'WhoaList',
            () => console.log('am observed!'),
            () => console.log("am observedn't!")
        )
    }

    add() {
        console.log('hellow')
        this.testy.increment()
        this.atom.reportChanged()
    }
}
