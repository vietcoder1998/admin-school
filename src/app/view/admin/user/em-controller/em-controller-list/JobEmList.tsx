import React, { Component } from 'react'
import { EVENT_SCHOOLS, EMPLOYER } from '../../../../../../services/api/private.api';
import { Modal, InputNumber, Checkbox, Select } from 'antd';
import { IJobEmployerServices } from '../../../../../../models/job-employer-services';
import { IEmployer } from '../../../../../../models/employers';
import { ISchool } from '../../../../../../models/schools';
import { IEventEm } from '../../../../../../models/event-em';
import findIdWithValue from "../../../../../../utils/findIdWithValue";
import { _requestToServer } from "../../../../../../services/exec";

import TextArea from 'antd/lib/input/TextArea';
import { POST } from '../../../../../../const/method';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';

interface IState {
    emsBody?: IJobEmployerServices;
    employerServicesList?: IEmployer[];
    schoolList?: ISchool[];
    eventList?: IEventEm[];
    esid?: string;
    evid?: string;
    emList?: any[];
    showModal?: boolean;
    loading?: boolean;
}

interface IProps {

}

export default class JobEmList extends Component<IProps, IState>{
    constructor(props) {
        super(props);
        this.state = {
            emsBody: {
                allEmployers: null,
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
            employerServicesList: [

            ],
            evid: null,
            esid: null,
            schoolList: [],
            emList: [],
            showModal: true
        }
    }

    static getDerivedStateFromProps(props, state: IState) {
        if (state.employerServicesList) {
            return { loading: true }
        }
    }

    onChangeEmbody = (value?: any, param?: string) => {
        let { emsBody } = this.state;
        emsBody[param] = value;
        this.setState({ emsBody });
    }

    onActiveJobService = async (evid?: string) => {
        let api = EVENT_SCHOOLS;
        let { emsBody } = this.state;

        await this.setState({ loading: true })
        if (evid) {
            api += `/${evid}/services`;
        } else {
            api += `/services`;
        }

        await _requestToServer(POST, api, emsBody);
        await setTimeout(() => {
            this.setState({ showModal: false, loading: false })
        }, 250);
    }

    onToggleModal = () => {
        let { showModal } = this.state;
        this.setState({ showModal: !showModal });
    };

    onSearchEm = async (employerName?: string) => {
        await _requestToServer(
            POST, EMPLOYER,
            { employerName },
            {
                pageIndex: 0,
                pageSize: 10
            },
            undefined, undefined, false, false
        ).then(res => {
            if (res && res.data) {
                this.setState({ employerServicesList: res.data.items });
                this.forceUpdate();
            }
        });
    }

    onSearchSchool = async (employerName?: string) => {
        let res = await _requestToServer(
            POST, EMPLOYER,
            { employerName },
            {
                pageIndex: 0,
                pageSize: 10
            },
            undefined, undefined, false, false
        );

        if (res && res.data) {
            this.setState({ employerServicesList: res.data.items })
        }
    }

    onSearchEvent = async (employerName?: string) => {
        let res = await _requestToServer(
            POST, EMPLOYER,
            { employerName },
            {
                pageIndex: 0,
                pageSize: 10
            },
            undefined, undefined, false, false
        );

        if (res && res.data) {
            this.setState({ employerServicesList: res.data.items })
        }
    };

    render() {
        let {
            showModal,
            emsBody,
            employerServicesList,
            schoolList,
            esid,
            evid,
        } = this.state;

        return (
            <Modal
                title="Kích hoạt danh sách gói dịch vụ"
                visible={showModal}
                onCancel={this.onToggleModal}
            >
                <InputTitle
                    title="Chọn trường"
                    widthLabel="200px"
                    id={"lg"}
                >
                    <Select
                        id={"lg"}
                        size="default"
                        placeholder="ex: English, Vietnamese"
                        onChange={
                            (event: any) => {
                                let newSchools = findIdWithValue(schoolList, event, "name", "id")
                                esid = newSchools;
                                this.setState({ esid })
                            }
                        }
                        onSearch={event => this.onSearchSchool(event)}
                        style={{ width: '100%' }}
                    >
                        {/* {listEmployerOptions} */}
                    </Select>
                </InputTitle>
                <InputTitle
                    title="Chọn nhà NTD"
                    widthLabel="200px"
                    id={"lg"}
                >
                    <Select
                        id={"lg"}
                        mode="multiple"
                        size="default"
                        placeholder="ex: English, Vietnamese"
                        onChange={
                            (event: any) => {
                                let newEmployerIDs = findIdWithValue(employerServicesList, event, "name", "id")
                                emsBody.employerIDs = newEmployerIDs;
                                this.setState({ emsBody })
                            }
                        }
                        onSearch={event => this.onSearchEm(event)}
                        style={{ width: '100%' }}
                    >
                        {

                            employerServicesList && employerServicesList.map(
                                (item: IEmployer, index: number) => (<Select.Option children={item.employerName} value={item.id} />)
                            )
                        }
                    </Select>
                </InputTitle>
                <label htmlFor="message" children="Tin nhắn" />
                <TextArea id={"message"} value={emsBody.message} placeholder="Tin nhắn hồi báo" />
                <InputNumber
                    style={{ margin: 10 }}
                    min={-1000} max={1000}
                    placeholder={"top"}
                    onChange={(event) => this.onChangeEmbody()}
                />
                <InputNumber
                    style={{ margin: 10 }}
                    min={-1000}
                    max={1000}
                    placeholder={"highlight"}
                    onChange={(event) => this.onChangeEmbody()}
                />
                <InputNumber
                    style={{ margin: 10 }}
                    min={-1000} max={1000}
                    placeholder={"title"}
                    onChange={(event) => this.onChangeEmbody()}
                />
                <InputNumber
                    style={{ margin: 10 }}
                    min={-1000} max={1000}
                    placeholder={"inday"}
                    onChange={(event) => this.onChangeEmbody()}
                />
                <InputNumber
                    style={{ margin: 10 }}
                    min={-1000}
                    max={1000}
                    placeholder={"job"}
                    onChange={(event) => this.onChangeEmbody()}
                />
                <InputNumber
                    style={{ margin: 10 }}
                    min={-1000}
                    max={1000}
                    placeholder={"unlock"}
                    onChange={(event) => this.onChangeEmbody()}
                />
                <br></br>
                <Checkbox
                    id={'alle'}
                    checked={emsBody.allEmployers}
                    value={emsBody.allEmployers}
                    onChange={
                        event => this.onChangeEmbody(event, 'allEmployers')
                    }
                >
                    Tất cả nhà tuyển dụng
                </Checkbox>
            </Modal>
        )
    }
}
