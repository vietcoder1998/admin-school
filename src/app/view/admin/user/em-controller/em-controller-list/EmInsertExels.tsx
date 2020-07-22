import React, { PureComponent, } from 'react'
import { Modal, InputNumber, Row, Col, Icon, Button } from 'antd';
import './EmControllerList.scss';

import { _requestToServer } from '../../../../../../services/exec';
import { POST } from '../../../../../../const/method';

import { IMPORT_EM } from './../../../../../../services/api/private.api';
import IImportCan from './../../../../../../models/import-can';
import { IptLetterP } from '../../../../layout/common/Common';
//@ts-ignore
import fileEm from '../../../../../../assets/file/importEmployer.xlsx';

interface IProps {
    openImport: boolean,
    handleImport: Function;
};

interface IState {
    file?: any;
    params?: IImportCan;
    arrMsg?: {
        sheet?: any,
        logs?: Array<any>,
    },
};

class EmInsertExels extends PureComponent<IProps, IState> {
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
            arrMsg: {
                sheet: null,
                logs: null,
            },
        };
    }

    sendFile = async () => {
        let { file, params } = this.state;
        let data = new FormData();
        data.append('file', file);

        let res = await _requestToServer(POST, IMPORT_EM, data, params, undefined, undefined, true, false);
        this.setState({ arrMsg: res.data[0] });
    }

    render() {
        let {
            params,
            arrMsg
        } = this.state;

        let { openImport } = this.props;

        return (
            <Modal
                visible={openImport}
                onOk={this.sendFile}
                onCancel={() => this.props.handleImport()}
                title='Import exel nhà tuyển dụng'
                width={"600px"}
                cancelText={"Đóng"}
                footer={[
                    <Button key={"cancel"} type={"danger"} onClick={() => this.props.handleImport()} children={"Đóng"} />,
                    <Button key={"ok"} type={"primary"} onClick={() => this.sendFile()} children={"Hoàn tất"} />
                ]}
            >
                <input
                    id="fileSelect"
                    type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={(event) => this.setState({ file: event.target.files[0] })}
                />
                <p>
                    <a href={fileEm}>
                        <Icon type={"download"} />  Tải xuống bản mẫu file import nhà tuyển dụng
                </a>
                </p>
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


export default EmInsertExels;