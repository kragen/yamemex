var border = '1px solid black';
var borderRadius = '3px';
var iconSize = '32px';

$('<div/>')
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
       })
  .append($('<img/>')
          .attr('src', chrome.extension.getURL('write.png'))
          .css({width: iconSize, height: iconSize})
         )
  .appendTo(document.body)
  ;
