export default (ref, navHeight) =>
  window.scrollTo({ top: ref.current.offsetTop - navHeight, behavior: "smooth" });
