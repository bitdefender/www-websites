import{getDatasetFromSection as x}from"../../scripts/utils/utils.js";async function T(n){const c=x(n),{questionLabel:v,nextButtonLabel:m,previousButtonLabel:S,seeResultsLabel:$,selectErrorLabel:h}=c,o={currentStep:0};n.classList.add("default-content-wrapper"),n.closest(".section").id="quiz-form";const l=[...n.children];function y(e,r){const t=e.children[0].children[0].textContent,a=[...e.children[0].children[1].children],d=e.children[1].children[0],s=r===0,i=r===l.length-1,u=`question-${r}`;return`
      <div class="form-wrapper">
        <form class="step">
           <div class="step-header">
             <div class="step-index">${v} ${r+1}/${l.length}:</div>
             ${s?"":`<a class="step-previous">${S}</a>`}
           </div>
        
           
           <fieldset>
             <legend>${t}</legend>
             
             
                ${a.map((p,E)=>{const b=p.querySelector("u")?1:0,f=`${u}-${E}`;return`
                <div class="step-radio-wrapper">
                  <input type="radio" id="${f}" name="${u}" value="${b}" required aria-required="true"/>
                  <label for="${f}">${p.textContent}</label>
                </div>  
                `}).join("")}
                <div class="error-message">${h}</div>
           </fieldset>
    
           <p class="button-container submit">
            <a class="button modal" href="">${i?$:m}</a>
           </p>
         
            <div class="img-container">
                ${d.outerHTML}
            </div>    
        </form>
      </div>
    `}function L(){o.currentStep+=1;const e=n.querySelector(".slide-wrapper"),t=`translateX(calc(-100% * ${o.currentStep} - (60px *  ${o.currentStep})))`;e.style.transform=t}function g(){o.currentStep-=1;const e=n.querySelector(".slide-wrapper"),t=`translateX(calc(-100% * ${o.currentStep} - (60px *  ${o.currentStep})))`;e.style.transform=t}function q(){n.style.transform=null;const e=[...n.querySelectorAll('input[type="radio"]:checked')].map(s=>s.value).reduce((s,i)=>s+=Number(i),0),t=Object.keys(c).filter(s=>s.includes("result_")).map(s=>({template:s.split("result_")[1].split("_").join("-"),interval:[...c[s].split("-")]})).find(({interval:[s,i]})=>Number(s)<=e&&e<=Number(i)),{origin:a,pathname:d}=window.location;window.location.replace(`${a}${d}${t.template}`)}function w(e){e.preventDefault();const r=e.target.closest("form"),t=r.querySelector('input[type="radio"]:checked'),a=o.currentStep===l.length-1;if(!t){r.querySelector("fieldset").classList.add("invalid");return}if(!a){L();return}q()}n.innerHTML=`
    <div class="slide-wrapper">${l.map((e,r)=>y(e,r)).join("")}</div>
  `,n.querySelectorAll("form").forEach(e=>{e.querySelectorAll('input[type="radio"]').forEach(t=>{t.addEventListener("change",a=>{a.target.checked&&e.querySelector("fieldset").classList.remove("invalid")})}),e.querySelectorAll(".button-container.submit").forEach(t=>t.addEventListener("click",w)),e.querySelectorAll(".step-previous").forEach(t=>t.addEventListener("click",g))})}export{T as default};
//# sourceMappingURL=quiz-stepper.js.map
