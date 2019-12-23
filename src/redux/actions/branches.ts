import {IBranches} from '../models/branches';
import {REDUX} from '../../const/actions';

export const getListBranches = (data: IBranches) => ({
    type: REDUX.BRANCHES.GET_BRANCHES,
    data
});
