import { IMajors } from './../models/majors';
import { REDUX } from '../../common/const/actions';

export const getListMajors = (data: IMajors) => ({
    type: REDUX.MAJORS.GET_MAJORS, 
    data
});