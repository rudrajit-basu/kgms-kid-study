import React from 'react';
import './DStyle.css';
import HH from './images/HH.png';
import H4 from './images/H4.png';
import M1 from './images/M1.png';
import M2 from './images/M2.png';
import M3 from './images/M3.png';
import F1 from './images/F1.png';
import LO from './images/LO.png';
import O1 from './images/O1.png';
import O3 from './images/O3.png';
import KSLogin from './KSLogin';
import KStudy from './KStudy';
import "firebase/firestore";
import "firebase/analytics";

const KB1 = <img src={M3} alt="M3" style={{width:'23%'}} className="noSelect pt-page-moveFromBottomFade" referrerPolicy="same-origin"/>;
const KB2 = <img src={M2} alt="M2" style={{width:'29%'}} className="noSelect pt-page-moveFromBottomFade" referrerPolicy="same-origin"/>;
const KB3 = <img src={M1} alt="M1" style={{width:'22%'}}className="noSelect pt-page-moveFromBottomFade" referrerPolicy="same-origin"/>;
const KO1 = <img src={O1} alt="O1" style={{width:'70%'}} className="noSelect ImgTilt pt-page-moveFromBottomFade" referrerPolicy="same-origin"/>;
const KO3 = <img src={O3} alt="O3" style={{width:'55%'}} className="noSelect ImgTilt2 pt-page-moveFromBottomFade" referrerPolicy="same-origin"/>;
const KB4 = <img src={M2} alt="M2" style={{width:'29%'}} className="noSelect ImgTilt3 pt-page-moveFromBottomFade" referrerPolicy="same-origin"/>;

const imgArr = [KB1,KB2,KB3,KO3,KB4];


class KSDesk extends React.PureComponent {

	constructor(props){
		super(props);
		this.state = {isLogin: false, isModalLogOut: false, kBodyHeight: 0, kBodyNum: [], KClassName: "",
						KStudies:[{id:0,header:"Please wait... Fetching Events >>",desc:""}], KMediaId: "",
						isDImgModal: false, DImgModalSrc: '', isDVidModal: false, DVidModalSrc: '', 
						isShowLoading: true, isDAudModal: false, isShowAudLoading: true, DAudModalSrc: ''}
		this.getBodyContent = this.getBodyContent.bind(this);
		this.handleLogOutModalStart = this.handleLogOutModalStart.bind(this);
		this.handleLogOutModalClose = this.handleLogOutModalClose.bind(this);
		this.handleKSLogIn = this.handleKSLogIn.bind(this);
		this.handleKSLogOut = this.handleKSLogOut.bind(this);
		this.getBodyLeftDecoration = this.getBodyLeftDecoration.bind(this);
		this.getBodyRightDecoration = this.getBodyRightDecoration.bind(this);
		this.handleCurrentDecoList = this.handleCurrentDecoList.bind(this);
		this.handleHistoryPop = this.handleHistoryPop.bind(this);
		this.checkCredentials = this.checkCredentials.bind(this);
		this.fetchKgmsStudy = this.fetchKgmsStudy.bind(this);
		this.handleStartDImgModal = this.handleStartDImgModal.bind(this);
		this.handleCloseDImgModal = this.handleCloseDImgModal.bind(this);
		this.handleStartDVidModal = this.handleStartDVidModal.bind(this);
		this.handleCloseDVidModal = this.handleCloseDVidModal.bind(this);
		this.handleDOnYtLoad = this.handleDOnYtLoad.bind(this);
		this.handleStartDAudModal = this.handleStartDAudModal.bind(this);
		this.handleCloseDAudModal = this.handleCloseDAudModal.bind(this);
		this.handleOnAudioLoad = this.handleOnAudioLoad.bind(this);
		this.getAudioPlayer = this.getAudioPlayer.bind(this);
		this.getVideoPlayer = this.getVideoPlayer.bind(this);
		this.bodyRef = React.createRef();
	}


	async fetchKgmsStudy(db,kStudyDoc){

		// let db = this.props.firebase.firestore();
		db.collection("kgms-classes").doc(kStudyDoc).collection("kgms-study").orderBy("studyNumber")
			.onSnapshot((querySnapshot) => {
				let kstudies = [];
				querySnapshot.forEach((doc) => {
					// console.log(`${doc.id} => ${doc.data().desc}`);
					kstudies.push({id: doc.data().studyNumber, header: doc.data().header, 
						subHeader: doc.data().subHeader, desc: doc.data().desc});
				});

				if(kstudies.length > 0){
					this.setState({KStudies: kstudies});
				}else{
					this.setState({KStudies: [{id: 0, header: "No study available !", desc: ""}]});
				}

			},(error)=>{
				this.setState({KStudies: [{id: 0, header: "Something went wrong. Please try later !", desc: ""}]});
				// console.log(`Error: ${error}`);
			});
	}

