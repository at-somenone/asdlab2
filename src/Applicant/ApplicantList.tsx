import Applicant from './Applicant'
import { INode, ISublist } from '../MultiLinkedList'
import ApplicantView from './ApplicantView'
import { observer } from 'mobx-react'
import Keyed from '../Keyed'

type Props = {
    list: ISublist<Keyed<Applicant>>
    onRemove: (node: INode<Keyed<Applicant>>) => void
}

const ApplicantList = ({ list, onRemove }: Props) => (
    <div>
        {list.mapNodes(node => (
            <ApplicantView
                applicant={node.item}
                onRemove={() => onRemove(node)}
            />
        ))}
    </div>
)
export default observer(ApplicantList)
