import { INode, ISublist, ObservableMultiLinkedList } from '../MultiLinkedList'
import Applicant, { ExamGrade } from './Applicant'
import { action, makeObservable, observable } from 'mobx'
import { Chance } from 'chance'
import { v4 as uuid } from 'uuid'
import Keyed from '../Keyed'

// все экзамены сданы на «отлично»;
// имеется аттестат с отличием;
// проживает за пределами населенного пункта, в котором расположен университет;
// нуждается в общежитии;
export default class ApplicantStore {
    private readonly list: ObservableMultiLinkedList<Keyed<Applicant>>
    readonly allApplicants: ISublist<Keyed<Applicant>>
    readonly allExamsExcelent: ISublist<Keyed<Applicant>>
    readonly hasCertificate: ISublist<Keyed<Applicant>>
    readonly outsideOryol: ISublist<Keyed<Applicant>>
    readonly needsHousing: ISublist<Keyed<Applicant>>

    constructor() {
        this.list = new ObservableMultiLinkedList()
        this.allApplicants = this.list.getMainList()
        this.allExamsExcelent = this.list.createSublist(a =>
            a.grades.every(g => g === ExamGrade.Excellent)
        )

        this.hasCertificate = this.list.createSublist(a => a.hasCertificate)
        this.outsideOryol = this.list.createSublist(
            a => a.city.toLowerCase() !== 'орёл'
        )
        this.needsHousing = this.list.createSublist(a => a.needsHousing)
        makeObservable(this)
    }

    @action add(applicant: Applicant) {
        this.list.add(observable({ key: uuid(), ...applicant }))
    }

    @action addRandom() {
        console.log('hi')
        const chance = new Chance()
        const getGrade = () =>
            chance.pickone([
                ExamGrade.Fail,
                ExamGrade.Pass,
                ExamGrade.Good,
                ExamGrade.Excellent,
            ])
        
        const applicant: Keyed<Applicant> = {
            lastName: chance.last(),
            grades: [getGrade(), getGrade(), getGrade()],
            hasCertificate: chance.bool(),
            city: chance.city(),
            needsHousing: chance.bool(),
            key: uuid()
        }

        this.add(applicant)
    }

    @action clear() {
        this.list.clear()
    }

    @action remove(node: INode<Keyed<Applicant>>) {
        this.list.remove(node)
    }
}
