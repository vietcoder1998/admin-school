// import React, { Component } from 'react'
// import { Divider, Button, Input, DatePicker, Select, Tabs, message, Result } from 'antd';
// import { connect } from 'react-redux';
// import './JobAnnouncementsCreate.scss';
// import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
// import { REDUX_SAGA } from '../../../../../../common/const/actions';
// import { TYPE } from '../../../../../../common/const/type';
// import { IAppState } from '../../../../../../redux/store/reducer';
// import { IJobName } from '../../../../../../redux/models/job-names';
// import { IAnnoucementBody, IShift } from '../../../../../../redux/models/announcements';
// import { ShiftContent, newShift } from '../../../../layout/annou-shift/AnnouShift';
// import { IEmBranch } from '../../../../../../redux/models/em-branches';
// import findIdWithValue from '../../../../../../common/utils/findIdWithValue';
// import { _requestToServer } from '../../../../../../services/exec';
// import { POST, PUT } from '../../../../../../common/const/method';
// import { JOB_ANNOUNCEMENTS, PENDING_JOBS } from '../../../../../../services/api/private.api';
// import { EMPLOYER_HOST } from '../../../../../../environment/dev';
// import moment from 'moment';
// import { NotUpdate, Required } from '../../../../layout/common/Common';
// import { routeLink, routePath } from '../../../../../../common/const/break-cumb';

// const { TextArea } = Input;
// const { Option } = Select;
// const { TabPane } = Tabs;

// interface IJobAnnouncementsCreateState {
//     title: string;
//     announcementTypeID: string;
//     type_management: Array<any>;
//     list_item: Array<{ label: string, value: string }>,
//     loading: boolean;
//     value_annou: string;
//     type_cpn: string;
//     list_em_branches: Array<IEmBranch>;
//     body: IAnnoucementBody;
//     id?: string;
//     jobName?: string;
//     address?: string;
//     skills?: Array<string>
//     not_complete?: boolean;
//     job_announcement_detail?: any;
// };

// interface IJobAnnouncementsCreateProps extends StateProps, DispatchProps {
//     match: any;
//     history: any;
//     getJobAnnouncementDetail: Function;
//     getListEmBranches: Function;
//     getPendingJobDetail: (id?: string) => any;
// };

// class JobAnnouncementsCreate extends Component<IJobAnnouncementsCreateProps, IJobAnnouncementsCreateState> {
//     constructor(props) {
//         super(props);
//         this.state = {
//             title: "",
//             announcementTypeID: "",
//             type_management: [],
//             list_item: [],
//             loading: false,
//             value_annou: "",
//             type_cpn: TYPE.CREATE,
//             list_em_branches: [],
//             body: {
//                 jobTitle: null,
//                 jobNameID: null,
//                 employerBranchID: null,
//                 description: null,
//                 requiredSkillIDs: [],
//                 jobType: null,
//                 expirationDate: null,
//                 shifts: [
//                     {
//                         startTime: "00:00",
//                         endTime: "00:00",
//                         minSalary: 0,
//                         maxSalary: 0,
//                         unit: 'ca',
//                         mon: false,
//                         tue: false,
//                         wed: false,
//                         thu: false,
//                         fri: false,
//                         sat: false,
//                         sun: false,
//                         genderRequireds: null
//                     },
//                 ]
//             },
//             id: null,
//         };
//     };

//     async componentDidMount() {
//         if (this.props.match.params.id) {

//         };

//         this.props.getListEmBranches();
//     };

//     static getDerivedStateFromProps(props?: IJobAnnouncementsCreateProps, state?: IJobAnnouncementsCreateState) {
//         if (props.match.params.id && props.match.params.id !== state.id) {
//             let id = props.match.params.id;
//             if (
//                 props.match.url.includes("fix") ||
//                 props.match.url.includes("copy")

//             ) {
//                 props.getJobAnnouncementDetail(id);
//             }

//             if (
//                 props.match.url.includes("pending")
//             ) {
//                 props.getPendingJobDetail(id);
//             }

//             return {
//                 id
//             }
//         }


//         if (
//             (props.job_announcement_detail ||
//                 props.pending_job_detail) && props.match.params.id !== state.body.id
//         ) {
//             let type_cpn = TYPE.CREATE;
//             let job_announcement_detail = null;
//             let jobID = null;
//             let body = state.body;
//             let id = state.body.id;
//             let requiredSkillIDs = [];

