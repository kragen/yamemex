yamemex provides a little margin for Chromium (or Google Chrome)
in which you can jot notes about the web page you’re reading.  It’s an
annotation-centered take on bookmarking.  This version is very
preliminary, but it already provides a reverse-chronological view of
your bookmark annotations, and supports Twitter-style #hashtags 
to categorize them.

It’s free software under the MIT X11 License.

To install
----------

At some point soon, I’ll put up .crx files that you can download and
install with just a click.  It's not quite ready for that, though.

1. 
   Put this source directory somewhere, like /home/bob/yamemex.  (You
   can download it from Github with `git clone
   git://github.com/kragen/yamemex.git`.)
2. 
   Load the submodules: `cd yamemex; git submodule init; git submodule update`.
3. 
   In Chromium, from the menu, pick Tools → Extensions.
4. 
   On the Extensions page, if necessary, click the [+] next to
   Developer Mode to enable Developer Mode.
5. 
   Click the [ Load unpacked extension... ] button on the left side of
   the Extensions page.
6. 
   Pick the directory containing this README file.

You should see the yamemex icon appear to the left of the wrench icon
that opens Chrome’s menu.

DONE
----

- saving annotations for bookmarked pages with a resizable annotation
  popup in-page
- reverse-chronological view in browser
- icon on page to indicate that there are annotations
- add installation instructions
- add license
- focusing annotation popup when it opens
- auto-selecting placeholder text so you can just start typing instead
  of working to delete the placeholder text for a new annotation
- saving page titles
- make blog view run a little bit faster
- running when page starts loading, rather than when it finishes loading
- adding date headers to the reverse-chronological view
- a “public” checkbox to allow private annotations
- giving blog view a stylesheet to make it look good
- dismissing annotation popup
- tagging: Twitter-like, #hashtags in the blog view are links to
  filtered views that show only things tagged with that hashtag.
- smoothly animating open annotation popup
- making browser-action icon open blog view when on a new-tab page

BUGS
----

- hits disk after every keystroke in the annotation window
- malicious JavaScript in a web page can spy on your annotation
- annotation button doesn’t work until page finishes loading
- doesn’t work on framesets

Rejected names
--------------

Rubric Rubricator Gourmet Imhotep Amanuensis yawas yats yanhoo
Houyhnhm yafs GNN Pathfinder Bumppo Leatherstocking Memex compoundbow
recurved

TODO (possibly)
---------------

- trying out markdown-js from
  <https://github.com/isaacs/markdown-js>.  Initial impressions:
    - it’s also reasonably fast, though not as fast as Showdown. It
      takes >1ms per item.
    - it produces well-formed output by the simple expedient of
      HTML-escaping any input, even input that’s already properly
      escaped, like `&lt;link&gt;`, which clearly should not be
      touched.  Re-escaping it produces incorrect output. Maybe
      there’s a way to turn this off and let through safe markup if it
      doesn’t fuck other things up.  I have to check.  Looks like the
      HTML characters are passed through preserved into the JsonML
      tree and then escaped by `renderJsonML` for output, which calls
      `render_tree`, which calls `escapeHTML` in the string case and
      otherwise recurses.  I could probably write a tree walker to
      handle the tags, but I also need to pass through entities
      unharmed (e.g. `&aring;`) except in `inlinecode` and
      `code_block` cases.  I could write my own `convert_tree_to_html`
      function.
    - It renders two spaces at the end of a line into `<br></br>`,
      which is also clearly wrong, because it causes the browser to
      infer an additional `<br>` for the second one.  `render_tree`
      perhaps should know which tags are supposed to be empty so that
      it does not do this, except that `render_tree` is currently not
      very HTML-specific.
    - I am optimistic about its “JSONML” intermediate format, which is
      probably the correct place to add the hashtags.
    - another minor bug: ``` `` `x` `` ``` (with double backticks
      around the outside) converts to ``<code> `x` </code>`` instead
      of the correct ``<code>`x`</code>`` (dropping the spaces).
- make annotation popup close button use some clip art from
  openclipart
