define(['knockout', 'cookie'], function (ko, Cookie) {
    //Function to check for "", null, undefined, [], {}
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function isEmpty(obj) {

        // null and undefined are "empty"
        if (obj == null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    }

    ko.extenders.store = function (target, settings) {
        var storeType = settings.type;
        var keyVal = settings.key;

        if (!storeType) {
            storeType = 'localStorage';
        }

        if (!localStorage) {
            storeType = 'cookie';
        }

        if (storeType == 'cookie') {
            if (!(settings.keytype && settings.keytype == 'raw')) {
                keyVal = VEHICLE_TYPE + '_' + keyVal;
            }
        }

        var init;
        switch(storeType) {
            case 'localStorage':
                var data = localStorage.getItem(VEHICLE_TYPE);
                if(!data) {
                    data = {};
                } else {
                    data = JSON.parse(data);
                }
                init = data[keyVal];
                break;
            case 'cookie':
                init = Cookie.get(keyVal);
                break;
        }

        if(init != undefined) {
            try {
                var jinit = JSON.parse(init);
            } catch (e) {
                var jinit = init;
            }
            if(settings.init) {
                settings.init(target, jinit);
            } else {
                target(jinit);
            }
        } else {
            if(settings.init) {
                settings.init(target);
            }
        }

        target.subscribe(function(newValue) {
            var jval = newValue;
            if(settings.dump){
                jval = settings.dump(newValue);
            } else if (storeType == 'cookie') {
                try {
                    jval = ko.toJSON(newValue);
                } catch (e) {
                    jval = newValue;
                }
            }
            switch(storeType) {
                case 'localStorage':
                    var data = localStorage.getItem(VEHICLE_TYPE);
                    if(!data) {
                        data = {};
                    } else {
                        data = JSON.parse(data);
                    }
                    data[keyVal] = jval;
                    localStorage.setItem(VEHICLE_TYPE, JSON.stringify(data));
                    break;
                case 'cookie':
                    Cookie.set(keyVal, jval);
                    break;
            }
        });
    };

});
