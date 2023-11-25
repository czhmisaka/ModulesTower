/*
 * @Date: 2022-11-21 16:13:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-10-07 15:03:12
 * @FilePath: /configforpagedemo/build/index.ts
 */
/** 处理环境变量 */
const warpperEnv = (envConf: Recordable, mode: string): ViteEnv => {
  /** 此处为默认值，无需修改 */
  const ret: ViteEnv = {
    VITE_PORT: 8848,
    VITE_PUBLIC_PATH: "",
    VITE_PROXY_DOMAIN: "",
    VITE_PROXY_DOMAIN_REAL: "",
    VITE_PROXY_DOMAIN_FLOW:"",
    VITE_ROUTER_HISTORY: "",
    VITE_LEGACY: false,
    VITE_CDN: false,
    VITE_COMPRESSION: "none",
    VITE_MODE: mode,
  };

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n");
    realName =
      realName === "true" ? true : realName === "false" ? false : realName;

    if (envName === "VITE_PORT") {
      realName = Number(realName);
    }
    ret[envName] = realName;
    if (typeof realName === "string") {
      process["env"][envName] = realName;
    } else if (typeof realName === "object") {
      process["env"][envName] = JSON.stringify(realName);
    }
  }
  return ret;
};

/** 跨域代理重写 */
const regExps = (value: string, reg: string): string => {
  return value.replace(new RegExp(`^${reg}`, "g"), "");
};

/** 环境变量 */
const loadEnv = (): ViteEnv => {
  return import.meta.env;
};

export { warpperEnv, regExps, loadEnv };
