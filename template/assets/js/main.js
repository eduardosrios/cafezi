(function ($) {
  "use strict";

  var $toggle = $(".nav-toggle");
  var $nav = $(".main-nav");
  var $actions = $(".header-actions");
  var compactNavigation = window.matchMedia("(max-width: 1100px)");

  function closeNavigation() {
    $nav.removeClass("is-open");
    $actions.removeClass("is-open");
    $toggle.attr("aria-expanded", "false");
    $toggle.find("i").addClass("fa-bars").removeClass("fa-xmark");
    $(".has-submenu").removeClass("is-open");
    $(".submenu-toggle").attr("aria-expanded", "false");
  }

  $toggle.on("click", function () {
    var isOpen = $nav.toggleClass("is-open").hasClass("is-open");
    $actions.toggleClass("is-open", isOpen);
    $toggle.attr("aria-expanded", String(isOpen));
    $toggle.find("i").toggleClass("fa-bars", !isOpen).toggleClass("fa-xmark", isOpen);
  });

  $(".main-nav > a, .nav-item > a, .submenu a, .hero-cta").on("click", function () {
    closeNavigation();
  });

  if (compactNavigation.addEventListener) {
    compactNavigation.addEventListener("change", closeNavigation);
  } else {
    compactNavigation.addListener(closeNavigation);
  }

  $(".body-form").on("submit", function (event) {
    event.preventDefault();
    var $button = $(this).find("button");
    $button.text("Request Sent").prop("disabled", true);
    window.setTimeout(function () {
      $button.text("Submit").prop("disabled", false);
    }, 2200);
  });

  $(".submenu-toggle").on("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    var $item = $(this).closest(".has-submenu");
    var isOpen = !$item.hasClass("is-open");
    $item.siblings(".has-submenu").removeClass("is-open").find(".submenu-toggle").attr("aria-expanded", "false");
    $item.toggleClass("is-open", isOpen);
    $(this).attr("aria-expanded", String(isOpen));
  });

  $(document).on("click", function () {
    $(".has-submenu").removeClass("is-open");
    $(".submenu-toggle").attr("aria-expanded", "false");
  });

  var $header = $(".hero-header");
  var $footer = $(".site-footer");
  var lastStickyScrollY = window.scrollY || window.pageYOffset || 0;
  var stickyDirection = "none";

  function updateStickyHeader(event) {
    if (!$header.length || !$footer.length) {
      return;
    }
    var currentScrollY = Math.max(window.scrollY || window.pageYOffset || 0, 0);
    var delta = currentScrollY - lastStickyScrollY;
    var isResize = event && event.type === "resize";

    if (!isResize && Math.abs(delta) > 4) {
      stickyDirection = delta < 0 ? "up" : "down";
    }

    var footerTop = $footer[0].getBoundingClientRect().top;
    var canStick = currentScrollY > 180 && footerTop > window.innerHeight;
    var shouldShow = canStick && stickyDirection === "up";

    $header.toggleClass("is-sticky-ready", canStick);
    $header.toggleClass("is-sticky-visible", shouldShow);
    lastStickyScrollY = currentScrollY;
  }

  $(window).on("scroll resize", updateStickyHeader);
  updateStickyHeader();

  $(".footer-newsletter").on("submit", function (event) {
    event.preventDefault();
    var $form = $(this);
    var $button = $form.find("button");
    $button.text("Subscribed").prop("disabled", true);
    window.setTimeout(function () {
      $button.text("Subscribe").prop("disabled", false);
      $form[0].reset();
    }, 2200);
  });

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $floatingReserve = $(".floating-reserve");
  var $bookingModal = $("#booking-modal");
  var $mediaModal = $("#media-modal");
  var $mediaPanel = $mediaModal.find(".media-panel");
  var $mediaImage = $mediaModal.find(".media-preview-image");
  var $mediaVideo = $mediaModal.find(".media-preview-video");
  var $mediaPrevious = $mediaModal.find(".media-previous");
  var $mediaNext = $mediaModal.find(".media-next");
  var $mediaCounter = $mediaModal.find(".media-counter");
  var mediaItems = [];
  var mediaIndex = 0;
  var lastFocusedElement = null;

  function openModal($modal) {
    lastFocusedElement = document.activeElement;
    $(".dynamic-modal.is-open").not($modal).removeClass("is-open").attr("aria-hidden", "true");
    $modal.addClass("is-open").attr("aria-hidden", "false");
    $("body").css("overflow", "hidden");
    window.setTimeout(function () {
      $modal.find("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])").filter(":visible").not(".simplebar-content-wrapper").first().trigger("focus");
    }, 40);
    if (window.gsap && !reduceMotion) {
      gsap.fromTo($modal.find(".dynamic-modal-panel")[0], { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .32, ease: "power2.out" });
    }
  }

  function closeModal() {
    $mediaVideo.each(function () {
      this.pause();
      this.removeAttribute("src");
      this.load();
    });
    $(".dynamic-modal").removeClass("is-open").attr("aria-hidden", "true");
    $("body").css("overflow", "");
    if (lastFocusedElement && document.contains(lastFocusedElement)) {
      lastFocusedElement.focus();
    }
    lastFocusedElement = null;
  }

  $("[data-close-modal]").on("click", closeModal);
  $(document).on("keydown", function (event) {
    var $openModal = $(".dynamic-modal.is-open");
    if (event.key === "Tab" && $openModal.length) {
      var $focusable = $openModal.find("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])").filter(":visible").not(".simplebar-content-wrapper");
      var first = $focusable[0];
      var last = $focusable[$focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === "Escape") {
      closeModal();
      closeNavigation();
    }
  });

  $floatingReserve.on("click", function () {
    openModal($bookingModal);
  });

  $(".booking-form").on("submit", function (event) {
    event.preventDefault();
    var $button = $(this).find("button");
    $button.text("Request Sent").prop("disabled", true);
    window.setTimeout(function () {
      $button.text("Send Request").prop("disabled", false);
      closeModal();
    }, 1600);
  });

  $(".product-filter button").on("click", function () {
    var filter = $(this).data("filter");
    var $section = $(this).closest(".body-section");
    $(this).addClass("is-active").siblings().removeClass("is-active");
    $section.find(".body-card-grid article").each(function () {
      var text = $(this).find("h3").text().toLowerCase();
      var show = filter === "all" || text.indexOf(String(filter)) !== -1;
      $(this).toggleClass("is-filtered-out", !show);
      if (window.gsap && !reduceMotion && show) {
        gsap.fromTo(this, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .24, ease: "power2.out" });
      }
    });
  });

  var $imageTriggers = $(".gallery-grid img, .mosaic-grid img, .collage-grid img, .body-card-grid img, .category-grid img, .duo-gallery img, .roast-card-grid img, .circle-category-row img");
  var $imageTriggerLinks = $(".category-grid a");
  var $videoTriggers = $(".video-feature video, .video-duplicate video");

  function renderMediaItem() {
    var item = mediaItems[mediaIndex];
    if (!item) {
      return;
    }
    if (item.type === "video") {
      $mediaPanel.removeClass("show-image").addClass("show-video");
      $mediaVideo.attr("src", item.src);
      $mediaCounter.text("Video 1 of 1");
      $mediaVideo[0].play().catch(function () {});
    } else {
      $mediaPanel.removeClass("show-video").addClass("show-image");
      $mediaImage.attr("src", item.src).attr("alt", item.alt || "Cafezi preview");
      $mediaCounter.text("Image " + (mediaIndex + 1) + " of " + mediaItems.length);
      $mediaPrevious.prop("disabled", mediaIndex === 0);
      $mediaNext.prop("disabled", mediaIndex === mediaItems.length - 1);
    }
    if (window.gsap && !reduceMotion) {
      gsap.fromTo($mediaPanel.find(item.type === "video" ? ".media-preview-video" : ".media-preview-image")[0], { opacity: .35, scale: .985 }, { opacity: 1, scale: 1, duration: .24, ease: "power2.out" });
    }
  }

  function openImageLightbox($source) {
    var $group = $source.closest(".gallery-grid, .mosaic-grid, .collage-grid, .body-card-grid, .category-grid, .duo-gallery, .roast-card-grid, .circle-category-row");
    var $groupImages = $group.length ? $group.find("img") : $source;
    mediaItems = $groupImages.map(function () {
      return { type: "image", src: $(this).attr("src"), alt: $(this).attr("alt") || "Cafezi preview" };
    }).get();
    mediaIndex = Math.max(0, $groupImages.index($source));
    renderMediaItem();
    openModal($mediaModal);
  }

  $imageTriggers.attr("tabindex", "0").attr("role", "button").each(function () {
    $(this).attr("aria-label", "Open " + ($(this).attr("alt") || "Cafezi image") + " in gallery");
  });

  $videoTriggers.attr("tabindex", "0").attr("role", "button").each(function () {
    $(this).attr("aria-label", "Open " + ($(this).attr("aria-label") || "Cafezi video") + " in player");
  });

  $imageTriggers.add($imageTriggerLinks).on("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    openImageLightbox($(this).is("img") ? $(this) : $(this).find("img").first());
  });

  $imageTriggers.on("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      $(this).trigger("click");
    }
  });

  $videoTriggers.on("click", function () {
    mediaItems = [{ type: "video", src: this.currentSrc || $(this).find("source").attr("src") }];
    mediaIndex = 0;
    renderMediaItem();
    openModal($mediaModal);
  }).on("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      $(this).trigger("click");
    }
  });

  $mediaPrevious.on("click", function () {
    mediaIndex = Math.max(0, mediaIndex - 1);
    renderMediaItem();
  });

  $mediaNext.on("click", function () {
    mediaIndex = Math.min(mediaItems.length - 1, mediaIndex + 1);
    renderMediaItem();
  });

  $(document).on("keydown", function (event) {
    if (!$mediaModal.hasClass("is-open") || !$mediaPanel.hasClass("show-image")) {
      return;
    }
    if (event.key === "ArrowLeft" && mediaIndex > 0) {
      mediaIndex -= 1;
      renderMediaItem();
    } else if (event.key === "ArrowRight" && mediaIndex < mediaItems.length - 1) {
      mediaIndex += 1;
      renderMediaItem();
    }
  });

  function updateFloatingReserve() {
    if (!$floatingReserve.length || !$footer.length) {
      return;
    }
    var footerTop = $footer[0].getBoundingClientRect().top;
    var visible = window.scrollY > 620 && footerTop > window.innerHeight;
    $floatingReserve.toggleClass("is-visible", visible);
  }

  $(window).on("scroll resize", updateFloatingReserve);
  updateFloatingReserve();

  var $categoryViewToggle = $(".category-view-toggle");
  var $coffeeTypesSection = $("#favorites");
  var $coffeeOriginSection = $("#coffee-origin-section");

  $categoryViewToggle.on("click", function () {
    var showCoffeeOrigin = $(this).attr("aria-pressed") !== "true";
    $(this).attr("aria-pressed", String(showCoffeeOrigin));
    $(this).find("span").text(showCoffeeOrigin ? "Coffee Origin" : "Coffee Types");
    $(this).insertBefore((showCoffeeOrigin ? $coffeeOriginSection : $coffeeTypesSection).find(".grain-category-nav"));
    $coffeeTypesSection.prop("hidden", showCoffeeOrigin);
    $coffeeOriginSection.prop("hidden", !showCoffeeOrigin);
    $(window).trigger("resize");
  });

  $(".grain-categories-wrapper").each(function () {
    var $wrapper = $(this);
    var $track = $wrapper.find(".grain-category-carousel");
    var $prev = $wrapper.find(".grain-category-prev");
    var $next = $wrapper.find(".grain-category-next");
    var raf = null;

    if (!$track.length) {
      return;
    }

    function getCategoryStep() {
      var card = $track.find(".grain-category-card").get(0);
      if (!card) {
        return Math.max($track.width() * .75, 240);
      }
      return card.getBoundingClientRect().width + 30;
    }

    function updateCategoryNav() {
      var track = $track.get(0);
      var max = Math.max(0, track.scrollWidth - track.clientWidth - 2);
      $prev.prop("disabled", track.scrollLeft <= 2);
      $next.prop("disabled", track.scrollLeft >= max);
    }

    function scheduleCategoryNav() {
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
      raf = window.requestAnimationFrame(updateCategoryNav);
    }

    $prev.on("click", function () {
      $track.get(0).scrollBy({ left: -getCategoryStep(), behavior: "smooth" });
    });

    $next.on("click", function () {
      $track.get(0).scrollBy({ left: getCategoryStep(), behavior: "smooth" });
    });

    $track.on("scroll", scheduleCategoryNav);
    $(window).on("resize", scheduleCategoryNav);
    updateCategoryNav();
  });
  var $heroVisual = $(".coshte-hero .hero-visual");
  if ($heroVisual.length && window.gsap && !reduceMotion) {
    $heroVisual.on("pointermove", function (event) {
      var rect = this.getBoundingClientRect();
      var x = ((event.clientX - rect.left) / rect.width - .5) * 12;
      var y = ((event.clientY - rect.top) / rect.height - .5) * 8;
      gsap.to($heroVisual.find(".hero-visual-media")[0], { x: x, y: y, scale: 1.012, duration: .45, ease: "power2.out", overwrite: true });
    }).on("pointerleave", function () {
      gsap.to($heroVisual.find(".hero-visual-media")[0], { x: 0, y: 0, scale: 1, duration: .55, ease: "power2.out", overwrite: true });
    });
  }

  $(".chef-grid article").attr("tabindex", "0");

  var sectionObserver = null;
  if ("IntersectionObserver" in window) {
    sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }
        var el = entry.target;
        if (window.gsap && !reduceMotion) {
          gsap.fromTo(el, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: .55, ease: "power2.out" });
        } else {
          el.style.opacity = 1;
        }
        sectionObserver.unobserve(el);
      });
    }, { threshold: .14 });

    $(".body-section, .site-footer, .hero-copy, .rating-card, .feature-pill").each(function () {
      this.setAttribute("data-animate", "");
      sectionObserver.observe(this);
    });
  }

  var countedStats = false;
  function animateStats() {
    var stats = document.querySelector(".stats-grid");
    if (!stats || countedStats) {
      return;
    }
    var box = stats.getBoundingClientRect();
    if (box.top > window.innerHeight || box.bottom < 0) {
      return;
    }
    countedStats = true;
    $(".stats-grid strong").each(function () {
      var el = this;
      var target = parseInt(el.textContent.replace(/\D/g, ""), 10) || 0;
      if (!window.gsap || reduceMotion) {
        el.textContent = target;
        return;
      }
      var obj = { value: 0 };
      gsap.to(obj, { value: target, duration: 1.2, ease: "power1.out", onUpdate: function () { el.textContent = Math.round(obj.value); } });
    });
  }

  $(window).on("scroll resize", animateStats);
  animateStats();

  function updateScrollSpy() {
    var ids = ["home", "about", "menu", "journal", "contact"];
    var active = "home";
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 180) {
        active = id;
      }
    });
    $(".main-nav a").removeClass("active");
    $(".main-nav a[href='#" + active + "']").first().addClass("active");
  }

  $(window).on("scroll resize", updateScrollSpy);
  updateScrollSpy();

  var $brewQuizModal = $("#brew-quiz-modal");

  function showBrewStep(step) {
    var $steps = $brewQuizModal.find(".brew-quiz-step");
    $steps.removeClass("is-active").filter("[data-brew-step='" + step + "']").addClass("is-active");
    $brewQuizModal.find(".brew-quiz-progress").attr("aria-valuenow", step).find("span").css("width", (step / 3 * 100) + "%");
    $brewQuizModal.find(".brew-quiz-progress strong").text("Step " + step + " of 3");
    var $focusTarget = $steps.filter(".is-active").find("input, button, a").filter(":visible").first();
    window.setTimeout(function () { $focusTarget.trigger("focus"); }, 40);
  }

  $(".open-brew-quiz").on("click", function () {
    $brewQuizModal.find(".brew-quiz-form")[0].reset();
    showBrewStep(1);
    openModal($brewQuizModal);
  });

  $brewQuizModal.on("click", ".brew-quiz-next", function () {
    var $choice = $brewQuizModal.find("input[name='taste']:checked");
    if (!$choice.length) {
      $brewQuizModal.find("input[name='taste']").first().trigger("focus");
      return;
    }
    showBrewStep(2);
  });

  $brewQuizModal.on("click", ".brew-quiz-back", function () {
    showBrewStep(1);
  });

  $brewQuizModal.on("submit", ".brew-quiz-form", function (event) {
    event.preventDefault();
    var taste = String($brewQuizModal.find("input[name='taste']:checked").val() || "");
    var method = String($brewQuizModal.find("input[name='method']:checked").val() || "");
    if (!method) {
      $brewQuizModal.find("input[name='method']").first().trigger("focus");
      return;
    }
    var matches = {
      balanced: ["House Espresso", "Caramel sweetness, cocoa depth, and an easy " + method + " recipe."],
      bright: ["Ethiopia Yirgacheffe", "Citrus lift, floral aroma, and a clean finish tuned for " + method + "."],
      bold: ["Resurrection Blend", "Dark cocoa, warm spice, and a full body that holds up beautifully in " + method + "."]
    };
    var match = matches[taste] || matches.balanced;
    $brewQuizModal.find(".brew-quiz-result h3").text(match[0]);
    $brewQuizModal.find(".brew-quiz-result > p").text(match[1]);
    showBrewStep(3);
  });

  $brewQuizModal.on("click", ".brew-quiz-restart", function () {
    $brewQuizModal.find(".brew-quiz-form")[0].reset();
    showBrewStep(1);
  });

  $(".testimonial-carousel").each(function () {
    var $carousel = $(this);
    var $track = $carousel.find(".testimonial-track");
    var $slides = $track.children("blockquote");
    var $previous = $carousel.find(".testimonial-prev");
    var $next = $carousel.find(".testimonial-next");
    var $status = $carousel.find(".testimonial-status strong");
    var carouselIndex = 0;

    function visibleReviews() {
      return window.innerWidth < 768 ? 1 : 2;
    }

    function updateReviewCarousel(animate) {
      var visible = visibleReviews();
      var maximum = Math.max(0, $slides.length - visible);
      carouselIndex = Math.min(carouselIndex, maximum);
      var step = $slides.first().outerWidth() + 30;
      var x = -(carouselIndex * step);
      if (window.gsap && !reduceMotion && animate) {
        gsap.to($track[0], { x: x, duration: .42, ease: "power2.out", overwrite: true });
      } else if (window.gsap) {
        gsap.set($track[0], { x: x });
      } else {
        $track.css("transform", "translate3d(" + x + "px, 0, 0)");
      }
      $slides.each(function (slideIndex) {
        var visibleSlide = slideIndex >= carouselIndex && slideIndex < carouselIndex + visible;
        $(this).attr("aria-hidden", String(!visibleSlide));
      });
      $previous.prop("disabled", carouselIndex === 0);
      $next.prop("disabled", carouselIndex === maximum);
      $status.text((carouselIndex + 1) + (visible > 1 ? "-" + Math.min($slides.length, carouselIndex + visible) : ""));
    }

    $previous.on("click", function () {
      carouselIndex -= 1;
      updateReviewCarousel(true);
    });

    $next.on("click", function () {
      carouselIndex += 1;
      updateReviewCarousel(true);
    });

    $(window).on("resize", function () {
      updateReviewCarousel(false);
    });

    updateReviewCarousel(false);
  });

  $(".location-hotspot").on("click", function () {
    var $hotspot = $(this);
    var $map = $hotspot.closest(".location-map-visual");
    var $popover = $map.find(".location-popover");
    $hotspot.addClass("is-active").attr("aria-pressed", "true").siblings(".location-hotspot").removeClass("is-active").attr("aria-pressed", "false");
    $popover.find("strong").text($hotspot.data("location"));
    $popover.find("p").html($hotspot.data("address") + "<br>" + $hotspot.data("hours"));
    if (window.gsap && !reduceMotion) {
      gsap.fromTo($popover[0], { y: 10, opacity: .45 }, { y: 0, opacity: 1, duration: .28, ease: "power2.out" });
    }
  });

  $(".location-search").on("submit", function (event) {
    event.preventDefault();
    var $button = $(this).find("button");
    var postcode = String($(this).find("input").val() || "").trim();
    $button.text(postcode ? "12 locations" : "Enter postcode").prop("disabled", true);
    window.setTimeout(function () {
      $button.text("Search").prop("disabled", false);
    }, 1800);
  });

  $(".menu-tabs button").on("click", function () {
    var $button = $(this);
    var filter = String($button.data("menu-filter"));
    var $section = $button.closest(".seasonal-menu");
    var $items = $section.find(".seasonal-menu-grid article");
    $button.addClass("active").attr("aria-selected", "true").siblings().removeClass("active").attr("aria-selected", "false");
    $items.each(function () {
      $(this).toggleClass("is-menu-hidden", filter !== "all" && String($(this).data("menu-group")) !== filter);
    });
    var $visibleItems = $items.not(".is-menu-hidden");
    $section.find(".menu-results-status").text($visibleItems.length + " items");
    if (window.gsap && !reduceMotion) {
      gsap.fromTo($visibleItems.toArray(), { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .28, stagger: .035, ease: "power2.out" });
    }
  });

  $(".menu-tabs button.active").trigger("click");

  $(".roaster-product-grid .body-btn").on("click", function () {
    var $button = $(this);
    $button.text("Added to cart").prop("disabled", true);
    window.setTimeout(function () {
      $button.text("Add to cart").prop("disabled", false);
    }, 1600);
  });

})(jQuery);



