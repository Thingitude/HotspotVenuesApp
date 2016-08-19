FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "VenueList"});
  }
});

FlowRouter.route('/addvenue', {
  action: function() {
    console.log("AddVenue template");
    BlazeLayout.render("mainLayout", {content: "AddVenue"});
  }
});

FlowRouter.route('/editvenue/:venueId', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "EditVenue"});
  }
});

FlowRouter.route('/venueevents/:venueId', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "VenueEvents"});
  }
});

FlowRouter.route('/venue/:venueId', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "Venue"});
  }
});

FlowRouter.route('/addevent/:venueId', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "AddEvent"});
  }
});

FlowRouter.route('/editevent/venueId', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "EditEvent"});
  }
});

FlowRouter.route('/event/:eventId', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "Event"});
  }
});

FlowRouter.route('/editevent/:eventId', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "EditEvent"});
  }
});
