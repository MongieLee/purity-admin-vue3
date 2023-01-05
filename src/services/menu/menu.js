import {deleteRequest, getRequest, postRequest, putRequest} from '../../utils/request';

class MenuService {
  /**
   * 根据Id获取菜单
   * @param id
   */
  static getMenuById(id) {
    return getRequest(`api/v1/menu/getUserMenus/${id}`);
  }

  /**
   * 获取全部菜单树
   */
  static getMenuTree() {
    return getRequest('api/v1/menu/tree');
  }

  /**
   * 获取当前用户自身菜单
   */
  static getMenuTreeOfSelf() {
    return getRequest('api/v1/menu/getUserMenus');
  }

  /**
   * 创建菜单
   * @param data
   */
  static createMenu(data) {
    return postRequest(`api/v1/menu`, data);
  }

  /**
   * 更新菜单
   * @param id
   * @param data
   */
  static updateMenu(id, data) {
    return putRequest(`api/v1/menu/${id}`, data);
  }

  /**
   * 删除菜单
   * @param id
   */
  static deleteMenu(id) {
    return deleteRequest(`api/v1/menu/${id}`);
  }
}

export default MenuService;
