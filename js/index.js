//require('./surprise')
var alphabets=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
var pagesVisited=['alphasort'];
const db={
    set:(x,y)=>{
        return localStorage.setItem(`T19_${x}`,y)
    },
    get:(x)=>{
        return localStorage.getItem(`T19_${x}`)
    },
    clear:()=>{
        return localStorage.clear()
    }
}
APP={
    start:async()=>{
        document.addEventListener("deviceready",onDevReady,false);
        if(db.get('firstTime')==undefined){
            var sortedAlpha=await sortAlpha(c19)
            console.log("...sorting")
            db.set('sortedAlpha',JSON.stringify(sortedAlpha))
            db.set('firstTime','false')
        }
        else{
            console.log("LOADED ALREADY")
        }
        H.id('alphabets').innerHTML="";
        alphabets.forEach(alphabet=>{
            H.id('alphabets').innerHTML+=`<a href="#alpha" style="position:relative;display:inline-block" class="h-card-sm h-margin-2 h-bg-blight" onclick="alphaShow('${alphabet}')">
                                            <span class="h-text-bold h-margin-2 h-text-white">${alphabet} </span>
                                        </a>
                                        `
        });
    },
    search:async(x,y)=>{
        switchView("searchResult")
        if(x){
            if(x==1){
                y?y:y=H.id("search").value;
                if(y!=""){
                    console.time("pp");
                    Thread.db.array=[];
                    alphabets.forEach(alphabet=>{
                        Thread.create(1,searchStud,[alphabet,y]);
                    })
                    var res=Thread.db.array;
                    // console.log(res);
                    processResult(0,res);
                    console.timeEnd("pp");
                    return res;
                }
            }
            else APP.search(null,x.target.value);
        }
        else{
            y?y:y=H.id("search").value;
            if(y[0]=="$"){
                if(y.includes(":")){
                    y=y.split("$")[1];
                    y=y.split(":");
                    var _tempProp=y[0];
                    var _tempValue=y[1];
                    var findings=[];
                    c19.forEach(o=>{
                        var x=o[_tempProp].toLowerCase().match(new RegExp(`${_tempValue.toLowerCase()}`));
                        x?findings.push({findResult:x,findData:o}):"";
                    })
                    processResult(2,findings);
                    return findings;
                }
            }
            else{
                
            }
        }
    }
}
searchStud=async (x)=>{
    var [alphabet,searchString]=x;
    var findings=[];
    var studs=JSON.parse(db.get("sortedAlpha"))[alphabet];
    var simpSearchKeys=["matricnumber","hometown","permanenthomeaddress","religion","phonenumber","emailaddress","gender","surname","othernames"];
    studs.forEach(stud=>{
        if(db.get("type")=="nimda"){
            Object.keys(stud).forEach(key=>{
                var studVal=stud[key],t;
                studVal?t=studVal.toLowerCase().match(new RegExp(searchString.toLowerCase())):t=null;
                t?(
                    t.from=key,
                    findings.push({findResult:t,findData:stud}))
                :"";
            })
        }
        else{
            simpSearchKeys.forEach(simpSearchKey=>{
                var studVal=stud[simpSearchKey],t;
                studVal?t=studVal.toLowerCase().match(new RegExp(searchString.toLowerCase())):t=null;
                t?(
                    t.from=simpSearchKey,
                    findings.push({findResult:t,findData:stud}))
                :"";
            })
        }
    })
    return findings;
}

onDevReady=()=>{
    document.addEventListener("backbutton",backBtn,false);
}
backBtn=()=>{
    var backPage=pagesVisited[pagesVisited.length-2];
    var currentPage=pagesVisited[pagesVisited.length-1];
    backPage!=undefined?(
        pagesVisited.pop(),
        switchView(pagesVisited[pagesVisited.length-1])
    ):backPage==undefined&&currentPage!="alphasort"?(pagesVisited.pop(),switchView("alphasort")):(
        console.log('should exit app')
    )
};
var cmdCombo="";
H.id("cmdInput").addEventListener("keyup",(ev)=>{
    var targVal=ev.target.value;
    if(targVal=="nimda"){
        document.body.classList.contains("h-bg-purewhite")?document.body.classList.replace("h-bg-purewhite","h-bg-black"):document.body.classList.add("h-bg-black");
        db.set("type","admin");
    }
    else if(targVal=="simp"){
        document.body.classList.contains("h-bg-black")?document.body.classList.replace("h-bg-black","h-bg-purewhite"):document.body.classList.add("h-bg-purewhite");
        db.set("type","simp");
    }
});
cmd=(x)=>{
    var cmdInput=H.id("cmdInput").classList;
    clearTimeout();
    cmdCombo+=x;
    if(cmdCombo=="asass"){
        clearTimeout();
        cmdInput.contains("h-hide")?cmdInput.replace("h-hide","h-show"):"";
        cmdCombo="";
    }
    else{
        setTimeout(() => {
            combo="";
        }, 5000);
    }
    setTimeout(()=>cmdInput.contains("h-show")?cmdInput.replace("h-show","h-hide"):"",20000)
    return cmdCombo;
}

