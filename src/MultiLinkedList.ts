import { createAtom, IAtom } from 'mobx'

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

    nextOf(sublist: ISublist<T>): Node<T> | undefined {
        return this.nextPointers.get(sublist)
    }
    prevOf(sublist: ISublist<T>): Node<T> | undefined {
        return this.prevPointers.get(sublist)
    }
}

class Sublist<T> implements ISublist<T> {
    private firstNode?: Node<T>
    private lastNode?: Node<T>

    constructor(readonly predicate: Predicate<T>) {}
    first(): Node<T> | undefined {
        return this.firstNode
    }

    last(): Node<T> | undefined {
        return this.lastNode
    }

    add(newNode: Node<T>): void {
        if (!this.firstNode) {
            this.firstNode = newNode
            this.lastNode = newNode
        } else if (this.lastNode) {
            this.lastNode.nextPointers.set(this, newNode)
            newNode.prevPointers.set(this, this.lastNode)
            this.lastNode = newNode
        }
    }

    remove(removedNode: Node<T>): void {
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

    forEachMutNode(func: (node: Node<T>) => void): void {
        let currentNode = this.firstNode
        while (currentNode) {
            func(currentNode)
            currentNode = currentNode.nextPointers.get(this)
        }
    }

    forEachNode(func: (node: INode<T>) => void): void {
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

    nodes(): INode<T>[] {
        const arr: INode<T>[] = []
        this.forEachNode(n => arr.push(n))
        return arr
    }

    content(): T[] {
        const arr: T[] = []
        this.forEachNode(n => arr.push(n.item))
        return arr
    }

    clear(): void {
        this.firstNode = undefined
        this.lastNode = undefined
    }
}

class ObservableSublist<T> extends Sublist<T> {
    private readonly atom: IAtom

    constructor(predicate: Predicate<T>) {
        super(predicate)
        this.atom = createAtom('ObservableSublist')
    }

    first(): Node<T> | undefined {
        this.atom.reportObserved()
        return super.first()
    }

    last(): Node<T> | undefined {
        this.atom.reportObserved()
        return super.last()
    }

    add(newNode: Node<T>): void {
        this.atom.reportChanged()
        super.add(newNode)
    }

    remove(removedNode: Node<T>): void {
        this.atom.reportChanged()
        super.remove(removedNode)
    }

    forEachMutNode(func: (node: Node<T>) => void): void {
        this.atom.reportObserved()
        super.forEachMutNode(func)
    }

    forEachNode(func: (node: INode<T>) => void): void {
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

    nodes(): INode<T>[] {
        this.atom.reportObserved()
        return super.nodes()
    }

    content(): T[] {
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

    getMainList(): ISublist<T> {
        return this.mainList as ISublist<T>
    }

    createSublist(predicate: Predicate<T>): ISublist<T> {
        const sublist = new Sublist(predicate)
        this.populateSublist(sublist)
        this.sublists.push(sublist)

        return sublist
    }

    protected populateSublist(sublist: Sublist<T>): void {
        this.mainList.forEachMutNode(node => {
            if (sublist.predicate(node.item)) sublist.add(node)
        })
    }

    add(item: T): void {
        const node = new Node(item)
        this.mainList.add(node)
        this.sublists.forEach(s => {
            if (s.predicate(item)) s.add(node)
        })
    }

    remove(node: INode<T>): void {
        const mNode = node as Node<T>
        this.mainList.remove(mNode)
        this.sublists.forEach(s => s.remove(mNode))
    }

    clear(): void {
        this.mainList.clear()
        this.sublists.forEach(l => l.clear())
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
