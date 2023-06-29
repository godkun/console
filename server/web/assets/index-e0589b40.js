import{B as e}from"./TableAction-c17a6634.js";import{_ as t}from"./index-b3347c9f.js";import{r as i,t as r}from"./index-8caa8cc3.js";import{i as a}from"./vendor-2e943313.js";import{u as n}from"./pluginConfig-e0cd097d.js";import{_ as o}from"./index-dbd922fe.js";import"./useDesignSetting-a0c3f2ea.js";const d=(e,t)=>[{title:"通道编号",key:"DeviceID",width:100},{title:"拉流状态",render:r=>r.LivePublisher?Vue.h("text","🟢"):Vue.h(naive.NButton,{tertiary:!0,circle:!0,type:"primary",onClick:()=>{i(e,t,r.DeviceID)}},"▶️"),width:50},{title:"Name",key:"Name",width:50},{title:"Status",key:"Status",width:50},{title:"Manufacturer",key:"Manufacturer",width:50},{title:"Model",key:"Model",width:50},{title:"Owner",key:"Owner",width:50},{title:"Address",key:"Address",width:120},{title:"经度",key:"Longitude",width:50},{title:"纬度",key:"Latitude",width:50}],l=t=>[{type:"expand",expandable:e=>e.Channels.length>0,renderExpand:i=>Vue.h(e,{pagination:!1,"row-key":e=>e.DeviceID,dataSource:i.Channels.sort(((e,t)=>e.DeviceID.localeCompare(t.DeviceID))),columns:d(t,i.ID),title:"通道",titleTooltip:i.ID})},{title:"设备编号",key:"ID",width:150},{title:"Name",key:"Name",width:70},{title:"Status",key:"Status",width:70},{title:"Manufacturer",key:"Manufacturer",width:100},{title:"Model",key:"Model",width:50},{title:"Owner",key:"Owner",width:70},{title:"RegisterTime",key:"RegisterTime",width:130,render:e=>Vue.h(naive.NTime,{time:new Date(e.RegisterTime),type:"relative"})},{title:"UpdateTime",key:"UpdateTime",width:130,render:e=>Vue.h(naive.NTime,{time:new Date(e.UpdateTime),type:"relative"})},{title:"NetAddr",key:"NetAddr",width:120},{title:"Channels",key:"Channels",width:70,render:e=>Vue.h("text",e.Channels.length)}],u={key:0},s=Vue.createTextVNode(" 当前实例未安装插件，无法使用此功能 "),c={key:1},m={class:"top"},V=Vue.createTextVNode(" GB28181 "),h=o(Vue.defineComponent({__name:"index",setup(i){const o=Vue.ref([]),{params:d}=a(),h=n(),p=Vue.ref(!1);async function w(){const e=await r(d.id)||[];Array.isArray(e)&&(o.value=e.sort(((e,t)=>e.ID.localeCompare(t.ID))))}return h.getConfig(d.id,"GB28181").catch((e=>{p.value=!0})),(i,r)=>{const a=Vue.resolveComponent("n-alert"),n=Vue.resolveComponent("n-gradient-text"),h=Vue.resolveComponent("n-card");return p.value?(Vue.openBlock(),Vue.createElementBlock("div",u,[Vue.createVNode(a,{title:"当前页面不可用",type:"error"},{default:Vue.withCtx((()=>[s])),_:1})])):(Vue.openBlock(),Vue.createElementBlock("div",c,[Vue.createElementVNode("div",m,[Vue.createVNode(Vue.unref(t),{onTick:w})]),Vue.createVNode(h,{bordered:!1,class:"proCard"},{default:Vue.withCtx((()=>[Vue.createVNode(Vue.unref(e),{class:"table","row-class-name":"row",columns:Vue.unref(l)(Vue.unref(d).id),dataSource:o.value,pagination:!1,"row-key":e=>e.ID,"scroll-x":1090},{tableTitle:Vue.withCtx((()=>[Vue.createVNode(n,{type:"success"},{default:Vue.withCtx((()=>[V])),_:1})])),_:1},8,["columns","dataSource","row-key"])])),_:1})]))}}}),[["__scopeId","data-v-53fcc35c"]]);export{h as default};