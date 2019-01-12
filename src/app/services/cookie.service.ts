import { Injectable } from '@angular/core';

@Injectable()
export class CookieService {
  private readonly TOKEN_NAME = 'XSRF-TOKEN';
  private readonly COMPANY_ID = 'CompanyID';
  private readonly MASK_PRIVATE_DATA_FLAG = 'MaskPrivateData';

  constructor() {}

  /**
   * Checks the existence of a single cookie by it's name
   *
   * @param  {string} name Identification of the cookie
   * @returns existence of the cookie
   */
  public check(name: string): boolean {
    if (typeof document === 'undefined') return false; // Check if document exist avoiding issues on server side prerendering
    name = encodeURIComponent(name);
    let regexp = new RegExp('(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)', 'g');
    let exists = regexp.test(document.cookie);
    return exists;
  }

  /**
   * Retrieves a single cookie by it's name
   *
   * @param  {string} name Identification of the Cookie
   * @returns The Cookie's value
   */
  public get(name: string): string {
    if (this.check(name)) {
      name = encodeURIComponent(name);
      let regexp = new RegExp('(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)', 'g');
      let result = regexp.exec(document.cookie);
      return decodeURIComponent(result[1]);
    } else {
      return '';
    }
  }

  /**
   * Retrieves a a list of all cookie avaiable
   *
   * @returns Object with all Cookies
   */
  public getAll(): any {
    let cookies: any = {};

    if (document.cookie && document.cookie != '') {
      let split = document.cookie.split(';');
      for (let i = 0; i < split.length; i++) {
        let currCookie = split[i].split('=');
        currCookie[0] = currCookie[0].replace(/^ /, '');
        cookies[decodeURIComponent(currCookie[0])] = decodeURIComponent(currCookie[1]);
      }
    }

    return cookies;
  }

  /**
   * Save the Cookie
   *
   * @param  {string} name Cookie's identification
   * @param  {string} value Cookie's value
   * @param  {number} expires Cookie's expiration date in days from now or at a specific date from a Date object. If it's undefined the cookie is a session Cookie
   * @param  {string} path Path relative to the domain where the cookie should be avaiable. Default /
   * @param  {string} domain Domain where the cookie should be avaiable. Default current domain
   * @param  {boolean} secure If true, the cookie will only be available through a secured connection
   */
  public set(name: string, value: string, expires?: number | Date, path?: string, domain?: string, secure?: boolean) {
    let cookieStr = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';

    if (expires) {
      if (typeof expires === 'number') {
        let dtExpires = new Date(new Date().getTime() + expires * 1000 * 60 * 60);
        cookieStr += 'expires=' + dtExpires.toUTCString() + ';';
      } else {
        cookieStr += 'expires=' + expires.toUTCString() + ';';
      }
    }
    path = '/';
    if (path) {
      cookieStr += 'path=' + path + ';';
    }
    if (domain) {
      cookieStr += 'domain=' + domain + ';';
    }
    if (secure) {
      cookieStr += 'secure;';
    }

    // console.log(cookieStr);
    document.cookie = cookieStr;
  }

  /**
   * Removes specified Cookie
   *
   * @param  {string} name Cookie's identification
   * @param  {string} path Path relative to the domain where the cookie should be avaiable. Default /
   * @param  {string} domain Domain where the cookie should be avaiable. Default current domain
   */
  public delete(name: string, path?: string, domain?: string): void {
    this.set(name, '', -1, path, domain);
  }

  /**
   * Delete all cookie avaiable
   */
  public deleteAll(path?: string, domain?: string): void {
    let cookies: any = this.getAll();

    for (let cookieName in cookies) {
      this.delete(cookieName, path, domain);
    }
  }

  /**
   * 言語設定
   */
  public set language(lang: string) {
    this.set('lang', lang, 999999);
  }

  /**
   * 言語取得
   */
  public get language(): string {
    return this.get('lang');
  }

  public set authToken(authTokenString: string) {
    // Cookieデフォルト8時間にする
    this.set(this.TOKEN_NAME, authTokenString, 8);
  }

  public get authToken(): string {
    return this.get(this.TOKEN_NAME);
  }

  public set companyID(value: string) {
    this.set(this.COMPANY_ID, value, 8);
  }

  public get companyID(): string {
    return this.get(this.COMPANY_ID);
  }

  /**
   * COMPANY_IDを削除する
   */
  public removeCompanyID() {
    this.delete(this.COMPANY_ID);
  }

  /**
   * Auth Tokenを削除する
   */
  public removeAuthToken() {
    this.delete(this.TOKEN_NAME);
  }

  /**
   * 認証トークンが存在しているかどうかチェック
   */
  public get existsAuthToken(): boolean {
    return this.check(this.TOKEN_NAME);
  }
}
