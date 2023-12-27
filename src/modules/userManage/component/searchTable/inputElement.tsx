/*
 * @Date: 2023-02-06 08:57:34
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-13 16:52:22
 */
import { deepMerge } from "@/components/basicComponents/grid/module/cardApi";
import {
  ElOption,
  ElScrollbar,
  ElSelect,
  ElTreeSelect,
  ElDivider,
  ElButton,
  ElMessage,
  ElRadioGroup,
  ElRadio
} from "element-plus";
import { defineComponent, h, onMounted, ref, shallowRef, watchEffect } from "vue";
import { inputElementTemplate, formInputType, stringAnyObj, tableCellTemplate } from "../../types";
import editor from "@/components/basicComponents/grid/module/baseToolComponents/editor.vue";
import uploadFileList from "./uploadFileList.vue";
import cascader from "./cascader.vue"

import { getDownLoadRequestHeaders } from "@/utils/api/user/header";
import { ElUpload } from "element-plus";
import { useRemoteDictHook } from "@/store/modules/remoteDict";
import { loadEnv } from "@build/index";
import card from "@/components/basicComponents/grid/module/gridCard/card.vue";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import gridDesktop from "@/components/basicComponents/grid";
import { values } from 'lodash';
import { getPreUrl } from "@/utils/api/requests";
import { componentMaker } from "./inputElementComponent/functionToComponent";
import { propertiesMaker } from './searchTable';
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";


function base(cell: tableCellTemplate) {
  // console.log(cell, 'asd', cell.input)
  return {
    extraOptions: JSON.parse(JSON.stringify(cell.input)),
    title: cell.label,
    description: cell.input.description,
    type: "string",
    "ui:options": {
      disabled: cell.input.disabled,
      clearable: true,
    },
  } as stringAnyObj;
}

export const globalBaseCellDeal = (
  cell: tableCellTemplate,
  cellProperties: stringAnyObj | Promise<stringAnyObj>,
  needTitle: boolean = false
): stringAnyObj | Promise<stringAnyObj> => {
  const globalBaseCell = {
    'err:required': '请填写' + cell.label,
    "ui:options": {
      title: needTitle ? cell.label : "",
      placeholder: "请输入" + cell.label,
      style: {
        width: needTitle ? "360px" : "100%",
        marginBottom: needTitle ? "6px" : '6px'
      },
    },
  };
  return deepMerge(cellProperties, globalBaseCell);
};

let inputElement = {} as {
  [key in formInputType]: inputElementTemplate;
};

inputElement[formInputType.input] = {
  properties: (that, cell) => {
    return {
      ...base(cell),
      type: "string",
      ...cell.input?.inputOptions,
    };
  },
};

inputElement[formInputType.mobile] = {
  properties: (that, cell) => {
    return {
      ...base(cell),
      type: "string",
      minLength: 11,
      maxLength: 11,
      ...cell.input?.inputOptions,
      // pattern
    };
  },
};

inputElement[formInputType.switch] = {
  properties: (that, cell) => {
    return {
      ...base(cell),
      type: "boolean",
      ...cell.input?.inputOptions,
    };
  },
}

inputElement[formInputType.number] = {
  properties: async (that, cell) => {
    return {
      ...base(cell),
      title: cell.label,
      type: "number",
      ...cell.input?.inputOptions,
    };
  },
};

inputElement[formInputType.textarea] = {
  properties: (that, cell) => {
    return {
      ...base(cell),
      title: cell.label,
      type: "string",
      "ui:options": {
        type: "textarea",
        disabled: cell.input.disabled,
      },
      ...cell.input?.inputOptions,
    }
  },
};

inputElement[formInputType.datePicker] = {
  properties: (that, cell) => {
    return {
      ...base(cell),
      type: "number",
      format: "date",
      ...cell.input?.inputOptions,
    };
  },
};

