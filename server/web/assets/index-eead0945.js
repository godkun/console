import{f as R,h as T}from"./vendor-1e70d1e5.js";import{T as A,B as I}from"./TableAction-859c4e98.js";import{d as P,e as q,u as S}from"./index-5c1076ad.js";import{_ as U}from"./index-20ae1759.js";import"./useDesignSetting-4e44141c.js";const M=[{title:"名称",render(l){return l.RawConfig.enabled===!1?Vue.h("div",[Vue.h("text",l.Name),Vue.h(naive.NTag,{type:"primary"},"禁用")]):Vue.h("text",l.Name)},width:100},{title:"版本",key:"Version",width:200}];const j=Vue.createTextVNode("取消"),K=Vue.createTextVNode("确定"),L=Vue.defineComponent({__name:"index",setup(l){const C=R(),h=T(),{query:F,params:g}=h,w={name:{required:!0,trigger:["blur","input"],message:"请输入名称"}},f=Vue.ref(null),s=naive.useMessage(),V=Vue.ref(),n=Vue.ref(!1),c=Vue.ref(!1),o=Vue.reactive({name:"",url:""}),i=Vue.ref(""),r=Vue.ref([]),p=Vue.ref({id:"",name:"",mail:"",secret:""}),B=Vue.reactive({width:220,title:"操作",key:"action",render(u){return Vue.h(A,{style:"button",actions:[{label:"配置",type:"primary",icon:"ic:outline-delete-outline",onClick:x.bind(null,u),ifShow:()=>{for(let e=0;e<r.value.length;e++){const t=r.value[e];if(t.Name==u.Name)return!!t.RawConfig}}}],select:e=>{s.info(`您点击了，${e} 按钮`)}})}});function x(u){const e=F.id,t=u.Name;C.push({name:"config",query:{id:e,name:t}})}async function y(){const u=await P(g.id);r.value=Object.values(u).sort((e,t)=>e.Name.localeCompare(t.Name))}y();function N(u){console.log(u)}function _(){V.value.reload()}function b(u){u.preventDefault(),c.value=!0,f.value.validate(e=>{if(e)s.error("请填写完整信息");else if(i.value=="新建实例"){const t=o.name;q({name:t}).then(()=>{s.success("新建成功"),setTimeout(()=>{n.value=!1,_()})})}else if(i.value=="更新实例"){const t=o.name,d=p.value.id,m=p.value.secret;S({name:t,id:d,secret:m}).then(()=>{s.success("更新成功"),setTimeout(()=>{n.value=!1,_()})})}c.value=!1})}return(u,e)=>{const t=Vue.resolveComponent("n-input"),d=Vue.resolveComponent("n-form-item"),m=Vue.resolveComponent("n-form"),v=Vue.resolveComponent("n-button"),k=Vue.resolveComponent("n-space"),E=Vue.resolveComponent("n-modal"),D=Vue.resolveComponent("n-card");return Vue.openBlock(),Vue.createElementBlock("div",null,[Vue.createVNode(D,{bordered:!1,class:"proCard"},{default:Vue.withCtx(()=>[Vue.createVNode(Vue.unref(I),{title:"插件列表",columns:Vue.unref(M),dataSource:r.value,"row-key":a=>a.id,pagination:!1,ref_key:"actionRef",ref:V,actionColumn:B,"onUpdate:checkedRowKeys":N,"scroll-x":1090},null,8,["columns","dataSource","row-key","actionColumn"]),Vue.createVNode(E,{show:n.value,"onUpdate:show":e[2]||(e[2]=a=>n.value=a),"show-icon":!1,preset:"dialog",title:i.value},{action:Vue.withCtx(()=>[Vue.createVNode(k,null,{default:Vue.withCtx(()=>[Vue.createVNode(v,{onClick:e[1]||(e[1]=()=>n.value=!1)},{default:Vue.withCtx(()=>[j]),_:1}),Vue.createVNode(v,{type:"info",loading:c.value,onClick:b},{default:Vue.withCtx(()=>[K]),_:1},8,["loading"])]),_:1})]),default:Vue.withCtx(()=>[Vue.createVNode(m,{model:o,rules:w,ref_key:"formRef",ref:f,"label-placement":"left","label-width":80,class:"py-4"},{default:Vue.withCtx(()=>[Vue.createVNode(d,{label:"名称",path:"name"},{default:Vue.withCtx(()=>[Vue.createVNode(t,{placeholder:"请输入实例名称",value:o.name,"onUpdate:value":e[0]||(e[0]=a=>o.name=a)},null,8,["value"])]),_:1})]),_:1},8,["model"])]),_:1},8,["show","title"])]),_:1})])}}}),J=U(L,[["__scopeId","data-v-0c5daadc"]]);export{J as default};