module.exports ={
    initilise: function() {
        const mongoose = require('mongoose');
        mongoose.connect('mongodb://localhost:27017/headphones', {
            useNewUrlParser: true,
            useUnifiedTopology: true
    });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'it did not connect'));
        db.once('open', ()=>{console.log('Success connected!')})
        process.on("SIGINT", function() {
            db.close(function() {
                console.log("Mongoose connection disconnected through app termination.");
                process.exit(0);
            });
        });
    }   
}