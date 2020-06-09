const mongoose=require('mongoose');

const MONGOURI="mongodb://localhost/vrooklogin";

const connect=async ()=>{
    try {
        await mongoose.connect(MONGOURI,{
            useNewUrlParser: true
        });
        console.log('Conn Success to DB!!');
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports=connect;