inputElement[formInputType.upload] = {
  properties: (that, cell) => {
    let properties = {
      ...base(cell),
      "ui:widget": "UploadWidget",
      "ui:options": {
        'headers': getDownLoadRequestHeaders(),
        "action": cell.input.action || '/api/web/sys/file/upload',
      },
    }
    let attrs = {
      responseFileUrl: (res) => {
        return (res ? (res.data) : '')
      },
    }
    Object.keys(attrs).map((x) => {
      properties["ui:" + x] = attrs[x];
    })
    return properties
  }
}

inputElement[formInputType.uploadImage] = {
  properties: (that, cell) => {
    let properties = {
      ...base(cell),
      "ui:widget": "UploadWidget",
      "ui:options": {
        'headers': getDownLoadRequestHeaders(),
        "action": cell.input.action || '/api/web/sys/file/upload',
      },
    }
    let attrs = {
      responseFileUrl: (res) => {
        return (res ? (res.data) : '')
      },
    }
    Object.keys(attrs).map((x) => {
      properties["ui:" + x] = attrs[x];
    })
    return properties
  }
}

inputElement[formInputType.datePickerRanger] = {
  properties: (that, cell) => {
    return {
      ...base(cell),

      type: "array",
      format: "date",
      items: {
        type: "number",
      },
    };
  },
};

inputElement[formInputType.checkBox] = {
  properties: (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      "type": "array",
      "uniqueItems": true,
      "items": {
        "type": "string",
        enum: input?.inputOptions.map(x => x.value),
        enumNames: input?.inputOptions.map(x => x.label),
      },
      "ui:widget": "CheckboxesWidget"
    } as stringAnyObj;

    return properties;
  }
}

inputElement[formInputType.radio] = {
  properties: (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      type: "string",
      "ui:widget": defineComponent({
        props: [
          "modelValue"
        ],
        setup(props, context) {
          return () => [
            h(ElRadioGroup,
              {
                ...props,
                onChange: (e) => {
                  context.emit("update:modelValue", e);
                },
              },
              () =>
                input?.inputOptions.map((x) => {
                  return h(ElRadio, {
                    label: x.value,
                    key: x.value
                  }, x.label)
                })
            )
          ]
        }

      })
    } as stringAnyObj;

    return properties;
  },
};

inputElement[formInputType.idCard] = {
  properties: (that, cell) => {
    return {
      ...base(cell),
    };
  },
};

inputElement[formInputType.select] = {
  properties: async (that, cell) => {
    let properties = {}
    const { input } = cell;
    properties = {
      ...base(cell),
      "ui:widget": "SelectWidget",
      "ui:options": {
        attrs: {
          clearable: true,
        },
      },
    };
    if (input.inputOptions) {
      properties = {
        ...properties,
        enum: Object.keys(input.inputOptions),
        enumNames: Object.keys(input.inputOptions).map(
          (x) => input.inputOptions[x]
        ),
      };
    }
    if (input.funcInputOptionsLoader) {
      const inputOptions = await input.funcInputOptionsLoader(that);
      properties = {
        ...properties,
        enum: Object.keys(inputOptions),
        enumNames: Object.keys(inputOptions).map((x) => inputOptions[x]),
      };
    }
    return properties;
  },
};

// inputElement[formInputType.customSelect] = {
//   properties: async (that, cell) => {

//   }
// }

inputElement[formInputType.inputList] = {
  properties: async (that, cell) => {
    let properties = {};
    const { input } = cell;
    properties = {
      ...base(cell),
      "ui:widget": "SelectWidget",
      type: "array",
      uniqueItems: true,
      items: {
        type: "string",
      },
      "ui:options": {
        attrs: {
          clearable: true,
          multiple: true,
          "collapse-tags": true,
          "allow-create": true,
          filterable: true,
        },
      },
    };
    if (input.inputOptions) {
      properties.items = {
        ...properties.items,
        enum: Object.keys(input.inputOptions),
        enumNames: Object.keys(input.inputOptions).map(
          (x) => input.inputOptions[x]
        ),
      };
    }
    if (input.funcInputOptionsLoader) {
      const inputOptions = await input.funcInputOptionsLoader(that);
      properties.items = {
        ...properties.items,
        enum: Object.keys(inputOptions),
        enumNames: Object.keys(inputOptions).map((x) => inputOptions[x]),
      };
    }
    return properties;
  },
};

