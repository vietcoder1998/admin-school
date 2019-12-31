import { REDUX } from '../../const/actions';
import IStudentDetail from '../../models/student-detail';

let initState: IStudentDetail = {
};

export const StudentDetail = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.STUDENTS.GET_STUDENT_DETAIl:
            return {
                ...action.data,
            };

        default:
            return state;
    }
};