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
    BlazeLayout.render("mainLayout", {content: "VenueEventsList"});
  }
});

FlowRouter.route('/venue/:venueId', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "VenueD"});
  }
});

FlowRouter.route('/venue/:venueId/w', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "VenueW"});
  }
});

FlowRouter.route('/venue/:venueId/m', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "VenueM"});
  }
});

FlowRouter.route('/venue/:venueId/x', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "VenueX"});
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

FlowRouter.route('/compare/:venueId', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "CompareVenueSelect"});
  }
});

FlowRouter.route('/compare/:ownersVenueId/:comparingVenueId', {
    action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "CompareCallerD"});
  }
});

FlowRouter.route('/compare/:ownersVenueId/:comparingVenueId/w', {
    action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "CompareCallerW"});
  }
});

FlowRouter.route('/compare/:ownersVenueId/:comparingVenueId/m', {
    action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "CompareCallerM"});
  }
});

FlowRouter.route('/compare/:ownersVenueId/:comparingVenueId/x', {
    action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "CompareCallerX"});
  }
});

FlowRouter.route('/export/:venueId', {
    action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "Export"});
  }
});