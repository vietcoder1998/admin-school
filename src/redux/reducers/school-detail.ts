import { ISchoolDetail } from '../models/school-detail';
import {REDUX} from '../../common/const/actions';

let initState: ISchoolDetail = {};

export const SchoolsDetail = (state: ISchoolDetail = initState, action: any): ISchoolDetail => {
    switch (action.type) {
        case REDUX.SCHOOLS.GET_SCHOOL_DETAIL:
            return {
                ...action.data
            };

        default:
            return state;
    }
};