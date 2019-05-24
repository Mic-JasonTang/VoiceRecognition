
async function start() {
    labels = $.ajax({
        url: "model/class_names_min.txt",
        async: false
    }).responseText.split('\n');

    model = await tf.loadLayersModel('model/model.json')
    // const pred = model.predict(tf.zeros([1, 28, 28, 1]))
    // console.log(pred.dataSync())
}
start()

// 实例化 Recorder 并执行语音录制，为了能够正常使用浏览器的录音功能，先初始化 Web API。

window.URL = window.URL;
navigator.getUserMedia = navigator.webkitGetUserMedia;
var audioContext;
if (navigator.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
    }).then(function (localMediaStream) {
        audioContext = new AudioContext();
        var mediaStreamSource = audioContext.createMediaStreamSource(localMediaStream);
        window.MediaStreamSource = mediaStreamSource;
        var rec = new Recorder(window.MediaStreamSource);
        window.rec = rec;
        main();
    })
} else {
    Ext.Msg.alert('消息提示', '你的浏览器不支持录音');
}

// 归一化和维度扩展
function preprocess(data) {
    return tf.tidy(() => {
        //let tensor = tf.browser.fromPixels(data, numChannels = 1)
        //const resized = tf.image.resizeBilinear(tensor, [100, 1024]).toFloat()
        // console.log(data);
        voiceData = tf.tensor(data);
        voiceData = voiceData.expandDims(-1);
        console.log(voiceData);
        const normalized = voiceData.sub(tf.fill([100, 1024, 1], 128)).div(tf.scalar(128));
        const batched = normalized.expandDims(0);
        return batched;
    })
}

