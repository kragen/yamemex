function dbErrorCallback(t, error) {
    console.log('SQL error %o', error);
    return true;
}

function nop(){}

var db = openDatabase('pagenotes', '1.0', 'PageNotes annotation database', 0);

function sql(statement, args, cb, errorCallback) {
    db.transaction(function(t) {
        t.executeSql( statement
                    , args || []
                    , cb
                    , errorCallback || dbErrorCallback
                    );
    });
}

sql(  'create table if not exists annotations ' +
      '    ( timestamp varchar ' +
      '    , url varchar ' +
      '    , annotation varchar ' +
      '    )'
   );

sql('alter table annotations add column title varchar', [], null, nop);

sql('create unique index if not exists annotations_url on annotations (url)');
sql('drop index if exists blog');
sql('create index if not exists blog2 on annotations ( timestamp ' +
    '                                                , url' +
    '                                                , annotation' +
    '                                                , title' +
    '                                                )'
);

sql('alter table annotations add column public boolean', [], null, nop);

// This is for upgrading bookmarks created before the public column.
sql('create index if not exists puburl on annotations (public, url)');
sql('update annotations set public = 1 where public is null');