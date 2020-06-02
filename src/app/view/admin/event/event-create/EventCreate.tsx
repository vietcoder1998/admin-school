import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Divider, Button, DatePicker } from 'antd';
import { InputTitle } from '../../../layout/input-tittle/InputTitle';
import TextArea from 'antd/lib/input/TextArea';
import { TYPE } from '../../../../../const/type';
import moment from 'moment';
import { IEvent } from './../../../../../models/event';
import findIdWithValue from '../../../../../utils/findIdWithValue';
import { _requestToServer } from './../../../../../services/exec';
import { routeLink, routePath } from '../../../../../const/break-cumb';
import { SCHOOLS } from '../../../../../services/api/private.api';
import { POST, PUT } from '../../../../../const/method';
import { ISchoolsFilter } from '../../../../../models/schools';
import { REDUX_SAGA } from '../../../../../const/actions';
import IEventDetail from './../../../../../models/event-detail';
const { RangePicker } = DatePicker;

interface IState {
    body?: IEvent
    sid?: string;
    eid?: string;
    loading?: boolean;
    name?: string;
    shortName?: string;
    typeCpn?: string;
    eventDetail: IEventDetail;
}

interface IProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history?: any;
    getListJobNames: Function;
    getListSchools: Function;
    getEventDetail: Function;
}

const dateFormat = 'DD/MM/YY';

