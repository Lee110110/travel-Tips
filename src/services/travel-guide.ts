import type { TravelGuide, LuggageItem, WeatherInfo, SceneEquipment, DestinationAlert, DailyForecast, BuddyTeam } from '@/types/city'
import { cities } from '@/data/cities'
import type { City } from '@/types/city'

const WEATHER_DB: Record<string, { summary: string; tempRange: string; suggestion: string }> = {
  '沙漠': { summary: '昼夜温差极大，白天炎热干燥，夜间寒冷', tempRange: '8°C ~ 38°C', suggestion: '准备防晒和保暖双重装备，白天注意防暑，夜晚加衣保暖' },
  '草原': { summary: '紫外线强，风力较大，早晚凉爽', tempRange: '10°C ~ 28°C', suggestion: '防晒霜和防风外套必备，建议携带润唇膏防止干燥' },
  '海边': { summary: '阳光充足，湿度较高，海风明显', tempRange: '20°C ~ 32°C', suggestion: '高倍防晒霜必备，注意防蚊虫，游泳注意安全' },
  '森林': { summary: '湿润多雨，温差适中，蚊虫较多', tempRange: '12°C ~ 25°C', suggestion: '雨具随身携带，穿长袖长裤防蚊虫，注意防滑' },
  '都市': { summary: '室内外温差大，空气质量变化', tempRange: '10°C ~ 30°C', suggestion: '穿可脱卸的外套，备口罩防雾霾，舒适步行鞋很重要' },
  '山地': { summary: '海拔每升高1000米气温下降6°C，紫外线强', tempRange: '0°C ~ 20°C', suggestion: '务必准备防寒衣物和防晒，高海拔注意高原反应' },
  '默认': { summary: '天气多变，建议出行前查看实时天气', tempRange: '10°C ~ 30°C', suggestion: '准备可应对多种天气的装备，关注天气变化' },
}

// Daily forecast weather patterns per scene+season
const FORECAST_PATTERNS: Record<string, { texts: string[]; tempBase: [number, number]; humidity: [number, number]; windScales: string[] }> = {
  'desert_summer': { texts: ['晴', '晴', '晴', '多云', '晴'], tempBase: [28, 42], humidity: [10, 25], windScales: ['3-4级', '2-3级', '4-5级'] },
  'desert_winter': { texts: ['晴', '多云', '晴', '晴', '晴'], tempBase: [-8, 12], humidity: [15, 30], windScales: ['3-4级', '2-3级', '4-5级'] },
  'desert_spring': { texts: ['晴', '沙尘', '多云', '晴', '晴'], tempBase: [8, 28], humidity: [10, 25], windScales: ['4-5级', '3-4级', '5-6级'] },
  'desert_autumn': { texts: ['晴', '晴', '多云', '晴', '晴'], tempBase: [5, 25], humidity: [15, 30], windScales: ['2-3级', '3-4级', '2-3级'] },
  'grassland_summer': { texts: ['多云', '晴', '阵雨', '晴', '多云'], tempBase: [15, 30], humidity: [40, 65], windScales: ['3-4级', '4-5级', '3-4级'] },
  'grassland_winter': { texts: ['晴', '多云', '小雪', '晴', '晴'], tempBase: [-20, -5], humidity: [30, 50], windScales: ['4-5级', '5-6级', '3-4级'] },
  'grassland_spring': { texts: ['多云', '晴', '扬沙', '多云', '晴'], tempBase: [0, 18], humidity: [25, 45], windScales: ['4-5级', '5-6级', '3-4级'] },
  'grassland_autumn': { texts: ['晴', '多云', '晴', '晴', '多云'], tempBase: [2, 18], humidity: [35, 55], windScales: ['3-4级', '4-5级', '2-3级'] },
  'beach_summer': { texts: ['晴', '多云', '阵雨', '晴', '晴'], tempBase: [26, 34], humidity: [70, 90], windScales: ['3-4级', '2-3级', '3-4级'] },
  'beach_winter': { texts: ['多云', '晴', '多云', '晴', '阴'], tempBase: [10, 20], humidity: [60, 80], windScales: ['4-5级', '3-4级', '4-5级'] },
  'beach_spring': { texts: ['多云', '晴', '小雨', '晴', '多云'], tempBase: [16, 26], humidity: [65, 85], windScales: ['3-4级', '2-3级', '3-4级'] },
  'beach_autumn': { texts: ['晴', '多云', '晴', '晴', '多云'], tempBase: [18, 28], humidity: [55, 75], windScales: ['2-3级', '3-4级', '2-3级'] },
  'forest_summer': { texts: ['阵雨', '多云', '中雨', '晴', '阵雨'], tempBase: [18, 28], humidity: [75, 95], windScales: ['1-2级', '2-3级', '1-2级'] },
  'forest_winter': { texts: ['多云', '阴', '小雨', '晴', '多云'], tempBase: [0, 12], humidity: [60, 80], windScales: ['1-2级', '2-3级', '1-2级'] },
  'forest_spring': { texts: ['小雨', '多云', '阵雨', '晴', '多云'], tempBase: [10, 22], humidity: [70, 90], windScales: ['1-2级', '2-3级', '2-3级'] },
  'forest_autumn': { texts: ['晴', '多云', '小雨', '晴', '多云'], tempBase: [8, 22], humidity: [65, 85], windScales: ['1-2级', '2-3级', '1-2级'] },
  'default_summer': { texts: ['晴', '多云', '晴', '阵雨', '多云'], tempBase: [24, 34], humidity: [50, 75], windScales: ['2-3级', '1-2级', '2-3级'] },
  'default_winter': { texts: ['晴', '多云', '阴', '晴', '多云'], tempBase: [-2, 10], humidity: [40, 60], windScales: ['2-3级', '3-4级', '2-3级'] },
  'default_spring': { texts: ['多云', '晴', '小雨', '多云', '晴'], tempBase: [10, 22], humidity: [45, 70], windScales: ['2-3级', '3-4级', '2-3级'] },
  'default_autumn': { texts: ['晴', '多云', '晴', '多云', '晴'], tempBase: [10, 24], humidity: [40, 65], windScales: ['2-3级', '1-2级', '2-3级'] },
}

