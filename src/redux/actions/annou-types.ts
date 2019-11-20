import {IAnnouTypess} from '../models/annou-types';
import {REDUX} from '../../common/const/actions';

export const getListAnnouTypes = (data: IAnnouTypess) => ({
    type: REDUX.ANNOU_TYPES.GET_ANNOU_TYPES,
    data
});