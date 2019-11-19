import {ITypeManagements} from '../models/type-management';
import {GET} from '../../common/const/method';
import {takeEvery, put, call,} from 'redux-saga/effects';
import {_requestToServer} from '../../services/exec';
import {REDUX_SAGA, REDUX} from '../../common/const/actions'
import {TYPE_MANAGEMENT} from '../../services/api/private.api';

function* getListTypeManagementData(action: any) {
    let res = yield call(callTypeManagement, action);
    if (res) {
        let data: ITypeManagements = res.data;
        yield put({
            type: REDUX.TYPE_MANAGEMENT.GET_TYPE_MANAGEMENT,
            data
        });
    }
}

function callTypeManagement(action: any) {
    let target;
    if (action.data) {
        target = action.data.target;
    }

    return _requestToServer(
        GET, TYPE_MANAGEMENT,
        null,
        {
            pageIndex: action.pageIndex? action.pageIndex : 0,
            pageSize: action.pageSize? action.pageSize : 0,
            target
        },
        undefined, undefined, false, false
    )
}

export function* TypeManagementWatcher() {
    yield takeEvery(
        REDUX_SAGA.TYPE_MANAGEMENT.GET_TYPE_MANAGEMENT,
        getListTypeManagementData
    )
}