const WEATHER_ICON_MAP: Record<string, string> = {
  '晴': '☀️', '多云': '⛅', '阴': '☁️', '小雨': '🌧', '中雨': '🌧',
  '大雨': '⛈', '阵雨': '🌦', '小雪': '🌨', '中雪': '❄️', '大雪': '❄️',
  '扬沙': '💨', '沙尘': '💨', '雾': '🌫',
}

function generateDailyForecast(scene: string, season: string, departureTime: number, returnTime: number): DailyForecast[] {
  const seasonKey = season === '冬季' ? 'winter' : season === '夏季' ? 'summer' : season === '春季' ? 'spring' : 'autumn'
  const patternKey = `${scene}_${seasonKey}`
  const pattern = FORECAST_PATTERNS[patternKey] || FORECAST_PATTERNS[`default_${seasonKey}`]

  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const forecasts: DailyForecast[] = []
  const startMs = departureTime
  const endMs = returnTime
  const dayMs = 86400000

  let dayIndex = 0
  for (let ms = startMs; ms <= endMs; ms += dayMs) {
    const d = new Date(ms)
    const textIdx = dayIndex % pattern.texts.length
    const windIdx = dayIndex % pattern.windScales.length

    const tempMin = pattern.tempBase[0] + Math.floor(Math.random() * 4 - 2)
    const tempMax = pattern.tempBase[1] + Math.floor(Math.random() * 4 - 2)
    const humidity = pattern.humidity[0] + Math.floor(Math.random() * (pattern.humidity[1] - pattern.humidity[0]))

    forecasts.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      weekDay: weekDays[d.getDay()],
      textDay: pattern.texts[textIdx],
      tempMin,
      tempMax,
      humidity,
      windScale: pattern.windScales[windIdx],
    })
    dayIndex++
  }
  return forecasts
}

export function getWeatherIcon(text: string): string {
  for (const [key, icon] of Object.entries(WEATHER_ICON_MAP)) {
    if (text.includes(key)) return icon
  }
  return '🌤'
}

