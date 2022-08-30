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
    .then((user) => {
        const requestor = req.user._id.toString()
        if (user) {
            if (requestor) {
                return user.save()
            } else {
                res.sendStatus(401)
            }
        } else {
            res.sendStatus(404)
        }})
    .then((user) => res.status(201).json( { user: user } ))
    .catch(next)
})

router.delete('/:id' , requireToken, (req, res, next)=>{
    Post.findByIdAndDelete(req.params.id)
    .then((post)=>{
        if(post){
            const foundPost = post.id(req.params.id)
            if (!foundPost) {
                return res.sendStatus(404)
            }
            const author = post.user.toString()
            const requestor = req.user._id.toString()
            if (foundUser && author === requestor) {
                foundPost.remove()
                post.save()
                res.sendStatus(204)
            } else if (author !== requestor){
                res.sendStatus(401)
            }
        } else {
            res.sendStatus(404)
        }
    })
    .catch(next)
})

router.put('/:postId', requireToken, (req, res, next) => {
    Post.findByIdAndUpdate(
        {_id: req.params.postId},
        req.body,
        { new: true, })
        .then((post) => {
            if (post) {
                res.json(post);
            } else {
                res.sendStatus(404)
            }
        })
        .catch(next)
    })

module.exports = router;