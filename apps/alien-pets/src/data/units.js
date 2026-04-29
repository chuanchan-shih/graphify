// 課程單元 — 對應企劃書第十章
export const GRADES = [
  '幼幼班',
  '小一',
  '小二',
  '小三',
  '小四',
  '小五',
  '小六',
]

export const UNITS = {
  幼幼班: [
    { id: 'k_alphabet', name: '字母認識 A～Z' },
    { id: 'k_numbers', name: '數字 1～10' },
    { id: 'k_colors', name: '顏色世界' },
    { id: 'k_animals', name: '動物名稱' },
  ],
  小一: [
    { id: 'g1_greeting', name: '打招呼' },
    { id: 'g1_family', name: '家庭成員' },
    { id: 'g1_body', name: '身體部位' },
    { id: 'g1_food', name: '食物飲料' },
  ],
  小二: [
    { id: 'g2_school', name: '學校用品' },
    { id: 'g2_weather', name: '天氣表達' },
    { id: 'g2_transport', name: '交通工具' },
    { id: 'g2_adj', name: '形容詞入門' },
  ],
  小三: [
    { id: 'g3_time', name: '時間表達' },
    { id: 'g3_shop', name: '購物對話' },
    { id: 'g3_nature', name: '自然環境' },
    { id: 'g3_sport', name: '運動項目' },
  ],
  小四: [
    { id: 'g4_travel', name: '旅遊英語' },
    { id: 'g4_health', name: '健康話題' },
    { id: 'g4_job', name: '職業介紹' },
    { id: 'g4_tech', name: '科技詞彙' },
  ],
  小五: [
    { id: 'g5_news', name: '新聞閱讀' },
    { id: 'g5_story', name: '故事寫作' },
    { id: 'g5_debate', name: '辯論基礎' },
    { id: 'g5_culture', name: '文化差異' },
  ],
  小六: [
    { id: 'g6_issue', name: '議題討論' },
    { id: 'g6_speech', name: '演講技巧' },
    { id: 'g6_read', name: '進階閱讀' },
    { id: 'g6_grad', name: '畢業準備' },
  ],
}

