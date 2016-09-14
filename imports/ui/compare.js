import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Venues } from '../api/venues.js';
import { DailyAggregates } from '../api/barchart.js';
import { SensorData } from '../api/barchart.js';
import { Reviews } from '../api/reviews.js';
import { ReactiveDict } from 'meteor/reactive-dict';
 
import './body.html';
import './router.js';
import './reviews.js';

// We use the Highcharts add-in for Meteor for the barcharts
var Highcharts= require('highcharts/highstock');
require('highcharts/modules/exporting');

//Useful date functions
function daysInFebruary(year) {
    if(year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        // Leap year
        return 29;
    } else {
        // Not a leap year
        return 28;
    }
}

// Now the day of year calculation

function dateToDay(date) {
    var feb = daysInFebruary(date.getFullYear());
    var daysMonth = [0, // January
                     31, // February
                     31 + feb, // March
                     31 + feb + 31, // April
                     31 + feb + 31 + 30, // May
                     31 + feb + 31 + 30 + 31, // June
                     31 + feb + 31 + 30 + 31 + 30, // July
                     31 + feb + 31 + 30 + 31 + 30 + 31, // August
                     31 + feb + 31 + 30 + 31 + 30 + 31 + 31, // September
                     31 + feb + 31 + 30 + 31 + 30 + 31 + 31 + 30, // October
                     31 + feb + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31, // Nov
                     31 + feb + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30, // December
                   ];
    return daysMonth[date.getMonth()] + date.getDate();
}

function ownerVenue() {
  const venueId=FlowRouter.getParam("ownersVenueId");
  console.log(venueId);
  return Venues.findOne({"_id": venueId});
}

function compareVenue(){
  const venueId=FlowRouter.getParam("comparingVenueId");
  console.log(venueId);
  return Venues.findOne({"_id": venueId});
}


Template.CompareD.onCreated(function CompareOnCreated(){
  this.state = new ReactiveDict();
  console.log("compare created");
  Meteor.subscribe('dailyAggregates');
  Meteor.subscribe('sensorData');
});

Template.CompareW.onCreated(function CompareOnCreated(){
  this.state = new ReactiveDict();
  console.log("compare created");
  Meteor.subscribe('dailyAggregates');
  Meteor.subscribe('sensorData');
});

Template.CompareM.onCreated(function CompareOnCreated(){
  this.state = new ReactiveDict();
  console.log("compare created");
  Meteor.subscribe('dailyAggregates');
  Meteor.subscribe('sensorData');
});

Template.CompareX.onCreated(function CompareOnCreated(){
  this.state = new ReactiveDict();
  console.log("compare created");
  Meteor.subscribe('dailyAggregates');
  Meteor.subscribe('sensorData');
});

Template.CompareNavBar.helpers({
  OwnerVenue(){
    const venueId=FlowRouter.getParam("ownersVenueId");
    const venue = Venues.findOne({_id: venueId});
    return venue;
  },
  CompareVenue(){
  const venueId=FlowRouter.getParam("comparingVenueId");
  const venue = Venues.findOne({_id: venueId});
  return venue;
  },
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
    var score = 0;
    for(var i = 0; i < reviewData.length; i++){
      score += reviewData[i].score;
    }
    score = score / reviewData.length;
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
    return Venues.find({_id: {$ne : FlowRouter.getParam("venueId")}});
  },

});


