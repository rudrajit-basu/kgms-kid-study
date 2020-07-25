import React from 'react';
import './MStyle.css';
import HHM from './images/HHM.png';
import H4 from './images/H4.png';
import LO from './images/LO.png';
import F1 from './images/F1.png';
import KSLogin from './KSLogin';
import KStudy from './KStudy';
import "firebase/firestore";

class KSDevice extends React.PureComponent {

	constructor(props){
		super(props);
		this.state = {isMLogin: false, isModalLogOut: false, KMClassName: "", KMediaId: "",
						KMStudies:[{id:0,header:"Please wait... Fetching Events >>",desc:""}]}
		this.getmBodyContent = this.getmBodyContent.bind(this);
		this.handleMKSLogin = this.handleMKSLogin.bind(this);
		this.handleMKSLogOut = this.handleMKSLogOut.bind(this);
		this.handleLogOutModalStart = this.handleLogOutModalStart.bind(this);
		this.handleLogOutModalClose = this.handleLogOutModalClose.bind(this);
		this.handleHistoryPop = this.handleHistoryPop.bind(this);
		this.fetchMKgmsStudy = this.fetchMKgmsStudy.bind(this);
		this.checkMCredentials = this.checkMCredentials.bind(this);
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
			db.collection("kgms-classes").where("classPassword", "==", password.toLowerCase()).limit(1)
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
		// console.log(`History state: ${JSON.stringify(event.state)}`);
		if(event.state !== null){
			if(this.state.isMLogin){
				this.handleLogOutModalStart();
			}else{
				window.history.back();	
			}
		}else{
			window.history.back();
		}
	}

	componentDidMount(){
		window.addEventListener('popstate', this.handleHistoryPop,false);
		window.history.replaceState({page: 'mLogin'},'','');
	}

	componentWillUnmount(){
		window.removeEventListener('popstate',this.handleHistoryPop,false);
	}

	handleMKSLogin(){
		this.setState({isMLogin: true});
		window.history.pushState({page: 'mStudy'},'','');
	}

	handleMKSLogOut(){
		this.setState({isModalLogOut: false,isMLogin: false, KMClassName: "", KMediaId: "",
					KMStudies:[{id:0,header:"Please wait... Fetching Events >>",desc:""}]});
	}

	handleLogOutModalStart(){
		this.setState({isModalLogOut: true});
	}

	handleLogOutModalClose(){
		this.setState({isModalLogOut: false});
	}

	getmBodyContent(loginState){

		if(!loginState){
			return(
				<div key={'mKSLogin'} className="mSeaBlue mBord pt-page-rotateUnfoldRight">
					<div className="mBodyContent2">
						<KSLogin kLogIn={() => this.handleMKSLogin()} chkUser={(uid, pwd) => this.checkMCredentials(uid, pwd)}/>
					</div>
				</div>
			);
		} else {
			return(
				<div key={'mKStudy'} className="mOrange mBord pt-page-rotateUnfoldRight">
					<div className="mBodyContent2">
						<KStudy kgmsClassName={this.state.KMClassName} kgmsStudies={this.state.KMStudies}
								kgmsMediaId={this.state.KMediaId} firebase={this.props.firebase}/>
					</div>
				</div>
			);
		}
	}

	render(){
		const mLog_out_btn = <input type="image" src={LO} alt="log_out"
								style={{visibility: this.state.isMLogin ? 'visible' : 'hidden'}} 
								key={this.state.isMLogin.toString()} onClick={() => this.handleLogOutModalStart()}
								className="mLog-out noSelect pt-page-rotateUnfoldTop"/>;
		return(
			<div className="mApp" /*app starts*/>
				<div className="Row" /*header starts*/>
					<div className="Column mTopLeft" >
						{mLog_out_btn}
					</div>
					<div className="Column mTopRight" align="right">
						<img src={H4} alt="sun" className="mSun noSelect"/>
					</div>
				</div>
				<div align="left" className="mHDiv">
						<img src={HHM} alt="kgms" className="mHH noSelect"/>
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
										onClick={() => this.handleMKSLogOut()}>&#10003;</span>
								</div>
								<div className="Column mLogOutRight">
									<span className="mLogOutModalActionBtn" 
										onClick={() => this.handleLogOutModalClose()}>&#10007;</span>
								</div>
							</div>
						</div>
					</div>
				</div /*modal ends*/>
				<div /*footer starts*/>
					<img src={F1} alt="footer" className="mFooter noSelect mTextGap3"/>
				</div /*footer ends*/>
			</div /*app ends*/>
		);
	}
}

export default KSDevice;