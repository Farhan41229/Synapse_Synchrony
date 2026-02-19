const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    mood: {
        type: String,
        enum: ['very_happy', 'happy', 'neutral', 'sad', 'very_sad'],
        required: true
    },
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

const MoodLog = mongoose.model('MoodLog', moodLogSchema);

module.exports = MoodLog;
