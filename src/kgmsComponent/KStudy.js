import React from 'react';
import './K1.css';
import {isMobile} from 'react-device-detect';
import "firebase/storage";

// document.cookie = "test1=Hello";
document.cookie = "name1=kgmsstudy; SameSite=Lax";
document.cookie = "name1-legacy=kgmsStudy; ";
// document.cookie = "name1=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
const apiJsUrl = "https://apis.google.com/js/api.js";
const apiKeyY = 'AIzaSyCMyBe3gjfvs38Yh_eiTwBEd5xlPVwnqK8';
const yJsUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';

class KStudy extends React.PureComponent {

	constructor(props){
		super(props);
		this.state = {isImgModal: false, kImgList: [], ImgModalSrc: '', kVideoList: [], showImageSection: false,
						imageBanner: 'Loading Images...'};
		this.getTasksFrom = this.getTasksFrom.bind(this);
		this.handleImgAlbumRequest = this.handleImgAlbumRequest.bind(this);
		this.getTasksImgFrom = this.getTasksImgFrom.bind(this);
		this.handleStartImgModal = this.handleStartImgModal.bind(this);
		this.handleCloseImgModal = this.handleCloseImgModal.bind(this);
		this.getmTasksFrom = this.getmTasksFrom.bind(this);
		this.getmTasksImgFrom = this.getmTasksImgFrom.bind(this);
		this.loadGapiClient = this.loadGapiClient.bind(this);
		this.getTaskVideoFrom = this.getTaskVideoFrom.bind(this);
		this.handleImgUrlRequest = this.handleImgUrlRequest.bind(this);
	}


	componentDidMount(){
		if(!isMobile){
			this.timerID = setTimeout(() => this.props.handleDeco(),900);
		}

		// console.log('cookie = ',document.cookie);
		this.handleImgAlbumRequest();
		if(!window.gapi){
			const script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = apiJsUrl;
			script.id = 'googleApi';
			script.async = true;
			window.document.body.appendChild(script);

			script.onload = () => {
				// console.log('gapi script loaded');
				window.gapi.load('client', () => {
					this.loadGapiClient();
				});
			};
		} else {
			// console.log('gapi without script loaded');
			window.gapi.load('client', () => {
					this.loadGapiClient();
				});
		}
		
	}

	 async loadGapiClient(){
	 	// Initializes the client with the API key and the Youtube API.
        window.gapi.client.init({
          'apiKey': apiKeyY,
          'discoveryDocs': [yJsUrl],
        }).then(() => {
          // Executes an API request, and returns a Promise.
          // console.log("GAPI client loaded for Youtube API Playlist list !");
          return window.gapi.client.youtube.playlists.list({
		      "part": [
		        "snippet"
		      ],
		      "channelId": "UCuS-pL1W9DnAgw0ju4rDOKA"
		    });
        },(err)=>{
        	console.error("Error loading GAPI client for Youtube API Playlist list !", err);
        }).then((response) => {
        	// console.log("Youtube Response Playlist ->", response);
        	if(response !== null || response !== undefined) {
        		let playListId = null;
	        	for(let i in response.result.items) {
	        		if(response.result.items[i].snippet.title === this.props.kgmsMediaId){
	        			playListId = response.result.items[i].id;
	        		}
	        	}
	        	if(playListId != null) {
	        		// console.log("Youtube playListId", playListId);
	        		return window.gapi.client.youtube.playlistItems.list({
				      "part": [
				      	"snippet"
				      ],
				      "playlistId": playListId
				    });
	        	}
        	}

        }, (err) => {
        	console.error("Youtube Execute error", err);
        }).then((response)=>{
        	// console.log("GAPI client loaded for Youtube API PlaylistItems list !");
        	// console.log("Youtube PlaylistItems Response ->", response);
        	if(response !== null || response !== undefined) {
        		let videoIdList = [];
	        	for(let i in response.result.items){
	        		videoIdList.push({id: response.result.items[i].id, videoId: response.result.items[i].snippet.resourceId.videoId,
	        							title: response.result.items[i].snippet.title});
	        	}
	        	if(videoIdList.length > 0){
	        		this.setState({kVideoList: videoIdList});
	        		if(!isMobile){
						this.timerID = setTimeout(() => this.props.handleDeco(),900);
					}
	        	}
        	}
        },(err)=>{
        	console.error("Error loading GAPI client for Youtube API PlaylistItems list !", err);
        });
	}

