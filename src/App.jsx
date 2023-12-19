import React, {
	useEffect,
	useRef,
	useState,
} from 'react';
import styles from './Styles/App.module.scss';
import meme1 from './assets/76adb64c.mp4';
import meme2 from './assets/98cbb274.mp4';
import muted from './assets/muted.mp4';
import ErrorImg from './assets/nonThalaSearch.jpeg';

import {
	FaPlay,
	FaPauseCircle,
} from 'react-icons/fa';
import {
	VscUnmute,
	VscMute,
} from 'react-icons/vsc';

import axios from 'axios';

import {
	FaWhatsapp,
	FaTwitter,
	FaFacebook,
} from 'react-icons/fa';

const API = import.meta.env.VITE_SHORTENER_API;
const Base_url = import.meta.env.VITE_BASE_URL;
const App = () => {
	const video = [meme1, meme2];
	const randomIndex = Math.floor(
		Math.random() * video.length
	);
	const videoRef = useRef(null);

	const [input, setInput] = useState('');
	const [reasonFound, setReasonFound] = useState({
		isFound: 'initial',
		msg: '',
	});

	function sumOfDigitsOrChars(input) {
		let sum = 0;
		let result = '';

		if (typeof input === 'number') {
			input = input.toString();
		}

		for (let i = 0; i < input.length; i++) {
			if (i > 0) {
				result += '+';
			}
			result += input[i];
			sum += parseInt(input[i]);
		}

		result += ' = ' + sum;
		return result;
	}

	function sumOfChars(input) {
		let result = '';

		for (let i = 0; i < input.length; i++) {
			if (i > 0) {
				result += '+';
			}
			result += input[i];
		}

		result += ' = ' + input.length;
		return result;
	}

	const wordList = [
		'thala',
		'thalaa',
		'thalaaa',
		'thalaaaa',
		'thalaaaaa',
		'thalaaaaaa',
		'thalaaaaaaa',
		'thalaaaaaaaa',
		'thalaaaaaaaaa',
		'thalaaaaaaaaaa',
		'thalaaaaaaaaaaa',
		'dhoni',
		'mahi',
		'msd',
		'captain',
		'finisher',
		'maahi',
		'tc',
	];

	const handleInput = (inputValue) => {
		setShareUrl('');
		if (inputValue != '') {
			const url = new URL(window.location.href);
			url.search = '';
			window.history.pushState({}, '', url);
			videoRef.current.pause();
			if (
				wordList.includes(inputValue.toLowerCase())
			) {
				setReasonFound({
					isFound: 'found',
					msg: `${inputValue} is Thala For A Reason!`,
				});
				videoRef.current.currentTime = 0;
				videoRef.current.play();
				return;
			}
			setTimeout(() => {
				const word = inputValue.replace(/[0-9]/g, '');
				const digits = inputValue
					.replace(/\D/g, '')
					.split('')
					.map(Number);
				const sum = digits.reduce((a, b) => a + b, 0);

				let numData = '';
				if (sum != '') {
					numData = digits
						.toString()
						.replace(/,/g, '');
				}

				if (word.length == 7 || sum == 7) {
					setReasonFound({
						isFound: 'found',
						msg:
							word.length == 7
								? `${sumOfChars(
										word
								  )} is Thala For A Reason!`
								: `${sumOfDigitsOrChars(
										numData
								  )} is Thala For A Reason!`,
					});
					videoRef.current.currentTime = 0;
					videoRef.current.play();
				} else {
					setReasonFound({
						isFound: 'notfound',
						msg: '',
					});
					videoRef.current.pause();
				}
			}, 100);
		}
	};

	useEffect(() => {
		const params = new URLSearchParams(
			window.location.search
		);
		const query = params.get('query');
		if (query) {
			handleInput(query);
			setInput(query);
		}
	}, []);

	const generateurl = async (query, service) => {
		if (shareUrl != '') {
			OpenShare(service);
			return;
		}

		const RandomSlug = () => {
			const date = new Date();
			const epochTimestamp = Math.floor(
				date.getTime() / 1000
			);
			return `TFAR${epochTimestamp}`;
		};

		const options = {
			method: 'POST',
			url: 'https://api.short.io/links',
			headers: {
				accept: 'application/json',
				'content-type': 'application/json',
				Authorization: API,
			},
			data: {
				domain: 'cppk.short.gy',
				allowDuplicates: true,
				originalURL: `${Base_url}?query=${query}`,
				path: RandomSlug(),
				title: 'Is TFAR? Check This Out!',
				cloaking: false,
			},
		};

		try {
			const response = await axios.request(options);
			setShareUrl(response.data.shortURL);
			OpenShare(service, response.data.shortURL);
		} catch (error) {
			console.error(error);
		}
	};

	const [shareUrl, setShareUrl] = useState('');

	const OpenShare = (service, ShareUri) => {
		const message = 'Check This Out! Is TFAR?';
		const url = ShareUri;

		function openWhatsApp(message, url) {
			const encodedMessage = encodeURIComponent(
				`${message} ${url}`
			);
			const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
			window.open(whatsappUrl, '_blank');
		}

		function openTwitter(message, url) {
			const encodedMessage = encodeURIComponent(
				`${message} ${url}`
			);
			const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
			window.open(twitterUrl, '_blank');
		}

		function openFacebook(url) {
			const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
				url
			)}`;
			window.open(facebookUrl, '_blank');
		}

		switch (service) {
			case 'whatsapp':
				openWhatsApp(message, url);
				break;
			case 'twitter':
				openTwitter(message, url);
				break;
			case 'facebook':
				openFacebook(url);
				break;
			default:
				break;
		}
	};

	const [videoProps, setVideoProps] = useState({
		isMuted: false,
		isPaused: false,
	});

	const handleMetadataLoaded = () => {
		console.log(videoRef.current.muted);
		if (videoRef.current) {
			if (videoRef.current.paused) {
				setVideoProps({
					...videoProps,
					isPaused: true,
				});
			} else {
				setVideoProps({
					...videoProps,
					isPaused: false,
				});
			}
			if (videoRef.current.muted) {
				setVideoProps({
					...videoProps,
					isMuted: true,
				});
			} else {
				setVideoProps({
					...videoProps,
					isMuted: false,
				});
			}
		}
	};

	return (
		<div className={styles.main}>
			{reasonFound.isFound == 'found' && (
				<div className={styles.overlay}>
					<div className={styles.hearts}>
						{Array.from({ length: 10 }).map((_, i) => (
							<div
								key={i}
								className={styles.heart}
							></div>
						))}
					</div>
					<div className={styles.heartsWrapper}>
						{Array.from({ length: 10 }).map((_, i) => (
							<div
								key={i}
								className={styles.heart}
							></div>
						))}
					</div>
				</div>
			)}
			<div
				className={
					reasonFound.isFound == 'found'
						? `${styles.videoWrapper}`
						: `${styles.videoWrapper} ${styles.hidden}`
				}
			>
				<iframe
					src={muted}
					type='video/mp4'
					allow='autoplay'
					id='video'
					style={{ display: 'none' }}
				/>
				<video
					ref={videoRef}
					loop
					onLoadedMetadata={handleMetadataLoaded}
				>
					<source
						src={video[1]}
						type='video/mp4'
					/>
				</video>
			</div>

			{reasonFound.isFound == 'notfound' && (
				<div className={styles.errorWrapper}></div>
			)}

			<div className={styles.inputParent}>
				{reasonFound.isFound == 'found' && (
					<div className={styles.controllers}>
						{videoProps.isPaused ? (
							<FaPlay
								title='Play'
								onClick={() => {
									videoRef.current.play();
									setVideoProps({
										...videoProps,
										isPaused: false,
									});
								}}
							/>
						) : (
							<FaPauseCircle
								title='Pause'
								onClick={() => {
									videoRef.current.pause();
									setVideoProps({
										...videoProps,
										isPaused: true,
									});
								}}
							/>
						)}
						{videoProps.isMuted ? (
							<VscMute
								title='Unmute'
								onClick={() => {
									videoRef.current.muted = false;
									setVideoProps({
										...videoProps,
										isMuted: false,
									});
								}}
							/>
						) : (
							<VscUnmute
								title='Mute'
								onClick={() => {
									videoRef.current.muted = true;
									setVideoProps({
										...videoProps,
										isMuted: true,
									});
								}}
							/>
						)}
					</div>
				)}

				{reasonFound.isFound == 'notfound' && (
					<p className={styles.topLabel}>
						High Level Search! Not Found
					</p>
				)}

				{reasonFound.isFound == 'found' && (
					<p className={styles.topLabel}>Woohooo!</p>
				)}

				{reasonFound.isFound == 'initial' && (
					<p className={styles.topLabel}>
						Put Something to search
					</p>
				)}

				<div className={styles.inputWrapper}>
					<input
						type='text'
						placeholder='Type a word (e.g. Thala)'
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
					<div
						className={styles.submit}
						onClick={() => handleInput(input)}
					>
						<p>Okay</p>
					</div>
				</div>
				{reasonFound.isFound == 'found' && (
					<p className={styles.msg}>
						{reasonFound.msg}
					</p>
				)}
				{reasonFound.isFound == 'found' && (
					<div className={styles.shareDiv}>
						<p className={styles.shareLabel}>
							Share with Friends
						</p>
						<div className={styles.shareButtonWrapper}>
							<FaFacebook
								onClick={() =>
									generateurl(input, 'facebook')
								}
							/>
							<FaWhatsapp
								onClick={() =>
									generateurl(input, 'whatsapp')
								}
							/>
							<FaTwitter
								onClick={() =>
									generateurl(input, 'twitter')
								}
							/>
						</div>
					</div>
				)}
				<div className={styles.credits}>
					<a href='https://www.instagram.com/_.adityyaa'>
						Aditya Singh
					</a>
				</div>
			</div>
		</div>
	);
};

export default App;
