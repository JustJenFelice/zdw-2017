var
  $body = $("body");

var
  endDate = moment("2017-01-31"),
  deadDate = endDate.fromNow();

$("[data-countdown]").text("Uzávěrka " + deadDate);

$("[data-nav-toggle]").on("click", function() {
  $body.toggleClass("nav--is-open");
});

$("[data-upload]").change(function() {
  if (this.files.length > 20) {
    $("[data-upload-info]").addClass("animate--glow");

    this.value = "";
  }
});
