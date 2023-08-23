/**
 *
 *  参考文档 深入数据对象 https://v2.cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1
 *  参考文档 插件babel-plugin-transform-vue-jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx/blob/master/lib/group-props.js
 *
 *
 */
function isTopLevelWrap() {
  var map = Object.create(null);
  var list = [
    "class",
    "staticClass",
    "style",
    "key",
    "ref",
    "refInFor",
    "slot",
    "scopedSlots",
  ];
  let len = list.length;
  for (var i = 0; i < len; i++) {
    map[list[i]] = true;
  }
  return (val) => map[val];
}
let isTopLevel = isTopLevelWrap();
// https://v2.cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1
let nestableReg = /^(props|domProps|on|nativeOn|hook)([-_A-Z])/;
let dirReg = /^v-/;
let xlinkReg = /^xlink([A-Z])/;

/**
 * groupProps
 * @param {*} obj
 * @returns
 */
function groupProps(obj) {
  let currentNewPropObjects = Object.create(null);
  let props = [];
  console.warn("obj", JSON.stringify(obj));
  Object.keys(obj).forEach(function (key) {
    props.push({
      key,
      value: obj[key],
    });
  });
  props.forEach(function (prop) {
    let name = prop.key;
    if (isTopLevel(name)) {
      currentNewPropObjects[name] = prop.value;
    } else {
      let nestMatch = name.match(nestableReg);

      if (nestMatch) {
        let prefix = nestMatch[1];
        let suffix = name.replace(nestableReg, function (_, $1, $2) {
          return $2 === "-" ? "" : $2.toLowerCase();
        });

        let nestedProp = { [suffix]: prop.value };

        if (!currentNewPropObjects[prefix]) {
          currentNewPropObjects[prefix] = {};
        }
        Object.assign(currentNewPropObjects[prefix], nestedProp);
      } else if (dirReg.test(name)) {
        name = name.replace(dirReg, "");
        let dirs = currentNewPropObjects.directives;
        if (!dirs) {
          dirs = currentNewPropObjects.directives = [];
        }
        dirs.push({
          name: name,
          value: prop.value,
        });
      } else {
        if (xlinkReg.test(prop.key)) {
          prop.key = JSON.stringify(
            prop.key.replace(xlinkReg, function (m, p1) {
              return "xlink:" + p1.toLowerCase();
            })
          );
        }
        if (!currentNewPropObjects.attrs) {
          currentNewPropObjects.attrs = {};
        }
        currentNewPropObjects.attrs[prop.key] = prop.value;
      }
    }
  });
  console.log("currentNewPropObjects", JSON.stringify(currentNewPropObjects));
  return currentNewPropObjects;
}

export default groupProps;
