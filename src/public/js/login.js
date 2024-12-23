// escucho el formulario para loguear usuarios
const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const newLogin = {};
  data.forEach((value, key) => (newLogin[key] = value));
  //   console.log("Usuario logueado:", newLogin);

  // le pego al endpoint de creación de usuarios
  fetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify(newLogin),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 201) {
      // reseteo los campos del form para no refrescar la ventana
      form.reset();
      return result.json().then((json) => {
        Swal.fire({
          icon: "success",
          title: "User logged in",
        });
        return json;
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Login failed. Please try again",
      });
    }
  });
});