	checkCredentials(userId, password){
		// console.log(`userId: ${userId} password: ${password}`);
		let db = this.props.firebase.firestore();
		return new Promise((resolve,reject) => {
			db.collection("kgms-classes").where("classPassword", "==", password.trim().toLowerCase()).limit(1)
			.get()
			.then((querySnapshot)=>{
				if(querySnapshot.empty){
					// console.log('doc empty');
					reject("Not Success!");
				} else {
						querySnapshot.forEach((doc) => {
				            // doc.data() is never undefined for query doc snapshots
				            // console.log(doc.id, " => ", doc.data());
				            if(doc.data().classId.toLowerCase() === userId.trim().toLowerCase()){
				            	this.setState({KClassName: doc.data().className, KMediaId: doc.data().classId});
				            	this.fetchKgmsStudy(db,doc.id);
				            	resolve("Success!");
				            }else{
				            	reject("Not Success!");
				            }
			        	});
					}
				
			})
			.catch((error)=>{
				// console.log("Error getting document:", error);
				reject("Not Success!");
			});
		});	
	}

	handleHistoryPop(event){
		event.preventDefault();
		// console.log(`History state: ${JSON.stringify(event.state)}`);
		if(event.state !== null){
			if(this.state.isLogin){
				if(this.state.isDImgModal){
					this.handleCloseDImgModal(event);
				}else if(this.state.isDVidModal){
					this.handleCloseDVidModal(event);
				}
				this.handleLogOutModalStart(event);
			}else{
				window.history.back();
			}
		}else{
			window.history.back();
		}
	}

	handleKSLogIn(){
		this.setState({isLogin: true});
		window.history.pushState({page: 'KStudy'},'','');
	}

	handleKSLogOut(event){
		this.setState({isModalLogOut: false, isLogin: false, kBodyHeight: 0, kBodyNum: [], KClassName: "",
				KStudies:[{id:0,header:"Please wait... Fetching Events >>",desc:""}], KMediaId: ""});
		event.preventDefault();
	}

	async handleLogOutModalStart(event){
		this.setState({isModalLogOut: true});
		event.preventDefault();
	}

	handleLogOutModalClose(event){
		this.setState({isModalLogOut: false});
		event.preventDefault();
	}

	handleStartDImgModal(src){
		this.setState({isDImgModal: true, DImgModalSrc: src});	
	}

	handleCloseDImgModal(event){
		this.setState({isDImgModal: false, DImgModalSrc: ''});
		event.preventDefault();
	}

	handleStartDVidModal(src){
		this.setState({isDVidModal: true, DVidModalSrc: src});	
	}

	handleCloseDVidModal(event){
		this.setState({isDVidModal: false, DVidModalSrc: '', isShowLoading: true});
		event.preventDefault();
	}

	handleDOnYtLoad(event){
		if(this.state.isDVidModal){
			// console.log('yeah d');
			this.setState({isShowLoading: false});
		}
		event.preventDefault();
	}

	handleStartDAudModal(){
		// console.log(`load audio file --> ${src}`);
		// this.setState({isDAudModal: true, DAudModalSrc: src});
		this.setState({isDAudModal: true});
	}

	handleCloseDAudModal(event){
		this.setState({isDAudModal: false, DAudModalSrc: '', isShowAudLoading: true});
		event.preventDefault();
	}

	handleOnAudioLoad(event){
		// console.log('player can play !');
		if(this.state.isDAudModal){
			this.setState({isShowAudLoading: false});
		}
		event.preventDefault();
	}

	getAudioPlayer(src){
		if(src !== ''){
			return(
				<div style={{visibility: this.state.isShowAudLoading ? 'hidden' : 'visible'}} className="dTaskAudioControl">
					<audio controls autoPlay onCanPlay={this.handleOnAudioLoad}>
					  <source src={src} type="audio/mpeg"/>
					</audio>
				</div>
			);
		} else {
			return(
				<div/>
			);
		}
	}

