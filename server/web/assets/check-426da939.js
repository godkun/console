import{u as e}from"./pluginConfig-e0cd097d.js";import{i as t}from"./vendor-2e943313.js";const o=Vue.defineComponent({__name:"check",props:{name:null,value:{type:Boolean}},emits:["update:value"],setup(o,{emit:n}){const a=o;return e().getConfig(t().params.id,a.name).catch((()=>n("update:value",!0))),(e,t)=>{const n=Vue.resolveComponent("n-alert");return o.value?(Vue.openBlock(),Vue.createBlock(n,{key:0,title:"当前功能受限",type:"error"},{default:Vue.withCtx((()=>[Vue.createTextVNode(" 当前实例未安装插件:"+Vue.toDisplayString(o.name),1)])),_:1})):Vue.createCommentVNode("",!0)}}});export{o as _};
