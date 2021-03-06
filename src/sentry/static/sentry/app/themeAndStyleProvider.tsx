import React from 'react';
import {CacheProvider} from '@emotion/core'; // This is needed to set "speedy" = false (for percy)
import {cache} from 'emotion'; // eslint-disable-line emotion/no-vanilla
import {ThemeProvider} from 'emotion-theming';

import {loadPreferencesState} from 'app/actionCreators/preferences';
import ConfigStore from 'app/stores/configStore';
import GlobalStyles from 'app/styles/global';
import {Config} from 'app/types';
import {darkTheme, lightTheme, Theme} from 'app/utils/theme';
import withConfig from 'app/utils/withConfig';

type Props = {
  config: Config;
};

type State = {
  theme: Theme;
};

class Main extends React.Component<Props, State> {
  state = {
    theme: ConfigStore.get('theme') === 'dark' ? darkTheme : lightTheme,
  };

  componentDidMount() {
    loadPreferencesState();
  }

  componentDidUpdate(prevProps: Props) {
    const {config} = this.props;
    if (config.theme !== prevProps.config.theme) {
      // eslint-disable-next-line
      this.setState({
        theme: config.theme === 'dark' ? darkTheme : lightTheme,
      });
    }
  }

  render() {
    return (
      <ThemeProvider<Theme> theme={this.state.theme}>
        <GlobalStyles
          isDark={this.props.config.theme === 'dark'}
          theme={this.state.theme}
        />
        <CacheProvider value={cache}>{this.props.children}</CacheProvider>
      </ThemeProvider>
    );
  }
}

export default withConfig(Main);
