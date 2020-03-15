import { BRANCHES, IMPORT_CAN } from '../../services/api/private.api';
import { GET, POST } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'
import IImportCan from './../../models/import-can';

function* getListImportCanData(action: any) {
    let res = yield call(callImportCan, action);
    let data = {
     
    };

    if (res) {
        data = res.data;
    }

    yield put({
        type: REDUX.IMPORT.POST_IMPORT_CAN,
        data
    });
}

function callImportCan(action: any) {

    try {
        return _requestToServer(
            GET, BRANCHES,
            action.data,
            action.params,
            undefined, undefined, false, false
        )
    } catch (e) {
        throw e
    }

}

export function* ImportCanWatcher() {
    yield takeEvery(
        REDUX_SAGA.BRANCHES.GET_BRANCHES,
        getListImportCanData
    )
}