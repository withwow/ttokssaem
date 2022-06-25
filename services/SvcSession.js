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

	getMenuList() {
		if (this._req.session.menulist != undefined) {
			return this._req.session.menulist;
		} else {
			return null;
		}
	}

	getPermission(uri) {
		let permission = {
			read: 'N',
			reg: 'N',
			upd: 'N',
			del: 'N',
			xlsd: 'N',
			xlsu: 'N',
		};

		if (this._req.session.menulist != undefined) {
			this._req.session.menulist.forEach(element => {
				if (element.uri === uri) {
					permission.read = element.btn_read;
					permission.reg = element.btn_reg;
					permission.upd = element.btn_upd;
					permission.del = element.btn_del;
					permission.xlsd = element.btn_xlsd;
					permission.xlsu = element.btn_xlsu;
				}
			});
		}
		return permission;
	}


	login(
		userid,
		username,
		auth_id,
		auth,
		level,
		menulist,
	) {
		this._req.session.userid = userid;
		this._req.session.username = username;
		this._req.session.auth_id = auth_id;
		this._req.session.auth = auth;
		this._req.session.level = level;
		this._req.session.menulist = menulist;
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
	
	getAuthId() {
		if (this._req.session.auth_id != undefined) {
			return this._req.session.auth_id;
		} else {
			return '';
		}
	}

	getAuth() {
		if (this._req.session.auth != undefined) {
			return this._req.session.auth;
		} else {
			return '';
		}
	}

	getLevel() {
		if (this._req.session.level != undefined) {
			return this._req.session.level;
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
		console.log(`auth_id : ${this.getAuthId()}`);
		console.log(`auth : ${this.getAuth()}`);
		console.log(`level : ${this.getLevel()}`);
		console.log(`ip : ${this.getIp()}`);
	}

	getUserInfo() {
		let userinfo = {};
		userinfo.userid = this.getUserId();
		userinfo.username = this.getUserName();
		userinfo.auth_id = this.getAuthId();
		userinfo.auth = this.getAuth();
		userinfo.level = this.getLevel();
		userinfo.ip = this.getIp();

		return userinfo;
	}
}

module.exports = SvcSession;
