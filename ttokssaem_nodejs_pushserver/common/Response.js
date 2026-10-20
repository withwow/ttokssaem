var util = require('util');

class Response {
	constructor(cmd, CODE, RESULT, t) {
		this.cmd = cmd;
		this.CODE = CODE;
		this.RESULT = RESULT;
		this.t = t;
	}

	build() {
		var packet = {};

		//packet.cmd = this.cmd;
		packet.CODE = this.CODE;
		packet.RESULT = this.RESULT;

		_logger.debug(
			' RESPONSE [' +
				this.CODE +
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
