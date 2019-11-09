import { ITypeManagements } from './../models/type-management';
import { REDUX } from '../../common/const/actions';

export const getTypeManagement = (data: ITypeManagements) => ({
    type: REDUX.TYPE_MANAGEMENT.GET_TYPE_MANAGEMENT, 
    data
});