/*
 * @Date: 2023-02-06 08:57:34
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-29 01:14:59
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

import { getDownLoadRequestHeaders } from "@/utils/api/user/header";
import { ElUpload } from "element-plus";
import { useRemoteDictHook } from "@/store/modules/remoteDict";
import { loadEnv } from "@build/index";
import card from "@/components/basicComponents/grid/module/gridCard/card.vue";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import gridDesktop from "@/components/basicComponents/grid";
import { values } from 'lodash';
import { componentMaker } from "./inputElementComponent/functionToComponent";


function base(cell: tableCellTemplate) {
  return {
    // title: cell.label,
    type: "string",
    "ui:options": {
      attrs: {
        clearable: true,
      },
      placeholder: "请输入" + cell.label,
      style: {
      },
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
        marginBottom: "-6px"
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
      type: "string",
    };
  },
};

inputElement[formInputType.password] = {
  properties: (that, cell) => {
    return {
      type: "string",
      "ui:options": {
        "placeholder": "请输入",
        "showPassword": true
      }
    };
  },
}

inputElement[formInputType.mobile] = {
  properties: (that, cell) => {
    return {
      type: "string",
      minLength: 11,
      maxLength: 11,
      // pattern
    };
  },
};

inputElement[formInputType.number] = {
  properties: (that, cell) => {
    return {
      title: cell.label,
      type: "number",
    };
  },
};

inputElement[formInputType.textarea] = {
  properties: (that, cell) => {
    return {
      title: cell.label,
      type: "string",
      "ui:options": {
        type: "textarea",
      },
    };
  },
};

inputElement[formInputType.datePicker] = {
  properties: (that, cell) => {
    return {
      type: "number",
      format: "date",
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
      type: "array",
      format: "date",
      items: {
        type: "number",
      },
    };
  },
};

inputElement[formInputType.radio] = {
  properties: (that, cell) => {
    const { input } = cell;
    let properties = {
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
    let properties = base(cell);
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
    let properties = base(cell);
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
          "clearable"
        ],
        setup(props, context) {
          let options = ref([]);
          props["remoteMethod"]("").then(res => {
            options.value = res;
          });
          return () => [
            h(
              ElSelect,
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
    const { dictKey } = cell.input;
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

inputElement[formInputType.richTextArea] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      type: "string",
      "ui:widget": editor,
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
      type: 'null',
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

export default inputElement;
