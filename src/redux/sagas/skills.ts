import { SKILLS } from './../../services/api/private.api';
import { ISkills } from './../models/skills';
import { authHeaders } from './../../services/auth';
import { GET } from '../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { ADMIN_HOST } from '../../environment/dev';

function* getListSkillsData(action) {
    let res = yield call(callSkills, action);

    if (res.code === 200) {
        let data: ISkills = res.data;
        yield put({
            type: REDUX.SKILLS.GET_SKILLS,
            data
        });
    }
}

function callSkills(action) {
    var pageIndex;
    var pageSize;
    if (action.pageIndex) {
        pageIndex = action.pageIndex;
    }

    if (action.pageSize) {
        pageSize = action.pageSize;
    }

    return _requestToServer(
        GET,
        null,
        SKILLS,
        ADMIN_HOST,
        authHeaders,
        {
            pageIndex: pageIndex ? pageIndex : 0,
            pageSize: pageSize ? pageSize : 10
        }
    )
}

export function* SkillsWatcher() {
    yield takeEvery(
        REDUX_SAGA.SKILLS.GET_SKILLS,
        getListSkillsData
    )
}