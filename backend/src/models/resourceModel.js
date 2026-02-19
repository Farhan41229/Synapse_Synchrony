const mongoose = require('mongoose');

/**
 * @name ResourceSchema
 * @description Schema for academic resource sharing (Notes, Slides, Past Papers).
 */
const ResourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Resource title must be defined.'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters.']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters.']
    },
    category: {
        type: String,
        enum: ['notes', 'slides', 'past_papers', 'assignments', 'others'],
        default: 'notes'
    },
    subject: {
        type: String,
        required: [true, 'Subject name is mandatory.']
    },
    courseCode: {
        type: String,
        index: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileUrl: {
        type: String,
        required: [true, 'File reference pointer is required.']
    },
    fileType: {
        type: String, // pdf, pptx, zip, etc.
    },
    fileSize: {
        type: Number, // in bytes
    },
    downloads: {
        type: Number,
        default: 0
    },
    tags: [String],
    isVerified: {
        type: Boolean,
        default: false
    },
    semester: {
        type: String,
        required: true
    },
    metadata: {
        pageCount: Number,
        author: String,
        university: { type: String, default: 'IUT' }
    }
}, {
    timestamps: true
});

// Indexing for search optimization
ResourceSchema.index({ title: 'text', description: 'text', subject: 'text' });

module.exports = mongoose.model('Resource', ResourceSchema);
