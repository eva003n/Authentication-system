const options = {
  timestamps: true,
  toObject: {
    virtuals: true, //enable virtuals
    minimize: false,
  },
  minimize: false, //store empty objects
  //strict: false //allow saving of properties that were not defined in schema
  //strictQuery: false
};
export default options;
