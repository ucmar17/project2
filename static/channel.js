document.addEventListener('DOMContentLoaded', () => {
	var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

	document.querySelector('button').disabled = true;

	document.querySelector('input').onkeyup = () => {
		if (document.querySelector('input').value.length > 0) {
			document.querySelector('button').disabled = false;
		} else {
			document.querySelector('button').disabled = true;
		}
	};

	document.querySelector('button').onclick = () => {
		const channel = document.querySelector('input').value;
		socket.emit('create channel', channel);
	};

	document.querySelectorAll('#channel_list a').forEach(link => {
		link.onclick = () => {
			let chatname = link.innerHTML;
		};
	});	

	socket.on('submit channel', data => {
		document.querySelector('#choose').style.visibility = 'hidden';
		let aTag = document.createElement('a');
		aTag.setAttribute('href', 'chatroom/' + data[0]);
		aTag.innerHTML = data[0] + ' - ' + data[1];
		document.querySelector('#channels_list').appendChild(aTag);
		document.querySelector('#channels_list').appendChild(document.createElement('br'));
	});

	socket.on('channel exists', () => {
		document.querySelector('#choose').style.visibility = 'visible';
	});
});