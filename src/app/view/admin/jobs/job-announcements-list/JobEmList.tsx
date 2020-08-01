import React, { Component } from 'react'
import { EM_SERVICE } from '../../../../../services/api/private.api';
import { Modal, InputNumber, Checkbox, Select, Row, Col } from 'antd';
import { IJobEmployerServices } from '../../../../../models/job-employer-services';
import { IEmployer } from '../../../../../models/employers';
import { ISchool } from '../../../../../models/schools';
import findIdWithValue from "../../../../../utils/findIdWithValue";
import { _requestToServer } from "../../../../../services/exec";

import TextArea from 'antd/lib/input/TextArea';
import { POST } from '../../../../../const/method';
import { InputTitle } from '../../../layout/input-tittle/InputTitle';
import { IptLetterP } from '../../../layout/common/Common';

interface IState {
    emsBody?: IJobEmployerServices;
    esid?: string;
    evid?: string;
    emList?: any[];
    showModal?: boolean;
    loading?: boolean;
    isSe?: boolean;
}

interface IProps {
    listEm: Array<any>
    listEventSchool: Array<any>
    listSchool: Array<any>
    getListEmployer: Function;
    getListSchools: Function;
    getListEventSchools: Function;
    showSv: boolean;
    onToggleSv: Function;
}

export default class JobEmList extends Component<IProps, IState>{
    constructor(props) {
        super(props);
        this.state = {
            emsBody: {
                allEmployers: false,
                employerIDs: [],
                message: null,
                jobLimitExists: null,
                topLimit: null,
                inDayLimit: null,
                highlightLimit: null,
                titleHighlightLimit: null,
                jobLimit: null,
                unlockLimit: null
            },
            evid: null,
            esid: null,
            emList: [],
            showModal: true,
            isSe: false
        }
    }


    onChangeEmbody = (value?: any, param?: string) => {
        let { emsBody } = this.state;
        emsBody[param] = value;
        this.setState({ emsBody });
    }

    onActiveJobService = async () => {
        let { emsBody, evid, isSe } = this.state;
        if (!isSe) { evid = null }
        let api = EM_SERVICE(evid);
        await this.setState({ loading: true })
        await _requestToServer(POST, api, emsBody);
        await setTimeout(() => {
            this.setState({ loading: false })
            this.props.onToggleSv()
        }, 250);
    }

    onToggleModal = () => {
        let { showModal } = this.state;
        this.setState({ showModal: !showModal });
    };

    onSearchEvent = (esid) => {
        if (esid) {
            this.setState({ esid })
        }

        setTimeout(() => {
            this.props.getListEventSchools({ schoolID: esid })
        }, 250);
    }

