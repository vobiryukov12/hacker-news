/**
 * Функция для форматирования времени публикации
 * @param timestamp - временная метка
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};