	getVideoPlayer(src){
		if(src !== ''){
			return(
				<div className="dTaskVideoContainer">
					<div align="center" style={{display: this.state.isShowLoading ? 'block' : 'none'}}>
						<h3 className="dLoadingTag">{'Loading...'}</h3></div>
					<iframe className="dTaskVideo" src={src} samesite="None; secure"
						title="modal video" type="text/html" allowFullScreen="allowfullscreen" referrerPolicy="same-origin"
						frameBorder="0" loading="lazy" onLoad={this.handleDOnYtLoad}/>
				</div>
			);
		} else {
			return(
				<div/>
			);
		}
	}

	getBodyContent(loginState){
		if(!loginState){
			return(
				<div key={'KSLogin'} style={{width:'100%'}} align="center" className="pt-page-rotateUnfoldRight">
					<div className="SeaBlue BorderRound dLoginContent BoxShadow">
						<KSLogin kLogIn={() => this.handleKSLogIn()} chkUser={(uid, pwd) => this.checkCredentials(uid, pwd)}/>
					</div>
				</div>
			);
		} else {
			return(
				<div className="pt-page-rotateUnfoldRight" key={'KStudy'} style={{width:'100%'}}>
					<div className="Orange BorderRound dKStudyContent BoxShadow">
						<KStudy handleDeco={()=>this.handleCurrentDecoList()} kgmsClassName={this.state.KClassName}
								kgmsStudies={this.state.KStudies} kgmsMediaId={this.state.KMediaId} 
								firebase={this.props.firebase} handleStartImgModal={(src) => this.handleStartDImgModal(src)}
								handleStartVideoModal={(src) => this.handleStartDVidModal(src)}
								handleStartAudioModal={() => this.handleStartDAudModal()}
								handleSetAudioSrc={(src) => this.setState({DAudModalSrc: src})}/>
					</div>
				</div>
			);
		}
	}

	async handleCurrentDecoList(){
		if(this.bodyRef.current !== null){
			let bHeight = this.bodyRef.current.clientHeight;
			if( bHeight !== undefined && bHeight > 0){
				let i = bHeight / 500;
				let j = Math.floor(i);
				// console.log(`j = ${j} & height = ${bHeight}`);
				let k = [];
				while(j > 0){
					k.push(j);
					j--;
				}
				this.setState({kBodyNum: k});
			}
		}
	}


	getBodyRightDecoration(loginState){

		if(!loginState){
			return(
				<div key={'KSLogin-right-images'}>
					<div align="center">
						{imgArr[1]}
					</div>
					<div align="center" style={{marginTop: '80%'}}>
						{imgArr[2]}
					</div>
				</div>
			);
		} else {
				let rNum = 3;
				let decoR = this.state.kBodyNum.map((dList) => {
						if(rNum === 5){
							rNum = 0;
						}
						return(
							<div style={{marginTop:'220%'}} key={dList.toString()} align="center">
								{imgArr[rNum++]}
							</div>
						);	
					});
				return(
					<div>
						<div align="center">
							{imgArr[1]}
						</div>
						{decoR}
					</div>
				);
		}

	}	

	getBodyLeftDecoration(loginState){

			if(!loginState){
				return(
					<div key={'KSLogin-left-images'}>
						<div align="center">
							{imgArr[0]}
						</div>
						<div align="center" style={{marginTop: '80%'}}>
							{KO1}
						</div>
					</div>
				);
			} else{
					let lNum = 2;
					let decoL = this.state.kBodyNum.map((dList) => {
						if(lNum === 5){
							lNum = 0;
						}
						return(
							<div style={{marginTop:'220%'}} key={dList.toString()} align="center">
								{imgArr[lNum++]}
							</div>
						);	
					});
					return (
						<div>
							<div align="center">
								{imgArr[0]}
							</div>
							{decoL}
						</div>
					);
			}

	}


	componentDidMount(){
		window.history.replaceState({page: 'kLogin'},'','');
		window.addEventListener('popstate', this.handleHistoryPop, false);
		this.onEscapeKeyDown = (event) => {
			if(event.keyCode === 27){
				if(this.state.isDImgModal){
					this.handleCloseDImgModal(event);
				}else if(this.state.isDVidModal){
					this.handleCloseDVidModal(event);
				}else if(this.state.isDAudModal){
					this.handleCloseDAudModal(event);
				}
			}
		};
		window.addEventListener('keydown', this.onEscapeKeyDown, false);
		this.props.firebase.analytics();
	}

