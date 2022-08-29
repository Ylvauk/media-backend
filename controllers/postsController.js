const express = require ('express')
const router = express.Router()
const Post = require('../db/models/Post')
const User = require('../db/models/User');
const { requireToken } = require('../middleware/auth');

router.get('/', (req, res, next) => {
	Post.find({}).then((post) => {
		res.json(post);
	})
    .catch(next)
});

router.get('/:id', (req, res, next) => {
	Post.findById({ _id: req.params.id }).then((post) => {
		if (post) {
            res.json(post);
        } else {
            res.sendStatus(404)
        }
	})
    .catch(next)
});


router.post('/', requireToken, (req, res, next) => {
    Post.create(req.body)
    .then((post) => {
        const requestor = req.user._id.toString()
        if (post) {
            if (requestor) {
                return post.save()
            } else {
                res.sendStatus(401)
            }
        } else {
            res.sendStatus(404)
        }})
    .then((post) => res.status(201).json( { post: post } ))
    .catch(next)
})

router.delete('/:id', async (req, res, next) => {
    try{
        const deletedPost = await Post.findByIdAndDelete(req.params.id)
        res.json(deletedPost)
    } catch(err){
        next(error)
    }
})

router.put('/:postId', requireToken, (req, res, next) => {
    const postId = req.params.postId
    Post.findOne({
        'posts._id': postId,
    })
    .then((user)=>{
        if (user) {
            const foundPost = user.posts.id(postId)
            const author = foundPost.user.toString()
            const requestor = req.user._id.toString()
            if (foundPost && author === requestor) {
                foundPost.set(req.body)
                user.save()
                return res.status(201).json( { user: user } )
            } else if (author !== requestor){
                res.sendStatus(401)
            } else {
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(404)
        }
    })
    .catch(next)
})


module.exports = router;