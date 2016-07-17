var ko = require('knockout');
var urls = require('urls');
var store = require('models/store');

ko.components.register('compose-reply', {
    viewModel: require('./compose'),
    template: require('raw!./compose.html')
});

var Mail = function(data) {
    var self = this;
    var params = [
        'id',
        'message_id',
        'thread',
        'subject',
        'snippet',
        'to_count',
        'cc_count',
        'from_contact',
        'created_on',
    ];

    var observableArrayParams = [
        'to',
        'cc',
        'labels',
        'bcc',
        'attachments',
    ];

    var observableParams = [
        'is_deleted',
        'is_unread',
        'is_pinned',
        'is_priority',
        'is_draft',
        'body',
        'html',
    ];

    var i = 0;
    for (i = 0; i < observableParams.length; i++) {
        self[observableParams[i]] = ko.observable();
    }

    for (i = 0; i < observableArrayParams.length; i++) {
        self[observableArrayParams[i]] = ko.observableArray([]);
    }

    for (i = 0; i < params.length; i++) {
        self[params[i]] = null;
    }

    self.show_detail_view = function() {
         urls.hasher.setHash('mail/' + self.id);
    };

    self.update = function(data) {
        for (var i = 0; i < params.length; i++) {
            if (params[i] in data) {
                self[params[i]] = data[params[i]];
            }
        }
        for (i = 0; i < observableParams.length; i++) {
            if (observableParams[i] in data) {
                self[observableParams[i]](data[observableParams[i]]);
            }
        }
        for (i = 0; i < observableArrayParams.length; i++) {
            if (observableArrayParams[i] in data) {
                self[observableArrayParams[i]].removeAll();
                for (var j = 0; j < data[observableArrayParams[i]].length; j++) {
                    self[observableArrayParams[i]].push(data[observableArrayParams[i]][j]);
                }
            }
        }
        self.received_on = new Date(Date.parse(data.received_on));
    };
    self.is_selected = ko.observable(false);

    self.get_body = function() {
        if (!self.body()) {
            store.threadStore.sget('get-mail', {'id': self.id});
        }
    };

    self.get_full_mail = function(mail) {
        self.get_body();
        self.is_selected(true);
    };


    self.select = function(mail) {
        if (mail.is_selected()) {
            mail.is_selected(false);
        } else {
            self.get_full_mail();
        }
    };

    self.reply_activated = ko.observable(false);
    self.toggle_reply = function() {
        if (self.reply_activated()) {
            self.reply_activated(false);
        } else {
            self.reply_activated(true);
        }
    };
    self.mail_sent = function() {
        self.reply_activated(false);
    };

    if (data) {
        self.update(data);
    }
};

module.exports = Mail;
