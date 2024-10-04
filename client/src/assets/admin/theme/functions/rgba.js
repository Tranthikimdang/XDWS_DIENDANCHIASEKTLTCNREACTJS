// Vision UI Dashboard React helper functions
import hexToRgb from "src/assets/admin/theme/functions/hexToRgb";

function rgba(color, opacity) {
  return `rgba(${hexToRgb(color)}, ${opacity})`;
}

export default rgba;