    render() {
        let {
            emsBody,
            esid,
            isSe,
            loading
        } = this.state;

        let {
            listEm,
            listSchool,
            listEventSchool,
            showSv
        } = this.props;

        let listEmOptions = listEm && listEm.map(
            (item: IEmployer, index: number) => <Select.Option key={item.id} children={item.employerName} value={item.employerName + index} />
        )

        let listSchoolOptions = listSchool && listSchool.map(
            (item: ISchool, index: number) => <Select.Option key={item.name + index} children={item.name} value={item.name} />
        )

        let listEventSchoolOption = listEventSchool && listEventSchool.map(
            (item: ISchool, index: number) => <Select.Option key={item.name + index} children={item.name} value={item.name} />
        )

        return (
            <Modal
                title="Kích hoạt danh sách gói dịch vụ"
                style={{ top: 20 }}
                visible={showSv}
                onCancel={() => this.props.onToggleSv()}
                onOk={() => this.onActiveJobService()}
                okText={"Kích hoạt"}
                confirmLoading={loading}
                cancelText={"Hủy"}
                destroyOnClose={true}
            >
                <Checkbox
                    id={'alle'}
                    defaultChecked={false}
                    style={{ margin: "10px 0" }}
                    onChange={
                        event => this.setState({ isSe: event.target.checked })
                    }
                >
                    Sự kiện trường
                </Checkbox>
                <InputTitle
                    title="Chọn trường"
                    widthLabel="200px"
                    id={"lg"}
                >
                    <Select
                        id={"lg"}
                        size="default"
                        placeholder="ex: English, Vietnamese"
                        showSearch={true}
                        disabled={!isSe}
                        onChange={
                            (event: any) => this.onSearchEvent(findIdWithValue(listSchool, event, "name", "id"))
                        }
                        style={{ width: '100%' }}
                        onSearch={event => this.props.getListSchools({ name: event }, 0, 10)}
                    >
                        {listSchoolOptions}
                    </Select>
                </InputTitle>
                <InputTitle
                    title="Chọn sự kiện"
                    widthLabel="200px"
                    id={"lg"}
                >
                    <Select
                        id={"lg"}
                        size="default"
                        placeholder="ex: English, Vietnamese"
                        showSearch={true}
                        disabled={!isSe}
                        onChange={
                            (event: any) => {
                                let evid = findIdWithValue(listEventSchool, event, "name", "id")
                                this.setState({ evid })
                            }
                        }
                        onSearch={event => this.props.getListEventSchools({ name: event, schoolID: esid }, 0, 10)}
                        style={{ width: '100%' }}
                    >
                        {listEventSchoolOption}
                    </Select>
                </InputTitle>
                <Checkbox
                    id={'alle'}
                    checked={emsBody.allEmployers}
                    value={emsBody.allEmployers}
                    defaultChecked={false}
                    style={{ margin: "10px 0" }}
                    onChange={
                        event => this.onChangeEmbody(event.target.checked, 'allEmployers')
                    }
                >
                    Tất cả nhà tuyển dụng
                </Checkbox>
                <InputTitle
                    title="Chọn NTD"
                    widthLabel="200px"
                    id={"lg"}
                >
                    <Select
                        id={"lg"}
                        mode="multiple"
                        size="default"
                        placeholder="ex: English, Vietnamese"
                        showSearch={true}
                        disabled={emsBody.allEmployers}
                        onChange={
                            event => {
                                let newEmployerIDs = findIdWithValue(listEm, event, "employerName", "id", true)
                                emsBody.employerIDs = newEmployerIDs;
                                this.setState({ emsBody })
                            }
                        }
                        onSearch={event => this.props.getListEmployer({ employerName: event }, 0, 10)}
                        style={{ width: '100%' }}
                        loading={this.state.loading}
                    >
                        {listEmOptions}
                    </Select>
                </InputTitle>
                <label htmlFor="message" children="Tin nhắn" />
                <TextArea id={"message"} onChange={event => this.onChangeEmbody(event.target.value, "message")} placeholder="Tin nhắn hồi báo" />
                <Row >
                    <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
                        <IptLetterP value="Top" />
                        <InputNumber
                            style={{ margin: 10 }}
                            min={-1000} max={1000}
                            placeholder={"top"}
                            onChange={(event) => this.onChangeEmbody(event, 'top')}
                        />
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
                        <IptLetterP value="Highlight" />
                        <InputNumber
                            style={{ margin: 10 }}
                            min={-1000}
                            max={1000}
                            placeholder={"highlight"}
                            onChange={(event) => this.onChangeEmbody(event, 'highlight')}
                        />
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
                        <IptLetterP value="Title" />
                        <InputNumber
                            style={{ margin: 10 }}
                            min={-1000} max={1000}
                            placeholder={"title"}
                            onChange={(event) => this.onChangeEmbody(event, 'title')}
                        />
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
                        <IptLetterP value="Inday" />
                        <InputNumber
                            style={{ margin: 10 }}
                            min={-1000} max={1000}
                            placeholder={"inday"}
                            onChange={(event) => this.onChangeEmbody(event, 'inday')}
                        />
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
                        <IptLetterP value="job" />
                        <InputNumber
                            style={{ margin: 10 }}
                            min={-1000}
                            max={1000}
                            placeholder={"job"}
                            onChange={(event) => this.onChangeEmbody(event, 'job')}
                        />
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
                        <IptLetterP value="unlock" />
                        <InputNumber
                            style={{ margin: 10 }}
                            min={-1000}
                            max={1000}
                            placeholder={"unlock"}
                            onChange={(event) => this.onChangeEmbody(event, 'unlock')}
                        />
                    </Col>
                </Row>
                <br></br>
            </Modal>
        )
    }
}
