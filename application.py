import os
import requests

from flask import Flask, jsonify, render_template, request, session, jsonify, redirect, url_for
from flask_socketio import SocketIO, emit
from flask_session import Session
from time import time, localtime

class Message():
	def __init__(self, m, u):
		self.msg = m
		self.user = u
		self.time = localtime(time())

app = Flask(__name__)

app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = False
Session(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
socketio = SocketIO(app)

channel_list, names = dict(), set()
messages = dict()

@app.route('/channels', methods=['GET', 'POST'])
def channels():
	if request.method == 'POST':
		username = request.form.get('name')
		session['username'] = username
		names.add(username)
	return render_template('channels.html', username=session['username'], channels=channel_list)

@app.route('/')
def index():
	if 'username' in session:
		if 'user_chat' in session:
			return redirect(url_for('chatroom', identi=session['user_chat']))
		return redirect(url_for('channels'))
	return render_template('index.html')

@app.route('/chatroom/<int:identi>')
def chatroom(identi):
	session['user_chat'] = identi
	return render_template('chatroom.html', name=channel_list[identi], msgs=messages[identi])

@app.route('/logout')
def logout():
	if 'user_chat' in session:
		session.pop('user_chat')
	if 'username' in session:
		names.remove(session['username'])
		session.pop('username')
	return redirect(url_for('index'))

@socketio.on('create channel')
def create(name):
	if name not in channel_list.values():
		index = len(channel_list)
		channel_list[index] = name
		messages[index] = []
		emit('submit channel', [index, name], broadcast=True)
	else:
		emit('channel exists')

@socketio.on('send text')
def send(text):
	m = Message(text, session['username'])
	messages[session['user_chat']].append(m)
	if len(messages[session['user_chat']]) > 100:
		del messages[session['user_chat']][0]
	emit('text msg', {'text': m.msg, 'time': m.time, 'user': m.user}, broadcast=True)






