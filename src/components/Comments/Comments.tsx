import { useEffect, useRef, useState } from "react";
import {
  Group,
  Headline,
  List,
  Spacing,
  Separator,
  Spinner,
  Div,
  IconButton,
  Text,
} from "@vkontakte/vkui";
import { Icon28CommentOutline, Icon28RefreshOutline } from "@vkontakte/icons";

import { ICommentsItem } from "../../models/models";
import { Comment } from "../Comment/Comment";
import { BASE_API_URL } from "../../utils";
import { ICommentsProps } from "./Comments.props";
import styles from "./Comments.module.scss";

export function Comments({ commentsIds }: ICommentsProps) {
  const [comments, setComments] = useState<ICommentsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const abortControllerRef = useRef<AbortController | null>(null);

  async function fetchData(signal: AbortSignal, Ids: number[]) {
    try {
      setLoading(true);

      const comments =
        Ids && Ids.length > 0
          ? await Promise.all(
              Ids.map(async (id: number) => {
                const response = await fetch(
                  `${BASE_API_URL}/item/${id}.json`,
                  { signal }
                );
                return await response.json();
              })
            )
          : [];

      setComments(comments);
      setLoading(false);
    } catch (e) {
      if (e instanceof Error) {
        const error = new Error(
          "Извините, не удалось загрузить комментарии, попробуйте обновить или зайдите позже!"
        );
        setError(error.message);
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    fetchData(abortControllerRef.current.signal, commentsIds);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [commentsIds]);

  const handleRefresh = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    fetchData(abortControllerRef.current.signal, commentsIds);
  };

  return (
    <Group>
      <Div className={styles.comments}>
        <Headline className={styles.comments__headline} weight="1">
          <Icon28CommentOutline /> Comments ({commentsIds && commentsIds.length}
          )
        </Headline>
        <IconButton label="Обновить" onClick={handleRefresh} disabled={loading}>
          <Icon28RefreshOutline />
        </IconButton>
      </Div>
      <Spacing size={24}>
        <Separator />
      </Spacing>
      <List>
        {loading ? (
          <Spinner size="medium" />
        ) : comments.length > 0 && !error ? (
          comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))
        ) : (
          <Text style={{ textAlign: "center" }}>{error}</Text>
        )}
      </List>
    </Group>
  );
}
