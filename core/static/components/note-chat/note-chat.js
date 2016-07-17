var ko = require('knockout');
var template = require('raw!./note-chat.html');

var NoteChat = function(params){
    var self = this;
    self.notes = ko.observableArray();
    self.new_text = ko.observable();
    self.notes(params.notes());
    self.enterKeyPress = function(d,e){
        if(params.onEnterSave){
            e.keyCode === 13 && self.addNote();
        }
        return true;
    }

    self.addNote = function(){
        if(self.new_text()){
            data = {'text': self.new_text(), 'timestamp': new Date().toLocaleString(), 'writer': params.username};
            self.notes.push(data);
            self.new_text("");
            if(params.autopost && params.autopost.enable){
                $.ajax({
                    type: 'POST',
                    data: {
                        'csrfmiddlewaretoken': CSRF_MIDDLEWARE_TOKEN,
                        'chat_notes': JSON.stringify(self.notes()),
                    },
                    url: params.autopost.url,
                    success: function(){}
                });
            }
        }
    }
}

module.exports = {
    viewModel: NoteChat,
    template: template
};
