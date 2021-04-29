//var serverUrl="http://localhost:4980"
var serverUrl="http://surprisehbd.herokuapp.com"
var opt={
    headers:{
        'Content-Type':'application/json',
        'SURPRISE':'http://sa5rapara3sa2.herokuapp.com'
    },
    method:"POST"
}
const DB={
    set:(k,v)=>{
        return localStorage.setItem(`SU_${k}`,v)
    },
    get:(k,v)=>{
        return localStorage.getItem(`SU_${k}`,v)
    },
    clear:()=>{
        localStorage.clear()
    }
}
var apiCall=async (url,data,key)=>{
    var totalUrl=`${serverUrl}/api/${url}`
    key?totalUrl+=`/${key}`:totalUrl
    data!=false?opt.body=JSON.stringify(data):opt
    try{
        var req=await fetch(totalUrl,opt)
        var res=await req.json()
        return res
    }
    catch(error){
        return {type:"CON_ERR",msg:`Could not connect to server\n Error: ${error}`}
    }
}
SURPRISE={
    checkEmail:async (email)=>{
        return await apiCall("checkEmail",{emailAddress:email})
    },
    checkUsername:async (username)=>{
        return await apiCall("checkUsername",{username:username})
    },
    login:async (username,password)=>{
        return await apiCall("login",{username:username,password:password})
    },
    createAccount:async (d)=>{
        return await apiCall("createAccount",d)
    },
    getBirthdays:async ()=>{
        return await apiCall("getBirthdays",false,DB.get("apiKey"))
    },
    deleteBirthday:async (id)=>{
        return await apiCall('deleteBirthday',id,DB.get('apiKey'))  
    },
    saveBirthday:async (birthday)=>{
        return await apiCall("saveBirthday",birthday,DB.get("apiKey"))
    },
    saveEditBirthday:async (editedBirthday)=>{
        return await apiCall("saveEditBirthday",editedBirthday,DB.get("apiKey"))
    },
    getAccount:async ()=>{
        return await apiCall("getAccount",false,DB.get("apiKey"))
    }

}