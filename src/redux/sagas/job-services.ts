import { NORMAL_SERVICE, HOME_INDAY_SERVICE, HOME_TOP_SERVICE, UN_LOCK_PROFILE_SERVICE, SEARCH_HIGH_LIGHT_SERVICE, EM_CONTROLLER } from './../../services/api/private.api';
import { IJobServices } from './../../models/job-services';
import { GET } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListJobServiceData(action: any) {
    let res = yield call(callJobService, action);
    let data = null;
    if (res) {
        data = res
    }
    yield put({
        type: REDUX.JOB_SERVICE.GET_JOB_SERVICE,
        data
    });
}

const callJobService = async (action: any) => {
    try {
        let data: IJobServices = {
            nomalQuantity: 0,
            homeInDayQuantity: 0,
            homeTopQuantiy: 0,
            searchHighLightQuantity: 0,
            unlockProfileQuantity: 0,
        }

        let res1 = await _requestToServer(
            GET,
            EM_CONTROLLER + `/${action.id}/services/jobs/limit/quantity`,
            null,
            undefined,
            undefined,
            undefined,
            false,
            false
        )

        let res2 = await _requestToServer(
            GET,
            EM_CONTROLLER + `/${action.id}/services/jobs/priority/home/IN_DAY/quantity`,
            null,
            undefined,
            undefined,
            undefined,
            false,
            false
        )

        let res3 = await _requestToServer(
            GET,
            EM_CONTROLLER + `/${action.id}/services/jobs/priority/home/TOP/quantity`,
            null,
            undefined,
            undefined,
            undefined,
            false,
            false
        )

        let res4 = await _requestToServer(
            GET,
            EM_CONTROLLER + `/${action.id}/services/jobs/priority/search/HIGHLIGHT/quantity`,
            null,
            undefined,
            undefined,
            undefined,
            false,
            false
        )

        let res5 = await _requestToServer(
            GET,
            EM_CONTROLLER + `/${action.id}/services/profile/unlock/limit/quantity`,
            null,
            undefined,
            undefined,
            undefined,
            false,
            false
        )

        data.nomalQuantity = res1.data ? res1.data.quantity : 0;
        data.homeInDayQuantity = res2.data ? res2.data.quantity : 0;
        data.homeTopQuantiy = res3.data ? res3.data.quantity : 0;
        data.searchHighLightQuantity = res4.data ? res4.data.quantity : 0;
        data.unlockProfileQuantity = res5.data ? res5.data.quantity : 0;
        return data;

    } catch (error) {
        throw error;
    }
}

export function* JobServiceWatcher() {
    yield takeEvery(
        REDUX_SAGA.JOB_SERVICE.GET_JOB_SERVICE,
        getListJobServiceData
    )
}