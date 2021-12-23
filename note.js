const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const MONGO_URI = process.env.MONGO_URI

// connect to db
console.log('connecting to db');
mongoose.connect(MONGO_URI).then(() => {
    console.log('connected successfully to db');
}).catch(err => console.log('problem connecting to db: ', err))

// Contact schema
const schema = mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        unique: true,
        required: true
    },
    number: {
        type: Number,
        min: 10000000, // min 10 million means at least 8 digits (required for exercise 3.20) note: i did this because minlength didn't work on number type
        required: true
    }
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id.toString()
            delete ret._id
            delete ret.__v
        }
    }
})

// use unique validator
schema.plugin(uniqueValidator)

// Contact model
module.exports = mongoose.model('Contact', schema)