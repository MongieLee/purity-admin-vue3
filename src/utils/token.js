export const __auth_token_key__ = "accessToken";
export const __expires__key__ = "expires";
export const __auth_refresh_token_key__ = "";
export const __cache_tabs_key__ = "cache_tabs";
export const __user_info__ = "user_info";

const setToken = (key, value) => localStorage.setItem(key, value);

const getToken = (key) => localStorage.getItem(key);

const removeToken = (key) => localStorage.removeItem(key);

const setAuthToken = (token, expires) => {
  setToken(__auth_token_key__, token);
  // setToken(__expires__key__, Date.now() + (expires * 1000));
  setToken(__expires__key__, expires);
};

// 检查token时效性
const inspectTokenValidity = () => {
  const token = getToken(__auth_token_key__);
  let validTime;
  try {
    validTime = Number(getToken(__expires__key__));
  } catch (e) {
    console.error('解析时效失败');
    console.error(e.message);
  }
  return token ? validTime >= Date.now() : false;
};

// 清空所有浏览器本地缓存
const clearAuthToken = () => {
  localStorage.removeItem(__auth_token_key__);
  localStorage.removeItem(__expires__key__);
  localStorage.removeItem(__cache_tabs_key__);
  localStorage.removeItem(__user_info__);
};

export {
  setToken,
  getToken,
  setAuthToken,
  inspectTokenValidity,
  clearAuthToken,
  removeToken
};
