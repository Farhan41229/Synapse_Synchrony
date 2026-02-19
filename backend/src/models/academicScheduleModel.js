const mongoose = require('mongoose');

const academicScheduleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    courseCode: {
        type: String,
        trim: true
    },
    instructor: {
        type: String,
        trim: true
    },
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    startTime: {
        type: String, // HH:mm format
        required: true
    },
    endTime: {
        type: String, // HH:mm format
        required: true
    },
    room: {
        type: String,
        trim: true
    },
    semester: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Ensure no overlapping classes for the same user on the same day (conceptual, but validation logic would be in controller)
academicScheduleSchema.index({ user: 1, day: 1, startTime: 1 });

const AcademicSchedule = mongoose.model('AcademicSchedule', academicScheduleSchema);

module.exports = AcademicSchedule;
