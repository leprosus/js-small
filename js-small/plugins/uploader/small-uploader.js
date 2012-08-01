/*
 * JS-Small JavaScript Framework Plugin
 * Description: Plug-in allows to upload files
 * Copyright (c) 2008 - 2012 Denis Korolev
 * Released under the MIT License.
 * More information: http://www.js-small.ru/
 *                   http://www.js-small.com/
 * Project support:  http://www.evalab.ru/
 *                   http://www.evalab.com/
 * @author Denis Korolev
 * @version 0.1.1
 */
small.extendFunctions({
    uploader: function(options){
        if(small.typeIn(options, 'object')){
            var name = options.name || 'file',
            url = options.url || '',
            extensions = options.extensions || [],
            maxSize = options.maxSize || 0,
            onError = options.onError || function(){},
            onSubmit = options.onSubmit || function(){},
            onComplete = options.onComplete || function(){},
            onCancel = options.onCancel || function(){};

            var fileName = '',
            form = small.create('form').attr({
                'name': name,
                'action': small.base().concat(url),
                'method': 'post',
                'enctype': 'multipart/form-data',
                'target': name
            }),
            uploader = form.append('div.uploader').hide(),
            iframe = small.create('iframe').attr({
                'name': name,
                'src': 'javascript:;'
            }).hide();
            form.append(iframe);

            if(maxSize > 0){
                var hidden = small.create('input').attr({
                    'type': 'hidden',
                    'name': 'MAX_FILE_SIZE',
                    'value': maxSize
                });
                form.append(hidden);
            }

            var file = small.create('input').attr({
                'type': 'file',
                'name': name
            }).change(function(){
                var current = small(this), error = false;
                fileName = current.attr('value').replace(/^.*(\\|\/|\:)/, '');
                if(extensions.length > 0){
                    var regExp = new RegExp('\\.(' + small.trim(extensions).join('|') + ')$', 'i');
                    error = !regExp.test(fileName);
                }

                if(!error){
                    var width = current.bound().width;
                    onSubmit.call(form.node(), name, options);
                    form.node().submit();

                    var progress = 0;
                    file.hide();
                    uploader.show().css('width', width + 'px')
                    .append('div.cancel').click(function(){
                        var newUploader = small.uploader(options);
                        uploader.after(newUploader);
                        uploader.remove();
                        iframe.remove();
                        onCancel.call(form.node(), name, options);
                    });
                    var value = uploader.append('div.border').append('div.value');
                    value.append('div.animation').opacity(70);
                    value.start({
                        'time': 100,
                        'callback': function(){
                            value.css('width', ((width - 16) * progress++ / 100) + 'px')
                        },
                        'repeat': 90
                    });

                    iframe.load(function(){
                        var idoc = iframe.node().contentDocument || iframe.node().contentWindow.document,
                        content = idoc.body.innerHTML;
                        iframe.remove();
                        uploader.empty().append('div.done').text(fileName);
                        onComplete.call(form.node(), name, options, content);
                    });
                } else onError.call(form.node(), name, options);
            });
            form.append(file);
        }

        return form;
    }
});
small.extendMethods({
    'appendUploader': function(options){
        return small(this).append(small.uploader(options));
    },
    'prependUploader': function(options){
        return small(this).prepend(small.uploader(options));
    },
    'afterUploader': function(options){
        return small(this).after(small.uploader(options));
    },
    'beforeUploader': function(options){
        return small(this).before(small.uploader(options));
    }
});