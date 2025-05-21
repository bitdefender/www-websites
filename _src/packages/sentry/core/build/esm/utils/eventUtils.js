function a(s){const t=[];s.message&&t.push(s.message);try{const e=s.exception.values[s.exception.values.length-1];e?.value&&(t.push(e.value),e.type&&t.push(`${e.type}: ${e.value}`))}catch{}return t}export{a as getPossibleEventMessages};
//# sourceMappingURL=eventUtils.js.map
