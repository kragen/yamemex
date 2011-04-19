var border = '1px solid black';
var borderRadius = '3px';
var iconSize = '32px';

var ourAnnotation = null;
var thing = null;

chrome.extension.sendRequest( {getAnnotationsFor: location.href}
                              , function(annotation) {
    ourAnnotation = annotation;

    thing = $('<div/>')
      .css({ position: 'fixed'
           , top: '10px'
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
           , display: annotation ? '' : 'none'
           })

      .append($('<img/>')
              .attr('src', chrome.extension.getURL('write.png'))
              .css({width: iconSize, height: iconSize, margin: 0})
              .click(openAnnotationWindow)
             )

      .appendTo(document.body)

      ;
});

function openAnnotationWindow() {
    var te = $('<textarea/>')
        .val(ourAnnotation || 'Type your annotations here.')
        .keyup(sendAnnotation)
    ;

    thing.css({display: ''}).empty().append(te);
}

function sendAnnotation() {
    chrome.extension.sendRequest({ updateAnnotationsFor: location.href
                                 , annotations: this.value
                                 });
}
