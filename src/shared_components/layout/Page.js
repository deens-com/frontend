import styled, { css } from "styled-components";
import { media } from "../../libs/styled";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  ${props =>
    props.topPush &&
    css`
      margin-top: 65px;

      ${media.minMedium} {
        margin-top: 95px;
      }
    `};
`;

export const PageWrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: ${props => props.padding || "0 10px"};
`;

export const PageContent = styled.main`
  padding: ${props => props.padding || "0"};
  display: ${props => (props.flex ? "flex" : "block")};
`;

export const SectionWrap = styled.section`
  margin-bottom: 50px;
`;

export const More = styled.div`
  margin-left: auto;
`;

export const SectionHeader = styled.header`
  margin-bottom: 35px;
  display: flex;
  align-items: center;

  h3 {
    font-size: 24px;
  }

  a {
    color: #4fb798;
    font-weight: 500;
  }
`;

export const SectionContent = styled.div``;
