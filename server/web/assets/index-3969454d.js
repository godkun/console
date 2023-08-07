import{h as R}from"./vendor-1e70d1e5.js";import{_ as $}from"./index-20ae1759.js";import{a as q,m as L}from"./index-5c1076ad.js";function H(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function E(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),n.push.apply(n,r)}return n}function S(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?E(Object(n),!0).forEach(function(r){H(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):E(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function U(e,t){if(e==null)return{};var n={},r=Object.keys(e),o,i;for(i=0;i<r.length;i++)o=r[i],!(t.indexOf(o)>=0)&&(n[o]=e[o]);return n}function W(e,t){if(e==null)return{};var n=U(e,t),r,o;if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)r=i[o],!(t.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}function J(e,t){return K(e)||G(e,t)||Y(e,t)||Q()}function K(e){if(Array.isArray(e))return e}function G(e,t){if(!(typeof Symbol>"u"||!(Symbol.iterator in Object(e)))){var n=[],r=!0,o=!1,i=void 0;try{for(var a=e[Symbol.iterator](),c;!(r=(c=a.next()).done)&&(n.push(c.value),!(t&&n.length===t));r=!0);}catch(u){o=!0,i=u}finally{try{!r&&a.return!=null&&a.return()}finally{if(o)throw i}}return n}}function Y(e,t){if(e){if(typeof e=="string")return D(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if(n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set")return Array.from(e);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return D(e,t)}}function D(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function Q(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function X(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function P(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),n.push.apply(n,r)}return n}function I(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?P(Object(n),!0).forEach(function(r){X(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):P(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function Z(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(r){return t.reduceRight(function(o,i){return i(o)},r)}}function d(e){return function t(){for(var n=this,r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return o.length>=e.length?e.apply(this,o):function(){for(var a=arguments.length,c=new Array(a),u=0;u<a;u++)c[u]=arguments[u];return t.apply(n,[].concat(o,c))}}}function g(e){return{}.toString.call(e).includes("Object")}function ee(e){return!Object.keys(e).length}function p(e){return typeof e=="function"}function te(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function ne(e,t){return g(t)||l("changeType"),Object.keys(t).some(function(n){return!te(e,n)})&&l("changeField"),t}function re(e){p(e)||l("selectorType")}function oe(e){p(e)||g(e)||l("handlerType"),g(e)&&Object.values(e).some(function(t){return!p(t)})&&l("handlersType")}function ie(e){e||l("initialIsRequired"),g(e)||l("initialType"),ee(e)&&l("initialContent")}function ae(e,t){throw new Error(e[t]||e.default)}var ue={initialIsRequired:"initial state is required",initialType:"initial state should be an object",initialContent:"initial state shouldn't be an empty object",handlerType:"handler should be an object or a function",handlersType:"all handlers should be a functions",selectorType:"selector should be a function",changeType:"provided value of changes should be an object",changeField:'it seams you want to change a field in the state which is not specified in the "initial" state',default:"an unknown error accured in `state-local` package"},l=d(ae)(ue),v={changes:ne,selector:re,handler:oe,initial:ie};function ce(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};v.initial(e),v.handler(t);var n={current:e},r=d(fe)(n,t),o=d(se)(n),i=d(v.changes)(e),a=d(le)(n);function c(){var s=arguments.length>0&&arguments[0]!==void 0?arguments[0]:function(y){return y};return v.selector(s),s(n.current)}function u(s){Z(r,o,i,a)(s)}return[c,u]}function le(e,t){return p(t)?t(e.current):t}function se(e,t){return e.current=I(I({},e.current),t),t}function fe(e,t,n){return p(t)?t(e.current):Object.keys(n).forEach(function(r){var o;return(o=t[r])===null||o===void 0?void 0:o.call(t,e.current[r])}),n}var de={create:ce},pe={paths:{vs:"https://fastly.jsdelivr.net/npm/monaco-editor@0.36.1/min/vs"}};function me(e){return function t(){for(var n=this,r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return o.length>=e.length?e.apply(this,o):function(){for(var a=arguments.length,c=new Array(a),u=0;u<a;u++)c[u]=arguments[u];return t.apply(n,[].concat(o,c))}}}function ve(e){return{}.toString.call(e).includes("Object")}function ge(e){return e||F("configIsRequired"),ve(e)||F("configType"),e.urls?(he(),{paths:{vs:e.urls.monacoBase}}):e}function he(){console.warn(x.deprecation)}function ye(e,t){throw new Error(e[t]||e.default)}var x={configIsRequired:"the configuration object is required",configType:"the configuration object should be an object",default:"an unknown error accured in `@monaco-editor/loader` package",deprecation:`Deprecation warning!
    You are using deprecated way of configuration.

    Instead of using
      monaco.config({ urls: { monacoBase: '...' } })
    use
      monaco.config({ paths: { vs: '...' } })

    For more please check the link https://github.com/suren-atoyan/monaco-loader#config
  `},F=me(ye)(x),be={config:ge},we=function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return function(o){return n.reduceRight(function(i,a){return a(i)},o)}};function B(e,t){return Object.keys(t).forEach(function(n){t[n]instanceof Object&&e[n]&&Object.assign(t[n],B(e[n],t[n]))}),S(S({},e),t)}var Ve={type:"cancelation",msg:"operation is manually canceled"};function O(e){var t=!1,n=new Promise(function(r,o){e.then(function(i){return t?o(Ve):r(i)}),e.catch(o)});return n.cancel=function(){return t=!0},n}var je=de.create({config:pe,isInitialized:!1,resolve:null,reject:null,monaco:null}),T=J(je,2),m=T[0],h=T[1];function Oe(e){var t=be.config(e),n=t.monaco,r=W(t,["monaco"]);h(function(o){return{config:B(o.config,r),monaco:n}})}function _e(){var e=m(function(t){var n=t.monaco,r=t.isInitialized,o=t.resolve;return{monaco:n,isInitialized:r,resolve:o}});if(!e.isInitialized){if(h({isInitialized:!0}),e.monaco)return e.resolve(e.monaco),O(_);if(window.monaco&&window.monaco.editor)return M(window.monaco),e.resolve(window.monaco),O(_);we(Ce,Se)(De)}return O(_)}function Ce(e){return document.body.appendChild(e)}function Ee(e){var t=document.createElement("script");return e&&(t.src=e),t}function Se(e){var t=m(function(r){var o=r.config,i=r.reject;return{config:o,reject:i}}),n=Ee("".concat(t.config.paths.vs,"/loader.js"));return n.onload=function(){return e()},n.onerror=t.reject,n}function De(){var e=m(function(n){var r=n.config,o=n.resolve,i=n.reject;return{config:r,resolve:o,reject:i}}),t=window.require;t.config(e.config),t(["vs/editor/editor.main"],function(n){M(n),e.resolve(n)},function(n){e.reject(n)})}function M(e){m().monaco||h({monaco:e})}function Pe(){return m(function(e){var t=e.monaco;return t})}var _=new Promise(function(e,t){return h({resolve:e,reject:t})}),A={config:Oe,init:_e,__getMonacoInstance:Pe};A.config({"vs/nls":{availableLanguages:{"*":"zh-cn"}}});const Ie=Vue.defineComponent({props:{json:String},emits:["update:json"],setup(e,{emit:t}){const{json:n}=Vue.toRefs(e),r=Vue.ref(),o=Vue.ref(!0);let i=null;const a=async()=>{const c=await A.init();i=c.editor.create(r.value,{model:c.editor.createModel(n.value,"yaml"),tabSize:2,automaticLayout:!0,scrollBeyondLastLine:!1,foldingStrategy:"indentation",overviewRulerBorder:!0,theme:"vs-dark"}),i&&i.onDidChangeModelContent(()=>{o.value=!1,t("update:json",i==null?void 0:i.getValue())})};return Vue.watchEffect(()=>{o.value&&i&&i.setValue(n.value),o.value=!0}),Vue.onMounted(()=>{o.value=!0,a()}),{dom:r}}}),Fe={class:"editor",ref:"dom"};function $e(e,t,n,r,o,i){return Vue.openBlock(),Vue.createElementBlock("div",Fe,null,512)}const xe=$(Ie,[["render",$e]]);const Be=e=>(Vue.pushScopeId("data-v-1347fc08"),e=e(),Vue.popScopeId(),e),Te=Vue.createTextVNode("保存"),Me=Vue.createTextVNode("不保存"),Ae=Be(()=>Vue.createElementVNode("div",null,null,-1)),Ne=Vue.createTextVNode("编辑"),ze=Vue.defineComponent({__name:"index",setup(e){const t=Vue.reactive({Merged:"",Modified:"",File:""}),n=Vue.ref(""),r=Vue.ref(!1),o=naive.useMessage(),i=R(),{query:a,params:c}=i,u=a.name||"",s=c.id;q(s,u,"1").then(f=>{Object.assign(t,f)});function y(){r.value=!0,n.value=t.Modified}function N(){r.value=!1,L(s,t.Modified,a.name).then(f=>{f=="ok"?o.success("配置保存成功"):o.error("配置保存失败"+f)}).catch(f=>{o.error("配置保存失败"+f)})}function z(){t.Modified=n.value,r.value=!1}return(f,C)=>{const b=Vue.resolveComponent("n-button"),w=Vue.resolveComponent("n-space"),V=Vue.resolveComponent("n-code"),j=Vue.resolveComponent("n-card");return Vue.openBlock(),Vue.createBlock(w,{justify:"space-between"},{default:Vue.withCtx(()=>[Vue.createVNode(j,{title:`修改过的${Vue.unref(u)||"全局"}配置`,style:{"min-width":"27vw"}},{"header-extra":Vue.withCtx(()=>[r.value?(Vue.openBlock(),Vue.createBlock(w,{key:0},{default:Vue.withCtx(()=>[Vue.createVNode(b,{type:"success",size:"small",onClick:N},{default:Vue.withCtx(()=>[Te]),_:1}),Vue.createVNode(b,{type:"primary",size:"small",onClick:z},{default:Vue.withCtx(()=>[Me]),_:1})]),_:1})):(Vue.openBlock(),Vue.createBlock(w,{key:1},{default:Vue.withCtx(()=>[Ae,Vue.createVNode(b,{type:"primary",size:"small",onClick:y},{default:Vue.withCtx(()=>[Ne]),_:1})]),_:1}))]),default:Vue.withCtx(()=>[r.value?(Vue.openBlock(),Vue.createBlock(xe,{key:0,class:"jsonEditor",json:t.Modified,"onUpdate:json":C[0]||(C[0]=k=>t.Modified=k)},null,8,["json"])):(Vue.openBlock(),Vue.createBlock(V,{key:1,language:"yaml","show-line-numbers":"",code:t.Modified},null,8,["code"]))]),_:1},8,["title"]),Vue.createVNode(j,{title:`配置文件中的${Vue.unref(u)||"全局"}配置`,style:{"min-width":"27vw"}},{default:Vue.withCtx(()=>[Vue.createVNode(V,{code:t.File,language:"yaml","show-line-numbers":"","word-wrap":"",style:{"font-size":"13px"}},null,8,["code"])]),_:1},8,["title"]),Vue.createVNode(j,{title:`最终合并后的${Vue.unref(u)||"全局"}配置`,style:{"min-width":"27vw"}},{default:Vue.withCtx(()=>[Vue.createVNode(V,{code:t.Merged,language:"yaml","show-line-numbers":"","word-wrap":"",style:{"font-size":"13px"}},null,8,["code"])]),_:1},8,["title"])]),_:1})}}}),Le=$(ze,[["__scopeId","data-v-1347fc08"]]);export{Le as default};
