import {IAnnouTypes} from '../models/annou-types';
import {REDUX} from '../../const/actions';

export const getListAnnouTypes = (data: IAnnouTypes) => ({
    type: REDUX.ANNOU_TYPES.GET_ANNOU_TYPES,
    data
});