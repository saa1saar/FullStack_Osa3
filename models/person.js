const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: (v) => /(^\d{2}[-]\d{6,}$)|(^\d{3}[-]\d{5,}$)/.test(v),
      message: (props) =>
        `${props.value} not a valid phone number. Use either of following formats: xx-xxxxxx or xxx-xxxxx`,
    },
    required: true,
    unique: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)