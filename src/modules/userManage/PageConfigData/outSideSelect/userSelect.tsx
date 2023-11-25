/*
 * @Date: 2023-09-15 10:43:37
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-24 20:28:34
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/PageConfigData/outSideSelect/userSelect.tsx
 */
import {
    gridCellMaker,
    gridSizeMaker,
    cardComponentType,
    cardOnChangeType,
    gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
    changeVisible,
    changeCardSize,
    changeCardPosition,
    changeCardProperties,
    refreshDesktop,
    upToTopDataChange,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { post, get } from "@/utils/api/requests";
import {
    SearchCellStorage,
    tableCellTemplateMaker,
    searchCell,
    DateCell,
    actionCell,
    gridDesktopCell,
    remoteDictSelectSearchCell,
    showCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import { btnActionTemplate, drawerProps, formInputType, gridDesktopPropsTemplate, showType, stringAnyObj, tableCellTemplate } from "@/modules/userManage/types";
import { ElMessage } from "element-plus";
import { btnMaker, repBackMessageShow, openDrawerFormEasy, allProcessDobuleCheckBtnMaker, closeBtn, dobuleCheckBtnMaker, roleBtnMaker } from "../../component/searchTable/drawerForm";
import { departmentPropsBtnList, departmentDrawerprops, 新增部门, department } from '../departmenet';
import { userInfoCard } from "../user/userInfo";
import { userFieldStorage } from "../user/userValueManage";
import { 选择部门_多选 } from "../main";
import { setSize } from '@/components/basicComponents/grid/module/util';
import { reactive, ref } from "vue";


export const userTableCellStorage = new SearchCellStorage([
    tableCellTemplateMaker("姓名", "name"),
    tableCellTemplateMaker("性别", "gender", remoteDictSelectSearchCell('lcdp_user_gender')),
    tableCellTemplateMaker("头像", "icon", searchCell(formInputType.uploadImage)),
    tableCellTemplateMaker("简介", "description"),
    tableCellTemplateMaker("管理员", "adminFlag"),
    tableCellTemplateMaker("邮箱", "mail"),
    tableCellTemplateMaker("手机号", "mobile"),
    tableCellTemplateMaker(
        "生日",
        "birthday",
        DateCell({
            width: "200px",
        })
    ),
    tableCellTemplateMaker("身份证信息", "idCard"),
    tableCellTemplateMaker("浙政钉code", "zzdCode"),
    tableCellTemplateMaker("id", "id"),
    tableCellTemplateMaker("创建者id", "createUserId"),
    tableCellTemplateMaker(
        "创建时间",
        "createTime",
        DateCell({
            width: "200px",
        })
    ),
    tableCellTemplateMaker("修改者id", "updateUserId"),
    tableCellTemplateMaker(
        "最近修改时间",
        "updateTime",
        DateCell({
            width: "200px",
        })
    ),
    选择部门_多选,
    tableCellTemplateMaker('部门信息', 'unitNames', showCell(showType.func, {
        showFunc: (d, k, i) => i ? d['wholeUnitNames'] : d[k]
    })),
    tableCellTemplateMaker('职务', 'jobCode'),
    tableCellTemplateMaker("排序", "orderNumber"),
]);
// 搜索内容
const searchTable = new SearchCellStorage([
    ...userTableCellStorage.getByKeyArr(["name", "mobile"]),
]);


export interface userSelectDesktopDataFuncTemplate extends stringAnyObj {
    selectPropsList?: {
        label: string,
        key: string,
        color: string,
    }[],
    selectData?: stringAnyObj,
    selectedKey?: {
        department: string,
        user: string,
    },
    dataChangeFunc?: (that, data) => Promise<any> | any | void,
}

/**
 * @name: mainDesktop
 * @description: 基于部门的用户管理
 * @authors: CZH
 * @Date: 2022-12-14 11:14:32
 */
export const userSelect = async (data: userSelectDesktopDataFuncTemplate = {}) => {
    const 选择部门 = btnMaker('选择部门', btnActionTemplate.Function, {
        icon: 'Select',
        elType: 'primary',
        function: async (that, da) => {
            let arr = selectData.value[data.selectedKey.department]
            if (arr.map(x => x.value).indexOf(da.id) > -1) {
                ElMessage.warning('已选择该部门')
            } else {
                selectData.value[data.selectedKey.department].push({
                    ...da,
                    label: da.name,
                    value: da.id,
                })
            }
            upToTopDataChange(that, selectData.value)
        }
    })
    const 选择用户 = btnMaker('选择用户', btnActionTemplate.Function, {
        icon: "Select",
        elType: 'primary',
        function: async (that, da) => {
            let arr = selectData.value[data.selectedKey.user]
            if (arr.map(x => x.value).indexOf(da.id) > -1) {
                ElMessage.warning('已选择该用户')
            } else {
                selectData.value[data.selectedKey.user].push({
                    ...da,
                    label: da.name,
                    value: da.id,
                })
            }
            upToTopDataChange(that, selectData.value)
        }
    })
    let selectData = ref({} as { [key: string]: stringAnyObj[] })
    selectData.value = data.selectData
    return [
        gridCellMaker(
            "userSelect",
            "人员选择 - 展示组件",
            {},
            {
                name: "userManage_userSelect",
                type: cardComponentType.componentList,
            },
            {
                props: {
                    selectPropsList: data['selectPropsList'] ? data['selectPropsList'] : [{
                        label: '用户',
                        key: "user",
                        color: 'primary'
                    }],
                    selectData: data['selectData'] ? data['selectData'] : {
                        user: [{
                            value: 1,
                            label: '用户1 '
                        }],
                    },
                    deleteFunc: async (that, key, da) => {
                        selectData.value[key].splice(selectData.value[key].findIndex(d => d.value == da.value), 1)
                    }
                },
            }).setSize(12, 2),
        gridCellMaker(
            "MenuList",
            "菜单列表分层获取",
            {},
            {
                name: "userManage_menuListRemote",
                type: cardComponentType.componentList,
            },
            {
                props: {
                    treeDataFuncByLevel: async (node, resolve, searchData) => {
                        const id = node.data ? node.data.id : ''
                        let res = await post("/web/usc/unit/list", {
                            parentId: id,
                        });
                        let data = res.data.map((x) => {
                            return {
                                ...x,
                                isLeaf: !x.hasLeaf,
                                value: x.id,
                                label: `${x.name}(${x.memberNumber}人)`
                            };
                        });
                        resolve(data);
                    },
                    searchFuncByName: async (searchData) => {
                        let res = await post("/web/usc/unit/list/user/unit", {
                            name: searchData,
                        });
                        let units = res.data.units || [];
                        let users = res.data.users || []
                        units = units.map(x => {
                            return {
                                ...x,
                                isLeaf: !x.hasLeaf,
                                value: x.id,
                                label: x.name + (x.memberNumber > 0 ? '(' + x.memberNumber + ')' : '')
                            };
                        })
                        users = users.map(x => {
                            return {
                                ...x,
                                isLeaf: !x.hasLeaf,
                                value: x.id,
                                label: x.name
                            };
                        })
                        let back = []
                        if (units && units.length > 0) {
                            back.push({
                                label: '部门',
                                icon: 'OfficeBuilding',
                                data: units,
                                detail: [],
                                btn: btnMaker('', btnActionTemplate.Function, {
                                    icon: 'More',
                                    function: async (that, data) => {
                                        departmentDrawerprops(that, data, { btnList: [] })
                                    }
                                })
                            })
                        }
                        if (users && users.length > 0) {
                            back.push(选择用户)
                        }
                        return back
                    },
                    clickItemDetailFunc: (that, data) => {
                        departmentDrawerprops(that, data, { btnList: [选择部门] })
                    },
                    outputKey: "unit",
                    defaultProps: {
                        label: "label",
                        children: "children",
                        isLeaf: "isLeaf",
                    },
                },
                isSettingTool: false,
            }
        )
            .setPosition(0, 2)
            .setSize(3, 6),
        gridCellMaker(
            "searchTable",
            "搜索结果列表",
            {},
            {
                name: "userManage_searchTable",
                type: cardComponentType.componentList,
            },
            {
                props: {
                    searchItemTemplate: searchTable.getByKey('name'),
                    showItemTemplate: [
                        ...userTableCellStorage.getByLabelArr([
                            '姓名', '部门信息',
                        ]),
                        tableCellTemplateMaker('操作', 'asd', actionCell([选择用户
                        ], {
                            fixed: 'right',
                            noDetail: true
                        }))
                    ],
                    searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
                        if (!that.baseData?.unit?.id) {
                            return []
                        }
                        let res = await post("/web/usc/user/page/unit", {
                            ...query,
                            unitId: that.baseData?.unit?.id,
                        });
                        if (!res.data["list"]) res.data["list"] = [];
                        if (!res.data["data"]) res.data["data"] = res.data["list"];
                        return res.data;
                    },
                    autoSearch: false,
                    searchKeyWithBaseData: ["unit"],
                    defaultQuery: {
                        searchChildrenFlag: 'false'
                    },
                },
                isSettingTool: false,
            }
        )
            .setPosition(3, 2)
            .setSize(9, 6),

    ] as gridCellTemplate[];
};