import { NTime } from "naive-ui";
import { h } from 'vue';
export const columns = [
  {
    title: '开始时间',
    key: 'StartTime',
    width: 160,
    render(row) {
      return h(NTime, row.StartTime);
    }
  },
  {
    title: '类型',
    key: 'Type',
    width: 100,
  },
  {
    title: '拉流地址',
    key: 'RemoteURL',
  },
  {
    title: 'StreamPath',
    key: 'StreamPath',
  },
];
