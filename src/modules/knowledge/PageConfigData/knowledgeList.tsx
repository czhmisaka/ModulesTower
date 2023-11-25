/*
 * @Date: 2023-02-08 16:28:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-07 08:56:45
 * @FilePath: /lcdp_fe_setup/src/modules/knowledge/PageConfigData/knowledgeList.tsx
 */

import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { post, get, post_formData } from "@/utils/api/requests";
import * as Icons from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";
import {
  btnMaker,
  repBackMessageShow,
} from "@/modules/userManage/component/searchTable/drawerForm";
import { getAction } from "@/router/util";
import { initRouter } from "@/router/utils";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  showCell,
  searchCell,
  actionCell,
  staticSelectCell,
  DateRangeCell,
  richTextCell,
  customComponentMakerForSearchCell,
  gridDesktopCell
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  showType,
  formInputType,
  stringAnyObj,
  btnActionTemplate,
  drawerProps,
  gridDesktopPropsTemplate
} from "@/modules/userManage/types";
import { ElMessage, ElMessageBox, ElPopover } from "element-plus";
import { refreshDesktop } from "@/components/basicComponents/grid/module/cardApi";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useModuleHook } from "@/store/modules/module";
// import selectAlbum from "../component/albumDialog/selectAlbum.vue"
import {
  openDrawerFormEasy,
  dobuleCheckBtnMaker,
} from "@/modules/userManage/component/searchTable/drawerForm";
import { dictDataManage } from "@/modules/userManage/PageConfigData/dictDataManage";
import { dictDataManageBtnList } from "@/modules/userManage/PageConfigData/dictDataManage";
import { defineComponent, h } from "vue";
import { changeTimeStamp } from "@/utils/api/time/timeStamp";
import { getPreUrl } from "@/utils/api/requests";
let res = {} as stringAnyObj;
let regionMap = {} as stringAnyObj;
let initRegionList_loading = false;
const initChildren = (data) => {
  data?.map((x) => {
    // if (x.fullName == "") x.fullName = x.name;
    if (x.fullName && x.name) {
      regionMap[x.code] = x.fullName;
    }
    if (x.children) {
      initChildren(x.children);
    }
  });
};
const initRegionList = async () => {
  if (!initRegionList_loading) {
    initRegionList_loading = true;
    res = await post("/web/knowledge/album/tree", {});
    res.data.map((x) => {
      if (x.fullName == "") x.fullName = x.name;
      if (x.fullName && x.name) {
        regionMap[x.code] = x.fullName;
      }
      if (x.children) {
        initChildren(x.children);
      }
    });
  } else {
    await new Promise((r, j) => {
      let key = setInterval(() => {
        if (res && res.data) {
          clearInterval(key);
          r(res);
        }
      }, 100);
    });
  }
};
let labelRes = {} as stringAnyObj;
let labelregionMap = {} as stringAnyObj;
let labelinitRegionList_loading = false;
const initLabelList = async () => {
  if (!labelinitRegionList_loading) {
    labelinitRegionList_loading = true;
    labelRes = await post("/web/knowledge/label/page", {});
    labelRes.data.list.map((x) => {
      if (x.fullName == "") x.fullName = x.name;
      if (x.fullName && x.name) {
        labelregionMap[x.code] = x.fullName;
      }
    });
  } else {
    await new Promise((r, j) => {
      let key = setInterval(() => {
        if (res && res.data) {
          clearInterval(key);
          r(res);
        }
      }, 100);
    });
  }
}
// export const 选择专辑 = tableCellTemplateMaker("", "selectAlbum", {
//   ...customComponentMakerForSearchCell({
//     isLocalComponent: true,
//     component: selectAlbum,
//   }),
//   ...showCell(showType.funcComponent, {
//     style: {
//       paddingLeft: "4px",
//       display: "inline-block",
//       width: "100%",
//     },
//     showFunc: (data, key) => {
//       // if (data[key] && data[key][0] == "{")
//       //   return useRenderIcon(JSON.parse(data[key]));
//       // else if (data[key]) return useRenderIcon(data[key]);
//     },
//   }),
// });
export const 选择专辑页面 = async () =>{
  return [
    gridCellMaker('selectAlbum','选择专辑',{},{
      name: "knowledge_selectAlbum",
      type: cardComponentType.componentList,
    },{
      props:{
        selectAlbum: async (albumObj: stringAnyObj,that) => {
          console.log(albumObj,'kkkk')
          let drawerProps = {
            title: "新增文本知识",
            queryItemTemplate: 知识列表配置数据列.getByKeyArr(["albumName","name","labelIds", "description", "content",]),
            btnList: [tijiao(that)],
            schema: {
              required: [ "name","albumId", "content"],
            },
            data: {...albumObj,type: 2},
          };
          openDrawerFormEasy(that, drawerProps);
        },
      }
    }).setSize(18, 15)
      .setPosition(0, 0),
  ]
}
export const 选择文件专辑页面 = async () =>{
  return [
    gridCellMaker('selectAlbum','选择专辑',{},{
      name: "knowledge_selectAlbum",
      type: cardComponentType.componentList,
    },{
      props:{
        selectAlbum: async (albumObj: stringAnyObj,that) => {
          let drawerProps = {
            title: "新增文件知识",
            queryItemTemplate: 知识列表配置数据列.getByKeyArr(["name","albumName", "content", "files"]),
            btnList: [tijiao(that)],
            schema: {
              required: ["name", "albumId", "content"],
            },
            data: {type:1,...albumObj},
          };
          openDrawerFormEasy(that, drawerProps);
        },
      }
    }).setSize(18, 15)
      .setPosition(0, 0),
  ]
}
// 选择文件专辑
export const 选择专辑 = tableCellTemplateMaker("", "selectAlbum", gridDesktopCell(
      async (that) => {
        return {
          gridColNum: 18,
          cusStyle: {
            wholeScreen: true,
            maxRows: 15,
            margin: 3,
          },
          componentLists: getAction().getAllComponents(),
          desktopData: async () =>{
            return [
              gridCellMaker('selectAlbum','选择专辑',{},{
                name: "knowledge_selectAlbum",
                type: cardComponentType.componentList,
              },{
                props:{
                  selectAlbum: async (albumObj: stringAnyObj,that2) => {
                    console.log(that,)
                    let drawerProps = {
                      title: "新增文本知识",
                      queryItemTemplate: 知识列表配置数据列.getByKeyArr(["name","albumName","labelIds", "description", "content",]),
                      btnList: [tijiao(that)],
                      schema: {
                        required: [ "name","albumId", "content"],
                      },
                      data: {...albumObj,type: 2},
                    };
                    openDrawerFormEasy(that2, drawerProps);
                  },
                }
              }).setSize(18, 15)
                .setPosition(0, 0),
            ]
          },
        } as gridDesktopPropsTemplate;
      },
      {
        style: {
          height: "calc(100vh - 280px)",
          maxHeight: "calc(100vh - 280px)",
          marginLeft: "-120px",
          width: "calc(100% + 120px)",
        },
      }
    ));
    export const 选择文件专辑 = tableCellTemplateMaker("", "selectFileAlbum", gridDesktopCell(
      async (that) => {
        return {
          gridColNum: 18,
          cusStyle: {
            wholeScreen: true,
            maxRows: 15,
            margin: 3,
          },
          componentLists: getAction().getAllComponents(),
          desktopData: 选择文件专辑页面,
        } as gridDesktopPropsTemplate;
      },
      {
        style: {
          height: "calc(100vh - 280px)",
          maxHeight: "calc(100vh - 280px)",
          marginLeft: "-120px",
          width: "calc(100% + 120px)",
        },
      }
    ));
