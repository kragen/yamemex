var border = '1px solid black';
var borderRadius = '20px 8px';
var iconSize = '32px';

var annotationRecord = null;

// jQuery objects
var ourTextarea = null;
var ourCb = null;
var thing = null;

// This is a kludge to insert our thing into the body as early as
// possible.  We don’t actually get notified that the document body
// has been created, as far as I can tell, so we have to poll.

var bodyPoller = setInterval(insertionListener, 50);

function insertionListener() {
    if (!document.body) return;
    clearInterval(bodyPoller);

    thing = $('<div class="yamemex"/>')
      .css({ position: 'fixed'
           , top: '40px'
           , right: '0px'
           , backgroundColor: 'white'
           , borderTopLeftRadius: borderRadius
           , borderBottomLeftRadius: borderRadius
           , padding: '3px'
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
              .click(openAnnotationWindow)
             )

      .hover(function() { thing.animate({opacity: 0.95}) },
             function() { thing.animate({opacity: 0.5}) })

      .appendTo(document.body)

      ;

    updateDisplayedness();
}

chrome.extension.sendRequest( {getAnnotationsFor: location.href}
                              , function(row) {
    annotationRecord = row;
    updateDisplayedness();
});

function updateDisplayedness() {
    if (annotationRecord && annotationRecord.annotation && thing) {
        thing.css({display: ''});
    }
}

function closeAnnotationWindow() {
    thing.animate({width: 0}, {complete: function() { 
        thing.css({display: 'none'});
    }});
}

function openAnnotationWindow() {
    ourTextarea = $('<textarea/>')
        .val(annotationRecord.annotation || 'Type your annotations here.')
        .css({display: 'block'})
        .keyup(sendAnnotation)
    ;
    ourCb = $('<input type="checkbox"/>');
    // I forget if ‘public’ is a reserved word.
    ourCb[0].checked = annotationRecord['public'];
    ourCb.change(sendAnnotation);

    var closebox = $('<div>X</div>')
        .click(closeAnnotationWindow)
        .css({float: 'right'})
    ;

    thing
        .css({display: '', width: ''})
        .empty()
        .append($('<span/>').append(ourCb).append(' Public'))
        .append(closebox)
        .append(ourTextarea)
        .append(
            $('<a>see all annotations</a>')
                .attr('href', chrome.extension.getURL('blog.html'))
                .attr('target', '_blank')
        )
    ;
    ourTextarea.focus();
    if (!annotationRecord.annotation) ourTextarea[0].select();
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    openAnnotationWindow();
});

function sendAnnotation() {
    annotationRecord.annotation = ourTextarea.val();
    annotationRecord['public'] = ourCb[0].checked ? 1 : 0;
    chrome.extension.sendRequest({ updateAnnotationsFor: location.href
                                    // XXX 'annotations' vs. 'annotation'
                                 , annotations: annotationRecord.annotation
                                 , title: document.title
                                 , 'public': annotationRecord['public']
                                 });
}
