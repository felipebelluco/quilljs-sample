$(function() {
    var toolbarOptions = [
        [{'font':[]}],
        [{'header':[1, 2, 3, 4, 5, 6, false]}],
        ['bold','italic','underline','strike'],
        [{'color':[]},{'background':[]}],
        [{'script':'sub'}, {'script':'super'}],
        ['blockquote', 'code-block'],
        [{'list':'ordered'},{'list':'bullet'},{'indent':'-1'},{'indent':'+1'}],
        [{'direction':'rtl'},{'align':[]}],
        ['link','formula','image','video'],
        ['clean']
    ];

    var Delta = Quill.import('delta');

    var quill = new Quill('#editor', {
        modules: {
            toolbar: toolbarOptions
        },
        placeholder: 'Compose an epic...',
        theme: 'snow'
    });

    if(localStorage.getItem('quill.data')) {
        quill.setContents(JSON.parse(localStorage.getItem('quill.data')));
    }

    // Store accumulated changes
    var change = new Delta();
    quill.on('text-change', function(delta) {
        change = change.compose(delta);
    });

    // Save periodically
    setInterval(function() {
        if (change.length() > 0) {
            console.log('Saving changes', change);
            $(".tag").fadeIn(2000, function() {
                $(".tag").fadeOut(2000);
            });

            localStorage.setItem('quill.data', JSON.stringify(quill.getContents()));

            //Send partial changes
            // $.post('/your-endpoint', {
            //     partial: JSON.stringify(change)
            // });

            //Send entire document
            // $.post('/your-endpoint', {
            //     doc: JSON.stringify(quill.getContents())
            // });
            change = new Delta();
        }
    }, 10*1000);

    // Check for unsaved data
    window.onbeforeunload = function() {
        if (change.length() > 0) {
            return 'There are unsaved changes. Are you sure you want to leave?';
        }
    }

});
