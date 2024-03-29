import React from 'react';
import './K1.css';
import {isMobile, isFirefox, isIE} from 'react-device-detect';
import "firebase/storage";

// document.cookie = "test1=Hello";
// document.cookie = "name1=kgmsstudy; SameSite=Lax";
// document.cookie = "name1-legacy=kgmsStudy; ";
document.cookie = "k1name=kgmsstudy; SameSite=None; Secure";
document.cookie = "k1name-legacy=kgmsStudy; Secure";
// document.cookie = "name1=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

const apiJsUrl = "https://apis.google.com/js/api.js";

// const apiKeyYPrev = 'AIzaSyCMyBe3gjfvs38Yh_eiTwBEd5xlPVwnqK8';
const apiKeyY = 'AIzaSyCjyx-Y-2yupi_mGz9YeaZvdGwutVM7LTw';
const yJsUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';
// const yJsScope = 'https://www.googleapis.com/auth/youtube.readonly';

// const animeTime = isFirefox ? 42 : 92;
const animeTime = 42;


class KStudy extends React.PureComponent {

	constructor(props){
		super(props);
		this.state = {kImgList: [], kVideoList: [], showImageSection: false,
						imageBanner: 'Loading Images...', kAudioList: [], kAudioUrlSet: new Map()};
		this.getTasksFrom = this.getTasksFrom.bind(this);
		this.handleImgAlbumRequest = this.handleImgAlbumRequest.bind(this);
		this.getTasksImgFrom = this.getTasksImgFrom.bind(this);
		this.getmTasksFrom = this.getmTasksFrom.bind(this);
		this.getmTasksImgFrom = this.getmTasksImgFrom.bind(this);
		this.loadGapiClient = this.loadGapiClient.bind(this);
		this.getTaskVideoFrom = this.getTaskVideoFrom.bind(this);
		this.handleImgUrlRequest = this.handleImgUrlRequest.bind(this);
		this.getTaskAudioFrom = this.getTaskAudioFrom.bind(this);
		this.handleAudioAlbumRequest = this.handleAudioAlbumRequest.bind(this);
		this.handleAudioUrlRequest = this.handleAudioUrlRequest.bind(this);
		this.handleScrollToElement = this.handleScrollToElement.bind(this);
		this.getMarginPos = this.getMarginPos.bind(this);
		this.handleScrollNavBar = this.handleScrollNavBar.bind(this);
		this.animateScrollToElem = this.animateScrollToElem.bind(this);
		this.handleScrollToElementForIE = this.handleScrollToElementForIE.bind(this);
	}


