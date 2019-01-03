$(function () {
  var getRandom = function (max, min) {
    // <max
    max = max || 1;
    min = min || 0;
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var viewer = (function () {
    var $views = $('.page');
    var $tips = $('.tips');
    var $mask = $('.mask');
    return {
      change: function (id) {
        $views.removeClass('cur').filter('.page' + id).addClass('cur');
      },
      tips: function (cl) {
        $tips.attr('class', 'tips ' + (cl || ''));
        $tips[cl ? 'show' : 'hide']();
      },
      mask: function (cl) {
        $mask[cl ? 'show' : 'hide']();
      }
    };
  })();

  var countdown = (function () {
    var getTime = function () {
      return (new Date).getTime();
    };
    var t_start = getTime();
    var $t = $('#timer');
    var t_end = getTime();
    var _t;
    return {
      start: function () {
        t_start = getTime();
        this.stop();
        _t = setInterval(function () {
          t_end = getTime();
          $t.text(Math.floor((t_end - t_start) / 1000) + 's');
        }, 200)
      },
      stop: function () {
        clearInterval(_t);
        return t_end - t_start
      },
      reset: function () {
        t_start = getTime();
        this.stop();
        $t.text('0s');
      }
    };
  })();

  var qa = (function () {
    var questions = [];
    var cur_index = 0;
    var answers_list = [];
    return {
      setQuesions: function (qs) {
        qs.forEach(function (item) {
          var _q = { q: item.q, a: item.a };
          var _a = _q.a[0];

          _q.a.sort(function () {
            var i = Math.random() > 0.5 ? -1 : 1;
            return i;
          });
          _q.correct = _q.a.indexOf(_a);
          questions.push(_q);
        });
        questions.sort(function () {
          var i = Math.random() > 0.5 ? -1 : 1;
          return i;
        });
        questions.splice(6);
      },
      insertQuestions: function (qs, pos) {
        qs.forEach(function (item, k) {
          var _q = { q: item.q, a: item.a };
          var _a = _q.a[0];

          _q.a.sort(function () {
            var i = Math.random() > 0.5 ? -1 : 1;
            return i;
          });
          _q.correct = _q.a.indexOf(_a);
          questions.splice((pos || 0) + k, 0, _q);
        });
      },
      nextQuestion: function () {
        var cur = questions[cur_index];
        $('#question').html((cur_index + 1) + '、' + cur.q);
        var answers_html = cur.a.map(function (item, i) {
          var _i = ['A', 'B', 'C', 'D'];
          return '<li class="a-item">' + _i[i] + '. ' + item + '</li>';
        }).join('');
        $('#answers').html(answers_html);
        $('#answers li').on('click', function () {
          var index = $(this).index();
          if (index === cur.correct) {
            viewer.tips('success-' + getRandom(5, 1));
            // $(this).addClass('success');
            answers_list.push(1);
          } else {
            viewer.tips('error-' + getRandom(4, 1));
            // $(this).addClass('error');
            answers_list.push(0);
          }
          setTimeout(function () {
            viewer.tips();
            if (answers_list.length >= 7) {
              qa.end();
            } else {
              cur_index ++;
              qa.nextQuestion();
            }
          }, 800);
        });
      },
      getCur: function () {
        return cur_index;
      },
      getResult: function () {
        return answers_list;
      },
      reset: function () {
        questions = [];
        cur_index = 0;
        answers_list = [];
      },
      end: function () {
        if (!GDATA.score) {
          viewer.change('5');
        } else {
          viewer.change('6');
          $('.page6-score').show();
        }
        var r = qa.getResult();
        var e = countdown.stop();
        var score = 0;
        e = Math.floor((e / 1000) / 5);
        r.forEach(function (item, i) {
          item === 1 && (score++);
        });
        score = Math.round(score * 10 / 7 * 9) - (e > 10 ? 10 : e);
        score = score > 0 ? score : 0;
        $('#score-result, #score-result2').text(score);
        GDATA['score'] = score;
      }
    };
  })();

  var qs = [
    {
      q: '最近说以下子句“当然是选择原谅TA；爱是一道光；这个盘我接了”是指一种颜色，请问是',
      a: [
        '绿色',
        '紫色',
        '黄色',
        '蓝色'
      ]
    }, {
      q: '“惊不惊喜，意不意外”这句话的梗是出自于以下哪一部电影作品',
      a: [
        '《家有喜事1992》',
        '《功夫》',
        '《大内密探零零发》',
        '《唐伯虎点秋香》'
      ]
    }, {
      q: '网上常有人说：三年血赚，死刑不亏，一般指的对象是',
      a: [
        '萝莉',
        '正太',
        '宠物',
        '老太婆'
      ]
    }, {
      q: '有一种头似马、角似鹿、尾似驴、蹄似牛，俗称“四不像”的珍奇动物，其野生种群18世纪在我国灭绝。1985年我国分批引进80多只，建立自然保护区，进行在自然界恢复野生种群的研究，这种动物是',
      a: [
        '麋鹿',
        '驯鹿',
        '鹿晗',
        '马鹿'
      ]
    }, {
      q: '世界部分首都是以人名命名的，下列哪个不是',
      a: [
        '莫斯科',
        '华盛顿',
        '巴黎',
        '圣地亚哥'
      ]
    }, {
      q: '下列哪一个城市是我国的“三大火炉”(高温)之一？',
      a: [
        '南京',
        '吐鲁番',
        '成都',
        '广州'
      ]
    }, {
      q: '古时候，指南针为什么不叫“指北针”？',
      a: [
        '面南为尊，面北为卑',
        '北同败北，不很吉利',
        '男尊女卑，取“男”谐音',
        '叫着顺口'
      ]
    }, {
      q: '广州因何而有“羊城”之名？',
      a: [
        '根据传说',
        '传说为羊的后代',
        '喜欢吃羊肉',
        '曾是牧业城市'
      ]
    }, {
      q: '巴金的《爱情三部曲》是：',
      a: [
        '《雾》《雨》《电》',
        '《家》《春》《秋》',
        '《中》《发》《白》',
        '《一起来看流星雨》《一起又看流星雨》《一起再看流星雨》'
      ]
    }, {
      q: '在英语当中，哪两个字母的出现频率最高',
      a: [
        'e和t',
        'f和u',
        '哔和哔……哔',
        'c和k'
      ]
    }, {
      q: '狗热时用什么散热',
      a: [
        '舌头',
        '肉垫',
        '菊花',
        '冥想'
      ]
    }, {
      q: '举世闻名的泰姬陵在',
      a: [
        '印度',
        '印度尼西亚',
        '泰国',
        '朋友圈内'
      ]
    }, {
      q: '马拉松赛跑中的“马拉松”一词是指',
      a: [
        '地名',
        '树目名',
        '咒语',
        '食品名'
      ]
    }, {
      q: '中国民间“送灶神”时要吃粘牙的甜食，这是为了',
      a: [
        '用糖粘住灶神',
        '喂饱灶神',
        '喂饱自己',
        '甜为吉利'
      ]
    }, {
      q: '人体最大的解毒器官是',
      a: [
        '肝脏',
        '别人的嘴',
        '手机摄像头',
        '舌头'
      ]
    }, {
      q: '人体含水量百分比最高的器官是',
      a: [
        '眼球',
        '血液',
        '膀胱',
        '腋下'
      ]
    }, {
      q: '下面哪种酸，是可供人品尝的',
      a: [
        '单宁酸 ',
        '心酸',
        '吃不到葡萄就说葡萄酸',
        '吃醋'
      ]
    }, {
      q: '老虎最害怕什么？',
      a: [
        '山雀的粪便',
        '逃避购票，翻高墙入园',
        '武松',
        '象和狮'
      ]
    }, {
      q: '神话《白蛇传》中"白娘娘盗仙草"盗的是',
      a: [
        '灵芝',
        '跳蛋',
        '带刺黄瓜',
        '寂寞'
      ]
    }, {
      q: '人类全身上下,最强韧有力的肌肉是',
      a: [
        '舌头',
        '括约肌',
        '表情肌',
        '海绵体'
      ]
    }, {
      q: '北极熊的惯用手是',
      a: [
        '左撇子',
        '谁知道咧',
        '得问雌熊',
        '北极熊一般不用手'
      ]
    }, {
      q: '降落伞的发明人把第一次乘坐降落伞的机会让给',
      a: [
        '狗',
        '情妇',
        '妻子',
        '好基友'
      ]
    }, {
      q: '阿斯品林是常用药，以下哪项是它的主要功能是',
      a: [
        '解热',
        '止痒',
        '止咳',
        '紧急避孕'
      ]
    }, {
      q: '中国农业银行发行的信用卡是？',
      a: [
        '金穗卡',
        '龙卡',
        '牡丹卡',
        '穴深卡'
      ]
    }, {
      q: '哪国人送礼时避偶就奇，通常用1、3、5、7等奇数，但却忌讳“9”？',
      a: [
        '日本',
        '朝鲜',
        '泰国',
        '中国'
      ]
    }, {
      q: '李白的《静夜诗》中“床前明月光”的“床”指的是什么？',
      a: [
        '井栏',
        '床',
        '窗户',
        '铜镜'
      ]
    }, {
      q: '人们常说：“无事不登三宝殿”你知道“三宝”是指哪三宝？',
      a: [
        '佛、法、僧',
        '纸、砚、笔',
        '书、剑、琴',
        '金、银、玉'
      ]
    }, {
      q: '为什么飞机能上天？  ',
      a: [
        '利用大气的压力产生的升力飞上天',
        '利用发动机产生的推力飞上天',
        '因为有乘客说了句：“大兄弟，上天不”',
        '靠的是“螺旋升天，法力无边”'
      ]
    }, {
      q: '人体最先老化的是哪一部位？',
      a: [
        '眼睛',
        '牙齿',
        '心脏',
        '大脑'
      ]
    }, {
      q: '唐代否定了按门第选官的九品中正制及等额推荐的察举制，实行分科考试、差额录取的科举制，这反映出唐代 ',
      a: [
        '选才注重知识水平',
        '完全依赖父母为官特权',
        '皇帝一人搞定 ',
        '选官重视思想品德'
      ]
    }, {
      q: '请问以下哪位是王昭君的丈夫？',
      a: [
        '呼韩邪单于',
        '松赞干布',
        '复株累权鞮单于',
        '朗日论赞'
      ]
    }, {
      q: '文献与考古表明，唐代中后期，“波斯锦”“胡锦”“番锦”通过丝绸之路，不断输入中国，内地也生产“胡式锦”。这表明',
      a: [
        '中外文化交流互动日益深入',
        '外来文化改变了唐代的社会生活',
        '唐代中后期手工业趋于衰落 ',
        '外来的丝织品就是比唐朝的出品好'
      ]
    }, {
      q: '“有容乃大”是唐朝超越前朝的特有文化气派．以下能体现唐朝“有容乃大”的是<br>①玄奘到天竺学习佛学 <br>②吐蕃与唐朝“和同为一家” <br>③日本多次派出使者来唐朝学习<br>④马可•波罗来中国经商． ',
      a: [
        '①②③',
        '②③④',
        '①③④',
        '①②④'
      ]
    }, {
      q: '这一机构的办事特点是“勤、速、密”，且“只供传述错误，而不能稍有赞画于其间”，决策权由皇帝控制．该机构是',
      a: [
        '军机处',
        '锦衣卫',
        '中书省',
        '暗部'
      ]
    }, {
      q: '据载，清政府的官员都不知道俄国人要求的领土有多大，兴安岭离乌苏里江有多远，还有哪些内容在《尼布楚条约》中尚未确定．材料中“俄国人要求的领土”位于我国',
      a: [
        '东北',
        '西北',
        '东南',
        '西南'
      ]
    }, {
      q: '2016年中央电视台《中国诗词大会》节目带动全民分享诗词之美，感受诗词之趣，从古人的智慧和情怀中汲取营养，涵养心灵．节目如问创作“黄河落天走东海，万里写入胸怀问”诗句的作者是谁，你的回答',
      a: [
        '诗仙',
        '诗圣',
        '诗魔',
        '诗神 '
      ]
    }, {
      q: '分类归纳能强化知识的理解记忆．下列对中国古代书法艺术知识的归纳，正确的是',
      a: [
        '“宋四家”指宋代书法家苏轼、黄庭坚、米芾、蔡襄',
        '东汉末年书法逐渐成为一种行为艺术 ',
        '王羲之的《兰亭序》有“天下第一楷书”的美誉 ',
        '明朝书法家文徵明的书法兼有“颜骨赵姿”之美'
      ]
    }, {
      q: '下列选项中属于《南京条约》内容的是<br>①割台湾岛给美国<br>②赔款款二亿辛巴威元<br>③开放广州、厦门、福州、宁波、上海五处为通商口岸<br>④英商进出口货物缴纳的税款，中国须同英国商定',
      a: [
        '③④',
        '①②③④',
        '①③',
        '①②④'
      ]
    }, {
      q: '安徽古代“文房四宝”中有“三宝”入选首批国家级非物质文化遗产名录，历代文人多有美誉，有人曾赋诗：“老松烧尽结轻化，妙法从来北李家。”诗中描绘的是',
      a: [
        '徽墨',
        'A4纸',
        '宣笔',
        '砧板'
      ]
    }, {
      q: '商鞅变法的内容中，对促进农业生产、提高军队战斗力都起了直接作用的是',
      a: [
        '奖励耕战',
        '发展教育',
        '皇帝祭天',
        '任人唯贤'
      ]
    }, {
      q: '“他对内整顿朝政，对外‘尊王攘夷’，终于九合诸侯，一匡天下成就了春秋五霸之首的伟业。”这里的“他”是',
      a: [
        '齐桓公',
        '周武王',
        '主人公',
        '阎罗王'
      ]
    }, {
      q: '《战国故事》战国时期主张合纵抗秦的人是谁？',
      a: [
        '苏秦',
        '苏有朋',
        '苏玉华',
        '苏永康'
      ]
    }, {
      q: '中国历史上第一个皇帝是谁？',
      a: [
        '秦始皇',
        '秦海璐',
        '秦岚',
        '秦沛'
      ]
    }, {
      q: '《春秋故事》利用老马识途，让将士们化险为夷的是？',
      a: [
        '管仲',
        '特朗普',
        '普京',
        '周润发'
      ]
    }, {
      q: '《三国故事》三顾茅庐，请出诸葛亮的是：',
      a: [
        '刘备',
        '周瑜',
        '甘夫人',
        '曹操'
      ]
    }, {
      q: '《战国故事》人们称秦越人为扁鹊的原因是：',
      a: [
        '他治病的本领强如同上古时代的神医扁鹊',
        '他的样子长得像一只鸟',
        '他在王者荣耀里的辅助能力与扁鹊相仿',
        '他长得像扁鹊'
      ]
    }, {
      q: '《三国演义》里称三结义为：',
      a: [
        '桃园三结义',
        '无形商标三结义',
        '传销三结义',
        '断背三结义'
      ]
    }, {
      q: '中国古代伟大的思想家、政治家、教育家，儒家学派的创始人是',
      a: [
        '孔子',
        '瞎子',
        '老子',
        '贞子'
      ]
    }, {
      q: '每年的农历五月初五是端午节，这一天有吃粽子的习俗，这是为了纪念我国历史上伟大的爱国主义诗人是',
      a: [
        '屈原',
        '屈臣氏',
        '宋小宝',
        '孙中山'
      ]
    }, {
      q: '我国四大发明除了活字印刷术、指南针、火药之外，还有',
      a: [
        '造纸术',
        '支付宝',
        '共享单车',
        '高铁'
      ]
    }, {
      q: '被后人尊称“诗杰”的唐朝诗人是',
      a: [
        '王勃',
        '王杰',
        '王重阳',
        '王健林'
      ]
    }, {
      q: '第一手史料接近或直接在历史事件发生时所产生和记录的原始资料。以下用于研究三国历史的第一手史料是',
      a: [
        '诸葛亮《出师表》',
        '历史剧《三国》',
        '罗贯中《三国演义》',
        'KOEI《真·三国无双》'
      ]
    }, {
      q: '1945年9月，毛泽东会客时说：“我们的目标是‘和平民主’，这与蒋介石打算正相反。不过，他愿意谈，我就谈；他愿意打，我就打。反正我是延安来的客人，客随主便嘛！”据此判断，这次会客是在',
      a: [
        '重庆',
        '毛泽东家',
        '西安',
        '蒋介石家'
      ]
    }, {
      q: '1915年初，俄国军医活沃伊洛夫斯基在写给亲人的信中说：“战争使我们不断地贬低人的身份和尊严，只留下动物的本能。”对这句话理解准确的是',
      a: [
        '战争使士兵丧失了人格和尊严',
        '士兵觉得横竖都是死，不如搏一搏',
        '士兵不惧怕死亡',
        '战争使士兵斗志昂扬'
      ]
    }, {
      q: '和谐社会的重要内容之一是社会公平，教育公平是社会公平的基础。中国古代儒家学派  创始人孔子的思想中，对今天倡导教育公平有借鉴意义的是',
      a: [
        '“有教无类”',
        '以“德”教化人民',
        '以礼治理国家',
        '“因材施教'
      ]
    }, {
      q: '最能反映宋代市民生活丰富多彩的场所是：',
      a: [
        '瓦肆',
        '跳蚤市场',
        '集市',
        '怡红院'
      ]
    }, {
      q: '被认为是欧洲开始从中世纪向近代社会过渡的标志的作品是',
      a: [
        '《神曲》',
        '《罗蜜欧与朱丽叶》',
        '《梁山伯与祝英台》',
        '《宋仲基与宋慧乔》'
      ]
    }, {
      q: '中国第一个全国规模的统一的资产阶级革命政党是',
      a: [
        '中国同盟会 ',
        '兴中会',
        '中国进出口商品交易会',
        '同好会'
      ]
    }, {
      q: '假如你穿越时空，来到五六千年前的陕西半坡村，你能够吃到',
      a: [
        '小米、猪肉、蔬菜',
        '红高粱、白切鸡、三文鱼',
        '大米、猪肉、蔬菜',
        '战斧牛排、马卡龙、肉酱意面'
      ]
    }, {
      q: '从绘画题材来看，《清明上河图》应属于',
      a: [
        '风俗画',
        '广告长图',
        '春宫图',
        '写真画'
      ]
    }, {
      q: '中国画三大画科分别是人物画、山水画和',
      a: [
        '花鸟画',
        '儿童画',
        '人体写真画',
        '连环画'
      ]
    }, {
      q: '半坡型彩陶器具有代表性的装饰纹样是',
      a: [
        '人面鱼纹',
        '妊娠纹',
        '花叶纹',
        '鱼眼纹'
      ]
    }, {
      q: '在苏州著名的园林有',
      a: [
        '拙政园',
        '游乐园',
        '幼儿园',
        '烈士陵园'
      ]
    }, {
      q: '目前被称为“世界最昂贵的画作”的是',
      a: [
        '你何时结婚？',
        '令尊的画像',
        '一个男人和一个女人',
        '三个女人一台戏'
      ]
    }, {
      q: '下列哪一个是米开朗基罗常用的雕塑手法',
      a: [
        '雕',
        '塑',
        '气割',
        '焊接'
      ]
    }, {
      q: '西方音乐最早的文献记载是从哪部文学作品开始的？',
      a: [
        '《荷马史诗》',
        '《伊索寓言》',
        '《三个小猪盖房子》',
        '《熊出没》'
      ]
    }, {
      q: '钢琴共有几个键？',
      a: [
        '88',
        '110',
        '120',
        '99'
      ]
    }, {
      q: '江苏卫视热播节目《非诚勿扰》女嘉宾灭灯后结尾的音乐来自于？',
      a: [
        '博伊伦之歌（也叫布兰诗歌）',
        '东京热',
        'freestyle',
        '音乐剧《猫》'
      ]
    }, {
      q: '中国古典舞是（ ）的艺术。',
      a: [
        '圆形',
        '蛇形',
        '畸形',
        '立体形'
      ]
    }, {
      q: '《亚威农少女》、《格尔尼卡》是（ ）绘画的代表作品。',
      a: [
        '抽象主义',
        '啪啪主义',
        '达达主义',
        '拉拉主义'
      ]
    }, {
      q: '埃斯库罗斯的代表作《普罗米修斯》取材于（ ）。',
      a: [
        '希腊神话',
        '中国神话',
        '日本神话',
        '印度神话'
      ]
    }, {
      q: '达利的油画《记忆的永恒》和布努艾尔导演的电影《一条安达鲁狗》等是（ ）流派的代表作品。',
      a: [
        '超现实主义',
        '共和主义',
        '资本主义',
        '社会主义'
      ]
    }, {
      q: '《人间喜剧》是（ ）的重要作品。',
      a: [
        '巴尔扎克',
        '巴塞罗那',
        '巴啦啦小魔仙',
        '巴基斯坦'
      ]
    }, {
      q: '亚里士多德最重要的美学著作是？',
      a: [
        '《诗学》',
        '《诗经》',
        '《诗和远方》',
        '《心灵鸡汤》'
      ]
    }, {
      q: '《西斯廷圣母》是著名画家（ ）代表作之一。',
      a: [
        '拉斐尔',
        '李奥纳多',
        '米开朗基罗',
        '多纳太罗'
      ]
    }, {
      q: '莫奈的作品《日出印象》、《草垛》等是法国（ ）的代表作品',
      a: [
        '印象主义',
        '后印象主义',
        '幻象主义',
        '抽象主义'
      ]
    }, {
      q: '（ ）是西方高度技术派建筑的杰作之一。',
      a: [
        '巴黎蓬皮杜艺术中心',
        '社区中心',
        '广州塔',
        '巴黎圣母院'
      ]
    }, {
      q: '以下谁是法国巴比松画派的主将？',
      a: [
        '卢梭',
        '艾薇儿',
        'Angelababy',
        '齐白石'
      ]
    }, {
      q: '古罗马拱顶建筑的杰出代表是？',
      a: [
        '万神庙',
        '人民大会堂',
        '泰姬陵',
        '希尔顿酒店'
      ]
    }, {
      q: '法国“罗可可”画家华多的一生的转折点以其作品（ ）为标志。',
      a: [
        '《舟发西苔岛》',
        '《我有一个家》',
        '《家里有个她》',
        '《她是我妈妈》'
      ]
    }, {
      q: '（ ）是古罗马的重要建筑，用来纪念战役的胜利。',
      a: [
        '凯旋门',
        '罗生门',
        '艳照门',
        '随意门'
      ]
    }, {
      q: '巴黎圣母院是著名的（ ）式建筑之一。',
      a: [
        '哥特',
        '自由',
        '非主流',
        '哥特萝莉'
      ]
    }, {
      q: '《阿尔卡迪牧人》的作者是法国画家是？',
      a: [
        '普桑',
        '波澜哥',
        '阿部高和',
        '毛泽东'
      ]
    }, {
      q: '狮身人面像是（ ）的雕塑作品。',
      a: [
        '埃及',
        '泰国',
        '希腊',
        '印度'
      ]
    }, {
      q: '以下哪位不是意大利文艺复兴三杰？',
      a: [
        '溜金哇开呀酷裂',
        '达·芬奇',
        '米开朗基罗',
        '拉斐尔'
      ]
    }, {
      q: '俑最早的用途是？',
      a: [
        '陪葬',
        '保鲜',
        '聊天',
        '祭祀'
      ]
    }, {
      q: '古代画作中的蝙蝠象征着？',
      a: [
        '福气',
        '吸血鬼',
        '黑暗',
        '多子多孙 '
      ]
    }, {
      q: '画素描最理想的场所是？',
      a: [
        '天光教室',
        '暗房',
        '厕所',
        '卧室'
      ]
    }, {
      q: '狄俄尼索斯是古希腊神话中的什么神？',
      a: [
        '酒神',
        '火神',
        '战神',
        '睡神'
      ]
    }
  ];

  var ait = [
    {
      q: '位于广州科学城核心地段的爱特城，出行方式多种多样，全方位立体交通接驳天河，请问业主在此可享受哪几种交通配套',
      a: [
        '高速+地铁+楼巴+公交+有轨电车',
        '地铁+公交+有轨电车',
        '高速+楼巴+有轨电车',
        '高速+地铁+楼巴'
      ]
    }, {
      q: '爱特城业主通过多维度交通，最快多久能去到珠江新城',
      a: [
        '30多分钟',
        '40多分钟',
        '50多分钟',
        '60多分钟'
      ]
    }, {
      q: '黄埔有轨电车2号线将连接6号线和地铁13号线，使爱特城业主出行更加方便，请问以下哪个站点将经过小区门口',
      a: [
        '云埔一路站',
        '永和大道',
        '元岗',
        '联达路'
      ]
    }, {
      q: '除了便利的交通，爱特城的教育资源也是一大亮点，请问业主子女可以入读以下哪些学校',
      a: [
        '以上统统都有',
        '小区配套幼儿园',
        '玉鸣小学',
        '玉泉学校'
      ]
    }, {
      q: '在产品方面，爱特城的交标包含多样人性化安全装置和多功效智能家居，例如有',
      a: [
        '以上统统都有',
        '洗手间设置小夜灯，扶手和一键报警装置',
        '交标门户锁配密码锁及指纹锁',
        '多功能可视面板能'
      ]
    }, {
      q: '在售户型中，爱特城为刚需买家量身定制了一个102平格局方正紧凑的东南向户型，这是几房户型',
      a: [
        '三房',
        '两房',
        '四房',
        '别墅'
      ]
    }
  ];

  var loader = function () {
    var $_loading_box = $('#_loading_box');
    var $_loading_text = $('#_loading_text');
    var loader = new createjs.LoadQueue();

    var load_progess = function load_progess(e) {
      $_loading_text.length && $_loading_text.text('正在加载......' + parseInt(e.loaded * 100) + '%');
    };
    var load_complete = function load_complete(e) {};

    loader.on('complete', function (e) {
      load_complete(e);
      $_loading_box.hide();
    });
    loader.on('progress', function (e) {
      load_progess(e);
    });

    return {
      getResult: function getResult(id) {
        return loader.getResult(id);
      },
      startLoad: function startLoad(list) {
        $_loading_box.show();
        loader.loadManifest(list);
        return this;
      },
      handlerLoadProgress: function handlerLoadProgress(progess) {
        load_progess = progess || load_progess;
        return this;
      },
      handlerLoadComplete: function handlerLoadComplete(complete) {
        load_complete = complete || load_complete;
        return this;
      }
    };
  }();

  var _swipe = function () {
    var isTouch = 'ontouchstart' in window;
    var EVENT = {
      start: isTouch ? 'touchstart' : 'mousedown',
      move: isTouch ? 'touchmove' : 'mousemove',
      end: isTouch ? 'touchend' : 'mouseup'
    };
    var $_swipe_list = $('._swipe_list');
    var $_swipe_item = $('._swipe_item');
    var isInited = false;

    return {
      init: function init() {
        if (isInited) {
          return;
        }
        isInited = true;

        $_swipe_item.each(function (i, item) {
          $(item).append('<div class="global-arrow ' + (i == $_swipe_item.length - 1 ? 'global-arrow-top' : 'global-arrow-btm') + '">' +
                          '<svg width="38" height="22" version="1.1">' +
                            '<line x1="2" y1="20" x2="20" y2="2" style="stroke:#fff;stroke-width:4;"></line>' +
                            '<line x1="18" y1="2" x2="36" y2="20" style="stroke:#fff;stroke-width:4;"></line>' +
                          '</svg>' +
                        '</div>');
        }).eq(0).addClass('cur');

        var point = { y: [] };
        var cur = 0;

        $_swipe_list.on(EVENT.start, function (e) {
          var _e = isTouch ? e.touches[0] : e;
          point.y = [_e.pageY];
        });
        $(document).on(EVENT.move, function (e) {
          if (point.y.length) {
            var _e = isTouch ? e.touches[0] : e;
            point.y.push(_e.pageY);
          }
        });
        $(document).on(EVENT.end, function (e) {
          if (point.y.length > 1) {
            if (point.y[0] - point.y[point.y.length - 1] > 50) {
              // 向上滑动
              ++cur > $_swipe_item.length - 1 && (cur = $_swipe_item.length - 1);
            } else if (point.y[0] - point.y[point.y.length - 1] < -50) {
              // 向下滑动
              --cur < 0 && (cur = 0);
            }
            $_swipe_item.removeClass('cur').eq(cur).addClass('cur');
          }
          point.y = [];
        });
      }
    };
  }();

  var res = [
    'http://wx.gz.focus.cn/html/baoli_brain/res/bg.mp3?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/answer_bg.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/bg.jpg?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/bg2.jpg?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/button.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/clock.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/error.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/light.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/logo.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/music.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/page1_text_front.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/page1_text1.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/page1_text2.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/page1_text3.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/page1_text4.png?v=2.1',
    'http://wx.gz.focus.cn/html/baoli_brain/images/page1-img.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/page2_text1.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/page2_text2.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/page3_btn.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/page3_text1.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/page3_text2.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/page3_text3.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/page6_text1.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/page6_text2.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/sign_bg.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/success.png?v=2.0',
    'http://wx.gz.focus.cn/html/baoli_brain/images/tips-success.png',
    'http://wx.gz.focus.cn/html/baoli_brain/images/tips-success1.png',
    'http://wx.gz.focus.cn/html/baoli_brain/images/tips-success2.png',
    'http://wx.gz.focus.cn/html/baoli_brain/images/tips-success3.png',
    'http://wx.gz.focus.cn/html/baoli_brain/images/tips-success4.png',
    'http://wx.gz.focus.cn/html/baoli_brain/images/tips-error1.png',
    'http://wx.gz.focus.cn/html/baoli_brain/images/tips-error2.png',
    'http://wx.gz.focus.cn/html/baoli_brain/images/tips-error3.png'
  ]; // 这是添加预加载内容
  loader.startLoad(res).handlerLoadComplete(function () {
    _swipe.init();  // 初始化屏幕滑动

    // 其他初始化
    
    $('.start-question').on('click', function () {
      // 进入答题页后，去掉滑动事件，然后装载问题
      $('._swipe_list').off();
      $(document).off();
      $(document).off();

      qa.setQuesions(qs);
      qa.insertQuestions([ait[getRandom(ait.length, 0)]], 6);
      qa.nextQuestion();
      countdown.start();
      viewer.change('4');
    });

    $('.sign-btn').on('click', function () {
      var name = $('[name="nickname"]').eq(0);
      var phone = $('[name="phone"]').eq(0);
      var age = $('[name="age"]').eq(0);

      if ($.trim(name.val()) == '') {
        name.addClass('error');
        return;
      }
      if ($.trim(phone.val()) == '' || !(/^1[34578]\d{9}$/.test(phone.val()))) {
        phone.addClass('error');
        return;
      }
      if ($.trim(age.val()) == '') {
        age.addClass('error');
        return;
      }

      $.ajax({
        url: 'http://wx.gz.focus.cn/game/single/',
        type: 'post',
        data: {
          gid: 74,
          nickname: $.trim(name.val()),
          phone: $.trim(phone.val()),
          wish: $.trim(age.val()),
          score: GDATA.score
        },
        dataType: 'json',
        success: function (result) {
          if (result.code == 0) {
            viewer.change('6');
          } else {
            alert('报名失败！');
          }
        },
        error: function (xhr, sts, err) {
          alert('报名失败！');
        }
      });
    });

    $('.sign-form input').on('animationend', function () {
      $(this).removeClass('error');
    });

    $(window).on('touchstart', function (e) {
      if (e.target.nodeName != 'INPUT' && e.target.nodeName != 'BUTTON' && e.target.id != 'musicIcon' && e.target.id != 'startQuestion' && e.target.className != 'a-item') {
        e.preventDefault();
      }
    });

    $('#musicIcon').on('click', function () {
      if ($(this).hasClass('pause')) {
        $(this).removeClass('pause');
        $('#audio')[0].play();
      } else {
        $(this).addClass('pause');
        $('#audio')[0].pause();
      }
    });
  });

  window.mywx && mywx.setData({
    title: '考验你智商的时候到了！',
    desc: '5万元的教育基金等你来拿！',
    link: 'http://wx.gz.focus.cn/game/single/?gid=74',
    imgUrl: 'http://wx.gz.focus.cn/html/baoli_brain/images/icon.jpg?v=1.0'
  });

  mywx.ready(function () {
    window.wx && wx.getNetworkType({
      success: function (res) {
        $('#audio').get(0).play();
      }
    });
  });
});
