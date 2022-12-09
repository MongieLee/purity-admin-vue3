/**
 * 获取当前时间文本
 * @returns {string}
 */
function timeFix() {
  const time = new Date();
  const hour = time.getHours();
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好';
}

function downloadFile(url, fileName) {
  const a = document.createElement('a');
  a.href = url;
  fileName && (a.download = '新闻列表.xlsx');
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const childKey = 'children';

/**
 * 清除数据中无用的children字段，一般用于tree组件
 * @param data
 * @returns {*[]}
 */
function clearChildren(data = []) {
  if (!(data instanceof Array)) throw new Error("请传入Array")
  return data.map(i => {
    if (!i.children.length) {
      Reflect.deleteProperty(i, childKey);
    } else {
      clearChildren(i.children)
    }
    return i;
  })
}

export {timeFix, downloadFile, clearChildren};
