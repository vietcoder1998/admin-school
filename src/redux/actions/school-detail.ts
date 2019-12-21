import { ISchoolDetail } from '../models/school-detail';
import { REDUX } from '../../common/const/actions';

export const getSchoolDetail = (data?: ISchoolDetail) => ({
    type: REDUX.SCHOOLS.GET_SCHOOL_DETAIL, 
    data
});