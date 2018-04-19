var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	type: {
		type: String,
		required: true,
		enum: ['technical', 'non-technical']
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);