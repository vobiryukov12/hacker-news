import { useState } from 'react'
import {
  Icon28ChevronDownOutline,
  Icon28ChevronUpOutline,
} from '@vkontakte/icons'
import { Avatar, Button, Div, SimpleCell, Text, Spacing } from '@vkontakte/vkui'
import parse from 'html-react-parser'

import { declOfNum } from '@/utils'
import { ICommentsItem } from '@/models'
import { BASE_API_URL } from '@/utils'
import { ICommentProps } from './Comment.props'
import styles from './Comment.module.scss'

export function Comment({ comment }: ICommentProps) {
  const [showReplies, setShowReplies] = useState(false)
  const [replies, setReplies] = useState<ICommentsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchData(kids: number[]) {
    try {
      setLoading(true)

      const comments = await Promise.all(
        kids.map(async (id: number) => {
          const response = await fetch(`${BASE_API_URL}/item/${id}.json`)
          return await response.json()
        })
      )

      setReplies(comments)
      setLoading(false)
    } catch (e) {
      if (e instanceof Error) {
        const error = new Error(
          'Извините, не удалось загрузить комментарии, попробуйте обновить или зайдите позже!'
        )
        setError(error.message)
      }
      setLoading(false)
    }
  }

  const toggleReplies = async () => {
    if (!showReplies && comment.kids) {
      fetchData(comment.kids)
    }
    setShowReplies(!showReplies)
  }

  return (
    <>
      <Div className={styles.comment}>
        <SimpleCell
          before={
            <Avatar
              initials={
                comment.deleted !== true && comment.dead !== true
                  ? comment.by[0]
                  : '!'
              }
              gradientColor={
                comment.deleted !== true && comment.dead !== true
                  ? 'blue'
                  : 'red'
              }
            />
          }
        >
          {comment.deleted !== true && comment.dead !== true
            ? comment.by
            : 'Comment unavailable'}
        </SimpleCell>

        {comment.deleted !== true && comment.dead !== true && (
          <Div className={styles.comment__block}>
            <Text>{parse(comment.text)}</Text>
            <Spacing size={5}></Spacing>

            {comment.kids && comment.kids.length > 0 && (
              <Button
                before={
                  showReplies ? (
                    <Icon28ChevronUpOutline />
                  ) : (
                    <Icon28ChevronDownOutline />
                  )
                }
                loading={loading}
                onClick={toggleReplies}
                mode="tertiary"
              >
                {showReplies ? (
                  'Скрыть ответы'
                ) : (
                  <>
                    {`${comment.kids.length} ${
                      comment.kids &&
                      declOfNum(comment.kids.length, [
                        'ответ',
                        'ответа',
                        'ответов',
                      ])
                    }`}
                  </>
                )}
              </Button>
            )}
            <div className={styles.comment__repliesDesktop}>
              {showReplies && !error ? (
                replies.map((reply) => (
                  <Comment key={reply.id} comment={reply} />
                ))
              ) : (
                <Text style={{ textAlign: 'center' }}>{error}</Text>
              )}
            </div>
          </Div>
        )}
        <div className={styles.comment__repliesMobile}>
          {showReplies &&
            replies.map((reply) => <Comment key={reply.id} comment={reply} />)}
        </div>
      </Div>
    </>
  )
}
