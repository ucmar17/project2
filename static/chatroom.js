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
		let text = document.querySelector('input').value;
		document.querySelector('input').value = '';
		socket.emit('send text', text);
	};

	socket.on('text msg', data => {
		let user = data.user, msg = data.text, stamp = data.time;
		let p_text = document.createElement('p');
		p_text.innerHTML = '<p><strong>' + user + '</strong>: ' + msg + '</p>';

		let p_time = document.createElement('p');
		p_time.setAttribute('class', 'time');
		if(stamp[4] < 10){
			p_time.innerHTML = stamp[0] + '-' + stamp[1] + '-' + stamp[2] + ' ' + stamp[3] + ':0' + stamp[4];
		} else {
			p_time.innerHTML = stamp[0] + '-' + stamp[1] + '-' + stamp[2] + ' ' + stamp[3] + ':' + stamp[4];
		}

		document.querySelector('#messages').appendChild(p_text);
		document.querySelector('#messages').appendChild(p_time);
	});
});