inputElement[formInputType.treeSelectRemote] = {
  properties: async (that, cell) => {
    let properties = {
      ...base(cell),
      type: "array",
      items: {
        type: 'string'
      },
      "ui:options": {
        placeholder: "请输入" + cell.label,
        style: {},
      },
      "ui:widget": "elTreeSelect",
    } as stringAnyObj;
    const { input } = cell;
    if (input.inputOptions)
      properties = {
        ...properties,
        attrs: {
          ...input.inputOptions,
        },
      };
    let attrs = {
      showCheckbox: true,
      multiple: true,
      checkStrictly: true,
      collapseTags: true,
      lazy: true,
      props: {
        label: "name",
        children: "children",
      },
    } as stringAnyObj;
    if (input.funcInputOptionsLoader)
      attrs = { ...attrs, ...(await input.funcInputOptionsLoader(that)) };

    Object.keys(attrs).map((x) => {
      if (x == 'type') {
        properties.type = attrs[x]
      }
      properties["ui:" + x] = attrs[x];
    });
    return properties;
  },
};

inputElement[formInputType.treeSelect] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      type: "array",
      items: {
        type: "string",
      },
      uniqueItems: true,
      "ui:widget": "elTreeSelect",
    } as stringAnyObj;
    if (input.inputOptions)
      properties = {
        ...properties,
        attrs: {
          ...input.inputOptions,
        },
      };
    let attrs = {
      checkStrictly: true,
      showCheckbox: true,
      multiple: true,
      collapseTags: true,
      props: {
        label: "name",
        children: "children",
        key: 'id'
      },
    } as stringAnyObj;
    if (input.inputOptions) attrs = { ...attrs, ...input.inputOptions };
    if (input.funcInputOptionsLoader)
      attrs = { ...attrs, ...(await input.funcInputOptionsLoader(that)) };
    Object.keys(attrs).map((x) => {
      if (x == 'type') {
        properties.type = attrs[x]
      }
      properties["ui:" + x] = attrs[x];
    })
    return properties;
  },
};

// 搜索用searchList
inputElement[formInputType.searchList] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      type: "array",
      items: {
        type: 'string'
      },
      "ui:widget": defineComponent({
        props: [
          "props",
          "needTreeMode",
          "style",
          "class",
          "readonly",
          "multiple",
          "filterable",
          "remote",
          "reserveKeyword",
          "remoteMethod",
          "modelValue",
          "placeholder",
          "clearable",
          'lazy',
          'load'
        ],
        setup(props, context) {
          let options = ref([]);
          props["remoteMethod"]("").then(res => {
            options.value = res;
          });
          console.log(props.needTreeMode, 'needTreeMode')
          return () => [
            h(
              props.needTreeMode ? ElTreeSelect : ElSelect,
              {
                ...props,
                placeholder: props.placeholder.replace('输入', '选择'),
                remoteMethod: async (query) => {
                  let res = await props["remoteMethod"](query);
                  options.value = res;
                },
                "onUpdate:modelValue": (e) => {
                  context.emit("update:modelValue", e);
                },
              },
              () =>
                options.value.map((x) => {
                  return h(ElOption, {
                    value: x.value,
                    label: x.label,
                  });
                })
            ),
          ];
        },
      }),
    } as stringAnyObj;
    let attrs = {
      multiple: true,
      filterable: true,
      remote: true,
      reserveKeyword: true,
      remoteMethod: async () => { return [] }
    };
    if (input.inputOptions) attrs = { ...attrs, ...input.inputOptions };
    if (input.funcInputOptionsLoader)
      attrs = { ...attrs, ...(await input.funcInputOptionsLoader(that)) };
    Object.keys(attrs).map((x) => {
      if (x == 'type') {
        properties.type = attrs[x]
      }
      properties["ui:" + x] = attrs[x];
    });
    return properties;
  },
};