const SEASONAL_LUGGAGE: Record<string, LuggageItem[]> = {
  '冬季': [
    { name: '羽绒服/厚外套', category: 'clothing', essential: true },
    { name: '保暖内衣', category: 'clothing', essential: true },
    { name: '围巾手套帽子', category: 'clothing', essential: true },
    { name: '暖宝宝', category: 'other', essential: false, note: '贴身保暖神器' },
    { name: '保湿面霜', category: 'toiletry', essential: true },
  ],
  '夏季': [
    { name: '速干T恤', category: 'clothing', essential: true },
    { name: '防晒衣', category: 'clothing', essential: true },
    { name: '凉鞋/拖鞋', category: 'clothing', essential: false },
    { name: '防晒霜(SPF50+)', category: 'toiletry', essential: true },
    { name: '驱蚊液', category: 'toiletry', essential: true, note: '户外必备' },
  ],
  '春秋': [
    { name: '薄外套/风衣', category: 'clothing', essential: true },
    { name: '长袖衬衫', category: 'clothing', essential: true },
    { name: '雨伞/雨衣', category: 'other', essential: true },
    { name: '运动鞋', category: 'clothing', essential: true },
    { name: '薄围巾', category: 'clothing', essential: false },
  ],
}

const SCENE_LUGGAGE: Record<string, LuggageItem[]> = {
  'desert': [
    { name: '魔术头巾', category: 'clothing', essential: true, note: '防沙防尘' },
    { name: '墨镜', category: 'clothing', essential: true, note: '防强光和风沙' },
    { name: '水壶(1L+)', category: 'other', essential: true, note: '沙漠必须大量补水' },
    { name: '沙套/鞋套', category: 'clothing', essential: true, note: '防止沙子灌入鞋内' },
  ],
  'grassland': [
    { name: '防风外套', category: 'clothing', essential: true },
    { name: '望远镜', category: 'other', essential: false, note: '观景观鸟' },
    { name: '野餐垫', category: 'other', essential: false },
    { name: '驱蚊手环', category: 'toiletry', essential: true },
  ],
  'beach': [
    { name: '泳衣', category: 'clothing', essential: true },
    { name: '沙滩巾', category: 'clothing', essential: true },
    { name: '防水手机袋', category: 'electronics', essential: true, note: '保护手机' },
    { name: '浮潜面镜', category: 'other', essential: false, note: '如需浮潜' },
  ],
  'forest': [
    { name: '登山杖', category: 'other', essential: true, note: '防滑防摔' },
    { name: '速干裤(长裤)', category: 'clothing', essential: true, note: '防蚊防划' },
    { name: '头灯/手电', category: 'electronics', essential: true, note: '森林光线不足' },
    { name: '急救包', category: 'medicine', essential: true, note: '创可贴/消毒棉/绷带' },
  ],
}

