import {IAnnouTypes} from '../models/annou-types';
import {REDUX} from '../../common/const/actions';

export const getListAnnouTypes = (data: IAnnouTypes) => ({
    type: REDUX.ANNOU_TYPES.GET_ANNOU_TYPES,
    data
});