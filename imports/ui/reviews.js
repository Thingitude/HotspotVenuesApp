import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

import { Venues } from '../api/venues.js';
import { Events } from '../api/events.js';
import { SensorData } from '../api/barchart.js';
import { Reviews } from '../api/reviews.js';
import { ReactiveDict } from 'meteor/reactive-dict';


Template.Reviews5.helpers({
  thisReview(){
    const venueId = FlowRouter.getParam('venueId');
    var reviewData = Reviews.find({"venueId" : venueId }, {sort: {"timestamp": -1},limit: 5}).fetch();
    return reviewData;
  }
});

Template.ReviewsW.helpers({
  thisReview(){
    const venueId = FlowRouter.getParam('venueId');
    var today= new Date();
    weeknum = today.getTime() - 604800000; //milliseconds in a week
    weekAgo = new Date(weeknum);
    var reviewData = Reviews.find({"venueId" : venueId, "timestamp": {$gte: weekAgo }},{sort: {"timestamp": -1}}).fetch();
    return reviewData;
  }
});

Template.ReviewsM.helpers({
  thisReview(){
    const venueId = FlowRouter.getParam('venueId');
    var today= new Date();
    weeknum = today.getTime() - 2628000000 ; //milliseconds in a month-ish
    weekAgo = new Date(weeknum);
    var reviewData = Reviews.find({"venueId" : venueId, "timestamp": {$gte: weekAgo }},{sort: {"timestamp": -1}}).fetch();
    return reviewData;
  }
});

Template.ReviewsX.helpers({
  thisReview(){
    const venueId = FlowRouter.getParam('venueId');
    var today= new Date();
    var todayStart=new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var reviewData = Reviews.find({"venueId" : venueId, "timestamp": {$gte: todayStart }},{sort: {"timestamp": -1}}).fetch();
    return reviewData;
  }
});