// Scene-specific equipment recommendations (referencing Luggage-list project logic)
const SCENE_EQUIPMENT_DB: SceneEquipment[] = [
  {
    scene: 'beach',
    label: '海岛度假',
    items: [
      { name: '防晒霜(SPF50+ PA+++)', category: 'toiletry', essential: true, note: '海岛紫外线极强' },
      { name: '泳衣', category: 'clothing', essential: true, note: '建议带2套替换' },
      { name: '沙滩鞋/人字拖', category: 'clothing', essential: true, note: '沙滩行走防烫' },
      { name: '防水手机袋', category: 'electronics', essential: true, note: '水下拍照防护' },
      { name: '沙滩巾', category: 'clothing', essential: true, note: '可铺可裹' },
      { name: '晒后修复凝胶', category: 'toiletry', essential: false, note: '晒伤急救' },
      { name: '防水背包/干袋', category: 'other', essential: false, note: '水上活动装随身物' },
      { name: '驱蚊液', category: 'toiletry', essential: true, note: '热带海岛蚊虫多' },
    ],
  },
  {
    scene: 'diving',
    label: '潜水',
    items: [
      { name: '潜水证(OW/AOW)', category: 'document', essential: true, note: '持证才能下潜' },
      { name: '防水壳/水下相机', category: 'electronics', essential: false, note: '记录海底世界' },
      { name: '速干毛巾', category: 'clothing', essential: true, note: '出水后快速擦干' },
      { name: '潜水袜', category: 'clothing', essential: true, note: '防止脚蹼磨脚' },
      { name: '防雾喷剂', category: 'other', essential: false, note: '面镜防雾' },
      { name: '晕船药', category: 'medicine', essential: true, note: '船程易晕' },
      { name: '耳塞', category: 'other', essential: false, note: '防水入耳' },
      { name: '珊瑚友好防晒霜', category: 'toiletry', essential: true, note: '保护海洋生态' },
    ],
  },
  {
    scene: 'skiing',
    label: '滑雪',
    items: [
      { name: '滑雪服(防水)', category: 'clothing', essential: true, note: '防风防水保暖' },
      { name: '滑雪镜', category: 'clothing', essential: true, note: '防雪盲和强光' },
      { name: '护脸/面罩', category: 'clothing', essential: true, note: '防风防冻' },
      { name: '暖宝宝', category: 'other', essential: true, note: '贴身保暖' },
      { name: '护臀垫', category: 'other', essential: true, note: '新手摔跤必备' },
      { name: '防滑贴/雪板蜡', category: 'other', essential: false, note: '自带雪板时需要' },
      { name: '保湿润唇膏', category: 'toiletry', essential: true, note: '雪场极度干燥' },
    ],
  },
  {
    scene: 'hiking',
    label: '徒步登山',
    items: [
      { name: '登山鞋(防滑)', category: 'clothing', essential: true, note: '抓地力是关键' },
      { name: '登山杖', category: 'other', essential: true, note: '节省体力防滑' },
      { name: '冲锋衣(防风防水)', category: 'clothing', essential: true, note: '山间天气多变' },
      { name: '头灯/手电', category: 'electronics', essential: true, note: '天黑后照明' },
      { name: '压缩饼干/能量棒', category: 'other', essential: true, note: '补充体力' },
      { name: '急救包', category: 'medicine', essential: true, note: '创可贴/绷带/消毒' },
      { name: '保温毯', category: 'other', essential: false, note: '紧急防寒' },
    ],
  },
  {
    scene: 'camping',
    label: '露营',
    items: [
      { name: '帐篷/天幕', category: 'other', essential: true, note: '过夜必备' },
      { name: '睡袋(温标匹配)', category: 'other', essential: true, note: '按目的地温度选择' },
      { name: '防潮垫', category: 'other', essential: true, note: '隔绝地面湿气' },
      { name: '头灯/营地灯', category: 'electronics', essential: true, note: '夜间照明' },
      { name: '便携炉具+气罐', category: 'other', essential: false, note: '户外烹饪' },
      { name: '驱蚊喷雾', category: 'toiletry', essential: true, note: '户外蚊虫多' },
      { name: '多功能刀', category: 'other', essential: false, note: '应急工具' },
    ],
  },
  {
    scene: 'desert',
    label: '沙漠探险',
    items: [
      { name: '防沙眼镜/墨镜', category: 'clothing', essential: true, note: '防强光和风沙' },
      { name: '魔术头巾', category: 'clothing', essential: true, note: '防沙防尘遮面' },
      { name: '水壶(2L+)', category: 'other', essential: true, note: '沙漠必须大量补水' },
      { name: '沙套/鞋套', category: 'clothing', essential: true, note: '防止沙子灌入鞋内' },
      { name: '高倍防晒霜', category: 'toiletry', essential: true, note: '沙漠紫外线极强' },
      { name: '唇膏(防晒型)', category: 'toiletry', essential: true, note: '沙漠极度干燥' },
    ],
  },
]

