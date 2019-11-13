import { IApiController } from '../models/api-controller';
import { REDUX } from '../../common/const/actions';

let initState: IApiController = {
    data: [],
}

export const ApiController = (state = initState, action) => {
    switch (action.type) {
        case REDUX.API_CONTROLLER.GET_API_CONTROLLER:
            return {
                ...state, 
                data: action.data,
            }

        default:
            return state;
    }
}