import { IConnectEmSchoolFilter } from './../../models/connect-em-school';
import { POST } from '../../const/method';
import { takeEvery, put, call } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'
import { CONNECT_EM_SCHOOL } from '../../services/api/private.api';
import IConnectEmSchools from '../../models/connect-em-school';

function* getListConnectEmSchoolsData(action: any) {
    let res = yield call(callConnectEmSchools, action);
    let data: IConnectEmSchools = {
        items: [],
        totalItems: 0,
        pageIndex: 0,
        pageSize: 0
    };
    if (res) {
        data = res.data
    }
    yield put({
        type: REDUX.CONNECT_EM_SCHOOL.GET_CONNECT_EM_SCHOOL,
        data
    });
}

function callConnectEmSchools(action: any) {
    try {
        let pageIndex = 0;
        let pageSize = 0;
        let id = action.body.id;
        let body: IConnectEmSchoolFilter = {
            state: null,
            name: null,
            headquarters: null,
            hasRequest: null,
            regionID: null,
        };

        console.log(action.body)

        if (action.pageIndex) {
            pageIndex = action.pageIndex;
        }

        if (action.pageSize) {
            pageSize = action.pageSize;
        }

        if (action.body) {
            body =  {...action.body,id: undefined}
        }

        if (id) {
            return _requestToServer(
                POST, CONNECT_EM_SCHOOL(id) + '/query',
                body,
                {
                    pageIndex: pageIndex ? pageIndex : 0,
                    pageSize: pageSize ? pageSize : 10
                },
                undefined, undefined, false
            )
        }


    } catch (e) {
        throw e;
    }
}

export function* ConnectEmSchoolsWatcher() {
    yield takeEvery(
        REDUX_SAGA.CONNECT_EM_SCHOOL.GET_CONNECT_EM_SCHOOL,
        getListConnectEmSchoolsData)
}