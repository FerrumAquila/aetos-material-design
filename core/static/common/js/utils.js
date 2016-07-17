jQuery.fn.extend({
    populateFormErrors: function (errors) {
        var form = this;
        form.find('.help-block').html('');
        form.find('.form-group').removeClass('has-error');
        $.each(errors, function(k,v){
            console.log("error>>>>>>>>>>>>>>>>>", k, v)
            ele = form.find('#id_' + k);
            ele.parents('.form-group').addClass('has-error');
            form.find('#id_error_' + k).html(v);
        })

    },

    cleanFormErrors: function(){
        var form = this;
        form.find('.help-block').html('');
        form.find('.form-group').removeClass('has-error');
    },

    serializeObject: function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            var self = this;
            if (o[self.name] !== undefined) {
                if (!o[self.name].push) {
                    o[self.name] = [o[self.name]];
                }
                o[self.name].push(self.value || '');
            } else {
                o[self.name] = self.value || '';
            }
        });
        return o;
    },
});
