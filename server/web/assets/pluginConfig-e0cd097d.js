import{a as t}from"./index-8caa8cc3.js";import{d as s}from"./vendor-2e943313.js";const i=s({id:"plugin-config",state:()=>({}),getters:{},actions:{async getConfig(s,i){return this[s]||(this[s]={}),this[s][i]?this[s][i]:t(s,i).then((t=>this[s][i]=t))}}});export{i as u};