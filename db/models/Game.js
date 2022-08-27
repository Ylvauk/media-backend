const mongoose = require('../connection')
const Schema = mongoose.Schema

const GameSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    genre:{
        type:String,
        required:true,
    }
})

const Game = mongoose.model("Game", GameSchema)

module.exports=Game