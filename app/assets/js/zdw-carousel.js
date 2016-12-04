var carouselOptions = {
  imagesLoaded: true,
  pageDots: false
}

if (matchMedia("screen and (min-width: 740px)").matches) {
  carouselOptions.contain = true;
}

$("[data-carousel]").each(function() {
  $(this).flickity(carouselOptions);
});


