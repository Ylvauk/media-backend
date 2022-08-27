const mongoose = require('../connection')
const Schema = mongoose.Schema

const PostSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);
const Post = mongoose.model("Post", PostSchema)

module.exports=Post