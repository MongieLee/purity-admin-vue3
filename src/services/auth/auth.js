import {getRequest, postRequest, putRequest} from '../../utils/request';

class AuthService {
  /**
   * 登录获取登录凭证
   * @param usernameAndPassword 用户名密码
   */
  static login(usernameAndPassword) {
    return postRequest('api/v1/auth/login', usernameAndPassword);
  }

  /**
   * 获取当前登录用户信息
   */
  static getUserInfo() {
    return getRequest('api/v1/users/info');
  }

  /**
   * 更新用户密码
   */
  static changePassword(data) {
    return putRequest('api/v1/users/updatePassword', data);
  }
}

export default AuthService;
