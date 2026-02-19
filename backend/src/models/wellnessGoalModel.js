const mongoose = require('mongoose');

const wellnessGoalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily'
    },
    targetValue: {
        type: Number
    },
    currentValue: {
        type: Number,
        default: 0
    },
    unit: {
        type: String
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    deadline: {
        type: Date
    }
}, {
    timestamps: true
});

const WellnessGoal = mongoose.model('WellnessGoal', wellnessGoalSchema);

module.exports = WellnessGoal;
