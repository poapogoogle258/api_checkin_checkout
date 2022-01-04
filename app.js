//Check-In/Out

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

mongoose.connect('mongodb://localhost:27017/testAPI')
// Model 
const Schema = new mongoose.Schema({
    'action':String,
    'id':String,
    'user':String
},{timestamps : true})

const history_checkin = mongoose.model('history_checkin', Schema);

// history_checkin.deleteMany({})

app.use(express.json())
app.use(cors())

app.post('/checkin',(req,res)=>{

    if(!(req.body.action && req.body.id && req.body.user)){
        return res.status(400).send({
            status : 400,
            message : "bad request"
        })
    }

    const post_data = new history_checkin({...req.body})    
    post_data.save()

    return res.status(201).send({
        'status':'ok'
    })
})

app.get('/status',async (req,res)=>{
    if(!(req.body.action && req.body.id)){
        return res.status(400).send({
            status : 400,
            message : "bad request"
        })
    }

    const get_data = await history_checkin.findOne({ id : req.body.id}).sort({'createdAt' : -1 }).exec();

    return res.status(200).send({
        "status" : get_data?.action || null
    })

})

app.listen(3000,function(){
    console.log('start in port 3000')
})

