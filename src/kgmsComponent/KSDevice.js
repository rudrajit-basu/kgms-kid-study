import React, {Suspense} from 'react';
import './MStyle.css';
import HHM from './images/HHM.png';
import H4 from './images/H4.png';
import LO from './images/LO.png';
import F1 from './images/F1.png';
// import KSLogin from './KSLogin';
// import KStudy from './KStudy';
import "firebase/firestore";
import "firebase/analytics";

const KSLogin = React.lazy(() => import('./KSLogin'));
const KStudy = React.lazy(() => import('./KStudy'));

class KSDevice extends React.PureComponent {

	constructor(props){
		super(props);
		this.state = {isMLogin: false, isModalLogOut: false, KMClassName: "", KMediaId: "",
						KMStudies:[{id:0,header:"Please wait... Fetching Events >>",desc:""}],
						isMImgModal: false, MImgModalSrc: '', isMVidModal: false, MVidModalSrc: '', 
						isMShowLoading: true, isMAudModal: false, isMShowAudLoading: true, MAudModalSrc: '',
						ismFooterAnimation: false, handleMNavBtn: undefined, showMNavBar: false, 
						showMNavVidBtn: false, showMNavImgBtn: false, showMNavAudBtn: false}
		this.getmBodyContent = this.getmBodyContent.bind(this);
		this.handleMKSLogin = this.handleMKSLogin.bind(this);
		this.handleMKSLogOut = this.handleMKSLogOut.bind(this);
		this.handleLogOutModalStart = this.handleLogOutModalStart.bind(this);
		this.handleLogOutModalClose = this.handleLogOutModalClose.bind(this);
		this.handleHistoryPop = this.handleHistoryPop.bind(this);
		this.fetchMKgmsStudy = this.fetchMKgmsStudy.bind(this);
		this.checkMCredentials = this.checkMCredentials.bind(this);
		this.handleStartMImgModal = this.handleStartMImgModal.bind(this);
		this.handleCloseMImgModal = this.handleCloseMImgModal.bind(this);
		this.handleStartMVidModal = this.handleStartMVidModal.bind(this);
		this.handleCloseMVidModal = this.handleCloseMVidModal.bind(this);
		this.handleMOnYtLoad = this.handleMOnYtLoad.bind(this);
		this.handleStartMAudModal = this.handleStartMAudModal.bind(this);
		this.handleCloseMAudModal = this.handleCloseMAudModal.bind(this);
		this.handleOnMAudioLoad = this.handleOnMAudioLoad.bind(this);
		this.getMAudioPlayer = this.getMAudioPlayer.bind(this);
		this.getMVideoPlayer = this.getMVideoPlayer.bind(this);
		this.handleFooterAnimation = this.handleFooterAnimation.bind(this);
		this.handleShowMNavBtn = this.handleShowMNavBtn.bind(this);
	}

