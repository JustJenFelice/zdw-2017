var
  $body = $("body");

$("[data-countdown]").each(function() {
  var
    momentLang = $(this).data("countdown") || "cs",
    endDate = moment("2017-01-31").lang(momentLang),
    deadDate = endDate.fromNow(),
    countdownText = momentLang == "en" ? "Deadline " : "Uzávěrka ";

  $(this).text(countdownText + deadDate);
});

$("[data-nav-toggle]").on("click", function() {
  $body.toggleClass("nav--is-open");
});

$("[data-switcher]").on("click", function() {
  $body.toggleClass("switcher--is-open");
})

$("[data-upload]").change(function() {
  if (this.files.length > 20) {
    $("[data-upload-info]").addClass("animate--glow");

    this.value = "";
  }
});
