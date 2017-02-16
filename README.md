# douban-crawler

The douban-crawler provide keywords filter for '豆瓣小组' and info fetch for '豆瓣电影'.


## Examples

	const crawler = require('./crawler');

	crawler.topic({ // filter results based on includes and excludes in topic 'shanghaizufang'
	    id: 'shanghaizufang',
	    includes: ['世纪公园', '世纪大道', '花木路', '龙阳路'],
	    excludes: ['限女']
	}, (err, data)  => {
	    console.log(data);
	});

	crawler.movie({ // fetch movie info of '你的名字'
    	name: '你的名字'
	}, (err, data)  => {
	    console.log(data);
	});



## Topic filter

### Usage

	crawler.topic(option, callback);

### Options

* **id** (required, type: String)

	Id of target topic group. It cound be found in the url.
	For example, the id in url `https://www.douban.com/group/shanghaizufang/` is 'shanghaizufang'.

* **includes** (type: Array of String)

* **excludes** (type: Array of String)

* **range** (type: Array of Number)

	`range[0]` is the begin of search, `range[1]` is the end of search. If not to set `range[1]`, the search will go on until all page checked.

* **mode** (type: Number, default: 0)

	0: call function `callback` with single data when each item checked

	1: call function `callback` with complete data after all page checked

* **interval** (type: Number, default: 2000)

	Interval(unit: ms) for each crawl.

### Callback params

1. **error**

2. **data**

	data example:

		{
			"url": "https://www.douban.com/group/topic/96495673/",
			"title": "东欣高层，近世纪大道地铁站2469号线，精装电梯两...",
			"author": "Makai",
			"response": "23",
			"time": "02-16 12:03"
		}


## Movie fetch

### Usage

	crawler.movie(option, callback);

### Options

* **name** (required, type: String)

	Name of target movie. It could be a fuzzy word.

### Callback params

1. **error**

2. **data**

	data example:
		
		{
			"url": "https://movie.douban.com/subject/26683290/",
			"name": "你的名字。 君の名は。",
			"score": 8.5,
			"score_people": 325527,
			"director": "新海诚",
			"actors": ["神木隆之介", "上白石萌音", "长泽雅美", "市原悦子", "成田凌", "悠木碧", "岛崎信长", "石川界人", "谷花音"],
			"year": "2016",
			"comments": [
				{"content": "女大三，抱金砖。", "author": "Solder"},
				{"content": "高配版大鱼海棠，奶奶是夏日大作战穿越来的。新海诚老生常谈，节奏没把握好，人物单薄，插入曲太满，突发式琼瑶情节多，怪不得赞新海诚的论文入不了学院派教授的眼。第一次看到电影带OP，简直呆。日本最近几年天灾频频，哭的观众大概被这个触动了吧。总之二次元言情向，影迷慎看。岩井俊二打了个酱油~", "author": "kino"},
				{"content": "和前作相比并没觉得有变好？？反倒在大屏幕更加显得像在看幻灯片，故事情节在哪里？觉得太没有人间性，想要做的很像人却都是完全没有感情的人偶。而且好多个瞬间都感受到作品透露着深处的冷漠，和表面包装的浪漫温暖美好相对比更让人害怕。", "author": "Cindy"},
				{"content": "新海诚终于会讲一个复杂故事了，真不容易啊！当年那部搔首弄姿、无病呻吟的“言叶之庭”差点让我转成终身黑，“君之名”却轰出了我睽违已久的少女心。彗星降临的末世情怀，穿越时空的灵之绳结，只有7秒钟记忆的鱼...星空、爱情以及所有遇见都是注定。", "author": "同志亦凡人中文站"}
			]
		}



	







	
	

	



	

	


	
