import{k as e,b as t}from"./index-8caa8cc3.js";import{T as n,B as o}from"./TableAction-c17a6634.js";import{i as a}from"./vendor-2e943313.js";import"./index-dbd922fe.js";import"./useDesignSetting-a0c3f2ea.js";const u=Vue.createTextVNode(" 全文搜索 "),l=Vue.createTextVNode(" 实时跟踪 "),i=Vue.defineComponent({__name:"index",setup(i){const r=Vue.ref(""),c=Vue.ref(""),d=Vue.ref(!0),s=a().params.id,p=Vue.ref([]),V=Vue.computed((()=>r.value?p.value.filter((e=>-1!=e.Name.indexOf(r.value))):p.value));function m(e,t=""){const n={"":"K",K:"M",M:"G",G:null};return e>1024&&n[t]?m(e/1024,n[t]):(e||0).toFixed(2).replace(".00","")+t+"B"}const f=[{title:()=>Vue.h("div",["名称",Vue.h(naive.NInput,{placeholder:"按名称过滤",onUpdateValue(e){r.value=e}})]),key:"Name",width:100},{title:"大小",width:100,render:e=>Vue.h("text",m(e.Size))}];async function w(e){const n=await t(s,!0,!1);window.open(`${n}/logrotate/api/open?file=${encodeURI(e.Name)}`)}async function v(e){const n=await t(s,!0,!1);window.open(`${n}/logrotate/api/download?file=${encodeURI(e.Name)}`)}async function y(){const e=await t(s,!0,!1);window.open(`${e}/logrotate/api/find?query=${c.value}`)}async function x(){const e=await t(s,!0,!1);window.open(`${e}/logrotate/api/tail`)}e(s).then((e=>{p.value=e,d.value=!1}));const C=Vue.reactive({width:220,title:"操作",key:"action",render:e=>Vue.h(n,{style:"button",actions:[{label:"打开",type:"primary",icon:"ic:outline-delete-outline",onClick:w.bind(null,e)},{label:"下载",type:"primary",icon:"ic:outline-delete-outline",onClick:v.bind(null,e)}]})});return(e,t)=>{const n=Vue.resolveComponent("n-button"),a=Vue.resolveComponent("n-layout-content"),i=Vue.resolveComponent("n-layout");return Vue.openBlock(),Vue.createBlock(i,null,{default:Vue.withCtx((()=>[Vue.createVNode(a,{"content-style":"padding: 24px;"},{default:Vue.withCtx((()=>[Vue.createVNode(Vue.unref(o),{title:"日志文件列表",class:"table",loading:d.value,"row-class-name":"row",columns:f,dataSource:Vue.unref(V),pagination:{simple:!0},actionColumn:C,"row-key":e=>e.Name,"scroll-x":1090},{toolbar:Vue.withCtx((()=>[Vue.createVNode(Vue.unref(naive.NInput),{value:c.value,"onUpdate:value":t[0]||(t[0]=e=>c.value=e)},null,8,["value"]),Vue.createVNode(n,{"attr-type":"button",onClick:y},{default:Vue.withCtx((()=>[u])),_:1}),Vue.createVNode(n,{"attr-type":"button",onClick:x},{default:Vue.withCtx((()=>[l])),_:1})])),_:1},8,["loading","dataSource","actionColumn","row-key"])])),_:1})])),_:1})}}});export{i as default};