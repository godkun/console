import { h } from 'vue';
export const columns = [
  {
    title: 'StreamPath',
    key: 'Path',
    width: 100
  },
  {
    title: '类型',
    key: 'Type',
    width: 50
  },
  {
    title: '订阅者',
    key: 'Subscribers',
    width: 50
  },
  {
    title: '开始时间',
    key: 'StartTime',
    width: 100
  },
  {
    title: 'BPS',
    key: 'BPS',
    width: 100,
    render(row) {
      let bps = row.BPS << 3;
      if (bps > 1024 * 1024) {
        return h('text', (bps / 1024 / 1024).toFixed(2) + ' mb/s');
      }
      if (bps > 1024) {
        return h('text', (bps / 1024).toFixed(2) + ' kb/s');
      }
      return h('text', bps + ' b/s');
    }
  }
  // {
  //   title: '音频格式',
  //   key: 'soundFormat',
  //   width: 100
  // },
  // {
  //   title: '采样率',
  //   key: 'SoundRate',
  //   width: 100
  // },
  // {
  //   title: '声道',
  //   key: 'SoundType',
  //   width: 100
  // },
  // {
  //   title: '视频格式',
  //   key: 'CodecID',
  //   width: 100
  // },
  // {
  //   title: '分辨率',
  //   key: 'Resolution',
  //   width: 100
  // },
  // {
  //   title: 'GOP',
  //   key: 'GOP',
  //   width: 100
  // },
  // {
  //   title: '码率A/V',
  //   key: 'BPS',
  //   width: 100
  // },
];
