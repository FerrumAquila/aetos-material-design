var ko = require('knockout');
var Mail = require('./mail');
var und = require('underscore');

function ThreadModel(id) {
    var self = this;
    self.id  = id;
    // TODO: Implement is_unread, labels
    self.mails = ko.observableArray();
    self.sorted_mails = ko.computed(function(){
        var s = self.mails().sort(function(m1, m2){
            return m1.received_on - m2.received_on;
        });
        return s;
    }).extend({throttle: 1000});

    self.subject = ko.computed(function(){
        if(self.mails().length > 0) {
            return self.mails()[self.mails().length-1].subject;
        }
    });
    self.labels = ko.computed(function(){
        if(self.mails().length > 0) {
            return self.mails()[self.mails().length-1].labels;
        }
    });
    self.s_from = ko.computed(function(){
        if(self.mails().length === 0){return;}
        var s = [];
        for(var i=0; i<self.mails().length; i++) {
            s.push(self.mails()[i].from_contact);
        }
        s = und.uniq(s, und.iteratee('name'));
        console.log("Initial >", s);
        if(s.length == 1){
            console.log("Final >", s[0].name);
            return s[0].name;
        } else {
            var slen = s.length;
            var fnames = [];
            for(i=0; i<s.length; i++){
                if(s[i].name) {
                    fnames.push(s[i].name.replace(/"/g, '').split(' ')[0]);
                } else {
                    fnames.push(s[i].email.split("@")[0]);
                }
            }
            fnames = fnames.splice(0, 3);
            sname = fnames.join(", ") + "(" + slen + ")";
            console.log("Final >", sname);
            return sname;
        }
    }).extend({throttle: 1000});

    self.add = function(mail) {
        var mailObj = ko.utils.arrayFirst(self.mails(), function(item) {
            return item.id == mail.id;
        });
        if(!mailObj){
            self.mails.push(mail);
        }
    };
}

module.exports = ThreadModel;
