import{h as R,o as T}from"./vendor-1e70d1e5.js";import{g as A}from"./index-5c1076ad.js";import{s as b}from"./index-de28ae1e.js";import{_ as j}from"./index-20ae1759.js";const g=Vue.defineComponent({__name:"TimelineGraph",props:{value:null},setup(c){const r=c,v=Vue.ref(),l=[],N=["red","blue","green","yellow"];return Vue.onMounted(()=>{const d=new b.TimelineGraphView(v.value);let V=0;Vue.watchEffect(()=>{const i=Date.now();i!=V&&(r.value.forEach((x,o)=>{l[o]||(l[o]=new b.TimelineDataSeries,l[o].setColor(N[o]),d.addDataSeries(l[o])),l[o].addPoint(i,x)}),d.updateEndDate(),V=i)})}),(d,V)=>(Vue.openBlock(),Vue.createElementBlock("canvas",{ref_key:"canvas",ref:v},null,512))}});const I=c=>(Vue.pushScopeId("data-v-967d90f8"),c=c(),Vue.popScopeId(),c),M={class:"console"},P={class:"py-1 px-1 flex justify-between"},W={key:1},H=Vue.createTextVNode(" 版本号： "),G={class:"text-1xl"},L=Vue.createTextVNode("启动时间： "),J={class:"py-1 px-1 flex justify-between"},O={class:"py-1 px-1 flex justify-between"},$={class:"py-1 px-1 flex justify-between"},q={key:1,class:"text-3xl"},K={class:"py-1 px-1 flex justify-between"},Q={key:1,class:"text-3xl"},X={class:"py-1 px-1 flex justify-between"},Y={key:1,class:"text-3xl"},Z={class:"mt-4"},ee=I(()=>Vue.createElementVNode("thead",null,[Vue.createElementVNode("tr",null,[Vue.createElementVNode("td",{style:{width:"20%"}},"网卡"),Vue.createElementVNode("td",{style:{width:"20%"}},"接收总bit"),Vue.createElementVNode("td",{style:{width:"20%"}},"发送总bit"),Vue.createElementVNode("td",{style:{width:"20%"}},"接收速率"),Vue.createElementVNode("td",{style:{width:"20%"}},"发送速率")])],-1)),te=Vue.defineComponent({__name:"console",setup(c){const r=Vue.ref(!0),v=Vue.ref({}),l=Vue.ref([]),N=Vue.ref(""),d=Vue.ref(""),V=Vue.ref(""),i=Vue.ref(""),x=Vue.ref(""),o=Vue.ref([]),k=Vue.ref([]),E=Vue.ref([]),S=Vue.ref([]);function F(e){return e>1024*1024?(e/1024/1024).toFixed(2)+" mb/s":e>1024?(e/1024).toFixed(2)+" kb/s":e.toString()+" b/s"}function B(e){return e>1024*1024?(e/1024/1024).toFixed(2)+" mb":e>1024?(e/1024).toFixed(2)+" kb":e.toString()+" b"}const D=R().params.id;let p;Vue.onMounted(async()=>{const e=await A(D);x.value=e.StartTime,i.value=e.Version,p=new EventSource("/api/summary?m7sid="+D),p.onmessage=U}),T(()=>{p==null||p.close()});async function U(e){var h,n,t,f,_,w,y,C;const u=JSON.parse(e.data);o.value=[u.CPUUsage||0,((h=u.HardDisk)==null?void 0:h.Usage)||0,((n=u.Memory)==null?void 0:n.Usage)||0],k.value=[((t=u.Streams)==null?void 0:t.length)||0],v.value=u,N.value=((f=u.CPUUsage)==null?void 0:f.toFixed(2))+"%",d.value=((w=(_=u.HardDisk)==null?void 0:_.Usage)==null?void 0:w.toFixed(2))+"%",V.value=((C=(y=u.Memory)==null?void 0:y.Usage)==null?void 0:C.toFixed(2))+"%";const a=(u.NetWork||[]).filter(s=>s.Receive!=0&&s.Sent!=0);l.value=a,S.value=a.map(s=>s.ReceiveSpeed),E.value=a.map(s=>s.SentSpeed),r.value=!1}return(e,u)=>{const a=Vue.resolveComponent("n-skeleton"),h=Vue.resolveComponent("n-time"),n=Vue.resolveComponent("NCard"),t=Vue.resolveComponent("n-grid-item"),f=Vue.resolveComponent("n-grid"),_=Vue.resolveComponent("n-card"),w=Vue.resolveComponent("n-table"),y=Vue.resolveComponent("n-tab-pane"),C=Vue.resolveComponent("n-tabs"),s=Vue.resolveComponent("NCol"),z=Vue.resolveComponent("NRow");return Vue.openBlock(),Vue.createElementBlock("div",M,[Vue.createVNode(f,{cols:"1 s:2 m:3 l:3 xl:4 2xl:4",responsive:"screen","x-gap":12,"y-gap":8},{default:Vue.withCtx(()=>[Vue.createVNode(t,null,{default:Vue.withCtx(()=>[Vue.createVNode(n,{title:"基本信息",segmented:{content:!0,footer:!0},size:"small",bordered:!1},{default:Vue.withCtx(()=>[Vue.createElementVNode("div",P,[r.value?(Vue.openBlock(),Vue.createBlock(a,{key:0,width:100,size:"medium"})):(Vue.openBlock(),Vue.createElementBlock("div",W,[Vue.createElementVNode("div",null,[H,Vue.createElementVNode("span",G,Vue.toDisplayString(i.value),1)]),Vue.createElementVNode("div",null,[L,Vue.createVNode(h,{time:new Date(x.value),type:"relative"},null,8,["time"])])]))])]),_:1})]),_:1}),Vue.createVNode(t,null,{default:Vue.withCtx(()=>[Vue.createVNode(n,{title:"资源使用",segmented:{content:!0,footer:!0},size:"small",bordered:!1},{default:Vue.withCtx(()=>[Vue.createElementVNode("div",J,[Vue.createVNode(g,{value:o.value},null,8,["value"])])]),_:1})]),_:1}),Vue.createVNode(t,null,{default:Vue.withCtx(()=>[Vue.createVNode(n,{title:"流数量",segmented:{content:!0,footer:!0},size:"small",bordered:!1},{default:Vue.withCtx(()=>[Vue.createElementVNode("div",O,[Vue.createVNode(g,{value:k.value},null,8,["value"])])]),_:1})]),_:1}),Vue.createVNode(t,null,{default:Vue.withCtx(()=>[Vue.createVNode(n,{title:"cpu使用情况",segmented:{content:!0,footer:!0},size:"small",bordered:!1},{default:Vue.withCtx(()=>[Vue.createElementVNode("div",$,[r.value?(Vue.openBlock(),Vue.createBlock(a,{key:0,width:100,size:"medium"})):(Vue.openBlock(),Vue.createElementBlock("div",q,Vue.toDisplayString(N.value),1))])]),_:1})]),_:1}),Vue.createVNode(t,null,{default:Vue.withCtx(()=>[Vue.createVNode(n,{title:"内存使用",segmented:{content:!0,footer:!0},size:"small",bordered:!1},{default:Vue.withCtx(()=>[Vue.createElementVNode("div",K,[r.value?(Vue.openBlock(),Vue.createBlock(a,{key:0,width:100,size:"medium"})):(Vue.openBlock(),Vue.createElementBlock("div",Q,Vue.toDisplayString(V.value),1))])]),_:1})]),_:1}),Vue.createVNode(t,null,{default:Vue.withCtx(()=>[Vue.createVNode(n,{title:"硬盘使用",segmented:{content:!0,footer:!0},size:"small",bordered:!1},{default:Vue.withCtx(()=>[Vue.createElementVNode("div",X,[r.value?(Vue.openBlock(),Vue.createBlock(a,{key:0,width:100,size:"medium"})):(Vue.openBlock(),Vue.createElementBlock("div",Y,Vue.toDisplayString(d.value),1))])]),_:1})]),_:1})]),_:1}),Vue.createElementVNode("div",Z,[Vue.createVNode(z,{gutter:24},{default:Vue.withCtx(()=>[Vue.createVNode(s,{span:24},{default:Vue.withCtx(()=>[Vue.createVNode(_,{"content-style":"padding: 0;",bordered:!1},{default:Vue.withCtx(()=>[Vue.createVNode(C,{type:"line",size:"large","tabs-padding":20,"pane-style":"padding: 20px;"},{default:Vue.withCtx(()=>[Vue.createVNode(y,{name:"网络",class:"pane"},{default:Vue.withCtx(()=>[Vue.createVNode(f,{cols:"2 s:1 m:1 l:1 xl:2 2xl:2",responsive:"screen","x-gap":12,"y-gap":8},{default:Vue.withCtx(()=>[Vue.createVNode(t,null,{default:Vue.withCtx(()=>[Vue.createVNode(_,{title:"接收速率"},{default:Vue.withCtx(()=>[Vue.createVNode(g,{value:S.value},null,8,["value"])]),_:1})]),_:1}),Vue.createVNode(t,null,{default:Vue.withCtx(()=>[Vue.createVNode(_,{title:"发送速率"},{default:Vue.withCtx(()=>[Vue.createVNode(g,{value:E.value},null,8,["value"])]),_:1})]),_:1})]),_:1}),Vue.createVNode(w,{"single-line":!1},{default:Vue.withCtx(()=>[ee,Vue.createElementVNode("tbody",null,[(Vue.openBlock(!0),Vue.createElementBlock(Vue.Fragment,null,Vue.renderList(l.value,m=>(Vue.openBlock(),Vue.createElementBlock("tr",{key:m.Name},[Vue.createElementVNode("td",null,Vue.toDisplayString(m.Name),1),Vue.createElementVNode("td",null,Vue.toDisplayString(B(m.Receive)),1),Vue.createElementVNode("td",null,Vue.toDisplayString(B(m.Sent)),1),Vue.createElementVNode("td",null,Vue.toDisplayString(F(m.ReceiveSpeed)),1),Vue.createElementVNode("td",null,Vue.toDisplayString(F(m.SentSpeed)),1)]))),128))])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})])])}}}),ae=j(te,[["__scopeId","data-v-967d90f8"]]);export{ae as default};