	componentWillUnmount(){
		clearTimeout(this.timerID);
	}

	handleStartImgModal(src){
		this.setState({isImgModal: true,ImgModalSrc: src});
			
	}

	handleCloseImgModal(event){
		this.setState({isImgModal: false, ImgModalSrc: ''});
		event.preventDefault();
	}

	async handleImgAlbumRequest(){
		let kStorage = this.props.firebase.storage();
		let kStorageRef = kStorage.ref();
		let imgRef = kStorageRef.child('kgms-images').child(this.props.kgmsMediaId);
		imgRef.listAll()
		.then((res) => {
			// console.log('firebase storage data = ',res);
			if(res !== null && res !== undefined) {
				let imageNameList = [];
				res.items.forEach((itemRef)=>{
					// console.log('item ref = ',itemRef.name);
					imageNameList.push(itemRef.name);
				});
				if(imageNameList.length > 0) {
					// console.log('imageNameList = ',imageNameList.toString());
					this.setState({showImageSection: true});
					this.handleImgUrlRequest(imgRef, imageNameList);
				} else {
					this.setState({showImageSection: false, imageBanner: 'Loading Images...'});
				}
			}
		})
		.catch((error) => {
			console.log('firebase storage error = ',error.toString());
		});
	}

	async handleImgUrlRequest(imgRef, imgArr){
		let imgList = [];
		for(let i = 0; i < imgArr.length; i++) {
			// console.log('imageName = ',imgArr[i]);
			let url = await imgRef.child(imgArr[i]).getDownloadURL();
			imgList.push({id: (i+500).toString(), link: url, tag: imgArr[i].replace(/\.[^/.]+$/, "")});
		}

		if(imgList.length > 0) {
			this.setState({kImgList: imgList, imageBanner: 'Image Section'});
			if(!isMobile) {
				this.timerID = setTimeout(() => this.props.handleDeco(),5000);
			}
		}
	}

	getTaskVideoFrom(){
		let num = 1;
		let taskVideoListItems = this.state.kVideoList.map((vidL) => {
			let embedUrl = `https://www.youtube.com/embed/${vidL.videoId}`;
			return(
				<div key={vidL.id} className={isMobile ? 'mVidGap' : 'dVidGap'}>
					<div className={isMobile ? 'mTaskVideoContainer' : 'dTaskVideoContainer'}>
						<iframe className="dTaskVideo" src={embedUrl} samesite="None; secure"
							title={`kgms-video-${num++}`} type="text/html" allowFullScreen="allowfullscreen" frameBorder="0"/>
					</div>
					<p><b className={isMobile ? 'mTextMain' : 'dMain'}><u>{vidL.title}</u></b></p>	
				</div>
			);
		});

		return taskVideoListItems;
	}

	getTasksImgFrom(){
		let taskImgListItems = this.state.kImgList.map((imgL) => {
			return(
				<div className="dVidGap" key={imgL.id}>
					<div>
						<img src={imgL.link} alt={imgL.id} className="dTaskImg" 
							onClick={() => this.handleStartImgModal(imgL.link)}/>
					</div>	
					<div>	
						<h3 className="dMain dTextBlk"><u>{imgL.tag}</u></h3>
					</div>
				</div>	
			);
		});

		return taskImgListItems;
	}