// 搜索用searchList
inputElement[formInputType.searchTree] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      type: "array",
      items: {
        type: 'string'
      },
      "ui:widget": defineComponent({
        props: [
          "props",
          "needTreeMode",
          "style",
          "class",
          "readonly",
          "multiple",
          "filterable",
          "remote",
          "reserveKeyword",
          "remoteMethod",
          "modelValue",
          "placeholder",
          "clearable",
          "showCheckBox",
          'lazy',
          'load'
        ],
        setup(props, context) {
          let options = ref([]);
          props["remoteMethod"]("").then(res => {
            options.value = res;
          });
          console.log(props.needTreeMode, 'needTreeMode')
          return () => [
            h(
              ElTreeSelect,
              {
                data: options.value,
                ...props,
                placeholder: props.placeholder.replace('输入', '选择'),
                remoteMethod: async (query) => {
                  options.value = await props["remoteMethod"](query)
                },
                "onUpdate:modelValue": (e) => {
                  context.emit("update:modelValue", e);
                },
              }
            ),
          ];
        },
      }),
    } as stringAnyObj;
    let attrs = {
      multiple: true,
      filterable: true,
      remote: true,
      reserveKeyword: true,
      remoteMethod: async () => { return [] }
    };
    if (input.inputOptions) attrs = { ...attrs, ...input.inputOptions };
    if (input.funcInputOptionsLoader)
      attrs = { ...attrs, ...(await input.funcInputOptionsLoader(that)) };
    Object.keys(attrs).map((x) => {
      if (x == 'type') {
        properties.type = attrs[x]
      }
      properties["ui:" + x] = attrs[x];
    });
    return properties;
  },
};




/**
 * @name: indexListForSwitch
 * @description: 使用elscrollbar控制外部样式，支持使用customRender渲染内部,建议使用之前详细阅读源码
 * @authors: CZH
 * @Date: 2022-12-14 14:15:24
 */
inputElement[formInputType.indexListForSwitch] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      type: "string",
      "ui:widget": defineComponent({
        props: [
          "height",
          "maxHeight",
          "native",
          "always",
          "minSize",
          "noresize",
          "scroll",
          "style",
          "class",
          "modelValue",
          "customRender"
        ],
        setup(props, context) {
          // if()
          return () => [
            <ElScrollbar {...props}>
              {
                props.modelValue && props.modelValue.length > 0 ? props.modelValue.map(x => {
                  return props.customRender(x, that);
                }) : ''
              }
            </ElScrollbar>
          ]
        },
      }),
      "ui:options": {
        style: {
          width: '100%',
          fontWeight: '900'
        },
      }
    } as stringAnyObj;
    let attrs = {
      maxHeight: '400px'
    };
    if (input.inputOptions) attrs = { ...attrs, ...input.inputOptions };
    if (input.funcInputOptionsLoader)
      attrs = { ...attrs, ...(await input.funcInputOptionsLoader(that)) };
    Object.keys(attrs).map((x) => {
      properties["ui:" + x] = attrs[x];
    });
    return properties;
  },
};

/**
 * @name: underLine
 * @description: 一条下划线，
 * @authors: CZH
 * @Date: 2023-03-23 22:08:39
 */
inputElement[formInputType.underLine] = {
  properties: (that, cell) => {
    let properties = {
      ...base(cell),
      type: "string",
      "ui:widget": defineComponent({
        props: ["type", "size", "icon", "buttonName", "callBack"],
        setup(props, context) {
          return () => [<ElDivider></ElDivider>];
        },
      }),
      "ui:options": {
        style: {
          width: "100%",
          fontWeight: "900",
        },
      },
    } as stringAnyObj;
    return properties;
  },
};


