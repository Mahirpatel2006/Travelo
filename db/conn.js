const mongoose = require('mongoose');

mongoose.set('debug', true);

const mongo_uri = 'mongodb+srv://mahirpatel1426:FBELHYgoDbXUUGrY@registor.vbu674t.mongodb.net/?retryWrites=true&w=majority&appName=registor';

mongoose.connect(mongo_uri)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);
  });