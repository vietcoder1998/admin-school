import {IEmployers} from '../models/employers';
import {REDUX} from '../../common/const/actions';

export const getListEmployers = (data?: IEmployers) => ({
    type: REDUX.EMPLOYER.GET_EMPLOYER,
    data
});