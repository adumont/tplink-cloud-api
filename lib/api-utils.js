module.exports = class APIUtils {
  static checkError(response) {
    if (response && response.data && response.data.error_code !== 0) {
      throw new Error(
        `response error: ${response.data.msg || response.data.error_code}`
      );
    }
  }
};