/* ETAPA 05: interactions for sections 73-113 */
(function () {
  "use strict";

  var root = document.querySelector(".stage-two-extension");
  if (!root) {
    return;
  }

  function animate(target, properties) {
    if (window.gsap) {
      window.gsap.to(target, Object.assign({ duration: 0.42, ease: "power2.out" }, properties));
      return;
    }
    if (Object.prototype.hasOwnProperty.call(properties, "x")) {
      target.style.transform = "translate3d(" + properties.x + "px,0,0)";
    }
  }

  root.querySelectorAll("[data-ext-slider]").forEach(function (slider) {
    var track = slider.querySelector(".ext-track");
    var items = Array.prototype.slice.call(track.children);
    var previous = slider.querySelector("[data-ext-prev]");
    var next = slider.querySelector("[data-ext-next]");
    var status = slider.querySelector("[data-ext-status]");
    var index = 0;

    function visibleItems() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1200) return 2;
      return slider.getAttribute("data-ext-slider") === "products" ? 4 : 3;
    }

    function render() {
      var visible = Math.min(visibleItems(), items.length);
      var maximum = Math.max(0, items.length - visible);
      index = Math.min(index, maximum);
      var gap = parseFloat(window.getComputedStyle(track).gap) || 0;
      var distance = items[0] ? index * (items[0].getBoundingClientRect().width + gap) : 0;
      animate(track, { x: -distance });
      if (status) status.textContent = String(index + 1) + " / " + String(items.length);
      if (previous) previous.disabled = index === 0;
      if (next) next.disabled = index === maximum;
    }

    if (previous) previous.addEventListener("click", function () { index -= 1; render(); });
    if (next) next.addEventListener("click", function () { index += 1; render(); });
    window.addEventListener("resize", render, { passive: true });
    render();
  });

  var quotes = Array.prototype.slice.call(root.querySelectorAll("[data-quote-slider] blockquote"));
  var quoteIndex = 0;
  function showQuote(nextIndex) {
    if (!quotes.length) return;
    quoteIndex = (nextIndex + quotes.length) % quotes.length;
    quotes.forEach(function (quote, index) {
      quote.classList.toggle("is-active", index === quoteIndex);
    });
    if (window.gsap) window.gsap.fromTo(quotes[quoteIndex], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .38 });
  }
  var quotePrevious = root.querySelector("[data-quote-prev]");
  var quoteNext = root.querySelector("[data-quote-next]");
  if (quotePrevious) quotePrevious.addEventListener("click", function () { showQuote(quoteIndex - 1); });
  if (quoteNext) quoteNext.addEventListener("click", function () { showQuote(quoteIndex + 1); });

  var menuCards = Array.prototype.slice.call(root.querySelectorAll(".ext-menu-card-grid [data-kind]"));
  root.querySelectorAll("[data-ext-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-ext-filter");
      var shown = 0;
      root.querySelectorAll("[data-ext-filter]").forEach(function (candidate) {
        var selected = candidate === button;
        candidate.classList.toggle("is-active", selected);
        candidate.setAttribute("aria-selected", String(selected));
      });
      menuCards.forEach(function (card) {
        var visible = filter === "all" || card.getAttribute("data-kind") === filter;
        card.hidden = !visible;
        if (visible) shown += 1;
      });
    });
  });

  root.querySelectorAll("[data-ext-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var status = form.querySelector("[role='status']");
      if (form.getAttribute("data-ext-form") === "reservation") {
        if (status) status.textContent = "Reservation request received. We will confirm your table shortly.";
      } else {
        if (status) status.textContent = "You are on the Cafezi list. Welcome.";
        var email = form.querySelector("input[type='email']");
        if (email) email.value = "";
      }
      if (status && window.gsap) window.gsap.fromTo(status, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: .3 });
    });
  });

  root.querySelectorAll("[data-ext-cart]").forEach(function (button) {
    button.addEventListener("click", function () {
      var section = button.closest(".ext-section");
      var status = section ? section.querySelector(".ext-cart-status") : null;
      var item = button.closest("article") || button.closest(".ext-product-card");
      var title = item ? item.querySelector("h2, h3") : null;
      if (status) status.textContent = (title ? title.textContent : "Coffee") + " added to your basket.";
      if (window.gsap) window.gsap.fromTo(button, { scale: .95 }, { scale: 1, duration: .28, ease: "back.out(2)" });
    });
  });

  root.querySelectorAll("[data-origin]").forEach(function (button) {
    button.addEventListener("click", function () {
      var status = root.querySelector(".ext-origin-status");
      var origin = button.getAttribute("data-origin");
      if (status) status.textContent = origin + " selected — ask our barista for today’s featured lot.";
      root.querySelectorAll("[data-origin]").forEach(function (candidate) {
        candidate.setAttribute("aria-pressed", String(candidate === button));
      });
    });
  });

  root.querySelectorAll(".ext-faq details").forEach(function (detail) {
    var summary = detail.querySelector("summary");
    summary.addEventListener("click", function (event) {
      event.preventDefault();
      var willOpen = !detail.open;
      root.querySelectorAll(".ext-faq details[open]").forEach(function (other) {
        other.open = false;
      });
      detail.open = willOpen;
    });
  });

  var counters = root.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window && window.gsap) {
    var counterObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var target = entry.target;
        var total = Number(target.getAttribute("data-count"));
        var state = { value: 0 };
        window.gsap.to(state, {
          value: total,
          duration: 1.1,
          ease: "power2.out",
          onUpdate: function () { target.textContent = String(Math.round(state.value)); }
        });
        observer.unobserve(target);
      });
    }, { threshold: .55 });
    counters.forEach(function (counter) { counterObserver.observe(counter); });
  }
})();
