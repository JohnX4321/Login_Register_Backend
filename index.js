const express=require('express');
const bodyParser=require('body-parser');

const app=express();
const user=require('./routes/user');

var Connect=require('./config/db');



const PORT=process.env.PORT||4000;

Connect();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/',(req,res)=>{
    res.json({message: 'API Working'})
});

app.use('/user',user);

app.listen(PORT,(req,res)=>{
    console.log(`Server started at PORT ${PORT}`);
});
