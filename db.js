function dbErrorCallback(t, error) {
    console.log('SQL error %o', error);
    return true;
}

var db = openDatabase('pagenotes', '1.0', 'PageNotes annotation database', 0);
console.log(db);

function sql(statement, args, cb) {
    db.transaction(function(t) {
        t.executeSql(statement, args || [], cb, dbErrorCallback);
    });
}

sql(  'create table if not exists annotations ' +
      '    ( timestamp varchar ' +
      '    , url varchar ' +
      '    , annotation varchar ' +
      '    )'
   );

sql('create unique index if not exists annotations_url on annotations (url)');
sql(
    'create index if not exists blog on annotations(timestamp, url, annotation)'
);
