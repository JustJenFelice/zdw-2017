var
  endDate = moment("2017-01-31"),
  deadDate = endDate.fromNow();

$("[data-countdown]").text("Uzávěrka " + deadDate);
