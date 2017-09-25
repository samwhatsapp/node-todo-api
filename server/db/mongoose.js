const mongoose = require('mongoose');



mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/todoapp');
mongoose.connect('mongodb://admin:admin@ds151024.mlab.com:51024/todoapp');


module.exports = {
	mongoose:mongoose
}
