import React from 'react';
import styled from '@emotion/styled';
import {Location} from 'history';

import BreakdownBars from 'app/components/charts/breakdownBars';
import ErrorPanel from 'app/components/charts/errorPanel';
import {SectionHeading} from 'app/components/charts/styles';
import EmptyStateWarning from 'app/components/emptyStateWarning';
import Placeholder from 'app/components/placeholder';
import QuestionTooltip from 'app/components/questionTooltip';
import {IconWarning} from 'app/icons';
import {t} from 'app/locale';
import {LightWeightOrganization} from 'app/types';
import DiscoverQuery from 'app/utils/discover/discoverQuery';
import EventView from 'app/utils/discover/eventView';
import {getTermHelp, PERFORMANCE_TERM} from 'app/views/performance/data';

type Props = {
  organization: LightWeightOrganization;
  location: Location;
  eventView: EventView;
};

function StatusBreakdown({eventView, location, organization}: Props) {
  const breakdownView = eventView
    .withColumns([
      {kind: 'function', function: ['count', '', '']},
      {kind: 'field', field: 'transaction.status'},
    ])
    .withSorts([{kind: 'desc', field: 'count'}]);

  return (
    <React.Fragment>
      <SectionHeading>
        {t('Status Breakdown')}
        <QuestionTooltip
          position="top"
          title={getTermHelp(organization, PERFORMANCE_TERM.STATUS_BREAKDOWN)}
          size="sm"
        />
      </SectionHeading>
      <DiscoverQuery
        eventView={breakdownView}
        location={location}
        orgSlug={organization.slug}
      >
        {({isLoading, error, tableData}) => {
          if (isLoading) {
            return <Placeholder height="124px" />;
          }
          if (error) {
            return (
              <ErrorPanel height="124px">
                <IconWarning color="gray300" size="lg" />
              </ErrorPanel>
            );
          }
          if (!tableData || tableData.data.length === 0) {
            return (
              <EmptyStatusBreakdown small>{t('No statuses found')}</EmptyStatusBreakdown>
            );
          }
          const points = tableData.data.map(row => ({
            label: String(row['transaction.status']),
            value: parseInt(String(row.count), 10),
          }));
          return <BreakdownBars data={points} />;
        }}
      </DiscoverQuery>
    </React.Fragment>
  );
}

const EmptyStatusBreakdown = styled(EmptyStateWarning)`
  height: 124px;
  padding: 50px 15%;
`;

export default StatusBreakdown;
