import {KeyValueListData} from 'app/components/events/interfaces/keyValueList/types';
import {getMeta} from 'app/components/events/meta/metaProxy';
import {Event} from 'app/types/event';
import {defined} from 'app/utils';

import getAppKnownDataDetails from './getAppKnownDataDetails';
import {AppData, AppKnownDataType} from './types';

function getAppKnownData(
  event: Event,
  data: AppData,
  appKnownDataValues: Array<AppKnownDataType>
): Array<KeyValueListData> {
  const knownData: Array<KeyValueListData> = [];

  const dataKeys = appKnownDataValues.filter(appKnownDataValue =>
    defined(data[appKnownDataValue])
  );

  for (const key of dataKeys) {
    const knownDataDetails = getAppKnownDataDetails(event, data, key as AppKnownDataType);

    knownData.push({
      key,
      ...knownDataDetails,
      meta: getMeta(data, key),
    });
  }
  return knownData;
}

export default getAppKnownData;
