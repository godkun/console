import{B as s}from"./TableAction-1422fddb.js";import{_}from"./index-5b101bf5.js";import{t as h,v as p}from"./index-5c5eb8e0.js";import{h as V}from"./vendor-1e70d1e5.js";import{u as y}from"./pluginConfig-bd4b19bf.js";import{_ as f}from"./index-6f9c12d4.js";import"./useDesignSetting-2272415f.js";const w=(n,e)=>[{title:"通道编号",key:"DeviceID",width:100},{title:"拉流状态",render(t){return t.LivePublisher?Vue.h("text","🟢"):Vue.h(naive.NButton,{tertiary:!0,circle:!0,type:"primary",onClick:()=>{h(n,e,t.DeviceID)}},"▶️")},width:50},{title:"Name",key:"Name",width:50},{title:"Status",key:"Status",width:50},{title:"Manufacturer",key:"Manufacturer",width:50},{title:"Model",key:"Model",width:50},{title:"Owner",key:"Owner",width:50},{title:"Address",key:"Address",width:120},{title:"经度",key:"Longitude",width:50},{title:"纬度",key:"Latitude",width:50}],k=n=>[{type:"expand",expandable:e=>e.Channels.length>0,renderExpand:e=>Vue.h(s,{pagination:!1,"row-key":t=>t.DeviceID,dataSource:e.Channels.sort((t,r)=>t.DeviceID.localeCompare(r.DeviceID)),columns:w(n,e.ID),title:"通道",titleTooltip:e.ID})},{title:"设备编号",key:"ID",width:150},{title:"Name",key:"Name",width:70},{title:"Status",key:"Status",width:70},{title:"Manufacturer",key:"Manufacturer",width:100},{title:"Model",key:"Model",width:50},{title:"Owner",key:"Owner",width:70},{title:"RegisterTime",key:"RegisterTime",width:130,render(e){return Vue.h(naive.NTime,{time:new Date(e.RegisterTime),type:"relative"})}},{title:"UpdateTime",key:"UpdateTime",width:130,render(e){return Vue.h(naive.NTime,{time:new Date(e.UpdateTime),type:"relative"})}},{title:"NetAddr",key:"NetAddr",width:120},{title:"Channels",key:"Channels",width:70,render(e){return Vue.h("text",e.Channels.length)}}];const v={key:0},C=Vue.createTextVNode(" 当前实例未安装插件，无法使用此功能 "),D={key:1},x={class:"top"},g=Vue.createTextVNode(" GB28181 "),N=Vue.defineComponent({__name:"index",setup(n){const e=Vue.ref([]),{params:t}=V(),r=y(),u=Vue.ref(!1);r.getConfig(t.id,"GB28181").catch(i=>{u.value=!0});async function l(){const i=await p(t.id)||[];Array.isArray(i)&&(e.value=i.sort((o,a)=>o.ID.localeCompare(a.ID)))}return(i,o)=>{const a=Vue.resolveComponent("n-alert"),d=Vue.resolveComponent("n-gradient-text"),c=Vue.resolveComponent("n-card");return u.value?(Vue.openBlock(),Vue.createElementBlock("div",v,[Vue.createVNode(a,{title:"当前页面不可用",type:"error"},{default:Vue.withCtx(()=>[C]),_:1})])):(Vue.openBlock(),Vue.createElementBlock("div",D,[Vue.createElementVNode("div",x,[Vue.createVNode(Vue.unref(_),{onTick:l})]),Vue.createVNode(c,{bordered:!1,class:"proCard"},{default:Vue.withCtx(()=>[Vue.createVNode(Vue.unref(s),{class:"table","row-class-name":"row",columns:Vue.unref(k)(Vue.unref(t).id),dataSource:e.value,pagination:!1,"row-key":m=>m.ID,"scroll-x":1090},{tableTitle:Vue.withCtx(()=>[Vue.createVNode(d,{type:"success"},{default:Vue.withCtx(()=>[g]),_:1})]),_:1},8,["columns","dataSource","row-key"])]),_:1})]))}}}),b=f(N,[["__scopeId","data-v-2c2ae828"]]);export{b as default};