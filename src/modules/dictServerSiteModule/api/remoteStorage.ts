export interface RemoteLoginForm {
  username: string;
  password: string;
}
export class RemoteStorage {
  static _remoteStorage: RemoteStorage;
  private _remoteUrl = "";
  public baseUrl = "http://dict.czht.top/api";
  public username = "管理员";
  public password = "xcbo221";
  public static getInstance() {
    if (!RemoteStorage._remoteStorage) {
      RemoteStorage._remoteStorage = new RemoteStorage();
    }
    return RemoteStorage._remoteStorage;
  }
  public constructor() {
    // return RemoteStorage.getInstance();
    return RemoteStorage._remoteStorage;
  }
  static get instance() {
    return RemoteStorage.getInstance();
  }
  private storeLocal(key: string, value: any) {
    localStorage.setItem(`storage_${key}`, value);
  }
  private getLocal(key: string) {
    return localStorage.getItem(`storage_${key}`);
  }
  public async login(loginForm: RemoteLoginForm = {username: this.username, password: this.password}) {
    console.log(loginForm);
    // console.log(`access into ${url}`);
    // if(this.getLocal(""))
    this.storeLocal("login", loginForm);
    const res: any = await this._request("user/login", loginForm);
    console.log("res", res);
    this.storeLocal("token", res.data.accessToken);
  }
  public async getItem(key: string) {
    if (!localStorage.getItem("token")) {
      await this.login({ username: this.username, password: this.password });
    }
    const res: any = await this._request("backend/getDictData", {
      key
    });
    if (res) return res.data.value;
    else {
      return null;
    }
  }
  public async setItem(key: string, value: string) {
    console.log(key);
    const res = await this._request("backend/editDictData", {
      key,
      value
    });
    if (res) return res;
    else {
      return null;
    }
  }
  public async addItem(key: string, value: string) {
    console.log(key);
    const res = await this._request("backend/addDictData", {
      key,
      value
    });
    if (res) return res;
    else {
      return null;
    }
  }
  public async deleteItem(key: string) {
    console.log(key);
    const res: any = await this._request("backend/deleteDictData", {
      key
    });
    if (res) return res;
    else {
      return null;
    }
  }
  public async getAllKey(offset = 0, limit = 10) {
    const res: any = await this._request("backend/getAllKey", {
      offset,
      limit
    });
    if (res) return res;
    else {
      return [];
    }
  }
  public async getTableData(offset = 0, limit = 10) {

    if (!localStorage.getItem("token")) {
      await this.login({ username: this.username, password: this.password });
    }
    const res: any = await this._request("backend/getTableData", {
      offset,
      limit
    });
    if (res) return res;
    else {
      return [];
    }
  }
  // public getItem(table: String) {}
  private _request(url, data) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${this.baseUrl}/${url}`, true);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      xhr.setRequestHeader("Authorization", this.getLocal("token"));
      xhr.send(JSON.stringify(data));
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        }
      };
      xhr.onerror = function (error) {
        console.log(error);
        reject(error);
      };
    });
  }
}
