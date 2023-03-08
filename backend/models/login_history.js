const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let loginHistorySchema = new Schema({
    uid: {
        type: String
    },
    action: {
        type: String,
        enum: ['login', 'logout'],
    },
    timestamp: {
        type: Date
    }
}, {
    collection: 'login-history'
})

module.exports = mongoose.model('LoginHistory', loginHistorySchema)