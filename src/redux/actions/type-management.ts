import { ITypeManagements } from './../models/type-management';
import { REDUX } from '../../common/const/actions';

export const getListTypeManagement = (data: ITypeManagements) => ({
    type: REDUX.TYPE_MANAGEMENT.GET_TYPE_MANAGEMENT, 
    data
});