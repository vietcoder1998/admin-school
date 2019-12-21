import { IEmControllerDetail } from './../models/em-controller-detail';
import { REDUX } from '../../common/const/actions';

let initState: IEmControllerDetail = {
   
};

export const EmployerDetail = (state: IEmControllerDetail = initState, action: any): IEmControllerDetail => {
    switch (action.type) {
        case REDUX.EM_CONTROLLER.GET_EM_CONTROLLER_DETAIL:
            return {
                ...action.data
            };

        default:
            return state;
    };
};