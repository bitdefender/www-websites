import{decorateIcons as D}from"../../scripts/lib-franklin.js";import n from"../../scripts/utils/pass_service.js";function T(e,r){return Array.from(e.querySelectorAll("div")).find(a=>{const i=a.querySelector("p");return i?.textContent.includes(r)?(i.remove(),!0):!1})||null}function M(e,r){const t=r.querySelector("#password-result"),c=n.ratePasswordFromPasswordInfo(e),a=n.fromRating(c);switch(t.className="",a){case n.SecurityReportConstants.passwordStrengthWeak:t.textContent=n.SecurityReportConstants.passwordStrengthWeak,t.classList.add("weak");break;case n.SecurityReportConstants.passwordStrengthPoor:t.textContent=n.SecurityReportConstants.passwordStrengthPoor,t.classList.add("poor");break;case n.SecurityReportConstants.passwordStrengthGood:t.textContent=n.SecurityReportConstants.passwordStrengthGood,t.classList.add("good");break;default:t.textContent=n.SecurityReportConstants.passwordStrengthStrong,t.classList.add("strong")}}function H(e){const r=document.createElement("div");return r.classList.add("share-popup"),e.insertAdjacentElement("beforeend",r),r}function I(e,r,t,c){const a=c;if(navigator.clipboard.writeText(a),e.querySelector(".button-container")){const o=e.querySelector(".share-popup")||H(r);o.textContent=`${t}`,o.style="opacity: 1",setTimeout(()=>{o.style="opacity:0;"},2e3)}}function A(e,r){r.length>25&&window.innerWidth<991?e.style.fontSize="calc(100% - 4px)":e.style.fontSize=""}function z(e){const{clipboardText:r,selectAtLeastOneCheckboxText:t}=e.closest(".section").dataset;T(e,"<privacy-policy>").classList.add("privacy-policy");const a=T(e,"<password-generator>");a.classList.add("password-generator-grid");const i=[...a.children],[o,G]=i,[q,p,g]=[...o.children];o.remove();const m=g.innerHTML.split("strong-weak-text"),[P,k,R,S]=m[1].split(",");n.updatePasswordStrengthTexts(P,k,R,S),g.innerHTML=`${m[0]} <span id='password-result' class='strong'>${S}</span>`;const h=document.createElement("form");h.classList.add("password-generator--form"),h.innerHTML=`
    <div class="password-generator--input-container">
      <input class="password-generator--input" readonly>
      <input type="submit" class="password-generator--input-retry">
    </div>
    <div class="password-generator--parameters">
        <div class="range-slider-container">
          <p>${q.innerText}</p>
          <input name="range" type="range" min="4" max="32" value="16" class="slider" id="password-range">
          <label for="range" id="range-label"></label>
        </div>
        <div class="form-checkboxes">
          <div>
            <input type="checkbox" id="uppercase" name="uppercase" checked />  
            <label for="uppercase">${p.children[0].textContent}</label>
          </div>
          <div>
            <input type="checkbox" id="lowercase" name="lowercase" checked />  
            <label for="lowercase">${p.children[1].textContent}</label>
          </div>
          <div>
            <input type="checkbox" id="numbers" name="numbers" checked />  
            <label for="numbers">${p.children[2].textContent}</label>
          </div>
          <div>
            <input type="checkbox" id="special" name="special" checked />  
            <label for="special">${p.children[3].textContent}</label>
          </div>
        </div>
        <p class="password-strength">${g.innerHTML}<p>
    </div>
  `,a.prepend(h),D(e);const v=e.querySelector(".password-generator--input"),E=e.querySelector(".password-generator--input-retry"),w=e.querySelector("[href='#copy-link'], [href='#copy-password']");w.id="copy-password";const l=e.querySelector("#password-range"),f=e.querySelector("#range-label"),x=e.querySelector("#uppercase"),L=e.querySelector("#lowercase"),C=e.querySelector("#numbers"),b=e.querySelector("#special"),$=e.querySelector(".password-strength");f.innerHTML=l.value,l.oninput=function(){f.innerHTML=this.value};let d="";function y(){const s={passwordLength:parseInt(l.value,10),includeLettersUppercase:x.checked,includeLettersLowercase:L.checked,includeNumbers:C.checked,includeSpecialChars:b.checked,passwordLettersUppercase:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",passwordLettersLowercase:"abcdefghijklmnopqrstuvwxyz",passwordNumbers:"0123456789",passwordSpecialChars:"!@#$%^&*()_+-=[]{}|;:,.<>?"};if(!s.includeLettersUppercase&&!s.includeLettersLowercase&&!s.includeNumbers&&!s.includeSpecialChars){if(!e.querySelector(".danger-selection")){const u=document.createElement("p");u.textContent=t,u.classList.add("danger-selection"),e.prepend(u),setTimeout(()=>{u.remove()},2e3)}return}d=n.generateWithSettings(s),v.value=d,A(v,d),M(d,$)}E.addEventListener("click",s=>{s.preventDefault(),y()}),y(),w.addEventListener("click",s=>{s.preventDefault(),I(e,w,r,d)}),[l,x,L,C,b].forEach(s=>s.addEventListener("change",y))}export{z as default};
//# sourceMappingURL=password-generator.js.map
