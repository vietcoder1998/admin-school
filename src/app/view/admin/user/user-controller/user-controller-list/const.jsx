import React from "react";

export const columns = [
  {
    title: "#",
    width: 50,
    dataIndex: "index",
    key: "index",
    className: "action",
    fixed: "left",
  },
  {
    title: "Tên tài khoản",
    dataIndex: "username",
    className: "action",
    key: "username",
    width: 200,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 200,
  },
  {
    title: "Trạng thái cấm",
    dataIndex: "banned",
    className: "action",
    key: "banned",
    width: 100,
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdDate",
    className: "action",
    key: "createdDate",
    width: 100,
  },
  {
    title: "Đăng nhập cuối",
    dataIndex: "lastActive",
    className: "action",
    key: "lastActive",
    width: 100,
  },
  {
    title: "Thao tác",
    key: "operation",
    fixed: "right",
    className: "action",
    width: 100,
    render: () => this.EditToolAction(),
  },
];
