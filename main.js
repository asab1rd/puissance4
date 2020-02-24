$(document).ready(function() {
  console.log("ready");
});

const createGame = (numRow, numCol) => {
  let arr = new Array(numRow);
  for (let i = 0; i < numRow; i++) {
    arr[i] = new Array(numCol);
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = null;
    }
  }
  return arr;
};

const isCaseEmpty = (arr, index) => {
  return arr[index] === null;
};
