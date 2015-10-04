/**********************************************/
/*               MONGOSSE MODEL               */
/**********************************************/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Profil = new Schema({
    userId : String,
    firstname: String,
    lastname: String,
    job : {
        title: String,
        attachment: String,
        area: String,
        summary: String,
        email: String,
        tel: String,
        place: String,
        assistant: String,
    },

    socialNetwork : {
        twitter: String,
        linkedIn: String,
    }

});

module.exports = mongoose.model('Profils', Profil);