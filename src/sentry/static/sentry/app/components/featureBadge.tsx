import React from 'react';
import styled from '@emotion/styled';
import {withTheme} from 'emotion-theming';

import CircleIndicator from 'app/components/circleIndicator';
import Tag from 'app/components/tagDeprecated';
import Tooltip from 'app/components/tooltip';
import {t} from 'app/locale';
import space from 'app/styles/space';
import {Theme} from 'app/utils/theme';

type BadgeProps = {
  type: 'alpha' | 'beta' | 'new';
  theme: Theme;
  variant?: 'indicator' | 'badge';
  title?: string;
  noTooltip?: boolean;
};

type Props = Omit<React.HTMLAttributes<HTMLDivElement>, keyof BadgeProps> & BadgeProps;

const defaultTitles = {
  alpha: t('This feature is in alpha and may be unstable'),
  beta: t('This feature is in beta and may change in the future'),
  new: t('This is a new feature'),
};

const labels = {
  alpha: t('alpha'),
  beta: t('beta'),
  new: t('new'),
};

const FeaturedBadge = ({
  type,
  variant = 'badge',
  title,
  theme,
  noTooltip,
  ...p
}: Props) => (
  <div {...p}>
    <Tooltip title={title ?? defaultTitles[type]} disabled={noTooltip} position="right">
      <React.Fragment>
        {variant === 'badge' && <StyledTag priority={type}>{labels[type]}</StyledTag>}
        {variant === 'indicator' && (
          <CircleIndicator color={theme.badge[type].indicatorColor} size={8} />
        )}
      </React.Fragment>
    </Tooltip>
  </div>
);

const StyledTag = styled(Tag)`
  padding: 3px ${space(0.75)};
`;

const StyledFeatureBadge = styled(FeaturedBadge)`
  display: inline-flex;
  align-items: center;
  margin-left: ${space(0.75)};
  position: relative;
  top: -1px;
`;

export default withTheme(StyledFeatureBadge);
