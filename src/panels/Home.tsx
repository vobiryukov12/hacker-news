import { FC, useEffect, useRef, useState } from 'react'
import {
  Panel,
  PanelHeader,
  Spinner,
  PanelHeaderButton,
  NavIdProps,
  Div,
  Text,
} from '@vkontakte/vkui'
import { Icon28RefreshOutline } from '@vkontakte/icons'

import { INewsItem } from '@/models'
import { NewsList } from '@/components'
import { BASE_API_URL } from '@/utils'
import persik from '../assets/persik.png'

export interface HomeProps extends NavIdProps {
  id: string
}

export const Home: FC<HomeProps> = ({ id }) => {
  const [news, setNews] = useState<INewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const abortControllerRef = useRef<AbortController | null>(null)

  async function fetchData(signal: AbortSignal, showLoader: boolean = true) {
    try {
      showLoader && setLoading(true)

      const response = await fetch(`${BASE_API_URL}/beststories.json`, {
        signal,
      })
      const newsIds = await response.json()

      const newsItems = await Promise.all(
        newsIds.slice(0, 100).map(async (id: number) => {
          const response = await fetch(`${BASE_API_URL}/item/${id}.json`, {
            signal,
          })
          return await response.json()
        })
      )

      setNews(newsItems.sort((a, b) => b.time - a.time))
      setLoading(false)
    } catch (e) {
      if (e instanceof Error) {
        const error = new Error(
          'Извините, в данный момент сервис не работает, попробуйте обновить или зайдите позже!'
        )
        setError(error.message)
      }

      setLoading(false)
    }
  }

  useEffect(() => {
    abortControllerRef.current = new AbortController()

    fetchData(abortControllerRef.current.signal)

    const intervalId = setInterval(
      fetchData,
      60000,
      abortControllerRef.current.signal,
      false
    )
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      clearInterval(intervalId)
    }
  }, [])

  const handleRefresh = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    setLoading(true)
    fetchData(abortControllerRef.current.signal)
  }

  return (
    <Panel id={id}>
      <PanelHeader
        before={
          <PanelHeaderButton
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Обновить"
          >
            <Icon28RefreshOutline />
          </PanelHeaderButton>
        }
      >
        Hacker News
      </PanelHeader>

      {loading ? (
        <Spinner size="large" style={{ margin: 'auto 0' }} />
      ) : (
        <>
          {!error ? (
            <NewsList news={news} />
          ) : (
            <Div style={{ textAlign: 'center' }}>
              <Text>{error}</Text>
              <img src={persik} alt="persik" width={200} />
            </Div>
          )}
        </>
      )}
    </Panel>
  )
}
