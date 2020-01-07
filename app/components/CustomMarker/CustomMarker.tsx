import React from 'react';
import '../App.scss';
import {Marker} from 'google-maps-react';
class CustomMarker extends React.Component<any, any>{

  constructor(props: any){
    super(props);
  }


  render() {

    return (
    <Marker {...this.props} ></Marker>
    );
  }
}

export default CustomMarker;