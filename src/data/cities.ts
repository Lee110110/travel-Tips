import type { City } from '@/types/city'

function m(
  id: string, name: string, nameEn: string, country: string,
  region: City['region'], types: City['types'], description: string,
  lat: number, lng: number
): City {
  return {
    id, name, nameEn, country, region, types, description,
    latitude: lat, longitude: lng,
    population: '', climate: '', bestSeason: '',
    avgBudget: { label: '', dailyMin: 0, dailyMax: 0, currency: 'CNY' },
    heroImage: `https://picsum.photos/seed/${id}/800/500`,
    attractions: [], cuisine: [], travelTips: [],
  }
}

function f(
  id: string, name: string, nameEn: string, country: string,
  region: City['region'], types: City['types'], description: string,
  lat: number, lng: number, population: string, climate: string,
  bestSeason: string, budget: [string, number, number],
  attractions: City['attractions'], cuisine: City['cuisine'], tips: string[]
): City {
  return {
    id, name, nameEn, country, region, types, description,
    latitude: lat, longitude: lng,
    population, climate, bestSeason,
    avgBudget: { label: budget[0], dailyMin: budget[1], dailyMax: budget[2], currency: 'CNY' },
    heroImage: `https://picsum.photos/seed/${id}/800/500`,
    attractions, cuisine, travelTips: tips,
  }
}

const A = (n: string, d: string, i: number, r = 5) => ({
  name: n, description: d, image: `https://picsum.photos/seed/a${i}/400/300`, rating: r
})
const F = (n: string, d: string, i: number, must = false) => ({
  name: n, description: d, image: `https://picsum.photos/seed/f${i}/400/300`, mustTry: must
})

