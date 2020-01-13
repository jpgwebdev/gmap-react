import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 25px;
  height: 25px;
  background-color: ${props => (props.borderColor ? props.borderColor : '#999 ')};
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: ${props => (props.onClick ? 'pointer' : 'default')};
  &:hover {
    z-index: 1;
  }
  &:after {
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    background: ${props => (props.borderColor ? props.borderColor : '#999 ')};
    position: absolute;
    bottom: 0px;
    left: 0px;
    z-index: -1;
  }
  &:hover .popup{
    display:block;
  }
`;

const Popup = styled.div`
  background:#fff;
  padding:5px;
  display:none;
  position:absolute;
  border-radius:4px;
  bottom:30px;
  width:100px;
  z-index:2;
`;

const Marker = props => (
  <Wrapper
    {...props}
    {...props.onClick ? { onClick: props.onClick } : {}}
  >
    <Popup className="popup">
      {props.name}
    </Popup>
    <img style={{marginLeft:'5px',marginTop:'3px',width:'17px',height:'17px', zIndex:'2'}} 
    src={'data:image/svg+xml;utf8,'+props.icon} alt="aeropuerto"/>
  </Wrapper>
);

Marker.defaultProps = {
  onClick: null,
};

Marker.propTypes = {
  borderColor: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  name: PropTypes.string
};

export default Marker;