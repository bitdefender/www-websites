const l=(n,e)=>n>e[1]?"poor":n>e[0]?"needs-improvement":"good",d=(n,e,a,o)=>{let t,u;return r=>{e.value>=0&&(r||o)&&(u=e.value-(t||0),(u||t===void 0)&&(t=e.value,e.delta=u,e.rating=l(e.value,a),n(e)))}};export{d as bindReporter};
//# sourceMappingURL=bindReporter.js.map