export const cities: City[] = [
  // ==================== 20 CORE CITIES (FULL DATA) ====================
  f('chengdu', '成都', 'Chengdu', '中国', 'domestic', ['city', 'foodie', 'historical'],
    '天府之国，一座来了就不想走的城市。火锅、熊猫、悠闲的生活方式是这座城市的名片。',
    30.57, 104.07, '2100万', '亚热带季风气候', '3-6月, 9-11月', ['适中', 300, 600],
    [A('宽窄巷子', '成都最具特色的历史文化街区', 1), A('大熊猫繁育研究基地', '近距离观赏国宝大熊猫', 2), A('锦里古街', '感受三国文化与成都民俗', 3), A('都江堰', '世界文化遗产，千年水利工程', 4, 5)],
    [F('火锅', '麻辣鲜香，成都美食之魂', 1, true), F('担担面', '经典川味面食', 2), F('龙抄手', '皮薄馅嫩的成都名小吃', 3), F('钟水饺', '甜辣口味的特色水饺', 4)],
    ['建议住在春熙路附近，交通方便', '吃火锅记得点唯怡豆奶解辣', '大熊猫基地建议早上8点到，熊猫最活跃']
  ),

  f('beijing', '北京', 'Beijing', '中国', 'domestic', ['city', 'historical', 'nature'],
    '千年古都，政治文化中心。故宫、长城、胡同，每一处都诉说着厚重的历史。',
    39.90, 116.40, '2189万', '温带季风气候', '9-11月', ['适中', 400, 800],
    [A('故宫博物院', '世界最大的古代宫殿建筑群', 5), A('长城', '不到长城非好汉', 6, 5), A('天坛', '明清祭天圣地', 7), A('颐和园', '皇家园林，湖光山色', 8)],
    [F('北京烤鸭', '皮脆肉嫩，京城美食代表', 5, true), F('炸酱面', '地道北京味', 6), F('豆汁', '老北京特色饮品', 7), F('卤煮', '京味传统小吃', 8)],
    ['故宫建议提前网上预约', '长城推荐慕田峪段，人少景美', '秋天是北京最美的季节']
  ),

  f('shanghai', '上海', 'Shanghai', '中国', 'domestic', ['city', 'romantic'],
    '东方巴黎，中国最国际化的都市。外滩万国建筑与浦东天际线交相辉映。',
    31.23, 121.47, '2487万', '亚热带季风气候', '3-5月, 10-11月', ['较高', 500, 1000],
    [A('外滩', '万国建筑博览群', 9), A('东方明珠', '上海地标建筑', 10), A('豫园', '江南古典园林', 11), A('田子坊', '文艺小资聚集地', 12)],
    [F('小笼包', '皮薄汁多，一口鲜香', 9, true), F('生煎', '底部焦脆的经典早点', 10, true), F('红烧肉', '浓油赤酱的本帮菜代表', 11), F('蟹黄面', '鲜美无比的上海味道', 12)],
    ['地铁出行最方便，建议买一日票', '外滩夜景最佳观赏时间为19:00-21:00', '田子坊周末人很多，工作日更惬意']
  ),

  f('xian', '西安', "Xi'an", '中国', 'domestic', ['historical', 'foodie'],
    '十三朝古都，丝绸之路的起点。兵马俑震撼世界，回民街飘香四溢。',
    34.26, 108.94, '1295万', '温带季风气候', '3-6月, 9-11月', ['经济', 250, 500],
    [A('兵马俑', '世界第八大奇迹', 13, 5), A('大雁塔', '千年古塔，唐代遗风', 14), A('回民街', '西安美食集散地', 15), A('古城墙', '中国最完整的古城墙', 16)],
    [F('羊肉泡馍', '西安美食之王', 13, true), F('肉夹馍', '中式汉堡，外酥里嫩', 14, true), F('凉皮', '爽滑可口的夏日美食', 15), F('biangbiang面', '一字之下尽显豪迈', 16)],
    ['兵马俑建议请讲解员，否则走马观花', '回民街晚上更热闹', '城墙骑行一圈约2小时']
  ),

  f('hangzhou', '杭州', 'Hangzhou', '中国', 'domestic', ['nature', 'romantic', 'historical'],
    '上有天堂下有苏杭，西湖如画，龙井飘香。G20让世界看到了杭州的美。',
    30.27, 120.15, '1237万', '亚热带季风气候', '3-5月, 9-11月', ['适中', 350, 700],
    [A('西湖', '人间天堂的标志', 17, 5), A('灵隐寺', '千年古刹，禅意深远', 18), A('龙井茶园', '品一杯正宗龙井', 19), A('宋城', '穿越千年的演出体验', 20)],
    [F('西湖醋鱼', '杭帮菜经典之作', 17, true), F('东坡肉', '苏东坡留下的美味', 18, true), F('龙井虾仁', '茶香与鲜美的完美融合', 19), F('叫化鸡', '泥中烤出的传奇', 20)],
    ['西湖建议骑行环湖，约3小时', '龙井茶建议去龙井村买，避免景区坑', '宋城千古情演出值得一看']
  ),

  f('lijiang', '丽江', 'Lijiang', '中国', 'domestic', ['nature', 'romantic', 'historical'],
    '纳西古城，雪山脚下。小桥流水、东巴文化，是灵魂栖息的地方。',
    26.87, 100.23, '130万', '高原季风气候', '4-5月, 9-10月', ['适中', 300, 600],
    [A('丽江古城', '世界文化遗产，纳西风情', 21, 5), A('玉龙雪山', '海拔5596米的圣山', 22, 5), A('束河古镇', '比大研更安静的古镇', 23), A('蓝月谷', '如蓝宝石般的湖水', 24)],
    [F('纳西烤鱼', '丽江特色美食', 21, true), F('鸡豆凉粉', '纳西族传统小吃', 22), F('丽江粑粑', '酥脆可口的纳西点心', 23), F('腊排骨火锅', '丽江冬日暖身佳品', 24)],
    ['高原紫外线强，注意防晒', '古城维护费已取消', '雪山索道需提前预约']
  ),

  f('xiamen', '厦门', 'Xiamen', '中国', 'domestic', ['beach', 'romantic', 'city'],
    '海上花园，文艺之城。鼓浪屿的琴声、环岛路的海风，让人心旷神怡。',
    24.48, 118.09, '528万', '亚热带海洋性气候', '3-5月, 10-12月', ['适中', 300, 600],
    [A('鼓浪屿', '万国建筑博览，世界文化遗产', 25, 5), A('南普陀寺', '闽南佛教圣地', 26), A('环岛路', '最美的海岸骑行道', 27), A('曾厝垵', '文艺小渔村', 28)],
    [F('沙茶面', '厦门人的早餐之选', 25, true), F('海蛎煎', '闽南经典小吃', 26, true), F('土笋冻', '勇者的美食挑战', 27), F('花生汤', '甜蜜的闽南甜品', 28)],
    ['鼓浪屿船票需提前购买', '环岛路骑行约2小时', '曾厝垵适合傍晚逛']
  ),

  f('sanya', '三亚', 'Sanya', '中国', 'domestic', ['beach', 'romantic'],
    '东方夏威夷，热带海滨度假天堂。阳光、沙滩、椰林，是中国最南端的浪漫。',
    18.25, 109.50, '103万', '热带季风气候', '10月-次年3月', ['较高', 500, 1200],
    [A('亚龙湾', '天下第一湾，碧海银沙', 29, 5), A('蜈支洲岛', '中国的马尔代夫', 30, 5), A('天涯海角', '浪漫的爱情圣地', 31), A('南山寺', '108米海上观音', 32)],
    [F('海鲜大餐', '现捞现做的极致鲜味', 29, true), F('椰子鸡', '椰汁炖鸡，清甜滋补', 30, true), F('清补凉', '消暑解渴的甜品', 31), F('文昌鸡', '海南四大名菜之首', 32)],
    ['海鲜建议去第一市场买加工', '防晒是重中之重', '淡季11-12月性价比最高']
  ),

  f('chongqing', '重庆', 'Chongqing', '中国', 'domestic', ['city', 'foodie'],
    '8D魔幻城市，火锅之都。轻轨穿楼、洪崖洞夜景，是一座立体的赛博朋克之城。',
    29.56, 106.55, '3212万', '亚热带季风气候', '3-5月, 10-11月', ['经济', 250, 500],
    [A('洪崖洞', '现实版千与千寻', 33, 5), A('磁器口古镇', '千年古镇，重庆缩影', 34), A('长江索道', '飞渡长江的空中体验', 35), A('解放碑', '重庆地标与美食聚集地', 36)],
    [F('重庆火锅', '九宫格里的麻辣人生', 33, true), F('重庆小面', '一碗面里的江湖', 34, true), F('酸辣粉', '酸辣开胃的经典', 35), F('烤鱼', '万州烤鱼，麻辣鲜香', 36)],
    ['导航在重庆不太好用，多问路', '洪崖洞最佳观景点在千厮门大桥', '穿舒适的鞋，爬坡是日常']
  ),

  f('dali', '大理', 'Dali', '中国', 'domestic', ['nature', 'romantic'],
    '风花雪月之地，苍山洱海之间。白族古城、扎染工艺，是诗与远方。',
    25.59, 100.23, '333万', '低纬度高原气候', '3-5月', ['经济', 200, 500],
    [A('洱海', '风花雪月中的"月"', 37, 5), A('大理古城', '白族风情，文艺气息', 38), A('苍山', '十九峰十八溪', 39), A('双廊', '洱海边的世外桃源', 40)],
    [F('乳扇', '白族特色乳制品', 37, true), F('饵丝', '大理人的早餐', 38), F('白族三道茶', '一苦二甜三回味', 39), F('喜洲粑粑', '酥脆的大理味道', 40)],
    ['环洱海骑行约120公里，建议电动车', '大理紫外线极强，注意防晒', '古城里比古城外消费高']
  ),

  f('guilin', '桂林', 'Guilin', '中国', 'domestic', ['nature', 'romantic'],
    '桂林山水甲天下，漓江两岸如诗如画。喀斯特地貌造就了世间独一无二的山水。',
    25.27, 110.29, '540万', '亚热带季风气候', '4-10月', ['经济', 200, 450],
    [A('漓江', '百里画廊，山水如墨', 41, 5), A('阳朔西街', '中西文化交融的街道', 42), A('龙脊梯田', '壮美的梯田奇观', 43, 5), A('象鼻山', '桂林城市标志', 44)],
    [F('桂林米粉', '卤水是灵魂', 41, true), F('啤酒鱼', '阳朔必吃', 42, true), F('荔浦芋扣肉', '桂林宴席名菜', 43), F('油茶', '恭城瑶族传统饮品', 44)],
    ['漓江游船建议选精华段', '阳朔住一晚，体验西街夜生活', '龙脊梯田建议9-10月去']
  ),

  f('lasa', '拉萨', 'Lhasa', '中国', 'domestic', ['nature', 'historical', 'adventure'],
    '日光之城，信仰的圣地。布达拉宫巍峨矗立，转经筒永不停息。',
    29.65, 91.10, '87万', '高原温带半干旱气候', '6-9月', ['适中', 400, 800],
    [A('布达拉宫', '世界屋脊上的宫殿', 45, 5), A('大昭寺', '藏传佛教圣地', 46, 5), A('八廓街', '拉萨最热闹的转经道', 47), A('纳木错', '天湖，海拔最高的咸水湖', 48)],
    [F('酥油茶', '藏族人民的日常饮品', 45, true), F('糌粑', '藏族主食', 46), F('藏面', '简单而温暖', 47), F('牦牛肉', '高原的馈赠', 48)],
    ['注意高原反应，第一天不要剧烈运动', '布达拉宫需提前一天预约', '尊重当地宗教习俗']
  ),

  // ==================== 8 INTERNATIONAL CORE CITIES ====================
  f('tokyo', '东京', 'Tokyo', '日本', 'international', ['city', 'foodie', 'romantic'],
    '传统与未来的交汇点，从浅草寺到秋叶原，东京永远让人惊叹。',
    35.68, 139.69, '1396万', '温带季风气候', '3-5月, 10-11月', ['较高', 800, 1500],
    [A('浅草寺', '东京最古老的寺庙', 49), A('东京塔', '城市的浪漫地标', 50), A('涩谷十字路口', '世界最繁忙的十字路口', 51), A('新宿御苑', '都市中的宁静花园', 52)],
    [F('寿司', '新鲜食材的极致呈现', 49, true), F('拉面', '浓郁的日式灵魂料理', 50, true), F('天妇罗', '轻盈酥脆的炸物艺术', 51), F('抹茶甜点', '苦与甜的完美平衡', 52)],
    ['购买Suica卡方便出行', '樱花季3-4月最美但最拥挤', '便利店美食不容小觑']
  ),

  f('paris', '巴黎', 'Paris', '法国', 'international', ['romantic', 'city', 'historical'],
    '浪漫之都，艺术殿堂。埃菲尔铁塔、卢浮宫、塞纳河，处处是诗意。',
    48.86, 2.35, '215万', '温带海洋性气候', '4-6月, 9-10月', ['较高', 1000, 2000],
    [A('埃菲尔铁塔', '巴黎永恒的象征', 53, 5), A('卢浮宫', '世界最大的艺术博物馆', 54, 5), A('凯旋门', '法兰西的荣耀', 55), A('蒙马特高地', '艺术家的天堂', 56)],
    [F('可颂', '酥脆与柔软的完美结合', 53, true), F('法式蜗牛', '经典法餐前菜', 54), F('马卡龙', '色彩缤纷的甜蜜', 55, true), F('红酒炖牛肉', '法式家常经典', 56)],
    ['博物馆通票性价比很高', '地铁注意防盗', '午晚餐时间比中国晚2-3小时']
  ),

  f('bangkok', '曼谷', 'Bangkok', '泰国', 'international', ['city', 'foodie', 'beach'],
    '天使之城，寺庙与夜市并存。泰式微笑、街头美食，是性价比最高的旅行目的地之一。',
    13.76, 100.50, '1057万', '热带季风气候', '11月-次年2月', ['经济', 300, 700],
    [A('大皇宫', '金碧辉煌的泰国地标', 57, 5), A('卧佛寺', '泰国最大的卧佛像', 58), A('考山路', '背包客的天堂', 59), A('暹罗广场', '购物圣地', 60)],
    [F('冬阴功汤', '酸辣鲜香的泰国国汤', 57, true), F('芒果糯米饭', '甜蜜的热岛风情', 58, true), F('泰式炒河粉', '街头美食之王', 59), F('青木瓜沙拉', '清爽开胃', 60)],
    ['尊重王室和佛教', '出租车务必要求打表', '周末市场是淘货好去处']
  ),

  f('seoul', '首尔', 'Seoul', '韩国', 'international', ['city', 'foodie', 'romantic'],
    '韩流发源地，传统与潮流的融合。从景福宫到江南区，首尔精彩不断。',
    37.57, 126.98, '977万', '温带季风气候', '3-5月, 9-11月', ['适中', 500, 1000],
    [A('景福宫', '韩国最大的宫殿', 61, 5), A('明洞', '购物与美食天堂', 62), A('北村韩屋村', '传统韩屋聚落', 63), A('南山塔', '锁住爱情的浪漫地标', 64)],
    [F('韩式烤肉', '滋滋作响的美味', 61, true), F('泡菜', '韩国人的灵魂', 62, true), F('石锅拌饭', '滋滋作响的拌饭', 63), F('炸鸡啤酒', '韩式夜宵标配', 64)],
    ['T-money卡方便出行', '换韩元在明洞汇率最好', '很多店有中文服务']
  ),

  f('singapore', '新加坡', 'Singapore', '新加坡', 'international', ['city', 'foodie'],
    '花园城市，多元文化交融。鱼尾狮、滨海湾、小贩中心，小国大精彩。',
    1.35, 103.82, '564万', '热带雨林气候', '全年皆宜', ['较高', 600, 1200],
    [A('滨海湾金沙', '标志性的三塔建筑', 65, 5), A('鱼尾狮公园', '新加坡象征', 66), A('圣淘沙', '度假娱乐岛', 67), A('牛车水', '唐人街风情', 68)],
    [F('海南鸡饭', '新加坡国菜', 65, true), F('辣椒螃蟹', '鲜辣过瘾', 66, true), F('肉骨茶', '药材熬制的暖汤', 67), F('叻沙', '椰浆咖喱面', 68)],
    ['地铁和公交非常发达', '小贩中心是最地道的美食去处', ' chewing gum is banned']
  ),

  f('sydney', '悉尼', 'Sydney', '澳大利亚', 'international', ['beach', 'city', 'romantic'],
    '南半球的明珠，歌剧院与海港大桥构成最经典的明信片。',
    -33.87, 151.21, '531万', '温带海洋性气候', '10月-次年4月', ['较高', 800, 1500],
    [A('悉尼歌剧院', '世界建筑奇迹', 69, 5), A('海港大桥', '攀登大桥俯瞰全城', 70), A('邦迪海滩', '澳洲最著名的海滩', 71), A('蓝山', '壮美的峡谷风光', 72)],
    [F('澳洲牛排', '顶级牛肉的简单美味', 69, true), F('鱼薯', '澳洲国民快餐', 70), F('肉馅饼', '当地人的心头好', 71), F('Flat White', '澳洲咖啡文化代表', 72)],
    ['Opal卡是交通必备', '防晒是第一要务', '周末有丰富的市集']
  ),

  f('newyork', '纽约', 'New York', '美国', 'international', ['city', 'romantic'],
    '永不眠的城市，自由与梦想的代名词。百老汇、中央公园、时代广场，一切皆有可能。',
    40.71, -74.01, '841万', '温带大陆性气候', '4-6月, 9-11月', ['较高', 1200, 2500],
    [A('自由女神像', '自由的象征', 73, 5), A('中央公园', '都市中的绿洲', 74, 5), A('时代广场', '世界的十字路口', 75), A('大都会博物馆', '世界级艺术殿堂', 76)],
    [F('纽约披萨', '一片折叠起来吃的经典', 73, true), F('百吉饼', '纽约早餐标配', 74), F('芝士蛋糕', '浓郁丝滑', 75, true), F('热狗', '街头经典', 76)],
    ['MetroCard方便乘坐地铁', '博物馆建议捐赠式门票', '百老汇可以买当日折扣票']
  ),

  f('london', '伦敦', 'London', '英国', 'international', ['city', 'historical', 'romantic'],
    '雾都传奇，日不落帝国的心脏。大本钟、白金汉宫、泰晤士河，历史与现代并存。',
    51.51, -0.13, '898万', '温带海洋性气候', '5-9月', ['较高', 1000, 2000],
    [A('大本钟', '伦敦永恒的标志', 77, 5), A('大英博物馆', '世界文明的宝库', 78, 5), A('伦敦塔桥', '泰晤士河上的明珠', 79), A('白金汉宫', '英国王室的象征', 80)],
    [F('炸鱼薯条', '英国国菜', 77, true), F('英式下午茶', '优雅的英伦传统', 78, true), F('全英早餐', '能量满满的一天开始', 79), F('牧羊人派', '温暖的英式家常', 80)],
    ['Oyster卡是出行必备', '大英博物馆免费参观', '注意靠左行驶']
  ),

  // ==================== 80+ CITIES WITH BASIC DATA ====================
  // Domestic cities
  m('guangzhou', '广州', 'Guangzhou', '中国', 'domestic', ['city', 'foodie'], '花城广州，粤食之乡，千年商都焕发新活力。', 23.13, 113.26),
  m('shenzhen', '深圳', 'Shenzhen', '中国', 'domestic', ['city'], '中国最年轻的超大城市，创新之都。', 22.54, 114.06),
  m('nanjing', '南京', 'Nanjing', '中国', 'domestic', ['historical', 'city'], '六朝古都，秦淮河畔金陵梦。', 32.06, 118.80),
  m('suzhou', '苏州', 'Suzhou', '中国', 'domestic', ['historical', 'nature', 'romantic'], '上有天堂下有苏杭，园林之城。', 31.30, 120.62),
  m('wuhan', '武汉', 'Wuhan', '中国', 'domestic', ['city', 'foodie'], '江城武汉，九省通衢，热干面飘香。', 30.59, 114.31),
  m('changsha', '长沙', 'Changsha', '中国', 'domestic', ['city', 'foodie'], '星城长沙，火辣湘菜，快乐大本营。', 28.23, 112.94),
  m('qingdao', '青岛', 'Qingdao', '中国', 'domestic', ['beach', 'city'], '红瓦绿树碧海蓝天，啤酒飘香的海滨城市。', 36.07, 120.38),
  m('kunming', '昆明', 'Kunming', '中国', 'domestic', ['nature', 'city'], '春城昆明，四季如春，鲜花常开。', 25.04, 102.68),
  m('harbin', '哈尔滨', 'Harbin', '中国', 'domestic', ['city', 'adventure'], '冰城哈尔滨，冰雪大世界令人惊叹。', 45.75, 126.65),
  m('dalian', '大连', 'Dalian', '中国', 'domestic', ['beach', 'city'], '北方明珠，浪漫海滨城市。', 38.91, 121.60),
  m('zhuhai', '珠海', 'Zhuhai', '中国', 'domestic', ['beach', 'romantic'], '百岛之市，浪漫之城。', 22.27, 113.58),
  m('huangshan', '黄山', 'Huangshan', '中国', 'domestic', ['mountain', 'nature'], '五岳归来不看山，黄山归来不看岳。', 30.13, 118.17),
  m('zhangjiajie', '张家界', 'Zhangjiajie', '中国', 'domestic', ['mountain', 'nature'], '奇峰三千，秀水八百，阿凡达取景地。', 29.12, 110.48),
  m('jiuzhaigou', '九寨沟', 'Jiuzhaigou', '中国', 'domestic', ['nature', 'forest'], '九寨归来不看水，人间仙境。', 33.26, 103.92),
  m('dunhuang', '敦煌', 'Dunhuang', '中国', 'domestic', ['historical', 'nature', 'adventure', 'desert'], '丝绸之路明珠，莫高窟千年艺术。', 40.14, 94.66),
  m('chengde', '承德', 'Chengde', '中国', 'domestic', ['historical'], '避暑胜地，皇家园林。', 40.95, 117.93),
  m('luoyang', '洛阳', 'Luoyang', '中国', 'domestic', ['historical'], '千年帝都，牡丹花城。', 34.62, 112.45),
  m('kaifeng', '开封', 'Kaifeng', '中国', 'domestic', ['historical', 'foodie'], '八朝古都，夜市烟火。', 34.80, 114.35),
  m('quanzhou', '泉州', 'Quanzhou', '中国', 'domestic', ['historical', 'beach'], '海上丝绸之路起点，世界文化遗产。', 24.87, 118.68),
  m('tianjin', '天津', 'Tianjin', '中国', 'domestic', ['city', 'foodie'], '津门故里，相声之乡，狗不理包子。', 39.08, 117.20),
  m('shenyang', '沈阳', 'Shenyang', '中国', 'domestic', ['city', 'historical'], '盛京旧事，东北中心城市。', 41.80, 123.43),
  m('changchun', '长春', 'Changchun', '中国', 'domestic', ['city'], '北国春城，汽车之城。', 43.88, 125.32),
  m('fuzhou', '福州', 'Fuzhou', '中国', 'domestic', ['city', 'historical'], '榕城福州，闽都文化。', 26.07, 119.30),
  m('nanchang', '南昌', 'Nanchang', '中国', 'domestic', ['city', 'historical'], '英雄城南昌，滕王阁序。', 28.68, 115.86),
  m('jinan', '济南', 'Jinan', '中国', 'domestic', ['city', 'nature'], '泉城济南，四面荷花三面柳。', 36.65, 116.99),
  m('zhengzhou', '郑州', 'Zhengzhou', '中国', 'domestic', ['city', 'historical'], '中原腹地，黄帝故里。', 34.75, 113.65),
  m('shijiazhuang', '石家庄', 'Shijiazhuang', '中国', 'domestic', ['city'], '燕赵大地，正定古城。', 38.04, 114.51),
  m('taiyuan', '太原', 'Taiyuan', '中国', 'domestic', ['city', 'historical'], '龙城太原，晋商故里。', 37.87, 112.55),
  m('hefei', '合肥', 'Hefei', '中国', 'domestic', ['city'], '科教之城，创新高地。', 31.82, 117.23),
  m('nanning', '南宁', 'Nanning', '中国', 'domestic', ['city', 'nature'], '绿城南宁，东盟之窗。', 22.82, 108.37),
  m('haikou', '海口', 'Haikou', '中国', 'domestic', ['beach', 'city'], '椰城海口，热带滨海省会。', 20.04, 110.35),
  m('guiyang', '贵阳', 'Guiyang', '中国', 'domestic', ['city', 'nature'], '林城贵阳，避暑之都。', 26.65, 106.63),
  m('urumqi', '乌鲁木齐', 'Urumqi', '中国', 'domestic', ['city', 'adventure'], '亚心之都，丝路新貌。', 43.83, 87.62),
  m('lanzhou', '兰州', 'Lanzhou', '中国', 'domestic', ['city', 'foodie'], '黄河之城，一碗牛肉面。', 36.06, 103.83),
  m('xining', '西宁', 'Xining', '中国', 'domestic', ['city', 'nature'], '夏都西宁，青藏门户。', 36.62, 101.78),
  m('yinchuan', '银川', 'Yinchuan', '中国', 'domestic', ['city', 'nature'], '塞上江南，西夏故都。', 38.49, 106.23),
  m('hohhot', '呼和浩特', 'Hohhot', '中国', 'domestic', ['city', 'nature', 'grassland'], '青城呼和浩特，草原明珠。', 40.84, 111.75),
  m('weihai', '威海', 'Weihai', '中国', 'domestic', ['beach', 'city'], '最适合人类居住的城市之一。', 37.51, 122.12),
  m('yantai', '烟台', 'Yantai', '中国', 'domestic', ['beach', 'city'], '仙境海岸，苹果之乡。', 37.46, 121.45),
  m('wuxi', '无锡', 'Wuxi', '中国', 'domestic', ['city', 'nature'], '太湖明珠，江南鱼米乡。', 31.49, 120.31),
  m('ningbo', '宁波', 'Ningbo', '中国', 'domestic', ['city', 'beach'], '书藏古今，港通天下。', 29.87, 121.55),
  m('wenzhou', '温州', 'Wenzhou', '中国', 'domestic', ['city', 'nature'], '雁荡山下，商行天下。', 28.00, 120.67),
  m('shaoxing', '绍兴', 'Shaoxing', '中国', 'domestic', ['historical', 'romantic'], '鲁迅故里，黄酒之乡。', 30.00, 120.58),
  m('jiaxing', '嘉兴', 'Jiaxing', '中国', 'domestic', ['historical', 'romantic'], '红船起航地，南湖烟雨中。', 30.75, 120.76),
  m('changzhou', '常州', 'Changzhou', '中国', 'domestic', ['city'], '龙城常州，智造名城。', 31.81, 119.97),
  m('yangzhou', '扬州', 'Yangzhou', '中国', 'domestic', ['historical', 'foodie', 'romantic'], '烟花三月下扬州，淮扬菜之乡。', 32.39, 119.41),
  m('zhenjiang', '镇江', 'Zhenjiang', '中国', 'domestic', ['historical'], '金山寺下，白蛇传说。', 32.19, 119.45),
  m('xuzhou', '徐州', 'Xuzhou', '中国', 'domestic', ['historical', 'city'], '汉文化发源地，楚汉争霸之地。', 34.26, 117.18),
  m('nantong', '南通', 'Nantong', '中国', 'domestic', ['city', 'beach'], '江海交汇，近代第一城。', 31.98, 120.86),
  m('lianyungang', '连云港', 'Lianyungang', '中国', 'domestic', ['beach', 'mountain'], '花果山下，大圣故里。', 34.60, 119.22),
  m('yancheng', '盐城', 'Yancheng', '中国', 'domestic', ['nature', 'beach'], '丹顶鹤故乡，东方湿地之都。', 33.35, 120.16),
  m('taizhou-js', '泰州', 'Taizhou', '中国', 'domestic', ['city', 'foodie'], '水城慢生活，早茶之都。', 32.46, 119.92),
  m('zhoushan', '舟山', 'Zhoushan', '中国', 'domestic', ['beach', 'nature'], '千岛之城，海天佛国。', 30.01, 122.11),
  m('huzhou', '湖州', 'Huzhou', '中国', 'domestic', ['nature', 'romantic'], '行遍江南清丽地，人生只合住湖州。', 30.89, 120.09),
  m('quzhou', '衢州', 'Quzhou', '中国', 'domestic', ['nature', 'foodie'], '南孔圣地，三头一掌。', 28.97, 118.87),
  m('lishui', '丽水', 'Lishui', '中国', 'domestic', ['nature', 'romantic'], '秀山丽水，养生福地。', 28.45, 119.92),
  m('jingdezhen', '景德镇', 'Jingdezhen', '中国', 'domestic', ['historical'], '瓷都千年，匠心传承。', 29.29, 117.18),
  m('gulangyu', '鼓浪屿', 'Gulangyu', '中国', 'domestic', ['romantic', 'historical'], '琴岛漫步，万国建筑。', 24.45, 118.07),
  m('wuyishan', '武夷山', 'Wuyishan', '中国', 'domestic', ['mountain', 'nature'], '丹霞碧水，岩茶飘香。', 27.76, 118.03),
  m('longsheng', '龙胜', 'Longsheng', '中国', 'domestic', ['nature', 'adventure', 'forest'], '龙脊梯田，壮族风情。', 25.80, 110.01),
  m('fenghuang', '凤凰', 'Fenghuang', '中国', 'domestic', ['historical', 'romantic'], '边城凤凰，沈从文笔下的世界。', 27.95, 109.60),
  m('yangshuo', '阳朔', 'Yangshuo', '中国', 'domestic', ['nature', 'romantic'], '桂林山水甲天下，阳朔山水甲桂林。', 24.78, 110.49),
  m('huangguoshu', '黄果树', 'Huangguoshu', '中国', 'domestic', ['nature'], '亚洲第一大瀑布，壮观震撼。', 25.99, 105.67),
  m('xishuangbanna', '西双版纳', 'Xishuangbanna', '中国', 'domestic', ['nature', 'romantic', 'forest'], '热带雨林，傣族风情。', 22.01, 100.80),
  m('shangri-la', '香格里拉', "Shangri-La", '中国', 'domestic', ['nature', 'romantic', 'adventure'], '消失的地平线，人间天堂。', 27.83, 99.71),
  m('yading', '稻城亚丁', 'Daocheng Yading', '中国', 'domestic', ['nature', 'adventure'], '最后的香格里拉，蓝色星球净土。', 28.48, 100.30),
  m('emo', '峨眉山', 'Emeishan', '中国', 'domestic', ['mountain', 'nature'], '峨眉天下秀，佛光普照。', 29.60, 103.33),
  m('lezhi', '乐山', 'Leshan', '中国', 'domestic', ['historical', 'nature'], '乐山大佛，山佛合一。', 29.55, 103.77),
  m('zigong', '自贡', 'Zigong', '中国', 'domestic', ['historical', 'foodie'], '恐龙之乡，灯城自贡。', 29.34, 104.78),
  m('naxi', '纳溪', 'Naxi', '中国', 'domestic', ['nature'], '云溪竹海，清幽避世。', 28.77, 105.37),
  m('aba', '阿坝', 'Aba', '中国', 'domestic', ['nature', 'adventure', 'forest'], '川西高原，花海秘境。', 31.90, 102.22),
  m('ganzi', '甘孜', 'Garze', '中国', 'domestic', ['nature', 'adventure', 'forest'], '川西秘境，贡嘎雪山。', 31.62, 99.98),
  m('linzhi', '林芝', 'Nyingchi', '中国', 'domestic', ['nature', 'romantic'], '西藏江南，桃花盛开。', 29.65, 94.36),
  m('riga', '日喀则', 'Xigaze', '中国', 'domestic', ['nature', 'historical'], '珠峰脚下，扎什伦布寺。', 29.25, 88.88),
  m('ali', '阿里', 'Ngari', '中国', 'domestic', ['nature', 'adventure'], '世界屋脊的屋脊，神山圣湖。', 32.50, 80.11),
  m('kashgar', '喀什', 'Kashgar', '中国', 'domestic', ['historical', 'adventure', 'desert'], '丝路重镇，西域风情。', 39.47, 75.99),
  m('turpan', '吐鲁番', 'Turpan', '中国', 'domestic', ['historical', 'nature', 'desert'], '火洲吐鲁番，葡萄沟甜。', 42.95, 89.18),
  m('karamay', '克拉玛依', 'Karamay', '中国', 'domestic', ['nature', 'adventure', 'desert'], '魔鬼城奇观，石油之城。', 45.59, 84.89),
  m('altay', '阿勒泰', 'Altay', '中国', 'domestic', ['nature', 'adventure', 'mountain', 'grassland'], '北疆净土，可可托海。', 47.85, 88.14),
  m('kanas', '喀纳斯', 'Kanas', '中国', 'domestic', ['nature', 'adventure', 'forest'], '神仙居住的地方，秋色绝美。', 48.69, 87.02),
  m('hulunbuir', '呼伦贝尔', 'Hulunbuir', '中国', 'domestic', ['nature', 'adventure', 'grassland'], '最美草原，天苍苍野茫茫。', 49.21, 119.77),
  m('ergun', '额尔古纳', 'Ergun', '中国', 'domestic', ['nature', 'romantic', 'grassland'], '湿地白桦，边境小城。', 50.25, 120.18),
  m('manzhouli', '满洲里', 'Manzhouli', '中国', 'domestic', ['city', 'adventure', 'grassland'], '中俄边境，套娃广场。', 49.60, 117.38),

  // International cities
  m('kyoto', '京都', 'Kyoto', '日本', 'international', ['historical', 'romantic'], '千年古都，和风雅韵。', 35.01, 135.77),
  m('osaka', '大阪', 'Osaka', '日本', 'international', ['city', 'foodie'], '天下厨房，搞笑之都。', 34.69, 135.50),
  m('hokkaido', '北海道', 'Hokkaido', '日本', 'international', ['nature', 'romantic', 'adventure'], '雪国仙境，薰衣草花海。', 43.06, 141.35),
  m('okinawa', '冲绳', 'Okinawa', '日本', 'international', ['beach', 'romantic'], '日本夏威夷，碧海蓝天。', 26.33, 127.80),
  m('jeju', '济州岛', 'Jeju', '韩国', 'international', ['beach', 'nature', 'romantic'], '韩国蜜月岛，火山奇观。', 33.50, 126.53),
  m('busan', '釜山', 'Busan', '韩国', 'international', ['beach', 'city', 'foodie'], '韩国第二城，海鲜天堂。', 35.18, 128.99),
  m('bali', '巴厘岛', 'Bali', '印尼', 'international', ['beach', 'romantic', 'nature'], '众神之岛，浪漫天堂。', -8.34, 115.09),
  m('phuket', '普吉岛', 'Phuket', '泰国', 'international', ['beach', 'romantic'], '安达曼海上的明珠。', 7.88, 98.39),
  m('chiangmai', '清迈', 'Chiang Mai', '泰国', 'international', ['nature', 'historical', 'romantic'], '北方玫瑰，小城故事多。', 18.79, 98.98),
  m('kualalumpur', '吉隆坡', 'Kuala Lumpur', '马来西亚', 'international', ['city', 'foodie'], '双子塔下，多元美食。', 3.14, 101.69),
  m('penang', '槟城', 'Penang', '马来西亚', 'international', ['foodie', 'historical'], '美食天堂，街头艺术。', 5.42, 100.33),
  m('hanoi', '河内', 'Hanoi', '越南', 'international', ['historical', 'foodie', 'city'], '千年文献之地，越式咖啡香。', 21.03, 105.85),
  m('saigon', '胡志明市', 'Ho Chi Minh City', '越南', 'international', ['city', 'foodie'], '东方巴黎，摩托车之城。', 10.82, 106.63),
  m('danang', '岘港', 'Da Nang', '越南', 'international', ['beach', 'city'], '东方夏威夷，海滨度假。', 16.05, 108.20),
  m('siemreap', '暹粒', 'Siem Reap', '柬埔寨', 'international', ['historical'], '吴哥窟所在地，千年微笑。', 13.37, 103.85),
  m('luangprabang', '琅勃拉邦', 'Luang Prabang', '老挝', 'international', ['historical', 'nature', 'romantic'], '世遗古城，湄公河畔慢生活。', 19.89, 102.14),
  m('yangon', '仰光', 'Yangon', '缅甸', 'international', ['historical', 'city'], '金塔之城，佛国风情。', 16.87, 96.20),
  m('singapore2', '圣淘沙', 'Sentosa', '新加坡', 'international', ['beach', 'romantic'], '度假岛屿，环球影城。', 1.25, 103.83),
  m('manila', '马尼拉', 'Manila', '菲律宾', 'international', ['city', 'beach'], '东方明珠，千岛之都。', 14.60, 120.98),
  m('boracay', '长滩岛', 'Boracay', '菲律宾', 'international', ['beach', 'romantic'], '世界最美白沙滩。', 11.97, 121.92),
  m('palawan', '巴拉望', 'Palawan', '菲律宾', 'international', ['beach', 'nature', 'adventure'], '最后的天堂，地下河奇观。', 9.84, 118.73),
  m('maldives', '马尔代夫', 'Maldives', '马尔代夫', 'international', ['beach', 'romantic'], '一岛一酒店，水上天堂。', 3.20, 73.22),
  m('srilanka', '斯里兰卡', 'Sri Lanka', '斯里兰卡', 'international', ['nature', 'historical', 'beach'], '印度洋上的眼泪，锡兰红茶。', 7.87, 80.77),
  m('nepal', '加德满都', 'Kathmandu', '尼泊尔', 'international', ['mountain', 'historical', 'adventure'], '众神之城，珠峰门户。', 27.72, 85.32),
  m('dubai', '迪拜', 'Dubai', '阿联酋', 'international', ['city', 'adventure', 'desert'], '沙漠奇迹，奢华之都。', 25.20, 55.27),
  m('istanbul', '伊斯坦布尔', 'Istanbul', '土耳其', 'international', ['historical', 'city', 'romantic'], '东西方交汇，蓝色清真寺。', 41.01, 28.98),
  m('cappadocia', '卡帕多奇亚', 'Cappadocia', '土耳其', 'international', ['nature', 'romantic', 'adventure'], '热气球之旅，仙境奇岩。', 38.64, 34.83),
  m('cairo', '开罗', 'Cairo', '埃及', 'international', ['historical', 'adventure', 'desert'], '金字塔与狮身人面像，千年文明。', 30.04, 31.24),
  m('marrakech', '马拉喀什', 'Marrakech', '摩洛哥', 'international', ['historical', 'romantic'], '红色城市，一千零一夜。', 31.63, -7.98),
  m('capetown', '开普敦', 'Cape Town', '南非', 'international', ['nature', 'beach', 'adventure'], '彩虹国度，好望角。', -33.92, 18.42),
  m('nairobi', '内罗毕', 'Nairobi', '肯尼亚', 'international', ['nature', 'adventure'], '野生动物大迁徙，草原奇观。', -1.29, 36.82),
  m('mauritius', '毛里求斯', 'Mauritius', '毛里求斯', 'international', ['beach', 'romantic'], '印度洋明珠，天堂原乡。', -20.35, 57.55),
  m('seychelles', '塞舌尔', 'Seychelles', '塞舌尔', 'international', ['beach', 'romantic', 'nature'], '人类最后的伊甸园。', -4.68, 55.49),

  // Europe
  m('rome', '罗马', 'Rome', '意大利', 'international', ['historical', 'city', 'romantic'], '永恒之城，斗兽场与许愿池。', 41.90, 12.50),
  m('venice', '威尼斯', 'Venice', '意大利', 'international', ['romantic', 'historical'], '水上之城，贡多拉之歌。', 45.44, 12.32),
  m('florence', '佛罗伦萨', 'Florence', '意大利', 'international', ['historical', 'romantic'], '文艺复兴发源地，艺术圣殿。', 43.77, 11.26),
  m('milan', '米兰', 'Milan', '意大利', 'international', ['city', 'romantic'], '时尚之都，米兰大教堂。', 45.46, 9.19),
  m('barcelona', '巴塞罗那', 'Barcelona', '西班牙', 'international', ['city', 'beach', 'romantic'], '高迪之城，地中海风情。', 41.39, 2.17),
  m('madrid', '马德里', 'Madrid', '西班牙', 'international', ['city', 'historical'], '西班牙心脏，普拉多美术馆。', 40.42, -3.70),
  m('lisbon', '里斯本', 'Lisbon', '葡萄牙', 'international', ['city', 'historical', 'romantic'], '大航海时代起点，七丘之城。', 38.72, -9.14),
  m('amsterdam', '阿姆斯特丹', 'Amsterdam', '荷兰', 'international', ['city', 'romantic'], '运河之城，自由之都。', 52.37, 4.90),
  m('brussels', '布鲁塞尔', 'Brussels', '比利时', 'international', ['city', 'foodie'], '欧盟首都，巧克力与华夫饼。', 50.85, 4.35),
  m('vienna', '维也纳', 'Vienna', '奥地利', 'international', ['city', 'historical', 'romantic'], '音乐之都，华尔兹故乡。', 48.21, 16.37),
  m('prague', '布拉格', 'Prague', '捷克', 'international', ['historical', 'romantic'], '百塔之城，波西米亚风情。', 50.08, 14.44),
  m('budapest', '布达佩斯', 'Budapest', '匈牙利', 'international', ['historical', 'romantic'], '多瑙河明珠，温泉之都。', 47.50, 19.04),
  m('munich', '慕尼黑', 'Munich', '德国', 'international', ['city', 'historical'], '啤酒之都，巴伐利亚风情。', 48.14, 11.58),
  m('berlin', '柏林', 'Berlin', '德国', 'international', ['city', 'historical'], '历史与现代的碰撞，创意之城。', 52.52, 13.41),
  m('zurich', '苏黎世', 'Zurich', '瑞士', 'international', ['city', 'nature'], '金融之都，湖光山色。', 47.38, 8.54),
  m('interlaken', '因特拉肯', 'Interlaken', '瑞士', 'international', ['mountain', 'nature', 'adventure'], '少女峰下，户外天堂。', 46.69, 7.87),
  m('lucerne', '卢塞恩', 'Lucerne', '瑞士', 'international', ['nature', 'romantic'], '瑞士最美城市，湖光山色。', 47.05, 8.31),
  m('athens', '雅典', 'Athens', '希腊', 'international', ['historical', 'beach'], '西方文明摇篮，帕特农神庙。', 37.98, 23.73),
  m('santorini', '圣托里尼', 'Santorini', '希腊', 'international', ['beach', 'romantic'], '蓝白世界，爱琴海明珠。', 36.39, 25.46),
  m('reykjavik', '雷克雅未克', 'Reykjavik', '冰岛', 'international', ['nature', 'adventure'], '极光与冰火，世界尽头。', 64.15, -21.94),
  m('edinburgh', '爱丁堡', 'Edinburgh', '英国', 'international', ['historical', 'romantic'], '苏格兰高地之门，城堡之城。', 55.95, -3.19),
  m('moscow', '莫斯科', 'Moscow', '俄罗斯', 'international', ['city', 'historical'], '红场克里姆林宫，伏特加之城。', 55.76, 37.62),
  m('stpetersburg', '圣彼得堡', 'Saint Petersburg', '俄罗斯', 'international', ['historical', 'romantic'], '北方威尼斯，冬宫博物馆。', 59.93, 30.32),
  m('copenhagen', '哥本哈根', 'Copenhagen', '丹麦', 'international', ['city', 'romantic'], '童话之城，设计之都。', 55.68, 12.57),
  m('stockholm', '斯德哥尔摩', 'Stockholm', '瑞典', 'international', ['city', 'romantic'], '北方威尼斯，诺贝尔故乡。', 59.33, 18.07),
  m('helsinki', '赫尔辛基', 'Helsinki', '芬兰', 'international', ['city', 'nature'], '波罗的海女儿，设计之城。', 60.17, 24.94),

  // Americas
  m('losangeles', '洛杉矶', 'Los Angeles', '美国', 'international', ['city', 'beach'], '天使之城，好莱坞梦工厂。', 34.05, -118.24),
  m('sanfrancisco', '旧金山', 'San Francisco', '美国', 'international', ['city', 'romantic'], '金门大桥，硅谷与创新。', 37.77, -122.42),
  m('hawaii', '夏威夷', 'Hawaii', '美国', 'international', ['beach', 'romantic', 'nature'], '太平洋明珠，冲浪天堂。', 19.90, -155.58),
  m('lasvegas', '拉斯维加斯', 'Las Vegas', '美国', 'international', ['city', 'adventure', 'desert'], '不夜城，沙漠中的奇迹。', 36.17, -115.14),
  m('washington', '华盛顿', 'Washington D.C.', '美国', 'international', ['city', 'historical'], '美国首都，白宫与国会山。', 38.91, -77.04),
  m('miami', '迈阿密', 'Miami', '美国', 'international', ['beach', 'city', 'romantic'], '南海滩，拉丁风情。', 25.76, -80.19),
  m('vancouver', '温哥华', 'Vancouver', '加拿大', 'international', ['city', 'nature', 'beach'], '宜居之城，山海之间。', 49.28, -123.12),
  m('toronto', '多伦多', 'Toronto', '加拿大', 'international', ['city'], '加拿大最大城市，多元文化。', 43.65, -79.38),
  m('mexicocity', '墨西哥城', 'Mexico City', '墨西哥', 'international', ['city', 'historical', 'foodie'], '阿兹特克文明，美食天堂。', 19.43, -99.13),
  m('cancun', '坎昆', 'Cancun', '墨西哥', 'international', ['beach', 'historical'], '加勒比海度假胜地。', 21.16, -86.85),
  m('havana', '哈瓦那', 'Havana', '古巴', 'international', ['historical', 'beach', 'romantic'], '老爷车与雪茄，时光倒流。', 23.11, -82.37),
  m('riodj', '里约热内卢', 'Rio de Janeiro', '巴西', 'international', ['beach', 'city', 'adventure'], '基督像俯瞰，桑巴与狂欢。', -22.91, -43.17),
  m('buenosaires', '布宜诺斯艾利斯', 'Buenos Aires', '阿根廷', 'international', ['city', 'romantic', 'foodie'], '南美巴黎，探戈故乡。', -34.60, -58.38),
  m('cusco', '库斯科', 'Cusco', '秘鲁', 'international', ['historical', 'adventure'], '印加帝国首都，马丘比丘门户。', -13.53, -71.97),
  m('machupicchu', '马丘比丘', 'Machu Picchu', '秘鲁', 'international', ['historical', 'nature', 'adventure'], '天空之城，印加失落文明。', -13.16, -72.55),
  m('lapaz', '拉巴斯', 'La Paz', '玻利维亚', 'international', ['nature', 'adventure'], '天空之镜，乌尤尼盐湖。', -16.49, -68.14),

  // Oceania
  m('melbourne', '墨尔本', 'Melbourne', '澳大利亚', 'international', ['city', 'foodie'], '文化之都，咖啡与涂鸦。', -37.81, 144.96),
  m('goldcoast', '黄金海岸', 'Gold Coast', '澳大利亚', 'international', ['beach', 'adventure'], '冲浪天堂，主题乐园。', -28.00, 153.43),
  m('greatbarrier', '大堡礁', 'Great Barrier Reef', '澳大利亚', 'international', ['nature', 'beach', 'adventure'], '世界最大珊瑚礁群。', -18.29, 147.70),
  m('queenstown', '皇后镇', 'Queenstown', '新西兰', 'international', ['nature', 'adventure', 'romantic'], '冒险之都，中土世界。', -45.03, 168.66),
  m('auckland', '奥克兰', 'Auckland', '新西兰', 'international', ['city', 'nature'], '帆船之都，千帆竞发。', -36.85, 174.76),
  m('fiji', '斐济', 'Fiji', '斐济', 'international', ['beach', 'romantic'], '南太平洋明珠，微笑之国。', -17.71, 177.99),
  m('tahiti', '大溪地', 'Tahiti', '法属波利尼西亚', 'international', ['beach', 'romantic'], '太平洋上的明珠，人间天堂。', -17.65, -149.43),

  // More domestic
  m('macau', '澳门', 'Macau', '中国', 'domestic', ['city', 'foodie', 'historical'], '东方蒙特卡洛，世遗古城。', 22.20, 113.54),
  m('hongkong', '香港', 'Hong Kong', '中国', 'domestic', ['city', 'foodie', 'romantic'], '东方之珠，购物天堂。', 22.32, 114.17),
  m('tainan', '台南', 'Tainan', '中国', 'domestic', ['foodie', 'historical'], '台湾美食之都，古城风华。', 22.99, 120.21),
  m('taipei', '台北', 'Taipei', '中国', 'domestic', ['city', 'foodie'], '夜市文化，文创之城。', 25.03, 121.57),
  m('hualien', '花莲', 'Hualien', '中国', 'domestic', ['nature', 'mountain'], '太鲁阁峡谷，太平洋海岸。', 23.99, 121.60),
  m('kenting', '垦丁', 'Kenting', '中国', 'domestic', ['beach', 'romantic'], '台湾最南端，热带风情。', 21.95, 120.80),

  // More international
  m('delhi', '新德里', 'New Delhi', '印度', 'international', ['historical', 'city', 'foodie'], '古老文明，咖喱飘香。', 28.61, 77.21),
  m('mumbai', '孟买', 'Mumbai', '印度', 'international', ['city', 'foodie'], '宝莱坞之城，印度金融中心。', 19.08, 72.88),
  m('jaipur', '斋浦尔', 'Jaipur', '印度', 'international', ['historical', 'romantic'], '粉红之城，印度宝石。', 26.91, 75.79),
  m('varanasi', '瓦拉纳西', 'Varanasi', '印度', 'international', ['historical', 'adventure'], '恒河圣城，印度教圣地。', 25.32, 83.01),
  m('petra', '佩特拉', 'Petra', '约旦', 'international', ['historical', 'adventure'], '玫瑰之城，世界新七大奇迹。', 30.33, 35.44),
  m('telaviv', '特拉维夫', 'Tel Aviv', '以色列', 'international', ['city', 'beach'], '地中海活力之城，创新之国。', 32.09, 34.77),
  m('tbilisi', '第比利斯', 'Tbilisi', '格鲁吉亚', 'international', ['historical', 'romantic'], '高加索明珠，红酒故乡。', 41.72, 44.78),
]
