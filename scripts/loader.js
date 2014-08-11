/*global chrome:true */
(function () {
    'use strict';
    var targets = [
        'scripts/highlight.js',
        'scripts/main.js'
    ];

    targets.forEach(function (js) {
        var scriptElement = document.createElement('script');
        scriptElement.setAttribute('src', chrome.extension.getURL(js));
        document.documentElement.appendChild(scriptElement);
    });

    // CSS の読込
    var linkElement = document.createElement('link');
    linkElement.setAttribute('href', chrome.extension.getURL('styles/github.css'));
    linkElement.setAttribute('media', 'all');
    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('type', 'text/css');
    document.documentElement.appendChild(linkElement);
}());
