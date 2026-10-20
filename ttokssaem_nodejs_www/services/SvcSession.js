class SvcSession {
	constructor(req) {
		this._req = req;
	}

	isLogin() {
		if (this._req.session.userid != undefined) {
			return true;
		} else {
			return false;
		}
	}

	login(userid, username, permission) {
		this._req.session.userid = userid;
		this._req.session.username = username;
		this._req.session.permission = permission;
		this._req.session.ip =
			this._req.headers['x-forwarded-for'] ||
			this._req.connection.remoteAddress.split(`:`).pop();
	}

	getIp() {
		if (this._req.session.ip != undefined) {
			return this._req.session.ip;
		} else {
			return '';
		}
	}

	getPermission() {
		if (this._req.session.permission != undefined) {
			return this._req.session.permission;
		} else {
			return '';
		}
	}

	getUserName() {
		if (this._req.session.username != undefined) {
			return this._req.session.username;
		} else {
			return '';
		}
	}

	getUserId() {
		if (this._req.session.userid != undefined) {
			return this._req.session.userid;
		} else {
			return '';
		}
	}

	logout() {
		this._req.session.destroy();
	}

	print() {
		console.log(`userid : ${this.getUserId()}`);
		console.log(`username : ${this.getUserName()}`);
		console.log(`permission : ${this.getPermission()}`);
		console.log(`ip : ${this.getIp()}`);
	}

	getUserInfo() {
		let userinfo = {};
		userinfo.userid = this.getUserId();
		userinfo.username = this.getUserName();
		userinfo.permission = this.getPermission();
		userinfo.ip = this.getIp();

		return userinfo;
	}
}

module.exports = SvcSession;
