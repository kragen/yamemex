yamemex provides a little margin for Chromium (or Google Chrome)
in which you can jot notes about the web page you’re reading.  It’s an
annotation-centered take on bookmarking.  This version is very
preliminary, but it already provides a reverse-chronological view of
your bookmark annotations.

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

- refactor this database stuff, because this is totally fucking
  ridiculous. Adding the “public” checkbox involved editing seven
  places:
    - db.js, to add the column and an index on it;
    - setAnnotation in yamemex.html, to copy it from the request into
      the database;
    - the getAnnotationsFor handler in yamemex.html, to copy it from
      the database into a request;
    - the global variables in ymcontent.js, to have a place to store
      it in the page;
    - the handler for the getAnnotationsFor response in ymcontent, to
      copy it from the response into those variables;
    - openAnnotationWindow in ymcontent, to add the HTML and copy from
      the variable into the HTML state;
    - sendAnnotation in ymcontent, to copy from the global variable to
      the updateAnnotationsFor request.
- avoid empty-string unclickable titles in blog view
- stop "Type your annotations here." annotations from being added when
  you alt-tab away from an unwanted annotation window.
- make blog view not look like shit
- make icon do something when on a new-tab page
- storing original date for annotations so they stay in order (perhaps
  linked from latest date)
- make annotation pane not fade when keyboard focus is in it
    - refactor this into the first version of Kogluktualuk
- smoothly animating open annotation popup
- growing annotation popup taller as you type text into it
- hiding annotations from the page in an iframe
- dismissing annotation popup
- handling URL changes that don't reload the page
- centering "see all" link
- saving favicons
- saving screenshots
- archiving page contents
- Markdown or similar formatting for annotations
- publishing your bookmarks as a blog on the web
- saving previous versions of annotations
- syncing across multiple browsers
- tagging
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
- backends for del.icio.us and/or TiddlySpace
- contextual tags

Acknowledgements
----------------

write.svg and write.png are
<http://www.openclipart.org/people/aungkarns/write.svg> from
<http://www.openclipart.org/detail/79363>, released to the public
domain by AK/aungkarns under the CC0 PD Dedication
<http://creativecommons.org/publicdomain/zero/1.0/>.
