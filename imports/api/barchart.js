import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


 
//import './body.html';

export const SensorData = new Mongo.Collection('sensorData');
export const DailyAggregates = new Mongo.Collection('dailyAggregates');
 
if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish venues that belong to the current user
  Meteor.publish('dailyAggregates', function dailyAggregatesPublication() {
    return DailyAggregates.find();
  });
  Meteor.publish('sensorData', function sensorDataPublication() {
    return SensorData.find();
  });
}

