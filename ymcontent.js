var border = '1px solid black';
var borderRadius = '3px';
var iconSize = '32px';

var ourAnnotation = null;
var ourTextarea = null;
var ourPublic = null;
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
    ourAnnotation = row.annotation;
    ourPublic = row['public'];  // I forget if public is a reserved word.
    updateDisplayedness();
});

function updateDisplayedness() {
    if (ourAnnotation && thing) thing.css({display: ''});
}

function openAnnotationWindow() {
    ourTextarea = $('<textarea/>')
        .val(ourAnnotation || 'Type your annotations here.')
        .css({display: 'block'})
        .keyup(sendAnnotation)
    ;
    ourCb = $('<input type="checkbox"/>');
    ourCb[0].checked = ourPublic;    
    ourCb.change(sendAnnotation);


    thing
        .css({display: ''})
        .empty()
        .append($('<span/>').append(ourCb).append(' Public'))
        .append(ourTextarea)
        .append(
            $('<a>see all annotations</a>')
                .attr('href', chrome.extension.getURL('blog.html'))
                .attr('target', '_blank')
        )
    ;
    ourTextarea.focus();
    if (!ourAnnotation) ta[0].select();
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    openAnnotationWindow();
});

function sendAnnotation() {
    ourAnnotation = ourTextarea.val();
    ourPublic = ourCb[0].checked ? 1 : 0;
    chrome.extension.sendRequest({ updateAnnotationsFor: location.href
                                 , annotations: ourAnnotation
                                 , title: document.title
                                 , 'public': ourPublic
                                 });
}
