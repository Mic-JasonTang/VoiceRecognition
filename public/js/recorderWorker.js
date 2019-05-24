// 存储声音的变量
var recLength = 0,
    recBuffers = []

// 给 Worker 设置指令监听，设置 3 种监听命令，分别是：记录声音数据、获取 WAV 格式 PCM 音频数据和清空数据。
this.onmessage = function (e) {
    switch (e.data.command) {
        case 'record':
            record(e.data.buffer);
            break;
        case 'getBuffer':
            getBuffer();
            break;
        case 'clear':
            clear();
            break;
    }
};

// 定义 record 函数，该函数会持续存储原始声音数据。函数在接收到 record 指令时执行，传入参数为原始声音片段数组。
function record(inputBuffer) {
    recBuffers.push(inputBuffer[0]);
    recLength += inputBuffer[0].length;
}
// 定义 getBuffer 函数，该函数会返回存储的音频数据。函数在收到 getBuffer 指令时执行。
function getBuffer() {
    // console.log("call worker: getBuffer");
    // 为了测试录音的情况，先直接输出原始音频数据。
    // this.postMessage(recBuffers);

    // 原始的数据集并不能直接进行识别，需要对其进行混合、采样、WAV PCM 编码和频谱转换的过程。在这一步中，我们将尝试实现从混合到 WAV PCM 编码这一系列过程。
    var buffer = mergeBuffers(recBuffers, recLength);
    var interleaved = interleave(buffer);
    var dataview = encodeWAV(interleaved);
    this.postMessage(dataview.buffer);
}

// 先从混合音频数据开始，当前 recBuffers 中存储的是多个大小为 bufferSize 的 Float32 数组。而在采样时需要将其转变为一个数组，因此混合就是将这些数据合并到一个数组中的过程。而且通常声音是双声道，需要在声音处理时混合处理。
function mergeBuffers(recBuffers, recLength) {
    var result = new Float32Array(recLength);
    var offset = 0;
    for (var i = 0; i < recBuffers.length; i++) {
        result.set(recBuffers[i], offset);
        offset += recBuffers[i].length;
    }
    return result;
}
// 在使用音频的时候通常并不会直接使用原始数据，通常采样频率为 11025Hz 就可以分辨出人说话的声音，因此采样函数就是对声音进行采样。
function interleave(inputL) { //修改采样率时 , 要做如下修改
    var compression = 44100 / 11025; //计算压缩率
    var length = inputL.length / compression;
    var result = new Float32Array(length);
    var index = 0,
        inputIndex = 0;
    while (index < length) {
        result[index] = inputL[inputIndex];
        inputIndex += compression; //每次都跳过3个数据
        index++;
    }
    return result;
}

// 对声音进行 8 位 WAV PCM 编码，使其能够直接导出成 WAV 格式的音频文件或者能够被 HTML Audio API 所识别从而播放出来。
function writeString(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function floatTo8BitPCM(output, offset, input) {
    for (var i = 0; i < input.length; i++, offset++) { //这里只能加1了
        var s = Math.max(-1, Math.min(1, input[i]));
        var val = s < 0 ? s * 0x8000 : s * 0x7FFF;
        val = parseInt(255 / (65535 / (val + 32768))); //这里有一个转换的代码,这个是我个人猜测的,就是按比例转换
        output.setInt8(offset, val, true);
    }
}
function encodeWAV(samples) {
    var dataLength = samples.length;
    var buffer = new ArrayBuffer(44 + dataLength);
    var view = new DataView(buffer);
    var sampleRateTmp = 11205; //写入新的采样率
    var sampleBits = 8;
    var channelCount = 1;
    var offset = 0;
    /* 资源交换文件标识符 */
    writeString(view, offset, 'RIFF');
    offset += 4;
    /* 下个地址开始到文件尾总字节数,即文件大小-8 */
    view.setUint32(offset, /*32*/ 36 + dataLength, true);
    offset += 4;
    /* WAV文件标志 */
    writeString(view, offset, 'WAVE');
    offset += 4;
    /* 波形格式标志 */
    writeString(view, offset, 'fmt ');
    offset += 4;
    /* 过滤字节,一般为 0x10 = 16 */
    view.setUint32(offset, 16, true);
    offset += 4;
    /* 格式类别 (PCM形式采样数据) */
    view.setUint16(offset, 1, true);
    offset += 2;
    /* 通道数 */
    view.setUint16(offset, channelCount, true);
    offset += 2;
    /* 采样率,每秒样本数,表示每个通道的播放速度 */
    view.setUint32(offset, sampleRateTmp, true);
    offset += 4;
    /* 波形数据传输率 (每秒平均字节数) 通道数×每秒数据位数×每样本数据位/8 */
    view.setUint32(offset, sampleRateTmp * channelCount * (sampleBits / 8), true);
    offset += 4;
    /* 快数据调整数 采样一次占用字节数 通道数×每样本的数据位数/8 */
    view.setUint16(offset, channelCount * (sampleBits / 8), true);
    offset += 2;
    /* 每样本数据位数 */
    view.setUint16(offset, sampleBits, true);
    offset += 2;
    /* 数据标识符 */
    writeString(view, offset, 'data');
    offset += 4;
    /* 采样数据总数,即数据总大小-44 */
    view.setUint32(offset, dataLength, true);
    offset += 4;
    /* 采样数据 */
    floatTo8BitPCM(view, 44, samples);
    return view;
}


// 定义 clear 函数，该函数会清空存储的音频数据。函数在接收到 clear 指令时执行。
function clear() {
    recLength = 0;
    recBuffers = [];
}

