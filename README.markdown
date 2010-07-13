LABAM / Live Ajax Browser App Monitors
======================================

Monitors status of any website directly in the browser, and renders results in a big-screen / projector friendly manner.


Caveats
-------

* Web browser compatibility
 * __Safari 4__: the monitor must be launched from file:// source, but then works with any site)
 * __FF3.5*/IE7(?)/WK(Safari/Chrome)__: requires that monitored URL supplies [XHR Access Control][1] / Access-Control-Allow-Origin header

* Pages are requested directly by the web browser, and as a consequence you do indeed end up testing the network between your computer and the web server. And if your browser uses a caching web proxy, you will also end up practically testing its availability too.


[1]: https://developer.mozilla.org/en/HTTP_access_control
