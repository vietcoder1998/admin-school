import React from 'react';
import { InputTitle } from '../input-tittle/InputTitle';
import { InputNumber, Switch, Select, Row, Col, Checkbox, Button, TimePicker, Radio } from 'antd';
import { IptLetterP, IptLetter } from '../common/Common';
import randomID from '../../../../common/utils/randomID';
import { IShifts } from '../../../../redux/models/pending-jobs';
import { TYPE } from '../../../../common/const/type';
import moment from 'moment';
const { Option } = Select;

interface IShiftContent {
    key?: any;
    id?: any;
    index?: number;
    type?: string;
    removeButton?: boolean;
    disableChange?: boolean;
    onChange?: Function;
    removeShift?: Function;
    shifts?: IShifts;
}

export function newShift(): IShifts {
    return {
        id: randomID(8),
        startTime: null,
        endTime: null,
        minSalary: null,
        maxSalary: null,
        unit: 'ca',
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false,
        genderRequireds: [],
    };
};

export default function ShiftContent(props: IShiftContent) {
    const [id, setId] = React.useState(randomID(16));
    const [startTime, setStartTime] = React.useState(null);
    const [endTime, setEndTime] = React.useState(null);
    const [minSalary, setMinsalary] = React.useState(null);
    const [maxSalary, setMaxSalary] = React.useState(null);
    const [agreement, setAgreement] = React.useState(true);
    const [mon, setMon] = React.useState(false);
    const [tue, setTue] = React.useState(false);
    const [wed, setWed] = React.useState(false);
    const [thu, setThu] = React.useState(false);
    const [fri, setFri] = React.useState(false);
    const [sat, setSat] = React.useState(false);
    const [unit, setUnit] = React.useState("ca");
    const [sun, setSun] = React.useState(false);
    const [typeGender, setTypeGender] = React.useState(true);
    const [genderRequireds, setGenderRequireds] = React.useState([]);
    let [valueGender, setValueGender] = React.useState([
        { gender: TYPE.MALE, quantity: 0, id: null },
        { gender: TYPE.FEMALE, quantity: 0, id: null }
    ]);
    let [valueBoth, setValueBoth] = React.useState([
        { gender: TYPE.BOTH, quantity: 0, id: null },
    ]);

    if (props.shifts && props.shifts.id !== id) {
        if (
            props.shifts.minSalary === 0 &&
            props.shifts.maxSalary === 0) {
            setAgreement(false)
        }
        setMaxSalary(props.shifts.maxSalary);
        setMinsalary(props.shifts.minSalary);
        setStartTime(props.shifts.startTime);
        setEndTime(props.shifts.endTime);
        setId(props.shifts.id);
        setMon(props.shifts.mon);
        setTue(props.shifts.tue);
        setWed(props.shifts.wed);
        setThu(props.shifts.thu);
        setFri(props.shifts.fri);
        setSat(props.shifts.sat);
        setUnit(props.shifts.unit);
        setSun(props.shifts.sun);
        setGenderRequireds(props.shifts.genderRequireds)

        if (
            props.shifts.genderRequireds &&
            props.shifts.genderRequireds.length > 0
        ) {
            let newValueGender = valueGender;
            props.shifts.genderRequireds.forEach((item: any) => {
                if (item.gender === TYPE.BOTH) {
                    setTypeGender(false);
                    setValueBoth([item]);
                } else {
                    setTypeGender(true);
                    if (item.gender === TYPE.MALE) {
                        newValueGender[0] = item;
                    }

                    if (item.gender === TYPE.FEMALE) {
                        newValueGender[1] = item;
                    }

                    setValueGender(newValueGender);
                }
            });
        }
    }

    const timeSetup = (
        <div
            style={{
                display: 'flex',
                pointerEvents: props.disableChange ? "none" : "visible"
            }}
        >
            <Row>
                <Col sm={8} md={8} lg={4} xl={3} >
                    <IptLetterP value={"Thứ hai"} style={{ textAlign: "center", marginRight: "25px" }}  >
                        <Checkbox
                            checked={mon}
                            onChange={
                                (event: any) => setMon(event.target.checked)
                            }
                        />
                    </IptLetterP>
                </Col>
                <Col sm={8} md={8} lg={4} xl={3} >
                    <IptLetterP value={"Thứ ba"} style={{ textAlign: "center", marginRight: "25px" }}  >
                        <Checkbox
                            checked={tue}
                            onChange={
                                (event: any) => setTue(event.target.checked)
                            }
                        />
                    </IptLetterP>
                </Col>
                <Col sm={8} md={8} lg={4} xl={3} >
                    <IptLetterP value={"Thứ tư"} style={{ textAlign: "center", marginRight: "25px" }}  >
                        <Checkbox
                            checked={wed}
                            onChange={
                                (event: any) => setWed(event.target.checked)
                            }
                        />
                    </IptLetterP>
                </Col>
                <Col sm={8} md={8} lg={4} xl={3} >
                    <IptLetterP value={"Thứ năm"} style={{ textAlign: "center", marginRight: "25px" }} >
                        <Checkbox
                            checked={thu}
                            onChange={
                                (event: any) => setThu(event.target.checked)
                            }
                        />
                    </IptLetterP>
                </Col>
                <Col sm={8} md={8} lg={4} xl={3} >
                    <IptLetterP value={"Thứ sáu"} style={{ textAlign: "center", marginRight: "25px" }}  >
                        <Checkbox
                            checked={fri}
                            onChange={
                                (event: any) => setFri(event.target.checked)
                            }
                        />
                    </IptLetterP>
                </Col>
                <Col sm={8} md={8} lg={4} xl={3} >
                    <IptLetterP value={"Thứ bảy"} style={{ textAlign: "center", marginRight: "25px" }}  >
                        <Checkbox
                            checked={sat}
                            onChange={
                                (event: any) => setSat(event.target.checked)
                            }
                        />
                    </IptLetterP>
                </Col>
                <Col sm={8} md={8} lg={4} xl={3} >
                    <IptLetterP value={"Chủ nhật"} style={{ textAlign: "center", marginRight: "25px" }}>
                        <Checkbox
                            checked={sun}
                            onChange={
                                (event: any) => setSun(event.target.checked)
                            }
                        />
                    </IptLetterP>
                </Col>
            </Row>
        </div>
    );

    const target = () => {
        if (props.shifts.genderRequireds) {
            return (<div>
                <Radio.Group
                    name="radiogroup"
                    defaultValue={true}
                    value={typeGender}
                    onChange={
                        (event: any) => setTypeGender(event.target.value)
                    }
                >
                    <Radio value={true}>Theo giới tính</Radio>
                    <Radio value={false}>Theo Số lượng</Radio>
                </Radio.Group>
                <Row style={{ marginTop: 5, display: typeGender ? 'block' : 'none' }}>
                    {/* With Gender */}
                    <Col xs={12} sm={12} md={12} lg={10} xl={12}>
                        <IptLetterP value="Nam" icon="man">
                            <InputNumber
                                min={0}
                                defaultValue={0}
                                value={valueGender[0].quantity}
                                onChange={
                                    (event: number) => {
                                        let newValueGender = valueGender;
                                        newValueGender[0].quantity = event;
                                        setValueGender([newValueGender[0], newValueGender[1]]);
                                        setGenderRequireds(valueGender)
                                    }
                                }
                            />
                        </IptLetterP>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={10} xl={12}>
                        <IptLetterP value="Nữ" icon="woman">
                            <InputNumber
                                min={0}
                                defaultValue={0}
                                value={valueGender[1].quantity}
                                onChange={
                                    (event: number) => {
                                        let newValueGender = valueGender;
                                        newValueGender[1].quantity = event;
                                        setValueGender([newValueGender[0], newValueGender[1]]);
                                        setGenderRequireds(valueGender)
                                    }
                                }
                            />
                        </IptLetterP>
                    </Col>
                </Row >
                {/* With Both */}
                <Row style={{ marginTop: 5, display: !typeGender ? 'block' : 'none' }}>
                    <Col xs={12} sm={12} md={12} lg={10} xl={12}>
                        <IptLetterP value="Người" icon="team">
                            <InputNumber
                                min={1}
                                defaultValue={0}
                                value={valueBoth[0].quantity}
                                onChange={
                                    (event: number) => {
                                        let newValueBoth = valueBoth[0];
                                        newValueBoth.quantity = event;
                                        setValueBoth([newValueBoth]);
                                        setGenderRequireds([newValueBoth]);
                                    }
                                }
                            />
                        </IptLetterP>
                    </Col>
                </Row>
            </div>)
        }

        return;
    };

    React.useEffect(
        () => {
            if (props.shifts && props.onChange && props.id !== null && !props.disableChange) {
                props.onChange({
                    id,
                    startTime,
                    endTime,
                    minSalary: agreement ? minSalary : null,
                    unit: agreement ? unit : null,
                    maxSalary: agreement ? maxSalary : null,
                    mon,
                    tue,
                    wed,
                    thu,
                    fri,
                    sat,
                    sun,
                    genderRequireds
                });
            }

            return;
        },
        // eslint-disable-next-line
        [
            id,
            startTime,
            endTime,
            minSalary,
            unit,
            maxSalary,
            mon,
            tue,
            wed,
            thu,
            fri,
            sat,
            sun,
            agreement,
            genderRequireds,
            typeGender,
            valueGender,
            valueBoth,
        ]
    );

    if (!props.shifts) {
        return
    }

    return (
        <div
            style={{
                margin: "10px 10px",
                border: "solid gray 1px",
                borderRadius: "5px",
                padding: "2vh 2vw",
                position: "relative",
            }}
        >
            <div
                style={{
                    textAlign: "right",
                    display: props.type === TYPE.PARTTIME ? 'block' : 'none'
                }}
            >
                <IptLetter value={`Ca số: ${props.index + 1} `} />
            </div>

            <div style={{ display: props.type === TYPE.INTERNSHIP ? 'none' : 'block' }}>
                <Row>
                    <Col sm={24} md={24} lg={8} xl={8} xxl={8}>
                        <p
                            children="Chọn thời gian:"
                        />
                    </Col>
                    <Col sm={24} md={12} lg={8} xl={8} xxl={8}>

                        <TimePicker
                            placeholder="Bắt đầu"
                            format={"HH:mm"}
                            style={{ width: "90%" }}
                            value={startTime ? moment(startTime, "HH:mm") : null}
                            onChange={(time: any, timeString: string) => setStartTime(timeString)}
                        />
                    </Col>
                    <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
                        <TimePicker
                            placeholder="Kết thúc"
                            format={"HH:mm"}
                            style={{ width: "90%" }}
                            value={endTime ? moment(endTime, "HH:mm") : null}
                            onChange={(time: any, timeString: string) => setEndTime(timeString)}
                        />
                    </Col>
                </Row>
            </div>
            <>
                <InputTitle title="Mức lương" >
                    <Switch
                        defaultChecked={true}
                        style={{ marginRight: " 10px" }}
                        checked={agreement}
                        onChange={
                            (event: boolean) => setAgreement(event)
                        }
                        disabled={props.disableChange}
                    />
                    {!agreement ? "Theo thỏa thuận" : "Theo định mức"}
                </InputTitle>
                <Row >
                    <Col xs={12} sm={12} md={12} lg={12} xl={8} >
                        <IptLetterP value={"Tối thiểu(VND)"} >
                            <InputNumber
                                placeholder='ex: 5000000'
                                value={minSalary}
                                min={0}
                                step={1000}
                                onChange={(value: number) => setMinsalary(value)}
                                disabled={!agreement}
                            />
                        </IptLetterP>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={8} >
                        <IptLetterP value={"Tối đa(VND)"}  >
                            <InputNumber
                                value={maxSalary}
                                placeholder='ex: 5000000'
                                min={minSalary + 1000}
                                step={1000}
                                onChange={(value: number) => setMaxSalary(value)}
                                disabled={!agreement}
                            />
                        </IptLetterP>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={8} >
                        <IptLetterP value={"Theo"} >
                            <Select
                                style={{ width: "90px" }}
                                value={unit ? unit : "ca"}
                                placeholder="ex: giờ"
                                onChange={(value: string) => setUnit(value)}
                                disabled={!agreement}
                            >
                                <Option key={"1"} value={"ca"} >Ca</Option>
                                <Option key={"2"} value={"giờ"} >Giờ</Option>
                                <Option key={"3"} value={"ngày"} >Ngày</Option>
                                <Option key={"4"} value={"tháng"} >Tháng</Option>
                                <Option key={"5"} value={"sản phẩm"} >Sản phẩm</Option>
                            </Select>
                        </IptLetterP>
                    </Col>
                </Row>
            </>
            <div style={{ display: props.type === TYPE.INTERNSHIP ? 'none' : 'block' }}>
                <InputTitle title="Ngày làm" children={timeSetup} />
            </div>
            <>
                {props.shifts.genderRequireds ? <InputTitle title="Đối tượng" children={target()} /> : undefined}
            </>
            <>
                <Button
                    type={"danger"}
                    icon="delete"
                    style={{
                        marginRight: "10px",
                        display: props.removeButton ? "block" : "none"
                    }}
                    onClick={() => props.removeShift ? props.removeShift(props.id) : undefined}
                >
                    Xóa ca
                </Button>
                {/* <Button type="dashed" icon="undo">Reset</Button> */}
            </>
        </div >
    )
}