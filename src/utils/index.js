//format the default joi error
const formatError = (errors) => {
  return errors.map((error) => ({
    detail: error.message,
    field: error.path
  }));

}

export {
    formatError
}