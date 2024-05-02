import { ContentCard, Div } from '@vkontakte/vkui'
import { formatDate } from '@/utils'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { INewsItemProps } from './NewsItem.props'

export function NewsItem({ newsItem, index }: INewsItemProps) {
  const routeNavigator = useRouteNavigator()

  return (
    <Div key={newsItem.id}>
      <ContentCard
        onClick={() => {
          routeNavigator.push(`news/${newsItem.id}`, {
            state: newsItem,
          })
        }}
        subtitle={`${newsItem.score} point`}
        header={`${index + 1}. ${newsItem.title}`}
        text={`by ${newsItem.by}`}
        caption={formatDate(newsItem.time)}
        maxHeight={150}
      />
    </Div>
  )
}
