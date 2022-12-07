import { inputElementTemplate, formInputType, stringAnyObj } from "../../types";

function base(cell) {
  return {
    title: cell.label,
    type: "string",
  } as stringAnyObj;
}

let inputElement = {} as {
  [key: string]: inputElementTemplate;
};

inputElement[formInputType.input] = {
  properties: (that, cell) => {
    return {
      title: cell.label,
      type: "string",
      "ui:options": {
        placeholder: "请输入" + cell.label,
        style: {
          width: "200px",
        },
      },
    };
  },
};

inputElement[formInputType.datePicker] = {
  properties: (that, cell) => {
    return {
      title: cell.label,
      type: "number",
      format: "date",
      "ui:options": {},
    };
  },
};

inputElement[formInputType.radio] = {
  properties: (that, cell) => {
    return {
      title: cell.label,
      type: "boolean",
      "ui:options": {
        placeholder: "请输入" + cell.label,
      },
    };
  },
};

inputElement[formInputType.idCard] = {
  properties: (that, cell) => {
    return {
      ...base(cell),
      "ui:options": {
        placeholder: "请输入" + cell.label,
      },
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
  properties: (that, cell) => {
    let properties = base(cell);
    const { input } = cell;
    return properties;
  },
};

export default inputElement;
