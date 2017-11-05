var date = new Date();
date.setTime(date.getTime() + 666 * 24 * 60 * 60 * 1000);
document.cookie = "wikiwand.extension.installed=True; expires=" + date.toUTCString() + "; path=/";
