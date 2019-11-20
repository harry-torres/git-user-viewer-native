import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Footer,
  Empty,
  LoadingIcon,
  WebviewButton,
  ButtonContent,
} from './styles';
import api from '../../services/api';
import parseLinkHeader from '../../utils/parseLinkHeader';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: true,
    refreshing: false,
    next: 1,
  };

  async componentDidMount() {
    this.loadStarred();
  }

  refreshList = () => {
    this.setState({ refreshing: true, stars: [], next: 1 }, this.loadStarred);
  };

  renderFooter = () => {
    const { next } = this.state;
    return next ? <LoadingIcon size={30} /> : <Footer />;
  };

  listEmpty = () => {
    const { refreshing } = this.state;
    return refreshing ? null : <Empty>No starred repositories</Empty>;
  };

  loadStarred = async () => {
    const { navigation } = this.props;
    const { next, stars } = this.state;
    const user = navigation.getParam('user');

    if (!next) {
      return;
    }

    const page = `/users/${user.login}/starred?page=${next}`;

    const response = await api.get(page);
    const { link } = response.headers;
    const nextPage = link ? parseLinkHeader(link).next : 0;

    this.setState({
      stars: [...stars, ...response.data],
      loading: false,
      refreshing: false,
      next: nextPage,
    });
  };

  handleNavigate = page => {
    const { navigation } = this.props;
    navigation.navigate('Webview', { page });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;
    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <LoadingIcon size={50} />
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadStarred}
            ListFooterComponent={this.renderFooter}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            ListEmptyComponent={this.listEmpty}
            renderItem={({ item }) => (
              <WebviewButton onPress={() => this.handleNavigate(item.html_url)}>
                <ButtonContent accessible>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </ButtonContent>
              </WebviewButton>
            )}
          />
        )}
      </Container>
    );
  }
}
