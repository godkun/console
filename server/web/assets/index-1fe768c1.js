import{T as y,B as x}from"./TableAction-859c4e98.js";import{_ as N}from"./index-5b101bf5.js";import{h as A}from"./vendor-1e70d1e5.js";import{h as B,i as P,j as b}from"./index-5c1076ad.js";import{_ as S}from"./index-20ae1759.js";import"./useDesignSetting-4e44141c.js";const k=[{title:"开始时间",key:"StartTime",width:160,render(m){return Vue.h(naive.NTime,{time:new Date(m.StartTime),type:"relative"})}},{title:"类型",key:"Type",width:100},{title:"推流地址",key:"RemoteURL"},{title:"StreamPath",key:"StreamPath"}];const E={class:"top"},T=Vue.createTextVNode("添加推流"),R=Vue.createTextVNode("取消"),U=Vue.createTextVNode("确定"),W=Vue.defineComponent({__name:"index",setup(m){const r=naive.useMessage(),a=Vue.reactive({target:"",streamPath:"",save:!1}),n=Vue.ref(!1),d=Vue.ref([]),s=Vue.ref(!1),{params:V}=A(),l=V.id,f={target:{required:!0,message:"请输入远端流地址",trigger:"blur",validator(t,e){return e?e.startsWith("rtsp")||e.startsWith("rtmp")?!0:(t.message="only support rtsp,rtmp",!1):(t.message="请输入远端流地址",!1)}},streamPath:{required:!0,message:"请输入StreamPath",trigger:"blur",validator(t,e){return e?e.split("/").length==1?(t.message="StreamPath必须包含/",!1):e.startsWith("/")?(t.message="StreamPath开头不能包含/",!1):e.endsWith("/")?(t.message="StreamPath结尾不能包含/",!1):!0:(t.message="请输入StreamPath",!1)}}};async function _(){d.value=await B(l)}async function h(){n.value=!0;const{target:t,streamPath:e}=Vue.toRaw(a);let o="rtmp";if(t.startsWith("rtsp"))o="rtsp";else if(t.startsWith("rtmp"))o="rtmp";else{r.error("type not support"),n.value=!1;return}try{await P(l,o,e,encodeURI(t)),n.value=!1,s.value=!1,r.success("成功推到远端流")}catch(i){n.value=!1,r.error(i)}}async function v(t){try{await b(l,t.RemoteURL),r.success("停止推流成功")}catch(e){r.error(e.toString())}}const C=Vue.reactive({title:"操作",key:"action",fixed:"right",width:100,render(t){return Vue.h(y,{style:"button",actions:[{label:"停止推流",type:"error",icon:"ic:outline-delete-outline",onClick:v.bind(null,t),ifShow:()=>!0}]})}});return(t,e)=>{const o=Vue.resolveComponent("n-button"),i=Vue.resolveComponent("n-card"),p=Vue.resolveComponent("n-input"),c=Vue.resolveComponent("n-form-item"),F=Vue.resolveComponent("n-switch"),w=Vue.resolveComponent("n-form"),D=Vue.resolveComponent("n-space"),g=Vue.resolveComponent("n-modal");return Vue.openBlock(),Vue.createElementBlock("div",null,[Vue.createElementVNode("div",E,[Vue.createVNode(Vue.unref(N),{onTick:_})]),Vue.createVNode(i,{bordered:!1,class:"proCard"},{default:Vue.withCtx(()=>[Vue.createVNode(Vue.unref(x),{title:"向远端推流列表",class:"table","row-class-name":"row",columns:Vue.unref(k),dataSource:d.value,pagination:!1,actionColumn:C,"row-key":u=>u.id,"scroll-x":1090},{toolbar:Vue.withCtx(()=>[Vue.createVNode(o,{onClick:e[0]||(e[0]=u=>s.value=!0),type:"primary",round:""},{default:Vue.withCtx(()=>[T]),_:1})]),_:1},8,["columns","dataSource","actionColumn","row-key"])]),_:1}),Vue.createVNode(g,{show:s.value,"onUpdate:show":e[5]||(e[5]=u=>s.value=u),"show-icon":!1,preset:"dialog",title:"向远端服务器推流"},{action:Vue.withCtx(()=>[Vue.createVNode(D,null,{default:Vue.withCtx(()=>[Vue.createVNode(o,{onClick:e[4]||(e[4]=()=>s.value=!1)},{default:Vue.withCtx(()=>[R]),_:1}),Vue.createVNode(o,{type:"info",loading:n.value,onClick:h},{default:Vue.withCtx(()=>[U]),_:1},8,["loading"])]),_:1})]),default:Vue.withCtx(()=>[Vue.createVNode(w,{model:a,rules:f,ref:"formRef","label-placement":"left","label-width":80,class:"py-4"},{default:Vue.withCtx(()=>[Vue.createVNode(c,{label:"远端流地址",path:"target"},{default:Vue.withCtx(()=>[Vue.createVNode(p,{placeholder:"请输入远端服务器推流地址",value:a.target,"onUpdate:value":e[1]||(e[1]=u=>a.target=u)},null,8,["value"])]),_:1}),Vue.createVNode(c,{label:"StreamPath",path:"streamPath"},{default:Vue.withCtx(()=>[Vue.createVNode(p,{placeholder:"请输入StreamPath",value:a.streamPath,"onUpdate:value":e[2]||(e[2]=u=>a.streamPath=u)},null,8,["value"])]),_:1}),Vue.createVNode(c,{label:"重启后恢复",path:"save"},{default:Vue.withCtx(()=>[Vue.createVNode(F,{value:a.save,"onUpdate:value":e[3]||(e[3]=u=>a.save=u)},null,8,["value"])]),_:1})]),_:1},8,["model"])]),_:1},8,["show"])])}}}),z=S(W,[["__scopeId","data-v-1daf01c9"]]);export{z as default};
