const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGOURL;

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(db => console.log('Database is connected to:',db.connection.host))
.catch(err => console.log(err));

