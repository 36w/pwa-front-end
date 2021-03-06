var myDB = {
    name: 'story',
    version: 1,
    db: 'story',
    ojstore: {
        name: 'index',//存储空间表的名字
        keypath: 'storyId'//主键
    }
};

var INDEXDB = {
    indexedDB: window.indexedDB || window.webkitindexedDB,
    IDBKeyRange: window.IDBKeyRange || window.webkitIDBKeyRange,//键范围
    openDB: function (dbname, dbversion, callback) {
        //建立或打开数据库，建立对象存储空间(ObjectStore)
        var self = this;
        var version = dbversion || 1;
        var request = self.indexedDB.open(dbname, version);
        request.onerror = function (e) {
            console.log(e.currentTarget.error.message);
        };
        request.onsuccess = function (e) {
            myDB.db = e.target.result;
            console.log('成功建立并打开数据库:' + myDB.name + ' version' + dbversion);
        };
        request.onupgradeneeded = function (e) {
            var db = e.target.result, transaction = e.target.transaction, store;
            if (!db.objectStoreNames.contains(myDB.ojstore.name)) {
                //没有该对象空间时创建该对象空间
                store = db.createObjectStore(myDB.ojstore.name, { keyPath: myDB.ojstore.keypath });
                console.log('成功建立对象存储空间：' + myDB.ojstore.name);
            }
        }
    },
    deletedb: function (dbname) {
        //删除数据库
        var self = this;
        self.indexedDB.deleteDatabase(dbname);
        console.log(dbname + '数据库已删除')
    },
    closeDB: function (db) {
        //关闭数据库
        db.close();
        console.log('数据库已关闭')
    },
    addData: function (db, storename, data) {
        //添加数据，重复添加会报错
        var store = store = db.transaction(storename, 'readwrite').objectStore(storename), request;
        for (var i = 0; i < data.length; i++) {
            request = store.add(data[i]);
            request.onerror = function () {
                console.error('add添加数据库中已有该数据')
            };
            request.onsuccess = function () {
                console.log('add添加数据已存入数据库')
            };
        }
    },
    putData: function (db, storename, data) {
        //添加数据，重复添加会更新原有数据
        var store = store = db.transaction(storename, 'readwrite').objectStore(storename), request;
        for (var i = 0; i < data.length; i++) {
            request = store.put(data[i]);
            request.onerror = function () {
                console.error('put添加数据库中已有该数据')
            };
            request.onsuccess = function () {
                console.log('put添加数据已存入数据库')
            };
        }
    },
    getDataByKey: function (db, storename, key) {
        //根据存储空间的键找到对应数据
        var store = db.transaction(storename, 'readwrite').objectStore(storename);
        var request = store.get(key);
        request.onerror = function () {
            console.error('getDataByKey error');
        };
        request.onsuccess = function (e) {
            var result = e.target.result;
            console.log('查找数据成功')
            console.log(result);
        };
    },
    getAllData(db,storename, callback) {
        let store = db.transaction(storename, 'readwrite').objectStore(storename);
        let request = store.openCursor();
        let data = [];
        request.onerror = function () {
            console.error('getDataByKey error');
        };
        request.onsuccess = function (e) {
            let result = e.target.result;
            if (result && result !== null) {
                data.push(result.value);
                result.continue();
            } else {
                if (callback) {
                    console.log('全部查找数据成功')
                    callback(data);
                }
            }
        };
    },
    deleteData: function (db, storename, key) {
        //删除某一条记录
        var store = store = db.transaction(storename, 'readwrite').objectStore(storename);
        store.delete(key)
        console.log('已删除存储空间' + storename + '中' + key + '记录');
    },
    clearData: function (db, storename) {
        //删除存储空间全部记录
        var store = db.transaction(storename, 'readwrite').objectStore(storename);
        store.clear();
        console.log('已删除存储空间' + storename + '全部记录');
    }
}
var students = [{
    id: 1001,
    name: "Byron",
    age: 24
}, {
    id: 1002,
    name: "Frank",
    age: 30
}, {
    id: 1003,
    name: "Aaron",
    age: 26
}];

INDEXDB.openDB(myDB.name, myDB.version);


// setTimeout(function () {
//     console.log('****************添加数据****************************');
//     INDEXDB.addData(myDB.db, myDB.ojstore.name, students);
//     console.log('******************add重复添加**************************');
//     INDEXDB.addData(myDB.db,myDB.ojstore.name,students);
//     console.log('*******************put重复添加*************************');
//     INDEXDB.putData(myDB.db,myDB.ojstore.name,students);
//     console.log('*******************获取数据1001*************************');
//     INDEXDB.getDataByKey(myDB.db,myDB.ojstore.name,1001);
//     console.log('******************删除数据1001************');
//     INDEXDB.deleteData(myDB.db,myDB.ojstore.name,1001);
//     console.log('******************删除全部数据************');
//     INDEXDB.clearData(myDB.db,myDB.ojstore.name);
//     console.log('******************关闭数据库************');
//     INDEXDB.closeDB(myDB.db);
//     console.log('******************删除数据库************');
//     INDEXDB.deletedb(myDB.name);
// }, 800)