function main(){
	$('#result').html("点击录音测试开始测试声音，点击创建数据开始创造数据集(并自动下载为txt格式)");
    $('#record_btn').mousedown(function () {
        window.rec.record();
        setTimeout(function () {
            window.rec.stop();
            // console.log("stop");
            window.rec.getBuffer(function (buffer) {
            	// console.log("done");
                // $('#result').html('录制到声音长度为： ' + buffer.length + ' 个 buffer 大小<br>每个 buffer 大小为： ' + buffer[0].length)
                // // 替换 ↓
                // var array = new Uint8Array(buffer);
                // $('#result').html('处理后的声音长度为： ' + array.length)
                // // 替换 ↑

                // 将测试输出的部分变更为音频解码和音频播放。
                // 程序先对之前处理的 WAV PCM 音频数据进行解码，然后创建音频流 BufferSource，将解码后的音频数据填充进之后把音频流与播放接口进行连接，从而播放声音。
                audioContext.decodeAudioData(buffer).
                then(function (decodedData) {
                    var audioBufferSouceNode = audioContext.createBufferSource();

                    // 对音频进行频谱转换，只需要在音频流-播放接口之间插入 Analyser 分析器即可。当然，如果不需要播放录音只做处理，可以将 Analyser 分析器和播放接口之间的链接切断。
                    // 替换 ↓
                    var analyser = audioContext.createAnalyser();
                    audioBufferSouceNode.connect(analyser);
                    analyser.connect(audioContext.destination);// 注释掉后不会播放声音，但处理正常进行。
                     // 替换 ↑

                    // audioBufferSouceNode.connect(audioContext.destination);
                    audioBufferSouceNode.buffer = decodedData;
                    audioBufferSouceNode.start(0);

                    // 经过测试，把 1s 的数据用 100 个时间片可以完全容纳。
                    //使用 Analyser 分析器对音频数据进行分析，随着音频流数据的传递，analyser.frequencyBinCount 这个函数所返回的值也不同，因此使用 Web API 中的函数 requestAnimationFrame 对不同时刻播放的音频数据频谱化。
                    // 添加 ↓
                    var cnt = 0;
                    var fileContentArray = [];
                    var drawMeter = function () {
                        var array = new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteFrequencyData(array);
                        // fileContentArray.push(array.toString() + '\n');
                        fileContentArray.push(array);
                        cnt++;
                        if (cnt < 100) {
                            requestAnimationFrame(drawMeter);
                        } else {
                            // var file = new File(fileContentArray, "voice.txt", {
                            //     type: "text/plain;charset=utf-8"
                            // });
                            // for (var i = 0; i < fileContentArray.length; i++) {
                            //     console.log(fileContentArray[i]);
                            // }
                            // console.log(fileContentArray.length);
                            // saveAs(file);
                            const data = preprocess(fileContentArray);
                            console.log(data);
                            const pred = model.predict(data).dataSync()
                            console.log(pred);
                            var display = '您说的可能是: '

                            for(var i = 0; i < pred.length; i++){
                                if(pred[i] > 0.5){
                                    display += labels[i]
                                }
                            }

                            if(display == '您说的可能是: '){
                                display = '我也猜不出您说的是什么'
                            }
                            console.log(display);
                            $('#result').html(display + "<br> 概率:" + pred);
                        }
                    }
                    requestAnimationFrame(drawMeter);
                    // 添加 ↑

                   
                });
                window.rec.clear();
            });
            
        }, 2000);
    });
     $('#make_data').mousedown(function () {
        window.rec.record();
        setTimeout(function () {
            window.rec.stop();
            // console.log("stop");
            window.rec.getBuffer(function (buffer) {
                // console.log("done");
                // $('#result').html('录制到声音长度为： ' + buffer.length + ' 个 buffer 大小<br>每个 buffer 大小为： ' + buffer[0].length)
                // // 替换 ↓
                // var array = new Uint8Array(buffer);
                // $('#result').html('处理后的声音长度为： ' + array.length)
                // // 替换 ↑

                // 将测试输出的部分变更为音频解码和音频播放。
                // 程序先对之前处理的 WAV PCM 音频数据进行解码，然后创建音频流 BufferSource，将解码后的音频数据填充进之后把音频流与播放接口进行连接，从而播放声音。
                audioContext.decodeAudioData(buffer).
                then(function (decodedData) {
                    var audioBufferSouceNode = audioContext.createBufferSource();

                    // 对音频进行频谱转换，只需要在音频流-播放接口之间插入 Analyser 分析器即可。当然，如果不需要播放录音只做处理，可以将 Analyser 分析器和播放接口之间的链接切断。
                    // 替换 ↓
                    var analyser = audioContext.createAnalyser();
                    audioBufferSouceNode.connect(analyser);
                    analyser.connect(audioContext.destination);// 注释掉后不会播放声音，但处理正常进行。
                     // 替换 ↑

                    // audioBufferSouceNode.connect(audioContext.destination);
                    audioBufferSouceNode.buffer = decodedData;
                    audioBufferSouceNode.start(0);

                    // 经过测试，把 1s 的数据用 100 个时间片可以完全容纳。
                    //使用 Analyser 分析器对音频数据进行分析，随着音频流数据的传递，analyser.frequencyBinCount 这个函数所返回的值也不同，因此使用 Web API 中的函数 requestAnimationFrame 对不同时刻播放的音频数据频谱化。
                    // 添加 ↓
                    var cnt = 0;
                    var fileContentArray = [];
                    var drawMeter = function () {
                        var array = new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteFrequencyData(array);
                        // fileContentArray.push(array.toString() + '\n');
                        fileContentArray.push(array);
                        cnt++;
                        if (cnt < 100) {
                            requestAnimationFrame(drawMeter);
                        } else {
                            var file = new File(fileContentArray, "voice.txt", {
                                type: "text/plain;charset=utf-8"
                            });
                            saveAs(file);
                        }
                    }
                    requestAnimationFrame(drawMeter);
                    // 添加 ↑

                   
                });
                window.rec.clear();
            });
            
        }, 2000);
    });
}