const crawler = require('./crawler');

crawler.movie({
    name: '你的名字'
}, (err, data)  => {
    console.log('movie', data);
});

crawler.topic({
    id: 'shanghaizufang',
    includes: ['世纪公园', '世纪大道', '花木路', '龙阳路'],
    excludes: ['限女'],
    range: [0, 500]
}, (err, data)  => {
    console.log('topic', data);
});