import {REDUX} from '../../const/actions';
import {IApiController} from './../../models/api-controller';

export const getListApiController = (data: IApiController) => ({
    type: REDUX.API_CONTROLLER_ROLES.GET_API_CONTROLLER_ROLES,
    data
});