	componentDidMount(){
		if(!isMobile){
			this.timerID = setTimeout(() => this.props.handleDeco(),900);
		}

		// console.log('cookie = ',document.cookie);

		this.handleImgAlbumRequest();
		this.handleAudioAlbumRequest();
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
		window.addEventListener('scroll', this.handleScrollNavBar, false);
		if(isIE){
			this.props.handleSetNavBarOnClick(this.handleScrollToElementForIE);
		}else {
			this.props.handleSetNavBarOnClick(this.handleScrollToElement);
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
		      "channelId": "UCuS-pL1W9DnAgw0ju4rDOKA",
		      "maxResults": 15
		    });
        },(err)=>{
        	console.error("Error loading GAPI client for Youtube API Playlist list !", err);
        }).then((response) => {
        	// console.log("Youtube Response Playlist ->", response);
        	if(response !== null && response !== undefined) {
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
				      "playlistId": playListId,
				      "maxResults": 10
				    });
	        	}
        	}

        }, (err) => {
        	console.error("Youtube Execute error", err);
        }).then((response)=>{
        	// console.log("GAPI client loaded for Youtube API PlaylistItems list !");
        	// console.log("Youtube PlaylistItems Response ->", response);
        	if(response !== null && response !== undefined) {
        		let videoIdList = [];
	        	for(let i in response.result.items){
	        		videoIdList.push({id: response.result.items[i].id, videoId: response.result.items[i].snippet.resourceId.videoId,
	        							title: response.result.items[i].snippet.title, thumbnail: response.result.items[i].snippet.thumbnails.standard.url});
	        	}
	        	if(videoIdList.length > 0){
	        		// videoIdList.reverse();
	        		this.setState({kVideoList: videoIdList});
	        		this.props.handleShowNavBtn('video');
	        		if(!isMobile){
						this.timerID = setTimeout(() => this.props.handleDeco(),900);
					}
	        	}
        	}
        	
        },(err)=>{
        	console.error("Error loading GAPI client for Youtube API PlaylistItems list !", err);
        });
	}

	handleScrollNavBar(event){
		if(this.hRef !== null){
			const sticky = isFirefox || isIE ? this.hRef.offsetTop + 150 : this.hRef.offsetTop;
			if(window.pageYOffset >= sticky){
				// if(!this.state.showNavBar){
				// 	this.setState({showNavBar: true});
				// }
				if(!this.props.showNavBar){
					this.props.setShowNavBar(true);
				}
			} else {
				// if(this.state.showNavBar){
				// 	this.setState({showNavBar: false});
				// }
				if(this.props.showNavBar){
					this.props.setShowNavBar(false);
				}
			}
		}
		event.preventDefault();	
	}

	componentWillUnmount(){
		clearTimeout(this.timerID);
		window.removeEventListener('scroll', this.handleScrollNavBar, false);
		this.props.setShowNavBar(false);
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
			this.setState({showImageSection: false, imageBanner: 'Loading Images...'});
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
			this.props.handleShowNavBtn('image');
			if(!isMobile) {
				this.timerID = setTimeout(() => this.props.handleDeco(),5000);
			}
		}
	}

	async handleAudioAlbumRequest(){
		let kStorage = this.props.firebase.storage();
		let kStorageRef = kStorage.ref();
		let audRef = kStorageRef.child('kgms-voice-notes').child(this.props.kgmsMediaId);
		audRef.listAll()
		.then((res) => {
			// console.log('firebase storage data = ',res);
			if(res !== null && res !== undefined) {
				let audioNameList = [];
				res.items.forEach((itemRef)=>{
					// console.log('item ref = ',itemRef.name);
					audioNameList.push({title: itemRef.name});
				});
				if(audioNameList.length > 0) {
					// console.log('imageNameList = ',imageNameList.toString());
					// this.setState({showImageSection: true});
					// this.handleImgUrlRequest(imgRef, imageNameList);
					this.setState({kAudioList: audioNameList});
					this.props.handleShowNavBtn('audio');
					// this.handleAudioUrlRequest(audRef, audioNameList);
				}
			}
		})
		.catch((error) => {
			// this.setState({showImageSection: false, imageBanner: 'Loading Images...'});
			console.log('firebase storage error = ',error.toString());
		});
	}

	// async handleAudioUrlRequest(audRef, audArr){
	// 	let audList = [];
	// 	for(let i = 0; i < audArr.length; i++) {
	// 		// console.log('imageName = ',imgArr[i]);
	// 		let url = await audRef.child(audArr[i]).getDownloadURL();
	// 		audList.push({id: (i+700).toString(), link: url, title: audArr[i].replace(/\.[^/.]+$/, "")});
	// 	}

	// 	if(audList.length > 0) {
	// 		this.setState({kAudioList: audList});
	// 		if(!isMobile) {
	// 			this.timerID = setTimeout(() => this.props.handleDeco(),5000);
	// 		}
	// 	}
	// }
	async handleAudioUrlRequest(fileName){
		if(this.state.kAudioUrlSet.has(fileName)){
			// console.log('handleAudioUrlRequest from cache');
			let url = this.state.kAudioUrlSet.get(fileName).url;
			// console.log(`url from cache --> ${url}`);
			this.props.handleSetAudioSrc(url);
		}else{
			// console.log('handleAudioUrlRequest http request');
			let kStorage = this.props.firebase.storage();
			let kStorageRef = kStorage.ref();
			let audRef = kStorageRef.child('kgms-voice-notes').child(this.props.kgmsMediaId);
			let url = await audRef.child(fileName).getDownloadURL();
			let urlSet = this.state.kAudioUrlSet.set(fileName, {url: url});
			this.setState({kAudioUrlSet: urlSet});
			this.props.handleSetAudioSrc(url);
		}
	}

	getTaskVideoFrom(){
		// let num = 1;
		let taskVideoListItems = this.state.kVideoList.map((vidL) => {
			let embedUrl = `https://www.youtube.com/embed/${vidL.videoId}`;
			return(
				<div key={vidL.id} className={isMobile ? 'mVidGap' : 'dVidGap'}>
					<div>
						<img src={vidL.thumbnail} alt={vidL.title} className={isMobile ? 'mTaskImg' : 'dTaskVideoImg'}
							onClick={(event)=>{this.props.handleStartVideoModal(embedUrl); event.preventDefault();}}
							referrerPolicy="same-origin" loading="lazy"/>
					</div>
					<p className="mLetterWrap"><b className={isMobile ? 'mTextMain' : 'dMain'}><u>{vidL.title}</u></b></p>	
				</div>
			);
		});

		return taskVideoListItems;
	}

	getTaskAudioFrom(){
		let i = 701;
		let taskAudioListItems = this.state.kAudioList.map((audL) => {
			return(
				<div key={(i++).toString()} className={isMobile ? 'mVidGap' : 'dVidGap'}>
					<div onClick={(event) => {this.props.handleStartAudioModal(); this.handleAudioUrlRequest(audL.title); event.preventDefault();}}>
						<i className={isMobile ? 'material-icons mGIcon' : 'material-icons dGIcon'}>volume_up</i>
					</div>
					<p className="mLetterWrap"><b className={isMobile ? 'mTextMain' : 'dMain'}><u>{audL.title.replace(/\.[^/.]+$/, "")}</u></b></p>
				</div>
			);
		});
		return taskAudioListItems;
	}

	getTasksImgFrom(){
		let taskImgListItems = this.state.kImgList.map((imgL) => {
			return(
				<div className="dVidGap" key={imgL.id}>
					<div>
						<img src={imgL.link} alt={imgL.id} className="dTaskImg" 
							onClick={(event) => {this.props.handleStartImgModal(imgL.link); event.preventDefault();}}
							referrerPolicy="same-origin" loading="lazy"/>
					</div>	
					<div>	
						<h3 className="dMain dTextBlk dLetterWrap"><u>{imgL.tag}</u></h3>
					</div>
				</div>	
			);
		});

		return taskImgListItems;
	}

	getTasksFrom(){
		let lineKey = 1;
		let spaceKey = 1;
		let divKey = 88;

		let taskListItems = this.props.kgmsStudies.map((task) => {

			return (
				<div style={{marginTop: '40px'}} key={(divKey++).toString()+'gtf'}>
					<div className="Row">
						<div className="Column TaskLeft" align="center">
							<p className="TaskDeco">{task.id.toString()}</p>
						</div>
						<div className="Column TaskRight dWordWrap" style={{marginTop:'2px'}}>
							<h3 className="dMainHead dTextBlk">{task.header}</h3>
							<h3 className="dMain dTextBlk">{task.subHeader}</h3>
							<h3 className="dMain dTextBlkDesc">{task.desc.split('\n').map((item)=>{
								return <span key={(lineKey++).toString()+'lk'} className="dSpanStyl">{item.split(' ').map((sItem)=>{
									return <span key={(spaceKey++).toString()+'sk'}>{sItem}<span className="dWordGap"/> </span>
								})}<br/></span>
							})}</h3>
						</div>
					</div>
				</div>
			);
		});

		return taskListItems;	
	}

	getmTasksFrom() {
		let lineKey = 1;
		let spaceKey = 1;
		let divKey = 89;

		let mTaskListItems = this.props.kgmsStudies.map((task) => {
			return(
				<div key={(divKey++).toString()+'gmtf'} className="mGap2 mWordWrap">
					<p><b className="mNoticeDec mTextMain">{task.id.toString()}</b></p>
					<p><b className="mTextMain">{task.header}</b></p>
					<p><b className="mTextMain">{task.subHeader}</b></p>
					<p><b className="mTextMainDesc">{task.desc.split('\n').map((item)=>{
						return <span key={(lineKey++).toString()+'mlk'}>{item.split(' ').map((sItem)=>{
							return <span key={(spaceKey++).toString()+'msk'}>{sItem}<span className="mWordGap"/> </span>
						})}<br/></span>
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
							 onClick={(event) => {this.props.handleStartImgModal(imgL.link); event.preventDefault();}}
							 referrerPolicy="same-origin" loading="lazy"/>
					</div>
					<div>	 
						<p><b className="mTextMain mLetterWrap"><u>{imgL.tag}</u></b></p>	
					</div>
				</div>	
			);
		});

		return mTaskImgListItems;
	}

	handleScrollToElementForIE(btn){
		const wH = this.getMarginPos();

		if(btn === 'task'){
			const vPos = this.tskRef.offsetTop + (wH*2);
			window.scrollTo(0, vPos-20);
		} else if(btn === 'audio'){
			const vPos = this.audioRef.offsetTop + wH;
			window.scrollTo(0, vPos);
		} else if(btn === 'image'){
			const vPos = this.imgRef.offsetTop + wH;
			window.scrollTo(0, vPos);
		} else if(btn === 'video'){
			const vPos = this.vidRef.offsetTop + wH;
			window.scrollTo(0, vPos);
		}
	}


	async handleScrollToElement(btn){
		const wH = this.getMarginPos();
		let isAnime = false;
		if(this.scrollTimer !== undefined ){
			// console.log(`this.scrollTimer --> ${this.scrollTimer}`);
			try{
				clearInterval(this.scrollTimer);
				this.scrollTimer = undefined;
			}catch(e){
				isAnime = false;
			}
		} else {
			isAnime = true;
		}

		const tryAnimeScroll = (vPos) => {
			try{
				this.animateScrollToElem(vPos);
			}catch(e){
				window.scrollTo(0, vPos);
			}
		}

		if(btn === 'task'){
			const vPos = isFirefox ? Math.floor(this.tskRef.offsetTop) + (wH*2) : Math.floor(this.tskRef.offsetTop)-20;
			isAnime ? tryAnimeScroll(vPos) : window.scrollTo(0, vPos);
		} else if(btn === 'audio'){
			const vPos = isFirefox ? Math.floor(this.audioRef.offsetTop) + wH : Math.floor(this.audioRef.offsetTop)-wH;
			isAnime ? tryAnimeScroll(vPos) : window.scrollTo(0, vPos);
		} else if(btn === 'image'){
			const vPos = isFirefox ? Math.floor(this.imgRef.offsetTop) + wH : Math.floor(this.imgRef.offsetTop)-wH;
			isAnime ? tryAnimeScroll(vPos) : window.scrollTo(0, vPos);
		} else if(btn === 'video'){
			const vPos = isFirefox ? Math.floor(this.vidRef.offsetTop) + wH : Math.floor(this.vidRef.offsetTop)-wH;
			isAnime ? tryAnimeScroll(vPos) : window.scrollTo(0, vPos);
		}
	}

	animateScrollToElem(position){
		const curPos = Math.floor(window.scrollY);
		// console.log(`position --> ${position} & curPos --> ${curPos}`);
		if(curPos > position){
			const tDist = curPos - position;
			// let steps = tDist <= 2700 ? (Math.floor(curPos / position) - 1) * 2 : Math.floor(curPos / position) - 1;
			let steps = tDist <= 4000 ? 5 : 3;
			// console.log(`steps --> ${steps}`);
			if(steps > 0) {
				const sDist = tDist / steps;
				let cPos = curPos;
				this.scrollTimer = setInterval(() => {
					if(steps >= 1){
						cPos = cPos - sDist;
						window.scrollTo(0, cPos);
						steps--;
						// console.log(`curPos --> ${curPos}`);
					} else {
						window.scrollTo(0, position);
						clearInterval(this.scrollTimer);
						this.scrollTimer = undefined;
					}
				}, animeTime);
			} else {
				window.scrollTo(0, position);
				// console.log('steps === 0');
			}
		} else if(curPos < position){
			const tDist = position - curPos;
			// let steps = tDist <= 2700 ? (Math.floor(position / curPos) - 1) * 2 : Math.floor(position / curPos) - 1;
			let steps = tDist <= 4000 ? 5 : 3;
			// console.log(`steps --> ${steps}`);
			if(steps > 0) {
				const sDist = tDist / steps;
				let cPos = curPos;
				this.scrollTimer = setInterval(() => {
					if(steps >= 1){
						cPos = cPos + sDist;
						window.scrollTo(0, cPos);
						steps--;
						// console.log(`curPos --> ${curPos}`);
					} else {
						window.scrollTo(0, position);
						clearInterval(this.scrollTimer);
						this.scrollTimer = undefined;
					}
				}, 100);
			} else {
				window.scrollTo(0, position);
				// console.log('steps === 0');
			}
		}
	}

	getMarginPos(){
		let wH = window.outerHeight;
		// if(wH > 500){
		// 	return wH / 96;
		// } else {
		// 	return wH / 5;
		// }
		return wH / 128;
	}

	render(){
		return(
			<div /*study starts*/ >
				<div ref={hrf => this.hRef = hrf}>
					<h2 className={isMobile ? 'mTextHead1' : 'dTextHead1'}>{'Welcome to KGMS Study'}</h2>
					<h3 ref={tsk => this.tskRef = tsk} className={isMobile ? 'mTextSubHead1' : 'dTextSubHead1'}>{`Class ~ ${this.props.kgmsClassName}`}</h3>
				</div>
				<div>
					{isMobile ? this.getmTasksFrom() : this.getTasksFrom()}
				</div>
				<div align="center" ref={audioRf => this.audioRef = audioRf}>
					<h4 className={isMobile ? 'mTaskImgHeader' : 'dTaskImgHeader'}
						style={{display: this.state.kAudioList.length > 0 ? 'block':'none'}}>
						<span className={isMobile ? 'mTextMain' : 'dTaskImgHeader-span'}>{'Audio Section'}</span>
					</h4>
				</div>
				<div align="center">
					{this.getTaskAudioFrom()}
				</div>
				<div align="center" ref={imgRf => this.imgRef = imgRf}>
					<h4 className={isMobile ? 'mTaskImgHeader' : 'dTaskImgHeader'}
						style={{display: this.state.showImageSection ? 'block':'none'}}>
						<span className={isMobile ? 'mTextMain' : 'dTaskImgHeader-span'}>{this.state.imageBanner}</span>
					</h4>
				</div>
				<div align="center">
					{isMobile ? this.getmTasksImgFrom() : this.getTasksImgFrom()}
				</div>
				<div align="center" ref={vidRf => this.vidRef = vidRf}>
					<h4 className={isMobile ? 'mTaskImgHeader' : 'dTaskImgHeader'}
						style={{display: this.state.kVideoList.length > 0 ? 'block':'none'}}>
						<span className={isMobile ? 'mTextMain' : 'dTaskImgHeader-span'}>{'Video Section'}</span>
					</h4>
				</div>
				<div align="center">
					{this.getTaskVideoFrom()}
				</div>
			</div /*study ends*/>
		);
	}
}

export default KStudy;