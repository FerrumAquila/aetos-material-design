var ko = require("knockout");
var store = require("models/store");

ko.components.register('thread-detail', {
    viewModel: function(params){
        var self = this;
        self.thread = params.value;
    },
    template: require("raw!./thread-detail.html")
});
module.exports = function() {
    var self = this;
    self.threads = store.threadStore.threads;
    self.is_open = ko.observable(false);
    self.open = function(){
        if(self.is_open()){
            self.is_open(false);
        } else {
            self.is_open(true);
        }
    }

    self.count = ko.computed(function(){
        var unread_count = 0
        ko.utils.arrayForEach(self.threads(), function(item){
            var unread = false;
            ko.utils.arrayForEach(item.sorted_mails(), function(mail){
                if(mail.is_unread()){
                    unread = true;
                }
            });
            if(unread) {
                unread_count += 1;
            }
            return unread_count;
        });
    });

    self.selectedThread = ko.observable();
    self.selectThread = function(thread) {
        console.log("Selecting thread", thread);
        unread_thread = false;
        for(var i=0; i< thread.sorted_mails().length; i++){
            var m = thread.sorted_mails()[i];
            if(m.is_unread() && !unread_thread){
                unread_thread = true;
            }
            if(unread_thread){
                m.get_full_mail();
            }
        }
        if(!unread_thread) {
            var last_mail = thread.sorted_mails()[thread.sorted_mails().length - 1];
            last_mail.get_full_mail();
        }
        self.selectedThread(thread);
    }
};
