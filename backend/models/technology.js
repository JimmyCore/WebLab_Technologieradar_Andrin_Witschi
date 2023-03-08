const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let technologySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    category: {
        type: String,
        enum: ['Techniques', 'Tools', 'Languages & Frameworks', 'Platforms'], 
        required: true
    },
    ring: {
        type: String,
        enum: ['Adopt', 'Trial', 'Assess', 'Hold', '']
    },
    description_technology: {
        type: String,
        required: true
    },
    description_classification: {
        type: String
    },
    published: {
        type: Boolean,
        required: true
    },
    classification_history: [{
        type: String,
        enum: ['Techniques', 'Tools', 'Languages & Frameworks', 'Platforms'],
    }]

}, {
    collection: 'technology'
})

technologySchema.plugin(uniqueValidator, { message: 'technology already recorded' });
module.exports = mongoose.model('Technology', technologySchema)