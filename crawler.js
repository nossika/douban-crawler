const request = require('request');
const cheerio = require('cheerio');

function movie_list (name, cb) {
    request({
        url: `https://movie.douban.com/j/subject_suggest?q=${encodeURIComponent(name)}`
    }, (err, res, body) => {
        try {
            body = JSON.parse(body);
        } catch (e) { // 若body不为有效json
            err = err || e;
        }
        cb && cb(err, body);
    });
}

function movie_detail (url, cb) {
    request({
        url: url
    }, (err, res, body) => {
        if (err) {
            cb && cb(err);
            return;
        }
        let $ = cheerio.load(body);

        let actors = [];
        $('#info > span.actor > span.attrs a').each((index, actor_a) => {
            actors.push($(actor_a).text());
        });

        let comments = [];
        $('#hot-comments > div.comment-item').each((index, comment_div) => {
            comments.push({
                content: $(comment_div).find('.comment > p').text().replace(/\n/, '').replace('\n', '').trim(),
                author: $(comment_div).find('.comment-info > a').text()
            });
        });

        let data = {
            url: url.split('?')[0],
            name: $('#content > h1 > span:nth-child(1)').text(),
            score: +$('#interest_sectl > div.rating_wrap.clearbox > div.rating_self.clearfix > strong').text(),
            score_people: +$('#interest_sectl > div.rating_wrap.clearbox > div.rating_self.clearfix > div > div.rating_sum > a > span').text(),
            director: $('#info > span:nth-child(1) > span.attrs > a').text(),
            actors,
            year: $('#content > h1 > span.year').text().replace(/[()]/g,''),
            comments
        };

        cb && cb (err, data);
    });
}

function include_check (str, includes) {
    return includes.some(word => {
        return str.includes(word);
    });
}

function exclude_check (str, excludes) {
    return !excludes.some(word => {
        return str.includes(word);
    });
}

function topic_data (url, cb) {
    console.log(`start crawl: ${url}`);

    request({
        url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'
        }
    }, (err, res, body) => {
        let $ = cheerio.load(body);
        $('#content tr').each((index, tr) => {
            tr = $(tr);

            let data = {
                url:tr.find('td.title a').attr('href'),
                title: tr.find('td.title a').text(),
                author: tr.find('td:nth-child(2) a').text(),
                response: tr.find('td:nth-child(3)').text(),
                time: tr.find('td:nth-child(4)').text()
            };

            cb && cb(err, data)
        });
    });
}

const crawler = {
    movie (opt, cb) {
        let {name} = opt;
        movie_list(name, (err, list) => { // 抓取模糊查询的list
            if (err) { // 获取list出错
                cb && cb (err);
                return;
            }

            let url = list[0] && list[0].type === 'movie' && list[0].url; // 取list的第一条

            if (!url) { // 无查询结果
                err = new Error(`no result by name ${name}`);
                cb && cb (err);
                return;
            }

            movie_detail(url, (err, data) => { // 获取详情
                cb && cb(err, data);
            });
        });
    },

    topic (opt, cb) {
        let {
            id,
            includes = [],
            excludes = [],
            range = [],
            interval = 2000,
            mode = 0
        } = opt;

        let base_url = `https://www.douban.com/group/${id}/discussion?start=`;

        let [start, end] = [range[0] || 0, range[1] || null];

        let gen_skip = (function* () {
            for (let i = start; !end || i <= end; i += 25) {
                yield i;
            }
        })();

        let results = [];

        let itv_id = setInterval(() => {
            let skip = gen_skip.next().value;
            if (skip === undefined) {
                console.log(`crawl done`);
                if (mode === 1) cb && cb(null, results);
                clearInterval(itv_id);
                return;
            }

            topic_data(base_url + skip, (err, data) => {
                if (!(include_check(data.title, includes) && exclude_check(data.title, excludes))) return;

                if (mode === 0) {
                    cb && cb(null, data)
                } else {
                    results.push(data);
                }
            });

        }, interval);


    }
};

module.exports = crawler;