//             if (props.match.url.includes("pending")) {
//                 type_cpn = TYPE.PENDING;
//                 id = props.pending_job_detail.id;
//                 job_announcement_detail = props.pending_job_detail.data;
//                 jobID = job_announcement_detail.jobNameID;
//                 requiredSkillIDs = job_announcement_detail.requiredSkillIDs
//             };

//             if (props.match.url.includes("fix")) {
//                 type_cpn = TYPE.FIX;
//                 id = props.job_announcement_detail.id;
//                 job_announcement_detail = props.job_announcement_detail;
//                 jobID = job_announcement_detail.jobName && job_announcement_detail.jobName.id;
//                 requiredSkillIDs = job_announcement_detail.requiredSkills && job_announcement_detail.requiredSkills.length &&
//                     job_announcement_detail.requiredSkills.map((item: any) => item.id)
//             };

//             if (props.match.url.includes("copy")) {
//                 type_cpn = TYPE.COPY;
//                 id = props.job_announcement_detail.id;
//                 job_announcement_detail = props.job_announcement_detail;
//                 jobID = job_announcement_detail.jobName && job_announcement_detail.jobName.id;
//                 requiredSkillIDs = job_announcement_detail.requiredSkills && job_announcement_detail.requiredSkills.length &&
//                     job_announcement_detail.requiredSkills.map((item: any) => item.id)
//             };

//             console.log(job_announcement_detail);

//             if (type_cpn !== TYPE.CREATE) {
//                 if (job_announcement_detail) {
//                     body.id = id;
//                     body.description = job_announcement_detail.description;
//                     body.jobTitle = job_announcement_detail.jobTitle;
//                     body.jobNameID = jobID;
//                     body.jobType = job_announcement_detail.jobType;
//                     body.employerBranchID = job_announcement_detail.employerBranchID;
//                     body.description = job_announcement_detail.description;
//                     body.expirationDate = job_announcement_detail.expirationDate;
//                     body.shifts = job_announcement_detail.shifts;
//                     body.requiredSkillIDs = requiredSkillIDs
//                 };
//             };

//             return {
//                 body,
//                 type_cpn,
//                 job_announcement_detail
//             }
//         }
//         return null
//     }

//     onChangeValue = (event: any, param: string) => {
//         let { body } = this.state;
//         let value: any = event;
//         switch (param) {
//             case value:

//                 break;
//         };
//         body[param] = value;
//         this.setState({ body });
//     };

//     handleBodyShift = (event: any, index: number | string) => {
//         let { body } = this.state;
//         console.log(index);
//         body.shifts[index] = event;
//         this.setState({ body })
//     };

//     replaceShift = () => {
//         let { body } = this.state;
//         body.shifts = [];
//         body.shifts.push(newShift());
//         this.setState({ body })
//     };

//     addShift = () => {
//         let { body } = this.state;
//         body.shifts.push(newShift());
//         this.setState({ body });
//     };

//     removeShift = (index: number) => {
//         let { body } = this.state;
//         body.shifts.splice(index, 1);
//         message.info({ type: "info", message: `Đã xóa ca số :${index}` });
//         this.setState({ body });
//     };

//     createRequest = async () => {
//         let { body, type_cpn, id } = this.state;
//         let newBody = await this.pretreatmentBody(body, type_cpn);
//         let matching = (type_cpn === TYPE.CREATE || type_cpn === TYPE.COPY) ? `` : `/${id}`;
//         let METHOD = type_cpn === TYPE.CREATE || type_cpn === TYPE.COPY ? POST : PUT;
//         let API = type_cpn === TYPE.PENDING ? PENDING_JOBS : JOB_ANNOUNCEMENTS;
//         await this.setState({ loading: true })

//         await _requestToServer(
//             METHOD,
//             API + matching,
//             newBody,
//             null,
//             undefined,
//             EMPLOYER_HOST,
//             true,
//             false,
//         ).then((res: any) => {
//             if (res) {
//                 setTimeout(() => {
//                     this.props.history.push(routeLink.PENDING_JOBS + routePath.LIST);
//                 }, 500);
//             }
//         }).finally(() => {
//             this.setState({ loading: false })
//         })
//     }

