import { TYPE_MANAGEMENT } from './../../services/api/public.api';
import { authHeaders } from './../../services/auth';
import { GET } from '../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { ADMIN_HOST } from '../../environment/dev';


function* getListTypeManagementData(action) {
    let res = yield call(callTypeManagement, action);

    if (res.code === 200) {
        let data = res.data;
        yield put({
            type: REDUX.TYPE_MANAGEMENT.GET_TYPE_MANAGEMENT,
            data
        });
    }
}

function callTypeManagement(action) {
    var data;
    var target;
    if (action.data) {
        target = action.data.target;
        data = action.data;
    }


    return _requestToServer(
        GET,
        data,
        TYPE_MANAGEMENT,
        ADMIN_HOST,
        authHeaders,
        { pageIndex: 0, pageSize: 0, target }
    )
}

export function* TypeManagementWatcher() {
    yield takeEvery(
        REDUX_SAGA.TYPE_MANAGEMENT.GET_TYPE_MANAGEMENT,
        getListTypeManagementData
    )
}