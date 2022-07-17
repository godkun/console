import { NTag } from "naive-ui";
import { h } from 'vue';
export const columns = [
  {
    title: '实例id',
    key: 'id',
    width: 100
  },
  {
    title: '实例名称',
    key: 'name',
    width: 100
  },
  {
    title: '实例秘钥',
    key: 'secret',
    width: 100
  },
  {
    title: '创建时间',
    key: 'createtime',
    width: 100
  },
  {
    title: '是否在线',
    key: 'online',
    width: 100,
    render(row) {
      return h(
        NTag,
        {
          style: {
            marginRight: '6px'
          },
          type: row.online == 1 ? 'success' : "error",
          bordered: false
        },
        {
          default: () => row.online == 1 ? '在线' : "离线"
        }
      );
    }
  }
];