- add clickable recent tags in annotation popup
- make blog view editable (!!)
- refactor this database stuff, because this is totally fucking
  ridiculous. Adding the “public” checkbox involved editing seven
  places:

    1. db.js, to add the column and an index on it;
    2. setAnnotation in yamemex.html, to copy it from the request into
       the database;
    3. the getAnnotationsFor handler in yamemex.html, to copy it from
       the database into a request (already fixed);
    4. the global variables in ymcontent.js, to have a place to store
       it in the page;
    5. the handler for the getAnnotationsFor response in ymcontent, to
       copy it from the response into those variables;
    6. openAnnotationWindow in ymcontent, to add the HTML and copy from
       the variable into the HTML state;
    7. sendAnnotation in ymcontent, to copy from the global variable to
       the updateAnnotationsFor request;
    8. sendAnnotation in ymcontent, to copy from the HTML back into
       the object.

    Fixing this should involve the following steps:

    - put ourAnnotation and ourPublic into one object, eliminating #4.
    - put the URL and title in there too
    - change the request sent to the background page to just have that
      object (the one to insert into the database), eliminating #7.
    - changing the database code to insert arbitrary random properties
      on the object it’s handed instead of a fixed set of properties,
      eliminating #2.
    - changing the getAnnotationsFor handler to send an object
      containing all columns of the row, eliminating #5.

    This would leave only duplications #1, #6, and #8.  Unifying #6 
    and #8 would involve a simple model-view framework, and unifying #1 with
    them would involve a Django-style schema definition EDSL in JS, so I
    don’t feel as bad about those.

- avoid empty-string unclickable titles in blog view (oh shit. the
  title in the database for this one is ‘{{ mustache }}’. I think that
  means mustache.js is fucking with me and double-interpreting the
  fucking variable.)  I'm pretty sure this is a bug because it doesn’t
  seem to be documented and it isn't represented in the examples
  directory used for unit tests. Minimal reproduction:

        Mustache.to_html('{{b}}', {b: '{{c}x}' }) -> '{{c}x}'
        Mustache.to_html('{{#a}}{{b}}{{/a}}', {a: [{b: '{{c}x}' }]}) -> '{{c}x}'
        Mustache.to_html('{{b}}', {b: '{{c}}' }) -> '{{c}}'
        Mustache.to_html('{{#a}}{{b}}{{/a}}', {a: [{b: '{{c}}' }]}) -> '' (wrong)

    Looks like the problem in Mustache.js is that it re-interprets the
    HTML coming out of the inner section as a template:

        var html = this.render_section(template, context, partials);
        if(in_recursion) {
          return this.render_tags(html, context, partials, in_recursion);
        }

        this.render_tags(html, context, partials, in_recursion);

- make titles editable in annotation popup
- stop “Type your annotations here.” annotations from being added when
  you alt-tab away from an unwanted annotation window.  This will be a
  lot easier when we can just copy the object being edited and then
  see if anything about it has changed, and not send a message if not.
- automatically snarf publication date off the page
- storing original date for annotations so they stay in order (perhaps
  linked from latest date)
- make annotation pane not fade when keyboard focus is in it
    - refactor this into the first version of Kogluktualuk
- growing annotation popup taller as you type text into it
- hiding annotations from the page in an iframe
- handling URL changes that don’t reload the page
- centering “see all” link
- saving favicons
- saving screenshots
- archiving page contents
- Markdown or similar formatting for annotations.
  <https://github.com/fivesixty/mdext> looks like the current home
  page of the most-maintained version of Showdown, which seems like
  the best implementation of Markdown in JS.  There’s a WYSIWYM editor
  for it at <http://code.google.com/p/wmd-new/>.
- publishing your bookmarks as a blog on the web
- saving previous versions of annotations
- syncing across multiple browsers
- saving highlighted quotations from pages
- automatically parsing dates from pages and displaying bookmarks in a calendar view
- Lotus-Agenda-like auto-tagging based on user-specified keywords
- plugins to seek bibliographic data and enable bookmarking of it
- “friends”
- subscribing to friends’ annotations
- “like” button on friends’ annotations
- Wiki-like editing of friends’ annotations
- real-time updates
- comment threads on annotations
- Agenda-like grid views
- full-text search
- blog pagination
- backends for:
    - del.icio.us?
    - TiddlySpace?
    - AtomPub? 
        - AtomPub has support from Wordpress
    - identi.ca? (OStatus, StatusNet)
    - Twitter?
    - WebDAV?
    - freelish.us? <http://status.net/2011/04/01/new-federated-social-bookmarks-service-freelish-us>
- contextual tags (what was this?)

Acknowledgements
----------------

write.svg and write.png are
<http://www.openclipart.org/people/aungkarns/write.svg> from
<http://www.openclipart.org/detail/79363>, released to the public
domain by AK/aungkarns, Aungkarn Sugcharoun, under the CC0 PD
Dedication <http://creativecommons.org/publicdomain/zero/1.0/>.

The Candal font used for titles in blog.html is by Vernon Adams
<http://www.newtypography.co.uk/> who has licensed it under the SIL
Open Font License and made it available through the Google Web Fonts
API for free download:
<http://www.google.com/webfonts/family?family=Candal&subset=latin>.

Thanks to Javier Candeira, Nadia Heninger, Joe Blaylock, and Beatrice
Murch for their helpful feedback.

Copyright
---------

Aside from the graphics and font mentioned above, yamemex is copyright 2011
Kragen Javier Sitaker, and is licensed under the MIT X11 license, as
described in MIT-LICENSE.TXT.