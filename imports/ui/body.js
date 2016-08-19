import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Venues } from '../api/venues.js';
import { ReactiveDict } from 'meteor/reactive-dict';
 
//import './venue.js';
import './barchart.js';
import './body.html';

 
Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('venues');
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

Template.EditVenue.helpers({
  thisVenue() {
    const venueId=FlowRouter.getParam("venueId");
    console.log(venueId);
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

Template.EditVenue.events({
  'submit .edit-venue'(event) {
    //console.log("Save me!")
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

