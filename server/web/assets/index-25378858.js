import{T as e,B as t}from"./TableAction-c17a6634.js";import{_ as a}from"./index-b3347c9f.js";import{i as r}from"./vendor-2e943313.js";import{h as o,i as u,j as l}from"./index-8caa8cc3.js";import{_ as s}from"./index-dbd922fe.js";import"./useDesignSetting-a0c3f2ea.js";const n=[{title:"开始时间",key:"StartTime",width:160,render:e=>Vue.h(naive.NTime,{time:new Date(e.StartTime),type:"relative"})},{title:"类型",key:"Type",width:100},{title:"推流地址",key:"RemoteURL"},{title:"StreamPath",key:"StreamPath"}],i={class:"top"},d=Vue.createTextVNode("添加推流"),c=Vue.createTextVNode("取消"),m=Vue.createTextVNode("确定"),V=s(Vue.defineComponent({__name:"index",setup(s){const V=naive.useMessage(),p=Vue.reactive({target:"",streamPath:"",save:!1}),h=Vue.ref(!1),v=Vue.ref([]),f=Vue.ref(!1),{params:w}=r(),g=w.id,C={target:{required:!0,message:"请输入远端流地址",trigger:"blur",validator:(e,t)=>t?!!t.startsWith("rtsp")||(!!t.startsWith("rtmp")||(e.message="only support rtsp,rtmp",!1)):(e.message="请输入远端流地址",!1)},streamPath:{required:!0,message:"请输入StreamPath",trigger:"blur",validator:(e,t)=>t?1==t.split("/").length?(e.message="StreamPath必须包含/",!1):t.startsWith("/")?(e.message="StreamPath开头不能包含/",!1):!t.endsWith("/")||(e.message="StreamPath结尾不能包含/",!1):(e.message="请输入StreamPath",!1)}};async function x(){v.value=await o(g)}async function y(){h.value=!0;const{target:e,streamPath:t}=Vue.toRaw(p);let a="rtmp";if(e.startsWith("rtsp"))a="rtsp";else{if(!e.startsWith("rtmp"))return V.error("type not support"),void(h.value=!1);a="rtmp"}try{await u(g,a,t,e),h.value=!1,f.value=!1,V.success("成功推到远端流")}catch(r){h.value=!1,V.error(r)}}async function N(e){try{await l(g,e.RemoteURL),V.success("停止推流成功")}catch(t){V.error(t.toString())}}const _=Vue.reactive({title:"操作",key:"action",fixed:"right",width:100,render:t=>Vue.h(e,{style:"button",actions:[{label:"停止推流",type:"error",icon:"ic:outline-delete-outline",onClick:N.bind(null,t),ifShow:()=>!0}]})});return(e,r)=>{const o=Vue.resolveComponent("n-button"),u=Vue.resolveComponent("n-card"),l=Vue.resolveComponent("n-input"),s=Vue.resolveComponent("n-form-item"),V=Vue.resolveComponent("n-switch"),w=Vue.resolveComponent("n-form"),g=Vue.resolveComponent("n-space"),N=Vue.resolveComponent("n-modal");return Vue.openBlock(),Vue.createElementBlock("div",null,[Vue.createElementVNode("div",i,[Vue.createVNode(Vue.unref(a),{onTick:x})]),Vue.createVNode(u,{bordered:!1,class:"proCard"},{default:Vue.withCtx((()=>[Vue.createVNode(Vue.unref(t),{title:"向远端推流列表",class:"table","row-class-name":"row",columns:Vue.unref(n),dataSource:v.value,pagination:!1,actionColumn:_,"row-key":e=>e.id,"scroll-x":1090},{toolbar:Vue.withCtx((()=>[Vue.createVNode(o,{onClick:r[0]||(r[0]=e=>f.value=!0),type:"primary",round:""},{default:Vue.withCtx((()=>[d])),_:1})])),_:1},8,["columns","dataSource","actionColumn","row-key"])])),_:1}),Vue.createVNode(N,{show:f.value,"onUpdate:show":r[5]||(r[5]=e=>f.value=e),"show-icon":!1,preset:"dialog",title:"向远端服务器推流"},{action:Vue.withCtx((()=>[Vue.createVNode(g,null,{default:Vue.withCtx((()=>[Vue.createVNode(o,{onClick:r[4]||(r[4]=()=>f.value=!1)},{default:Vue.withCtx((()=>[c])),_:1}),Vue.createVNode(o,{type:"info",loading:h.value,onClick:y},{default:Vue.withCtx((()=>[m])),_:1},8,["loading"])])),_:1})])),default:Vue.withCtx((()=>[Vue.createVNode(w,{model:p,rules:C,ref:"formRef","label-placement":"left","label-width":80,class:"py-4"},{default:Vue.withCtx((()=>[Vue.createVNode(s,{label:"远端流地址",path:"target"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{placeholder:"请输入远端服务器推流地址",value:p.target,"onUpdate:value":r[1]||(r[1]=e=>p.target=e)},null,8,["value"])])),_:1}),Vue.createVNode(s,{label:"StreamPath",path:"streamPath"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{placeholder:"请输入StreamPath",value:p.streamPath,"onUpdate:value":r[2]||(r[2]=e=>p.streamPath=e)},null,8,["value"])])),_:1}),Vue.createVNode(s,{label:"重启后恢复",path:"save"},{default:Vue.withCtx((()=>[Vue.createVNode(V,{value:p.save,"onUpdate:value":r[3]||(r[3]=e=>p.save=e)},null,8,["value"])])),_:1})])),_:1},8,["model"])])),_:1},8,["show"])])}}}),[["__scopeId","data-v-77f1747e"]]);export{V as default};