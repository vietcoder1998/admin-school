import {IRegions} from './../../models/regions';
import {REDUX} from '../../const/actions';

export const getRegions = (data: IRegions) => ({
    type: REDUX.REGIONS.GET_REGIONS,
    data
});
