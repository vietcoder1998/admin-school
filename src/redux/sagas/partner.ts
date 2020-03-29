import { SCHOOLS } from '../../services/api/private.api';
import { IPartners } from '../../models/partner';
import { POST } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListPartnersData(action: any) {
    let res = yield call(callPartners, action);
    let data: IPartners = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res) {
        data = res.data;
    }

    yield put({
        type: REDUX.SCHOOLS.GET_SCHOOLS,
        data
    });
}

function callPartners(action: any) {
    try {
        if (action.body) {
            return _requestToServer(
                POST, SCHOOLS + '/query',
                action.body ? action.body : undefined,
                {
                    pageIndex: action.pageIndex ? action.pageIndex : 0,
                    pageSize: action.pageSize ? action.pageSize : 10
                },
                undefined, undefined, false, false
            )
        }
    } catch (e) {
        throw e;
    }
}

export function* PartnersWatcher() {
    yield takeEvery(
        REDUX_SAGA.SCHOOLS.GET_SCHOOLS,
        getListPartnersData
    )
}