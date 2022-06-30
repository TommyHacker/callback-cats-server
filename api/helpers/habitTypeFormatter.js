// takes in a num from 1 to 6 and decides which habit is to be assigned.
exports.habitFormatter = (num) => {
  switch (num) {
    case 1:
      return "Exercise 30 min";
      break;
    case 2:
      return "Drink 8 glasses of water";
      break;
    case 3:
      return "Get 8 hours of sleep";
      break;
    case 4:
      return "Healthy meal";  
      break;
    case 5:
      return "Don't smoke";
      break;
    case 6:
      return "Walk the dog";
      break;
    default:
      return "Get good";
      break;
  }
};
