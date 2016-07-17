var ko = require('knockout');
var store = require('models/store');
var Mail = require('./mail');
var Thread = require('./thread');

function ThreadStore() {
    var self = this;
    self.prefix = "mail";
    self.local = "threadStore";
    self.threads = ko.observableArray([]);
    mails = ko.observableArray([]);

    self.push = function(mail) {
        var mailObj = ko.utils.arrayFirst(mails(), function(item){
            return item.id == mail.id;
        });
        if(!mailObj){
            mailObj = new Mail(mail);
        } else {
            mailObj.update(mail);
            return;
        }
        mails.push(mailObj);

        var threadObj = ko.utils.arrayFirst(self.threads(), function(item) {
            return item.id == mail.thread.id;
        });

        if(!threadObj) {
            threadObj = new Thread(mail.thread.id);
            self.threads.push(threadObj);
        }
        threadObj.add(mailObj);
    }
}
store.add(ThreadStore);

module.exports = ThreadStore;
