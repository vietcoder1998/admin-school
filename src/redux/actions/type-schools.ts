import {ITypeSchools} from './../../models/type-schools';
import {REDUX} from '../../const/actions';

export const getListAnnouTypes = (data: ITypeSchools) => ({
    type: REDUX.TYPE_SCHOOLS.GET_TYPE_SCHOOLS,
    data
});