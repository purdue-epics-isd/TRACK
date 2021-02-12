const { v4: uuidv4 } = require('uuid');
const GoalData = require('../models/goaldata.model');
const Goal = require('../models/goal.model');
const Student = require('../models/student.model');
const dataURLtoBlob = require('dataurl-to-blob');
var CryptoJS = require("crypto-js");

// Require packages
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

let gfs;
let db = mongoose.connection;
db.once('open', () => {
  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection('uploads');
});

async function encryption(string) {
    let ciphertext = await CryptoJS.AES.encrypt(string, 'secret key 123').toString();
    return ciphertext;
}

async function decryption(ciphertext) {
    // await console.log("decryption")
    var bytes  = await CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    // await console.log("bytes:", bytes);
    var originalText = await bytes.toString(CryptoJS.enc.Utf8);
    // await console.log("originalText", originalText);
    return originalText;
}


exports.goaldata_create = async function (req, res) {
    try {
        console.log("req.body", req.body)
        let goaldata = new GoalData(
            {
                goalID: req.params.goalid,
                score: req.body.score,
                count: req.body.count,
                rubricOption: req.body.optionsRadios,
                support: req.body.support,
                comments: await encryption(req.body.comments),
                time: Date.now(),
                teacherEmail: await encryption(req.body.useremail),
                filename: await encryption(req.body.file),
                file: req.body.filecontents
            }
        );
        let fileSize = 0
        if (req.body.filecontents[req.body.filecontents.length - 2] == '=') {
            console.log("ends with ==");
            fileSize = (req.body.filecontents.length * (3/4)) - 2;
        }
        else {
            console.log("ends with =");
            fileSize = (req.body.filecontents.length * (3/4)) - 1;
        }
        if (fileSize > 15728640) {
            console.log("fileSize is too large");
            goaldata.file = "null";
        }
        goaldata.file = await encryption(goaldata.file);


        Goal.findOneAndUpdate({_id: req.params.goalid}, {$push: {goaldata: goaldata}}, function (err, goal) {
            console.log("\nGoal to be updated: " + goal);
            console.log("\nGoaldata to be added: " + goaldata);
            //console.log("\nTeacher email: " + req.body.useremail);

            goaldata.save(function (err) { 
                if (err) {
                    res.send(err);
                }
            });
        });
        // console.log("is shared?: " + req.params.shared);
        // //console.log("evaluate: " + (type(req.params.shared)));
        // console.log("req.body.filebool", req.body.filebool);
        // if (req.body.filebool == 'true') {
        //     console.log("there is a file")
        //     var writeStream = gfs.createWriteStream({
        //         filename: serial,
        //         metadata: req.params.goalid
        //     })
        //     fs.createReadStream(path).pipe(writeStream);




        // }
        // else {
        //     console.log("there is not a file")
        // }
        if(req.params.shared == "true") {
            console.log("navigating to shared student profile...");
            res.redirect("/sharedWithMe/" + req.params.studentid);
        } else {
            console.log("navigating to personal student profile...");
            res.redirect("/student/" + req.params.studentid);
        }
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
};

exports.goaldata_delete = function (req, res) {
    try {
        //console.log(req.body.id)
        GoalData.findByIdAndRemove(req.params.goaldataid, function (err) {
            if (err) return next(err);
            res.redirect('/student/' + req.params.studentid + '/goal/' + req.params.goalid);
        })
    } catch(err) {
        console.log(err);
        res.render('/error');
    }
};