// 字典页面配置数据
export const 知识列表配置数据列 = new SearchCellStorage([
  tableCellTemplateMaker("知识名称", "keyword"),
  tableCellTemplateMaker("知识专辑", "albumName",
  searchCell(formInputType.input, {
    propertiesOption: {
      "ui:options": {
        disabled: true,
      },
    },
  })
  ),
  tableCellTemplateMaker("知识名称", "name"),
  tableCellTemplateMaker("上传附件", "fileNum",{
    ...showCell(showType.funcComponent, {
      showFunc: (row, key) => {
        return defineComponent({
          setup(props, context) {
            return () => <div> 
                {row[key]?row[key]+'个':''}
              </div>
          },
        });
      },
    }),
  }),
  tableCellTemplateMaker(
    "附件",
    "files",
    searchCell(formInputType.uploadFileList,{
      action: getPreUrl() + "/web/knowledge/add",
      limit:8
    })
  ),
  选择专辑,
  选择文件专辑,
  tableCellTemplateMaker("专辑", "albumId", {
    ...searchCell(formInputType.treeSelect, {
      funcInputOptionsLoader: async (that) => {
        if (res && res.data) {
        } else {
          await initRegionList();
        }
        const dealChildren = (list) => {
          return list.map((x) => {
            return {
              ...x,
              id: x.id,
              children:
                x.children && x.children.length > 0
                  ? dealChildren(x.children)
                  : null,
            };
          });
        };
        let resData = dealChildren(res.data);
        return {
          data: resData,
          checkStrictly: true,
          showCheckbox: false,
          multiple: false,
          collapseTags: false,
          defaultExpandAll: false,
          placeholder: "请选择关联专辑",
          nodeKey: "id",
          defaultExpandedKeys: ["1"],
          autoExpandParent: true,
          clearable: true,
          type: 'number',
          props: {
            value: "id",
            label: "name",
            children: "children",
          },
        };
      }
    }),
    ...showCell(showType.funcComponent, {
      showFunc: (row, key) => {
        return defineComponent({
          setup(props, context) {
            const albumName = row.albumName
            return () => <div>
              {albumName}
            </div>
          }
        })
      }
    })
  }),
  tableCellTemplateMaker("标签", "labelIds", {
    ...searchCell(formInputType.treeSelect, {
      propertiesOption: {
        "err:required": "请选择标签",
      },
      funcInputOptionsLoader: async (that) => {
        if (labelRes && labelRes.data) {
        } else {
          await initLabelList();
        }
        let resData = labelRes.data.list.map((x) => {
          x["value"] = x.id;
          return x
        });
        return {
          data: resData,
          clearable: true,
        };
      },
    }),
    ...showCell(showType.funcComponent, {
      width: '200px',
      style: {
        overflow: 'none'
      },
      showFunc: (row, key) => {
        return defineComponent({
          setup(props, context) {
            let labelList = row['labelList']
            if (!row.labelList) {
              labelList = []
            }
            let trueLabelList = []
            if (labelList.length > 5) {
              trueLabelList = labelList.slice(0, 5)
            } else {
              trueLabelList = labelList
            }
            const numberList = trueLabelList.map((item, index) => (
              <div key={index} 
              style={{
                display: 'inline-block',
              }}
              ><span >{index!=0?'、':''}</span>{item.name}</div>
            ));
            const allNumberList = labelList.map((item, index) => (
              <div key={index} 
              style={{
                display: 'inline-block',
              }}
              ><span >{index!=0?'、':''}</span>{item.name}</div>
            ));
            return () =>
              <ElPopover trigger='hover'  width="auto" v-slots={{
                reference: () => <div style={{
                  display: "inline-block",
                  width: 'auto',
                }}
                > {numberList}</div>,
                default: () => <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: 'flex-start',
                  maxWidth: '500px',
                }}
                > {allNumberList}</div>
              }}>
              </ElPopover>
          },
        });
      },
    }),
  }),
  tableCellTemplateMaker("关联知识", "indexKnowledgeId", searchCell(formInputType.searchList, {
    inputOptions: {
      multiple: false,
      type: 'number',
      remoteMethod: async (query) => {
        let res = await post('/web/knowledge/page', { name: query, pageSize: 30, pageNumber: 1 })
        return res.data.list.map(x => {
          return {
            value: x.id,
            label: x.name
          }
        })
      }
    }
  })),
  tableCellTemplateMaker("关联关系", "indexName"),
  tableCellTemplateMaker("格式", "fileType"),
  tableCellTemplateMaker(
    "状态",
    "status",{
      ...showCell(showType.funcComponent,{showFunc:(row,key)=>{
          const status = row.status
          const statusArray = ['草稿','已下架','已发布']
          const status0 = (<div style='background:rgba(59, 128, 253, 0.15);color:#3B80FD;border-radius: 4px;display:flex;align-items:center;width:82px;height: 32px;justify-content:center'>
            <span style="display:inline-block;width: 4px;height: 4px;border-radius:50%;background:#3B80FD;margin-right: 6px;"></span>
            {statusArray[status]}
          </div>)
          const status1 = (<div style='background:rgba(32, 217, 124, 0.1);color:#20D97C;border-radius: 4px;display:flex;align-items:center;width:82px;height: 32px;justify-content:center'>
            <span style="display:inline-block;width: 4px;height: 4px;border-radius:50%;background:#20D97C;margin-right: 6px;"></span>
            {statusArray[status]}
          </div>)
          const status2 = (<div style='background:rgba(255, 135, 6, 0.149);color:#FF8706;border-radius: 4px;display:flex;align-items:center;width:82px;height: 32px;justify-content:center'>
            <span style="display:inline-block;width: 4px;height: 4px;border-radius:50%;background:#FF8706;margin-right: 6px;"></span>
            {statusArray[status]}
          </div>)
          return defineComponent({
            setup(props, context) {
              return () => <div >
                {status==0?status0:(status==1?status1:status2)}
              </div>
            }
          })
      }})
    }
  ),
  tableCellTemplateMaker("更新时间", "updateTime", DateRangeCell(''),),

  tableCellTemplateMaker("描述", "description", searchCell(formInputType.textarea)),
  tableCellTemplateMaker("内容", "content", richTextCell()),
]);
const tijiao = (ee)=>{
  return btnMaker(
  "提交",
  btnActionTemplate.Function,
  {
    elType: "primary",
    function: async (that, data) => {
      console.log(data, 'addData')
      let url;
      const params = {
        albumId: data.albumId,
        description: data.description,
        fileCodes: '',
        labelIds: data.labelIds,
        name: data.name,
        content: data.content,
        id: "",
        type: data.type,
        indexKnowledgeId: data.indexKnowledgeId,
        indexName: data.indexName
      };
      if (!data.name) {
        ElMessage({
          type: "info",
          message: "请填写知识名称",
        });
        return;
      }
      if (!data.albumId) {
        ElMessage({
          type: "info",
          message: "请选择专辑",
        });
        return;
      }
      if (data.type == 2) {
        if (data.content == "<p> </p>") {
          ElMessage({
            type: "info",
            message: "请输入内容",
          });
          return;
        }
      }
      if(data.type==1&&Array.isArray(data.files)){
        
      }
      let res;
      if (data.id) {
        params.id = data.id;
        params.fileCodes = data.file.code,
          url = "/web/knowledge/update";
        res = await post(url, params);
      } else {
        params.type = 2;
        delete params.id
        delete params.fileCodes
        url = "/web/knowledge/add";
        res = await post_formData(url, params)
      }
      repBackMessageShow(that, res);
      console.log(ee,'kkk')
      ee.close?ee.close():""
    },
  }
)
}