//     pretreatmentBody = (body: IAnnoucementBody, type_cpn: string) => {
//         let newBody = body;
//         this.setState({ not_complete: false });

//         newBody.shifts.forEach((element: any, index: number) => {
//             if (!element.genderRequireds || element.genderRequireds.length === 0) {
//                 message.warning(`Ca cần thêm số lượng tuyển`);
//                 this.setState({ not_complete: true })
//             }

//             element.genderRequireds = element.genderRequireds.map((item: any, index: number) => {
//                 if (item.id && type_cpn !== TYPE.CREATE) {
//                     return {
//                         id: item.id,
//                         quantity: item.quantity,
//                         gender: item.gender,
//                     }
//                 } else {
//                     return {
//                         quantity: item.quantity,
//                         gender: item.gender,
//                     }
//                 }
//             });

//             element.genderRequireds = element.genderRequireds.filter(
//                 (item: any, index: number) => item.quantity && item.quantity !== 0
//             );
//         });

//         if (type_cpn !== TYPE.FIX || type_cpn !== TYPE.PENDING) {
//             newBody.shifts.forEach((element: IShift, index: number) => {
//                 if (element.id) {
//                     delete element["id"]
//                 }

//                 if (element.minSalary === null) {
//                     element.minSalary = 0;
//                 }

//                 if (element.maxSalary === null) {
//                     element.maxSalary = 0;
//                 }
//             })
//         }

        
//         return {...newBody, id: undefined};
//     }

//     render() {
//         let {
//             type_cpn,
//             body,
//             loading
//         } = this.state;

//         let {
//             list_job_names,
//             list_em_branches,
//             list_skills,
//             job_announcement_detail,
//             normal_quantity
//         } = this.props;

//         let ct_btn_ex = "Huỷ";
//         let ct_btn_nt = "Lưu lại";

//         switch (type_cpn) {
//             case TYPE.COPY:
//                 ct_btn_ex = "Huỷ tạo";
//                 ct_btn_nt = "Tạo mới(bản sao)";
//                 break;

//             case TYPE.FIX:
//                 ct_btn_ex = "Huỷ";
//                 ct_btn_nt = "Lưu lại";
//                 break;
//             case TYPE.CREATE:
//                 ct_btn_ex = "Huỷ tạo";
//                 ct_btn_nt = "Tạo mới";
//                 break;
//             default:
//                 break;
//         };

//         let list_job_name_options = list_job_names.map((item: IJobName) => ({ label: item.name, value: item.id }));
//         let list_em_branches_options = list_em_branches.map((item: any) => ({ label: item.branchName, value: item.id }));
//         let list_skill_options = list_skills.map((item: IJobName, index: number) => (<Option key={index} value={item.name} children={item.name} />));

//         if (
//             !job_announcement_detail && job_announcement_detail.id
//         ) {
//             return <Result
//                 status="404"
//                 title="404"
//                 subTitle="Sorry, the page you visited does not exist."
//                 extra={<Button type="primary">Back Home</Button>}
//             />
//         }

//         let color = "black";
//         if (!body.description) {
//             color = "black";
//         } else {
//             if (body.description.length < 4000) {
//                 color = "#168ECD"
//             }

//             if (4000 < body.description.length && body.description.length < 6000) {
//                 color = "orange"
//             }

//             if (6000 < body.description.length && body.description.length < 10000) {
//                 color = "red"
//             }
//         }

