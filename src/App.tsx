/* eslint-disable react/jsx-filename-extension */
import { action } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react'
import Applicant from './Applicant/Applicant'
import ApplicantInput from './Applicant/ApplicantInput'
import ApplicantList from './Applicant/ApplicantList'
import ApplicantStore from './Applicant/ApplicantStore'
import Keyed from './Keyed'
import { ISublist } from './MultiLinkedList'

enum ShowMode {
    All,
    AllExamsExcellent,
    HasCertificate,
    OutsideOryol,
    NeedsHousing,
}

function App(): JSX.Element {
    const state = useLocalObservable(() => ({
        store: new ApplicantStore(),
        mode: ShowMode.All,
    }))

    const getList = (): ISublist<Keyed<Applicant>> => {
        switch (state.mode) {
            case ShowMode.All:
                return state.store.allApplicants
            case ShowMode.AllExamsExcellent:
                return state.store.allExamsExcelent
            case ShowMode.HasCertificate:
                return state.store.hasCertificate
            case ShowMode.OutsideOryol:
                return state.store.outsideOryol
            case ShowMode.NeedsHousing:
                return state.store.needsHousing
        }
    }

    return (
        <div>
            <button onClick={action(() => state.store.clear())}>
                Удалить все
            </button>
            <br />
            <input
                id="showAll"
                type="radio"
                checked={state.mode === ShowMode.All}
                onChange={action(e => {
                    if (e.target.checked) state.mode = ShowMode.All
                })}
            />
            <label htmlFor="showAll">Все</label>
            <br />
            <input
                id="showAllExamsExcellent"
                type="radio"
                checked={state.mode === ShowMode.AllExamsExcellent}
                onChange={action(e => {
                    if (e.target.checked)
                        state.mode = ShowMode.AllExamsExcellent
                })}
            />
            <label htmlFor="showAllExamsExcellent">
                Все экзамены на отлично
            </label>
            <br />
            <input
                id="showHasCertificate"
                type="radio"
                checked={state.mode === ShowMode.HasCertificate}
                onChange={action(e => {
                    if (e.target.checked) state.mode = ShowMode.HasCertificate
                })}
            />
            <label htmlFor="showHasCertificate">Есть аттестат с отличием</label>
            <br />
            <input
                id="showOutsideOryol"
                type="radio"
                checked={state.mode === ShowMode.OutsideOryol}
                onChange={action(e => {
                    if (e.target.checked) state.mode = ShowMode.OutsideOryol
                })}
            />
            <label htmlFor="showOutsideOryol">Вне Орла</label>
            <br />
            <input
                id="showNeedsHousing"
                type="radio"
                checked={state.mode === ShowMode.NeedsHousing}
                onChange={action(e => {
                    if (e.target.checked) state.mode = ShowMode.NeedsHousing
                })}
            />
            <label htmlFor="showNeedsHousing">Требуется общежитие</label>
            <br />

            <ApplicantInput
                onAdd={a => state.store.add(a)}
                onAddRandom={action(() => state.store.addRandom())}
            />
            <ApplicantList
                onRemove={action(node => state.store.remove(node))}
                list={getList()}
            />
        </div>
    )
}

export default observer(App)
