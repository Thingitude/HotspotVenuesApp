import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

import { Venues } from '../api/venues.js';
import { Events } from '../api/events.js';
import { Reviews } from '../api/reviews.js';
import { ReactiveDict } from 'meteor/reactive-dict';
 
import './barchart.js';
import './event.js';
import './body.html';

Debug = Venues;

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('venues');
  Meteor.subscribe('events');
  Meteor.subscribe('reviews');
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

Template.VenueEventsList.helpers({
  events() {
    const venueId=FlowRouter.getParam("venueId");
    return Events.find({"venueId": venueId});
  },
  incompleteCount() {
    const venueId=FlowRouter.getParam("venueId");
    return Events.find({"venueId": venueId}).count();
  },
  thisVenue() {
    const venueId=FlowRouter.getParam("venueId");
    console.log("venueevents helper");
    return Venues.findOne({"_id": venueId});
  },
  dateToStr() {
    //var start = this.startDateTime;
    //console.log(startDateTime);
    //const eventStartDateTime = start.toString();
    //return eventStartDateTime;
    return;
  }
});

Template.compareTemplate.helpers({
  OwnerVenue(){
    const venueId=FlowRouter.getParam("ownersVenueId");
    //console.log(venueId);
    //console.log(Venues.find(_id: venueId));
    const venue = Venues.findOne({_id: venueId});
    //console.log(Venues.findOne({_id: venueId}));
    return venue;
  },
  CompareVenue(){
  const venueId=FlowRouter.getParam("comparingVenueId");
  //console.log(venueId);
  //console.log(Venues.find(_id: venueId));
  const venue = Venues.findOne({_id: venueId});
  //console.log(Venues.findOne({_id: venueId}));
  return venue;
  }
});

Template.CompareVenueSelect.helpers({
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
  thisVenue(){
    const venueId=FlowRouter.getParam("venueId");
    return venueId;
  },
  venues() {
    //console.log("body.js venuesssummary helper");
    //console.log("venue");
    return Venues.find({owner: {$ne : Meteor.userId()}});
  },

});

/*Template.Event.helpers({
  thisEvent(){
    const eventId=FlowRouter.getParam("eventId");
    return Events.findOne({"_id": eventId});
  }
});
*/

Template.EditVenue.helpers({
  thisVenue() {
    const venueId=FlowRouter.getParam("venueId");
    console.log("editvenue");
//    return Venues.find({"_id": "ZzwCsxZHFRQDiXtiF"});
    return Venues.findOne({"_id": venueId});
  }
});

Template.EditEvent.helpers({
  thisEvent() {
    const eventId=FlowRouter.getParam("eventId");
    console.log("Edit Event");
    return Events.findOne({"_id": eventId});
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

Template.AddEvent.helpers({
  thisVenue() {
    const venueId=FlowRouter.getParam("venueId");
    console.log("Adding Event: ", venueId);
    return Venues.findOne({"_id": venueId});
  },
});

Template.VenueEventsList.events({
  'click .delete' : function() {
    var confirmed = true;
    if(Meteor.isClient){
      console.log("deleting ", this._id);
      confirmed = confirm("Are you sure you want to delete " + this.name)
    }
    if(confirmed === true)
    {
      console.log("Inside if");
      Meteor.call('events.remove', this._id);
    }
  },

});

Template.AddEvent.events({
  'submit .add-event'(event) {
    console.log("Before default");
    //prevent default browser input
    event.preventDefault();

    //Get the values from the element
    const target = event.target;
    const eventName = target.eventName.value;
    const eventDescription = target.eventDescription.value;
    const eventStartDateTime = new Date(target.eventStartDate.value);
    const eventEndDateTime = new Date(target.eventEndDate.value);

    console.log("Adding events");
    
    //insert above data into db
    Meteor.call('events.insert', eventName, eventDescription,
      eventStartDateTime, eventEndDateTime, this._id);
    window.location.assign("/venueevents/" + this._id);
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

Template.EditEvent.events({
  'submit .edit-event'(event) {
    console.log("form submitted");
    
    //prevent the browser from submitting
    event.preventDefault();

    //get values from form
    const target = event.target;
    const eventId=this._id;
    const venueId = target.venueId.value;
    const eventName = target.eventName.value;
    const eventDescription = target.eventDescription.value;
    var startDateTimeSTR = target.eventStartDateTime.value;
    const eventStartDateTime = new Date(startDateTimeSTR);
    var eventEndDateTimeSTR = target.eventEndDateTime.value; 
    const eventEndDateTime = new Date(eventEndDateTimeSTR);

    Meteor.call('events.update', eventName, eventDescription,
      eventStartDateTime, eventEndDateTime, eventId);

    window.location.assign("/venueevents/" + venueId);
  },
});

Template.CompareNavBar.helpers({
  OwnerVenue(){
    const venueId=FlowRouter.getParam("ownersVenueId");
    //console.log(venueId);
    //console.log(Venues.find(_id: venueId));
    const venue = Venues.findOne({_id: venueId});
    //console.log(Venues.findOne({_id: venueId}));
    return venue;
  },
  CompareVenue(){
  const venueId=FlowRouter.getParam("comparingVenueId");
  //console.log(venueId);
  //console.log(Venues.find(_id: venueId));
  const venue = Venues.findOne({_id: venueId});
  //console.log(Venues.findOne({_id: venueId}));
  return venue;
  },
});


