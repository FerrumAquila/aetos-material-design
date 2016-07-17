function form_callback(self, url, request_type, code, save, data, callback) {
    console.log("RESPONSE", code, " - ", save, self, data);
    if(save) {
        if(self) {
            if('success' in data){
                success = data.success;
            } else {
                success = true;
            }
            if(success){
                self.set_data(data);
                if (callback) callback(data);
            } else {
                self.set_errors(data);
            }
        }
    } else {
        if (callback) callback(data);
    }
    console.log("Response for", request_type, " - ", url, " ...");
}

function sendRequest(self, request_type, url, data, save, callback) {
    return $.ajax({
        type: request_type,
        url: url,
        data: data,
        beforeSend: function () {
            if(self) {
                self.is_updating(true);
            }
            console.log("Request", url, "...");
        },
        statusCode: {
            200: function (data, textStatus, jqXHR) {
                return form_callback(self, url, request_type, 200, save, data, callback);
            },
            201: function (data, textStatus, jqXHR) {
                return form_callback(self, url, request_type, 201, save, data, callback);
            },
            202: function (data, textStatus, jqXHR) {
                return form_callback(self, url, request_type, 202, save, data, callback);
            },
            304: function () {
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if(self) {
                self.error(true);
            }
            console.log("Error", url, " ...");
        }
    }).always(function () {
        if(self) {
            self.is_updating(false);
        }
    });
}

function _Router(obj) {
    var self = this;
    return {
        LIST: function(url, save, callback){
            sendRequest(null, 'GET', url, {}, false, callback);
        },
        GET: function(obj, url, save, callback){
            sendRequest(obj, 'GET', url, {}, true, callback);
        },
        CREATE: function(obj, url, data, callback){
            sendRequest(obj, 'POST', url, data, true, callback);
        },
        PUT: function (obj, url, data, callback) {
            sendRequest(obj, 'PUT', url, data, true, callback);
        },
        DELETE: function (obj, url, callback) {
            sendRequest(obj, 'DELETE', url, {}, false, callback);
        }
    }
}

function Router() {
    var self = this;
    var _router = new _Router();
    return {
        CREATE: function(callback){
            _router.CREATE(this, this.rest_url, this.getJSON(), callback);
        },
        GET: function(callback){
            _router.GET(this, this.rest_url + this.pk + "/", true, callback);
        },
        PUT: function(callback){
            _router.PUT(this, this.rest_url + this.pk + "/", this.getJSON(), callback);
        },
        DELETE: function(callback){
            _router.DELETE(this, this.rest_url + this.pk + "/", callback);
        }
    }
}
