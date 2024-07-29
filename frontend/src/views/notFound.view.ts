export async function notFoundPage() {
  console.log("Page not found");
  const response = await fetch("/notFound.component.html");
  document.body.innerHTML = await response.text();
  return;
}
