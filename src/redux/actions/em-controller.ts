import { IEmControllers } from './../models/em-controller';
import {REDUX} from '../../common/const/actions';

export const getSkills = (data?: IEmControllers) => ({
    type: REDUX.USER_CONTROLLER.GET_USER_CONTROLLER,
    data
});