const 提交标签修改或者新增的按钮 = btnMaker(
  "提交",
  btnActionTemplate.Function,
  {
    elType: "primary",
    function: async (that, data) => {
      console.log(data, 'addData')
      let url;
      const params = {
        albumId: data.albumId,
        description: data.description,
        fileCodes: '',
        labelIds: data.labelIds,
        name: data.name,
        content: data.content,
        id: "",
        type: data.type,
        indexKnowledgeId: data.indexKnowledgeId,
        indexName: data.indexName
      };
      if (!data.name) {
        ElMessage({
          type: "info",
          message: "请填写知识名称",
        });
        return;
      }
      if (!data.albumId) {
        ElMessage({
          type: "info",
          message: "请选择专辑",
        });
        return;
      }
      if (data.type == 2) {
        if (data.content == "<p> </p>") {
          ElMessage({
            type: "info",
            message: "请输入内容",
          });
          return;
        }
      }
      let res;
      if (data.id) {
        params.id = data.id;
        params.fileCodes = data.file.code,
          url = "/web/knowledge/update";
        res = await post(url, params);
      } else {
        params.type = 2;
        delete params.id
        delete params.fileCodes
        url = "/web/knowledge/add";
        res = await post_formData(url, params)
      }
      repBackMessageShow(that, res);
    },
  }
);
const 重新上传按钮 = btnMaker("重新上传", btnActionTemplate.UploadFunction, {
  elType: "primary",
  icon: "Plus",
  uploadInfo: {
    action: '/web/knowledge/reUploadV2',
    data: {
      type: 1,
    },
    limit: 1,
  },
  function: (that, data) => {
    if (data.code == 200) {
      // ElMessage.success("上传成功")
      refreshDesktop(that)
    } else if (data.message == '当前文件格式不支持') {
      ElMessage.info("当前文件格式不支持")
    } else {
      ElMessage.error("上传失败")
    }
    repBackMessageShow(that, data);
  },

})
const 新增文本知识 = btnMaker(
  "新增文本知识",
  btnActionTemplate.HoverFunction,
  {
    elType: "primary",
    icon: "Plus",
    hoverInfo: {
      hoverText:'创建知识',
      hoverIcon: 'plus',
      hoverList: [
        {
        label: '上传文件',
        iconType: 'elicon',
        src: 'Download',
        type: 'upload'
      },{
        label: '在线文档',
        iconType: 'elicon',
        src: 'Edit',
        type: 'edit'
      }]
    },
    function:async(data,that)=>{
      let drawerProps = {
        title: "选择专辑",
        queryItemTemplate: 知识列表配置数据列.getByKeyArr(["selectAlbum"]),
        btnList: [],
        data:{type:2} ,
      };
      openDrawerFormEasy(that, drawerProps);
    }
  },
  ["/web/knowledge/label/addV2"],
  "新增文本知识"
);

