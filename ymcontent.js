var border = '1px solid black';
var borderRadius = '20px 8px';
var iconSize = '32px';

var annotationRecord = null;

// jQuery objects
var ourTextarea = null;
var ourPreview = null;
var ourCb = null;
var popup = null;

// This is a kludge to insert our popup into the body as early as
// possible.  We don’t actually get notified that the document body
// has been created, as far as I can tell, so we have to poll.

var bodyPoller = setInterval(insertionListener, 50);

function insertionListener() {
    if (!document.body) return;
    clearInterval(bodyPoller);

    popup = $('<div class="yamemex"/>')
      .css({ position: 'fixed'
           , top: '40px'
           , right: '0px'
           , backgroundColor: 'white'
           , borderTopLeftRadius: borderRadius
           , borderBottomLeftRadius: borderRadius
           , padding: '3px 3px 6px'
           , borderTop: border
           , borderLeft: border
           , borderBottom: border
           , zIndex: 2147483646
           , opacity: 0.5
           , display: 'none'
           })

      .append($('<img/>')
              .attr('src', chrome.extension.getURL('write.png'))
              .css({width: iconSize, height: iconSize, margin: 0})
              .click(clickHandler)
             )

      .hover(function() { popup.animate({opacity: 0.92 }) },
             function() { popup.animate({opacity: 0.5}) })

      .appendTo(document.body)

      ;

    updateDisplayedness();
}

function clickHandler() {
    popup.animate(offscreen(), { duration: 'fast'
                               , complete: openAnnotationWindow
                               });
}

chrome.extension.sendRequest( {getAnnotationsFor: location.href}
                              , function(row) {
    annotationRecord = row;
    updateDisplayedness();
});

function updateDisplayedness() {
    if (annotationRecord && annotationRecord.annotation && popup) {
        popup.css({display: ''});
    }
}

function offscreen() {
    return {right: '-'+popup.width()+'px'};
}

function closeAnnotationWindow() {
    popup.animate(offscreen(), {complete: function() { 
        popup.css({display: 'none'});
    }});
}

function openAnnotationWindow() {
    ourTextarea = $('<textarea/>')
        .val(annotationRecord.annotation || 'Type your annotations here.')
        .css({display: 'block', width: '100%'})
        .keyup(sendAnnotation)
    ;
    ourCb = $('<input type="checkbox"/>');
    // I forget if ‘public’ is a reserved word.
    ourCb[0].checked = annotationRecord['public'];
    ourCb.change(sendAnnotation);

    ourPreview = $('<div/>').css({maxWidth: '25em'});
    updatePreview();

    var closebox = $('<div>X</div>')
        .click(closeAnnotationWindow)
        .css({float: 'right'})
    ;

    popup
        .css({display: ''})
        .empty()
        .append($('<span/>').append(ourCb).append(' Public'))
        .append(closebox)
        .append(ourPreview)
        .append(ourTextarea)
        .append(
            $('<a>see all annotations</a>')
                .attr('href', chrome.extension.getURL('blog.html'))
                .attr('target', '_blank')
        )
    ;

    popup.css(offscreen());
    popup.animate({right: 0});

    ourTextarea.focus();
    if (!annotationRecord.annotation) ourTextarea[0].select();
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    openAnnotationWindow();
});

function sendAnnotation() {
    updatePreview();
    annotationRecord.annotation = ourTextarea.val();
    annotationRecord['public'] = ourCb[0].checked ? 1 : 0;
    chrome.extension.sendRequest({ updateAnnotationsFor: location.href
                                    // XXX 'annotations' vs. 'annotation'
                                 , annotations: annotationRecord.annotation
                                 , title: document.title
                                 , 'public': annotationRecord['public']
                                 });
}

function updatePreview() {
    ourPreview.html(markdown.toHTML(ourTextarea.val()));
}