import React from 'react';
import PropTypes from 'prop-types';

const DetailsIconLinkFormGroup = props => (
  <div>
    <a href={props.href} title={props.title} target={props.inWindow ? '_self' : '_blank'}>
      <div className="form-group">
        <div className="col-xs-12" style={{ marginBottom: '10px' }}>
          <span style={{ marginRight: '5px' }}>{props.icon}</span>
          <span style={{ fontWeight: 'bold' }}>{props.label}</span>
        </div>
      </div>
    </a>
  </div>
);

DetailsIconLinkFormGroup.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.node,
  href: PropTypes.string,
  title: PropTypes.string,
  inWindow: PropTypes.bool,
};

DetailsIconLinkFormGroup.defaultProps = {
  label: '',
  icon: <span></span>,
  href: 'www.ashevillenc.gov',
  title: 'City of Asheville Website',
  inWindow: false,
};

export default DetailsIconLinkFormGroup;
