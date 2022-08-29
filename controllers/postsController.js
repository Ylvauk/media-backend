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

router.delete('/:id', async (req, res, next) => {
    try{
        const deletedPost = await Post.findByIdAndDelete(req.params.id)
        res.json(deletedPost)
    } catch(err){
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try{
        const updatedPost=await Post.findbyIdAndUpdate(
        req.params.id,
        req.body,
        req.title,
        {
            new: true
        }
        )
        if(updatedPost){
            res.json(updatedPost);
        } else {
            res.sendStatus(404);
        }

    } catch (error) {
        next(err)}
})


module.exports = router;