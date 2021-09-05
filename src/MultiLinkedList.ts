import { createAtom, IAtom } from "mobx"

type Predicate<T> = (item: T) => boolean

interface INode<T> {
    readonly item: T
    nextOf(sublist: ISublist<T>): INode<T> | undefined
    prevOf(sublist: ISublist<T>): INode<T> | undefined
}

interface ISublist<T> {
    first(): INode<T> | undefined
    last(): INode<T> | undefined
    nodes(): INode<T>[]
    map<TResult>(func: (item: T) => TResult): TResult[]
    mapNodes<TResult>(func: (node: INode<T>) => TResult): TResult[]

}

class Node<T> implements INode<T> {
    readonly prevPointers = new Map<ISublist<T>, Node<T> | undefined>()
    readonly nextPointers = new Map<ISublist<T>, Node<T> | undefined>()

    constructor(readonly item: T) {}

    nextOf(sublist: ISublist<T>) {
        return this.nextPointers.get(sublist)
    }
    prevOf(sublist: ISublist<T>) {
        return this.prevPointers.get(sublist)
    }
}

class Sublist<T> implements ISublist<T> {
    private firstNode?: Node<T>
    private lastNode?: Node<T>

    constructor(readonly predicate: Predicate<T>) {}
    first() {
        return this.firstNode
    }

    last() {
        return this.lastNode
    }

    add(newNode: Node<T>) {
        if (!this.firstNode) {
            this.firstNode = newNode
            this.lastNode = newNode
        } else if (this.firstNode === this.lastNode) {
            this.firstNode.nextPointers.set(this, newNode)
            newNode.prevPointers.set(this, this.firstNode)
            this.lastNode = newNode
        } else if (this.lastNode) {
            this.lastNode.nextPointers.set(this, newNode)
            newNode.prevPointers.set(this, this.lastNode)
            this.lastNode = newNode
        }
    }

    remove(removedNode: Node<T>) {
        const next = removedNode.nextPointers.get(this)
        const prev = removedNode.prevPointers.get(this)

        if (this.firstNode === removedNode) {
            this.firstNode = next
        }
        if (this.lastNode === removedNode) {
            this.lastNode = prev
        }

        if (prev) {
            prev.nextPointers.set(this, next)
        }

        if (next) {
            next.prevPointers.set(this, prev)
        }
    }

    forEachMutNode(func: (node: Node<T>) => void) {
        let currentNode = this.firstNode
        while (currentNode) {
            func(currentNode)
            currentNode = currentNode.nextPointers.get(this)
        }
    }

    forEachNode(func: (node: INode<T>) => void) {
        this.forEachMutNode(func)
    }

    map<TResult>(func: (item: T) => TResult): TResult[] {
        const arr: TResult[] = []
        this.forEachNode(n => arr.push(func(n.item)))
        return arr
    }

    mapNodes<TResult>(func: (node: INode<T>) => TResult): TResult[] {
        const arr: TResult[] = []
        this.forEachNode(n => arr.push(func(n)))
        return arr
    }

    nodes() {
        const arr: INode<T>[] = []
        this.forEachNode(n => arr.push(n))
        return arr
    }

    content() {
        const arr: T[] = []
        this.forEachNode(n => arr.push(n.item))
        return arr
    }
}

class ObservableSublist<T> extends Sublist<T> {
    private readonly atom: IAtom

    constructor(predicate: Predicate<T>) {
        super(predicate)
        this.atom = createAtom('ObservableSublist')
    }

    first() {
        this.atom.reportObserved()
        return super.first()
    }

    last() {
        this.atom.reportObserved()
        return super.last()
    }

    add(newNode: Node<T>) {
        this.atom.reportChanged()
        super.add(newNode)
    }

    remove(removedNode: Node<T>) {
        this.atom.reportChanged()
        super.remove(removedNode)
    }

    forEachMutNode(func: (node: Node<T>) => void) {
        this.atom.reportObserved()
        super.forEachMutNode(func)
    }

    forEachNode(func: (node: INode<T>) => void) {
        this.atom.reportObserved()
        super.forEachNode(func)
    }

    map<TResult>(func: (item: T) => TResult): TResult[] {
        this.atom.reportObserved()
        return super.map(func)
    }

    mapNodes<TResult>(func: (node: INode<T>) => TResult): TResult[] {
        this.atom.reportObserved()
        return super.mapNodes(func)
    }

    nodes() {
        this.atom.reportObserved()
        return super.nodes()
    }

    content() {
        this.atom.reportObserved()
        return super.content()
    }
}

// todo: atoms !!!!
class MultiLinkedList<T> {
    protected mainList: Sublist<T>
    protected sublists: Sublist<T>[] = []

    constructor() {
        this.mainList = new Sublist(() => true)
    }

    getMainList() {
        return this.mainList as ISublist<T>
    }

    createSublist(predicate: Predicate<T>): ISublist<T> {
        const sublist = new Sublist(predicate)
        this.populateSublist(sublist)
        this.sublists.push(sublist)

        return sublist
    }

    protected populateSublist(sublist: Sublist<T>) {
        this.mainList.forEachMutNode(node => {
            if (sublist.predicate(node.item)) sublist.add(node)
        })
    }

    add(item: T) {
        const node = new Node(item)
        this.mainList.add(node)
        this.sublists.forEach(s => {
            if (s.predicate(item)) s.add(node)
        })
    }

    remove(node: INode<T>) {
        const mNode = node as Node<T>
        this.mainList.remove(mNode)
        this.sublists.forEach(s => s.remove(mNode))
    }

    clear() {
        this.mainList.nodes().forEach(node => this.remove(node))
    }
}

class ObservableMultiLinkedList<T> extends MultiLinkedList<T> {
    constructor() {
        super()
        this.mainList = new ObservableSublist(() => true)
    }

    createSublist(predicate: Predicate<T>): ISublist<T> {
        const sublist = new ObservableSublist<T>(predicate)
        this.populateSublist(sublist)
        this.sublists.push(sublist)
        return sublist
    }
}

export { MultiLinkedList, ObservableMultiLinkedList }
export type { ISublist, INode }
