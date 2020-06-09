const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
    username:{
        type: String,
        required: false
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    usn:{
        type: String,
        required: false
    },
    semester:{
        type: Number,
        required: false
    },
    branch:{
        type: String,
        required: false
    },
    college:{
        type: String,
        required: false
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }

});

module.exports=mongoose.model("user",UserSchema);
