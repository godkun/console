System.register(["./vendor-legacy.9d0d38ef.js","./TableAction-legacy.c2cce013.js","./index-legacy.d1f2a5dd.js","./index-legacy.ee50fea4.js","./useDesignSetting-legacy.ecb6b3a9.js"],(function(e,t){"use strict";var a,n,u,o,l,r,i,c,s=document.createElement("style");return s.textContent=".n-gradient-text[data-v-fa52488a]{font-size:24px}\n",document.head.appendChild(s),{setters:[e=>{a=e.g,n=e.i},e=>{u=e.T,o=e.B},e=>{l=e.d,r=e.e,i=e.u},e=>{c=e._},null],execute:function(){const t=[{title:"名称",render:e=>!1===e.RawConfig.enabled?Vue.h("div",[Vue.h("text",e.Name),Vue.h(naive.NTag,{type:"primary"},"禁用")]):Vue.h("text",e.Name),width:100},{title:"版本",key:"Version",width:200}],s=Vue.createTextVNode("取消"),d=Vue.createTextVNode("确定"),V=Vue.defineComponent({__name:"index",setup(e){const c=a(),V=n(),{query:m,params:f}=V,v={name:{required:!0,trigger:["blur","input"],message:"请输入名称"}},p=Vue.ref(null),h=naive.useMessage(),C=Vue.ref(),y=Vue.ref(!1),g=Vue.ref(!1),w=Vue.reactive({name:"",url:""}),x=Vue.ref(""),N=Vue.ref([]),_=Vue.ref({id:"",name:"",mail:"",secret:""}),b=Vue.reactive({width:220,title:"操作",key:"action",render:e=>Vue.h(u,{style:"button",actions:[{label:"配置",type:"primary",icon:"ic:outline-delete-outline",onClick:k.bind(null,e),ifShow:()=>{for(let t=0;t<N.value.length;t++){const a=N.value[t];if(a.Name==e.Name)return!!a.RawConfig}}}],select:e=>{h.info(`您点击了，${e} 按钮`)}})});function k(e){const t=m.id,a=e.Name;c.push({name:"config",query:{id:t,name:a}})}function T(e){}function j(){C.value.reload()}function R(e){e.preventDefault(),g.value=!0,p.value.validate((e=>{if(e)h.error("请填写完整信息");else if("新建实例"==x.value){const e=w.name;r({name:e}).then((()=>{h.success("新建成功"),setTimeout((()=>{y.value=!1,j()}))}))}else if("更新实例"==x.value){const e=w.name,t=_.value.id,a=_.value.secret;i({name:e,id:t,secret:a}).then((()=>{h.success("更新成功"),setTimeout((()=>{y.value=!1,j()}))}))}g.value=!1}))}return async function(){const e=await l(f.id);N.value=Object.values(e).sort(((e,t)=>e.Name.localeCompare(t.Name)))}(),(e,a)=>{const n=Vue.resolveComponent("n-input"),u=Vue.resolveComponent("n-form-item"),l=Vue.resolveComponent("n-form"),r=Vue.resolveComponent("n-button"),i=Vue.resolveComponent("n-space"),c=Vue.resolveComponent("n-modal"),V=Vue.resolveComponent("n-card");return Vue.openBlock(),Vue.createElementBlock("div",null,[Vue.createVNode(V,{bordered:!1,class:"proCard"},{default:Vue.withCtx((()=>[Vue.createVNode(Vue.unref(o),{title:"插件列表",columns:Vue.unref(t),dataSource:N.value,"row-key":e=>e.id,pagination:!1,ref_key:"actionRef",ref:C,actionColumn:b,"onUpdate:checkedRowKeys":T,"scroll-x":1090},null,8,["columns","dataSource","row-key","actionColumn"]),Vue.createVNode(c,{show:y.value,"onUpdate:show":a[2]||(a[2]=e=>y.value=e),"show-icon":!1,preset:"dialog",title:x.value},{action:Vue.withCtx((()=>[Vue.createVNode(i,null,{default:Vue.withCtx((()=>[Vue.createVNode(r,{onClick:a[1]||(a[1]=()=>y.value=!1)},{default:Vue.withCtx((()=>[s])),_:1}),Vue.createVNode(r,{type:"info",loading:g.value,onClick:R},{default:Vue.withCtx((()=>[d])),_:1},8,["loading"])])),_:1})])),default:Vue.withCtx((()=>[Vue.createVNode(l,{model:w,rules:v,ref_key:"formRef",ref:p,"label-placement":"left","label-width":80,class:"py-4"},{default:Vue.withCtx((()=>[Vue.createVNode(u,{label:"名称",path:"name"},{default:Vue.withCtx((()=>[Vue.createVNode(n,{placeholder:"请输入实例名称",value:w.name,"onUpdate:value":a[0]||(a[0]=e=>w.name=e)},null,8,["value"])])),_:1})])),_:1},8,["model"])])),_:1},8,["show","title"])])),_:1})])}}});e("default",c(V,[["__scopeId","data-v-fa52488a"]]))}}}));