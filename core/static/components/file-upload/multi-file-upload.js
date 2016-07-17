var ko = require('knockout');
var file = require('./file-upload');
var template = require('raw!./multi-file-upload.html');

ko.components.register('file-upload', {
    viewModel: file.viewModel,
    template: file.template
});

function FileConfig(instance) {
    var self = this;
    self.instance = instance;
    self.attachment = ko.observable();
    self.afterUpload = function() {
        instance.afterUpload(self.attachment());
    };
    self.onRemove = function() {
        instance.onRemove(self.attachment());
    };
}

function MultiFileUpload(params) {
    var self = this;
    self.url = params.url;
    self.uploaders = ko.observableArray([new FileConfig(self)]);
    params.attachments([]);

    self.onRemove = function(obj){
        params.attachments.remove(obj);
        params.onRemove();
    };

    self.afterUpload = function(obj){
        params.attachments.push(obj);
        params.afterUpload();
    };

    self.add_attachment = function() {
        self.uploaders.push(new FileConfig(self));
    };

    self.remove_attachment = function(obj) {
        self.uploaders.remove(obj);
    };
}

module.exports = {
    viewModel: MultiFileUpload,
    template: template
};
