import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Venues } from '../api/venues.js';
import { Events } from '../api/events.js';

import './body.html';


Template.AddEvent.helpers({
  thisVenue() {
    const venueId=FlowRouter.getParam("venueId");
    console.log("Adding Event: ", venueId);
    return Venues.findOne({"_id": venueId});
  },
});

Template.EditEvent.helpers({
  thisEvent() {
    const eventId=FlowRouter.getParam("eventId");
    const currentEvent= Events.findOne({"_id": eventId});
    return currentEvent;
  },
  thisStartDateTime() {
    var thisYear=this.startDateTime.getFullYear();
    var thisMonth=this.startDateTime.getMonth()+1;
    var thisDay=this.startDateTime.getDate();
    var thisHours=this.startDateTime.getHours();
    var thisMins=this.startDateTime.getMinutes();
    if (thisMonth <10) {
      thisMonth="0"+thisMonth;
    }
    if (thisDay <10) {
      thisDay="0"+thisDay;
    }
    if (thisHours <10) {
      thisHours="0"+thisHours;
    }
    if (thisMins <10) {
      thisMins="0"+thisMins;
    }
    const thisDateTime=thisYear+"-"+thisMonth+"-"+thisDay+" "+thisHours+":"+thisMins;
    return thisDateTime;
  },
  thisEndDateTime() {
    var thisYear=this.endDateTime.getFullYear();
    var thisMonth=this.endDateTime.getMonth()+1;
    var thisDay=this.endDateTime.getDate();
    var thisHours=this.endDateTime.getHours();
    var thisMins=this.endDateTime.getMinutes();
    if (thisMonth <10) {
      thisMonth="0"+thisMonth;
    }
    if (thisDay <10) {
      thisDay="0"+thisDay;
    }
    if (thisHours <10) {
      thisHours="0"+thisHours;
    }
    if (thisMins <10) {
      thisMins="0"+thisMins;
    }
    const thisDateTime=thisYear+"-"+thisMonth+"-"+thisDay+" "+thisHours+":"+thisMins;
    return thisDateTime;
  }
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
    return Venues.findOne({"_id": venueId});
  },
  thisStartDateTime() {
    var thisYear=this.startDateTime.getFullYear();
    var thisMonth=this.startDateTime.getMonth();
    var thisDay=this.startDateTime.getDate();
    var thisHours=this.startDateTime.getHours();
    var thisMins=this.startDateTime.getMinutes();
    const thisMonthName=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (thisDay <10) {
      thisDay="0"+thisDay;
    }
    if (thisHours <10) {
      thisHours="0"+thisHours;
    }
    if (thisMins <10) {
      thisMins="0"+thisMins;
    }
    const thisDateTime=thisDay+" "+thisMonthName[thisMonth]+" "+thisYear+", "+thisHours+":"+thisMins;
    return thisDateTime;
  },
  thisEndDateTime() {
    var thisYear=this.endDateTime.getFullYear();
    var thisMonth=this.endDateTime.getMonth();
    var thisDay=this.endDateTime.getDate();
    var thisHours=this.endDateTime.getHours();
    var thisMins=this.endDateTime.getMinutes();
    const thisMonthName=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (thisDay <10) {
      thisDay="0"+thisDay;
    }
    if (thisHours <10) {
      thisHours="0"+thisHours;
    }
    if (thisMins <10) {
      thisMins="0"+thisMins;
    }
    const thisDateTime=thisDay+" "+thisMonthName[thisMonth]+" "+thisYear+", "+thisHours+":"+thisMins;
    return thisDateTime;
  }
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
    const eventStartDateTime = new Date(target.eventStartDateTime.value);
    const eventEndDateTime = new Date(target.eventEndDateTime.value);

    //insert above data into db
    Meteor.call('events.insert', eventName, eventDescription,
      eventStartDateTime, eventEndDateTime, this._id);
    window.location.assign("/venueevents/" + this._id);
  },
});

Template.EditEvent.events({
  'submit .edit-event'(event) {
    
    //prevent the browser from submitting
    event.preventDefault();

    //get values from form
    const target = event.target;
    const eventId=this._id;
    const venueId = target.venueId.value;
    const eventName = target.eventName.value;
    const eventDescription = target.eventDescription.value;
    const eventStartDateTime = new Date(target.eventStartDateTime.value);
    const eventEndDateTime = new Date(target.eventEndDateTime.value);
    Meteor.call('events.update', eventName, eventDescription,
      eventStartDateTime, eventEndDateTime, eventId);

    window.location.assign("/venueevents/" + venueId);
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
