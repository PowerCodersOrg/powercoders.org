import $ from "jquery";
import "./jquery.waypoints";
import "cookieconsent";
import DoughnutChart from "simple-doughnut-chart";
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

  // Initialise all donut charts
  //
  // Donut charts are any canvas element with an empty data-donut attribute.
  // The percentage value for the chart is given by the data-percentage
  // attribute, other values are fixed here.
  //
  // E.g., <canvas data-donut data-percentage="42"></canvas>
  $("canvas[data-donut]").each(function(index) {
    new DoughnutChart(this, {
      canvasSize: 100,
      doughnutSize: 12,
      defaultTextSize: 8,
      activeTextSize: 16,
      defaultColor: "#eee",
      defaultTextColor: "#000",
      activeTextColor: "#000",
      activeColor: "#c32e4c",
      percentageColor: "#c32e4c",
      percentage: $(this).data("percentage"),
      decimalPointDigit: 0,
      forceDecimalPointDigit: -1,
      text: "",
      duration: 1500,
      dashWidth: 12,
      dashHeight: 4,
      dashMargin: 6,
      dashLength: 3,
      dashColor: "#eee",
      textPosition: "bottom",
      gradientColors: [],
      percentTextSize: 0,
      percentSymbolTextColor: "",
      percentSymbolTextSize: 0,
      percentSymbolTextBaseline: "middle",
    });
  });

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