//load more details about student
moreinfo=async(mat)=>{
    switchView("moreinfo");
    var moreDetails=H.id("moreDetails");
    moreDetails.innerHTML="";
    var data=c19.find(o=>o.matricnumber==mat.toUpperCase());
    if(db.get("type")=="admin"){
        moreDetails.innerHTML+=`<div class="">
                                    <img id="moreDetailsImg" class="h-outline-lightblue h-center h-circle" src="./img/040-user.svg" height="100px" width="100px">
                                    <div class="h-bg-white h-card moreDetailsCard2">
                                    </div>
                                </div>                        
                                `
        Object.keys(data).forEach(key=>{
            H.class("moreDetailsCard2")[0].innerHTML+=`<p class=" h-card-sm">
                                                <span class="h-text-bold ">${key} :</span><span class="h-text"> ${data[key]}</span>
                                            </p>
                                            `;
        })
    }
    else{
        moreDetails.innerHTML+=`
                                <p class="h-text h-font-md-2">${data.surname}, ${data.othernames}</p>
                                <div class="h-bg-white h-outline-black h-row h-card-sm">
                                    <div class="h-col-4 moreDetailsCard">
                                        <p class="h-text-bold h-font-tiny-2 h-card-1">${data.matricnumber}</p>
                                        <p class="h-text-bold h-font-tiny-2 h-card-1">${data.gender}</p>
                                        <p class="h-text-bold h-font-tiny-2 h-card-1">${data.religion}</p>
                                    </div>
                                    <div class="h-col-4">
                                        <img id="" class="h-outline-lightblue h-pail-center h-circle" src="./img/040-user.svg" height="60px" width="60px">
                                    </div>
                                    <div class="h-col-4 moreDetailsCard">
                                        <p style="display:block;overflow: auto;white-space: nowrap;" class="h-text-bold h-font-tiny-2 h-card-1">${data.phonenumber}</p>
                                        <p style="display:block;overflow: auto;white-space: nowrap;" class="h-text-bold h-font-tiny-2 h-card-1">${data.emailaddress}</p>
                                        <p style="display:block;overflow: auto;white-space: nowrap;" class="h-text-bold h-font-tiny-2 h-card-1">${data.hometown}</p>
                                    </div>
                                </div> `
    }
}

//proccess and display search results
processResult=async(x,results)=>{
    if(x>=1){
        H.id("searchRes").innerHTML="";
        if(results.length==0){
            H.id("searchRes").innerHTML="";
            H.id("searchRes").innerHTML+=`<div class="h-card h-bg-pinkish">
                                            <p class="h-text-bold h-text-white">No result(s) found</p>
                                        </div>`
        }
        else{
            H.id("searchRes").innerHTML="";
            results.forEach(result=>{
                var findData=result.findData,findResult=result.findResult,index=findResult.index;
                var startStr=findResult.input.substring(index-4,index),endStr=findResult.input.substring(index+findResult[0].length,findResult.input.length+6);
                H.id("searchRes").innerHTML+=`<div onclick="moreinfo('${findData.matricnumber}')" class="h-card-sm h-bg-lightgreen h-shadow-lightgreen">
                                                <p class="h-text-bold h-text-white h-font-md-2">${findData.surname.toUpperCase()} ${findData.othernames.toUpperCase()}</p>
                                                <p class="h-text h-text-white">....... ${startStr}<b class="h-font-md-1 h-text-bold">${findResult[0]}</b>${endStr} .......</p>
                                            </div>
                                            <br>
                                            `
            })
        }
    }
    else{
        H.id("searchRes").innerHTML="";
        var results2=[];
        results.forEach(async o=>{
            o=await o;
            o.length!=0?results2.push(o):"";
        });
        results=await results2;
        if(results.length==0){
            H.id("searchRes").innerHTML+=`<div class="h-card h-bg-pinkish">
                                            <p class="h-text-bold h-text-white">No result(s) found</p>
                                        </div>`
        }
        else{
            results.forEach(async o=>{
                o=await o;
                o.forEach(result=>{
                    var findData=result.findData,findResult=result.findResult,index=findResult.index;
                    var startStr=findResult.input.substring(index-4,index),endStr=findResult.input.substring(index+findResult[0].length,findResult.input.length+6);
                    H.id("searchRes").innerHTML+=`<div onclick="moreinfo('${findData.matricnumber}')" class="h-card-sm h-bg-lightgreen h-shadow-lightgreen">
                                                    <p class="h-text-bold h-text-white h-font-md-2">${findData.surname.toUpperCase()} ${findData.othernames.toUpperCase()}</p>
                                                    <p class="h-text-white h-text h-font-sm-1"> from: ${findResult.from}</p>
                                                    <p class="h-text h-text-white">....... ${startStr}<b class="h-font-md-1 h-text-bold">${findResult[0]}</b>${endStr} .......</p>
                                                </div>
                                                <br>
                                                `
                })
            })
        } 
    }
}

