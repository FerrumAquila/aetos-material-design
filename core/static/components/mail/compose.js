var ko = require('knockout');
var urls = require("urls");
var multi_file = require('components/file-upload/multi-file-upload');

ko.components.register('multi-file-upload', {
    viewModel: multi_file.viewModel,
    template: multi_file.template
});

var Compose = function(config) {
    var mail = config.mail;
    var self = this;
    self.afterSend = config.afterSend;
    if(mail) {
        self.reply_for = ko.observable(mail);
        self.thread_id = ko.observable(mail.thread.id);
        self.ignore_reply_subject = ko.observable(true);
    } else {
        self.reply_for = ko.observable();
        self.thread_id = ko.observable("");
        self.ignore_reply_subject = ko.observable(false);
    }

    var params = [
        'id',
        'message_id',
        'thread',
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
        'html',
    ];

    for(var i=0; i< observableParams.length; i++){
        self[observableParams[i]] = ko.observable();
    }

    for(i=0; i< observableArrayParams.length; i++){
        self[observableArrayParams[i]] = ko.observableArray([]);
    }

    for(i=0; i< params.length; i++){
        self[params[i]] = null;
    }

    self.subject = ko.observable();
    if(self.reply_for()) {
        self.subject(self.reply_for().subject);
    }

    self.send = function() {
        var attachments = [];
        for(var i=0; i<self.attachments().length; i++){
            attachments.push(self.attachments()[i].data.attachment.pk);
        }
        var mail_data = JSON.stringify({
            'threadId': self.thread_id(),
            'ignore_reply_subject': self.ignore_reply_subject,
            'attachments': attachments,
            'subject': self.subject(),
            'to': self.to(),
            'cc': self.cc(),
            'bcc': self.bcc(),
            'body': self.html(),
            'mailId': self.reply_for().id
        });
        console.log("MAIL_DATA", mail_data);
        $.ajax({
            type: "POST",
            url: SEND_MAIL_URL,
            data: {
                csrfmiddlewaretoken: CSRF_MIDDLEWARE_TOKEN,
                data: mail_data,
            },
            success: function(data){
                if(data.success) {
                    self.afterSend();
                }
            }
        });
    };

    self.add_attachment = function() {
        console.log("Compose level add", self.attachments());
    };
    self.remove_attachment = function() {
        console.log("Multi Compose level remove", self.attachments());
    };
};

module.exports = Compose;
