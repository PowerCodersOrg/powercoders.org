import $ from "jquery";
import "./jquery.waypoints";
import "./materialize";
import "cookieconsent";

$(function() {
  function scrollToTarget(tid) {
    var Target = $(tid);
    $("html,body").animate({
      scrollTop: Target.offset().top
    }, "slow");
  }

  function openProgramCollapsible() {
    var $focusElement = $(document.location.hash);
    var $focusElementContainer = $focusElement.parent().parent();
    if ($focusElementContainer.hasClass("collapsible")) {
      $focusElementContainer.find(".collapsible-header").toArray().forEach(function(e, i) {
        if ($focusElement.attr("id") === $(e).attr("id")) {
          $focusElementContainer.collapsible("open", i);
        }
      });
    }
  }

  if (document.getElementById("activeevent")) {
    // window.location = "#activeevent";
    scrollToTarget("#activeevent");
  }

  $(".animated").waypoint({
    handler: function(direction) {
      var element = $(this.element);
      element.addClass(element.data("animation"));
    },
    offset: "80%"
  });

  $(".parallax").parallax();

  $(".collapsible").collapsible();
  openProgramCollapsible();
  $(window).on("hashchange", openProgramCollapsible);

}); // end of document ready

// Initialise cookie consent
// See https://cookieconsent.osano.com/download/ for details
$(window).load(function() {
  window.cookieconsent.initialise({
    "palette": {
      "popup": {
        "background": "#edeff5",
        "text": "#838391"
      },
      "button": {
        "background": "transparent",
        "text": "#4b81e8",
        "border": "#4b81e8"
      }
    },
    "content": {
      "href": "https://powercoders.org/privacy-policy/"
    }
  });
});

// JS Goes here - ES6 supported
if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", (user) => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
}
