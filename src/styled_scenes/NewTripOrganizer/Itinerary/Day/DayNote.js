import React, { useState } from 'react';
import { P } from 'libs/commonStyles';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import { primary } from 'libs/colors';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

export default ({ note }) => {
  const [isUsingEllipsis, setUsingEllipsis] = useState(true);

  return (
    <>
      <P>
        {isUsingEllipsis ? (
          <ResponsiveEllipsis
            onReflow={({ clamped }) => setUsingEllipsis(clamped)}
            text={note || ''}
            maxLine={2}
            ellipsis="..."
          />
        ) : (
          note
        )}
      </P>
      {isUsingEllipsis && (
        <P style={{ cursor: 'pointer', color: primary }} onClick={() => setUsingEllipsis(false)}>
          More
        </P>
      )}
    </>
  );
};
