var
  $body = $("body");

$("[data-countdown]").each(function() {
  var
    momentLocale = $(this).data("countdown") || "cs",
    endDate = moment($(this).text()).locale(momentLocale),
    deadDate = endDate.fromNow();

  $(this).text(deadDate);
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

$("[data-onoff]").on("click", function() {
  var
    thisAttr = $(this).data("onoff"),
    classToAdd = "onoff--" + thisAttr,
    classActive = "is--active";

  $body.removeClass(function(index, css) {
    return (css.match (/(^|\s)onoff--\S+/g) || []).join(" ");
  });

  $body.addClass(classToAdd);
  $(this).addClass(classActive);
  $(this).siblings().removeClass(classActive);
});

var mapEl = document.getElementById("js-map");

function initMap() {
  if (mapEl !== null) {
    new google.maps.Map(mapEl, {
      center: {lat: 49.2242573, lng: 17.6569664},
      zoom: 15,
      scrollwheel: false
    })
  }
}
