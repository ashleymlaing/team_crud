const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://favsong:demodemo1@ds257640.mlab.com:57640/favesong', (err, client) => {
  if (err) return console.log(err)
  db = client.db('favesong')
  app.listen(process.env.PORT || 8000, () => {
    console.log('listening on 8000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))



app.get('/', (req, res) => {
  db.collection('favesong').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {songs: result})
  })
  //res.sendFile(__dirname + '/index.html')
  // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
  // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
})

app.post('/song', (req, res) => {
  db.collection('favesong').save({name: req.body.name, msg: req.body.msg, thumbUp: 0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/song', (req, res) => {
db.collection('favesong')
.findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
  $set: {
    thumbUp:req.body.thumbUp + 1
  }
}, {
  sort: {_id: -1},
  upsert: true
}, (err, result) => {
  if (err) return res.send(err)
  res.send(result)
})
})

app.delete('/song', (req, res) => {
db.collection('favesong').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
  if (err) return res.send(500, err)
  res.send('Message deleted!')
})
})
