import {IEmployers} from './../../models/employers';
import {REDUX} from '../../const/actions';

export const getListEmployers = (data?: IEmployers) => ({
    type: REDUX.EMPLOYER.GET_EMPLOYER,
    data
});