	getTasksFrom(){
		// let tasks = [];
		// for(let c = 1; c <= 10;c++){
		// 	tasks.push(c);
		// }
		let taskListItems = this.props.kgmsStudies.map((task) => {
			return (
				<div style={{marginTop: '40px'}} key={task.id.toString()}>
					<div className="Row">
						<div className="Column TaskLeft" align="center">
							<p className="TaskDeco">{task.id.toString()}</p>
						</div>
						<div className="Column TaskRight" style={{marginTop:'2px'}}>
							<h3 className="dMainHead dTextBlk">{task.header}</h3>
							<h3 className="dMain dTextBlk">{task.subHeader}</h3>
							<h3 className="dMain dTextBlk">{task.desc.split('\n').map((item,key)=>{
								return <span key={key} className="dSpanStyl">{item}<br/></span>
							})}</h3>
						</div>
					</div>
				</div>
			);
		});

		return taskListItems;	
	}

	getmTasksFrom() {
		// let mTasks = [];
		// for(let c = 1; c <= 5;c++){
		// 	mTasks.push(c);
		// }
		let mTaskListItems = this.props.kgmsStudies.map((task) => {
			return(
				<div key={task.id.toString()} className="mGap2">
					<p><b className="mNoticeDec mTextMain">{task.id.toString()}</b></p>
					<p><b className="mTextMain">{task.header}</b></p>
					<p><b className="mTextMain">{task.subHeader}</b></p>
					<p><b className="mTextMain">{task.desc.split('\n').map((item,key)=>{
						return <span key={key}>{item}<br/></span>
					})}</b></p>
				</div>
			);
		});

		return mTaskListItems;
	}

	getmTasksImgFrom(){

		let mTaskImgListItems = this.state.kImgList.map((imgL) => {
			return(
				<div className="mVidGap" key={imgL.id}>
					<div>
						<img src={imgL.link} alt={imgL.id} className="mTaskImg" 
							 onClick={() => this.handleStartImgModal(imgL.link)}/>
					</div>
					<div>	 
						<p><b className="mTextMain"><u>{imgL.tag}</u></b></p>	
					</div>
				</div>	
			);
		});

		return mTaskImgListItems;
	}

	render(){
		return(
			<div /*study starts*/ >
				<div>
					<h2 className={isMobile ? 'mTextHead1' : 'dTextHead1'}>{'Welcome to KGMS Study'}</h2>
					<h3 className={isMobile ? 'mTextSubHead1' : 'dTextSubHead1'}>{`Class ~ ${this.props.kgmsClassName}`}</h3>
				</div>
				<div>
					{isMobile ? this.getmTasksFrom() : this.getTasksFrom()}
				</div>
				<div align="center">
					<h4 className={isMobile ? 'mTaskImgHeader' : 'dTaskImgHeader'}
						style={{display: this.state.showImageSection ? 'block':'none'}}>
						<span className={isMobile ? 'mTextMain' : 'dTaskImgHeader-span'}>{this.state.imageBanner}</span>
					</h4>
				</div>
				<div align="center">
					{isMobile ? this.getmTasksImgFrom() : this.getTasksImgFrom()}
				</div>
				<div align="center">
					<h4 className={isMobile ? 'mTaskImgHeader' : 'dTaskImgHeader'}
						style={{display: this.state.kVideoList.length > 0 ? 'block':'none'}}>
						<span className={isMobile ? 'mTextMain' : 'dTaskImgHeader-span'}>{'Video Section'}</span>
					</h4>
				</div>
				<div align="center">
					{this.getTaskVideoFrom()}
				</div>
				<div style={{display: this.state.isImgModal ? 'block' : 'none'}} 
					className={isMobile ? 'mImgModal' : 'dImgModal'} /*modal starts*/>
					<span className={isMobile ? 'mImgModalClose' : 'dImgModalClose'} 
						onClick={this.handleCloseImgModal}>&times;</span>
					<div > 
						<img src={this.state.ImgModalSrc} alt="modal img" 
							className={isMobile ? 'mImgModalImage' : 'dImgModalImage'}/>
					</div>
				</div /*modal ends*/>
			</div /*study ends*/>
		);
	}
}

export default KStudy;