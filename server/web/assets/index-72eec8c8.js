import{_ as e}from"./index-b3347c9f.js";import{B as t}from"./TableAction-c17a6634.js";import{l as a,n as o,o as u,q as l}from"./index-8caa8cc3.js";import{i as n}from"./vendor-2e943313.js";import"./useDesignSetting-a0c3f2ea.js";import"./index-dbd922fe.js";const r=Vue.createTextVNode("开始录制"),i=Vue.createTextVNode("开始录制"),s=Vue.defineComponent({__name:"index",setup(s){const V=Vue.ref(""),d=Vue.ref("flv"),c=naive.useMessage(),v=Vue.ref(!1),{params:p}=n();const m=[{title:"ID",key:"ID"},{title:"Type",key:"Type",width:150},{title:"开始时间",render:e=>Vue.h(naive.NTime,{type:"relative",time:new Date(e.StartTime)}),width:150}],h={title:"操作",key:"action",width:100,render:e=>Vue.h(naive.NButton,{type:"error",size:"small",onClick:()=>{o(p.id,e.ID).then((e=>{"ok"==e?c.success("停止录制成功"):c.error("停止录制失败")})).catch((e=>{c.error(e)}))}},["停止"])},w=[{title:"文件",key:"Path"},{title:"大小",render:e=>{return Vue.h("text",(t=e.Size)>1048576?(t/1024/1024).toFixed(2)+" MB":t>1024?(t/1024).toFixed(2)+" KB":t.toString()+" B");var t},width:100},{title:"时长",key:"Duration",width:100}],f=[],x=Vue.ref([]),C=Vue.ref([]);function y(){u(p.id).then((e=>{C.value=e||[],C.value=C.value.sort(((e,t)=>e.ID.localeCompare(t.ID)))}))}return a(p.id).then((e=>{x.value=e||[],x.value=x.value.sort(((e,t)=>e.Path.localeCompare(t.Path)))})),(a,o)=>{const u=Vue.resolveComponent("n-tab-pane"),n=Vue.resolveComponent("n-tabs"),s=Vue.resolveComponent("n-layout-content"),k=Vue.resolveComponent("n-radio-button"),N=Vue.resolveComponent("n-radio-group"),g=Vue.resolveComponent("n-input"),b=Vue.resolveComponent("n-modal"),_=Vue.resolveComponent("n-layout");return Vue.openBlock(),Vue.createBlock(_,null,{default:Vue.withCtx((()=>[Vue.createVNode(s,{"content-style":"padding: 24px;"},{default:Vue.withCtx((()=>[Vue.createVNode(n,{type:"line",animated:""},{default:Vue.withCtx((()=>[Vue.createVNode(u,{name:"filelist",tab:"录像文件列表"},{default:Vue.withCtx((()=>[Vue.createVNode(Vue.unref(t),{title:"录像文件列表",class:"table","row-class-name":"row",columns:w,dataSource:x.value,pagination:{simple:!0},actionColumn:f,"row-key":e=>e.Name,"scroll-x":1090},{toolbar:Vue.withCtx((()=>[Vue.createVNode(Vue.unref(naive.NButton),{onClick:o[0]||(o[0]=e=>v.value=!0)},{default:Vue.withCtx((()=>[r])),_:1})])),_:1},8,["dataSource","row-key"])])),_:1}),Vue.createVNode(u,{name:"recording",tab:"正在录制列表"},{default:Vue.withCtx((()=>[Vue.createVNode(Vue.unref(t),{title:"正在录制的流列表",class:"table","row-class-name":"row",columns:m,dataSource:C.value,pagination:{simple:!0},actionColumn:h,"row-key":e=>e.ID,"scroll-x":1090},{toolbar:Vue.withCtx((()=>[Vue.createVNode(Vue.unref(e),{onTick:y,style:{padding:"0 20px 0 0"}}),Vue.createVNode(Vue.unref(naive.NButton),{onClick:o[1]||(o[1]=e=>v.value=!0)},{default:Vue.withCtx((()=>[i])),_:1})])),_:1},8,["dataSource","row-key"])])),_:1})])),_:1})])),_:1}),Vue.createVNode(b,{show:v.value,"onUpdate:show":o[4]||(o[4]=e=>v.value=e),style:{width:"600px"},title:"开始录制",bordered:!1,size:"huge",preset:"dialog","positive-text":"确认","negative-text":"算了",onPositiveClick:o[5]||(o[5]=e=>{l(p.id,V.value,d.value).then((e=>{e?c.success("开始录制成功"):c.error("开始录制失败")})).catch((e=>{c.error(e)}))})},{default:Vue.withCtx((()=>[Vue.createVNode(N,{value:d.value,"onUpdate:value":o[2]||(o[2]=e=>d.value=e),name:"radiobuttongroup1"},{default:Vue.withCtx((()=>[(Vue.openBlock(),Vue.createElementBlock(Vue.Fragment,null,Vue.renderList(["flv","mp4","hls","raw"],(e=>Vue.createVNode(k,{key:e,value:e,label:e},null,8,["value","label"]))),64))])),_:1},8,["value"]),Vue.createVNode(g,{value:V.value,"onUpdate:value":o[3]||(o[3]=e=>V.value=e),placeholder:"输入需要录制的StreamPath"},null,8,["value"])])),_:1},8,["show"])])),_:1})}}});export{s as default};