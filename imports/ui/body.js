import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Venues } from '../api/venues.js';
import { Events } from '../api/events.js';
import { ReactiveDict } from 'meteor/reactive-dict';
 
import './barchart.js';
import './event.js';
import './body.html';
 

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('venues');
  Meteor.subscribe('events');
});

Template.VenueList.helpers({
  venues() {
    //console.log("body.js venuesssummary helper");
    return Venues.find();
  },
  incompleteCount() {
    return Venues.find().count();
  },
});


Template.VenueEventsList.helpers({
  events() {
    return Events.find();
  },
  incompleteCount() {
    return Events.find().count();
  },
  thisVenue() {
    const venueId=FlowRouter.getParam("venueId");
    console.log("venueevents helper");
    return Venues.findOne({"_id": venueId});
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
    const venueLatitude = target.venueLatitude.value;
    const venueLongitude = target.venueLongitude.value;
    const venueOpeningHours = target.venueOpeningHours.value;
    const venuePhone = target.venuePhone.value;
    const venueWebsite = target.venueWebsite.value;
    const venueBooking = target.venueBooking.value;
    const venueNews = target.venueNews.value;
 
    // Insert a venue into the collection
    Meteor.call('venues.insert', venueName, venueDescription, venueSensorId,
      venueLatitude, venueLongitude, venueOpeningHours, 
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
    const eventStartDateTime = target.eventStartDate.value;
    const eventEndDateTime = target.eventEndDate.value;

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
      venueLatitude, venueLongitude, venueOpeningHours, 
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
    const eventStartDateTime = target.eventStartDateTime.value;
    const eventEndDateTime = target.eventEndDateTime.value;    

    Meteor.call('events.update', eventName, eventDescription,
      eventStartDateTime, eventEndDateTime, eventId);

    window.location.assign("/venueevents/" + venueId);
  },
});


