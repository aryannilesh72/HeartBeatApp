var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db');

var patientSchema = mongoose.Schema({
  name: String,
  date: Date,
  session: String,
  heartBeat: String,
  timestamp: String
});

var Patient = mongoose.model("Patient", patientSchema);

/* GET Patient listing. */

router.get('/all', function (req, res) {
  Patient.find(function (err, response) {
    res.json(response);
  });
});

/* Add new Patient. */

router.post('/addPatient', function (req, res) {
  var patientInfo = req.body; 

  var newPatient = new Patient({
    name: patientInfo.name,
    date: patientInfo.date,
    session: patientInfo.session,
    heartBeat: patientInfo.heartBeat,
    timestamp: patientInfo.timestamp
  });

  newPatient.save(function (err, Person) {
    if (err)
      res.render('show_message', { message: "Database error", type: "error" });
    else
      res.render('show_message', {
        message: "New Patient added", type: "success", patient: patientInfo
      });
  });
});

/* Get Patient Health Record. */

router.get('/getHealth/:id', function (req, res) {
  var id = req.params.id;
  Patient.findById(id, function (err, response) {
    res.json(response);
  });
});

/* Update Patient Health Record. */

router.put('/updateHealth', function (req, res) {
  var patient = req.body;
  var session = getSession(patient.timestamp);
  var newPatient = new Patient({
    name: patient.name,
    date: patient.date,
    session: session,
    heartBeat: patient.heartBeat,
    timestamp: patient.timestamp
  });

  Patient.findByIdAndUpdate(patient.id, newPatient,
    function (err, response) {
      console.log(response);
    });
});

function getSession(timeStamp){
  var d = new Date(timeStamp);
  if (d.getHours() > 3 && d.getHours() < 11) {
    return 'Morning';
  } else if (d.getHours() > 11 && d.getHours() > 19) {
    return 'Afternoon';
  } else {
    return 'Evening';
  }
}

module.exports = router;
