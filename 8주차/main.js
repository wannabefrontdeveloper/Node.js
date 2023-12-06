const express = require('express');
const app = express();

app.set('views',__dirname+'/views');
app.set('view engine','ejs');

var db = require('./lib/db');
//var topic = require('./lib/topic');
//var author = require('./lib/author');
// var cookie = require('cookie');
var authorRouter = require('./router/authorRouter')
var rootRouter = require('./router/rootRouter')
app.use('/',rootRouter)
app.use('/author',authorRouter)
app.use(express.static('public'))


/*app.get('/',(req,res)=>{
      topic.home(req,res); 

}) 

app.get('/page/:pageId',(req,res)=>{
      topic.page(req,res); 
}) 

app.use('/',rootRouter)
app.use('/author',authorRouter)

app.get('/login',(req,res)=>{
    topic.login(req,res); 

})

app.post('/login_process',(req,res)=>{
    topic.login_process(req,res); 

})

app.get('/logout_process',(req,res)=>{
    topic.logout_process(req,res); 
})

app.get('/create',(req,res)=>{
      topic.create(req,res); 
})

app.post('/create_process',(req,res)=>{
      topic.create_process(req,res); 
})

app.get('/update/:pageId',(req,res)=>{
      topic.update(req,res); 
})

app.post('/update_process',(req,res)=>{
      topic.update_process(req,res); 
})

app.get('/delete/:pageId',(req, res)=>{
      topic.delete_process(req, res);
}) 

app.get('/author',(req,res)=>{

      author.home(req,res);
})

app.post('/author/create_process',(req,res)=>{

    author.create_process(req,res);
})

app.get('/author/update',(req,res)=>{

    author.update(req,res);
})

app.post('/author/update_process',(req,res)=>{

    author.update_process(req,res);
})

app.get('/author/delete',(req,res)=>{

    author.delete_process(req,res);
})
*/
app.listen(3000, () => console.log('Example app listening on port 3000')) ;


