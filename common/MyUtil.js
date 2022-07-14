const RemoteIp = _req => {
	let ip =
		_req.headers['x-forwarded-for'] ||
		_req.connection.remoteAddress.split(`:`).pop();
	return ip;
};

module.exports.RemoteIp = RemoteIp;
