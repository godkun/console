import{_ as e}from"./logo-44f27a9b.js";import{g as a,i as t,q as o,r}from"./vendor-2e943313.js";import{_ as u,P as l,c as i,g as d}from"./index-dbd922fe.js";const s={class:"view-account"},c=(e=>(Vue.pushScopeId("data-v-4472f3fa"),e=e(),Vue.popScopeId(),e))((()=>Vue.createElementVNode("div",{class:"view-account-header"},null,-1))),n={class:"view-account-container"},V=Vue.createStaticVNode('<div class="view-account-top" data-v-4472f3fa><div class="view-account-top-logo" data-v-4472f3fa><img src="'+e+'" alt="" data-v-4472f3fa><h2 class="title" data-v-4472f3fa>Monibuca</h2></div><div class="view-account-top-desc" data-v-4472f3fa>流媒体在线管理</div></div>',1),v={class:"view-account-form"},f=Vue.createTextVNode(" 注册 "),p=u(Vue.defineComponent({__name:"index",setup(e){const u=Vue.ref(!1),p=Vue.ref("发送邮箱验证码"),m=Vue.ref(60),w=Vue.ref(),h=naive.useMessage(),g=Vue.ref(!1),N=l.BASE_REGISTER_NAME,C=Vue.reactive({password:"",mail:"",verifycode:""}),_={mail:{required:!0,message:"请输入邮箱",trigger:"blur"},password:{required:!0,message:"请输入密码",trigger:"blur"},verifycode:{required:!0,message:"请邮箱验证码",trigger:"blur"}},x=i(),y=a(),b=t(),E=e=>{e.preventDefault(),w.value.validate((async e=>{var a;if(e)h.error("请填写正确信息");else{const{verifycode:e,password:t,mail:o}=C;h.loading("注册中..."),g.value=!0;const r={verifycode:e,password:t,mail:o};try{const e=await x.register(r);if(h.destroyAll(),0==e.code){const e=decodeURIComponent((null==(a=b.query)?void 0:a.redirect)||"/");h.success("注册成功，即将进入系统"),b.name===N?y.replace("/"):y.replace(e)}else h.info(e.msg||"登录失败")}finally{g.value=!1}}}))};function k(){if(C.mail){const e={mail:C.mail};d(e).then((()=>{h.info("验证码发送成功，请注意查收");const e=setInterval((()=>{u.value=!0,p.value=`(${m.value}秒)后重新发送`,m.value--,m.value<0&&(clearInterval(e),p.value="发送邮箱验证码",u.value=!1,m.value=10)}),1e3)}))}else h.info("请输入邮箱验证码")}return(e,a)=>{const t=Vue.resolveComponent("n-icon"),l=Vue.resolveComponent("n-input"),i=Vue.resolveComponent("n-form-item"),d=Vue.resolveComponent("n-button"),m=Vue.resolveComponent("n-form");return Vue.openBlock(),Vue.createElementBlock("div",s,[c,Vue.createElementVNode("div",n,[V,Vue.createElementVNode("div",v,[Vue.createVNode(m,{ref_key:"formRef",ref:w,"label-placement":"left",size:"large",model:C,rules:_},{default:Vue.withCtx((()=>[Vue.createVNode(i,{path:"mail"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{value:C.mail,"onUpdate:value":a[0]||(a[0]=e=>C.mail=e),placeholder:"请输入邮箱帐号"},{prefix:Vue.withCtx((()=>[Vue.createVNode(t,{size:"18",color:"#808695"},{default:Vue.withCtx((()=>[Vue.createVNode(Vue.unref(o))])),_:1})])),_:1},8,["value"])])),_:1}),Vue.createVNode(i,{path:"verifycode"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{value:C.verifycode,"onUpdate:value":a[1]||(a[1]=e=>C.verifycode=e),placeholder:"请输入邮箱验证码"},{prefix:Vue.withCtx((()=>[Vue.createVNode(t,{size:"18",color:"#808695"},{default:Vue.withCtx((()=>[Vue.createVNode(Vue.unref(o))])),_:1})])),_:1},8,["value"]),Vue.createVNode(d,{type:"success",onClick:k,disabled:u.value},{default:Vue.withCtx((()=>[Vue.createTextVNode(Vue.toDisplayString(p.value),1)])),_:1},8,["disabled"])])),_:1}),Vue.createVNode(i,{path:"password"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{value:C.password,"onUpdate:value":a[2]||(a[2]=e=>C.password=e),type:"password",showPasswordOn:"click",placeholder:"请输入密码"},{prefix:Vue.withCtx((()=>[Vue.createVNode(t,{size:"18",color:"#808695"},{default:Vue.withCtx((()=>[Vue.createVNode(Vue.unref(r))])),_:1})])),_:1},8,["value"])])),_:1}),Vue.createVNode(i,null,{default:Vue.withCtx((()=>[Vue.createVNode(d,{type:"primary",onClick:E,size:"large",loading:g.value,block:""},{default:Vue.withCtx((()=>[f])),_:1},8,["loading"])])),_:1})])),_:1},8,["model"])])])])}}}),[["__scopeId","data-v-4472f3fa"]]);export{p as default};
