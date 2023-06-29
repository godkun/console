System.register(["./vendor-legacy.9d0d38ef.js","./index-legacy.d1f2a5dd.js","./index-legacy.ed08f822.js","./index-legacy.4f2ba292.js","./index-legacy.ee50fea4.js"],(function(e,a){"use strict";var t,l,u,n,V,d=document.createElement("style");return d.textContent=".page[data-v-43b53314]{position:relative}.page .action[data-v-43b53314]{position:sticky;top:120px}.page .jsonEditor[data-v-43b53314]{width:55vw;min-height:80vh}.page .pre[data-v-43b53314]{width:70vw;height:80vh}\n",document.head.appendChild(d),{setters:[e=>{t=e.i},e=>{l=e.c},e=>{u=e.s},e=>{n=e._},e=>{V=e._}],execute:function(){const a={class:"page"},d={style:{margin:"20px"}},o=["id"],r=["id"],s={class:"pre"};e("default",V(Vue.defineComponent({__name:"index",setup(e){const V=Vue.computed((()=>JSON.stringify(v.value,null,2))),c=t(),{query:i,params:p}=c,v=Vue.ref({}),N={};async function m(){v.value=await l(p.id,i.path),v.value.Tracks=v.value.Tracks.sort(((e,a)=>e.Name.localeCompare(a.Name))),v.value.Tracks.forEach((e=>{N[e.Name]?(N[e.Name].bpsds.addPoint(+new Date,e.BPS),N[e.Name].fpsds.addPoint(+new Date,e.FPS),N[e.Name].bps.updateEndDate(),N[e.Name].fps.updateEndDate()):Vue.nextTick((()=>{const a=N[e.Name]={bps:new u.TimelineGraphView(document.getElementById(`bps${e.Name}`)),fps:new u.TimelineGraphView(document.getElementById(`fps${e.Name}`)),bpsds:new u.TimelineDataSeries,fpsds:new u.TimelineDataSeries};a.bps.addDataSeries(a.bpsds),a.fps.addDataSeries(a.fpsds)}))}))}return(e,t)=>{const l=Vue.resolveComponent("n-statistic"),u=Vue.resolveComponent("n-gi"),c=Vue.resolveComponent("n-grid");return Vue.openBlock(),Vue.createElementBlock("div",null,[Vue.createVNode(Vue.unref(n),{onTick:m}),Vue.createElementVNode("div",a,[Vue.createVNode(c,{"x-gap":"12",cols:6},{default:Vue.withCtx((()=>[Vue.createVNode(u,{span:"6"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{label:"流标识",value:v.value.Path},null,8,["value"])])),_:1}),Vue.createVNode(u,{span:"1"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{label:"流状态",value:["⌛等待发布者","🟢发布中","🟡等待关闭","🔴已关闭"][v.value.State]},null,8,["value"])])),_:1}),Vue.createVNode(u,{span:"2"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{label:"发布类型",value:v.value.Publisher?.Type},null,8,["value"])])),_:1}),Vue.createVNode(u,{span:"2"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{label:"发布时间",value:v.value.Publisher?.StartTime},null,8,["value"])])),_:1}),Vue.createVNode(u,{span:"1"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{label:"订阅者总数",value:v.value.Subscribers?.length||0},null,8,["value"])])),_:1}),(Vue.openBlock(!0),Vue.createElementBlock(Vue.Fragment,null,Vue.renderList(v.value.Tracks,((e,a)=>(Vue.openBlock(),Vue.createElementBlock(Vue.Fragment,{key:a},[Vue.createVNode(u,{span:"6"},{default:Vue.withCtx((()=>[Vue.createElementVNode("div",d,"-轨道"+Vue.toDisplayString(a)+"详情-",1)])),_:2},1024),Vue.createVNode(u,{span:"1"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{label:"轨道名称",value:e.Name},null,8,["value"])])),_:2},1024),Vue.createVNode(u,{span:"1"},{default:Vue.withCtx((()=>{return[Vue.createVNode(l,{label:"BPS",value:(a=e.BPS,(a<<=3)>1048576?(a/1024/1024).toFixed(2)+" mb/s":a>1024?(a/1024).toFixed(2)+" kb/s":a.toString()+" b/s")},null,8,["value"])];var a})),_:2},1024),Vue.createVNode(u,{span:"1"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{label:"FPS",value:e.FPS},null,8,["value"])])),_:2},1024),Vue.createVNode(u,{span:"1"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{label:"裸数据长度",value:e.RawSize+" byte"},null,8,["value"])])),_:2},1024),Vue.createVNode(u,{span:"2"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{label:"裸数据前10字节",value:e.RawPart.map((e=>e.toString(16).toUpperCase().padStart(2,"0"))).join(",")},null,8,["value"])])),_:2},1024),Vue.createVNode(u,{span:"1"},{default:Vue.withCtx((()=>[e.SPSInfo?(Vue.openBlock(),Vue.createBlock(l,{key:0,label:"分辨率",value:e.SPSInfo.Width+"x"+e.SPSInfo.Height},null,8,["value"])):(Vue.openBlock(),Vue.createBlock(l,{key:1,label:"通道数",value:e.Channels},null,8,["value"]))])),_:2},1024),Vue.createVNode(u,{span:"1"},{default:Vue.withCtx((()=>[e.GOP?(Vue.openBlock(),Vue.createBlock(l,{key:0,label:"GOP",value:e.GOP},null,8,["value"])):(Vue.openBlock(),Vue.createBlock(l,{key:1,label:"位深度",value:e.SampleSize},null,8,["value"]))])),_:2},1024),Vue.createVNode(u,{span:"1"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{label:"累计帧数",value:e.MoveCount},null,8,["value"])])),_:2},1024),Vue.createVNode(u,{span:"1"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{label:"时间戳",value:e.LastValue.AbsTime},null,8,["value"])])),_:2},1024),Vue.createVNode(u,{span:"1"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{label:"PTS",value:e.LastValue.PTS},null,8,["value"])])),_:2},1024),Vue.createVNode(u,{span:"1"},{default:Vue.withCtx((()=>[Vue.createVNode(l,{label:"DTS",value:e.LastValue.DTS},null,8,["value"])])),_:2},1024),Vue.createVNode(u,{span:"2"},{default:Vue.withCtx((()=>[Vue.createElementVNode("canvas",{id:"bps"+e.Name},null,8,o)])),_:2},1024),Vue.createVNode(u,{span:"2"},{default:Vue.withCtx((()=>[Vue.createElementVNode("canvas",{id:"fps"+e.Name},null,8,r)])),_:2},1024)],64)))),128))])),_:1})]),Vue.createElementVNode("pre",s,Vue.toDisplayString(Vue.unref(V)),1)])}}}),[["__scopeId","data-v-43b53314"]]))}}}));