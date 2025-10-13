export interface ParsedOrderData {
  size: string;
  mountType: string;
  type: string;
  wires: string;
  addOns: string;
}

export function parseOrderText(text: string): ParsedOrderData {
  // Определяем тип текста по наличию эмодзи (более надежный индикатор)
  const hasRussianEmojis = /📩|👤|📍|🏛️|📞|📝|🔹|🆔/.test(text);
  
  if (hasRussianEmojis) {
    return parseRussianFormat(text);
  } else {
    return parseEnglishFormat(text);
  }
}

function parseEnglishFormat(text: string): ParsedOrderData {
  const result: ParsedOrderData = {
    size: '',
    mountType: '',
    type: '',
    wires: '',
    addOns: ''
  };

  // Ищем секцию "Form data" и парсим поля внутри неё
  const formDataMatch = text.match(/Form data:([\s\S]*?)(?=UTM parameters:|$)/i);
  let searchSection = text;
  
  if (formDataMatch) {
    searchSection = formDataMatch[1];
  }
  
  // Извлекаем size из строки "size: ..."
  const sizeMatch = searchSection.match(/size:\s*([^\n\r]+)/i);
  if (sizeMatch) {
    result.size = sizeMatch[1].trim();
  }

  // Извлекаем Mount type
  const mountTypeMatch = searchSection.match(/Mount type:\s*([^\n\r]+)/i);
  if (mountTypeMatch) {
    result.mountType = mountTypeMatch[1].trim();
  }

  // Извлекаем Type (материал стены) - ищем только после Mount type
  const typeMatch = searchSection.match(/Mount type:[^\n\r]*\n[^\n\r]*Type:\s*([^\n\r]+)/i);
  if (typeMatch) {
    result.type = typeMatch[1].trim();
  }

  // Извлекаем Wires
  const wiresMatch = searchSection.match(/Wires:\s*([^\n\r]+)/i);
  if (wiresMatch) {
    result.wires = wiresMatch[1].trim();
  }

  // Извлекаем Add-ons
  const addOnsMatch = searchSection.match(/Add-ons:\s*([^\n\r]+)/i);
  if (addOnsMatch) {
    result.addOns = addOnsMatch[1].trim();
  }

  return result;
}

function parseRussianFormat(text: string): ParsedOrderData {
  const result: ParsedOrderData = {
    size: '',
    mountType: '',
    type: '',
    wires: '',
    addOns: ''
  };

  // Извлекаем все ответы на вопросы
  const answers = text.match(/🔹\s*\d+:\s*([^\n\r]+)/g);
  
  if (answers) {
    // Индекс 0: size
    if (answers[0]) {
      result.size = extractValueFromAnswer(answers[0]);
    }
    
    // Индекс 1: mount type
    if (answers[1]) {
      result.mountType = extractValueFromAnswer(answers[1]);
    }
    
    // Индекс 2: type (материал)
    if (answers[2]) {
      result.type = extractValueFromAnswer(answers[2]);
    }
    
    // Индекс 3: wires
    if (answers[3]) {
      result.wires = extractValueFromAnswer(answers[3]);
    }
    
    // Индекс 4: add-ons
    if (answers[4]) {
      result.addOns = extractValueFromAnswer(answers[4]);
    }
  }

  return result;
}

function extractValueFromAnswer(answerLine: string): string {
  // Убираем эмодзи и номер, оставляем только значение
  const match = answerLine.match(/🔹\s*\d+:\s*(.+)/);
  if (match) {
    return match[1].trim();
  }
  return '';
}
