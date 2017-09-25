const mongoose = require('mongoose');



mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
// mongoose.connect('mongodb://admin:admin@ds151024.mlab.com:51024/todoapp');


module.exports = {
	mongoose:mongoose
}
