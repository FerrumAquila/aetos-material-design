var ko = require("knockout")
var crossroads = require("crossroads");
var hasher = require("hasher");

function router(config) {
    var currentRoute = this.currentRoute = ko.observable({});
    this.hasher = hasher;
    ko.utils.arrayForEach(config.routes, function(route) {
        crossroads.addRoute(route.url, function(requestParams) {
            currentRoute(ko.utils.extend(requestParams, route.params));
        });
    });
    activateCrossroads();
}

function activateCrossroads() {
    function parseHash(newHash, oldHash) {
        crossroads.parse(newHash);
    }
    crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
    hasher.initialized.add(parseHash);
    hasher.changed.add(parseHash);
    hasher.init();
}

module.exports = router;
