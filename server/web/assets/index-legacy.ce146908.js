System.register(["./TableAction-legacy.c2cce013.js","./index-legacy.4f2ba292.js","./vendor-legacy.9d0d38ef.js","./index-legacy.d1f2a5dd.js","./index-legacy.ee50fea4.js","./useDesignSetting-legacy.ecb6b3a9.js"],(function(e,t){"use strict";var a,r,l,o,u,n,s,i,d=document.createElement("style");return d.textContent=".top[data-v-eaa4fff8]{display:flex}.n-gradient-text[data-v-eaa4fff8]{font-size:24px}\n",document.head.appendChild(d),{setters:[e=>{a=e.T,r=e.B},e=>{l=e._},e=>{o=e.i},e=>{u=e.f,n=e.p,s=e.s},e=>{i=e._},null],execute:function(){const t=[{title:"开始时间",key:"StartTime",width:160,render:e=>Vue.h(naive.NTime,{time:new Date(e.StartTime),type:"relative"})},{title:"类型",key:"Type",width:100},{title:"拉流地址",key:"RemoteURL"},{title:"StreamPath",key:"StreamPath"}],d={class:"top"},c=Vue.createTextVNode("添加拉流"),V=Vue.createTextVNode("取消"),h=Vue.createTextVNode("确定");e("default",i(Vue.defineComponent({__name:"index",setup(e){const{params:i}=o(),m=naive.useMessage(),p=Vue.reactive({target:"",streamPath:"",save:!1}),v=Vue.ref(!1),f=Vue.ref([]),g=Vue.ref(!1),y={target:{required:!0,message:"请输入远端流地址",trigger:"blur",validator:(e,t)=>t?!(!t.startsWith("rtsp")&&!t.startsWith("rtmp")&&!/\.m3u8($|\?)/.test(t)&&!t.startsWith("http")&&(e.message="only support rtsp,rtmp,hls,hdl",1)):(e.message="请输入远端流地址",!1)},streamPath:{required:!0,message:"请输入StreamPath",trigger:"blur",validator:(e,t)=>t?1==t.split("/").length?(e.message="StreamPath必须包含/",!1):t.startsWith("/")?(e.message="StreamPath开头不能包含/",!1):!t.endsWith("/")||(e.message="StreamPath结尾不能包含/",!1):(e.message="请输入StreamPath",!1)}};async function w(){f.value=await u(i.id)}async function C(){v.value=!0;const{target:e,streamPath:t}=Vue.toRaw(p);let a="hdl";if(e.startsWith("rtsp"))a="rtsp";else if(e.startsWith("rtmp"))a="rtmp";else if(/\.m3u8($|\?)/.test(e))a="hls";else{if(!e.startsWith("http"))return m.error("type not support"),void(v.value=!1);a="hdl"}try{await n(i.id,a,t,e),v.value=!1,g.value=!1,m.success("成功导入远端流")}catch(r){v.value=!1,m.error(r)}}async function x(e){try{await s(i.id,e.StreamPath),m.success("删除成功")}catch(t){m.error(t.toString())}}const N=Vue.reactive({title:"操作",key:"action",fixed:"right",width:100,render:e=>Vue.h(a,{style:"button",actions:[{label:"删除",type:"error",icon:"ic:outline-delete-outline",onClick:x.bind(null,e),ifShow:()=>!0}]})});return(e,a)=>{const o=Vue.resolveComponent("n-button"),u=Vue.resolveComponent("n-card"),n=Vue.resolveComponent("n-input"),s=Vue.resolveComponent("n-form-item"),i=Vue.resolveComponent("n-switch"),m=Vue.resolveComponent("n-form"),x=Vue.resolveComponent("n-space"),S=Vue.resolveComponent("n-modal");return Vue.openBlock(),Vue.createElementBlock("div",null,[Vue.createElementVNode("div",d,[Vue.createVNode(Vue.unref(l),{onTick:w})]),Vue.createVNode(u,{bordered:!1,class:"proCard"},{default:Vue.withCtx((()=>[Vue.createVNode(Vue.unref(r),{title:"远端拉流列表",class:"table","row-class-name":"row",columns:Vue.unref(t),dataSource:f.value,pagination:!1,actionColumn:N,"row-key":e=>e.id,"scroll-x":1090},{toolbar:Vue.withCtx((()=>[Vue.createVNode(o,{onClick:a[0]||(a[0]=e=>g.value=!0),type:"primary",round:""},{default:Vue.withCtx((()=>[c])),_:1})])),_:1},8,["columns","dataSource","actionColumn","row-key"])])),_:1}),Vue.createVNode(S,{show:g.value,"onUpdate:show":a[5]||(a[5]=e=>g.value=e),"show-icon":!1,preset:"dialog",title:"从远端服务器导入流"},{action:Vue.withCtx((()=>[Vue.createVNode(x,null,{default:Vue.withCtx((()=>[Vue.createVNode(o,{onClick:a[4]||(a[4]=()=>g.value=!1)},{default:Vue.withCtx((()=>[V])),_:1}),Vue.createVNode(o,{type:"info",loading:v.value,onClick:C},{default:Vue.withCtx((()=>[h])),_:1},8,["loading"])])),_:1})])),default:Vue.withCtx((()=>[Vue.createVNode(m,{model:p,rules:y,ref:"formRef","label-placement":"left","label-width":80,class:"py-4"},{default:Vue.withCtx((()=>[Vue.createVNode(s,{label:"远端流地址",path:"target"},{default:Vue.withCtx((()=>[Vue.createVNode(n,{placeholder:"请输入远端流的地址",value:p.target,"onUpdate:value":a[1]||(a[1]=e=>p.target=e)},null,8,["value"])])),_:1}),Vue.createVNode(s,{label:"StreamPath",path:"streamPath"},{default:Vue.withCtx((()=>[Vue.createVNode(n,{placeholder:"请输入StreamPath",value:p.streamPath,"onUpdate:value":a[2]||(a[2]=e=>p.streamPath=e)},null,8,["value"])])),_:1}),Vue.createVNode(s,{label:"重启后恢复",path:"save"},{default:Vue.withCtx((()=>[Vue.createVNode(i,{value:p.save,"onUpdate:value":a[3]||(a[3]=e=>p.save=e)},null,8,["value"])])),_:1})])),_:1},8,["model"])])),_:1},8,["show"])])}}}),[["__scopeId","data-v-eaa4fff8"]]))}}}));