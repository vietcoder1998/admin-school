import { REDUX } from '../../common/const/actions';
import { IApiController } from '../models/api-controller';

export const getListApiController = (data: IApiController) => ({
    type: REDUX.API_CONTROLLER.GET_API_CONTROLLER, 
    data
});
