const buttons=document.querySelector(".buttons")
const display=document.querySelector(".operation")
const resultDisplay=document.querySelector(".result")
const modal = document.querySelector(".login-modal");
const music = document.querySelector("#music");
let equalCount = 0;
let counter = Number(localStorage.getItem("equalCounter")) || 0;
let lastResult = null;
class calculator {

constructor(){

this.opearator={

"*":{precedence:2 , op:(a,b)=>a*b},
"/":{precedence:2,op:(a,b)=>a/b},
"+":{precedence:1,op:(a,b)=>a+b},
"-":{precedence:1,op:(a,b)=>a-b},

}

}

calulate(expression){
    const token=this.tokenize(expression)
      this.validation(token)
      const postfix=this.toPostfix(token)
return this.evaluate(postfix)
}


tokenize(expression){
const regex = /\d*\.?\d+|[()+\-*/]/g;

         const tokens =
        expression.match(regex);
        

if(!tokens){throw new Error(`چیزی ننوشتی که`)}

return tokens
}



validation(tokens){
     let balance=0;


        for(let i=0;i<tokens.length;i++){


            const current=tokens[i];
            const next=tokens[i+1];


            if(current==="(")
                balance++;


            if(current===")")
                balance--;



            if(balance<0)
                throw new Error(
                    "پرانتز نبستسی"
                );



            if(
                this.opearator[current] &&
                this.opearator[next]
            ){

                throw new Error(
                    "عملگرو  ریدی!!"
                );

            }


        }



        if(balance!==0)

            throw new Error(
                "پرانتز ها درست نیستن"
            );
}


toPostfix(tokens){
    const output=[]
    const stack =[]

    for(const token of tokens){

        if(!isNaN(token)){output.push(token)
            continue;
        }

if(token==="("){stack.push(token)

    continue;
}


        if(token===")"){


                while(
                    stack.at(-1)!=="("
                ){

                    output.push(
                        stack.pop()
                    );

                }


                stack.pop();

                continue;

            }


while(stack.length&&
    stack.at(-1)!=="("&&
    this.opearator[stack.at(-1)].precedence > this.opearator[token].precedence)
    {

output.push(stack.pop())




}

stack.push(token)

}

while(stack.length){
    output.push(stack.pop())
}

return output;
}




evaluate(postfix){
const stack=[];

        for(const token of postfix){



            if(!isNaN(token)){

                stack.push(
                    Number(token)
                );

                continue;

            }




            const b=stack.pop();

            const a=stack.pop();



            if(a===undefined || b===undefined)

                throw new Error(
                    "ریدی"
                );



            stack.push(

               this.opearator[token].op(a,b)

            );

        }




        if(stack.length!==1)

            throw new Error(
                "خرابوم کردی"
            );



        return stack[0];

    }




}


const calc=new calculator()



buttons.addEventListener('click',onclick)
function onclick(e){
    
     let btn = e.target.closest("button");
     if(!btn) return;

     if(btn.dataset.action=="num"){
        
    display.innerHTML+=btn.dataset.value
}
if(btn.dataset.action=="act"){
    if(display.innerHTML===""&&lastResult!==null){
        display.innerHTML=lastResult
    }
    display.innerHTML+=`<span>${btn.dataset.value}</span>`

}

if(btn.dataset.action==="equal"){
   counter++
   localStorage.setItem("equalCounter", counter);
try{
    
    
    const result=calc.calulate(display.textContent)
    
    resultDisplay.textContent=result
    lastResult=result

}catch(error){

    console.log(error.message);
resultDisplay.textContent=error.message
lastResult=null
}

if(counter>=2){

    openLogin();

}
display.textContent=""

}
if(btn.dataset.action=="clean"){
    display.textContent=""
    resultDisplay.textContent=""
    lastResult=null
}

if(btn.dataset.action=="backspace"){
    display.innerHTML=display.innerHTML.slice(0,-1)
}
    


}

const closeBtn = document.querySelector("#closeModal");
const planButtons = document.querySelectorAll(".plan-card");
const loginSubmit = document.querySelector("#loginSubmit");
let selectedPlan = "pro";

planButtons.forEach(card=>{
    if(card.dataset.plan === selectedPlan) card.classList.add("is-selected");

    card.addEventListener("click",()=>{
        planButtons.forEach(c=>c.classList.remove("is-selected"));
        card.classList.add("is-selected");
        selectedPlan = card.dataset.plan;
    });
});

// closeBtn.addEventListener("click",closeLogin);

// loginSubmit.addEventListener("click",()=>{
//     console.log("پلن انتخاب شده:", selectedPlan);
//     closeLogin();
// });

// function closeLogin(){
//     modal.style.display = "none";
//     document.body.style.overflow = "";
//     music.pause();
//     document.removeEventListener("keydown", trapFocus);
// }

function openLogin(){

    modal.style.display="flex";

    document.body.style.overflow = "hidden";

    music.currentTime=0;

    music.play()
    .catch(err=>{

        console.log("مرورگر اجازه پخش نداد");

    });

    document.addEventListener("keydown", trapFocus);


}

function trapFocus(e){

    if(e.key !== "Tab") return;

    const focusable = modal.querySelectorAll("button, input, [tabindex]");
    const list = Array.from(focusable).filter(el=>!el.disabled);
    const first = list[0];
    const last = list[list.length - 1];

    if(e.shiftKey && document.activeElement === first){
        e.preventDefault();
        last.focus();
    }else if(!e.shiftKey && document.activeElement === last){
        e.preventDefault();
        first.focus();
    }

}

if(counter>=2){
    openLogin();
}