Template.CompareD.helpers({
  ownerVenue() {
  const venueId=FlowRouter.getParam("ownersVenueId");
  console.log(venueId);
  return Venues.findOne({"_id": venueId});
},
  compareVenue(){
  const venueId=FlowRouter.getParam("comparingVenueId");
  console.log(venueId);
  return Venues.findOne({"_id": venueId});
},
  barChartDaily () {
    console.log("Test");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    var owner = ownerVenue();
    var compare = compareVenue(); 
    console.log(owner);
    console.log("Test");
    var peopleSeries=[{type: "column", name: ownerVenue().name, data:[]},
                       {type: "column", name: compareVenue().name, data:[]}];
    console.log("after people series");

    var peopleDates=[];

    var today= new Date();
    var todayStart=new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var aDay= 1000 * 60 * 60 *24;
    console.log("test");
    var yesterday = new Date(today - aDay);
    console.log(today, yesterday);
    var thisVenueSeries=SensorData.find({"sensorId": this.sensorId, "timestamp": {$gte: todayStart }});
    console.log(compareVenue().sensorId);
    var thisCompareSeries=SensorData.find({"sensorId": compareVenue().sensorId, "timestamp": {$gte: todayStart }});
    console.log("Pre for loop");
    thisVenueSeries.forEach(function(doc) {

      peopleSeries[0].data.push(doc.people);
      peopleDates.push(doc.timestamp.toLocaleTimeString());   
    });
    thisCompareSeries.forEach(function(doc){
      peopleSeries[1].data.push(doc.people);
      peopleDates.push(doc.timestamp.toLocaleTimeString());
    });

    console.log(peopleSeries[0]);
    console.log(peopleSeries[1]);

    //console.log(peopleSeries);
    //console.log(peopleDates);
    // Use Meteor.defer() to create chart after DOM is ready:
    console.log("Point 2");
    Meteor.defer(function() {
      Highcharts.chart('chart', {
          title: {
              text: 'People in venue on ' + today.toDateString()
          },
          subtitle: {
              text: "Provided by Reading Hotspot"
          },
          xAxis: {
              categories: peopleDates,
              crosshair: true
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'People in venue'
              }
          },
          tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
          },
          plotOptions: {
              column: {
                  pointPadding: 0.2,
                  borderWidth: 0
              }
          },
          series: peopleSeries
      });
    });
  },
});

Template.CompareW.helpers({
  ownerVenue() {
  const venueId=FlowRouter.getParam("ownersVenueId");
  console.log(venueId);
  return Venues.findOne({"_id": venueId});
},
compareVenue(){
  const venueId=FlowRouter.getParam("comparingVenueId");
  console.log(venueId);
  return Venues.findOne({"_id": venueId});
},
  barChartWeekly () {
    console.log("Test");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    var owner = ownerVenue();
    var compare = compareVenue; 
    console.log(owner);
    console.log("Test");
    var peopleSeries=[{type: "column", name: ownerVenue().name, data:[]},
                      {type: "column", name: compareVenue().name, data:[]}];
    console.log("after people series");

    var peopleDates=[];

    var today= new Date();
    var dayOfYear=dateToDay(today);
    var dayOfWeek=today.getDay();
    var startOfWeek=dayOfYear-dayOfWeek;

    if(Meteor.isClient)
    {

    console.log("time: ", startOfWeek); 

    var aDay= 1000 * 60 * 60 *24;
    var lastWeek = new Date(today - (aDay*dayOfWeek));

    console.log(lastWeek);

    console.log(this.sensorId);

      var thisVenueSeries=DailyAggregates.find({"sensorId": this.sensorId, "dayOfYear": {$gte: startOfWeek }}).fetch();
      console.log(thisVenueSeries);
      console.log("test");

    console.log("id", compareVenue().sensorId)
      var thisCompareSeries=DailyAggregates.find({"sensorId": compareVenue().sensorId, "dayOfYear": {$gte: startOfWeek }}).fetch();
      console.log("test2");
        
    console.log("Pre for loop");
    thisVenueSeries.forEach(function(doc) {
      console.log("in loop");
      peopleSeries[0].data.push(doc.avgPeople);
      console.log(peopleSeries[0]);
      peopleDates.push(doc.dayOfMonth);   
    });
    console.log("in between");
    thisCompareSeries.forEach(function(doc){
      console.log("in loop 2");
      peopleSeries[1].data.push(doc.avgPeople);
      console.log(peopleSeries[1]);
      peopleDates.push(doc.dayOfMonth);
    });

    console.log("Series: ");
    console.log(peopleSeries[0]);
    console.log(peopleSeries[1]);

    //console.log(peopleSeries);
    //console.log(peopleDates);
    // Use Meteor.defer() to create chart after DOM is ready:
    console.log("Point 2");
  }
    Meteor.defer(function() {
      Highcharts.chart('chart', {
          title: {
              text: 'People in venue on ' + today.toDateString()
          },
          subtitle: {
              text: "Provided by Reading Hotspot"
          },
          xAxis: {
              categories: peopleDates,
              crosshair: true
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'People in venue'
              }
          },
          tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
          },
          plotOptions: {
              column: {
                  pointPadding: 0.2,
                  borderWidth: 0
              }
          },
          series: peopleSeries
      });
    });
  },
});

