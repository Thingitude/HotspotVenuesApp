import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Venues = new Mongo.Collection('venues');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish venues that belong to the current user
  Meteor.publish('venues', function venuesPublication() {
    return Venues.find();
  });
}


 
Meteor.methods({
  'venues.insert'(name, description, sensorId,
      logStart, logEnd, latitude, longitude, openingHours, 
      phone, websiteURL, bookingURL,newsURL) {
    console.log("run venues.insert");
    check(name, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Venues.insert({
      name, 
      description, 
      sensorId,
      logStart,
      logEnd,
      latitude, 
      longitude, 
      openingHours, 
      phone,
      websiteURL, 
      bookingURL,
      newsURL,
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'venues.update'(venueId, name, description,sensorId, 
      logStart, logEnd, latitude, longitude, openingHours, 
      phone, websiteURL, bookingURL,newsURL) {
    console.log("run venues.insert");
    check(name, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    const venue = Venues.findOne(venueId);

    Venues.update(venueId, {
      $set: {name, 
        description, 
        sensorId,
        logStart,
        logEnd,
        latitude, 
        longitude, 
        openingHours, 
        phone,
        websiteURL, 
        bookingURL,
        newsURL,
      }
    });
  },
  'venues.remove'(venueId) {
    check(venueId, String);
 
    const venue = Venues.findOne(venueId);
    if (venue.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
   
    Venues.remove(venueId);
    
  },
});
