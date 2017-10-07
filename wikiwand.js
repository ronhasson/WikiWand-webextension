var pattern = "*://*.wikipedia.org/*";


function redirect(requestDetails) {
	console.log("Redirecting: " + requestDetails.url);
	var x = convertURL(requestDetails.url);
	console.log(x);
	if (!x.redirect)
		return {};
	return {
		redirectUrl: x.url
	};
}


function convertURL(url) {
	var result = {
		url: url,
		redirect: true
	};

	var el = document.createElement('a');
	el.href = url;

	var host = el.host;
	var pathname = el.pathname;
	var param = el.search;

	var lang = host.substring(0, host.indexOf('.'));
	var article = pathname.split('/')[2];

	result.url = "https://wikiwand.com/" + lang + "/" + article;
	if (param.includes('oldformat=true') ||
		article == "Main_Page" && lang == "en" || //main page on wikiwand.com in english(only) is bugged
		pathname == "/") {

		result.redirect = false;
		result.url = url;
	}
	return result;
}

browser.webRequest.onBeforeRequest.addListener(
	redirect, {
		urls: [pattern],
		types: ["main_frame"]
	}, ["blocking"]
);