//         return (
//             <div className='common-content'>
//                 <h5>
//                     {type_cpn === TYPE.FIX || type_cpn === TYPE.PENDING ? "Thông tin bài đăng(sửa)" : `Tạo bài đăng mới(${normal_quantity ? normal_quantity : 0})`}
//                 </h5>
//                 <Divider orientation="left" >Nội dung bài đăng</Divider>
//                 <div className="announcements-create-content">
//                     <InputTitle
//                         type={TYPE.INPUT}
//                         title={"Tiêu đề"}
//                         required={true}
//                         widthLabel="150px"
//                     >
//                         <TextArea
//                             style={{ width: '100%' }}
//                             maxLength={400}
//                             placeholder="ex: Tuyển nhân viên bán hàng (tối đa 400 kí tự)"
//                             value={body.jobTitle}
//                             onChange={
//                                 (event: any) => {
//                                     body.jobTitle = event.target.value;
//                                     this.setState({ body });
//                                 }
//                             }
//                         />
//                     </InputTitle>
//                     <InputTitle
//                         title="Nội dung bài đăng"
//                         widthLabel="150px"
//                         required={true}
//                         widthComponent="400px"
//                     >
//                         <TextArea
//                             rows={5}
//                             style={{ width: '100%' }}
//                             maxLength={10000}
//                             placeholder="ex: Yêu cầu: giao tiếp tiếng Anh tốt (tối đa 10000 kí tự)"
//                             value={body.description}
//                             onChange={
//                                 (event: any) => {
//                                     body.description = event.target.value;
//                                     this.setState({ body });
//                                 }
//                             }
//                         />
//                     </InputTitle>
//                     <p className='a_c'>
//                         <NotUpdate children={
//                             <label> Hiện tại: <span style={{ color }}> {body.description ? body.description.length : 0}</span> kí tự</label>}
//                         />
//                     </p>

//                     <InputTitle
//                         title="Thời gian hết hạn"
//                         required={true}
//                         type="SWITCH"
//                         widthLabel="150px"
//                     >
//                         <DatePicker
//                             format={"DD/MM/YYYY"}
//                             style={{ width: '100%' }}
//                             placeholder={'ex: ' + moment().format("DD/MM/YYYY")}
//                             defaultPickerValue={null}
//                             value={body.expirationDate ? moment(body.expirationDate) : null}
//                             onChange={
//                                 (event?: any) => {
//                                     event ?
//                                         body.expirationDate = event.unix() * 1000 :
//                                         body.expirationDate = null;
//                                     this.setState({ body });
//                                 }
//                             }
//                             disabledDate={d => !d || d.isAfter(moment().add(90, 'days')) || d.isSameOrBefore(moment())}
//                         />
//                     </InputTitle>
//                     <InputTitle
//                         title="Chọn công việc"
//                         required={true}
//                         type={TYPE.SELECT}
//                         list_value={list_job_name_options}
//                         value={findIdWithValue(list_job_names, body.jobNameID, "id", "name")}
//                         onChange={
//                             (event: any) => {
//                                 body.jobNameID = event;
//                                 this.setState({ body });
//                             }
//                         }
//                         widthLabel="150px"
//                         widthSelect="100%"
//                         placeholder="ex: Nhân viên văn phòng"
//                     />
//                     <InputTitle
//                         title="Chọn chi nhánh "
//                         required={true}
//                         type={TYPE.SELECT}
//                         list_value={list_em_branches_options}
//                         value={findIdWithValue(list_em_branches, body.employerBranchID, "id", "branchName")}
//                         onChange={
//                             (event: any) => {
//                                 body.employerBranchID = event;
//                                 this.setState({ body });
//                             }
//                         }
//                         widthLabel="150px"
//                         widthSelect="100%"
//                         placeholder="ex: Công ti abc"
//                     />

//                     <InputTitle
//                         title="Yêu cầu khác"
//                         widthLabel="150px"
//                     >
//                         <Select
//                             mode="multiple"
//                             size="default"
//                             placeholder="ex: Giao tiếp, Tiếng Anh"
//                             value={findIdWithValue(list_skills, body.requiredSkillIDs, "id", "name")}
//                             onChange={
//                                 (event: any) => {
//                                     let list_data = findIdWithValue(list_skills, event, "name", "id")
//                                     body.requiredSkillIDs = list_data;
//                                     this.setState({ body })
//                                 }
//                             }
//                             style={{ width: '100%' }}
//                         >
//                             {list_skill_options}
//                         </Select>
//                     </InputTitle>
//                 </div>
//                 <Divider orientation="left" >Chọn loại công việc<Required /></Divider>
//                 <div className="announcements-create-content">
//                     <Tabs
//                         activeKey={body.jobType}
//                         style={{ width: "100%" }}
//                         onChange={(event: string) => {
//                             body.jobType = event;
//                             this.setState({ body });
//                             type_cpn === TYPE.CREATE && this.replaceShift();
//                         }}
//                     >
//                         <TabPane tab="Toàn thời gian" key={TYPE.FULLTIME}>
//                             {body.shifts &&
//                                 body.shifts.length > 0 &&
//                                 body.shifts.map((item: any, index: number) => (
//                                     <div key={index}>
//                                         <ShiftContent
//                                             shift={item}
//                                             type={TYPE.FULLTIME}
//                                             removeButton={false}
//                                             id={item.id}
//                                             onChange={(event) => this.handleBodyShift(event, index)}
//                                         />
//                                     </div>

