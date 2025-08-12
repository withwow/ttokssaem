var util = require('util');

class Response {
	constructor(cmd, code, data, t) {
		this.cmd = cmd;
		this.code = code;
		this.data = data;
		this.t = t;
	}

	build() {
		var packet = {};

		packet.cmd = this.cmd;
		packet.code = this.code;
		packet.data = this.data;

		_logger.debug(
			' RESPONSE [' +
				this.code +
				'] ' +
				this.cmd +
				' (' +
				this.t.end() +
				'ms) >> ' +
				util.inspect(packet),
		);

		return packet;
	}
}

module.exports = Response;
