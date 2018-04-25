var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')//用于替换某个字段的值
var Movie = require('./models/movie')
var port = process.env.PORT || 3000
var app = express()
mongoose.connect('mongodb://localhost/movie') //连接数据库
app.set('views', './views/pages') //设置视图的根目录
app.set('view engine', 'jade') //设置模板引擎
//处理提交表单的数据，将数据格式化
app.use(express.bodyParser())
//dirname 表示当前目录
//express.static表示使用静态文件... 静态资源的获取
app.use(express.static(path.join(__dirname, 'public')))
app.locals.moment =  require('moment')//本地调用
app.listen(port)
console.log('start:' + port)
//编写路由
// index page
app.get('/', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) console.log(err)
        res.render('index', {
            title: "首页",
            movies: movies
        })
    })
})
// detail page
app.get('/movie/:id', function (req, res) {
    var id = req.params.id
    Movie.findById(id,function(err,movie){
        res.render('detail', {
            title: movie.title,
            movie: movie
        })
    })
})
// admin page
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: "后台页面",
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
})
//admin update movie
app.get('/admin/update/:id',function(req,res){
    var id = req.params.id
    if (id){
        Movie.findById(id,function(err,movie){
            res.render('admin', {
                title: "后端更新页面",
                movie: movie
            })
        })
    }
})
// form post move
app.post('/admin/movie/new',function(req,res){
    var id = req.body.movies._id
    var movieObj = req.body.movies
    var _movie
    if(id !== 'undefined'&& id !== ''){
        Movie.findById(id,function(err,movie){
            if(err)console.log(err)
            _movie = _.extend(movie,movieObj)//g更新字段
            _movie.save(function(err,movie){
                if(err)console.log(err)
                res.redirect('/movie/'+movie._id)//重定向到刚刚修改的列表
            })
        })
    }else{
        _movie = new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        })
        _movie.save(function(err,movie){
            if(err)console.log(err)
            res.redirect('/movie/'+movie._id)
        })
    }
})
// list page
app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) console.log(err)
        res.render('list', {
            title: "列表页面",
            movies: movies
        })
    })
})
//del action
app.delete('/admin/list',function(req,res){
    var id = req.query.id
    if(id){
        console.log(id)
        Movie.remove({_id:id},function(err,movie){
            if(err)console.log(err)
            res.json({success:1})
        })
    }
})