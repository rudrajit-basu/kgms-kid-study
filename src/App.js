import React from 'react';
import {BrowserView,MobileView} from 'react-device-detect';
import KSDesk from './kgmsComponent/KSDesk';
import KSDevice from './kgmsComponent/KSDevice';
import * as firebase from "firebase/app";
import firebaseConfig from './kgmsComponent/firebaseConfig'

class App extends React.PureComponent {

  render(){
    !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
    return(
      <div style={{scrollBehavior:'smooth'}}>
        <BrowserView>
          <KSDesk firebase={firebase}/>
        </BrowserView>
        <MobileView>
          <KSDevice firebase={firebase}/>
        </MobileView>
      </div>
    );
  }
}

export default App;
