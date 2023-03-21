/*
 * @Date: 2023-02-06 08:57:34
 * @LastEditors: CZH
 * @LastEditTime: 2023-03-21 13:10:02
 */
import { deepMerge } from "@/components/basicComponents/grid/module/cardApi";
import { ElOption, ElScrollbar, ElSelect, ElTreeSelect } from "element-plus";
import { defineComponent, h, ref, shallowRef, watchEffect } from "vue";
import { inputElementTemplate, formInputType, stringAnyObj } from "../../types";
import editor from "@/components/basicComponents/grid/module/baseToolComponents/editor.vue";
import uploadFileList from "./uploadFileList.vue";
function base(cell) {
  return {
    // title: cell.label,
    type: "string",
    "ui:options": {
      placeholder: "请输入" + cell.label,
      style: {},
    },
  } as stringAnyObj;
}

export const globalBaseCellDeal = (
  cell,
  cellProperties: stringAnyObj | Promise<stringAnyObj>,
  needTitle: boolean = false
): stringAnyObj | Promise<stringAnyObj> => {
  const globalBaseCell = {
    "ui:options": {
      title: needTitle ? cell.label : "",
      placeholder: "请输入" + cell.label,
      style: {
        width: needTitle ? "360px" : "100%",
      },
    },
  };
  return deepMerge(cellProperties, globalBaseCell);
};

let inputElement = {} as {
  [key: string]: inputElementTemplate;
};

inputElement[formInputType.input] = {
  properties: (that, cell) => {
    return {
      type: "string",
    };
  },
};

inputElement[formInputType.mobile] = {
  properties: (that, cell) => {
    return {
      type: "string",
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
        action: cell.input.action || "/api/web/file/upload",
      },
    };
    let attrs = {
      responseFileUrl: (res) => {
        return res ? res.data : "";
      },
    };
    Object.keys(attrs).map((x) => {
      properties["ui:" + x] = attrs[x];
    });
    return properties;
  },
};

inputElement[formInputType.uploadImage] = {
  properties: (that, cell) => {
    let properties = {
      ...base(cell),
      "ui:widget": "UploadWidget",
      "ui:options": {
        action: cell.input.action || "/api/web/file/upload",
      },
    };
    let attrs = {
      responseFileUrl: (res) => {
        return res ? res.data : "";
      },
    };
    Object.keys(attrs).map((x) => {
      properties["ui:" + x] = attrs[x];
    });
    return properties;
  },
};

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
    return {
      ...base(cell),
      "ui:widget": "SelectWidget",
      "ui:options": {
        placeholder: cell.label + "开关",
        enum: ["true", "false"],
        enumNames: ["开", "关"],
      },
    };
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
        enumNames: Object.keys(input.inputOptions).map((x) => input.inputOptions[x]),
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
        enumNames: Object.keys(input.inputOptions).map((x) => input.inputOptions[x]),
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
      properties["ui:" + x] = attrs[x];
    });
    return properties;
  },
};

inputElement[formInputType.treeSelect] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      type: "string",
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
      },
    } as stringAnyObj;
    if (input.inputOptions) attrs = { ...attrs, ...input.inputOptions };
    if (input.funcInputOptionsLoader)
      attrs = { ...attrs, ...(await input.funcInputOptionsLoader(that)) };

    Object.keys(attrs).map((x) => {
      properties["ui:" + x] = attrs[x];
    });
    return properties;
  },
};

// 搜索用searchList
inputElement[formInputType.searchList] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      type: "string",
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
        ],
        setup(props, context) {
          let options = ref([]);
          props["remoteMethod"]("").then((res) => {
            options.value = res;
          });
          return () => [
            h(
              ElSelect,
              {
                ...props,
                placeholder: props.placeholder.replace("输入", "选择"),
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
          "customRender",
        ],
        setup(props, context) {
          return () => [
            <ElScrollbar {...props}>
              {props.modelValue && props.modelValue.length > 0
                ? props.modelValue.map((x) => {
                  return props.customRender(x, that);
                })
                : ""}
            </ElScrollbar>,
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
 * @name: botton
 * @description: 一个按钮,反复执行true false，并以此来触发一些事件
 * @authors: CZH
 * @Date: 2022-12-14 14:15:24
 */
inputElement[formInputType.botton] = {
  properties: async (that, cell) => {
    const { input } = cell;
    let properties = {
      ...base(cell),
      type: "string",
      "ui:widget": defineComponent({
        props: ["type", "size", "icon", "buttonName", "callBack"],
        setup(props, context) {
          return () => [
            <el-button
              {...props}
              onClick={(event) => {
                if (props.callBack) props.callBack(that.formData);
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
      },
      enum: Object.keys(inputOptions),
      enumNames: Object.keys(inputOptions).map((x) => inputOptions[x]),
    };
    return properties;
  },
};

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
import gridDesktop from "@/components/basicComponents/grid/index";
import { useRemoteDictHook } from "@/store/modules/remoteDict";
inputElement[formInputType.component] = {
  properties: async (that, cell) => {
    const { input } = cell;
  },
};

export default inputElement;
