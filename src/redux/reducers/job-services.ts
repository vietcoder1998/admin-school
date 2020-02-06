import { IJobServices } from './../../models/job-services';
import { REDUX } from '../../const/actions';

let initState: IJobServices = {
    nomalQuantity: 0,
    homeInDayQuantity: 0,
    homeTopQuantiy: 0,
    searchHighLightQuantity: 0,
    unlockProfileQuantity: 0
};

export const JobServices = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.JOB_SERVICE.GET_JOB_SERVICE:
            return {
                ...state,
                ...action.data
            };

        default:
            return state;
    }
};