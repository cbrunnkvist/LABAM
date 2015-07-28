LABAM / Live Ajax Browser App Monitors
======================================

Checks status of any number of websites directly from within the App, and renders results in a big-screen / projector friendly manner. To put it another way: a "poor mans" / zero-infrastructure website availability monitoring system.

Being both agent- & serverless, it can be deployed in a drop-in fashion behind a non-permissive firewall, or in an airgapped network environment and run directly on your device.

Operation
---------

The status page consists of a grid representing monitored endpoints (URLs) and the color coded representation of their most recent response:

* green = ok
* red = error
* yellow = recovering from recent error

Each individual "monitor" contains a [sparkline style chart](https://en.wikipedia.org/wiki/Sparkline) echoing past check results. This historical view of recent tests makes it possible to spot service state flapping.

The monitoring URLs are defined as a struct in `monitoringurls.json`, which is parsed at launch time. The idea is that, while this file works fine if static, it could just as well be created on-the-fly by some third party inventory- or network monitoring system.

Example
-------

The below screenshot shows what the tool could look like with 20+ monitoring points defined.

![screenshot](https://raw.github.com/cbrunnkvist/LABAM/docs/mock-PSD-screenshot-640x400.png)

_(Historical anecdote: Back in ~2009, the "Production Software Development" team at the [Sanger Institute](http://www.sanger.ac.uk/) used to keep a similar page showing on a large screen monitor as an *information radiator* in the office, which is from where this code originates._

Caveats
-------

* Web browser compatibility
 * __Google Chrome (>40)__: a "packaged app" should be installable directly from the [Chrome Web Store][1]
* Pages are requested directly by the web browser, and as a consequence you do indeed end up testing the network between your computer and the web server. And if your browser uses a caching web proxy, you will also end up practically testing _its_ availability too.
* __Alpha quality packaging__: there is currently no UI whatsoever to handle configuration of the monitoring endpoints - this must be done by directly hacking the directory where the app is unpacked to.

[1]: https://chrome.google.com/webstore/apps
