const mongoose = require('mongoose');

const stressLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    level: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    },
    triggers: [{
        type: String,
        trim: true
    }],
    note: {
        type: String,
        trim: true,
        maxlength: 500
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

const StressLog = mongoose.model('StressLog', stressLogSchema);

module.exports = StressLog;
