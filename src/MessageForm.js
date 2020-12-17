import React, { Component, useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import './MessageForm.css'



function MessageForm(props) {  
	let textInput = null;
	let fileBlob = null;
	let imageBase64 = '';


	const handleFormSubmit = (event) => {
		event.preventDefault()
		if (textInput.value != "") {
			props.onMessageSend(textInput.value)
			textInput.value = ""
		}    
	}

	const googleAPI = (imageBase64) => { 
		let body = JSON.stringify({
			requests: [{
				features: [
					{ type: "LABEL_DETECTION", maxResults: 10 },
					{ type: "LANDMARK_DETECTION", maxResults: 5 },
					{ type: "FACE_DETECTION", maxResults: 5 },
					{ type: "LOGO_DETECTION", maxResults: 5 },
					{ type: "TEXT_DETECTION", maxResults: 5 },
					{ type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
					{ type: "SAFE_SEARCH_DETECTION", maxResults: 5 },
					{ type: "IMAGE_PROPERTIES", maxResults: 5 },
					{ type: "CROP_HINTS", maxResults: 5 },
					{ type: "WEB_DETECTION", maxResults: 5 }
				],
				image: {
					"content": imageBase64
				}
			}]
		});

		fetch(
			"https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCgnHPhS4hZsHBaCwOknZVhpflE8UgpOV4",       			
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				method: "POST",
				body: body
			}
		).then((responseJson) => {
			console.log('responseJson')
			console.log(responseJson)
			console.log('responseJson')
		})
	}  	

	const handleAttachmentClickEvent = (event) => {
		fileBlob = URL.createObjectURL(event.target.files[0])
		getBase64(event.target.files[0], (result) => {
			console.log(result)
			imageBase64 = result;
			googleAPI(imageBase64)
		});	
	};

	const getBase64 = (file, cb) => {
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			cb(reader.result)
		};
		reader.onerror = function (error) {
			console.log('Error: ', error);
		};
	}
	
  	return (
      	<div>
			<div className="button-container">
				<input type="file" 
					onChange={handleAttachmentClickEvent}/>
			</div>
			<form className="MessageForm" onSubmit={handleFormSubmit}>
				<div className="input-container">
					<input
					type="text"
					ref={(input) => { textInput = input; }}
					placeholder="Enter your message..."
					/>
				</div>
				<div className="button-container">
					<button type="submit">
					Send
					</button>
				</div>
			</form>
      	</div>
    )
}


export default MessageForm
