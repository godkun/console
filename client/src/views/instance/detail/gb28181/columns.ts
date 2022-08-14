import { h } from 'vue';
import { NTime } from 'naive-ui';
import { BasicTable } from '@/components/Table';
const channelsColumns = [
  {
    title: 'ID',
    key: 'DeviceID',
    width: 100
  },
  {
    title: 'Name',
    key: 'Name',
    width: 70
  },
  {
    title: 'Status',
    key: 'Status',
    width: 70
  },
  {
    title: 'Manufacturer',
    key: 'Manufacturer',
    width: 100
  },
  {
    title: 'Model',
    key: 'Model',
    width: 50
  },
  {
    title: 'Owner',
    key: 'Owner',
    width: 70
  },
  {
    title: 'Address',
    key: 'Address',
    width: 120
  },
];
export const columns = [
  {
    title: 'ID',
    key: 'ID',
    width: 100
  },
  {
    title: 'Name',
    key: 'Name',
    width: 70
  },
  {
    title: 'Status',
    key: 'Status',
    width: 70
  },
  {
    title: 'Manufacturer',
    key: 'Manufacturer',
    width: 100
  },
  {
    title: 'Model',
    key: 'Model',
    width: 50
  },
  {
    title: 'Owner',
    key: 'Owner',
    width: 70
  },
  {
    title: 'RegisterTime',
    key: 'RegisterTime',
    width: 130,
    render(row) {
      return h(NTime, row.RegisterTime);
    }
  },
  {
    title: 'UpdateTIme',
    key: 'UpdateTIme',
    width: 130,
    render(row) {
      return h(NTime, row.UpdateTIme);
    }
  },

  {
    title: 'NetAddr',
    key: 'NetAddr',
    width: 120
  },
  {
    type: 'expand',
    expandable: (rowData) => rowData.Channels.length > 0,
    renderExpand: (rowData) => {
      return h(BasicTable, { pagination: false, dataSource: rowData.Channels, columns: channelsColumns });
    }
  },
  {
    title: 'Channels',
    key: 'Channels',
    width: 70,
    render(row) {
      return h('text', row.Channels.length);
    }
  }
];
