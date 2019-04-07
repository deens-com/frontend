import styled from 'styled-components';

export default styled.div`
  text-align: center;

  ul {
    display: inline-block;
    list-style-type: none;

    li {
      float: left;
      margin: 0;
      padding: 0;

      a {
        display: block;
        padding: 5px 12px;
        margin: 0 5px;
        border: 1px solid grey;
        border-radius: 4px;
        cursor: pointer;

        &:focus {
          outline: none;
        }
      }

      &.selected {
        a {
          border: 1px solid #65afbb;
          color: #65afbb;
        }
      }

      &.disabled {
        a {
          visibility: hidden;
        }
      }
    }
  }
`;