// International destination alerts database
const DESTINATION_ALERTS_DB: Record<string, DestinationAlert[]> = {
  '英国': [
    { type: 'plug', title: '插头标准：英标三孔', description: '英国使用英标三孔方形插头（Type G），电压230V，需携带转换插头', icon: '🔌' },
    { type: 'culture', title: '靠左行驶', description: '英国车辆靠左行驶，过马路时先看右再看左，注意人行道提示', icon: '🚗' },
    { type: 'currency', title: '货币：英镑(GBP)', description: '建议携带少量现金，大部分场所支持Visa/Mastercard非接触支付', icon: '💷' },
  ],
  '日本': [
    { type: 'plug', title: '插头标准：美标双孔', description: '日本使用美标双孔扁插头（Type A），电压110V，中国两孔插头可直接使用', icon: '🔌' },
    { type: 'culture', title: '礼仪禁忌', description: '室内需脱鞋；不要在公共场合大声说话；给小费会被视为不礼貌；筷子不要插在饭上', icon: '🎎' },
    { type: 'currency', title: '货币：日元(JPY)', description: '部分小店和餐厅仅收现金，建议随身携带零钱', icon: '💴' },
  ],
  '泰国': [
    { type: 'plug', title: '插头标准：多型兼容', description: '泰国支持美标和欧标插头（Type A/C），无需转换器即可使用中国两孔插头', icon: '🔌' },
    { type: 'culture', title: '寺庙着装要求', description: '进入寺庙需穿长袖长裤，不可穿拖鞋、短裤、吊带；女性不可触碰僧侣', icon: '🛕' },
    { type: 'culture', title: '头部禁忌', description: '泰国人认为头部神圣，不要触碰他人头部；脚被认为不洁，不要用脚指人或物品', icon: '🙏' },
    { type: 'health', title: '防蚊防疫', description: '登革热高发区，务必携带驱蚊液；建议提前接种甲肝疫苗', icon: '🏥' },
  ],
  '美国': [
    { type: 'plug', title: '插头标准：美标双孔', description: '美国使用美标插头（Type A/B），电压120V，中国两孔插头可直接使用', icon: '🔌' },
    { type: 'culture', title: '小费文化', description: '餐厅需给15%-20%小费；酒店行李生和房间清洁也需给小费（1-2美元）', icon: '💵' },
    { type: 'visa', title: '签证提醒', description: '需提前办理B1/B2签证或ESTA免签（适用免签国家），EVUS登记需在出发前完成', icon: '🛂' },
  ],
  '韩国': [
    { type: 'plug', title: '插头标准：欧标双圆孔', description: '韩国使用欧标双圆孔插头（Type C/F），电压220V，需携带转换插头', icon: '🔌' },
    { type: 'culture', title: '礼仪注意', description: '递接物品使用双手；长辈面前喝酒需侧身；不要在地铁坐老弱专座', icon: '🇰🇷' },
  ],
  '法国': [
    { type: 'plug', title: '插头标准：欧标双圆孔', description: '法国使用欧标双圆孔插头（Type E），电压230V，需携带转换插头', icon: '🔌' },
    { type: 'culture', title: '礼仪文化', description: '进入店铺先说Bonjour；用餐时间较长，不要催促服务员；地铁注意防盗', icon: '🇫🇷' },
  ],
  '澳大利亚': [
    { type: 'plug', title: '插头标准：澳标八字孔', description: '澳大利亚使用澳标八字形插头（Type I），电压230V，需携带转换插头', icon: '🔌' },
    { type: 'culture', title: '生物安全', description: '严禁携带食品、动植物入境；入境申报需如实填写，违者罚款严重', icon: '🦘' },
  ],
  '阿联酋': [
    { type: 'plug', title: '插头标准：英标三孔', description: '阿联酋使用英标三孔插头（Type G），需携带转换插头', icon: '🔌' },
    { type: 'culture', title: '宗教文化禁忌', description: '清真寺需穿长袖长裤，女性需包头；斋月期间白天不可在公共场合饮食；男女避免公共场合亲密行为', icon: '🕌' },
  ],
  '沙特': [
    { type: 'plug', title: '插头标准：美标/英标', description: '沙特使用Type A/B/G混用，建议携带万能转换插头', icon: '🔌' },
    { type: 'culture', title: '宗教文化禁忌', description: '女性需穿长袍(Abaya)并包头；不可携带猪肉和酒精入境；祈祷时间店铺会暂停营业', icon: '🕌' },
  ],
  '印度': [
    { type: 'plug', title: '插头标准：印标三圆孔', description: '印度使用Type C/D插头，电压230V，建议携带万能转换插头', icon: '🔌' },
    { type: 'culture', title: '饮食禁忌', description: '左手被视为不洁，递接物品用右手；大部分印度教徒不吃牛肉；清真餐厅不供应猪肉', icon: '🇮🇳' },
    { type: 'health', title: '饮水安全', description: '建议只喝瓶装水，避免生冷食物；携带肠胃药以防水土不服', icon: '🏥' },
  ],
  '意大利': [
    { type: 'plug', title: '插头标准：意标三孔', description: '意大利使用Type F/L插头，电压230V，需携带转换插头', icon: '🔌' },
    { type: 'culture', title: '着装要求', description: '进入教堂需遮住肩膀和膝盖；不可穿拖鞋进入教堂', icon: '⛪' },
  ],
  '马尔代夫': [
    { type: 'plug', title: '插头标准：英标三孔', description: '马尔代夫使用英标三孔插头（Type G），需携带转换插头', icon: '🔌' },
    { type: 'culture', title: '宗教禁忌', description: '居民岛需穿着保守，不可穿比基尼；酒精仅在度假岛允许', icon: '🏝' },
    { type: 'health', title: '防晒防蚊', description: '赤道附近紫外线极强，需SPF50+防晒；热带岛屿蚊虫多，备驱蚊液', icon: '🏥' },
  ],
  '埃及': [
    { type: 'plug', title: '插头标准：欧标双圆孔', description: '埃及使用Type C/F插头，电压220V，需携带转换插头', icon: '🔌' },
    { type: 'culture', title: '宗教文化', description: '进入清真寺需脱鞋，女性需包头穿长袖长裤；不要拍摄当地女性未经允许', icon: '🕌' },
    { type: 'health', title: '饮食安全', description: '只喝瓶装水，避免生食；携带肠胃药和防蚊用品', icon: '🏥' },
  ],
  '越南': [
    { type: 'plug', title: '插头标准：多型兼容', description: '越南支持Type A/C插头，中国两孔插头可直接使用', icon: '🔌' },
    { type: 'culture', title: '交通注意', description: '摩托车极多，过马路需缓慢匀速行走，车辆会自动避让', icon: '🛵' },
  ],
  '新加坡': [
    { type: 'plug', title: '插头标准：英标三孔', description: '新加坡使用英标三孔插头（Type G），需携带转换插头', icon: '🔌' },
    { type: 'culture', title: '法律禁忌', description: '严禁口香糖；公共交通不可饮食；乱丢垃圾罚款严重', icon: '🇸🇬' },
  ],
}

