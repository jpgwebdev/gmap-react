import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 10px;
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
    width: 20px;
    height: 20px;
    background: ${props => (props.borderColor ? props.borderColor : '#999 ')};
    position: absolute;
    bottom: -3px;
    left: 50%;
    margin-left: -10px;
    transform: rotate(45deg);
    z-index: -1;
  }
  &:hover .popup{
    display:block;
  }
`;

const Popup = styled.div`
  background:#fff;
  padding:10px 20px;
  display:none;
  position:absolute;
  border-radius: 10px 10px 10px 0px;
  bottom: 55px;
  width:150px;
  left: 20px;
  z-index:2;
  font-size: 14px;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.3);
`;

const Marker = props => (
  <Wrapper
    {...props}
    {...props.onClick ? { onClick: props.onClick } : {}}
  >
    <Popup className="popup">
      {props.name}
    </Popup>
    <img style={{marginLeft:'0px',marginTop:'0px',width:'24px',height:'24px', zIndex:'2'}} 
    src={'data:image/svg+xml;utf8,'+props.icon} alt="marker"/>
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