import { IUserControllers } from './../models/user-controller';
import {REDUX} from '../../common/const/actions';

export const getSkills = (data?: IUserControllers) => ({
    type: REDUX.USER_CONTROLLER.GET_USER_CONTROLLER,
    data
});
