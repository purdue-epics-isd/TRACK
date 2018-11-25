// Get the elements with class="column"
var elements = document.getElementsByClassName("column");

// Declare a loop variable
var i;

// List View
function listView() {
  for (i = 0; i < elements.length; i++) {
    elements[i].style.width = "100%";
  }
}

// Grid View
function gridView() {
  for (i = 0; i < elements.length; i++) {
    elements[i].style.width = "50%";
  }
}

function showInput() {
    document.getElementById('display').innerHTML = document.getElementById("user_input").value;
}

$(document).ready(function() {
	$('#submit-button').click(ClickedSubmitButton);
	$(window).scroll(function() {

		$('.parallax').each(function() {

			var pct = $(document).scrollTop() / $(this).height();

			var minPct = 0.4;
			var maxPct = 0;
			var finalPercent = pct * (maxPct - minPct) + minPct;
			var pctString = (finalPercent * 100).toFixed(1) + '%';
			$(this).css('background-position-y', pctString);

		});

	}).scroll();
}

