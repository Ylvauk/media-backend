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
    User.create(req.body)
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
    Post.findById(req.params.postId)
    .then((user)=>{
        if(user){
            const foundPost = posts.id(req.params.postId)
            if (!foundPost) {
                return res.sendStatus(404)
            }
            const author = foundPost.user.toString()
            const requestor = req.user._id.toString()
            if (foundUser && author === requestor) {
                foundPost.remove()
                user.save()
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
    const postId = req.params.postId
    FoodTruck.findOne({
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