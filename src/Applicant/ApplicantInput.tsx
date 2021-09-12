import { observer } from 'mobx-react-lite'
import Applicant from './Applicant'
import styles from './Applicant.module.css'
import { Mutable } from 'type-fest'
import { Field, Form, Formik } from 'formik'
import clsx from 'clsx'
type Props = {
    onAdd: (a: Applicant) => void
    onAddRandom: () => void
}

const ApplicantInput = ({ onAdd, onAddRandom }: Props): JSX.Element => {
    const defaultApplicant = (): Mutable<Applicant> => ({
        lastName: '',
        grades: [5, 5, 5],
        hasCertificate: false,
        city: '',
        needsHousing: false,
    })

    return (
        <Formik initialValues={defaultApplicant()} onSubmit={onAdd}>
            <Form>
                <div className={clsx(styles.applicant, styles.editingApplicant)}>
                    <div>
                        <label>
                            Фамилия: <Field name="lastName" />
                        </label>
                        <label>
                            Оценки:
                            <Field type="number" name="grades[0]" min={2} max={5} />
                            <Field type="number" name="grades[1]" min={2} max={5} />
                            <Field type="number" name="grades[2]" min={2} max={5} />
                        </label>
                        <label>
                            Место жительства: <Field name="city" />
                        </label>
                    </div>
                    <div>
                        <label>
                            Аттестат с отличием: <Field type="checkbox" name="hasCertificate" />
                        </label>
                        <label>
                            Необходимо общежитие: <Field type="checkbox" name="needsHousing" />
                        </label>
                    </div>
                    <div>
                        <button type="submit">+</button>
                        <button type="button" onClick={() => onAddRandom()}>
                            *
                        </button>
                    </div>
                </div>
            </Form>
        </Formik>
    )
}

export default observer(ApplicantInput)
