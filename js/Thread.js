(Thread={
    create:async(count,fn,arguments)=>{
        for(i=0;i<count;i++){
            Thread.store.array(fn(arguments?arguments:null))
        }
    },
    store:{
       array:(x)=>{
           Thread.db.array.push(x)
       }
    },
    chain:async(chainCount,count,fn,arguments)=>{
        for(i=0;i<chainCount;i++){
            Thread.create(count,fn,arguments)
        }
    },
    db:{
        array:[]
    }
})