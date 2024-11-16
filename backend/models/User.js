const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    userid: { type: String, required: true, unique: true },
    phonenumber : { type: String, required : false, default : '' },
    email : { type: String, required: false, default : ''}, 
    fullname: { type: String, required: true },
    password: { type: String, required: false, default : '' },
    image: { type: String, default : '' },
    address: { type: String, default : '' },
    cart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' }, // Product ID reference
            time: { type: Date, required : true }, 
        }
    ],
    productsBuy: [
        {
            product : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
            },
            time: { type: Date, required : true }, 
        }
    ],
    productsPosted: [
        {
            product : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
            },
            time: { type: Date, required : true }, 
        }
    ], 
    // when we open any card, their product id will be saved here 
    recentExplored : [
            {
                product : { type: mongoose.Schema.Types.ObjectId, ref: 'product' }
            }
        ],
    // list of text for recommendation system 
    recentSearched : [
            {
                searchedtext : { type: String }
            }
        ],
    // recommended products for users by analysing recentExplored, mostExploredCategory, recentSearched 
    recommendedProducts : [
            {
                product : { type: mongoose.Schema.Types.ObjectId, ref: 'product' }
            }
        ],
    // list of come most exlored categories 
    mostExploredCategory : [
            {
                category : { type: String },
                quantity : { type : Number, default : 1 }
            }
        ],
    // review on product sold as seller 
    rating: 
        {
            sum: { type : Number, default : 0 },
            count : { type: Number, default : 0 }, 
        }
    
}, { timestamps: true });


// pre - save method : hash password before saving 
userSchema.pre('save', async function(next){
    // get current user using this -> if password not changed then next -> create hash and generate hashed password -> update password and call next -> handle error 
    const user = this;
    if(!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
})

// custom function for comparing password 
userSchema.methods.comparePassword = async function(candidatePassword) {
    try{
        const isMatch = bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}


const User = model('user', userSchema)
module.exports = User;