/**
 * @name: button
 * @description: 一个按钮,反复执行true false，并以此来触发一些事件
 * @authors: CZH
 * @Date: 2022-12-14 14:15:24
 */
inputElement[formInputType.button] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      type: "string",
      "ui:widget": defineComponent({
        props: ["type", "size", "icon", "buttonName", "callBack", "modelValue"],
        setup(props, context) {
          let a = false;
          return () => [
            <el-button
              {...props}
              onClick={(event) => {
                if (props.callBack) props.callBack(that.formData);
                a = !a;
                context.emit("update:modelValue", a);
              }}
            >
              {props.buttonName}
            </el-button>,
          ];
        },
      }),
      "ui:options": {
        style: {
          width: "100%",
          fontWeight: "900",
        },
      },
    } as stringAnyObj;
    let attrs = {
      maxHeight: "400px",
    };
    if (input.inputOptions) attrs = { ...attrs, ...input.inputOptions };
    if (input.funcInputOptionsLoader)
      attrs = { ...attrs, ...(await input.funcInputOptionsLoader(that)) };
    Object.keys(attrs).map((x) => {
      properties["ui:" + x] = attrs[x];
    });
    return properties;
  },
};


/**
 * @name: tabSelect
 * @description: tabSelect  radio 简化版本
 * @authors: CZH
 * @Date: 2022-12-14 14:15:24
 */
inputElement[formInputType.tabSelect] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      type: "string",
      "ui:widget": defineComponent({
        props: ["map", "modelValue"],
        setup(props, context) {
          let a = false;
          const list = ref(Object.keys(props.map).map(x => {
            return {
              label: props.map[x],
              value: x,
            }
          }))
          return () => list.value.map(x => {
            return h(ElButton, {
              onClick: () => {
                console.log(x);
                context.emit("update:modelValue", x.value);
              }
            }, [x.label])
          })
        },
      }),
      "ui:options": {
        style: {
          width: "100%",
          fontWeight: "900",
        },
      },
    } as stringAnyObj;
    let attrs = {
      maxHeight: "400px",
    } as stringAnyObj;
    if (input.inputOptions) attrs = { ...attrs, ...input.inputOptions, map: input.inputOptions };
    if (input.funcInputOptionsLoader)
      attrs = { ...attrs, ...(await input.funcInputOptionsLoader(that)) };
    Object.keys(attrs).map((x) => {
      properties["ui:" + x] = attrs[x];
    });
    return properties;
  },
};

inputElement[formInputType.remoteDictSelect] = {
  properties: async (that, cell) => {
    const { input } = cell
    const { dictKey } = input;
    const { getByKey } = useRemoteDictHook();
    let inputOptions = (await getByKey(dictKey)) as {
      [key: string]: any;
    };
    let properties = {
      ...base(cell),
      type: "string",
      inputOptions,
      "ui:widget": "SelectWidget",
      "ui:options": {
        attrs: {
          clearable: true,
        },
        placeholder: `请选择${cell.label}`
      },
      enum: Object.keys(inputOptions),
      enumNames: Object.keys(inputOptions).map(
        (x) => inputOptions[x]
      ),
    }
    return properties;
  }
}

