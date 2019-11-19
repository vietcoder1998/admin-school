import {IAnnouncementDetail} from '../models/announcement_detail';
import {GET} from '../../common/const/method';
import {ANNOUNCEMENT_DETAIL} from '../../services/api/private.api';
import {takeEvery, put, call,} from 'redux-saga/effects';
import {_requestToServer} from '../../services/exec';
import {REDUX_SAGA, REDUX} from '../../common/const/actions'

function* getListAnnouncementDetailData(action: any) {
    let res = yield call(callAnnouncementDetail, action);
    let data: IAnnouncementDetail = {
        admin: {},
        content: "",
        announcementType: {},
        hidden: false,
        id: undefined,
        imageUrl: undefined,
        lastModified: undefined,
        createdDate: 0
    };
    if (res.code === 200) {
        data = res.data;
        yield put({
            type: REDUX.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL,
            data
        });
    }
}

function callAnnouncementDetail(action: any) {
    let id = "";
    if (action.id) {
        id = action.id;
    }
    return _requestToServer(
        GET, ANNOUNCEMENT_DETAIL + `/${id}`,
        undefined,
        undefined, undefined, undefined, false, false
    )
}

export function* AnnouncementDetailWatcher() {
    yield takeEvery(
        REDUX_SAGA.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL,
        getListAnnouncementDetailData
    )
}