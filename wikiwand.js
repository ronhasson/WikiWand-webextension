var pattern = "*://*.wikipedia.org/*";
var isEnabled;

function redirect(requestDetails) {

	var x = convertURL(requestDetails.url);

	if (!x.redirect)
		return {};

	console.info("Redirecting from: " + requestDetails.url);
	console.info("Redirecting to: " + x.url);

	return {
		redirectUrl: x.url
	};
}

function convertURL(url) {
	var result = {
		url: url,
		redirect: true
	};

	var el = document.createElement('a'); //temp element
	el.href = url;

	var host = el.host;
	var pathname = el.pathname;
	var param = el.search;

	var lang = host.substring(0, host.indexOf('.'));
	var article = pathname.split('/')[2];

	//console.log("param: " + param + " \n" + "	article: " + article)

	result.url = "https://wikiwand.com/" + lang + "/" + article + param;

	if (param.includes('oldformat=true') ||
		param.includes('action=') ||
		param.includes('printable=yes') ||
		param.includes('writer=rl') ||
		article == "Main_Page" && lang == "en" || //main page on wikiwand.com in english(only) is bugged
		pathname == "/") { //the main page of wikipedia in english that redirects to /Main_Page

		result.redirect = false;
		result.url = url;
	}
	if (!isEnabled) {
		result.redirect = false;
	}
	return result;
}

browser.webRequest.onBeforeRequest.addListener(
	redirect, {
		urls: [pattern],
		types: ["main_frame"]
	}, ["blocking"]
);

browser.runtime.onStartup.addListener(function () {
	isEnabled = true;
});

browser.browserAction.onClicked.addListener(() => {

	isEnabled = !isEnabled;

	if (isEnabled) {
		browser.browserAction.setIcon({
			path: "icons/logo_plain.svg"
		});
		browser.browserAction.setTitle({
			title: "Wikiwand is enabled"
		});
	} else {
		browser.browserAction.setIcon({
			path: "icons/logo_disabled_plain.svg"
		});
		browser.browserAction.setTitle({
			title: "Wikiwand is disabled"
		});
	}
});