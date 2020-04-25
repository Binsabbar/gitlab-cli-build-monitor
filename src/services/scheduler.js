let intervalId;

function loopTask(callback, intervals) {
  intervalId = setInterval(
    callback,
    intervals * 1000,
  );
}

function stopTask() {
  clearInterval(intervalId);
}

exports.loopTask = loopTask;
exports.stopTask = stopTask;
