const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let technologyHistorySchema = new Schema({
    uid: {
        type: String
    },
    action: {
        type: String,
        enum: ['recorded', 'published', 'deleted', 'change_category', 'change_recorded'],
    },
    timestamp: {
        type: Date
    }
}, {
    collection: 'modify-history'
})

module.exports = mongoose.model('Modify-History', technologyHistorySchema)