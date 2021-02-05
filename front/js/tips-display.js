let tips_display = (function() {

    let tips = document.getElementById("tips");
    let tipsIlListe = new Array();
    let currentTip = 0;
    let tipsLoopRunning = true;

    return{
        LoadTips : ()=>{
            for (const tip of tips_data) {
                let NewTip= document.createElement('li');
                NewTip.innerHTML=tip.text;
                NewTip.style.display="none";
                NewTip.className="off";
                tipsIlListe.push(NewTip);
                tips.appendChild(NewTip);
            }
        },
        tipOn : (tipNumber=0)=>{
            tipsIlListe[tipNumber].className=""; 

            window.requestAnimationFrame(anim=>{
                window.requestAnimationFrame(anim=>{
                    tipsIlListe[tipNumber].style.display="block";
                    tipsIlListe[tipNumber].className="on";                 
                });
            });
            currentTip = tipNumber;
            console.log(currentTip);
        },
        tipOff : (tipNumber=0)=>{
            tipsIlListe[tipNumber].className=""; 

            window.requestAnimationFrame(anim=>{
                window.requestAnimationFrame(anim=>{
                    tipsIlListe[tipNumber].className="off";                 
                });
            });
            setTimeout(function() {
                tipsIlListe[tipNumber].style.display="none";
            }, 3000);
        },
        tipsLoop : () =>{
            do{
                newTip=Math.floor(Math.random()*tipsIlListe.length);
            }while(newTip==currentTip);

            tips_display.tipOn(newTip);

            setTimeout(function() {

                tips_display.tipOff(currentTip);

                setTimeout(()=>{
                    if(tipsLoopRunning) tips_display.tipsLoop();
                },3000);
            },10000);
            
        },
    }
})();

tips_display.LoadTips();
tips_display.tipsLoop();
