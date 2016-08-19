import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Venues } from '../api/venues.js';
import { DailyAggregates } from '../api/barchart.js';
import { SensorData } from '../api/barchart.js';
import { ReactiveDict } from 'meteor/reactive-dict';
 
import './body.html';

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

Template.VenueD.onCreated(function VenueOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('dailyAggregates');
  Meteor.subscribe('sensorData');
});

Template.VenueW.onCreated(function VenueOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('dailyAggregates');
  Meteor.subscribe('sensorData');
});

Template.VenueM.onCreated(function VenueOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('dailyAggregates');
  Meteor.subscribe('sensorData');
});


Template.VenueD.helpers({
  thisVenue() {
    const venueId=FlowRouter.getParam("venueId");
    // console.log(venueId);
    return Venues.findOne({"_id": venueId});
  },

  barChartDaily: function () {
    var peopleSeries=[{type: "column", name: "totPeople", data:[]},
                      {type: "column", name: "people", data:[]}];
    var peopleDates=[];

    var today= new Date();
    var todayStart=new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var aDay= 1000 * 60 * 60 *24;
    var yesterday = new Date(today - aDay);
    //console.log(today, yesterday);

    var thisVenueSeries=SensorData.find({"sensorId": this.sensorId, "timestamp": {$gte: todayStart }});
    thisVenueSeries.forEach(function(doc) {
      peopleSeries[0].data.push(doc.totPeople);
      peopleSeries[1].data.push(doc.people);
      peopleDates.push(doc.timestamp.toLocaleTimeString());
    });
    //console.log(peopleSeries);
    //console.log(peopleDates);

    // Use Meteor.defer() to create chart after DOM is ready:
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
                  '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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

Template.VenueW.helpers({
	thisVenue() {
	    const venueId=FlowRouter.getParam("venueId");
	    // console.log(venueId);
	    return Venues.findOne({"_id": venueId});
	},

	barChartWeek: function () {
	    var i=0;
	    var peopleSeries=[{type: "column", name: "totalPeople", data:[]},
	                      {type: "column", name: "avgPeople", data:[]},
	                      {type: "column", name: "maxPeople", data:[]}];
	    var peopleDates=[];

	    var today= new Date();
	    var dayOfYear=dateToDay(today);
	    var dayOfWeek=today.getDay();
	    var startOfWeek=dayOfYear-dayOfWeek;

	    var aDay= 1000 * 60 * 60 *24;
	    var lastWeek = new Date(today - (aDay*dayOfWeek));
	    //console.log(dayOfYear, startOfWeek);

	    var thisVenueSeries=DailyAggregates.find({"sensorId": this.sensorId, "dayOfYear": {$gte: startOfWeek }}).fetch();
	    
	    thisVenueSeries.forEach(function(doc) {
	      peopleSeries[0].data.push(doc.totalPeople);
	      peopleSeries[1].data.push(doc.avgPeople);
	      peopleSeries[2].data.push(doc.maxPeople);
	      peopleDates.push(doc.dayOfMonth);
	    });
	    //console.log(peopleSeries);
	    //console.log(peopleDates);
	    
	    // Use Meteor.defer() to create chart after DOM is ready:
	    Meteor.defer(function() {
	    	Highcharts.chart('chart', {
				title: {
				  text: 'People in venue w/c ' + lastWeek.toDateString()
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
				      '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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
	}
});

Template.VenueM.helpers({
	thisVenue() {
	    const venueId=FlowRouter.getParam("venueId");
	    // console.log(venueId);
	    return Venues.findOne({"_id": venueId});
	},

	barChartMonth: function () {
	    var i=0;
	    var peopleSeries=[{type: "column", name: "totalPeople", data:[]},
	                      {type: "column", name: "avgPeople", data:[]},
	                      {type: "column", name: "maxPeople", data:[]}];
	    var peopleDates=[];

	    var today= new Date();
	    var dayOfYear=dateToDay(today);
	    var dayOfMonth=today.getDate();
	    var startOfMonth=dayOfYear-dayOfMonth;
	    var monthStartDate=new Date(today.getFullYear(),today.getMonth(),1);

	    var thisVenueSeries=DailyAggregates.find({"sensorId": this.sensorId, "dayOfYear": {$gte: startOfMonth }}).fetch();
	    
	    thisVenueSeries.forEach(function(doc) {
	      peopleSeries[0].data.push(doc.totalPeople);
	      peopleSeries[1].data.push(doc.avgPeople);
	      peopleSeries[2].data.push(doc.maxPeople);
	      peopleDates.push(doc.dayOfMonth);
	    });
	    //console.log(peopleSeries);
	    //console.log(peopleDates);
	    
	    // Use Meteor.defer() to create chart after DOM is ready:
	    Meteor.defer(function() {
	    	Highcharts.chart('chart', {
				title: {
				  text: 'People in venue since ' + monthStartDate.toDateString()
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
				      '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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
	}
});


Template.VenueD.events({
  'submit .venue-data'(event) {
    //console.log("Save me!")
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    if(target.timeframe.value=='today') {
    	window.location.assign("/venue/" + this._id);
    } else if (target.timeframe.value=='week') {
    	window.location.assign("/venue/" + this._id + "/w");
    } else {
    	window.location.assign("/venue/" +this._id + "/m");
    }
  },
});

Template.VenueW.events({
  'submit .venue-data'(event) {
    //console.log("Save me!")
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    if(target.timeframe.value=='today') {
    	window.location.assign("/venue/" + this._id);
    } else if (target.timeframe.value=='week') {
    	window.location.assign("/venue/" + this._id + "/w");
    } else {
    	window.location.assign("/venue/" +this._id + "/m");
    }
  },
});
 
Template.VenueM.events({
  'submit .venue-data'(event) {
    //console.log("Save me!")
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    if(target.timeframe.value=='today') {
    	window.location.assign("/venue/" + this._id);
    } else if (target.timeframe.value=='week') {
    	window.location.assign("/venue/" + this._id + "/w");
    } else {
    	window.location.assign("/venue/" +this._id + "/m");
    }
  },
});