import { IApiController } from '../models/api-controller';
import { REDUX } from '../../common/const/actions';
import { renderTreeApi } from '../../common/utils/renderTreeApi';

let initState: IApiController = {
    data: [],
}

export const ApiController = (state = initState, action) => {
    switch (action.type) {
        case REDUX.API_CONTROLLER.GET_API_CONTROLLER:
            return {
                ...state, 
                data: action.data,
                treeData: renderTreeApi(action.data).treeData,
            }

        default:
            return state;
    }
}