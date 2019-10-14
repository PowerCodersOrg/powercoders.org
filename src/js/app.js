import $ from "jquery";
import "waypoints/lib/jquery.waypoints.min.js";
import "coffeekraken-s-donut-component";
import "cookieconsent";
import "jquery-match-height";
import "lity";
import "materialize-css";

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

  $(".sidenav").sidenav();
  $("select").formSelect();

  // .card elements in a flex row don't grow to fill the height of the
  // row. This seems to be a known problem with MaterializeCSS, e.g.,
  // see https://stackoverflow.com/questions/37760307/materializecss-how-can-i-make-row-column-height-the-same
  //
  // Forcing the card height to 100% (or slightly smaller percentages)
  // forces cards on subsequent rows to overlap. Use the match-height
  // plugin to force cards to have the same height. If/when MaterializeCSS
  // moves to use Flexbox fully this hack can be removed.
  $(".row.flex .card").matchHeight();

}); // end of document ready

// Initialise cookie consent
// See https://cookieconsent.osano.com/download/ for details
$(window).on("load", function() {
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
