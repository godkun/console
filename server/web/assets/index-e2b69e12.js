import{_ as e}from"./check-426da939.js";import{z as n}from"./index-8caa8cc3.js";import{i as t}from"./vendor-2e943313.js";import"./pluginConfig-e0cd097d.js";import"./index-dbd922fe.js";const o=["innerHTML"],u=Vue.defineComponent({__name:"index",setup(u){const{id:a,path:l}=t().params,r=Vue.ref(!1),i=Vue.ref("");return l?i.value="<span></span>":n(a,l).then((e=>{i.value=e.replace(/href="(.+)"/g,`href="${location.href}/$1"`).replace(/href='(.+)'/g,`href="${location.href}/$1"`)})),(n,t)=>{const u=Vue.resolveComponent("n-layout-content"),a=Vue.resolveComponent("n-layout");return Vue.openBlock(),Vue.createElementBlock("div",null,[Vue.createVNode(a,null,{default:Vue.withCtx((()=>[Vue.createVNode(u,{"content-style":"padding: 24px;"},{default:Vue.withCtx((()=>[Vue.createVNode(e,{name:"Debug",value:r.value,"onUpdate:value":t[0]||(t[0]=e=>r.value=e)},null,8,["value"]),r.value?Vue.createCommentVNode("",!0):(Vue.openBlock(),Vue.createElementBlock("div",{key:0,innerHTML:i.value},null,8,o))])),_:1})])),_:1})])}}});export{u as default};