const 新增文件知识 = btnMaker(
  "新增文件知识",
  btnActionTemplate.Function,
  {
    elType: "primary",
    icon: "Plus",
    // uploadInfo: {
    //   action: '/web/knowledge/add',
    //   data: {
    //     type: 1
    //   },
    //   limit: 1,
    // },
    function: (that, data) => {
      let drawerProps = {
        title: "选择专辑",
        queryItemTemplate: 知识列表配置数据列.getByKeyArr(["selectFileAlbum"]),
        btnList: [],
        // schema: {
          
        // }
        data:{type:1} ,
      };
      openDrawerFormEasy(that, drawerProps);
    },
  },
  ["/web/knowledge/add"],
  "新增文件知识"
);


const 编辑知识按钮 = btnMaker(
  "编辑",
  btnActionTemplate.Function,
  {
    elType: "primary",
    isDisable(data) {
      return data.status == 2;
    },
    function: async (that, data) => {
      
      let router = await initRouter(true);
      router.push({
        path:'/unlineEdit',
        query: {
          id: data.id,
          type:data.type,
        }
      })
      // openDrawerFormEasy(that, drawerProps);
    },
  },
  ["/web/knowledge/label/update"],
  "编辑知识按钮"
);

const 删除知识大脑按钮 = btnMaker(
  "删除",
  btnActionTemplate.Function,
  {
    elType: "danger",
    isDisable(data) {
      return data.status == 2;
    },
    function: async (that, data) => {
      try {
        if ((await dobuleCheckBtnMaker("删除知识" + data.name, "")) == true) {
          let res = await post("/web/knowledge/delete/" + data.id, {});
          repBackMessageShow(that, res);
        }
      } catch {
        return true;
      }
    },
  },
  ["/web/knowledge/delete"],
  "删除知识按钮"
);
const 上架知识按钮 = btnMaker(
  "上架",
  btnActionTemplate.Function,
  {
    btnColor: '#20D97C',
    isShow: (data) => {
      return data.status != 2;
    },
    function: async (that, data) => {
      if (await dobuleCheckBtnMaker("上架知识" + data.name, '上架').catch((x) => false)) {
        let res = await post("/web/knowledge/operate", {
          id: data.id,
          isOnline: true,
        });
        repBackMessageShow(that, res);
      }
    },
  },
  ["/web/knowBase/delete"],
  "删除知识大脑按钮"
);
const 预览知识 = btnMaker("预览", btnActionTemplate.Function, {
  function: async (that, data) => {
    const file = data.file;
    let router = await initRouter(true);
      router.push({
        path:'/onlinePreview',
        query: {
          id: data.id,
          type:data.type,
          code: file.code,
          fileType:file.fileType
        }
      })
    
  }
})
const 下架知识按钮 = btnMaker("下架", btnActionTemplate.Function, {
  btnColor: '#FF8706',
  isShow: (data) => {
    return data.status == 2;
  },
  function: async (that, data) => {
    if (
      await dobuleCheckBtnMaker("下架" + data.name, data.name).catch((x) => false)
    ) {
      let res = await post("/web/knowledge//operate", {
        id: data.id,
        isOnline: false,
      });
      repBackMessageShow(that, res);
    }
  },
});

