import { action, runInAction } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import Applicant, { ExamGrade } from './Applicant'
import styles from './Applicant.module.css'
import classNames from 'classnames'
import { Mutable } from 'type-fest'
type Props = {
    onAdd: (a: Applicant) => void
    onAddRandom: () => void
}

const ApplicantInput = ({ onAdd, onAddRandom }: Props): JSX.Element => {
    const defaultApplicant = (): Mutable<Applicant> => ({
        lastName: '',
        grades: [
            ExamGrade.Excellent,
            ExamGrade.Excellent,
            ExamGrade.Excellent,
        ] as [ExamGrade, ExamGrade, ExamGrade],
        hasCertificate: false,
        city: '',
        needsHousing: false,
    })
    const state = useLocalObservable(() => ({ applicant: defaultApplicant() }))

    const makeApplicant = (): Applicant => {
        const applicant: Applicant = state.applicant
        runInAction(() => (state.applicant = defaultApplicant()))
        return applicant
    }

    return (
        <div className={classNames(styles.applicant, styles.editingApplicant)}>
            <div className={styles.left}>
                <span>Фамилия:</span>
                <input
                    type="text"
                    value={state.applicant.lastName}
                    onChange={action(
                        e => (state.applicant.lastName = e.target.value)
                    )}
                />
                <br />
                <span>Оценки:</span>{' '}
                {[0, 1, 2].map(k => (
                    <select
                        key={k}
                        onChange={action(e => {
                            state.applicant.grades[k] = [
                                ExamGrade.Excellent,
                                ExamGrade.Good,
                                ExamGrade.Pass,
                                ExamGrade.Fail,
                            ][Number(e.target.value)]
                        })}
                    >
                        <option value={0}>Отлично</option>
                        <option value={1}>Хорошо</option>
                        <option value={2}>Удовл.</option>
                        <option value={3}>Неуд.</option>
                    </select>
                ))}
                <br />
                <span>Место жительства: </span>
                <input
                    type="text"
                    value={state.applicant.city}
                    onChange={action(
                        e => (state.applicant.city = e.target.value)
                    )}
                />
                <br />
            </div>
            <div className={styles.middle}>
                <span>Аттестат с отличием:</span>
                <input
                    type="checkbox"
                    checked={state.applicant.hasCertificate}
                    onChange={action(
                        e => (state.applicant.hasCertificate = e.target.checked)
                    )}
                />
                <br />
                <span>Необходимо общежитие:</span>
                <input
                    type="checkbox"
                    checked={state.applicant.needsHousing}
                    onChange={action(
                        e => (state.applicant.needsHousing = e.target.checked)
                    )}
                />
            </div>
            <div className={styles.right}>
                <button onClick={() => onAdd(makeApplicant())}>+</button>
                <br />
                <button onClick={() => onAddRandom()}>*</button>
            </div>
        </div>
    )
}

export default observer(ApplicantInput)
