import { FC } from "react";
import {
  Group,
  Link,
  MiniInfoCell,
  NavIdProps,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Title,
} from "@vkontakte/vkui";
import {
  useMetaParams,
  useRouteNavigator,
} from "@vkontakte/vk-mini-apps-router";
import {
  Icon20CalendarOutline,
  Icon20GlobeOutline,
  Icon20User,
} from "@vkontakte/icons";

import { INewsItem } from "../models/models";
import { formatDate } from "../utils";
import { Comments } from "../components/Comments/Comments";

export const News: FC<NavIdProps> = ({ id }) => {
  const routeNavigator = useRouteNavigator();
  const params: INewsItem | null = useMetaParams();

  return (
    <Panel id={id}>
      <PanelHeader
        before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}
      >
        Hacker News
      </PanelHeader>

      <Group>
        <Title
          level="1"
          style={{ marginBottom: 16, textAlign: "center" }}
        >
          {params?.title}
        </Title>
        <MiniInfoCell before={<Icon20CalendarOutline />} textWrap="short">
          Date of publication: {params?.time && formatDate(params.time)}
        </MiniInfoCell>
        <MiniInfoCell before={<Icon20User />} textWrap="short">
          Author: {params?.by && params.by}
        </MiniInfoCell>
        <MiniInfoCell before={<Icon20GlobeOutline />} textWrap="short">
          More information at the link:
          {params?.url && <Link href={params.url}> {params.url}</Link>}
        </MiniInfoCell>
      </Group>

      {params?.kids && <Comments commentsIds={params?.kids} />}
    </Panel>
  );
};