Template.CompareM.helpers({
  ownerVenue() {
  const venueId=FlowRouter.getParam("ownersVenueId");
  console.log(venueId);
  return Venues.findOne({"_id": venueId});
},
compareVenue(){
  const venueId=FlowRouter.getParam("comparingVenueId");
  console.log(venueId);
  return Venues.findOne({"_id": venueId});
},
  barChartMonthly () {
    console.log("Test");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    var owner = ownerVenue();
    var compare = compareVenue(); 
    console.log("Owner " + owner.name);
    console.log("Compare " + compare.name);
    var peopleSeries=[{type: "column", name: owner.name, data:[]},
                      {type: "column", name: compare.name, data:[]}];

    var peopleDates=[];

      var today= new Date();
      var dayOfYear=dateToDay(today);
      var dayOfMonth=today.getDate();
      var startOfMonth=dayOfYear-dayOfMonth;
      var monthStartDate=new Date(today.getFullYear(),today.getMonth(),1);

    console.log("time: ", startOfMonth); 

    console.log("Our sensor " +owner.sensorId);
    console.log("Their sensor " +compare.sensorId);

      var thisVenueSeries=DailyAggregates.find({"sensorId": owner.sensorId, "dayOfYear": {$gte: startOfMonth }}).fetch();
      console.log(thisVenueSeries);
      var thisCompareSeries=DailyAggregates.find({"sensorId": compare.sensorId, "dayOfYear": {$gte: startOfMonth }}).fetch();
      console.log(thisCompareSeries);
        
    thisVenueSeries.forEach(function(doc) {
      peopleSeries[0].data.push(doc.avgPeople);
      peopleDates.push(doc.dayOfMonth);   
    });
    thisCompareSeries.forEach(function(doc){
      peopleSeries[1].data.push(doc.avgPeople);
      peopleDates.push(doc.dayOfMonth);
    });

    console.log("Series: ");
    console.log("Point 2");

    Meteor.defer(function() {
      Highcharts.chart('chart', {
          title: {
          text: 'Comparing people in venue since ' + monthStartDate.toDateString()
          },
          subtitle: {
              text: "Provided by Reading Hotspot"
          },
          xAxis: {
              categories: peopleDates,
              crosshair: true
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'People in venue'
              }
          },
          tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
          },
          plotOptions: {
              column: {
                  pointPadding: 0.2,
                  borderWidth: 0
              }
          },
          series: peopleSeries
      });
    });
  },
});


