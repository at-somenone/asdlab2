import Applicant, { ExamGrade } from './Applicant'
import styles from './Applicant.module.css'

type Props = {
    applicant: Applicant
    onRemove: () => void
}

const ApplicantView = ({ applicant, onRemove }: Props): JSX.Element => (
    <div className={styles.applicant}>
        <div className={styles.left}>
            <span>Фамилия: {applicant.lastName}</span>
            <br />
            <span>
                Оценки:{' '}
                {applicant.grades
                    .map(v => {
                        switch (v) {
                            case ExamGrade.Fail:
                                return 'Неуд.'
                            case ExamGrade.Pass:
                                return 'Удовл.'
                            case ExamGrade.Good:
                                return 'Хорошо'
                            case ExamGrade.Excellent:
                                return 'Отлично'
                            default:
                                throw new Error('what')
                        }
                    })
                    .join(', ')}
            </span>
            <br />
            <span>Место жительства: {applicant.city}</span>
            <br />
        </div>
        <div className={styles.middle}>
            <span>
                Аттестат с отличием: {applicant.hasCertificate ? 'Есть' : 'Нет'}
            </span>
            <br />
            <span>
                Необходимо общежитие: {applicant.needsHousing ? 'Да' : 'Нет'}
            </span>
        </div>
        <div className={styles.right}>
            <button onClick={() => onRemove()}>x</button>
        </div>
    </div>
)

export default ApplicantView
