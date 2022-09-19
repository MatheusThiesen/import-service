export default {
  key: "test",
  async handle() {
    console.log("inicio");

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve("UHuu");
      }, 10000);
    });

    console.log("fim");
  },
};
