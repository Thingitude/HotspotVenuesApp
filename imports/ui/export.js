import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Venues } from '../api/venues.js';
import { DailyAggregates } from '../api/barchart.js';
import { SensorData } from '../api/barchart.js';
import { ReactiveDict } from 'meteor/reactive-dict';
 
import './body.html';
import './router.js';

Template.Export.onCreated(function VenueOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('dailyAggregates');
  Meteor.subscribe('sensorData');
});

Template.Export.helpers({
  thisVenue(){
    const venueId = FlowRouter.getParam('venueId');
    return Venues.findOne({"_id": venueId});
  },
});

Template.Export.events({
  'submit .set-date-range'(event) {
    var today= new Date();
    var thisYear=today.getFullYear();
    var thisMonth=today.getMonth();
    var dayOfMonth=today.getDate();
    
    //prevent the browser from submitting
    event.preventDefault();

    //get values from form
    const target = event.target;
    target.exportButton.value="Exporting...";

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

    startDate=new Date(startDate);
    endDate=new Date(endDate);

    // Start the data gathering
    var sensorId=this.sensorId;
    
    var thisVenueSeries=DailyAggregates.find({"sensorId": sensorId, "date": {$gte: startDate, $lt: endDate} }).fetch();
    //console.log(thisVenueSeries);
  
    var csv=Papa.unparse(thisVenueSeries);
    //console.log(csv);

    var blob=new Blob([csv], {type: "text/csv;charset=utf-8"});

    var fileName="Hotspot-data-" + this.name.replace(/ /g , '-') + thisYear + "-" + thisMonth + "-" + dayOfMonth + ".csv";
    saveAs(blob,fileName);
    //window.open(encodeURI('data:text/csv;charset=utf-8,' + csv));
    target.exportButton.value="Exported";
    target.exportButton.className ="btn btn-success";

  }
});
