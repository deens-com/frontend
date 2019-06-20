import React from 'react';
import styled from 'styled-components';
import prismic from 'prismic-javascript';
import { RichText } from 'prismic-reactjs';
import { Loader } from 'semantic-ui-react';
import LoadingDots from 'shared_components/LoadingDots';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { media } from 'libs/styled';
import headerActions from 'store/header/actions';

import { PageWrapper, PageContent } from 'shared_components/layout/Page';
import BrandFooter from 'shared_components/BrandFooter';
import { Helmet } from 'react-helmet-async';
import Notfound from 'styled_scenes/NotFound';
import { websiteUrl, prismicUrl } from 'libs/config';
import { primary, secondary, tertiary } from 'libs/colors';

function serializer(type, element, content, children, index) {
  switch (type) {
    case 'preformatted':
      return React.createElement('div', {
        key: index,
        dangerouslySetInnerHTML: { __html: element.text },
      });
    default:
      return null;
  }
}

const PageTop = styled.div`
  width: 100%;
  position: relative;
`;

const Header = styled.div`
  background-image: linear-gradient(0, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),
    url(${props => props.image});
  background-size: cover;
  background-position: center;
  width: 100vw;
  position: absolute;
  left: calc(-50vw - -50%);
  height: 100%;
`;

const HeaderText = styled.div`
  color: white;
  position: relative;
  text-align: center;
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 36px;
  line-height: 42px;
  margin: 0 0 36px;
  padding: 0;
  filter: drop-shadow(0 4px 18px rgba(0, 0, 0, 0.11));
  ${media.minMedium} {
    font-size: 48px;
    line-height: 56px;
  }
`;

const Subtitle = styled.h2`
  font-size: 14px;
  line-height: 18px;
  margin: auto;
  padding: 0;
  max-width: 296px;
  ${media.minMedium} {
    font-size: 18px;
    line-height: 22px;
    max-width: 350px;
  }
`;

const PostContent = styled.div`
  max-width: 800px;
  margin: auto;
  font-size: 18px;
  padding-top: 25px;
  margin-bottom: 25px;
  display: flex;
  min-height: 300px;

  h2,
  h3,
  h4,
  h5 {
    padding: 10px 0;
  }

  h2 {
    color: ${secondary};
  }
  h3 {
    color: ${tertiary};
    font-weight: bold;
  }

  a {
    color: ${primary};
    font-weight: bolder;
    text-decoration: underline;
    &:hover {
      color: #097da8;
    }
  }

  img {
    max-width: 100%;
  }

  ol {
    margin-left: 50px;
    list-style: none;
    counter-reset: li;
    margin: 10px 30px !important;

    > li {
      counter-increment: li;
      margin-bottom: 10px;
    }

    > li::before {
      content: counter(li) '.';
      color: #097da8;
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
      margin-right: 3px;
    }
  }

  ul {
    list-style: none;
    margin-left: 50px;
    margin-bottom: 30px;

    > li {
      margin-bottom: 10px;
    }

    > li::before {
      content: '•';
      color: #097da8;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
      margin-right: 3px;
    }
  }

  p {
    margin: 5px 0 10px;
  }

  strong {
    font-weight: bold;
  }

  br {
    line-height: 2;
  }
`;

class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      article: null,
      error: false,
    };
  }

  componentDidMount() {
    this.props.changeHeader({ transparent: true });
    this.getArticle();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.type !== prevProps.type ||
      this.props.match.params.slug !== prevProps.match.params.slug
    ) {
      this.getArticle();
    }
  }

  getArticle() {
    this.setState({
      error: false,
      article: null,
    });
    prismic.getApi(prismicUrl).then(async api => {
      try {
        const article = await api.getByUID(
          this.props.type || 'article',
          this.props.match.params.slug,
        );

        this.setState({
          article: article.data,
        });
      } catch (e) {
        this.setState({
          error: true,
        });
      }
    });
  }

  renderHeader(description) {
    const { article } = this.state;
    if (!this.showHeaderImage()) {
      return (
        <HeaderText style={{ paddingTop: '100px' }}>
          <Title style={{ color: primary }}>{article.title[0].text}</Title>
        </HeaderText>
      );
    }

    return (
      <HeaderText style={{ paddingTop: '170px' }}>
        <Title>{article.title[0].text}</Title>
        <Subtitle>{description}</Subtitle>
      </HeaderText>
    );
  }

  showHeaderImage = () => {
    if (!this.state.article) {
      return this.props.type !== 'legal';
    }
    return Boolean(this.props.type !== 'legal' && this.state.article.image);
  };

  render() {
    if (this.state.error) {
      return <Notfound />;
    }
    const { article } = this.state;
    let description;
    if (article && this.props.type !== 'legal') {
      if (article.subtitle) {
        description = article.subtitle;
      } else {
        description = article.article.find(fraction => fraction.type === 'paragraph');
        if (description) {
          description = description.text;
        }
      }
    }

    return (
      <React.Fragment>
        {article && (
          <Helmet>
            <title>{article.title[0].text} | Deens.com</title>
            <link rel="canonical" href={`${websiteUrl}/${this.props.match.params.slug}`} />
            {description && <meta name="description" content={description} />}
            <meta property="og:url" content={`${websiteUrl}/${this.props.match.params.slug}`} />
            <meta property="og:title" content={article.title[0].text} />
            {description && <meta property="og:description" content={description} />}
            {this.showHeaderImage() && <meta property="og:image" content={article.image.url} />}
          </Helmet>
        )}
        <PageWrapper>
          <PageTop style={{ height: this.showHeaderImage() ? '426px' : 'auto' }}>
            {this.showHeaderImage() && <Header image={article ? article.image.url : ''} />}
            {article ? this.renderHeader(description) : null}
          </PageTop>
          <PageContent>
            <PostContent>
              {article ? RichText.render(article.article, null, serializer) : <LoadingDots />}
            </PostContent>
          </PageContent>
        </PageWrapper>
        <BrandFooter />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ changeHeader: headerActions.changeHeader }, dispatch);
};

export default connect(
  null,
  mapDispatchToProps,
)(BlogPost);
