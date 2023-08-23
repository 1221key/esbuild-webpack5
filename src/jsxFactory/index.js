import { h } from "vue";
import groupProps from "./group-props";
/**
 *
 * @param {*} tag
 * @param {*} props
 * @param {*} children
 * @returns
 */
function vueJsx(tag, props = null, ...children) {
  const newPros = props ? groupProps(props) : {};
  return h(tag, newPros, children);
}
export default vueJsx;
