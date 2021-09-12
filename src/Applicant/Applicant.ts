// фамилия;
// оценки по трем вступительным экзаменам;
// сведения о наличии аттестата с отличием;
// наименование населенного пункта, в котором проживает абитуриент;
// сведения о необходимости предоставления общежития.

export type ExamGrade = 2 | 3 | 4 | 5

type Applicant = {
    readonly lastName: string
    readonly grades: [ExamGrade, ExamGrade, ExamGrade]
    readonly hasCertificate: boolean
    readonly city: string
    readonly needsHousing: boolean
}

export default Applicant
