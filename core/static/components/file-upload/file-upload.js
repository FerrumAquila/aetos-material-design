var ko = require('knockout');
var template = require('raw!./file-upload.html');

//Sample usage of file-upload
//<file-upload params="{url: '/gmail/upload/', afterUpload: afterUpload, attachment: file, onRemove: remove_attachment }"></file-upload>

function Attachment() {
    var self = this;
    self.data = null;
    self.update = function(data) {
        self.data = data;
    };
}

function FileUploadModel(params) {
    var self = this;

    // Events on control
    self.url = params.url;
    if(params.afterUpload){
        self.afterUpload = params.afterUpload;
    } else {
        self.afterUpload = function(){};
    }

    self.showRemove = typeof params.showRemove !== 'undefined' ? params.showRemove : true;

    self.attachment = new Attachment();
    self.file = ko.observable();
    self.filename = ko.observable();
    self.completion = ko.observable(0);

    self.onRemove = function() {
        if(params.onRemove){
           params.onRemove();
        }
        params.attachment(null);
        self.attachment.data = null;
        self.file(null);
        self.filename(null);
        self.completion(0);
    };

    self.file_added = function(data, event) {
        self.file(event.target.files[0]);
        self.filename(event.target.files[0].name);

        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText);
                response = JSON.parse(xhr.responseText);
                self.attachment.update(response);
                params.attachment(self.attachment);
                self.afterUpload();
            }
        };
        xhr.upload.addEventListener('progress', function(evt) {
            console.log("On Progress", evt);
            if (evt.lengthComputable) {
                var progress = evt.loaded * 100 / evt.total;
                self.completion(progress);
            }
        }, false);

        fd.append("content", self.file());
        xhr.open("POST", self.url, true);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("X-File-Name", self.file().name);
        xhr.setRequestHeader("X-File-Size", self.file().size);
        xhr.send(fd);
    };

}


module.exports = {
    viewModel: FileUploadModel,
    template: template
};
