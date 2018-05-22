var audioElement = document.getElementById('audio')
var bars = document.getElementById('bars');
console.log(document.getElementById('dataType').value)
document.getElementById('dataType').onchange = function (event) {
    if (event.target.value === 'time') {
        document.getElementById('timebars').classList.remove('hidden')
        document.getElementById('frequencybars').classList.add('hidden')
    } else {
        document.getElementById('frequencybars').classList.remove('hidden')
        document.getElementById('timebars').classList.add('hidden')
    }
}
document.getElementById('audio_file').onchange = function (event) {
    var files = this.files
    console.log(files[0])
    var file = URL.createObjectURL(files[0])
    audioElement.src = file
    audioElement.play()
    var context = new AudioContext()
    var audioSource = context.createMediaElementSource(audioElement);
    var analyser = context.createAnalyser();
    audioSource.connect(analyser)
    analyser.fftSize = 128;
    var frequencyData = new Uint8Array(analyser.frequencyBinCount)
    var timeData = new Uint8Array(analyser.fftSize)
    analyser.getByteFrequencyData(frequencyData)
    analyser.getByteTimeDomainData(timeData)
    analyser.connect(context.destination)
    var barWidthPercent = 100 / analyser.frequencyBinCount
    for (var i = 0; i < analyser.frequencyBinCount; i++) {
        $('<div/>').css({ 'left': i * barWidthPercent + '%', 'color': 'green' }).appendTo($('#frequencybars'))
    }
    barWidthPercent = 100 / analyser.fftSize;
    for (var i = 0; i < analyser.fftSize; i++) {
        $('<div/>').css({ 'left': i * barWidthPercent + '%' }).appendTo($('#timebars'))
    }
    console.log('AudioSource =', audioSource, 'timeData', timeData, 'frequencyData =', frequencyData, 'Analyser =', analyser)
    function animateTime() {
        requestAnimationFrame(animateTime)
        analyser.getByteTimeDomainData(timeData)
        $('#timebars').children().each((index, bar) => {
            bar.style.height = timeData[index] + 'px'
        })
    }
    animateTime();
    function animateFrequency() {
        requestAnimationFrame(animateFrequency)
        analyser.getByteFrequencyData(frequencyData)
        $('#frequencybars').children().each((index, bar) => {
            bar.style.height = frequencyData[index] + 'px'
        })
    }
    animateFrequency();
}