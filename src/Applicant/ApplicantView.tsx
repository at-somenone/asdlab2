import Applicant from './Applicant'
import styles from './Applicant.module.css'

type Props = {
    applicant: Applicant
    onRemove: () => void
}

const ApplicantView = ({ applicant, onRemove }: Props): JSX.Element => (
    <div className={styles.applicant}>
        <div>
            <span>Фамилия: {applicant.lastName}</span>
            <span>Оценки: {applicant.grades.join(', ')}</span>
            <span>Место жительства: {applicant.city}</span>
        </div>
        <div>
            <span>Аттестат с отличием: {applicant.hasCertificate ? 'Есть' : 'Нет'}</span>
            <span>Необходимо общежитие: {applicant.needsHousing ? 'Да' : 'Нет'}</span>
        </div>
        <div>
            <button onClick={() => onRemove()}>x</button>
        </div>
    </div>
)

export default ApplicantView
