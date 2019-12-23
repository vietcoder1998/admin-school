import {IUserControllers} from '../models/user-controller';
import {REDUX} from '../../const/actions';

let initState: IUserControllers = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const UserControllers = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.USER_CONTROLLER.GET_USER_CONTROLLER:
            return {
                ...action.data,
            };

        default:
            return state;
    }
};