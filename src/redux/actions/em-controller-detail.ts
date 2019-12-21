import { IEmControllerDetail } from '../models/em-controller-detail';
import { REDUX } from '../../common/const/actions';

export const getEmControllerDetail = (data?: IEmControllerDetail) => ({
    type: REDUX.EM_CONTROLLER.GET_EM_CONTROLLER_DETAIL,
    data
});
