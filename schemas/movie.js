var mongoose = require('mongoose') //建模工具模块
var MovieSchema = new mongoose.Schema({//声明字段以及相关的类型
    doctor: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})
//为MovieSchema添加方法
MovieSchema.pre('save',function(next){
    if(this.isNew){//新加的一条数据
        this.meta.createAt = this.meta.updateAt = Date.now()
    }else{
        this.meta.updateAt = Date.now()
    }
    next()
})
//添加静态方法
MovieSchema.statics = {
    fetch:function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById:function(id,cb){
        return this
            .findOne({'_id':id})
            .exec(cb)
    }
}
module.exports = MovieSchema