/**********************************************/
/*               MONGOSSE MODEL               */
/**********************************************/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Profil = new Schema({
    userId : String,
    userName : String,
    firstname: String,
    lastname: String,
    job : {
        title: String,
        attachment: String,
        area: String,
        summary: String,
        email: String,
        tel: String,
        website: String,
        place: String,
        assistant: String,
    },

    socialNetwork : {
        twitter: String,
        linkedIn: String,
    },

    profilPic: String,
    bg: String,
    companyLogo: String,

});

module.exports = mongoose.model('Profils', Profil);