// Keywords for matching destinations to alert countries
const ALERT_KEYWORD_MAP: Record<string, string[]> = {
  '英国': ['伦敦', '牛津', '剑桥', '曼彻斯特', '爱丁堡', '利物浦', '英国'],
  '日本': ['东京', '大阪', '京都', '北海道', '冲绳', '奈良', '福冈', '名古屋', '日本'],
  '泰国': ['曼谷', '清迈', '普吉', '芭提雅', '苏梅', '甲米', '泰国'],
  '美国': ['纽约', '洛杉矶', '旧金山', '拉斯维加斯', '夏威夷', '西雅图', '芝加哥', '美国'],
  '韩国': ['首尔', '釜山', '济州', '仁川', '韩国'],
  '法国': ['巴黎', '尼斯', '马赛', '里昂', '普罗旺斯', '法国'],
  '澳大利亚': ['悉尼', '墨尔本', '布里斯班', '黄金海岸', '大堡礁', '澳大利亚'],
  '阿联酋': ['迪拜', '阿布扎比', '阿联酋'],
  '沙特': ['利雅得', '吉达', '麦加', '麦地那', '沙特'],
  '印度': ['新德里', '孟买', '阿格拉', '斋浦尔', '瓦拉纳西', '印度'],
  '意大利': ['罗马', '佛罗伦萨', '威尼斯', '米兰', '那不勒斯', '意大利'],
  '马尔代夫': ['马累', '马尔代夫'],
  '埃及': ['开罗', '卢克索', '亚历山大', '阿斯旺', '埃及'],
  '越南': ['河内', '胡志明', '岘港', '下龙湾', '芽庄', '大叻', '会安', '越南'],
  '新加坡': ['新加坡'],
}

const UNIVERSAL_LUGGAGE: LuggageItem[] = [
  { name: '身份证/护照', category: 'document', essential: true, note: '务必随身携带' },
  { name: '充电宝(20000mAh)', category: 'electronics', essential: true },
  { name: '常用药品', category: 'medicine', essential: true, note: '感冒药/肠胃药/止痛药' },
  { name: '洗漱包', category: 'toiletry', essential: true },
  { name: '零食和水', category: 'other', essential: false },
  { name: '保鲜袋/密封袋', category: 'other', essential: false, note: '分类收纳防潮' },
  { name: '行程单/门票凭证', category: 'document', essential: true, note: '电子版备份' },
]

