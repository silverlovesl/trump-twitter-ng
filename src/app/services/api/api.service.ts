import { throwError as observableThrowError, Observable } from 'rxjs';
import { timeout, catchError, map } from 'rxjs/operators';
import { PagingData } from './../../models/paging-data';
import { ApiParams } from './api.service';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/Rx';
import { CookieService } from '../cookie.service';
import { Serializable } from './../../models/serializable';
import { environment } from '../../../environments/environment';
import { GlobalEvents } from 'src/app/models/global-event';
import { GlobalState } from '../global-state';

export type ApiParams = {
  [key: string]: any | any[];
};

@Injectable()
export class ApiService {
  public baseUrl: string;
  private isPrivateDataMasked: boolean;

  constructor(public http: Http, public cookie: CookieService, public globalState: GlobalState) {
    this.baseUrl = environment.apiHost;
  }

  /**
   * Get Request (single object)
   * @param typeDef return value type
   * @param path API Path
   * @param params parameter
   */
  get<T extends Serializable<T>>(typeDef: { new (): T }, path: string, params: ApiParams): Observable<T> {
    this.setLangToParams(params);
    return this.http
      .get(this.baseUrl + path, {
        params: params,
        withCredentials: environment.withCredentials,
        headers: this.getHeaders(false, false),
      })
      .pipe(
        map(response => {
          let json = response.json();
          return new typeDef().deserialize(json);
        }),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Get Request (複数オブジェクト)
   * @param typeDef return value type
   * @param path API Path
   * @param params parameter
   */
  getAll<T extends Serializable<T>>(typeDef: { new (): T }, path: string, params: ApiParams): Observable<T[]> {
    this.setLangToParams(params);
    return this.http
      .get(this.baseUrl + path, {
        params: params,
        withCredentials: environment.withCredentials,
        headers: this.getHeaders(false, false),
      })
      .pipe(
        map(response => {
          let _data = response.json().data;
          if (_data) {
            return _data.map(d => {
              return new typeDef().deserialize(d);
            });
          }
          return null;
        }),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Get Request (複数オブジェクト改ページ)
   * @param typeDef return value type
   * @param path API Path
   * @param params parameter
   */
  getAllWithPaging<T extends Serializable<T>>(
    typeDef: { new (): T },
    path: string,
    params: ApiParams
  ): Observable<PagingData<T>> {
    this.setLangToParams(params);
    return this.http
      .get(this.baseUrl + path, {
        params: params,
        withCredentials: environment.withCredentials,
        headers: this.getHeaders(false, false),
      })
      .pipe(
        map(response => {
          let json = response.json();
          let result = new PagingData();
          result.data = json.data.map(d => {
            return new typeDef().deserialize(d);
          });
          result.totalRecords = json.totalRecords;
          return result;
        }),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Get Request (複数オブジェクト)
   * @param typeDef return value type
   * @param path API Path
   * @param params parameter
   */
  getAllDevLocal<T extends Serializable<T>>(typeDef: { new (): T }, path: string, params: ApiParams): Observable<T[]> {
    this.setLangToParams(params);
    return this.http
      .get('http://localhost:4200' + path, {
        params: params,
        withCredentials: environment.withCredentials,
        headers: this.getHeaders(false, false),
      })
      .pipe(
        map(response => response.json().data.map(d => new typeDef().deserialize(d))),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Get Request (single object)
   * @param path API Path
   * @param params parameter
   */
  getDynamic<D>(path: string, params: ApiParams): Observable<D> {
    this.setLangToParams(params);
    return this.http
      .get(this.baseUrl + path, {
        params: params,
        withCredentials: environment.withCredentials,
        headers: this.getHeaders(false, false),
      })
      .pipe(
        map(response => {
          let json = response.json();
          return json;
        }),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Post request
   * @param typeDef return value type
   * @param path API Path
   * @param params parameter
   * @param isFormData if true then set content-type form
   */
  post<T extends Serializable<T>>(
    typeDef: { new (): T },
    path: string,
    params: ApiParams,
    isFormData: boolean = false
  ): Observable<T> {
    this.setLangToParams(params);
    return this.http
      .post(this.baseUrl + path, this.serializeAPIParams(params, isFormData), {
        params: params,
        withCredentials: environment.withCredentials,
        headers: this.getHeaders(true, false),
      })
      .pipe(
        map(response => new typeDef().deserialize(response.json())),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Post request
   * @param typeDef return value type
   * @param path API Path
   * @param params parameter
   * @param isFormData if true then set content-type form
   */
  postAll<T extends Serializable<T>>(
    typeDef: { new (): T },
    path: string,
    params: ApiParams,
    isFormData: boolean = false
  ): Observable<T[]> {
    this.setLangToParams(params);
    return this.http
      .post(this.baseUrl + path, this.serializeAPIParams(params, isFormData), {
        params: params,
        withCredentials: environment.withCredentials,
        headers: this.getHeaders(true, false),
      })
      .pipe(
        map(response => {
          let _data = response.json().data;
          if (_data) {
            return _data.map(d => new typeDef().deserialize(d));
          }
          {
            return null;
          }
        }),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Delete request
   * @param typeDef return value type
   * @param path API Path
   * @param params parameter
   * @param isFormData if true then set content-type form
   */
  delete<T extends Serializable<T>>(typeDef: { new (): T }, path: string, params: ApiParams): Observable<T> {
    this.setLangToParams(params);
    return this.http
      .delete(this.baseUrl + path, {
        body: params,
        withCredentials: environment.withCredentials,
        headers: this.getHeaders(true, false),
      })
      .pipe(
        map(response => new typeDef().deserialize(response.json())),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Put request
   * @param typeDef return value type
   * @param path API Path
   * @param params parameter
   * @param isFormData if true then set content-type form
   */
  put<T extends Serializable<T>>(
    typeDef: { new (): T },
    path: string,
    params: ApiParams,
    isFormData: boolean = false
  ): Observable<T> {
    this.setLangToParams(params);
    return this.http
      .put(this.baseUrl + path, this.serializeAPIParams(params, isFormData), {
        params: params,
        withCredentials: environment.withCredentials,
        headers: this.getHeaders(true, false),
      })
      .pipe(
        map(response => new typeDef().deserialize(response.json())),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Post request
   * @param typeDef return value type
   * @param path API Path
   * @param params parameter
   * @param isFormData if true then set content-type form
   */
  putAll<T extends Serializable<T>>(
    typeDef: { new (): T },
    path: string,
    params: ApiParams,
    isFormData: boolean = false
  ): Observable<T[]> {
    this.setLangToParams(params);
    return this.http
      .put(this.baseUrl + path, this.serializeAPIParams(params, isFormData), {
        params: params,
        withCredentials: environment.withCredentials,
        headers: this.getHeaders(true, false),
      })
      .pipe(
        map(response => {
          let _data = response.json().data;
          if (_data) {
            return _data.map(d => new typeDef().deserialize(d));
          }
          {
            return null;
          }
        }),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * ファイルアップルード
   * @param typeDef return value type
   * @param path API Path
   * @param params parameter
   * @param isPut user put method default:post
   */
  uploadFile<T extends Serializable<T>>(
    typeDef: { new (): T },
    path: string,
    params: ApiParams,
    isPut = false
  ): Observable<T> {
    this.setLangToParams(params);
    const _API_PATH = this.baseUrl + path;
    const _BODY = this.createFromData(params);
    const _OPTIONS = {
      params: params,
      withCredentials: environment.withCredentials,
      headers: this.getHeaders(false, false, true),
    };
    if (isPut) {
      return this.http.put(_API_PATH, _BODY, _OPTIONS).pipe(
        map(response => new typeDef().deserialize(response.json())),
        catchError(error => this.handleError(error))
      );
    } else {
      return this.http.post(_API_PATH, _BODY, _OPTIONS).pipe(
        map(response => new typeDef().deserialize(response.json())),
        catchError(error => this.handleError(error))
      );
    }
  }

  /**
   * ファイルアップルード
   * @param typeDef return value type
   * @param path API Path
   * @param params parameter
   * @param isPut user put method default:post
   */
  uploadFileResPagingData<T extends Serializable<T>>(
    typeDef: { new (): T },
    path: string,
    params: ApiParams,
    isPut = false
  ): Observable<PagingData<T>> {
    this.setLangToParams(params);
    const _API_PATH = this.baseUrl + path;
    const _BODY = this.createFromData(params);
    const _OPTIONS = {
      params: params,
      withCredentials: environment.withCredentials,
      headers: this.getHeaders(false, false, true),
    };
    if (isPut) {
      return this.http.put(_API_PATH, _BODY, _OPTIONS).pipe(
        timeout(1000 * 60),
        map(response => {
          let json = response.json();
          let result = new PagingData();
          result.data = json.data.map(d => new typeDef().deserialize(d));
          result.totalRecords = json.totalRecords;
          return result;
        }),
        catchError(error => this.handleError(error))
      );
    } else {
      return this.http.post(_API_PATH, _BODY, _OPTIONS).pipe(
        map(response => {
          let json = response.json();
          let result = new PagingData();
          result.data = json.data.map(d => new typeDef().deserialize(d));
          result.totalRecords = json.totalRecords;
          return result;
        }),
        catchError(error => this.handleError(error))
      );
    }
  }

  private handleError(error: any): Observable<any> {
    let result = error;
    if (error.json) {
      result = error.json();
    }

    if (error.status === 401) {
      // 401は auth tokenの 認証エラーなのでサインイン画面に戻す.
      this.globalState.notifyDataChanged(GlobalEvents.AuthFailed, result);
    } else {
      // 共通エラー(ポップアップ表示)を行う.
      // this.globalState.notifyDataChanged(GlobalEvents.ApiError, result);
      let msg = null;
      result.reason = msg || result.reason;
    }
    return observableThrowError(result);
  }

  /**
   * Serialize http request params
   * @param params Http request params
   * @param isFormData Is pass form data type default is ture
   */
  private serializeAPIParams(params: ApiParams, isFormData: boolean = true): string {
    if (isFormData) {
      let body = new URLSearchParams();
      for (let key in params) {
        const value = params[key];
        // https://stackoverflow.com/questions/2559318/how-to-check-for-an-undefined-or-null-variable-in-javascript.
        if (value != null) {
          body.append(key, params[key]);
        }
      }
      return body.toString();
    } else {
      return JSON.stringify(params);
    }
  }

  /**
   * フォームデータ作成
   * @param params
   */
  private createFromData(params: ApiParams): FormData {
    let body = new FormData();
    for (let key in params) {
      const value = params[key];
      if (value != null) {
        body.append(key, params[key]);
      }
    }
    return body;
  }

  private getHeaders(hasBody: boolean, isFormData: boolean, isUpload: boolean = false): Headers {
    let contentType: string;
    if (hasBody) {
      if (isFormData) {
        contentType = 'application/x-www-form-urlencoded';
      } else {
        contentType = 'application/json';
      }
    } else {
      contentType = null;
    }

    let headers = new Headers();
    if (contentType) {
      headers.append('Content-Type', contentType);
    }

    //ファイルアップロードの場合ヘッダーを指定せずデフォルトを使う
    if (isUpload) {
      headers.delete('Content-Type');
    }

    //Admin Tokenが存在する場合はHeader追加する
    return headers;
  }

  /**
   * Set language to param from cookie
   * @param params
   */
  private setLangToParams(params: ApiParams) {
    //暫定を日本語にする
    params['lang'] = this.cookie.language || 'ja';
  }
}
