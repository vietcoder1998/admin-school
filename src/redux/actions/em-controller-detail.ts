import { IEmControllerDetail } from '../models/em-controller-detail';
import {REDUX} from '../../common/const/actions';

export const getSkills = (data?: IEmControllerDetail) => ({
    type: REDUX.USER_CONTROLLER.GET_USER_CONTROLLER,
    data
});
