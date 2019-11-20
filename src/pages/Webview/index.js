import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import { LoadingIcon } from './styles';

export default class Webview extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('page'),
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  handleLoading = () => {
    return <LoadingIcon size={80} />;
  };

  render() {
    const { navigation } = this.props;
    const page = navigation.getParam('page');
    return (
      <WebView
        source={{ uri: page }}
        renderLoading={this.handleLoading}
        startInLoadingState
      />
    );
  }
}
