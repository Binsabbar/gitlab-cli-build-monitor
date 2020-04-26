let intervalId;

function loopTask(funcToLoop, args, intervals) {
  return new Promise((resolve, reject) => {
    intervalId = setInterval(() => {
      funcToLoop(args)
        .then(resolve)
        .catch(reject);
    }, intervals * 1000);
  });
}

function stopTask() {
  clearInterval(intervalId);
}

exports.loopTask = loopTask;
exports.stopTask = stopTask;
