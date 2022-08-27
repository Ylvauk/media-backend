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

router.get('/:userId',(req,res,next)=>{
    User.findById(req.params.userId)
    .populate('posts.author')
    .then ((user)=>{
        if (user){
            res.json(user.post)
        } else {
            res.sendStatus(404)
        }
        
    })
    .catch(next)
})

router.get('/:userId/:postId', (req, res, next) =>{
    User.findById(req.params.userId)
    .populate('posts.user')
    .then((user) => {
        if(user) {
            const foundUser=user.posts.find(post=>post._id.toString()=== req.params.postId)
            if (foundUser) {
                res.json(foundUser)
            }
            else {
                res.sendStatus(404)
            }
        } else 
            res.sendStatus(404)
    })
    .catch(next)
})


router.post('/', requireToken, (req, res, next) => {
    const userId = req.body.userId;
    User.findById(userId)
    .then((foodTruck) => {
        const requestor = req.user._id.toString()
        if (user) {
            if (requestor) {
                user.posts.push(req.body)
                return post.save()
            } else {
                res.sendStatus(401)
            }
        } else {
            res.sendStatus(404)
        }})
    .then((user) => res.status(201).json( { user: user } ))
    .catch(next)
})

router.delete('/:userId/:postId' , requireToken, (req, res, next)=>{
    User.findById(req.params.userId)
    .then((user)=>{
        if(user){
            const foundPost = user.posts.id(req.params.postId)
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