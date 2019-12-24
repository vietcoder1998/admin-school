import { IStudentsFilter } from './../models/students';
import { REDUX } from '../../const/actions';

export const getStudentDetail = (data?: IStudentsFilter) => ({
    type: REDUX.STUDENTS.GET_STUDENTS, 
    data
});
