import React from 'react';
import imgur from 'imgur';
import './K1.css';
import {isMobile} from 'react-device-detect';
// const albumOGroupId = '7BQyCQx';
const apiKey = '3787cfa5b5000f4';
imgur.setClientId(apiKey);

class KStudy extends React.PureComponent {

	constructor(props){
		super(props);
		this.state = {isImgModal: false, kImgList: [], ImgModalSrc: ''};
		this.getTasksFrom = this.getTasksFrom.bind(this);
		this.handleImgAlbumRequest = this.handleImgAlbumRequest.bind(this);
		this.getTasksImgFrom = this.getTasksImgFrom.bind(this);
		this.handleStartImgModal = this.handleStartImgModal.bind(this);
		this.handleCloseImgModal = this.handleCloseImgModal.bind(this);
		this.getmTasksFrom = this.getmTasksFrom.bind(this);
		this.getmTasksImgFrom = this.getmTasksImgFrom.bind(this);
	}


	componentDidMount(){
		if(!isMobile){
			this.timerID = setTimeout(() => this.props.handleDeco(),900);
		}
		this.handleImgAlbumRequest();
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

		imgur.getAlbumInfo(this.props.kgmsAlbumId)
		    .then((json) => {
		        // console.log(json);
		        let k = [];
		        for(let i in json.data.images){
		        	// console.log('img: '+json.data.images[i].link);
		        	k.push({id: json.data.images[i].id, link: json.data.images[i].link});
		        }
		        if(k.length > 0){
		        	this.setState({kImgList: k});
		        }
		        if(!isMobile){
		        	this.timerID = setTimeout(() => this.props.handleDeco(),1000);
		        }
		    })
		    .catch((err) => {
		        // console.error(err.message);
		        if(!isMobile){
		        	this.timerID = setTimeout(() => this.props.handleDeco(),1000);
		        }
		    });
	}

	getTasksImgFrom(){
		let taskImgListItems = this.state.kImgList.map((imgL) => {
			return(
				<img src={imgL.link} alt={imgL.id} className="dTaskImg" 
					key={imgL.id} onClick={() => this.handleStartImgModal(imgL.link)}/>
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
				<img src={imgL.link} alt={imgL.id} className="mTaskImg" 
					key={imgL.id} onClick={() => this.handleStartImgModal(imgL.link)}/>
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
						style={{display: this.state.kImgList.length > 0 ? 'block':'none'}}>
						<span className={isMobile ? 'mTextMain' : 'dTaskImgHeader-span'}>{'Image Section'}</span>
					</h4>
				</div>
				<div align="center">
					{isMobile ? this.getmTasksImgFrom() : this.getTasksImgFrom()}
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