import React, { PureComponent, } from 'react'
import { Modal, InputNumber, Row, Col, List, Input, Avatar, Button, Icon } from 'antd';

import { _requestToServer } from '../../../../../../services/exec';
import { POST } from '../../../../../../const/method';

import IImportCan from '../../../../../../models/import-can';
import { IptLetterP } from '../../../../layout/common/Common';
import { IMPORT_STU } from './../../../../../../services/api/private.api';
import { ISchool } from '../../../../../../models/schools';
//@ts-ignore
import fileEm from '../../../../../../assets/file/importStudent.xlsx';

interface IProps {
    openImport: boolean,
    handleImport: Function;
    getListSchool: Function;
    listSchools?: Array<ISchool>
};

interface IState {
    file?: any;
    params?: IImportCan;
    id?: string;
    name?: string;
    arrMsg?: {
        sheet?: any,
        logs?: Array<any>,
    },
};

class StuInsertExels extends PureComponent<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            params: {
                sheet: null,
                starColumn: null,
                endColumn: null,
                startRow: null,
                endRow: null,
                commentErrorToFile: true,
                removeImportedRowFromFile: false,
            },
            id: null,
            arrMsg: {
                sheet: null,
                logs: null,
            },
            name: ""
        };
    }

    sendFile = async () => {
        let { file, params, id } = this.state;
        let data = new FormData();
        data.append('file', file);
        let res = await _requestToServer(POST, IMPORT_STU(id), data, params, undefined, undefined, true, false);
        console.log(res.data);
        this.setState({ arrMsg: res.data[0] });
    }

    render() {
        let {
            params,
            arrMsg,
            id,
            name
        } = this.state;

        let {
            openImport,
            listSchools,
        } = this.props;

        return (
            <Modal
                visible={openImport}
                onOk={this.sendFile}
                onCancel={() => this.props.handleImport()}
                title='Import exel sinh viên'
                width={"600px"}
                cancelText={"Đóng"}
                footer={[
                    <Button key={"cancel"} type={"danger"} onClick={() => this.props.handleImport()} children={"Đóng"} />,
                    <Button key={"ok"} type={"primary"} disabled={!id} onClick={() => this.sendFile()} children={"Hoàn tất"} />
                ]}
            >
                <input
                    id="fileSelect"
                    type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={(event) => this.setState({ file: event.target.files[0] })}
                />
                <h5 style={{ margin: '16px 0' }}>Danh sách trường</h5>
                <p>
                    <a href={fileEm}>
                        <Icon type={"download"} />  Tải xuống bản mẫu file import sinh viên
                    </a>
                </p>
                <List
                    size="small"
                    header={
                        <Input
                            placeholder={"Nhập tên trường"}
                            onChange={(event) => {
                                if (event) { this.setState({ name: event.target.value }) }
                                this.props.getListSchool(event.target.value)
                            }}
                            value={name}
                        />
                    }
                    bordered
                    dataSource={listSchools}
                    renderItem={
                        item =>
                            (<List.Item
                                style={{
                                    backgroundColor: id !== item.id ? "white" : "#6eb2fd",
                                    cursor: "pointer"
                                }}
                                onClick={() => this.setState({ id: item.id, name: item.shortName })}>
                                <Avatar src={item.logoUrl} size={"large"} style={{ marginRight: 10 }} />
                                <ul>
                                    <li>{item.name} ({item.shortName})</li>
                                    <li>{item.email} ({item.email})</li>
                                </ul>
                            </List.Item>)
                    }
                />
                <h5>Tham số</h5>
                <Row>
                    <Col span={6}>
                        <IptLetterP value='Vị trí cột đầu' >
                            <InputNumber
                                onChange={(event) => { params.starColumn = event; this.setState({ params }) }}
                                min={0}
                            />
                        </IptLetterP>
                    </Col>
                    <Col span={6}>
                        <IptLetterP value='Vị trí cột cuối'>
                            <InputNumber
                                onChange={(event) => { params.endColumn = event; this.setState({ params }) }}
                                min={0}
                            />
                        </IptLetterP>
                    </Col>
                    <Col span={6}>
                        <IptLetterP value='Vị trí hàng đầu' >
                            <InputNumber
                                onChange={(event) => { params.startRow = event; this.setState({ params }) }}
                                min={0}
                            />
                        </IptLetterP>
                    </Col>
                    <Col span={6}>
                        <IptLetterP value='Vị trí hàng cuối' >
                            <InputNumber
                                onChange={(event) => { params.endRow = event; this.setState({ params }) }}
                                min={0}
                            />
                        </IptLetterP>
                    </Col>
                </Row>
                <div className={"test"} style={{ minHeight: 200, padding: 10, backgroundColor: "white" }}>
                    <div>
                        sheet: {arrMsg.sheet ? arrMsg.sheet : null}
                    </div>
                    <div>
                        {
                            arrMsg.logs && arrMsg.logs.map((element, index) => {
                                return <div key={index}>{element}</div>
                            })
                        }
                    </div>
                </div>
            </Modal>
        )
    }

};


export default StuInsertExels;