inputElement[formInputType.uploadFileList] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      type: "string",
      "ui:widget": uploadFileList,
      "ui:options": {
        style: {
          width: "100%",
          fontWeight: "900",
        },
      },
    } as stringAnyObj;
    let attrs = {};
    if (input.inputOptions) attrs = { ...attrs, ...input.inputOptions };
    if (input.funcInputOptionsLoader)
      attrs = { ...attrs, ...(await input.funcInputOptionsLoader(that)) };
    Object.keys(attrs).map((x) => {
      properties["ui:" + x] = attrs[x];
    });
    return properties;
  },
};
inputElement[formInputType.cascader] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      type: "string",
      "ui:widget": cascader,
      "ui:options": {
        style: {
          width: "100%",
          fontWeight: "900",
        },
      },
    } as stringAnyObj;
    let attrs = {
      maxHeight: "400px",
    };
    if (input.inputOptions) attrs = { ...attrs, ...input.inputOptions };
    if (input.funcInputOptionsLoader)
      attrs = { ...attrs, ...(await input.funcInputOptionsLoader(that)) };
    Object.keys(attrs).map((x) => {
      properties["ui:" + x] = attrs[x];
    });
    return properties;
  },
}


inputElement[formInputType.richTextArea] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      type: "string",
      "ui:widget": editor,
      "ui:options": {
        style: {
          width: "99%",
          fontWeight: "900",
        },
      },
    } as stringAnyObj;
    let attrs = {
      maxHeight: "400px",
    };
    if (input.inputOptions) attrs = { ...attrs, ...input.inputOptions };
    if (input.funcInputOptionsLoader)
      attrs = { ...attrs, ...(await input.funcInputOptionsLoader(that)) };
    Object.keys(attrs).map((x) => {
      properties["ui:" + x] = attrs[x];
    });
    return properties;
  },
};



// 预计接入 griddesktop 展示部分数据
inputElement[formInputType.gridDesktop] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      type: "string",
      "ui:widget": gridDesktop,
      "ui:options": {
        style: {
          width: "calc(100%)",
          backGround: '#111',
          fontWeight: "900",
        },
      },
    } as stringAnyObj;
    let attrs = {
      // maxHeight: "400px",
    };
    if (input.inputOptions) attrs = { ...attrs, ...input.inputOptions };
    if (input.funcInputOptionsLoader)
      attrs = { ...attrs, ...(await input.funcInputOptionsLoader(that)) };
    Object.keys(attrs).map((x) => {
      properties["ui:" + x] = attrs[x];
    });
    return properties;
  },
};

// 这个组件完全依照组件化方案开发，使用方式就是通过
// in
// 不知道当时在想什么
inputElement[formInputType.gridCellMaker] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      type: "string",
      "ui:widget": card,
      "ui:options": {
        style: {
          width: "100%",
          fontWeight: "900",
        },
      },
    } as stringAnyObj;
    let attrs = {
      maxHeight: "400px",
    };
    if (input.inputOptions) attrs = { ...attrs, ...input.inputOptions };
    if (input.funcInputOptionsLoader)
      attrs = { ...attrs, ...(await input.funcInputOptionsLoader(that)) };
    Object.keys(attrs).map((x) => {
      properties["ui:" + x] = attrs[x];
    });
    return properties;
  },
};





/**
 * @name: customComponent
 * @description: 支持插入自定义组件
 * @authors: CZH
 * @Date: 2023-07-05 10:14:49
 */
inputElement[formInputType.customComponent] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      type: 'string',
      "ui:widget": componentMaker(input.customComponent),
      "ui:options": {}
    }
    let attrs = {};
    if (input.inputOptions) attrs = { ...attrs, ...input.inputOptions };
    if (input.funcInputOptionsLoader)
      attrs = { ...attrs, ...(await input.funcInputOptionsLoader(that)) };
    Object.keys(attrs).map((x) => {
      properties["ui:" + x] = attrs[x];
    });
    return properties;
  }
}



/**
 * @name: tableCellTemplate
 * @description: 嵌套表单
 * @authors: CZH
 * @Date: 2023-08-29 09:56:31
 */
inputElement[formInputType.tableCellTemplate] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      title: input.label,
      type: 'object',
      properties: await propertiesMaker((await input.funcInputOptionsLoader(that) as tableCellTemplate[]) || [], that, true),
      ...input.inputOptions
    }
    return properties;
  },
}




export default inputElement;