Template.CompareX.helpers({
  ownerVenue() {
  const venueId=FlowRouter.getParam("ownersVenueId");
  console.log(venueId);
  return Venues.findOne({"_id": venueId});
},
compareVenue(){
  const venueId=FlowRouter.getParam("comparingVenueId");
  console.log(venueId);
  return Venues.findOne({"_id": venueId});
},
  thisStartDate() {
    var startDate = FlowRouter.getQueryParam("start");
    console.log(startDate);
    if(startDate==null) {
      var today= new Date();
      var thisYear=today.getFullYear();
      var thisMonth=today.getMonth();
      var dayOfMonth=today.getDate();
      startDate=thisYear+'-'+thisMonth+'-'+dayOfMonth; 
    }
    return startDate;
  },
  thisEndDate() {
    var endDate = FlowRouter.getQueryParam("end");
    console.log("end " + endDate);
    if(endDate==null) {
      var today= new Date();
      var thisYear=today.getFullYear();
      var thisMonth=today.getMonth()+1;
      var dayOfMonth=today.getDate();
      endDate=thisYear+'-'+thisMonth+'-'+dayOfMonth; 
    }
    return endDate;
  },

  barChartCustomCompare: function () {
    var i=0;


    var peopleSeries=[{type: "column", name: ownerVenue().name, data:[]},
                      {type: "column", name: compareVenue().name, data:[]}];
    var peopleDates=[];

    var chartStartDate=FlowRouter.getQueryParam("start");
    var chartEndDate=FlowRouter.getQueryParam("end");

    var today= new Date();
    var dayOfYear=dateToDay(today);
    var dayOfMonth=today.getDate();
    var startOfMonth=dayOfYear-dayOfMonth;
    var monthStartDate=new Date(today.getFullYear(),today.getMonth(),1);

    if(chartStartDate== null) {
      console.log("No start date specified");
      chartStartDate=monthStartDate;
    } else {
      chartStartDate=new Date(chartStartDate);
    };
    if(chartEndDate== null) {
      console.log("No end date specified");
      chartEndDate=today;
    } else {
      chartEndDate=new Date(chartEndDate);
    };

    var startYear=chartStartDate.getFullYear();
    var startDayOfYear=dateToDay(chartStartDate);
    var startMonth=chartStartDate.getMonth();
    var startDayOfMonth=chartStartDate.getDate();
    var endYear=chartEndDate.getFullYear();
    var endDayOfYear=dateToDay(chartEndDate);
    var sensorId=this.sensorId;

    console.log("Start - ",chartStartDate, " and End - ", chartEndDate);
    console.log("Sensor: ", sensorId);

    var thisVenueSeries=DailyAggregates.find({"sensorId": this.sensorId, "date": {$gte: chartStartDate, $lt: chartEndDate} }).fetch();
    var thisCompareSeries=DailyAggregates.find({"sensorId": compareVenue().sensorId, "date": {$gte: chartStartDate, $lt: chartEndDate} }).fetch();
    
    console.log(thisVenueSeries);
    console.log(thisCompareSeries);

    thisVenueSeries.forEach(function(doc) {
      peopleSeries[0].data.push(doc.avgPeople);
      peopleDates.push(doc.dayOfMonth);
    });
    thisCompareSeries.forEach(function(doc){
      peopleSeries[1].data.push(doc.avgPeople);  
    });
    console.log(peopleSeries);

    console.log(peopleDates);
    
    // Use Meteor.defer() to create chart after DOM is ready:
    Meteor.defer(function() {
      Highcharts.chart('chart', {
        title: {
          text: 'People in venue from ' + chartStartDate.toDateString() + ' to ' + chartEndDate.toDateString()
        },
        subtitle: {
          text: "Provided by Reading Hotspot"
        },
        xAxis: {
          categories: peopleDates,
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
              text: 'People in venue'
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: peopleSeries
      });
    });
  },
});

Template.CompareX.events({
  'submit .set-date-range'(event) {
    var today= new Date();
    var thisYear=today.getFullYear();
    var thisMonth=today.getMonth();
    var dayOfMonth=today.getDate();

    console.log("button clicked");
    
    //prevent the browser from submitting
    event.preventDefault();

    //get values from form
    const target = event.target;
    var startDate = target.startDate.value;
    var endDate = target.endDate.value;
    if(startDate=='') {
      if(thisMonth <10) {
        thisMonth='0'+thisMonth;
      }
      startDate=thisYear+'-'+thisMonth+'-'+dayOfMonth; 
    }    
    if(endDate=='') {
      thisMonth++;
      if(thisMonth <10) {
        thisMonth='0'+thisMonth;
      }
      endDate=thisYear+'-'+thisMonth+'-'+dayOfMonth; 
    }    

    //barChartCustom(startDate, endDate);
    console.log("Dates are ", startDate, " and ", endDate);
    //conole.log("Force break");
    window.location.assign("/compare/"+FlowRouter.getParam("ownersVenueId")+"/"+FlowRouter.getParam("comparingVenueId")+"/x?start="+startDate+"&end="+endDate);
  }
});
