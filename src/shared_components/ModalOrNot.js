import React, { Component, Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import history from 'main/history';
import Modal from 'shared_components/Modal';
import LoadingDots from 'shared_components/LoadingDots';
import BrandFooter from 'shared_components/BrandFooter';

class ModalOrNot extends Component {
  render() {
    const modalOrNotComponent = (
      <Suspense fallback={<LoadingDots />}>{this.props.children}</Suspense>
    );

    if (this.props.location.state && this.props.location.state.modal) {
      return (
        <Modal open onCloseRequest={() => history.goBack()}>
          {modalOrNotComponent}
        </Modal>
      );
    }
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 'calc(100vh - 85px)',
        }}
      >
        {modalOrNotComponent}
        <BrandFooter />
      </div>
    );
  }
}

export default withRouter(ModalOrNot);