H.id("search").addEventListener("keyup",APP.search);/*add listener to search input*/

aboutUsPop={
    pop:async (id,name)=>{
        document.getElementsByTagName("h_pop").length>0?[0].remove():"";
        var pop=` <div class="h-bg-purewhite h-pail-center deletepop h-card anim-rollin-left">
                    <p class="h-card h-text h-text-red">Powered by <b class="h-text-lightgreen">makis</b></p>
                     <span class="h-text-black h-text h-font-tiny-2">Contact us: +2347031612450, 08127329895</span>
                    
                    <hr style="height:0.0001px" class="h-bg-red">
                    <div >
                        <span onclick="aboutUsPop.close()" class="h-button h-col-12 h-text-center h-text h-text-red">Ok</span>
                    </div>
                </div>
                `
        var h_pop=document.createElement('h_pop')
        h_pop.innerHTML=pop
        document.body.append(h_pop)
    },
    close:async ()=>{
        document.getElementsByTagName("h_pop")[0].remove();
    },
    confirm:async (id)=>{
        console.log("Deleting >> "+id)
        APP.deleteBirthday(id)
        deletePop.close()
    }
}

/*mini info of student from alphabetical sort*/
alphaShow=async(alphabet)=>{
    H.id("alphashow").innerHTML="";
    var alphaData=JSON.parse(db.get('sortedAlpha'))[`${alphabet}`];
    H.id("alphashow").innerHTML+=`<p class="h-text-bold">${alphaData.length} students(s)`
    alphaData.forEach(data=>{
        H.id("alphashow").innerHTML+=`<div class="h-card-sm h-bg-white h-anim-rollin-left h-outline-blight">
                                        <p class="h-text-bold h-font-md-1 h-text-black"> ${data.surname.toUpperCase()} ${data.othernames.toUpperCase()} (${data.title.toUpperCase()})</p>
                                        <p class="h-text h-font-tiny-2 h-text-black">${data.matricnumber}</p>
                                        <span onclick="moreinfo('${data.matricnumber}')" class="h-button h-bg-lightblue h-text-white h-text">More..</span>
                                    </div>
                                    <br>
                                    `
    })
}
sortAlpha=async(students)=>{
    var sorted={};
    alphabets.forEach(alphabet=>{
        var alpha=students.filter(student=>student['surname'][0]==alphabet);
        sorted[`${alphabet}`]=alpha;
    });
    console.log(sorted);
    return sorted;
}
next=(x)=>{
    var pages=H.class('page');
    for(var i=0;i<pages.length;i++){
        pages[i].classList.remove("h-show","h-anim-rollin");
        pages[i].classList.add("h-hide");
    }
    H.class(x)[0].classList.add("h-show","h-anim-rollin");
}
switchto=(x)=>{
    var signPages=H.class('sign-page');
    for(var i=0;i<signPages.length;i++){
        signPages[i].classList.remove("h-show","h-anim-reveal");
        signPages[i].classList.add("h-hide");
    }
    H.class(x)[0].classList.add("h-show","h-anim-reveal");
}
loadIn=async (from,x)=>{
    setTimeout(() => {
        H.id("loader").classList.replace("h-show","h-hide");
        H.id(from).classList.replace("h-hide","h-show");
    }, x);
}
switchView=(x)=>{
    pagesVisited.includes(x)?pagesVisited=pagesVisited.filter(o=>o!==x):"";
    pagesVisited.push(x);
    var views=H.class("page");
    for(var i=0;i<views.length;i++){
        views[i].classList.replace("h-show","h-hide");
    }
    H.id(x).classList.replace("h-hide","h-show");
};
var navOpen=0;
showMenu=()=>{
    if(navOpen==0){
        H.id("nav-menu").classList.replace("nav-menu-slideIn","nav-menu-slideOut");
        H.id("nav-menu").classList.replace("h-hide","h-show");
        navOpen=1;
    }
    else{
        H.id("nav-menu").classList.replace("nav-menu-slideOut","nav-menu-slideIn");
        setTimeout(() => {
            H.id("nav-menu").classList.replace("h-show","h-hide");
        }, 700);
        navOpen=0;
    };
};
