import { IBranches } from '../models/branches';
import { REDUX } from '../../common/const/actions';

export const getBranches = (data: IBranches) => ({
    type: REDUX.BRANCHES.GET_BRANCHES, 
    data
});
