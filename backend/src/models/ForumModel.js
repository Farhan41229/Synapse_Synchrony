const mongoose = require('mongoose');

/**
 * @name ForumSchema
 * @description Schema for community discussion forums and Q&A.
 */
const ForumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Forum topic title is required.'],
        trim: true,
        maxlength: [300, 'Title is too long.']
    },
    content: {
        type: String,
        required: [true, 'Discussion content is mandatory.'],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['general', 'academic', 'wellbeing', 'technical', 'announcements'],
        default: 'general'
    },
    tags: [String],
    views: {
        type: Number,
        default: 0
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    replies: [{
        content: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        createdAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

ForumSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Forum', ForumSchema);