	componentWillUnmount(){
		window.removeEventListener('popstate',this.handleHistoryPop,false);
		window.removeEventListener('keydown', this.onEscapeKeyDown, false);
	}


	render(){
		const log_out_btn = <input type="image" src={LO} alt="log_out" className="dLog-out noSelect pt-page-rotateUnfoldTop"
								style={{visibility: this.state.isLogin ? 'visible' : 'hidden'}} 
								key={this.state.isLogin.toString()} onClick={this.handleLogOutModalStart}/>;
		return(
			<div className="App" /*app starts*/>
				<div style={{marginTop:'20px'}} /*header starts*/>
					<div className="Row">
						<div className="Column HeaderLeft" align="center">
							{log_out_btn}
						</div>
						<div className="Column HeaderMiddle" align="center" style={{marginTop:'2.5em'}}>
							<img src={HH} alt="kgms" style={{width: '90%'}} className="noSelect" referrerPolicy="same-origin"/>
						</div>
						<div className="Column HeaderRight" align="center">
							<img src={H4} alt="sun" style={{width: '65%'}} className="noSelect" referrerPolicy="same-origin"/>
						</div>
					</div>
				</div /*header ends*/>
				<div style={{marginTop:'2.5em'}} ref={this.bodyRef} /*body starts*/>
					<div className="Row">
						<div className="Column BodyLeft" style={{marginTop:'1em'}}>
							{this.getBodyLeftDecoration(this.state.isLogin)}
						</div>
						<div className="Column BodyMiddle" >
							{this.getBodyContent(this.state.isLogin)}
						</div>
						<div className="Column BodyRight" style={{marginTop:'1em'}}>
							{this.getBodyRightDecoration(this.state.isLogin)}
						</div>
					</div>
				</div /*body ends*/>
				<div style={{display: this.state.isModalLogOut ? 'block' : 'none'}} className="dLogOutModal" /*modal starts*/>
					<div className="dLogOutModalContent BorderRound" align="center">
						<h4>{'Please confirm to Log Out !'}</h4>
						<div className="dLogOutModalBtnContainer">
							<div className="Row">
								<div className="Column dLogOutLeft">
									<span className="dLogOutModalActionBtn"
										onClick={this.handleKSLogOut}>&#10003;</span>
								</div>
								<div className="Column dLogOutRight">
									<span className="dLogOutModalActionBtn" 
										onClick={this.handleLogOutModalClose}>&#10007;</span>
								</div>
							</div>
						</div>
					</div>
				</div /*modal ends*/>
				<div style={{display: this.state.isDImgModal ? 'block' : 'none'}} 
					className="dImgModal" /*image modal starts*/>
					<span className="dImgModalClose" 
						onClick={this.handleCloseDImgModal}>&times;</span>
					<div > 
						<img src={this.state.DImgModalSrc} alt="modal img" 
							className="dImgModalImage" referrerPolicy="same-origin"/>
					</div>
				</div /*image modal ends*/>
				<div style={{display: this.state.isDVidModal ? 'block' : 'none'}} 
					className="dImgModal" /*video modal starts*/>
					<span className="dImgModalClose" 
						onClick={this.handleCloseDVidModal}>&times;</span>
					<div> 
						{this.getVideoPlayer(this.state.DVidModalSrc)}
					</div>
				</div /*video modal ends*/>
				<div style={{display: this.state.isDAudModal ? 'block' : 'none', overflowX: 'hidden'}} 
					className="dImgModal" /*audio modal starts*/>
					<span className="dImgModalClose" 
						onClick={this.handleCloseDAudModal}>&times;</span>
					<div > 
						<div className="dTaskAudioContainer" align="center">
							<div style={{display: this.state.isShowAudLoading ? 'block' : 'none'}}>
								<h3 className="dLoadingTag">{'Loading...'}</h3></div>	
							{this.getAudioPlayer(this.state.DAudModalSrc)}
						</div>
					</div>
				</div /*audio modal ends*/>
				<div /*footer starts*/>
					<div align="center" style={{width: '100vw', marginTop:'3.2em'}}>
						<img src={F1} alt="footer" style={{width:'75vw'}} className="noSelect" referrerPolicy="same-origin"/>
					</div>
				</div /*footer ends*/>
			</div /*app ends*/>
		);
	}
}

export default KSDesk;