	async fetchMKgmsStudy(db,kStudyDoc){

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
					this.setState({KMStudies: kstudies});
				}else{
					this.setState({KMStudies: [{id: 0, header: "No study available !", desc: ""}]});
				}

			},(error)=>{
				this.setState({KMStudies: [{id: 0, header: "Something went wrong. Please try later !", desc: ""}]});
				// console.log(`Error: ${error}`);
			});
	}

	checkMCredentials(userId, password){
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
			            	this.setState({KMClassName: doc.data().className, KMediaId: doc.data().classId});
			            	this.fetchMKgmsStudy(db,doc.id);
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
		// console.log(`History state length: ${window.history.length}`);
		if(event.state !== null){
			if(this.state.isMLogin){
				if(this.state.isMImgModal){
					this.handleCloseMImgModal(event);
				}else if(this.state.isMVidModal){
					this.handleCloseMVidModal(event);
				}
				this.handleLogOutModalStart(event);
			}else{
				// console.log('this.state.isMLogin === false');
				window.history.back();	
			}
		}else{
			// console.log('event.state === null');
			window.history.back();
		}
	}

	componentDidMount(){
		window.addEventListener('popstate', this.handleHistoryPop, false);
		window.history.replaceState({page: 'mLogin'},'','');
		this.props.firebase.analytics();
	}

	componentWillUnmount(){
		window.removeEventListener('popstate',this.handleHistoryPop,false);
	}

	handleMKSLogin(){
		window.scrollTo(0, 0);
		this.setState({isMLogin: true});
		window.history.pushState({page: 'mStudy'},'','');
	}

	handleMKSLogOut(event){
		this.setState({isModalLogOut: false,isMLogin: false, KMClassName: "", KMediaId: "",
					KMStudies:[{id:0,header:"Please wait... Fetching Events >>",desc:""}]});
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

	handleStartMImgModal(src){
		this.setState({isMImgModal: true, MImgModalSrc: src});	
	}

	handleCloseMImgModal(event){
		this.setState({isMImgModal: false, MImgModalSrc: ''});
		event.preventDefault();
	}

	handleStartMVidModal(src){
		this.setState({isMVidModal: true, MVidModalSrc: src});	
	}

	handleCloseMVidModal(event){
		this.setState({isMVidModal: false, MVidModalSrc: '', isMShowLoading: true});
		event.preventDefault();
	}

	handleMOnYtLoad(event){
		if(this.state.isMVidModal){
			// console.log('yeah');
			this.setState({isMShowLoading: false});
		}
		event.preventDefault();
	}

	handleStartMAudModal(){
		// console.log(`load audio file --> ${src}`);
		this.setState({isMAudModal: true});	
	}

	handleCloseMAudModal(event){
		this.setState({isMAudModal: false, isMShowAudLoading: true, MAudModalSrc: ''});
		event.preventDefault();
	}

	handleOnMAudioLoad(event){
		// console.log('player can play !');
		if(this.state.isMAudModal){
			this.setState({isMShowAudLoading: false});
		}
		event.preventDefault();
	}

	getMAudioPlayer(src){
		if(src !== ''){
			return(
				<div style={{visibility: this.state.isMShowAudLoading ? 'hidden' : 'visible'}} className="mTaskAudioControl">
					<audio controls autoPlay onCanPlay={this.handleOnMAudioLoad}>
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

	getMVideoPlayer(src){
		if(src !== ''){
			return(
				<div className="mTaskVideoContainer">
					<div align="center" style={{display: this.state.isMShowLoading ? 'block' : 'none'}}>
						<p className="mTextMainWhiteTag">{'Loading...'}</p></div>
					<iframe className="dTaskVideo" src={src} samesite="None; secure"
						title="modal video" type="text/html" allowFullScreen="allowfullscreen" referrerPolicy="same-origin"
						frameBorder="0" loading="lazy" onLoad={this.handleMOnYtLoad}/>
				</div>
			);
		} else {
			return(
				<div/>
			);	
		}
	}

	async handleFooterAnimation(event) {
		this.setState(prevState=>({ismFooterAnimation: !prevState.ismFooterAnimation}));
		event.preventDefault();
	}

	handleShowMNavBtn(btn){
		if(btn === 'video'){
			this.setState({showMNavVidBtn: true});
		}else if(btn === 'image'){
			this.setState({showMNavImgBtn: true});
		} else if(btn === 'audio'){
			this.setState({showMNavAudBtn: true});
		}
	}

	getmBodyContent(loginState){
		const suspenseLoading = <div className='mTextMainDesc' align='center'>Loading...</div>;
		if(!loginState){
			return(
				<Suspense fallback={suspenseLoading}>
				<div key={'mKSLogin'} className="mSeaBlue mBord pt-page-rotateUnfoldRight">
					<div className="mBodyContent2">
						<KSLogin kLogIn={() => this.handleMKSLogin()} chkUser={(uid, pwd) => this.checkMCredentials(uid, pwd)}/>
					</div>
				</div>
				</Suspense>
			);
		} else {
			return(
				<Suspense fallback={suspenseLoading}>
				<div key={'mKStudy'} className="mOrange mBord pt-page-rotateUnfoldRight">
					<div className="mBodyContent2">
						<KStudy kgmsClassName={this.state.KMClassName} kgmsStudies={this.state.KMStudies}
								kgmsMediaId={this.state.KMediaId} firebase={this.props.firebase}
								handleStartImgModal={(src) => this.handleStartMImgModal(src)}
								handleStartVideoModal={(src) => this.handleStartMVidModal(src)}
								handleStartAudioModal={() => this.handleStartMAudModal()}
								handleSetAudioSrc={(src) => this.setState({MAudModalSrc: src})}
								handleSetNavBarOnClick={(src) => this.setState({handleMNavBtn: src})}
								handleShowNavBtn={(src) => this.handleShowMNavBtn(src)} showNavBar={this.state.showMNavBar}
								setShowNavBar={(src) => this.setState({showMNavBar: src})}/>
					</div>
				</div>
				</Suspense>
			);
		}
	}

	render(){
		const mLog_out_btn = <input type="image" src={LO} alt="log_out"
								style={{visibility: this.state.isMLogin ? 'visible' : 'hidden'}} 
								key={this.state.isMLogin.toString()} onClick={this.handleLogOutModalStart}
								className="mLog-out noSelect pt-page-rotateUnfoldTop"/>;
		const mIcBtnCss = 'material-icons mNavIconButton noSelect';						
		
		return(
			<div className="mApp" /*app starts*/>
				<div className="Row" /*header starts*/>
					<div className="Column mTopLeft" >
						{mLog_out_btn}
					</div>
					<div className="Column mTopRight" align="right">
						<img src={H4} alt="sun" className="mSun noSelect" referrerPolicy="same-origin" loading="lazy"/>
					</div>
				</div>
				<div align="left" className="mHDiv">
						<img src={HHM} alt="kgms" className="mHH noSelect" referrerPolicy="same-origin" loading="lazy"/>
				</div /*header ends*/>
				<div style={{width:'100%'}} /*body starts*/>
					<div className="mBodyContent1">
						{this.getmBodyContent(this.state.isMLogin)}
					</div>
				</div /*body ends*/>
				<div style={{display: this.state.isModalLogOut ? 'block' : 'none'}} className="mLogOutModal" /*modal starts*/>
					<div className="mLogOutModalContent mBord" align="center">
						<h4>{'Please confirm to Log Out !'}</h4>
						<div className="mLogOutModalBtnContainer">
							<div className="Row">
								<div className="Column mLogOutLeft">
									<span className="mLogOutModalActionBtn"
										onClick={this.handleMKSLogOut}>&#10003;</span>
								</div>
								<div className="Column mLogOutRight">
									<span className="mLogOutModalActionBtn" 
										onClick={this.handleLogOutModalClose}>&#10007;</span>
								</div>
							</div>
						</div>
					</div>
				</div /*modal ends*/>
				<div style={{display: this.state.isMImgModal ? 'block' : 'none'}} 
					className="mImgModal" /*image modal starts*/>
					<span className="mImgModalClose" 
						onClick={this.handleCloseMImgModal}>&times;</span>
					<div > 
						<img src={this.state.MImgModalSrc} alt="modal img" 
							className="mImgModalImage" referrerPolicy="same-origin" loading="lazy"/>
					</div>
				</div /*image modal ends*/>
				<div style={{display: this.state.isMVidModal ? 'block' : 'none'}} 
					className="mImgModal" /*video modal starts*/>
					<span className="mImgModalClose" 
						onClick={this.handleCloseMVidModal}>&times;</span>
					<div> 
						{this.getMVideoPlayer(this.state.MVidModalSrc)}
					</div>
				</div /*video modal ends*/>
				<div style={{display: this.state.isMAudModal ? 'block' : 'none', overflowX: 'hidden'}} 
					className="mImgModal" /*audio modal starts*/>
					<span className="mImgModalClose" 
						onClick={this.handleCloseMAudModal}>&times;</span>
					<div>
						<div className="mTaskAudioContainer" align="center">
							<div style={{display: this.state.isMShowAudLoading ? 'block' : 'none'}}>
								<p className="mTextMainWhiteTag">{'Loading...'}</p></div>
							{this.getMAudioPlayer(this.state.MAudModalSrc)}
						</div>
					</div>
				</div /*audio modal ends*/>
				<div align="center" className='mNavButtonBar pt-page-moveFromTopFade' 
					style={{display: this.state.showMNavBar ? 'block' : 'none'}} key="kMNavBar" /*nav bar starts*/>
					<div className="Row">
						<div className="ColumnR" style={{width: '25%'}}>
							<button className='mNavBtn' onClick={() => this.state.handleMNavBtn('video')}
								style={{display: this.state.showMNavVidBtn ? 'block' : 'none'}}>
								<i className={mIcBtnCss}>ondemand_video</i>
							</button>	
						</div>
						<div className="ColumnR" style={{width: '25%'}}>
							<button className='mNavBtn' onClick={() => this.state.handleMNavBtn('image')} 
								style={{display: this.state.showMNavImgBtn ? 'block' : 'none'}}>
								<i className={mIcBtnCss}>image</i>
							</button>
						</div>
						<div className="ColumnR" style={{width: '25%'}}>
							<button className='mNavBtn' onClick={() => this.state.handleMNavBtn('audio')}
								style={{display: this.state.showMNavAudBtn ? 'block' : 'none'}}>
								<i className={mIcBtnCss}>audiotrack</i>
							</button>
						</div>
						<div className="ColumnR" style={{width: '25%'}}>
							<button className='mNavBtn' onClick={() => this.state.handleMNavBtn('task')}>
								<i className={mIcBtnCss}>assignment</i>
							</button>
						</div>
					</div>
				</div /*nav bar ends*/>
				<div onClick={this.handleFooterAnimation} /*footer starts*/>
					<div align="center">
						<span style={{visibility: this.state.ismFooterAnimation ? 'visible' : 'hidden'}}
							className="mFooterTip mFooterText">&#169; {'Khela Ghar Montessory School, 2021'}</span>
					</div>
					<img src={F1} alt="footer" className="mFooter noSelect mTextGap3" 
						referrerPolicy="same-origin" loading="lazy"/>
				</div /*footer ends*/>
			</div /*app ends*/>
		);
	}
}

export default KSDevice;