function getSeason(month: number): string {
  if (month >= 12 || month <= 2) return '冬季'
  if (month >= 3 && month <= 5) return '春季'
  if (month >= 6 && month <= 8) return '夏季'
  return '秋季'
}

function getSeasonLuggageKey(season: string): string {
  if (season === '冬季') return '冬季'
  if (season === '夏季') return '夏季'
  return '春秋'
}

function detectSceneFromCity(city: City | undefined, dest: string): string {
  if (city) {
    if (city.types.includes('desert')) return 'desert'
    if (city.types.includes('grassland')) return 'grassland'
    if (city.types.includes('beach')) return 'beach'
    if (city.types.includes('forest')) return 'forest'
    if (city.types.includes('mountain')) return '山地'
    if (city.types.includes('city')) return '都市'
  }
  // Fallback: keyword matching on destination name
  const d = dest
  if (/沙漠|敦煌|吐鲁番|喀什|迪拜/.test(d)) return 'desert'
  if (/草原|呼伦贝尔|额尔古纳|满洲里|阿勒泰/.test(d)) return 'grassland'
  if (/海|三亚|厦门|青岛|普吉|巴厘|马尔代夫/.test(d)) return 'beach'
  if (/森林|九寨|版纳|甘孜|阿坝|喀纳斯/.test(d)) return 'forest'
  return '默认'
}

function getWeatherForScene(scene: string): WeatherInfo {
  return WEATHER_DB[scene] || WEATHER_DB['默认']
}

function generateMustBring(scene: string, season: string, city: City | undefined): string[] {
  const items: string[] = []

  if (scene === 'desert') {
    items.push('高倍防晒霜（沙漠紫外线极强）')
    items.push('充足饮用水（每人每天至少2L）')
    items.push('防沙眼镜或墨镜')
  }
  if (scene === 'grassland') {
    items.push('防风保暖外套')
    items.push('防蚊喷雾')
  }
  if (scene === 'beach') {
    items.push('防水防晒霜（SPF50+ PA+++）')
    items.push('防水手机袋')
  }
  if (scene === 'forest') {
    items.push('长袖长裤防蚊虫')
    items.push('雨具（森林多变天气）')
  }

  if (season === '冬季' || season === '春季') {
    items.push('保温杯')
    items.push('暖宝宝')
  }
  if (season === '夏季') {
    items.push('遮阳帽/遮阳伞')
    items.push('藿香正气水（防中暑）')
  }

  if (city) {
    const lat = Math.abs(city.latitude)
    if (lat > 35) items.push('保湿护肤品（北方干燥）')
    if (lat > 25 && lat < 35) items.push('雨伞（南方多雨）')
  }

  items.push('身份证原件（酒店/景区必查）')
  return [...new Set(items)]
}

function generateSceneEquipments(scene: string, dest: string): SceneEquipment[] {
  const results: SceneEquipment[] = []

  // Match by detected scene
  for (const eq of SCENE_EQUIPMENT_DB) {
    if (eq.scene === scene) {
      results.push(eq)
    }
  }

  // Additional keyword-based matching for special scenes
  if (/潜水|深潜|浮潜|scuba|dive/.test(dest) && !results.some(r => r.scene === 'diving')) {
    results.push(SCENE_EQUIPMENT_DB.find(e => e.scene === 'diving')!)
  }
  if (/滑雪|雪场|ski|长白山|北海道|瑞士/.test(dest) && !results.some(r => r.scene === 'skiing')) {
    results.push(SCENE_EQUIPMENT_DB.find(e => e.scene === 'skiing')!)
  }
  if (/徒步|登山|hiking|攀登|川藏|尼泊尔|珠峰/.test(dest) && !results.some(r => r.scene === 'hiking')) {
    results.push(SCENE_EQUIPMENT_DB.find(e => e.scene === 'hiking')!)
  }
  if (/露营|帐篷|camping|野外/.test(dest) && !results.some(r => r.scene === 'camping')) {
    results.push(SCENE_EQUIPMENT_DB.find(e => e.scene === 'camping')!)
  }

  return results
}

