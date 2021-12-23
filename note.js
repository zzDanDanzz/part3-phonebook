const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI

// connect to db
console.log('connecting to db');
mongoose.connect(MONGO_URI).then(() => {
    console.log('connected successfully to db'); 
})

// Contact schema
const schema = mongoose.Schema({
    name: String,
    number: Number
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id.toString()
            delete ret._id
            delete ret.__v
        }
    }
})

// Contact model
module.exports = mongoose.model('Contact', schema)