import {IEmControllers} from '../models/em-controller';
import {REDUX} from '../../const/actions';

let initState: IEmControllers = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const EmControllers = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.EM_CONTROLLER.GET_EM_CONTROLLER:
            return {
                ...action.data,
            };

        default:
            return state;
    }
};