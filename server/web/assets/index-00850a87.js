import{_ as e,c as a,s as t}from"./index-dbd922fe.js";import{g as u,i as o}from"./vendor-2e943313.js";import{u as l}from"./pluginConfig-e0cd097d.js";import{v as n}from"./index-8caa8cc3.js";import{W as r,a as c}from"./webrtc-22fafe8f.js";const s={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 20 20"},i={id:"volume",x1:"0%",y1:"60%",x2:"0%",y2:"0%"},d=Vue.createElementVNode("stop",{offset:"0%","stop-color":"cyan","stop-opacity":"1"},null,-1),V=["offset"],v=["offset"],m=Vue.createElementVNode("stop",{offset:"100%","stop-color":"cyan","stop-opacity":"0"},null,-1),p=Vue.createElementVNode("path",{d:"M5.5 10a.5.5 0 0 0-1 0a5.5 5.5 0 0 0 5 5.478V17.5a.5.5 0 0 0 1 0v-2.022a5.5 5.5 0 0 0 5-5.478a.5.5 0 0 0-1 0a4.5 4.5 0 1 1-9 0zm7.5 0a3 3 0 0 1-6 0V5a3 3 0 0 1 6 0v5z",fill:"url(#volume)"},null,-1),f=Vue.createElementVNode("path",{d:"M10 13a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm0-1a2 2 0 0 1-2-2V5a2 2 0 1 1 4 0v5a2 2 0 0 1-2 2zM5 9.5a.5.5 0 0 1 .5.5a4.5 4.5 0 1 0 9 0a.5.5 0 0 1 1 0a5.5 5.5 0 0 1-5 5.478V17.5a.5.5 0 0 1-1 0v-2.022A5.5 5.5 0 0 1 4.5 10a.5.5 0 0 1 .5-.5z",fill:"currentColor"},null,-1),h={key:1,d:"M12 5v4.879l.898.898c.067-.248.102-.508.102-.777V5a3 3 0 0 0-5.998-.119L8 5.879V5a2 2 0 1 1 4 0zM7 7.707L2.146 2.854a.5.5 0 1 1 .708-.708l15 15a.5.5 0 0 1-.708.708l-3.627-3.627a5.475 5.475 0 0 1-3.019 1.25V17.5a.5.5 0 0 1-1 0v-2.022A5.5 5.5 0 0 1 4.5 10a.5.5 0 0 1 1 0a4.5 4.5 0 0 0 7.309 3.516l-1.07-1.07A3 3 0 0 1 7 10V7.706zm4.016 4.016L8 8.707V10a2 2 0 0 0 3.016 1.723zm3.787.959l-.742-.742A4.481 4.481 0 0 0 14.5 10a.5.5 0 0 1 1 0c0 .974-.253 1.888-.697 2.682z",fill:"currentColor"},k={key:2,d:"M9 13c.07 0 .14-.002.21-.007c.11-.387.26-.757.448-1.104A2 2 0 0 1 7 10V5.001a2 2 0 1 1 4 0v5c0 .092-.006.183-.018.272c.312-.26.653-.486 1.018-.672V5a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm-4.5-3A4.5 4.5 0 0 0 9 14.5c0 .819.179 1.596.5 2.294v.706a.5.5 0 0 1-1 0v-2.022A5.5 5.5 0 0 1 3.5 10a.5.5 0 0 1 1 0zm10 9a4.5 4.5 0 1 1 0-9a4.5 4.5 0 0 1 0 9zm0-8a3.5 3.5 0 0 0-2.803 5.596l4.9-4.9A3.484 3.484 0 0 0 14.5 11zm-2.096 6.303a3.5 3.5 0 0 0 4.9-4.9l-4.9 4.9z",fill:"currentColor"},y=Vue.defineComponent({__name:"mic",props:{hasMic:{type:Boolean},muted:{type:Boolean},volume:null},setup:e=>(a,t)=>(Vue.openBlock(),Vue.createElementBlock("svg",s,[Vue.createElementVNode("defs",null,[Vue.createElementVNode("linearGradient",i,[d,Vue.createElementVNode("stop",{offset:e.volume+"%","stop-color":"cyan","stop-opacity":"1"},null,8,V),Vue.createElementVNode("stop",{offset:e.volume+.1+"%","stop-color":"cyan","stop-opacity":"0"},null,8,v),m])]),Vue.createElementVNode("g",null,[e.hasMic&&!e.muted?(Vue.openBlock(),Vue.createElementBlock(Vue.Fragment,{key:0},[p,f],64)):e.hasMic?(Vue.openBlock(),Vue.createElementBlock("path",h)):(Vue.openBlock(),Vue.createElementBlock("path",k))])]))}),C={class:"user"},w=["srcObject"],x={class:"title"},g=e(Vue.defineComponent({__name:"user",props:{value:null,title:null,audioContext:null},setup(e){const a=e,t=Vue.ref(),u=new MediaStream,o=Vue.ref(0);return Vue.watchEffect((()=>{if(a.value){if(a.value.audioTrack&&0==u.getAudioTracks().length){let e=function(){if("closed"==a.audioContext.state)return;l.getByteFrequencyData(n);let t=0;for(let e=0;e<n.length;e++)t+=n[e];o.value=t/n.length,requestAnimationFrame(e)};u.addTrack(a.value.audioTrack);const t=a.audioContext.createMediaStreamSource(u),l=a.audioContext.createAnalyser();t.connect(l);const n=new Uint8Array(l.frequencyBinCount);e()}a.value.videoTrack&&0==u.getVideoTracks().length&&u.addTrack(a.value.videoTrack),(a.value.audioTrack||a.value.videoTrack)&&t.value&&t.value.play()}})),(a,l)=>(Vue.openBlock(),Vue.createElementBlock("div",C,[Vue.createElementVNode("video",{ref_key:"videoEle",ref:t,srcObject:Vue.unref(u),autoplay:""},null,8,w),Vue.createElementVNode("div",x,[Vue.createTextVNode(Vue.toDisplayString(e.title)+" ",1),Vue.createVNode(y,{class:"mic",muted:e.value&&e.value.audioTrack&&!e.value.audioTrack.enabled,"has-mic":e.value&&e.value.audioTrack,volume:o.value},null,8,["muted","has-mic","volume"])])]))}}),[["__scopeId","data-v-02a9d378"]]),N={class:"user"},S={class:"title"},T={key:0,class:"camlist"},B=e(Vue.defineComponent({__name:"myself",props:{value:null,title:null,signalReady:{type:Boolean},audioContext:null},emits:["update:value","publish","unpublish"],setup(e,{emit:t}){const u=e,o=Vue.ref(),l=Vue.ref([]),n=a(),r=Vue.ref(n.getCurrentCamera),c=Vue.ref(),s=Vue.ref(0),i=new MediaStream;function d(){c.value&&(c.value.enabled=!c.value.enabled)}return navigator.mediaDevices.enumerateDevices().then((e=>{l.value=e.filter((e=>"videoinput"==e.kind)),l.value.find((e=>e.deviceId==r.value))||(r.value=l.value[0].deviceId)})),Vue.onUnmounted((()=>{u.value.mediaStream&&u.value.mediaStream.getTracks().forEach((e=>e.stop()))})),Vue.watchEffect((()=>{n.setCurrentCamera(r.value),navigator.mediaDevices.getUserMedia({audio:!0,video:!r.value||{deviceId:r.value}}).then((e=>{u.value.mediaStream&&u.value.mediaStream.getTracks().forEach((e=>e.stop())),u.value.mediaStream=e,c.value=e.getAudioTracks()[0];const a=e.getVideoTracks()[0];if(c.value){if(0==i.getAudioTracks().length){let e=function(){if("closed"==u.audioContext.state)return;t.getByteFrequencyData(o);let a=0;for(let e=0;e<o.length;e++)a+=o[e];s.value=a/o.length,requestAnimationFrame(e)};i.addTrack(c.value);const a=u.audioContext.createMediaStreamSource(i),t=u.audioContext.createAnalyser();a.connect(t);const o=new Uint8Array(t.frequencyBinCount);e()}else i.removeTrack(i.getAudioTracks()[0]),i.addTrack(c.value);u.value.audioTransceiver&&u.value.audioTransceiver.sender.replaceTrack(c.value)}u.value.videoTransceiver&&a&&u.value.videoTransceiver.sender.replaceTrack(a),t("update:value",u.value)}))})),Vue.watchEffect((()=>{u.value.mediaStream&&o.value&&(o.value.srcObject=u.value.mediaStream,o.value.muted=!0,o.value.play().catch((()=>{})))})),(a,t)=>{const u=Vue.resolveComponent("n-select");return Vue.openBlock(),Vue.createElementBlock("div",N,[Vue.createElementVNode("video",{ref_key:"videoEle",ref:o,autoplay:""},null,512),Vue.createElementVNode("div",S,[Vue.createTextVNode(Vue.toDisplayString(e.title)+" ",1),Vue.createVNode(y,{class:"mic",onClick:d,muted:null!=c.value&&!c.value.enabled,"has-mic":null!=c.value,volume:s.value},null,8,["muted","has-mic","volume"])]),l.value.length>1?(Vue.openBlock(),Vue.createElementBlock("div",T,[Vue.createVNode(u,{value:r.value,"onUpdate:value":t[0]||(t[0]=e=>r.value=e),options:l.value,"value-field":"deviceId"},null,8,["value","options"])])):Vue.createCommentVNode("",!0)])}}}),[["__scopeId","data-v-e412343a"]]),b=Vue.createTextVNode(" 正在等待WebRTC连接 "),_=Vue.createTextVNode(" WebRTC已连接 "),E=Vue.createTextVNode(" 正在发布流 "),D=Vue.createTextVNode(" 当前实例未安装插件，无法创建房间 "),A=Vue.createTextVNode("发送"),I=Vue.createTextVNode("返回"),z=Vue.createTextVNode(" 进入 "),M=e(Vue.defineComponent({__name:"index",setup(e){const a=Vue.ref(!0),s=u(),i=Vue.reactive([]),d=Vue.ref(""),V=o(),v=naive.useMessage(),m=Vue.ref("usr"+Math.random().toString(36).substr(2,9)),p=Vue.ref("");let f;const h=l(),k=V.params.id,y=Vue.ref(!1),C=Vue.ref("room"),w=Vue.ref(V.query.pass||"test"),x=Vue.ref(""),N=Vue.ref(!1),S=Vue.ref(),T=Vue.ref(!1),M=Vue.computed((()=>location.protocol+"//"+location.host+"/#/instance/room?pass="+x.value));let P,j="wss://console.monibuca.com:9999";const R=Vue.ref(),U=new r("m7s/webrtc/batch",{requestInit:{headers:{m7sid:k}}}),L=U.webrtc,O=new AudioContext;function q(){navigator.clipboard.writeText(M.value).then((()=>{v.success("链接已复制到剪切板")}))}function $(e){"Enter"===e.key&&Q()}function F(){k?(n(k,w.value).then((e=>{x.value=e})),W([j,"room",w.value,m.value].join("/")+"?m7sid="+k)):(W(`${j}/room/join?${new URLSearchParams({userId:m.value,pass:w.value})}`),U.options.requestInit.headers.pass=w.value)}async function J(){if(R.value&&R.value.mediaStream&&N.value&&!T.value){T.value=!0;const e=R.value;U.addStream(e);const a=await L.createOffer();await L.setLocalDescription(a),P.send(JSON.stringify({type:"publish",offer:a.sdp,streamPath:`room/${w.value}/${m.value}?token=${p.value}`}))}}function W(e){R.value=new c(m.value,"sendonly"),f=new WebSocket(e),f.onmessage=e=>{const{data:t,event:u,userId:o}=JSON.parse(e.data);switch(u){case"joined":if(p.value=t.token,w.value=p.value.split(":")[0],v.success("成功加入房间"),a.value=!1,P=L.createDataChannel("signal"),P.onmessage=async e=>{const a=JSON.parse(e.data);switch(a.type){case"answer":L.setRemoteDescription(new RTCSessionDescription(a));break;case"remove":U.deleteStream(a.streamPath);const e=i.find((e=>e.StreamPath==a.streamPath));e&&(e.StreamPath="");break;case"offer":await L.setRemoteDescription(new RTCSessionDescription(a));const t=await L.createAnswer();await L.setLocalDescription(t),P.send(JSON.stringify(t))}},P.onopen=async()=>{v.success("成功连接信令服务器"),N.value=!0,J(),G()},P.onclose=()=>{v.error("信令服务器连接断开"),N.value=!1},t.userList)for(const a of t.userList){if(H(a.ID))continue;i.push(a);const e=a.StreamPath;e&&(a.Stream=Vue.reactive(new c(e)),U.addStream(a.Stream))}U.connect().catch((e=>{S.value=e,v.error("连接失败"+e)}));break;case"msg":v.info(`${o}：${t}`);break;case"userjoin":v.success(t.ID+"加入房间"),H(t.ID)||i.push(t);break;case"userleave":v.info(o+"离开房间");{const e=K(o);e&&(e.StreamPath&&U.deleteStream(e.StreamPath),i.splice(i.findIndex((e=>e.ID===o)),1))}break;case"publish":const e=t,u=K(o);u&&!H(o)&&(u.StreamPath=e,u.Stream=new c(e),U.addStream(u.Stream),G())}},f.onerror=e=>{v.error("进入房间失败")}}async function G(){if(!N.value)return;const e=[];for(const t of i)t.StreamPath&&e.push(t.StreamPath);const a=await L.createOffer();await L.setLocalDescription(a),P.send(JSON.stringify({type:"subscribe",offer:a.sdp,streamList:e}))}function K(e){return i.find((a=>a.ID===e))}function H(e){return m.value===e}function Q(){f?(f.send(d.value),d.value=""):v.error("未连接到服务器")}return Vue.onUnmounted((()=>{O.close(),U.close(),null==f||f.close()})),t({url:"/api/user/islogin",method:"POST"}).then((e=>{0===e.code&&(m.value=e.data)})),k&&(h.getConfig(k,"Room").then((e=>C.value=e.appname)).catch((()=>y.value=!0)),h.getConfig(k,"").then((e=>{var a;j="wss://"+((null==(a=/[^:\/]+/.exec(e.console.server))?void 0:a[0])||"console.monibuca.com")+":9999"}))),(e,t)=>{const u=Vue.resolveComponent("n-alert"),o=Vue.resolveComponent("n-space"),l=Vue.resolveComponent("n-layout-content"),n=Vue.resolveComponent("n-input"),r=Vue.resolveComponent("n-button"),c=Vue.resolveComponent("n-input-group"),V=Vue.resolveComponent("n-layout-footer"),v=Vue.resolveComponent("n-form-item-row"),p=Vue.resolveComponent("n-form"),f=Vue.resolveComponent("n-card"),h=Vue.resolveComponent("n-modal"),C=Vue.resolveComponent("n-layout");return Vue.openBlock(),Vue.createBlock(C,null,{default:Vue.withCtx((()=>[Vue.createVNode(l,{"content-style":"padding: 24px;height:calc(100vh - 120px)"},{default:Vue.withCtx((()=>[Vue.createVNode(o,null,{default:Vue.withCtx((()=>[S.value?(Vue.openBlock(),Vue.createBlock(u,{key:0,type:"error"},{default:Vue.withCtx((()=>[Vue.createTextVNode(" WebRTC连接失败："+Vue.toDisplayString(S.value),1)])),_:1})):N.value?(Vue.openBlock(),Vue.createBlock(u,{key:2,type:"success"},{default:Vue.withCtx((()=>[_])),_:1})):(Vue.openBlock(),Vue.createBlock(u,{key:1,type:"warning"},{default:Vue.withCtx((()=>[b])),_:1})),T.value?(Vue.openBlock(),Vue.createBlock(u,{key:3,type:"success"},{default:Vue.withCtx((()=>[E])),_:1})):Vue.createCommentVNode("",!0),y.value?(Vue.openBlock(),Vue.createBlock(u,{key:4,title:"当前功能受限",type:"error"},{default:Vue.withCtx((()=>[D])),_:1})):x.value?(Vue.openBlock(),Vue.createBlock(u,{key:5,type:"success",onClick:q},{default:Vue.withCtx((()=>[Vue.createTextVNode("邀请他人入房链接（点击复制到剪切板）："+Vue.toDisplayString(Vue.unref(M)),1)])),_:1})):Vue.createCommentVNode("",!0)])),_:1}),Vue.createVNode(o,null,{default:Vue.withCtx((()=>[R.value?(Vue.openBlock(),Vue.createBlock(B,{key:0,title:m.value,value:R.value,signalReady:N.value,"onUpdate:value":J,"audio-context":Vue.unref(O)},null,8,["title","value","signalReady","audio-context"])):Vue.createCommentVNode("",!0),(Vue.openBlock(!0),Vue.createElementBlock(Vue.Fragment,null,Vue.renderList(i,(e=>(Vue.openBlock(),Vue.createBlock(g,{title:e.ID,key:e.ID,value:e.Stream,"audio-context":Vue.unref(O)},null,8,["title","value","audio-context"])))),128))])),_:1})])),_:1}),Vue.createVNode(V,null,{default:Vue.withCtx((()=>[Vue.createVNode(c,null,{default:Vue.withCtx((()=>[Vue.createVNode(n,{value:d.value,"onUpdate:value":t[0]||(t[0]=e=>d.value=e),clearable:"",placeholder:"发送聊天信息",onKeyup:$},null,8,["value"]),Vue.createVNode(r,{type:"primary",onClick:Q},{default:Vue.withCtx((()=>[A])),_:1})])),_:1})])),_:1}),Vue.createVNode(h,{show:a.value,"onUpdate:show":t[4]||(t[4]=e=>a.value=e),"close-on-esc":!1,"mask-closable":!1},{default:Vue.withCtx((()=>[Vue.createVNode(f,{style:{width:"600px"},title:Vue.unref(k)?"进入房间":"加入房间",bordered:!1,size:"huge",role:"dialog","aria-modal":"true"},{"header-extra":Vue.withCtx((()=>[Vue.createVNode(r,{type:"primary",onClick:t[1]||(t[1]=e=>Vue.unref(s).back())},{default:Vue.withCtx((()=>[I])),_:1})])),footer:Vue.withCtx((()=>[Vue.createVNode(r,{type:"primary",block:"",secondary:"",strong:"",onClick:F},{default:Vue.withCtx((()=>[z])),_:1})])),default:Vue.withCtx((()=>[Vue.createVNode(p,null,{default:Vue.withCtx((()=>[Vue.createVNode(v,{label:Vue.unref(k)?"房间名称":"入房口令"},{default:Vue.withCtx((()=>[Vue.createVNode(n,{value:w.value,"onUpdate:value":t[2]||(t[2]=e=>w.value=e)},null,8,["value"])])),_:1},8,["label"]),Vue.createVNode(v,{label:"用户名称"},{default:Vue.withCtx((()=>[Vue.createVNode(n,{value:m.value,"onUpdate:value":t[3]||(t[3]=e=>m.value=e)},null,8,["value"])])),_:1})])),_:1})])),_:1},8,["title"])])),_:1},8,["show"])])),_:1})}}}),[["__scopeId","data-v-297af40a"]]);export{M as default};
