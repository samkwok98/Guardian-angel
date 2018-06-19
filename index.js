const functions = require('firebase-functions');
var admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

var firestore = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld1 = functions.https.onRequest((request, response) => {
        

       switch(request.body.result.action){
           case'bookHospital':
             let params = request.body.result.parameters;
           
                   firestore.collection('bookings').add(params)
                       .then(() => {
                           response.send({
                               speech:
                               `${params.name} your hospital booking request is forwarded, we will let you know the details soon`
                           });
                       })
                       .catch((e=>{
                           response.send({
                               speech:"something went wrong"
                           });
                       }))
                break;

           case'showBookings':
                firestore.collection('bookings').get().then((querySnapshot)=> {

                    var bookings = [];
                    querySnapshot.forEach((doc) => {bookings.push(doc.data())});
 
                    var speech = `you have ${bookings.length} bookings \n`;

                    bookings.forEach((eachBooking, index) => {
                     
                        speech += `number ${index + 1} is booked by ${eachBooking.name} on ${eachBooking.date} at ${eachBooking.time}\n`
                    })

                    response.send({
                        speech: speech
                    });
                })
                .catch((err) => {
                    console.log(`Error getting the documents`, err);

                    response.send({
                        speech:"Something went wrong connecting to database"
                    })
                })


                break;

            case'medicine':
                let params1 = request.body.result.parameters;
                let medicineName = params1.medicineName;
                //console.log(medicineName);
   
                firestore.collection('medicine').get().then((querySnapshot)=> {

                    var med = [];
                    querySnapshot.forEach((doc) => {med.push(doc.data())});

                    var speech = '';
                    var BreakException = {};

                    med.forEach((eachMed, index) => {
                       // console.log("inside for loop");
                        console.log("eachMed.medicineName: " + eachMed.medicineName);
                        console.log("medicine name from user: " +medicineName);
                        if (eachMed.medicineName.trim() == medicineName.trim()){
                            speech = `The recommended dosage of ${eachMed.medicineName} is to take ${eachMed.medicineDosage} \n`
                        }
                       
                    })
                    console.log("come here?");
                    response.send({
                        speech: speech
                    });
                })
                .catch((err) => {
                    console.log(`Error getting the documents`, err);

                    response.send({
                        speech:"Something went wrong connecting to database"
                    })
                })


                break;

                

           default:
                    response.send({
                        speech: "no action matched in helloworld1"
                    })
       }

});
