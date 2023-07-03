const shareButton = document.querySelector(".share-button");
const shareDialog = document.querySelector(".share-dialog");
const closeButton = document.querySelector(".close-button");

shareButton.addEventListener("click", (event) => {
  if (navigator.share) {
    navigator
      .share({
        title: "Bobby the Lamp",
        url: "https://flow.page/bobbythelamp",
      })
      .then(() => {
        console.log("Thanks for sharing!");
      })
      .catch(console.error);
  } else {
    shareDialog.classList.add("is-open");
  }
});

closeButton.addEventListener("click", (event) => {
  shareDialog.classList.remove("is-open");
});
