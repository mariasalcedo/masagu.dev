/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function dropdownMenu() {
  document.getElementById("menuDropdown").classList.toggle("hidden");
}

// Close the dropdown if the user clicks outside of it
/*window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
  var myDropdown = document.getElementById("menuDropdown");
    if (myDropdown.classList.contains('hidden')) {
      myDropdown.classList.remove('hidden');
    }
  }
}*/
