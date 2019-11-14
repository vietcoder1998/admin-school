import { IApiController } from '../models/api-controller';
import { REDUX } from '../../common/const/actions';
import { renderTreeApi } from '../../common/utils/renderTreeApi';

let initState: IApiController = {
    data: [],
}

export const ApiControllerRoles = (state = initState, action) => {
    switch (action.type) {
        case REDUX.API_CONTROLLER_ROLES.GET_API_CONTROLLER_ROLES:
            return {
                ...state, 
                data: action.data,
                value: renderTreeApi(action.data).value,
            }

        default:
            return state;
    }
}