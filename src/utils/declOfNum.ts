/**
 * Функция, которая меняет окончание у слова в зависимости от переданного числа
 * @example declOfNum(60, ['ответ', 'ответа', 'ответов'])
 * @param number - число, для которого нужно выполнить склонение окончания у существительного
 * @param words -  массив слов с вариантами склонений
 */

export const declOfNum = (
  number: number,
  words: [string, string, string]
): string => {
  return words[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? Math.abs(number) % 10 : 5]
  ];
};
