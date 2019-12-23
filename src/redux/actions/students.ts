import { REDUX } from '../../const/actions';
import { IStudent } from '../models/students';

export const getListSchools = (data?: IStudent) => ({
    type: REDUX.STUDENTS.GET_STUDENTS, 
    data
});
