

//initialize the map on the screen 
var map;
var longlat;
var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
// var address = '300 North Point PKWY, Alpharetta, GA'
// var queryURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyBbMW1zoS4wDZPiww8JT1EDrUr0jfbeqw0'
// while (address.includes(' ')) {
//   address = address.replace(' ', '+')
// }


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
  })
}

// map.setCenter({ lat: 34.0848, lng: -84.2559 })
// map.setZoom(15)
// var myLatLng = { lat: 34.0848, lng: -84.2559 }


// $.ajax({
//   url: queryURL,
//   method: 'GET'
// }).then(function (response) {
//   longlat = response.results[0].geometry.location
//   map.setZoom(12);
//   map.setCenter(longlat)
//   var marker = new google.maps.Marker({
//     position: longlat,
//     map: map,
//     title: 'Party Destination!!!',
//     icon: image
//   });
// });


$(document).ready(function () {


  //initialize firebase
  var config = {
    apiKey: "AIzaSyCfxrNFR0IkXIzWEPrkJVR5UX0MGrqteL0",
    authDomain: "mikesproject-bd0c2.firebaseapp.com",
    databaseURL: "https://mikesproject-bd0c2.firebaseio.com",
    projectId: "mikesproject-bd0c2",
    storageBucket: "mikesproject-bd0c2.appspot.com",
    messagingSenderId: "911450662789"
  };
  firebase.initializeApp(config);

  //define global variables 
  var database = firebase.database()
  var dataTodoCounter = 0;
  var dataAssignedCounter = 0;
  var tempQty = 6



  //setup the Connections Child Ref
  var connectionsRef = database.ref("/connections");
  var connectedRef = database.ref(".info/connected");
  connectedRef.on("value", function (snap) {
    if (snap.val()) {
      var con = connectionsRef.push(true);
      con.onDisconnect().remove();
    }
  });

  //This will be the function that kicks off once an event host has filled out the initial event page.  The eventAdmin object is a place holder and will need to be constructed from user input
  $('#submit-finish-btn').on('click', function () {
    
   var getHostName = $("#host-name").val().trim();
   var getHostEmail = $("#host-email").val().trim();
   var getHostPhone = $("#host-phone").val().trim();
   var getEventName = $("#event-name").val().trim();
   var getEventDate = $("#event-date").val().trim();
   var getEventTime = $("#event-time").val().trim();
   var getEventAddress = $("#event-address").val().trim();
   var itemsNeeded = $("#items-needed-1").val().trim();

    var initialRequirement = [];
    $("#step-4 .row").each(function(item) {
      var name = $(this).find('.item-name').val().trim();
      var number = Number($(this).find('.item-number').val());
      initialRequirement.push({
        item: [name, number]
      });
    });

    var eventAdmin = {
      name: getHostName,
      address: getEventAddress,
      eventName: getEventName,
      emailAddress: getHostEmail,
      phoneNum: getHostPhone,
      eventDate: getEventDate,
      eventTime: getEventTime,
      initialRequirement: initialRequirement
    }
    console.log(initialRequirement);
    database.ref('/Host').set({
      eventAdmin
    });

    // var eventGuest = {
    //   initialRequirement: eventAdmin.initialRequirement,
    // }

    // //reset count of all items in eventGuest.initialRequirement
    // for (var i = 0; i < eventGuest.initialRequirement.length; i++) {
    //   eventGuest.initialRequirement[i].item[1] = 0
    // }

    // database.ref('/Guests').set({
    //   eventGuest

    // });
  });



//   //update the DOM with event plan info 
//   database.ref('/Host').on('child_added', function (snapshot) {
//     $('.event').append(
//       `
//         <p>Event Name:  ${snapshot.val().eventName}</p>
//         <p>Host: ${snapshot.val().name}</p>
//         <p>Address: ${snapshot.val().address}</P>
//         <p>Date: ${snapshot.val().eventDate}</p>
//         <p>Time: ${snapshot.eventTime}</p>
//       `
//     )
//     //update the DOM with required items needed at the party
//     for (var i = 0; i < snapshot.val().initialRequirement.length; i++) {
//       if (snapshot.val().initialRequirement[i].item[1] > 0) {
//         $('.todo-block').append(
//           `
//             <p class="org-req-items" Data-item=${i} >${snapshot.val().initialRequirement[i].item[0]}      QTY: ${snapshot.val().initialRequirement[i].item[1]}</p>
//           `
//         )
//       }
//     }







//     database.ref('/Guests').on('value', function (snapshotGuests) {
//       $('.assigned-block').empty()
//       for (var i = 0; i < snapshotGuests.val().eventGuest.initialRequirement.length; i++) {
//         if (snapshotGuests.val().eventGuest.initialRequirement[i].item[1] > 0) {
//           $('.assigned-block').append(
//             `
//               <p class="org-req-items-assigned" Data-item=${i} >${snapshotGuests.val().eventGuest.initialRequirement[i].item[0]}      QTY: ${snapshotGuests.val().eventGuest.initialRequirement[i].item[1]}</p>
//             `
//           )
//         }
//         if (snapshotGuests.val().guestAdded !== 'undefined'){
//             for(var i = 0; i < snapshotGuests.val().guestAdded.length;i++){
//               $('.todo-block').append(
//                 `
//                   <p class="guest-added-items" data-item=${i} >${snapshotGuests.val().guestAdded[i].guestAddedLineItem}  Qty: ${snapshotGuests.val().guestAdded[i].guestAddedLineItemQty}</p> 
      
//                 `
//               )  
//             }
          
//         }
//       }
//     })


//     //update/zoom map on to new event plan address 
//     var address = snapshot.val().address
//     while (address.includes(' ')) {
//       address = address.replace(' ', '+')
//     }
//     var queryURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyBbMW1zoS4wDZPiww8JT1EDrUr0jfbeqw0'
//     $.ajax({
//       url: queryURL,
//       method: 'GET'
//     }).then(function (response) {
//       longlat = response.results[0].geometry.location
//       map.setZoom(12);
//       map.setCenter(longlat)
//       var marker = new google.maps.Marker({
//         position: longlat,
//         map: map,
//         title: 'Party Destination!!!',
//         icon: image
//       });
//     });
//   })



//   $('.todo-block').on('click', '.org-req-items', function () {
//     var tempDataVal = $(this).data('item')
//     // tempDataVal = tempDataVal.parseFloat()
//     console.log(tempDataVal)

//     return database.ref('/Host').once('value').then(function (snapshot) {
//       console.log(snapshot.val())
//       var newQty = snapshot.val().eventAdmin.initialRequirement[tempDataVal].item[1] - 1
//       //updating quantity of items still needed on the "to do" side after choice made by user
//       database.ref('Host/eventAdmin/initialRequirement/' + tempDataVal + '/item').update({
//         1: newQty
//       })
//       // function to show subtracted items to bring in zone 4.  Each click above subtracts from pre-defined total and shows the remaining items to bring in the database and To-Do list area
//       database.ref('/Host').on('child_added', function (snapshot) {
//         $('.todo-block').empty()
//         for (var i = 0; i < snapshot.val().initialRequirement.length; i++) {
//           if (snapshot.val().initialRequirement[i].item[1] > 0) {
//             $('.todo-block').append(
//               `
//                 <p class="org-req-items" Data-item=${i} >${snapshot.val().initialRequirement[i].item[0]}      QTY: ${snapshot.val().initialRequirement[i].item[1]}</p>
//               `
//             )
//           }
//         }
//       })


//       return database.ref('Guests').once('value').then(function (snapshotGuest) {
//         var newQtyGuest = snapshotGuest.val().eventGuest.initialRequirement[tempDataVal].item[1] + 1
//         //updating quantity of items still needed on the "to do" side after choice made by user
//         database.ref('Guests/eventGuest/initialRequirement/' + tempDataVal + '/item').update({
//           1: newQtyGuest
//         })
//         database.ref('/Guests').on('value', function (snapshotGuests) {
//           $('.assigned-block').empty()
//           for (var i = 0; i < snapshotGuest.val().eventGuest.initialRequirement.length; i++) {

//             if (snapshotGuests.val().eventGuest.initialRequirement[i].item[1] > 0) {
//               $('.assigned-block').append(
//                 `
//                   <p class="org-req-items-assigned" Data-item=${i} >${snapshotGuests.val().eventGuest.initialRequirement[i].item[0]}      QTY: ${snapshotGuests.val().eventGuest.initialRequirement[i].item[1]}</p>
//                 `
//               )
//             }
//           }
//         })
//       })


//     })
//   })




// //ITEMS BEING ADDED BY USERS NEEDS WORK.  ITEM/QTY NEED TO BE CAPTURED AND PUSHED INTO THE GUEST OBJECT UNDER A NEW CHILD CALLED GUEST ADVISED (or something of that nature to distinguish between what was asked by the party host and what the guest decided to bring on their own)


//   //Zone-4 "to do list" (submit button)
//   $('#add-to-do-items').on('click', function () {
//     console.log('Guest is trying to volunteer a new item to bring ')
//     //Capture input item name 
//     var guestAddedLineItem = $('#to-do-input').val().trim()
//     //capture input Qty
//     var guestAddedLineItemQty = 5
     
//     return database.ref('Guests/guestAdded').once('value').then(function(snapshotGuestsAdded){
     
//     var numExistingRecords = snapshotGuestsAdded.numChildren()
//     console.log(numExistingRecords)
   
    

//     if(typeof numExistingRecords === 'undefined' ){
//         numExistingRecords = 0
//         database.ref('Guests/guestAdded/'+ numExistingRecords).set({
//           guestAddedLineItem,
//           guestAddedLineItemQty
//         })
//     }else {
//         database.ref('Guests/guestAdded/'+ numExistingRecords).set({
//           guestAddedLineItem,
//           guestAddedLineItemQty
//         })
           
//     }
//     })
    
 
//   })


//   // database.ref('/toDoList').on('child_added', function (snapshot) {
//   //   dataTodoCounter = snapshot.numChildren() + 1
//   //   console.log('in the database update ref')
//   //   if (snapshot.val() === null) {
//   //     console.log('it was null')
//   //     return
//   //   } else {
//   //     console.log('made it to else statement')
//   //     console.log(snapshot.val().toDoInstruction)
//   //     $('.todo-block').append('<p class="todoList" Data-todo =' + snapshot.val().toDoId + ' Data-qty=' + snapshot.val().quantityRequiredEst + '> ' + snapshot.val().toDoInstruction + '</p>')
//   //   }
//   // }, function (errorObject) {
//   //   console.log('The Read Failed: ' + errorObject.code)
//   // })

//   //on clicking a task move the to do into zone 5
//   $('.todo-block').on('click', '.todoList', function () {
//     console.log('you clicked a item from to do list')
//     var tempDataVal = $(this).data('todo')
//     var tempHtmlInfo = $(this).html().trim()
//     var quantityAssigned = $(this).data('qty') - 1
//     console.log(quantityAssigned)

//     database.ref('/assigned/' + tempHtmlInfo).set({
//       assignedId: tempDataVal,
//       toDoInstruction: tempHtmlInfo,
//       quantityAssigned
//     })

//     //updating quantity of items still needed on the "to do" side after choice made by user
//     database.ref('toDoList/' + tempHtmlInfo).update({
//       quantityRequiredEst: 1
//     })
//   })


//   database.ref('/assigned').on('child_added', function (snapshot) {
//     dataAssignedCounter = snapshot.numChildren() + 1
//     console.log('in the database assigned Ref')
//     if (snapshot.val() === null) {
//       console.log('it was null')
//       return
//     } else {
//       console.log('made it to else statement')
//       console.log(snapshot.val().toDoInstruction)
//       $('.assigned-block').append('<p class="assigned-tasks" Data-qty = ' + snapshot.val().quantityAssigned + 'Data-assigned =' + snapshot.val().assignedId + '> ' + snapshot.val().toDoInstruction + '</p>')
//     }
//   }, function (errorObject) {
//     console.log('The Read Failed: ' + errorObject.code)
//   })



//   //Flicker Section
//   function JavaScriptFetch() {
//     var script = document.createElement('script');
//     script.src = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=" + document.getElementById("search").value;;
//     document.querySelector('head').appendChild(script);
//   }

//   function jsonFlickrFeed(data) {
//     var image = "";
//     data.items.forEach(function (element) {
//       image += "<img src=\"" + element.media.m + "\"/>";
//     });

//     document.getElementById("outputDiv").innerHTML = image;
//   }

//   $("#submit").click(function (e) {
//     $("#outputDiv").html("");

//   });

});