//                                 ))
//                             }
//                         </TabPane>
//                         <TabPane tab="Bán thời gian" key={TYPE.PARTTIME}>
//                             {body.shifts &&
//                                 body.shifts.length > 0 &&
//                                 body.shifts.map((item: any, index: number) => (
//                                     <div key={index}>
//                                         <ShiftContent
//                                             shift={item}
//                                             index={index}
//                                             type={TYPE.PARTTIME}
//                                             id={item.id}
//                                             removeButton={true}
//                                             removeShift={(index: number) => this.removeShift(index)}
//                                             onChange={(event: IShift) => this.handleBodyShift(event, index)}
//                                         />
//                                     </div>
//                                 ))
//                             }
//                             <Button type="primary" icon="plus" onClick={() => this.addShift()} >Thêm ca</Button>
//                         </TabPane>
//                         <TabPane tab="Thực tập sinh" key={TYPE.INTERNSHIP} >
//                             {body.shifts &&
//                                 body.shifts.length > 0 &&
//                                 body.shifts.map((item: any, index: number) => (
//                                     <div
//                                         key={index}
//                                     >
//                                         < ShiftContent
//                                             shift={item}
//                                             type={TYPE.INTERNSHIP}
//                                             removeButton={false}
//                                             id={item.id}
//                                             onChange={(event) => this.handleBodyShift(event, index)}
//                                         />
//                                     </div>

//                                 ))
//                             }
//                         </TabPane>
//                     </Tabs>
//                     <div>
//                         <NotUpdate msg={`(Lưu ý: Ngày thời gian bắt đầu phải lớn hơn thời gian kết thúc, số nhân viên ứng tuyển tối thiểu là 1)`} />
//                     </div>
//                 </div>
//                 {

//                     (job_announcement_detail.acceptedApplied === 0 &&
//                         job_announcement_detail.pendingApplied === 0 &&
//                         job_announcement_detail.rejectedApplied === 0) ||
//                         (type_cpn !== TYPE.FIX) ?
//                         <div className="Announcements-create-content">
//                             <Button
//                                 type="primary"
//                                 icon={loading ? 'loading' : "check"}
//                                 style={{
//                                     margin: "10px 10px",
//                                     float: "right"
//                                 }}
//                                 onClick={() => this.createRequest()}
//                             >
//                                 {ct_btn_nt}
//                             </Button>
//                             <Button
//                                 type="danger"
//                                 icon={'close'}
//                                 style={{
//                                     margin: "10px 10px",
//                                     float: "right"
//                                 }}
//                                 onClick={() => { this.props.history.push('/v1/admin/jobs/job-announcements/list') }}
//                             >
//                                 {ct_btn_ex}
//                             </Button>
//                         </div> : ""
//                 }
//             </div >
//         )
//     };
// };

// const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
//     getJobAnnouncementDetail: (id) => dispatch({ type: REDUX_SAGA.JOB_ANNOUNCEMENT_DETAIL.GET_JOB_ANNOUNCEMENT_DETAIL, id }),
//     getPendingJobDetail: (id) => dispatch({ type: REDUX_SAGA.PENDING_JOB_DETAIL.GET_PENDING_JOB_DETAIL, id }),
//     getListEmBranches: () => dispatch({ type: REDUX_SAGA.EM_BRANCHES.GET_EM_BRANCHES }),
// });

// const mapStateToProps = (state: IAppState, ownProps: any) => ({
//     list_job_names: state.JobNames.items,
//     job_announcement_detail: state.JobAnnouncementDetail,
//     pending_job_detail: state.PendingJobDetail,
//     list_skills: state.Skills.items,
//     list_em_branches: state.EmBranches.items,
//     normal_quantity: state.JobService.nomalQuantity
// });

// type StateProps = ReturnType<typeof mapStateToProps>;
// type DispatchProps = typeof mapDispatchToProps;

// export default connect(mapStateToProps, mapDispatchToProps)(JobAnnouncementsCreate)