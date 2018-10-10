//initialize the map on the screen before document ready
var map;
var longlat;
var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
  })
}


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
    $("#step-4 .row").each(function (item) {
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

    var eventGuest = {
      initialRequirement: eventAdmin.initialRequirement,
    }

    //reset count of all items in eventGuest.initialRequirement
    for (var i = 0; i < eventGuest.initialRequirement.length; i++) {
      eventGuest.initialRequirement[i].item[1] = 0
    }

    database.ref('/Guests').set({
      eventGuest

    });
  });



  //update the DOM with Event Plan and Host related info and MAP
  database.ref('/Host').on('value', function (snapshot) {

    $('#party-name').text(snapshot.val().eventAdmin.eventName)
    $('#party-date').text(snapshot.val().eventAdmin.eventDate)
    $('#party-time').text(snapshot.val().eventAdmin.eventTime)
    $('#party-date').text(snapshot.val().eventAdmin.eventDate)
    $('#event-location').text(snapshot.val().eventAdmin.address)
    //update the DOM with required items needed at the party
    $('.responsive-table-body-req').empty()
    for (var i = 0; i < snapshot.val().eventAdmin.initialRequirement.length; i++) {

      if (snapshot.val().eventAdmin.initialRequirement[i].item[1] > 0) {
        $('.responsive-table-body-req').append(
          `
            <tr>
              <td>${snapshot.val().eventAdmin.initialRequirement[i].item[0]}</td>
              <td>${snapshot.val().eventAdmin.initialRequirement[i].item[1]}</td>
              <td> <a class="btn-floating btn-small waves-effect waves-light green"><i class="material-icons req-items" Data-orgitem=${i}>add</i></a></td>
            </tr>  

          `
        )
      }
    }
    var temp = snapshot.val().eventAdmin.amendedRequirement
    if (typeof temp !== 'undefined') {
      for (var j = 0; j < temp.length; j++) {
        if (snapshot.val().eventAdmin.amendedRequirement[j].hostAddedLineItemQty > 0) {
          $('.responsive-table-body-req').append(
            `
            <tr>
              <td>${snapshot.val().eventAdmin.amendedRequirement[j].hostAddedLineItem}</td>
              <td>${snapshot.val().eventAdmin.amendedRequirement[j].hostAddedLineItemQty}</td>
              <td> <a class="btn-floating btn-small waves-effect waves-light green"><i class="material-icons req-items" Data-amenitem=${j}>add</i></a></td>
            </tr>  

          `
          )
        }
        i++
      }
    }




    //update/zoom map on to new event plan address 
    var address = snapshot.val().eventAdmin.address
    while (address.includes(' ')) {
      address = address.replace(' ', '+')
    }
    var queryURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyBbMW1zoS4wDZPiww8JT1EDrUr0jfbeqw0'
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function (response) {
      longlat = response.results[0].geometry.location
      map.setZoom(12);
      map.setCenter(longlat)
      var marker = new google.maps.Marker({
        position: longlat,
        map: map,
        title: 'Party Destination!!!',
        icon: image
      });
    });


  })




  //update DOM with Guest related info
  database.ref('/Guests').on('value', function (snapshotGuests) {

    $('.responsive-table-body-res').empty()


    for (var i = 0; i < snapshotGuests.val().eventGuest.initialRequirement.length; i++) {
      if (snapshotGuests.val().eventGuest.initialRequirement[i].item[1] > 0) {
        $('.responsive-table-body-res').append(
          `
            <tr>
            <td>${snapshotGuests.val().eventGuest.initialRequirement[i].item[0]} </td>
                  <td>${snapshotGuests.val().eventGuest.initialRequirement[i].item[1]}</td>
                  <td> <a class="btn-floating btn-small waves-effect waves-light green"><i class="material-icons req-items-assigned" Data-initialitemres=${i}>add</i></a></td>
           </tr>  

            `
        )
      }
    }


    var temp = snapshotGuests.val().eventGuest.amendedRequirement
    console.log(temp)
    if (typeof temp !== 'undefined') {
      for (var i = 0; i < snapshotGuests.val().eventGuest.amendedRequirement.length; i++) {

        if (snapshotGuests.val().eventGuest.amendedRequirement[i].hostAddedLineItemQty > 0) {
          $('.responsive-table-body-res').append(
            `
            <tr>
            <td>${snapshotGuests.val().eventGuest.amendedRequirement[i].hostAddedLineItem} </td>
                  <td>${snapshotGuests.val().eventGuest.amendedRequirement[i].hostAddedLineItemQty}</td>
                  <td> <a class="btn-floating btn-small waves-effect waves-light green"><i class="material-icons req-items-assigned" Data-amendeditemsres=${i}>add</i></a></td>
           </tr>  

            `
          )
        }
      }
    }
  })







  $('.responsive-table-body-req').on('click', '.req-items', function () {


    var tempDataVal = $(this).data('orgitem')
    console.log(tempDataVal)
    if (typeof tempDataVal !== 'undefined') {

      return database.ref('/Host').once('value').then(function (snapshot) {
        console.log(snapshot.val())

        var newQty = snapshot.val().eventAdmin.initialRequirement[tempDataVal].item[1] - 1
        //updating quantity of items still needed on the "to do" side after choice made by user
        database.ref('Host/eventAdmin/initialRequirement/' + tempDataVal + '/item').update({
          1: newQty
        })
        

        return database.ref('Guests').once('value').then(function (snapshotGuest) {

          var newQtyGuest = snapshotGuest.val().eventGuest.initialRequirement[tempDataVal].item[1] + 1
          //updating quantity of items still needed on the "to do" side after choice made by user
          database.ref('Guests/eventGuest/initialRequirement/' + tempDataVal + '/item').update({
            1: newQtyGuest
          })
          
        })


      })
    }
    else {

      tempDataVal = $(this).data('amenitem')

      return database.ref('/Host').once('value').then(function (snapshot) {

        var newQty = snapshot.val().eventAdmin.amendedRequirement[tempDataVal].hostAddedLineItemQty - 1
        //updating quantity of items still needed on the "to do" side after choice made by user
        database.ref('Host/eventAdmin/amendedRequirement/' + tempDataVal).update({
          hostAddedLineItemQty: newQty
        })

        return database.ref('Guests').once('value').then(function (snapshotGuest) {

          var newQtyGuest = snapshotGuest.val().eventGuest.amendedRequirement[tempDataVal].hostAddedLineItemQty + 1
          //updating quantity of items still needed on the "to do" side after choice made by user
          database.ref('Guests/eventGuest/amendedRequirement/' + tempDataVal).update({
            hostAddedLineItemQty: newQtyGuest
          })
        })
      })
    }
  })



  //Zone-4 Add "to do list" by Host (this is amendment to his/her original list)
  $('#submit-item-name').on('click', function () {
    console.log('Host added a new Item to bring')


    //Capture input item name 
    var hostAddedLineItem = $('#add-item-name').val().trim()
    //clear input field
    $('#to-do-input').val('')
    //capture input Qty
    var hostAddedLineItemQty = $('#add-item-qty').val().trim()
    $('#add-item-qty').val('')

    return database.ref('Host/eventAdmin/amendedRequirement').once('value').then(function (snapshotHostAdded) {

      console.log(snapshotHostAdded)
      var numExistingRecords = snapshotHostAdded.numChildren()
      console.log(numExistingRecords)


      if (typeof numExistingRecords === 'undefined') {
        numExistingRecords = 0
        database.ref('Host/eventAdmin/amendedRequirement/' + numExistingRecords).set({
          hostAddedLineItem,
          hostAddedLineItemQty
        })
        database.ref('Guests/eventGuest/amendedRequirement/' + numExistingRecords).set({
          hostAddedLineItem,
          hostAddedLineItemQty: 0
        })
      } else {
        database.ref('Host/eventAdmin/amendedRequirement/' + numExistingRecords).set({
          hostAddedLineItem,
          hostAddedLineItemQty
        })
        database.ref('Guests/eventGuest/amendedRequirement/' + numExistingRecords).set({
          hostAddedLineItem,
          hostAddedLineItemQty: 0
        })
      }
    })
  })


  // //Flicker Section
  // function JavaScriptFetch() {
  //   var script = document.createElement('script');
  //   script.src = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=" + document.getElementById("search").value;;
  //   document.querySelector('head').appendChild(script);
  // }

  // function jsonFlickrFeed(data) {
  //   var image = "";
  //   data.items.forEach(function (element) {
  //     image += "<img src=\"" + element.media.m + "\"/>";
  //   });

  //   document.getElementById("outputDiv").innerHTML = image;
  // }

  // $("#submit").click(function (e) {
  //   $("#outputDiv").html("");

  // });

});