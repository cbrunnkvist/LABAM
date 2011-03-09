LABAM / Live Ajax Browser App Monitors
======================================

Monitors status of any website directly in the browser, and renders results in a big-screen / projector friendly manner. To put it another way, it is a poor mans / zero-infrastructure website checking system.

The status page consists of a grid representing monitored endpoints (URL:s) and the color coded representation of their reply: 

* green = ok
* red = error
* yellow = recovering from recent error

Each individual "monitor" contains a sparkline style graph showing the most recent check results. This historical view of recent tests makes it possible to spot flapping services.

The monitoring URLs are defined as a struct in monitoringurls.json, which gets parsed after the *onLoad* event. The idea is that, while this file is fine if static, it could just as well be created on-the-fly by some third party inventory- or network monitoring system.

Example
-------

The below screenshot shows what the tool looks like when you have 20+ monitoring points defined. We keep this page showing on a large screen monitor acting a sort of *information radiator* in the office.

![screenshot](/cbrunnkvist/LABAM/raw/docs/sample-screenshot.png)

Caveats
-------

* Web browser compatibility
 * __Safari 4__: the monitor must be launched from file:// source, but then works with any site)
 * __FF3.5*/IE7(?)/WK(Safari/Chrome)__: requires that monitored URLs supply [XHR Access Control][1] / Access-Control-Allow-Origin header in their response

* Pages are requested directly by the web browser, and as a consequence you do indeed end up testing the network between your computer and the web server. And if your browser uses a caching web proxy, you will also end up practically testing its availability too.


[1]: https://developer.mozilla.org/en/HTTP_access_control