// 練習題庫（mock，每個單元 4 題以內，v0.1 用）
export const QUESTIONS = {
  k_alphabet: [
    { type: 'pick', q: '哪個是 Apple？', options: ['🍎', '🐱', '🚗', '🌊'], answer: 0 },
    { type: 'pick', q: 'Which one starts with "B"?', options: ['Cat', 'Ball', 'Apple', 'Dog'], answer: 1 },
    { type: 'pick', q: 'Which one is "Cat"？', options: ['🐶', '🐱', '🐰', '🐻'], answer: 1 },
  ],
  k_numbers: [
    { type: 'pick', q: 'Two = ?', options: ['1', '2', '3', '4'], answer: 1 },
    { type: 'pick', q: 'Five = ?', options: ['3', '4', '5', '6'], answer: 2 },
    { type: 'pick', q: '"7" 怎麼念？', options: ['Six', 'Seven', 'Eight', 'Nine'], answer: 1 },
  ],
  k_colors: [
    { type: 'pick', q: 'The sky is ___', options: ['Red', 'Blue', 'Green', 'Black'], answer: 1 },
    { type: 'pick', q: 'Apple is often ___', options: ['Red', 'Blue', 'Yellow', 'White'], answer: 0 },
  ],
  k_animals: [
    { type: 'pick', q: 'Dog 是？', options: ['貓', '狗', '魚', '兔'], answer: 1 },
    { type: 'pick', q: 'Which is "Bird"?', options: ['🐶', '🐱', '🐦', '🐟'], answer: 2 },
  ],
  g1_greeting: [
    { type: 'pick', q: '"How are you?" 適合的回答？', options: ["I'm fine.", 'Yes.', 'No.', 'Goodbye.'], answer: 0 },
    { type: 'pick', q: '早上見面說？', options: ['Good night', 'Good morning', 'Bye', 'Sorry'], answer: 1 },
  ],
  g1_family: [
    { type: 'pick', q: '"Mom" 是？', options: ['爸爸', '媽媽', '姊姊', '哥哥'], answer: 1 },
    { type: 'pick', q: '"My ___ is a teacher." 填入？', options: ['cat', 'dad', 'apple', 'red'], answer: 1 },
  ],
  g1_body: [
    { type: 'pick', q: '"Eyes" 是？', options: ['耳朵', '眼睛', '鼻子', '嘴巴'], answer: 1 },
  ],
  g1_food: [
    { type: 'pick', q: '"I like ___." 喝的東西？', options: ['milk', 'pen', 'red', 'cat'], answer: 0 },
  ],
  g2_school: [
    { type: 'pick', q: '"Pen" 是？', options: ['書', '筆', '包', '尺'], answer: 1 },
  ],
  g2_weather: [
    { type: 'pick', q: '今天出太陽：It\'s ___', options: ['rainy', 'sunny', 'cold', 'windy'], answer: 1 },
  ],
  g2_transport: [
    { type: 'pick', q: '"I go to school by ___" 公車？', options: ['bus', 'pen', 'cat', 'apple'], answer: 0 },
  ],
  g2_adj: [
    { type: 'pick', q: '大象是 ___', options: ['small', 'big', 'fast', 'slow'], answer: 1 },
  ],
  g3_time: [
    { type: 'pick', q: '"What time is it?" 問什麼？', options: ['顏色', '時間', '名字', '天氣'], answer: 1 },
  ],
  g3_shop: [
    { type: 'pick', q: '"How much is this?" 問什麼？', options: ['多大', '多少錢', '幾點', '在哪'], answer: 1 },
  ],
  g3_nature: [
    { type: 'pick', q: '"Mountain" 是？', options: ['河', '山', '海', '樹'], answer: 1 },
  ],
  g3_sport: [
    { type: 'pick', q: '"Swimming" 是？', options: ['跑步', '游泳', '足球', '騎車'], answer: 1 },
  ],
  g4_travel: [
    { type: 'pick', q: '"Where is the hotel?" 問什麼？', options: ['幾點', '多少錢', '在哪', '誰'], answer: 2 },
  ],
  g4_health: [
    { type: 'pick', q: '"I have a cold." 我？', options: ['餓', '感冒', '高興', '累'], answer: 1 },
  ],
  g4_job: [
    { type: 'pick', q: '"Teacher" 是？', options: ['醫生', '老師', '廚師', '司機'], answer: 1 },
  ],
  g4_tech: [
    { type: 'pick', q: '"I use a ___" 電腦？', options: ['phone', 'computer', 'apple', 'cat'], answer: 1 },
  ],
  g5_news: [
    { type: 'pick', q: '"Crisis" 是？', options: ['歡慶', '危機', '故事', '報導'], answer: 1 },
  ],
  g5_story: [
    { type: 'pick', q: '"Once upon a ___" 補上？', options: ['time', 'pen', 'apple', 'rain'], answer: 0 },
  ],
  g5_debate: [
    { type: 'pick', q: '"I agree" 表示？', options: ['同意', '反對', '不知道', '再見'], answer: 0 },
  ],
  g5_culture: [
    { type: 'pick', q: '"Tradition" 是？', options: ['交通', '傳統', '科技', '危機'], answer: 1 },
  ],
  g6_issue: [
    { type: 'pick', q: '"Environment" 是？', options: ['環境', '事件', '人物', '結尾'], answer: 0 },
  ],
  g6_speech: [
    { type: 'pick', q: '"First, I\'d like to say…" 是？', options: ['結尾', '開頭', '中段', '提問'], answer: 1 },
  ],
  g6_read: [
    { type: 'pick', q: '"Theme" 指？', options: ['段落', '主題', '人物', '時間'], answer: 1 },
  ],
  g6_grad: [
    { type: 'pick', q: '"My dream is to ___" 通常接？', options: ['動詞原形', '名詞', '形容詞', '驚嘆詞'], answer: 0 },
  ],
}

export function questionsForUnit(unitId) {
  return QUESTIONS[unitId] || [
    { type: 'pick', q: 'Pick the English word for "蘋果"', options: ['Cat', 'Apple', 'Dog', 'Sun'], answer: 1 },
    { type: 'pick', q: 'Pick the English word for "書"', options: ['Book', 'Pen', 'Bag', 'Cup'], answer: 0 },
  ]
}
