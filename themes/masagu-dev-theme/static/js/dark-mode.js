let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

let isDarkMode = localStorage.getItem("dark") ?? darkModeMediaQuery.matches.toString();

if (isDarkMode === "true") {
	document.documentElement.classList.add("dark");
}

function updateMode() {
	if (isDarkMode === "true") {
		isDarkMode = "false";
	} else {
		isDarkMode = "true";
	}
	localStorage.setItem("dark", isDarkMode);
	document.documentElement.classList.toggle("dark");
}
