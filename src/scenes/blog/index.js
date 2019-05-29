import React from 'react';
import styled from 'styled-components';
import prismic from 'prismic-javascript';
import { RichText } from 'prismic-reactjs';
import { Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { media } from 'libs/styled';
import headerActions from 'store/header/actions';

import { PageWrapper, PageContent } from 'shared_components/layout/Page';
import BrandFooter from 'shared_components/BrandFooter';
import { Helmet } from 'react-helmet-async';
import Notfound from 'styled_scenes/NotFound';
import { websiteUrl, prismicUrl } from 'libs/config';

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
  height: 426px;
`;

const Header = styled.div`
  background-image: linear-gradient(0, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),
    url(${props => props.image});
  background-size: cover;
  background-position: center;
  width: 100vw;
  position: absolute;
  left: calc(-50vw - -50%);
  height: 426px;
`;

const HeaderText = styled.div`
  color: white;
  position: relative;
  padding-top: 170px;
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

  h2 {
    color: #65afbb;
  }
  h3 {
    color: #097da8;
    font-weight: bold;
  }

  a {
    color: #65afbb;
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
    }
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
    prismic.getApi(prismicUrl).then(async api => {
      try {
        const article = await api.getByUID('article', this.props.match.params.slug);

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

  render() {
    if (this.state.error) {
      return <Notfound />;
    }
    const { article } = this.state;
    let description;
    if (article) {
      description = article.article.find(fraction => fraction.type === 'paragraph');
      if (description) {
        description = description.text;
      }
    }

    return (
      <React.Fragment>
        {article && (
          <Helmet>
            <title>{article.title[0].text} | Deens.com</title>
            <link rel="canonical" href={`${websiteUrl}/${this.props.match.params.slug}`} />
            <meta name="description" content={description} />
            <meta property="og:url" content={`${websiteUrl}/${this.props.match.params.slug}`} />
            <meta property="og:title" content={article.title[0].text} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={article.image.url} />
          </Helmet>
        )}
        <PageWrapper>
          <PageTop>
            <Header image={article ? article.image.url : ''} />
            {article ? (
              <HeaderText>
                <Title>{article.title[0].text}</Title>
                <Subtitle>{description}</Subtitle>
              </HeaderText>
            ) : (
              <Loader />
            )}
          </PageTop>
          <PageContent>
            <PostContent>
              {article ? RichText.render(article.article, null, serializer) : null}
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
