import { Group } from '@vkontakte/vkui'

import { NewsItem } from '@/components'
import { INewsListProps } from './NewsList.props'

export function NewsList({ news }: INewsListProps) {
  return (
    <Group>
      {news.map((item, index) => (
        <NewsItem key={item.id} newsItem={item} index={index} />
      ))}
    </Group>
  )
}
