import React, { Suspense } from 'react';
import withErrorBoundary from '../middlewares/WithErrorBoundary';

import withSegmentTracker from '../middlewares/with_segment_tracker';
import LoadingDots from 'shared_components/LoadingDots';

export const commonHOCs = comp => withErrorBoundary(withSegmentTracker(comp));

export const WaitForComponent = Component => {
  return props => (
    <Suspense fallback={<LoadingDots />}>
      <Component {...props} />
    </Suspense>
  );
};

export const asyncCommonHOCs = Component => commonHOCs(WaitForComponent(Component));
