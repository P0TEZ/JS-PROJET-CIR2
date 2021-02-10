let tips_display = (function() {

    let tips = document.getElementById("tips");
    let tip = document.getElementById("tip");
    let tipsListe = new Array();
    let currentTip = 0;
    let tipsLoopRunning = true;

    return{
        LoadTips : ()=>{
            for (const tip of tips_data) {
                tipsListe.push(tip.text);
            }
        },
        tipOn : (tipNumber=0)=>{
            tips.className="invisible"; 

            window.requestAnimationFrame(anim=>{
                window.requestAnimationFrame(anim=>{
                    tip.innerHTML = tipsListe[tipNumber];
                    tips.className="on";                 
                });
            });
            currentTip = tipNumber;
        },
        tipOff : (tipNumber=0)=>{
            tips.className=""; 

            window.requestAnimationFrame(anim=>{
                window.requestAnimationFrame(anim=>{
                    tips.className="off";                 
                });
            });
        },
        tipsLoop : () =>{
            do{
                newTip=Math.floor(Math.random()*tipsListe.length);
            }while(newTip==currentTip);

            tips_display.tipOn(newTip);

            setTimeout(function() {

                tips_display.tipOff(currentTip);

                setTimeout(()=>{
                    if(tipsLoopRunning) tips_display.tipsLoop();
                },2900);
            },30000);
            
        },
    }
})();

tips_display.LoadTips();
tips_display.tipsLoop();
