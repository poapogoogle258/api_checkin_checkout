//Check-In/Outhttps://github.com/pulls

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

mongoose.connect('mongodb://127.0.0.1:27017/testAPI',{
    user : "meeting",
    pass : "meeting12#$"
})
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

    if(!(req.query.action && req.query.id && req.query.user && (req.query.action == 'CheckIn' || req.query.action == 'CheckOut' || req.query.action == 'TimeOutCheckin' || req.query.action == "TimeOutEvent" ))){
        return res.status(400).send({
            status : 400,
            message : "bad request"
        })
    }
    
    const get_data = await history_checkin.findOne({ id : req.query.id}).sort({'createdAt' : -1 }).exec();
    if(get_data && req.query.action === 'TimeOutCheckin' && get_data.action === 'CheckIn' ){
        return res.status(406).send({
            status : 406,
            message : "Not Acceptable client"
        })
    }

    const post_data = new history_checkin({...req.query})    
    post_data.save()

    return res.status(201).send({
        'status':'ok'
    })
})

app.get('/status',async (req,res)=>{

    
    if(!(req.query.id)){
        return res.status(400).send({
            status : 400,
            message : "bad request"
        })
    }

    const get_data = await history_checkin.findOne({ id : req.query.id}).sort({'createdAt' : -1 }).exec();

    return res.status(200).send({
        "status" : get_data?.action || null
    })

})

app.listen(3004,function(){
    console.log('start in port 3004')
})
