LABAM / Live Ajax Browser App Monitors
======================================

Monitors status of any website directly in the browser, and renders results in a big-screen / projector friendly manner. To put it another way, it is a poor mans / zero-infrastructure website checking system. Being both agent- & serverless, it can be deployed in a drop-in fashion behind a non-permissive firewall, or in an airgapped network environment.

The status page consists of a grid representing monitored endpoints (URL:s) and the color coded representation of their reply:

* green = ok
* red = error
* yellow = recovering from recent error

Each individual "monitor" contains a sparkline style graph showing the most recent check results. This historical view of recent tests makes it possible to spot flapping services.

The monitoring URLs are defined as a struct in monitoringurls.json, which gets parsed after the *onLoad* event. The idea is that, while this file is fine if static, it could just as well be created on-the-fly by some third party inventory- or network monitoring system.

Example
-------

The below screenshot shows what the tool looks like when you have 20+ monitoring points defined. We keep this page showing on a large screen monitor acting a sort of *information radiator* in the office.

![screenshot](https://raw.github.com/cbrunnkvist/LABAM/docs/sample-screenshot.png)

Caveats
-------

* Web browser compatibility
 * __Google Chrome (>40)__: a "packaged app" should be installable directly from the [Chrome Web Store][1]
* Pages are requested directly by the web browser, and as a consequence you do indeed end up testing the network between your computer and the web server. And if your browser uses a caching web proxy, you will also end up practically testing _its_ availability too.
* __Alpha quality packaging__: there is currently no UI whatsoever to handle configuration of the monitoring endpoints - this must be done by directly hacking the directory where the app is unpacked to.

[1]: https://chrome.google.com/webstore/apps