// 添加操作栏目
知识列表配置数据列.push(
  tableCellTemplateMaker(
    "操作",
    "actionaction",
    actionCell([预览知识, 编辑知识按钮, 下架知识按钮, 上架知识按钮, 删除知识大脑按钮], {
      fixed: "right",
      noDetail: true
    })
  )
);
// 指定搜索项
export const SearchTemplate = 知识列表配置数据列.getByKeyArr(["keyword", "albumId", "labelIds", "status", "updateTime"]);
// 指定列表展示项
export const ShowTemplate = 知识列表配置数据列.getByKeyArr(["name", "fileType", "albumId", "labelIds", "status", "updateTime", "actionaction"]);

// 列表可用按钮
const btnList = [新增文本知识];

// 字典管理页面可用按钮配置表
export const dictManageBtnList = [编辑知识按钮, 删除知识大脑按钮];


export const knowledgeList = async () => {
  return [
    gridCellMaker(
      "knowledgeList",
      "知识库列表",
      {},
      {
        name: "knowledge_knowledgeList",
        type: cardComponentType.componentList,
      },
      {
        props: {},
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
  // await initRegionList()
  // await initLabelList()
  // return [
  //   gridCellMaker(
  //     "searchTable",
  //     "搜索结果列表",
  //     {},
  //     {
  //       name: "userManage_searchTable",
  //       type: cardComponentType.componentList,
  //     },
  //     {
  //       props: {
  //         searchItemTemplate: SearchTemplate,//可以注释
  //         showItemTemplate: ShowTemplate,
  //         searchFunc: async (query: stringAnyObj) => {
  //           if (!query) query = {};
  //           const searchInfo = { ...query }
  //           if (searchInfo.updateTime) {
  //             searchInfo.startTime = searchInfo.updateTime[0]
  //             searchInfo.endTime = searchInfo.updateTime[1] + 24 * 3600 * 1000 - 1;
  //             delete searchInfo.updateTime
  //           }
  //           let res = await post("/web/knowledge/page", {
  //             ...searchInfo,
  //           });
  //           if (res.data.list) {
  //             res.data.list.forEach((item) => {
  //               const labelIds = [];
  //               if (item.labelList) {
  //                 item.labelList.forEach(list => {
  //                   labelIds.push(list.id)
  //                 })
  //               }
  //               item.labelIds = labelIds;
  //             });
  //           }
  //           return res.data;
  //         },
  //         defaultQuery: {
  //           showLink: null,
  //         },
  //         btnList,//去掉
  //         autoSearch: false,//改为true
  //         screenStatus: true
  //       },
  //       isSettingTool: false,
  //     }

  //   ).setPosition(0, 0)
  //     .setSize(12, 8),
  // ] as gridCellTemplate[]
};
