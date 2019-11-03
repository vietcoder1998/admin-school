import { noInfoHeader } from './../../services/auth';
import { GET } from './../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { PUBLIC_HOST } from '../../environment/dev';
import { JOB_TYPE } from '../../services/api/public.api';


function* getListJobTypeData(action) {
    let res = yield call(callJobType, action);

    if (res.code === 200) {
       let data = res.data;
        yield put({
            type: REDUX.JOB_TYPE.GET_JOB_TYPE,
            data
        });
    }
}

function callJobType(action) {
    return _requestToServer(
        GET,
        null,
        JOB_TYPE,
        PUBLIC_HOST,
        noInfoHeader,
        { pageIndex: 0, pageSize: 0 },
    )
}

export function* JobTypeWatcher() {
    yield takeEvery(
        REDUX_SAGA.JOB_TYPE.GET_JOB_TYPE,
        getListJobTypeData
    )
}