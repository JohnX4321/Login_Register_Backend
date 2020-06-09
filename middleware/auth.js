const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
    const token=req.header("token");
    if(!token) return res.status(400).json({errors: "Auth Error"});
    try{
        const decoded=jwt.verify(token,"randomString");
        req.user=decoded.user;
        next();
    } catch (e) {
        console.error(e);
        res.status(500).send({errors: "Invalid Token"});
    }

};
