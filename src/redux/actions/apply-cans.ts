import {IApplyCans} from '../../models/apply-cans';
import {REDUX} from '../../const/actions';

export const getListApplyCans = (data: IApplyCans) => ({
    type: REDUX.APPLY_JOB.GET_APPLY_JOB,
    data
});
