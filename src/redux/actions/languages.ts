import { ITypeSchools } from './../models/type-schools';
import { REDUX } from '../../common/const/actions';

export const getTypeManagement = (data: ITypeSchools) => ({
    type: REDUX.LANGUAGES.GET_LANGUAGES, 
    data
});