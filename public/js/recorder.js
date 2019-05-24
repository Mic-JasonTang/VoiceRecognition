// 定义 Recorder 函数，并在函数内实例化 Worker：

(function(window){
    var WORKER_PATH = '/js/recorderWorker.js'; //自己设置 recorderWorker.js 的路径

    var Recorder = function (source, cfg) {
        var config = cfg || {};
        var bufferLen = config.bufferLen || 4096;
        this.context = source.context;
        this.node = this.context.createScriptProcessor(bufferLen, 1, 1);
        var worker = new Worker(config.workerPath || WORKER_PATH);

        var recording = false;

        this.node.onaudioprocess = function (e) {
            if (!recording) return;
            worker.postMessage({
                command: 'record',
                buffer: [
                    e.inputBuffer.getChannelData(0)
                ]
            });
        }

        this.record = function () {
            recording = true;
        }

        this.stop = function () {
            recording = false;
        }
		this.clear = function () {
		        worker.postMessage({
		            command: 'clear'
		        });
		    }

		this.getBuffer = function (cb) {
			currCallback = cb || config.callback;
            // console.log("call getBuffer");
			worker.postMessage({
			    command: 'getBuffer'
			})
		}

		worker.onmessage = function (e) {
			var blob = e.data;
			currCallback(blob);
		}

		source.connect(this.node);
			this.node.connect(this.context.destination);
		};

		window.Recorder = Recorder;
})(window)