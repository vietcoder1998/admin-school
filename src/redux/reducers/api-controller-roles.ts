import {IApiController} from '../models/api-controller';
import {REDUX} from '../../const/actions';
import {renderTreeApi} from '../../utils/renderTreeApi';

let initState: IApiController = {
    data: [],
};

export const ApiControllerRoles = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.API_CONTROLLER_ROLES.GET_API_CONTROLLER_ROLES:
            return {
                ...state,
                data: action.data,
                value: renderTreeApi(action.data).value,
            };

        default:
            return state;
    }
};