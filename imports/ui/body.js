import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

import { Venues } from '../api/venues.js';
import { Events } from '../api/events.js';
import { SensorData } from '../api/barchart.js';
import { Reviews } from '../api/reviews.js';
import { ReactiveDict } from 'meteor/reactive-dict';
 
import './barchart.js';
import './compare.js';
import './reviews.js';
import './export.js';
import './events.js';
import './body.html';

Debug = Venues;

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('venues');
  Meteor.subscribe('events');
  Meteor.subscribe('reviews');
  Meteor.subscribe('SensorData');
});

Template.VenueList.helpers({
  thisReview(){
    const venueId = this._id;
    var reviewData = Reviews.find({"venueId" : venueId}).fetch();
    console.log(reviewData);
    var score = 0;
    for(var i = 0; i < reviewData.length; i++){
      score += reviewData[i].score;
    }
    score = score / reviewData.length;
    console.log(score);
    if(isNaN(score))
    {
      score = 0.1;
    }
    var obj = {avg : score};
    return obj;
  },
  venues() {
    //console.log("body.js venuesssummary helper");
    //console.log(Venues.find({"owner": this.userId}));
    return Venues.find({owner: Meteor.userId()});
  },
  incompleteCount() {
    return Venues.find({owner: Meteor.userId()}).count();
  },
});


Template.EditVenue.helpers({
  thisVenue() {
    const venueId=FlowRouter.getParam("venueId");
    console.log("editvenue");
//    return Venues.find({"_id": "ZzwCsxZHFRQDiXtiF"});
    return Venues.findOne({"_id": venueId});
  }
});


Template.AddVenue.events({
  'submit .add-venue'(event) {
    //console.log("Save me!")
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const venueName = target.venueName.value;
    const venueDescription = target.venueDescription.value;
    const venueSensorId = target.venueSensorId.value;
    const venueLogStart = target.venueLogStart.value;
    const venueLogEnd = target.venueLogEnd.value;
    const venueLatitude = target.venueLatitude.value;
    const venueLongitude = target.venueLongitude.value;
    const venueOpeningHours = target.venueOpeningHours.value;
    const venuePhone = target.venuePhone.value;
    const venueWebsite = target.venueWebsite.value;
    const venueBooking = target.venueBooking.value;
    const venueNews = target.venueNews.value;
 
    // Insert a venue into the collection
    Meteor.call('venues.insert', venueName, venueDescription, venueSensorId,
      venueLogStart, venueLogEnd,venueLatitude, venueLongitude, venueOpeningHours, 
      venuePhone, venueWebsite, venueBooking, venueNews);
    // Clear form
    //target.text.value = '';
    window.location.assign("/");
  },
});



Template.EditVenue.events({
  'submit .edit-venue'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const venueId = this._id;
    const venueName = target.venueName.value;
    const venueDescription = target.venueDescription.value;
    const venueLogStart = target.venueLogStart.value;
    const venueLogEnd = target.venueLogEnd.value;
    const venueSensorId = target.venueSensorId.value;
    const venueLatitude = target.venueLatitude.value;
    const venueLongitude = target.venueLongitude.value;
    const venueOpeningHours = target.venueOpeningHours.value;
    const venuePhone = target.venuePhone.value;
    const venueWebsite = target.venueWebsite.value;
    const venueBooking = target.venueBooking.value;
    const venueNews = target.venueNews.value;
 
    // Insert a venue into the collection
    Meteor.call('venues.update', venueId, venueName, venueDescription, venueSensorId, 
      venueLogStart, venueLogEnd, venueLatitude, venueLongitude, venueOpeningHours, 
      venuePhone, venueWebsite, venueBooking, venueNews);
    // Clear form
    //target.text.value = '';
    window.location.assign("/venue/" + this._id);
  },
});