class Announcement extends Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            body: {
                name: null,
                description: null,
                startedDate: null,
                finishedDate: null
            },
            name: null,
            shortName: null,
            sid: null,
            eid: null,
            typeCpn: null,
            eventDetail: null,
        }
    }

    async componentDidMount() {
        let { name } = this.state;
        this.props.getListSchools(0, 10, { name })
    }

    static getDerivedStateFromProps(props?: IProps, state?: IState) {
        if (
            (props.match.params.eid !== state.eid)
        ) {
            props.getEventDetail(props.match.params.eid)
        }

        if (
            props.eventDetail !== state.eventDetail
        ) {
            let typeCpn = TYPE.CREATE;
            let eventDetail = props.eventDetail;
            let body = state.body;
            let sid = state.sid;

            if (props.match.url.includes("fix")) {
                typeCpn = TYPE.FIX;
                eventDetail = props.eventDetail;
            };

            if (typeCpn !== TYPE.CREATE) {
                sid = eventDetail && eventDetail.school ? eventDetail.school.id : null;
                body.name = eventDetail.name;
                body.description = eventDetail.description;
                body.finishedDate = eventDetail.finishedDate;
                body.startedDate = eventDetail.startedDate;
            };

            return {
                body,
                typeCpn,
                eid: props.match.params.eid,
                sid,
                eventDetail: props.eventDetail
            }
        }
        return { loadingTable: false }
    }

    createRequest = async () => {
        const { body, sid, typeCpn, eid } = this.state;
        let METHOD = typeCpn === TYPE.CREATE ? POST : PUT;
        let API = SCHOOLS;

        await _requestToServer(
            METHOD,
            API + `/${sid}/events` + (typeCpn !== TYPE.CREATE ? `/${eid}` : ""),
            body,
            null,
            undefined,
            undefined,
            true,
            false,
        ).then((res: any) => {
            if (res) {
                setTimeout(() => {
                    this.props.history.push(routeLink.EVENT + routePath.LIST);
                }, 500);
            }
        }).finally(() => {
            this.setState({ loading: false })
        })
    }

    render() {
        let { listSchools } = this.props;
        let { body, sid, typeCpn } = this.state;
        let listValue = listSchools && listSchools.map(item => ({ value: item.id, label: item.name }))
        return (
            <div className='common-content'>
                <h5>
                    {typeCpn === TYPE.CREATE ? "Tạo sự kiện" : "Thay đổi thông tin sự kiện"}
                </h5>
                <Divider orientation="left" >Nội dung sự kiện</Divider>
                <div className="anno-create">
                    <InputTitle
                        type={TYPE.INPUT}
                        title="Tên sự kiện"
                        widthLabel="200px"
                        children={
                            <TextArea
                                style={{ width: '100%' }}
                                maxLength={400}
                                placeholder="ex: Sự kiện ngày hội việc làm đại học công nghệ (Tối đa : 400)"
                                value={body.name}
                                onChange={
                                    (event: any) => {
                                        body.name = event.target.value;
                                        this.setState({ body });
                                    }
                                }
                            />
                        }
                    />
                    <div style={{ textAlign: "center" }}>
                        Hiện tại:
                    <span
                            style={
                                { color: body.name && body.name.length < 6000 ? '#168ECD' : 'red' }
                            }
                            children={body.name && body.name.length ? body.name.length : 0}
                        />  kí tự
                </div>
                    <InputTitle
                        title="Mô tả"
                        widthLabel="200px"
                        widthComponent="400px"
                    >
                        <TextArea
                            rows={12}
                            style={{ width: '100%' }}
                            maxLength={10000}
                            placeholder=" (Tối đa : 10000 kí tự)"
                            value={body.description}
                            onChange={
                                (event: any) => {
                                    console.log(event.target.value)
                                    body.description = event.target.value;
                                    this.setState({ body });
                                }
                            }
                        />
                    </InputTitle>
                    <div style={{ textAlign: "center" }}>
                        Hiện tại:
                    <span
                            style={
                                { color: body.description && body.description.length < 6000 ? '#168ECD' : 'red' }
                            }
                            children={body.description && body.description.length ? body.description.length : 0}
                        />  kí tự
                </div>
                    <InputTitle
                        title="Chọn trường tổ chức"
                        widthLabel="170px"
                        widthComponent="400px"
                        type={TYPE.SELECT}
                        listValue={listValue}
                        value={findIdWithValue(listSchools, sid, "id", "name")}
                        onSearch={(event) => { if (event) { this.props.getListSchools(0, 10, { name: event }) } }}
                        onChange={
                            (event: any) => {
                                this.setState({ sid: event });
                            }
                        }
                        placeholder="ex: ĐH Công nghê- ĐH Quốc Gia Hà Nội"
                    />
                    <InputTitle
                        title="Chọn thời gian hết hạn"
                        type="SWITCH"
                        widthLabel="170px"
                    >
                        <RangePicker
                            value={[
                                body.startedDate ? moment(body.startedDate) : null,
                                body.finishedDate ? moment(body.finishedDate) : null
                            ]}
                            onChange={(event) => {
                                if (event && event[0]) {
                                    body.startedDate = event[0].unix() * 1000;
                                    this.setState({ body })
                                }

                                if (event && event[1]) {
                                    body.finishedDate = event[1].unix() * 1000;
                                    this.setState({ body })
                                }
                            }}
                            format={dateFormat}
                            disabledDate={d => !d || d.isAfter(moment().add(90, 'days')) || d.isSameOrBefore(moment())}
                        />
                    </InputTitle>
                </div>
                <div className="anno-create">
                    <Button
                        type="danger"
                        prefix={"check"}
                        style={{
                            margin: "10px 10px",
                        }}
                        icon={"close"}
                        children="Hủy"

                        onClick={() => { this.props.history.push(routeLink.EVENT + routePath.LIST) }}
                    />
                    <Button
                        type="primary"
                        prefix={"check"}
                        style={{
                            margin: "10px 10px",
                            float: "right"
                        }}
                        onClick={() => this.createRequest()}
                        icon={"plus"}
                        children={typeCpn === TYPE.CREATE ? "Tạo sự kiện" : "Sửa sự kiện"}
                    />
                </div>
            </div >
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListSchools:
        (pageIndex: number, pageSize: number, body?: ISchoolsFilter) =>
            dispatch({ type: REDUX_SAGA.SCHOOLS.GET_SCHOOLS, pageIndex, pageSize, body }),
    getEventDetail:
        (id?: string) =>
            dispatch({ type: REDUX_SAGA.EVENT_SCHOOLS.GET_EVENT_DETAIL, id })
});

const mapStateToProps = (state: any, ownProps?: any) => ({
    listSchools: state.Schools.items,
    eventDetail: state.EventDetail
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Announcement)