import React from 'react';
import './K1.css';
import C1 from './images/C1.png';
import {isMobile} from 'react-device-detect';

class KSLogin extends React.PureComponent {

	constructor(props){
		super(props);
		this.state = {uidV:'', pwdV:'', isLValid: true, lMsg: '',isSpinner: false};
		this.handleLChange = this.handleLChange.bind(this);
		this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
		this.uidInp = React.createRef();
		this.pwdInp = React.createRef();
	}


	componentDidMount(){
		// this.uidInp.current.focus();
	}

	handleLChange(event){
		if(event.target.name === 'userId'){
			this.setState({uidV: event.target.value});
		}else if(event.target.name === 'passwd'){
			this.setState({pwdV: event.target.value});
		}
		event.preventDefault();
	}

	async handleLoginSubmit(event){
		event.preventDefault();
		
		this.pwdInp.current.blur();
		
		if(!this.state.isLValid){
			this.setState({isLValid: true,lMsg: ''});
		}

		if(this.state.uidV === ''){
			this.setState({isLValid: false,lMsg: 'Empty Class Id !'});
		}else{
			if(this.state.pwdV === ''){
				this.setState({isLValid: false,lMsg: 'Empty Password !'});
			}else{
				// this.setState({isLValid: false,lMsg: 'Wrong Credentials !'});
				// console.log(`userId: ${this.state.uidV.toLowerCase()} password: ${this.state.pwdV}`);
				this.setState({isSpinner: true});
				this.props.chkUser(this.state.uidV, this.state.pwdV)
				.then((info)=>{
					// console.log('login: ',info);
					this.setState({isSpinner: false});
					this.props.kLogIn();
				})
				.catch((reason) => {
					// console.log('login: ',reason);
					this.setState({isLValid: false,lMsg: 'Wrong Credentials !'});
					this.setState({isSpinner: false});
				});
			}
		}
		// this.props.kLogIn();

		// this.setState({isSpinner: true});
	}

	render(){

		return(
			<div style={{position: 'relative'}} /*login starts*/>
				<div align="center">
					<h2 className={isMobile ? 'mTextHead' : 'dTextHead'}>{'@ Student Login ->'}</h2>
				</div>
					<form onSubmit={this.handleLoginSubmit}>
					<div className="mTextBlk">
						<fieldset className="mLoginFieldset" onClick={() => this.uidInp.current.focus()}
							style={{color: this.state.isLValid ? '	rgb(25,25,25)' : 'rgb(139,0,0)'}}>
							<input type="text" name="userId" className={isMobile ? 'mLoginInp' : 'dLoginInp'} 
								onChange={this.handleLChange} autoComplete="off" ref={this.uidInp} 
								placeholder="<- Your Class Id"/>
							<label className={isMobile ? (this.state.uidV === '' ? 'mLoginLabel' : 'mLoginLabelS') :
														 (this.state.uidV === '' ? 'dLoginLabel' : 'dLoginLabelS')}>
								Class Id *</label>
						</fieldset>
						<div className={isMobile ? 'mGap1' : 'dGap1'}/>
						<fieldset className="mLoginFieldset" onClick={() => this.pwdInp.current.focus()}
							style={{color: this.state.isLValid ? '	rgb(25,25,25)' : 'rgb(139,0,0)'}}>
							<input type="password" name="passwd" className={isMobile ? 'mLoginInp' : 'dLoginInp'}
								onChange={this.handleLChange} autoComplete="off" ref={this.pwdInp} 
								placeholder="<- Your Password"/>
							<label className={isMobile ? (this.state.pwdV === '' ? 'mLoginLabel' : 'mLoginLabelS') :
														 (this.state.pwdV === '' ? 'dLoginLabel' : 'dLoginLabelS')}>
								Password *</label>
						</fieldset>
			            <div className={isMobile ? 'mGap1' : 'dGap1'}/>
			            <div className="Row" style={{marginBottom: '0.5em'}}>
			            	<div className="Col-loginLeft">
			            		<h4 className={isMobile ? 'mWcr' : 'dWcr'} 
			            			style={{visibility: this.state.isLValid ? 'none' : 'visible'}}>
			            			{this.state.lMsg}</h4>
			            	</div>
			            	<div className="Col-loginRight">
			            		<input type="submit" value="Submit !" 
			            			className={isMobile ? 'InpSubmitLogin mInpSubmitWidth' : 'dInpSubmitLogin dInpSubmitWidth'}/>
			            	</div>
			            </div>
					</div>
					</form>
					<div style={{display: this.state.isSpinner ? 'block':'none'}} 
						className={isMobile ? 'kc-modal' : 'dKc-modal'} align={isMobile ? '':'left'}>
						<img src={C1} alt="cloud loading" className={isMobile ? 'kc-img noSelect' : 'dKc-img noSelect'}/>
					</div>
			</div /*login ends*/>
		);
	}
}

export default KSLogin;