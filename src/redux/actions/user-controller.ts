import { IUserControllers } from './../models/user-controller';
import {REDUX} from '../../const/actions';

export const getSkills = (data?: IUserControllers) => ({
    type: REDUX.USER_CONTROLLER.GET_USER_CONTROLLER,
    data
});
