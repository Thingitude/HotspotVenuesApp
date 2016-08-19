import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './event_summary.html';

Template.eventsummary.events({
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

