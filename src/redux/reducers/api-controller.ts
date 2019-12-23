import {IApiController} from '../models/api-controller';
import {REDUX} from '../../const/actions';
import {renderTreeApi} from '../../utils/renderTreeApi';

let initState: IApiController = {
    data: [],
};

export const ApiController = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.API_CONTROLLER.GET_API_CONTROLLER:
            return {
                ...state,
                data: action.data,
                treeData: renderTreeApi(action.data).treeData,
            };

        default:
            return state;
    }
};