function generateDestinationAlerts(dest: string, city: City | undefined): DestinationAlert[] {
  const alerts: DestinationAlert[] = []

  // Match by keyword map
  for (const [country, keywords] of Object.entries(ALERT_KEYWORD_MAP)) {
    if (keywords.some(kw => dest.includes(kw))) {
      const countryAlerts = DESTINATION_ALERTS_DB[country]
      if (countryAlerts) alerts.push(...countryAlerts)
      break
    }
  }

  // Match by city region
  if (city?.region === 'international' && alerts.length === 0) {
    alerts.push(
      { type: 'plug', title: '出国旅行请确认插头标准', description: '不同国家插头标准不同，建议携带万能转换插头', icon: '🔌' },
      { type: 'visa', title: '确认签证和入境要求', description: '提前确认目的地签证政策、入境材料及保险要求', icon: '🛂' },
      { type: 'currency', title: '提前兑换外币', description: '建议在国内银行兑换少量当地货币，大额消费可使用信用卡', icon: '💳' },
    )
  }

  return alerts
}

function generateTips(scene: string, season: string, city: City | undefined, memberCount: number): string[] {
  const tips: string[] = []

  if (city?.travelTips && city.travelTips.length > 0) {
    tips.push(...city.travelTips.slice(0, 2))
  }

  if (memberCount >= 4) {
    tips.push(`${memberCount}人出行建议提前预订大桌餐厅和多人间住宿`)
    tips.push('建议使用群聊同步行程安排，避免走散')
  }

  if (scene === 'desert') {
    tips.push('沙漠中GPS信号可能不稳定，建议提前下载离线地图')
    tips.push('沙漠昼夜温差大，凌晨最冷，注意保暖')
  }
  if (scene === 'grassland') {
    tips.push('草原昼夜温差大，建议洋葱式穿搭')
  }
  if (scene === 'beach') {
    tips.push('下海游泳注意潮汐时间，远离离岸流')
    tips.push('海鲜建议选择正规餐厅，避免食物中毒')
  }
  if (scene === 'forest') {
    tips.push('森林中手机信号可能较弱，提前告知家人行程')
    tips.push('不要偏离标记步道，注意野生动物')
  }

  if (season === '冬季') {
    tips.push('冬季天黑较早，户外活动建议安排在上午')
  }

  tips.push('出行前购买旅行保险，以防意外')
  return tips
}

export function generateTravelGuide(team: BuddyTeam): TravelGuide {
  const destCity = cities.find(c =>
    c.name === team.destination || team.destination.includes(c.name)
  )

  const departMonth = new Date(team.departureTime).getMonth() + 1
  const season = getSeason(departMonth)

  const scene = detectSceneFromCity(destCity, team.destination)
  const weather = getWeatherForScene(scene)

  // Build luggage list
  const seasonKey = getSeasonLuggageKey(season)
  const seasonItems = SEASONAL_LUGGAGE[seasonKey] || SEASONAL_LUGGAGE['春秋']
  const sceneItems = SCENE_LUGGAGE[scene] || []

  const luggageMap = new Map<string, LuggageItem>()
  for (const item of [...UNIVERSAL_LUGGAGE, ...seasonItems, ...sceneItems]) {
    if (!luggageMap.has(item.name)) {
      luggageMap.set(item.name, item)
    }
  }

  const mustBring = generateMustBring(scene, season, destCity)
  const sceneEquipments = generateSceneEquipments(scene, team.destination)
  const alerts = generateDestinationAlerts(team.destination, destCity)
  const tips = generateTips(scene, season, destCity, team.currentMembers)
  const dailyForecast = generateDailyForecast(scene, season, team.departureTime, team.returnTime)

  return {
    teamId: team.id,
    destination: team.destination,
    departureTime: team.departureTime,
    returnTime: team.returnTime,
    memberCount: team.currentMembers,
    weather,
    dailyForecast,
    luggageList: Array.from(luggageMap.values()),
    mustBring,
    sceneEquipments,
    alerts,
    tips,
    generatedAt: Date.now(),
  }
}
