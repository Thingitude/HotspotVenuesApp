import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Venues } from './venues.js';

export const Events = new Mongo.Collection('events');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish events that belong to the current user
  Meteor.publish('events', function eventsPublication() {
    return Events.find();
    console.log("published events");
    //return Venues.find();
  });
}

Meteor.methods({
  'events.insert'(name, description, 
      startDateTime, endDateTime, venueId) {
    console.log("run events.insert");
    check(name, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Events.insert({
      name, 
      description, 
      startDateTime, 
      endDateTime,  
      venueId
    });
  },
  'events.update'(name, description, 
      startDateTime, endDateTime, eventId) {
    console.log("run events.update");
    check(name, String);

    //checking privelleges
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Events.update(eventId, {
      $set: {name, 
      description, 
      startDateTime, 
      endDateTime
      }
    });
  },
  'events.remove'(eventId) {
    check(eventId, String);

    const event = Events.findOne(eventId);
    const venueId = event.venueId;
    const venue = Venues.findOne(venueId);

    if (venue.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Events.remove(eventId);
  },
});

