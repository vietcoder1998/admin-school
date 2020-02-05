import { ISchoolDetail } from './../../models/school-detail';
import { REDUX } from '../../const/actions';

export const getSchoolDetail = (data?: ISchoolDetail) => ({
    type: REDUX.SCHOOLS.GET_SCHOOL_DETAIL, 
    data
});